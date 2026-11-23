import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openDb, seedContent } from '../db.js';
import { createApp } from '../app.js';
import { createTalk } from '../talk.js';
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

test('the trainer invites from the user\'s own trail; the path starts where they chose; a dare is asked about next time', async () => {
  const { db, server, call } = await boot();
  try {
    // They keep stopping at stories that lead to the evening review.
    const lands = db.prepare("SELECT e.from_id AS id FROM edges e JOIN nodes n ON n.id = e.from_id WHERE e.to_id = 'practice_examine_daily' AND e.relation = 'lands_on' AND n.thinker IS NOT NULL LIMIT 4").all();
    for (const x of lands) for (const action of ['deeper', 'respond']) await call('/api/trainer/log', { node: x.id, action, date: D });
    let invite = null; let s = (await call(`/api/trainer/next?date=${D}`)).json.story;
    for (let i = 0; i < 8 && !invite; i++) {
      if (s.push?.kind === 'invite') invite = s.push;
      else s = (await call(`/api/trainer/next?date=${D}&from=${s.id}&how=more`)).json.story;
    }
    assert.ok(invite, 'an invitation came');
    assert.match(invite.text, /you keep stopping at .+ point to one thing people actually do: "Examine yourself daily"/);
    assert.equal(invite.options[0].id, 'practice_examine_daily');
    // Not again the same week.
    for (let i = 0; i < 6; i++) { s = (await call(`/api/trainer/next?date=${D}&from=${s.id}&how=more`)).json.story; assert.notEqual(s.push?.kind, 'invite'); }
    // Their pick: the light path, starting with the practice they chose.
    const cur = (await call('/api/paths/start', { path: 'light', first: 'practice_invest_in_people', date: D })).json.current;
    assert.equal(cur.focus.id, 'practice_invest_in_people');
    assert.deepEqual(cur.morning.map((a) => a.id), ['people_am']);
    // A dare: taken today, asked about on the next opening, answered once.
    assert.equal((await call('/api/trainer/dare', { practice: 'nope', date: D })).status, 400);
    await call('/api/trainer/dare', { practice: 'practice_control_your_response', date: D });
    assert.equal((await call(`/api/lure?date=${D}&peek=1`)).json.dare, null); // not the same day
    const o = (await call('/api/lure?date=2026-11-02&peek=1')).json;
    assert.match(o.dare.text, /./);
    assert.equal((await call(`/api/trainer/dare/${o.dare.id}`, { answer: 'x', date: '2026-11-02' })).status, 400);
    const r = (await call(`/api/trainer/dare/${o.dare.id}`, { did: true, answer: 'Caught myself twice.', date: '2026-11-02' })).json;
    assert.ok(r.ack);
    assert.equal((await call('/api/lure?date=2026-11-03&peek=1')).json.dare, null);
  } finally { server.close(); }
});

test('the honest push is plain, and written for the passage when Claude is there', async () => {
  // Without Claude: plain wording, never the old abstract lines; the endpoint has nothing to add.
  const { server, call } = await boot();
  try {
    let s = (await call(`/api/trainer/next?date=${D}`)).json.story; const seen = [];
    for (let i = 0; i < 14; i++) { if (s.push?.kind === 'honest') seen.push(s.push.text); s = (await call(`/api/trainer/next?date=${D}&from=${s.id}&how=near`)).json.story; await call('/api/trainer/log', { node: s.id, action: 'deeper', date: D }); }
    assert.ok(seen.length >= 1, 'an honest push came');
    for (const t of seen) assert.doesNotMatch(t, /take this seriously|fooling yourself|live this, or only/);
    assert.deepEqual((await call(`/api/trainer/push?node=singer_drowning_child&date=${D}`)).json, { text: null });
  } finally { server.close(); }
  // With Claude: specific to the passage, at the user's depth, kept for the day.
  const asked = [];
  const client = { beta: { messages: { create: async (p) => { asked.push(p); return { stop_reason: 'end_turn', content: [{ type: 'text', text: '"If Singer is right, what\'s one thing you bought this month you\'d have to give up?"' }] }; } } } };
  const db = openDb(':memory:'); seedContent(db, content);
  db.prepare('INSERT INTO users (token, name) VALUES (?, ?)').run('t', 'T');
  const srv = createApp(db, { talk: createTalk({ client }) }).listen(0); await new Promise((r) => srv.once('listening', r));
  const get = () => fetch(`http://127.0.0.1:${srv.address().port}/api/trainer/push?node=singer_drowning_child&date=${D}`, { headers: { 'x-continuum-token': 't' } }).then((r) => r.json());
  try {
    assert.equal((await get()).text, "If Singer is right, what's one thing you bought this month you'd have to give up?");
    assert.match(asked[0].messages[0].content, /drowning/i);
    assert.match(asked[0].system, /plain everyday words/);
    await get(); assert.equal(asked.length, 1); // kept for the day
  } finally { srv.close(); }
});

