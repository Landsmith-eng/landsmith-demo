import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openDb, seedContent } from '../db.js';
import { createApp } from '../app.js';
import * as content from '../content/index.js';

async function boot() {
  const db = openDb(':memory:'); seedContent(db, content);
  db.prepare('INSERT INTO users (token, name) VALUES (?, ?)').run('t', 'Sam');
  const server = createApp(db, {}).listen(0);
  await new Promise((r) => server.once('listening', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = (path, body) => fetch(base + path, { method: body ? 'POST' : 'GET', headers: { 'x-continuum-token': 't', 'content-type': 'application/json' }, body: body && JSON.stringify(body) }).then(async (r) => ({ status: r.status, json: await r.json() }));
  return { db, server, call };
}
const D = '2026-11-01';

test('the trainer: the day\'s idea first, then real stories from the map, each over a different painting, with choices that vary', async () => {
  const { db, server, call } = await boot();
  try {
    let s = (await call(`/api/trainer/next?date=${D}`)).json.story;
    assert.equal(s.today, true);
    assert.equal(s.id, db.prepare('SELECT node_id FROM daily_pick').get().node_id);
    assert.ok(s.story.length > 80 && s.img);
    const seenImgs = new Set([s.img]); const seen = new Set([s.id]); const shapes = new Set(); const labels = new Set();
    const pushes = [];
    for (let i = 0; i < 12; i++) {
      const from = s.id; const img = s.img;
      s = (await call(`/api/trainer/next?date=${D}&from=${from}&how=more&img=${encodeURIComponent(img)}`)).json.story;
      assert.ok(!seen.has(s.id), 'no repeats'); seen.add(s.id);
      assert.notEqual(s.img, img, 'a different painting');
      seenImgs.add(s.img);
      assert.equal(s.today, false);
      assert.equal(db.prepare('SELECT plain_face FROM nodes WHERE id = ?').get(s.id).plain_face, s.story); // the map's own telling
      assert.ok(s.choices.length >= 2 && s.choices.length <= 3);
      assert.ok(s.choices.some((c) => c.go === 'respond'));
      if (/passed four by/.test(s.push?.text ?? '')) pushes.push(i);
      shapes.add(s.choices.map((c) => c.go).join(',')); s.choices.forEach((c) => labels.add(c.label));
    }
    assert.ok(seenImgs.size >= 10, `paintings vary (${seenImgs.size})`);
    assert.ok(shapes.size >= 3, `the choices change shape (${[...shapes]})`);
    assert.ok(labels.size >= 8, `and wording (${labels.size})`);
    // Four passed by in a row: the trainer pushes, once (not on every story after).
    assert.deepEqual(pushes, [3]);
    // Asked for by name: who argued back.
    const opp = db.prepare("SELECT from_id, to_id FROM edges WHERE relation = 'refuted' AND from_id = 'epictetus_up_to_us' OR (relation = 'refuted' AND to_id = 'epictetus_up_to_us') LIMIT 1").get();
    const want = opp ? (opp.from_id === 'epictetus_up_to_us' ? opp.to_id : opp.from_id) : 'epictetus_up_to_us';
    s = (await call(`/api/trainer/next?date=${D}&id=${want}`)).json.story;
    assert.equal(s.id, want);
    // Far: another part of the map.
    const far = (await call(`/api/trainer/next?date=${D}&from=${s.id}&how=far`)).json.story;
    assert.notEqual(far.room, s.room);
    // Responding adds to the note, never replacing it; choices are logged.
    await call('/api/trainer/respond', { node: far.id, text: 'First thought.', date: D });
    const r = (await call('/api/trainer/respond', { node: far.id, text: 'Second thought.', question: 'Is it true?', date: D })).json;
    assert.equal(typeof r.ack, 'string');
    assert.match(db.prepare('SELECT body FROM notes WHERE node_id = ?').get(far.id).body, /First thought\.\n\nIs it true\? Second thought\./);
    assert.equal((await call('/api/trainer/log', { node: far.id, action: 'nonsense' })).status, 400);
    assert.equal((await call('/api/trainer/log', { node: far.id, action: 'deeper', date: D })).status, 200);
    // Ideas kept back for later days are never told early.
    const upcoming = db.prepare("SELECT id FROM nodes WHERE seq IS NOT NULL ORDER BY seq DESC LIMIT 20").all().map((x) => x.id);
    const served = db.prepare("SELECT node_id FROM trainer_log WHERE action = 'shown'").all().map((x) => x.node_id);
    const states = new Map((await call(`/api/map?date=${D}`)).json.nodes.map((x) => [x.id, x.state]));
    for (const id of served) assert.notEqual(states.get(id), 'upcoming', id);
    assert.ok(upcoming.length);
  } finally { server.close(); }
});
