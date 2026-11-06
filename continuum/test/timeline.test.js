import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openDb, seedContent } from '../db.js';
import { createApp } from '../app.js';
import * as content from '../content/index.js';

test('gallery/timeline: every idea in date order and in a room, named and pictured, today\'s card and user state marked', async () => {
  const db = openDb(':memory:');
  seedContent(db, content);
  db.prepare('INSERT INTO users (token, name) VALUES (?, ?)').run('t', 'T');
  const server = createApp(db, {}).listen(0);
  await new Promise((r) => server.once('listening', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = (path, body) => fetch(base + path, {
    method: body ? 'POST' : 'GET', headers: { 'x-continuum-token': 't', 'content-type': 'application/json' }, body: body && JSON.stringify(body),
  }).then((r) => r.json());
  const get = (nodes, id) => nodes.find((n) => n.id === id);
  try {
    let { nodes, rooms } = await call('/api/timeline?date=2026-11-01');
    // Gallery rooms: every idea sits in one of the listed rooms.
    assert.ok(rooms.length >= 10);
    assert.ok(nodes.every((n) => rooms.some((r) => r.id === n.room)), 'every idea has a room');
    const ideas = content.nodes.filter((n) => n.type !== 'practice');
    assert.equal(nodes.length, ideas.length);
    assert.ok(nodes.every((n, i) => i === 0 || nodes[i - 1].year <= n.year), 'sorted by year');
    // The 14 ideas with their own illustration are still marked daily, but none is held back: named, with their picture.
    const daily = nodes.filter((n) => n.daily);
    assert.equal(daily.length, 14);
    for (const n of daily) {
      const c = content.nodes.find((x) => x.id === n.id);
      assert.ok(n.title, n.id);
      assert.equal(n.backdrop, c.image?.src ?? null, n.id);
    }
    assert.ok(nodes.every((n) => n.state !== 'upcoming'));

    // Day 1: exactly one card is today's (title shown, the card shows it anyway); everything else is unseen and named.
    const today = await call('/api/today?date=2026-11-01');
    const t1 = today.node.id;
    assert.deepEqual(nodes.filter((n) => n.state === 'today').map((n) => n.id), [t1]);
    assert.equal(get(nodes, t1).title, today.node.title);
    assert.ok(nodes.filter((n) => n.id !== t1).every((n) => n.state === 'unseen' && n.title));

    const walk = ideas.find((n) => n.id !== t1).id;
    await call('/api/respond', { node_id: t1, body: 'x', date: '2026-11-01' });
    await call(`/api/node/${walk}?date=2026-11-01`);
    ({ nodes } = await call('/api/timeline?date=2026-11-01'));
    assert.equal(get(nodes, t1).state, 'written');
    assert.equal(get(nodes, walk).state, 'visited');
    // Written today: no "today" card until tomorrow.
    assert.equal(nodes.filter((n) => n.state === 'today').length, 0);

    ({ nodes } = await call('/api/timeline?date=2026-11-02'));
    const t2 = (await call('/api/today?date=2026-11-02')).node;
    assert.deepEqual(nodes.filter((n) => n.state === 'today').map((n) => n.id), [t2.id]);
    assert.equal(get(nodes, t2.id).title, t2.title);
    assert.equal(get(nodes, t1).state, 'written');
  } finally { server.close(); }
});
