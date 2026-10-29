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
const day = (n) => new Date(Date.UTC(2026, 10, 1 + n)).toISOString().slice(0, 10); // day(0) = 2026-11-01, a Sunday

test('practice: the day\'s practice at ten seconds for a new user; a kept line chooses it after that', async () => {
  const { server, call } = await boot();
  try {
    let p = (await call(`/api/practice?date=${day(0)}`)).json;
    assert.equal(p.practice.id, 'practice_keep_death_in_view'); // Sunday's practice
    assert.equal(p.reason, "Sunday's practice");
    assert.equal(p.size, 'tiny');
    assert.match(p.nudge, /ten seconds/i);
    assert.equal(p.anchor, null);
    assert.ok(p.practice.steps.tiny && p.practice.steps.full.length >= 2);
    // Keeping Seneca's evening review (which lands on Examine yourself daily) turns the practice toward it.
    await call('/api/favorite', { node_id: 'seneca_evening_review' });
    p = (await call(`/api/practice?date=${day(0)}`)).json;
    assert.equal(p.practice.id, 'practice_examine_daily');
    assert.equal(p.anchor.id, 'seneca_evening_review');
    assert.match(p.reason, /Seneca/);
    // The user can choose another practice for today.
    p = (await call(`/api/practice?date=${day(0)}&practice=practice_care_for_the_body`)).json;
    assert.equal(p.practice.id, 'practice_care_for_the_body');
    assert.equal(p.reason, 'Your choice today');
  } finally { server.close(); }
});

test('practice: three days in a row offers the next size; a gap steps back down with a welcome', async () => {
  const { server, call } = await boot();
  try {
    for (let i = 0; i < 3; i++) {
      const r = await call('/api/practice', { practice_id: 'practice_examine_daily', size: 'tiny', seconds: 10, date: day(i) });
      assert.equal(r.status, 200);
      assert.equal(r.json.streak, i + 1);
      assert.ok(r.json.done_today);
      assert.equal(r.json.mood, 'stillness'); // done for today: the owl
    }
    let p = (await call(`/api/practice?date=${day(3)}`)).json;
    assert.equal(p.size, 'tiny');
    assert.equal(p.offer_bigger, 'small');
    assert.equal(p.mood, 'change'); // ready to grow: the river
    assert.equal(p.streak, 3);
    await call('/api/practice', { practice_id: 'practice_examine_daily', size: 'small', seconds: 60, date: day(3) });
    // Four days off: back down a size, with a welcome rather than a scolding.
    p = (await call(`/api/practice?date=${day(8)}`)).json;
    assert.equal(p.size, 'tiny');
    assert.match(p.nudge, /Welcome back/);
    assert.equal(p.mood, 'return'); // back after a gap: the boat
    assert.equal(p.streak, 0);
    // Validation.
    assert.equal((await call('/api/practice', { practice_id: 'socrates_unexamined_life', size: 'tiny', date: day(8) })).status, 400);
    assert.equal((await call('/api/practice', { practice_id: 'practice_examine_daily', size: 'huge', date: day(8) })).status, 400);
  } finally { server.close(); }
});

test('practice: opening the app most days but practising on few of them makes today\'s step small', async () => {
  const { db, server, call } = await boot();
  try {
    await call('/api/practice', { practice_id: 'practice_examine_daily', size: 'full', seconds: 300, date: day(0) });
    for (let i = 0; i < 6; i++) db.prepare("INSERT INTO events (user_id, kind, local_date) VALUES (1, 'open', ?)").run(day(i));
    await call('/api/practice', { practice_id: 'practice_examine_daily', size: 'full', seconds: 300, date: day(5) });
    const p = (await call(`/api/practice?date=${day(6)}`)).json;
    assert.equal(p.size, 'tiny');
    assert.match(p.nudge, /smallest version/);
    assert.equal(p.mood, 'patience'); // a reluctant stretch: the dewy web
  } finally { server.close(); }
});

test('compass: holding ground brings a gentle challenge; curiosity follows what you write on; today\'s unwritten card is never suggested', async () => {
  const { server, call } = await boot();
  try {
    const written = [];
    for (let i = 0; i < 3; i++) {
      const date = `2026-11-0${i + 1}`;
      const id = (await call(`/api/today?date=${date}`)).json.node.id;
      assert.equal((await call('/api/respond', { node_id: id, body: 'x', date })).status, 200);
      await call('/api/reaction', { node_id: id, value: 'unchanged', date });
      written.push(id);
    }
    const last = written.at(-1);
    const c = (await call(`/api/compass?from=${last}&date=2026-11-03`)).json;
    assert.equal(c.challenge.kind, 'held');
    assert.match(c.challenge.why, /held your ground/);
    assert.ok(c.curiosity, 'a curiosity suggestion from the themes written on');
    for (const s of [c.challenge, c.curiosity]) {
      assert.notEqual(s.entry.state, 'today');
      assert.notEqual(s.entry.state, 'written');
      assert.notEqual(s.entry.id, last);
    }
    assert.notEqual(c.challenge.entry.id, c.curiosity.entry.id);
    assert.equal(c.practice_nudge, 'Ten seconds of practice');
    await call('/api/practice', { practice_id: 'practice_keep_death_in_view', size: 'tiny', date: '2026-11-03' });
    assert.equal((await call('/api/compass?date=2026-11-03')).json.practice_nudge, null);
    // The next day, before writing: neither suggestion is today's own card, which stays closed until written.
    const today = (await call('/api/today?date=2026-11-04')).json.node.id;
    const n = (await call(`/api/compass?from=${last}&date=2026-11-04`)).json;
    assert.ok(n.challenge || n.curiosity);
    for (const s of [n.challenge, n.curiosity].filter(Boolean)) {
      assert.notEqual(s.entry.id, today);
      assert.notEqual(s.entry.state, 'today');
    }
  } finally { server.close(); }
});

test('room plates: the daily-life scenes take turns with the 1800s room\'s own plate, one a day', async () => {
  const { db, server, call } = await boot();
  try {
    const { id } = db.prepare("SELECT id FROM nodes WHERE room = 'nineteenth' AND seq IS NULL AND image IS NULL LIMIT 1").get();
    const seen = new Set();
    for (let i = 0; i < 5; i++) seen.add((await call(`/api/node/${id}?date=${day(i)}`)).json.node.background);
    assert.equal(seen.size, 5);
    assert.ok(seen.has('/img/rooms/nineteenth.webp'));
    assert.ok([...seen].every((src) => /^\/img\/(rooms|spares)\//.test(src)));
    // The same day always gives the same plate.
    assert.equal((await call(`/api/node/${id}?date=${day(1)}`)).json.node.background, (await call(`/api/node/${id}?date=${day(6)}`)).json.node.background);
    // Rooms without a rotation keep their own plate every day.
    const greek = db.prepare("SELECT id FROM nodes WHERE room = 'greece_rome' AND seq IS NULL AND image IS NULL LIMIT 1").get();
    assert.equal((await call(`/api/node/${greek.id}?date=${day(2)}`)).json.node.background, '/img/rooms/greece_rome.webp');
  } finally { server.close(); }
});
