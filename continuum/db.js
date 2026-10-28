// SQLite access for Continuum. Two content tables (nodes, edges) carry the app;
// users/journal/events exist only to answer the MVP question: did they come back?
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { TYPES, FIELDS, RELS } from './content/model.js';

const SCHEMA = `
CREATE TABLE IF NOT EXISTS nodes (
  id TEXT PRIMARY KEY,                 -- 'epicurus_pleasure_absence_pain'
  type TEXT NOT NULL,                  -- one of TYPES in content/model.js (checked on seeding)
  title TEXT NOT NULL,                 -- 'Pleasure is the absence of pain'
  plain_face TEXT NOT NULL,            -- short, one analogy, no jargon
  source_face TEXT,                    -- authentic passage (nullable for thinker/practice nodes)
  source_citation TEXT,                -- work, section, translator, edition
  source_url TEXT,                     -- link to the full text, where one exists
  field TEXT NOT NULL DEFAULT 'philosophy', -- one of FIELDS in content/model.js
  thinker TEXT,                        -- display name of the originating thinker
  year INTEGER,                        -- approximate year (negative = BCE)
  prompt TEXT,                         -- what the user is asked to write about
  seq INTEGER UNIQUE,                  -- order in the starter line (NULL = never a daily card, e.g. practices)
  misreading TEXT,                     -- a common misreading and what the thinker meant; shown only after writing
  analysis_url TEXT,                   -- deeper analysis (Stanford Encyclopedia of Philosophy where it has an entry)
  image TEXT,                          -- JSON {src, kind, alt, credit, credit_url}; daily nodes only, shown after writing
  room TEXT,                           -- gallery room id (content/rooms.js)
  opinions TEXT,                       -- court cases: JSON [{role, author, gist, quote, echoes}]
  as_of TEXT                           -- news events: the date the summary describes (YYYY-MM-DD)
);

CREATE TABLE IF NOT EXISTS edges (
  from_id TEXT NOT NULL REFERENCES nodes(id),  -- the earlier idea (A)
  to_id TEXT NOT NULL REFERENCES nodes(id),    -- B, which did <relation> to A
  relation TEXT NOT NULL,                      -- one of RELS in content/model.js
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

CREATE TABLE IF NOT EXISTS favorites (
  user_id INTEGER NOT NULL REFERENCES users(id),
  node_id TEXT NOT NULL REFERENCES nodes(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (user_id, node_id)
);

-- Connections proposed on /propose, waiting to be verified and written into content/. payload is the form as JSON.
CREATE TABLE IF NOT EXISTS proposals (
  id INTEGER PRIMARY KEY,
  payload TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','added','declined')),
  reply TEXT,                          -- why it was declined, or where it went
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT
);

-- One practice session per user per day (the latest wins). size grows with the habit: tiny, small, full.
CREATE TABLE IF NOT EXISTS practice_log (
  user_id INTEGER NOT NULL REFERENCES users(id),
  local_date TEXT NOT NULL,
  practice_id TEXT NOT NULL REFERENCES nodes(id),
  size TEXT NOT NULL CHECK (size IN ('tiny','small','full')),
  seconds INTEGER,
  intention TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (user_id, local_date)
);

CREATE TABLE IF NOT EXISTS reactions (
  user_id INTEGER NOT NULL REFERENCES users(id),
  node_id TEXT NOT NULL REFERENCES nodes(id),
  value TEXT NOT NULL CHECK (value IN ('changed','somewhat','unchanged')),
  local_date TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (user_id, node_id)
);
`;

// Columns added after the first testers' databases were created. SQLite has no ADD COLUMN IF NOT EXISTS.
const LATER_COLUMNS = [['nodes', 'misreading', 'TEXT'], ['nodes', 'analysis_url', 'TEXT'], ['nodes', 'image', 'TEXT'], ['nodes', 'room', 'TEXT'],
  ['nodes', 'opinions', 'TEXT'], ['nodes', 'as_of', 'TEXT']];

