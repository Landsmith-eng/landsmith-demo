// Conceptual animations: one quiet, slow motif behind each idea, drawn live on a single full-screen canvas.
// Each motif is the idea's analogy in motion (atoms drifting for Democritus, a river for Heraclitus, a turning wheel
// for Schopenhauer). Ideas without their own get one for their field. Motion stops when the tab is hidden, and
// people who ask their device to reduce motion get a single still frame.

const BY_NODE = {
  democritus_atoms_and_void: 'atoms', epicurus_absence_of_pain: 'garden', lucretius_death_nothing_to_us: 'mirror',
  zeno_live_according_to_nature: 'orbit', epictetus_up_to_us: 'wind', seneca_evening_review: 'lamp',
  buddha_craving_root_of_suffering: 'spiral', marcus_pain_is_your_estimate: 'ripples',
  spinoza_freedom_understanding_necessity: 'rain', schopenhauer_will_source_of_suffering: 'wheel',
  nietzsche_amor_fati: 'ascent', beck_cognitive_therapy_stoicism_tested: 'untangle',
  frankl_mans_search_for_meaning: 'thread', nozick_experience_machine: 'bubbles',
  heraclitus_same_river: 'river', laozi_sufficiency_of_contentment: 'river', zhuangzi_butterfly_dream: 'river',
  plato_cave: 'lamp', socrates_unexamined_life: 'lamp', boethius_wheel_of_fortune: 'wheel',
  copernicus_de_revolutionibus: 'orbit', kepler_harmony: 'orbit', newton_general_scholium: 'orbit',
  galileo_two_books: 'orbit', einstein_spinozas_god: 'orbit', upanishads_tat_tvam_asi: 'ripples',
  gita_act_without_attachment_to_fruits: 'wind', nagarjuna_emptiness: 'bubbles', camus_myth_of_sisyphus: 'ascent',
  dogen_just_sitting: 'garden', patanjali_stilling_the_mind: 'ripples', kabat_zinn_mbsr: 'garden',
  haudenosaunee_seventh_generation: 'garden', kimmerer_braiding_sweetgrass: 'garden', darwin_grandeur_of_life: 'constellation',
};
const BY_FIELD = { philosophy: 'constellation', religion: 'lamp', science: 'orbit', practice: 'garden', law: 'pillars', art: 'ink', culture: 'constellation', now: 'ripples' };

export const motifFor = (node) => (node && (BY_NODE[node.id] ?? BY_FIELD[node.field])) || 'constellation';

const rnd = (a, b) => a + Math.random() * (b - a);
const TAU = Math.PI * 2;

