// Continuum client. Today: card -> write -> the concept, one part per screen -> walk the lineage.
import { setMotif, motifLevel, motifFor, setSkyFocus } from '/motifs.js';
import { mountMap } from '/mapview.js';
import { startCreatures, summon } from '/creatures.js';
import { startLiving } from '/living.js';
const TOKEN_KEY = 'continuum.token';
const view = document.getElementById('view');

const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode: fine */ } },
  del(k) { try { localStorage.removeItem(k); } catch { /* ignore */ } },
};

// Pick up an invite token from ?u=..., keep it, and clean the URL so it isn't shared by accident.
const DATE_KEY = 'continuum.date';
const params = new URLSearchParams(location.search);
if (params.get('u')) store.set(TOKEN_KEY, params.get('u'));
// Test aid: ?day=1 means tomorrow, ?day=2 the day after, ?day=2026-11-02 pins that date;
// ?day=clear goes back to the real date. The setting sticks until cleared.
if (params.get('day')) {
  const v = params.get('day').trim(); // a "+" in a URL arrives as a space, so "+1" and "1" both mean tomorrow
  if (v === 'clear') store.del(DATE_KEY);
  else if (/^[+-]?\d{1,3}$/.test(v)) store.set(DATE_KEY, shiftDate(realToday(), Number(v)));
  else if (/^\d{4}-\d{2}-\d{2}$/.test(v)) store.set(DATE_KEY, v);
}
if (params.get('join')) store.set('continuum.join', params.get('join'));
// The personal link stays in the address (so a bookmark, the browser's history or a home-screen icon keeps it, even
// when a browser such as DuckDuckGo clears what the site stored); the other settings are cleaned away.
const token = () => store.get(TOKEN_KEY) ?? '';
if (params.get('day') || params.get('join') || params.get('go') || (token() && !params.get('u'))) history.replaceState(null, '', token() ? `${location.pathname}?u=${encodeURIComponent(token())}` : location.pathname);
document.getElementById('manifest')?.setAttribute('href', `/manifest.webmanifest${token() ? `?u=${encodeURIComponent(token())}` : ''}`);
// Errors on the phone are reported to the server window (at most a few a minute), so a glitch names itself.
let reported = 0;
const reportError = (message, where = '') => {
  if (++reported > 6) return; setTimeout(() => { reported = Math.max(0, reported - 1); }, 20000);
  fetch('/api/clientlog', { method: 'POST', headers: { 'x-continuum-token': token(), 'content-type': 'application/json' },
    body: JSON.stringify({ message: String(message).slice(0, 400), where: String(where).slice(0, 200), view: document.querySelector('main h1')?.textContent?.slice(0, 80) ?? '' }) }).catch(() => {});
};
addEventListener('error', (e) => reportError(e.message, `${(e.filename ?? '').split('/').pop()}:${e.lineno}`));
addEventListener('unhandledrejection', (e) => reportError(e.reason?.message ?? e.reason, 'promise'));

function fmt(d) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function realToday() { return fmt(new Date()); }
function shiftDate(ymd, days) {
  const [y, m, d] = ymd.split('-').map(Number);
  return fmt(new Date(y, m - 1, d + days));
}
const testDate = () => store.get(DATE_KEY);
function today() { return testDate() ?? realToday(); }

