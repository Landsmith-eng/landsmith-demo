// The Map: every idea laid out as a landscape, two ways.
//   influence: drawn by the links on the map (who taught, extended, argued against or tested whom), so ideas close
//              together share a lineage. Time runs gently from left to right.
//   semantic:  drawn by meaning (the words of each idea's plain face, title and prompt, and the themes it belongs
//              to), so ideas close together ask similar questions, even centuries and continents apart.
//   time:      a timeline: each idea at its date, left to right (the centuries near us given more room), in a lane for
//              its tradition (Western philosophy, Asian thought, religion, science, psychology, law, the arts…), so
//              influence reads as arcs forward in time and ideas that arose independently can be seen side by side.
// All are computed once when the server starts, deterministically, and given as 0..1 coordinates.

// A small seeded random number generator, so the map comes out the same every time.
function rng(seed) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

// Force layout: springs along the links, every pair pushing apart, a weak pull to the middle, and an optional
// pull of x toward a target (time, for the influence view).
function force(ids, links, { seed = 7, iterations = 420, xTarget = null, xPull = 0 } = {}) {
  const rand = rng(seed);
  const n = ids.length;
  const index = new Map(ids.map((id, i) => [id, i]));
  const x = ids.map((_, i) => (xTarget ? xTarget[i] : rand()) * 2 - 1 + (rand() - .5) * .2);
  const y = ids.map(() => rand() * 2 - 1);
  const springs = links.map((l) => [index.get(l.a), index.get(l.b), l.w ?? 1]).filter(([a, b]) => a != null && b != null && a !== b);
  const k = Math.sqrt(4 / n); // ideal distance
  for (let it = 0; it < iterations; it++) {
    const t = .1 * (1 - it / iterations) + .004; // cooling
    const dx = new Float64Array(n), dy = new Float64Array(n);
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      let ex = x[i] - x[j], ey = y[i] - y[j];
      let d2 = ex * ex + ey * ey;
      if (d2 < 1e-6) { ex = (rand() - .5) * 1e-3; ey = (rand() - .5) * 1e-3; d2 = 1e-6; }
      const f = (k * k) / d2;
      dx[i] += ex * f; dy[i] += ey * f; dx[j] -= ex * f; dy[j] -= ey * f;
    }
    for (const [a, b, w] of springs) {
      const ex = x[a] - x[b], ey = y[a] - y[b];
      const d = Math.sqrt(ex * ex + ey * ey) || 1e-3;
      const f = (d / k) * w;
      dx[a] -= ex * f; dy[a] -= ey * f; dx[b] += ex * f; dy[b] += ey * f;
    }
    for (let i = 0; i < n; i++) {
      dx[i] -= x[i] * .6; dy[i] -= y[i] * .6; // gravity
      if (xTarget) dx[i] += ((xTarget[i] * 2 - 1) - x[i]) * xPull;
      const d = Math.sqrt(dx[i] * dx[i] + dy[i] * dy[i]) || 1;
      const step = Math.min(d, t);
      x[i] += (dx[i] / d) * step; y[i] += (dy[i] / d) * step;
    }
  }
  // Fit to 0..1 with a small margin, keeping the aspect ratio of the result.
  const minX = Math.min(...x), maxX = Math.max(...x), minY = Math.min(...y), maxY = Math.max(...y);
  const span = Math.max(maxX - minX, maxY - minY) || 1;
  const ox = (span - (maxX - minX)) / 2, oy = (span - (maxY - minY)) / 2;
  return Object.fromEntries(ids.map((id, i) => [id, [
    +(.04 + .92 * (x[i] - minX + ox) / span).toFixed(4),
    +(.04 + .92 * (y[i] - minY + oy) / span).toFixed(4),
  ]]));
}

const STOP = new Set(('a an and are as at be been but by can could did do does for from had has have he her his how i if in into ' +
  'is it its itself just may me more most must my no not of on one only or our out own she should so some such than that the their ' +
  'them then there these they this those through to too up us very was we were what when where which while who whom why will with ' +
  'would you your yours about after again against all also any because before being between both each few further here once other ' +
  'over same under until upon whether every even ever never always still yet thing things something way ways day days').split(' '));
const words = (text) => (text ?? '').toLowerCase().normalize('NFKD').replace(/[^a-z\s]/g, ' ').split(/\s+/)
  .filter((w) => w.length > 2 && !STOP.has(w)).map((w) => w.replace(/(ies)$/, 'y').replace(/(?<=[a-z]{3})(es|s)$/, ''));

