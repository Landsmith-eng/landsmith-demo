// Continuum client. Today: card -> write -> the concept, one part per screen -> walk the lineage.
import { setMotif, motifLevel, motifFor } from '/motifs.js';
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
if (params.get('u') || params.get('day')) history.replaceState(null, '', location.pathname);
const token = () => store.get(TOKEN_KEY) ?? '';

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
  if (!nodes.some((n) => n?.classList?.contains('stage'))) { unstage(); setWallpaper(pageBg ?? TAB_BG[currentTab] ?? null, .35, { plain: true }); }
  const banner = testDate() && h('div', { class: 'notice testdate', role: 'status' },
    `Test date: ${testDate()} (real date ${realToday()}). `,
    h('button', { type: 'button', class: 'link', onclick: () => { store.set(DATE_KEY, shiftDate(testDate(), 1)); showToday(); } }, '+1 day'),
    h('button', { type: 'button', class: 'link', onclick: () => { store.del(DATE_KEY); showToday(); } }, 'use real date'));
  view.replaceChildren(...[banner, ...nodes].filter(Boolean));
  window.scrollTo(0, 0);
}

// Background pictures for the tabs (public/img/tabs/<tab>.webp). Behind a plain page they stay dim and blurred.
const TAB_BG = { practice: '/img/tabs/practice.webp', gallery: '/img/tabs/gallery.webp', journal: '/img/tabs/journal.webp', review: '/img/tabs/review.webp' };
// Plates with a meaning, shown when the situation fits: done for today (the owl), coming back after a gap (the
// boat), a reluctant stretch (the dewy web), ready to grow or a changed mind (the braided river).
const MOOD_BG = {
  stillness: '/img/spares/stillness_owl.webp', return: '/img/spares/return_boat.webp',
  patience: '/img/spares/patience_web.webp', change: '/img/spares/change_river.webp',
};
let currentTab = null;
let pageBg = null; // a page's own plate in place of its tab's, set just before render
function setNav(name) {
  currentTab = name; pageBg = null;
  for (const b of document.querySelectorAll('nav [data-nav]')) {
    if (b.dataset.nav === name) b.setAttribute('aria-current', 'page');
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
      h('button', { type: 'button', class: 'btn', onclick: showToday }, 'Back to today')),
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
    } catch { status.textContent = 'Could not save. Try again.'; } finally { save.disabled = false; }
  });
  return panel('note', 'Your notes', [
    h('div', { class: 'eyebrow' }, 'Your notes'),
    h('label', { class: 'prompt unspoken', for: ta.id }, 'A note for your diary of discovery'),
    ta, h('div', { class: 'row' }, status, save),
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
        setWallpaper(MOOD_BG[after.mood] ?? TAB_BG.practice, wallMax); // done: the owl settles in behind
        endBox.replaceChildren(
          h('h2', {}, after.streak > 1 ? `Done. ${after.streak} days in a row.` : 'Done. That is how a habit starts.'),
          h('p', { class: 'plain' }, sz === 'tiny' ? 'Ten seconds counts. Tomorrow, the same again, or a little more.' : 'Small, repeated, and yours.'),
          h('div', { class: 'end-links' }, h('button', { type: 'button', class: 'btn ghost', onclick: showToday }, 'Back to today')));
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
      panel('related', 'Other practices', [
        h('div', { class: 'eyebrow' }, 'Or choose another practice'),
        h('div', { class: 'theme-chips' }, plan.choices.filter((c) => c.id !== plan.practice.id).map((c) =>
          h('button', { type: 'button', class: 'chip', onclick: () => showPractice({ practice: c.id, size: sz }) }, c.title))),
      ]),
    ].filter(Boolean);
    renderStage({ id: plan.practice.id, field: 'practice' }, panels, { background: MOOD_BG[plan.mood] ?? TAB_BG.practice });
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
function setWallpaper(src, maxFocus = 1, { plain = false } = {}) {
  wallMax = maxFocus;
  wallpaper.classList.toggle('plain', plain);
  wallpaper.classList.toggle('nolook', !plain && maxFocus < 1); // a closed card's picture stays a hint, not a view
  if (!src) { wallpaper.classList.remove('on'); return; }
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
// The choice, kept on this device: 'el:<voice id>' (an ElevenLabs voice), a phone voice's name, or nothing (default).
const VOICE_KEY = 'continuum.voice';
async function voicePlan() {
  const choice = store.get(VOICE_KEY);
  if (choice?.startsWith('el:') && await ttsEnabled()) return { el: choice.slice(3) };
  const phone = choice && !choice.startsWith('el:') && speech?.getVoices().find((v) => v.name === choice);
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
    u.rate = .95;
    u.onend = u.onerror = () => resolve();
    if (run) run.wake = resolve;
    speech.speak(u);
  });
}
// ElevenLabs: the server returns MP3 for a piece of text; one audio element plays the pieces in turn.
const audioEl = new Audio();
async function fetchClip(text, voiceId) {
  const res = await fetch('/api/tts', {
    method: 'POST', headers: { 'x-continuum-token': token(), 'content-type': 'application/json' },
    body: JSON.stringify({ text, ...(voiceId ? { voice_id: voiceId } : {}) }),
  });
  if (!res.ok) throw new Error(`tts_${res.status}`);
  return URL.createObjectURL(await res.blob());
}
function playClip(url, run) {
  return new Promise((resolve) => {
    const done = () => { URL.revokeObjectURL(url); resolve(); };
    audioEl.onended = audioEl.onerror = done;
    if (run) run.wake = done;
    audioEl.src = url;
    audioEl.play().catch(done);
  });
}

