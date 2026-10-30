// Small visitors on the pictures, chosen to fit what each painting holds (see scenes.js): birds passing over or
// landing, a dragonfly crossing, bees, butterflies and a hummingbird at the flowers, leaves on the wind, a caterpillar,
// an inchworm on a dark trunk, a spider in the branches, a small frog at a pond; on the water, a school of fish
// glimpsed beneath the surface, a sailboat among the painted ones, ducks, an egret, sandpipers at the edge, ripples; light through a window, writing on a page,
// equations on a board. They are faint, see-through shapes blended into the painting (shadows on a light picture, a
// soft light on a dark one), behind the words, never in the way of a tap: one at a time, now and then, a little more
// often while the reader sits still. None while the phone asks to reduce motion, the tab is hidden, or the map fills
// the screen.
import { SCENES, DEFAULT_SCENE } from '/scenes.js';

const NS = 'http://www.w3.org/2000/svg';
const INK = 'rgba(16, 20, 18, .78)';
const rnd = (a, b) => a + Math.random() * (b - a);
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const busy = () => document.hidden || document.documentElement.matches('.map-full') || document.querySelector('.tour, .intro');

// Two layers: shadows (blended into the painting) and light things (an egret, white sails) laid softly on top.
let layer = null; let lightLayer = null; let timer = 0; let active = null; let lastTouch = performance.now();
function svg(viewBox, w, inner) {
  const s = document.createElementNS(NS, 'svg');
  s.setAttribute('viewBox', viewBox); s.setAttribute('width', w); s.setAttribute('aria-hidden', 'true');
  s.innerHTML = inner;
  return s;
}
const dockTop = () => (document.querySelector('.dock')?.getBoundingClientRect().top ?? innerHeight) - 1;
const wait = (ms, run) => new Promise((r) => { const t = setTimeout(r, ms); run.cancel.push(() => { clearTimeout(t); r(); }); });
const frames = (run, fn) => new Promise((resolve) => {
  const t0 = performance.now();
  const step = (t) => { if (run.stopped) return resolve(); if (fn(t - t0) === false) return resolve(); run.raf = requestAnimationFrame(step); };
  run.raf = requestAnimationFrame(step);
});
const fadeOut = async (el, run, ms = 2500) => { el.style.transition = `opacity ${ms}ms ease`; el.classList.add('gone'); await wait(ms, run); };