// Similarity of meaning: TF-IDF over each idea's words, plus its themes as strong shared features.
function semanticLinks(nodes, themes, perNode = 5) {
  const themeOf = new Map();
  for (const t of themes) for (const id of t.nodes) themeOf.set(id, [...(themeOf.get(id) ?? []), t.id]);
  const docs = nodes.map((n) => {
    const tf = new Map();
    for (const w of words(`${n.title} ${n.title} ${n.plain_face} ${n.prompt ?? ''}`)) tf.set(w, (tf.get(w) ?? 0) + 1);
    for (const t of themeOf.get(n.id) ?? []) tf.set(`#${t}`, 3);
    return tf;
  });
  const df = new Map();
  for (const d of docs) for (const w of d.keys()) df.set(w, (df.get(w) ?? 0) + 1);
  const vecs = docs.map((d) => {
    const v = new Map(); let norm = 0;
    for (const [w, c] of d) { if (df.get(w) < 2) continue; const x = (1 + Math.log(c)) * Math.log(nodes.length / df.get(w)); v.set(w, x); norm += x * x; }
    norm = Math.sqrt(norm) || 1; for (const [w, x] of v) v.set(w, x / norm);
    return v;
  });
  const cos = (a, b) => { let s = 0; for (const [w, x] of a) { const y = b.get(w); if (y) s += x * y; } return s; };
  const links = []; const seen = new Set();
  for (let i = 0; i < nodes.length; i++) {
    const sims = [];
    for (let j = 0; j < nodes.length; j++) if (j !== i) sims.push([j, cos(vecs[i], vecs[j])]);
    sims.sort((p, q) => q[1] - p[1]);
    for (const [j, s] of sims.slice(0, perNode)) {
      const key = i < j ? `${i}:${j}` : `${j}:${i}`;
      if (s <= 0 || seen.has(key)) continue;
      seen.add(key); links.push({ a: nodes[i].id, b: nodes[j].id, w: .4 + s * 2 });
    }
  }
  return links;
}

// The six eras the Map can be coloured by.
export const ERAS = [
  { id: 'ancient', name: 'Ancient', until: 500 },
  { id: 'medieval', name: 'Medieval', until: 1500 },
  { id: 'early_modern', name: 'Early modern', until: 1800 },
  { id: 'c19', name: '1800s', until: 1900 },
  { id: 'c20', name: '1900s', until: 2000 },
  { id: 'now', name: 'Our century', until: Infinity },
];
export const eraOf = (year) => (year == null ? null : ERAS.find((e) => year < e.until).id);

// nodes: every idea except practices (they are not on the walls). edges: { from_id, to_id, relation }.
export function computeLayouts(nodes, edges, themes) {
  const ids = nodes.map((n) => n.id);
  const known = new Set(ids);
  const influenceLinks = edges.filter((e) => known.has(e.from_id) && known.has(e.to_id))
    .map((e) => ({ a: e.from_id, b: e.to_id, w: 1 }));
  // Rank by year, so time runs left to right without the gaps of the calendar (most ideas are recent).
  const years = nodes.map((n) => n.year ?? 2000);
  const order = [...years].sort((p, q) => p - q);
  const rank = years.map((y) => order.indexOf(y) / Math.max(1, order.length - 1));
  return {
    influence: force(ids, influenceLinks, { seed: 11, xTarget: rank, xPull: .35 }),
    semantic: force(ids, semanticLinks(nodes, themes), { seed: 5 }),
    time: timeLayout(nodes),
  };
}

// The timeline's lanes, top to bottom, and which lane an idea belongs in.
export const LANES = [
  { id: 'western', name: 'Western philosophy' },
  { id: 'asian', name: 'Asian thought' },
  { id: 'world', name: 'Africa, the Americas, the Near East' },
  { id: 'religion', name: 'Religion' },
  { id: 'science', name: 'Science' },
  { id: 'mind', name: 'Psychology' },
  { id: 'law', name: 'Law and society' },
  { id: 'arts', name: 'The arts' },
];
export function laneOf(n) {
  if (n.room === 'mind') return 'mind';
  if (n.field === 'science') return 'science';
  if (n.field === 'religion') return 'religion';
  if (n.field === 'law' || n.field === 'now') return 'law';
  if (n.field === 'art' || n.field === 'culture') return 'arts';
  if (n.room === 'east_asia' || n.room === 'india') return 'asian';
  if (n.room === 'africa' || n.room === 'americas' || n.room === 'near_east') return 'world';
  return 'western';
}
// Years to 0..1 across: by distance back from the present on a log scale, so recent centuries, where most ideas are,
// get room, and the ancient world still fits. The ticks for the axis come with it.
const NOW = 2100;
export const timeX = (year) => 1 - Math.log(Math.max(70, NOW - (year ?? 2000)) / 70) / Math.log(4700 / 70);
export const TIME_TICKS = [-2000, -500, 0, 500, 1000, 1500, 1700, 1800, 1900, 1950, 2000].map((y) => ({ year: y, x: +(.03 + .94 * timeX(y)).toFixed(4) }));
function timeLayout(nodes) {
  const out = {};
  for (const [li, lane] of LANES.entries()) {
    const mine = nodes.filter((n) => laneOf(n) === lane.id).map((n) => ({ id: n.id, x: .03 + .94 * timeX(n.year) })).sort((a, b) => a.x - b.x);
    // Within a lane, ideas close in time take turns on a few rows, so their names do not sit on each other.
    const rows = 4; const lastX = Array(rows).fill(-1);
    for (const m of mine) {
      let r = lastX.findIndex((x) => m.x - x > .022); if (r < 0) r = lastX.indexOf(Math.min(...lastX));
      lastX[r] = m.x;
      const top = .05 + (li / LANES.length) * .9; const h = .9 / LANES.length;
      out[m.id] = [+m.x.toFixed(4), +(top + h * (.18 + .64 * (r / (rows - 1)))).toFixed(4)];
    }
  }
  return out;
}
