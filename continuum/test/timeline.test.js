import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openDb, seedContent } from '../db.js';
import { createApp } from '../app.js';
import * as content from '../content/index.js';

test('timeline: every idea in date order, upcoming daily ideas hidden, user state marked', async () => {
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
    let { nodes } = await call('/api/timeline?date=2026-11-01');
    const ideas = content.nodes.filter((n) => n.type !== 'practice');
    assert.equal(nodes.length, ideas.length);
    assert.ok(nodes.every((n, i) => i === 0 || nodes[i - 1].year <= n.year), 'sorted by year');
    assert.equal(nodes.filter((n) => n.daily).length, 14);

    // Day 1: Democritus is today's card (title shown, the card shows it anyway); the other 13 are hidden.
    assert.equal(get(nodes, 'democritus_atoms_and_void').state, 'today');
    assert.equal(get(nodes, 'democritus_atoms_and_void').title, 'Everything is atoms and void');
    const upcoming = nodes.filter((n) => n.state === 'upcoming');
    assert.equal(upcoming.length, 13);
    assert.ok(upcoming.every((n) => n.title === null && n.daily && n.thinker));
    assert.ok(nodes.filter((n) => !n.daily).every((n) => n.state === 'unseen' && n.title));

    await call('/api/respond', { node_id: 'democritus_atoms_and_void', body: 'x', date: '2026-11-01' });
    await call('/api/node/socrates_unexamined_life?date=2026-11-01');
    ({ nodes } = await call('/api/timeline?date=2026-11-01'));
    assert.equal(get(nodes, 'democritus_atoms_and_void').state, 'written');
    assert.equal(get(nodes, 'socrates_unexamined_life').state, 'visited');
    // Written today: no "today" card until tomorrow, and Epicurus stays hidden until then.
    assert.equal(nodes.filter((n) => n.state === 'today').length, 0);
    assert.equal(get(nodes, 'epicurus_absence_of_pain').title, null);

    ({ nodes } = await call('/api/timeline?date=2026-11-02'));
    assert.equal(get(nodes, 'epicurus_absence_of_pain').state, 'today');
    assert.match(get(nodes, 'epicurus_absence_of_pain').title, /absence of pain/);
  } finally { server.close(); }
});
