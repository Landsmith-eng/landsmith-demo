import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openDb, seedContent } from '../db.js';
import { createApp, STARTERS } from '../app.js';
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

    // Day one: write on today's card, then walk to an idea linked to it.
    const today = (await call(`/api/today?date=${D1}`)).json.node.id;
    await call('/api/respond', { node_id: today, body: 'I am not sure about this at all.', date: D1 });
    const nb = (await call(`/api/node/${today}?date=${D1}`)).json.node.neighbours.find((r) => r.type !== 'practice');
    await call(`/api/node/${nb.id}?date=${D1}`);

    // A note on the walked idea, using a word that appears in an idea not yet opened.
    const target = db.prepare("SELECT id, plain_face FROM nodes WHERE type != 'practice' AND id NOT IN (?, ?) ORDER BY id").all(nb.id, today)
      .map((n) => ({ ...n, word: (n.plain_face.match(/\b[a-z]{9,}\b/g) ?? [])[0] })).find((n) => n.word);
    const r = await call('/api/note', { node_id: nb.id, body: `This made me think about ${target.word}.`, date: D1 });
    assert.equal(r.status, 200);
    assert.equal((await call(`/api/node/${nb.id}?date=${D1}`)).json.node.note, `This made me think about ${target.word}.`);

    d = (await call(`/api/diary?date=${D1}`)).json;
    assert.deepEqual(d.counts, { met: 2, notes: 1, answers: 1, kept: 0 });
    // The link between the two ideas they met is a thread, in words.
    assert.ok(d.threads.some((t) => [t.first.id, t.second.id].sort().join() === [today, nb.id].sort().join() && t.verb));
    // Roads: never an idea already met, each with a reason.
    assert.ok(d.roads.length >= 1 && d.roads.length <= 3);
    for (const road of d.roads) {
      assert.ok(road.id !== nb.id && road.id !== today);
      assert.ok(road.why && road.title);
    }
    assert.ok(d.roads.some((x) => x.why.startsWith(`You wrote "${target.word}"`)), JSON.stringify(d.roads));
    // The next day, before writing, today's own card is never offered as a road (it stays closed until written).
    const D2 = '2026-11-02';
    const next = (await call(`/api/diary?date=${D2}`)).json;
    const todayD2 = (await call(`/api/today?date=${D2}`)).json.node.id;
    assert.ok(next.roads.length >= 1);
    assert.ok(next.roads.every((x) => x.id !== todayD2 && x.id !== nb.id && x.id !== today), JSON.stringify(next.roads));
    // Entries: the note and the answer, newest first, each pinned to its idea.
    assert.deepEqual(d.entries.map((e) => e.kind).sort(), ['answer', 'note']);
    assert.ok(d.entries.find((e) => e.kind === 'answer').prompt);

    // An empty note removes it.
    assert.equal((await call('/api/note', { node_id: nb.id, body: '  ', date: D1 })).json.note, null);
    assert.equal((await call(`/api/diary?date=${D1}`)).json.counts.notes, 0);
    assert.equal((await call('/api/note', { node_id: 'nope', body: 'x' })).status, 404);
  } finally { server.close(); }
});

test('adaptive daily cards from the first day: a welcoming starter, a reason on every card, a gentle challenge every fifth written day, and the walk counted', async () => {
  const { db, server, call } = await boot();
  try {
    const day = (n) => new Date(Date.UTC(2026, 10, 1 + n)).toISOString().slice(0, 10);
    const wroteRooms = () => new Set(db.prepare('SELECT DISTINCT n.room FROM journal j JOIN nodes n ON n.id = j.node_id WHERE n.room IS NOT NULL').all().map((r) => r.room));
    // Rooms the user has not written in that still hold an unwritten idea with a question: a challenge is possible.
    const awayOpen = () => {
      const wrote = wroteRooms();
      return db.prepare(`SELECT DISTINCT room FROM nodes WHERE type != 'practice' AND prompt IS NOT NULL AND prompt != '' AND room IS NOT NULL
        AND id NOT IN (SELECT node_id FROM journal)`).all().some((r) => !wrote.has(r.room));
    };
    const picks = [];
    let challenges = 0;
    for (let n = 0; n < 20; n++) {
      const t = (await call(`/api/today?date=${day(n)}`)).json;
      assert.equal(t.state, 'write');
      assert.ok(!picks.includes(t.node.id), `day ${n + 1} repeats ${t.node.id}`);
      assert.ok(t.node.prompt);
      assert.ok(t.node.why, `day ${n + 1} has a reason`);
      assert.equal(t.journey.day, n + 1);
      assert.equal(t.journey.streak, n);
      // Stable for the day.
      assert.equal((await call(`/api/today?date=${day(n)}`)).json.node.id, t.node.id);
      if (n === 0) {
        assert.ok(STARTERS.includes(t.node.id), t.node.id);
        assert.match(t.node.why, /first question/);
      }
      if (n % 5 === 4 && awayOpen()) {
        assert.match(t.node.why, /gentle challenge/, `day ${n + 1}`);
        const room = db.prepare('SELECT room FROM nodes WHERE id = ?').get(t.node.id).room;
        assert.ok(!wroteRooms().has(room), `day ${n + 1}: ${room} already written in`);
        challenges++;
      } else assert.doesNotMatch(t.node.why, /gentle challenge/, `day ${n + 1}`);
      picks.push(t.node.id);
      assert.equal((await call('/api/respond', { node_id: t.node.id, body: 'Fear of losing what I love.', date: day(n) })).status, 200);
    }
    assert.ok(challenges >= 2, `only ${challenges} gentle challenges in 20 days`);
    // A missed day breaks the run but not the count.
    const t = (await call(`/api/today?date=${day(21)}`)).json;
    assert.equal(t.journey.day, 21);
    assert.equal(t.journey.streak, 0);
  } finally { server.close(); }
});

