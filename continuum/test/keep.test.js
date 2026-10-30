import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { openDb, seedContent } from '../db.js';
import { createApp } from '../app.js';
import { createTalk } from '../talk.js';
import * as content from '../content/index.js';

// Highlights (kept words), the question asked back after a note, and the home-screen manifest.
let server, base; const asked = [];
before(async () => {
  const db = openDb(':memory:');
  seedContent(db, content);
  db.prepare('INSERT INTO users (token, name) VALUES (?, ?)').run('k', 'Keeper');
  const talk = createTalk({ client: { beta: { messages: {
    create: async (req) => {
      if (req.output_config?.format) return { stop_reason: 'end_turn', content: [{ type: 'text', text: '{"views":[]}' }] };
      asked.push(req.messages[0].content);
      return { stop_reason: 'end_turn', content: [{ type: 'text', text: 'When did you last choose comfort over truth?' }] };
    },
  } } } });
  server = createApp(db, { talk }).listen(0);
  await new Promise((r) => server.once('listening', r));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => server.close());
const call = (path, { method = 'GET', body } = {}) => fetch(base + path, { method, headers: { 'x-continuum-token': 'k', 'content-type': 'application/json' }, body: body && JSON.stringify(body) })
  .then(async (r) => ({ status: r.status, json: await r.json().catch(() => null) }));

test('chosen words are kept once, shown in the Diary, and can be removed', async () => {
  const id = (await call('/api/today?date=2026-11-01')).json.node.id;
  const a = await call('/api/highlight', { method: 'POST', body: { node_id: id, text: '  some   chosen words ' } });
  const b = await call('/api/highlight', { method: 'POST', body: { node_id: id, text: 'some chosen words' } });
  assert.equal(a.json.id, b.json.id);
  assert.equal((await call('/api/highlight', { method: 'POST', body: { node_id: 'nope', text: 'x y' } })).status, 404);
  assert.equal((await call('/api/highlight', { method: 'POST', body: { node_id: id, text: '' } })).status, 400);
  const d = (await call('/api/diary?date=2026-11-01')).json;
  const e = d.entries.find((x) => x.kind === 'highlight');
  assert.equal(e.body, 'some chosen words');
  assert.equal(d.counts.kept, 1);
  await call(`/api/highlight/${e.hid}`, { method: 'DELETE' });
  assert.equal((await call('/api/diary?date=2026-11-01')).json.entries.filter((x) => x.kind === 'highlight').length, 0);
});

test('a note brings one question back, and the answer is added to the note', async () => {
  const id = (await call('/api/today?date=2026-11-01')).json.node.id;
  assert.equal((await call('/api/note/question', { method: 'POST', body: { node_id: id } })).status, 404); // no note yet
  await call('/api/note', { method: 'POST', body: { node_id: id, body: 'I think I avoid hard truths.', date: '2026-11-01' } });
  const q = (await call('/api/note/question', { method: 'POST', body: { node_id: id } })).json;
  assert.equal(q.question, 'When did you last choose comfort over truth?');
  assert.match(asked.at(-1), /I think I avoid hard truths/);
  const r = (await call('/api/note/reply', { method: 'POST', body: { node_id: id, question: q.question, reply: 'Yesterday, with my brother.', date: '2026-11-01' } })).json;
  assert.equal(r.note, 'I think I avoid hard truths.\n\nContinuum asked: When did you last choose comfort over truth?\nI said: Yesterday, with my brother.');
  assert.equal((await call('/api/note/reply', { method: 'POST', body: { node_id: id, question: 'q', reply: ' ' } })).status, 400);
});

test('the home-screen manifest opens the personal link', async () => {
  const m = await fetch(`${base}/manifest.webmanifest?u=abcDEF123_-x`).then((r) => r.json());
  assert.equal(m.start_url, '/?u=abcDEF123_-x');
  assert.equal((await fetch(`${base}/manifest.webmanifest?u=<bad>`).then((r) => r.json())).start_url, '/');
});