async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch(path, {
    method,
    headers: { 'x-continuum-token': token(), ...(body ? { 'content-type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.error ?? `http_${res.status}`), { status: res.status });
  return data;
}

// Tiny element builder; text always goes through textContent, never innerHTML.
function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (k === 'class') el.className = v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of children.flat(Infinity)) if (c != null && c !== false) el.append(c instanceof Node ? c : String(c));
  return el;
}

function render(...nodes) {
  stopTopic(); // leaving a Parthenon topic closes its live line
  document.documentElement.classList.remove('map-full');
  const staged = nodes.some((n) => n?.classList?.contains('stage'));
  if (!staged) { unstage(); setWallpaper(pageBg ?? brightFor(currentTab ?? 'page') ?? TAB_BG[currentTab] ?? dailyPlate(), .35, { plain: true }); }
  view.classList.toggle('glassy', !staged);
  // On a plain page the title and the line under it stand on the picture; everything else sits on glass.
  nodes.forEach((n, i) => { if (n?.tagName === 'P' && nodes[i - 1]?.tagName === 'H1') n.classList.add('lede'); });
  const banner = testDate() && h('div', { class: 'notice testdate bare', role: 'status' },
    `Test date: ${testDate()} (real date ${realToday()}). `,
    h('button', { type: 'button', class: 'link', onclick: () => { store.set(DATE_KEY, shiftDate(testDate(), 1)); showToday(); } }, '+1 day'),
    h('button', { type: 'button', class: 'link', onclick: () => { store.del(DATE_KEY); showToday(); } }, 'use real date'));
  view.replaceChildren(...[banner, ...nodes].filter(Boolean));
  window.scrollTo(0, 0);
}

// Background pictures for the tabs (public/img/tabs/<tab>.webp). Behind a plain page they stay dim and blurred.
const TAB_BG = {
  practice: '/img/tabs/practice.webp', gallery: '/img/tabs/gallery.webp', journal: '/img/tabs/journal.webp', review: '/img/tabs/review.webp',
  talk: '/img/spares/talk_two_chairs.webp', // two chairs under a plane tree, two cups: a conversation waiting
};
TAB_BG.think = TAB_BG.talk; TAB_BG.explore = TAB_BG.gallery; TAB_BG.you = TAB_BG.journal;
// Plates for pages outside the tabs: the debates in a colonnade where two groups argue at either end, an owl
// between them. Pages whose plate has not arrived yet borrow one with a kindred meaning.
const PAGE_BG = {
  debates: '/img/spares/debates_stoa.webp',
  map: '/img/spares/map_observatory.webp', // an observatory open to the stars, a cat on the stair
  homework: '/img/spares/homework_reading_room.webp', // a reading room under green lamps, a cat asleep on the books
  weigh: '/img/spares/weigh_scales.webp', // brass scales by a window, a sparrow on one pan
  news: '/img/rooms/now.webp', // the Now room
  goal: '/img/spares/change_river.webp', // the braided river: a course being chosen
  teach: '/img/spares/teach_lecture_hall.webp', // an empty lecture hall, the board wiped clean: your turn to teach
  act: '/img/spares/act_kitchen.webp', // a community kitchen, soup served at long tables, a dog by the door
  parthenon: '/img/spares/parthenon_fire_circle.webp', // a ring of chairs round a fire at dusk: the Parthenon's groups
  recall: '/img/spares/recall_fog_path.webp', // a garden path in fog, a hare stopped: what is near is sharp, what is far fades
  problem: '/img/spares/problem_crossroads.webp', // a crossroads with a blank signpost, a fox at the fork
};
const talkPlate = (mode) => PAGE_BG[mode] ?? TAB_BG.talk;
// Ways in, offered from the first day: a conversation can start anywhere, and what is said shapes the walk.
function doors() {
  const door = (label, go) => h('button', { type: 'button', class: 'chip door', onclick: go }, label);
  return h('div', { class: 'doors' },
    h('div', { class: 'eyebrow' }, 'Or start a conversation'),
    h('div', { class: 'door-row' },
      door('A debate with a friend', () => showTalk({ mode: 'settle' })),
      door('Something in the news', () => showTalk({ mode: 'news' })),
      door('Weigh an opinion', () => showTalk({ mode: 'weigh' })),
      door('Today\'s practice', () => showPractice()),
      door('Work through a problem', () => showWorkThrough()),
      door('A goal I have', () => showTalk({ mode: 'goal' })),
      door('My group, in the Parthenon', () => showParthenon()),
      door('Look something up', () => showGallery('rooms', { search: true })),
      door('Just talk', () => showTalk())));
}
// Any other page gets one of the daily-life plates, the same one all day.
const DAILY_PLATES = ['bakery_window', 'bridge_rain', 'cafe_terrace', 'fish_market', 'laundry_yard', 'library_steps', 'station', 'tram_snow'];
// By day (7 in the morning to 5 in the afternoon, on the phone's clock) the tabs and plain pages stand on bright,
// happy plates from public/img/bright, one per page and day; in the evening the calmer plates return. Pages with a
// plate that carries a meaning (the debates, the Parthenon, homework…) keep it.
let brightPlates = [];
fetch('/api/plates').then((r) => r.json()).then((j) => { brightPlates = j.bright ?? []; }).catch(() => {});
const daytime = () => { const hr = new Date().getHours(); return hr >= 7 && hr < 17; };
const brightFor = (key) => {
  if (!brightPlates.length || !daytime()) return null;
  const n = [...`${today()}|${key}`].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  return brightPlates[n % brightPlates.length];
};
// The mood plates have bright daytime twins with the same meaning: done for today (kites over the park), coming back
// (a sail heading out at sunrise), a slow stretch (the meadow at first light), a mind changed (the barge on the river).
const MOOD_BRIGHT = { stillness: 'kites_park', return: 'sunrise_sea_sail', patience: 'meadow_morning', change: 'sail_river_morning' };
const moodPlate = (mood) => {
  const twin = MOOD_BRIGHT[mood] && `/img/bright/${MOOD_BRIGHT[mood]}.webp`;
  return (daytime() && twin && brightPlates.includes(twin) ? twin : null) ?? MOOD_BG[mood] ?? null;
};
const dailyPlate = () => `/img/spares/daily_${DAILY_PLATES[[...today()].reduce((a, c) => a + c.charCodeAt(0), 0) % DAILY_PLATES.length]}.webp`;
// Plates with a meaning, shown when the situation fits: done for today (the owl), coming back after a gap (the
// boat), a reluctant stretch (the dewy web), ready to grow or a changed mind (the braided river).
const MOOD_BG = {
  stillness: '/img/spares/stillness_owl.webp', return: '/img/spares/return_boat.webp',
  patience: '/img/spares/patience_web.webp', change: '/img/spares/change_river.webp',
};
let currentTab = null;
let pageBg = null; // a page's own plate in place of its tab's, set just before render
// Four tabs: Wander (today's idea and practice), Think (talk, problems, debates, the Parthenon), Explore (the Gallery
// and the Map), You (the diary and the week's review). Pages keep their own names (for their plates); the tab lit is
// the one they live under.
const TAB_OF = { practice: 'today', talk: 'think', gallery: 'explore', journal: 'you', review: 'you' };
function setNav(name) {
  currentTab = name; pageBg = null;
  const tab = TAB_OF[name] ?? name;
  for (const b of document.querySelectorAll('nav [data-nav]')) {
    if (b.dataset.nav === tab) b.setAttribute('aria-current', 'page');
    else b.removeAttribute('aria-current');
  }
}

const year = (y) => (y == null ? '' : y < 0 ? `${-y} BCE` : y < 1000 ? `${y} CE` : String(y));
const who = (n) => [n.thinker, year(n.year)].filter(Boolean).join(' · ');
const TYPE_LABEL = {
  thinker: 'Thinker', concept: 'Concept', quote: 'Quote', dilemma: 'Dilemma',
  puzzle: 'Puzzle', text: 'Text', practice: 'Practice', work: 'Artwork', case: 'Court case', event: 'In the news',
};


// "Keep this line": toggles a favourite; kept lines collect in the Diary.
function favoriteButton(node) {
  const btn = h('button', { type: 'button', class: 'chip keep', 'aria-pressed': String(Boolean(node.favorite)) });
  const paint = () => { btn.textContent = node.favorite ? '★ Kept' : '☆ Keep'; btn.setAttribute('aria-pressed', String(Boolean(node.favorite))); };
  paint();
  btn.addEventListener('click', async () => {
    node.favorite = !node.favorite; paint();
    try { await api('/api/favorite', { method: 'POST', body: { node_id: node.id, on: node.favorite } }); }
    catch { node.favorite = !node.favorite; paint(); }
  });
  return btn;
}

// After writing and reading: did the source change your mind? The answer picks the suggested next step,
// so the redirect rests on what the reader said, not on guessing from their text.
const REACTIONS = [['changed', 'Yes'], ['somewhat', 'A little'], ['unchanged', 'No']];
const REACTION_LABEL = { changed: 'changed my mind', somewhat: 'moved me a little', unchanged: 'did not change my mind' };
function reactionRow(node, trail) {
  const box = h('section', { class: 'reaction' });
  const pick = (rel, dir) => node.neighbours.find((r) => r.relation === rel && (!dir || r.dir === dir));
  const respond = (value) => {
    let line, next;
    if (value === 'changed') { next = pick('extended', 'out') ?? pick('measured', 'out'); line = next ? 'Then follow where it went:' : 'That is the whole point of the walk.'; }
    else if (value === 'unchanged') { next = pick('refuted', 'out') ?? pick('refuted', 'in'); line = next ? 'Hold your ground, and meet someone who argued against it:' : 'Holding your ground is a position too. Keep walking.'; }
    else { next = pick('converged'); line = next ? 'Someone reached the same place from another tradition:' : 'A little is how most minds move.'; }
    box.replaceChildren(
      h('div', { class: 'eyebrow' }, 'Your reaction'),
      h('p', {}, `${{ changed: 'The source changed your mind.', somewhat: 'It moved you a little.', unchanged: 'It did not change your mind.' }[value]} ${line}`),
      next && h('div', { class: 'bubbles' }, h('button', { type: 'button', class: `bubble field-${next.field}`, onclick: () => walkTo(next.id, [...trail, node]) },
        next.thinker && h('span', { class: 'b-who' }, next.thinker), h('span', { class: 'b-title' }, next.title))));
  };
  if (node.reaction) { respond(node.reaction); return box; }
  box.append(
    h('div', { class: 'eyebrow' }, 'Did the source change your mind?'),
    h('div', { class: 'row', style: 'justify-content:flex-start' }, REACTIONS.map(([value, label]) => h('button', {
      type: 'button', class: 'btn ghost',
      onclick: async () => {
        try { await api('/api/reaction', { method: 'POST', body: { node_id: node.id, value, date: today() } }); node.reaction = value; respond(value); }
        catch { /* leave the buttons */ }
      },
    }, label))));
  return box;
}

// Neighbour groups, read from the current node's point of view. `in` = the neighbour is the earlier idea A
// and this node did `relation` to it; `out` = this node is A and the neighbour did `relation` to it.
const GROUPS = [
  ['Who came before', (r) => r.dir === 'in' && (r.relation === 'extended' || r.relation === 'taught')],
  ['What it argued against', (r) => r.dir === 'in' && r.relation === 'refuted'],
  ['What it tested', (r) => r.dir === 'in' && r.relation === 'measured'],
  ['Kept the practice of', (r) => r.dir === 'in' && r.relation === 'secularized'],
  ['The idea it echoes', (r) => r.dir === 'in' && r.relation === 'echoes'],
  ['Same idea, no contact', (r) => r.relation === 'converged'],
  ['Who it taught', (r) => r.dir === 'out' && r.relation === 'taught'],
  ['Who extended it', (r) => r.dir === 'out' && r.relation === 'extended'],
  ['Who attacked it', (r) => r.dir === 'out' && r.relation === 'refuted'],
  ['Who measured it', (r) => r.dir === 'out' && r.relation === 'measured'],
  ['Who kept the practice, without the deity', (r) => r.dir === 'out' && r.relation === 'secularized'],
  ['Where it echoes: art, law, culture, the news', (r) => r.dir === 'out' && r.relation === 'echoes'],
  ['Where it lands', (r) => r.dir === 'out' && r.relation === 'lands_on'],
  ['Paths that land here', (r) => r.dir === 'in' && r.relation === 'lands_on'],
];

// ── The stage ────────────────────────────────────────────────────────────────────────────────────────────────
// A concept is shown one part at a time, each part filling the screen: arrival (the title), the plain face, the
// picture, the misreading, the source, each court opinion, your take, then each group of related ideas. As a part
// scrolls into view it materializes (rises, sharpens, scales up); the one before it recedes. Scrolling back up
// brings earlier parts back. A quiet animated motif for the idea runs behind it all (motifs.js).
const rise = (el, i) => { if (el) { el.classList.add('rise'); el.style.setProperty('--i', String(i)); } return el; };

function panel(kind, label, children, { wall = null, wallClass = '' } = {}) {
  const inner = h('div', { class: 'panel-inner' });
  children.filter(Boolean).forEach((c, i) => inner.append(rise(c, i)));
  return h('section', { class: `panel p-${kind}`, 'data-label': label, 'data-kind': kind },
    wall && h('div', { class: `wall ${wallClass}`, 'aria-hidden': 'true' }, h('img', { src: wall, alt: '', decoding: 'async' })),
    inner);
}

const whoLine = (node) => [TYPE_LABEL[node.type], who(node), node.as_of && `as of ${node.as_of}`].filter(Boolean).join(' · ');
const typeLine = (node) => [TYPE_LABEL[node.type], node.as_of && `as of ${node.as_of}`].filter(Boolean).join(' · ');
// The concept arrives first; who said it materializes a moment later.
const nameReveal = (node) => (node.thinker || node.year != null) && h('div', { class: 'name-reveal' },
  h('span', { class: 'rule', 'aria-hidden': 'true' }), [node.thinker, year(node.year)].filter(Boolean).join(' · '));
const hint = (text) => h('div', { class: 'hint', 'aria-hidden': 'true' }, text);

// Related ideas lead with the idea; the thinker's name is revealed when the idea itself takes the stage.
function bubble(r, onclick, note = r.note, label = TYPE_LABEL[r.type] ?? null) {
  return h('button', { type: 'button', class: `bubble field-${r.field}`, title: note ?? '', onclick },
    label && h('span', { class: 'b-who' }, label), h('span', { class: 'b-title' }, r.title),
    note && h('span', { class: 'b-note' }, note));
}

const ROLE_LABEL = { majority: 'Opinion of the Court', plurality: 'Plurality opinion', concurrence: 'Concurring', dissent: 'Dissenting' };

// The parts of a revealed concept, in order.
function conceptPanels(node, trail, { intro = null } = {}) {
  const go = (id) => () => walkTo(id, [...trail, node]);
  const P = [];
  const themes = node.themes?.length && h('div', { class: 'theme-chips' },
    node.themes.map((t) => h('button', { type: 'button', class: 'chip', onclick: () => showGallery('themes', { theme: t.id }) }, t.name)));
  P.push(panel('arrival', 'Arrival', [
    intro, h('div', { class: 'who' }, typeLine(node)), h('h1', {}, node.title), nameReveal(node), themes, hint('Scroll to begin'),
  ]));
  P.push(panel('plain', 'In plain words', [h('div', { class: 'eyebrow' }, node.type === 'practice' ? 'The practice' : 'In plain words'),
    ...node.plain_face.split('\n\n').map((p) => h('p', { class: 'plain' }, p))]));
  if (node.misreading) P.push(panel('misreading', 'Often misread', [h('div', { class: 'eyebrow' }, 'Often misread'), h('p', { class: 'plain' }, node.misreading)]));
  if (node.source_face) {
    P.push(panel('source', 'The source', [
      h('div', { class: 'eyebrow' }, 'The source'),
      h('blockquote', { class: 'quote' }, node.source_face.split('\n\n').map((p) => h('p', {}, p))),
      h('cite', {}, node.source_citation ?? ''),
      h('div', { class: 'srclinks' },
        node.source_url && h('a', { href: node.source_url, target: '_blank', rel: 'noopener', class: 'fulltext' }, 'Read the full text ↗'),
        node.analysis_url && h('a', { href: node.analysis_url, target: '_blank', rel: 'noopener', class: 'fulltext' }, 'Deeper: Stanford Encyclopedia ↗')),
    ]));
  }
  for (const o of node.opinions ?? []) {
    P.push(panel('opinion', ROLE_LABEL[o.role] ?? o.role, [
      h('div', { class: 'eyebrow' }, `${ROLE_LABEL[o.role] ?? o.role} · ${o.author}`),
      h('p', { class: 'plain' }, o.gist),
      h('blockquote', { class: `quote role-${o.role}` }, o.quote),
      o.echoes && bubble(o.echoes, go(o.echoes.id), o.echo_note, 'Echoes'),
      h('button', { type: 'button', class: 'btn ghost weigh-btn', onclick: () => showTalk({ mode: 'weigh',
        seed: `Weigh this opinion from ${node.title.split(':')[0]} (${ROLE_LABEL[o.role] ?? o.role}, ${o.author}). In plain words: ${o.gist} In its own words: "${o.quote}"` }) }, 'Weigh this opinion'),
    ]));
  }
  if (node.entry) {
    P.push(panel('yours', 'Your take', [
      h('div', { class: 'eyebrow' }, `Your take · ${node.entry.local_date}`),
      h('div', { class: 'yours' }, node.entry.body),
      node.source_face && reactionRow(node, trail),
    ]));
  }
  P.push(notePanel(node));
  for (const [label, test] of GROUPS) {
    const rows = node.neighbours.filter(test);
    if (rows.length) P.push(panel('related', label, [h('div', { class: 'eyebrow' }, label), ...rows.map((r) => bubble(r, go(r.id)))]));
  }
  const compass = h('div', { class: 'compass' });
  loadCompass(node, compass, trail);
  P.push(panel('end', 'Keep exploring', [
    h('h2', {}, 'Keep exploring'),
    compass,
    h('div', { class: 'end-links' },
      node.year != null && h('button', { type: 'button', class: 'btn ghost', onclick: () => showGallery('timeline', { focus: node.id }) }, 'See it on the timeline'),
      node.room && h('button', { type: 'button', class: 'btn ghost', onclick: () => showGallery('rooms', { focus: node.id }) }, 'See its room'),
      h('button', { type: 'button', class: 'btn ghost', onclick: () => showGallery('themes') }, 'Browse the themes'),
      h('button', { type: 'button', class: 'btn ghost', onclick: () => showTalk({ about: node }) }, 'Talk it through'),
      node.type !== 'practice' && h('button', { type: 'button', class: 'btn ghost', onclick: () => showHomework(node) }, 'Homework sheet'),
      node.type !== 'practice' && h('button', { type: 'button', class: 'btn ghost', onclick: () => showTalk({ about: node, mode: 'teach' }) }, 'Teach it back'),
      node.type !== 'practice' && h('button', { type: 'button', class: 'btn ghost', onclick: () => showParthenon({ idea: node }) }, 'Discuss it with your group'),
      h('button', { type: 'button', class: 'btn', onclick: showToday }, 'Back to today\'s question')),
  ]));
  return P;
}

// A discovery note on this idea, kept in the diary. One per idea; it can be changed any time.
function notePanel(node) {
  const ta = h('textarea', { id: `note-${node.id}`, maxlength: '5000', rows: '4',
    placeholder: 'What did you notice? A connection, a doubt, a question to come back to.' });
  ta.value = node.note ?? '';
  const status = h('span', { class: 'muted small', role: 'status' }, node.note ? 'In your diary' : '');
  const save = h('button', { type: 'button', class: 'btn' }, node.note ? 'Update note' : 'Save to diary');
  save.addEventListener('click', async () => {
    save.disabled = true;
    try {
      const r = await api('/api/note', { method: 'POST', body: { node_id: node.id, body: ta.value, date: today() } });
      node.note = r.note;
      status.textContent = r.note ? 'Saved to your diary' : 'Note removed';
      save.textContent = r.note ? 'Update note' : 'Save to diary';
      if (r.note) askBack(); else back.replaceChildren();
    } catch { status.textContent = 'Could not save. Try again.'; } finally { save.disabled = false; }
  });
  // After a note, Continuum asks one question back; the answer (typed or spoken) is added to the note.
  const back = h('div', { class: 'ask-back', 'aria-live': 'polite' });
  async function askBack() {
    back.replaceChildren(h('p', { class: 'muted small' }, 'Continuum is reading your note…'));
    const r = await api('/api/note/question', { method: 'POST', body: { node_id: node.id } }).catch(() => null);
    if (!r?.question) return back.replaceChildren();
    const reply = h('textarea', { rows: '3', maxlength: '2000', placeholder: 'Your answer, if you have one', 'aria-label': 'Your answer' });
    const send = h('button', { type: 'button', class: 'btn', disabled: true }, 'Add to my note');
    reply.addEventListener('input', () => { send.disabled = !reply.value.trim(); });
    send.addEventListener('click', async () => {
      send.disabled = true;
      try {
        const x = await api('/api/note/reply', { method: 'POST', body: { node_id: node.id, question: r.question, reply: reply.value, date: today() } });
        node.note = ta.value = x.note;
        back.replaceChildren(h('p', { class: 'muted small' }, 'Added to your note.'),
          h('button', { type: 'button', class: 'link small', style: 'padding:0', onclick: () => askBack() }, 'Ask me another'));
      } catch { send.disabled = false; notice('Could not add that. Try again.'); }
    });
    back.replaceChildren(
      h('div', { class: 'eyebrow' }, 'A question back'),
      h('p', { class: 'ask-q' }, r.question),
      reply, h('div', { class: 'row' }, dictation(reply)?.button,
        h('button', { type: 'button', class: 'link small', onclick: () => back.replaceChildren() }, 'Not now'), send));
  }
  return panel('note', 'Your notes', [
    h('div', { class: 'eyebrow' }, 'Your notes'),
    h('label', { class: 'prompt unspoken', for: ta.id }, 'A note for your diary of discovery'),
    ta, h('div', { class: 'row' }, dictation(ta)?.button, status, save), back,
  ]);
}

// Where to go next: one suggestion from the user's own curiosity, and, when their pattern looks one-sided, a gentle
// challenge with the reason shown. Plus a nudge toward today's practice if they haven't done it.
async function loadCompass(node, box, trail) {
  const c = await api(`/api/compass?from=${encodeURIComponent(node.id)}&date=${today()}`).catch(() => null);
  if (!c) return;
  const item = (label, s) => h('div', { class: 'compass-item' },
    h('div', { class: 'eyebrow' }, label), h('p', { class: 'muted small' }, s.why),
    bubble(s.entry, () => walkTo(s.entry.id, [...trail, node]), null));
  box.replaceChildren(...[
    c.curiosity && item('Follow your curiosity', c.curiosity),
    c.challenge && item('A gentle challenge', c.challenge),
    c.practice_nudge && h('button', { type: 'button', class: 'btn practice-nudge', onclick: () => showPractice() }, `${c.practice_nudge} →`),
  ].filter(Boolean));
}

// ── Practice: wisdom is easy, practice is hard ──────────────────────────────────────────────────────────────
// Arrive, the line you kept, the exercise (with a breathing timer), an intention. Sizes grow with the habit.
const SIZE_LABEL = { tiny: '10 seconds', small: '1 minute', full: '5 minutes' };
function showPractice({ practice = null, size = null } = {}) {
  setNav('practice');
  return guarded(async () => {
    const plan = await api(`/api/practice?date=${today()}${practice ? `&practice=${encodeURIComponent(practice)}` : ''}`);
    const sz = size ?? plan.size;
    const steps = plan.practice.steps;
    const sizeChips = h('div', { class: 'size-chips', role: 'group', 'aria-label': 'How long' },
      ['tiny', 'small', 'full'].map((k) => h('button', {
        type: 'button', class: `chip ${k === sz ? 'on' : ''}`, 'aria-pressed': String(k === sz),
        onclick: () => showPractice({ practice: plan.practice.id, size: k }),
      }, SIZE_LABEL[k])));
    const bigger = plan.offer_bigger && sz !== plan.offer_bigger && h('button', { type: 'button', class: 'btn ghost',
      onclick: () => showPractice({ practice: plan.practice.id, size: plan.offer_bigger }) },
    `Three days in a row. Try ${SIZE_LABEL[plan.offer_bigger]} today?`);

    // The timer: a ring that fills over the session's length; one breath in, one out, every eight seconds.
    const secs = plan.sizes[sz];
    const ring = h('div', { class: 'ring', role: 'timer', 'aria-live': 'off' }, h('span', { class: 'ring-num' }, String(secs)));
    let started = 0, timer = 0;
    const begin = h('button', { type: 'button', class: 'btn' }, 'Begin');
    begin.addEventListener('click', () => {
      if (timer) return;
      started = Date.now(); ring.classList.add('running'); begin.textContent = 'Breathe';
      begin.disabled = true;
      timer = setInterval(() => {
        const left = Math.max(0, secs - Math.floor((Date.now() - started) / 1000));
        ring.style.setProperty('--p', String(1 - left / secs));
        ring.firstChild.textContent = left ? String(left) : '✓';
        if (!left) { clearInterval(timer); begin.textContent = 'Done'; ring.classList.add('finished'); }
      }, 250);
    });

    const intention = h('input', { type: 'text', class: 'intention', maxlength: '500', placeholder: steps?.intention ?? 'One thing to carry with you…' });
    const finish = h('button', { type: 'button', class: 'btn' }, plan.done_today ? 'Save again' : 'Finish');
    const endBox = h('div', {});
    finish.addEventListener('click', async () => {
      clearInterval(timer);
      const spent = started ? Math.round((Date.now() - started) / 1000) : null;
      finish.disabled = true;
      try {
        const after = await api('/api/practice', { method: 'POST', body: { practice_id: plan.practice.id, size: sz, seconds: spent, intention: intention.value, date: today() } });
        setWallpaper(moodPlate(after.mood) ?? TAB_BG.practice, wallMax); // done: the owl (by day, the kites) settles in behind
        endBox.replaceChildren(
          h('h2', {}, after.streak > 1 ? `Done. ${after.streak} days in a row.` : 'Done. That is how a habit starts.'),
          h('p', { class: 'plain' }, sz === 'tiny' ? 'Ten seconds counts. Tomorrow, the same again, or a little more.' : 'Small, repeated, and yours.'),
          h('div', { class: 'end-links' }, h('button', { type: 'button', class: 'btn ghost', onclick: showToday }, 'Back to today\'s question')));
      } catch { finish.disabled = false; }
    });

    const exercise = sz === 'full'
      ? h('ol', { class: 'steps' }, (steps?.full ?? [plan.practice.plain_face]).map((t) => h('li', {}, t)))
      : h('p', { class: 'plain' }, steps?.[sz] ?? plan.practice.plain_face);
    const panels = [
      panel('arrival', 'Today\'s practice', [
        h('div', { class: 'eyebrow' }, plan.streak ? `Today's practice · ${plan.streak} ${plan.streak === 1 ? 'day' : 'days'} in a row` : "Today's practice"),
        h('h1', {}, plan.practice.title),
        h('p', { class: 'muted' }, plan.reason),
        plan.nudge && h('p', { class: 'nudge' }, plan.nudge),
        plan.done_today && h('p', { class: 'muted small' }, `Done today (${SIZE_LABEL[plan.done_today.size]}). Once more is fine.`),
        sizeChips, bigger, hint('Scroll to begin'),
      ]),
      plan.anchor && panel('source', 'A line you kept', [
        h('div', { class: 'eyebrow' }, 'A line you kept'),
        h('blockquote', { class: 'quote' }, plan.anchor.line),
        h('button', { type: 'button', class: 'link', onclick: () => walkTo(plan.anchor.id, []) },
          [plan.anchor.thinker, plan.anchor.title].filter(Boolean).join(' · ')),
      ]),
      panel('question', 'The practice', [
        h('div', { class: 'eyebrow spoken' }, plan.arrive[sz]), exercise, h('div', { class: 'timer' }, ring, begin),
      ]),
      panel('yours', 'Before you go', [
        h('div', { class: 'eyebrow' }, 'Before you go'), h('label', { class: 'prompt' }, steps?.intention ?? 'One thing to carry with you'),
        intention, h('div', { class: 'row' }, h('span'), finish), endBox,
      ]),
      panel('related', 'Act on it', [
        h('div', { class: 'eyebrow' }, 'Act on it near you'),
        h('p', { class: 'plain' }, 'Practice can reach past yourself: a soup kitchen, a shelter, a gift drive, working the polls. Continuum can look for current opportunities where you live.'),
        h('button', { type: 'button', class: 'btn', onclick: () => showTalk({ mode: 'act', practice: plan.practice }) }, 'Find a way to act on this near you'),
      ]),
      panel('related', 'Other practices', [
        h('div', { class: 'eyebrow' }, 'Or choose another practice'),
        h('div', { class: 'theme-chips' }, plan.choices.filter((c) => c.id !== plan.practice.id).map((c) =>
          h('button', { type: 'button', class: 'chip', onclick: () => showPractice({ practice: c.id, size: sz }) }, c.title))),
      ]),
    ].filter(Boolean);
    renderStage({ id: plan.practice.id, field: 'practice' }, panels, { background: moodPlate(plan.mood) ?? TAB_BG.practice });
  });
}

// Shows a stage: panels plus the side rail of dots, the card's links in the dock, and the motif behind.
const rail = document.getElementById('rail');
const dockLinks = document.getElementById('docklinks');
let stageObserver = null;
// How strongly the motif shows behind each kind of part: full on arrival, faint behind anything you read.
const LEVEL = { arrival: 1, plain: .28, picture: .15, misreading: .3, source: .18, opinion: .18, yours: .3, note: .3, related: .45, end: .9, question: .3 };

// The background picture: blurred and dim while a part is centred for reading, coming into focus as you scroll
// between parts. Before writing (a closed card) it never comes fully into focus, so it cannot give the idea away.
const wallpaper = document.getElementById('wallpaper');
let wallMax = 1;
// On a plain page (a tab) the picture is dim behind the text but clear in the empty space below it.
// The picture's zoom from pinching (see below): how far in, and toward which point (percent of the screen).
const wallZoom = { z: 1, ox: 50, oy: 50 };
function applyWallZoom() {
  wallpaper.style.setProperty('--wall-zoom', wallZoom.z.toFixed(3));
  wallpaper.style.setProperty('--wall-origin', `${wallZoom.ox.toFixed(1)}% ${wallZoom.oy.toFixed(1)}%`);
}
function setWallpaper(src, maxFocus = 1, { plain = false } = {}) {
  wallMax = maxFocus;
  if (src && wallpaper.querySelector('img')?.getAttribute('src') !== src) { Object.assign(wallZoom, { z: 1, ox: 50, oy: 50 }); applyWallZoom(); }
  wallpaper.classList.toggle('plain', plain);
  wallpaper.classList.toggle('nolook', !plain && maxFocus < 1); // a closed card's picture stays a hint, not a view
  if (!src) { wallpaper.classList.remove('on'); return; }
  wallpaper.classList.toggle('bright', src.includes('/img/bright/')); // a sunlit plate needs a little more shade for the words
  for (const img of wallpaper.querySelectorAll('img')) if (img.getAttribute('src') !== src) img.setAttribute('src', src);
  wallpaper.classList.add('on'); focusWall();
}
let wallTick = 0;
function focusWall() {
  wallTick = 0;
  if (!wallpaper.classList.contains('on')) return;
  if (wallpaper.classList.contains('plain')) {
    const bottom = Math.max(0, ...[...view.children].map((c) => c.getBoundingClientRect().bottom));
    wallpaper.style.setProperty('--clear-from', `${Math.round(Math.min(bottom, innerHeight))}px`);
  }
  const panels = [...document.querySelectorAll('.stage .panel')];
  const mid = innerHeight / 2;
  let between = 1;
  for (const p of panels) {
    const r = p.getBoundingClientRect();
    const d = Math.abs((r.top + Math.min(r.height, innerHeight) / 2) - mid) / (Math.min(r.height, innerHeight) / 2);
    between = Math.min(between, d);
  }
  const f = Math.min(1, between) * wallMax; // 0 = a part is centred (reading), 1 = halfway between two parts
  wallpaper.style.setProperty('--focus', f.toFixed(3));
  if (document.documentElement.classList.contains('staged')) setSkyFocus(Math.min(1, between));
}
const queueWall = () => { if (!wallTick) wallTick = requestAnimationFrame(focusWall); };
addEventListener('scroll', queueWall, { passive: true });
addEventListener('resize', queueWall);
new ResizeObserver(queueWall).observe(view);

// Listen: the stage read aloud, part by part, from the part in view to the end, scrolling gently to each part as it
// goes (so the picture comes into focus between parts). Tap again to stop. The voice is ElevenLabs when the server has
// a key (natural, saved once per part), otherwise the phone's own text-to-speech.
const listenBtn = document.getElementById('listen');
const voiceBtn = document.getElementById('voice');
const speech = 'speechSynthesis' in window ? window.speechSynthesis : null;
if (speech) document.documentElement.classList.add('can-speak');
let reading = null; // { stop, wake } for the run in progress
let ttsOn = null;   // null = not asked yet
const ttsEnabled = async () => {
  if (ttsOn === null) ttsOn = await api('/api/tts').then((r) => r.enabled).catch(() => null); // not signed in yet: ask again later
  if (ttsOn) document.documentElement.classList.add('can-speak');
  return Boolean(ttsOn);
};
// The choice, kept on this device: 'el:<voice id>' (an ElevenLabs voice), 'phone:<name>' (one of the phone's voices),
// or nothing (the default: ElevenLabs when the server has a key, else the phone's default voice). A bare name is a
// choice from before natural voices existed; it is ignored once they do.
const VOICE_KEY = 'continuum.voice';
// Reading speed, kept on this device: 0.8 to 1.4. ElevenLabs audio plays faster or slower (pitch kept, no new clip
// to pay for); the phone's voice speaks at that rate.
const RATE_KEY = 'continuum.rate';
const RATES = [['Slower', .8], ['Calm', .9], ['Normal', 1], ['Brisk', 1.15], ['Faster', 1.3]];
const readRate = () => { const r = Number(store.get(RATE_KEY)); return RATES.some(([, v]) => v === r) ? r : 1; };
async function voicePlan() {
  const choice = store.get(VOICE_KEY) ?? '';
  const el = await ttsEnabled();
  if (choice.startsWith('el:') && el) return { el: choice.slice(3) };
  const name = choice.startsWith('phone:') ? choice.slice(6) : !el && !choice.startsWith('el:') ? choice : '';
  const phone = name && speech?.getVoices().find((v) => v.name === name);
  if (phone) return { phone };
  if (await ttsEnabled()) return { el: null }; // the server's default ElevenLabs voice
  return { phone: null }; // the phone's default voice
}
// What a listener should hear from one part: the substance only (titles, plain words, the source, questions, their
// own writing). Labels and outline lines ("Today · 1 of 14", "In plain words", "Scroll to begin"), small print,
// buttons, links and citations are skipped. The thinker's name is said; the year is not.
function spokenText(p) {
  const c = p.cloneNode(true);
  c.querySelectorAll('button.bubble').forEach((bt) => bt.replaceWith(h('p', {}, bt.querySelector('.b-title')?.textContent ?? '')));
  c.querySelectorAll('.name-reveal').forEach((n) => n.replaceWith(h('p', {}, n.textContent.split('·')[0].trim())));
  c.querySelectorAll('.eyebrow:not(.spoken), .who, .muted, .unspoken, .progress, a, button, input, textarea, select, cite, .hint, .wall, [aria-hidden="true"], .size-chips, .timer').forEach((e) => e.remove());
  c.querySelectorAll('div, h1, h2, h3, p, li, blockquote, label').forEach((e) => { e.prepend(' '); e.append('. '); });
  return c.textContent.replace(/\s*·\s*/g, ', ').replace(/\s+/g, ' ').replace(/([.…]\s*){2,}/g, '. ').replace(/([!?:;,])\s*\.\s/g, '$1 ')
    .replace(/\s+([.,!?;:])/g, '$1').replace(/^\s*\.\s*/, '').trim();
}
const sentences = (text) => text.match(/[^.!?…]+[.!?…]+["”’)]*|[^.!?…]+$/g)?.map((t) => t.trim()).filter((t) => /[\p{L}\d]/u.test(t)) ?? [];
// Pieces of at most ~2,000 characters, cut at sentence ends (the server takes up to 2,500).
function chunks(text) {
  const out = []; let cur = '';
  for (const s of sentences(text)) { if (cur && (cur + ' ' + s).length > 2000) { out.push(cur); cur = s; } else cur = cur ? `${cur} ${s}` : s; }
  return cur ? [...out, cur] : out;
}

// The phone's voice, one sentence at a time (some browsers cut off a long utterance).
function sayPhone(text, voice, run) {
  return new Promise((resolve) => {
    const u = new SpeechSynthesisUtterance(text);
    if (voice) { u.voice = voice; u.lang = voice.lang; }
    u.rate = .95 * readRate();
    u.onend = u.onerror = () => resolve();
    if (run) run.wake = resolve;
    speech.speak(u);
  });
}
// ElevenLabs: the server returns MP3 for a piece of text; one audio element plays the pieces in turn.
const audioEl = new Audio();
async function fetchClip(text, voiceId) { return URL.createObjectURL(await fetchBlob(text, voiceId)); }
async function fetchBlob(text, voiceId) {
  const res = await fetch('/api/tts', {
    method: 'POST', headers: { 'x-continuum-token': token(), 'content-type': 'application/json' },
    body: JSON.stringify({ text, ...(voiceId ? { voice_id: voiceId } : {}) }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw Object.assign(new Error(`tts_${res.status}`), { why: body.why ?? null });
  }
  return res.blob();
}
function playClip(url, run) {
  return new Promise((resolve) => {
    const done = () => { URL.revokeObjectURL(url); resolve(); };
    audioEl.onended = audioEl.onerror = done;
    if (run) run.wake = done;
    audioEl.src = url;
    audioEl.preservesPitch = true;
    audioEl.playbackRate = readRate();
    audioEl.play().catch(done);
  });
}

// The reader: the stage as a queue of sentences. A clear play/pause key shows in the middle of the screen as reading
// begins and fades away; a tap on the page brings it back, and a tap on the key pauses or plays. While the key shows
// (or while paused), tapping any word reads on from there. The page is free to scroll: it follows along only until
// the user scrolls it themselves. At the end of each passage the reading rests, so there is room to think.
// ElevenLabs clips are kept for the visit, so going back costs nothing.
const reader = { items: [], k: 0, state: 'idle', run: null, plan: null, clips: new Map(), panels: [], key: null, keyTimer: 0, follow: true, reflecting: false };
function readerKey() {
  if (reader.key) return reader.key;
  reader.keyIcon = h('span', { class: 'rk-icon', 'aria-hidden': 'true' });
  reader.keyNote = h('span', { class: 'rk-note' });
  reader.key = h('button', { type: 'button', class: 'reader-key', 'aria-label': 'Pause' }, reader.keyIcon, reader.keyNote);
  reader.key.addEventListener('click', (e) => { e.stopPropagation(); togglePause(); });
  document.body.append(reader.key);
  return reader.key;
}
function showKey(ms = 2200) {
  const key = readerKey(); key.classList.add('on'); clearTimeout(reader.keyTimer);
  if (reader.state === 'playing' && ms) reader.keyTimer = setTimeout(() => key.classList.remove('on'), ms);
}
function hideKey() { clearTimeout(reader.keyTimer); reader.key?.classList.remove('on'); }
function markPanel() {
  reader.panels.forEach((p, n) => p.classList.toggle('reading', reader.state !== 'idle' && n === reader.items[reader.k]?.p));
  if (!reader.key) return;
  const paused = reader.state === 'paused';
  reader.keyIcon.textContent = paused ? '▶' : '❚❚';
  reader.keyNote.textContent = reader.reflecting ? 'A moment to reflect. Tap to go on.' : paused ? 'Or tap any word to read from there' : '';
  reader.key.setAttribute('aria-label', paused ? 'Play' : 'Pause');
}
// Which sentence a tap landed in: the word under the finger and a few after it, found among that passage's sentences.
const plainWords = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
function sentenceAt(x, y) {
  const cp = document.caretPositionFromPoint?.(x, y);
  const cr = !cp && document.caretRangeFromPoint?.(x, y);
  const node = cp ? cp.offsetNode : cr?.startContainer; let at = cp ? cp.offset : cr?.startOffset;
  if (!node || node.nodeType !== Node.TEXT_NODE) return -1;
  const p = reader.panels.findIndex((pa) => pa.contains(node));
  if (p < 0) return -1;
  const t = node.textContent; while (at > 0 && /\S/.test(t[at - 1])) at--;
  const words = plainWords(t.slice(at, at + 80)).split(' ').slice(0, 5);
  const mine = reader.items.map((x, i) => [plainWords(x.text), i]).filter(([, i]) => reader.items[i].p === p);
  for (let n = words.length; n >= 1; n--) {
    const phrase = words.slice(0, n).join(' ');
    const hit = phrase && mine.find(([s]) => ` ${s} `.includes(` ${phrase} `));
    if (hit) return hit[1];
  }
  return mine[0]?.[1] ?? -1;
}
function onStageTap(e) {
  if (reader.state === 'idle' || !e.target.closest('.stage')) return;
  if (e.target.closest('a, button, input, textarea, select, label, .reader-key, .keep-bar')) return;
  if (!getSelection()?.isCollapsed) return; // choosing words to keep, not tapping
  if (reader.state === 'paused' || reader.key?.classList.contains('on')) {
    const k = sentenceAt(e.clientX, e.clientY);
    if (k >= 0) return jump(k);
  }
  if (reader.state === 'playing') showKey();
}
// The user's own scrolling means they are looking somewhere: stop pulling the page along.
const letGo = () => { if (reader.state !== 'idle') reader.follow = false; };
addEventListener('touchmove', letGo, { passive: true });
addEventListener('wheel', letGo, { passive: true });
document.addEventListener('click', onStageTap);
async function readStage() {
  stopReading();
  const panels = [...document.querySelectorAll('.stage .panel')];
  if (!panels.length) return;
  const items = panels.flatMap((p, n) => sentences(spokenText(p)).map((text) => ({ p: n, text })));
  if (!items.length) return;
  const mid = innerHeight / 2;
  const startPanel = Math.max(0, panels.findIndex((p) => { const r = p.getBoundingClientRect(); return r.top <= mid && r.bottom >= mid; }));
  Object.assign(reader, { items, panels, k: Math.max(0, items.findIndex((x) => x.p >= startPanel)), state: 'playing', clips: new Map(), follow: true, reflecting: false, plan: await voicePlan() });
  reading = reader; // the Listen button shows Stop while this runs
  listenBtn.setAttribute('aria-pressed', 'true'); listenBtn.querySelector('span').textContent = 'Stop';
  document.documentElement.classList.add('reading-aloud');
  markPanel(); showKey(2600);
  loop();
}
const clipFor = (k) => {
  const t = reader.items[k]?.text;
  if (!reader.clips.has(t)) reader.clips.set(t, fetchBlob(t, reader.plan.el).catch((e) => { reader.clips.delete(t); throw e; }));
  return reader.clips.get(t);
};
// A passage worth resting after: two sentences or more, with more still to read (not the opening, a list of links,
// the notes box or the way out).
const NO_REST = new Set(['arrival', 'note', 'related', 'end']);
const restAfter = (k) => {
  const p = reader.items[k]?.p; const next = reader.items[k + 1];
  return next && next.p !== p && !NO_REST.has(reader.panels[p]?.dataset.kind) && reader.items.filter((x) => x.p === p).length >= 2;
};
async function loop() {
  const run = reader.run = { stop: false, wake: null };
  let shownPanel = reader.panels.findIndex((pa) => { const r = pa.getBoundingClientRect(); return r.top < innerHeight * .6 && r.bottom > innerHeight * .2; });
  while (reader.k < reader.items.length && !run.stop) {
    const item = reader.items[reader.k];
    markPanel();
    if (item.p !== shownPanel) {
      const r = reader.panels[item.p].getBoundingClientRect();
      if (reader.follow && (r.top > innerHeight * .6 || r.bottom < innerHeight * .2)) { reader.panels[item.p].scrollIntoView({ behavior: 'smooth', block: 'start' }); await new Promise((x) => setTimeout(x, 700)); }
      shownPanel = item.p;
      if (run.stop) return;
    }
    if ('el' in reader.plan) {
      try {
        const blob = await clipFor(reader.k);
        if (reader.k + 1 < reader.items.length) clipFor(reader.k + 1).catch(() => {});
        if (run.stop) return false;
        await playClip(URL.createObjectURL(blob), run);
      } catch (e) {
        if (!speech) break;
        notice(`The natural voice is not available right now${e.why ? `: ${e.why}` : ' (check the ElevenLabs key or credits)'}. Using the phone's voice.`);
        reader.plan = { phone: null }; continue;
      }
    } else await sayPhone(item.text, reader.plan.phone, run);
    if (run.stop || reader.state === 'paused') return;
    const rest = restAfter(reader.k);
    reader.k++;
    if (rest) { reader.state = 'paused'; reader.reflecting = true; markPanel(); showKey(0); return; }
    if (reader.items[reader.k]?.p !== item.p) await new Promise((x) => setTimeout(x, 400));
  }
  if (reader.run === run && !run.stop) stopReading();
}
function haltRun() { if (reader.run) { reader.run.stop = true; reader.run.wake?.(); } speech?.cancel(); audioEl.pause(); }
function togglePause() {
  if (reader.state === 'playing') {
    reader.state = 'paused';
    if (audioEl.src && !audioEl.paused) audioEl.pause(); else haltRun(); // the phone's voice restarts its sentence
    markPanel(); showKey(0);
  } else if (reader.state === 'paused') {
    const wasResting = reader.reflecting;
    reader.state = 'playing'; reader.reflecting = false; reader.follow = true;
    if (!wasResting && reader.run && !reader.run.stop && audioEl.src && audioEl.paused && !audioEl.ended && audioEl.currentTime > 0) audioEl.play();
    else loop();
    markPanel(); showKey(900);
  }
}
function jump(k) {
  if (reader.state === 'idle' || k < 0 || k >= reader.items.length) return;
  haltRun(); reader.k = k; reader.reflecting = false;
  reader.state = 'playing'; markPanel(); showKey(900);
  loop();
}
function stopReading() {
  if (reading !== reader) return;
  haltRun(); reading = null;
  reader.state = 'idle'; reader.reflecting = false; markPanel(); hideKey();
  document.documentElement.classList.remove('reading-aloud');
  listenBtn.setAttribute('aria-pressed', 'false'); listenBtn.querySelector('span').textContent = 'Listen';
}
// Keeping words: choose any words on an idea's page (press and hold, then drag the handles) and a "Keep" button shows
// above the menu; kept words go to the Diary with the idea they came from.
let keepBar = null; let keepTimer = 0;
function keepableSelection() {
  const sel = getSelection();
  if (!sel || sel.isCollapsed || !sel.rangeCount) return null;
  const text = sel.toString().replace(/\s+/g, ' ').trim();
  const stage = document.querySelector('.stage');
  const id = stage?.dataset.node;
  if (!id || text.length < 2 || !stage.contains(sel.getRangeAt(0).commonAncestorContainer)) return null;
  if (sel.anchorNode?.parentElement?.closest('input, textarea')) return null;
  return { id, text: text.slice(0, 2000) };
}
function showKeepBar() {
  const pick = keepableSelection();
  if (!pick) { keepBar?.classList.remove('on'); return; }
  if (!keepBar) {
    keepBar = h('div', { class: 'keep-bar', role: 'toolbar', 'aria-label': 'Keep the chosen words' },
      h('button', { type: 'button', class: 'chip', onpointerdown: (e) => e.preventDefault(), onclick: async () => {
        const now = keepableSelection(); if (!now) return keepBar.classList.remove('on');
        try {
          await api('/api/highlight', { method: 'POST', body: { node_id: now.id, text: now.text } });
          getSelection().removeAllRanges(); keepBar.classList.remove('on');
          notice('Kept. You will find it in your Diary.');
        } catch { notice('Could not keep that. Try again.'); }
      } }, '✦ Keep these words'));
    document.body.append(keepBar);
  }
  keepBar.classList.add('on');
}
document.addEventListener('selectionchange', () => { clearTimeout(keepTimer); keepTimer = setTimeout(showKeepBar, 250); });

// A short message at the top of the screen that fades away.
function notice(text) {
  const n = h('div', { class: 'toast', role: 'status' }, text);
  document.body.append(n); setTimeout(() => n.remove(), 6000);
}
// Speaking instead of typing, for any text box. Two ways, chosen once:
//  - When the server has an ElevenLabs key, the phone records (MediaRecorder) and ElevenLabs Scribe writes it down:
//    far more exact, and the same on every phone. It records through pauses for thought until the user taps again,
//    or until nothing has been heard for a while.
//  - Otherwise the browser's own speech recognition. On Android Chrome its "continuous" mode repeats words (each
//    result carries everything heard so far), so there it listens one phrase at a time, keeps only the latest
//    version of each phrase, and starts again after each pause.
// Returns { button, start, stop, active } or null where the phone can do neither.
const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const ANDROID = /Android/i.test(navigator.userAgent);
const canRecord = Boolean(navigator.mediaDevices?.getUserMedia && window.MediaRecorder);
let sttOn = null;
// What happened, in the server window: each step of speaking in, so a glitch on a phone can be traced.
const voiceLog = (event, detail = '') => { fetch('/api/voicelog', { method: 'POST', headers: { 'x-continuum-token': token(), 'content-type': 'application/json' }, body: JSON.stringify({ event, detail: String(detail).slice(0, 300) }) }).catch(() => {}); };
// The way of speaking in can be chosen in the Voice sheet: auto (ElevenLabs when the server has it), or the phone's.
const STT_KEY = 'continuum.speakin';
const speakInWay = () => store.get(STT_KEY) ?? 'auto';
const sttEnabled = async () => { if (sttOn === null) sttOn = await api('/api/stt').then((r) => r.enabled).catch(() => null); return Boolean(sttOn); };
if (canRecord) sttEnabled();
const canSpeakIn = () => Boolean(Recognition || (canRecord && sttOn !== false));
function dictation(ta, { label = 'Speak', onStart = () => {}, onDone = () => {}, onBlocked = (m) => notice(m), quietMs = 30000 } = {}) {
  if (!canSpeakIn()) return null;
  const button = h('button', { type: 'button', class: 'btn ghost mic', 'aria-pressed': 'false' }, label);
  let listening = false; let before = ''; let engine = null;
  const show = (state) => {
    button.setAttribute('aria-pressed', String(state === 'on'));
    button.classList.toggle('on', state === 'on'); button.disabled = state === 'busy';
    button.textContent = state === 'on' ? 'Listening… tap when done' : state === 'busy' ? 'Writing it down…' : label;
  };
  const put = (text) => { ta.value = `${before}${text}`.replace(/\s+/g, ' ').trimStart(); };
  const done = (text) => { listening = false; show('off'); ta.dispatchEvent(new Event('input', { bubbles: true })); onDone((text ?? '').trim()); };
  const blocked = () => { listening = false; show('off'); onBlocked('The microphone is blocked for this site. Allow it in Chrome (the icon left of the address), then try again.'); };

  // ── Recording, written down by ElevenLabs ──
  // ear: an AudioContext made at the tap itself (Android keeps one made later switched off), used only to stop by
  // itself after a long silence. If it is not running, recording simply goes on until the user taps again.
  function recorder(ear) {
    let rec = null; let stream = null; let chunks = []; let timer = 0; let lastVoice = 0; let cancelled = false; let began = 0;
    const release = () => { clearInterval(timer); stream?.getTracks().forEach((t) => t.stop()); ear?.close().catch(() => {}); stream = null; ear = null; };
    return {
      async start() {
        try { stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } }); } catch (e) { voiceLog('microphone refused', e?.name); release(); return blocked(); }
        if (!listening) return release(); // stopped while asking for the microphone
        const type = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'].find((t) => MediaRecorder.isTypeSupported?.(t)) ?? '';
        try { rec = new MediaRecorder(stream, type ? { mimeType: type } : undefined); } catch (e) { voiceLog('recorder failed', `${type} ${e?.name}`); release(); sttOn = false; listening = false; show('off'); return notice('Recording is not available on this phone; using its own voice typing instead. Tap Speak again.'); }
        chunks = []; cancelled = false; lastVoice = Date.now(); began = Date.now();
        rec.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
        rec.onerror = (e) => voiceLog('recorder error', e?.error?.name ?? '');
        rec.onstop = async () => {
          const secs = (Date.now() - began) / 1000; const earState = ear?.state ?? 'none';
          release();
          if (cancelled) { voiceLog('cancelled', `${secs.toFixed(1)} s`); return; }
          const blob = new Blob(chunks, { type: rec.mimeType || type || 'audio/webm' });
          voiceLog('recorded', `${secs.toFixed(1)} s, ${Math.round(blob.size / 1024)} KB, ${blob.type}, ear ${earState}`);
          if (secs < .7 || blob.size < 1000) { notice('I did not catch anything. Tap Speak, talk, then tap again when you are done.'); return done(''); }
          show('busy');
          try {
            const r = await fetch(`/api/stt?lang=${(navigator.language || 'en').slice(0, 2)}`, { method: 'POST', headers: { 'x-continuum-token': token(), 'content-type': blob.type.split(';')[0] || 'audio/webm' }, body: blob });
            const j = await r.json().catch(() => ({}));
            if (!r.ok) throw Object.assign(new Error(j.error || `http_${r.status}`), { why: j.why, status: r.status });
            voiceLog('written down', `${(j.text ?? '').length} characters`);
            if (!j.text) notice('Nothing was heard in that recording. Try again a little closer to the phone.');
            put(j.text ?? ''); done(j.text ?? '');
          } catch (e) {
            voiceLog('not written down', `${e.status ?? ''} ${e.message} ${e.why ?? ''}`);
            // ElevenLabs said no (often a key without speech-to-text access): use the phone's own voice typing from now on.
            if (e.status === 502 && Recognition) sttOn = false;
            notice(`Could not write that down${e.why ? `: ${e.why}` : ''}.${e.status === 502 && Recognition ? ' Switching to the phone\'s own voice typing; tap Speak again.' : ' Try again, or type it.'}`);
            done('');
          }
        };
        if (ear?.state === 'running') {
          try {
            const an = ear.createAnalyser(); an.fftSize = 1024; ear.createMediaStreamSource(stream).connect(an);
            const buf = new Uint8Array(an.fftSize);
            timer = setInterval(() => {
              an.getByteTimeDomainData(buf);
              let sum = 0; for (const v of buf) sum += (v - 128) ** 2;
              if (Math.sqrt(sum / buf.length) > 4) lastVoice = Date.now();
              if (Date.now() - lastVoice > quietMs && rec?.state === 'recording') rec.stop();
            }, 200);
          } catch { /* no ear: record until tapped */ }
        }
        rec.start(1000);
      },
      finish() { if (rec?.state === 'recording') rec.stop(); else { release(); done(''); } },
      cancel() { cancelled = true; if (rec?.state === 'recording') rec.stop(); else release(); },
    };
  }

  // ── The browser's own recognition ──
  function recognizer() {
    let rec = null; let heard = ''; let quiet = 0;
    const hush = () => { clearTimeout(quiet); quiet = setTimeout(() => { if (listening) { listening = false; rec?.stop(); } }, quietMs); };
    function listen() {
      const r = rec = new Recognition();
      r.lang = navigator.language || 'en-US'; r.interimResults = true; r.continuous = !ANDROID;
      let session = '';
      r.onresult = (e) => {
        const list = [...e.results];
        if (ANDROID) session = list.at(-1)?.[0]?.transcript ?? session; // the latest version of this phrase only
        else session = list.map((x) => x[0].transcript).join(' ');
        hush(); put(`${heard} ${session}`);
      };
      r.onerror = (e) => { voiceLog('phone recognition error', e.error); if (e.error === 'not-allowed' || e.error === 'service-not-allowed') blocked(); };
      r.onend = () => {
        heard = `${heard} ${session}`.replace(/\s+/g, ' ').trim(); rec = null;
        if (listening) { try { listen(); return; } catch { listening = false; } }
        clearTimeout(quiet); voiceLog('phone recognition done', `${heard.length} characters`); put(heard); done(heard);
      };
      r.start();
    }
    return {
      start() { heard = ''; hush(); try { listen(); } catch { listening = false; show('off'); } },
      finish() { listening = false; if (rec) rec.stop(); else { clearTimeout(quiet); done(heard); } },
      cancel() { listening = false; clearTimeout(quiet); if (rec) { rec.onend = null; rec.abort(); rec = null; } },
    };
  }

  async function start() {
    if (listening) return;
    onStart();
    listening = true; before = ta.value.trim() ? `${ta.value.trim()} ` : '';
    show('on');
    // Made right at the tap, before anything is awaited, so Android lets it run.
    let ear = null;
    try { ear = new (window.AudioContext || window.webkitAudioContext)(); ear.resume?.().catch(() => {}); } catch { ear = null; }
    const useRecorder = canRecord && speakInWay() !== 'phone' && await sttEnabled();
    voiceLog('start', useRecorder ? 'ElevenLabs recording' : Recognition ? `phone recognition${ANDROID ? ' (Android, phrase by phrase)' : ''}` : 'none');
    if (!useRecorder) ear?.close().catch(() => {});
    engine = useRecorder ? recorder(ear) : Recognition ? recognizer() : null;
    if (!engine) { listening = false; show('off'); return notice('Speaking is not available on this phone. Type instead.'); }
    engine.start();
  }
  function stop() { const was = listening; listening = false; engine?.cancel(); if (was || button.classList.contains('on')) show('off'); }
  button.addEventListener('click', () => { if (button.disabled) return; if (listening) { listening = false; engine?.finish(); return; } start(); });
  return { button, start, stop, active: () => listening };
}
listenBtn.addEventListener('click', () => (reading ? stopReading() : readStage()));
voiceBtn.addEventListener('click', () => chooseVoice());
speech?.getVoices(); // starts loading the phone's voice list
addEventListener('pagehide', () => { speech?.cancel(); audioEl.pause(); });

// Speaking into the app: which way (ElevenLabs writes down a recording; or the phone's own voice typing), and a test
// that shows what was heard, so a glitch can be seen and named.
function speakInSection() {
  const ta = h('textarea', { rows: '2', placeholder: 'Tap Test, say a sentence, then tap again.', 'aria-label': 'Microphone test' });
  const out = h('p', { class: 'muted small', role: 'status' });
  const dict = dictation(ta, { label: 'Test the microphone', onDone: (said) => { out.textContent = said ? `Heard ${said.split(/\s+/).length} words. If they are wrong or repeated, try the other way above.` : 'Nothing came through. Check the message at the top, and the server window.'; } });
  const way = (k, label) => h('button', { type: 'button', class: `chip ${speakInWay() === k ? 'on' : ''}`, 'aria-pressed': String(speakInWay() === k), onclick: (e) => {
    store.set(STT_KEY, k); if (k !== 'phone') sttOn = null;
    e.currentTarget.parentElement.querySelectorAll('.chip').forEach((c) => { const on = c === e.currentTarget; c.classList.toggle('on', on); c.setAttribute('aria-pressed', String(on)); });
  } }, label);
  return h('div', {},
    h('div', { class: 'eyebrow', style: 'margin-top:16px' }, 'Speaking in'),
    h('div', { class: 'size-chips', role: 'group', 'aria-label': 'Speaking in' },
      way('auto', sttOn === false ? 'ElevenLabs (off on the server)' : 'ElevenLabs: most exact'),
      Recognition && way('phone', 'The phone\'s voice typing')),
    ta, h('div', { class: 'row', style: 'justify-content:flex-start' }, dict?.button ?? h('span', { class: 'muted small' }, 'This phone cannot record.')), out);
}
async function chooseVoice() {
  stopReading();
  const sample = 'Some things are up to us, and some are not.';
  const on = await ttsEnabled();
  const el = on ? await api('/api/tts/voices').catch(() => null) : null;
  const saved = store.get(VOICE_KEY) ?? '';
  const current = saved.startsWith('el:') || saved.startsWith('phone:') ? saved : on ? '' : saved && `phone:${saved}`;
  const all = speech?.getVoices() ?? [];
  const lang = (navigator.language || 'en').slice(0, 2).toLowerCase();
  const phoneVoices = [...all.filter((v) => v.lang.toLowerCase().startsWith(lang)), ...all.filter((v) => !v.lang.toLowerCase().startsWith(lang))];
  let previewing = null;
  const preview = async (key) => {
    speech?.cancel(); audioEl.pause(); previewing?.wake?.();
    const run = previewing = { wake: null };
    if (key.startsWith('el:') || (!key && on)) {
      try { await playClip(await fetchClip(sample, key.slice(3) || null), run); } catch (e) { notice(`That voice could not be played${e.why ? `: ${e.why}` : '. Check the ElevenLabs key or credits'}.`); }
    } else if (speech) sayPhone(sample, all.find((v) => `phone:${v.name}` === key) ?? null, run);
  };
  const row = (label, note, key) => h('button', {
    type: 'button', class: 'voice-row', role: 'menuitemradio', 'aria-checked': String(current === key), 'data-key': key,
    onclick: (e) => {
      if (key) store.set(VOICE_KEY, key); else store.del(VOICE_KEY);
      sheet.querySelectorAll('.voice-row').forEach((r) => r.setAttribute('aria-checked', String(r === e.currentTarget)));
      preview(key);
    },
  }, h('span', {}, label), h('small', {}, note));
  const defaultName = el?.voices.find((v) => v.id === el.default)?.name;
  const sheet = h('div', { class: 'voices-sheet', role: 'menu', 'aria-label': 'Reading voice' },
    h('h2', {}, 'Reading voice'),
    h('div', { class: 'eyebrow', style: 'margin-top:8px' }, 'Speed'),
    h('div', { class: 'size-chips', role: 'group', 'aria-label': 'Reading speed' }, RATES.map(([label, v]) => h('button', {
      type: 'button', class: `chip ${v === readRate() ? 'on' : ''}`, 'aria-pressed': String(v === readRate()),
      onclick: (e) => {
        store.set(RATE_KEY, String(v));
        e.currentTarget.parentElement.querySelectorAll('.chip').forEach((c) => {
          const on = c === e.currentTarget; c.classList.toggle('on', on); c.setAttribute('aria-pressed', String(on));
        });
        preview(sheet.querySelector('.voice-row[aria-checked="true"]')?.dataset.key ?? '');
      },
    }, label))),
    speakInSection(),
    h('div', { class: 'eyebrow', style: 'margin-top:16px' }, 'Voice'),
    h('p', { class: 'muted small' }, 'Tap a voice to hear it.'),
    row('Default', on ? `natural voice${defaultName ? ` · ${defaultName}` : ''}` : 'your phone\'s voice', ''),
    on && !el && h('p', { class: 'notice' }, 'The natural voices could not be listed. The server window says why; the default natural voice may still work.'),
    el && h('div', { class: 'eyebrow', style: 'margin-top:16px' }, 'Natural voices · ElevenLabs'),
    el?.voices.map((v) => row(v.name, v.note, `el:${v.id}`)),
    phoneVoices.length > 0 && h('div', { class: 'eyebrow', style: 'margin-top:16px' }, 'Phone voices'),
    phoneVoices.map((v) => row(v.name, `${v.lang}${v.localService ? '' : ' · online'}`, `phone:${v.name}`)),
    h('div', { class: 'row', style: 'margin-top:12px' }, h('span'), h('button', { type: 'button', class: 'btn', onclick: () => close() }, 'Done')));
  const box = h('div', { class: 'voices', onclick: (e) => { if (e.target === box) close(); } }, sheet);
  const close = () => { speech?.cancel(); audioEl.pause(); previewing?.wake?.(); box.remove(); voiceBtn.focus(); };
  document.body.append(box);
  sheet.querySelector('.voice-row[aria-checked="true"]')?.focus();
}
ttsEnabled();

// Look: step inside the background picture for a pause. Drag to wander, pinch or scroll to look closer, tap to
// return. Left alone, the view drifts slowly across the picture, the way an eye rests on a painting.
const lookBtn = document.getElementById('look');
lookBtn.addEventListener('click', () => gaze(wallpaper.querySelector('img').getAttribute('src')));
function gaze(src) {
  if (!src || document.querySelector('.gaze')) return;
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const img = h('img', { src, alt: '', draggable: 'false' });
  const hint = h('div', { class: 'gaze-hint' }, h('span', {}, 'Drag to look around · pinch to look closer · tap to return'));
  const close = h('button', { type: 'button', class: 'gaze-close' }, 'Return');
  const box = h('div', { class: 'gaze', role: 'dialog', 'aria-label': 'The picture, to look at' }, img, hint, close);
  document.body.append(box);
  document.documentElement.classList.add('gazing');
  let base = 1, zoom = 1, x = 0, y = 0, raf = 0, lastTouch = performance.now(), vx = .18, vy = .09, done = false;
  const fit = () => { base = Math.max(innerWidth / img.naturalWidth, innerHeight / img.naturalHeight); };
  const draw = () => {
    const sc = base * zoom;
    x = Math.min(0, Math.max(innerWidth - img.naturalWidth * sc, x));
    y = Math.min(0, Math.max(innerHeight - img.naturalHeight * sc, y));
    img.style.transform = `translate(${x}px, ${y}px) scale(${sc})`;
  };
  const zoomAt = (z, cx, cy) => {
    const next = Math.min(3, Math.max(1, z));
    x = cx - (cx - x) * (next / zoom); y = cy - (cy - y) * (next / zoom); zoom = next; draw();
  };
  const drift = () => {
    if (performance.now() - lastTouch > 2500) {
      const px = x, py = y; x += vx; y += vy; draw();
      if (x === px) vx = -vx; if (y === py) vy = -vy; // reached an edge: turn back
    }
    raf = requestAnimationFrame(drift);
  };
  img.decode().catch(() => {}).then(() => {
    fit(); const sc = base * zoom;
    x = (innerWidth - img.naturalWidth * sc) / 2; y = (innerHeight - img.naturalHeight * sc) / 2; draw();
    requestAnimationFrame(() => box.classList.add('in'));
    if (!still) raf = requestAnimationFrame(drift);
  });
  setTimeout(() => hint.classList.add('gone'), 3500);

  const pts = new Map();
  let moved = 0, downAt = 0, pinch = null;
  box.addEventListener('pointerdown', (e) => {
    if (e.target === close) return;
    box.setPointerCapture(e.pointerId); pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pts.size === 1) { moved = 0; downAt = performance.now(); }
    box.classList.add('dragging'); lastTouch = performance.now();
  });
  box.addEventListener('pointermove', (e) => {
    const prev = pts.get(e.pointerId); if (!prev) return;
    const cur = { x: e.clientX, y: e.clientY };
    if (pts.size === 1) { x += cur.x - prev.x; y += cur.y - prev.y; draw(); }
    pts.set(e.pointerId, cur);
    if (pts.size === 2) {
      const [a, b] = [...pts.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinch) zoomAt(zoom * (d / pinch), (a.x + b.x) / 2, (a.y + b.y) / 2);
      pinch = d;
    }
    moved += Math.hypot(cur.x - prev.x, cur.y - prev.y); lastTouch = performance.now();
  });
  const up = (e) => {
    if (!pts.delete(e.pointerId)) return;
    if (pts.size < 2) pinch = null;
    if (!pts.size) {
      box.classList.remove('dragging');
      if (e.type === 'pointerup' && moved < 8 && performance.now() - downAt < 400) leave();
    }
  };
  box.addEventListener('pointerup', up); box.addEventListener('pointercancel', up);
  box.addEventListener('wheel', (e) => { e.preventDefault(); lastTouch = performance.now(); zoomAt(zoom * Math.exp(-e.deltaY / 400), e.clientX, e.clientY); }, { passive: false });
  const onKey = (e) => { if (e.key === 'Escape') leave(); };
  const onResize = () => { fit(); draw(); };
  addEventListener('keydown', onKey); addEventListener('resize', onResize);
  close.addEventListener('click', () => leave());
  close.focus();
  function leave() {
    if (done) return; done = true;
    cancelAnimationFrame(raf); removeEventListener('keydown', onKey); removeEventListener('resize', onResize);
    box.classList.remove('in'); document.documentElement.classList.remove('gazing');
    setTimeout(() => box.remove(), still ? 0 : 600);
    lookBtn.focus();
  }
}

function renderStage(node, panels, { links = [], startAt = 0, onSource = null, background = null, backgroundMax = 1 } = {}) {
  stopReading();
  const wrap = h('div', { class: `stage field-${node.field}`, 'data-node': node.id }, panels);
  render(wrap);
  document.documentElement.classList.add('staged'); wake();
  setWallpaper(background, backgroundMax);
  setMotif(motifFor(node), wrap);
  motifLevel(1);
  dockLinks.replaceChildren(...links.filter(Boolean));
  rail.replaceChildren(...panels.map((p, i) => h('button', {
    type: 'button', class: 'dot', 'aria-label': p.dataset.label, title: p.dataset.label,
    onclick: () => p.scrollIntoView({ behavior: 'smooth', block: 'start' }),
  })));
  rail.hidden = panels.length < 2;
  stageObserver?.disconnect();
  let sawSource = false;
  // By day, the end of an idea ("Keep exploring") opens into a bright plate, like stepping out into daylight; scrolling
  // back up returns to the idea's own picture. Never before writing (a closed card's picture stays a hint).
  const daylight = backgroundMax >= 1 && brightFor(`end:${node.id}`);
  let outside = false;
  const step = (out) => {
    if (!daylight || out === outside) return;
    outside = out;
    wallpaper.classList.remove('on');
    setTimeout(() => { if (document.body.contains(wrap)) setWallpaper(out ? daylight : background, backgroundMax); }, 350);
  };
  stageObserver = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const p = e.target; const i = panels.indexOf(p);
      if (e.isIntersecting && e.intersectionRatio > .3) {
        p.classList.add('in'); p.classList.remove('past');
        rail.querySelectorAll('.dot').forEach((d, k) => d.classList.toggle('on', k === i));
        motifLevel(LEVEL[p.dataset.kind] ?? .7);
        if (p.dataset.kind === 'source' && !sawSource) { sawSource = true; onSource?.(); }
        step(p.dataset.kind === 'end');
      } else if (!e.isIntersecting && e.boundingClientRect.top < 0) p.classList.add('past');
      else if (!e.isIntersecting) p.classList.remove('past');
    }
  }, { threshold: [0, .3, .6] });
  panels.forEach((p) => stageObserver.observe(p));
  if (startAt) requestAnimationFrame(() => panels[startAt]?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
}

