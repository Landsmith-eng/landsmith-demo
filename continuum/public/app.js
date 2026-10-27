// Continuum client. Today: card -> write -> plain face -> flip to source -> walk the lineage.
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
  const banner = testDate() && h('div', { class: 'notice testdate', role: 'status' },
    `Test date: ${testDate()} (real date ${realToday()}). `,
    h('button', { type: 'button', class: 'link', onclick: () => { store.set(DATE_KEY, shiftDate(testDate(), 1)); showToday(); } }, '+1 day'),
    h('button', { type: 'button', class: 'link', onclick: () => { store.del(DATE_KEY); showToday(); } }, 'use real date'));
  view.replaceChildren(...[banner, ...nodes].filter(Boolean));
  window.scrollTo(0, 0);
}

function setNav(name) {
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

function progress(done, total) {
  return h('div', { class: 'progress', role: 'img', 'aria-label': `${done} of ${total} nodes` },
    Array.from({ length: total }, (_, i) => h('span', { class: i < done ? 'on' : '' })));
}

// The two-faced card: plain face in front, the authentic source on the back.
function card(node) {
  const wrap = h('div', { class: `card field-${node.field}` });
  const front = h('section', { class: 'face plain', 'aria-label': 'Plain face' },
    h('div', { class: 'who' }, [TYPE_LABEL[node.type], who(node), node.as_of && `as of ${node.as_of}`].filter(Boolean).join(' · ')),
    h('h1', {}, node.title),
    node.plain_face.split('\n\n').map((p) => h('p', {}, p)));
  const back = node.source_face
    ? h('section', { class: 'face source', 'aria-label': 'Source', 'aria-hidden': 'true' },
        h('div', { class: 'who' }, 'The source'),
        h('blockquote', {}, node.source_face.split('\n\n').map((p) => h('p', {}, p))),
        h('cite', {}, node.source_citation ?? ''),
        h('div', { class: 'srclinks' },
          node.source_url && h('a', { href: node.source_url, target: '_blank', rel: 'noopener', class: 'fulltext', tabindex: '-1' }, 'Read the full text ↗'),
          node.analysis_url && h('a', { href: node.analysis_url, target: '_blank', rel: 'noopener', class: 'fulltext', tabindex: '-1' }, 'Deeper: Stanford Encyclopedia ↗')),
        favoriteButton(node))
    : null;
  wrap.append(h('div', { class: 'card-inner' }, front, back));
  if (!back) return wrap;
  if (node.image && node.entry) front.append(nodeFigure(node.image));
  if (node.misreading && node.entry) front.append(h('p', { class: 'misreading' }, h('strong', {}, 'Often misread. '), node.misreading));

  let flipped = false;
  const btn = h('button', { type: 'button', class: 'btn ghost flip' }, 'Flip to the source');
  btn.addEventListener('click', () => {
    flipped = !flipped;
    wrap.classList.toggle('flipped', flipped);
    front.setAttribute('aria-hidden', String(flipped));
    back.setAttribute('aria-hidden', String(!flipped));
    back.querySelector('.fulltext')?.setAttribute('tabindex', flipped ? '0' : '-1');
    btn.textContent = flipped ? 'Back to the plain face' : 'Flip to the source';
    if (flipped) api('/api/event', { method: 'POST', body: { kind: 'flip', node_id: node.id, date: today() } }).catch(() => {});
  });
  return h('div', {}, wrap, h('div', { class: 'row' }, btn));
}

// The day's picture, shown in full after writing. Illustrations made for Continuum carry no caption (their
// source is recorded in content/images.js); a real artefact keeps its credit, which its licence usually requires.
function nodeFigure(img) {
  const credit = img.credit_url
    ? h('a', { href: img.credit_url, target: '_blank', rel: 'noopener' }, img.credit)
    : img.credit;
  return h('figure', { class: `node-image ${img.kind}` },
    h('img', { src: img.src, alt: img.alt, loading: 'lazy', decoding: 'async' }),
    img.kind === 'artefact' && h('figcaption', {}, credit));
}

// "Keep this line": toggles a favourite; kept lines collect at the top of the Journal.
function favoriteButton(node) {
  const btn = h('button', { type: 'button', class: 'link keep', 'aria-pressed': String(Boolean(node.favorite)), tabindex: '-1' });
  const paint = () => { btn.textContent = node.favorite ? '★ Kept' : '☆ Keep this line'; btn.setAttribute('aria-pressed', String(Boolean(node.favorite))); };
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

function lineage(node, trail) {
  const groups = GROUPS
    .map(([label, test]) => [label, node.neighbours.filter(test)])
    .filter(([, rows]) => rows.length);
  if (!groups.length) return null;
  return h('section', { class: 'lineage' },
    h('h2', {}, node.type === 'practice' ? 'Paths to this practice' : 'Walk the lineage'),
    groups.map(([label, rows]) => h('div', { class: 'group' },
      h('div', { class: 'eyebrow' }, label),
      h('div', { class: 'bubbles' }, rows.map((r) => h('button', {
        type: 'button',
        class: `bubble field-${r.field}`,
        title: r.note ?? '',
        onclick: () => walkTo(r.id, [...trail, node]),
      },
        r.thinker && h('span', { class: 'b-who' }, r.thinker),
        h('span', { class: 'b-title' }, r.title),
        r.note && h('span', { class: 'b-note' }, r.note)))))));
}

// A court case's opinions: who wrote what, in plain words, the passage itself, and the older idea it echoes.
const ROLE_LABEL = { majority: 'Opinion of the Court', plurality: 'Plurality opinion', concurrence: 'Concurring', dissent: 'Dissenting' };
function opinionsView(node, trail) {
  if (!node.opinions?.length) return null;
  return h('section', { class: 'opinions' },
    h('h2', {}, 'How the Court divided'),
    h('p', { class: 'muted small' }, 'Each opinion in plain words, then in the justice\'s own. The links show the older idea each one echoes.'),
    node.opinions.map((o) => h('article', { class: `opinion role-${o.role}` },
      h('div', { class: 'eyebrow' }, `${ROLE_LABEL[o.role] ?? o.role} · ${o.author}`),
      h('p', {}, o.gist),
      h('blockquote', {}, o.quote),
      o.echoes && h('button', { type: 'button', class: `bubble field-${o.echoes.field}`, onclick: () => walkTo(o.echoes.id, [...trail, node]) },
        h('span', { class: 'b-who' }, `Echoes ${o.echoes.thinker ?? ''}`.trim()),
        h('span', { class: 'b-title' }, o.echoes.title),
        o.echo_note && h('span', { class: 'b-note' }, o.echo_note)))));
}

function themeChips(node) {
  if (!node.themes?.length) return null;
  return h('div', { class: 'theme-chips' }, h('span', { class: 'eyebrow' }, 'Themes'),
    node.themes.map((t) => h('button', { type: 'button', class: 'chip', onclick: () => showGallery('themes', { theme: t.id }) }, t.name)));
}

function nodeBody(node, trail) {
  return [
    card(node),
    themeChips(node),
    opinionsView(node, trail),
    node.type !== 'practice' && node.year != null && h('div', { class: 'row tl-link-row' },
      h('button', { type: 'button', class: 'link', onclick: () => showGallery('timeline', { focus: node.id }) }, 'See on the timeline →'),
      h('button', { type: 'button', class: 'link', onclick: () => showGallery('rooms', { focus: node.id }) }, 'See its room →')),
    node.entry && h('div', {},
      h('div', { class: 'eyebrow' }, `Your take · ${node.entry.local_date}`),
      h('div', { class: 'yours' }, node.entry.body)),
    node.entry && node.source_face && reactionRow(node, trail),
    lineage(node, trail),
  ];
}

function writeView(data) {
  const node = data.node;
  const draftKey = `continuum.draft.${node.id}`;
  const ta = h('textarea', { id: 'resp', placeholder: 'Write before you read. There are no wrong answers.', maxlength: '5000' });
  ta.value = store.get(draftKey) ?? '';
  const submit = h('button', { type: 'submit', class: 'btn', disabled: !ta.value.trim() }, 'Done. Show me the idea');
  const status = h('span', { class: 'muted small', role: 'status' });
  ta.addEventListener('input', () => {
    submit.disabled = !ta.value.trim();
    store.set(draftKey, ta.value);
  });
  const form = h('form', {
    onsubmit: async (e) => {
      e.preventDefault();
      submit.disabled = true;
      status.textContent = 'Saving…';
      try {
        const { node: full } = await api('/api/respond', { method: 'POST', body: { node_id: node.id, body: ta.value, date: today() } });
        store.del(draftKey);
        doneView({ ...data, state: 'done_today', done: data.done + 1, node: full });
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

  render(
    h('div', { class: 'eyebrow' }, `Today · ${data.done} of ${data.total} so far`),
    progress(data.done, data.total),
    h('section', { class: `card-closed field-${node.field}${node.backdrop ? ' has-backdrop' : ''}` },
      node.backdrop && h('div', { class: 'backdrop', 'aria-hidden': 'true' }, h('img', { src: node.backdrop, alt: '', decoding: 'async' })),
      h('div', { class: 'who' }, [TYPE_LABEL[node.type], who(node)].filter(Boolean).join(' · ')),
      h('h1', {}, node.title)),
    form);
  if (!ta.value) ta.focus({ preventScroll: true });
}

function doneView(data) {
  const finished = data.done >= data.total;
  const msg = finished
    ? `That was the last of the ${data.total}. Your journal has the whole journey.`
    : 'That\'s today\'s card. Walk as far as you like below; a new card arrives tomorrow.';
  render(
    h('div', { class: 'eyebrow' }, `Today · ${data.done} of ${data.total}`),
    progress(data.done, data.total),
    h('div', { class: 'notice' }, msg),
    ...nodeBody(data.node, []));
}

function completeView(data) {
  render(
    h('div', { class: 'eyebrow' }, `${data.total} of ${data.total}`),
    progress(data.total, data.total),
    h('h1', {}, 'You walked the whole line.'),
    h('p', {}, 'Everything you wrote is in your journal. The map is still open: walk it from any entry.'),
    h('div', { class: 'row', style: 'justify-content:flex-start' },
      h('button', { type: 'button', class: 'btn', onclick: () => showReview(0) }, 'See where it led'),
      h('button', { type: 'button', class: 'btn ghost', onclick: showJournal }, 'Open your journal')));
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
      h('span', { class: 'b-who' }, n.thinker),
      n.title && h('span', { class: 'tile-title' }, n.title),
      h('span', { class: 'tile-meta' }, [year(n.year), TL_STATE[n.state], n.daily && n.state !== 'upcoming' && 'Daily line'].filter(Boolean).join(' · ')),
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
    h('span', { class: 'b-who' }, [n.thinker, year(n.year)].filter(Boolean).join(' · ') || TYPE_LABEL[n.type] || ''),
    n.title && h('span', { class: 'b-title' }, n.title),
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

function showJournal() {
  setNav('journal');
  return guarded(async () => {
    const { journal, favorites } = await api('/api/journal');
    const kept = favorites.length
      ? h('div', { style: 'margin-bottom:24px' }, h('h2', { style: 'margin-top:0' }, 'Kept lines'),
          h('ul', { class: 'path' }, favorites.map((f) => h('li', {},
            h('blockquote', { class: 'kept' }, (f.source_face ?? '').split(/\s*…\s*|\n\n/)[0]),
            h('button', { type: 'button', class: 'link', style: 'padding:0', onclick: () => walkTo(f.id, []) }, [f.thinker, f.title].filter(Boolean).join(' · '))))))
      : null;
    render(
      h('h1', {}, 'Your journal'),
      kept,
      journal.length
        ? h('ul', { class: 'path' }, journal.map((p) => h('li', {},
            h('button', { type: 'button', class: 'link', style: 'padding:0;text-align:left', onclick: () => walkTo(p.id, []) },
              h('span', { class: 't' }, p.title)),
            h('div', { class: 'muted small' }, [p.thinker, p.local_date, p.reaction && REACTION_LABEL[p.reaction]].filter(Boolean).join(' · ')),
            h('p', {}, p.body))))
        : h('p', { class: 'muted' }, 'Nothing yet. Each day\'s answer is kept here, pinned to its idea.'));
  });
}

// One step of the walk. `trail` is the path taken to get here, shown as breadcrumbs.
function walkTo(id, trail) {
  return guarded(async () => {
    const res = await api(`/api/node/${encodeURIComponent(id)}?date=${today()}`);
    if (res.today) return showToday(); // today's card: write first
    setNav('');
    const node = res.node;
    const crumbs = trail.length
      ? h('nav', { class: 'trail', 'aria-label': 'Your walk' },
          h('button', { type: 'button', class: 'link', onclick: showToday }, 'Today'),
          trail.map((t, i) => h('button', { type: 'button', class: 'link', onclick: () => walkTo(t.id, trail.slice(0, i)) }, t.thinker ?? t.title)),
          h('span', { 'aria-current': 'page' }, node.thinker ?? node.title))
      : h('button', { type: 'button', class: 'link back', onclick: showToday }, '← Back to today');
    render(crumbs, ...nodeBody(node, trail));
  });
}

document.addEventListener('click', (e) => {
  const nav = e.target.closest('[data-nav]');
  if (!nav) return;
  e.preventDefault();
  if (nav.dataset.nav === 'journal') showJournal();
  else if (nav.dataset.nav === 'review') showReview(7);
  else if (nav.dataset.nav === 'gallery') showGallery('rooms');
  else showToday();
});

showToday();
