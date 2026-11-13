// The line in the water. Continuum always holds out one thing (the day's idea, the "lure") and reads how the user takes
// it, from their own words, never an icon: a long or eager reply is a bite, a short or flat one a nibble, a dismissal or
// no reply at all after seeing it a miss. A bite is followed up next door on the map. After SWITCH_AFTER tries in a row
// that have not landed, it moves on: first a step sideways along the influence graph (someone the thinker taught,
// answered or was answered by, in another part of the map), and if that does not land either, to another part of the
// map entirely. The course is never stored: it is replayed from the trail of lures, so a late judgement (Claude reading
// a reaction after the quick heuristic) simply changes the replay.
//
// Front of house stays light: a short acknowledgement, or nothing at all, just a nod. Now and then the trail is looked
// back over (a synthesis): the thread through where they went, or an honest dead end. And a nudge, like a text from a
// friend, goes out a couple of times a week at most, quoting their own words, and backs off when they go quiet.

export const SWITCH_AFTER = 3;
export const ENGINE_MOVES = new Set(['start', 'stay', 'follow', 'adjacent', 'galaxy', 'topic']);
const CHANGES = new Set(['start', 'adjacent', 'galaxy', 'topic']);

// ── Reading a reaction ──
const FLAT = /^(meh+|nah+|no+|nope|boring|whatever|idk|i don'?t know|dunno|not really|not for me|pass|skip|eh+|ok(ay)?|k|fine|sure|so\??|who cares|don'?t care|nothing|n\/a|-+|\.+|\?+)[\s.!?]*$/i;
const WARM = /\b(love|loved|yes|exactly|wow|fascinat\w*|beautiful|so true|this is me|that'?s me|interesting|brilliant|need(ed)? this|resonat\w*|struck|moving|powerful|agree|right on|spot on|great)\b/i;
const COOL = /\b(disagree|wrong|nonsense|silly|bs|rubbish|hate|annoying|pretentious|don'?t buy|not convinced|irrelevant|bleak)\b/i;
export function readReaction(text) {
  const t = String(text ?? '').trim(); const words = t ? t.split(/\s+/).length : 0;
  const sentiment = WARM.test(t) ? 'warm' : COOL.test(t) ? 'cool' : 'neutral';
  // Pushing back at length is engagement too: an argument is a bite.
  const strength = !words || FLAT.test(t) ? 'miss' : words >= 20 || (sentiment === 'warm' && words >= 3) || (t.includes('?') && words >= 8) ? 'bite' : 'nibble';
  return { strength, sentiment, words };
}

// ── What the app says back ── short, varied, and often nothing at all (the nod).
const ACKS = {
  bite: ['Solid thinking.', 'I like where you\'re going with this.', 'That\'s a good one to sit with.', 'Yes. Hold onto that.', 'That\'s sharp.', 'Good. That\'s worth keeping.', 'Now that\'s a thought.', 'You\'re onto something there.'],
  nibble: ['Fair.', 'Noted.', 'Fair enough.', 'Mm. Okay.', 'Got it.', 'Thanks for that.'],
  miss: ['Fair enough. Not every one lands.', 'Noted. On to something else.'],
};
const SILENCE = { bite: 0.25, nibble: 0.4, miss: 0.6 };
export function ackFor(strength, seed) {
  const list = ACKS[strength] ?? ACKS.nibble;
  if ((seed % 100) / 100 < (SILENCE[strength] ?? 0.4)) return '';
  return list[(Math.floor(seed / 100) + seed) % list.length];
}

// ── Nudges back off on silence: about every two and a half days, doubling with each one unanswered, at most a month.
export const nudgeGapHours = (unanswered) => Math.min(60 * 2 ** unanswered, 30 * 24);

const OPENERS = ['Hey. I was just thinking about this.', 'Something I came across that I think you\'d have a view on.', 'A question I can\'t quite shake:',
  'Got a minute? This one\'s short.', 'Here\'s one for today.', 'I keep coming back to this one.', 'Curious what you make of this.'];
const snip = (s, n = 80) => { const t = String(s ?? '').replace(/\s+/g, ' ').trim(); return t.length > n ? `${t.slice(0, n).replace(/\s+\S*$/, '')}…` : t; };
const parse = (msg) => { try { return JSON.parse(msg.content.filter((b) => b.type === 'text').map((b) => b.text).join('')); } catch { return null; } };
const ask = (talk, { system, content, schema = null, effort = 'low', max = 2000 }) => talk.client.beta.messages.create({
  model: talk.model, max_tokens: max, betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default',
  output_config: schema ? { effort, format: { type: 'json_schema', schema } } : { effort }, system, messages: [{ role: 'user', content }],
});

export function createLure(db, { talk = null, hash, roomName, themesOf, log = () => {} }) {
  const lq = {
    all: db.prepare('SELECT l.*, n.title, n.thinker FROM lures l JOIN nodes n ON n.id = l.node_id WHERE l.user_id = ? AND l.local_date <= ? ORDER BY l.local_date'),
    get: db.prepare('SELECT l.*, n.title, n.thinker FROM lures l JOIN nodes n ON n.id = l.node_id WHERE l.user_id = ? AND l.local_date = ?'),
    put: db.prepare(`INSERT INTO lures (user_id, local_date, node_id, room, move, topic) VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT (user_id, local_date) DO UPDATE SET node_id = excluded.node_id, room = excluded.room, move = excluded.move, topic = excluded.topic,
        shown_at = NULL, reaction = NULL, reacted_at = NULL, strength = NULL, sentiment = NULL, words = NULL, seconds = NULL, ack = NULL`),
    shown: db.prepare("UPDATE lures SET shown_at = datetime('now') WHERE user_id = ? AND local_date = ? AND shown_at IS NULL"),
    react: db.prepare(`UPDATE lures SET reaction = ?, reacted_at = datetime('now'), strength = ?, sentiment = ?, words = ?, ack = ?,
      seconds = CASE WHEN shown_at IS NULL THEN NULL ELSE CAST((julianday('now') - julianday(shown_at)) * 86400 AS INTEGER) END
      WHERE user_id = ? AND local_date = ? AND node_id = ?`),
    judge: db.prepare('UPDATE lures SET strength = ?, sentiment = ? WHERE user_id = ? AND local_date = ? AND node_id = ?'),
    node: db.prepare('SELECT id, title, thinker, room, plain_face, prompt FROM nodes WHERE id = ?'),
    edges: db.prepare('SELECT from_id, to_id, relation FROM edges'),
    lastSynth: db.prepare('SELECT * FROM syntheses WHERE user_id = ? ORDER BY upto DESC, id DESC LIMIT 1'),
    unseenSynth: db.prepare('SELECT * FROM syntheses WHERE user_id = ? AND seen_at IS NULL ORDER BY id DESC LIMIT 1'),
    synths: db.prepare('SELECT * FROM syntheses WHERE user_id = ? ORDER BY id DESC LIMIT 20'),
    addSynth: db.prepare('INSERT INTO syntheses (user_id, local_date, upto, text, thread, stops) VALUES (?, ?, ?, ?, ?, ?)'),
    seeSynth: db.prepare("UPDATE syntheses SET seen_at = datetime('now') WHERE id = ? AND user_id = ?"),
    entries: db.prepare(`SELECT j.body, j.local_date, n.title, n.thinker FROM journal j JOIN nodes n ON n.id = j.node_id
      WHERE j.user_id = ? ORDER BY j.local_date DESC LIMIT 12`),
    // Nudges
    subs: db.prepare('SELECT * FROM push_subs'),
    subsOf: db.prepare('SELECT * FROM push_subs WHERE user_id = ?'),
    addSub: db.prepare(`INSERT INTO push_subs (endpoint, user_id, keys, tz) VALUES (?, ?, ?, ?)
      ON CONFLICT (endpoint) DO UPDATE SET user_id = excluded.user_id, keys = excluded.keys, tz = excluded.tz`),
    dropSub: db.prepare('DELETE FROM push_subs WHERE endpoint = ?'),
    dropSubOf: db.prepare('DELETE FROM push_subs WHERE endpoint = ? AND user_id = ?'),
    lastOpen: db.prepare("SELECT MAX(at) AS at FROM events WHERE user_id = ? AND kind = 'open'"),
    lastNudge: db.prepare('SELECT * FROM nudges WHERE user_id = ? ORDER BY id DESC LIMIT 1'),
    unanswered: db.prepare('SELECT COUNT(*) AS n FROM nudges WHERE user_id = ? AND sent_at > ?'),
    addNudge: db.prepare('INSERT INTO nudges (user_id, text, delivered, sent_at) VALUES (?, ?, ?, ?)'),
    unseenNudge: db.prepare("SELECT * FROM nudges WHERE user_id = ? AND seen_at IS NULL AND sent_at > datetime('now', '-7 days') ORDER BY id DESC LIMIT 1"),
    seeNudges: db.prepare("UPDATE nudges SET seen_at = datetime('now') WHERE user_id = ? AND seen_at IS NULL"),
    setting: db.prepare('SELECT v FROM settings WHERE k = ?'),
    setSetting: db.prepare('INSERT OR REPLACE INTO settings (k, v) VALUES (?, ?)'),
  };

  // The influence graph, both ways: who taught, answered, extended or echoed whom.
  let graph = null;
  const neighbours = (id) => {
    if (!graph) {
      graph = new Map();
      for (const e of lq.edges.all()) {
        for (const [a, b] of [[e.from_id, e.to_id], [e.to_id, e.from_id]]) { if (!graph.has(a)) graph.set(a, new Set()); graph.get(a).add(b); }
      }
    }
    return graph.get(id) ?? new Set();
  };
  const near = (ids) => { const out = new Set(); for (const id of ids) for (const x of neighbours(id)) out.add(x); return out; };

  // ── Replaying the trail ──
  function course(uid, date) {
    const rows = lq.all.all(uid, date);
    let room = null; let weak = 0; let change = null; let courseRows = []; let last = null;
    const failed = new Set(); const liked = new Set();
    for (const r of rows) {
      // A lure shown on an earlier day and never answered is a miss; one never shown says nothing.
      const outcome = r.strength ?? (r.shown_at && r.local_date < date ? 'miss' : null);
      if (ENGINE_MOVES.has(r.move)) {
        if (CHANGES.has(r.move)) {
          if ((r.move === 'adjacent' || r.move === 'galaxy') && room) failed.add(room);
          room = r.room; weak = 0; change = r.move; courseRows = [];
        } else if (r.move === 'follow' || !room) room = r.room;
        courseRows.push(r);
        if (outcome === 'bite') weak = 0; else if (outcome) weak += 1;
      }
      if (outcome === 'bite' && r.room) liked.add(r.room);
      last = { ...r, outcome };
    }
    return { rows, room, weak, change, courseRows, last, failed, liked };
  }

  // The next lure from the course, or null when there is no course yet (the app's other ways of choosing start one).
  // pool: the ideas still open to this user [{id, room}].
  function next(uid, date, pool) {
    const s = course(uid, date);
    if (!s.room) return null;
    const lured = new Set(s.rows.map((r) => r.node_id));
    const avail = pool.filter((n) => n.room && !lured.has(n.id));
    if (!avail.length) return null;
    // Chosen by where the trail stands, not the date: the same road leads to the same next step.
    const pick = (list, salt) => (list.length ? list[hash(`${uid}|${s.rows.length}|${s.last?.node_id}|${salt}`) % list.length] : null);
    const roomLabel = (r) => roomName.get(r) ?? 'another part of the map';
    // A bite: follow it up next door.
    if (s.last?.outcome === 'bite' && ENGINE_MOVES.has(s.last.move)) {
      const nb = neighbours(s.last.node_id); const c = avail.filter((n) => nb.has(n.id)); const same = c.filter((n) => n.room === s.last.room);
      const n = pick(same.length ? same : c, 'follow');
      if (n) return { id: n.id, move: 'follow', why: `You took to "${s.last.title}". This one is close by on the map.` };
    }
    if (s.weak < SWITCH_AFTER) {
      const inRoom = avail.filter((n) => n.room === s.room); const nb = near(s.courseRows.map((r) => r.node_id));
      const close = inRoom.filter((n) => nb.has(n.id));
      const n = pick(close.length ? close : inRoom, 'stay');
      if (n) return { id: n.id, move: 'stay', why: `Another from ${roomLabel(s.room)}.` };
    }
    // Not landing (or nothing left here): a step sideways first, then somewhere else entirely.
    if (s.change !== 'adjacent') {
      const nb = near(s.courseRows.map((r) => r.node_id));
      const n = pick(avail.filter((x) => nb.has(x.id) && x.room !== s.room && !s.failed.has(x.room)), 'adjacent');
      if (n) return { id: n.id, move: 'adjacent', why: `A step sideways on the map, to someone connected to where you have been: ${roomLabel(n.room)}.` };
    }
    const recent = new Set(s.rows.slice(-12).map((r) => r.room));
    const rooms = [...new Set(avail.map((n) => n.room))].filter((r) => r !== s.room && !s.failed.has(r));
    const fresh = rooms.filter((r) => !recent.has(r));
    const room = pick(fresh.length ? fresh : rooms.length ? rooms : [...new Set(avail.map((n) => n.room))], 'galaxy');
    // Somewhere new opens with one of its best-connected ideas.
    const there = avail.filter((n) => n.room === room).sort((a, b) => neighbours(b.id).size - neighbours(a.id).size || a.id.localeCompare(b.id));
    const n = pick(there.slice(0, 3), 'anchor');
    return n && { id: n.id, move: 'galaxy', why: `Somewhere new: ${roomLabel(n.room)}. Different questions, the same life.` };
  }

  // Every day's idea is a lure, however it was chosen; the course only steers by its own.
  function record(uid, date, nodeId, move = 'other', topic = null) {
    const n = lq.node.get(nodeId);
    lq.put.run(uid, date, nodeId, n?.room ?? null, move, topic);
  }
  const shown = (uid, date) => lq.shown.run(uid, date);

  // A reaction: judged at once (a quick reading), answered lightly, and judged again by Claude in the background.
  function reacted(uid, date, nodeId, text) {
    if (!lq.get.get(uid, date)) record(uid, date, nodeId, 'other');
    const r = readReaction(text);
    const ack = ackFor(r.strength, hash(`${uid}|${date}|ack`));
    lq.react.run(String(text).slice(0, 5000), r.strength, r.sentiment, r.words, ack, uid, date, nodeId);
    if (talk) {
      judge(uid, date, nodeId, text).catch((e) => log(`lure judge: ${e.message}`)).finally(() => maybeSynthesize(uid, date));
    } else maybeSynthesize(uid, date);
    return { ack, strength: r.strength };
  }
  const JUDGE_SCHEMA = { type: 'object', properties: { strength: { type: 'string', enum: ['bite', 'nibble', 'miss'] }, sentiment: { type: 'string', enum: ['warm', 'neutral', 'cool'] } }, required: ['strength', 'sentiment'], additionalProperties: false };
  async function judge(uid, date, nodeId, text) {
    const n = lq.node.get(nodeId);
    const msg = await ask(talk, { schema: JUDGE_SCHEMA,
      system: 'Continuum, a philosophy app, offers its user one idea a day and reads their short reply to decide whether to stay on this part of the map or move on. Judge only engagement, never the quality or rightness of the thinking. bite: they engaged (thought about it, related it to their life, argued with it, asked something real, were struck by it); disagreement can be a bite. nibble: lukewarm, polite, brief or noncommittal, including a bare "huh" or "interesting I guess". miss: dismissive, bored, or plainly not interested. sentiment: how they feel about the idea itself.',
      content: `The idea: "${n?.title}"${n?.thinker ? ` (${n.thinker})` : ''}. The question: ${n?.prompt}\n\nTheir reply:\n${text}` });
    const j = parse(msg);
    if (j?.strength) lq.judge.run(j.strength, j.sentiment, uid, date, nodeId);
  }

  // ── The opening line ── like a friend picking up a conversation: their own words when they gave some, never needy.
  function opener(uid, date, first = '') {
    const s = course(uid, date);
    const today = s.rows.find((r) => r.local_date === date);
    if (today?.move === 'topic' && today.topic) return `You said ${snip(today.topic, 60)} was on your mind. Here's someone who thought hard about it.`;
    if (!s.rows.some((r) => r.local_date < date) && !lq.entries.all(uid).some((e) => e.local_date < date)) return `${first ? `Hi ${first}. ` : ''}One question to start. There's no wrong answer, and you can say as little as you like.`;
    const prev = [...s.rows].reverse().find((r) => r.local_date < date && r.reaction && r.strength === 'bite');
    if (prev && hash(`${uid}|${date}|callback`) % 2 === 0) return `Still thinking about what you said on "${prev.title}": "${snip(prev.reaction, 70)}" This one's nearby.`;
    return OPENERS[hash(`${uid}|${date}|open`) % OPENERS.length];
  }

  // ── Something else on their mind: today's line goes where they point ──
  const TOPIC_SCHEMA = { type: 'object', properties: { id: { type: 'string' } }, required: ['id'], additionalProperties: false };
  async function forTopic(topic, pool) {
    const nodes = pool.map((p) => lq.node.get(p.id)).filter(Boolean);
    if (!nodes.length) return null;
    if (talk) {
      try {
        const list = nodes.map((n) => `${n.id} | ${n.title}${n.thinker ? ` | ${n.thinker}` : ''} | ${themesOf(n.id).map((t) => t.name).join(', ')}`).join('\n');
        const j = parse(await ask(talk, { schema: TOPIC_SCHEMA,
          system: `Continuum, a philosophy app, offers its user one idea a day. They have said what is on their mind instead. Choose the ONE idea from the list that would speak to it best: not the most obvious match by keyword, but the one most likely to help them think about it. Answer with its id exactly as listed.\n\nIdeas (id | title | thinker | themes):\n${list}`,
          content: `What is on their mind: ${topic}` }));
        if (j?.id && nodes.some((n) => n.id === j.id)) return j.id;
      } catch (e) { log(`lure topic: ${e.message}`); }
    }
    // Without Claude: the idea whose words share the most with theirs.
    const stem = (w) => w.toLowerCase().replace(/[^a-z]/g, '').slice(0, 5);
    const want = new Set(String(topic).split(/\s+/).map(stem).filter((w) => w.length >= 3 && !['about', 'there', 'their', 'which', 'would', 'thing', 'think', 'feeli'].includes(w)));
    if (!want.size) return null;
    let best = null; let score = 0;
    for (const n of nodes) {
      const words = `${n.title} ${n.thinker ?? ''} ${themesOf(n.id).map((t) => t.name).join(' ')} ${n.plain_face}`.split(/\s+/).map(stem);
      let s = 0; for (const w of words) if (want.has(w)) s += 1;
      s += 2 * `${n.title} ${themesOf(n.id).map((t) => t.name).join(' ')}`.split(/\s+/).map(stem).filter((w) => want.has(w)).length;
      if (s > score) { score = s; best = n.id; }
    }
    return best;
  }

  // ── Looking back ── due after five answered lures, or three when the course has had to turn around.
  const making = new Set();
  function synthesisDue(uid, date) {
    const since = lq.lastSynth.get(uid)?.upto ?? '';
    const s = course(uid, date);
    const trail = s.rows.filter((r) => r.local_date > since && (r.strength || (r.shown_at && r.local_date < date)));
    const turned = s.rows.some((r) => r.local_date > since && (r.move === 'adjacent' || r.move === 'galaxy'));
    return trail.length >= 5 || (turned && trail.length >= 3) ? { trail: trail.map((r) => ({ ...r, outcome: r.strength ?? 'miss' })), turned, s } : null;
  }
  function maybeSynthesize(uid, date) {
    if (making.has(uid)) return Promise.resolve(null);
    const due = synthesisDue(uid, date);
    if (!due) return Promise.resolve(null);
    making.add(uid);
    return synthesize(uid, date, due).catch((e) => { log(`synthesis: ${e.message}`); return null; }).finally(() => making.delete(uid));
  }
  const SYNTH_SCHEMA = { type: 'object', properties: { text: { type: 'string' }, thread: { type: 'string' } }, required: ['text', 'thread'], additionalProperties: false };
  async function synthesize(uid, date, { trail, turned, s }) {
    const stops = trail.map((r) => ({ id: r.node_id, title: r.title, thinker: r.thinker, outcome: r.outcome, room: r.room }));
    let text = null; let thread = null;
    if (talk) {
      const lines = trail.map((r) => `${r.local_date} · "${r.title}"${r.thinker ? ` (${r.thinker})` : ''} · ${roomName.get(r.room) ?? r.room} · how it was chosen: ${r.move}${r.topic ? ` (they asked about: ${r.topic})` : ''} · ${r.outcome}${r.reaction ? ` · they wrote: "${snip(r.reaction, 300)}"` : ' · no reply'}`).join('\n');
      const j = parse(await ask(talk, { schema: SYNTH_SCHEMA, effort: 'medium', max: 3000,
        system: `You are Continuum, a philosophy app that offers its user one idea a day. Now and then you look back with them over the road so far: this is the one moment you speak directly. In two to four sentences, plainly and warmly, like a friend who has been paying attention: name where they went (a few of the ideas by name), and the real thread running through what caught them, especially if the stops did not look related; quote a few of their own words if they help. Be honest about what did not land: if a stretch was a cul-de-sac, say so lightly and say you are turning around to try somewhere else. Never flatter, never diagnose, no lists, no headings. thread: the common thread in a few words, or "" if there honestly is none.`,
        content: `The road since you last looked back:\n${lines}\n\nCurrently on: ${roomName.get(s.room) ?? 'nowhere yet'}.` }));
      if (j?.text) { text = j.text.trim(); thread = j.thread?.trim() || null; }
    }
    if (!text) ({ text, thread } = templateSynthesis(trail, turned, s));
    const r = lq.addSynth.run(uid, date, trail.at(-1).local_date, text, thread, JSON.stringify(stops));
    return Number(r.lastInsertRowid);
  }
  function templateSynthesis(trail, turned, s) {
    const names = trail.slice(-5).map((r) => `"${r.title}"`);
    const went = names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names.at(-1)}` : names[0];
    const bites = trail.filter((r) => r.outcome === 'bite');
    const count = new Map(); for (const r of bites.length >= 2 ? bites : trail) for (const t of themesOf(r.node_id)) count.set(t.name, (count.get(t.name) ?? 0) + 1);
    const [top] = [...count].sort((a, b) => b[1] - a[1]);
    const thread = top && top[1] >= 2 ? top[0] : null;
    let text = `We went to ${went}.`;
    if (thread) text += ` They didn't all look related, but the thread running through ${bites.length >= 2 ? 'the ones that caught you' : 'them'} is ${thread.toLowerCase()}.`;
    if (bites.length) text += ` What caught you most was "${bites.at(-1).title}"${bites.at(-1).reaction ? `: you wrote "${snip(bites.at(-1).reaction, 70)}"` : ''}.`;
    if (turned) {
      const dead = [...s.failed].map((r) => roomName.get(r)).filter(Boolean).at(-1);
      text += ` ${dead ? `${dead} was` : 'Part of it was'} a cul-de-sac for you, and that's worth knowing. We've turned around to try ${roomName.get(s.room) ?? 'somewhere else'}.`;
    }
    return { text, thread };
  }
  const unseenSynthesis = (uid) => { const r = lq.unseenSynth.get(uid); return !r ? null : { id: r.id, text: r.text, thread: r.thread, stops: JSON.parse(r.stops), date: r.local_date }; };
  const syntheses = (uid) => lq.synths.all(uid).map((r) => ({ id: r.id, text: r.text, thread: r.thread, stops: JSON.parse(r.stops), date: r.local_date }));
  const seeSynthesis = (uid, id) => lq.seeSynth.run(id, uid);

  // ── Nudges ──
  let push = null; let vapid = null;
  async function pushReady() {
    if (push !== null) return push;
    try {
      const mod = await import('web-push'); push = mod.default ?? mod;
      const saved = lq.setting.get('vapid')?.v;
      vapid = saved ? JSON.parse(saved) : push.generateVAPIDKeys();
      if (!saved) lq.setSetting.run('vapid', JSON.stringify(vapid));
      push.setVapidDetails(process.env.CONTINUUM_CONTACT || 'https://continuum-2lg4.onrender.com', vapid.publicKey, vapid.privateKey);
    } catch (e) { log(`push unavailable: ${e.message}`); push = false; }
    return push;
  }
  const publicKey = async () => ((await pushReady()) ? vapid.publicKey : null);
  function subscribe(uid, sub, tz) {
    if (!sub?.endpoint || !/^https:\/\//.test(sub.endpoint) || !sub.keys?.p256dh || !sub.keys?.auth) return false;
    lq.addSub.run(sub.endpoint, uid, JSON.stringify({ p256dh: sub.keys.p256dh, auth: sub.keys.auth }), typeof tz === 'string' ? tz.slice(0, 60) : null);
    return true;
  }
  const unsubscribe = (uid, endpoint) => lq.dropSubOf.run(String(endpoint ?? ''), uid);
  const subscribed = (uid) => lq.subsOf.all(uid).length > 0;
  const sqlTime = (ms) => new Date(ms).toISOString().replace('T', ' ').slice(0, 19);
  const msOf = (sql) => (sql ? Date.parse(`${sql.replace(' ', 'T')}Z`) : 0);
  const localHour = (tz, ms) => { try { return Number(new Intl.DateTimeFormat('en-US', { hour: 'numeric', hourCycle: 'h23', timeZone: tz || 'UTC' }).format(ms)); } catch { return new Date(ms).getUTCHours(); } };

  // Whether a user is due a nudge now: not if they were here in the last day and a half; otherwise about every two and a
  // half days, doubling with each nudge left unanswered; only in their daytime.
  function nudgeDue(uid, now, tz) {
    const opened = msOf(lq.lastOpen.get(uid)?.at);
    if (!opened || now - opened < 36 * 3600_000) return false;
    const last = lq.lastNudge.get(uid);
    const unanswered = lq.unanswered.get(uid, sqlTime(opened)).n;
    const from = Math.max(opened, msOf(last?.sent_at));
    const jitter = (hash(`${uid}|${last?.id ?? 0}`) % 600) * 60_000; // with the - 5h below: within five hours either side, not clockwork
    if (now - from < nudgeGapHours(unanswered) * 3600_000 - 5 * 3600_000 + jitter) return false;
    const h = localHour(tz, now);
    return h >= 10 && h < 20;
  }
  const NUDGE_SCHEMA = { type: 'object', properties: { text: { type: 'string' } }, required: ['text'], additionalProperties: false };
  async function nudgeText(uid, now) {
    const entries = lq.entries.all(uid);
    const older = entries.filter((e) => msOf(`${e.local_date} 12:00:00`) < now - 3 * 86400_000);
    if (talk && entries.length) {
      try {
        const j = parse(await ask(talk, { schema: NUDGE_SCHEMA,
          system: 'You write a short note from Continuum, a philosophy app, to its user, as if from a well-read friend who has been thinking about something they said: one or two sentences, under 160 characters, no greeting beyond "Hey" at most, no emoji, no exclamation marks, never needy or guilt-tripping (never "we miss you", never mention how long it has been). Pick one thing they wrote that is worth coming back to, refer to it specifically (quote a few of their words, or name the idea), and ask a real, light question about it, e.g. "Last week you wrote about Seneca and anger. Did that hold up?"',
          content: `What they have written (newest first):\n${entries.slice(0, 8).map((e) => `${e.local_date} on "${e.title}"${e.thinker ? ` (${e.thinker})` : ''}: ${snip(e.body, 240)}`).join('\n')}\n\nToday is ${sqlTime(now).slice(0, 10)}.` }));
        if (j?.text?.trim()) return j.text.trim().slice(0, 240);
      } catch (e) { log(`nudge text: ${e.message}`); }
    }
    const e = older[0] ?? entries[0];
    if (e) {
      const days = Math.round((now - msOf(`${e.local_date} 12:00:00`)) / 86400_000);
      const when = days <= 1 ? 'Yesterday' : days < 7 ? 'The other day' : days < 14 ? 'Last week' : 'A while back';
      return `${when} you wrote about "${e.title}": "${snip(e.body, 60)}" Did that hold up?`;
    }
    return 'Hey. There\'s a question waiting for you, whenever you have a minute.';
  }
  // Called every few minutes on the server. Returns how many went out.
  async function nudgeTick(now = Date.now()) {
    if (!(await pushReady())) return 0;
    const byUser = new Map(); for (const s of lq.subs.all()) byUser.set(s.user_id, [...(byUser.get(s.user_id) ?? []), s]);
    let sent = 0;
    for (const [uid, subs] of byUser) {
      if (!nudgeDue(uid, now, subs[0].tz)) continue;
      const text = await nudgeText(uid, now);
      let ok = false;
      for (const s of subs) {
        try { await push.sendNotification({ endpoint: s.endpoint, keys: JSON.parse(s.keys) }, JSON.stringify({ title: 'Continuum', body: text, url: '/?from=nudge' }), { TTL: 6 * 3600 }); ok = true; } catch (e) {
          if (e.statusCode === 404 || e.statusCode === 410) lq.dropSub.run(s.endpoint); else log(`push: ${e.statusCode ?? ''} ${e.message}`);
        }
      }
      lq.addNudge.run(uid, text, ok ? 1 : 0, sqlTime(now));
      if (ok) sent += 1;
    }
    return sent;
  }
  const unseenNudge = (uid) => { const n = lq.unseenNudge.get(uid); return !n ? null : { id: n.id, text: n.text }; };
  const seeNudges = (uid) => lq.seeNudges.run(uid);

  return { course, next, record, shown, reacted, opener, forTopic, today: (uid, date) => lq.get.get(uid, date) ?? null,
    synthesisDue, maybeSynthesize, unseenSynthesis, syntheses, seeSynthesis, templateSynthesis,
    publicKey, subscribe, unsubscribe, subscribed, nudgeDue, nudgeText, nudgeTick, unseenNudge, seeNudges, judge };
}
