import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { openDb, seedContent } from '../db.js';
import { createApp } from '../app.js';
import * as content from '../content/index.js';
import { themes } from '../content/themes.js';
import { proposalsMarkdown } from '../public/proposals-format.js';

async function boot(adminKey = 'k') {
  const db = openDb(':memory:');
  seedContent(db, content);
  db.prepare('INSERT INTO users (token, name) VALUES (?, ?)').run('t', 'T');
  const server = createApp(db, { adminKey }).listen(0);
  await new Promise((r) => server.once('listening', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = (path, { body, headers = {} } = {}) => fetch(base + path, {
    method: body ? 'POST' : 'GET', headers: { 'x-continuum-token': 't', 'content-type': 'application/json', ...headers }, body: body && JSON.stringify(body),
  }).then(async (r) => ({ status: r.status, json: await r.json() }));
  return { db, server, call };
}

test('old databases with hard-coded type and link checks migrate without losing user data', () => {
  const path = join(mkdtempSync(join(tmpdir(), 'continuum-')), 'old.db');
  const old = new DatabaseSync(path);
  old.exec(`
    CREATE TABLE nodes (id TEXT PRIMARY KEY, type TEXT NOT NULL CHECK (type IN ('thinker','concept','quote','dilemma','puzzle','text','practice')),
      title TEXT NOT NULL, plain_face TEXT NOT NULL, source_face TEXT, source_citation TEXT, source_url TEXT,
      field TEXT NOT NULL DEFAULT 'philosophy' CHECK (field IN ('philosophy','science','religion','practice')),
      thinker TEXT, year INTEGER, prompt TEXT, seq INTEGER UNIQUE);
    CREATE TABLE edges (from_id TEXT NOT NULL REFERENCES nodes(id), to_id TEXT NOT NULL REFERENCES nodes(id),
      relation TEXT NOT NULL CHECK (relation IN ('taught','extended','refuted','converged','measured','secularized','lands_on')),
      year INTEGER, note TEXT, PRIMARY KEY (from_id, to_id, relation));
    CREATE TABLE users (id INTEGER PRIMARY KEY, token TEXT NOT NULL UNIQUE, name TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now')));
    CREATE TABLE journal (user_id INTEGER NOT NULL REFERENCES users(id), node_id TEXT NOT NULL REFERENCES nodes(id), body TEXT NOT NULL,
      local_date TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now')), PRIMARY KEY (user_id, node_id));
    INSERT INTO nodes (id, type, title, plain_face, seq) VALUES ('democritus_atoms_and_void', 'concept', 'x', 'y', 1);
    INSERT INTO users (token, name) VALUES ('a', 'A');
    INSERT INTO journal (user_id, node_id, body, local_date) VALUES (1, 'democritus_atoms_and_void', 'kept', '2026-10-01');`);
  old.close();
  const db = openDb(path);
  seedContent(db, content);
  assert.equal(db.prepare('SELECT body FROM journal').get().body, 'kept');
  assert.deepEqual(db.prepare('PRAGMA foreign_key_check').all(), []);
  assert.match(db.prepare("SELECT sql FROM sqlite_master WHERE name = 'journal'").get().sql, /REFERENCES nodes\(id\)/);
  assert.doesNotMatch(db.prepare("SELECT sql FROM sqlite_master WHERE name = 'nodes'").get().sql, /CHECK \(type IN/);
  // New kinds now fit.
  db.prepare("INSERT INTO nodes (id, type, title, plain_face, field) VALUES ('case_x', 'case', 't', 'p', 'law')").run();
});

test('themes index: every theme with its question and dated ideas; cards list their themes', async () => {
  const { server, call } = await boot();
  try {
    const { json } = await call('/api/themes?date=2026-11-01');
    assert.equal(json.themes.length, themes.length);
    const ca = json.themes.find((t) => t.id === 'conscience_authority');
    assert.equal(ca.kind, 'conflict');
    assert.match(ca.question, /\?$/);
    assert.ok(ca.nodes.some((n) => n.id === 'sophocles_antigone' && n.title));
    // A practice stays in its theme even though it has no date.
    assert.ok(json.themes.find((t) => t.id === 'death').nodes.some((n) => n.id === 'practice_keep_death_in_view'));
    // Upcoming daily ideas stay hidden inside themes.
    const suffering = json.themes.find((t) => t.id === 'suffering').nodes.find((n) => n.id === 'buddha_craving_root_of_suffering');
    assert.equal(suffering.state, 'upcoming');
    assert.equal(suffering.title, null);
    const node = await call('/api/node/sophocles_antigone?date=2026-11-01');
    assert.ok(node.json.node.themes.some((t) => t.id === 'conscience_authority'));
  } finally { server.close(); }
});

test('search finds themes and ideas, by title or by text, and never reveals upcoming daily ideas', async () => {
  const { server, call } = await boot();
  try {
    let r = await call('/api/search?q=conscience&date=2026-11-01');
    assert.ok(r.json.themes.some((t) => t.id === 'conscience_authority'));
    r = await call('/api/search?q=antigone&date=2026-11-01');
    assert.equal(r.json.ideas[0].id, 'sophocles_antigone');
    assert.equal(r.json.ideas[0].matched, 'title');
    // Text match inside a face.
    r = await call('/api/search?q=unwritten%20laws&date=2026-11-01');
    assert.ok(r.json.ideas.some((n) => n.id === 'sophocles_antigone'));
    // The Buddha is a daily card not reached on day 1: not in results.
    r = await call('/api/search?q=craving&date=2026-11-01');
    assert.ok(!r.json.ideas.some((n) => n.id === 'buddha_craving_root_of_suffering'));
    assert.deepEqual((await call('/api/search?q=a')).json.ideas, []);
  } finally { server.close(); }
});

test('proposals: admin only, validated, queued, status changes, and formatted for a session', async () => {
  const { server, call } = await boot('secret');
  const admin = { 'x-admin-key': 'secret' };
  try {
    assert.equal((await call('/admin/api/model')).status, 403);
    const model = (await call('/admin/api/model', { headers: admin })).json;
    assert.ok(model.relations.some((r) => r.id === 'echoes'));
    assert.ok(model.fields.includes('law'));
    let r = await call('/admin/api/proposals', { headers: admin, body: { from: 'nope', to: {}, relation: 'x', why: '' } });
    assert.equal(r.status, 400);
    assert.ok(r.json.errors.length >= 3);
    r = await call('/admin/api/proposals', { headers: admin, body: {
      from: 'sophocles_antigone',
      to: { title: 'West Virginia State Board of Education v. Barnette', who: 'US Supreme Court', year: '1943', field: 'law', type: 'case', description: 'No one can be forced to salute the flag.' },
      relation: 'echoes', why: 'Conscience against a public command.', sources: ['https://example.org/barnette'],
      themes: ['conscience_authority', 'not_a_theme'], new_theme: 'Compelled speech',
    } });
    assert.equal(r.status, 200);
    const list = (await call('/admin/api/proposals', { headers: admin })).json.proposals;
    assert.equal(list.length, 1);
    assert.deepEqual(list[0].payload.themes, ['conscience_authority']);
    assert.equal(list[0].payload.to.new.year, 1943);
    assert.equal((await call(`/admin/api/proposals/${list[0].id}`, { headers: admin, body: { status: 'added', reply: 'in law.js' } })).status, 200);
    const md = proposalsMarkdown(list, model.nodes, model.themes, { onlyOpen: false });
    assert.match(md, /NEW case in law: "West Virginia State Board of Education v. Barnette" by US Supreme Court \(1943\)/);
    assert.match(md, /Antigone/);
    assert.match(md, /NEW THEME: Compelled speech/);
    assert.match(proposalsMarkdown([{ ...list[0], status: 'added' }], model.nodes, model.themes), /^# Continuum: proposed connections\n\n0 open proposals/);
  } finally { server.close(); }
});
