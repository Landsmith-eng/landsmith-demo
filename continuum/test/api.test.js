import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { openDb, seedContent } from '../db.js';
import { createApp } from '../app.js';
import * as line from '../content/line_poc.js';
import * as content from '../content/index.js';

let server, base, db;
const TOKEN = 'tester-token';
const lineNodes = line.nodes.filter((n) => n.seq != null);

before(async () => {
  db = openDb(':memory:');
  seedContent(db, content);
  db.prepare('INSERT INTO users (token, name) VALUES (?, ?)').run(TOKEN, 'Tester');
  db.prepare('INSERT INTO users (token, name) VALUES (?, ?)').run('walker', 'Walker');
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
  const TYPES = ['thinker', 'concept', 'quote', 'dilemma', 'puzzle', 'text', 'practice'];
  const RELS = ['taught', 'extended', 'refuted', 'converged', 'measured', 'secularized', 'lands_on'];
  for (const n of content.nodes) {
    assert.ok(TYPES.includes(n.type), `${n.id} type`);
    assert.ok(n.plain_face, `${n.id} plain face`);
    if (!['thinker', 'practice'].includes(n.type)) assert.ok(n.source_face && n.source_citation, `${n.id} source`);
  }
  for (const e of content.edges) {
    assert.ok(byId.has(e.from) && byId.has(e.to), `dangling edge ${e.from} -> ${e.to}`);
    assert.ok(RELS.includes(e.relation), `${e.from} -> ${e.to} relation`);
    const a = byId.get(e.from), b = byId.get(e.to);
    if (['taught', 'extended', 'refuted', 'measured', 'secularized'].includes(e.relation) && a.year != null && b.year != null) {
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

test('day 1: card and question only; nothing to read before writing', async () => {
  const r = await call('/api/today?date=2026-11-01');
  assert.equal(r.json.state, 'write');
  assert.equal(r.json.node.id, 'democritus_atoms_and_void');
  assert.ok(r.json.node.prompt);
  assert.equal(r.json.node.plain_face, undefined);
  assert.equal(r.json.node.source_face, undefined);
  // Walking to today's own card before writing doesn't open it either.
  const w = await call('/api/node/democritus_atoms_and_void?date=2026-11-01');
  assert.equal(w.json.today, true);
  assert.equal(w.json.node.plain_face, undefined);
});

test('cannot answer a different node or an empty take', async () => {
  assert.equal((await write('nozick_experience_machine', '2026-11-01')).status, 409);
  assert.equal((await write('democritus_atoms_and_void', '2026-11-01', '  ')).status, 400);
});

test('write -> plain face, source and grouped neighbours; one card per day', async () => {
  let r = await write('democritus_atoms_and_void', '2026-11-01', 'Matters more, oddly.');
  assert.equal(r.status, 200);
  assert.ok(r.json.node.plain_face);
  assert.match(r.json.node.source_face, /atoms and void/);
  assert.ok(r.json.node.neighbours.some((n) => n.id === 'epicurus_absence_of_pain' && n.relation === 'extended' && n.dir === 'out'));

  r = await call('/api/today?date=2026-11-01');
  assert.equal(r.json.state, 'done_today');
  assert.equal(r.json.node.entry.body, 'Matters more, oddly.');
  assert.equal((await write('epicurus_absence_of_pain', '2026-11-01')).status, 409);
});

test('the walk is open: any node, including practices, with no bottom enforced', async () => {
  const r = await call('/api/node/frankl_mans_search_for_meaning?date=2026-11-01');
  assert.match(r.json.node.source_face, /last of the human freedoms/);
  assert.equal(r.json.node.source_url.startsWith('https://'), true);
  const p = await call('/api/node/practice_keep_death_in_view?date=2026-11-01');
  assert.equal(p.json.node.type, 'practice');
  assert.ok(p.json.node.neighbours.every((n) => n.relation === 'lands_on' && n.dir === 'in'));
});

test('daily pick: unvisited neighbour of yesterday\'s node, stable for the day even after walking', async () => {
  let r = await call('/api/today?date=2026-11-02');
  assert.equal(r.json.node.id, 'epicurus_absence_of_pain'); // only neighbour of Democritus
  await write('epicurus_absence_of_pain', '2026-11-02');

  // Epicurus neighbours, unvisited: Lucretius(3), Zeno(4), Buddha(7), Nozick(14). Lowest seq first...
  r = await call('/api/today?date=2026-11-03');
  assert.equal(r.json.node.id, 'lucretius_death_nothing_to_us');
  // ...and walking around (even to other candidates) doesn't swap today's card.
  await call('/api/node/zeno_live_according_to_nature?date=2026-11-03');
  r = await call('/api/today?date=2026-11-03');
  assert.equal(r.json.node.id, 'lucretius_death_nothing_to_us');
});

test('daily pick prefers neighbours the user has not already read on a walk', async () => {
  await write('democritus_atoms_and_void', '2026-11-01', 'x', 'walker');
  await write('epicurus_absence_of_pain', '2026-11-02', 'x', 'walker');
  await call('/api/node/lucretius_death_nothing_to_us?date=2026-11-02', { token: 'walker' });
  await call('/api/node/zeno_live_according_to_nature?date=2026-11-02', { token: 'walker' });
  const r = await call('/api/today?date=2026-11-03', { token: 'walker' });
  assert.equal(r.json.node.id, 'buddha_craving_root_of_suffering');
});

test('missed days skip nothing; all 14 nodes come up exactly once, then complete', async () => {
  const seen = new Set(['democritus_atoms_and_void', 'epicurus_absence_of_pain']);
  for (let d = 3; d <= 14; d++) {
    const date = `2026-11-${String(d * 2).padStart(2, '0')}`; // every other day
    const r = await call(`/api/today?date=${date}`);
    assert.equal(r.json.state, 'write', date);
    assert.ok(!seen.has(r.json.node.id), `repeat ${r.json.node.id}`);
    seen.add(r.json.node.id);
    assert.equal((await write(r.json.node.id, date, `day ${d}`)).status, 200);
  }
  assert.equal(seen.size, 14);
  const r = await call('/api/today?date=2026-12-01');
  assert.equal(r.json.state, 'complete');
  assert.equal((await call('/api/journal')).json.journal.length, 14);
});

test('admin stats require the key and report return visits and walk depth', async () => {
  assert.equal((await call('/admin/api/stats')).status, 403);
  const r = await call('/admin/api/stats', { headers: { 'x-admin-key': 'k' } });
  const [t, w] = r.json.testers;
  assert.equal(t.came_back, true);
  assert.equal(t.response_days.length, 14);
  assert.equal(w.walk_steps, 2);
});

test('re-seeding keeps journal entries', () => {
  seedContent(db, content);
  assert.equal(db.prepare('SELECT COUNT(*) AS n FROM journal WHERE user_id = 1').get().n, 14);
});