// Each motif: init(s, w, h) sets up state; draw(c, s, w, h, t, ink) paints one frame. `ink(a)` gives the field
// colour at alpha a. Everything is drawn faint: this is wallpaper, not foreground.
const MOTIFS = {
  // Democritus: many small atoms in quick, straight flight through the void; when two meet, a brief flash.
  atoms: {
    init(s, w, h) { s.p = Array.from({ length: Math.round(w * h / 3200) + 40 }, () => { const a = rnd(0, TAU), v = rnd(.5, 1.1); return { x: rnd(0, w), y: rnd(0, h), vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: rnd(1, 2.2) }; }); s.f = []; },
    draw(c, s, w, h, t, ink) {
      for (const a of s.p) {
        a.x += a.vx; a.y += a.vy;
        if (a.x < 0 || a.x > w) a.vx *= -1;
        if (a.y < 0 || a.y > h) a.vy *= -1;
      }
      for (let i = 0; i < s.p.length; i += 3) for (let j = i + 1; j < s.p.length; j += 2) {
        const a = s.p[i], b = s.p[j];
        if (Math.abs(a.x - b.x) < 3 && Math.abs(a.y - b.y) < 3) { s.f.push({ x: a.x, y: a.y, r: 2 }); [a.vx, b.vx] = [b.vx, a.vx]; [a.vy, b.vy] = [b.vy, a.vy]; }
      }
      s.f = s.f.filter((f) => (f.r += .6) < 14);
      for (const f of s.f) { c.strokeStyle = ink(.4 * (1 - f.r / 14)); c.beginPath(); c.arc(f.x, f.y, f.r, 0, TAU); c.stroke(); }
      c.fillStyle = ink(.5);
      for (const a of s.p) { c.beginPath(); c.arc(a.x, a.y, a.r, 0, TAU); c.fill(); }
    },
  },
  constellation: {
    init(s, w, h) { s.p = Array.from({ length: Math.round(w * h / 22000) + 18 }, () => ({ x: rnd(0, w), y: rnd(0, h), vx: rnd(-.08, .08), vy: rnd(-.08, .08), tw: rnd(0, TAU) })); },
    draw(c, s, w, h, t, ink) {
      for (const a of s.p) { a.x = (a.x + a.vx + w) % w; a.y = (a.y + a.vy + h) % h; }
      for (let i = 0; i < s.p.length; i++) for (let j = i + 1; j < s.p.length; j++) {
        const a = s.p[i], b = s.p[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 140) { c.strokeStyle = ink(.16 * (1 - d / 140)); c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke(); }
      }
      for (const a of s.p) { c.fillStyle = ink(.25 + .25 * Math.sin(t / 900 + a.tw)); c.beginPath(); c.arc(a.x, a.y, 2.2, 0, TAU); c.fill(); }
    },
  },
  river: {
    init(s) { s.n = 9; },
    draw(c, s, w, h, t, ink) {
      for (let k = 0; k < s.n; k++) {
        const y0 = h * (.18 + k * .08), amp = 10 + k * 2.5, ph = t / (1600 + k * 120) + k;
        c.strokeStyle = ink(.12 + .03 * (k % 3)); c.lineWidth = 1.4; c.beginPath();
        for (let x = 0; x <= w; x += 8) { const y = y0 + Math.sin(x / 90 + ph) * amp + Math.sin(x / 31 - ph * 1.7) * 3; x ? c.lineTo(x, y) : c.moveTo(x, y); }
        c.stroke();
      }
    },
  },
  rain: {
    init(s, w, h) { s.d = Array.from({ length: 70 }, () => ({ x: rnd(0, w), y: rnd(-h, h), v: rnd(2.4, 4.2), end: rnd(h * .55, h * .95) })); s.r = []; },
    draw(c, s, w, h, t, ink) {
      c.lineWidth = 1;
      for (const d of s.d) {
        d.y += d.v;
        if (d.y > d.end) { s.r.push({ x: d.x, y: d.end, r: 1 }); d.y = rnd(-80, -10); d.x = rnd(0, w); d.end = rnd(h * .55, h * .95); }
        c.strokeStyle = ink(.22); c.beginPath(); c.moveTo(d.x, d.y); c.lineTo(d.x - 1.5, d.y - 12); c.stroke();
      }
      s.r = s.r.filter((r) => (r.r += .5) < 26);
      for (const r of s.r) { c.strokeStyle = ink(.3 * (1 - r.r / 26)); c.beginPath(); c.ellipse(r.x, r.y, r.r, r.r * .32, 0, 0, TAU); c.stroke(); }
    },
  },
  ripples: {
    init(s) { s.r = []; s.next = 0; },
    draw(c, s, w, h, t, ink) {
      if (t > s.next) { s.r.push({ x: rnd(w * .15, w * .85), y: rnd(h * .25, h * .8), r: 0 }); s.next = t + rnd(900, 1800); }
      s.r = s.r.filter((r) => (r.r += .35) < 160);
      c.lineWidth = 1.2;
      for (const r of s.r) for (let k = 0; k < 3; k++) {
        const rr = r.r - k * 18; if (rr <= 0) continue;
        c.strokeStyle = ink(.24 * (1 - r.r / 160)); c.beginPath(); c.ellipse(r.x, r.y, rr, rr * .45, 0, 0, TAU); c.stroke();
      }
    },
  },
  wheel: {
    draw(c, s, w, h, t, ink) {
      const cx = w * .72, cy = h * .62, R = Math.min(w, h) * .42, a0 = t / 9000;
      c.lineWidth = 1.2; c.strokeStyle = ink(.2);
      c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.stroke();
      c.beginPath(); c.arc(cx, cy, R * .18, 0, TAU); c.stroke();
      for (let k = 0; k < 12; k++) { const a = a0 + k * TAU / 12; c.beginPath(); c.moveTo(cx + Math.cos(a) * R * .18, cy + Math.sin(a) * R * .18); c.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R); c.stroke(); }
      for (let k = 0; k < 24; k++) { const a = a0 + k * TAU / 24; c.fillStyle = ink(.3); c.beginPath(); c.arc(cx + Math.cos(a) * R * 1.08, cy + Math.sin(a) * R * 1.08, 2.2, 0, TAU); c.fill(); }
    },
  },
  orbit: {
    init(s) { s.o = Array.from({ length: 6 }, (_, k) => ({ a: rnd(0, TAU), sp: .0006 / (k + 1) ** 1.2, e: .55 + k * .02 })); },
    draw(c, s, w, h, t, ink) {
      const cx = w * .5, cy = h * .55, R = Math.min(w, h) * .09;
      c.fillStyle = ink(.35); c.beginPath(); c.arc(cx, cy, 4, 0, TAU); c.fill();
      s.o.forEach((o, k) => {
        const rx = R * (k + 1.4), ry = rx * o.e; o.a += o.sp * 16;
        c.strokeStyle = ink(.13); c.lineWidth = 1; c.beginPath(); c.ellipse(cx, cy, rx, ry, -.3, 0, TAU); c.stroke();
        const x = cx + Math.cos(o.a) * rx * Math.cos(-.3) - Math.sin(o.a) * ry * Math.sin(-.3);
        const y = cy + Math.cos(o.a) * rx * Math.sin(-.3) + Math.sin(o.a) * ry * Math.cos(-.3);
        c.fillStyle = ink(.42); c.beginPath(); c.arc(x, y, 2.6 + (k % 3), 0, TAU); c.fill();
      });
    },
  },
  lamp: {
    init(s, w, h) { s.m = Array.from({ length: 40 }, () => ({ x: rnd(0, w), y: rnd(0, h), v: rnd(.05, .2) })); },
    draw(c, s, w, h, t, ink) {
      const cx = w * .2, cy = h * .18, R = Math.max(w, h) * .9, pulse = 1 + .04 * Math.sin(t / 1800);
      const g = c.createRadialGradient(cx, cy, 0, cx, cy, R * .55 * pulse);
      g.addColorStop(0, ink(.28)); g.addColorStop(1, ink(0)); c.fillStyle = g; c.fillRect(0, 0, w, h);
      for (let k = 0; k < 5; k++) {
        const a = .35 + k * .17 + .03 * Math.sin(t / 3000 + k);
        c.fillStyle = ink(.05); c.beginPath(); c.moveTo(cx, cy);
        c.lineTo(cx + Math.cos(a - .04) * R, cy + Math.sin(a - .04) * R); c.lineTo(cx + Math.cos(a + .04) * R, cy + Math.sin(a + .04) * R); c.fill();
      }
      for (const m of s.m) { m.y -= m.v; if (m.y < 0) m.y = h; c.fillStyle = ink(.3); c.fillRect(m.x, m.y, 1.6, 1.6); }
    },
  },
  garden: {
    init(s, w, h) { s.p = Array.from({ length: 22 }, () => ({ x: rnd(0, w), y: rnd(0, h), v: rnd(.08, .22), ph: rnd(0, TAU) })); },
    draw(c, s, w, h, t, ink) {
      const breath = .5 + .5 * Math.sin(t / 2600);
      const g = c.createRadialGradient(w * .5, h * .55, 0, w * .5, h * .55, Math.max(w, h) * (.35 + .08 * breath));
      g.addColorStop(0, ink(.2 + .08 * breath)); g.addColorStop(1, ink(0)); c.fillStyle = g; c.fillRect(0, 0, w, h);
      for (const p of s.p) { p.y -= p.v; p.x += Math.sin(t / 1400 + p.ph) * .25; if (p.y < -5) { p.y = h + 5; p.x = rnd(0, w); } c.fillStyle = ink(.35); c.beginPath(); c.arc(p.x, p.y, 1.8, 0, TAU); c.fill(); }
    },
  },
  mirror: {
    init(s, w, h) { s.st = Array.from({ length: 60 }, () => ({ x: rnd(0, w), y: rnd(0, h * .46), tw: rnd(0, TAU) })); },
    draw(c, s, w, h, t, ink) {
      const hy = h * .5;
      c.strokeStyle = ink(.35); c.lineWidth = 1; c.beginPath(); c.moveTo(0, hy); c.lineTo(w, hy); c.stroke();
      for (const st of s.st) {
        const a = .2 + .25 * Math.sin(t / 1100 + st.tw);
        c.fillStyle = ink(a); c.fillRect(st.x, st.y, 2, 2); c.fillRect(st.x, hy + (hy - st.y), 2, 2);
      }
    },
  },
  wind: {
    init(s, w, h) { s.p = Array.from({ length: 60 }, () => ({ x: rnd(0, w), y: rnd(0, h), v: rnd(.6, 1.6), l: rnd(18, 60) })); },
    draw(c, s, w, h, t, ink) {
      c.lineWidth = 1.2;
      for (const p of s.p) {
        p.x += p.v; const dy = Math.sin((p.x + t / 8) / 120) * 6;
        if (p.x - p.l > w) { p.x = -10; p.y = rnd(0, h); }
        c.strokeStyle = ink(.2); c.beginPath(); c.moveTo(p.x - p.l, p.y + dy * .6); c.quadraticCurveTo(p.x - p.l / 2, p.y + dy, p.x, p.y + dy * .8); c.stroke();
      }
    },
  },
  spiral: {
    draw(c, s, w, h, t, ink) {
      const cx = w * .55, cy = h * .55, rot = t / 7000;
      for (let k = 0; k < 220; k++) {
        const a = k * .19 + rot, r = 4 * Math.exp(k * .017);
        if (r > Math.max(w, h)) break;
        c.fillStyle = ink(.32 * (1 - k / 220) + .05); c.beginPath(); c.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 1.8, 0, TAU); c.fill();
      }
    },
  },
  ascent: {
    init(s) { s.p = Array.from({ length: 14 }, (_, k) => ({ u: k / 14 })); },
    draw(c, s, w, h, t, ink) {
      const pt = (u) => [w * (.05 + .9 * u), h * (.92 - .7 * u) + Math.sin(u * 14) * 18];
      c.strokeStyle = ink(.26); c.lineWidth = 1.4; c.beginPath();
      for (let u = 0; u <= 1.001; u += .01) { const [x, y] = pt(u); u ? c.lineTo(x, y) : c.moveTo(x, y); }
      c.stroke();
      for (const p of s.p) { p.u = (p.u + .0007) % 1; const [x, y] = pt(p.u); c.fillStyle = ink(.45); c.beginPath(); c.arc(x, y - 6, 2.4, 0, TAU); c.fill(); }
    },
  },
  untangle: {
    draw(c, s, w, h, t, ink) {
      const calm = .5 + .5 * Math.sin(t / 4000); // tangles, then straightens, then tangles again
      for (let k = 0; k < 4; k++) {
        c.strokeStyle = ink(.18 + .05 * k); c.lineWidth = 1.3; c.beginPath();
        for (let x = 0; x <= w; x += 6) {
          const y = h * (.35 + k * .1) + (1 - calm) * (Math.sin(x / 23 + k + t / 900) * 26 + Math.sin(x / 9 - t / 600) * 10);
          x ? c.lineTo(x, y) : c.moveTo(x, y);
        }
        c.stroke();
      }
    },
  },
  thread: {
    init(s) { s.pts = []; },
    draw(c, s, w, h, t, ink) {
      const x = w * (.5 + .38 * Math.sin(t / 5200)), y = h * (.5 + .32 * Math.sin(t / 3900 + 1));
      s.pts.push([x, y]); if (s.pts.length > 160) s.pts.shift();
      c.strokeStyle = ink(.28); c.lineWidth = 1.4; c.beginPath();
      s.pts.forEach(([px, py], i) => (i ? c.lineTo(px, py) : c.moveTo(px, py))); c.stroke();
      const g = c.createRadialGradient(x, y, 0, x, y, 60); g.addColorStop(0, ink(.4)); g.addColorStop(1, ink(0));
      c.fillStyle = g; c.beginPath(); c.arc(x, y, 60, 0, TAU); c.fill();
    },
  },
  bubbles: {
    init(s, w, h) { s.b = Array.from({ length: 34 }, () => ({ x: rnd(0, w), y: rnd(0, h), r: rnd(3, 14), v: rnd(.15, .5) })); },
    draw(c, s, w, h, t, ink) {
      c.lineWidth = 1.2;
      for (const b of s.b) {
        b.y -= b.v; b.x += Math.sin(t / 1300 + b.r) * .2; if (b.y < -20) { b.y = h + 20; b.x = rnd(0, w); }
        c.strokeStyle = ink(.3); c.beginPath(); c.arc(b.x, b.y, b.r, 0, TAU); c.stroke();
      }
    },
  },
  pillars: {
    draw(c, s, w, h, t, ink) {
      const n = 7, gap = w / n;
      for (let k = 0; k < n; k++) {
        const x = gap * (k + .5);
        c.strokeStyle = ink(.14); c.lineWidth = gap * .28; c.beginPath(); c.moveTo(x, h * .18); c.lineTo(x, h * .95); c.stroke();
        const y = h * (.95 - ((t / 9000 + k / n) % 1) * .77);
        const g = c.createLinearGradient(0, y - 50, 0, y + 50); g.addColorStop(0, ink(0)); g.addColorStop(.5, ink(.18)); g.addColorStop(1, ink(0));
        c.strokeStyle = g; c.beginPath(); c.moveTo(x, y - 50); c.lineTo(x, y + 50); c.stroke();
      }
      c.fillStyle = ink(.14); c.fillRect(w * .02, h * .14, w * .96, 6);
    },
  },
  ink: {
    init(s) { s.b = []; s.next = 0; },
    draw(c, s, w, h, t, ink) {
      if (t > s.next) { s.b.push({ x: rnd(0, w), y: rnd(0, h), r: 2, max: rnd(40, 130) }); s.next = t + rnd(700, 1500); }
      s.b = s.b.filter((b) => (b.r += .25) < b.max);
      for (const b of s.b) { c.fillStyle = ink(.16 * (1 - b.r / b.max)); c.beginPath(); c.arc(b.x, b.y, b.r, 0, TAU); c.fill(); }
    },
  },
};

