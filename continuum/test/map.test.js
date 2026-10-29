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

test('the Map places every idea two ways and keeps daily cards to come unnamed', async () => {
  const m = await get('/api/map?date=2026-01-05');
  const ideas = content.nodes.filter((n) => n.type !== 'practice');
  assert.equal(m.nodes.length, ideas.length);
  for (const n of m.nodes) for (const k of ['influence', 'semantic']) {
    assert.ok(Array.isArray(n[k]) && n[k].every((v) => v >= 0 && v <= 1), `${n.id} ${k}`);
  }
  const upcoming = m.nodes.filter((n) => n.state === 'upcoming');
  assert.ok(upcoming.length > 0);
  for (const n of upcoming) assert.ok(n.title == null && n.thinker == null && n.line == null && n.year == null, n.id);
  assert.ok(m.nodes.some((n) => n.state === 'today' && n.title));
  assert.ok(m.edges.length > 100 && m.eras.length === 6);
  assert.deepEqual(m.road, []);
});

test('the Map draws the road walked and marks fuzzy reviews', async () => {
  const first = content.nodes.find((n) => n.seq === 1);
  await fetch(base + '/api/respond', { method: 'POST', headers: { 'x-continuum-token': 'mapper', 'content-type': 'application/json' },
    body: JSON.stringify({ node_id: first.id, body: 'my take', date: '2026-01-05' }) });
  await fetch(base + '/api/recall', { method: 'POST', headers: { 'x-continuum-token': 'mapper', 'content-type': 'application/json' },
    body: JSON.stringify({ node_id: first.id, result: 'fuzzy', date: '2026-01-06' }) });
  const m = await get('/api/map?date=2026-01-06');
  assert.deepEqual(m.road, [first.id]);
  assert.equal(m.nodes.find((n) => n.id === first.id).fuzzy, true);
});
