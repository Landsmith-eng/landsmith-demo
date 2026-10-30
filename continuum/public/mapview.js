// The Map: every idea as a point of light over the observatory plate. Two ways to draw it (by influence, by
// meaning), coloured by era, field or room. Ideas you have met shine; the ones you have not are faint; today's card
// is marked but stays unnamed until its day. Ideas that came back fuzzy in the daily review glow amber, so you can
// relearn them among their neighbours. Drag to move, pinch or scroll to zoom, tap a point to see it and its links.
// Zooming in takes the map to the full screen (the header and menu fade away), with names growing as you go closer;
// tapping an idea offers a short journey from it, which the daily walk then follows.
// A chosen idea gathers its circle: zoomed right in, the ideas it links to stand in a ring around it, each link named;
// zooming out a little brings the next ring (their links); further out, the whole map returns.

const ERA_COLORS = { ancient: '#e9c46a', medieval: '#c98bdb', early_modern: '#7fb7e8', c19: '#f08a6c', c20: '#8fe8b4', now: '#7fe0e6' };
const FIELD_VARS = ['philosophy', 'science', 'religion', 'practice', 'art', 'culture', 'law', 'now'];
const FIELD_NAMES = { philosophy: 'Philosophy', science: 'Science', religion: 'Religion', practice: 'Practice', art: 'Art', culture: 'Culture', law: 'Law', now: 'The news' };
// How each link reads, as "<B> <verb> <A>" (B did this to the earlier A).
const REL_WORDS = { taught: 'learned from', extended: 'built on', refuted: 'argued against', converged: 'reached the same idea as',
  measured: 'tested', secularized: 'kept the practice of', echoes: 'echoes', lands_on: 'is practised in' };

