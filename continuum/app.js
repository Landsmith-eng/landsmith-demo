// Express app for Continuum. Kept separate from server.js so tests can mount it on an in-memory DB.
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const PUBLIC_DIR = join(dirname(fileURLToPath(import.meta.url)), 'public');
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const MAX_BODY = 5000;

const DAILY_PICK_TABLE = `
CREATE TABLE IF NOT EXISTS daily_pick (
  user_id INTEGER NOT NULL REFERENCES users(id),
  local_date TEXT NOT NULL,
  node_id TEXT NOT NULL REFERENCES nodes(id),
  PRIMARY KEY (user_id, local_date)
)`;

export function createApp(db, { adminKey } = {}) {
  db.exec(DAILY_PICK_TABLE);
  const app = express();
  app.use(express.json({ limit: '32kb' }));

  const q = {
    userByToken: db.prepare('SELECT id, name, created_at FROM users WHERE token = ?'),
    lineCount: db.prepare('SELECT COUNT(*) AS n FROM nodes WHERE seq IS NOT NULL'),
    node: db.prepare('SELECT * FROM nodes WHERE id = ?'),
    pickFor: db.prepare('SELECT node_id FROM daily_pick WHERE user_id = ? AND local_date = ?'),
    savePick: db.prepare('INSERT INTO daily_pick (user_id, local_date, node_id) VALUES (?, ?, ?)'),
    lastWritten: db.prepare('SELECT node_id FROM journal WHERE user_id = ? ORDER BY created_at DESC, rowid DESC LIMIT 1'),
    // Daily pick (concept doc): an unvisited neighbour of yesterday's node, else the next node in the starter line.
    // "Unvisited" = not written; among those, prefer ones the user hasn't already walked to and read.
    neighbourPick: db.prepare(`
      SELECT n.id FROM edges e
      JOIN nodes n ON n.id = CASE WHEN e.from_id = :last THEN e.to_id ELSE e.from_id END
      WHERE (e.from_id = :last OR e.to_id = :last) AND n.seq IS NOT NULL
        AND NOT EXISTS (SELECT 1 FROM journal j WHERE j.user_id = :uid AND j.node_id = n.id)
      ORDER BY EXISTS (SELECT 1 FROM events v WHERE v.user_id = :uid AND v.kind = 'walk' AND v.node_id = n.id), n.seq
      LIMIT 1`),
    linePick: db.prepare(`
      SELECT n.id FROM nodes n
      WHERE n.seq IS NOT NULL AND NOT EXISTS (SELECT 1 FROM journal j WHERE j.user_id = ? AND j.node_id = n.id)
      ORDER BY n.seq LIMIT 1`),
    writtenOn: db.prepare('SELECT node_id FROM journal WHERE user_id = ? AND local_date = ?'),
    entry: db.prepare('SELECT body, local_date FROM journal WHERE user_id = ? AND node_id = ?'),
    writtenCount: db.prepare('SELECT COUNT(*) AS n FROM journal WHERE user_id = ?'),
    insertEntry: db.prepare('INSERT INTO journal (user_id, node_id, body, local_date) VALUES (?, ?, ?, ?)'),
    insertEvent: db.prepare('INSERT INTO events (user_id, kind, node_id, local_date) VALUES (?, ?, ?, ?)'),
    neighbours: db.prepare(`
      SELECT e.relation, e.note, e.year AS edge_year, 'in' AS dir, n.id, n.type, n.field, n.title, n.thinker, n.year
        FROM edges e JOIN nodes n ON n.id = e.from_id WHERE e.to_id = :id
      UNION ALL
      SELECT e.relation, e.note, e.year, 'out', n.id, n.type, n.field, n.title, n.thinker, n.year
        FROM edges e JOIN nodes n ON n.id = e.to_id WHERE e.from_id = :id
      ORDER BY 10`),
    journal: db.prepare(`
      SELECT n.id, n.title, n.thinker, n.field, j.body, j.local_date FROM journal j
      JOIN nodes n ON n.id = j.node_id WHERE j.user_id = ? ORDER BY j.created_at, j.rowid`),
  };

  const localDate = (raw) => (typeof raw === 'string' && DATE_RE.test(raw) ? raw : new Date().toISOString().slice(0, 10));

  // Today's card is fixed once chosen, so walking the graph mid-day can't swap it out.
  function todaysPick(uid, date) {
    const saved = q.pickFor.get(uid, date);
    if (saved) return saved.node_id;
    const last = q.lastWritten.get(uid);
    const pick = (last && q.neighbourPick.get({ last: last.node_id, uid })) || q.linePick.get(uid);
    if (!pick) return null;
    q.savePick.run(uid, date, pick.id);
    return pick.id;
  }

  const card = (n) => ({ id: n.id, type: n.type, field: n.field, title: n.title, thinker: n.thinker, year: n.year, prompt: n.prompt });

  // Before writing, the user sees only the card and the question. Everything else is behind "write first".
  function fullNode(n, uid) {
    return {
      ...card(n),
      plain_face: n.plain_face,
      source_face: n.source_face,
      source_citation: n.source_citation,
      source_url: n.source_url,
      entry: q.entry.get(uid, n.id) ?? null,
      neighbours: q.neighbours.all({ id: n.id }),
    };
  }

  function auth(req, res, next) {
    const user = q.userByToken.get(req.get('x-continuum-token') ?? '');
    if (!user) return res.status(401).json({ error: 'invite_required' });
    req.user = user;
    next();
  }

  app.get('/api/today', auth, (req, res) => {
    const date = localDate(req.query.date);
    const uid = req.user.id;
    const total = q.lineCount.get().n;
    const done = q.writtenCount.get(uid).n;
    const written = q.writtenOn.get(uid, date);
    let state, node;
    if (written) {
      state = 'done_today';
      node = fullNode(q.node.get(written.node_id), uid);
    } else {
      const pick = todaysPick(uid, date);
      state = pick ? 'write' : 'complete';
      node = pick ? card(q.node.get(pick)) : null;
    }
    q.insertEvent.run(uid, 'open', node?.id ?? null, date);
    res.json({ name: req.user.name, state, done, total, node });
  });

  app.post('/api/respond', auth, (req, res) => {
    const { node_id: nodeId, body } = req.body ?? {};
    const date = localDate(req.body?.date);
    const uid = req.user.id;
    const text = typeof body === 'string' ? body.trim() : '';
    if (!text) return res.status(400).json({ error: 'empty_response' });
    if (text.length > MAX_BODY) return res.status(400).json({ error: 'too_long' });
    if (q.writtenOn.get(uid, date)) return res.status(409).json({ error: 'already_answered_today' });
    if (todaysPick(uid, date) !== nodeId) return res.status(409).json({ error: 'not_todays_node' });
    q.insertEntry.run(uid, nodeId, text, date);
    q.insertEvent.run(uid, 'respond', nodeId, date);
    res.json({ node: fullNode(q.node.get(nodeId), uid) });
  });

  // The rabbit hole: any node opens fully, with no bottom enforced. The one exception is today's
  // unwritten card, which stays closed so the user still writes before they read.
  app.get('/api/node/:id', auth, (req, res) => {
    const node = q.node.get(req.params.id);
    if (!node) return res.status(404).json({ error: 'not_found' });
    const uid = req.user.id;
    const date = localDate(req.query.date);
    if (!q.writtenOn.get(uid, date) && q.pickFor.get(uid, date)?.node_id === node.id) {
      return res.json({ node: card(node), today: true });
    }
    q.insertEvent.run(uid, 'walk', node.id, date);
    res.json({ node: fullNode(node, uid) });
  });

  app.post('/api/event', auth, (req, res) => {
    const { kind, node_id: nodeId } = req.body ?? {};
    if (kind !== 'flip') return res.status(400).json({ error: 'bad_kind' });
    q.insertEvent.run(req.user.id, kind, typeof nodeId === 'string' ? nodeId : null, localDate(req.body?.date));
    res.json({ ok: true });
  });

  app.get('/api/journal', auth, (req, res) => {
    res.json({ journal: q.journal.all(req.user.id) });
  });

  // Retention view for Jack. Disabled unless CONTINUUM_ADMIN_KEY is set.
  app.get('/admin/api/stats', (req, res) => {
    if (!adminKey || req.get('x-admin-key') !== adminKey) return res.status(403).json({ error: 'forbidden' });
    const users = db.prepare('SELECT id, name, created_at FROM users ORDER BY id').all();
    const days = db.prepare('SELECT DISTINCT local_date FROM events WHERE user_id = ? ORDER BY local_date');
    const wrote = db.prepare('SELECT local_date FROM journal WHERE user_id = ? ORDER BY local_date');
    const walks = db.prepare("SELECT COUNT(*) AS n FROM events WHERE user_id = ? AND kind = 'walk'");
    const lastSeen = db.prepare('SELECT MAX(at) AS at FROM events WHERE user_id = ?');
    res.json({
      testers: users.map((u) => {
        const openDays = days.all(u.id).map((r) => r.local_date);
        return {
          name: u.name,
          invited_at: u.created_at,
          open_days: openDays,
          response_days: wrote.all(u.id).map((r) => r.local_date),
          walk_steps: walks.get(u.id).n,
          came_back: openDays.length > 1,
          last_seen: lastSeen.get(u.id).at,
        };
      }),
    });
  });

  app.use(express.static(PUBLIC_DIR, { extensions: ['html'] }));
  return app;
}