// Everything that isn't a stage: no motif, no rail, no card links.
function unstage() {
  document.documentElement.classList.remove('staged');
  stopReading();
  stageObserver?.disconnect(); stageObserver = null;
  setMotif(null); rail.replaceChildren(); rail.hidden = true; dockLinks.replaceChildren(); setWallpaper(null);
}

function cardLinks(node, trail) {
  const back = trail.length ? trail[trail.length - 1] : null;
  return [
    h('button', { type: 'button', class: 'chip', onclick: () => (back ? walkTo(back.id, trail.slice(0, -1)) : showToday()) },
      back ? `← ${back.thinker ?? back.title}` : '← Wander'),
    node.year != null && h('button', { type: 'button', class: 'chip', onclick: () => showGallery('timeline', { focus: node.id }) }, 'Timeline'),
    node.room && h('button', { type: 'button', class: 'chip', onclick: () => showGallery('rooms', { focus: node.id }) }, 'Room'),
    node.source_face && favoriteButton(node),
  ];
}

function showConcept(node, trail, opts = {}) {
  renderStage(node, conceptPanels(node, trail, opts), {
    links: cardLinks(node, trail), startAt: opts.startAt ?? 0, background: node.background ?? null,
    onSource: () => api('/api/event', { method: 'POST', body: { kind: 'flip', node_id: node.id, date: today() } }).catch(() => {}),
  });
}