export function openDb(path) {
  if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec('PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;');
  dropOldChecks(db);
  db.exec(SCHEMA);
  for (const [table, column, type] of LATER_COLUMNS) {
    const have = db.prepare(`SELECT 1 FROM pragma_table_info(?) WHERE name = ?`).get(table, column);
    if (!have) db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`);
  }
  return db;
}

// Databases made before art, law and the news existed hard-coded the allowed types, fields and links in CHECK
// constraints, which SQLite cannot alter. Rebuild those two content tables once, keeping every row; journals,
// favourites and reactions point at node ids, which do not change. (SQLite's documented table-rebuild procedure.)
function dropOldChecks(db) {
  const sqlOf = (t) => db.prepare("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = ?").get(t)?.sql ?? '';
  const nodesOld = /CHECK \(type IN/.test(sqlOf('nodes'));
  const edgesOld = /CHECK \(relation IN/.test(sqlOf('edges'));
  if (!nodesOld && !edgesOld) return;
  db.exec('PRAGMA foreign_keys = OFF');
  db.exec('BEGIN');
  try {
    if (edgesOld) db.exec('DROP TABLE edges'); // edges are content only; the next seed rewrites them all
    if (nodesOld) {
      const cols = db.prepare('SELECT name FROM pragma_table_info(?)').all('nodes').map((c) => c.name).join(', ');
      // Build the new table under a temporary name, copy, drop the old, then rename the new one into place.
      // (Renaming the old table instead would make SQLite repoint journal, favorites and picks at it.)
      const create = SCHEMA.slice(0, SCHEMA.indexOf('CREATE TABLE IF NOT EXISTS edges'))
        .replace('CREATE TABLE IF NOT EXISTS nodes (', 'CREATE TABLE nodes_new (');
      db.exec(create);
      const newCols = new Set(db.prepare('SELECT name FROM pragma_table_info(?)').all('nodes_new').map((c) => c.name));
      const keep = cols.split(', ').filter((c) => newCols.has(c)).join(', ');
      db.exec(`INSERT INTO nodes_new (${keep}) SELECT ${keep} FROM nodes`);
      db.exec('DROP TABLE nodes');
      db.exec('ALTER TABLE nodes_new RENAME TO nodes');
    }
    db.exec('COMMIT');
  } catch (err) { db.exec('ROLLBACK'); throw err; } finally { db.exec('PRAGMA foreign_keys = ON'); }
}

// Replaces all content (nodes + edges). User data is untouched; journal entries keep
// pointing at node ids, so ids must stay stable across content edits.
export function seedContent(db, { nodes, edges }) {
  db.exec('BEGIN');
  try {
    db.exec('PRAGMA defer_foreign_keys = ON');
    db.exec('DELETE FROM edges');
    const upsert = db.prepare(`
      INSERT INTO nodes (id, type, title, plain_face, source_face, source_citation, source_url, field, thinker, year, prompt, seq, misreading, analysis_url, image, room, opinions, as_of)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET type=excluded.type, title=excluded.title, plain_face=excluded.plain_face,
        source_face=excluded.source_face, source_citation=excluded.source_citation, source_url=excluded.source_url,
        field=excluded.field, thinker=excluded.thinker, year=excluded.year, prompt=excluded.prompt, seq=excluded.seq,
        misreading=excluded.misreading, analysis_url=excluded.analysis_url, image=excluded.image, room=excluded.room,
        opinions=excluded.opinions, as_of=excluded.as_of`);
    db.exec('UPDATE nodes SET seq = NULL');
    for (const n of nodes) {
      // Concept doc rule: a non-thinker node is not published until both faces exist.
      if (!['thinker', 'practice'].includes(n.type) && !n.source_face) throw new Error(`${n.id}: missing source face`);
      if (!TYPES.includes(n.type)) throw new Error(`${n.id}: unknown type ${n.type}`);
      if (!FIELDS.includes(n.field ?? 'philosophy')) throw new Error(`${n.id}: unknown field ${n.field}`);
      upsert.run(n.id, n.type, n.title, n.plain_face, n.source_face ?? null, n.source_citation ?? null, n.source_url ?? null,
        n.field ?? 'philosophy', n.thinker ?? null, n.year ?? null, n.prompt ?? null, n.seq ?? null,
        n.misreading ?? null, n.analysis_url ?? null, n.image ? JSON.stringify(n.image) : null, n.room ?? null,
        n.opinions ? JSON.stringify(n.opinions) : null, n.as_of ?? null);
    }
    const insEdge = db.prepare('INSERT INTO edges (from_id, to_id, relation, year, note) VALUES (?, ?, ?, ?, ?)');
    for (const e of edges) {
      if (!RELS.includes(e.relation)) throw new Error(`edge ${e.from} -> ${e.to}: unknown relation ${e.relation}`);
      insEdge.run(e.from, e.to, e.relation, e.year ?? null, e.note ?? null);
    }
    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}
