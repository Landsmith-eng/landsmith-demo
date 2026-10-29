// Continuum client. Today: card -> write -> the concept, one part per screen -> walk the lineage.
import { setMotif, motifLevel, motifFor, setSkyFocus } from '/motifs.js';
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
      h('button', { type: 'button', class: 'btn ghost', onclick: () => showTalk({ about: node }) }, 'Talk it through'),
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
      } catch (e) {
        if (!speech) break;
        notice(`The natural voice is not available right now${e.why ? `: ${e.why}` : ' (check the ElevenLabs key or credits)'}. Using the phone's voice.`);
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
    setMotif('sky'); motifLevel(.9); setSkyFocus(1); // a quiet night sky over the Gallery, where constellations drift by
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
    const st = await api('/api/stance').catch(() => null);
    const journey = st && (st.journey.answered
      ? h('section', { class: 'diary-block' }, h('h2', {}, 'Your journey'), journeyView(st.journey),
          h('button', { type: 'button', class: 'link', style: 'padding:0', onclick: () => showStance() }, 'Change your answers'))
      : h('section', { class: 'diary-block' }, h('h2', {}, 'Your journey'),
          h('p', { class: 'muted small' }, 'A short interview, seven views people hold, helps Continuum plan a journey that suits you.'),
          h('button', { type: 'button', class: 'btn ghost', onclick: () => showStance() }, 'Take the interview')));
    const again = h('p', { class: 'muted small', style: 'margin-top:28px' },
      h('button', { type: 'button', class: 'link', style: 'padding:0', onclick: () => tour() }, 'Take the spoken tour again'));
    render(h('h1', {}, 'Diary of discovery'), h('p', { class: 'muted' }, summary), journey, roads, threads, entries, again);
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
        if (run.stop) return;
        await playClip(URL.createObjectURL(blob), run);
      } catch (e) {
        if (!speech) break;
        notice(`The natural voice is not available right now${e.why ? `: ${e.why}` : ''}. Using the phone's voice.`);
        useEl = false; continue;
      }
    } else await sayPhone(view.spoken[p.i], plan.phone ?? null, run);
    if (run.stop || p.state === 'paused') return; // paused: stay on this sentence
    p.i++;
  }
  if (p.run === run) stopTalkVoice();
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

function showTalk({ about = null } = {}) {
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

    const ta = h('textarea', { id: 'talk-input', rows: '2', maxlength: '2000', placeholder: 'Say what you think…', enterkeyhint: 'send' });
    if (about) ta.value = `I have just been reading "${about.title}". `;
    const send = h('button', { type: 'button', class: 'btn' }, 'Send');
    const status = h('div', { class: 'muted small', role: 'status' });
    const compose = h('div', { class: 'talk-compose' }, ta);
    // Keep the newest words just above the composer (which sits over the bottom of the page).
    const keepInView = (el) => {
      const gap = el.getBoundingClientRect().bottom - (compose.getBoundingClientRect().top - 12);
      if (gap > 0) window.scrollBy(0, gap);
    };
    async function submit() {
      const text = ta.value.trim();
      if (!text || send.disabled) return;
      stopTalkVoice(); stopMic();
      send.disabled = true; ta.value = ''; status.textContent = '';
      bubble('you', text);
      const out = bubble('map', '', false); out.classList.add('thinking'); out.textContent = 'Thinking…';
      keepInView(out);
      let reply = ''; let view = null;
      try {
        const res = await fetch('/api/talk', { method: 'POST', headers: { 'x-continuum-token': token(), 'content-type': 'application/json' }, body: JSON.stringify({ id: convoId, text, date: today() }) });
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
            if (m.t === 'start') { convoId = m.id; store.set(TALK_KEY, String(m.id)); }
            else if (m.t === 'text') {
              reply += m.d; out.classList.remove('thinking'); out.replaceChildren(...replyNodes(reply.trimStart(), refs, false));
              keepInView(out);
            }
            else if (m.t === 'done') { Object.assign(refs, m.refs); view = finishReply(out, reply.trim()); keepInView(out); }
            else if (m.t === 'error') throw new Error(m.error);
          }
        }
        if (speakOn() && view) playFrom(view, 0);
      } catch (e) {
        out.classList.remove('thinking');
        if (!reply) out.remove();
        status.textContent = e.message;
      } finally { send.disabled = false; }
    }
    send.addEventListener('click', submit);
    ta.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey && !matchMedia('(pointer: coarse)').matches) { e.preventDefault(); submit(); } });

    // Speaking: the browser's speech recognition (on Android Chrome it sends the audio to Google to transcribe). It
    // keeps listening through pauses for thought (restarting when the browser ends a session on silence) until the
    // user taps again; then what they said is sent.
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let rec = null; let listening = false; let heard = ''; let before = '';
    const mic = Recognition && h('button', { type: 'button', class: 'btn ghost mic', 'aria-label': 'Speak', 'aria-pressed': 'false' }, 'Speak');
    const micLabel = (on) => { mic.setAttribute('aria-pressed', String(on)); mic.textContent = on ? 'Listening… tap when done' : 'Speak'; };
    function stopMic() { listening = false; if (rec) { rec.onend = null; rec.abort(); rec = null; } if (mic) micLabel(false); }
    function finishMic() { micLabel(false); if (heard.trim()) submit(); }
    function listen() {
      const r = rec = new Recognition();
      r.lang = navigator.language || 'en-US'; r.interimResults = true; r.continuous = true;
      let session = '';
      r.onresult = (e) => {
        let fin = ''; let interim = '';
        for (const x of e.results) { if (x.isFinal) fin += x[0].transcript; else interim += x[0].transcript; }
        session = fin;
        ta.value = `${before}${heard} ${fin}${interim}`.replace(/\s+/g, ' ').trimStart();
      };
      r.onerror = (e) => {
        if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
          listening = false; status.textContent = 'The microphone is blocked for this site. Allow it in Chrome (the icon left of the address), then try again.';
        }
      };
      r.onend = () => {
        heard = `${heard} ${session}`.trim(); rec = null;
        if (listening) { try { listen(); return; } catch { listening = false; } }
        finishMic();
      };
      r.start();
    }
    mic?.addEventListener('click', () => {
      if (listening) { listening = false; if (rec) rec.stop(); else finishMic(); return; }
      stopTalkVoice();
      listening = true; heard = ''; before = ta.value.trim() ? `${ta.value.trim()} ` : '';
      status.textContent = ''; micLabel(true);
      listen();
    });

    compose.append(h('div', { class: 'row' }, mic || h('span'), send));
    render(
      h('h1', {}, 'Talk'),
      h('p', { class: 'muted small' }, 'A conversation with the ideas on the map. It challenges what you hold firmly, backs you when you are onto something, and suggests practices and readings. Tap any sentence of a reply to hear it from there.'),
      h('div', { class: 'theme-chips' }, speakToggle, fresh),
      log,
      compose,
      status);
    if (about) { ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); }
    if (log.lastElementChild) keepInView(log.lastElementChild);
  });
}