function writeView(data) {
  const node = data.node;
  const draftKey = `continuum.draft.${node.id}`;
  const ta = h('textarea', { id: 'resp', placeholder: 'Write before you read. There are no wrong answers.', maxlength: '5000' });
  ta.value = store.get(draftKey) ?? '';
  const submit = h('button', { type: 'submit', class: 'btn', disabled: !ta.value.trim() }, 'Done. Show me the idea');
  const status = h('span', { class: 'muted small', role: 'status' });
  ta.addEventListener('input', () => { submit.disabled = !ta.value.trim(); store.set(draftKey, ta.value); });
  const form = h('form', {
    class: 'write',
    onsubmit: async (e) => {
      e.preventDefault();
      submit.disabled = true;
      status.textContent = 'Saving…';
      try {
        const { node: full } = await api('/api/respond', { method: 'POST', body: { node_id: node.id, body: ta.value, date: today() } });
        store.del(draftKey);
        doneView({ ...data, state: 'done_today', done: data.done + 1, node: full }, { reveal: true });
      } catch (err) {
        const stale = err.message === 'already_answered_today' || err.message === 'not_todays_node';
        status.textContent = stale ? 'Today has changed. Reloading…' : 'Could not save. Your draft is kept; try again.';
        submit.disabled = false;
        if (stale) setTimeout(showToday, 1200);
      }
    },
  },
    h('label', { for: 'resp', class: 'prompt' }, node.prompt ?? 'What do you think?'),
    ta,
    h('div', { class: 'row' }, dictation(ta, { label: 'Say it instead' })?.button ?? status, submit),
    canSpeakIn() && h('div', { class: 'row' }, status));
  setNav('today');
  renderStage(node, [
    panel('arrival', 'Today\'s idea', [
      h('div', { class: 'eyebrow' }, journeyLine(data.journey)),
      h('div', { class: 'who' }, typeLine(node)),
      h('h1', {}, node.title),
      nameReveal(node),
      node.why && h('p', { class: 'muted small why' }, node.why),
      hint('Scroll to the question'),
    ]),
    panel('question', 'The question', [form, checkinCard(data), doors()]),
  ], { background: node.backdrop ?? null, backgroundMax: .45 });
}

// The top of Today's card: the user's own walk, not a fixed count. "Day 6 of your walk · 23 ideas met · 3 days in a row"
function journeyLine(j) {
  if (!j) return 'Today';
  return [`Day ${j.day} of your walk`, j.met && `${j.met} ${j.met === 1 ? 'idea' : 'ideas'} met`,
    j.streak >= 2 && `${j.streak} days in a row`].filter(Boolean).join(' · ');
}

function doneView(data, { reveal = false } = {}) {
  const msg = 'That\'s today\'s card. Walk as far as you like, or talk it over; tomorrow\'s idea is chosen from what you write and say.';
  setNav('today');
  const intro = h('div', {}, h('div', { class: 'eyebrow' }, journeyLine(data.journey)), h('p', { class: 'muted small' }, msg));
  // After writing: today's small lessons. A problem to consider for today's idea, a review of an earlier one, and
  // (about once a week) a debate to check your bearings.
  problemCard(intro, data.node);
  recallCard(intro);
  bearings(intro);
  const k = checkinCard(data); if (k) intro.append(k);
  intro.append(doors());
  showConcept(data.node, [], {
    intro,
    startAt: reveal ? 1 : 0,
  });
}

function completeView(data) {
  render(
    h('div', { class: 'eyebrow' }, journeyLine(data.journey)),
    h('h1', {}, 'You have written on every idea on the map.'),
    h('p', {}, 'Everything you wrote is in your diary. New ideas are added as the map grows; until then, walk it from any entry.'),
    h('div', { class: 'row', style: 'justify-content:flex-start' },
      h('button', { type: 'button', class: 'btn', onclick: () => showReview(0) }, 'See where it led'),
      h('button', { type: 'button', class: 'btn ghost', onclick: showJournal }, 'Open your diary')));
}

// The review: what you wrote, where you walked, what it landed on. days = 7 for the week, 0 for everything.
function showReview(days = 7) {
  setNav('review');
  return guarded(async () => {
    const r = await api(`/api/review?days=${days}&date=${today()}`);
    const span = days ? `Last ${days} days` : 'The whole walk';
    const toggle = h('div', { class: 'row', style: 'justify-content:flex-start' },
      h('button', { type: 'button', class: `btn ${days === 7 ? '' : 'ghost'}`, onclick: () => showReview(7) }, 'This week'),
      h('button', { type: 'button', class: `btn ${days === 0 ? '' : 'ghost'}`, onclick: () => showReview(0) }, 'Everything'));
    const changed = r.reactions.changed + r.reactions.somewhat;
    const answered = changed + r.reactions.unchanged;
    pageBg = changed ? moodPlate('change') : null; // a mind changed this week: the river finding new channels
    const practices = r.practices.length
      ? h('div', {}, h('h2', {}, 'Where it kept landing'),
          h('p', { class: 'muted small' }, 'The practices your walks arrived at, most often first.'),
          h('div', { class: 'bubbles' }, r.practices.map((p) => h('button', { type: 'button', class: 'bubble field-practice', onclick: () => walkTo(p.id, []) },
            h('span', { class: 'b-title' }, p.title), h('span', { class: 'b-note' }, `${p.count} ${p.count === 1 ? 'walk' : 'walks'} ended here`)))))
      : null;
    const walked = r.walked.length
      ? h('div', {}, h('h2', {}, 'Who you kept returning to'),
          h('div', { class: 'bubbles' }, r.walked.slice(0, 5).map((n) => h('button', { type: 'button', class: `bubble field-${n.field}`, onclick: () => walkTo(n.id, []) },
            n.thinker && h('span', { class: 'b-who' }, n.thinker), h('span', { class: 'b-title' }, n.title), h('span', { class: 'b-note' }, `${n.count} ${n.count === 1 ? 'visit' : 'visits'}`)))))
      : null;
    const minds = answered
      ? h('p', {}, `You answered "did it change your mind?" ${answered} ${answered === 1 ? 'time' : 'times'}: yes ${r.reactions.changed}, a little ${r.reactions.somewhat}, no ${r.reactions.unchanged}.`)
      : null;
    const entries = r.entries.length
      ? h('div', {}, h('h2', {}, days ? 'What you wrote this week' : 'Everything you wrote'),
          h('ul', { class: 'path' }, r.entries.map((e) => h('li', {},
            h('button', { type: 'button', class: 'link', style: 'padding:0;text-align:left', onclick: () => walkTo(e.id, []) }, h('span', { class: 't' }, e.title)),
            h('div', { class: 'muted small' }, [e.thinker, e.local_date, e.reaction && REACTION_LABEL[e.reaction]].filter(Boolean).join(' · ')),
            h('p', {}, e.body)))))
      : h('p', { class: 'muted' }, days ? 'Nothing written in the last week yet.' : 'Nothing written yet.');
    const bookends = !days && r.bookends && r.bookends.first.id !== r.bookends.last.id
      ? h('div', { class: 'notice' },
          h('div', { class: 'eyebrow' }, 'First and last'),
          h('p', { class: 'small muted' }, `Day 1 asked: ${r.bookends.first.prompt}`), h('div', { class: 'yours' }, r.bookends.first.body),
          h('p', { class: 'small muted', style: 'margin-top:12px' }, `Last asked: ${r.bookends.last.prompt}`), h('div', { class: 'yours' }, r.bookends.last.body),
          h('p', { class: 'prompt' }, 'What did you believe on day 1 that you do not now?'))
      : null;
    render(
      h('h1', {}, 'Review'),
      toggle,
      h('p', { class: 'muted small' }, `${span}: active on ${r.days_active} ${r.days_active === 1 ? 'day' : 'days'}, ${r.entries.length} ${r.entries.length === 1 ? 'entry' : 'entries'}.`),
      days ? h('p', { class: 'prompt' }, 'What did you believe on Monday that you do not on Sunday?') : null,
      bookends, practices, walked, minds, entries);
  });
}

// The gallery of thought: every idea on the map, open to wander at any time, in two arrangements.
// 'rooms' = wings by region, tradition or theme; 'timeline' = date order. Daily cards the user has not reached yet
// show thinker and year only ("Coming up") so the daily practice still starts with writing.
const ERAS = [
  [-Infinity, -500, 'Before 500 BCE'], [-500, 500, '500 BCE to 500 CE'], [500, 1450, '500 to 1450'],
  [1450, 1800, '1450 to 1800'], [1800, 1900, '1800 to 1900'], [1900, Infinity, '1900 to now'],
];
const TL_STATE = { written: 'You wrote on this', visited: 'Visited', today: "Today's card: write first", upcoming: 'Coming up' };
const openEntry = (n) => (n.state === 'today' ? showToday() : walkTo(n.id, []));

function showGallery(arrangement = 'rooms', { focus = null, featuredOnly = false, theme = null, kind = 'all', search = false } = {}) {
  setNav('gallery');
  return guarded(async () => {
    const [{ nodes, rooms }, index] = await Promise.all([
      api(`/api/timeline?date=${today()}`),
      arrangement === 'themes' ? api(`/api/themes?date=${today()}`) : null,
    ]);
    const met = nodes.filter((n) => n.state === 'written' || n.state === 'visited').length;
    const wander = () => {
      const open = nodes.filter((n) => n.state !== 'upcoming' && n.state !== 'today');
      const fresh = open.filter((n) => n.state === 'unseen');
      const pool = fresh.length ? fresh : open;
      openEntry(pool[Math.floor(Math.random() * pool.length)]);
    };
    const switcher = h('div', { class: 'row', style: 'justify-content:flex-start' },
      h('button', { type: 'button', class: `btn ${arrangement === 'rooms' ? '' : 'ghost'}`, onclick: () => showGallery('rooms') }, 'Rooms'),
      h('button', { type: 'button', class: `btn ${arrangement === 'timeline' ? '' : 'ghost'}`, onclick: () => showGallery('timeline') }, 'Timeline'),
      h('button', { type: 'button', class: `btn ${arrangement === 'themes' ? '' : 'ghost'}`, onclick: () => showGallery('themes') }, 'Themes'),
      h('button', { type: 'button', class: 'btn ghost', onclick: () => showMap() }, 'Map'),
    );
    const intro = h('p', { class: 'muted small' },
      `${nodes.length} ideas in ${new Set(nodes.map((n) => n.room)).size} rooms. Open any of them, any time. You have met ${met}. `
      + 'Today\'s card opens once you have written on it.');
    const body = arrangement === 'rooms' ? galleryRooms(nodes, rooms, focus)
      : arrangement === 'themes' ? galleryThemes(index.themes, theme, kind)
        : galleryTimeline(nodes, focus, featuredOnly);
    // Search sits above every arrangement. Results replace the arrangement while there is a query, without
    // re-rendering the page, so typing keeps focus.
    const browse = h('div', {}, switcher, intro, ...body);
    const results = h('div', { class: 'search-results', hidden: true, 'aria-live': 'polite' });
    const box = h('input', {
      type: 'search', class: 'search', placeholder: 'Search themes, questions, thinkers, cases…', 'aria-label': 'Search the gallery',
      autocomplete: 'off', enterkeyhint: 'search',
    });
    let timer = 0; let seq = 0;
    box.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(async () => {
        const qv = box.value.trim(); const mine = ++seq;
        if (qv.length < 2) { results.hidden = true; browse.hidden = false; return; }
        const r = await api(`/api/search?q=${encodeURIComponent(qv)}&date=${today()}`).catch(() => null);
        if (!r || mine !== seq) return;
        results.replaceChildren(...searchResults(r));
        results.hidden = false; browse.hidden = true;
      }, 220);
    });
    const wanderBtn = h('button', { type: 'button', class: 'btn ghost wander', onclick: wander, title: 'Open a thinker you have not met yet' }, 'Explore ↝');
    render(h('h1', {}, 'Explore'), h('div', { class: 'search-row' }, box, wanderBtn), results, browse);
    setMotif('sky'); motifLevel(.9); setSkyFocus(1); // a quiet night sky over the Gallery, where constellations drift by
    if (search) box.focus();
    const el = (focus && view.querySelector(`[data-id="${CSS.escape(focus)}"]`)) || (theme && document.getElementById(`theme-${theme}`));
    if (el) el.scrollIntoView({ block: theme && !focus ? 'start' : 'center' });
  });
}

// The Map of ideas, over the observatory plate (see mapview.js).
function showMap() {
  setNav('gallery');
  return guarded(async () => {
    const data = await api(`/api/map?date=${today()}`);
    pageBg = PAGE_BG.map;
    const mount = h('div', { class: 'map bare' });
    render(h('h1', {}, 'Map of ideas'),
      h('p', {}, 'Every idea in the gallery as a point of light. The ones you have met shine; the faint ones are still to explore.'),
      mount,
      h('div', { class: 'row', style: 'justify-content:flex-start' }, h('button', { type: 'button', class: 'btn ghost', onclick: () => showGallery('rooms') }, '← Gallery')));
    mountMap(mount, data, {
      h, onOpen: openEntry,
      onTrail: async (from, ids) => {
        try { await api('/api/trail', { method: 'POST', body: { from_id: from.id, ids, date: today() } }); notice(`Journey started from "${from.title}". Your next daily ideas follow it, one stop a day.`); return true; }
        catch { notice('Could not start the journey. Try again.'); return false; }
      },
    });
  });
}