test('the interview: answers saved and changed, a journey from firm views held by instinct, used for the daily card', async () => {
  const { server, call } = await boot();
  try {
    let s = (await call('/api/stance')).json;
    assert.equal(s.questions.length, 7);
    assert.deepEqual(s.journey, { answered: 0, stops: [], open: [] });
    let r = await call('/api/stance', { answers: [
      { id: 'death', agree: 2, basis: 'instinct' },
      { id: 'human_nature', agree: -1, basis: 'thought' },
      { id: 'meaning', agree: 0, basis: null },
    ] });
    assert.equal(r.status, 200);
    const j = r.json.journey;
    assert.equal(j.answered, 3);
    assert.equal(j.stops[0].stance, 'death'); // firm, by instinct: first
    assert.equal(j.stops[0].shares.id, 'ecclesiastes_no_work_in_the_grave');
    assert.equal(j.stops[0].differs.id, 'montaigne_to_philosophize_is_to_learn_to_die');
    assert.equal(j.stops[1].shares.id, 'xunzi_human_nature_is_bad'); // disagreeing: the sides swap
    assert.equal(j.open[0].stance, 'meaning');
    assert.doesNotMatch(JSON.stringify(j), /wrong|bias|test/i);
    assert.match(j.stops[0].lead, /Ecclesiastes's case spoke to you clearly/);
    // Changing an answer, and taking one back.
    await call('/api/stance', { answers: [{ id: 'death', agree: null }] });
    assert.equal((await call('/api/stance')).json.journey.stops[0].stance, 'human_nature');
    assert.equal((await call('/api/stance', { answers: [{ id: 'nope', agree: 1 }] })).status, 400);
    assert.equal((await call('/api/stance', { answers: [{ id: 'death', agree: 5 }] })).status, 400);
  } finally { server.close(); }
});

test('bearings: a debate comes back once a week has passed on the calendar, on the next visit after writing', async () => {
  const { server, call } = await boot();
  try {
    const day = (n) => new Date(Date.UTC(2026, 10, 1 + n)).toISOString().slice(0, 10);
    await call('/api/stance', { answers: [{ id: 'death', agree: 2, basis: 'instinct' }], date: day(0) });
    // A light user: three visits in the first week, then back after a month.
    for (const n of [0, 2, 4, 30]) {
      const t = (await call(`/api/today?date=${day(n)}`)).json;
      assert.equal((await call(`/api/bearings?date=${day(n)}`)).json.due, false); // never before writing
      await call('/api/respond', { node_id: t.node.id, body: 'x', date: day(n) });
      const b = (await call(`/api/bearings?date=${day(n)}`)).json;
      assert.equal(b.due, n === 30, `day ${n}`);
      if (b.due) {
        assert.notEqual(b.debate.id, 'death'); // a debate never visited comes first
        await call('/api/stance', { answers: [{ id: b.debate.id, agree: 0 }], date: day(n) });
        assert.equal((await call(`/api/bearings?date=${day(n)}`)).json.due, false); // not again for a week
      }
    }
  } finally { server.close(); }
});

test('daily review: an idea written on comes back after 1, 3, 7… days; fuzzy brings it back tomorrow', async () => {
  const { server, call } = await boot();
  try {
    const day = (n) => new Date(Date.UTC(2026, 10, 1 + n)).toISOString().slice(0, 10);
    const t = (await call(`/api/today?date=${day(0)}`)).json;
    await call('/api/respond', { node_id: t.node.id, body: 'Atoms, yes.', date: day(0) });
    assert.equal((await call(`/api/recall?date=${day(0)}`)).json.due, null); // not the same day
    let r = (await call(`/api/recall?date=${day(1)}`)).json.due;
    assert.equal(r.id, t.node.id);
    assert.equal(r.yours, 'Atoms, yes.');
    assert.ok(r.line.length > 10 && r.prompt);
    let p = (await call('/api/recall', { node_id: r.id, result: 'got', date: day(1) })).json;
    assert.equal(p.next, day(4)); // three days on
    assert.equal((await call(`/api/recall?date=${day(1)}`)).json.due, null); // one a day
    assert.equal((await call(`/api/recall?date=${day(3)}`)).json.due, null);
    r = (await call(`/api/recall?date=${day(4)}`)).json.due;
    p = (await call('/api/recall', { node_id: r.id, result: 'fuzzy', date: day(4) })).json;
    assert.equal(p.next, day(5));
    assert.equal((await call('/api/recall', { node_id: r.id, result: 'meh', date: day(5) })).status, 400);
  } finally { server.close(); }
});