// ── The scene: what the picture behind holds, and where its water is on the screen ──
function scene() {
  const img = document.querySelector('#wallpaper.on img');
  const key = (img?.getAttribute('src') ?? '').replace(/^\/img\//, '').replace(/\.\w+$/, '');
  const s = SCENES[key] ?? DEFAULT_SCENE;
  return { ...s, has: (k) => s.k.split(' ').includes(k), img };
}
// A height in the picture (0 top, 1 bottom) as a height on the screen; the picture covers the screen, centred.
function imgY(f, sc) {
  const r = sc.img?.naturalWidth ? sc.img.naturalWidth / sc.img.naturalHeight : 2 / 3;
  const W = innerWidth, H = innerHeight;
  if (W / H <= r) return f * H;
  const h = W / r; return (H - h) / 2 + f * h;
}
// A part of the picture [x0, y0, x1, y1] as a rectangle on the screen.
function rectOf(r, sc) {
  const img = sc.img; const iw = img?.naturalWidth || 2, ih = img?.naturalHeight || 3;
  const W = innerWidth, H = innerHeight; const k = Math.max(W / iw, H / ih); const dw = iw * k, dh = ih * k;
  const ox = (W - dw) / 2, oy = (H - dh) / 2;
  return { x: ox + r[0] * dw, y: oy + r[1] * dh, w: (r[2] - r[0]) * dw, h: (r[3] - r[1]) * dh };
}
const noise = () => { const w = [1, 2.3, 4.1].map((m) => ({ f: m * (0.0004 + Math.random() * 0.0004), p: Math.random() * 6.28 })); return (t) => (Math.sin(t * w[0].f + w[0].p) + .5 * Math.sin(t * w[1].f + w[1].p) + .25 * Math.sin(t * w[2].f + w[2].p)) / 1.75; };
// The water's band on the screen, kept above the menu.
function waterBand(sc, from = 0, to = 1) {
  const [a, b] = sc.water; const top = imgY(a + (b - a) * from, sc); const bottom = Math.min(imgY(a + (b - a) * to, sc), dockTop() - 12);
  return bottom > top + 8 ? [top, bottom] : null;
}

// ── A bird: flies in on a curve, lands on the top edge of the menu, pecks, hops, and flies off. ──
async function bird(run, sc) {
  if (!groundBelow(sc)) return flyOver(run); // water at the bottom of the picture: no landing there
  const el = svg('0 0 60 40', 50, `
    <g class="bird">
      <path d="M19 23 L7 18.5 L8.5 27.5Z" fill="${INK}"/>
      <ellipse cx="30" cy="24" rx="12.5" ry="6.6" fill="${INK}"/>
      <g class="head"><circle cx="42" cy="19" r="5.2" fill="${INK}"/><path d="M46.5 17.6 L53 19.6 L46.5 21.4Z" fill="${INK}"/></g>
      <path class="wing far" d="M27 20 C27 9 33 2 38 -3 C37 7 35 14 33 21Z" fill="rgba(40,46,42,.6)"/>
      <path class="wing" d="M23 21 C25 4 35 -4 44 -7 C38 6 36 15 35 22Z" fill="${INK}"/>
      <path class="folded" d="M21 22 C28 17.5 36 18.5 38.5 23 C32 26.5 26 26.5 21 22Z" fill="rgba(40,46,42,.9)"/>
      <path class="feet" d="M28 30 L27 37 M33 30 L33.5 37" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/>
    </g>`);
  el.classList.add('creature', 'flier', 'flying');
  const right = Math.random() < .5; // flying toward the right
  if (!right) el.style.setProperty('--flip', '-1');
  layer.append(el);
  const W = innerWidth; const land = { x: rnd(W * .2, W * .75), y: dockTop() - 50 * 37 / 60 }; // feet on the menu's edge
  const start = { x: right ? -60 : W + 20, y: rnd(innerHeight * .05, innerHeight * .3) };
  const ctrl = { x: (start.x + land.x) / 2, y: Math.min(start.y, land.y) - rnd(0, 60) };
  const place = (x, y, tilt = 0) => { el.style.transform = `translate(${x}px, ${y}px) rotate(${tilt}deg)`; };
  const curve = (a, c, b, ms, ease) => frames(run, (t) => {
    const k = Math.min(1, t / ms); const e = ease(k);
    const x = (1 - e) ** 2 * a.x + 2 * (1 - e) * e * c.x + e * e * b.x;
    const y = (1 - e) ** 2 * a.y + 2 * (1 - e) * e * c.y + e * e * b.y;
    place(x, y, (1 - k) * (right ? 8 : -8)); return k < 1;
  });
  await curve(start, ctrl, land, rnd(3800, 5200), (k) => 1 - (1 - k) ** 2.2); // slowing to land
  el.classList.replace('flying', 'perched'); place(land.x, land.y);
  // Bird things: pecking, looking about, a hop, a shake of the feathers.
  for (let i = 0; i < 3 + Math.round(rnd(0, 3)); i++) {
    await wait(rnd(600, 1500), run);
    const what = Math.random();
    if (what < .5) { el.classList.add('peck'); await wait(260, run); el.classList.remove('peck'); }
    else if (what < .75) { el.classList.add('look'); await wait(rnd(700, 1400), run); el.classList.remove('look'); }
    else if (what < .9) { land.x += right ? 12 : -12; el.classList.add('hop'); place(land.x, land.y); await wait(320, run); el.classList.remove('hop'); }
    else { el.classList.add('ruffle'); await wait(500, run); el.classList.remove('ruffle'); }
  }
  await wait(rnd(900, 2000), run);
  el.classList.replace('perched', 'flying');
  const away = { x: right ? W + 60 : -80, y: rnd(-80, innerHeight * .15) };
  await curve(land, { x: land.x + (right ? 60 : -60), y: land.y - 40 }, away, rnd(2600, 3400), (k) => k * k);
  el.remove();
}

// Where the bottom of the picture (the top of the menu) is ground, not water: only there may anything walk or land.
const groundBelow = (sc) => !(sc.water && sc.water[1] >= .9);
// A bird crossing over the water without landing: in on one side, off the other, a gentle rise and fall.
async function flyOver(run) {
  const el = svg('0 0 60 40', 40, `<g class="bird"><path d="M19 23 L7 18.5 L8.5 27.5Z" fill="${INK}"/><ellipse cx="30" cy="24" rx="12.5" ry="6.6" fill="${INK}"/>
    <g class="head"><circle cx="42" cy="19" r="5.2" fill="${INK}"/><path d="M46.5 17.6 L53 19.6 L46.5 21.4Z" fill="${INK}"/></g>
    <path class="wing far" d="M27 20 C27 9 33 2 38 -3 C37 7 35 14 33 21Z" fill="rgba(40,46,42,.6)"/><path class="wing" d="M23 21 C25 4 35 -4 44 -7 C38 6 36 15 35 22Z" fill="${INK}"/></g>`);
  el.classList.add('creature', 'flier', 'flying'); const right = Math.random() < .5; if (!right) el.style.setProperty('--flip', '-1');
  layer.append(el);
  const W = innerWidth, H = innerHeight; const y0 = rnd(H * .12, H * .5); const amp = rnd(15, 45); const span = W + 140; const speed = rnd(.06, .09);
  await frames(run, (t) => { const d = t * speed; const x = right ? -70 + d : W + 70 - d; el.style.transform = `translate(${x}px, ${y0 + Math.sin(d / 120) * amp - d * .05}px)`; return d < span; });
  el.remove();
}

// ── Birds passing over: a loose line of four to eight, high in the sky, wings beating out of step. ──
async function flock(run) {
  const W = innerWidth, H = innerHeight; const n = Math.round(rnd(4, 8)); const right = Math.random() < .5;
  const box = document.createElement('div'); box.className = 'creature flock'; layer.append(box);
  const birds = Array.from({ length: n }, (_, i) => {
    const s = svg('0 0 20 10', rnd(11, 16), `<path class="w" d="M1 6 Q5 1 10 6 Q15 1 19 6" fill="none" stroke="${INK}" stroke-width="1.7" stroke-linecap="round"/>`);
    s.style.setProperty('--d', `${-rnd(0, .4)}s`); box.append(s);
    return { s, dx: -i * rnd(16, 26), dy: (i % 2 ? 1 : -1) * Math.ceil(i / 2) * rnd(7, 12) + rnd(-4, 4), ph: rnd(0, 6) };
  });
  const y0 = rnd(H * .06, H * .3); const speed = rnd(.035, .055); const span = W + 260;
  await frames(run, (t) => {
    const lead = t * speed;
    for (const b of birds) {
      const x = right ? -60 + lead + b.dx : W + 60 - lead - b.dx;
      const y = y0 + b.dy + Math.sin(t / 1300 + b.ph) * 4 + lead * .04;
      b.s.style.transform = `translate(${x}px, ${y}px)`;
    }
    return lead < span + 200;
  });
  box.remove();
}

// ── The dragonfly: crosses the screen on one easy course, drifting a little, now and then pausing to hover. ──
async function dragonfly(run) {
  const wing = (cx, cy, rot) => `<ellipse class="dw" cx="${cx}" cy="${cy}" rx="10.5" ry="3" transform="rotate(${rot} ${cx} ${cy})" fill="rgba(235,245,255,.42)" stroke="rgba(16,20,18,.55)" stroke-width=".6"/>`;
  const el = svg('0 0 50 50', 44, `
    <g class="dragon">
      ${wing(15, 17, -8)}${wing(35, 17, 8)}${wing(15.5, 23, 10)}${wing(34.5, 23, -10)}
      <line x1="25" y1="11" x2="25" y2="45" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>
      <ellipse cx="25" cy="17" rx="3.2" ry="5" fill="${INK}"/>
      <circle cx="25" cy="9" r="3.4" fill="${INK}"/>
    </g>`);
  el.classList.add('creature', 'darter');
  layer.append(el);
  const W = innerWidth, H = innerHeight; const right = Math.random() < .5;
  let x = right ? -50 : W + 10; const y0 = rnd(H * .15, H * .5); const slope = rnd(-.12, .12); const drift = noise();
  const speed = rnd(.6, 1.1); let hover = 0; let travelled = 0;
  await frames(run, (t) => {
    if (hover > 0) { hover--; } else { if (Math.random() < .004) hover = Math.round(rnd(40, 110)); x += right ? speed : -speed; travelled += speed; }
    const y = y0 + travelled * slope + drift(t) * 18;
    el.style.transform = `translate(${x - 20}px, ${y - 20}px) rotate(${right ? 90 : -90}deg)`;
    return right ? x < W + 50 : x > -50;
  });
  el.remove();
}

// ── A school of fish, under the surface: it never comes in from the edge (so never over land), but rises into view
// somewhere in the water, keeps within it (below the surface line, clear of the banks, turning back before an edge),
// and sinks out of sight again. As the fish move they fade in and out, as through clearer and murkier water. ──
async function school(run, sc) {
  const W = innerWidth, H = innerHeight;
  const band = waterBand(sc, .18, .96); if (!band || band[1] - band[0] < H * .1) return;
  const xs = sc.waterX ? rectOf([sc.waterX[0], 0, sc.waterX[1], 0], sc) : { x: 0, w: W };
  const left = Math.max(12, xs.x + 24), right = Math.min(W - 12, xs.x + xs.w - 24); if (right - left < 140) return;
  const dpr = Math.min(devicePixelRatio || 1, 2);
  const cv = document.createElement('canvas'); cv.className = 'creature school';
  cv.width = W * dpr; cv.height = H * dpr; cv.style.width = `${W}px`; cv.style.height = `${H}px`;
  layer.append(cv);
  const g = cv.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0);
  const depthH = band[1] - band[0]; const n = Math.round(rnd(10, 20));
  const fishes = Array.from({ length: n }, () => ({ dx: rnd(-75, 60), dy: rnd(-.28, .28) * depthH, len: rnd(9, 15), ph: rnd(0, 6.28), sp: rnd(.8, 1.3) }));
  let cx = rnd(left + 90, Math.max(left + 91, right - 90)); const cy = band[0] + depthH * rnd(.4, .6);
  let vx = (Math.random() < .5 ? -1 : 1) * rnd(.018, .032); const dur = rnd(16000, 24000); let last = 0;
  const edgeFade = (v, a, b, m) => Math.max(0, Math.min(1, (v - a) / m, (b - v) / m));
  await frames(run, (t) => {
    const dt = Math.min(50, t - last); last = t;
    // Turn back well before the edge of the water.
    if ((cx > right - 100 && vx > 0) || (cx < left + 100 && vx < 0)) vx -= Math.sign(vx) * .00008 * dt; else vx = Math.sign(vx) * Math.min(.032, Math.abs(vx) + .00002 * dt);
    cx += vx * dt;
    const env = Math.min(1, t / 3500, (dur - t) / 3500);
    g.clearRect(0, 0, W, H); g.filter = 'blur(.7px)';
    const dir = vx >= 0 ? 1 : -1;
    for (const f of fishes) {
      const x = cx + dir * f.dx + Math.sin(t / 900 * f.sp + f.ph) * 5;
      const y = Math.max(band[0] + 6, Math.min(band[1] - 6, cy + f.dy + Math.sin(x / 150 + t / 2600) * depthH * .12 + Math.cos(t / 700 * f.sp + f.ph) * 2));
      // Clear and murky water drifting: each fish shows only where the water lets it.
      const murk = .5 + .6 * Math.sin(x / 85 + t / 1600 + f.ph * .3) * Math.cos(y / 38 - t / 2200);
      const a = env * Math.max(0, Math.min(1, murk)) * edgeFade(y, band[0], band[1], 14) * edgeFade(x, left, right, 30);
      if (a < .02) continue;
      const wag = Math.sin(t / 120 * f.sp + f.ph) * .45; const L = f.len;
      g.save(); g.translate(x, y); g.scale(dir, 1); g.globalAlpha = a; g.fillStyle = 'rgba(16,24,26,1)';
      g.beginPath(); g.ellipse(0, 0, L / 2, L / 6.5, 0, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.moveTo(-L / 2 + 1, 0); g.lineTo(-L / 2 - L * .32, -L * .2 + wag * 3); g.lineTo(-L / 2 - L * .32, L * .2 + wag * 3); g.closePath(); g.fill();
      g.restore();
    }
    return t < dur;
  });
  cv.remove();
}

// ── A sailboat: crosses the water slowly near the horizon, heeling a little; nearer boats are larger. ──
async function sailboat(run, sc) {
  const band = waterBand(sc, 0, 1); if (!band) return;
  // Perspective from the painted boats: a visitor sails among them, as tall as a painted boat at the same distance
  // (between the nearest and farthest, by how far down the water it sits); with one painted boat, a little beyond it.
  const boats = (sc.live ?? []).filter((x) => x.m === 'bob' && !x.soft).map((x) => { const r = rectOf(x.r, sc); return { yb: r.y + r.h * .92, h: r.h * .72 }; }).sort((a, b) => a.yb - b.yb);
  let yb, h;
  if (boats.length > 1 && boats.at(-1).yb - boats[0].yb > 6) {
    const lo = boats[0], hi = boats.at(-1);
    yb = rnd(lo.yb - (hi.yb - lo.yb) * .25, hi.yb);
    h = Math.max(6, lo.h + (hi.h - lo.h) * (yb - lo.yb) / (hi.yb - lo.yb));
  } else if (boats.length) { yb = boats[0].yb - rnd(4, 18); h = boats[0].h * rnd(.4, .75); }
  else { const depth = rnd(.02, .28); yb = band[0] + (band[1] - band[0]) * depth; h = (15 + 40 * depth) * 44 / 40; }
  yb = Math.max(band[0] + 3, yb);
  const w = h * 40 / 44;
  const el = svg('0 0 40 44', w, `<g class="boat">
    <path d="M21 4 L21 33 L35 32Z" fill="rgba(252,250,242,.95)"/><path d="M19 8 L19 33 L7 32Z" fill="rgba(240,238,228,.85)"/>
    <line x1="20" y1="3" x2="20" y2="34" stroke="rgba(50,48,44,.8)" stroke-width="1"/>
    <path d="M3 34 L37 34 L32 40 L8 40Z" fill="rgba(46,48,50,.85)"/></g>`);
  el.classList.add('creature', 'sail'); const right = Math.random() < .5; if (!right) el.style.setProperty('--flip', '-1');
  lightLayer.append(el);
  const W = innerWidth; const speed = rnd(.006, .011) * Math.max(.35, h / 40); const from = right ? -w : W; const dist = W + w; // nearer boats cross faster
  const y = yb - h * 38 / 44;
  await frames(run, (t) => {
    const d = t * speed; const x = right ? from + d : from - d;
    el.style.transform = `translate(${x}px, ${y + Math.sin(t / 1100) * .7}px) rotate(${Math.sin(t / 1500) * 1.8}deg)`;
    return d < dist;
  });
  el.remove();
}

// ── Ducks: one to three, paddling across the water in a line, bobbing; now and then one tips up to feed. ──
async function ducks(run, sc) {
  const band = waterBand(sc, .15, .85); if (!band) return;
  const W = innerWidth; const n = Math.round(rnd(1, 3)); const right = Math.random() < .5;
  const y = rnd(band[0], band[1]); const size = 22 + 12 * ((y - band[0]) / Math.max(1, band[1] - band[0]));
  const flock = Array.from({ length: n }, (_, i) => {
    const el = svg('0 0 40 26', size * (i ? rnd(.85, 1) : 1), `<g class="duck">
      <path d="M5 15 C5 10 12 9 20 10 L27 10 C26 6 29 3 32 3 C35 3 37 5 36 8 L40 9 L36 10 C35 12 33 13 31 14 C31 18 27 21 20 21 L11 21 C7 21 5 18 5 15Z" fill="${INK}"/>
      <path d="M1 22 Q20 25 39 22" fill="none" stroke="${INK}" stroke-width=".8" opacity=".5"/></g>`);
    el.classList.add('creature', 'paddler'); if (!right) el.style.setProperty('--flip', '-1'); el.style.setProperty('--d', `${-rnd(0, 1.6)}s`);
    layer.append(el); return { el, gap: i * size * rnd(1.1, 1.6), dy: rnd(-4, 4) };
  });
  const speed = rnd(.007, .012); const from = right ? -size : W; const dist = W + size + flock.at(-1).gap + 10;
  let nextDip = rnd(3000, 7000);
  await frames(run, (t) => {
    const d = t * speed;
    for (const f of flock) f.el.style.transform = `translate(${right ? from + d - f.gap : from - d + f.gap}px, ${y + f.dy - size * .6}px)`;
    if (t > nextDip) { const f = flock[Math.floor(Math.random() * n)]; f.el.classList.add('dip'); setTimeout(() => f.el.classList.remove('dip'), 1600); nextDip = t + rnd(4000, 9000); }
    return d < dist;
  });
  flock.forEach((f) => f.el.remove());
}

// ── An egret: appears standing in the shallows, wades a few slow steps, strikes at a fish, and fades away. ──
async function egret(run, sc) {
  const band = waterBand(sc, .35, 1); if (!band) return;
  const W = innerWidth; const feet = sc.shore ? Math.min(imgY(sc.shore, sc), dockTop() - 14) : rnd(band[0], band[1]);
  const w = 38; const h = w * 60 / 40;
  const el = svg('0 0 40 60', w, `<g class="egret">
    <path d="M18 32 L17 56 M22 32 L24 56" stroke="rgba(70,70,64,.85)" stroke-width="1.3"/>
    <path d="M8 28 C10 22 18 20 25 23 C28 25 27 30 22 32 C17 34 11 33 8 28Z" fill="#fbfaf4"/>
    <path d="M8 28 L1 32 L9 30.5Z" fill="#f2f0e6"/>
    <g class="neck"><path d="M24 24 C30 19 24 13 28 8" stroke="#fbfaf4" stroke-width="3.2" fill="none" stroke-linecap="round"/>
      <circle cx="28.5" cy="7.5" r="2.6" fill="#fbfaf4"/><path d="M30.5 6.8 L38.5 8.6 L30.5 9Z" fill="#d6ad35"/></g></g>`);
  el.classList.add('creature', 'wader', 'gone'); const right = Math.random() < .5; if (!right) el.style.setProperty('--flip', '-1');
  lightLayer.append(el);
  let x = rnd(W * .12, W * .8); const y = feet - h * 56 / 60;
  const place = () => { el.style.transform = `translate(${x}px, ${y}px)`; }; place();
  await wait(50, run); el.style.transition = 'opacity 2.5s ease'; el.classList.remove('gone'); await wait(2500, run);
  for (let i = 0; i < 4 + Math.round(rnd(0, 3)); i++) {
    const r = Math.random();
    if (r < .55) { const step = rnd(5, 9) * (right ? 1 : -1); const x0 = x; await frames(run, (t) => { const k = Math.min(1, t / 900); x = x0 + step * k; place(); return k < 1; }); }
    else if (r < .8) { el.classList.add('strike'); await wait(450, run); el.classList.remove('strike'); }
    await wait(rnd(1400, 3500), run);
  }
  await fadeOut(el, run); el.remove();
}

// ── Sandpipers: a few small birds at the water's edge, running in quick bursts, stopping to probe, running on. ──
async function sandpipers(run, sc) {
  if (!sc.shore) return;
  const W = innerWidth; const y = Math.min(imgY(sc.shore, sc), dockTop() - 10); const n = Math.round(rnd(3, 5));
  const birds = Array.from({ length: n }, () => {
    const el = svg('0 0 22 16', rnd(15, 19), `<g class="piper">
      <path d="M4 8 L0.5 7 L4 9.6Z" fill="${INK}"/><ellipse cx="10" cy="8" rx="6.2" ry="3.6" fill="${INK}"/>
      <circle cx="15.6" cy="5.8" r="2.3" fill="${INK}"/><path d="M17.4 6 L21.6 7.6" stroke="${INK}" stroke-width=".9"/>
      <path class="legs" d="M9 11 L8.4 15.5 M11 11 L11.6 15.5" stroke="${INK}" stroke-width=".8"/></g>`);
    el.classList.add('creature', 'piper-el'); layer.append(el);
    return { el, x: 0, dy: rnd(-4, 4), off: rnd(-50, 50) };
  });
  let gx = Math.random() < .5 ? -30 : W + 10; const towards = gx < 0 ? 1 : -1;
  const draw = () => birds.forEach((b) => { b.el.style.transform = `translate(${gx + b.off + b.x}px, ${y + b.dy - 14}px)`; });
  const run1 = async (dx, ms) => {
    birds.forEach((b) => { b.el.classList.add('running'); b.el.style.setProperty('--flip', dx < 0 ? '-1' : '1'); });
    const g0 = gx; await frames(run, (t) => { const k = Math.min(1, t / ms); gx = g0 + dx * k; birds.forEach((b, i) => { b.x = Math.sin(t / 90 + i) * 2; }); draw(); return k < 1; });
    birds.forEach((b) => b.el.classList.remove('running'));
  };
  await run1(towards * rnd(W * .3, W * .5), 2600);
  for (let i = 0; i < 4 + Math.round(rnd(0, 3)); i++) {
    for (let p = 0; p < 3; p++) { const b = birds[Math.floor(Math.random() * n)]; b.el.classList.add('peck'); await wait(rnd(250, 500), run); b.el.classList.remove('peck'); }
    await wait(rnd(500, 1400), run);
    await run1((Math.random() < .35 ? -1 : 1) * towards * rnd(30, 80), rnd(700, 1100)); // back from a wave, or on along the sand
  }
  await run1(towards * (W + 120), 5500);
  birds.forEach((b) => b.el.remove());
}

// ── A caterpillar: crawls along the top edge of the menu, the ripple running down its body, then fades. ──
async function caterpillar(run) {
  const n = 9; const r = 3.4; const gap = 5.2;
  const el = svg('0 0 64 18', 64, `<g class="cater">${Array.from({ length: n }, (_, i) => `<circle cx="${6 + i * gap}" cy="12" r="${i === n - 1 ? r + .8 : r}" fill="${INK}"/>`).join('')}
    <path class="ant" d="M${6 + (n - 1) * gap + 1} 8 L${6 + (n - 1) * gap + 4} 3 M${6 + (n - 1) * gap - 1} 8 L${6 + (n - 1) * gap} 2.5" stroke="${INK}" stroke-width=".8"/></g>`);
  el.classList.add('creature', 'crawler', 'gone'); const right = Math.random() < .5; if (!right) el.style.setProperty('--flip', '-1');
  layer.append(el);
  const segs = [...el.querySelectorAll('circle')]; const W = innerWidth;
  let x = rnd(W * .1, W * .7); const y = dockTop() - 15.5;
  await wait(50, run); el.style.transition = 'opacity 2s ease'; el.classList.remove('gone');
  const until = rnd(20000, 30000); let last = 0;
  await frames(run, (t) => {
    const ph = t / 260;
    segs.forEach((s, i) => s.setAttribute('cy', String(12 - 3.2 * Math.max(0, Math.sin(ph - (n - i) * .7)))));
    x += (right ? 1 : -1) * Math.max(0, Math.sin(ph)) * .22 * Math.min(2, (t - last) / 16); last = t;
    el.style.transform = `translate(${x}px, ${y}px)`;
    return t < until;
  });
  await fadeOut(el, run); el.remove();
}

// ── An inchworm: loops along the top edge of the menu, back end up to the front, front stretching on. ──
async function inchworm(run, sc) {
  const trunk = sc.trunks?.[Math.floor(Math.random() * sc.trunks.length)]; if (!trunk) return;
  const L = 22; const d = 12;
  const el = svg('0 0 60 30', 48, `<g class="inch"><path d="" fill="none" stroke="${INK}" stroke-width="3.6" stroke-linecap="round"/><circle r="2.4" fill="${INK}"/></g>`);
  el.classList.add('creature', 'crawler', 'climber', 'gone'); const right = true;
  layer.append(el);
  const X = (v) => (right ? v : 60 - v);
  const path = el.querySelector('path'); const head = el.querySelector('circle');
  // Up the trunk: drawn lying along its own baseline, turned to point up the bark.
  const bark = rectOf([trunk.x, trunk.y0, trunk.x, trunk.y1], sc);
  const x0 = bark.x + rnd(-4, 4); let climbed = 0; const startY = bark.y + bark.h * rnd(.55, .9); const k = 48 / 60;
  const place = () => { el.style.transform = `translate(${x0}px, ${startY - climbed}px) rotate(-90deg)`; };
  let x = 0; const y = 0; let b = 4; let f = b + L;
  await wait(50, run); el.style.transition = 'opacity 2s ease'; el.classList.remove('gone');
  const until = rnd(22000, 32000); const P = 2100; let cycles = 0;
  await frames(run, (t) => {
    const c = Math.floor(t / P); const p = (t % P) / P;
    if (c > cycles) { cycles = c; x += (right ? 1 : -1) * d; } // a step done: the worm moved on by d
    let bb, ff;
    if (p < .5) { bb = b + d * (p / .5); ff = f; } else { bb = b + d; ff = f + d * ((p - .5) / .5); }
    const chord = ff - bb; const hgt = Math.sqrt(Math.max(0, (L / 2) ** 2 - (chord / 2) ** 2)) * 1.9;
    path.setAttribute('d', `M${X(bb)} 26 Q${X((bb + ff) / 2)} ${26 - 2 * hgt} ${X(ff)} 26`);
    head.setAttribute('cx', String(X(ff + 1))); head.setAttribute('cy', String(25 - (p > .5 && p < .9 ? 2 : 0)));
    climbed = x * k; place(); void y;
    return t < until && startY - climbed > bark.y;
  });
  await fadeOut(el, run); el.remove();
}

// ── A spider: spins a small web in the branches of a painted tree (spokes, then the spiral), lets itself down on a thread,
// sways, climbs back, and the web fades. ──
async function spider(run, sc) {
  const W = innerWidth; const R = rnd(18, 26); const n = Math.round(rnd(7, 9)); const drop = rnd(90, 170);
  const size = R * 2 + 20; const cx = size / 2, cy = R + 10;
  const ang = Array.from({ length: n }, (_, i) => (i / n) * Math.PI * 2 + rnd(-.15, .15));
  const spokes = ang.map((a) => `<path class="spoke" d="M${cx} ${cy} L${cx + Math.cos(a) * R} ${cy + Math.sin(a) * R}"/>`).join('');
  const spiral = []; const turns = 3.3; const steps = Math.round(turns * n);
  for (let i = 0; i <= steps; i++) { const a = ang[i % n] + Math.floor(i / n) * 0; const rr = R * (.25 + .7 * (i / steps)); spiral.push(`${i ? 'L' : 'M'}${(cx + Math.cos(a) * rr).toFixed(1)} ${(cy + Math.sin(a) * rr).toFixed(1)}`); }
  const el = svg(`0 0 ${size} ${size + drop}`, size, `<g class="web" fill="none" stroke="${INK}" stroke-width=".7">${spokes}<path class="spiral" d="${spiral.join(' ')}"/></g>
    <line class="silk" x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy}" stroke="${INK}" stroke-width=".6"/>
    <g class="spider"><ellipse cx="0" cy="2.6" rx="2.6" ry="3.4" fill="${INK}"/><circle cx="0" cy="-1.6" r="1.8" fill="${INK}"/>
      <path d="M-1.5 -1 L-5 -4 L-6.5 -1 M1.5 -1 L5 -4 L6.5 -1 M-1.8 0 L-6 0 L-7 3 M1.8 0 L6 0 L7 3 M-1.8 1 L-5.5 3.5 L-6 7 M1.8 1 L5.5 3.5 L6 7 M-1.5 2 L-4 6 L-4 9 M1.5 2 L4 6 L4 9" stroke="${INK}" stroke-width=".7" fill="none"/></g>`);
  el.classList.add('creature', 'webber'); layer.append(el);
  // In the branches: somewhere in the painted canopy (kept clear of the top bar).
  const leafy = rectOf(sc.canopy, sc);
  const x = Math.max(6, Math.min(W - size - 6, rnd(leafy.x, leafy.x + Math.max(0, leafy.w - size))));
  const y = Math.max(64, rnd(leafy.y, leafy.y + Math.max(0, leafy.h - size * .6)));
  el.style.transform = `translate(${x}px, ${y}px)`;
  const bug = el.querySelector('.spider'); const silk = el.querySelector('.silk');
  const at = (px, py) => { bug.style.transform = `translate(${px}px, ${py}px)`; }; // a style, since the stylesheet sets these groups' transform
  const draw = async (p, ms, follow) => {
    const len = p.getTotalLength(); p.style.strokeDasharray = `${len}`; p.style.strokeDashoffset = `${len}`;
    await frames(run, (t) => { const k = Math.min(1, t / ms); p.style.strokeDashoffset = String(len * (1 - k)); if (follow) { const q = p.getPointAtLength(len * k); at(q.x, q.y); } return k < 1; });
  };
  at(cx, cy);
  for (const p of el.querySelectorAll('.spoke')) { p.style.strokeDasharray = '999'; p.style.strokeDashoffset = '999'; }
  for (const p of el.querySelectorAll('.spoke')) { await draw(p, rnd(1000, 1500), true); await wait(rnd(150, 400), run); }
  await draw(el.querySelector('.spiral'), rnd(13000, 18000), true);
  at(cx, cy); await wait(rnd(1200, 2500), run);
  // Down on a thread, a sway, and back up.
  await frames(run, (t) => { const k = Math.min(1, t / 5500); const yy = cy + drop * (1 - (1 - k) ** 2); silk.setAttribute('y2', String(yy)); at(cx, yy); return k < 1; });
  await frames(run, (t) => { const sw = Math.sin(t / 700) * 3 * (1 - t / 3500); silk.setAttribute('x2', String(cx + sw)); at(cx + sw, cy + drop); return t < 3500; });
  await frames(run, (t) => { const k = Math.min(1, t / 4500); const yy = cy + drop * (1 - k); silk.setAttribute('y2', String(yy)); silk.setAttribute('x2', String(cx)); at(cx, yy); return k < 1; });
  await wait(rnd(1500, 3000), run);
  await fadeOut(el, run, 3000); el.remove();
}

// ── Leaves: from the painted trees, a few come loose and fall, rocking and drifting on the wind; with no trees in the
// picture, they blow across. ──
async function leaves(run, sc) {
  const W = innerWidth, H = innerHeight; const n = Math.round(rnd(2, 6)); const wind = rnd(-.025, .025) || .01;
  const from = sc.canopy ? rectOf(sc.canopy, sc) : null;
  const tints = ['rgba(90,70,30,.9)', 'rgba(60,80,30,.9)', 'rgba(120,70,30,.9)', 'rgba(70,60,40,.9)'];
  const all = Array.from({ length: n }, (_, i) => {
    const size = rnd(9, 15);
    const el = svg('0 0 20 12', size, `<path d="M1 6 C5 0 14 0 19 6 C14 12 5 12 1 6Z" fill="${tints[i % 4]}"/><path d="M1 6 L17 6" stroke="rgba(20,20,10,.5)" stroke-width=".6"/>`);
    el.classList.add('creature', 'leaf'); layer.append(el);
    const x0 = from ? rnd(from.x, from.x + from.w) : (wind > 0 ? rnd(-60, -10) : rnd(W + 10, W + 60));
    const y0 = from ? rnd(from.y, from.y + from.h * .8) : rnd(H * .1, H * .5);
    return { el, x0, y0, delay: i * rnd(600, 2200) + rnd(0, 800), sway: rnd(18, 40), fall: rnd(.018, .035), spin: rnd(.6, 1.6), ph: rnd(0, 6), n: noise() };
  });
  const floor = dockTop() - 6;
  await frames(run, (t) => {
    let alive = false;
    for (const l of all) {
      const u = t - l.delay; if (u < 0) { l.el.style.opacity = '0'; alive = true; continue; }
      l.el.style.opacity = '';
      const y = l.y0 + u * l.fall * (from ? 1 : .35) + Math.abs(Math.sin(u / 700 + l.ph)) * 6;
      const x = l.x0 + u * wind * (from ? 1 : 6) + Math.sin(u / 900 + l.ph) * l.sway + l.n(u) * 20;
      const rot = Math.sin(u / 700 + l.ph) * 55 * l.spin;
      l.el.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg) scaleY(${.55 + .45 * Math.abs(Math.cos(u / 500 + l.ph))})`;
      if (y < floor && x > -80 && x < W + 80) alive = true; else l.el.style.opacity = '0';
    }
    return alive;
  });
  all.forEach((l) => l.el.remove());
}

// ── A butterfly: wanders over the flowers or the garden, never in a straight line, settles a moment, flutters off. ──
async function butterfly(run, sc) {
  // One to three, each its own colour; with two or more, one sometimes follows another in a rising spiral.
  const W = innerWidth, H = innerHeight; const area = sc.flowers ? rectOf(sc.flowers, sc) : { x: W * .1, y: H * .35, w: W * .8, h: H * .4 };
  const COLOURS = ['rgba(196,112,28,.88)', 'rgba(170,140,40,.88)', 'rgba(60,90,150,.85)', 'rgba(140,60,40,.85)', 'rgba(90,70,30,.85)'];
  const n = Math.random() < .45 ? 1 : Math.random() < .7 ? 2 : 3;
  const flies = Array.from({ length: n }, (_, i) => {
    const c = COLOURS[Math.floor(Math.random() * COLOURS.length)];
    const el = svg('0 0 24 20', rnd(14, 21), `<g class="bfly"><path class="bw l" d="M12 10 C6 1 1 2 2 8 C2 12 7 13 12 10 C7 14 4 19 8 18 C10 17 11 14 12 10Z" fill="${c}"/>
      <path class="bw r" d="M12 10 C18 1 23 2 22 8 C22 12 17 13 12 10 C17 14 20 19 16 18 C14 17 13 14 12 10Z" fill="${c}"/>
      <path d="M12 6 L12 15" stroke="${INK}" stroke-width="1.4" stroke-linecap="round"/></g>`);
    el.classList.add('creature', 'flutter'); el.style.setProperty('--beat', `${rnd(.13, .19)}s`); layer.append(el);
    const fromLeft = Math.random() < .5;
    return { el, x: fromLeft ? -20 - i * 30 : W + 20 + i * 30, y: rnd(area.y, area.y + area.h), nx: noise(), ny: noise(), target: null, rest: 0, legs: Math.round(rnd(4, 8)), done: false, lead: i > 0 && Math.random() < .6 ? 0 : -1 };
  });
  const pick = () => ({ x: rnd(area.x, area.x + area.w), y: rnd(area.y, area.y + area.h) });
  flies.forEach((f) => { f.target = pick(); });
  await frames(run, (t) => {
    let flying = false;
    for (const f of flies) {
      if (f.done) continue; flying = true;
      if (f.rest > 0) { if (--f.rest === 0) f.el.classList.remove('resting'); continue; }
      // A follower chases the first, circling it.
      const chase = f.lead >= 0 && !flies[f.lead].done && !flies[f.lead].rest;
      const tx = chase ? flies[f.lead].x + Math.cos(t / 260) * 16 : f.target.x, ty = chase ? flies[f.lead].y + Math.sin(t / 260) * 12 : f.target.y;
      const dx = tx - f.x, dy = ty - f.y, d = Math.hypot(dx, dy);
      if (!chase && d < 8) {
        if (--f.legs <= 0) { f.target = { x: Math.random() < .5 ? -50 : W + 50, y: rnd(0, H * .4) }; f.leaving = true; }
        else { if (Math.random() < .35) { f.rest = Math.round(rnd(60, 160)); f.el.classList.add('resting'); } f.target = pick(); }
      }
      const sp = chase ? 1.5 : f.leaving ? 1.6 : 1.1;
      f.x += (dx / (d || 1)) * sp + f.nx(t) * 1.4; f.y += (dy / (d || 1)) * sp + f.ny(t * 1.3) * 1.6 + Math.sin(t / 140) * .6;
      f.el.style.transform = `translate(${f.x}px, ${f.y}px)`;
      if (f.leaving && (f.x < -40 || f.x > W + 40)) { f.done = true; f.el.remove(); flies.forEach((g) => { if (g.lead >= 0 && flies[g.lead] === f) g.lead = -1; }); }
      if (t > 60000) { f.done = true; f.el.remove(); }
    }
    return flying;
  });
  flies.forEach((f) => f.el.remove());
}

// ── A frog at the edge of a pond: sits with its throat pulsing, blinks, hops along, and plops into the water. ──
async function frog(run, sc) {
  const band = waterBand(sc, 0, 1); if (!band || !sc.shore) return;
  // In the foreground: on the near bank if it is in view, otherwise on a lily pad in the near water. Smaller farther up.
  const W = innerWidth, H = innerHeight; const bank = imgY(sc.shore, sc); const near = bank > H * .72 && bank < dockTop() - 10;
  const edge = near ? bank : Math.min(band[1], dockTop()) - rnd(14, 40); const size = Math.max(14, 26 * (edge / (H * .9)) ** 1.5);
  const el = svg('0 0 36 26', size, `<g class="frog">
    <path class="legs-in" d="M6 18 C1 18 1 23 8 23 L15 23 C12 21 10 18 6 18Z" fill="rgba(44,66,36,.92)"/>
    <path class="legs-out" d="M9 18 L1 21 L-5 20 M10 20 L2 25 L-4 26" stroke="rgba(44,66,36,.92)" stroke-width="2.4" stroke-linecap="round" fill="none"/>
    <path d="M5 17 C6 10 14 7 22 9 C27 10 31 13 31 17 C31 20 26 21.5 20 21.5 L9 21.5 C6 21.5 5 19.5 5 17Z" fill="rgba(44,66,36,.92)"/>
    <ellipse class="throat" cx="27" cy="18.6" rx="3" ry="2" fill="rgba(70,90,50,.9)"/>
    <circle cx="24" cy="9" r="3.1" fill="rgba(44,66,36,.95)"/><circle class="eye" cx="24.7" cy="8.5" r="1.15" fill="rgba(220,200,120,.9)"/>
    <path d="M24 19 L27 23.5 L30.5 23.5" stroke="rgba(44,66,36,.92)" stroke-width="1.6" fill="none" stroke-linecap="round"/></g>`);
  el.classList.add('creature', 'froggy', 'gone'); const right = Math.random() < .5; if (!right) el.style.setProperty('--flip', '-1');
  let x = rnd(W * .12, W * .8); let y = edge - size * 23 / 36;
  const pad = !near && svg('0 0 40 12', size * 1.5, '<path d="M20 6 L33 2.5 A19 5.5 0 1 1 26 1.2 Z" fill="rgba(52,86,40,.85)"/>');
  if (pad) { pad.classList.add('creature', 'lilypad'); pad.style.transform = `translate(${x - size * .2}px, ${edge - size * .2}px)`; layer.append(pad); }
  layer.append(el);
  const place = (lift = 0) => { el.style.transform = `translate(${x}px, ${y - lift}px)`; };
  place(); await wait(50, run); el.style.transition = 'opacity 1.6s ease'; el.classList.remove('gone'); await wait(1600, run);
  const hop = async (dx, high, ms) => {
    el.classList.add('jumping'); const x0 = x;
    await frames(run, (t) => { const k = Math.min(1, t / ms); x = x0 + dx * k; place(Math.sin(k * Math.PI) * high); return k < 1; });
    el.classList.remove('jumping');
  };
  for (let i = 0; i < Math.round(rnd(1, 3)); i++) {
    await wait(rnd(1800, 4200), run);
    if (Math.random() < .5) { el.classList.add('blink'); await wait(220, run); el.classList.remove('blink'); await wait(rnd(500, 1500), run); }
    if (near) await hop((right ? 1 : -1) * rnd(16, 34), rnd(10, 18), 420);
  }
  await wait(rnd(1500, 3500), run);
  // Into the water: a last leap, a ripple where it went in.
  const dive = Math.min(28, (band[1] - edge) * .5 + 10);
  el.classList.add('jumping'); const x0 = x, y0 = y;
  await frames(run, (t) => { const k = Math.min(1, t / 520); x = x0 + (right ? 1 : -1) * 34 * k; y = y0 + dive * k; place(Math.sin(k * Math.PI) * 16); el.style.opacity = String(1 - Math.max(0, k - .6) / .4); return k < 1; });
  const R = 16; const ring = svg(`0 0 ${R * 2 + 4} ${R * .7 + 4}`, R * 2 + 4, [0, 1].map((k) => `<ellipse class="ring" style="animation-delay:${k * .5}s" cx="${R + 2}" cy="${R * .35 + 2}" rx="${R}" ry="${R * .35}" fill="none" stroke="rgba(255,255,255,.9)" stroke-width="1"/>`).join(''));
  ring.classList.add('creature', 'ripple'); ring.style.transform = `translate(${x + size / 2 - R}px, ${y + size * .5}px)`; lightLayer.append(ring);
  el.remove(); if (pad) { pad.style.transition = 'opacity 3s ease'; pad.style.opacity = '0'; } await wait(4200, run); ring.remove(); pad?.remove();
}

// ── Bees: two or three, busy among the flowers, darting from one to the next and hovering. ──
async function bees(run, sc) {
  const W = innerWidth, H = innerHeight; const area = sc.flowers ? rectOf(sc.flowers, sc) : { x: W * .1, y: H * .5, w: W * .8, h: H * .3 };
  const n = Math.round(rnd(2, 3));
  const all = Array.from({ length: n }, () => {
    const el = svg('0 0 14 10', rnd(8, 11), `<ellipse cx="7" cy="6" rx="4.4" ry="2.8" fill="rgba(60,45,10,.9)"/><path d="M5.5 3.6 L5.5 8.4 M8 3.4 L8 8.6" stroke="rgba(230,190,60,.9)" stroke-width="1"/><ellipse class="bw2" cx="6.5" cy="2.6" rx="2.6" ry="1.7" fill="rgba(240,245,255,.8)"/>`);
    el.classList.add('creature', 'bee'); layer.append(el);
    return { el, x: rnd(area.x, area.x + area.w), y: rnd(area.y, area.y + area.h), tx: 0, ty: 0, hover: 0, nx: noise(), ny: noise() };
  });
  all.forEach((b) => { b.tx = b.x; b.ty = b.y; b.el.classList.add('gone'); });
  await wait(30, run); all.forEach((b) => { b.el.style.transition = 'opacity 1.2s'; b.el.classList.remove('gone'); });
  const until = rnd(14000, 22000);
  await frames(run, (t) => {
    for (const b of all) {
      if (b.hover > 0) b.hover--;
      else if (Math.hypot(b.tx - b.x, b.ty - b.y) < 3) { b.hover = Math.round(rnd(20, 90)); b.tx = rnd(area.x, area.x + area.w); b.ty = rnd(area.y, area.y + area.h); }
      else { const dx = b.tx - b.x, dy = b.ty - b.y, d = Math.hypot(dx, dy); b.x += dx / d * 2.4; b.y += dy / d * 2.4; }
      b.el.style.transform = `translate(${b.x + b.nx(t * 4) * 3}px, ${b.y + b.ny(t * 5) * 3}px)`;
    }
    return t < until;
  });
  for (const b of all) { b.el.style.transition = 'opacity 1.2s'; b.el.classList.add('gone'); }
  await wait(1300, run); all.forEach((b) => b.el.remove());
}

// ── A hummingbird: darts in a straight dash to a flower, hovers there (wings a blur, tail flicking), backs off,
// darts to the next, and zips away. Quick where the dragonfly is slow. ──
async function hummingbird(run, sc) {
  const W = innerWidth, H = innerHeight; const area = sc.flowers ? rectOf(sc.flowers, sc) : { x: W * .2, y: H * .5, w: W * .6, h: H * .25 };
  const el = svg('0 0 40 26', 26, `<g class="hum">
    <path class="htail" d="M12 15 L3 21 L6 15.5 L2 12.5Z" fill="rgba(22,44,32,.9)"/>
    <ellipse cx="18" cy="14" rx="7.5" ry="4" transform="rotate(-22 18 14)" fill="rgba(22,44,32,.9)"/>
    <circle cx="25" cy="9.5" r="3.1" fill="rgba(22,44,32,.95)"/><path d="M27.4 9 L38 6.2" stroke="rgba(22,30,24,.95)" stroke-width="1.1" stroke-linecap="round"/>
    <ellipse class="hw" cx="16" cy="6" rx="9.5" ry="2.4" transform="rotate(-38 16 6)" fill="rgba(200,230,215,.45)"/>
    <ellipse class="hw b" cx="17" cy="7" rx="8" ry="2" transform="rotate(-18 17 7)" fill="rgba(200,230,215,.3)"/></g>`);
  el.classList.add('creature', 'hummer'); layer.append(el);
  let x = Math.random() < .5 ? -30 : W + 10, y = rnd(area.y - 60, area.y + area.h * .5); let facing = x < 0 ? 1 : -1;
  const place = (jx = 0, jy = 0) => { el.style.setProperty('--flip', String(facing)); el.style.transform = `translate(${x + jx}px, ${y + jy}px)`; };
  const dash = (tx, ty, speed) => frames(run, () => {
    const dx = tx - x, dy = ty - y, d = Math.hypot(dx, dy); if (Math.abs(dx) > 2) facing = dx > 0 ? 1 : -1;
    const s = Math.min(d, speed * (d < 30 ? .5 : 1)); x += dx / (d || 1) * s; y += dy / (d || 1) * s; place(); return d > 1.5;
  });
  const hover = (ms) => frames(run, (t) => { place(Math.sin(t / 37) * .8, Math.sin(t / 53) * 1.2); return t < ms; });
  const visits = Math.round(rnd(3, 6));
  for (let i = 0; i < visits; i++) {
    const fx = rnd(area.x, area.x + area.w), fy = rnd(area.y, area.y + area.h);
    await dash(fx - facing * 6, fy - 14, rnd(7, 11));
    await hover(rnd(900, 2400));
    if (Math.random() < .5) { await dash(x - facing * rnd(10, 22), y - rnd(2, 8), 2.5); await hover(rnd(300, 800)); } // backs off from the flower
  }
  const out = { x: Math.random() < .5 ? -50 : W + 50, y: rnd(-20, H * .3) };
  await dash(out.x, out.y, 13);
  el.remove();
}

// ── Rays of light: through the painted window, doorway or trees, soft beams brighten, drift a little, and fade. ──
async function rays(run, sc) {
  const r = sc.rays; const at = rectOf([r.x, r.y, r.x, r.y], sc); const H = innerHeight;
  const box = document.createElement('div'); box.className = 'creature rays gone'; lightLayer.append(box);
  const beams = Array.from({ length: Math.round(rnd(3, 5)) }, (_, i, arr) => {
    const b = document.createElement('div'); b.className = 'beam';
    const width = rnd(28, 70); const len = H * rnd(.7, 1.1);
    Object.assign(b.style, { left: `${at.x - width / 2}px`, top: `${at.y}px`, width: `${width}px`, height: `${len}px` });
    box.append(b); return { b, base: -r.a + (i - (arr.length - 1) / 2) * rnd(5, 9), n: noise(), op: rnd(.5, 1) };
  });
  const until = rnd(16000, 24000);
  await wait(30, run); box.style.transition = 'opacity 4s ease'; box.classList.remove('gone');
  await frames(run, (t) => {
    for (const x of beams) { x.b.style.transform = `rotate(${x.base + x.n(t) * 2.2}deg)`; x.b.style.opacity = String(x.op * (.65 + .35 * x.n(t * 1.7 + 999))); }
    return t < until;
  });
  box.classList.add('gone'); await wait(4000, run); box.remove();
}

// ── Ripples: on the water, a ring or two spreads and fades, as if a fish rose or a drop fell; one, then another. ──
async function ripples(run, sc) {
  const band = waterBand(sc, .12, .95); if (!band) return;
  const W = innerWidth; const n = Math.round(rnd(3, 7));
  for (let i = 0; i < n; i++) {
    const y = rnd(band[0], band[1]); const depth = (y - band[0]) / Math.max(1, band[1] - band[0]); const R = 10 + 34 * depth;
    const x = rnd(W * .08, W * .92);
    const el = svg(`0 0 ${R * 2 + 4} ${R * .7 + 4}`, R * 2 + 4, `${[0, 1, 2].map((k) => `<ellipse class="ring" style="animation-delay:${k * .7}s" cx="${R + 2}" cy="${R * .35 + 2}" rx="${R}" ry="${R * .35}" fill="none" stroke="rgba(255,255,255,.9)" stroke-width="1"/>`).join('')}`);
    el.classList.add('creature', 'ripple'); el.style.transform = `translate(${x - R}px, ${y - R * .35}px)`;
    lightLayer.append(el); setTimeout(() => el.remove(), 4800);
    await wait(rnd(1200, 4200), run);
  }
  await wait(4000, run);
}

// ── Writing: on a painted page or open book, a few lines appear as if written by an unseen hand, rest, and fade. ──
const LINES = ['Know thyself.', 'Some things are up to us,', 'and some are not.', 'What did I do well today?', 'Begin at once to live.', 'The unexamined life', 'is not worth living.', 'I think, therefore I am.', 'Dear friend,', 'Today I learned', 'Let us balance the account', 'of each day.', 'Be patient toward', 'all that is unsolved.', 'Nothing in excess.', 'What is it I ought to do?'];
const EQUATIONS = ['F = ma', 'E = mc²', 'a² + b² = c²', 'F = G m₁m₂ / r²', 'ΔxΔp ≥ ħ/2', 'PV = nRT', 'S = k log W', 'e^{iπ} + 1 = 0', '∇ · E = ρ / ε₀', 'T² ∝ a³', 'v = λf', 'iħ ∂ψ/∂t = Ĥψ', 'p = mv', 'λ = h / p', 'ds² = c²dt² − dx²'];
async function writing(run, sc, kind = 'paper') {
  const r = rectOf(sc[kind], sc); const chalk = kind !== 'paper';
  const pick = (list, k) => { const start = Math.floor(Math.random() * list.length); return Array.from({ length: k }, (_, i) => list[(start + i * (chalk ? 3 : 1)) % list.length]); };
  const lines = chalk ? pick(EQUATIONS, kind === 'chart' ? Math.round(rnd(2, 3)) : Math.round(rnd(2, 4))) : pick(LINES, Math.round(rnd(2, 3)));
  const box = document.createElement('div'); box.className = `creature writing ${chalk ? 'chalk' : 'ink'}`;
  const fs = chalk ? Math.max(11, Math.min(20, r.h / (lines.length + .8))) : Math.max(7, Math.min(13, r.h / (lines.length + .6)));
  Object.assign(box.style, { left: `${r.x}px`, top: `${r.y}px`, width: `${r.w}px`, height: `${r.h}px`, fontSize: `${fs}px`,
    transform: chalk ? `rotate(${rnd(-2, 2)}deg)` : `perspective(400px) rotateX(${rnd(38, 52)}deg) rotate(${rnd(-4, 3)}deg)` });
  lightLayer.append(box);
  if (kind === 'chart') { // an orbit chalked first, then the law that describes it
    const o = svg('0 0 100 50', Math.min(r.w * .7, 160), '<ellipse class="orbit" cx="50" cy="25" rx="44" ry="18" fill="none" stroke="rgba(240,240,225,.9)" stroke-width=".8"/><circle cx="36" cy="25" r="2.4" fill="rgba(240,240,225,.9)"/>');
    o.classList.add('orbit-svg'); box.append(o);
    const e = o.querySelector('.orbit'); const len = e.getTotalLength(); e.style.strokeDasharray = `${len}`; e.style.strokeDashoffset = `${len}`;
    await frames(run, (t) => { const k = Math.min(1, t / 3500); e.style.strokeDashoffset = String(len * (1 - k)); return k < 1; });
  }
  for (const [i, text] of lines.entries()) {
    const line = document.createElement('div'); line.className = 'wline'; line.textContent = text;
    line.style.marginLeft = `${chalk ? rnd(0, 18) : i * rnd(0, 4)}px`; box.append(line);
    const ms = text.length * (chalk ? 140 : 110) + 400;
    await frames(run, (t) => { const k = Math.min(1, t / ms); line.style.clipPath = `inset(0 ${100 - k * 100}% 0 0)`; return k < 1; });
    await wait(rnd(300, 900), run);
  }
  await wait(rnd(5000, 8000), run);
  await fadeOut(box, run, 3000); box.remove();
}
const equations = (run, sc) => writing(run, sc, sc.board ? 'board' : 'chart');

// Who may visit which picture, and how often (weights).
const VISITORS = [
  { name: 'bird', fn: bird, w: 1.5, ok: (s) => s.has('out') || s.has('garden') || s.has('sea') || s.has('lake') },
  { name: 'flock', fn: flock, w: 1.3, ok: (s) => s.has('sky') },
  { name: 'dragonfly', fn: dragonfly, w: 1, ok: (s) => s.has('garden') || s.has('lake') },
  { name: 'sailboat', fn: sailboat, w: 2, ok: (s) => s.has('boats') && s.water && (s.live ?? []).some((x) => x.m === 'bob' && !x.soft) }, // only among painted boats
  { name: 'fish', fn: school, w: 1.5, ok: (s) => (s.has('sea') || s.has('lake')) && s.water && !s.has('city') },
  { name: 'ducks', fn: ducks, w: 2, ok: (s) => s.has('lake') && s.water },
  { name: 'egret', fn: egret, w: 1.5, ok: (s) => (s.has('lake') || s.has('sea')) && s.water },
  { name: 'sandpipers', fn: sandpipers, w: 2.5, ok: (s) => s.has('beach') && s.shore },
  { name: 'caterpillar', fn: caterpillar, w: 1, ok: (s) => s.has('garden') && groundBelow(s) },
  { name: 'inchworm', fn: inchworm, w: 1.5, ok: (s) => s.trunks },
  { name: 'spider', fn: spider, w: 1, ok: (s) => s.canopy },
  { name: 'leaves', fn: leaves, w: 2, ok: (s) => s.canopy || s.has('garden') },
  { name: 'butterfly', fn: butterfly, w: 2, ok: (s) => s.flowers || (s.has('garden') && s.has('sky')) },
  { name: 'bees', fn: bees, w: 2, ok: (s) => s.flowers },
  { name: 'hummingbird', fn: hummingbird, w: 2, ok: (s) => s.flowers },
  { name: 'frog', fn: frog, w: 2.5, ok: (s) => s.has('lake') && s.shore && !s.has('city') },
  { name: 'rays', fn: rays, w: 2.5, ok: (s) => s.rays },
  { name: 'ripples', fn: ripples, w: 2, ok: (s) => (s.has('lake') || s.has('sea')) && s.water },
  { name: 'writing', fn: writing, w: 3, ok: (s) => s.paper },
  { name: 'equations', fn: equations, w: 3, ok: (s) => s.board || s.chart },
];
let last = null;
async function go(v, sc) {
  layer.classList.toggle('dark', sc.has('dark'));
  const run = active = { stopped: false, raf: 0, cancel: [] };
  try { await v.fn(run, sc); } catch { /* a visitor never breaks the page */ }
  if (active === run) active = null;
  schedule();
}
function visit() {
  timer = 0;
  if (!layer || active || reduced() || busy()) return schedule(15000);
  const sc = scene();
  const can = VISITORS.filter((v) => v.ok(sc) && v.name !== last);
  if (!can.length) return schedule();
  let pick = Math.random() * can.reduce((a, v) => a + v.w, 0);
  const v = can.find((x) => (pick -= x.w) < 0) ?? can[0]; last = v.name;
  go(v, sc);
}
// Sooner while the reader sits still with a page; less often while they are moving about.
function schedule(ms) {
  clearTimeout(timer);
  const still = performance.now() - lastTouch > 15000;
  timer = setTimeout(visit, ms ?? (still ? rnd(12000, 26000) : rnd(28000, 55000)));
}
function shoo() {
  if (!active) return;
  active.stopped = true; cancelAnimationFrame(active.raf); active.cancel.forEach((f) => f());
  layer.replaceChildren(); lightLayer.replaceChildren(); active = null;
}

// Starts the visits, the first after about ten seconds. The page stays the same if this is never called.
export function startCreatures() {
  if (layer) return;
  layer = document.createElement('div'); layer.id = 'creatures'; layer.setAttribute('aria-hidden', 'true');
  lightLayer = document.createElement('div'); lightLayer.id = 'creatures-light'; lightLayer.setAttribute('aria-hidden', 'true');
  const motif = document.getElementById('motif'); if (motif) motif.after(layer, lightLayer); else document.body.prepend(layer, lightLayer);
  document.addEventListener('visibilitychange', () => { if (document.hidden) shoo(); });
  addEventListener('resize', shoo);
  for (const ev of ['pointerdown', 'keydown', 'wheel']) addEventListener(ev, () => { lastTouch = performance.now(); }, { passive: true });
  // A new picture: whoever was visiting the old one leaves.
  const wall = document.getElementById('wallpaper');
  if (wall) new MutationObserver(() => { if (active) { shoo(); schedule(); } }).observe(wall, { subtree: true, attributes: true, attributeFilter: ['src'] });
  schedule(rnd(7000, 14000));
}
// Look (the picture full screen): the visitors move into boxes that follow the picture as it drifts and zooms (their
// places are worked out for the picture as it covers the screen; the boxes carry them to where it is now). null: back.
export function creaturesInto(dark, light) {
  if (!layer) return;
  shoo();
  if (dark) { dark.append(layer); light.append(lightLayer); layer.classList.add('in-gaze'); lightLayer.classList.add('in-gaze'); schedule(rnd(1500, 4000)); }
  else {
    layer.classList.remove('in-gaze'); lightLayer.classList.remove('in-gaze');
    const motif = document.getElementById('motif'); if (motif) motif.after(layer, lightLayer); else document.body.prepend(layer, lightLayer);
    schedule();
  }
}
// For trying a visitor on a page: summon('sailboat'), and so on (it comes even where it would not belong).
export function summon(name) {
  const v = VISITORS.find((x) => x.name === name); if (!v || !layer) return;
  shoo(); clearTimeout(timer); last = null;
  const sc = scene(); const wet = ['sailboat', 'ducks', 'egret', 'ripples', 'sandpipers', 'frog', 'fish'].includes(name);
  if (wet && !sc.water) sc.water = [.6, .88]; if (wet && !sc.shore) sc.shore = .8; if (!sc.trunks) sc.trunks = [{ x: .3, y0: .15, y1: .6 }]; if (!sc.flowers) sc.flowers = [.2, .7, .8, .88]; if (!sc.canopy) sc.canopy = [.15, .05, .85, .3];
  if (!sc.paper) sc.paper = [.3, .78, .7, .88]; if (!sc.board && !sc.chart) sc.board = [.15, .2, .7, .34]; if (!sc.rays) sc.rays = { x: .3, y: 0, a: 15 };
  go(v, sc);
}
export const VISITOR_NAMES = VISITORS.map((v) => v.name);