function galleryRooms(nodes, rooms, focus) {
  const byRoom = new Map(rooms.map((r) => [r.id, []]));
  for (const n of nodes) byRoom.get(n.room)?.push(n);
  const index = h('nav', { class: 'room-index', 'aria-label': 'Rooms' }, rooms.map((r) => h('button', {
    type: 'button', class: 'chip',
    onclick: () => document.getElementById(`room-${r.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
  }, r.name)));
  const tile = (n) => {
    const cls = `tile field-${n.field} state-${n.state}${n.daily ? ' featured' : ''}${n.backdrop ? ' has-backdrop' : ''}${n.id === focus ? ' focus' : ''}`;
    const inner = [
      n.backdrop && h('span', { class: 'tile-bg', 'aria-hidden': 'true' }, h('img', { src: n.backdrop, alt: '', loading: 'lazy', decoding: 'async' })),
      n.title ? h('span', { class: 'tile-title' }, n.title) : h('span', { class: 'tile-title muted' }, 'Coming up'),
      h('span', { class: 'tile-meta' }, [TYPE_LABEL[n.type], year(n.year), n.state !== 'upcoming' && TL_STATE[n.state], n.daily && n.state !== 'upcoming' && 'Daily line'].filter(Boolean).join(' · ')),
    ];
    return n.state === 'upcoming'
      ? h('div', { class: cls, 'data-id': n.id }, inner)
      : h('button', { type: 'button', class: cls, 'data-id': n.id, onclick: () => openEntry(n) }, inner);
  };
  return [index, ...rooms.filter((r) => byRoom.get(r.id).length).map((r) => h('section', { class: 'room', id: `room-${r.id}` },
    h('h2', {}, r.name),
    h('p', { class: 'muted small room-blurb' }, r.blurb),
    r.id === 'mind' && h('button', { type: 'button', class: 'btn ghost', style: 'margin:4px 0 12px', onclick: () => showWorkThrough() }, 'Work through a problem →'),
    h('div', { class: 'tiles' }, byRoom.get(r.id).map(tile))))];
}

// A catalogue row for one idea: used in themes and search results. Upcoming daily ideas stay closed.
function ideaRow(n, extra) {
  const inner = [
    h('span', { class: 'b-who' }, [TYPE_LABEL[n.type], year(n.year)].filter(Boolean).join(' · ')),
    h('span', { class: 'b-title' }, n.title ?? 'Coming up'),
    (TL_STATE[n.state] || extra) && h('span', { class: 'b-note' }, [TL_STATE[n.state], extra].filter(Boolean).join(' · ')),
  ];
  return n.state === 'upcoming'
    ? h('div', { class: `bubble field-${n.field} closed` }, inner)
    : h('button', { type: 'button', class: `bubble field-${n.field}`, onclick: () => openEntry(n) }, inner);
}

const KIND_LABEL = { theme: 'Theme', conflict: 'Conflict', dilemma: 'Dilemma' };

function galleryThemes(themes, focusTheme, kind) {
  const shown = kind === 'all' ? themes : themes.filter((t) => t.kind === kind);
  const filter = h('div', { class: 'row', style: 'justify-content:flex-start;margin-top:-4px' },
    [['all', 'Everything'], ['theme', 'Themes'], ['conflict', 'Conflicts'], ['dilemma', 'Dilemmas']].map(([k, label]) =>
      h('button', { type: 'button', class: `chip ${kind === k ? 'on' : ''}`, onclick: () => showGallery('themes', { kind: k }) }, label)));
  const contents = h('nav', { class: 'room-index', 'aria-label': 'Index' }, shown.map((t) => h('button', {
    type: 'button', class: 'chip', onclick: () => document.getElementById(`theme-${t.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
  }, t.name)));
  return [filter, contents, ...shown.map((t) => h('section', { class: `theme${t.id === focusTheme ? ' focus' : ''}`, id: `theme-${t.id}` },
    h('div', { class: 'eyebrow' }, `${KIND_LABEL[t.kind]} · ${t.nodes.length} ideas`),
    h('h2', {}, t.name),
    h('p', { class: 'prompt' }, t.question),
    h('div', { class: 'bubbles' }, t.nodes.map((n) => ideaRow(n)))))];
}

function searchResults(r) {
  const out = [];
  if (r.themes.length) out.push(h('h2', {}, 'In the index'), h('div', { class: 'bubbles' }, r.themes.map((t) => h('button', {
    type: 'button', class: 'bubble field-law', onclick: () => showGallery('themes', { theme: t.id }),
  }, h('span', { class: 'b-who' }, `${KIND_LABEL[t.kind]} · ${t.count} ideas`), h('span', { class: 'b-title' }, t.name), h('span', { class: 'b-note' }, t.question)))));
  if (r.ideas.length) out.push(h('h2', {}, 'Ideas'), h('div', { class: 'bubbles' }, r.ideas.map((n) => ideaRow(n, n.matched !== 'title' ? `found in ${n.matched}` : ''))));
  if (!out.length) out.push(h('p', { class: 'muted' }, `Nothing on the map matches "${r.q}" yet.`));
  return out;
}

function galleryTimeline(nodes, focus, featuredOnly) {
  const shown = featuredOnly ? nodes.filter((n) => n.daily) : nodes;
  const filter = h('div', { class: 'row', style: 'justify-content:flex-start;margin-top:-4px' },
    h('button', { type: 'button', class: `chip ${featuredOnly ? '' : 'on'}`, onclick: () => showGallery('timeline') }, 'Everyone'),
    h('button', { type: 'button', class: `chip ${featuredOnly ? 'on' : ''}`, onclick: () => showGallery('timeline', { featuredOnly: true }) }, 'Only the illustrated ideas'));
  const row = (n) => {
    const inner = [
      h('span', { class: 'tl-year' }, year(n.year)),
      h('span', { class: 'tl-dot', 'aria-hidden': 'true' }),
      h('span', { class: 'tl-text' },
        h('span', { class: 'b-who' }, n.thinker),
        n.title && h('span', { class: 'b-title' }, n.title),
        TL_STATE[n.state] && h('span', { class: 'tl-state' }, TL_STATE[n.state])),
    ];
    const cls = `tl-row field-${n.field} state-${n.state}${n.daily ? ' featured' : ''}${n.id === focus ? ' focus' : ''}`;
    if (n.state === 'upcoming') return h('li', { class: cls, 'data-id': n.id }, h('div', { class: 'tl-item' }, inner));
    return h('li', { class: cls, 'data-id': n.id }, h('button', { type: 'button', class: 'tl-item', onclick: () => openEntry(n) }, inner));
  };
  const eras = ERAS.map(([from, to, label]) => [label, shown.filter((n) => n.year >= from && n.year < to)])
    .filter(([, rows]) => rows.length)
    .map(([label, rows]) => h('section', { class: 'tl-era' }, h('h2', {}, label), h('ol', { class: 'timeline' }, rows.map(row))));
  return [filter, h('p', { class: 'muted small' }, 'Daily thinkers have a ring.'), ...eras];
}

function inviteView() {
  render(
    h('h1', {}, 'Continuum'),
    h('p', {}, 'One small idea a day. You write first, then read it, then follow where it came from and where it went.'),
    h('p', { class: 'muted' }, 'This is a small private test. Open the personal link you were sent to begin.'),
    h('p', { class: 'muted small' }, 'Been here before? Your browser forgot you (DuckDuckGo does this when it clears its data). Open your personal link again; nothing you wrote is lost. To stop it happening: in DuckDuckGo, open the menu and choose "Fireproof this site", or add Continuum to your home screen from the browser menu.'));
}

function errorView() {
  render(h('p', { class: 'muted center' }, 'Something went wrong loading Continuum. Check your connection and reload.'));
}

async function guarded(fn) {
  try { await fn(); } catch (err) { if (err.status === 401) inviteView(); else { console.error(err); reportError(err?.message ?? err, err?.stack?.split('\n')[1]?.trim() ?? ''); errorView(); } }
}

function showToday() {
  setNav('today');
  return guarded(async () => {
    const data = await api(`/api/today?date=${today()}`);
    if (data.state === 'write') writeView(data);
    else if (data.state === 'done_today') doneView(data);
    else completeView(data);
  });
}

// The diary of discovery: new roads chosen from the user's own writing, the threads they have found between ideas they
// met, and everything they wrote or kept, newest first.
const ENTRY_LABEL = { answer: 'Your answer', note: 'Your note', kept: 'A line you kept', highlight: 'Words you kept' };
function showJournal() {
  setNav('journal');
  return guarded(async () => {
    const d = await api(`/api/diary?date=${today()}`);
    const open = (id) => () => walkTo(id, []);
    const c = d.counts;
    const summary = c.met
      ? `${c.met} ${c.met === 1 ? 'idea' : 'ideas'} met · ${c.answers} ${c.answers === 1 ? 'answer' : 'answers'} · ${c.notes} ${c.notes === 1 ? 'note' : 'notes'} · ${c.kept} kept`
      : 'Your discoveries gather here: each day\'s answer, the notes you leave on any idea, the lines you keep.';
    const roads = d.roads.length && h('section', { class: 'diary-block' },
      h('h2', {}, 'Roads to explore'),
      h('p', { class: 'muted small' }, 'Chosen from what you wrote and the ideas you have met.'),
      d.roads.map((r) => h('div', { class: 'compass-item' }, h('p', { class: 'muted small' }, r.why), bubble(r, open(r.id), null))));
    const link = (side) => h('a', { href: '#', class: 'thread-link', onclick: (e) => { e.preventDefault(); open(side.id)(); } }, side.title);
    const threads = d.threads.length && h('section', { class: 'diary-block' },
      h('h2', {}, 'Threads you have found'),
      h('ul', { class: 'path' }, d.threads.map((t) => h('li', {},
        h('p', { class: 'thread' }, link(t.first), ` ${t.verb} `, link(t.second), t.after ? ` ${t.after}` : '', '.'),
        t.note && h('p', { class: 'muted small' }, t.note)))));
    let lastDate = null;
    const entries = d.entries.length
      ? h('section', { class: 'diary-block' }, h('h2', {}, 'Entries'), h('ul', { class: 'path' }, d.entries.map((e) => {
        const day = e.date !== lastDate && h('div', { class: 'eyebrow diary-date' }, e.date); lastDate = e.date;
        return h('li', {}, day,
          h('div', { class: 'muted small' }, ENTRY_LABEL[e.kind]),
          h('button', { type: 'button', class: 'link', style: 'padding:0;text-align:left', onclick: open(e.id) }, h('span', { class: 't' }, e.title)),
          e.prompt && h('p', { class: 'muted small' }, e.prompt),
          e.kind === 'kept' || e.kind === 'highlight' ? h('blockquote', { class: 'kept' }, e.body) : h('p', {}, e.body),
          e.kind === 'highlight' && h('button', { type: 'button', class: 'link small', style: 'padding:0', onclick: async (ev) => {
            const li = ev.currentTarget.closest('li');
            await api(`/api/highlight/${e.hid}`, { method: 'DELETE' }).then(() => li.remove()).catch(() => notice('Could not remove it. Try again.'));
          } }, 'Remove'));
      })))
      : h('p', { class: 'muted' }, 'Nothing yet. Write today\'s answer, or leave a note on any idea you walk to: "Your notes" is near the end of every idea.');
    const st = await api('/api/stance').catch(() => null);
    const journey = st && (st.journey.answered
      ? h('section', { class: 'diary-block' }, h('h2', {}, 'Your journey'), journeyView(st.journey),
          h('button', { type: 'button', class: 'link', style: 'padding:0', onclick: () => showStance() }, 'Revisit the debates'))
      : h('section', { class: 'diary-block' }, h('h2', {}, 'Your journey'),
          h('p', { class: 'muted small' }, 'Seven great debates, each answered by two camps. Your choices help Continuum plan a journey that suits you.'),
          h('button', { type: 'button', class: 'btn ghost', onclick: () => showStance() }, 'Open the debates')));
    // Your views over time, by topic: what you said you think, want or wonder, as Talk noted it. Talk will bring
    // these back to compare; a topic with more than one entry can be talked over directly.
    const byTopic = new Map();
    for (const v of d.views ?? []) byTopic.set(v.topic, [...(byTopic.get(v.topic) ?? []), v]);
    const KIND = { view: 'A view', goal: 'A goal', question: 'A question' };
    const views = byTopic.size
      ? h('section', { class: 'diary-block' }, h('h2', {}, 'Your views over time'),
        h('p', { class: 'muted small' }, 'Noted from what you said in Talk and wrote in your answers. Talk brings them back, to see what has changed and whether the reasons hold. Remove any that are wrong.'),
        [...byTopic].map(([topic, vs]) => h('div', { class: 'view-topic' },
          h('h3', {}, topic),
          vs.map((v) => {
            const row = h('div', { class: 'view-row' },
              h('div', { class: 'eyebrow' }, `${v.date} · ${KIND[v.kind] ?? v.kind}`),
              h('p', {}, v.body),
              h('button', { type: 'button', class: 'link view-drop', 'aria-label': 'Remove this view', onclick: async () => { await api(`/api/views/${v.id}`, { method: 'DELETE' }).catch(() => {}); row.remove(); } }, 'Remove'));
            return row;
          }),
          h('button', { type: 'button', class: 'btn ghost', onclick: () => showTalk({ seed: `My diary has my views on "${topic}" over time:\n${vs.slice().reverse().map((v) => `${v.date}: ${v.body}`).join('\n')}\nHave I changed my mind, and do my reasons hold up?`, draft: true }) },
            vs.length > 1 ? 'Talk over how this has changed' : 'Test this view'))))
      : h('section', { class: 'diary-block' }, h('h2', {}, 'Your views over time'),
        h('p', { class: 'muted small' }, 'When you say what you think in Talk, or in your answers, Continuum notes your views and goals here, with the date. Later it brings them back to compare, and to choose ideas for you.'),
        doors());
    const again = h('p', { class: 'muted small', style: 'margin-top:28px' },
      h('button', { type: 'button', class: 'link', style: 'padding:0', onclick: () => tour() }, 'Take the spoken tour again'));
    const cs = await api(`/api/cases?date=${today()}`).catch(() => null);
    const working = cs?.cases.some((c) => c.status === 'open') && h('section', { class: 'diary-block' },
      h('h2', {}, 'What you are working through'),
      h('ul', { class: 'path' }, cs.cases.filter((c) => c.status === 'open').map((c) => h('li', {},
        h('button', { type: 'button', class: 'link', style: 'padding:0;text-align:left', onclick: () => showWorkThrough(c.id) }, h('span', { class: 't' }, c.title)),
        h('div', { class: 'muted small' }, `Since ${c.date} · ${c.checkins.length} ${c.checkins.length === 1 ? 'check-in' : 'check-ins'}${c.started ? ' · your course' : ''}`)))));
    const youChips = h('div', { class: 'size-chips' },
      h('button', { type: 'button', class: 'chip on', 'aria-pressed': 'true' }, 'Diary'),
      h('button', { type: 'button', class: 'chip', onclick: () => showReview(7) }, 'Your week'),
      h('button', { type: 'button', class: 'chip', onclick: () => showPractice() }, 'Practice'));
    render(youChips, h('h1', {}, 'Diary of discovery'), h('p', { class: 'muted' }, summary), working, views, journey, roads, threads, entries, again, keepOnPhone());
  });
}

// Talk: a conversation with the map's collective wisdom. Type or speak; replies stream in, with the ideas they name as
// links, and are read aloud in the reading voice. The conversation is kept, so it can be picked up later.
const TALK_KEY = 'continuum.talk';
const SPEAK_KEY = 'continuum.talk.speak';
// Reply text with [[id]] markers: the words, and each named idea as a link (a placeholder while it streams).
function replyNodes(text, refs, done) {
  const out = [];
  let last = 0;
  for (const m of text.matchAll(/\[\[([a-z0-9_]+)\]\]/g)) {
    out.push(text.slice(last, m.index)); last = m.index + m[0].length;
    const r = refs[m[1]];
    if (r) out.push(h('a', { href: '#', class: `talk-ref field-${r.field}`, onclick: (e) => { e.preventDefault(); stopTalkVoice(); (r.type === 'practice' ? showPractice({ practice: m[1] }) : walkTo(m[1], [])); } }, r.title));
    else if (!done) out.push('…');
  }
  out.push(done ? text.slice(last) : text.slice(last).replace(/\[\[[a-z0-9_]*\]?$/, ''));
  return out;
}
const spokenReply = (text, refs) => text.replace(/\[\[([a-z0-9_]+)\]\]/g, (_, id) => refs[id]?.title ?? '').replace(/\s+/g, ' ').trim();

// Reading a reply aloud, one sentence at a time, so it can be paused, repeated, or started from any sentence (tap it).
// One reply plays at a time; the sentence being read is highlighted. view = { spans, spoken, btn, clips }.
const talkPlayer = { view: null, i: 0, state: 'idle', run: null };
function setPlayState(view, state) {
  if (!view) return;
  view.btn.textContent = state === 'playing' ? 'Pause' : state === 'paused' ? 'Resume' : 'Listen';
  view.btn.setAttribute('aria-pressed', String(state === 'playing'));
  view.spans.forEach((sp, k) => sp.classList.toggle('now', state !== 'idle' && k === talkPlayer.i));
}
function stopTalkVoice() {
  const p = talkPlayer;
  if (p.run) { p.run.stop = true; p.run.wake?.(); }
  speech?.cancel(); audioEl.pause();
  const v = p.view; p.view = null; p.run = null; p.state = 'idle'; setPlayState(v, 'idle');
}
async function playFrom(view, i) {
  stopTalkVoice();
  const p = talkPlayer; const run = { stop: false, wake: null };
  Object.assign(p, { view, i, state: 'playing', run });
  setPlayState(view, 'playing');
  const plan = await voicePlan();
  const clip = (k) => {
    if (!view.clips.has(k)) view.clips.set(k, fetchBlob(view.spoken[k], plan.el).catch((e) => { view.clips.delete(k); throw e; }));
    return view.clips.get(k);
  };
  let useEl = 'el' in plan;
  while (p.i < view.spoken.length && !run.stop) {
    setPlayState(view, 'playing');
    if (useEl) {
      try {
        const blob = await clip(p.i);
        if (p.i + 1 < view.spoken.length) clip(p.i + 1).catch(() => {});
        if (run.stop) return false;
        await playClip(URL.createObjectURL(blob), run);
      } catch (e) {
        if (!speech) break;
        notice(`The natural voice is not available right now${e.why ? `: ${e.why}` : ''}. Using the phone's voice.`);
        useEl = false; continue;
      }
    } else await sayPhone(view.spoken[p.i], plan.phone ?? null, run);
    if (run.stop || p.state === 'paused') return false; // paused: stay on this sentence
    p.i++;
  }
  const finished = !run.stop && p.i >= view.spoken.length;
  if (p.run === run) stopTalkVoice();
  return finished;
}
function togglePlay(view) {
  const p = talkPlayer;
  if (p.view !== view || p.state === 'idle') return playFrom(view, 0);
  if (p.state === 'playing') {
    p.state = 'paused';
    // The natural voice pauses mid-sentence; the phone's voice stops and resumes from the start of the sentence.
    if (!audioEl.paused) audioEl.pause(); else { p.run.stop = true; speech?.cancel(); }
    return setPlayState(view, 'paused');
  }
  if (p.state === 'paused') {
    if (!p.run.stop && audioEl.src && audioEl.paused && !audioEl.ended) { p.state = 'playing'; setPlayState(view, 'playing'); audioEl.play(); }
    else playFrom(view, p.i);
  }
}

const TALK_MODES = {
  talk: { label: 'Talk', placeholder: 'Say what you think…' },
  weigh: { label: 'Weigh an opinion', placeholder: 'State an opinion you hold, or paste one from the news or a court…' },
  teach: { label: 'Teach it back', placeholder: 'Explain an idea in your own words, as if to a friend…' },
  settle: { label: 'A debate with a friend', placeholder: 'What did you disagree about? Say what you think, and what they think…' },
  news: { label: 'In the news', placeholder: 'A headline or a story you want to make sense of…' },
  goal: { label: 'A goal', placeholder: 'Something you want to do, change or become…' },
  workout: { label: 'Work it out', placeholder: 'What is on your mind? A habit, a feeling, a decision, something stuck…' },
};
function showTalk({ about = null, mode = 'talk', seed = null, practice = null, draft = false, voice = false } = {}) {
  setNav('talk');
  stopTalkVoice();
  return guarded(async () => {
    const saved = Number(store.get(TALK_KEY)) || '';
    const state = await api(`/api/talk?date=${today()}${saved ? `&id=${saved}` : ''}`);
    if (!state.enabled) {
      return render(h('h1', {}, 'Talk'), h('p', {}, 'Talk is a conversation with the ideas on the map: argue a point, test a belief, ask for a practice or a reading path.'),
        h('p', { class: 'muted' }, 'It is not switched on yet. To turn it on, add ANTHROPIC_API_KEY to the .env file next to the server and restart it.'));
    }
    let convoId = state.id;
    let current = mode;
    const refs = { ...state.refs };
    const log = h('div', { class: 'talk-log', 'aria-live': 'polite' });
    const bubble = (who, text, done = true) => {
      const b = h('div', { class: `talk-turn ${who === 'you' ? 'from-you' : 'from-map'}` });
      if (who === 'you') b.textContent = text; else if (done) finishReply(b, text); else b.replaceChildren(...replyNodes(text, refs, false));
      log.append(b); return b;
    };
    // A finished reply: each sentence a tap target (listen from here), and Listen/Pause/Resume and Repeat below.
    function finishReply(b, text) {
      const parts = sentences(text);
      if (!parts.length) { b.replaceChildren(...replyNodes(text, refs, true)); return null; }
      const btn = h('button', { type: 'button', class: 'chip', 'aria-pressed': 'false' }, 'Listen');
      const again = h('button', { type: 'button', class: 'chip' }, 'Repeat');
      const view = { spans: [], spoken: parts.map((t) => spokenReply(t, refs)), btn, clips: new Map() };
      view.spans = parts.map((t, k) => {
        const sp = h('span', { class: 'say', title: 'Listen from here' }, ...replyNodes(t, refs, true), ' ');
        sp.addEventListener('click', (e) => { if (!e.target.closest('a')) playFrom(view, k); });
        return sp;
      });
      btn.addEventListener('click', () => togglePlay(view));
      again.addEventListener('click', () => playFrom(view, 0));
      b.replaceChildren(h('div', {}, view.spans), h('div', { class: 'talk-controls' }, btn, again));
      return view;
    }
    // A reply that lays out a path (several ideas named in order) can be walked as a journey: it leads the next days.
    function journeyOffer(text, how) {
      const ids = [...new Set([...text.matchAll(/\[\[([a-z0-9_]+)\]\]/g)].map((x) => x[1]))].filter((id) => refs[id] && !id.startsWith('practice_'));
      if (ids.length < (['workout', 'goal'].includes(how) ? 2 : 3)) return null;
      const go = h('button', { type: 'button', class: 'chip' }, 'Walk these as a journey →');
      go.addEventListener('click', async () => {
        go.disabled = true;
        try {
          await api('/api/trail', { method: 'POST', body: { from_id: ids[0], ids: ids.slice(1), date: today() } });
          notice(`A journey of ${ids.length} ideas. It starts now, and leads your next days.`);
          walkTo(ids[0], []);
        } catch { go.disabled = false; notice('Could not start that journey. Try again.'); }
      });
      return h('div', { class: 'talk-controls' }, go);
    }
    // The pages a web search drew on, under the reply.
    const sourceList = (sources) => sources?.length > 0 && h('div', { class: 'talk-sources' },
      h('div', { class: 'eyebrow' }, 'Sources'),
      h('ul', {}, sources.map((x) => h('li', {}, h('a', { href: x.url, target: '_blank', rel: 'noopener' }, x.title)))));
    state.turns.forEach((x) => bubble(x.who, x.text));
    if (!state.turns.length) {
      log.append(h('div', { class: 'talk-turn from-map' }, 'What is on your mind? Argue a point, test something you believe, or ask for a practice or a reading path. I will answer from the ideas on the map, and from your diary.'));
    }
    const speakOn = () => store.get(SPEAK_KEY) !== 'off';
    const speakToggle = h('button', { type: 'button', class: 'chip', 'aria-pressed': String(speakOn()) }, speakOn() ? 'Replies read aloud' : 'Replies silent');
    speakToggle.addEventListener('click', () => {
      store.set(SPEAK_KEY, speakOn() ? 'off' : 'on'); if (!speakOn()) stopTalkVoice();
      speakToggle.textContent = speakOn() ? 'Replies read aloud' : 'Replies silent'; speakToggle.setAttribute('aria-pressed', String(speakOn()));
    });
    const fresh = h('button', { type: 'button', class: 'chip' }, 'New conversation');
    fresh.addEventListener('click', async () => { stopTalkVoice(); const r = await api('/api/talk/new', { method: 'POST', body: {} }); store.set(TALK_KEY, String(r.id)); showTalk(); });

    const ta = h('textarea', { id: 'talk-input', rows: '2', maxlength: '4000', placeholder: 'Say what you think…', enterkeyhint: 'send' });
    // Talk, or one of the modes (weigh, teach, settle, news, goal, work it out): what the next message asks for. Act (from a practice) is its own page.
    const modeChips = current !== 'act' && h('div', { class: 'size-chips talk-modes', role: 'group', 'aria-label': 'Mode' },
      Object.entries(TALK_MODES).map(([k, m]) => {
        const b = h('button', { type: 'button', class: `chip ${k === current ? 'on' : ''}`, 'aria-pressed': String(k === current) }, m.label);
        b.addEventListener('click', () => {
          current = k; ta.placeholder = m.placeholder;
          setWallpaper(talkPlate(k), .35, { plain: true });
          b.parentElement.querySelectorAll('.chip').forEach((c) => { const on = c === b; c.classList.toggle('on', on); c.setAttribute('aria-pressed', String(on)); });
          ta.focus();
        });
        return b;
      }));
    ta.placeholder = current === 'act' ? 'Your town, or zip code' : TALK_MODES[current].placeholder;
    pageBg = talkPlate(current);
    if (about) ta.value = current === 'teach' ? `Let me explain "${about.title}" in my own words: ` : `I have just been reading "${about.title}". `;
    const send = h('button', { type: 'button', class: 'btn' }, 'Send');
    const status = h('div', { class: 'muted small', role: 'status' });
    const compose = h('div', { class: 'talk-compose' }, ta);
    // Keep the newest words just above the composer (which sits over the bottom of the page).
    const keepInView = (el) => {
      const gap = el.getBoundingClientRect().bottom - (compose.getBoundingClientRect().top - 12);
      if (gap > 0) window.scrollBy(0, gap);
    };
    async function submit() {
      const typed = ta.value.trim();
      if (!typed || send.disabled) return;
      const sendAs = current !== 'talk' ? current : null; // every mode but plain Talk asks for its own kind of reply
      const text = sendAs === 'act' ? `Practice: "${practice.title}". Near: ${typed}` : typed;
      stopTalkVoice(); stopMic();
      send.disabled = true; ta.value = ''; status.textContent = '';
      bubble('you', sendAs === 'act' ? text.replace(/^Practice: "[^"]*"\. Near: /, 'Near: ') : text);
      const out = bubble('map', '', false); out.classList.add('thinking'); out.textContent = 'Thinking…';
      keepInView(out);
      let reply = ''; let view = null;
      try {
        const res = await fetch('/api/talk', { method: 'POST', headers: { 'x-continuum-token': token(), 'content-type': 'application/json' }, body: JSON.stringify({ id: convoId, text, date: today(), ...(sendAs ? { mode: sendAs } : {}) }) });
        if (!res.ok) {
          const e = await res.json().catch(() => ({}));
          throw new Error(e.error === 'daily_limit' ? 'That is enough talk for today. The map will be here tomorrow.' : 'Could not reach the conversation. Try again.');
        }
        const reader = res.body.getReader(); const dec = new TextDecoder(); let buf = '';
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          buf += dec.decode(value, { stream: true });
          let nl;
          while ((nl = buf.indexOf('\n')) >= 0) {
            const line = buf.slice(0, nl); buf = buf.slice(nl + 1);
            if (!line) continue;
            const m = JSON.parse(line);
            if (m.t === 'start') { if (m.id) { convoId = m.id; store.set(TALK_KEY, String(m.id)); } }
            else if (m.t === 'text') {
              reply += m.d; out.classList.remove('thinking'); out.replaceChildren(...replyNodes(reply.trimStart(), refs, false));
              keepInView(out);
            }
            else if (m.t === 'done') {
              Object.assign(refs, m.refs); view = finishReply(out, reply.trim());
              const src = sourceList(m.sources); if (src) out.append(src);
              const walk = journeyOffer(reply, sendAs ?? current); if (walk) out.append(walk);
              keepInView(out);
            }
            else if (m.t === 'error') throw new Error(m.error);
          }
        }
        const spoken = byVoice; byVoice = false;
        if ((speakOn() || spoken) && view) {
          const finished = await playFrom(view, 0);
          // Your turn: after a spoken exchange, listen again (it stops by itself if nothing is said).
          if (spoken && finished && dict && document.body.contains(ta)) { status.textContent = 'Your turn. Speak, or tap to stop.'; dict.start(); }
        }
      } catch (e) {
        out.classList.remove('thinking');
        if (!reply) out.remove();
        status.textContent = e.message;
      } finally { send.disabled = false; }
    }
    send.addEventListener('click', submit);
    ta.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey && !matchMedia('(pointer: coarse)').matches) { e.preventDefault(); submit(); } });

    // Speaking: tap to talk, tap when done (pauses for thought are fine); what was said is sent. A message spoken
    // aloud is answered aloud, and then the microphone opens again for the reply: a conversation, until you stop.
    let byVoice = false;
    const dict = dictation(ta, {
      onStart: () => stopTalkVoice(),
      onDone: (said) => { if (said) { byVoice = true; submit(); } },
      onBlocked: (m) => { status.textContent = m; },
    });
    const mic = dict?.button;
    const stopMic = () => dict?.stop();
    compose.append(h('div', { class: 'row' }, mic || h('span'), send),
      h('button', { type: 'button', class: 'link small', style: 'padding:4px 0', onclick: () => chooseVoice() }, 'Microphone: test it, or switch how it listens'));
    if (current === 'act') {
      log.replaceChildren(h('div', { class: 'talk-turn from-map' },
        `Where do you live? Name a town or a zip code, and I will look for current ways to act on "${practice.title}" near you: volunteering, drives, and civic roles like working the polls. The place is used only for this search and not kept.`));
    }
    render(
      h('h1', {}, current === 'act' ? 'Act on it near you' : 'Talk'),
      current !== 'act' && h('p', { class: 'bare' }, h('button', { type: 'button', class: 'chip', onclick: () => showParthenon() }, 'The Parthenon: talk with your group →')),
      h('p', { class: 'muted small' }, current === 'act'
        ? 'Found with a web search, so check each one before you go.'
        : 'A conversation with the ideas on the map. Weigh an opinion to hear its strongest form, what it gets right, and where it is weaker. Tap any sentence of a reply to hear it from there.'),
      modeChips,
      h('div', { class: 'theme-chips' }, speakToggle, current !== 'act' && fresh),
      log,
      compose,
      status);
    if (about) { ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); }
    if (seed && draft && voice && dict) { ta.value = seed; dict.start(); } // answer aloud: the microphone is already listening
    else if (seed && draft) { ta.value = seed; ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); }
    else if (seed) { ta.value = seed; submit(); }
    if (log.lastElementChild) keepInView(log.lastElementChild);
  });
}

