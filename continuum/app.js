// Express app for Continuum. Kept separate from server.js so tests can mount it on an in-memory DB.
import express from 'express';
import { fileURLToPath } from 'node:url';
import { existsSync, readdirSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { dirname, join } from 'node:path';
import { rooms } from './content/rooms.js';
import { themes } from './content/themes.js';
import { TYPES, FIELDS, RELS, REL_HELP } from './content/model.js';
import { practiceSteps, SIZES, SIZE_ORDER, ARRIVE } from './content/practice_steps.js';
import { MAX_TEXT as TTS_MAX } from './tts.js';
import { stances, BASIS } from './content/stances.js';
import { systemBlocks, answer, referencedIds, MAX_USER_TEXT, MODES, writeProblem, writeHomework, noteViews, moderate, askBack, interviewStep, writePlan, checkIn } from './talk.js';
// Free college courses to go further (links only); absent until content/courses.js exists.
const { COURSES = [], COURSE_LINKS = {} } = await import('./content/courses.js').catch(() => ({}));
import { computeLayouts, ERAS, eraOf } from './map.js';
// Welcoming first questions, for a first day with nothing to go on yet: short, vivid, and open to anyone.
export const STARTERS = ['socrates_unexamined_life', 'plato_ring_of_gyges', 'nozick_experience_machine', 'singer_drowning_child', 'epictetus_up_to_us'];

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

export function createApp(db, { adminKey, tts = null, talk = null, talkDailyLimit = 80 } = {}) {
  db.exec(DAILY_PICK_TABLE);
  // Why the day's card was chosen, shown on the card.
  if (!db.prepare("SELECT 1 FROM pragma_table_info('daily_pick') WHERE name = 'why'").get()) db.exec('ALTER TABLE daily_pick ADD COLUMN why TEXT');
  const app = express();
  app.set('trust proxy', 1); // behind Render's (or a tunnel's) HTTPS proxy, links use https
  app.use(express.json({ limit: '32kb' }));

  const q = {
    userByToken: db.prepare('SELECT id, name, created_at FROM users WHERE token = ?'),
    visitDays: db.prepare("SELECT COUNT(DISTINCT local_date) AS n FROM events WHERE user_id = ? AND kind = 'open'"),
    lineCount: db.prepare('SELECT COUNT(*) AS n FROM nodes WHERE seq IS NOT NULL'),
    node: db.prepare('SELECT * FROM nodes WHERE id = ?'),
    pickFor: db.prepare('SELECT node_id, why FROM daily_pick WHERE user_id = ? AND local_date = ?'),
    savePick: db.prepare('INSERT INTO daily_pick (user_id, local_date, node_id, why) VALUES (?, ?, ?, ?)'),
    dropPick: db.prepare('DELETE FROM daily_pick WHERE user_id = ? AND local_date = ?'),
    lastWritten: db.prepare('SELECT node_id FROM journal WHERE user_id = ? ORDER BY created_at DESC, rowid DESC LIMIT 1'),
    // Daily pick (concept doc): an unvisited neighbour of yesterday's node, else the next node in the starter line.
    // "Unvisited" = not written; among those, prefer ones the user hasn't already walked to and read.
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
      WHERE j.user_id = ? ORDER BY j.local_date, j.created_at`),
  };

  // The diary of discovery: notes, and what they connect to.
  const dq = {
    noteOn: db.prepare('SELECT body FROM notes WHERE user_id = ? AND node_id = ?'),
    saveNote: db.prepare(`INSERT INTO notes (user_id, node_id, body, local_date) VALUES (?, ?, ?, ?)
      ON CONFLICT (user_id, node_id) DO UPDATE SET body = excluded.body, local_date = excluded.local_date, updated_at = datetime('now')`),
    deleteNote: db.prepare('DELETE FROM notes WHERE user_id = ? AND node_id = ?'),
    notes: db.prepare(`SELECT n.id, n.title, n.thinker, n.field, t.body, t.local_date, t.updated_at FROM notes t JOIN nodes n ON n.id = t.node_id
      WHERE t.user_id = ? ORDER BY t.updated_at DESC`),
    answers: db.prepare(`SELECT n.id, n.title, n.thinker, n.field, n.prompt, j.body, j.local_date, j.created_at FROM journal j
      JOIN nodes n ON n.id = j.node_id WHERE j.user_id = ? ORDER BY j.created_at DESC`),
    walked: db.prepare("SELECT DISTINCT node_id AS id FROM events WHERE user_id = ? AND kind = 'walk' AND node_id IS NOT NULL"),
    edges: db.prepare('SELECT from_id, to_id, relation, note FROM edges'),
  };

  const aq = {
    // Ideas that can be a daily card: not written on yet, not a practice, with a question.
    pool: db.prepare(`SELECT n.id, n.room, EXISTS (SELECT 1 FROM events v WHERE v.user_id = :uid AND v.kind = 'walk' AND v.node_id = n.id) AS walked
      FROM nodes n WHERE n.type != 'practice' AND n.prompt IS NOT NULL AND n.prompt != ''
        AND NOT EXISTS (SELECT 1 FROM journal j WHERE j.user_id = :uid AND j.node_id = n.id) ORDER BY n.id`),
    adaptiveCount: db.prepare('SELECT COUNT(*) AS n FROM journal WHERE user_id = ?'),
    writtenRooms: db.prepare('SELECT DISTINCT n.room FROM journal j JOIN nodes n ON n.id = j.node_id WHERE j.user_id = ? AND n.room IS NOT NULL'),
    writtenDays: db.prepare('SELECT DISTINCT local_date FROM journal WHERE user_id = ? ORDER BY local_date DESC'),
    firstDay: db.prepare('SELECT MIN(local_date) AS d FROM journal WHERE user_id = ?'),
    metCount: db.prepare(`SELECT COUNT(*) AS n FROM (
      SELECT node_id FROM journal WHERE user_id = :uid UNION SELECT node_id FROM favorites WHERE user_id = :uid
      UNION SELECT node_id FROM notes WHERE user_id = :uid
      UNION SELECT node_id FROM events WHERE user_id = :uid AND kind = 'walk' AND node_id IS NOT NULL)`),
  };

  // Room backgrounds: public/img/rooms/<room id>.webp (or .jpg, .png). Decorative, so no alt text; picked up at start.
  const ROOM_IMG_DIR = new URL('./public/img/rooms/', import.meta.url);
  const roomBg = new Map();
  for (const r of rooms) for (const ext of ['webp', 'jpg', 'png']) {
    if (existsSync(new URL(`${r.id}.${ext}`, ROOM_IMG_DIR))) { roomBg.set(r.id, `/img/rooms/${r.id}.${ext}`); break; }
  }
  // Daily-life scenes (public/img/spares/) take turns with a room's own plate, one per day, where they fit the room.
  const SPARE_DIR = new URL('./public/img/spares/', import.meta.url);
  const ROOM_ROTATION = {
    nineteenth: ['daily_station', 'daily_bridge_rain', 'daily_laundry_yard', 'daily_fish_market'],
    twentieth: ['daily_tram_snow', 'daily_cafe_terrace', 'daily_library_steps', 'daily_bakery_window'],
    culture: ['daily_fish_market', 'daily_cafe_terrace', 'daily_laundry_yard', 'daily_bakery_window'],
    now: ['daily_station', 'daily_bridge_rain', 'daily_tram_snow', 'daily_library_steps'],
  };
  const roomRotation = new Map();
  for (const [room, names] of Object.entries(ROOM_ROTATION)) {
    const own = roomBg.get(room);
    const extra = names.filter((f) => existsSync(new URL(`${f}.webp`, SPARE_DIR))).map((f) => `/img/spares/${f}.webp`);
    if (own && extra.length) roomRotation.set(room, [own, ...extra]);
  }
  const roomBgOn = (room, date) => {
    const list = roomRotation.get(room);
    if (!list) return roomBg.get(room) ?? null;
    return list[Math.floor(Date.parse(`${date}T00:00:00Z`) / 86400000) % list.length];
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
    const pick = adaptivePick(uid, date);
    if (!pick) return null;
    q.savePick.run(uid, date, pick.id, pick.why ?? null);
    return pick.id;
  }

  // Each day's card comes from the whole map, from the first day: their journey from the debates first, then the
  // user's own discoveries (the same scoring as the diary's roads), preferring ideas they have not yet read. Every
  // fifth day is a gentle challenge instead: an idea from a room they have never written in. With nothing to go on
  // yet (no debates answered, nothing written), the first days open with one of a few welcoming questions.
  function adaptivePick(uid, date) {
    const pool = aq.pool.all({ uid });
    if (!pool.length) return null;
    const d = discovery(uid, () => false);
    const fresh = pool.filter((n) => !n.walked);
    const inPool = new Set(pool.map((n) => n.id));
    // A problem they are working through comes first: the next idea on the course it set, not yet written on.
    for (const c of kq.started.all(uid)) {
      const route = JSON.parse(c.route); const k = route.findIndex((r) => inPool.has(r.id) && fresh.some((n) => n.id === r.id));
      if (k >= 0) return { id: route[k].id, why: `For what you are working through ("${c.title}"), step ${k + 1} of ${route.length}: ${route[k].why}` };
    }
    // What they have been talking about lately comes first: an idea that bears on a view, goal or question they
    // voiced in the last week, not yet written on (fresh ones first).
    for (const v of vq.since.all(uid, shiftDay(date, -7))) {
      const ids = JSON.parse(v.ideas).filter((id) => inPool.has(id));
      const id = ids.find((x) => fresh.some((n) => n.id === x)) ?? ids[0];
      if (id) return { id, why: `You talked about ${v.topic} (${v.local_date}). This idea speaks to it.` };
    }
    // Then a journey they started on the Map: its next stop not yet written on.
    const trail = trq.get.get(uid);
    if (trail) {
      const ids = JSON.parse(trail.ids); const k = ids.findIndex((id) => inPool.has(id));
      if (k >= 0) return { id: ids[k], why: `On the journey you started from "${q.node.get(trail.from_id)?.title ?? 'the Map'}": stop ${k + 1} of ${ids.length}.` };
    }
    // Then their journey from the debates: the next stop they have not written on.
    for (const stop of journeyFor(uid).stops) {
      for (const [card, why] of [[stop.shares, 'makes the case that spoke to you, at its best'], [stop.differs, 'makes the other camp\'s case, at its best']]) {
        if (card && inPool.has(card.id)) return { id: card.id, why: `From your journey: on "${stop.question}", this one ${why}.` };
      }
    }
    const adaptiveDays = aq.adaptiveCount.get(uid).n;
    if (!adaptiveDays && !d.met.size) {
      const start = STARTERS.filter((id) => inPool.has(id));
      if (start.length) return { id: start[hash(`${uid}|start`) % start.length], why: 'A first question, to begin anywhere.' };
    }
    if (adaptiveDays % 5 === 4) {
      const wroteIn = new Set(aq.writtenRooms.all(uid).map((r) => r.room));
      const away = (fresh.length ? fresh : pool).filter((n) => n.room && !wroteIn.has(n.room));
      if (away.length) {
        const n = away[hash(`${uid}|${date}|away`) % away.length];
        return { id: n.id, why: `A gentle challenge: you have not yet written in ${roomName.get(n.room) ?? 'this room'}. The same questions look different from here.` };
      }
    }
    for (const list of [fresh, pool]) {
      const best = d.rank(list.map((n) => n.id))[0];
      if (best) return { id: best.id, why: best.why };
    }
    const list = fresh.length ? fresh : pool;
    return { id: list[hash(`${uid}|${date}`) % list.length].id, why: null };
  }

  const card = (n) => ({ id: n.id, type: n.type, field: n.field, title: n.title, thinker: n.thinker, year: n.year, prompt: n.prompt, daily: n.seq != null });

  // Before writing, the user sees only the card and the question. Everything else is behind "write first".
  function fullNode(n, uid, date = localDate()) {
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
      note: dq.noteOn.get(uid, n.id)?.body ?? null,
      favorite: Boolean(q.isFavorite.get(uid, n.id)),
      reaction: q.reaction.get(uid, n.id)?.value ?? null,
      neighbours: q.neighbours.all({ id: n.id }),
      themes: themesOf(n.id),
      room: n.room,
      // Behind the stage: the idea's own picture once it is revealed, otherwise its room's.
      background: (entry && n.image ? JSON.parse(n.image).src : null) ?? roomBgOn(n.room, date),
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

  // The user's walk so far: which day of it this is (days they wrote, counting today), ideas met, and the current run
  // of consecutive writing days (ending today, or yesterday if today is not written yet).
  function journey(uid, date, writtenToday) {
    const days = aq.writtenDays.all(uid).map((r) => r.local_date);
    let streak = 0;
    for (let d = writtenToday ? date : shiftDay(date, -1); days.includes(d); d = shiftDay(d, -1)) streak++;
    return { day: days.length + (writtenToday ? 0 : 1), met: aq.metCount.get({ uid }).n, streak };
  }
  const shiftDay = (d, n) => new Date(Date.parse(`${d}T00:00:00Z`) + n * 86400000).toISOString().slice(0, 10);

  app.get('/api/today', auth, (req, res) => {
    const date = localDate(req.query.date);
    const uid = req.user.id;
    const total = q.lineCount.get().n;
    const done = q.writtenCount.get(uid).n;
    const written = q.writtenOn.get(uid, date);
    let state, node;
    if (written) {
      state = 'done_today';
      node = fullNode(q.node.get(written.node_id), uid, date);
    } else {
      const pick = todaysPick(uid, date);
      state = pick ? 'write' : 'complete';
      const n = pick ? q.node.get(pick) : null;
      // The closed card carries only the picture's address, shown faded behind the title as atmosphere.
      // The picture itself, with alt text and credit, belongs to the reveal after writing.
      node = n ? { ...card(n), backdrop: n.image ? JSON.parse(n.image).src : null, why: q.pickFor.get(uid, date)?.why ?? null } : null;
    }
    q.insertEvent.run(uid, 'open', node?.id ?? null, date);
    const due = kq.due.get(uid, shiftDay(date, -CHECKIN_DAYS));
    const checkin = due ? { id: due.id, title: due.title, question: lastQuestion(due) } : null;
    // Days they have opened Continuum (counting today): the first few times it asks what brought them.
    const visits = q.visitDays.get(uid).n;
    res.json({ name: req.user.name, state, done, total, node, journey: journey(uid, date, Boolean(written)), checkin, visits });
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
    db.prepare("INSERT OR IGNORE INTO recall (user_id, node_id, step, due_date) VALUES (?, ?, 0, date(?, '+1 day'))").run(uid, nodeId, date);
    q.insertEvent.run(uid, 'respond', nodeId, date);
    const answered = q.node.get(nodeId);
    noteFrom(uid, date, text, `Their answer to "${answered.prompt}" (on "${answered.title}"), written before reading it.`, 'answer');
    res.json({ node: fullNode(answered, uid, date) });
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
    res.json({ node: fullNode(node, uid, date) });
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

  // A discovery note on any idea: one per idea, editable; saving an empty note removes it.
  app.post('/api/note', auth, (req, res) => {
    const { node_id: nodeId, body } = req.body ?? {};
    const date = localDate(req.body?.date);
    if (!q.node.get(nodeId)) return res.status(404).json({ error: 'not_found' });
    const text = typeof body === 'string' ? body.trim() : '';
    if (text.length > MAX_BODY) return res.status(400).json({ error: 'too_long' });
    if (text) dq.saveNote.run(req.user.id, nodeId, text, date); else dq.deleteNote.run(req.user.id, nodeId);
    res.json({ note: text || null });
  });
  // After a note: one question back, to learn about themselves and the idea. What they say to it is added to the note.
  app.post('/api/note/question', auth, async (req, res) => {
    const n = q.node.get(req.body?.node_id);
    const note = dq.noteOn.get(req.user.id, n?.id)?.body;
    if (!n || !note) return res.status(404).json({ error: 'not_found' });
    if (!talk) return res.json({ question: null });
    try {
      const question = await askBack(talk, { note: clip(note, 3000), idea: n, views: viewsText(req.user.id) });
      res.json({ question });
    } catch (e) { console.warn(`Asking back: ${e.status ?? ''} ${e.message}`); res.json({ question: null }); }
  });
  app.post('/api/note/reply', auth, (req, res) => {
    const { node_id: nodeId, question, reply } = req.body ?? {};
    const old = dq.noteOn.get(req.user.id, nodeId)?.body;
    const said = typeof reply === 'string' ? reply.trim() : '';
    if (!old || !said || typeof question !== 'string') return res.status(400).json({ error: 'bad_reply' });
    const date = localDate(req.body?.date);
    const body = `${old}\n\nContinuum asked: ${clip(question, 400)}\nI said: ${said}`.slice(0, MAX_BODY);
    dq.saveNote.run(req.user.id, nodeId, body, date);
    noteFrom(req.user.id, date, said, `Their reply to the question "${clip(question, 300)}", asked after their note on "${q.node.get(nodeId)?.title}".`, 'note');
    res.json({ note: body });
  });

  // Thread sentences for the diary: which side of the link comes first, and the verb.
  const THREAD = {
    taught: ['a', 'taught', 'b'], extended: ['b', 'built on', 'a'], refuted: ['b', 'argued against', 'a'],
    converged: ['a', 'and', 'b', 'reached the same idea separately'], measured: ['b', 'put to the test', 'a'],
    secularized: ['b', 'kept the practice of', 'a'], lands_on: ['a', 'lands on the practice', 'b'], echoes: ['b', 'echoes', 'a'],
  };
  const STOP = new Set(('about above after again against among because before being below between could didn doesn during every '
    + 'from have having into itself just like make more most much myself never only other ought ourselves over really same '
    + 'should since some such than that their them themselves then there these they thing things think this those through '
    + 'under until very what when where which while whom whose will with would your yours yourself always maybe still '
    + 'something someone anything nothing everything people person world life lives being kind sort part seems seem today '
    + 'idea ideas whole first last also even well good great little lot back come comes take takes makes made know knows').split(' '));
  // Words of five letters or more, minus common ones, as stem -> the word as written ("choices" and "choice" match).
  const words = (text) => {
    const out = new Map();
    for (const w of text.toLowerCase().match(/\p{L}{5,}/gu) ?? []) {
      const stem = w.replace(/(ies|es|s)$/, (m) => (m === 'ies' ? 'y' : ''));
      if (!STOP.has(w) && !STOP.has(stem) && stem.length >= 4 && !out.has(stem)) out.set(stem, w);
    }
    return out;
  };

  // What the user has met and written, and a ranking of other ideas by how well they follow from it: links to what
  // they met, the themes of what they wrote about, and the words they used in their own notes and answers. Each
  // ranked idea comes with the reason, in their terms. hidden(id) = a daily card not reached yet (never counted).
  function discovery(uid, hidden) {
    const answers = dq.answers.all(uid);
    const notes = dq.notes.all(uid);
    const kept = q.favorites.all(uid);
    // How much each idea they met seems to matter: wrote or noted (3), kept (2), walked (1).
    const met = new Map();
    const bump = (id, w) => { if (!hidden(id)) met.set(id, Math.max(met.get(id) ?? 0, w)); };
    for (const r of dq.walked.all(uid)) bump(r.id, 1);
    for (const r of kept) bump(r.id, 2);
    for (const r of [...answers, ...notes]) bump(r.id, 3);
    const title = (id) => q.node.get(id)?.title;
    const edges = dq.edges.all();
    const writings = [...notes.map((n) => ({ ...n, kind: 'note' })), ...answers.map((a) => ({ ...a, kind: 'answer' }))];
    const vocab = new Map(); // stem -> { word as they wrote it, the writing it came from (most recent first) }
    for (const w of writings) for (const [stem, word] of words(w.body)) if (!vocab.has(stem)) vocab.set(stem, { word, from: w });
    const themeWeight = new Map();
    for (const w of writings) for (const t of themesOf(w.id)) themeWeight.set(t.id, (themeWeight.get(t.id) ?? 0) + 1);
    const rank = (ids) => ids.filter((id) => !met.has(id)).map((id) => {
      const n = q.node.get(id);
      let score = 0; const links = [];
      for (const ed of edges) {
        const other = ed.from_id === id ? ed.to_id : ed.to_id === id ? ed.from_id : null;
        if (other && met.has(other)) { score += met.get(other) >= 3 ? 2 : 1; links.push(other); }
      }
      const shared = themesOf(id).filter((t) => themeWeight.has(t.id)).sort((x, y) => themeWeight.get(y.id) - themeWeight.get(x.id));
      score += 1.5 * Math.min(2, shared.length);
      const own = words(`${n.title} ${n.plain_face}`);
      const hits = [...vocab.keys()].filter((w) => own.has(w));
      score += 2.5 * Math.min(2, hits.length); // their own words count most
      let why = null;
      const linked = [...new Set(links)].sort((x, y) => met.get(y) - met.get(x));
      if (hits.length) {
        const { word, from } = vocab.get(hits[0]);
        why = `You wrote "${word}" in your ${from.kind} on "${from.title}". This idea takes that word somewhere new.`;
      } else if (linked.length >= 2) why = `It connects "${title(linked[0])}" and "${title(linked[1])}", two ideas you have met.`;
      else if (linked.length) why = `It is linked to "${title(linked[0])}", which you ${met.get(linked[0]) >= 3 ? 'wrote about' : 'met'}.`;
      else if (shared.length) why = `Another answer to "${shared[0].name}", a question your writing keeps returning to.`;
      return { id, title: n.title, thinker: n.thinker, year: n.year, field: n.field, type: n.type, score, why, byWords: hits.length > 0 };
    }).filter((r) => r.score > 0 && r.why).sort((x, y) => y.score - x.score || x.id.localeCompare(y.id));
    return { answers, notes, kept, met, edges, title, rank };
  }

  // The diary of discovery: everything the user has written, the links they have found between the ideas they met,
  // and new roads, chosen from their own notes. Daily cards not yet reached are never suggested or named.
  app.get('/api/diary', auth, (req, res) => {
    const uid = req.user.id; const date = localDate(req.query.date);
    const entries = mapEntries(uid, date);
    const state = new Map(entries.map((e) => [e.id, e.state]));
    const { answers, notes, kept, met, edges, title, rank } = discovery(uid, (id) => state.get(id) === 'upcoming');

    // Threads: links between two ideas they have met, the ones they wrote about first.
    const threads = edges.filter((e) => met.has(e.from_id) && met.has(e.to_id))
      .sort((x, y) => (met.get(y.from_id) + met.get(y.to_id)) - (met.get(x.from_id) + met.get(x.to_id)))
      .slice(0, 8).map((e) => {
        const [first, verb, second, after] = THREAD[e.relation] ?? ['a', 'connects to', 'b'];
        const side = (k) => { const id = k === 'a' ? e.from_id : e.to_id; return { id, title: title(id) }; };
        return { first: side(first), verb, second: side(second), after: after ?? null, note: e.note };
      });

    // Roads: ideas not yet opened. Lead with the best one found through their own words, then the strongest others.
    const ranked = rank(entries.filter((e) => e.state === 'unseen').map((e) => e.id));
    const lead = ranked.find((r) => r.byWords);
    const roads = [lead, ...ranked.filter((r) => r !== lead)].filter(Boolean).slice(0, 3).map(({ byWords, ...r }) => r);

    // Entries: answers, notes, kept lines and highlights, newest first.
    const highlights = hq.all.all(uid);
    const items = [
      ...answers.map((a) => ({ kind: 'answer', id: a.id, title: a.title, thinker: a.thinker, field: a.field, prompt: a.prompt, body: a.body, date: a.local_date, at: a.created_at })),
      ...notes.map((n) => ({ kind: 'note', id: n.id, title: n.title, thinker: n.thinker, field: n.field, body: n.body, date: n.local_date, at: n.updated_at })),
      ...kept.map((f) => ({ kind: 'kept', id: f.id, title: f.title, thinker: f.thinker, field: f.field, body: firstLine(f.source_face) || f.title, date: f.created_at.slice(0, 10), at: f.created_at })),
      ...highlights.map((x) => ({ kind: 'highlight', hid: x.hid, id: x.id, title: x.title, thinker: x.thinker, field: x.field, body: x.body, date: x.created_at.slice(0, 10), at: x.created_at })),
    ].sort((x, y) => (y.date + y.at).localeCompare(x.date + x.at));
    const views = vq.recent.all(uid, 80).map((v) => ({ id: v.id, kind: v.kind, topic: v.topic, body: v.body, date: v.local_date, source: v.source }));
    res.json({ counts: { met: met.size, notes: notes.length, answers: answers.length, kept: kept.length + highlights.length }, roads, threads, entries: items, views, experience: experienceOf(uid) });
  });
  // A noted view can be taken out of the ledger (it was noted wrongly, or the user would rather it were not kept).
  app.delete('/api/views/:id', auth, (req, res) => {
    vq.drop.run(Number(req.params.id), req.user.id);
    res.json({ ok: true });
  });

  // "Keep this line": a favourite is a source passage the user wants to find again.
  app.post('/api/favorite', auth, (req, res) => {
    const { node_id: nodeId, on } = req.body ?? {};
    if (!q.node.get(nodeId)) return res.status(404).json({ error: 'not_found' });
    if (on === false) q.removeFavorite.run(req.user.id, nodeId); else q.addFavorite.run(req.user.id, nodeId);
    res.json({ favorite: on !== false });
  });

  // A highlight: any words the user chose on an idea's page and kept. The same words are kept once.
  const hq = {
    add: db.prepare('INSERT INTO highlights (user_id, node_id, body) VALUES (?, ?, ?)'),
    has: db.prepare('SELECT id FROM highlights WHERE user_id = ? AND node_id = ? AND body = ?'),
    drop: db.prepare('DELETE FROM highlights WHERE id = ? AND user_id = ?'),
    all: db.prepare(`SELECT h.id AS hid, n.id, n.title, n.thinker, n.field, h.body, h.created_at FROM highlights h JOIN nodes n ON n.id = h.node_id
      WHERE h.user_id = ? ORDER BY h.created_at DESC`),
  };
  app.post('/api/highlight', auth, (req, res) => {
    const { node_id: nodeId } = req.body ?? {};
    const text = typeof req.body?.text === 'string' ? req.body.text.replace(/\s+/g, ' ').trim() : '';
    if (!q.node.get(nodeId)) return res.status(404).json({ error: 'not_found' });
    if (text.length < 2 || text.length > 2000) return res.status(400).json({ error: 'bad_text' });
    const id = hq.has.get(req.user.id, nodeId, text)?.id ?? Number(hq.add.run(req.user.id, nodeId, text).lastInsertRowid);
    res.json({ id });
  });
  app.delete('/api/highlight/:id', auth, (req, res) => {
    hq.drop.run(Number(req.params.id), req.user.id);
    res.json({ ok: true });
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
      const state = n.written ? 'written' : n.id === todayId ? 'today' : n.visited ? 'visited' : 'unseen';
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

  // The Map: every idea on the walls laid out two ways (by influence, by meaning), worked out once at start-up.
  const mapQ = {
    nodes: db.prepare(`SELECT id, title, thinker, year, plain_face, prompt FROM nodes WHERE type != 'practice'`),
    edges: db.prepare(`SELECT e.from_id, e.to_id, e.relation FROM edges e JOIN nodes a ON a.id = e.from_id JOIN nodes b ON b.id = e.to_id
      WHERE a.type != 'practice' AND b.type != 'practice'`),
    // The road walked: each idea in the order first met (written about, or walked to).
    road: db.prepare(`SELECT node_id, MIN(d) AS d FROM (
        SELECT node_id, local_date AS d FROM journal WHERE user_id = :uid
        UNION ALL SELECT node_id, local_date AS d FROM events WHERE user_id = :uid AND kind = 'walk' AND node_id IS NOT NULL)
      GROUP BY node_id ORDER BY d, node_id`),
    fuzzy: db.prepare(`SELECT node_id FROM recall WHERE user_id = ? AND step = 0 AND last_date IS NOT NULL`),
  };
  const mapEdges = mapQ.edges.all();
  const trq = {
    get: db.prepare('SELECT from_id, ids, local_date FROM trails WHERE user_id = ?'),
    set: db.prepare(`INSERT INTO trails (user_id, from_id, ids, local_date) VALUES (?, ?, ?, ?)
      ON CONFLICT (user_id) DO UPDATE SET from_id = excluded.from_id, ids = excluded.ids, local_date = excluded.local_date`),
    drop: db.prepare('DELETE FROM trails WHERE user_id = ?'),
  };
  // Start a journey from the Map: up to six ideas in order (never today's unwritten card). It replaces any earlier one.
  app.post('/api/trail', auth, (req, res) => {
    const uid = req.user.id; const date = localDate(req.body?.date);
    const states = new Map(mapEntries(uid, date).map((e) => [e.id, e.state]));
    const from = String(req.body?.from_id ?? '');
    const ids = (Array.isArray(req.body?.ids) ? req.body.ids : []).map(String)
      .filter((id, i, a) => a.indexOf(id) === i && q.node.get(id) && states.get(id) !== 'today').slice(0, 6);
    if (!q.node.get(from) || !ids.length) return res.status(400).json({ error: 'bad_trail' });
    trq.set.run(uid, from, JSON.stringify(ids), date);
    // Let the journey lead from today, if today's card is not written yet.
    if (!q.writtenOn.get(uid, date)) q.dropPick.run(uid, date);
    res.json({ ok: true });
  });
  app.delete('/api/trail', auth, (req, res) => { trq.drop.run(req.user.id); res.json({ ok: true }); });
  const layouts = computeLayouts(mapQ.nodes.all(), mapEdges, themes);
  let lineOf = null; // each idea's first sentence, made on first use (firstLine is defined further down)
  app.get('/api/map', auth, (req, res) => {
    const uid = req.user.id;
    lineOf ??= new Map(mapQ.nodes.all().map((n) => [n.id, firstLine(n.plain_face).split(/(?<=[.!?])\s/)[0]]));
    const entries = mapEntries(uid, localDate(req.query.date));
    const hidden = new Set(entries.filter((n) => n.state === 'upcoming').map((n) => n.id));
    const fuzzy = new Set(mapQ.fuzzy.all(uid).map((r) => r.node_id));
    res.json({
      eras: ERAS.map(({ id, name }) => ({ id, name })),
      rooms: rooms.map(({ id, name }) => ({ id, name })),
      nodes: entries.map((n) => ({
        id: n.id, title: n.title, thinker: hidden.has(n.id) ? null : n.thinker, year: hidden.has(n.id) ? null : n.year,
        field: n.field ?? 'philosophy', room: n.room, state: n.state, era: hidden.has(n.id) ? null : eraOf(n.year),
        line: hidden.has(n.id) ? null : lineOf.get(n.id) ?? null, fuzzy: fuzzy.has(n.id),
        influence: layouts.influence[n.id], semantic: layouts.semantic[n.id],
      })),
      edges: mapEdges.map((e) => ({ from: e.from_id, to: e.to_id, relation: e.relation })),
      road: mapQ.road.all({ uid }).map((r) => r.node_id).filter((id) => !hidden.has(id)),
      trail: (() => { const t = trq.get.get(uid); return t ? { from: t.from_id, ids: JSON.parse(t.ids), since: t.local_date } : null; })(),
    });
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

  // ── Practice: wisdom is easy, practice is hard ────────────────────────────────────────────────────────────
  // A small daily exercise built from what the user keeps. The practice is chosen from the lines they kept (and,
  // more weakly, what they wrote on and walked to) by the practices those ideas land on; with no signal yet it is the
  // day's practice. Its size grows with the habit and shrinks after a gap, so the first step is always small.
  const pq = {
    practices: db.prepare("SELECT id, title, plain_face FROM nodes WHERE type = 'practice' ORDER BY id"),
    landings: db.prepare(`
      SELECT e.to_id AS practice, e.from_id AS node,
        EXISTS (SELECT 1 FROM favorites f WHERE f.user_id = :uid AND f.node_id = e.from_id) AS kept,
        EXISTS (SELECT 1 FROM journal j WHERE j.user_id = :uid AND j.node_id = e.from_id) AS wrote,
        EXISTS (SELECT 1 FROM events v WHERE v.user_id = :uid AND v.kind = 'walk' AND v.node_id = e.from_id) AS walked
      FROM edges e WHERE e.relation = 'lands_on'`),
    logs: db.prepare('SELECT local_date, practice_id, size, seconds FROM practice_log WHERE user_id = ? AND local_date <= ? ORDER BY local_date DESC LIMIT 60'),
    logOn: db.prepare('SELECT practice_id, size, seconds, intention FROM practice_log WHERE user_id = ? AND local_date = ?'),
    saveLog: db.prepare(`INSERT INTO practice_log (user_id, local_date, practice_id, size, seconds, intention) VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id, local_date) DO UPDATE SET practice_id = excluded.practice_id, size = excluded.size,
        seconds = excluded.seconds, intention = excluded.intention, created_at = datetime('now')`),
    openDays: db.prepare("SELECT COUNT(DISTINCT local_date) AS n FROM events WHERE user_id = ? AND kind = 'open' AND local_date BETWEEN ? AND ?"),
    keptFor: db.prepare(`
      SELECT n.id, n.title, n.thinker, n.source_face FROM favorites f JOIN nodes n ON n.id = f.node_id
      WHERE f.user_id = :uid AND (:practice IS NULL OR EXISTS (SELECT 1 FROM edges e WHERE e.from_id = n.id AND e.to_id = :practice AND e.relation = 'lands_on'))
      ORDER BY f.created_at DESC LIMIT 1`),
  };
  const WEEKDAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const daysBetween = (a, b) => Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86400000);
  const firstLine = (t) => (t ?? '').replace(/^(Summary|Short quotation) \([^)]*\):\s*/, '').split(/\s*…\s*|\n\n/)[0];

  function practicePlan(uid, date) {
    const practices = pq.practices.all();
    const weekday = WEEKDAY[new Date(`${date}T12:00:00Z`).getUTCDay()];
    const ofDay = practices.find((p) => p.plain_face.startsWith(`${weekday}'s practice`)) ?? practices[0];
    const logs = pq.logs.all(uid, date);
    const today = pq.logOn.get(uid, date);
    // Choose: what the user keeps counts three times, what they wrote on twice, where they walked once.
    const score = new Map(practices.map((p) => [p.id, 0]));
    for (const l of pq.landings.all({ uid })) if (score.has(l.practice)) score.set(l.practice, score.get(l.practice) + 3 * l.kept + 2 * l.wrote + l.walked);
    const lastDone = new Map(); for (const l of logs) if (!lastDone.has(l.practice_id)) lastDone.set(l.practice_id, l.local_date);
    const ranked = [...practices].sort((a, b) => score.get(b.id) - score.get(a.id)
      || (lastDone.get(a.id) ?? '') .localeCompare(lastDone.get(b.id) ?? ''));
    let chosen = today ? practices.find((p) => p.id === today.practice_id) : ranked[0];
    let reason = 'kept';
    if (!today && score.get(ranked[0].id) === 0) { chosen = ofDay; reason = 'weekday'; }
    // Don't repeat yesterday's practice when another is nearly as strong: variety keeps it alive.
    if (!today && reason === 'kept' && logs[0] && daysBetween(logs[0].local_date, date) === 1 && logs[0].practice_id === chosen.id) {
      const alt = ranked.find((p) => p.id !== chosen.id && score.get(p.id) >= score.get(chosen.id) - 2);
      if (alt) chosen = alt;
    }
    // Size: the habit ladder.
    const past = logs.filter((l) => l.local_date < date);
    let streak = 0;
    for (let i = 0, d = today ? date : past[0]?.local_date; i < past.length + 1 && d; i++) {
      const has = d === date ? Boolean(today) : past.some((l) => l.local_date === d);
      if (!has) break;
      streak++; d = new Date(Date.parse(`${d}T00:00:00Z`) - 86400000).toISOString().slice(0, 10);
    }
    const last = past[0];
    const gap = last ? daysBetween(last.local_date, date) : null;
    if (!today && gap > 1) streak = 0; // a run that ended before yesterday is over
    let size = last ? last.size : 'tiny';
    let nudge = null;
    const step = (dir) => SIZE_ORDER[Math.max(0, Math.min(2, SIZE_ORDER.indexOf(size) + dir))];
    if (!last) nudge = 'Start with ten seconds. That is the whole practice today.';
    else if (gap >= 3) { size = step(-1); nudge = 'Welcome back. Start small again: ten seconds is enough to begin.'; }
    else if (gap === 2) nudge = 'Yesterday slipped by. That happens; ten seconds today keeps the thread.';
    // Reluctance: opening the app most days but practising on few of them predicts skipping. Make today's step small.
    const from = new Date(Date.parse(`${date}T00:00:00Z`) - 6 * 86400000).toISOString().slice(0, 10);
    const opened = pq.openDays.get(uid, from, date).n;
    const practised = logs.filter((l) => l.local_date >= from).length;
    const reluctant = !today && opened >= 4 && practised * 2 < opened;
    if (reluctant) { size = 'tiny'; nudge ??= 'On busy days the smallest version is the one that sticks. Ten seconds.'; }
    const streakAtSize = (() => { let n = 0; for (const l of past) { if (l.size !== size) break; n++; } return n; })();
    const offerBigger = !today && size !== 'full' && gap === 1 && streakAtSize >= 3 ? step(1) : null;
    if (today) size = today.size;
    // The plate behind the practice carries the day's situation: done for today, coming back, a reluctant
    // stretch, or ready to grow. null = the usual one.
    const mood = today ? 'stillness' : last && gap >= 3 ? 'return' : reluctant ? 'patience' : offerBigger ? 'change' : null;
    const kept = pq.keptFor.get({ uid, practice: chosen.id }) ?? pq.keptFor.get({ uid, practice: null });
    return {
      practice: { id: chosen.id, title: chosen.title, plain_face: chosen.plain_face, steps: practiceSteps[chosen.id] ?? null },
      reason: reason === 'weekday' ? `${weekday}'s practice` : kept ? `Because you kept ${kept.thinker ? `${kept.thinker}'s line` : `"${kept.title}"`}` : 'Built from the ideas you have written on and walked to',
      size, sizes: SIZES, arrive: ARRIVE, nudge, offer_bigger: offerBigger, streak, done_today: today ?? null, mood,
      anchor: kept ? { id: kept.id, title: kept.title, thinker: kept.thinker, line: firstLine(kept.source_face) || kept.title } : null,
      choices: practices.map((p) => ({ id: p.id, title: p.title })),
    };
  }

  app.get('/api/practice', auth, (req, res) => {
    const date = localDate(req.query.date);
    const plan = practicePlan(req.user.id, date);
    if (req.query.practice && plan.choices.some((c) => c.id === req.query.practice)) {
      const p = pq.practices.all().find((x) => x.id === req.query.practice);
      plan.practice = { id: p.id, title: p.title, plain_face: p.plain_face, steps: practiceSteps[p.id] ?? null };
      plan.reason = 'Your choice today';
      const kept = pq.keptFor.get({ uid: req.user.id, practice: p.id });
      if (kept) plan.anchor = { id: kept.id, title: kept.title, thinker: kept.thinker, line: firstLine(kept.source_face) || kept.title };
    }
    res.json(plan);
  });

  app.post('/api/practice', auth, (req, res) => {
    const { practice_id: pid, size } = req.body ?? {};
    const date = localDate(req.body?.date);
    if (!pq.practices.all().some((p) => p.id === pid)) return res.status(400).json({ error: 'bad_practice' });
    if (!SIZE_ORDER.includes(size)) return res.status(400).json({ error: 'bad_size' });
    const seconds = Number.isFinite(Number(req.body?.seconds)) ? Math.max(0, Math.min(3600, Math.round(Number(req.body.seconds)))) : null;
    const intention = typeof req.body?.intention === 'string' ? req.body.intention.trim().slice(0, 500) || null : null;
    pq.saveLog.run(req.user.id, date, pid, size, seconds, intention);
    q.insertEvent.run(req.user.id, 'practice', pid, date);
    res.json(practicePlan(req.user.id, date));
  });

  // ── Compass: where the user's curiosity points, and a gentle challenge when their pattern looks one-sided ──
  // Signals are only what they do here (walks, reactions, kept lines); their writing is never judged.
  const cq = {
    walkedRooms: db.prepare(`SELECT n.room, n.field, COUNT(*) AS n FROM events v JOIN nodes n ON n.id = v.node_id
      WHERE v.user_id = ? AND v.kind = 'walk' AND n.type != 'practice' GROUP BY n.room, n.field`),
    recentReactions: db.prepare('SELECT node_id, value FROM reactions WHERE user_id = ? ORDER BY created_at DESC, rowid DESC LIMIT 4'),
    reactionOn: db.prepare('SELECT value FROM reactions WHERE user_id = ? AND node_id = ?'),
    signals: db.prepare(`SELECT n.id,
        EXISTS (SELECT 1 FROM favorites f WHERE f.user_id = :uid AND f.node_id = n.id) AS kept,
        EXISTS (SELECT 1 FROM journal j WHERE j.user_id = :uid AND j.node_id = n.id) AS wrote,
        EXISTS (SELECT 1 FROM events v WHERE v.user_id = :uid AND v.kind = 'walk' AND v.node_id = n.id) AS walked
      FROM nodes n WHERE n.type != 'practice'`),
    opponents: db.prepare(`SELECT CASE WHEN from_id = :id THEN to_id ELSE from_id END AS other FROM edges
      WHERE relation = 'refuted' AND (from_id = :id OR to_id = :id)`),
  };
  const roomName = new Map(rooms.map((r) => [r.id, r.name]));
  const themeName = new Map(themes.map((t) => [t.id, t.name]));
  // Stable per user and day, so the suggestion doesn't flicker on every visit.
  const hash = (str) => { let x = 2166136261; for (const ch of str) x = Math.imul(x ^ ch.charCodeAt(0), 16777619); return x >>> 0; };

  app.get('/api/compass', auth, (req, res) => {
    const uid = req.user.id; const date = localDate(req.query.date); const from = String(req.query.from ?? '');
    const entries = mapEntries(uid, date);
    const open = entries.filter((e) => e.state !== 'upcoming' && e.state !== 'today' && e.id !== from);
    const fresh = open.filter((e) => e.state === 'unseen');
    const pick = (list, salt) => (list.length ? list[hash(`${uid}|${date}|${salt}`) % list.length] : null);
    // Curiosity: the themes they return to, weighted by keeping (3), writing (2) and walking (1).
    const tScore = new Map();
    for (const s of cq.signals.all({ uid })) {
      const w = 3 * s.kept + 2 * s.wrote + s.walked; if (!w) continue;
      for (const t of themesOf(s.id)) tScore.set(t.id, (tScore.get(t.id) ?? 0) + w);
    }
    const topThemes = [...tScore.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([id]) => id);
    let curiosity = null;
    for (const tid of topThemes) {
      const cands = fresh.filter((e) => themesOf(e.id).some((t) => t.id === tid));
      const c = pick(cands, tid);
      if (c) { curiosity = { entry: c, why: `You keep coming back to "${themeName.get(tid)}". This one asks the same question another way.` }; break; }
    }
    // Challenges, in order of how clear the signal is.
    let challenge = null;
    const recent = cq.recentReactions.all(uid);
    const held = recent.filter((r) => r.value === 'unchanged').length;
    const here = from && cq.reactionOn.get(uid, from)?.value;
    const againstFor = (id) => cq.opponents.all({ id }).map((o) => o.other).map((oid) => open.find((e) => e.id === oid)).filter(Boolean);
    if (here === 'unchanged' || (recent.length >= 3 && held >= 3)) {
      const base = here === 'unchanged' ? from : recent.find((r) => r.value === 'unchanged').node_id;
      const baseTitle = q.node.get(base)?.title;
      const opp = pick(againstFor(base).filter((e) => e.state !== 'written'), 'held');
      if (opp) challenge = { entry: opp, kind: 'held', why: here === 'unchanged'
        ? 'You held your ground here. Strong views are worth testing against their best critic.'
        : `You held your ground on your last few readings. Here is someone who argued against "${baseTitle}".` };
      // The critic may be a daily card not reached yet (kept hidden). Offer a different voice on the same question,
      // from another room, instead.
      if (!challenge) {
        const baseNode = q.node.get(base);
        const shared = new Set(themesOf(base).map((t) => t.id));
        const other = pick(fresh.filter((e) => e.room !== baseNode?.room && themesOf(e.id).some((t) => shared.has(t.id))), 'held-theme');
        if (other) challenge = { entry: other, kind: 'held', why: `You held your ground on "${baseTitle}". Here is a very different answer to the same question.` };
      }
    }
    const walks = cq.walkedRooms.all(uid);
    const total = walks.reduce((a, r) => a + r.n, 0);
    if (!challenge && total >= 8) {
      const byRoom = new Map(); for (const r of walks) byRoom.set(r.room, (byRoom.get(r.room) ?? 0) + r.n);
      const [topRoom, topN] = [...byRoom.entries()].sort((a, b) => b[1] - a[1])[0];
      if (topN / total >= .6) {
        const elsewhere = fresh.filter((e) => e.room !== topRoom && !byRoom.has(e.room) && themesOf(e.id).some((t) => topThemes.includes(t.id)));
        const other = pick(elsewhere.length ? elsewhere : fresh.filter((e) => !byRoom.has(e.room)), 'room');
        if (other) challenge = { entry: other, kind: 'room', why: `Most of your walks stay in ${roomName.get(topRoom)}. The same questions look different from ${roomName.get(other.room)}.` };
      }
      if (!challenge) {
        const fields = new Set(walks.map((r) => r.field));
        const missing = ['religion', 'science', 'philosophy'].find((f) => !fields.has(f));
        const other = missing && pick(fresh.filter((e) => e.field === missing), 'field');
        if (other) challenge = { entry: other, kind: 'field', why: `You haven't walked into ${missing === 'religion' ? 'the religious traditions' : missing} yet. A different kind of answer to the same questions.` };
      }
    }
    if (challenge && curiosity && challenge.entry.id === curiosity.entry.id) curiosity = null;
    const practisedToday = Boolean(pq.logOn.get(uid, date));
    res.json({ curiosity, challenge, practice_nudge: practisedToday ? null : 'Ten seconds of practice' });
  });

  // Propose a connection (admin only). A proposal links two ideas, or brings in a new one (an artwork, a court case, a
  // news story, a thinker) and links it to the map. Nothing goes on the map from here: proposals queue up to be
  // verified and written into content/ in a later session (`npm run proposals` or the page's copy button).
  // The admin key, compared without stray spaces (a key copied from a dashboard often brings one along).
  const ADMIN = String(adminKey ?? '').trim();
  const isAdmin = (req) => {
    const given = String(req.get('x-admin-key') ?? '').trim();
    const ok = Boolean(ADMIN) && given === ADMIN;
    if (!ok && given) console.warn(`Admin key refused: ${ADMIN ? `the key given is ${given.length} characters, the server's is ${ADMIN.length}` : 'CONTINUUM_ADMIN_KEY is not set on the server'}.`);
    return ok;
  };
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
  // A personal link for someone new, made from the admin page (the same as `npm run invite`, for a hosted server).
  app.post('/admin/api/invite', admin, (req, res) => {
    const name = typeof req.body?.name === 'string' ? req.body.name.replace(/\s+/g, ' ').trim().slice(0, 40) : '';
    if (!name) return res.status(400).json({ error: 'name_required' });
    const token = randomBytes(12).toString('base64url');
    db.prepare('INSERT INTO users (token, name) VALUES (?, ?)').run(token, name);
    res.json({ name, link: `${req.protocol}://${req.get('host')}/?u=${token}` });
  });
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

  // ── The interview and the journey it suggests ──
  const sq = {
    all: db.prepare('SELECT stance_id, agree, basis FROM stances WHERE user_id = ?'),
    save: db.prepare(`INSERT INTO stances (user_id, stance_id, agree, basis) VALUES (?, ?, ?, ?)
      ON CONFLICT (user_id, stance_id) DO UPDATE SET agree = excluded.agree, basis = excluded.basis, updated_at = datetime('now')`),
    clear: db.prepare('DELETE FROM stances WHERE user_id = ? AND stance_id = ?'),
    log: db.prepare('INSERT INTO stance_history (user_id, stance_id, agree, local_date) VALUES (?, ?, ?, ?)'),
    lastOn: db.prepare('SELECT stance_id, MAX(local_date) AS d FROM stance_history WHERE user_id = ? GROUP BY stance_id'),
    one: db.prepare('SELECT agree, basis, updated_at FROM stances WHERE user_id = ? AND stance_id = ?'),
  };
  const stanceById = new Map(stances.map((q) => [q.id, q]));
  // The journey: the views held most firmly with the least looking-into come first. For each, a voice that shares the
  // view and gives it reasons, then one that sees it another way, then a practice. Views they are unsure of become
  // open questions. Nothing here judges: it only orders the road.
  function journeyFor(uid) {
    const answers = sq.all.all(uid);
    const weight = { instinct: 2, some: 1, thought: 0 };
    const card = (id) => { const n = q.node.get(id); return n && { id: n.id, title: n.title, thinker: n.thinker, field: n.field, type: n.type }; };
    const stops = answers.filter((a) => a.agree !== 0).map((a) => ({ a, st: stanceById.get(a.stance_id), w: Math.abs(a.agree) * 2 + (weight[a.basis] ?? 1) }))
      .filter((x) => x.st).sort((x, y) => y.w - x.w || x.st.id.localeCompare(y.st.id)).slice(0, 4).map(({ a, st }) => {
        const agrees = a.agree > 0;
        return {
          stance: st.id, question: st.question, agree: a.agree, basis: a.basis,
          lead: `On "${st.question}", ${(agrees ? st.a : st.b).who}'s case spoke to you${Math.abs(a.agree) === 2 ? ' clearly' : ' a little more'}.`,
          shares: card((agrees ? st.a : st.b).idea), differs: card((agrees ? st.b : st.a).idea), practice: card(st.practice),
        };
      });
    const open = answers.filter((a) => a.agree === 0).map((a) => stanceById.get(a.stance_id)).filter(Boolean)
      .map((st) => ({ stance: st.id, question: st.question, ideas: [card(st.a.idea), card(st.b.idea)] }));
    return { answered: answers.length, stops, open };
  }
  // Bearings: on every seventh day of the walk, once today is written, one debate comes back: the one not visited for
  // longest (never answered first). It shows the earlier choice, and asks again; a move is welcomed, not scored.
  app.get('/api/bearings', auth, (req, res) => {
    const uid = req.user.id; const date = localDate(req.query.date);
    const written = Boolean(q.writtenOn.get(uid, date));
    const j = journey(uid, date, written);
    const last = new Map(sq.lastOn.all(uid).map((r) => [r.stance_id, r.d]));
    // By the calendar, not the walk: a week or more since the last check (or since they started), on their next visit.
    const lastCheck = [...last.values()].sort().at(-1) ?? aq.firstDay.get(uid)?.d;
    if (!written || j.day < 3 || !lastCheck || daysBetween(lastCheck, date) < 7) return res.json({ due: false });
    const pick = [...stances].sort((x, y) => (last.get(x.id) ?? '').localeCompare(last.get(y.id) ?? '') || x.id.localeCompare(y.id))[0];
    const before = sq.one.get(uid, pick.id);
    res.json({ due: true, day: j.day, debate: { id: pick.id, question: pick.question, a: { who: pick.a.who, claim: pick.a.claim }, b: { who: pick.b.who, claim: pick.b.claim } },
      before: before ? { agree: before.agree, date: last.get(pick.id) ?? before.updated_at.slice(0, 10) } : null });
  });
  // ── Daily review: spaced recall of the ideas they wrote on, by calendar days ──
  const RECALL_DAYS = [1, 3, 7, 16, 35];
  const rq = {
    backfill: db.prepare(`INSERT OR IGNORE INTO recall (user_id, node_id, step, due_date)
      SELECT j.user_id, j.node_id, 0, date(j.local_date, '+1 day') FROM journal j WHERE j.user_id = ?`),
    due: db.prepare(`SELECT r.node_id, r.step, r.due_date, n.title, n.thinker, n.plain_face, n.prompt, j.body, j.local_date FROM recall r
      JOIN nodes n ON n.id = r.node_id JOIN journal j ON j.user_id = r.user_id AND j.node_id = r.node_id
      WHERE r.user_id = ? AND r.due_date <= ? AND j.local_date < ? AND r.step < ? AND (r.last_date IS NULL OR r.last_date < ?)
      ORDER BY r.due_date, j.local_date LIMIT 1`),
    get: db.prepare('SELECT step FROM recall WHERE user_id = ? AND node_id = ?'),
    set: db.prepare('UPDATE recall SET step = ?, due_date = ?, last_date = ? WHERE user_id = ? AND node_id = ?'),
    doneToday: db.prepare('SELECT 1 FROM recall WHERE user_id = ? AND last_date = ?'),
  };
  app.get('/api/recall', auth, (req, res) => {
    const uid = req.user.id; const date = localDate(req.query.date);
    rq.backfill.run(uid);
    if (rq.doneToday.get(uid, date)) return res.json({ due: null });
    const r = rq.due.get(uid, date, date, RECALL_DAYS.length, date);
    res.json({ due: r ? { id: r.node_id, title: r.title, thinker: r.thinker, line: firstLine(r.plain_face).split(/(?<=[.!?])\s/)[0], prompt: r.prompt, yours: r.body, wrote_on: r.local_date, step: r.step } : null });
  });
  app.post('/api/recall', auth, (req, res) => {
    const uid = req.user.id; const date = localDate(req.body?.date);
    const { node_id: id, result } = req.body ?? {};
    const row = rq.get.get(uid, id);
    if (!row || !['got', 'fuzzy'].includes(result)) return res.status(400).json({ error: 'bad_recall' });
    const step = result === 'got' ? row.step + 1 : 0;
    const next = step < RECALL_DAYS.length ? shiftDay(date, RECALL_DAYS[step]) : shiftDay(date, 3650);
    rq.set.run(step, next, date, uid, id);
    res.json({ step, next: step < RECALL_DAYS.length ? next : null });
  });

  // ── A problem to consider: one concrete situation that tests the idea, ending in a question. Written once by
  // Claude (when Talk is on) and kept; only for ideas the user may already read. ──
  const pq2 = { get: db.prepare('SELECT body FROM problems WHERE node_id = ?'), put: db.prepare('INSERT OR IGNORE INTO problems (node_id, body) VALUES (?, ?)') };
  const writing = new Map(); // node id -> the promise of a problem being written (so two requests share one call)
  app.get('/api/problem/:id', auth, async (req, res) => {
    const n = q.node.get(req.params.id);
    if (!n || n.type === 'practice') return res.status(404).json({ error: 'not_found' });
    const states = talkStates(req.user.id, localDate(req.query.date));
    if (hiddenIn(states, n)) return res.status(404).json({ error: 'not_found' });
    const have = pq2.get.get(n.id);
    if (have) return res.json({ problem: have.body });
    if (!talk) return res.json({ problem: null });
    try {
      if (!writing.has(n.id)) writing.set(n.id, writeProblem(talk, n).finally(() => writing.delete(n.id)));
      const body = await writing.get(n.id);
      if (body) pq2.put.run(n.id, body);
      res.json({ problem: body });
    } catch (e) { console.warn(`Problem for ${n.id}: ${e.status ?? ''} ${e.message}`); res.json({ problem: null }); }
  });

  // ── Homework sheets: one per idea, written once by Claude and kept for everyone, from the idea as Talk sees it. ──
  const hwq = {
    get: db.prepare('SELECT body FROM homework WHERE node_id = ?'),
    put: db.prepare('INSERT OR IGNORE INTO homework (node_id, body) VALUES (?, ?)'),
    answers: db.prepare('SELECT part, body, local_date FROM homework_answers WHERE user_id = ? AND node_id = ?'),
    answer: db.prepare(`INSERT INTO homework_answers (user_id, node_id, part, body, local_date) VALUES (?, ?, ?, ?, ?)
      ON CONFLICT (user_id, node_id, part) DO UPDATE SET body = excluded.body, local_date = excluded.local_date`),
    clear: db.prepare('DELETE FROM homework_answers WHERE user_id = ? AND node_id = ? AND part = ?'),
  };
  const PART_RE = /^(terms|reading_[0-9]|argument|objection|apply|essay)$/;
  const homeworkWriting = new Map();
  const coursesFor = (id) => (COURSE_LINKS[id] ?? []).map((cid) => COURSES.find((c) => c.id === cid)).filter(Boolean)
    .map(({ source, course, title, url }) => ({ source, course, title, url }));
  app.get('/api/homework/:id', auth, async (req, res) => {
    const uid = req.user.id; const date = localDate(req.query.date);
    const n = q.node.get(req.params.id);
    if (!n || n.type === 'practice') return res.status(404).json({ error: 'not_found' });
    if (hiddenIn(talkStates(uid, date), n)) return res.status(404).json({ error: 'not_found' });
    const answers = Object.fromEntries(hwq.answers.all(uid, n.id).map((a) => [a.part, a.body]));
    const base = { id: n.id, title: n.title, thinker: n.thinker, field: n.field ?? 'philosophy', answers, courses: coursesFor(n.id) };
    const have = hwq.get.get(n.id);
    if (have) return res.json({ ...base, sheet: JSON.parse(have.body) });
    if (!talk) return res.json({ ...base, sheet: null, talk: false });
    try {
      if (!homeworkWriting.has(n.id)) {
        homeworkWriting.set(n.id, writeHomework(talk, n, talkIdea(uid, date, new Map(), n.id)).finally(() => homeworkWriting.delete(n.id)));
      }
      const sheet = await homeworkWriting.get(n.id);
      if (sheet) hwq.put.run(n.id, JSON.stringify(sheet));
      res.json({ ...base, sheet });
    } catch (e) { console.warn(`Homework for ${n.id}: ${e.status ?? ''} ${e.message}`); res.json({ ...base, sheet: null }); }
  });
  app.post('/api/homework/:id', auth, (req, res) => {
    const uid = req.user.id; const date = localDate(req.body?.date);
    const n = q.node.get(req.params.id);
    const { part } = req.body ?? {};
    const body = typeof req.body?.body === 'string' ? req.body.body.trim().slice(0, 6000) : '';
    if (!n || n.type === 'practice' || hiddenIn(talkStates(uid, date), n)) return res.status(404).json({ error: 'not_found' });
    if (!PART_RE.test(part ?? '')) return res.status(400).json({ error: 'bad_part' });
    if (body) hwq.answer.run(uid, n.id, part, body, date); else hwq.clear.run(uid, n.id, part);
    res.json({ ok: true });
  });

  // ── The Parthenon: small invite-only groups, one topic at a time, with live posts from every member and Claude as a
  // moderator anyone can call on. A member shares the group's invite link; someone new joins with just a first name.
  const MAX_MEMBERS = 40;
  const gq = {
    group: db.prepare('SELECT * FROM groups WHERE id = ?'),
    byCode: db.prepare('SELECT * FROM groups WHERE invite_code = ?'),
    addGroup: db.prepare('INSERT INTO groups (name, invite_code, created_by) VALUES (?, ?, ?)'),
    member: db.prepare('SELECT 1 FROM group_members WHERE group_id = ? AND user_id = ?'),
    join: db.prepare('INSERT OR IGNORE INTO group_members (group_id, user_id) VALUES (?, ?)'),
    leave: db.prepare('DELETE FROM group_members WHERE group_id = ? AND user_id = ?'),
    count: db.prepare('SELECT COUNT(*) AS n FROM group_members WHERE group_id = ?'),
    members: db.prepare('SELECT u.id, u.name FROM group_members m JOIN users u ON u.id = m.user_id WHERE m.group_id = ? ORDER BY m.joined_at'),
    mine: db.prepare(`SELECT g.id, g.name, g.invite_code, (SELECT COUNT(*) FROM group_members x WHERE x.group_id = g.id) AS members
      FROM groups g JOIN group_members m ON m.group_id = g.id WHERE m.user_id = ? ORDER BY g.created_at DESC`),
    topics: db.prepare(`SELECT t.id, t.question, t.node_id, t.created_at, u.name AS by,
        (SELECT COUNT(*) FROM posts p WHERE p.topic_id = t.id) AS posts,
        (SELECT MAX(p.created_at) FROM posts p WHERE p.topic_id = t.id) AS last_at
      FROM topics t JOIN users u ON u.id = t.created_by WHERE t.group_id = ? ORDER BY COALESCE(last_at, t.created_at) DESC LIMIT 30`),
    topic: db.prepare('SELECT * FROM topics WHERE id = ?'),
    addTopic: db.prepare('INSERT INTO topics (group_id, question, node_id, created_by) VALUES (?, ?, ?, ?)'),
    posts: db.prepare(`SELECT p.id, p.user_id, p.body, p.refs, p.created_at, u.name FROM posts p LEFT JOIN users u ON u.id = p.user_id
      WHERE p.topic_id = ? ORDER BY p.id`),
    post: db.prepare(`SELECT p.id, p.user_id, p.body, p.refs, p.created_at, u.name FROM posts p LEFT JOIN users u ON u.id = p.user_id WHERE p.id = ?`),
    addPost: db.prepare('INSERT INTO posts (topic_id, user_id, body, refs) VALUES (?, ?, ?, ?)'),
    addUser: db.prepare('INSERT INTO users (token, name) VALUES (?, ?)'),
  };
  const code = () => randomBytes(9).toString('base64url');
  const cleanName = (x, max) => (typeof x === 'string' ? x.replace(/\s+/g, ' ').trim().slice(0, max) : '');
  const postOut = (p) => ({ id: p.id, mine: false, by: p.user_id == null ? null : p.name, user_id: p.user_id, moderator: p.user_id == null, body: p.body, refs: p.refs ? JSON.parse(p.refs) : null, at: p.created_at });
  // Live: everyone with a topic open holds a stream; a new post or someone writing is sent to all of them at once.
  const live = new Map(); // topic id -> Set of { res, uid }
  const broadcast = (topicId, msg) => { for (const c of live.get(topicId) ?? []) c.res.write(`${JSON.stringify(msg)}\n`); };
  const topicFor = (req, res) => {
    const t = gq.topic.get(Number(req.params.id));
    if (!t || !gq.member.get(t.group_id, req.user.id)) { res.status(404).json({ error: 'not_found' }); return null; }
    return t;
  };

  // Joining from an invite link: who invited you (no sign-in needed to see the group's name).
  app.get('/api/join/:code', (req, res) => {
    const g = gq.byCode.get(String(req.params.code));
    if (!g) return res.status(404).json({ error: 'not_found' });
    res.json({ group: g.name, members: gq.count.get(g.id).n, full: gq.count.get(g.id).n >= MAX_MEMBERS });
  });
  // Someone new joins with a first name, and gets their own Continuum (a personal link, kept on their phone).
  app.post('/api/join', (req, res) => {
    const g = gq.byCode.get(String(req.body?.code ?? ''));
    const name = cleanName(req.body?.name, 40);
    if (!g) return res.status(404).json({ error: 'not_found' });
    if (!name) return res.status(400).json({ error: 'name_required' });
    if (gq.count.get(g.id).n >= MAX_MEMBERS) return res.status(409).json({ error: 'group_full' });
    const token = randomBytes(12).toString('base64url');
    const uid = Number(gq.addUser.run(token, name).lastInsertRowid);
    gq.join.run(g.id, uid);
    res.json({ token, group_id: g.id });
  });
  // Someone already on Continuum joins a group from its link.
  app.post('/api/groups/join', auth, (req, res) => {
    const g = gq.byCode.get(String(req.body?.code ?? ''));
    if (!g) return res.status(404).json({ error: 'not_found' });
    if (!gq.member.get(g.id, req.user.id) && gq.count.get(g.id).n >= MAX_MEMBERS) return res.status(409).json({ error: 'group_full' });
    gq.join.run(g.id, req.user.id);
    res.json({ group_id: g.id });
  });
  app.get('/api/groups', auth, (req, res) => {
    res.json({ name: req.user.name, groups: gq.mine.all(req.user.id).map((g) => ({ ...g, topics: gq.topics.all(g.id) })) });
  });
  app.post('/api/groups', auth, (req, res) => {
    const name = cleanName(req.body?.name, 60);
    if (!name) return res.status(400).json({ error: 'name_required' });
    const id = Number(gq.addGroup.run(name, code(), req.user.id).lastInsertRowid);
    gq.join.run(id, req.user.id);
    res.json({ id });
  });
  app.post('/api/groups/:id/leave', auth, (req, res) => { gq.leave.run(Number(req.params.id), req.user.id); res.json({ ok: true }); });
  app.post('/api/groups/:id/topics', auth, (req, res) => {
    const g = gq.group.get(Number(req.params.id));
    if (!g || !gq.member.get(g.id, req.user.id)) return res.status(404).json({ error: 'not_found' });
    const question = cleanName(req.body?.question, 300);
    if (!question) return res.status(400).json({ error: 'question_required' });
    const n = req.body?.node_id ? q.node.get(String(req.body.node_id)) : null;
    const id = Number(gq.addTopic.run(g.id, question, n?.id ?? null, req.user.id).lastInsertRowid);
    res.json({ id });
  });
  app.get('/api/topics/:id', auth, (req, res) => {
    const t = topicFor(req, res); if (!t) return;
    const g = gq.group.get(t.group_id); const n = t.node_id ? q.node.get(t.node_id) : null;
    res.json({
      id: t.id, question: t.question, group: { id: g.id, name: g.name, invite_code: g.invite_code },
      idea: n ? { id: n.id, title: n.title, thinker: n.thinker, field: n.field } : null,
      members: gq.members.all(g.id).map((m) => m.name), me: req.user.id,
      posts: gq.posts.all(t.id).map(postOut), moderator: Boolean(talk),
    });
  });
  app.post('/api/topics/:id/posts', auth, (req, res) => {
    const t = topicFor(req, res); if (!t) return;
    const body = typeof req.body?.body === 'string' ? req.body.body.trim().slice(0, 4000) : '';
    if (!body) return res.status(400).json({ error: 'empty' });
    const p = gq.post.get(Number(gq.addPost.run(t.id, req.user.id, body, null).lastInsertRowid));
    broadcast(t.id, { t: 'post', post: postOut(p) });
    noteFrom(req.user.id, localDate(req.body?.date), body, `In a group discussion of: ${t.question}`, 'parthenon');
    res.json({ post: postOut(p) });
  });
  app.post('/api/topics/:id/typing', auth, (req, res) => {
    const t = topicFor(req, res); if (!t) return;
    broadcast(t.id, { t: 'typing', name: req.user.name, user_id: req.user.id });
    res.json({ ok: true });
  });
  const moderating = new Set();
  app.post('/api/topics/:id/moderator', auth, async (req, res) => {
    const t = topicFor(req, res); if (!t) return;
    if (!talk) return res.status(404).json({ error: 'talk_off' });
    const date = localDate(req.body?.date);
    if (tq.today.get(req.user.id, date).n >= talkDailyLimit) return res.status(429).json({ error: 'daily_limit' });
    if (moderating.has(t.id)) return res.status(409).json({ error: 'busy' });
    moderating.add(t.id);
    broadcast(t.id, { t: 'typing', name: 'Continuum', user_id: null });
    try {
      q.insertEvent.run(req.user.id, 'talk', null, date);
      const g = gq.group.get(t.group_id); const n = t.node_id ? q.node.get(t.node_id) : null;
      // The map as a list of ids and titles (the moderator names ideas by id; nothing about members' own walks).
      const catalogue = db.prepare("SELECT id, title FROM nodes ORDER BY id").all().map((x) => `${x.id} | ${x.title}`).join('\n');
      const posts = gq.posts.all(t.id).slice(-60).map((p) => `${p.user_id == null ? 'Moderator' : p.name}: ${clip(p.body, 900)}`).join('\n');
      const text = await moderate(talk, { group: g.name, question: t.question, idea: n ? `"${n.title}" (${n.thinker ?? n.field}): ${clip(n.plain_face, 600)}` : null, posts, catalogue });
      if (!text) return res.status(502).json({ error: 'no_reply' });
      const refs = Object.fromEntries(referencedIds(text).map((id) => q.node.get(id)).filter(Boolean).map((x) => [x.id, { title: x.title, type: x.type, field: x.field, thinker: x.thinker }]));
      const p = gq.post.get(Number(gq.addPost.run(t.id, null, text, JSON.stringify(refs)).lastInsertRowid));
      broadcast(t.id, { t: 'post', post: postOut(p) });
      res.json({ post: postOut(p) });
    } catch (e) {
      console.warn(`Moderator: ${e.status ?? ''} ${e.message}`);
      res.status(502).json({ error: 'moderator_failed' });
    } finally { moderating.delete(t.id); }
  });
  app.get('/api/topics/:id/live', auth, (req, res) => {
    const t = topicFor(req, res); if (!t) return;
    res.set({ 'content-type': 'application/x-ndjson; charset=utf-8', 'cache-control': 'no-store', 'x-accel-buffering': 'no' });
    res.flushHeaders?.();
    const c = { res, uid: req.user.id };
    if (!live.has(t.id)) live.set(t.id, new Set());
    live.get(t.id).add(c);
    res.write(`${JSON.stringify({ t: 'hello' })}\n`);
    const ping = setInterval(() => res.write(`${JSON.stringify({ t: 'ping' })}\n`), 20000);
    req.on('close', () => { clearInterval(ping); live.get(t.id)?.delete(c); });
  });

  app.get('/api/stance', auth, (req, res) => {
    const saved = Object.fromEntries(sq.all.all(req.user.id).map((a) => [a.stance_id, { agree: a.agree, basis: a.basis }]));
    res.json({ questions: stances.map((x) => ({ id: x.id, question: x.question, a: { who: x.a.who, claim: x.a.claim }, b: { who: x.b.who, claim: x.b.claim } })), basis: BASIS, saved, journey: journeyFor(req.user.id) });
  });
  app.post('/api/stance', auth, (req, res) => {
    const answers = Array.isArray(req.body?.answers) ? req.body.answers : [];
    for (const a of answers) {
      if (!stanceById.has(a?.id)) return res.status(400).json({ error: 'bad_stance' });
      if (a.agree === null) { sq.clear.run(req.user.id, a.id); continue; }
      if (!Number.isInteger(a.agree) || a.agree < -2 || a.agree > 2) return res.status(400).json({ error: 'bad_agree' });
      if (a.basis != null && !(a.basis in BASIS)) return res.status(400).json({ error: 'bad_basis' });
      const before = sq.one.get(req.user.id, a.id);
      sq.save.run(req.user.id, a.id, a.agree, a.basis ?? before?.basis ?? null);
      sq.log.run(req.user.id, a.id, a.agree, localDate(req.body?.date));
    }
    // Answers change the journey: if today's card is not written yet, let it be chosen again from the new journey.
    const day = localDate(req.body?.date);
    if (!q.writtenOn.get(req.user.id, day)) q.dropPick.run(req.user.id, day);
    res.json({ journey: journeyFor(req.user.id) });
  });

  // ── Talk: a conversation with the map's collective wisdom (when ANTHROPIC_API_KEY is set). ──
  const vq = {
    add: db.prepare('INSERT INTO views (user_id, kind, topic, body, ideas, source, local_date) VALUES (?, ?, ?, ?, ?, ?, ?)'),
    recent: db.prepare('SELECT id, kind, topic, body, ideas, source, local_date FROM views WHERE user_id = ? ORDER BY local_date DESC, id DESC LIMIT ?'),
    since: db.prepare('SELECT id, kind, topic, body, ideas, local_date FROM views WHERE user_id = ? AND local_date >= ? ORDER BY local_date DESC, id DESC'),
    drop: db.prepare('DELETE FROM views WHERE id = ? AND user_id = ?'),
    talkCount: db.prepare("SELECT COUNT(*) AS n FROM events WHERE user_id = ? AND kind = 'talk'"),
  };
  const tq = {
    create: db.prepare('INSERT INTO talks (user_id) VALUES (?)'),
    get: db.prepare('SELECT id, messages FROM talks WHERE id = ? AND user_id = ?'),
    save: db.prepare("UPDATE talks SET messages = ?, updated_at = datetime('now') WHERE id = ?"),
    latest: db.prepare('SELECT id FROM talks WHERE user_id = ? ORDER BY updated_at DESC, id DESC LIMIT 1'),
    today: db.prepare("SELECT COUNT(*) AS n FROM events WHERE user_id = ? AND kind = 'talk' AND local_date = ?"),
  };
  const clip = (t, n) => { const x = (t ?? '').replace(/\s+/g, ' ').trim(); return x.length > n ? `${x.slice(0, n - 1)}…` : x; };

  // ── The views ledger: what the user said they believe, want or wonder, noted by Claude after a conversation or a
  // daily answer (quietly, in the background). It steers the next daily ideas and comes back in Talk to compare. ──
  function noteFrom(uid, date, said, context, source) {
    if (!talk || !said || said.length < 25) return Promise.resolve(null);
    const states = talkStates(uid, date);
    const visible = [...states].filter(([, st]) => st !== 'today').map(([id]) => id).concat(tq.practices.all().map((p) => p.id));
    const catalogue = visible.map((id) => q.node.get(id)).filter(Boolean).map((n) => `${n.id} | ${n.title}`).join('\n');
    const known = new Set(visible);
    return noteViews(talk, { said: clip(said, 4000), context: clip(context, 600), catalogue })
      .then((r) => {
        for (const v of r?.views ?? []) {
          if (!['view', 'goal', 'question'].includes(v.kind) || !v.topic || !v.text) continue;
          const ideas = (v.ideas ?? []).filter((id) => known.has(id)).slice(0, 3);
          vq.add.run(uid, v.kind, clip(v.topic, 60), clip(v.text, 400), JSON.stringify(ideas), source, date);
        }
        return r;
      })
      .catch((e) => { console.warn(`Noting views: ${e.status ?? ''} ${e.message}`); return null; });
  }
  // How far along they are, so Talk can meet them there and the walk can go deeper with time.
  function experienceOf(uid) {
    const written = q.writtenCount.get(uid).n;
    const talks = vq.talkCount.get(uid).n;
    const stage = written < 5 ? 'beginning' : written < 20 ? 'exploring' : written < 60 ? 'deepening' : 'seasoned';
    const how = {
      beginning: 'just beginning: keep to one idea at a time, everyday words and examples, and short questions.',
      exploring: 'exploring: they know a handful of ideas; connect new ones to those, and name the rival camps.',
      deepening: 'deepening: bring in the original texts, the strongest objections, and how the ideas changed over time.',
      seasoned: 'seasoned: treat them as a serious reader; press on assumptions, compare traditions, and ask hard follow-ups.',
    }[stage];
    return { stage, written, talks, text: `${written} ideas written on, ${talks} conversations; ${how}` };
  }
  const viewsText = (uid) => vq.recent.all(uid, 40).map((v) => `${v.local_date} | ${v.kind}: ${v.topic} | ${v.body}`).join('\n');
  // What the user may see, one line each: never an upcoming daily card or today's unwritten card.
  // states: id -> the user's state for it (mapEntries), computed once per request.
  const hiddenIn = (states, n) => n.type !== 'practice' && ['upcoming', 'today'].includes(states.get(n.id));
  const talkStates = (uid, date) => new Map(mapEntries(uid, date).map((e) => [e.id, e.state]));
  tq.practices = db.prepare("SELECT id FROM nodes WHERE type = 'practice'");
  function talkCatalogue(states) {
    const ids = [...[...states].filter(([, st]) => st !== 'upcoming' && st !== 'today').map(([id]) => id), ...tq.practices.all().map((p) => p.id)];
    return [...new Set(ids)].map((id) => q.node.get(id)).filter(Boolean).sort((a, b) => (a.year ?? 9999) - (b.year ?? 9999) || a.id.localeCompare(b.id))
      .map((n) => [n.id, n.title, [n.thinker, n.year != null ? (n.year < 0 ? `${-n.year} BCE` : n.year) : null].filter(Boolean).join(', ') || '-',
        n.type === 'practice' ? 'practice' : n.field, themesOf(n.id).map((t) => t.name).join('; ') || '-', clip(n.plain_face, 150)].join(' | '))
      .join('\n');
  }
  const AGREE = { 2: 'clearly finds the first camp\'s case stronger', 1: 'leans to the first camp', 0: 'finds both have a point', '-1': 'leans to the second camp', '-2': 'clearly finds the second camp\'s case stronger' };
  const interviewLines = (uid) => {
    const rows = sq.all.all(uid);
    if (!rows.length) return '';
    return `\n\nFrom the great debates, the welcome interview (for planning their journey; these are open questions, never a position to attack):\n${rows.map((a) => {
      const qn = stanceById.get(a.stance_id); return qn ? `- "${qn.question}" (first camp: ${qn.a.who}; second: ${qn.b.who}): ${AGREE[a.agree]}${a.basis ? ` (${BASIS[a.basis].toLowerCase()})` : ''}` : '';
    }).filter(Boolean).join('\n')}`;
  };
  function talkDiary(uid, states) {
    const { answers, notes, kept } = discovery(uid, (id) => states.get(id) === 'upcoming');
    return [
      ...answers.map((a) => ({ at: a.created_at, line: `${a.local_date} answer on [[${a.id}]] ("${clip(a.prompt, 160)}"): ${clip(a.body, 500)}` })),
      ...notes.map((n) => ({ at: n.updated_at, line: `${n.local_date} note on [[${n.id}]]: ${clip(n.body, 500)}` })),
      ...kept.map((f) => ({ at: f.created_at, line: `${f.created_at.slice(0, 10)} kept a line from [[${f.id}]]: ${clip(firstLine(f.source_face), 200)}` })),
    ].sort((x, y) => y.at.localeCompare(x.at)).slice(0, 40).map((x) => x.line).join('\n')
      + interviewLines(uid);
  }
  // One idea, opened for the conversation partner: the same reveal rules as the app (misreadings after writing).
  function talkIdea(uid, date, states, id) {
    const n = q.node.get(id);
    if (!n || hiddenIn(states, n)) return null;
    const full = fullNode(n, uid, date);
    const steps = practiceSteps[n.id];
    return JSON.stringify({
      id: n.id, title: n.title, type: n.type, thinker: n.thinker, year: n.year, field: n.field,
      plain: n.plain_face, source: n.source_face, citation: n.source_citation, misreading: full.misreading,
      opinions: full.opinions?.map((o) => ({ role: o.role, author: o.author, gist: o.gist, quote: o.quote })) ?? null,
      practice_steps: steps ? { ten_seconds: steps.tiny, one_minute: steps.small, five_minutes: steps.full } : null,
      themes: full.themes.map((t) => t.name),
      links: full.neighbours.filter((r) => !hiddenIn(states, r))
        .map((r) => ({ id: r.id, title: r.title, relation: r.relation, direction: r.dir === 'in' ? 'this idea came from it' : 'it came from this idea', note: r.note })),
    });
  }
  const talkRefs = (states, ids) => Object.fromEntries(ids.map((id) => {
    const n = q.node.get(id);
    return n && !hiddenIn(states, n) ? [id, { title: n.title, type: n.type, field: n.field, thinker: n.thinker }] : null;
  }).filter(Boolean));
  // The user-visible transcript: their words and the replies, not the look-ups or the model's thinking.
  const transcript = (messages) => messages.flatMap((m) => {
    if (m.role === 'user' && typeof m.content === 'string') return [{ who: 'you', text: m.content }];
    if (m.role === 'assistant') {
      const text = m.content.filter((b) => b.type === 'text').map((b) => b.text).join('').trim();
      return text ? [{ who: 'map', text }] : [];
    }
    return [];
  }).reduce((out, x) => { const last = out.at(-1); if (last && last.who === x.who && x.who === 'map') last.text += ` ${x.text}`; else out.push({ ...x }); return out; }, []);

  app.get('/api/talk', auth, (req, res) => {
    const date = localDate(req.query.date);
    const id = Number(req.query.id) || tq.latest.get(req.user.id)?.id;
    const t = id && tq.get.get(id, req.user.id);
    const turns = t ? transcript(JSON.parse(t.messages)) : [];
    res.json({ enabled: Boolean(talk), id: t?.id ?? null, turns, refs: talkRefs(talkStates(req.user.id, date), referencedIds(turns.map((x) => x.text).join(' '))) });
  });
  app.post('/api/talk/new', auth, (req, res) => res.json({ id: Number(tq.create.run(req.user.id).lastInsertRowid) }));
  // A message in, the reply streamed back as lines of JSON: {t:'text', d} while it is written, then {t:'done', refs}.
  app.post('/api/talk', auth, async (req, res) => {
    if (!talk) return res.status(404).json({ error: 'talk_off' });
    const uid = req.user.id; const date = localDate(req.body?.date);
    const text = typeof req.body?.text === 'string' ? req.body.text.trim() : '';
    if (!text) return res.status(400).json({ error: 'empty' });
    if (text.length > MAX_USER_TEXT) return res.status(400).json({ error: 'too_long' });
    if (tq.today.get(uid, date).n >= talkDailyLimit) return res.status(429).json({ error: 'daily_limit' });
    const mode = req.body?.mode;
    if (mode != null && !(mode in MODES)) return res.status(400).json({ error: 'bad_mode' });
    // Finding local volunteering is a one-off: the place they name is not kept (no conversation is stored).
    const keep = mode !== 'act';
    let t = keep && Number(req.body?.id) ? tq.get.get(Number(req.body.id), uid) : null;
    if (!t) t = keep ? { id: Number(tq.create.run(uid).lastInsertRowid), messages: '[]' } : { id: null, messages: '[]' };
    const messages = JSON.parse(t.messages);
    messages.push({ role: 'user', content: text });
    if (mode) messages.push({ role: 'system', content: MODES[mode] });
    q.insertEvent.run(uid, 'talk', null, date);
    res.set({ 'content-type': 'application/x-ndjson; charset=utf-8', 'cache-control': 'no-store', 'x-accel-buffering': 'no' });
    const send = (o) => res.write(`${JSON.stringify(o)}\n`);
    send({ t: 'start', id: t.id });
    let reply = '';
    try {
      const states = talkStates(uid, date);
      const system = systemBlocks({ catalogue: talkCatalogue(states), diary: talkDiary(uid, states), today: date, views: viewsText(uid), experience: experienceOf(uid).text, cases: casesText(uid) });
      const { sources } = await answer(talk, { system, messages, onText: (d) => { reply += d; send({ t: 'text', d }); }, readIdea: (id) => talkIdea(uid, date, states, id) });
      if (keep) {
        tq.save.run(JSON.stringify(messages), t.id);
        noteFrom(uid, date, text, `In a conversation${mode ? ` (${mode})` : ''}; the reply began: ${reply.slice(0, 300)}`, 'talk');
      }
      send({ t: 'done', refs: talkRefs(states, referencedIds(reply)), sources });
    } catch (e) {
      console.warn(`Talk: the request to Claude failed: ${e.status ?? ''} ${e.message}`);
      send({ t: 'error', error: e.status === 401 ? 'The Anthropic key did not work. The server window says more.' : 'Something went wrong reaching Claude. Try again in a moment.' });
    }
    res.end();
  });

  // ── Working through a problem: an interview, a plan from the whole map, a course, and check-ins ──
  const CHECKIN_DAYS = 3; const MAX_QUESTIONS = 6;
  const kq = {
    add: db.prepare('INSERT INTO cases (user_id, problem, turns, local_date, touched_date) VALUES (?, ?, ?, ?, ?)'),
    get: db.prepare('SELECT * FROM cases WHERE id = ? AND user_id = ?'),
    all: db.prepare("SELECT * FROM cases WHERE user_id = ? ORDER BY status = 'closed', touched_date DESC, id DESC"),
    open: db.prepare("SELECT * FROM cases WHERE user_id = ? AND status = 'open' ORDER BY touched_date DESC LIMIT 3"),
    started: db.prepare("SELECT title, route FROM cases WHERE user_id = ? AND status = 'open' AND started = 1 ORDER BY touched_date DESC"),
    due: db.prepare("SELECT * FROM cases WHERE user_id = ? AND status = 'open' AND touched_date <= ? ORDER BY touched_date LIMIT 1"),
    turns: db.prepare('UPDATE cases SET turns = ?, touched_date = ? WHERE id = ?'),
    plan: db.prepare("UPDATE cases SET plan = ?, title = ?, route = ?, status = 'open', touched_date = ? WHERE id = ?"),
    checkin: db.prepare('UPDATE cases SET checkins = ?, route = ?, touched_date = ? WHERE id = ?'),
    start: db.prepare('UPDATE cases SET started = 1, touched_date = ? WHERE id = ?'),
    status: db.prepare('UPDATE cases SET status = ? WHERE id = ?'),
  };
  const lastQuestion = (c) => JSON.parse(c.checkins).at(-1)?.check_in ?? JSON.parse(c.plan ?? '{}').check_in ?? 'How is it going?';
  function caseOut(c, states) {
    const turns = JSON.parse(c.turns); const plan = c.plan ? JSON.parse(c.plan) : null; const route = JSON.parse(c.route);
    const ids = [...route.map((r) => r.id), ...(plan?.pitfalls ?? []).map((p) => p.idea), plan?.practice,
      ...JSON.parse(c.checkins).flatMap((x) => (x.noticed ?? []).map((p) => p.idea))].filter(Boolean);
    return {
      id: c.id, title: c.title, problem: c.problem, status: c.status, started: Boolean(c.started), date: c.local_date, touched: c.touched_date,
      turns, plan, route, checkins: JSON.parse(c.checkins), question: c.status === 'open' ? lastQuestion(c) : null,
      refs: talkRefs(states, [...new Set(ids)]),
    };
  }
  // Only ideas the user may see, practices aside; a pitfall's idea is dropped (kept blank) when it is not one of them.
  function cleanPlan(plan, states) {
    const ok = (id) => { const n = id && q.node.get(id); return Boolean(n && !hiddenIn(states, n)); };
    const route = (plan.route ?? []).filter((r) => ok(r.id) && q.node.get(r.id).type !== 'practice')
      .filter((r, i, a) => a.findIndex((x) => x.id === r.id) === i).slice(0, 6);
    const pit = (p) => ({ ...p, idea: ok(p.idea) ? p.idea : '' });
    return { ...plan, route, pitfalls: (plan.pitfalls ?? []).slice(0, 4).map(pit), noticed: plan.noticed?.map(pit),
      practice: ok(plan.practice) && q.node.get(plan.practice).type === 'practice' ? plan.practice : '' };
  }
  // For Talk: the problems they are working through, with the pitfalls named so far.
  function casesText(uid) {
    return kq.open.all(uid).map((c) => {
      const plan = JSON.parse(c.plan ?? '{}'); const seen = JSON.parse(c.checkins).flatMap((x) => x.noticed ?? []);
      const pits = [...(plan.pitfalls ?? []), ...seen].map((p) => `${p.name} (${p.kind}${p.idea ? `, answered by [[${p.idea}]]` : ''})`);
      return `- ${c.local_date}: "${c.title}". Pitfalls: ${[...new Set(pits)].join('; ') || 'none named'}. Course: ${JSON.parse(c.route).map((r) => `[[${r.id}]]`).join(', ')}.`;
    }).join('\n');
  }
  // Their recent writing and talk, dated, for a check-in to look at how they have been thinking.
  function recentLines(uid, since) {
    const answers = db.prepare("SELECT n.title, j.body, j.local_date FROM journal j JOIN nodes n ON n.id = j.node_id WHERE j.user_id = ? AND j.local_date >= ? ORDER BY j.local_date DESC LIMIT 12").all(uid, since);
    const notes = db.prepare('SELECT n.title, t.body, t.local_date FROM notes t JOIN nodes n ON n.id = t.node_id WHERE t.user_id = ? AND t.local_date >= ? ORDER BY t.local_date DESC LIMIT 12').all(uid, since);
    const said = vq.since.all(uid, since).slice(0, 20);
    return [
      ...answers.map((a) => `${a.local_date} answer on "${a.title}": ${clip(a.body, 400)}`),
      ...notes.map((n) => `${n.local_date} note on "${n.title}": ${clip(n.body, 400)}`),
      ...said.map((v) => `${v.local_date} said (${v.kind}, ${v.topic}): ${v.body}`),
    ].join('\n');
  }
  const caseStates = (uid, date) => talkStates(uid, date);
  const catalogueFor = (states) => talkCatalogue(states);
  function guardTalk(req, res) {
    if (!talk) { res.status(404).json({ error: 'talk_off' }); return false; }
    if (tq.today.get(req.user.id, localDate(req.body?.date)).n >= talkDailyLimit) { res.status(429).json({ error: 'daily_limit' }); return false; }
    q.insertEvent.run(req.user.id, 'talk', null, localDate(req.body?.date));
    return true;
  }
  const failed = (res, e, what) => { console.warn(`${what}: ${e.status ?? ''} ${e.message}`); res.status(502).json({ error: 'claude_failed' }); };
  async function makePlan(uid, date, c, states) {
    const plan = await writePlan(talk, { problem: c.problem, turns: JSON.parse(c.turns).filter((t) => t.a), catalogue: catalogueFor(states), views: viewsText(uid), diary: talkDiary(uid, states) });
    if (!plan) return null;
    const clean = cleanPlan(plan, states);
    kq.plan.run(JSON.stringify(clean), clip(clean.title, 80) || 'A problem to work through', JSON.stringify(clean.route), date, c.id);
    return clean;
  }

  app.get('/api/cases', auth, (req, res) => {
    const states = caseStates(req.user.id, localDate(req.query.date));
    res.json({ enabled: Boolean(talk), cases: kq.all.all(req.user.id).map((c) => caseOut(c, states)) });
  });
  app.get('/api/cases/:id', auth, (req, res) => {
    const c = kq.get.get(Number(req.params.id), req.user.id);
    if (!c) return res.status(404).json({ error: 'not_found' });
    res.json({ case: caseOut(c, caseStates(req.user.id, localDate(req.query.date))) });
  });
  // A problem, in the user's words: the first question back.
  app.post('/api/cases', auth, async (req, res) => {
    const problem = typeof req.body?.problem === 'string' ? req.body.problem.trim() : '';
    if (problem.length < 3 || problem.length > MAX_USER_TEXT) return res.status(400).json({ error: 'bad_problem' });
    if (!guardTalk(req, res)) return;
    const uid = req.user.id; const date = localDate(req.body?.date);
    try {
      const step = await interviewStep(talk, { problem, turns: [], views: viewsText(uid), experience: experienceOf(uid).text });
      if (!step) return res.status(502).json({ error: 'claude_failed' });
      const id = Number(kq.add.run(uid, problem, JSON.stringify([{ q: step.question, reflect: step.reflect, a: null, concern: step.concern }]), date, date).lastInsertRowid);
      noteFrom(uid, date, problem, 'A problem they brought to Continuum to work through.', 'problem');
      res.json({ case: caseOut(kq.get.get(id, uid), caseStates(uid, date)), concern: step.concern });
    } catch (e) { failed(res, e, 'Interview'); }
  });
  // An answer to the waiting question: the next question, or (when understood, or asked for) the plan.
  app.post('/api/cases/:id/answer', auth, async (req, res) => {
    const uid = req.user.id; const date = localDate(req.body?.date);
    const c = kq.get.get(Number(req.params.id), uid);
    if (!c || c.status !== 'interview') return res.status(404).json({ error: 'not_found' });
    const answer = typeof req.body?.answer === 'string' ? req.body.answer.trim() : '';
    const enough = req.body?.enough === true;
    if (!answer && !enough) return res.status(400).json({ error: 'empty' });
    if (answer.length > MAX_USER_TEXT) return res.status(400).json({ error: 'too_long' });
    if (!guardTalk(req, res)) return;
    const turns = JSON.parse(c.turns);
    if (answer && turns.at(-1) && turns.at(-1).a == null) turns.at(-1).a = answer;
    else if (turns.at(-1)?.a == null) turns.pop(); // "enough" with the question unanswered
    kq.turns.run(JSON.stringify(turns), date, c.id);
    if (answer) noteFrom(uid, date, answer, `Answering "${turns.at(-1).q}" about a problem: ${clip(c.problem, 200)}`, 'problem');
    const states = caseStates(uid, date);
    try {
      let step = null;
      if (!enough && turns.length < MAX_QUESTIONS) {
        step = await interviewStep(talk, { problem: c.problem, turns, views: viewsText(uid), experience: experienceOf(uid).text });
        if (!step) return res.status(502).json({ error: 'claude_failed' });
        if (!step.done || step.concern) {
          turns.push({ q: step.question, reflect: step.reflect, a: null, concern: step.concern });
          kq.turns.run(JSON.stringify(turns), date, c.id);
          return res.json({ case: caseOut(kq.get.get(c.id, uid), states), concern: step.concern });
        }
      }
      if (step?.reflect) { turns.push({ q: null, reflect: step.reflect, a: null }); kq.turns.run(JSON.stringify(turns), date, c.id); }
      const plan = await makePlan(uid, date, kq.get.get(c.id, uid), states);
      if (!plan) return res.status(502).json({ error: 'claude_failed' });
      res.json({ case: caseOut(kq.get.get(c.id, uid), states), concern: plan.concern });
    } catch (e) { failed(res, e, 'Interview'); }
  });
  // Set the route as their course: it leads the daily ideas, one stop a day.
  app.post('/api/cases/:id/start', auth, (req, res) => {
    const date = localDate(req.body?.date);
    const c = kq.get.get(Number(req.params.id), req.user.id);
    if (!c || c.status !== 'open') return res.status(404).json({ error: 'not_found' });
    kq.start.run(date, c.id);
    if (!q.writtenOn.get(req.user.id, date)) q.dropPick.run(req.user.id, date);
    res.json({ ok: true });
  });
  // How is it going: a reply, pitfalls noticed (now and in their recent writing), and the course kept or changed.
  app.post('/api/cases/:id/checkin', auth, async (req, res) => {
    const uid = req.user.id; const date = localDate(req.body?.date);
    const c = kq.get.get(Number(req.params.id), uid);
    if (!c || c.status !== 'open') return res.status(404).json({ error: 'not_found' });
    const answer = typeof req.body?.answer === 'string' ? req.body.answer.trim() : '';
    if (!answer || answer.length > MAX_USER_TEXT) return res.status(400).json({ error: 'bad_answer' });
    if (!guardTalk(req, res)) return;
    const states = caseStates(uid, date);
    const history = JSON.parse(c.checkins);
    try {
      const r = await checkIn(talk, {
        title: c.title, problem: c.problem, plan: { ...JSON.parse(c.plan), route: JSON.parse(c.route) },
        history: history.map((x) => `${x.date} (${x.progress}): they said "${clip(x.answer, 300)}"`).join('\n'),
        answer, recent: recentLines(uid, history.at(-1)?.date ?? c.local_date), catalogue: catalogueFor(states),
      });
      if (!r) return res.status(502).json({ error: 'claude_failed' });
      const clean = cleanPlan({ ...r, pitfalls: [] }, states);
      const route = clean.route.length >= 2 ? clean.route : JSON.parse(c.route);
      history.push({ date, answer, question: lastQuestion(c), reply: r.reply, progress: r.progress, noticed: clean.noticed ?? [], next_step: r.next_step, check_in: r.check_in, rerouted: clean.route.length >= 2 });
      kq.checkin.run(JSON.stringify(history), JSON.stringify(route), date, c.id);
      noteFrom(uid, date, answer, `A check-in on a problem they are working through: ${c.title}`, 'problem');
      res.json({ case: caseOut(kq.get.get(c.id, uid), states), concern: r.concern });
    } catch (e) { failed(res, e, 'Check-in'); }
  });
  // Resolved, or set aside (closed); or opened again.
  app.post('/api/cases/:id/status', auth, (req, res) => {
    const c = kq.get.get(Number(req.params.id), req.user.id);
    const to = req.body?.status;
    if (!c || !['open', 'closed'].includes(to) || c.status === 'interview') return res.status(404).json({ error: 'not_found' });
    kq.status.run(to, c.id);
    res.json({ ok: true });
  });

  // ElevenLabs problems show in the server window, so they can be fixed (the phone falls back to its own voice).
  const ttsWarn = (what, e) => console.warn(`ElevenLabs refused ${what}: ${e.message}${e.why ? ` (${e.why})` : ''}`);
  // ── Reading aloud with ElevenLabs (when ELEVENLABS_API_KEY is set). The key never leaves the server. ──
  // Bright plates (public/img/bright/*.webp): sunlit, happy scenes the phone shows by day. Listed fresh each time,
  // so a new picture dropped into the folder is used at once.
  const BRIGHT_DIR = join(PUBLIC_DIR, 'img', 'bright');
  app.get('/api/plates', (req, res) => {
    let bright = [];
    try { bright = readdirSync(BRIGHT_DIR).filter((f) => /\.webp$/.test(f)).sort().map((f) => `/img/bright/${f}`); } catch { /* none yet */ }
    res.json({ bright });
  });
  app.get('/api/tts', auth, (req, res) => res.json({ enabled: Boolean(tts), voice_id: tts?.voiceId ?? null }));
  // An error on a phone shows in the server window, so a glitch can be traced (message, where, and the page).
  app.post('/api/clientlog', (req, res) => {
    const clean = (x) => String(x ?? '').replace(/[\r\n]+/g, ' ').slice(0, 400);
    const who = q.userByToken.get(req.get('x-continuum-token') ?? '')?.name ?? 'someone';
    console.warn(`Phone error (${who}): ${clean(req.body?.message)}${req.body?.where ? ` at ${clean(req.body.where)}` : ''}${req.body?.view ? ` [${clean(req.body.view)}]` : ''}`);
    res.json({ ok: true });
  });
  // The phone reports each step of speaking in, so a glitch shows in the server window.
  app.post('/api/voicelog', auth, (req, res) => {
    const clean = (x) => String(x ?? '').replace(/[\r\n]+/g, ' ').slice(0, 300);
    console.log(`Voice (${req.user.name}): ${clean(req.body?.event)}${req.body?.detail ? ` · ${clean(req.body.detail)}` : ''}`);
    res.json({ ok: true });
  });
  // Speech to text: the phone records, the server has ElevenLabs write it down (when ELEVENLABS_API_KEY is set).
  app.get('/api/stt', auth, (req, res) => res.json({ enabled: Boolean(tts?.transcribe) }));
  app.post('/api/stt', auth, express.raw({ type: ['audio/*', 'video/webm', 'application/octet-stream'], limit: '25mb' }), async (req, res) => {
    if (!tts?.transcribe) return res.status(404).json({ error: 'stt_off' });
    if (!Buffer.isBuffer(req.body) || req.body.length < 1000) {
      console.warn(`Speech to text: no usable audio arrived (${Buffer.isBuffer(req.body) ? `${req.body.length} bytes` : `content-type ${req.get('content-type')}`}).`);
      return res.status(400).json({ error: 'no_audio' });
    }
    const mime = String(req.get('content-type') ?? 'audio/webm').split(';')[0];
    const lang = /^[a-z]{2}$/.test(String(req.query.lang ?? '')) ? String(req.query.lang) : null;
    try {
      const r = await tts.transcribe(req.body, mime, { language: lang });
      console.log(`Speech to text: ${Math.round(req.body.length / 1024)} KB of ${mime} -> ${r.text.length} characters (${r.model}).`);
      res.json({ text: r.text });
    } catch (e) {
      console.warn(`ElevenLabs refused speech to text: ${e.message}${e.why ? ` (${e.why})` : ''}`);
      res.status(502).json({ error: e.message, why: e.why ?? null });
    }
  });
  app.get('/api/tts/voices', auth, async (req, res) => {
    if (!tts) return res.status(404).json({ error: 'tts_off' });
    try { res.json({ voices: await tts.voices(), default: tts.voiceId }); } catch (e) { ttsWarn('listing voices', e); res.status(502).json({ error: e.message, why: e.why ?? null }); }
  });
  app.post('/api/tts', auth, async (req, res) => {
    if (!tts) return res.status(404).json({ error: 'tts_off' });
    const text = typeof req.body?.text === 'string' ? req.body.text.trim() : '';
    if (!text) return res.status(400).json({ error: 'empty_text' });
    if (text.length > TTS_MAX) return res.status(400).json({ error: 'too_long' });
    const voice = req.body?.voice_id ?? tts.voiceId;
    if (!tts.validVoice(voice)) return res.status(400).json({ error: 'bad_voice' });
    try {
      const { audio, cached } = await tts.speak(text, voice);
      res.set({ 'content-type': 'audio/mpeg', 'cache-control': 'private, max-age=86400', 'x-tts-cache': cached ? 'hit' : 'miss' }).send(audio);
    } catch (e) { ttsWarn('reading aloud', e); res.status(502).json({ error: e.message, why: e.why ?? null }); }
  });

  // The app's own code and page are checked for a newer copy on every load (no stale mix of old and new after an
  // update); pictures, fonts and sounds may be kept by the phone.
  // The home-screen app: its start address carries the user's personal link, so the icon always opens signed in,
  // even after the browser clears what the site stored.
  app.get('/manifest.webmanifest', (req, res) => {
    const u = typeof req.query.u === 'string' && /^[A-Za-z0-9_-]{8,64}$/.test(req.query.u) ? req.query.u : null;
    res.type('application/manifest+json').set('Cache-Control', 'no-cache').send(JSON.stringify({
      name: 'Continuum', short_name: 'Continuum', description: 'One small idea a day.',
      start_url: u ? `/?u=${u}` : '/', scope: '/', display: 'standalone', orientation: 'portrait',
      background_color: '#0d120f', theme_color: '#0d120f',
      icons: [
        { src: '/img/icon/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: '/img/icon/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
      ],
      // Press and hold the icon: straight to a place.
      shortcuts: [
        ['Today\'s idea', 'Wander', 'wander'], ['Think something through', 'Think', 'think'],
        ['Work through a problem', 'A problem', 'problem'], ['Your diary', 'Diary', 'you'],
      ].map(([name, short_name, go]) => ({ name, short_name, url: `/?${u ? `u=${u}&` : ''}go=${go}`, icons: [{ src: '/img/icon/icon-192.png', sizes: '192x192', type: 'image/png' }] })),
    }));
  });
  app.use(express.static(PUBLIC_DIR, {
    extensions: ['html'],
    setHeaders: (res, file) => { if (/\.(html|js|css)$/.test(file)) res.setHeader('cache-control', 'no-cache'); },
  }));
  return app;
}