test('a passage met before says so, and the day\'s idea stops coming back once they move on from it', async () => {
  const { db, server, call } = await boot();
  try {
    const first = (await call(`/api/trainer/next?date=${D}`)).json.story;
    assert.equal(first.today, true); assert.equal(first.seen, 0);
    const again = (await call(`/api/trainer/next?date=${D}`)).json.story; // the app opened again
    assert.equal(again.id, first.id); assert.equal(again.seen, 1);
    assert.equal((await call(`/api/trainer/next?date=${D}`)).json.story.seen, 2);
    const other = (await call(`/api/trainer/next?date=${D}&from=${first.id}&how=more`)).json.story; // "Something new"
    assert.notEqual(other.id, first.id); assert.equal(other.seen, 0);
    const reopened = (await call(`/api/trainer/next?date=${D}`)).json.story; // opened again later that day
    assert.notEqual(reopened.id, first.id, 'the day\'s idea is not forced again once they moved on from it');
    const tomorrow = (await call(`/api/trainer/next?date=2026-11-02`)).json.story;
    assert.equal(tomorrow.today, true);
    assert.ok(db.prepare("SELECT COUNT(*) AS n FROM trainer_log WHERE action = 'shown'").get().n >= 5);
  } finally { server.close(); }
});

test('thumbs and saving show on the passage; recently read lists newest first and finds by a loose word', async () => {
  const { db, server, call } = await boot();
  try {
    const a = (await call(`/api/trainer/next?date=${D}`)).json.story;
    assert.equal(a.saved, false); assert.equal(a.vote, 0);
    const b = (await call(`/api/trainer/next?date=${D}&from=${a.id}&how=more`)).json.story;
    assert.equal((await call('/api/vote', { node_id: b.id, vote: 1 })).json.vote, 1);
    assert.equal((await call('/api/vote', { node_id: b.id, vote: -1 })).json.vote, -1, 'a thumb can be changed');
    assert.equal((await call('/api/vote', { node_id: b.id, vote: 7 })).status, 400);
    await call('/api/favorite', { node_id: b.id, on: true });
    const again = (await call(`/api/trainer/next?date=${D}&id=${b.id}`)).json.story;
    assert.equal(again.saved, true); assert.equal(again.vote, -1);
    await call('/api/vote', { node_id: b.id, vote: 0 });
    assert.equal(db.prepare('SELECT COUNT(*) AS n FROM votes').get().n, 0, 'taken back');
    // Recently read: newest first, each once, with the painting it was shown on.
    const r = (await call('/api/recent')).json.items;
    assert.equal(r[0].id, b.id); assert.ok(r.some((x) => x.id === a.id)); assert.equal(new Set(r.map((x) => x.id)).size, r.length);
    assert.ok(r[0].img && r[0].snippet.length > 20 && r[0].title);
    // A loose search: a word from the passage in another form, any case.
    const word = (db.prepare('SELECT plain_face FROM nodes WHERE id = ?').get(b.id).plain_face.match(/\b[a-z]{7,}\b/i) ?? [''])[0];
    const found = (await call(`/api/recent?q=${encodeURIComponent(word.toUpperCase() + 's')}`)).json.items;
    assert.ok(found.some((x) => x.id === b.id), `found by "${word}s"`);
    assert.equal((await call('/api/recent?q=zzqqxx')).json.items.length, 0);
  } finally { server.close(); }
});