// A problem to consider: one concrete situation that puts the idea to the test, and a question. Think it through in
// Talk, or just carry it through the day.
// ── Homework: a sheet for one idea, in the shapes a college course uses. Each part asks you to write first; the model
// answer opens only after you have. Answers are kept as you type. ──
function showHomework(node) {
  setNav('');
  return guarded(async () => {
    pageBg = PAGE_BG.homework;
    render(h('h1', {}, 'Homework'), h('p', {}, node.title),
      h('p', { class: 'muted' }, 'Opening the sheet… The first time an idea is asked for, Claude writes it, which takes about half a minute.'));
    const hw = await api(`/api/homework/${encodeURIComponent(node.id)}?date=${today()}`);
    pageBg = PAGE_BG.homework;
    const answers = hw.answers ?? {};
    const sheet = hw.sheet;
    const save = (part, body) => api(`/api/homework/${encodeURIComponent(node.id)}`, { method: 'POST', body: { part, body, date: today() } }).catch(() => {});
    const timers = {};
    // One written part: your answer, then (once you have written) the model answer.
    const writePart = (part, { rows = 4, placeholder = 'Your answer…', model = null, min = 20 } = {}) => {
      const ta = h('textarea', { rows: String(rows), maxlength: '6000', placeholder, 'aria-label': placeholder });
      ta.value = answers[part] ?? '';
      const reveal = model && h('button', { type: 'button', class: 'btn ghost hw-reveal' }, 'Compare with a model answer');
      const shown = model && h('div', { class: 'hw-model', hidden: true }, h('div', { class: 'eyebrow' }, 'A model answer (one good answer, not the only one)'), model);
      const ready = () => { if (reveal) reveal.disabled = ta.value.trim().length < min; };
      ta.addEventListener('input', () => { ready(); clearTimeout(timers[part]); timers[part] = setTimeout(() => save(part, ta.value), 700); });
      ta.addEventListener('blur', () => { clearTimeout(timers[part]); save(part, ta.value); });
      reveal?.addEventListener('click', () => { shown.hidden = false; reveal.hidden = true; });
      ready();
      const mic = dictation(ta)?.button;
      return [ta, (reveal || mic) && h('div', { class: 'row', style: 'justify-content:flex-start' }, mic, reveal), shown];
    };
    const section = (title, ...kids) => h('section', { class: 'hw-part' }, h('h2', {}, title), ...kids);
    const parts = [];
    if (!sheet) {
      parts.push(section('Not ready yet', h('p', {}, hw.talk === false
        ? 'Homework sheets are written by Claude, which is not switched on. Add ANTHROPIC_API_KEY to the .env file and restart the server.'
        : 'The sheet could not be written just now. Try again in a moment.')));
    } else {
      parts.push(section('Key terms', h('p', { class: 'muted small' }, 'Say what each word means before you tap it.'),
        h('div', { class: 'hw-terms' }, sheet.key_terms.map((t) => {
          const b = h('button', { type: 'button', class: 'hw-term', 'aria-expanded': 'false' }, h('span', { class: 'hw-term-word' }, t.term), h('span', { class: 'hw-term-meaning', hidden: true }, t.meaning));
          b.addEventListener('click', () => { const m = b.querySelector('.hw-term-meaning'); m.hidden = !m.hidden; b.setAttribute('aria-expanded', String(!m.hidden)); });
          return b;
        }))));
      parts.push(section('Close reading', h('p', { class: 'muted small' }, 'Read the source again (it is on the idea\'s page), then answer.'),
        ...sheet.close_reading.flatMap((r, i) => [h('p', { class: 'hw-q' }, r.question), ...writePart(`reading_${i}`, { model: h('p', {}, r.model_answer) })])));
      parts.push(section('Lay out the argument', h('p', { class: 'hw-q' }, 'Write the reasoning as steps, one per line, ending with the conclusion. Which step would you question?'),
        ...writePart('argument', { rows: 6, placeholder: '1. …\n2. …\nSo, …', model: h('ol', { class: 'hw-steps' }, ...sheet.argument.premises.map((p) => h('li', {}, p)), h('li', { class: 'hw-conclusion' }, `So: ${sheet.argument.conclusion}`)) })));
      parts.push(section('Objection and reply', h('div', { class: 'eyebrow' }, sheet.objection.from), h('p', { class: 'hw-q' }, sheet.objection.objection),
        h('p', { class: 'muted small' }, 'How would the thinker answer? Write their best reply.'),
        ...writePart('objection', { model: h('p', {}, sheet.objection.model_reply) })));
      parts.push(section('Apply it', h('p', { class: 'hw-q' }, sheet.apply.situation), h('p', { class: 'hw-q' }, sheet.apply.question),
        ...writePart('apply', { model: h('p', {}, sheet.apply.model_answer) })));
      const essay = writePart('essay', { rows: 10, placeholder: 'About 300 words: take a position and defend it.', min: 9999 });
      parts.push(section('Essay', h('p', { class: 'hw-q' }, sheet.essay), ...essay,
        h('div', { class: 'row', style: 'justify-content:flex-start' },
          h('button', { type: 'button', class: 'btn ghost', onclick: () => showTalk({ seed: `Here is my short essay for the question "${sheet.essay}"\n\n${essay[0].value.trim()}\n\nWhat is strongest in it, and where is it weakest?`, draft: true }) }, 'Ask Talk for feedback'))));
    }
    parts.push(section('Teach it back', h('p', {}, 'Explain the idea in your own words, as you would to a friend. Talk tells you what you have right and what is blurred.'),
      h('div', { class: 'row', style: 'justify-content:flex-start' },
        h('button', { type: 'button', class: 'btn', onclick: () => showTalk({ about: node, mode: 'teach' }) }, 'Teach it back'),
        h('button', { type: 'button', class: 'btn ghost', onclick: async () => {
          const r = await api('/api/recall', { method: 'POST', body: { node_id: node.id, result: 'fuzzy', date: today() } }).catch(() => null);
          notice(r ? 'It will come back in tomorrow\'s review.' : 'Write today\'s answer for this idea first, then it can join your reviews.');
        } }, 'Still fuzzy: review it tomorrow'))));
    if (hw.courses?.length) {
      parts.push(section('Go further: free college courses', h('p', { class: 'muted small' }, 'Chapters and lectures from free university courses that take this idea further.'),
        h('ul', { class: 'hw-courses' }, hw.courses.map((c) => h('li', {},
          h('a', { href: c.url, target: '_blank', rel: 'noopener' }, c.title), h('span', { class: 'muted small' }, ` · ${c.source}, ${c.course}`))))));
    }
    render(h('h1', {}, 'Homework'), h('p', {}, `${node.title}${hw.thinker ? ` · ${hw.thinker}` : ''}`), ...parts,
      h('div', { class: 'row bare', style: 'justify-content:flex-start' }, h('button', { type: 'button', class: 'btn ghost', onclick: () => walkTo(node.id, []) }, '← Back to the idea')));
  });
}

// The review climbs as an idea comes back: first, what do you remember; then, use it; then, test it.
const recallQuestion = (d) => (d.step <= 1 ? `What do you remember of "${d.title}"?`
  : d.step === 2 ? `Where could "${d.title}" help you this week? Think of one real moment.`
    : `Who would disagree with "${d.title}", and what would you say back?`);
// A strip of the lesson's own plate above it: the fox at the crossroads, the hare on the fog path.
const lessonPlate = (src) => h('div', { class: 'lesson-plate', 'aria-hidden': 'true' }, h('img', { src, alt: '', loading: 'lazy', decoding: 'async' }));
async function problemCard(host, node) {
  const r = await api(`/api/problem/${encodeURIComponent(node.id)}?date=${today()}`).catch(() => null);
  if (!r?.problem) return;
  host.append(h('div', { class: 'lesson' },
    lessonPlate(PAGE_BG.problem),
    h('div', { class: 'eyebrow' }, 'A problem to consider'),
    h('p', { class: 'lesson-text' }, r.problem),
    h('p', { class: 'muted small' }, 'Think it through with Talk: say what you would do, and why. It will push back, or show you who agrees.'),
    h('div', { class: 'row', style: 'justify-content:flex-start' },
      canSpeakIn() && h('button', { type: 'button', class: 'btn', onclick: () => showTalk({ seed: problemSeed(node, r.problem), draft: true, voice: true }) }, 'Answer aloud'),
      h('button', { type: 'button', class: `btn ${canSpeakIn() ? 'ghost' : ''}`, onclick: () => showTalk({ seed: problemSeed(node, r.problem), draft: true }) }, 'Write an answer'))));
}
const problemSeed = (node, problem) => `A problem to consider, from "${node.title}": ${problem} Here is what I think: `;
// The daily review: an earlier idea, on a spaced schedule. First, what do you remember? Then its plain words and what
// you wrote, and "Got it" (it comes back later) or "Fuzzy" (it comes back tomorrow).
async function recallCard(host) {
  const r = await api(`/api/recall?date=${today()}`).catch(() => null);
  const d = r?.due;
  if (!d) return;
  const box = h('div', { class: 'lesson' },
    lessonPlate(PAGE_BG.recall),
    h('div', { class: 'eyebrow' }, "Today's review"),
    h('p', { class: 'lesson-text' }, recallQuestion(d)),
    h('p', { class: 'muted small' }, 'Say it to yourself in a sentence, then look.'));
  const reveal = h('button', { type: 'button', class: 'btn ghost' }, 'Remind me');
  reveal.addEventListener('click', () => {
    const mark = (result) => async () => {
      const p = await api('/api/recall', { method: 'POST', body: { node_id: d.id, result, date: today() } }).catch(() => null);
      rate.replaceWith(h('p', { class: 'muted small' }, result === 'got'
        ? (p?.next ? `Good. It will come back on ${p.next}.` : 'Good. That one is yours now.')
        : 'It will come back tomorrow. Fuzzy is how remembering starts.'));
    };
    const rate = h('div', { class: 'row', style: 'justify-content:flex-start;gap:8px' },
      h('button', { type: 'button', class: 'btn', onclick: mark('got') }, 'Got it'),
      h('button', { type: 'button', class: 'btn ghost', onclick: mark('fuzzy') }, 'Fuzzy'));
    reveal.replaceWith(
      h('p', { class: 'plain' }, d.line),
      h('p', { class: 'muted small' }, `On ${d.wrote_on} it asked: ${d.prompt}`),
      h('div', { class: 'yours' }, d.yours),
      h('button', { type: 'button', class: 'link', style: 'padding:0', onclick: () => walkTo(d.id, []) }, `Open "${d.title}" again`),
      rate);
  });
  box.append(reveal);
  host.append(box);
}

// Bearings: once a week or more has passed on the calendar, after writing, one of the great debates comes back. The
// earlier choice is shown; a new one is welcomed whether it moved or held. It sits quietly on Today's card.
async function bearings(host) {
  const b = await api(`/api/bearings?date=${today()}`).catch(() => null);
  if (!b?.due) return;
  const q = b.debate;
  const label = Object.fromEntries(caseChoices(q));
  const box = h('div', { class: 'bearings' },
    h('div', { class: 'eyebrow' }, 'Check your bearings'),
    h('p', { class: 'stop-view' }, q.question),
    b.before && h('p', { class: 'muted small' }, `On ${b.before.date} you chose: ${label[b.before.agree]}. With the ideas you have met since, where are you now?`),
    !b.before && h('p', { class: 'muted small' }, `${q.a.who}: ${q.a.claim} ${q.b.who}: ${q.b.claim}`));
  const choices = h('div', { class: 'choices compact' }, caseChoices(q).map(([v, l]) => h('button', {
    type: 'button', class: 'choice', onclick: async () => {
      await api('/api/stance', { method: 'POST', body: { answers: [{ id: q.id, agree: v }], date: today() } }).catch(() => null);
      const moved = b.before && b.before.agree !== v;
      choices.replaceWith(h('p', { class: 'plain' }, !b.before ? 'Noted. It joins your journey.'
        : moved ? `Your bearings moved: from "${label[b.before.agree]}" to "${l}". That is what the walk is for.`
        : 'Steady: the same as before. Holding a view after meeting more of the debate means something too.'));
    },
  }, l)));
  box.append(choices);
  host.append(box);
}

// The interview: seven views people hold, one at a time, asked gently. Where do you stand, and how did you come to it?
// It is not a test: it only shapes the journey. Answers can be changed any time; skipping is fine.
// Which case speaks to you more: 2 = the first camp, clearly ... -2 = the second camp, clearly.
const caseChoices = (q) => [[2, `${q.a.who}'s case, clearly`], [1, `Leaning to ${q.a.who}`], [0, 'Both have a point'], [-1, `Leaning to ${q.b.who}`], [-2, `${q.b.who}'s case, clearly`]];
function showStance() {
  setNav('');
  return guarded(async () => {
    pageBg = PAGE_BG.debates;
    const data = await api('/api/stance');
    const answers = { ...data.saved };
    let i = -1;
    const step = () => {
      if (i < 0) {
        return render(h('div', { class: 'interview' },
          h('div', { class: 'eyebrow' }, 'Seven great debates'),
          h('h1', {}, 'Where does the argument stand?'),
          h('p', { class: 'plain' }, 'Seven questions people have argued over for thousands of years. Two camps answer each one. Read both cases, and say which speaks to you more.'),
          h('p', { class: 'muted' }, 'The debates are still open, and nothing here is graded. Continuum uses your choices only to plan a journey: each camp at its best, and practices to try. You can change a choice later, or skip a debate.'),
          h('div', { class: 'row', style: 'margin-top:20px' },
            h('button', { type: 'button', class: 'link', onclick: () => showToday() }, 'Maybe later'),
            h('button', { type: 'button', class: 'btn', onclick: () => { i = 0; step(); } }, 'Begin'))));
      }
      if (i >= data.questions.length) return finish();
      const q = data.questions[i]; const a = answers[q.id] ?? {};
      const choice = (value, label) => h('button', {
        type: 'button', class: `choice ${a.agree === value ? 'on' : ''}`, 'aria-pressed': String(a.agree === value),
        onclick: () => { answers[q.id] = { ...a, agree: value }; if (value === 0) { answers[q.id].basis = null; i++; } step(); },
      }, label);
      const camp = (c, k) => h('div', { class: `camp camp-${k}` }, h('div', { class: 'eyebrow' }, `${c.who}'s camp`), h('p', {}, c.claim));
      const basis = a.agree != null && a.agree !== 0 && h('div', { class: 'basis' },
        h('p', { class: 'prompt' }, 'How well do you know this debate?'),
        Object.entries(data.basis).map(([k, label]) => h('button', {
          type: 'button', class: `choice ${a.basis === k ? 'on' : ''}`, onclick: () => { answers[q.id] = { ...a, basis: k }; i++; step(); },
        }, label)));
      render(h('div', { class: 'interview' },
        h('div', { class: 'eyebrow' }, `Debate ${i + 1} of ${data.questions.length}`),
        h('h1', { class: 'view' }, q.question),
        h('div', { class: 'camps' }, camp(q.a, 'a'), camp(q.b, 'b')),
        h('p', { class: 'prompt' }, 'Which case speaks to you more?'),
        h('div', { class: 'choices' }, caseChoices(q).map(([v, l]) => choice(v, l))),
        basis,
        h('div', { class: 'row', style: 'margin-top:18px' },
          h('button', { type: 'button', class: 'link', onclick: () => { i = Math.max(-1, i - 1); step(); } }, 'Back'),
          h('button', { type: 'button', class: 'link', onclick: () => { delete answers[q.id]; i++; step(); } }, 'Skip this debate'))));
      document.querySelector('.interview .choice.on, .interview .choice')?.focus({ preventScroll: true });
    };
    async function finish() {
      const body = { date: today(), answers: data.questions.map((q) => (answers[q.id] ? { id: q.id, agree: answers[q.id].agree, basis: answers[q.id].basis ?? null } : { id: q.id, agree: null })) };
      const r = await api('/api/stance', { method: 'POST', body });
      render(h('div', { class: 'interview' },
        h('div', { class: 'eyebrow' }, 'Your journey'),
        h('h1', {}, r.journey.stops.length ? 'Places worth a visit' : 'Thank you'),
        r.journey.stops.length
          ? h('p', { class: 'muted' }, 'Drawn from the debates. For each, hear the camp that spoke to you at its best, then the other camp at its best. The journey also shapes your daily cards, and it lives in your Diary.')
          : h('p', { class: 'muted' }, 'Your daily cards will follow your own curiosity. You can take the interview again from your Diary.'),
        journeyView(r.journey),
        h('div', { class: 'row', style: 'margin-top:20px' }, h('span'), h('button', { type: 'button', class: 'btn', onclick: () => showToday() }, 'On to today'))));
    }
    step();
  });
}
// The journey as a list of stops: for each view, the voice who shares it, the one who sees it another way, a practice.
function journeyView(j) {
  const link = (c, label) => c && h('div', { class: 'stop-line' }, h('span', { class: 'muted small' }, label),
    bubble(c, () => (c.type === 'practice' ? showPractice({ practice: c.id }) : walkTo(c.id, [])), null));
  return h('div', { class: 'journey' },
    j.stops.map((st, k) => h('section', { class: 'stop' },
      h('div', { class: 'eyebrow' }, `Stop ${k + 1}`),
      h('p', { class: 'stop-view' }, st.lead),
      link(st.shares, 'The case that spoke to you, at its best'),
      link(st.differs, 'The other camp, at its best'),
      link(st.practice, 'A practice to try'))),
    j.open.length > 0 && h('section', { class: 'stop' },
      h('div', { class: 'eyebrow' }, 'Debates you are still weighing'),
      j.open.map((o) => h('div', {}, h('p', { class: 'stop-view' }, o.question), o.ideas.map((c) => link(c, ''))))));
}