// The interview: seven views people hold, one at a time, asked gently. Where do you stand, and how did you come to it?
// It is not a test: it only shapes the journey. Answers can be changed any time; skipping is fine.
const AGREE_CHOICES = [[2, 'Strongly agree'], [1, 'Lean toward agreeing'], [0, 'Not sure'], [-1, 'Lean toward disagreeing'], [-2, 'Strongly disagree']];
function showStance() {
  setNav('');
  return guarded(async () => {
    const data = await api('/api/stance');
    const answers = { ...data.saved };
    let i = -1;
    const step = () => {
      if (i < 0) {
        return render(h('div', { class: 'interview' },
          h('div', { class: 'eyebrow' }, 'A short interview'),
          h('h1', {}, 'Where are you starting from?'),
          h('p', { class: 'plain' }, 'Seven views that people hold. For each, say where you stand, and how you came to it. There are no right answers, and nothing here is judged.'),
          h('p', { class: 'muted' }, 'Continuum uses your answers only to plan a journey that suits you: voices who share your views and give them reasons, voices who see things another way, and practices to try. You can change any answer later, or skip one.'),
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
      const basis = a.agree != null && a.agree !== 0 && h('div', { class: 'basis' },
        h('p', { class: 'prompt' }, 'How did you come to this view?'),
        Object.entries(data.basis).map(([k, label]) => h('button', {
          type: 'button', class: `choice ${a.basis === k ? 'on' : ''}`, onclick: () => { answers[q.id] = { ...a, basis: k }; i++; step(); },
        }, label)));
      render(h('div', { class: 'interview' },
        h('div', { class: 'eyebrow' }, `${i + 1} of ${data.questions.length} · a view some people hold`),
        h('h1', { class: 'view' }, q.view),
        h('p', { class: 'prompt' }, 'Where do you stand?'),
        h('div', { class: 'choices' }, AGREE_CHOICES.map(([v, l]) => choice(v, l))),
        basis,
        h('div', { class: 'row', style: 'margin-top:18px' },
          h('button', { type: 'button', class: 'link', onclick: () => { i = Math.max(-1, i - 1); step(); } }, 'Back'),
          h('button', { type: 'button', class: 'link', onclick: () => { delete answers[q.id]; i++; step(); } }, 'Skip this one'))));
      document.querySelector('.interview .choice.on, .interview .choice')?.focus({ preventScroll: true });
    };
    async function finish() {
      const body = { answers: data.questions.map((q) => (answers[q.id] ? { id: q.id, agree: answers[q.id].agree, basis: answers[q.id].basis ?? null } : { id: q.id, agree: null })) };
      const r = await api('/api/stance', { method: 'POST', body });
      render(h('div', { class: 'interview' },
        h('div', { class: 'eyebrow' }, 'Your journey'),
        h('h1', {}, r.journey.stops.length ? 'Places worth a visit' : 'Thank you'),
        r.journey.stops.length
          ? h('p', { class: 'muted' }, 'Drawn from your answers. Start with a voice who shares your view and gives it reasons, then visit one who sees it another way. The journey also shapes your daily cards, and it lives in your Diary.')
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
      link(st.shares, 'A voice who shares it, with reasons'),
      link(st.differs, 'A voice who sees it another way'),
      link(st.practice, 'A practice to try'))),
    j.open.length > 0 && h('section', { class: 'stop' },
      h('div', { class: 'eyebrow' }, 'Questions you are open on'),
      j.open.map((o) => h('div', {}, h('p', { class: 'stop-view' }, `"${o.view}"`), o.ideas.map((c) => link(c, ''))))));
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
  else if (nav.dataset.nav === 'talk') showTalk();
  else if (nav.dataset.nav === 'practice') showPractice();
  else if (nav.dataset.nav === 'review') showReview(7);
  else if (nav.dataset.nav === 'gallery') showGallery('rooms');
  else showToday();
});

// Text size by pinching: two fingers on the page scale the text (0.85x to 1.8x), which rewraps to fit the screen. The
// paragraph under the fingers stays put. Remembered on this device. (Look mode has its own pinch, for the picture.)
const SCALE_KEY = 'continuum.textScale';
const clampScale = (v) => Math.min(1.8, Math.max(.85, v));
let textScale = clampScale(Number(store.get(SCALE_KEY)) || 1);
document.documentElement.style.setProperty('--text-scale', String(textScale));
let pinch = null;
const spread = (t) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
addEventListener('touchstart', (e) => {
  if (e.touches.length !== 2 || document.querySelector('.gaze, .intro')) return;
  const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2;
  const anchor = document.elementFromPoint(innerWidth / 2, cy);
  pinch = { d0: spread(e.touches), s0: textScale, anchor, top: anchor?.getBoundingClientRect().top ?? 0 };
}, { passive: true });
addEventListener('touchmove', (e) => {
  if (!pinch || e.touches.length !== 2) return;
  const next = clampScale(pinch.s0 * (spread(e.touches) / pinch.d0) ** 0.6); // gentler than the fingers' spread
  if (Math.abs(next - textScale) < .01) return;
  textScale = next;
  document.documentElement.style.setProperty('--text-scale', next.toFixed(3));
  if (pinch.anchor?.isConnected) window.scrollBy(0, pinch.anchor.getBoundingClientRect().top - pinch.top);
}, { passive: true });
addEventListener('touchend', (e) => {
  if (!pinch || e.touches.length) return;
  pinch = null; store.set(SCALE_KEY, textScale.toFixed(3)); queueWall();
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
  { text: 'Welcome to Continuum. Each day brings one idea from the long conversation of human wisdom. You write what you think first, before you read a word of it. Then the idea opens, one part at a time.' },
  { target: '.tabs [data-nav=today]', text: 'Today is your card for the day. Answer its question in a sentence or two. There are no wrong answers.' },
  { target: '.tabs [data-nav=practice]', text: 'Practice turns ideas into habits. It starts at ten seconds a day, and grows as you keep going.' },
  { target: '.tabs [data-nav=journal]', text: 'Your Diary keeps everything you write, the notes you leave on any idea, and the lines you keep. It suggests new roads, chosen from your own words.' },
  { target: '.tabs [data-nav=talk]', text: 'Talk is a conversation with the whole map. Argue a point, test a belief, or ask for a practice. It will push back when you are very sure.' },
  { target: '.tabs [data-nav=review]', text: 'Review shows your week: what you wrote, where you wandered, and what changed your mind.' },
  { target: '.tabs [data-nav=gallery]', text: 'The Gallery holds every idea, by room, by time and by theme. Wander anywhere. Only the daily cards stay hidden until their day.' },
  { target: '#listen', text: 'Listen reads any idea aloud. Voice sets the voice and the speed.' },
  { text: 'Two more things. Pinch the page with two fingers to make the text larger. And on any picture, tap Look to step inside it for a while.' },
  { text: 'That is the tour. If you like, a short interview comes next: seven views people hold, and where you stand on each. There are no right answers. It only helps Continuum plan a journey that suits you.' },
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
    next.textContent = i === TOUR.length - 1 ? 'Begin the interview' : 'Next';
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
function endTour() { if (!tourState) return; tourState.silence?.(); tourState.box.remove(); tourState = null; }
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

intro(offerTour);
showToday();
