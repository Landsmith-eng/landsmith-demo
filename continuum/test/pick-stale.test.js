import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openDb, seedContent } from '../db.js';
import { createApp } from '../app.js';
import * as content from '../content/index.js';

// Reproduces a tester moving the test date back and forth: day 3's card gets chosen while day 2 is still open,
// then the same card is written on day 2. Returning to day 3 must give the next card, not a failed save.
test('a remembered daily pick that was since written on another day is replaced, not re-served', async () => {
  const db = openDb(':memory:');
  seedContent(db, content);
  db.prepare('INSERT INTO users (token, name) VALUES (?, ?)').run('t', 'T');
  const server = createApp(db, {}).listen(0);
  await new Promise((r) => server.once('listening', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = (path, body) => fetch(base + path, {
    method: body ? 'POST' : 'GET', headers: { 'x-continuum-token': 't', 'content-type': 'application/json' }, body: body && JSON.stringify(body),
  }).then(async (r) => ({ status: r.status, json: await r.json() }));
  try {
    const d1 = (await call('/api/today?date=2026-10-27')).json.node.id;
    assert.equal((await call('/api/respond', { node_id: d1, body: 'day 1', date: '2026-10-27' })).status, 200);
    // Jump to day 3 first: its card is picked for 10-29 and remembered.
    const ahead = (await call('/api/today?date=2026-10-29')).json.node.id;
    assert.equal((await call('/api/today?date=2026-10-29')).json.node.id, ahead);
    // Back to day 2: with nothing new to go on, the same card is picked there too, and written there.
    assert.equal((await call('/api/today?date=2026-10-28')).json.node.id, ahead);
    assert.equal((await call('/api/respond', { node_id: ahead, body: 'day 2', date: '2026-10-28' })).status, 200);
    // Day 3 again: a fresh card, and it saves.
    const day3 = await call('/api/today?date=2026-10-29');
    assert.equal(day3.json.state, 'write');
    assert.notEqual(day3.json.node.id, ahead);
    assert.notEqual(day3.json.node.id, d1);
    const saved = await call('/api/respond', { node_id: day3.json.node.id, body: 'day 3', date: '2026-10-29' });
    assert.equal(saved.status, 200);
    // A stale client posting an already-written card gets a clean "today has changed", never a server error.
    const stale = await call('/api/respond', { node_id: ahead, body: 'again', date: '2026-10-30' });
    assert.equal(stale.status, 409);
  } finally { server.close(); }
});