// One step of the walk. `trail` is the path taken to get here, shown as breadcrumbs.
function walkTo(id, trail) {
  return guarded(async () => {
    const res = await api(`/api/node/${encodeURIComponent(id)}?date=${today()}`);
    if (res.today) return showToday(); // today's card: write first
    setNav('');
    showConcept(res.node, trail);
  });
}

document.addEventListener('click', (e) => {
  const nav = e.target.closest('[data-nav]');
  if (!nav) return;
  e.preventDefault();
  if (!tourState) document.querySelectorAll('.tour').forEach((x) => x.remove()); // a welcome card left behind
  const to = nav.dataset.nav;
  if (to === 'you' || to === 'journal') showJournal();
  else if (to === 'think') showThink();
  else if (to === 'talk') showTalk();
  else if (to === 'practice') showPractice();
  else if (to === 'review') showReview(7);
  else if (to === 'explore' || to === 'gallery') showGallery('rooms');
  else showToday();
});

// Pinching: two fingers on the page scale the text (0.85x to 1.8x), which rewraps to fit the screen, and at the same
// time lean into the picture behind it (1x to 3x, toward the point between the fingers; dragging the two fingers
// moves across the picture). The paragraph under the fingers stays put. The text size is remembered on this device;
// the picture's zoom lasts until the picture changes. (Look mode has its own pinch, for the picture alone.)
const SCALE_KEY = 'continuum.textScale';
const clampScale = (v) => Math.min(1.8, Math.max(.85, v));
let textScale = clampScale(Number(store.get(SCALE_KEY)) || 1);
document.documentElement.style.setProperty('--text-scale', String(textScale));
let pinch = null;
const spread = (t) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
addEventListener('touchstart', (e) => {
  if (e.touches.length !== 2 || document.querySelector('.gaze, .intro') || e.target.closest?.('.map-canvas')) return;
  const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2;
  const anchor = document.elementFromPoint(innerWidth / 2, cy);
  const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
  pinch = { d0: spread(e.touches), s0: textScale, anchor, top: anchor?.getBoundingClientRect().top ?? 0, z0: wallZoom.z, x0: cx, y0: cy, o0: { ...wallZoom } };
  if (wallZoom.z <= 1.001) { wallZoom.ox = cx / innerWidth * 100; wallZoom.oy = cy / innerHeight * 100; pinch.o0 = { ...wallZoom }; }
  wallpaper.classList.add('pinching');
}, { passive: true });
addEventListener('touchmove', (e) => {
  if (!pinch || e.touches.length !== 2) return;
  const ratio = spread(e.touches) / pinch.d0;
  const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2, cy = (e.touches[0].clientY + e.touches[1].clientY) / 2;
  wallZoom.z = Math.min(3, Math.max(1, pinch.z0 * ratio));
  // Moving the fingers together slides the zoom's centre the other way, so the picture follows the hand.
  wallZoom.ox = Math.min(100, Math.max(0, pinch.o0.ox - (cx - pinch.x0) / innerWidth * 100 / wallZoom.z));
  wallZoom.oy = Math.min(100, Math.max(0, pinch.o0.oy - (cy - pinch.y0) / innerHeight * 100 / wallZoom.z));
  applyWallZoom();
  const next = clampScale(pinch.s0 * ratio ** 0.6); // gentler than the fingers' spread
  if (Math.abs(next - textScale) < .01) return;
  textScale = next;
  document.documentElement.style.setProperty('--text-scale', next.toFixed(3));
  if (pinch.anchor?.isConnected) window.scrollBy(0, pinch.anchor.getBoundingClientRect().top - pinch.top);
}, { passive: true });
addEventListener('touchend', (e) => {
  if (!pinch || e.touches.length) return;
  pinch = null; store.set(SCALE_KEY, textScale.toFixed(3)); wallpaper.classList.remove('pinching'); queueWall();
}, { passive: true });

// The opening, once per visit: an empty hallway comes into focus, then the cat walks in as the name sharpens. A tap
// skips it. Skipped when testing with ?day=, and shown as a still for reduced-motion settings.
function intro(then = () => {}) {
  try { if (sessionStorage.getItem('continuum.intro')) return then(); sessionStorage.setItem('continuum.intro', '1'); } catch { /* private mode */ }
  if (params.get('day')) return then();
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hall = h('img', { class: 'hall', src: '/img/tabs/gallery_empty.webp', alt: '' });
  const cat = h('img', { class: 'cat', src: '/img/tabs/gallery.webp', alt: '' });
  const box = h('div', { class: 'intro', role: 'img', 'aria-label': 'Continuum' }, hall, cat,
    h('div', { class: 'title' }, h('h1', {}, 'Continuum'), h('p', {}, 'A daily walk through human wisdom')));
  document.body.append(box);
  const timers = [];
  let ended = false;
  const done = () => { if (ended) return; ended = true; timers.forEach(clearTimeout); box.classList.add('out'); setTimeout(() => { box.remove(); then(); }, 950); };
  box.addEventListener('click', done);
  Promise.all([hall, cat].map((im) => im.decode().catch(() => {}))).then(() => {
    if (still) { box.classList.add('on', 'walk'); timers.push(setTimeout(done, 1600)); return; }
    requestAnimationFrame(() => box.classList.add('on'));
    timers.push(setTimeout(() => box.classList.add('walk'), 1400), setTimeout(done, 5600));
  });
  timers.push(setTimeout(done, 9000)); // never stuck on a slow connection
}
// The tour: a narrated walk round the app, like Landsmith's tutorials. Each step is spoken (in the reading voice) and
// spotlights what it describes; it moves on by itself when the narration ends, or with Next. Offered once, after the
// opening; again any time from the Diary. Ends by offering the seven questions.
const TOUR_KEY = 'continuum.tour';
const TOUR = [
  { text: 'Welcome: a journey of discovery: the ideas that shaped how we think, what we value and how we live, from philosophers, prophets, scientists, artists and judges. Not just to learn what they thought, but to discover what you think.' },
  { text: 'Most of what we believe, we picked up without choosing it. Continuum helps you test those beliefs, borrow the best ideas people have had, and use them on real life: a decision, a disagreement, a hard week.' },
  { target: '.tabs [data-nav=today]', text: 'Wander: one question a day, answered before you read anything. Then the idea opens one part at a time. About two minutes.' },
  { target: '.tabs [data-nav=think]', text: 'Think: respond by voice or in writing. Bring a debate with a friend, the news or a goal. It remembers what you\'ve said, pushes back when you\'re very sure, and what you talk about chooses what comes next.' },
  { target: '.tabs [data-nav=think]', text: 'Work through a problem, or join the Parthenon: small groups talking over one question together, live, with Continuum as moderator.' },
  { target: '.tabs [data-nav=today]', text: 'Practice, on Wander too: ideas into habits, from ten seconds a day.' },
  { target: '.tabs [data-nav=explore]', text: 'Explore: every idea by room, time and theme, plus the Map, where any idea suggests a journey.' },
  { target: '.tabs [data-nav=you]', text: 'You: your diary, everything you write, and your views over time. When your thinking shifts, it notices and asks what changed. Review shows your week.' },
  { target: '#listen', text: 'Two small touches: tap Listen to hear any idea read aloud. And pinch the screen to make the words bigger, and to look closer at the picture.' },
  { text: 'The debates: an invitation, not a test. Nothing is graded.' },
];
let tourState = null;
function tour({ fromStart = true } = {}) {
  endTour();
  const box = h('div', { class: 'tour', role: 'dialog', 'aria-label': 'Tour of Continuum' });
  const spot = h('div', { class: 'tour-spot', 'aria-hidden': 'true' });
  const count = h('span', { class: 'tour-count' });
  const text = h('p', { class: 'tour-text' });
  const bar = h('div', { class: 'tour-bar' }, h('span'));
  const back = h('button', { type: 'button', class: 'chip' }, 'Back');
  const play = h('button', { type: 'button', class: 'chip' }, 'Pause');
  const next = h('button', { type: 'button', class: 'btn' }, 'Next');
  const skip = h('button', { type: 'button', class: 'link' }, 'Skip the tour');
  box.append(spot, h('div', { class: 'tour-card' }, h('div', { class: 'row' }, count, skip), bar, text, h('div', { class: 'row tour-buttons' }, h('div', {}, back, play), next)));
  document.body.append(box);
  const st = tourState = { i: fromStart ? 0 : 0, run: null, paused: false, box };
  const say = async (line) => {
    const run = st.run = { stop: false, wake: null };
    const plan = await voicePlan();
    if (run.stop) return;
    if ('el' in plan) { try { await playClip(await fetchClip(line, plan.el), run); return; } catch { /* fall back */ } }
    for (const part of sentences(line)) { if (run.stop) return; await sayPhone(part, plan.phone ?? null, run); }
  };
  const silence = () => { if (st.run) { st.run.stop = true; st.run.wake?.(); } speech?.cancel(); audioEl.pause(); };
  async function show(i) {
    silence();
    if (i >= TOUR.length) return finish();
    st.i = i; const step = TOUR[i];
    count.textContent = `${i + 1} of ${TOUR.length}`;
    bar.firstChild.style.width = `${((i + 1) / TOUR.length) * 100}%`;
    text.textContent = step.text;
    back.disabled = i === 0;
    next.textContent = i === TOUR.length - 1 ? 'Open the debates' : 'Next';
    const el = step.target && document.querySelector(step.target);
    const r = el && el.getBoundingClientRect();
    if (r && r.width) {
      const pad = 6;
      Object.assign(spot.style, { top: `${r.top - pad}px`, left: `${r.left - pad}px`, width: `${r.width + pad * 2}px`, height: `${r.height + pad * 2}px` });
      spot.classList.add('on'); box.classList.toggle('card-top', r.top > innerHeight / 2);
    } else { spot.classList.remove('on'); box.classList.remove('card-top'); }
    if (st.paused) return;
    await say(step.text);
    if (tourState === st && st.i === i && !st.paused && !st.run?.stop) setTimeout(() => { if (tourState === st && st.i === i && !st.paused) show(i + 1); }, 900);
  }
  function finish() { endTour(); store.set(TOUR_KEY, 'done'); showStance(); }
  back.addEventListener('click', () => show(Math.max(0, st.i - 1)));
  next.addEventListener('click', () => { st.paused = false; play.textContent = 'Pause'; show(st.i + 1); });
  play.addEventListener('click', () => {
    st.paused = !st.paused; play.textContent = st.paused ? 'Play' : 'Pause';
    if (st.paused) silence(); else show(st.i);
  });
  skip.addEventListener('click', () => { endTour(); store.set(TOUR_KEY, 'done'); });
  st.silence = silence;
  show(0);
}
function endTour() {
  if (tourState) { tourState.silence?.(); tourState.box.remove(); tourState = null; }
  document.querySelectorAll('.tour').forEach((x) => x.remove()); // never leave a tour layer over the page
}
// ── The Parthenon: small invite-only groups that talk over one question at a time, live. Everyone's posts arrive as
// they are written; anyone can ask the moderator (Claude) to say where the group stands and what no one has said. ──
const seeTo = (el) => el?.scrollIntoView({ block: 'end', behavior: 'smooth' });
const joinUrl = (code) => `${location.origin}/?join=${code}`;
async function shareInvite(g) {
  const url = joinUrl(g.invite_code);
  const text = `Join "${g.name}" in the Parthenon, on Continuum: ${url}`;
  try { if (navigator.share) { await navigator.share({ title: g.name, text, url }); return; } } catch { return; }
  try { await navigator.clipboard.writeText(url); notice('Invite link copied. Send it to someone you would like to talk with.'); }
  catch { notice(url); }
}
// ── Keeping Continuum on the phone ──
// Chrome offers to install a site like this as an app; the offer is kept so a button can make it. Once installed,
// links to Continuum open the app itself (no browser page, so no browser menu), and its icon is in the app list.
let installOffer = null;
addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); installOffer = e; });
addEventListener('appinstalled', () => { installOffer = null; notice('Continuum is on your phone. Look for its icon with your other apps.'); });
const standalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
const myLink = () => `${location.origin}/?u=${encodeURIComponent(token())}`;
function keepOnPhone() {
  const out = h('p', { class: 'muted small', role: 'status' });
  const btn = (label, fn, cls = 'btn ghost') => h('button', { type: 'button', class: cls, onclick: fn }, label);
  const copy = btn('Copy my personal link', async () => {
    try { await navigator.clipboard.writeText(myLink()); out.textContent = 'Copied. Paste it somewhere safe (a note, or an email to yourself).'; }
    catch { out.textContent = myLink(); }
  });
  const share = navigator.share && btn('Send my link to myself', () => navigator.share({ title: 'Continuum', text: 'My Continuum link (it signs me in; keep it private)', url: myLink() }).catch(() => {}));
  const install = !standalone() && installOffer && btn('Add Continuum to my home screen', async () => {
    const offer = installOffer; installOffer = null; offer.prompt();
    const r = await offer.userChoice.catch(() => null);
    if (r?.outcome !== 'accepted') out.textContent = 'Not added. You can add it later from the browser menu.';
  }, 'btn');
  const how = standalone()
    ? 'You are in the Continuum app. Its icon is in your phone\'s list of apps (swipe up from the home screen). To put it on the home screen: press and hold the icon there, then drag it where you like.'
    : install ? 'One tap adds Continuum to your home screen, signed in.'
      : /iPhone|iPad/.test(navigator.userAgent) ? 'In Safari: tap Share (the square with an arrow), then Add to Home Screen.'
        : 'In the browser menu (⋮), choose Add to Home screen or Install app. If links to Continuum open the app straight away, it is already installed: look for its icon in your list of apps.';
  return h('section', { class: 'diary-block' }, h('h2', {}, 'Keep Continuum on your phone'), h('p', { class: 'small' }, how),
    h('div', { class: 'row', style: 'justify-content:flex-start;flex-wrap:wrap' }, install, copy, share), out,
    h('p', { class: 'muted small' }, 'Your personal link signs you in. Keep it private.'));
}

// ── Think: everything for thinking something through, in one place ──
function showThink() {
  setNav('think');
  return guarded(async () => {
    const cs = await api(`/api/cases?date=${today()}`).catch(() => null);
    const open = cs?.cases.filter((c) => c.status === 'open') ?? [];
    const big = (title, line, go) => h('button', { type: 'button', class: 'think-door', onclick: go }, h('span', { class: 't' }, title), h('span', { class: 'muted small' }, line));
    render(
      h('h1', {}, 'Think'),
      h('p', {}, 'Bring what is on your mind. Continuum answers from the ideas on the map and from what you have written, and pushes back when you are very sure.'),
      h('div', { class: 'think-doors' },
        big('Work through a problem', 'A few questions, then a route through it, and check-ins as you go.', () => showWorkThrough()),
        big('Talk', 'Argue a point, test a belief, ask for a practice or a reading path.', () => showTalk()),
        big('A debate with a friend', 'Both sides at their best, and where it could be settled.', () => showTalk({ mode: 'settle' })),
        big('Something in the news', 'What happened, what the ideas say about it, what is still unknown.', () => showTalk({ mode: 'news' })),
        big('Weigh an opinion', 'Its strongest form, its weak points, what would change the picture.', () => showTalk({ mode: 'weigh' })),
        big('A goal I have', 'Make it clear and your own, with a first step for this week.', () => showTalk({ mode: 'goal' })),
        big('The great debates', 'Seven questions people have argued over for centuries. Where do you stand?', () => showStance()),
        big('The Parthenon', 'Your group, talking one question over together, live.', () => showParthenon())),
      open.length > 0 && h('section', { class: 'diary-block' }, h('h2', {}, 'What you are working through'),
        h('ul', { class: 'path' }, open.map((c) => h('li', {}, h('button', { type: 'button', class: 'link', style: 'padding:0;text-align:left', onclick: () => showWorkThrough(c.id) }, h('span', { class: 't' }, c.title)))))));
  });
}

// ── Arriving ──
// The first few days: what brought you here (to learn, to think something through, or to build a habit), and the
// app opens there. After that, once a day: glad to see you back, where to today, led by what you usually choose.
const GREETED_KEY = 'continuum.greeted'; const WHY_KEY = 'continuum.why'; const ASK_DAYS = 3;
// A shortcut from the home-screen icon (press and hold it) goes straight to its place.
const SHORTCUTS = { wander: () => showToday(), think: () => showThink(), problem: () => showWorkThrough(), you: () => showJournal() };
function arrive() {
  const go = SHORTCUTS[params.get('go')];
  if (go) { store.set(GREETED_KEY, today()); go(); return; }
  if (store.get(GREETED_KEY) === today() || params.get('day')) { showToday(); offerTour(); return; }
  setNav('');
  return guarded(async () => {
    const t = await api(`/api/today?date=${today()}`);
    pageBg = brightFor('arrive') ?? null;
    const go = (why, fn) => () => { store.set(GREETED_KEY, today()); if (why) store.set(WHY_KEY, why); fn(); offerTour(); };
    const choice = (title, line, fn, why) => h('button', { type: 'button', class: 'think-door', onclick: go(why, fn) }, h('span', { class: 't' }, title), line && h('span', { class: 'muted small' }, line));
    const first = (t.name ?? '').split(' ')[0];
    if ((t.visits ?? 1) <= ASK_DAYS) {
      return render(
        h('h1', {}, first ? `Welcome, ${first}` : 'Welcome'),
        h('p', {}, 'What brings you here?'),
        h('div', { class: 'think-doors' },
          choice('Learn something new', 'One idea a day: you write first, then read it, then follow where it leads.', showToday, 'learn'),
          choice('Think something through', 'A problem, a decision, a disagreement, the news: bring it, and think it over with the world\'s wisdom.', showThink, 'think'),
          choice('Build a daily habit', 'Ideas into practice, from ten seconds a day.', showPractice, 'habit')),
        h('p', { class: 'muted small' }, 'Every way is open from the menu below, whichever you choose.'));
    }
    const idea = t.state === 'write'
      ? choice('Today\'s idea', t.node?.why ?? 'A new question is waiting. Write first, then read.', showToday, 'learn')
      : t.state === 'done_today' ? choice('Back to today\'s idea', `"${t.node.title}": walk on from where you were.`, showToday, 'learn') : null;
    const checkin = t.checkin && choice(`Check in: ${t.checkin.title}`, t.checkin.question, () => showWorkThrough(t.checkin.id), 'think');
    const think = choice('Think something through', 'Talk, a problem, a debate, the news.', showThink, 'think');
    const habit = choice('Today\'s practice', 'Ideas into habits, from ten seconds a day.', showPractice, 'habit');
    const order = { learn: [idea, think, habit], think: [think, idea, habit], habit: [habit, idea, think] }[store.get(WHY_KEY)] ?? [idea, think, habit];
    render(
      h('h1', {}, first ? `Glad to see you back, ${first}` : 'Glad to see you back'),
      h('p', {}, 'Where would you like to go today?'),
      h('div', { class: 'think-doors' }, checkin, ...order,
        choice('Explore the map', 'Every idea, and how they connect.', showMap, null),
        choice('Your diary', 'What you have written, and how your views have moved.', showJournal, null)));
  });
}

