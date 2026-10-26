// SQLite access for Continuum. Two content tables (nodes, edges) carry the app;
// users/journal/events exist only to answer the MVP question: did they come back?
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const SCHEMA = `
CREATE TABLE IF NOT EXISTS nodes (
  id TEXT PRIMARY KEY,                 -- 'epicurus_pleasure_absence_pain'
  type TEXT NOT NULL CHECK (type IN ('thinker','concept','quote','dilemma','puzzle','text','practice')),
  title TEXT NOT NULL,                 -- 'Pleasure is the absence of pain'
  plain_face TEXT NOT NULL,            -- short, one analogy, no jargon
  source_face TEXT,                    -- authentic passage (nullable for thinker/practice nodes)
  source_citation TEXT,                -- work, section, translator, edition
  source_url TEXT,                     -- link to the full text, where one exists
  field TEXT NOT NULL DEFAULT 'philosophy' CHECK (field IN ('philosophy','science','religion','practice')),
  thinker TEXT,                        -- display name of the originating thinker
  year INTEGER,                        -- approximate year (negative = BCE)
  prompt TEXT,                         -- what the user is asked to write about
  seq INTEGER UNIQUE                   -- order in the starter line (NULL = never a daily card, e.g. practices)
);

CREATE TABLE IF NOT EXISTS edges (
  from_id TEXT NOT NULL REFERENCES nodes(id),  -- the earlier idea (A)
  to_id TEXT NOT NULL REFERENCES nodes(id),    -- B, which did <relation> to A
  relation TEXT NOT NULL CHECK (relation IN
    ('taught','extended','refuted','converged','measured','secularized','lands_on')),
  year INTEGER,                                -- when B acted on A, where known
  note TEXT,                                   -- one line: what B did with A
  PRIMARY KEY (from_id, to_id, relation)
);

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  token TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS journal (
  user_id INTEGER NOT NULL REFERENCES users(id),
  node_id TEXT NOT NULL REFERENCES nodes(id),
  body TEXT NOT NULL,
  local_date TEXT NOT NULL,            -- user's calendar day (YYYY-MM-DD) when written
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (user_id, node_id)
);

CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  kind TEXT NOT NULL,                  -- open|respond|flip|walk
  node_id TEXT,
  local_date TEXT NOT NULL,
  at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS events_user_date ON events(user_id, local_date);
`;

export function openDb(path) {
  if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec('PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;');
  db.exec(SCHEMA);
  return db;
}

// Replaces all content (nodes + edges). User data is untouched; journal entries keep
// pointing at node ids, so ids must stay stable across content edits.
export function seedContent(db, { nodes, edges }) {
  db.exec('BEGIN');
  try {
    db.exec('PRAGMA defer_foreign_keys = ON');
    db.exec('DELETE FROM edges');
    const upsert = db.prepare(`
      INSERT INTO nodes (id, type, title, plain_face, source_face, source_citation, source_url, field, thinker, year, prompt, seq)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET type=excluded.type, title=excluded.title, plain_face=excluded.plain_face,
        source_face=excluded.source_face, source_citation=excluded.source_citation, source_url=excluded.source_url,
        field=excluded.field, thinker=excluded.thinker, year=excluded.year, prompt=excluded.prompt, seq=excluded.seq`);
    db.exec('UPDATE nodes SET seq = NULL');
    for (const n of nodes) {
      // Concept doc rule: a non-thinker node is not published until both faces exist.
      if (!['thinker', 'practice'].includes(n.type) && !n.source_face) throw new Error(`${n.id}: missing source face`);
      upsert.run(n.id, n.type, n.title, n.plain_face, n.source_face ?? null, n.source_citation ?? null, n.source_url ?? null,
        n.field ?? 'philosophy', n.thinker ?? null, n.year ?? null, n.prompt ?? null, n.seq ?? null);
    }
    const insEdge = db.prepare('INSERT INTO edges (from_id, to_id, relation, year, note) VALUES (?, ?, ?, ?, ?)');
    for (const e of edges) insEdge.run(e.from, e.to, e.relation, e.year ?? null, e.note ?? null);
    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}
