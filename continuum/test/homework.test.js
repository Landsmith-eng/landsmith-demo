import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { openDb, seedContent } from '../db.js';
import { createApp } from '../app.js';
import { createTalk } from '../talk.js';
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
const call = (path, body) => fetch(base + path, { method: body ? 'POST' : 'GET', headers: { 'x-continuum-token': 'hw', 'content-type': 'application/json' }, body: body && JSON.stringify(body) })
  .then(async (r) => ({ status: r.status, json: await r.json() }));

test('a homework sheet is written once, kept, and holds back later daily cards', async () => {
  const walkOnly = content.nodes.find((n) => n.seq == null && n.type !== 'practice');
  const a = await call(`/api/homework/${walkOnly.id}?date=2026-01-05`);
  assert.equal(a.status, 200); assert.deepEqual(a.json.sheet, SHEET);
  await call(`/api/homework/${walkOnly.id}?date=2026-01-05`);
  assert.equal(calls.length, 1, 'kept after the first writing');
  assert.equal(calls[0].output_config.format.type, 'json_schema');
  // The idea's context lists none of the daily cards among its links.
  const daily = new Set(content.nodes.filter((n) => n.seq != null).map((n) => n.id));
  const ctx = JSON.parse(calls[0].messages[0].content.split('\n\n').slice(1).join('\n\n'));
  assert.ok(ctx.links.every((l) => !daily.has(l.id)));
  const later = content.nodes.find((n) => n.seq === 9);
  assert.equal((await call(`/api/homework/${later.id}?date=2026-01-05`)).status, 404);
});

test('homework answers are saved per part and come back', async () => {
  const walkOnly = content.nodes.find((n) => n.seq == null && n.type !== 'practice');
  assert.equal((await call(`/api/homework/${walkOnly.id}`, { part: 'essay', body: 'My essay', date: '2026-01-05' })).status, 200);
  assert.equal((await call(`/api/homework/${walkOnly.id}`, { part: 'nonsense', body: 'x', date: '2026-01-05' })).status, 400);
  const r = await call(`/api/homework/${walkOnly.id}?date=2026-01-05`);
  assert.equal(r.json.answers.essay, 'My essay');
});