// ── Working through a problem ──────────────────────────────────────────────────────────────────────────────
// The user brings a problem; Continuum asks a few questions, one at a time (as a good counsellor opens a first
// session), then draws on the whole map for what may be going on, the pitfalls that may keep them stuck, and a route of
// ideas. Set as their course, the route leads the daily ideas; every few days it checks in and adjusts.
const PITFALL_KIND = { assumption: 'An assumption', logic: 'A slip of logic', habit: 'A habit', feeling: 'A feeling steering', values: 'A clash of values' };
const PROGRESS = { better: 'Better', same: 'About the same', worse: 'Harder', unclear: '' };
const HELP_LINE = 'If you are in danger or thinking of harming yourself, please reach someone now: in the US, call or text 988; elsewhere, your local emergency number.';
function showWorkThrough(id = null) {
  setNav('');
  return guarded(async () => {
    pageBg = PAGE_BG.problem;
    if (id) return renderCase((await api(`/api/cases/${id}?date=${today()}`)).case);
    const d = await api(`/api/cases?date=${today()}`);
    pageBg = PAGE_BG.problem;
    if (!d.enabled) return render(h('h1', {}, 'Work through a problem'), h('p', { class: 'muted' }, 'This needs Claude, which is not switched on yet (ANTHROPIC_API_KEY on the server).'));
    const ta = h('textarea', { rows: '4', maxlength: '4000', placeholder: 'What is weighing on you? Say it plainly, the way you would to a friend.', 'aria-label': 'The problem' });
    const go = h('button', { type: 'button', class: 'btn', disabled: true }, 'Begin');
    const status = h('p', { class: 'muted small', role: 'status' });
    ta.addEventListener('input', () => { go.disabled = ta.value.trim().length < 3; });
    go.addEventListener('click', async () => {
      go.disabled = true; status.textContent = 'Listening…';
      try {
        const r = await api('/api/cases', { method: 'POST', body: { problem: ta.value, date: today() } });
        renderCase(r.case);
      } catch (e) { go.disabled = false; status.textContent = e.message === 'daily_limit' ? 'That is enough for today. Come back tomorrow.' : 'Something went wrong. Try again in a moment.'; }
    });
    const row = (c) => h('li', {}, h('button', { type: 'button', class: 'link', style: 'padding:0;text-align:left', onclick: () => showWorkThrough(c.id) },
      h('span', { class: 't' }, c.title ?? clipText(c.problem, 60))),
    h('div', { class: 'muted small' }, c.status === 'interview' ? `Started ${c.date}, still talking it through` : c.status === 'closed' ? `Set aside · ${c.touched}` : `Since ${c.date}${c.started ? ' · your course' : ''} · last ${c.touched}`));
    const open = d.cases.filter((c) => c.status !== 'closed'); const closed = d.cases.filter((c) => c.status === 'closed');
    render(
      h('h1', {}, 'Work through a problem'),
      h('p', {}, 'Bring something you are stuck on: a habit, a decision, a feeling, a relationship, a worry. Continuum will ask a few questions to understand it, then draw on philosophy, psychology, the great traditions and the sciences to point to a route, and help you watch for the traps that keep people stuck.'),
      h('p', { class: 'muted small' }, 'A voice of reason, not a therapist. ', HELP_LINE),
      ta, h('div', { class: 'row' }, dictation(ta)?.button, go), status,
      open.length > 0 && h('section', { class: 'diary-block' }, h('h2', {}, 'What you are working through'), h('ul', { class: 'path' }, open.map(row))),
      closed.length > 0 && h('details', { class: 'diary-block' }, h('summary', {}, `Set aside (${closed.length})`), h('ul', { class: 'path' }, closed.map(row))));
  });
}
const clipText = (t, n) => (t.length > n ? `${t.slice(0, n - 1)}…` : t);
function ideaLink(id, refs) {
  const r = refs[id]; if (!r) return null;
  return h('a', { href: '#', class: `talk-ref field-${r.field}`, onclick: (e) => { e.preventDefault(); (r.type === 'practice' ? showPractice({ practice: id }) : walkTo(id, [])); } }, r.title);
}
function renderCase(c) {
  pageBg = PAGE_BG.problem;
  const refresh = (x) => renderCase(x);
  const concern = [...c.turns].reverse().find((t) => t.concern) || c.plan?.concern || c.checkins.at(-1)?.concern;
  const help = concern && h('p', { class: 'help-line' }, HELP_LINE);
  const back = h('button', { type: 'button', class: 'chip', onclick: () => showWorkThrough() }, '← Your problems');
  // The interview: what was asked and said; the waiting question with an answer box.
  const said = c.turns.filter((t) => t.a || t.q).map((t) => h('div', {},
    t.reflect && h('div', { class: 'talk-turn from-map' }, t.reflect),
    t.q && h('div', { class: 'talk-turn from-map wt-q' }, t.q),
    t.a && h('div', { class: 'talk-turn from-you' }, t.a)));
  const log = h('div', { class: 'talk-log' }, h('div', { class: 'talk-turn from-you' }, c.problem), said);
  if (c.status === 'interview') {
    const ta = h('textarea', { rows: '3', maxlength: '4000', placeholder: 'Your answer', 'aria-label': 'Your answer' });
    const send = h('button', { type: 'button', class: 'btn', disabled: true }, 'Answer');
    const enough = h('button', { type: 'button', class: 'btn ghost' }, 'Show me a route now');
    const status = h('p', { class: 'muted small', role: 'status' });
    ta.addEventListener('input', () => { send.disabled = !ta.value.trim(); });
    const post = async (body, wait) => {
      send.disabled = enough.disabled = true; status.textContent = wait;
      try { refresh((await api(`/api/cases/${c.id}/answer`, { method: 'POST', body: { ...body, date: today() } })).case); }
      catch (e) { send.disabled = !ta.value.trim(); enough.disabled = false; status.textContent = e.message === 'daily_limit' ? 'That is enough for today. Come back tomorrow; this will wait.' : 'Something went wrong. Your answer is still here; try again.'; }
    };
    send.addEventListener('click', () => post({ answer: ta.value }, 'Thinking about what you said… (the route, when it comes, takes about half a minute)'));
    enough.addEventListener('click', () => post({ answer: ta.value, enough: true }, 'Drawing a route from the map… about half a minute.'));
    render(back, h('h1', {}, 'Let\'s understand it'), help, log, ta, h('div', { class: 'row' }, dictation(ta)?.button, enough, send), status);
    requestAnimationFrame(() => ta.scrollIntoView({ block: 'center' }));
    return;
  }
  const p = c.plan; const refs = c.refs;
  const pit = (x) => h('li', {}, h('div', { class: 'eyebrow' }, PITFALL_KIND[x.kind] ?? x.kind), h('p', {}, h('strong', {}, x.name), `: ${x.how}`),
    x.idea && refs[x.idea] && h('p', { class: 'muted small' }, 'What answers it: ', ideaLink(x.idea, refs)));
  const start = h('button', { type: 'button', class: 'btn' }, c.started ? 'This is your course' : 'Make this my course');
  start.disabled = c.started;
  start.addEventListener('click', async () => {
    start.disabled = true;
    await api(`/api/cases/${c.id}/start`, { method: 'POST', body: { date: today() } }).then(() => { start.textContent = 'This is your course'; notice('Set. Your next daily ideas follow this route, one a day.'); }).catch(() => { start.disabled = false; });
  });
  // Checking in: how it is going, answered by a reply that may change the course.
  const ta = h('textarea', { rows: '3', maxlength: '4000', placeholder: 'How is it going? What happened, what you tried, what you told yourself…', 'aria-label': 'How it is going' });
  const send = h('button', { type: 'button', class: 'btn', disabled: true }, 'Check in');
  const status = h('p', { class: 'muted small', role: 'status' });
  ta.addEventListener('input', () => { send.disabled = !ta.value.trim(); });
  send.addEventListener('click', async () => {
    send.disabled = true; status.textContent = 'Looking at how it has gone, and at what you have written lately… about half a minute.';
    try { refresh((await api(`/api/cases/${c.id}/checkin`, { method: 'POST', body: { answer: ta.value, date: today() } })).case); }
    catch (e) { send.disabled = false; status.textContent = e.message === 'daily_limit' ? 'That is enough for today. Come back tomorrow.' : 'Something went wrong. Try again.'; }
  });
  const checkins = c.checkins.map((x) => h('li', {},
    h('div', { class: 'eyebrow diary-date' }, [x.date, PROGRESS[x.progress]].filter(Boolean).join(' · ')),
    x.question && h('p', { class: 'muted small' }, x.question),
    h('p', {}, x.answer), h('div', { class: 'talk-turn from-map' }, x.reply),
    x.noticed?.length > 0 && h('ul', { class: 'pitfalls' }, x.noticed.map(pit)),
    x.next_step && h('p', {}, h('strong', {}, 'Next: '), x.next_step),
    x.rerouted && h('p', { class: 'muted small' }, 'The course was changed: see the route above.')));
  const status2 = h('div', { class: 'row', style: 'justify-content:flex-start' },
    c.status === 'open'
      ? h('button', { type: 'button', class: 'link small', onclick: async () => { await api(`/api/cases/${c.id}/status`, { method: 'POST', body: { status: 'closed' } }); notice('Set aside. It is kept, and you can open it again.'); showWorkThrough(); } }, 'It is resolved, or set it aside')
      : h('button', { type: 'button', class: 'link small', onclick: async () => { await api(`/api/cases/${c.id}/status`, { method: 'POST', body: { status: 'open' } }); showWorkThrough(c.id); } }, 'Open it again'));
  render(back,
    h('div', { class: 'eyebrow' }, `Since ${c.date}`), h('h1', {}, c.title), help,
    h('section', { class: 'wt-part' }, h('h2', {}, 'What I heard'), h('p', {}, p.heard)),
    h('section', { class: 'wt-part' }, h('h2', {}, 'What may be going on'), h('p', {}, p.going_on)),
    p.pitfalls.length > 0 && h('section', { class: 'wt-part' }, h('h2', {}, 'Traps to watch for'), h('ul', { class: 'pitfalls' }, p.pitfalls.map(pit))),
    c.route.length > 0 && h('section', { class: 'wt-part' }, h('h2', {}, 'A route through it'),
      h('ol', { class: 'wt-route' }, c.route.map((r) => h('li', {}, ideaLink(r.id, refs), h('p', { class: 'muted small' }, r.why)))),
      c.status === 'open' && h('div', { class: 'row', style: 'justify-content:flex-start' }, start),
      h('p', { class: 'muted small' }, 'As your course, these become your daily ideas, one a day, before anything else.')),
    p.practice && refs[p.practice] && h('section', { class: 'wt-part' }, h('h2', {}, 'A practice for it'), h('p', {}, ideaLink(p.practice, refs))),
    h('section', { class: 'wt-part' }, h('h2', {}, 'A first step this week'), h('p', {}, p.first_step)),
    h('section', { class: 'wt-part' }, h('h2', {}, 'Checking in'),
      checkins.length > 0 && h('ul', { class: 'path' }, checkins),
      c.status === 'open' && h('div', {}, h('p', { class: 'ask-q' }, c.question), ta, h('div', { class: 'row' }, dictation(ta)?.button, send), status),
      h('p', { class: 'muted small' }, 'Every few days Continuum will ask on Wander. It looks at what you write and say in between, and names a trap if it shows up again.')),
    h('div', { class: 'row', style: 'justify-content:flex-start' },
      h('button', { type: 'button', class: 'btn ghost', onclick: () => showTalk({ mode: 'workout', seed: `About "${c.title}": `, draft: true }) }, 'Talk it over')),
    h('details', { class: 'wt-part' }, h('summary', {}, 'How we got here'), log),
    status2);
}
// On Wander: a check-in, every few days, on a problem being worked through.
function checkinCard(data) {
  const k = data.checkin; if (!k) return null;
  return h('div', { class: 'bearings' },
    h('div', { class: 'eyebrow' }, `Checking in · ${k.title}`),
    h('p', {}, k.question),
    h('button', { type: 'button', class: 'btn ghost', onclick: () => showWorkThrough(k.id) }, 'Answer'));
}

function showParthenon({ idea = null } = {}) {
  setNav('talk');
  return guarded(async () => {
    pageBg = PAGE_BG.parthenon;
    const d = await api('/api/groups');
    const newGroup = h('form', { class: 'pt-new', onsubmit: async (e) => {
      e.preventDefault(); const name = e.target.elements.gname.value.trim(); if (!name) return;
      const r = await api('/api/groups', { method: 'POST', body: { name } }); showParthenon({ idea });
      notice('Your group is ready. Share its invite link to bring people in.'); void r;
    } },
      h('label', { for: 'gname', class: 'muted small' }, 'Start a group: a book club, friends, family, a class'),
      h('div', { class: 'row' }, h('input', { id: 'gname', name: 'gname', type: 'text', maxlength: '60', placeholder: 'A name for the group', class: 'search' }), h('button', { type: 'submit', class: 'btn' }, 'Start')));
    const groups = d.groups.map((g) => {
      const q = h('input', { type: 'text', maxlength: '300', class: 'search', placeholder: 'A question for the group…', value: idea ? (idea.prompt ?? `What do you make of "${idea.title}"?`) : '' });
      const start = h('form', { class: 'pt-topic-new', onsubmit: async (e) => {
        e.preventDefault(); if (!q.value.trim()) return;
        const r = await api(`/api/groups/${g.id}/topics`, { method: 'POST', body: { question: q.value.trim(), node_id: idea?.id ?? null } });
        showTopic(r.id);
      } }, h('div', { class: 'row' }, q, h('button', { type: 'submit', class: 'btn' }, idea ? 'Discuss' : 'Ask')));
      return h('section', { class: 'pt-group' },
        h('h2', {}, g.name),
        h('div', { class: 'row', style: 'justify-content:flex-start' },
          h('span', { class: 'muted small' }, `${g.members} ${g.members === 1 ? 'member' : 'members'}`),
          h('button', { type: 'button', class: 'chip', onclick: () => shareInvite(g) }, 'Invite someone')),
        start,
        g.topics.length ? h('ul', { class: 'pt-topics' }, g.topics.map((t) => h('li', {},
          h('button', { type: 'button', class: 'link pt-topic', onclick: () => showTopic(t.id) }, t.question),
          h('div', { class: 'muted small' }, `${t.by} · ${t.posts} ${t.posts === 1 ? 'post' : 'posts'}${t.last_at ? ` · last ${t.last_at.slice(0, 16).replace('T', ' ')}` : ''}`))))
          : h('p', { class: 'muted small' }, 'No questions yet. Ask the first one.'));
    });
    render(h('h1', {}, 'The Parthenon'),
      h('p', {}, idea ? `Choose a group to discuss "${idea.title}".` : 'Small groups talking over one question at a time, together and live. Everyone can speak or write; Continuum, when asked to moderate, says where the group stands and what no one has said yet.'),
      ...groups, newGroup,
      h('p', { class: 'muted small bare' }, 'What you post is seen by the members of that group, and by the moderator when someone asks for it.'));
  });
}
function showTopic(id) {
  setNav('talk');
  stopTopic();
  return guarded(async () => {
    pageBg = PAGE_BG.parthenon;
    const t = await api(`/api/topics/${id}`);
    const log = h('div', { class: 'pt-log', 'aria-live': 'polite' });
    const writing = h('p', { class: 'muted small pt-writing', 'aria-live': 'polite' });
    const seen = new Set();
    const empty = h('p', { class: 'muted', hidden: t.posts.length > 0 }, 'No one has spoken yet. Say what you think first, then invite the others.');
    const who = h('p', {}, `${t.group.name} · ${t.members.join(', ')}`);
    const add = (p) => {
      if (seen.has(p.id)) return; seen.add(p.id);
      empty.hidden = true;
      if (p.by && !t.members.includes(p.by)) { t.members.push(p.by); who.textContent = `${t.group.name} · ${t.members.join(', ')}`; }
      const mine = p.user_id === t.me;
      const el = h('div', { class: `pt-post ${p.moderator ? 'from-mod' : mine ? 'from-me' : 'from-them'}` },
        h('div', { class: 'eyebrow' }, p.moderator ? 'Continuum · moderator' : mine ? 'You' : p.by),
        p.moderator ? h('div', { class: 'pt-body' }, ...replyNodes(p.body, p.refs ?? {}, true)) : h('div', { class: 'pt-body' }, p.body));
      log.append(el);
      return el;
    };
    t.posts.forEach(add);
    const ta = h('textarea', { rows: '3', maxlength: '4000', placeholder: 'Say what you think, and why…', 'aria-label': 'Your post' });
    const send = h('button', { type: 'button', class: 'btn' }, 'Post');
    const status = h('p', { class: 'muted small', role: 'status' });
    let lastPing = 0;
    ta.addEventListener('input', () => { if (Date.now() - lastPing > 4000) { lastPing = Date.now(); api(`/api/topics/${id}/typing`, { method: 'POST', body: {} }).catch(() => {}); } });
    async function post() {
      const body = ta.value.trim(); if (!body || send.disabled) return;
      send.disabled = true; dict?.stop();
      try { const r = await api(`/api/topics/${id}/posts`, { method: 'POST', body: { body, date: today() } }); ta.value = ''; seeTo(add(r.post) ?? log.lastElementChild); }
      catch { status.textContent = 'Could not post. Try again.'; } finally { send.disabled = false; }
    }
    send.addEventListener('click', post);
    const dict = dictation(ta, { onDone: () => {} });
    const ask = t.moderator && h('button', { type: 'button', class: 'btn ghost', onclick: async () => {
      ask.disabled = true; status.textContent = 'Continuum is reading the discussion…';
      try { const r = await api(`/api/topics/${id}/moderator`, { method: 'POST', body: { date: today() } }); seeTo(add(r.post) ?? log.lastElementChild); status.textContent = ''; }
      catch (e) { status.textContent = e.message === 'daily_limit' ? 'That is enough for today. Continuum will moderate again tomorrow.' : e.message === 'busy' ? 'Continuum is already answering.' : 'Continuum could not answer just now.'; }
      finally { ask.disabled = false; }
    } }, 'Ask Continuum to moderate');
    render(h('h1', {}, t.question),
      who,
      t.idea && h('p', { class: 'bare' }, h('a', { href: '#', class: 'thread-link', onclick: (e) => { e.preventDefault(); walkTo(t.idea.id, []); } }, `It starts from: ${t.idea.title}`)),
      h('section', { class: 'pt-thread' }, empty, log, writing),
      h('section', { class: 'pt-compose' }, ta, h('div', { class: 'row' }, dict?.button ?? h('span'), send), status,
        h('div', { class: 'row', style: 'justify-content:flex-start' }, ask, h('button', { type: 'button', class: 'chip', onclick: () => shareInvite(t.group) }, 'Invite someone'),
          h('button', { type: 'button', class: 'chip', onclick: () => showParthenon() }, '← All groups'))));
    if (log.lastElementChild) seeTo(log.lastElementChild);
    // Live: new posts and "… is writing" from everyone in the group, as they happen. Reconnects if the line drops.
    const run = { stop: false, ctl: null }; topicRun = run;
    const timers = new Map();
    const showWriting = () => { writing.textContent = timers.size ? `${[...timers.keys()].join(', ')} ${timers.size === 1 ? 'is' : 'are'} writing…` : ''; };
    (async function listen() {
      while (!run.stop && document.body.contains(log)) {
        try {
          run.ctl = new AbortController();
          const res = await fetch(`/api/topics/${id}/live`, { headers: { 'x-continuum-token': token() }, signal: run.ctl.signal });
          const reader = res.body.getReader(); const dec = new TextDecoder(); let buf = '';
          for (;;) {
            const { value, done } = await reader.read(); if (done) break;
            buf += dec.decode(value, { stream: true });
            let nl;
            while ((nl = buf.indexOf('\n')) >= 0) {
              const line = buf.slice(0, nl); buf = buf.slice(nl + 1); if (!line) continue;
              const m = JSON.parse(line);
              if (m.t === 'post') {
                const who = m.post.moderator ? 'Continuum' : m.post.by; clearTimeout(timers.get(who)); timers.delete(who); showWriting();
                const el = add(m.post); if (el && m.post.user_id !== t.me) seeTo(el);
              } else if (m.t === 'typing' && m.user_id !== t.me) {
                clearTimeout(timers.get(m.name)); timers.set(m.name, setTimeout(() => { timers.delete(m.name); showWriting(); }, 7000)); showWriting();
              }
            }
          }
        } catch { /* dropped or stopped */ }
        if (!run.stop) await new Promise((r) => setTimeout(r, 2000));
      }
    })();
  });
}
let topicRun = null;
function stopTopic() { if (topicRun) { topicRun.stop = true; topicRun.ctl?.abort(); topicRun = null; } }
// Arriving from an invite link: someone new gives a first name and is in; someone already here is simply added.
async function joinFromLink(code) {
  const done = () => store.del('continuum.join');
  if (token()) {
    try { await api('/api/groups/join', { method: 'POST', body: { code } }); done(); notice('You have joined the group.'); return showParthenon(); }
    catch (e) { if (e.status !== 401) { done(); notice(e.message === 'group_full' ? 'That group is full.' : 'That invite link did not work.'); return showToday(); } }
  }
  const info = await fetch(`/api/join/${encodeURIComponent(code)}`).then((r) => r.json()).catch(() => ({}));
  pageBg = PAGE_BG.parthenon; setNav('');
  if (!info.group) { done(); return render(h('h1', {}, 'The Parthenon'), h('p', {}, 'That invite link did not work. Ask for a new one.')); }
  const name = h('input', { type: 'text', maxlength: '40', class: 'search', placeholder: 'Your first name', autocomplete: 'given-name' });
  const go = h('button', { type: 'submit', class: 'btn' }, 'Join');
  render(h('h1', {}, 'You are invited'),
    h('p', {}, `to "${info.group}" in the Parthenon, a small group that talks over one question at a time. ${info.members} ${info.members === 1 ? 'person is' : 'people are'} in it.`),
    h('form', { onsubmit: async (e) => {
      e.preventDefault(); if (!name.value.trim()) return; go.disabled = true;
      const r = await fetch('/api/join', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ code, name: name.value.trim() }) }).then((x) => x.json()).catch(() => ({}));
      if (!r.token) { go.disabled = false; return notice(r.error === 'group_full' ? 'That group is full.' : 'Could not join just now. Try again.'); }
      store.set(TOKEN_KEY, r.token); done(); showParthenon();
    } }, h('div', { class: 'row' }, name, go)),
    h('p', { class: 'muted small' }, 'Continuum is a daily practice of human wisdom. Joining gives you your own copy, kept on this phone: keep this page as a bookmark to come back.'));
}

// The first time: a small invitation (a tap is needed before a page may speak), then the tour.
function offerTour() {
  if (store.get(TOUR_KEY) || params.get('day')) return;
  const box = h('div', { class: 'tour', role: 'dialog', 'aria-label': 'Welcome' },
    h('div', { class: 'tour-card' },
      h('h2', { style: 'margin:0 0 .4em' }, 'Welcome to Continuum'),
      h('p', { class: 'tour-text' }, 'A two-minute spoken tour shows you around. Turn your sound on.'),
      h('div', { class: 'row tour-buttons' },
        h('button', { type: 'button', class: 'link', onclick: () => { box.remove(); store.set(TOUR_KEY, 'done'); } }, 'Not now'),
        h('button', { type: 'button', class: 'btn', onclick: () => { box.remove(); tour(); } }, 'Start the tour'))));
  document.body.append(box);
}

intro();
startCreatures();
startLiving();
window.continuumVisit = summon; // for trying a visitor on a phone: continuumVisit('sailboat'), or ?visit=sailboat (names in creatures.js)
if (params.get('visit')) setTimeout(() => summon(params.get('visit')), 1500);

// Calm: while an idea is being read, the buttons (corner, menu, the card's links, the rail) fade away after a few
// seconds untouched, leaving the words on the picture. Any touch, key or mouse movement brings them back.
let calmTimer = 0;
function wake() {
  const d = document.documentElement; d.classList.remove('calm'); clearTimeout(calmTimer);
  calmTimer = setTimeout(() => {
    if (d.classList.contains('staged') && !d.classList.contains('map-full') && !document.querySelector('.tour, .voices, .gaze, .keep-bar.on')
      && !document.activeElement?.closest?.('textarea, input, select')) d.classList.add('calm');
  }, 3500);
}
for (const ev of ['pointerdown', 'keydown', 'mousemove']) addEventListener(ev, wake, { passive: true });
document.addEventListener('scroll', () => { if (scrollY < 40) wake(); }, { passive: true }); // back at the top: show them again
wake();
if (store.get('continuum.join')) joinFromLink(store.get('continuum.join'));
else arrive();
