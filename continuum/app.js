// Express app for Continuum. Kept separate from server.js so tests can mount it on an in-memory DB.
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { rooms } from './content/rooms.js';
import { themes } from './content/themes.js';
import { TYPES, FIELDS, RELS, REL_HELP } from './content/model.js';

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
    dropPick: db.prepare('DELETE FROM daily_pick WHERE user_id = ? AND local_date = ?'),
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
      SELECT n.id, n.title, n.thinker, n.field, j.body, j.local_date, r.value AS reaction FROM journal j
      JOIN nodes n ON n.id = j.node_id
      LEFT JOIN reactions r ON r.user_id = j.user_id AND r.node_id = j.node_id
      WHERE j.user_id = ? ORDER BY j.created_at, j.rowid`),
    favorites: db.prepare(`
      SELECT n.id, n.title, n.thinker, n.field, n.source_face, n.source_citation, f.created_at FROM favorites f
      JOIN nodes n ON n.id = f.node_id WHERE f.user_id = ? ORDER BY f.created_at DESC`),
    isFavorite: db.prepare('SELECT 1 FROM favorites WHERE user_id = ? AND node_id = ?'),
    addFavorite: db.prepare('INSERT OR IGNORE INTO favorites (user_id, node_id) VALUES (?, ?)'),
    removeFavorite: db.prepare('DELETE FROM favorites WHERE user_id = ? AND node_id = ?'),
    reaction: db.prepare('SELECT value FROM reactions WHERE user_id = ? AND node_id = ?'),
    setReaction: db.prepare(`INSERT INTO reactions (user_id, node_id, value, local_date) VALUES (?, ?, ?, ?)
      ON CONFLICT(user_id, node_id) DO UPDATE SET value = excluded.value, local_date = excluded.local_date`),
    // Review: entries in a date range, the nodes walked to most, and the practices those walks landed on.
    entriesBetween: db.prepare(`
      SELECT n.id, n.title, n.thinker, n.field, n.prompt, j.body, j.local_date, r.value AS reaction FROM journal j
      JOIN nodes n ON n.id = j.node_id
      LEFT JOIN reactions r ON r.user_id = j.user_id AND r.node_id = j.node_id
      WHERE j.user_id = ? AND j.local_date BETWEEN ? AND ? ORDER BY j.local_date, j.rowid`),
    walkedBetween: db.prepare(`
      SELECT n.id, n.title, n.thinker, n.field, n.type, COUNT(*) AS count FROM events v
      JOIN nodes n ON n.id = v.node_id
      WHERE v.user_id = ? AND v.kind = 'walk' AND v.local_date BETWEEN ? AND ?
      GROUP BY n.id ORDER BY count DESC, MAX(v.at) DESC`),
    // Timeline: every idea node in date order, with this user's relation to it.
    timeline: db.prepare(`
      SELECT n.id, n.title, n.thinker, n.year, n.field, n.type, n.seq, n.room, n.image,
        EXISTS (SELECT 1 FROM journal j WHERE j.user_id = :uid AND j.node_id = n.id) AS written,
        EXISTS (SELECT 1 FROM events v WHERE v.user_id = :uid AND v.kind = 'walk' AND v.node_id = n.id) AS visited
      FROM nodes n WHERE n.type != 'practice'
      ORDER BY n.year, n.seq IS NULL, n.seq, n.thinker, n.title`),
    searchable: db.prepare(`SELECT id, title, thinker, plain_face, source_face, prompt, opinions FROM nodes WHERE type != 'practice'`),
    reactionCounts: db.prepare(`
      SELECT value, COUNT(*) AS n FROM reactions WHERE user_id = ? AND local_date BETWEEN ? AND ? GROUP BY value`),
    daysActive: db.prepare(`SELECT COUNT(DISTINCT local_date) AS n FROM events WHERE user_id = ? AND local_date BETWEEN ? AND ?`),
    firstAndLast: db.prepare(`
      SELECT n.id, n.title, n.thinker, n.prompt, j.body, j.local_date FROM journal j JOIN nodes n ON n.id = j.node_id
      WHERE j.user_id = ? AND n.seq IS NOT NULL ORDER BY n.seq`),
  };

  // Index: which themes each idea belongs to.
  const themesByNode = new Map();
  for (const t of themes) for (const id of t.nodes) themesByNode.set(id, [...(themesByNode.get(id) ?? []), { id: t.id, name: t.name, kind: t.kind }]);
  const themesOf = (id) => themesByNode.get(id) ?? [];

  const localDate = (raw) => (typeof raw === 'string' && DATE_RE.test(raw) ? raw : new Date().toISOString().slice(0, 10));
  const shiftDate = (ymd, delta) => {
    const [y, m, d] = ymd.split('-').map(Number);
    return new Date(Date.UTC(y, m - 1, d + delta)).toISOString().slice(0, 10);
  };

  // Today's card is fixed once chosen, so walking the graph mid-day can't swap it out.
  function todaysPick(uid, date) {
    const saved = q.pickFor.get(uid, date);
    // A remembered pick can go stale if that card was since written on another date (moving the test date back
    // and forth, or a clock change). Choose again rather than serve a card that is already answered.
    if (saved && !q.entry.get(uid, saved.node_id)) return saved.node_id;
    if (saved) q.dropPick.run(uid, date);
    const last = q.lastWritten.get(uid);
    const pick = (last && q.neighbourPick.get({ last: last.node_id, uid })) || q.linePick.get(uid);
    if (!pick) return null;
    q.savePick.run(uid, date, pick.id);
    return pick.id;
  }

  const card = (n) => ({ id: n.id, type: n.type, field: n.field, title: n.title, thinker: n.thinker, year: n.year, prompt: n.prompt });

  // Before writing, the user sees only the card and the question. Everything else is behind "write first".
  function fullNode(n, uid) {
    const entry = q.entry.get(uid, n.id) ?? null;
    return {
      ...card(n),
      plain_face: n.plain_face,
      source_face: n.source_face,
      source_citation: n.source_citation,
      source_url: n.source_url,
      analysis_url: n.analysis_url,
      // Both belong to the reveal: withheld until this user has written on the node, even when they walk to it.
      misreading: entry ? n.misreading : null,
      image: entry && n.image ? JSON.parse(n.image) : null,
      entry,
      favorite: Boolean(q.isFavorite.get(uid, n.id)),
      reaction: q.reaction.get(uid, n.id)?.value ?? null,
      neighbours: q.neighbours.all({ id: n.id }),
      themes: themesOf(n.id),
      room: n.room,
      as_of: n.as_of,
      // A court case's opinions, each with the older idea it echoes (if any) resolved for linking.
      opinions: n.opinions ? JSON.parse(n.opinions).map((o) => {
        const e = o.echoes && q.node.get(o.echoes);
        return { ...o, echoes: e ? { id: e.id, title: e.title, thinker: e.thinker, field: e.field } : null };
      }) : null,
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
      const n = pick ? q.node.get(pick) : null;
      // The closed card carries only the picture's address, shown faded behind the title as atmosphere.
      // The picture itself, with alt text and credit, belongs to the reveal after writing.
      node = n ? { ...card(n), backdrop: n.image ? JSON.parse(n.image).src : null } : null;
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
    if (q.entry.get(uid, nodeId) || todaysPick(uid, date) !== nodeId) return res.status(409).json({ error: 'not_todays_node' });
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
    res.json({ journal: q.journal.all(req.user.id), favorites: q.favorites.all(req.user.id) });
  });

  // "Keep this line": a favourite is a source passage the user wants to find again.
  app.post('/api/favorite', auth, (req, res) => {
    const { node_id: nodeId, on } = req.body ?? {};
    if (!q.node.get(nodeId)) return res.status(404).json({ error: 'not_found' });
    if (on === false) q.removeFavorite.run(req.user.id, nodeId); else q.addFavorite.run(req.user.id, nodeId);
    res.json({ favorite: on !== false });
  });

  // One question after reading: did the source change your mind? The answer steers the suggested next step.
  app.post('/api/reaction', auth, (req, res) => {
    const { node_id: nodeId, value } = req.body ?? {};
    const date = localDate(req.body?.date);
    if (!['changed', 'somewhat', 'unchanged'].includes(value)) return res.status(400).json({ error: 'bad_value' });
    if (!q.entry.get(req.user.id, nodeId)) return res.status(409).json({ error: 'write_first' });
    q.setReaction.run(req.user.id, nodeId, value, date);
    res.json({ reaction: value });
  });

  // Review of a span of days (default 7; 0 = everything): what you wrote, where you walked, what landed.
  app.get('/api/review', auth, (req, res) => {
    const uid = req.user.id;
    const to = localDate(req.query.date);
    const days = Number.isInteger(Number(req.query.days)) ? Number(req.query.days) : 7;
    const from = days > 0 ? shiftDate(to, 1 - days) : '0000-00-00';
    const walked = q.walkedBetween.all(uid, from, to);
    const counts = Object.fromEntries(q.reactionCounts.all(uid, from, to).map((r) => [r.value, r.n]));
    const line = q.firstAndLast.all(uid);
    res.json({
      from: days > 0 ? from : null, to, days,
      days_active: q.daysActive.get(uid, from, to).n,
      entries: q.entriesBetween.all(uid, from, to),
      walked: walked.filter((n) => n.type !== 'practice').slice(0, 8),
      practices: walked.filter((n) => n.type === 'practice'),
      reactions: { changed: counts.changed ?? 0, somewhat: counts.somewhat ?? 0, unchanged: counts.unchanged ?? 0 },
      bookends: line.length >= 2 ? { first: line[0], last: line[line.length - 1] } : null,
    });
  });

  // Timeline of everyone on the map. Daily cards the user has not reached yet keep their idea hidden (thinker and
  // year only, not clickable) so the daily practice still starts with writing; today's card links to Today.
  // Every idea with this user's relation to it. Daily cards not yet reached keep their idea hidden.
  function mapEntries(uid, date) {
    const todayId = q.writtenOn.get(uid, date) ? null : todaysPick(uid, date);
    return q.timeline.all({ uid }).map((n) => {
      const daily = n.seq != null;
      const state = n.written ? 'written' : n.id === todayId ? 'today' : daily ? 'upcoming' : n.visited ? 'visited' : 'unseen';
      const hidden = state === 'upcoming';
      return {
        id: n.id, thinker: n.thinker, year: n.year, field: n.field, type: n.type, room: n.room, daily, state,
        title: hidden ? null : n.title,
        // A daily card's picture, faded on its gallery tile, once the user has reached that card.
        backdrop: !hidden && n.image ? JSON.parse(n.image).src : null,
      };
    });
  }

  const practiceEntry = (id) => {
    const n = q.node.get(id);
    return n && n.type === 'practice'
      ? { id: n.id, title: n.title, thinker: null, year: null, field: 'practice', type: 'practice', daily: false, state: 'unseen' }
      : null;
  };

  app.get('/api/timeline', auth, (req, res) => {
    res.json({ nodes: mapEntries(req.user.id, localDate(req.query.date)), rooms });
  });

  // The index: themes, conflicts and dilemmas with the ideas they link, in date order.
  app.get('/api/themes', auth, (req, res) => {
    const byId = new Map(mapEntries(req.user.id, localDate(req.query.date)).map((n) => [n.id, n]));
    res.json({
      themes: themes.map((t) => ({
        id: t.id, kind: t.kind, name: t.name, question: t.question,
        // Practices are not on the gallery walls (no date) but belong in their themes, after the dated ideas.
        nodes: t.nodes.map((id) => byId.get(id) ?? practiceEntry(id)).filter(Boolean)
          .sort((a, b) => (a.year ?? Infinity) - (b.year ?? Infinity)),
      })),
    });
  });

  // Search across the index and every idea: titles, thinkers, both faces, prompts and court opinions. Ideas on
  // daily cards not yet reached are left out of the matches (they still show, hidden, inside their themes).
  app.get('/api/search', auth, (req, res) => {
    const raw = String(req.query.q ?? '').trim().toLowerCase().slice(0, 80);
    if (raw.length < 2) return res.json({ q: raw, themes: [], ideas: [] });
    const words = raw.split(/\s+/).filter(Boolean);
    const has = (text) => { const t = (text ?? '').toLowerCase(); return words.every((w) => t.includes(w)); };
    const entries = new Map(mapEntries(req.user.id, localDate(req.query.date)).map((n) => [n.id, n]));
    const themeHits = themes.filter((t) => has(`${t.name} ${t.question} ${t.kind}`))
      .map((t) => ({ id: t.id, kind: t.kind, name: t.name, question: t.question, count: t.nodes.length }));
    const ideaHits = [];
    for (const n of q.searchable.all()) {
      const e = entries.get(n.id);
      if (!e || e.state === 'upcoming') continue;
      const strong = has(`${n.title} ${n.thinker}`);
      const where = strong ? null : [['plain_face', 'the plain face'], ['source_face', 'the source'], ['prompt', 'the question'], ['opinions', 'a court opinion']]
        .find(([col]) => has(n[col]))?.[1];
      if (strong || where) ideaHits.push({ ...e, matched: where ?? 'title', rank: strong ? 0 : 1 });
    }
    ideaHits.sort((a, b) => a.rank - b.rank || a.year - b.year);
    res.json({ q: raw, themes: themeHits, ideas: ideaHits.slice(0, 40).map(({ rank, ...rest }) => rest) });
  });

  // Propose a connection (admin only). A proposal links two ideas, or brings in a new one (an artwork, a court case, a
  // news story, a thinker) and links it to the map. Nothing goes on the map from here: proposals queue up to be
  // verified and written into content/ in a later session (`npm run proposals` or the page's copy button).
  const isAdmin = (req) => Boolean(adminKey) && req.get('x-admin-key') === adminKey;
  const admin = (req, res, next) => (isAdmin(req) ? next() : res.status(403).json({ error: 'forbidden' }));
  const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

  function cleanEnd(v, label, errors) {
    if (typeof v === 'string') {
      if (!q.node.get(v)) errors.push(`${label}: unknown idea ${v}`);
      return { id: v };
    }
    if (!v || typeof v !== 'object') { errors.push(`${label}: pick an idea or describe a new one`); return null; }
    const idea = {
      title: str(v.title, 200), who: str(v.who, 160), field: str(v.field, 20), type: str(v.type, 20),
      year: Number.isInteger(Number(v.year)) && String(v.year).trim() !== '' ? Number(v.year) : null,
      description: str(v.description, 2000), as_of: str(v.as_of, 10) || null,
    };
    if (!idea.title) errors.push(`${label}: a new idea needs a title`);
    if (!FIELDS.includes(idea.field)) errors.push(`${label}: pick a kind (field)`);
    if (!TYPES.includes(idea.type)) errors.push(`${label}: pick a type`);
    if (idea.as_of && !DATE_RE.test(idea.as_of)) errors.push(`${label}: date must be YYYY-MM-DD`);
    return { new: idea };
  }

  app.get('/admin/api/model', admin, (req, res) => {
    res.json({
      types: TYPES, fields: FIELDS, relations: RELS.map((r) => ({ id: r, help: REL_HELP[r] })),
      themes: themes.map((t) => ({ id: t.id, name: t.name })),
      nodes: db.prepare('SELECT id, title, thinker, year, field, type FROM nodes ORDER BY year, thinker').all(),
    });
  });

  app.get('/admin/api/proposals', admin, (req, res) => {
    const rows = db.prepare('SELECT id, payload, status, reply, created_at, updated_at FROM proposals ORDER BY id DESC').all();
    res.json({ proposals: rows.map((r) => ({ ...r, payload: JSON.parse(r.payload) })) });
  });

  app.post('/admin/api/proposals', admin, (req, res) => {
    const b = req.body ?? {};
    const errors = [];
    const from = cleanEnd(b.from, 'Earlier idea', errors);
    const to = cleanEnd(b.to, 'Later idea', errors);
    const relation = str(b.relation, 20);
    if (!RELS.includes(relation)) errors.push('Pick how they connect');
    const why = str(b.why, 600);
    if (!why) errors.push('Say in a line why they connect');
    const sources = (Array.isArray(b.sources) ? b.sources : []).map((u) => str(u, 500)).filter(Boolean).slice(0, 10);
    if (sources.some((u) => !/^https?:\/\//.test(u))) errors.push('Sources must be web links (http or https)');
    const themeIds = (Array.isArray(b.themes) ? b.themes : []).filter((t) => themes.some((x) => x.id === t)).slice(0, 10);
    const newTheme = str(b.new_theme, 160) || null;
    if (from?.id && to?.id && from.id === to.id) errors.push('Pick two different ideas');
    if (errors.length) return res.status(400).json({ error: 'invalid', errors });
    const payload = { from, to, relation, why, sources, themes: themeIds, new_theme: newTheme };
    const { lastInsertRowid } = db.prepare('INSERT INTO proposals (payload) VALUES (?)').run(JSON.stringify(payload));
    res.json({ id: Number(lastInsertRowid) });
  });

  app.post('/admin/api/proposals/:id', admin, (req, res) => {
    const status = str(req.body?.status, 10);
    if (!['open', 'added', 'declined'].includes(status)) return res.status(400).json({ error: 'bad_status' });
    const r = db.prepare("UPDATE proposals SET status = ?, reply = ?, updated_at = datetime('now') WHERE id = ?")
      .run(status, str(req.body?.reply, 600) || null, Number(req.params.id));
    if (!r.changes) return res.status(404).json({ error: 'not_found' });
    res.json({ ok: true });
  });

  // Retention view for Jack. Disabled unless CONTINUUM_ADMIN_KEY is set.
  app.get('/admin/api/stats', admin, (req, res) => {
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
