import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { openDb, seedContent } from '../db.js';
import { createApp } from '../app.js';
import * as content from '../content/index.js';

let server, base, db;
before(async () => {
  db = openDb(':memory:');
  seedContent(db, content);
  db.prepare('INSERT INTO users (token, name) VALUES (?, ?)').run('mapper', 'Mapper');
  server = createApp(db, {}).listen(0);
  await new Promise((r) => server.once('listening', r));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => server.close());
const get = (path) => fetch(base + path, { headers: { 'x-continuum-token': 'mapper' } }).then((r) => r.json());

const post = (path, body) => fetch(base + path, { method: 'POST', headers: { 'x-continuum-token': 'mapper', 'content-type': 'application/json' },
  body: JSON.stringify(body) }).then((r) => r.json());

test('the Map places every idea two ways and names every idea, today\'s card included', async () => {
  const m = await get('/api/map?date=2026-01-05');
  const ideas = content.nodes.filter((n) => n.type !== 'practice');
  assert.equal(m.nodes.length, ideas.length);
  for (const n of m.nodes) for (const k of ['influence', 'semantic']) {
    assert.ok(Array.isArray(n[k]) && n[k].every((v) => v >= 0 && v <= 1), `${n.id} ${k}`);
  }
  // Nothing is held back as "upcoming" any more: every idea, daily-illustrated or not, is named and placed in time.
  assert.ok(m.nodes.every((n) => ['today', 'unseen'].includes(n.state)), 'a new user has written and visited nothing');
  for (const n of m.nodes) assert.ok(n.title && n.thinker != null && n.year != null && n.era, n.id);
  const today = m.nodes.filter((n) => n.state === 'today');
  assert.equal(today.length, 1);
  assert.equal(today[0].id, (await get('/api/today?date=2026-01-05')).node.id);
  assert.ok(m.edges.length > 100 && m.eras.length === 6);
  assert.deepEqual(m.road, []);
});

test('the Map draws the road walked and marks fuzzy reviews', async () => {
  const first = (await get('/api/today?date=2026-01-05')).node.id;
  await post('/api/respond', { node_id: first, body: 'my take', date: '2026-01-05' });
  await post('/api/recall', { node_id: first, result: 'fuzzy', date: '2026-01-06' });
  const m = await get('/api/map?date=2026-01-06');
  assert.deepEqual(m.road, [first]);
  const node = m.nodes.find((n) => n.id === first);
  assert.equal(node.fuzzy, true);
  assert.equal(node.state, 'written');
});

test('a journey started on the Map sets the next daily ideas, one stop a day, and shows on the Map', async () => {
  db.prepare('INSERT INTO users (token, name) VALUES (?, ?)').run('trailer', 'Trailer');
  const call = (path, body) => fetch(base + path, { method: body ? 'POST' : 'GET', headers: { 'x-continuum-token': 'trailer', 'content-type': 'application/json' }, body: body && JSON.stringify(body) }).then((r) => r.json().then((j) => ({ status: r.status, json: j })));
  const today = (await call('/api/today?date=2026-03-01')).json.node.id;
  const stops = ['plato_ring_of_gyges', 'kant_ends_not_means', 'camus_myth_of_sisyphus'].filter((id) => id !== today);
  // Today's unwritten card is never taken into a journey.
  assert.equal((await call('/api/trail', { from_id: 'epictetus_up_to_us', ids: [today], date: '2026-03-01' })).status, 400);
  assert.equal((await call('/api/trail', { from_id: 'epictetus_up_to_us', ids: stops, date: '2026-03-01' })).status, 200);
  let t = (await call('/api/today?date=2026-03-01')).json.node;
  assert.equal(t.id, stops[0]); assert.match(t.why, /journey you started/);
  await call('/api/respond', { node_id: t.id, body: 'my take', date: '2026-03-01' });
  t = (await call('/api/today?date=2026-03-02')).json.node;
  assert.equal(t.id, stops[1]); assert.match(t.why, /stop 2 of/);
  assert.deepEqual((await call('/api/map?date=2026-03-02')).json.trail.ids, stops);
});
