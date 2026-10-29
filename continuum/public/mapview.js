// The Map: every idea as a point of light over the observatory plate. Two ways to draw it (by influence, by
// meaning), coloured by era, field or room. Ideas you have met shine; the ones you have not are faint; today's card
// is marked but stays unnamed until its day. Ideas that came back fuzzy in the daily review glow amber, so you can
// relearn them among their neighbours. Drag to move, pinch or scroll to zoom, tap a point to see it and its links.

const ERA_COLORS = { ancient: '#e9c46a', medieval: '#c98bdb', early_modern: '#7fb7e8', c19: '#f08a6c', c20: '#8fe8b4', now: '#7fe0e6' };
const FIELD_VARS = ['philosophy', 'science', 'religion', 'practice', 'art', 'culture', 'law', 'now'];
const FIELD_NAMES = { philosophy: 'Philosophy', science: 'Science', religion: 'Religion', practice: 'Practice', art: 'Art', culture: 'Culture', law: 'Law', now: 'The news' };
const REL_WORDS = { taught: 'taught', extended: 'extended', argued_against: 'argued against', tested: 'tested', echoes: 'echoes', parallels: 'parallels', lands_on: 'lands on' };

// Builds the map into `mount` (an element already on the page). `data` is /api/map; `onOpen(node)` opens an idea.
export function mountMap(mount, data, { h, onOpen, mode: startMode = 'influence', color: startColor = 'era' }) {
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
    else if (!query) { selected = null; showInfo(null); }
    draw();
  });
  mount.replaceChildren(controls, search, canvas, legend, info);

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
    const near = selected ? new Set(links.get(selected).map((l) => l.other)) : null;
    const found = new Set(matches().map((n) => n.id));
    // Links: all of them, faint, when drawn by influence; only the chosen idea's when drawn by meaning.
    g.lineWidth = 1;
    for (const e of data.edges) {
      const on = selected && (e.from === selected || e.to === selected);
      if (!on && (mode !== 'influence' || selected)) continue;
      const a = pos.get(e.from), b = pos.get(e.to); if (!a || !b) continue;
      g.strokeStyle = on ? 'rgba(244,192,99,.85)' : 'rgba(255,255,255,.09)';
      g.lineWidth = on ? 1.6 : 1;
      g.beginPath(); g.moveTo(sx(a[0]), sy(a[1])); g.lineTo(sx(b[0]), sy(b[1])); g.stroke();
    }
    // The road walked, in order.
    if (showRoad && data.road.length > 1) {
      g.strokeStyle = 'rgba(244,192,99,.9)'; g.lineWidth = 2; g.setLineDash([5, 5]);
      g.beginPath();
      data.road.forEach((id, i) => { const p = pos.get(id); if (p) (i ? g.lineTo : g.moveTo).call(g, sx(p[0]), sy(p[1])); });
      g.stroke(); g.setLineDash([]);
    }
    const zoom = s / Math.min(W, H);
    const r0 = Math.max(3.6, Math.min(7.5, 3.6 * zoom ** .5));
    // Points.
    for (const n of data.nodes) {
      const p = pos.get(n.id), x = sx(p[0]), y = sy(p[1]);
      if (x < -20 || y < -20 || x > W + 20 || y > H + 20) continue;
      const met = n.state === 'written' || n.state === 'visited';
      const dim = (selected && n.id !== selected && !near.has(n.id)) || (found.size && !found.has(n.id));
      g.globalAlpha = dim ? .2 : met || n.state === 'today' ? 1 : .72;
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
    // Labels, without overlapping: the chosen idea and its links first, then search hits, then ideas met, then the
    // rest as the zoom gives room.
    const taken = [];
    const free = (x, y, w) => !taken.some((b) => x < b[2] && x + w > b[0] && y - 12 < b[3] && y + 3 > b[1]);
    const order = [...data.nodes].sort((a, b) => rankLabel(b) - rankLabel(a));
    function rankLabel(n) {
      if (n.id === selected) return 5; if (near?.has(n.id)) return 4; if (found.has(n.id)) return 3;
      if (n.state === 'written' || n.state === 'visited') return 2; return n.fuzzy ? 2.5 : 1;
    }
    g.font = '12px Manrope, system-ui, sans-serif'; g.textBaseline = 'alphabetic';
    for (const n of order) {
      const text = label(n); if (!text) continue;
      const rank = rankLabel(n);
      if (selected && rank < 4 && zoom < 2.2) continue;
      if (rank < 2 && zoom < 1.8) continue;
      const p = pos.get(n.id), x = sx(p[0]) + r0 + 5, y = sy(p[1]) + 4;
      if (x > W || y > H + 10 || y < 0) continue;
      const t = text.length > 26 ? `${text.slice(0, 25)}…` : text;
      const w = g.measureText(t).width;
      if (!free(x, y, w) && rank < 5) continue;
      taken.push([x, y - 12, x + w, y + 3]);
      g.lineWidth = 3; g.strokeStyle = 'rgba(6,10,8,.8)'; g.strokeText(t, x, y);
      g.fillStyle = rank >= 4 ? '#fff' : 'rgba(240,246,240,.88)'; g.fillText(t, x, y);
    }
  }

  // ── The idea you tapped ──
  function showInfo(n) {
    if (!n) { info.replaceChildren(h('p', { class: 'muted small' }, 'Tap a point to see the idea and what it links to.')); return; }
    if (n.state === 'upcoming') { info.replaceChildren(h('p', {}, 'A daily card still to come. It is named on its day.')); return; }
    const ls = links.get(n.id).filter((l) => byId.get(l.other)?.state !== 'upcoming');
    const relLine = (l) => {
      const o = byId.get(l.other); const out = l.e.from === n.id; // out: the other one did <relation> to this idea
      const rel = REL_WORDS[l.e.relation] ?? l.e.relation.replace(/_/g, ' ');
      return h('button', { type: 'button', class: 'link map-link', onclick: () => focusOn(o.id, true) },
        out ? `${label(o)} ${rel} this` : `This ${rel} ${label(o)}`);
    };
    info.replaceChildren(
      h('div', { class: `eyebrow field-${n.field}` }, [n.thinker, n.year == null ? null : n.year < 0 ? `${-n.year} BCE` : n.year].filter(Boolean).join(' · ')),
      h('h3', {}, n.title),
      n.line && h('p', { class: 'small' }, n.line),
      n.fuzzy && h('p', { class: 'small map-fuzzy' }, 'This one came back fuzzy in your daily review. Its neighbours here can help it stick.'),
      h('div', { class: 'row', style: 'justify-content:flex-start' },
        h('button', { type: 'button', class: 'btn', onclick: () => onOpen(n) }, n.state === 'today' ? 'Open today\'s card' : 'Open this idea')),
      ls.length ? h('div', { class: 'map-links' }, ls.slice(0, 8).map(relLine)) : null,
    );
  }
  function focusOn(id, center) {
    selected = id; showInfo(byId.get(id));
    if (center) { const p = pos.get(id); const want = Math.max(s, Math.min(W, H) * 2.2); tx = W / 2 - p[0] * want; ty = H / 2 - p[1] * want; s = want; }
    draw();
  }

  // ── Touch, mouse and wheel ──
  const pts = new Map(); let pinch = null, moved = 0, down = null;
  canvas.addEventListener('pointerdown', (e) => { canvas.setPointerCapture(e.pointerId); pts.set(e.pointerId, { x: e.clientX, y: e.clientY }); moved = 0; down = { x: e.clientX, y: e.clientY }; });
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
    const base = Math.min(W, H); const ns = Math.min(base * 12, Math.max(base * .7, s * f)); const k = ns / s;
    tx = mx - (mx - tx) * k; ty = my - (my - ty) * k; s = ns; draw();
  }
  function tap(cx, cy) {
    const r = canvas.getBoundingClientRect(); const x = cx - r.left, y = cy - r.top;
    let best = null, bd = 22;
    for (const n of data.nodes) { const p = pos.get(n.id); const d = Math.hypot(sx(p[0]) - x, sy(p[1]) - y); if (d < bd) { bd = d; best = n; } }
    if (best) focusOn(best.id, false); else { selected = null; showInfo(null); draw(); }
  }

  const ro = new ResizeObserver(() => { const was = W; size(); if (!was) fit(); draw(); });
  ro.observe(canvas);
  renderControls(); showInfo(null);
  return { destroy: () => ro.disconnect() };
}
