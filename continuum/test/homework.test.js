import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { openDb, seedContent } from '../db.js';
import { createApp } from '../app.js';
import { createTalk, HOMEWORK_SCHEMA } from '../talk.js';
import * as content from '../content/index.js';

const SHEET = { key_terms: [{ term: 'T', meaning: 'M' }], close_reading: [{ question: 'Q', model_answer: 'A' }],
  argument: { premises: ['P1', 'P2'], conclusion: 'C' }, objection: { objection: 'O', from: 'X', model_reply: 'R' },
  apply: { situation: 'S', question: 'Q2', model_answer: 'A2' }, essay: 'E?' };
let server, base, calls = [];
before(async () => {
  const db = openDb(':memory:');
  seedContent(db, content);
  db.prepare('INSERT INTO users (token, name) VALUES (?, ?)').run('hw', 'Student');
  const talk = createTalk({ client: { beta: { messages: { create: async (req) => { calls.push(req); return { stop_reason: 'end_turn', content: [{ type: 'text', text: JSON.stringify(SHEET) }] }; } } } } });
  server = createApp(db, { talk }).listen(0);
  await new Promise((r) => server.once('listening', r));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => server.close());
// Only the homework writer's calls (Talk also notes views in the background after a daily answer).
const sheetCalls = () => calls.filter((c) => c.output_config?.format?.schema === HOMEWORK_SCHEMA);
const call = (path, body) => fetch(base + path, { method: body ? 'POST' : 'GET', headers: { 'x-continuum-token': 'hw', 'content-type': 'application/json' }, body: body && JSON.stringify(body) })
  .then(async (r) => ({ status: r.status, json: await r.json() }));

const D = '2026-01-05';
let walkOnly; // an idea that is not today's card, so it is open to read

test('a homework sheet is written once, kept, links every neighbour, and is closed for today\'s unwritten card', async () => {
  const today = (await call(`/api/today?date=${D}`)).json.node.id;
  walkOnly = content.nodes.find((n) => n.seq == null && n.type !== 'practice' && n.id !== today);
  const a = await call(`/api/homework/${walkOnly.id}?date=${D}`);
  assert.equal(a.status, 200); assert.deepEqual(a.json.sheet, SHEET);
  await call(`/api/homework/${walkOnly.id}?date=${D}`);
  assert.equal(sheetCalls().length, 1, 'kept after the first writing');
  assert.equal(sheetCalls()[0].output_config.format.type, 'json_schema');
  // The sheet is kept for everyone, so its context holds nothing back: every linked idea is listed.
  const ctx = JSON.parse(sheetCalls()[0].messages[0].content.split('\n\n').slice(1).join('\n\n'));
  const linked = new Set(content.edges.flatMap((e) => (e.from === walkOnly.id ? [e.to] : e.to === walkOnly.id ? [e.from] : [])));
  assert.deepEqual(new Set(ctx.links.map((l) => l.id)), linked);
  // A card with its own illustration that is not today's card is open too.
  const daily = content.nodes.find((n) => n.seq != null && n.id !== today);
  assert.equal((await call(`/api/homework/${daily.id}?date=${D}`)).status, 200);
  // Today's own card stays closed until it is written: no sheet, and no answers saved against it.
  assert.equal((await call(`/api/homework/${today}?date=${D}`)).status, 404);
  assert.equal((await call(`/api/homework/${today}`, { part: 'essay', body: 'x', date: D })).status, 404);
  assert.equal((await call('/api/respond', { node_id: today, body: 'my take', date: D })).status, 200);
  const opened = await call(`/api/homework/${today}?date=${D}`);
  assert.equal(opened.status, 200); assert.deepEqual(opened.json.sheet, SHEET);
  assert.equal(sheetCalls().length, 3);
});

test('homework answers are saved per part and come back', async () => {
  assert.equal((await call(`/api/homework/${walkOnly.id}`, { part: 'essay', body: 'My essay', date: '2026-01-05' })).status, 200);
  assert.equal((await call(`/api/homework/${walkOnly.id}`, { part: 'nonsense', body: 'x', date: '2026-01-05' })).status, 400);
  const r = await call(`/api/homework/${walkOnly.id}?date=2026-01-05`);
  assert.equal(r.json.answers.essay, 'My essay');
});