// One canvas for the whole app. setMotif swaps the motif with a short cross-fade; null hides it.
let canvas, ctx, state = {}, current = null, colour = '120,160,130', raf = 0, started = 0;
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

function size() {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
function frame(now) {
  raf = 0;
  if (!current) return;
  const w = innerWidth, h = innerHeight;
  ctx.clearRect(0, 0, w, h);
  const ink = (a) => `rgba(${colour},${a})`;
  MOTIFS[current].draw(ctx, state, w, h, now - started, ink);
  if (!reduced() && !document.hidden) raf = requestAnimationFrame(frame);
}
function rgbOf(el) {
  const v = getComputedStyle(el).getPropertyValue('--field').trim() || getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
  const m = v.match(/^#([0-9a-f]{6})$/i);
  return m ? [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16)).join(',') : colour;
}

export function setMotif(name, colourFrom = document.documentElement) {
  if (!canvas) {
    canvas = document.getElementById('motif'); if (!canvas) return;
    ctx = canvas.getContext('2d'); size();
    addEventListener('resize', () => { size(); if (current) { state = {}; MOTIFS[current].init?.(state, innerWidth, innerHeight); } });
    document.addEventListener('visibilitychange', () => { if (!document.hidden && current && !raf) raf = requestAnimationFrame(frame); });
  }
  if (!name || !MOTIFS[name]) { current = null; canvas.classList.remove('on'); return; }
  colour = rgbOf(colourFrom);
  const swap = () => {
    current = name; state = {}; started = performance.now();
    MOTIFS[name].init?.(state, innerWidth, innerHeight);
    canvas.classList.add('on');
    if (!raf) raf = requestAnimationFrame(frame);
  };
  if (canvas.classList.contains('on') && current !== name) { canvas.classList.remove('on'); setTimeout(swap, 260); } else swap();
}

// Dim the motif while reading dense panels (the source, an opinion) and bring it up on arrival.
export function motifLevel(level) { if (canvas) canvas.style.setProperty('--level', String(level)); }
export const MOTIF_NAMES = Object.keys(MOTIFS);
