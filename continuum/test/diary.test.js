import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openDb, seedContent } from '../db.js';
import { createApp } from '../app.js';
import * as content from '../content/index.js';

async function boot() {
  const db = openDb(':memory:');
  seedContent(db, content);
  db.prepare('INSERT INTO users (token, name) VALUES (?, ?)').run('t', 'T');
  const server = createApp(db, {}).listen(0);
  await new Promise((r) => server.once('listening', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = (path, body) => fetch(base + path, {
    method: body ? 'POST' : 'GET', headers: { 'x-continuum-token': 't', 'content-type': 'application/json' }, body: body && JSON.stringify(body),
  }).then(async (r) => ({ status: r.status, json: await r.json() }));
  return { db, server, call };
}
const D1 = '2026-11-01';

test('diary: notes on any idea, threads between ideas met, and roads chosen from the user\'s own words', async () => {
  const { db, server, call } = await boot();
  try {
    let d = (await call(`/api/diary?date=${D1}`)).json;
    assert.deepEqual(d.counts, { met: 0, notes: 0, answers: 0, kept: 0 });
    assert.deepEqual([d.roads, d.threads, d.entries], [[], [], []]);

    // Day one: write on Democritus, then walk to an idea linked to it.
    const today = (await call(`/api/today?date=${D1}`)).json.node.id;
    await call('/api/respond', { node_id: today, body: 'Atoms and void: I am not sure.', date: D1 });
    const nb = (await call(`/api/node/${today}?date=${D1}`)).json.node.neighbours
      .find((r) => !db.prepare('SELECT seq FROM nodes WHERE id = ?').get(r.id).seq);
    await call(`/api/node/${nb.id}?date=${D1}`);

    // A note on the walked idea, using a word that appears in an idea not yet opened.
    const daily = new Set(db.prepare('SELECT id FROM nodes WHERE seq IS NOT NULL').all().map((r) => r.id));
    const target = db.prepare("SELECT id, plain_face FROM nodes WHERE seq IS NULL AND type != 'practice' AND id != ? ORDER BY id").all(nb.id)
      .map((n) => ({ ...n, word: (n.plain_face.match(/\b[a-z]{9,}\b/g) ?? [])[0] })).find((n) => n.word);
    const r = await call('/api/note', { node_id: nb.id, body: `This made me think about ${target.word}.`, date: D1 });
    assert.equal(r.status, 200);
    assert.equal((await call(`/api/node/${nb.id}?date=${D1}`)).json.node.note, `This made me think about ${target.word}.`);

    d = (await call(`/api/diary?date=${D1}`)).json;
    assert.deepEqual(d.counts, { met: 2, notes: 1, answers: 1, kept: 0 });
    // The link between the two ideas they met is a thread, in words.
    assert.ok(d.threads.some((t) => [t.first.id, t.second.id].sort().join() === [today, nb.id].sort().join() && t.verb));
    // Roads: never an idea already met, never a daily card (upcoming ones stay hidden), each with a reason.
    assert.ok(d.roads.length >= 1 && d.roads.length <= 3);
    for (const road of d.roads) {
      assert.ok(!daily.has(road.id) && road.id !== nb.id && road.id !== today);
      assert.ok(road.why && road.title);
    }
    assert.ok(d.roads.some((x) => x.why.startsWith(`You wrote "${target.word}"`)), JSON.stringify(d.roads));
    // Entries: the note and the answer, newest first, each pinned to its idea.
    assert.deepEqual(d.entries.map((e) => e.kind).sort(), ['answer', 'note']);
    assert.ok(d.entries.find((e) => e.kind === 'answer').prompt);

    // An empty note removes it.
    assert.equal((await call('/api/note', { node_id: nb.id, body: '  ', date: D1 })).json.note, null);
    assert.equal((await call(`/api/diary?date=${D1}`)).json.counts.notes, 0);
    assert.equal((await call('/api/note', { node_id: 'nope', body: 'x' })).status, 404);
  } finally { server.close(); }
});