async function readStage() {
  const panels = [...document.querySelectorAll('.stage .panel')];
  if (!panels.length) return;
  const mid = innerHeight / 2;
  let start = panels.findIndex((p) => { const r = p.getBoundingClientRect(); return r.top <= mid && r.bottom >= mid; });
  if (start < 0) start = 0;
  const run = reading = { stop: false, wake: null };
  listenBtn.setAttribute('aria-pressed', 'true'); listenBtn.querySelector('span').textContent = 'Stop';
  let plan = await voicePlan();
  // ElevenLabs: fetch each part's audio ahead, so the next part is ready when this one ends.
  const ahead = new Map();
  const clipsFor = (i) => {
    if (!ahead.has(i)) ahead.set(i, Promise.all(chunks(spokenText(panels[i])).map((t) => fetchClip(t, plan.el))));
    return ahead.get(i);
  };
  for (let i = start; i < panels.length && !run.stop; i++) {
    if (i > start) {
      panels[i].scrollIntoView({ behavior: 'smooth', block: 'start' });
      await new Promise((r) => setTimeout(r, 900));
    }
    if ('el' in plan) {
      try {
        const clips = await clipsFor(i);
        if (i + 1 < panels.length) clipsFor(i + 1).catch(() => {});
        for (const url of clips) { if (run.stop) break; await playClip(url, run); }
      } catch {
        if (!speech) break;
        notice('The natural voice is not available right now (check the ElevenLabs key or credits). Using the phone\'s voice.');
        plan = { phone: null }; i--; continue;
      }
    } else {
      for (const line of sentences(spokenText(panels[i]))) { if (run.stop) break; await sayPhone(line, plan.phone, run); }
    }
    if (!run.stop) await new Promise((r) => setTimeout(r, 500));
  }
  if (reading === run) stopReading();
}
function stopReading() {
  if (!reading) return;
  const run = reading; run.stop = true; reading = null;
  speech?.cancel(); audioEl.pause(); run.wake?.();
  listenBtn.setAttribute('aria-pressed', 'false'); listenBtn.querySelector('span').textContent = 'Listen';
}
// A short message at the top of the screen that fades away.
function notice(text) {
  const n = h('div', { class: 'toast', role: 'status' }, text);
  document.body.append(n); setTimeout(() => n.remove(), 6000);
}
listenBtn.addEventListener('click', () => (reading ? stopReading() : readStage()));
voiceBtn.addEventListener('click', () => chooseVoice());
speech?.getVoices(); // starts loading the phone's voice list
addEventListener('pagehide', () => { speech?.cancel(); audioEl.pause(); });

async function chooseVoice() {
  stopReading();
  const sample = 'Some things are up to us, and some are not.';
  const current = store.get(VOICE_KEY) ?? '';
  const el = await ttsEnabled() ? await api('/api/tts/voices').catch(() => null) : null;
  const all = speech?.getVoices() ?? [];
  const lang = (navigator.language || 'en').slice(0, 2).toLowerCase();
  const phoneVoices = [...all.filter((v) => v.lang.toLowerCase().startsWith(lang)), ...all.filter((v) => !v.lang.toLowerCase().startsWith(lang))];
  let previewing = null;
  const preview = async (key) => {
    speech?.cancel(); audioEl.pause(); previewing?.wake?.();
    const run = previewing = { wake: null };
    if (key.startsWith('el:') || (!key && el)) {
      try { await playClip(await fetchClip(sample, key.slice(3) || null), run); } catch { notice('That voice could not be played. Check the ElevenLabs key or credits.'); }
    } else if (speech) sayPhone(sample, all.find((v) => v.name === key) ?? null, run);
  };
  const row = (label, note, key) => h('button', {
    type: 'button', class: 'voice-row', role: 'menuitemradio', 'aria-checked': String(current === key),
    onclick: (e) => {
      if (key) store.set(VOICE_KEY, key); else store.del(VOICE_KEY);
      sheet.querySelectorAll('.voice-row').forEach((r) => r.setAttribute('aria-checked', String(r === e.currentTarget)));
      preview(key);
    },
  }, h('span', {}, label), h('small', {}, note));
  const defaultName = el?.voices.find((v) => v.id === el.default)?.name;
  const sheet = h('div', { class: 'voices-sheet', role: 'menu', 'aria-label': 'Reading voice' },
    h('h2', {}, 'Reading voice'),
    h('p', { class: 'muted small' }, 'Tap a voice to hear it.'),
    row('Default', el ? `natural voice${defaultName ? ` · ${defaultName}` : ''}` : 'your phone\'s voice', ''),
    el && h('div', { class: 'eyebrow', style: 'margin-top:16px' }, 'Natural voices · ElevenLabs'),
    el?.voices.map((v) => row(v.name, v.note, `el:${v.id}`)),
    phoneVoices.length && h('div', { class: 'eyebrow', style: 'margin-top:16px' }, 'Phone voices'),
    phoneVoices.map((v) => row(v.name, `${v.lang}${v.localService ? '' : ' · online'}`, v.name)),
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
  const wrap = h('div', { class: `stage field-${node.field}` }, panels);
  render(wrap);
  document.documentElement.classList.add('staged');
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
  stageObserver = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const p = e.target; const i = panels.indexOf(p);
      if (e.isIntersecting && e.intersectionRatio > .3) {
        p.classList.add('in'); p.classList.remove('past');
        rail.querySelectorAll('.dot').forEach((d, k) => d.classList.toggle('on', k === i));
        motifLevel(LEVEL[p.dataset.kind] ?? .7);
        if (p.dataset.kind === 'source' && !sawSource) { sawSource = true; onSource?.(); }
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
      back ? `← ${back.thinker ?? back.title}` : '← Today'),
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
    h('div', { class: 'row' }, status, submit));
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
    panel('question', 'The question', [form]),
  ], { background: node.backdrop ?? null, backgroundMax: .45 });
}

