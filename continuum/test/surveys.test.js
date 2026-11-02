import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { openDb, seedContent } from '../db.js';
import { createApp } from '../app.js';
import { createTalk } from '../talk.js';
import * as content from '../content/index.js';
import { SURVEYS } from '../public/surveys.js';
import { SCHOOLS } from '../content/schools.js';

// The psychology room's surveys: scored as published, kept, lent to Talk; and the schools of psychology.
let server, base; const systems = [];
before(async () => {
  const db = openDb(':memory:');
  seedContent(db, content);
  db.prepare('INSERT INTO users (token, name) VALUES (?, ?)').run('s', 'Surveyed');
  const talk = createTalk({ client: { beta: { messages: {
    create: async () => ({ stop_reason: 'end_turn', content: [{ type: 'text', text: '{"views":[]}' }] }),
    stream: (req) => { systems.push(req.system); const fns = []; return { on: (e, f) => { if (e === 'text') fns.push(f); }, finalMessage: async () => ({ stop_reason: 'end_turn', content: [{ type: 'text', text: 'ok' }] }) }; },
  } } } });
  server = createApp(db, { talk }).listen(0);
  await new Promise((r) => server.once('listening', r));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => server.close());
const call = (path, { method = 'GET', body } = {}) => fetch(base + path, { method, headers: { 'x-continuum-token': 's', 'content-type': 'application/json' }, body: body && JSON.stringify(body) })
  .then(async (r) => ({ status: r.status, json: await r.json().catch(() => null) }));

test('every survey scores a full set of answers, and its schools and practices exist', () => {
  const ids = new Set(content.nodes.map((n) => n.id)); const schools = new Set(SCHOOLS.map((x) => x.id));
  for (const s of SURVEYS) {
    const answers = Object.fromEntries(s.items.map((it) => [it[0], (it[2] ?? s.options).at(-1)[1]]));
    const r = s.score(answers);
    assert.ok(r.summary, s.id);
    for (const id of r.schools) assert.ok(schools.has(id), `${s.id}: school ${id}`);
    for (const id of [...r.practices, ...r.ideas]) assert.ok(ids.has(id), `${s.id}: ${id}`);
  }
});

test('PHQ-9 is scored as published, and question 9 raises the crisis flag', async () => {
  const answers = { q1: 2, q2: 2, q3: 1, q4: 2, q5: 1, q6: 2, q7: 1, q8: 0, q9: 1 };
  const r = (await call('/api/surveys/mood', { method: 'POST', body: { answers, date: '2026-11-02' } })).json.result;
  assert.equal(r.total, 12); assert.equal(r.band, 'moderate'); assert.equal(r.crisis, true);
  assert.equal((await call('/api/surveys/mood', { method: 'POST', body: { answers: { q1: 1 } } })).status, 400);
  assert.equal((await call('/api/surveys/mood', { method: 'POST', body: { answers: { ...answers, q9: 7 } } })).status, 400);
  const w = (await call('/api/surveys/wellbeing', { method: 'POST', body: { answers: { q1: 3, q2: 3, q3: 2, q4: 2, q5: 3 }, date: '2026-11-02' } })).json.result;
  assert.equal(w.total, 52);
  const mine = (await call('/api/surveys')).json.results;
  assert.deepEqual(mine.map((x) => x.survey), ['wellbeing', 'mood']);
});

test('Talk sees the latest surveys, as screenings', async () => {
  await fetch(`${base}/api/talk`, { method: 'POST', headers: { 'x-continuum-token': 's', 'content-type': 'application/json' }, body: JSON.stringify({ text: 'Hello there', date: '2026-11-03' }) }).then((r) => r.text());
  const block = systems.at(-1)[2].text;
  assert.match(block, /Mood \(PHQ-9, a screening, not a diagnosis\): 12 of 27: moderate/);
  assert.match(block, /self-harm/);
});

test('the schools of psychology, with their ideas and practices to link', async () => {
  const r = (await call('/api/schools?date=2026-11-02')).json;
  assert.ok(r.schools.length >= 14);
  const cbt = r.schools.find((x) => x.id === 'cbt');
  assert.ok(cbt.sees && cbt.helps && cbt.asks);
  for (const id of cbt.practices) assert.ok(r.refs[id], id);
});
