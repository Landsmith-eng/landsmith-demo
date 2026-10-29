import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { openDb, seedContent } from '../db.js';
import { createApp, STARTERS } from '../app.js';
import * as line from '../content/line_poc.js';
import * as content from '../content/index.js';
import { TYPES, RELS, DIRECTED } from '../content/model.js';
import { stances } from '../content/stances.js';

let server, base, db;
const TOKEN = 'tester-token';
const lineNodes = line.nodes.filter((n) => n.seq != null);

before(async () => {
  db = openDb(':memory:');
  seedContent(db, content);
  db.prepare('INSERT INTO users (token, name) VALUES (?, ?)').run(TOKEN, 'Tester');
  db.prepare('INSERT INTO users (token, name) VALUES (?, ?)').run('walker', 'Walker');
  db.prepare('INSERT INTO users (token, name) VALUES (?, ?)').run('debater', 'Debater');
  server = createApp(db, { adminKey: 'k' }).listen(0);
  await new Promise((r) => server.once('listening', r));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => server.close());

const call = (path, { method = 'GET', body, token = TOKEN, headers = {} } = {}) =>
  fetch(base + path, {
    method,
    headers: { 'x-continuum-token': token, 'content-type': 'application/json', ...headers },
    body: body && JSON.stringify(body),
  }).then(async (r) => ({ status: r.status, json: await r.json() }));

const write = (nodeId, date, body = 'my take', token = TOKEN) =>
  call('/api/respond', { method: 'POST', token, body: { node_id: nodeId, body, date } });

test('content matches the concept doc: 14 two-faced nodes, typed edges, every node reaches a practice', () => {
  assert.equal(lineNodes.length, 14);
  assert.deepEqual(lineNodes.map((n) => n.seq), Array.from({ length: 14 }, (_, i) => i + 1));
  const byId = new Map(line.nodes.map((n) => [n.id, n]));
  for (const n of lineNodes) assert.ok(n.plain_face && n.source_face && n.source_citation && n.prompt, n.id);
  for (const e of line.edges) {
    assert.ok(byId.has(e.from) && byId.has(e.to), `${e.from} -> ${e.to}`);
    if (e.relation === 'lands_on') assert.equal(byId.get(e.to).type, 'practice', `${e.from} lands_on non-practice`);
  }
  assert.ok(line.edges.length >= 20, `only ${line.edges.length} edges`);

  // "Every path can be followed forward to one of the seven practices": walking edges either way
  // from any line node must reach a practice.
  const adj = new Map();
  for (const e of line.edges) {
    for (const [a, b] of [[e.from, e.to], [e.to, e.from]]) adj.set(a, [...(adj.get(a) ?? []), b]);
  }
  for (const start of lineNodes) {
    const seen = new Set([start.id]);
    const queue = [start.id];
    let found = false;
    while (queue.length && !found) {
      for (const next of adj.get(queue.shift()) ?? []) {
        if (byId.get(next).type === 'practice') found = true;
        if (!seen.has(next)) { seen.add(next); queue.push(next); }
      }
    }
    assert.ok(found, `${start.id} cannot reach a practice`);
  }
});

test('branches: valid types, possible chronology, every node reaches a practice, sources present', () => {
  const byId = new Map(content.nodes.map((n) => [n.id, n]));
  for (const n of content.nodes) {
    assert.ok(TYPES.includes(n.type), `${n.id} type`);
    assert.ok(n.plain_face, `${n.id} plain face`);
    if (!['thinker', 'practice'].includes(n.type)) assert.ok(n.source_face && n.source_citation, `${n.id} source`);
  }
  for (const e of content.edges) {
    assert.ok(byId.has(e.from) && byId.has(e.to), `dangling edge ${e.from} -> ${e.to}`);
    assert.ok(RELS.includes(e.relation), `${e.from} -> ${e.to} relation`);
    const a = byId.get(e.from), b = byId.get(e.to);
    if (DIRECTED.includes(e.relation) && a.year != null && b.year != null) {
      assert.ok(b.year >= a.year - 30, `impossible chronology: ${b.id} (${b.year}) ${e.relation} ${a.id} (${a.year})`);
    }
  }
  const adj = new Map();
  for (const e of content.edges) for (const [x, y] of [[e.from, e.to], [e.to, e.from]]) adj.set(x, [...(adj.get(x) ?? []), y]);
  for (const n of content.nodes.filter((x) => x.type !== 'practice')) {
    const seen = new Set([n.id]); const queue = [n.id]; let found = false;
    while (queue.length && !found) for (const next of adj.get(queue.shift()) ?? []) {
      if (byId.get(next).type === 'practice') found = true;
      if (!seen.has(next)) { seen.add(next); queue.push(next); }
    }
    assert.ok(found, `${n.id} cannot reach a practice`);
  }
  // Daily line is unchanged by branches.
  assert.equal(content.nodes.filter((n) => n.seq != null).length, 14);
});

test('seeding refuses a non-thinker node without a source face', () => {
  const tmp = openDb(':memory:');
  assert.throws(() => seedContent(tmp, { nodes: [{ id: 'x', type: 'quote', title: 't', plain_face: 'p' }], edges: [] }), /missing source face/);
});

test('no token -> 401', async () => {
  assert.equal((await call('/api/today', { token: 'nope' })).status, 401);
});

const todayOf = async (date, token = TOKEN) => (await call(`/api/today?date=${date}`, { token })).json.node.id;
const cards = {}; // date -> the card written that day (by the tester)

test('day 1: a welcoming first question, card and question only; nothing to read before writing', async () => {
  const r = await call('/api/today?date=2026-11-01');
  assert.equal(r.json.state, 'write');
  assert.ok(STARTERS.includes(r.json.node.id), r.json.node.id);
  assert.ok(r.json.node.prompt);
  assert.equal(r.json.node.plain_face, undefined);
  assert.equal(r.json.node.source_face, undefined);
  // Walking to today's own card before writing doesn't open it either.
  const w = await call(`/api/node/${r.json.node.id}?date=2026-11-01`);
  assert.equal(w.json.today, true);
  assert.equal(w.json.node.plain_face, undefined);
  cards['2026-11-01'] = r.json.node.id;
});

test('cannot answer a different node or an empty take', async () => {
  const other = content.nodes.find((n) => n.type !== 'practice' && n.id !== cards['2026-11-01']).id;
  assert.equal((await write(other, '2026-11-01')).status, 409);
  assert.equal((await write(cards['2026-11-01'], '2026-11-01', '  ')).status, 400);
});

test('write -> plain face, source and grouped neighbours; one card per day', async () => {
  const id = cards['2026-11-01'];
  let r = await write(id, '2026-11-01', 'Matters more, oddly.');
  assert.equal(r.status, 200);
  assert.ok(r.json.node.plain_face);
  assert.ok(r.json.node.source_face);
  assert.ok(r.json.node.neighbours.length > 0);

  r = await call('/api/today?date=2026-11-01');
  assert.equal(r.json.state, 'done_today');
  assert.equal(r.json.node.entry.body, 'Matters more, oddly.');
  const next = r.json.node.neighbours.find((n) => n.type !== 'practice').id;
  assert.equal((await write(next, '2026-11-01')).status, 409);
});

test('the walk is open: any node, including practices, with no bottom enforced', async () => {
  const r = await call('/api/node/frankl_mans_search_for_meaning?date=2026-11-01');
  assert.match(r.json.node.source_face, /last of the human freedoms/);
  assert.equal(r.json.node.source_url.startsWith('https://'), true);
  const p = await call('/api/node/practice_keep_death_in_view?date=2026-11-01');
  assert.equal(p.json.node.type, 'practice');
  assert.ok(p.json.node.neighbours.every((n) => n.relation === 'lands_on' && n.dir === 'in'));
});

test('daily pick: a new card, stable for the day even after walking', async () => {
  const id = await todayOf('2026-11-02');
  assert.notEqual(id, cards['2026-11-01']);
  await call('/api/node/zeno_live_according_to_nature?date=2026-11-02');
  await call('/api/node/camus_myth_of_sisyphus?date=2026-11-02');
  assert.equal(await todayOf('2026-11-02'), id);
  assert.equal((await write(id, '2026-11-02')).status, 200);
  cards['2026-11-02'] = id;
});

test('daily pick prefers ideas the user has not already read on a walk', async () => {
  const first = await todayOf('2026-11-01', 'walker');
  await write(first, '2026-11-01', 'x', 'walker');
  const walked = ['lucretius_death_nothing_to_us', 'zeno_live_according_to_nature'];
  for (const id of walked) await call(`/api/node/${id}?date=2026-11-01`, { token: 'walker' });
  const second = await todayOf('2026-11-02', 'walker');
  assert.ok(!walked.includes(second));
  await write(second, '2026-11-02', 'x', 'walker');
});

test('missed days skip nothing and nothing repeats; each card says why it was chosen, and the walk is counted', async () => {
  const seen = new Set(Object.values(cards));
  for (let d = 3; d <= 14; d++) {
    const date = `2026-11-${String(d * 2).padStart(2, '0')}`; // every other day
    const r = await call(`/api/today?date=${date}`);
    assert.equal(r.json.state, 'write', date);
    assert.ok(!seen.has(r.json.node.id), `repeat ${r.json.node.id}`);
    seen.add(r.json.node.id); cards[date] = r.json.node.id;
    assert.equal((await write(r.json.node.id, date, `day ${d}`)).status, 200);
  }
  assert.equal(seen.size, 14);
  const r = await call('/api/today?date=2026-12-01');
  assert.equal(r.json.state, 'write');
  assert.ok(!seen.has(r.json.node.id));
  assert.ok(r.json.node.prompt);
  assert.equal(r.json.journey.day, 15);
  assert.ok(r.json.journey.met >= 14);
  assert.equal((await call('/api/today?date=2026-12-01')).json.node.id, r.json.node.id);
  assert.equal((await call('/api/journal')).json.journal.length, 14);
});

test('answering the debates before writing lets today\'s card come from the journey', async () => {
  await call('/api/today?date=2026-11-01', { token: 'debater' });
  const q = stances[0];
  await call('/api/stance', { method: 'POST', token: 'debater', body: { date: '2026-11-01', answers: [{ id: q.id, agree: 2, basis: 'instinct' }] } });
  const r = await call('/api/today?date=2026-11-01', { token: 'debater' });
  assert.equal(r.json.node.id, q.a.idea);
  assert.match(r.json.node.why, /journey/i);
});

test('admin stats require the key and report return visits and walk depth', async () => {
  assert.equal((await call('/admin/api/stats')).status, 403);
  const r = await call('/admin/api/stats', { headers: { 'x-admin-key': 'k' } });
  const [t, w] = r.json.testers;
  assert.equal(t.came_back, true);
  assert.equal(t.response_days.length, 14);
  assert.equal(w.walk_steps, 2);
});

test('favourites: keep a line, see it in the journal, let it go', async () => {
  assert.equal((await call('/api/favorite', { method: 'POST', body: { node_id: 'nope' } })).status, 404);
  let r = await call('/api/favorite', { method: 'POST', body: { node_id: 'seneca_evening_review' } });
  assert.equal(r.json.favorite, true);
  r = await call('/api/journal');
  assert.equal(r.json.favorites.length, 1);
  assert.equal(r.json.favorites[0].id, 'seneca_evening_review');
  assert.match(r.json.favorites[0].source_face, /\S/);
  r = await call('/api/node/seneca_evening_review?date=2026-12-01');
  assert.equal(r.json.node.favorite, true);
  await call('/api/favorite', { method: 'POST', body: { node_id: 'seneca_evening_review', on: false } });
  assert.equal((await call('/api/journal')).json.favorites.length, 0);
});

test('reactions: only after writing, one per node, latest wins', async () => {
  const id = cards['2026-11-01'];
  const body = { node_id: id, value: 'changed', date: '2026-12-01' };
  assert.equal((await call('/api/reaction', { method: 'POST', body: { ...body, value: 'meh' } })).status, 400);
  const unwritten = content.nodes.find((n) => n.type !== 'practice' && n.source_face && !Object.values(cards).includes(n.id)).id;
  assert.equal((await call('/api/reaction', { method: 'POST', body: { ...body, node_id: unwritten } })).status, 409);
  let r = await call('/api/reaction', { method: 'POST', body });
  assert.equal(r.json.reaction, 'changed');
  r = await call('/api/reaction', { method: 'POST', body: { ...body, value: 'unchanged' } });
  assert.equal(r.json.reaction, 'unchanged');
  r = await call(`/api/node/${id}?date=2026-12-01`);
  assert.equal(r.json.node.reaction, 'unchanged');
  assert.equal((await call('/api/journal')).json.journal.find((e) => e.id === id).reaction, 'unchanged');
});

test('review: a week and everything, with practices landed on and first/last bookends', async () => {
  await call('/api/reaction', { method: 'POST', body: { node_id: cards['2026-11-28'], value: 'somewhat', date: '2026-11-28' } });
  await call('/api/node/practice_keep_death_in_view?date=2026-11-28');
  await call('/api/node/practice_keep_death_in_view?date=2026-11-28');
  await call('/api/node/epictetus_up_to_us?date=2026-11-28');

  let r = await call('/api/review?days=7&date=2026-11-28');
  assert.equal(r.status, 200);
  assert.equal(r.json.from, '2026-11-22');
  assert.equal(r.json.to, '2026-11-28');
  assert.deepEqual(r.json.entries.map((e) => e.local_date), ['2026-11-22', '2026-11-24', '2026-11-26', '2026-11-28']);
  assert.equal(r.json.practices[0].id, 'practice_keep_death_in_view');
  assert.equal(r.json.practices[0].count, 2);
  assert.ok(r.json.walked.every((n) => n.type !== 'practice'));
  assert.equal(r.json.walked[0].id, 'epictetus_up_to_us');
  assert.deepEqual(r.json.reactions, { changed: 0, somewhat: 1, unchanged: 0 });
  assert.ok(r.json.days_active >= 1);

  r = await call('/api/review?days=0&date=2026-12-01');
  assert.equal(r.json.from, null);
  assert.equal(r.json.entries.length, 14);
  assert.deepEqual(r.json.reactions, { changed: 0, somewhat: 1, unchanged: 1 });
  assert.equal(r.json.bookends.first.id, cards['2026-11-01']);
  assert.equal(r.json.bookends.last.id, cards['2026-11-28']);
  assert.match(r.json.bookends.first.body, /\S/);

  r = await call('/api/review?days=7&date=2030-01-01', { token: 'walker' });
  assert.deepEqual(r.json.entries, []);
  assert.ok(r.json.bookends.last.id);
  assert.equal((await call('/api/review', { token: 'nobody-yet' })).status, 401);
});

test('re-seeding keeps journal entries', () => {
  seedContent(db, content);
  assert.equal(db.prepare('SELECT COUNT(*) AS n FROM journal WHERE user_id = 1').get().n, 14);
});

test('admin invite: makes a personal link that signs the person in', async () => {
  assert.equal((await call('/admin/api/invite', { method: 'POST', body: { name: 'Carey' } })).status, 403);
  const r = await call('/admin/api/invite', { method: 'POST', body: { name: 'Carey' }, headers: { 'x-admin-key': 'k' } });
  assert.equal(r.status, 200);
  const token = new URL(r.json.link).searchParams.get('u');
  assert.equal((await call('/api/today?date=2026-12-01', { token })).status, 200);
});
