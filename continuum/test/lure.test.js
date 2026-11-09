import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openDb, seedContent } from '../db.js';
import { createApp } from '../app.js';
import { createLure, readReaction, ackFor, nudgeGapHours } from '../lure.js';
import * as content from '../content/index.js';

async function boot(opts = {}) {
  const db = openDb(':memory:');
  seedContent(db, content);
  for (const t of ['a', 'b', 'c', 'd', 'e']) db.prepare('INSERT INTO users (token, name) VALUES (?, ?)').run(t, `Sam ${t}`);
  const server = createApp(db, opts).listen(0);
  await new Promise((r) => server.once('listening', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = (path, { method = 'GET', body, token = 'a' } = {}) => fetch(base + path, {
    method, headers: { 'x-continuum-token': token, 'content-type': 'application/json' }, body: body && JSON.stringify(body),
  }).then(async (r) => ({ status: r.status, json: await r.json() }));
  return { db, server, call };
}
const day = (n) => new Date(Date.UTC(2026, 10, 1 + n)).toISOString().slice(0, 10);
const lureOn = (db, uid, d) => db.prepare('SELECT * FROM lures WHERE user_id = ? AND local_date = ?').get(uid, d);

test('reading a reaction from words: a bite, a nibble, a miss; and a light answer, often none', () => {
  assert.equal(readReaction('meh').strength, 'miss');
  assert.equal(readReaction('Not for me.').strength, 'miss');
  assert.equal(readReaction('').strength, 'miss');
  assert.equal(readReaction('huh').strength, 'nibble');
  assert.equal(readReaction('I guess so').strength, 'nibble');
  assert.equal(readReaction('Wow, this is me exactly.').strength, 'bite');
  assert.equal(readReaction('I disagree. Distance matters because I cannot know what the far child needs, and charity at a distance goes astray.').strength, 'bite');
  assert.equal(readReaction('I love it').sentiment, 'warm');
  const said = Array.from({ length: 200 }, (_, i) => ackFor('bite', i));
  assert.ok(said.includes(''), 'sometimes just the nod');
  assert.ok(new Set(said.filter(Boolean)).size >= 4, 'varied');
  assert.ok(said.filter((x) => x === '').length < 100, 'but mostly words for a bite');
  assert.ok(Array.from({ length: 200 }, (_, i) => ackFor('miss', i)).filter((x) => x === '').length > 80, 'mostly silence for a miss');
});

test('the opening screen: one line, a friend\'s opener, and seeing it counts; a bite is followed up next door', async () => {
  const { db, server, call } = await boot();
  try {
    let o = (await call(`/api/lure?date=${day(0)}`)).json;
    assert.equal(o.state, 'write');
    assert.ok(o.node.prompt && o.node.plain_face);
    assert.match(o.opener, /^Hi Sam\. One question to start/);
    assert.ok(lureOn(db, 1, day(0)).shown_at);
    const r = (await call('/api/respond', { method: 'POST', body: { node_id: o.node.id, body: 'Wow, this is exactly what I keep thinking about with my brother and the money he owes.', date: day(0) } })).json;
    assert.equal(typeof r.ack, 'string');
    const l = lureOn(db, 1, day(0));
    assert.equal(l.strength, 'bite');
    assert.ok(l.words > 10 && l.seconds >= 0);
    // Back the same day: what they said, and what was said back.
    o = (await call(`/api/lure?date=${day(0)}`)).json;
    assert.equal(o.state, 'done_today');
    assert.match(o.reaction.text, /my brother/);
    assert.equal(o.reaction.ack, r.ack);
    // The next day follows the bite along the graph.
    const first = l.node_id;
    o = (await call(`/api/lure?date=${day(1)}`)).json;
    const next = lureOn(db, 1, day(1));
    assert.equal(next.move, 'follow');
    const linked = db.prepare('SELECT 1 FROM edges WHERE (from_id = ? AND to_id = ?) OR (from_id = ? AND to_id = ?)').get(first, next.node_id, next.node_id, first);
    assert.ok(linked, 'next door on the map');
    assert.ok(o.opener && !/One question to start/.test(o.opener));
  } finally { server.close(); }
});

test('a lure seen and left unanswered is a miss; one never seen says nothing', async () => {
  const { db, server, call } = await boot();
  try {
    const uid = 2; const token = 'b';
    const a = (await call(`/api/lure?date=${day(0)}`, { token })).json; // start
    await call('/api/respond', { method: 'POST', token, body: { node_id: a.node.id, body: 'huh', date: day(0) } });
    await call(`/api/lure?date=${day(1)}`, { token }); // seen, ignored
    await call(`/api/today?date=${day(2)}`, { token }); // the card, but not the opening screen: not seen, not counted
    await call(`/api/lure?date=${day(3)}`, { token }); // seen, ignored
    const lure = createLure(db, { hash: () => 0, roomName: new Map(), themesOf: () => [] });
    const s = lure.course(uid, day(4));
    assert.equal(s.weak, 3); // huh, ignored, (never shown: nothing), ignored
    await call(`/api/lure?date=${day(4)}`, { token });
    assert.equal(lureOn(db, uid, day(4)).move, 'adjacent');
  } finally { server.close(); }
});

test('something else on my mind: today\'s line goes where they point, until they have answered', async () => {
  const { db, server, call } = await boot();
  try {
    const token = 'c'; const uid = 3;
    const o = (await call(`/api/lure?date=${day(0)}`, { token })).json;
    assert.equal((await call('/api/lure/topic', { method: 'POST', token, body: { topic: '', date: day(0) } })).status, 400);
    const r = (await call('/api/lure/topic', { method: 'POST', token, body: { topic: 'death and dying', date: day(0) } })).json;
    assert.equal(r.found, true);
    assert.notEqual(r.node.id, o.node.id);
    assert.match(`${r.node.title} ${r.node.plain_face}`, /death|dying|die/i);
    assert.match(r.opener, /death and dying was on your mind/);
    const l = lureOn(db, uid, day(0));
    assert.equal(l.move, 'topic'); assert.equal(l.topic, 'death and dying'); assert.equal(l.node_id, r.node.id);
    assert.equal((await call(`/api/today?date=${day(0)}`, { token })).json.node.id, r.node.id);
    assert.equal((await call('/api/respond', { method: 'POST', token, body: { node_id: r.node.id, body: 'ok', date: day(0) } })).status, 200);
    assert.equal((await call('/api/lure/topic', { method: 'POST', token, body: { topic: 'love', date: day(0) } })).status, 409);
  } finally { server.close(); }
});

test('looking back: after five answers, the road and its thread; seen once, kept on the road', async () => {
  const { server, call } = await boot();
  try {
    const token = 'd';
    for (let n = 0; n < 5; n++) {
      const o = (await call(`/api/lure?date=${day(n)}`, { token })).json;
      assert.equal(o.synthesis, null);
      await call('/api/respond', { method: 'POST', token, body: { node_id: o.node.id, body: n % 2 ? 'meh' : 'This one really struck me, I have felt that way about work for years.', date: day(n) } });
    }
    await new Promise((r) => setTimeout(r, 50));
    const o = (await call(`/api/lure?date=${day(5)}`, { token })).json;
    assert.ok(o.synthesis, 'a look back');
    assert.match(o.synthesis.text, /^We went to/);
    assert.equal(o.synthesis.stops.length, 5);
    assert.ok(o.synthesis.stops.some((s) => s.outcome === 'bite'));
    await call('/api/lure/seen', { method: 'POST', token, body: { synthesis: o.synthesis.id } });
    assert.equal((await call(`/api/lure?date=${day(5)}`, { token })).json.synthesis, null);
    const road = (await call(`/api/road?date=${day(5)}`, { token })).json;
    assert.equal(road.syntheses.length, 1);
    assert.equal(road.stops.length, 6);
    assert.equal(road.stops[0].date, day(5));
  } finally { server.close(); }
});

test('a dead end is admitted: the look back says it turned around', () => {
  const lure = createLure(openDb(':memory:'), { hash: () => 0, roomName: new Map([['greece_rome', 'Greece and Rome'], ['east_asia', 'East Asia']]), themesOf: () => [] });
  const trail = ['a', 'b', 'c'].map((t) => ({ node_id: t, title: t.toUpperCase(), outcome: 'miss', local_date: '2026-11-01' }));
  const r = lure.templateSynthesis(trail, true, { failed: new Set(['greece_rome']), room: 'east_asia' });
  assert.match(r.text, /Greece and Rome was a cul-de-sac for you/);
  assert.match(r.text, /try East Asia/);
});

test('nudges: a couple a week at most, backing off on silence, only in the daytime, quoting their own words', async () => {
  assert.equal(nudgeGapHours(0), 60);
  assert.equal(nudgeGapHours(1), 120);
  assert.equal(nudgeGapHours(3), 480);
  assert.equal(nudgeGapHours(9), 720);
  const { db, server, call } = await boot();
  try {
    const token = 'e'; const uid = 5;
    const o = (await call(`/api/lure?date=${day(0)}`, { token })).json;
    await call('/api/respond', { method: 'POST', token, body: { node_id: o.node.id, body: 'Anger is mostly fear wearing armour.', date: day(0) } });
    assert.equal((await call('/api/push', { method: 'POST', token, body: { subscription: { endpoint: 'http://x' } } })).status, 400);
    const sub = { endpoint: 'https://push.example/abc', keys: { p256dh: 'p', auth: 'q' } };
    assert.equal((await call('/api/push', { method: 'POST', token, body: { subscription: sub, tz: 'America/Chicago' } })).json.on, true);
    const lure = createLure(db, { hash: () => 0, roomName: new Map(), themesOf: () => [] });
    db.prepare("UPDATE events SET at = '2026-11-01 15:00:00' WHERE user_id = ?").run(uid);
    const at = (s) => Date.parse(`${s}Z`);
    const tz = 'America/Chicago';
    assert.equal(lure.nudgeDue(uid, at('2026-11-02 17:00:00'), tz), false, 'they were just here');
    assert.equal(lure.nudgeDue(uid, at('2026-11-03 23:00:00'), tz), true, 'two and a half days on, late afternoon in Chicago');
    assert.equal(lure.nudgeDue(uid, at('2026-11-04 07:00:00'), tz), false, 'not in the night');
    db.prepare('INSERT INTO nudges (user_id, text, delivered, sent_at) VALUES (?, ?, 1, ?)').run(uid, 'x', '2026-11-03 18:00:00');
    assert.equal(lure.nudgeDue(uid, at('2026-11-05 18:00:00'), tz), false, 'unanswered: the gap doubles');
    assert.equal(lure.nudgeDue(uid, at('2026-11-08 18:00:00'), tz), true);
    // They came back: the gap starts over.
    db.prepare("INSERT INTO events (user_id, kind, local_date, at) VALUES (?, 'open', '2026-11-06', '2026-11-06 15:00:00')").run(uid);
    assert.equal(lure.nudgeDue(uid, at('2026-11-08 18:00:00'), tz), false);
    assert.equal(lure.nudgeDue(uid, at('2026-11-09 00:00:00'), tz), true);
    const text = await lure.nudgeText(uid, at('2026-11-09 18:00:00'));
    assert.match(text, /Last week you wrote about ".+": "Anger is mostly fear wearing armour\." Did that hold up\?/);
    // A nudge shows once on the opening screen, as the opener.
    db.prepare('INSERT INTO nudges (user_id, text, delivered) VALUES (?, ?, 1)').run(uid, text);
    const next = (await call(`/api/lure?date=${day(1)}`, { token })).json;
    assert.equal(next.opener, text);
    assert.notEqual((await call(`/api/lure?date=${day(1)}`, { token })).json.opener, text);
    assert.equal((await call('/api/push', { method: 'DELETE', token, body: { endpoint: sub.endpoint } })).json.on, false);
  } finally { server.close(); }
});