// The top of Today's card: the user's own walk, not a fixed count. "Day 6 of your walk · 23 ideas met · 3 days in a row"
function journeyLine(j) {
  if (!j) return 'Today';
  return [`Day ${j.day} of your walk`, j.met && `${j.met} ${j.met === 1 ? 'idea' : 'ideas'} met`,
    j.streak >= 2 && `${j.streak} days in a row`].filter(Boolean).join(' · ');
}

function doneView(data, { reveal = false } = {}) {
  const msg = data.done === data.total && data.node.daily
    ? `That was the last of the first ${data.total}. From tomorrow, each day's idea is chosen from your own discoveries.`
    : 'That\'s today\'s card. Walk as far as you like; a new card arrives tomorrow.';
  setNav('today');
  showConcept(data.node, [], {
    intro: h('div', {}, h('div', { class: 'eyebrow' }, journeyLine(data.journey)), h('p', { class: 'muted small' }, msg)),
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
    pageBg = changed ? MOOD_BG.change : null; // a mind changed this week: the river finding new channels
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

function showGallery(arrangement = 'rooms', { focus = null, featuredOnly = false, theme = null, kind = 'all' } = {}) {
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
    );
    const intro = h('p', { class: 'muted small' },
      `${nodes.length} ideas in ${new Set(nodes.map((n) => n.room)).size} rooms. Open any of them, any time. You have met ${met}. `
      + 'Daily cards stay hidden until their day.');
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
    const wanderBtn = h('button', { type: 'button', class: 'btn ghost wander', onclick: wander, title: 'Open a thinker you have not met yet' }, 'Wander ↝');
    render(h('h1', {}, 'Gallery of thought'), h('div', { class: 'search-row' }, box, wanderBtn), results, browse);
    const el = (focus && view.querySelector(`[data-id="${CSS.escape(focus)}"]`)) || (theme && document.getElementById(`theme-${theme}`));
    if (el) el.scrollIntoView({ block: theme && !focus ? 'start' : 'center' });
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
    h('button', { type: 'button', class: `chip ${featuredOnly ? 'on' : ''}`, onclick: () => showGallery('timeline', { featuredOnly: true }) }, 'Only the 14 daily thinkers'));
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
    h('p', { class: 'muted' }, 'This is a small private test. Open the personal link you were sent to begin.'));
}

function errorView() {
  render(h('p', { class: 'muted center' }, 'Something went wrong loading Continuum. Check your connection and reload.'));
}

async function guarded(fn) {
  try { await fn(); } catch (err) { if (err.status === 401) inviteView(); else { console.error(err); errorView(); } }
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
const ENTRY_LABEL = { answer: 'Your answer', note: 'Your note', kept: 'A line you kept' };
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
          e.kind === 'kept' ? h('blockquote', { class: 'kept' }, e.body) : h('p', {}, e.body));
      })))
      : h('p', { class: 'muted' }, 'Nothing yet. Write today\'s answer, or leave a note on any idea you walk to: "Your notes" is near the end of every idea.');
    render(h('h1', {}, 'Diary of discovery'), h('p', { class: 'muted' }, summary), roads, threads, entries);
  });
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
  if (nav.dataset.nav === 'journal') showJournal();
  else if (nav.dataset.nav === 'practice') showPractice();
  else if (nav.dataset.nav === 'review') showReview(7);
  else if (nav.dataset.nav === 'gallery') showGallery('rooms');
  else showToday();
});

showToday();
