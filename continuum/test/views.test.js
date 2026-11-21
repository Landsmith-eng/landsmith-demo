import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { openDb, seedContent } from '../db.js';
import { createApp } from '../app.js';
import { createTalk } from '../talk.js';
import * as content from '../content/index.js';

// A stand-in for Claude: notes one view from anything said, and replies briefly in Talk.
let server, base; const systems = [];
before(async () => {
  const db = openDb(':memory:');
  seedContent(db, content);
  db.prepare('INSERT INTO users (token, name) VALUES (?, ?)').run('v', 'Viewer');
  const talk = createTalk({ client: { beta: { messages: {
    create: async (req) => (req.output_config?.format?.schema?.properties?.views
      ? { stop_reason: 'end_turn', content: [{ type: 'text', text: JSON.stringify({ views: [{ kind: 'view', topic: 'keeping promises', text: 'Thinks a promise binds even when it costs.', ideas: ['kant_ends_not_means', 'not_a_real_id'] }] }) }] }
      : { stop_reason: 'end_turn', content: [{ type: 'text', text: 'x' }] }),
    stream: (req) => { systems.push(req.system); const fns = []; return { on: (e, f) => { if (e === 'text') fns.push(f); }, finalMessage: async () => { fns.forEach((f) => f('Why?')); return { stop_reason: 'end_turn', content: [{ type: 'text', text: 'Why?' }] }; } }; },
  } } } });
  server = createApp(db, { talk }).listen(0);
  await new Promise((r) => server.once('listening', r));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => server.close());
const call = (path, { method = 'GET', body } = {}) => fetch(base + path, { method, headers: { 'x-continuum-token': 'v', 'content-type': 'application/json' }, body: body && JSON.stringify(body) })
  .then(async (r) => ({ status: r.status, json: await r.json().catch(() => null), text: '' }));
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

test('what is said in Talk is noted as a dated view, steers the next daily idea, and comes back in Talk', async () => {
  const first = (await call('/api/today?date=2026-11-01')).json.node.id;
  await call('/api/respond', { method: 'POST', body: { node_id: first, body: 'Short.', date: '2026-11-01' } }); // too short to note
  await fetch(`${base}/api/talk`, { method: 'POST', headers: { 'x-continuum-token': 'v', 'content-type': 'application/json' },
    body: JSON.stringify({ text: 'My friend thinks you can break a promise if it costs too much. I disagree.', mode: 'settle', date: '2026-11-01' }) }).then((r) => r.text());
  await wait(50);
  const d = (await call('/api/diary?date=2026-11-01')).json;
  assert.equal(d.views.length, 1);
  assert.equal(d.views[0].topic, 'keeping promises');
  assert.equal(d.views[0].date, '2026-11-01');
  assert.equal(d.experience.stage, 'beginning');
  // The next day's card bears on what they talked about (only real ids are kept).
  const next = (await call('/api/today?date=2026-11-02')).json.node;
  assert.equal(next.id, 'kant_ends_not_means');
  assert.match(next.why, /keeping promises/);
  // Talk now sees the view, with its date, and their experience.
  await fetch(`${base}/api/talk`, { method: 'POST', headers: { 'x-continuum-token': 'v', 'content-type': 'application/json' },
    body: JSON.stringify({ text: 'Is it ever right to lie?', date: '2026-11-02' }) }).then((r) => r.text());
  const third = systems.at(-1)[2].text;
  assert.match(third, /2026-11-01 \| view: keeping promises \| Thinks a promise binds/);
  assert.match(third, /Their experience: \d+ ideas written on/);
});

test('a noted view can be removed', async () => {
  const d = (await call('/api/diary?date=2026-11-02')).json;
  for (const v of d.views) await call(`/api/views/${v.id}`, { method: 'DELETE' });
  assert.equal((await call('/api/diary?date=2026-11-02')).json.views.length, 0);
});