// Builds the map into `mount` (an element already on the page). `data` is /api/map; `onOpen(node)` opens an idea.
export function mountMap(mount, data, { h, onOpen, onTrail = null, mode: startMode = 'influence', color: startColor = 'era' }) {
  const css = getComputedStyle(document.documentElement);
  const fieldColor = Object.fromEntries(FIELD_VARS.map((f) => [f, css.getPropertyValue(`--f-${f}`).trim() || '#ccc']));
  const roomIds = data.rooms.map((r) => r.id);
  const roomColor = Object.fromEntries(roomIds.map((id, i) => [id, `hsl(${Math.round((i * 360) / roomIds.length + 20)} 62% 70%)`]));
  const byId = new Map(data.nodes.map((n) => [n.id, n]));
  const links = new Map(data.nodes.map((n) => [n.id, []]));
  for (const e of data.edges) { links.get(e.from)?.push({ other: e.to, e }); links.get(e.to)?.push({ other: e.from, e }); }

  let mode = startMode, colorBy = startColor, showRoad = false, selected = null, query = '';
  // Positions animate between the two layouts.
  const pos = new Map(data.nodes.map((n) => [n.id, [...n[mode]]]));
  let anim = null;

  const canvas = h('canvas', { class: 'map-canvas', role: 'img', 'aria-label': 'Map of ideas. Tap a point to see it.' });
  const info = h('div', { class: 'map-info', 'aria-live': 'polite' });
  const legend = h('div', { class: 'map-legend' });
  const chip = (label, on, onclick) => h('button', { type: 'button', class: `chip ${on ? 'on' : ''}`, 'aria-pressed': String(on), onclick }, label);
  const controls = h('div', { class: 'map-controls' });
  const search = h('input', { type: 'search', class: 'search', placeholder: 'Find a thinker or idea on the map…', 'aria-label': 'Find on the map', autocomplete: 'off' });
  search.addEventListener('input', () => {
    query = search.value.trim().toLowerCase();
    const hit = matches()[0];
    if (hit && query.length > 2) focusOn(hit.id, false);
    else if (!query) { selected = null; ego = null; showInfo(null); }
    draw();
  });
  const exit = h('button', { type: 'button', class: 'pill map-exit', 'aria-label': 'Leave the full-screen map', onclick: () => setFull(false, true) }, '✕');
  const stage = h('div', { class: 'map-stage' }, canvas, exit);
  mount.replaceChildren(controls, search, stage, legend, info);
  let full = false;
  // Full screen: the map fills the phone, the header and menu fade, the tapped idea shows in a sheet at the bottom.
  function setFull(on, refit = false) {
    if (on === full) return;
    const cx = (W / 2 - tx) / s, cy = (H / 2 - ty) / s; // keep the same place in the middle of the view
    full = on;
    mount.classList.toggle('map-full', on);
    document.documentElement.classList.toggle('map-full', on);
    size();
    if (refit) fit(); else { tx = W / 2 - cx * s; ty = H / 2 - cy * s; }
    draw();
  }

  function renderControls() {
    controls.replaceChildren(
      h('div', { class: 'size-chips', role: 'group', 'aria-label': 'Draw by' },
        chip('Influence', mode === 'influence', () => setMode('influence')),
        chip('Meaning', mode === 'semantic', () => setMode('semantic'))),
      h('div', { class: 'size-chips', role: 'group', 'aria-label': 'Colour by' },
        chip('Era', colorBy === 'era', () => { colorBy = 'era'; renderControls(); draw(); }),
        chip('Field', colorBy === 'field', () => { colorBy = 'field'; renderControls(); draw(); }),
        chip('Room', colorBy === 'room', () => { colorBy = 'room'; renderControls(); draw(); }),
        chip('Your road', showRoad, () => { showRoad = !showRoad; renderControls(); draw(); })),
      h('p', { class: 'muted small map-what' }, mode === 'influence'
        ? 'Drawn by influence: ideas close together share a lineage (who taught, extended, argued with or tested whom). Time runs gently from left to right.'
        : 'Drawn by meaning: ideas close together ask similar questions, even centuries and continents apart.'),
    );
    renderLegend();
  }
  function renderLegend() {
    const items = colorBy === 'era' ? data.eras.map((e) => [ERA_COLORS[e.id], e.name])
      : colorBy === 'field' ? [...new Set(data.nodes.map((n) => n.field))].map((f) => [fieldColor[f], FIELD_NAMES[f] ?? f])
        : data.rooms.map((r) => [roomColor[r.id], r.name]);
    legend.replaceChildren(...items.map(([c, name]) => h('span', { class: 'map-key' }, h('i', { style: `background:${c}` }), name)),
      h('span', { class: 'map-key' }, h('i', { class: 'met' }), 'met'),
      h('span', { class: 'map-key' }, h('i', { class: 'fuzzy' }), 'fuzzy: review it'));
  }
  const colorOf = (n) => (n.state === 'upcoming' ? 'rgba(255,255,255,.5)'
    : colorBy === 'era' ? ERA_COLORS[n.era] ?? '#ddd' : colorBy === 'field' ? fieldColor[n.field] ?? '#ddd' : roomColor[n.room] ?? '#ddd');
  const label = (n) => (n.state === 'upcoming' ? null : n.thinker && !/^US Supreme Court$/.test(n.thinker) ? n.thinker : n.title);
  const matches = () => (query.length < 2 ? [] : data.nodes.filter((n) => n.state !== 'upcoming'
    && `${n.title} ${n.thinker ?? ''}`.toLowerCase().includes(query)));

  // ── The chosen idea's circle ──
  // Offsets (in map units) from the chosen idea: its own links on an inner ring, ordered round as they lie on the map;
  // their links on an outer ring, each near the inner idea it came through.
  let ego = null; let ew = { w: 0, r2: 0 };
  const clamp = (v) => Math.max(0, Math.min(1, v));
  const R1 = .055, R2 = .11; // ring radii (map units); at the circle's zoom (4.5x) the inner ring is a quarter of the screen out
  function buildEgo(id) {
    const c = pos.get(id); const ang = (o) => { const p = pos.get(o); return Math.atan2(p[1] - c[1], p[0] - c[0]); };
    const inner = [...new Set(links.get(id).map((l) => l.other))].filter((o) => byId.get(o)?.state !== 'today').sort((a, b) => ang(a) - ang(b));
    const ring1 = new Map(); const at = new Map(); const r1 = R1 * (inner.length > 10 ? 1.25 : 1);
    const start = inner.length ? ang(inner[0]) : 0;
    inner.forEach((o, i) => { const a = start + (i * 2 * Math.PI) / inner.length; at.set(o, a); ring1.set(o, [Math.cos(a) * r1, Math.sin(a) * r1]); });
    const groups = new Map();
    for (const o of inner) for (const l of links.get(o)) {
      const x = l.other;
      if (x === id || ring1.has(x) || byId.get(x)?.state === 'today' || [...groups.values()].some((g) => g.includes(x))) continue;
      if (!groups.has(o)) groups.set(o, []);
      if (groups.get(o).length < 6) groups.get(o).push(x);
    }
    const ring2 = new Map(); const sector = (2 * Math.PI) / Math.max(1, inner.length);
    for (const [o, xs] of groups) xs.forEach((x, i) => {
      const a = at.get(o) + (xs.length < 2 ? 0 : (i / (xs.length - 1) - .5) * sector * .85);
      const r = Math.max(R2, r1 * 1.9) * (xs.length > 3 && i % 2 ? 1.18 : 1);
      ring2.set(x, [Math.cos(a) * r, Math.sin(a) * r]);
    });
    return { id, ring1, ring2 };
  }
  // How far the circle has gathered (w) and how much of the outer ring shows (r2), from the zoom.
  function weigh() {
    const z = s / Math.min(W, H);
    ew = ego ? { w: clamp((z - 2) / 1.5), r2: clamp((4.6 - z) / 1.1) } : { w: 0, r2: 0 };
  }
  function shown(id) {
    const p = pos.get(id);
    if (!ego || !ew.w || id === ego.id) return p;
    const off = ego.ring1.get(id) ?? ego.ring2.get(id); if (!off) return p;
    const c = pos.get(ego.id);
    return [p[0] + (c[0] + off[0] - p[0]) * ew.w, p[1] + (c[1] + off[1] - p[1]) * ew.w];
  }

  // ── View transform: world (0..1) to screen ──
  let W = 0, H = 0, dpr = 1, s = 1, tx = 0, ty = 0;
  function size() {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(2, devicePixelRatio || 1); W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
  }
  function fit() { s = Math.min(W, H) * .98; tx = (W - s) / 2; ty = (H - s) / 2; }
  const sx = (x) => tx + x * s, sy = (y) => ty + y * s;

  function setMode(m) {
    if (m === mode) return;
    mode = m; renderControls();
    const from = new Map([...pos].map(([id, p]) => [id, [...p]]));
    const t0 = performance.now();
    cancelAnimationFrame(anim);
    const step = (t) => {
      const k = Math.min(1, (t - t0) / 700), e = k < .5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
      for (const n of data.nodes) { const a = from.get(n.id), b = n[mode]; pos.get(n.id)[0] = a[0] + (b[0] - a[0]) * e; pos.get(n.id)[1] = a[1] + (b[1] - a[1]) * e; }
      draw(); if (k < 1) anim = requestAnimationFrame(step);
    };
    anim = requestAnimationFrame(step);
  }

  function draw() {
    const g = canvas.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
    weigh();
    const near = selected ? new Set(links.get(selected).map((l) => l.other)) : null;
    const found = new Set(matches().map((n) => n.id));
    // Links: all of them, faint, when drawn by influence; only the chosen idea's when drawn by meaning.
    g.lineWidth = 1;
    const outer = ego ? ew.w * ew.r2 : 0;
    const named = [];
    for (const e of data.edges) {
      const on = selected && (e.from === selected || e.to === selected);
      // In the circle: the links between the inner and outer rings, faint, as the outer ring shows.
      const wider = !on && outer > .02 && ((ego.ring1.has(e.from) && ego.ring2.has(e.to)) || (ego.ring2.has(e.from) && ego.ring1.has(e.to)));
      if (!on && !wider && (mode !== 'influence' || selected)) continue;
      const a = shown(e.from), b = shown(e.to); if (!a || !b) continue;
      g.strokeStyle = on ? 'rgba(244,192,99,.85)' : wider ? `rgba(160,220,255,${.45 * outer})` : 'rgba(255,255,255,.09)';
      g.lineWidth = on ? 1.6 + ew.w : 1;
      g.beginPath(); g.moveTo(sx(a[0]), sy(a[1])); g.lineTo(sx(b[0]), sy(b[1])); g.stroke();
      if (on && ew.w > .6) named.push([e, a, b]);
    }
    // The road walked, in order.
    if (showRoad && data.road.length > 1) {
      g.strokeStyle = 'rgba(244,192,99,.9)'; g.lineWidth = 2; g.setLineDash([5, 5]);
      g.beginPath();
      data.road.forEach((id, i) => { const p = shown(id); if (p) (i ? g.lineTo : g.moveTo).call(g, sx(p[0]), sy(p[1])); });
      g.stroke(); g.setLineDash([]);
    }
    // A journey: the one started (solid), or the one offered for the tapped idea (dashed).
    const path = (ids, dash, alpha) => {
      const ps = ids.map((id) => shown(id)).filter(Boolean); if (ps.length < 2) return;
      g.strokeStyle = `rgba(143,232,180,${alpha})`; g.lineWidth = 2.5; g.setLineDash(dash);
      g.beginPath(); ps.forEach((p, i) => (i ? g.lineTo : g.moveTo).call(g, sx(p[0]), sy(p[1]))); g.stroke(); g.setLineDash([]);
    };
    if (data.trail) path([data.trail.from, ...data.trail.ids], [], .75);
    if (offered) path([selected, ...offered.map((x) => x.id)], [7, 6], .9);
    const zoom = s / Math.min(W, H);
    const r0 = Math.max(3.6, Math.min(7.5, 3.6 * zoom ** .5));
    // Points.
    // How visible each idea is: in the circle, the outer ring follows the zoom and the rest of the map fades away.
    const fade = (n) => {
      if (!ego || n.id === ego.id || ego.ring1.has(n.id)) return null;
      if (ego.ring2.has(n.id)) return (1 - ew.w) * .2 + ew.w * .85 * ew.r2;
      return (1 - ew.w) * .2;
    };
    for (const n of data.nodes) {
      const p = shown(n.id), x = sx(p[0]), y = sy(p[1]);
      if (x < -20 || y < -20 || x > W + 20 || y > H + 20) continue;
      const met = n.state === 'written' || n.state === 'visited';
      const f = fade(n); if (f !== null && f < .02) continue;
      const dim = (selected && n.id !== selected && !near.has(n.id) && !offered?.some((x) => x.id === n.id)) || (found.size && !found.has(n.id));
      g.globalAlpha = f ?? (dim ? .2 : met || n.state === 'today' ? 1 : .72);
      if (n.fuzzy && !dim) { g.shadowColor = '#f4c063'; g.shadowBlur = 16; }
      g.fillStyle = colorOf(n);
      g.beginPath();
      if (n.state === 'upcoming') { g.strokeStyle = 'rgba(255,255,255,.5)'; g.arc(x, y, r0 * .8, 0, Math.PI * 2); g.stroke(); }
      else { g.arc(x, y, met ? r0 * 1.25 : r0, 0, Math.PI * 2); g.fill(); }
      g.shadowBlur = 0;
      if (met) { g.strokeStyle = 'rgba(255,255,255,.85)'; g.lineWidth = 1.2; g.beginPath(); g.arc(x, y, r0 * 1.25 + 2.5, 0, Math.PI * 2); g.stroke(); }
      if (n.state === 'today') { g.strokeStyle = '#f4c063'; g.lineWidth = 2; g.beginPath(); g.arc(x, y, r0 * 2.2, 0, Math.PI * 2); g.stroke(); }
      if (n.id === selected) { g.strokeStyle = '#fff'; g.lineWidth = 2; g.beginPath(); g.arc(x, y, r0 * 2.4, 0, Math.PI * 2); g.stroke(); }
    }
    g.globalAlpha = 1;
    // In the circle, each of the chosen idea's links says what it is, along its line.
    if (named.length) {
      g.font = `italic ${Math.round(11 + 2 * ew.w)}px Manrope, system-ui, sans-serif`; g.textAlign = 'center';
      g.globalAlpha = clamp((ew.w - .6) / .3);
      const used = [];
      for (const [e, a, b] of named) {
        const verb = REL_WORDS[e.relation] ?? e.relation.replace(/_/g, ' ');
        const [c, o] = e.from === selected ? [a, b] : [b, a]; // from the chosen idea out toward the other
        const mx = sx(c[0] + (o[0] - c[0]) * .62), my = sy(c[1] + (o[1] - c[1]) * .62);
        const w = g.measureText(verb).width; const box = [mx - w / 2, my - 15, mx + w / 2, my];
        if (used.some((u) => box[0] < u[2] && box[2] > u[0] && box[1] < u[3] && box[3] > u[1])) continue;
        used.push(box);
        g.lineWidth = 3; g.strokeStyle = 'rgba(6,10,8,.75)'; g.strokeText(verb, mx, my - 3);
        g.fillStyle = 'rgba(244,214,150,.95)'; g.fillText(verb, mx, my - 3);
      }
      g.textAlign = 'start'; g.globalAlpha = 1;
    }
    // Labels, without overlapping: the chosen idea and its links first, then search hits, then ideas met, then the
    // rest as the zoom gives room.
    const taken = [];
    const free = (x, y, w) => !taken.some((b) => x < b[2] && x + w > b[0] && y - fs < b[3] && y + 4 > b[1]);
    const order = [...data.nodes].sort((a, b) => rankLabel(b) - rankLabel(a));
    function rankLabel(n) {
      if (n.id === selected) return 5; if (near?.has(n.id) || offered?.some((x) => x.id === n.id)) return 4; if (found.has(n.id)) return 3;
      if (ego?.ring2.has(n.id) && outer > .5) return 3.5;
      if (ego && ew.w > .5) return 0; // faded away
      if (n.state === 'written' || n.state === 'visited') return 2; return n.fuzzy ? 2.5 : 1;
    }
    const fs = Math.round(Math.min(ego && ew.w > .5 ? 16 : 20, Math.max(12, 12 * zoom ** .42)) + (full ? 1 : 0)); // names grow as you go closer
    g.font = `${fs}px Manrope, system-ui, sans-serif`; g.textBaseline = 'alphabetic';
    for (const n of order) {
      const text = label(n); if (!text) continue;
      const rank = rankLabel(n);
      if (!rank) continue;
      if (selected && rank < 3.5 && zoom < 2.2) continue;
      if (rank < 2 && zoom < 1.8) continue;
      const p = shown(n.id);
      // In the circle, names sit centred over (upper half) or under (lower half) their point, so the ring fits a phone.
      const ringed = ego && ew.w > .5 && n.id !== ego.id;
      const cap = ringed ? 20 : full ? 34 : 26; const t = text.length > cap ? `${text.slice(0, cap - 1)}…` : text;
      const w = g.measureText(t).width;
      const above = ringed && p[1] < pos.get(ego.id)[1];
      const x = ringed ? sx(p[0]) - w / 2 : sx(p[0]) + r0 + 5;
      const y = !ringed ? sy(p[1]) + 4 : above ? sy(p[1]) - r0 - 6 : sy(p[1]) + r0 + fs;
      if (x > W || x + w < 0 || y > H + 10 || y < 0) continue;
      if (!free(x, y, w) && rank < 5) continue;
      taken.push([x, y - fs, x + w, y + 4]);
      g.lineWidth = Math.max(3, fs / 4); g.strokeStyle = 'rgba(6,10,8,.8)'; g.strokeText(t, x, y);
      g.fillStyle = rank >= 4 ? '#fff' : 'rgba(240,246,240,.88)'; g.fillText(t, x, y);
    }
  }

  // ── The idea you tapped ──
  // A short journey from an idea: where it came from, who pushed back, who took it further, where it meets something
  // else, and the practice it lands on. Ideas not yet met first; at most five stops.
  let offered = null;
  const setInfo = (...kids) => info.replaceChildren(...kids.filter((k) => k != null && k !== false && k !== ''));
  function journeyFrom(id) {
    const ls = links.get(id).filter((l) => byId.get(l.other)?.state !== 'today');
    const fresh = (l) => !['written', 'visited'].includes(byId.get(l.other).state);
    const pick = (test, why) => {
      const c = ls.filter(test).sort((a, b) => fresh(b) - fresh(a))[0];
      return c && { id: c.other, why };
    };
    const went = (rel) => (l) => l.e.from === id && l.e.relation === rel; // the other (later) one did rel to this
    const stops = [
      pick((l) => l.e.to === id && ['taught', 'extended', 'secularized'].includes(l.e.relation), 'where it came from'),
      pick((l) => l.e.relation === 'refuted', 'who pushed back'),
      pick((l) => went('extended')(l) || went('measured')(l), 'who took it further, or tested it'),
      pick((l) => l.e.relation === 'converged' || l.e.relation === 'echoes', 'where it meets something else'),
      pick((l) => l.e.relation === 'lands_on', 'the practice it leads to'),
    ].filter(Boolean).filter((x, i, a) => a.findIndex((y) => y.id === x.id) === i);
    return stops.slice(0, 5);
  }
  function showInfo(n) {
    offered = null;
    if (!n) { setInfo(h('p', { class: 'muted small' }, 'Tap a point to see the idea, what it links to, and a journey from it.')); return; }
    if (n.state === 'today') {
      setInfo(h('h3', {}, n.title), h('p', { class: 'small' }, 'Today\'s card. Write your answer first; then its links open.'),
        h('div', { class: 'row', style: 'justify-content:flex-start' }, h('button', { type: 'button', class: 'btn', onclick: () => onOpen(n) }, 'Open today\'s card')));
      return;
    }
    const ls = links.get(n.id).filter((l) => byId.get(l.other)?.state !== 'today');
    const relLine = (l) => {
      const o = byId.get(l.other); const later = l.e.from === n.id; // later: the other did <relation> to this idea
      const verb = REL_WORDS[l.e.relation] ?? l.e.relation.replace(/_/g, ' ');
      return h('button', { type: 'button', class: 'link map-link', onclick: () => focusOn(o.id, true) },
        later ? `${label(o)} ${verb} this` : `This ${verb} ${label(o)}`);
    };
    offered = journeyFrom(n.id);
    const started = data.trail && data.trail.from === n.id;
    setInfo(
      h('div', { class: `eyebrow field-${n.field}` }, [n.thinker, n.year == null ? null : n.year < 0 ? `${-n.year} BCE` : n.year].filter(Boolean).join(' · ')),
      h('h3', {}, n.title),
      n.line && h('p', { class: 'small' }, n.line),
      n.fuzzy && h('p', { class: 'small map-fuzzy' }, 'This one came back fuzzy in your daily review. Its neighbours here can help it stick.'),
      h('div', { class: 'row', style: 'justify-content:flex-start' },
        h('button', { type: 'button', class: 'btn', onclick: () => onOpen(n) }, 'Open this idea'),
        ls.length ? h('button', { type: 'button', class: 'btn ghost', onclick: () => focusOn(n.id, true) }, 'Its circle, up close') : null),
      ls.length ? h('p', { class: 'muted small' }, 'Zoom in on it to gather its links around it; zoom out to see their links, then the whole map.') : null,
      offered.length ? h('div', { class: 'map-journey' },
        h('div', { class: 'eyebrow' }, 'A journey from here'),
        h('ol', {}, offered.map((x) => h('li', {},
          h('button', { type: 'button', class: 'link map-link', onclick: () => focusOn(x.id, true) }, byId.get(x.id).title),
          h('span', { class: 'muted small' }, ` · ${x.why}`)))),
        h('div', { class: 'row', style: 'justify-content:flex-start' },
          onTrail && h('button', { type: 'button', class: 'btn', onclick: async (e) => {
            e.target.disabled = true;
            const ok = await onTrail(n, offered.map((x) => x.id));
            if (ok) { data.trail = { from: n.id, ids: offered.map((x) => x.id) }; e.target.textContent = 'Journey started'; draw(); } else e.target.disabled = false;
          } }, started ? 'Start it again' : 'Start this journey'),
          h('button', { type: 'button', class: 'btn ghost', onclick: () => onOpen(byId.get(offered[0].id)) }, 'Walk it now')),
        h('p', { class: 'muted small' }, 'A started journey sets your next daily ideas, one stop a day.')) : null,
      ls.length ? h('div', { class: 'map-links' }, h('div', { class: 'eyebrow' }, 'Its links'), ls.slice(0, 8).map(relLine)) : null,
    );
  }
  let glide = null;
  function focusOn(id, center) {
    selected = id; ego = buildEgo(id); showInfo(byId.get(id));
    if (center) {
      if (!full) setFull(true);
      // Glide in until the circle has gathered, the idea a little above the middle (room for the sheet below).
      const p = pos.get(id); const s0 = s, tx0 = tx, ty0 = ty; const s1 = Math.min(W, H) * 4.5;
      const x1 = W / 2, y1 = H * .36; const t0 = performance.now();
      cancelAnimationFrame(glide);
      const step = (t) => {
        const k = Math.min(1, (t - t0) / 900), e = k < .5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
        const sx0 = tx0 + p[0] * s0, sy0 = ty0 + p[1] * s0; // where the idea was on the screen
        s = s0 * (s1 / s0) ** e;
        tx = sx0 + (x1 - sx0) * e - p[0] * s; ty = sy0 + (y1 - sy0) * e - p[1] * s;
        draw(); if (k < 1) glide = requestAnimationFrame(step);
      };
      glide = requestAnimationFrame(step);
      return;
    }
    draw();
  }

  // ── Touch, mouse and wheel ──
  const pts = new Map(); let pinch = null, moved = 0, down = null;
  canvas.addEventListener('pointerdown', (e) => { cancelAnimationFrame(glide); canvas.setPointerCapture(e.pointerId); pts.set(e.pointerId, { x: e.clientX, y: e.clientY }); moved = 0; down = { x: e.clientX, y: e.clientY }; });
  canvas.addEventListener('pointermove', (e) => {
    if (!pts.has(e.pointerId)) return;
    const prev = pts.get(e.pointerId); const cur = { x: e.clientX, y: e.clientY }; pts.set(e.pointerId, cur);
    if (pts.size === 1) { tx += cur.x - prev.x; ty += cur.y - prev.y; moved += Math.abs(cur.x - prev.x) + Math.abs(cur.y - prev.y); draw(); return; }
    const [a, b] = [...pts.values()]; const d = Math.hypot(a.x - b.x, a.y - b.y);
    const r = canvas.getBoundingClientRect(); const mx = (a.x + b.x) / 2 - r.left, my = (a.y + b.y) / 2 - r.top;
    if (pinch) zoomAt(d / pinch, mx, my); pinch = d; moved += 10;
  });
  const up = (e) => {
    pts.delete(e.pointerId); if (pts.size < 2) pinch = null;
    if (!pts.size && moved < 8 && down) tap(down.x, down.y);
    if (!pts.size) down = null;
  };
  canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
  canvas.addEventListener('wheel', (e) => { e.preventDefault(); const r = canvas.getBoundingClientRect(); zoomAt(Math.exp(-e.deltaY * .0015), e.clientX - r.left, e.clientY - r.top); }, { passive: false });
  function zoomAt(f, mx, my) {
    cancelAnimationFrame(glide);
    // With an idea chosen, zoom around it (so its circle gathers in place), while it is on the screen.
    if (selected) { const p = pos.get(selected); const x = sx(p[0]), y = sy(p[1]); if (x > 0 && y > 0 && x < W && y < H) { mx = x; my = y; } }
    const base = Math.min(W, H); const ns = Math.min(base * 12, Math.max(base * .7, s * f)); const k = ns / s;
    tx = mx - (mx - tx) * k; ty = my - (my - ty) * k; s = ns;
    if (!full && s > base * 1.35) return setFull(true);
    if (full && s < base * .85) return setFull(false, true);
    draw();
  }
  function tap(cx, cy) {
    const r = canvas.getBoundingClientRect(); const x = cx - r.left, y = cy - r.top;
    let best = null, bd = 22;
    for (const n of data.nodes) {
      const f = ego && n.id !== ego.id && !ego.ring1.has(n.id) ? (ego.ring2.has(n.id) ? ew.w * ew.r2 + (1 - ew.w) : 1 - ew.w) : 1;
      if (f < .3) continue; // faded out of the circle: not tappable
      const p = shown(n.id); const d = Math.hypot(sx(p[0]) - x, sy(p[1]) - y); if (d < bd) { bd = d; best = n; }
    }
    if (best) focusOn(best.id, false); else { selected = null; ego = null; showInfo(null); draw(); }
  }

  const ro = new ResizeObserver(() => { const was = W; size(); if (!was) fit(); draw(); });
  ro.observe(canvas);
  renderControls(); showInfo(null);
  return { destroy: () => { ro.disconnect(); document.documentElement.classList.remove('map-full'); } };
}
