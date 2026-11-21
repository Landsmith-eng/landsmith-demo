// Small visitors on the pictures, chosen to fit what each painting holds (see scenes.js): birds passing over or
// landing, a dragonfly crossing, bees, butterflies and a hummingbird at the flowers, leaves on the wind, a caterpillar,
// an inchworm on a dark trunk, a spider in the branches; on the water, a school of fish
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
let layer = null; let lightLayer = null; let perch = null; // perch: above the words, for a butterfly or bee on a letter
 let timer = 0; let active = null; let lastTouch = performance.now();
let passage = null; let unfit = ''; // the open story whose own visitor this is (see startPassage); a screen size it could not draw at
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
  run.cancel.push(resolve); // shooed: end here, so whoever waits on it carries on
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

// ── A bird far off: a small, soft shape crossing the sky slowly, now flapping, now gliding, rising and falling a
// little. Far away in the painting, so no detail and no landing. ──
async function bird(run) {
  const W = innerWidth, H = innerHeight; const size = rnd(9, 13);
  const el = svg('0 0 20 10', size, `<path class="w" d="M1 6 Q5 1.5 10 6 Q15 1.5 19 6" fill="none" stroke="${INK}" stroke-width="1.7" stroke-linecap="round"/>`);
  el.classList.add('creature', 'farbird'); layer.append(el);
  const right = Math.random() < .5; const y0 = rnd(H * .08, H * .4); const speed = rnd(.012, .02); const span = W + 60; const drift = noise();
  let glideUntil = 0;
  await frames(run, (t) => {
    if (t > glideUntil && Math.random() < .004) { glideUntil = t + rnd(1200, 2600); el.classList.add('gliding'); }
    if (t > glideUntil) el.classList.remove('gliding');
    const d = t * speed; const x = right ? -30 + d : W + 10 - d;
    el.style.transform = `translate(${x}px, ${y0 + drift(t) * 14}px)`;
    return d < span;
  });
  el.remove();
}

// A letter of the page's words to land on (a range over one letter, in view and clear of the bars), or null.
function letterSpot() {
  const view = document.getElementById('view'); if (!view || document.querySelector('.gaze')) return null;
  const walk = document.createTreeWalker(view, NodeFilter.SHOW_TEXT); const nodes = [];
  while (walk.nextNode() && nodes.length < 400) { const n = walk.currentNode; if (/\p{L}{3}/u.test(n.textContent) && !n.parentElement.closest('button, a, input, textarea, select')) nodes.push(n); }
  const top = 90, bottom = dockTop() - 30;
  for (let i = 0; i < 25 && nodes.length; i++) {
    const n = nodes[Math.floor(Math.random() * nodes.length)]; const at = [...n.textContent.matchAll(/\p{L}/gu)].map((m) => m.index);
    const k = at[Math.floor(Math.random() * at.length)]; const range = document.createRange(); range.setStart(n, k); range.setEnd(n, k + 1);
    const r = range.getBoundingClientRect(); if (r.width > 2 && r.top > top && r.bottom < bottom && r.left > 12 && r.right < innerWidth - 12) return range;
  }
  return null;
}
// Where a letter is now (the page may have scrolled): its top middle.
const spotOf = (range) => { const r = range.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height * .3, ok: r.width > 0 && r.top > 60 && r.bottom < innerHeight - 40 }; };
// Where the bottom of the picture (the top of the menu) is ground, not water: only there may anything walk or land.
const groundBelow = (sc) => !(sc.water && sc.water[1] >= .9);
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

// ── A sailboat: far off, a small sail crossing slowly near the horizon, heeling a little. Only in the distance: it
// sails in the top tenth of the water, never larger than the farthest painted boat (or a few pixels where there is none).
async function sailboat(run, sc) {
  const band = waterBand(sc, 0, 1); if (!band) return;
  if (sc.distant !== false) {
    const far = (sc.live ?? []).filter((x) => x.m === 'bob' && !x.soft).map((x) => rectOf(x.r, sc).h * .72).sort((a, b) => a - b)[0];
    const yb0 = band[0] + (band[1] - band[0]) * rnd(.01, .1) + 2;
    const h0 = Math.max(6, Math.min(far ? far * rnd(.45, .7) : rnd(7, 12), 13));
    return sailAt(run, yb0, h0);
  }
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
  return sailAt(run, yb, h);
}
async function sailAt(run, yb, h) {
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
  // One to three, each its own colour, well apart; slow and wandering. Now and then one settles on a letter of the
  // page's words for a while, wings slowly opening and closing, then flies on.
  const W = innerWidth, H = innerHeight; const area = sc.flowers ? rectOf(sc.flowers, sc) : { x: W * .1, y: H * .35, w: W * .8, h: H * .4 };
  const COLOURS = ['rgba(196,112,28,.88)', 'rgba(170,140,40,.88)', 'rgba(60,90,150,.85)', 'rgba(140,60,40,.85)', 'rgba(90,70,30,.85)'];
  const n = Math.random() < .5 ? 1 : Math.random() < .75 ? 2 : 3;
  const flies = Array.from({ length: n }, (_, i) => {
    const c = COLOURS[Math.floor(Math.random() * COLOURS.length)]; const size = rnd(14, 20);
    // Two shapes: wings open in flight; folded upright together when it settles (seen from the side, opening a
    // little now and then).
    const el = svg('0 0 24 20', size, `<g class="bfly"><g class="open"><path class="bw l" d="M12 10 C6 1 1 2 2 8 C2 12 7 13 12 10 C7 14 4 19 8 18 C10 17 11 14 12 10Z" fill="${c}"/>
      <path class="bw r" d="M12 10 C18 1 23 2 22 8 C22 12 17 13 12 10 C17 14 20 19 16 18 C14 17 13 14 12 10Z" fill="${c}"/>
      <path d="M12 6 L12 15" stroke="${INK}" stroke-width="1.4" stroke-linecap="round"/></g>
      <g class="folded"><g class="fw"><path d="M12.5 15 C9 9 8.5 2.5 12 1.5 C16.5 1 18.5 6 13.5 15Z" fill="${c}"/><path d="M12.5 16 C9.5 13.5 8.5 10.5 10.5 9.5 C13 9 14 12 13 16Z" fill="${c}" opacity=".85"/></g>
      <path d="M9 16.5 C11 15.6 14 15.6 16 16.5" stroke="${INK}" stroke-width="1.5" stroke-linecap="round" fill="none"/>
      <path d="M15.6 16 L18 12.8 M16 16.2 L19 14" stroke="${INK}" stroke-width=".6"/>
      <path d="M8.8 17.3 L8 19.5 M11 17.6 L10.6 19.6 M13.6 17.6 L14 19.6" stroke="${INK}" stroke-width=".5"/></g></g>`);
    el.classList.add('creature', 'flutter'); el.style.setProperty('--beat', `${rnd(.16, .23)}s`); layer.append(el);
    const fromLeft = Math.random() < .5;
    return { el, size, x: fromLeft ? -20 : W + 20, y: rnd(H * .2, H * .7), nx: noise(), ny: noise(), target: null, rest: 0, legs: Math.round(rnd(4, 7)), done: false, delay: i * rnd(3000, 7000), perched: null, mayLand: Math.random() < .55 };
  });
  // Each its own part of the flowers, so they keep apart.
  const pick = (i) => { const w = area.w / n; return { x: rnd(area.x + w * i, area.x + w * (i + 1)), y: rnd(area.y, area.y + area.h) }; };
  flies.forEach((f, i) => { f.target = pick(i); f.i = i; });
  await frames(run, (t) => {
    let flying = false;
    for (const f of flies) {
      if (f.done) continue; flying = true;
      if (t < f.delay) continue;
      if (f.rest > 0) {
        f.rest--;
        if (f.perched) { const p = spotOf(f.perched); if (!p.ok) f.rest = 0; else f.el.style.transform = `translate(${p.x - f.size / 2}px, ${p.y - f.size * .7}px)`; }
        if (f.rest === 0) { f.el.classList.remove('resting'); if (f.perched) { f.perched = null; f.target = pick(f.i); setTimeout(() => layer.append(f.el), 1500); } }
        continue;
      }
      const goal = f.landing ? spotOf(f.landing) : null;
      const tx = goal ? goal.x - f.size / 2 : f.target.x, ty = goal ? goal.y - f.size * .7 : f.target.y;
      const dx = tx - f.x, dy = ty - f.y, d = Math.hypot(dx, dy);
      if (d < 6) {
        if (f.landing) { f.perched = f.landing; f.landing = null; f.rest = Math.round(rnd(240, 480)); f.el.classList.add('resting'); continue; }
        if (--f.legs <= 0) { f.target = { x: Math.random() < .5 ? -50 : W + 50, y: rnd(0, H * .4) }; f.leaving = true; }
        else if (f.mayLand && (f.landing = letterSpot())) { f.mayLand = false; perch.append(f.el); }
        else { if (Math.random() < .3) { f.rest = Math.round(rnd(90, 200)); f.el.classList.add('resting'); } f.target = pick(f.i); }
      }
      const sp = f.leaving ? .9 : f.landing ? .7 : .6; const wob = f.landing && d < 40 ? .3 : 1;
      f.x += (dx / (d || 1)) * sp + f.nx(t) * .9 * wob; f.y += (dy / (d || 1)) * sp + (f.ny(t * 1.3) * 1.1 + Math.sin(t / 160) * .5) * wob;
      f.el.style.transform = `translate(${f.x}px, ${f.y}px)`;
      if (f.leaving && (f.x < -40 || f.x > W + 40)) { f.done = true; f.el.remove(); }
      if (t > 90000) { f.done = true; f.el.remove(); }
    }
    return flying;
  });
  flies.forEach((f) => f.el.remove());
}

// ── Bees: two or three, busy among the flowers, darting from one to the next and hovering. ──
async function bees(run, sc) {
  const W = innerWidth, H = innerHeight; const area = sc.flowers ? rectOf(sc.flowers, sc) : { x: W * .1, y: H * .5, w: W * .8, h: H * .3 };
  const n = Math.round(rnd(2, 3));
  const all = Array.from({ length: n }, () => {
    const el = svg('0 0 14 10', rnd(8, 11), `<ellipse cx="7" cy="6" rx="4.4" ry="2.8" fill="rgba(60,45,10,.9)"/><path d="M5.5 3.6 L5.5 8.4 M8 3.4 L8 8.6" stroke="rgba(230,190,60,.9)" stroke-width="1"/><ellipse class="bw2" cx="6.5" cy="2.6" rx="2.6" ry="1.7" fill="rgba(240,245,255,.8)"/>`);
    el.classList.add('creature', 'bee'); layer.append(el);
    return { el, x: rnd(area.x, area.x + area.w), y: rnd(area.y, area.y + area.h), tx: 0, ty: 0, hover: 0, nx: noise(), ny: noise(), mayLand: Math.random() < .4, landing: null, perched: null, sit: 0 };
  });
  all.forEach((b) => { b.tx = b.x; b.ty = b.y; b.el.classList.add('gone'); });
  await wait(30, run); all.forEach((b) => { b.el.style.transition = 'opacity 1.2s'; b.el.classList.remove('gone'); });
  const until = rnd(14000, 22000);
  await frames(run, (t) => {
    for (const b of all) {
      // On a letter: sits, wings still, crawling a hair now and then; then off to the flowers again.
      if (b.perched) {
        const p = spotOf(b.perched); if (!p.ok) b.sit = 0;
        b.el.style.transform = `translate(${p.x - 5 + Math.sin(t / 900) * .8}px, ${p.y - 7}px)`;
        if (--b.sit <= 0) { b.perched = null; b.el.classList.remove('sitting'); b.tx = rnd(area.x, area.x + area.w); b.ty = rnd(area.y, area.y + area.h); setTimeout(() => layer.append(b.el), 1200); }
        continue;
      }
      if (b.landing) { const p = spotOf(b.landing); b.tx = p.x - 5; b.ty = p.y - 7; }
      if (b.hover > 0) b.hover--;
      else if (Math.hypot(b.tx - b.x, b.ty - b.y) < 3) {
        if (b.landing) { b.perched = b.landing; b.landing = null; b.sit = Math.round(rnd(150, 300)); b.el.classList.add('sitting'); continue; }
        b.hover = Math.round(rnd(20, 90));
        if (b.mayLand && t > 3000 && (b.landing = letterSpot())) { b.mayLand = false; perch.append(b.el); }
        else { b.tx = rnd(area.x, area.x + area.w); b.ty = rnd(area.y, area.y + area.h); }
      } else { const dx = b.tx - b.x, dy = b.ty - b.y, d = Math.hypot(dx, dy); const sp = b.landing ? 1.6 : 2.4; b.x += dx / d * Math.min(sp, d); b.y += dy / d * Math.min(sp, d); }
      b.el.style.transform = `translate(${b.x + b.nx(t * 4) * 3}px, ${b.y + b.ny(t * 5) * 3}px)`;
    }
    return t < until || all.some((b) => b.perched || b.landing);
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
  const box = document.createElement('div'); box.className = `creature rays gone${r.warm ? ' warm' : ''}`; lightLayer.append(box);
  const flame = candle();
  const beams = Array.from({ length: Math.round(rnd(3, 5)) }, (_, i, arr) => {
    const b = document.createElement('div'); b.className = 'beam';
    const width = rnd(28, 70); const len = H * rnd(.7, 1.1);
    Object.assign(b.style, { left: `${at.x - width / 2}px`, top: `${at.y}px`, width: `${width}px`, height: `${len}px` });
    box.append(b); return { b, base: -r.a + (i - (arr.length - 1) / 2) * rnd(5, 9), n: noise(), op: rnd(.5, 1) };
  });
  const until = rnd(16000, 24000);
  await wait(30, run); box.style.transition = 'opacity 4s ease'; box.classList.remove('gone');
  await frames(run, (t) => {
    for (const x of beams) {
      x.b.style.transform = `rotate(${x.base + x.n(t) * (r.warm ? .8 : 2.2)}deg)`;
      x.b.style.opacity = String(r.warm ? x.op * flame(t) : x.op * (.65 + .35 * x.n(t * 1.7 + 999))); // a flame's light breathes with it
    }
    return t < until;
  });
  box.classList.add('gone'); await wait(4000, run); box.remove();
}

// A candle's light, 0..1 around .8: a quick, uneven flutter over a slow sway, and now and then a gutter (a dip that
// shivers back), the way a flame moves in a still room.
export function candle() {
  const ph = [Math.random() * 6, Math.random() * 6, Math.random() * 6]; let gutter = -1e9; let next = rnd(4000, 9000);
  return (t) => {
    if (t > next) { gutter = t; next = t + rnd(5000, 12000); }
    const g = t - gutter; const dip = g < 700 ? Math.sin(g / 700 * Math.PI) * (.28 + .06 * Math.sin(g / 23)) : 0;
    return Math.max(.35, .8 + .07 * Math.sin(t * .0072 + ph[0]) + .05 * Math.sin(t * .0193 + ph[1]) + .035 * Math.sin(t * .041 + ph[2]) - dip);
  };
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

// ── Passage drawings. Each is drawn on a sheet over the whole screen and keyed to what the painting holds (its water,
// its lamp, its hill, its table), so it sits on the painted thing rather than at a fixed spot on the glass. Every loop
// draws fresh random values for each pass, so no two passes are the same. ──
const uid = () => Math.random().toString(36).slice(2, 8);
// A sheet in screen pixels (0..W across, 0..H down).
function sheet(parent, inner, cls = '') {
  const s = document.createElementNS(NS, 'svg');
  s.setAttribute('viewBox', `0 0 ${innerWidth} ${innerHeight}`); s.setAttribute('aria-hidden', 'true');
  s.setAttribute('class', `creature sheet ${cls}`.trim()); s.innerHTML = inner; parent.append(s); return s;
}
const smooth = (p) => p * p * (3 - 2 * p);
const at = (sc, x, y) => { const r = rectOf([x, y, x, y], sc); return { x: r.x, y: r.y }; };
const restUntilStopped = (run) => new Promise((r) => run.cancel.push(r));

// ── Rises (a fish nipping the surface from below) ──
// The water is drawn as one surface. Each rise sends out a packet of rings, a bright crest between darker troughs,
// smaller and flatter farther off. Where rings from two rises cross they add together as real waves do: crest on crest
// brighter, crest on trough cancelling, and each passes on through the other unchanged.
function waterRect(sc) {
  const r = rectOf([sc.waterX?.[0] ?? 0, sc.water[0], sc.waterX?.[1] ?? 1, sc.water[1]], sc);
  return { x0: Math.max(14, r.x + 10), x1: Math.min(innerWidth - 14, r.x + r.w - 10) };
}
function pond(sc) {
  const band = waterBand(sc, .04, .98); if (!band) return null;
  const { x0, x1 } = waterRect(sc);
  const X = Math.floor(x0), Y = Math.floor(band[0]), w = Math.ceil(x1 - x0), h = Math.ceil(band[1] - band[0]);
  if (w < 40 || h < 12) return null;
  const k = Math.min(2, devicePixelRatio || 1); const PW = Math.ceil(w * k), PH = Math.ceil(h * k);
  const cv = document.createElement('canvas'); cv.width = PW; cv.height = PH; cv.className = 'creature pond';
  Object.assign(cv.style, { width: `${w}px`, height: `${h}px`, transform: `translate(${X}px, ${Y}px)` });
  lightLayer.append(cv);
  const ctx = cv.getContext('2d'); const img = ctx.createImageData(PW, PH); const px = img.data;
  const rings = []; let prev = null; const edge = 8 * k;
  const add = (x, y, depth, t) => {
    rings.push({ cx: (x - X) * k, cy: (y - Y) * k, t0: t, Rm: (12 + 44 * depth) * k, flat: .2 + .16 * depth,
      wl: (3.2 + 4.5 * depth) * k, life: 4200 + 1400 * depth, n: depth > .35 ? 3 : 2 });
  };
  const draw = (t) => {
    // The packets alive now: radius, strength, wavelength.
    const live = [];
    for (let i = rings.length - 1; i >= 0; i--) {
      const r = rings[i]; let any = false;
      for (let j = 0; j < r.n; j++) {
        const p = (t - r.t0 - j * 850) / r.life; if (p >= 1) continue; any = true; if (p <= 0) continue;
        const R = 1.5 * k + r.Rm * Math.pow(p, .7); const A = Math.min(1, p / .06) * Math.pow(1 - p, 1.8) * (j ? .7 : 1);
        const reach = R + 2 * r.wl;
        live.push({ cx: r.cx, cy: r.cy, R, A, wl: r.wl, flat: r.flat, x0: r.cx - reach, x1: r.cx + reach, y0: r.cy - reach * r.flat, y1: r.cy + reach * r.flat });
      }
      if (!any && t - r.t0 > 1000) rings.splice(i, 1);
    }
    let box = null;
    for (const q of live) box = box ? { x0: Math.min(box.x0, q.x0), y0: Math.min(box.y0, q.y0), x1: Math.max(box.x1, q.x1), y1: Math.max(box.y1, q.y1) } : { ...q };
    if (box) box = { x0: Math.max(0, Math.floor(box.x0)), y0: Math.max(0, Math.floor(box.y0)), x1: Math.min(PW, Math.ceil(box.x1)), y1: Math.min(PH, Math.ceil(box.y1)) };
    if (prev) px.fill(0, prev.y0 * PW * 4, prev.y1 * PW * 4);
    if (box && box.x1 > box.x0 && box.y1 > box.y0) {
      for (let y = box.y0; y < box.y1; y++) {
        const rowQ = live.filter((q) => y >= q.y0 && y <= q.y1); if (!rowQ.length) continue;
        const ey = Math.min(1, y / edge, (PH - 1 - y) / edge);
        for (let x = box.x0; x < box.x1; x++) {
          let hgt = 0;
          for (const q of rowQ) {
            if (x < q.x0 || x > q.x1) continue;
            const dx = x - q.cx; const dy = (y - q.cy) / q.flat; const d = Math.sqrt(dx * dx + dy * dy) - q.R;
            const z = d / q.wl; if (z < -2 || z > 2) continue;
            hgt += q.A * Math.exp(-z * z / .8) * Math.cos(2 * Math.PI * z); // a crest with a trough each side
          }
          if (!hgt) continue;
          const e = ey * Math.min(1, x / edge, (PW - 1 - x) / edge); const o = (y * PW + x) * 4;
          if (hgt > 0) { px[o] = 252; px[o + 1] = 250; px[o + 2] = 242; px[o + 3] = Math.min(255, hgt * 150 * e); }
          else { px[o] = 24; px[o + 1] = 52; px[o + 2] = 56; px[o + 3] = Math.min(255, -hgt * 120 * e); }
        }
      }
    }
    const u = prev && box ? { x0: 0, y0: Math.min(prev.y0, box.y0), x1: PW, y1: Math.max(prev.y1, box.y1) } : prev ? { x0: 0, ...prev, x1: PW } : box ? { ...box, x0: 0, x1: PW } : null;
    if (u && u.y1 > u.y0) ctx.putImageData(img, 0, 0, 0, u.y0, PW, u.y1 - u.y0);
    prev = box && box.y1 > box.y0 ? { y0: box.y0, y1: box.y1 } : null;
    return rings.length;
  };
  return { add, draw, remove: () => cv.remove(), band, x0, x1, count: () => rings.length };
}
async function rises(run, sc, endless = false) {
  if (sc.water[0] <= 0) return; // a pond seen from straight above: flattened rings would look wrong
  const band = waterBand(sc, .1, .95); if (!band) return;
  const { x0, x1 } = waterRect(sc); if (x1 - x0 < 40) return;
  const surface = pond(sc); if (!surface) return;
  let lastDraw = 0; let done = false;
  const drawing = frames(run, (t) => { const now = performance.now(); if (now - lastDraw > 30) { lastDraw = now; surface.draw(now); } return !(done && !surface.count()); });
  let x = rnd(x0, x1); let y = rnd(band[0], band[1]); let heading = rnd(0, Math.PI * 2);
  for (let k = 0; endless || k < Math.round(rnd(4, 8)); k++) {
    if (run.stopped) break;
    const depth = (y - band[0]) / Math.max(1, band[1] - band[0]);
    surface.add(x, y, depth, performance.now());
    if (Math.random() < .25) { await wait(rnd(350, 650), run); surface.add(x + rnd(-6, 6), y + rnd(-2, 2), depth, performance.now()); } // a quick second nip
    // Now and then a second fish rises nearby while the first rings still spread, and the rings cross.
    if (Math.random() < .2) { await wait(rnd(700, 1600), run); const y2 = Math.max(band[0], Math.min(band[1], y + rnd(-14, 14))); surface.add(Math.max(x0, Math.min(x1, x + rnd(-60, 60))), y2, (y2 - band[0]) / Math.max(1, band[1] - band[0]), performance.now()); }
    await wait(rnd(1600, 6500), run);
    // The fish swims on: a wandering line, kept on the water.
    heading += rnd(-.9, .9); const stepPx = rnd(18, 75) * (.6 + depth);
    x += Math.cos(heading) * stepPx; y += Math.sin(heading) * stepPx * .35;
    if (x < x0 || x > x1) { heading = Math.PI - heading; x = Math.max(x0, Math.min(x1, x)); }
    if (y < band[0] || y > band[1]) { heading = -heading; y = Math.max(band[0], Math.min(band[1], y)); }
  }
  done = true; await drawing; surface.remove();
}

// ── The river (Heraclitus): a small curled leaf carried across on the current, each crossing on a new line at a new
// pace, and a few broken reflections drifting the same way, each coming back somewhere new. ──
async function current(run, sc) {
  const band = waterBand(sc, .12, .92); if (!band) return;
  const { x0, x1 } = waterRect(sc); const u = uid(); const span = band[1] - band[0];
  const s = sheet(lightLayer, `<defs><linearGradient id="lt${u}" x2=".8" y2="1"><stop stop-color="#76664c"/><stop offset=".5" stop-color="#514d39"/><stop offset="1" stop-color="#8a7756"/></linearGradient>
    <filter id="sf${u}"><feGaussianBlur stdDeviation=".45"/></filter></defs>
    <g class="flecks" stroke="#ece6cc" stroke-linecap="round" fill="none" filter="url(#sf${u})"></g>
    <g class="leaf" opacity="0"><g class="shape"><path d="M-10 1 Q-5-6 4-3 Q9-2 12 1 Q3 6-4 4Z" fill="url(#lt${u})"/><path d="M-8 2 Q0 0 8 1" fill="none" stroke="#a18a61" stroke-opacity=".25" stroke-width=".55"/><path d="M-10 1l-4-1" stroke="#61543e" stroke-width=".7"/></g></g>`);
  const leaf = s.querySelector('.leaf'); const shape = s.querySelector('.shape');
  const depthAt = (y) => (y - band[0]) / Math.max(1, span);
  const flecks = Array.from({ length: 6 }, () => { const el = document.createElementNS(NS, 'path'); s.querySelector('.flecks').append(el); return { el, q: Math.random() }; });
  const renew = (f) => { f.y = rnd(band[0], band[1]); f.d = depthAt(f.y); f.len = (5 + 12 * f.d) * rnd(.7, 1.3); f.speed = rnd(17, 29) * (1.5 - .6 * f.d); f.ph = rnd(0, 7); };
  flecks.forEach(renew);
  let pass = null;
  const newPass = (t) => { const y = rnd(band[0] + span * .2, band[1]); const d = depthAt(y); pass = { t0: t, dur: rnd(19, 28) * (1.35 - .5 * d), y, d, amp: rnd(1.5, 4) * (.6 + d), ph: rnd(0, 7) }; };
  newPass(-rnd(4000, 9000)); // the first leaf is already partway across, or soon arrives
  let lastT = 0;
  await frames(run, (t) => {
    const dt = (t - lastT) / 1000; lastT = t; const sec = t / 1000;
    let p = (t - pass.t0) / 1000 / pass.dur; if (p >= 1) { newPass(t + rnd(0, 3000)); p = (t - pass.t0) / 1000 / pass.dur; }
    if (p < 0) leaf.setAttribute('opacity', '0');
    else {
      const x = x0 - 30 + (x1 - x0 + 60) * p; const y = pass.y + pass.amp * Math.sin(p * 6 + pass.ph);
      leaf.setAttribute('transform', `translate(${x} ${y}) scale(${.42 + .6 * pass.d})`);
      shape.setAttribute('transform', `rotate(${8 * Math.sin(p * 7 + pass.ph)}) scale(1 ${.55 + .1 * Math.sin(p * 9 + pass.ph)})`);
      leaf.setAttribute('opacity', (.75 * Math.min(1, p * 12, (1 - p) * 12)).toFixed(3));
    }
    for (const f of flecks) {
      f.q += dt / f.speed; if (f.q >= 1) { f.q -= 1; renew(f); }
      const fx = x0 - 20 + (x1 - x0 + 40) * f.q; const fy = f.y + 1.2 * Math.sin(f.q * 7 + f.ph);
      f.el.setAttribute('d', `M${fx} ${fy}q${f.len / 2} -${.5 + f.d * .6} ${f.len} 0`);
      f.el.setAttribute('stroke-width', (.7 + .7 * f.d).toFixed(2));
      f.el.setAttribute('opacity', (.42 * Math.sin(Math.PI * f.q) ** 2 * (.7 + .3 * Math.sin(sec * .7 + f.ph))).toFixed(3));
    }
    return true;
  });
  s.remove();
}

// ── The cave (Plato): no fire to be seen, only its light on the wall beside you and shadows moving through it, never
// clear enough to make out; a cool hint of daylight at the far edge. Light and shadows drift toward new places every
// 9 to 17 seconds. On a painting whose window is on the left, the whole thing is mirrored. ──
async function cavelight(run, sc) {
  const W = innerWidth, H = innerHeight; const u = uid(); const wall = W * .18;
  const s = sheet(lightLayer, `<defs>
    <linearGradient id="cw${u}"><stop stop-color="#b07c44" stop-opacity=".3"/><stop offset="1" stop-color="#b07c44" stop-opacity="0"/></linearGradient>
    <linearGradient id="cd${u}"><stop stop-color="#c4c6b8" stop-opacity="0"/><stop offset="1" stop-color="#c4c6b8" stop-opacity=".09"/></linearGradient>
    <filter id="cb${u}" x="-60%" y="-20%" width="220%" height="140%"><feGaussianBlur stdDeviation="${(W * .012).toFixed(1)} ${(H * .008).toFixed(1)}"/></filter>
    <clipPath id="ce${u}"><rect width="${wall}" height="${H}"/></clipPath></defs>
    <g class="art" opacity="0" ${sc.has('winleft') ? `transform="translate(${W} 0) scale(-1 1)"` : ''}>
      <rect class="light" width="${wall}" height="${H}" fill="url(#cw${u})"/>
      <g clip-path="url(#ce${u})"><g class="shadows" filter="url(#cb${u})" fill="#1e1c19">
        <g transform="scale(${W / 1000} ${H / 1000})">
          <path d="M-45 105Q55 150 35 265T100 510Q40 650 85 795L-45 940Z" opacity=".34"/>
          <path d="M55-40Q105 150 87 340T148 655L170 1040H126Q82 690 92 510T34 140Z" opacity=".2"/></g></g></g>
      <rect x="${W * .94}" width="${W * .06}" height="${H}" fill="url(#cd${u})"/></g>`);
  const art = s.querySelector('.art'); const light = s.querySelector('.light'); const shadows = s.querySelector('.shadows');
  const target = () => ({ x: rnd(-8, 8) * W / 1000, y: rnd(-7, 7) * H / 1000, s: rnd(.97, 1.035), light: rnd(.58, .92), shade: rnd(.65, .95) });
  let a = target(), b = target(), start = 0, dur = rnd(9, 17);
  await frames(run, (t) => {
    const sec = t / 1000; let p = (sec - start) / dur;
    if (p >= 1) { a = b; b = target(); start = sec; dur = rnd(9, 17); p = 0; }
    p = smooth(p); const v = (k) => a[k] + (b[k] - a[k]) * p;
    art.setAttribute('opacity', Math.min(1, sec / 4).toFixed(3));
    light.setAttribute('opacity', (v('light') + .018 * Math.sin(sec * 2.3)).toFixed(3));
    shadows.setAttribute('opacity', v('shade').toFixed(3));
    shadows.setAttribute('transform', `translate(${v('x')} ${v('y')}) scale(${v('s')} 1)`);
    return true;
  });
  s.remove();
}

// ── The evening review (Seneca): the lamp painted in the picture burns, its light on the wall breathing; over thirty
// seconds the room dims as the day is gone over, and then it rests, still. It does not start again by itself. ──
async function lampglow(run, sc) {
  const W = innerWidth, H = innerHeight; const u = uid(); const c = at(sc, sc.wick[0], sc.wick[1]); const R = Math.max(W, H) * .55;
  const s = sheet(lightLayer, `<defs>
    <radialGradient id="lw${u}" cx="${c.x}" cy="${c.y}" r="${R}" gradientUnits="userSpaceOnUse"><stop stop-color="#e0a860" stop-opacity=".34"/><stop offset=".35" stop-color="#c08a4e" stop-opacity=".12"/><stop offset="1" stop-color="#ac7e46" stop-opacity="0"/></radialGradient>
    <radialGradient id="ld${u}" cx="${c.x}" cy="${c.y}" r="${R * 1.3}" gradientUnits="userSpaceOnUse"><stop stop-color="#0a0806" stop-opacity=".25"/><stop offset=".25" stop-color="#0a0806" stop-opacity=".7"/><stop offset="1" stop-color="#0a0806" stop-opacity="1"/></radialGradient></defs>
    <rect class="dusk" width="${W}" height="${H}" fill="url(#ld${u})" opacity="0"/>
    <rect class="wash" width="${W}" height="${H}" fill="url(#lw${u})" opacity="0"/>`);
  const wash = s.querySelector('.wash'); const dusk = s.querySelector('.dusk'); const seed = rnd(0, 100);
  await frames(run, (t) => {
    const sec = Math.min(30, t / 1000); const e = smooth(sec / 30); const settle = 1 - e;
    const breath = .5 * Math.sin(sec * 3.7 + seed) + .3 * Math.sin(sec * 6.13 + seed * 2) + .2 * Math.sin(sec * 10.7 + seed * .7);
    wash.setAttribute('opacity', ((.82 + .12 * breath * settle) * (1 - .85 * e) * Math.min(1, sec / 3)).toFixed(3));
    dusk.setAttribute('opacity', (.42 * e).toFixed(3));
    return t < 30000;
  });
  await restUntilStopped(run); // the review is done; the room stays as it is
  s.remove();
}

// ── The butterfly dream (Zhuangzi): one small brown butterfly near one side of the picture, wandering, wings beating
// unevenly; it is there for a while, then gone, then back on the other side or the same. ──
async function dreamButterfly(run, sc) {
  const W = innerWidth, H = innerHeight; const u = uid();
  const s = sheet(lightLayer, `<defs><linearGradient id="bw${u}"><stop stop-color="#51483a"/><stop offset=".6" stop-color="#827258"/><stop offset="1" stop-color="#645642"/></linearGradient>
    <filter id="bs${u}"><feGaussianBlur stdDeviation=".23"/></filter></defs>
    <g class="pos" opacity="0"><g class="bank" filter="url(#bs${u})" transform="scale(.8)">
      <g class="l" fill="url(#bw${u})"><path d="M-1-1C-5-8-11-11-14-7C-17-2-10 2-2 2Z"/><path d="M-2 1C-11 0-13 5-10 8C-6 11-2 6-1 3Z" fill="#655a45"/><path d="M-5-3Q-8-5-11-5" fill="none" stroke="#aa9670" stroke-opacity=".18" stroke-width="1.1"/></g>
      <g class="r" fill="url(#bw${u})"><path d="M1-1C5-8 11-11 14-7C17-2 10 2 2 2Z"/><path d="M2 1C11 0 13 5 10 8C6 11 2 6 1 3Z" fill="#655a45"/></g>
      <path d="M0-5C-1.3-4-1.2 4 0 7C1.2 4 1.3-4 0-5Z" fill="#39362b"/><path d="M-.4-4Q-3-8-3-9M.4-4Q3-8 3-9" fill="none" stroke="#494333" stroke-width=".45"/></g></g>`);
  const pos = s.querySelector('.pos'); const bank = s.querySelector('.bank'); const L = s.querySelector('.l'); const Rw = s.querySelector('.r');
  let start = 0, dur, side, y0, y1, ph, wph;
  const choose = () => { dur = rnd(15, 24); side = Math.random() < .5 ? -1 : 1; y0 = rnd(.145, .21) * H; y1 = rnd(.135, .235) * H; ph = rnd(0, 7); wph = rnd(0, 30); };
  choose();
  await frames(run, (t) => {
    const sec = t / 1000; let p = (sec - start) / dur; if (p >= 1) { start = sec; p = 0; choose(); }
    const q = (p - .15) / .67; // absent, then a visible passage, then absent again
    if (q <= 0 || q >= 1) { pos.setAttribute('opacity', '0'); return true; }
    const x = (side < 0 ? .105 : .895) * W + (18 * Math.sin(q * 7 + ph) + 7 * Math.sin(q * 19 + ph)) * W / 1000;
    const y = y0 + (y1 - y0) * q + (12 * Math.sin(q * 10 + ph) + 4 * Math.sin(q * 27)) * H / 1000;
    const fade = Math.min(1, q * 7, (1 - q) * 7);
    pos.setAttribute('opacity', (.62 * smooth(fade)).toFixed(3));
    pos.setAttribute('transform', `translate(${x} ${y})`);
    bank.setAttribute('transform', `scale(.8) rotate(${side * 18 + 13 * Math.sin(q * 11 + ph)})`);
    const beat = sec * 2 * Math.PI * 6.1 + .43 * Math.sin(sec * 2.4 + wph) + wph; const open = .14 + .86 * Math.pow((Math.sin(beat) + 1) / 2, .7);
    L.setAttribute('transform', `scale(${open.toFixed(3)} 1)`); Rw.setAttribute('transform', `scale(${Math.max(.12, open * (.94 + .06 * Math.sin(sec * 3))).toFixed(3)} 1)`);
    return true;
  });
  s.remove();
}

// ── Emptiness (Nagarjuna): on a quiet table, a thin cord loops into a loose knot, holds, and lets go again: a knot that
// is only a way the cord lies. One continuous cord through every pose; 24 to 30 seconds a round. ──
async function knot(run, sc) {
  const [lx, ly, ls = 1] = sc.ledge; const base = at(sc, lx, ly); const bottom = Math.min(base.y, dockTop() - 10);
  const straight = [[40, 970], [44, 950], [48, 930], [53, 910], [58, 890], [63, 870], [68, 850], [73, 830], [78, 810], [83, 790], [88, 775]];
  const loop = [[40, 970], [45, 942], [55, 913], [76, 883], [112, 869], [142, 844], [137, 818], [104, 814], [81, 835], [86, 863], [120, 893]];
  const tied = [[40, 970], [45, 941], [59, 902], [84, 858], [123, 842], [143, 854], [133, 880], [99, 887], [75, 868], [90, 838], [116, 786]];
  const spline = (p) => { let d = `M${p[0][0]} ${p[0][1]}`; for (let i = 0; i < p.length - 1; i++) { const a = p[Math.max(0, i - 1)], b = p[i], c = p[i + 1], z = p[Math.min(p.length - 1, i + 2)]; d += `C${b[0] + (c[0] - a[0]) / 6} ${b[1] + (c[1] - a[1]) / 6} ${c[0] - (z[0] - b[0]) / 6} ${c[1] - (z[1] - b[1]) / 6} ${c[0]} ${c[1]}`; } return d; };
  // Drawn as designed for a phone (1000 units = the screen), anchored where the cord's end lies on the table.
  const ns = 'vector-effect="non-scaling-stroke"';
  const s = sheet(lightLayer, `<g class="art" opacity="0" fill="none" stroke-linecap="round" stroke-linejoin="round" transform="translate(${base.x} ${bottom}) scale(${.412 * ls} ${.86 * ls}) translate(-40 -970)">
    <path class="c" stroke="#332c22" stroke-width="2.6" opacity=".22" transform="translate(1 1)" ${ns}/><path class="c" stroke="#8b7e65" stroke-width="1.6" opacity=".62" ${ns}/><path class="c" stroke="#c1af88" stroke-width=".5" opacity=".26" ${ns}/>
    <g class="bridge" opacity="0"><path d="M76 866Q86 857 97 853" stroke="#3c352a" stroke-width="2.7" opacity=".5" ${ns}/><path d="M76 865Q86 856 97 852" stroke="#8b7e65" stroke-width="1.6" opacity=".62" ${ns}/><path d="M77 864Q86 856 96 852" stroke="#c1af88" stroke-width=".5" opacity=".26" ${ns}/></g></g>`);
  const art = s.querySelector('.art'); const cords = [...s.querySelectorAll('.c')]; const bridge = s.querySelector('.bridge');
  let start = 0, dur = rnd(24, 30), strength = rnd(.94, 1);
  await frames(run, (t) => {
    const sec = t / 1000; let p = (sec - start) / dur; if (p >= 1) { start = sec; p = 0; dur = rnd(24, 30); strength = rnd(.94, 1); }
    let a, b, q, k;
    if (p < .12) { a = straight; b = straight; q = 0; k = 0; }
    else if (p < .39) { a = straight; b = loop; q = smooth((p - .12) / .27); k = 0; }
    else if (p < .55) { a = loop; b = tied; q = smooth((p - .39) / .16); k = q; }
    else if (p < .64) { a = tied; b = tied; q = 0; k = 1; }
    else if (p < .79) { a = tied; b = loop; q = smooth((p - .64) / .15); k = 1 - q; }
    else if (p < .96) { a = loop; b = straight; q = smooth((p - .79) / .17); k = 0; }
    else { a = straight; b = straight; q = 0; k = 0; }
    const d = spline(a.map((v, i) => [v[0] + (b[i][0] - v[0]) * q, v[1] + (b[i][1] - v[1]) * q]));
    for (const c of cords) c.setAttribute('d', d);
    bridge.setAttribute('opacity', (k * .7).toFixed(3)); art.setAttribute('opacity', (strength * Math.min(1, sec / 4)).toFixed(3));
    return true;
  });
  s.remove();
}

// ── Some things are up to us (Epictetus): gusts come and go, 10 to 18 seconds each, at their own strength; reeds in the
// corners bend together under them (where the painting has reeds there), and small leaves are carried across. ──
async function gusts(run, sc) {
  const W = innerWidth, H = innerHeight; const u = uid(); const foot = dockTop() + 4; const ux = W / 1000, uy = H / 1000;
  const s = sheet(lightLayer, `<defs><linearGradient id="rg${u}" x2="0" y2="1"><stop stop-color="#3f4a2c" stop-opacity=".85"/><stop offset="1" stop-color="#2f3a24" stop-opacity=".3"/></linearGradient>
    <filter id="rs${u}"><feGaussianBlur stdDeviation=".25"/></filter></defs>
    <g class="art" opacity="0" filter="url(#rs${u})"><g class="reeds" fill="none" stroke="url(#rg${u})" stroke-linecap="round"></g><g class="leaves" fill="#74664b"></g></g>`);
  const art = s.querySelector('.art');
  const reeds = sc.has('reeds') ? Array.from({ length: 16 }, (_, i) => {
    const el = document.createElementNS(NS, 'path'); s.querySelector('.reeds').append(el); el.setAttribute('stroke-width', rnd(.8, 1.6).toFixed(2));
    return { el, x: (i < 8 ? rnd(-15, 190) : rnd(815, 1010)) * ux, h: rnd(45, 117) * uy, lean: rnd(-9, 11) * ux, ph: rnd(0, 7) };
  }) : [];
  const leaves = Array.from({ length: 3 }, (_, i) => {
    const el = document.createElementNS(NS, 'g'); el.innerHTML = '<path d="M-7 0Q-2-4 7-1Q2 4-4 2Z"/>'; el.setAttribute('opacity', '0'); s.querySelector('.leaves').append(el);
    return { el, start: 3 + i * 6, dur: rnd(12, 20), y: foot - rnd(.03, .09) * H, ph: rnd(0, 7) };
  });
  let start = 0, dur = rnd(10, 18), power = rnd(.4, 1);
  await frames(run, (t) => {
    const sec = t / 1000; let p = (sec - start) / dur; if (p >= 1) { start = sec; p = 0; dur = rnd(10, 18); power = rnd(.4, 1); }
    const gust = power * Math.sin(Math.PI * p) ** 2;
    art.setAttribute('opacity', Math.min(1, sec / 4).toFixed(3));
    for (const r of reeds) {
      const bend = (4 + gust * 20 + 1.7 * Math.sin(sec * 1.7 + r.ph) + gust * 2 * Math.sin(sec * 3 + r.ph)) * ux;
      const dx = r.lean + bend * (r.h / (110 * uy)); const y = foot - r.h;
      r.el.setAttribute('d', `M${r.x} ${foot}Q${r.x + dx * .12} ${foot - r.h * .58} ${r.x + dx} ${y}M${r.x + dx * .25} ${foot - r.h * .45}Q${r.x + dx + 9 * ux} ${foot - r.h * .67} ${r.x + dx + 14 * ux} ${foot - r.h * .72}`);
    }
    for (const l of leaves) {
      let q = (sec - l.start) / l.dur;
      if (q >= 1) { l.start = sec + rnd(2, 7); l.dur = rnd(12, 20); l.y = foot - rnd(.03, .09) * H; l.ph = rnd(0, 7); q = -1; }
      if (q < 0) { l.el.setAttribute('opacity', '0'); continue; }
      const x = -35 * ux + 1080 * ux * q; const y = l.y - 22 * uy * Math.sin(Math.PI * q) + 5 * uy * Math.sin(q * 10 + l.ph);
      l.el.setAttribute('transform', `translate(${x} ${y}) rotate(${(15 + 22 * Math.sin(q * 12 + l.ph)).toFixed(1)}) scale(${(ux * 1.1).toFixed(3)} ${(ux * 1.1 * (.35 + .65 * Math.abs(Math.sin(q * 9 + l.ph)))).toFixed(3)})`);
      l.el.setAttribute('opacity', (.5 * Math.sin(Math.PI * q) ** 2).toFixed(3));
    }
    return true;
  });
  s.remove();
}

// ── Sisyphus (Camus): far off on the painted hillside, one small rough stone goes slowly up, waits a moment at the
// crest, and rolls back down; then again. No figure: only the stone. 23 to 30 seconds a round, three quarters of it
// the climb. Only where a painting has a ridge marked for it (hill: [[foot x, y], [top x, y]]). ──
async function sisyphus(run, sc) {
  const [a, b] = sc.hill.map(([x, y]) => at(sc, x, y));
  const s = sheet(layer, `<g class="pos" opacity="0"><ellipse cx="0" cy="2" rx="3" ry=".6" fill="#3c3930" opacity=".25"/>
    <g class="stone"><path d="M-2.2 1.1L-2.4-.5-1-2.1.9-2.3 2.3-.9 2 1.2.5 2-1.1 1.9Z" fill="#3a372f"/><path d="M-1.7-.6L-.8-1.7.7-1.8 1.5-1 .1-.5Z" fill="#85806c" opacity=".35"/></g></g>`, 'sisy');
  const pos = s.querySelector('.pos'); const stone = s.querySelector('.stone');
  const route = (u) => ({ x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u - 4 * Math.sin(Math.PI * u) });
  let start = 0, dur = rnd(23, 30), turn = rnd(-12, 12);
  await frames(run, (t) => {
    const sec = t / 1000; let p = (sec - start) / dur; if (p >= 1) { start = sec; p = 0; dur = rnd(23, 30); turn = rnd(-12, 12); }
    let u; let hop = 0;
    if (p < .76) u = 1 - Math.pow(1 - p / .76, 1.14);
    else if (p < .81) u = 1;
    else { const q = (p - .81) / .19; u = 1 - smooth(q); hop = Math.abs(Math.sin(q * 16)) * 1.6 * (1 - q); } // it bounces a little on the way down
    const r = route(u);
    pos.setAttribute('transform', `translate(${r.x.toFixed(2)} ${(r.y - 1.5 - hop).toFixed(2)})`);
    stone.setAttribute('transform', `rotate(${(-u * 920 + turn).toFixed(1)})`);
    pos.setAttribute('opacity', (.85 * Math.min(1, sec / 5)).toFixed(3));
    return true;
  });
  s.remove();
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
// Only visitors whose silhouettes read as real: birds, butterflies, bees, falling leaves (and light: rays, ripples,
// writing, equations); a sailboat only far off, a spider only in dark woods. Dragonflies, inchworms, caterpillars and
// fish were retired.
const VISITORS = [
  { name: 'sailboat', fn: sailboat, w: 1.5, ok: (s) => s.has('sea') && s.has('boats') && s.water && !s.has('city') }, // far off only
  { name: 'spider', fn: spider, w: .8, ok: (s) => s.canopy && s.has('dark') && s.has('garden') }, // dark woods and gardens only
  { name: 'bird', fn: bird, w: 1.5, ok: (s) => s.has('sky') },
  { name: 'flock', fn: flock, w: 1.3, ok: (s) => s.has('sky') },
  { name: 'ducks', fn: ducks, w: 2, ok: (s) => s.has('lake') && s.water },
  { name: 'egret', fn: egret, w: 1.5, ok: (s) => (s.has('lake') || s.has('sea')) && s.water },
  { name: 'sandpipers', fn: sandpipers, w: 2.5, ok: (s) => s.has('beach') && s.shore },
  { name: 'rises', fn: (run, sc) => rises(run, sc, false), w: 2, ok: (s) => (s.has('lake') || s.has('sea')) && s.water && s.water[0] > 0 && !s.has('city') && !s.has('marsh') }, // a fish nipping the surface
  { name: 'leaves', fn: leaves, w: 2, ok: (s) => s.canopy || s.has('garden') },
  { name: 'butterfly', fn: butterfly, w: 2, ok: (s) => s.flowers || (s.has('garden') && s.has('sky')) },
  { name: 'bees', fn: bees, w: 2, ok: (s) => s.flowers },
  { name: 'hummingbird', fn: hummingbird, w: 2, ok: (s) => s.flowers },
  { name: 'rays', fn: rays, w: 2.5, ok: (s) => s.rays },
  { name: 'ripples', fn: ripples, w: 2, ok: (s) => (s.has('lake') || s.has('sea')) && s.water },
  { name: 'writing', fn: writing, w: 3, ok: (s) => s.paper },
  { name: 'equations', fn: equations, w: 3, ok: (s) => s.board || s.chart },
];
let last = null;
async function go(v, sc) {
  layer.classList.toggle('dark', sc.has('dark')); perch.classList.toggle('dark', sc.has('dark'));
  const run = active = { stopped: false, raf: 0, cancel: [] }; const t0 = performance.now();
  try { await v.fn(run, sc); } catch { /* a visitor never breaks the page */ }
  // A passage that found nowhere to draw at this size (the water cropped away with the phone turned) is not retried
  // until the size changes.
  if (String(v.name).startsWith('passage:') && !run.stopped && performance.now() - t0 < 1500) unfit = `${innerWidth}x${innerHeight}`;
  if (active === run) active = null;
  schedule();
}
function visit() {
  timer = 0;
  if (!layer || active || reduced() || busy()) return schedule(passage ? 3000 : 15000);
  const sc = scene();
  // While a passage is open and its visitor fits the painting, it is the one that comes (and comes back).
  const pv = passage && PASSAGES[passage];
  if (pv && unfit !== `${innerWidth}x${innerHeight}` && pv.ok(sc)) { last = `passage:${passage}`; return go({ name: last, fn: pv.fn }, sc); }
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
  const pv = passage && PASSAGES[passage]; const soon = pv && layer && unfit !== `${innerWidth}x${innerHeight}` && pv.ok(scene()); // an open passage's visitor comes straight back
  timer = setTimeout(visit, ms ?? (soon ? 1200 : still ? rnd(12000, 26000) : rnd(28000, 55000)));
}
function shoo() {
  if (!active) return;
  active.stopped = true; cancelAnimationFrame(active.raf); active.cancel.forEach((f) => f());
  layer.replaceChildren(); lightLayer.replaceChildren(); perch.replaceChildren(); active = null;
}

// Starts the visits, the first after about ten seconds. The page stays the same if this is never called.
export function startCreatures() {
  if (layer) return;
  layer = document.createElement('div'); layer.id = 'creatures'; layer.setAttribute('aria-hidden', 'true');
  lightLayer = document.createElement('div'); lightLayer.id = 'creatures-light'; lightLayer.setAttribute('aria-hidden', 'true');
  const motif = document.getElementById('motif'); if (motif) motif.after(layer, lightLayer); else document.body.prepend(layer, lightLayer);
  perch = document.createElement('div'); perch.id = 'creatures-perch'; perch.setAttribute('aria-hidden', 'true'); document.body.append(perch);
  // Away and back, or the phone turned: the visitor leaves, and the visits (and an open passage's own) start again.
  document.addEventListener('visibilitychange', () => { if (document.hidden) shoo(); else schedule(); });
  addEventListener('resize', () => { shoo(); schedule(); });
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
  const sc = scene(); const wet = ['sailboat', 'ducks', 'egret', 'ripples', 'sandpipers', 'fish'].includes(name);
  if (wet && !sc.water) sc.water = [.6, .88]; if (wet && !sc.shore) sc.shore = .8; if (!sc.trunks) sc.trunks = [{ x: .3, y0: .15, y1: .6 }]; if (!sc.flowers) sc.flowers = [.2, .7, .8, .88]; if (!sc.canopy) sc.canopy = [.15, .05, .85, .3];
  if (!sc.paper) sc.paper = [.3, .78, .7, .88]; if (!sc.board && !sc.chart) sc.board = [.15, .2, .7, .34]; if (!sc.rays) sc.rays = { x: .3, y: 0, a: 15 };
  go(v, sc);
}
export const VISITOR_NAMES = VISITORS.map((v) => v.name);

// A painting where this visitor belongs (bright ones first), for a link that asks to see it: '/img/....webp' or null.
export function sceneFor(name) {
  const v = VISITORS.find((x) => x.name === name); if (!v) return null;
  const fits = Object.entries(SCENES).filter(([, s]) => v.ok({ ...s, has: (k) => s.k.split(' ').includes(k) })).map(([key]) => key);
  const bright = fits.filter((k) => k.startsWith('bright/'));
  const pool = bright.length ? bright : fits;
  return pool.length ? `/img/${pool[Math.floor(Math.random() * pool.length)]}.webp` : null;
}

// ── Passage visitors: while a story is open, a visitor that belongs to it (the drowning child's pond, Heraclitus's
// river, Plato's cave, Seneca's lamp, Zhuangzi's butterfly, Epictetus's wind, Sisyphus's hill), for as long as the
// story stays, on a painting where it fits. ──
const water = (s) => (s.has('lake') || s.has('sea')) && s.water && !s.has('city');
const PASSAGES = {
  singer_drowning_child: { fn: (run, sc) => rises(run, sc, true), ok: (s) => water(s) && s.has('lake') && !s.has('marsh') && s.water[0] > 0 },
  heraclitus_same_river: { fn: current, ok: (s) => water(s) && s.has('lake') && s.water[0] > 0 && s.water[1] - s.water[0] > .12 },
  plato_cave: { fn: cavelight, ok: (s) => s.has('walls') }, // a plain wall at the side, no window there
  seneca_evening_review: { fn: lampglow, ok: (s) => Boolean(s.wick) }, // a painted lamp or candle to burn
  zhuangzi_butterfly_dream: { fn: dreamButterfly, ok: (s) => s.flowers || (s.has('garden') && s.has('sky')) },
  nagarjuna_emptiness: { fn: knot, ok: (s) => Boolean(s.ledge) }, // a quiet table for the cord
  epictetus_up_to_us: { fn: gusts, ok: (s) => s.has('reeds') },
  camus_myth_of_sisyphus: { fn: sisyphus, ok: (s) => Boolean(s.hill) },
};
// The paintings a passage's visitor fits ('/img/....webp'); [] when it has none.
export function passagePaintings(id) {
  const p = PASSAGES[id]; if (!p) return [];
  return Object.entries(SCENES).filter(([, s]) => p.ok({ ...s, has: (k) => s.k.split(' ').includes(k) })).map(([key]) => `/img/${key}.webp`);
}
let passageTimer = 0;
// Start the passage's visitor on the painting now showing (after a moment, once the story has settled). false if none fits.
export function startPassage(id) {
  clearTimeout(passageTimer); passage = PASSAGES[id] ? id : null; unfit = '';
  const p = PASSAGES[id]; if (!p || !layer || reduced()) return false;
  passageTimer = setTimeout(() => {
    const sc = scene(); if (!p.ok(sc)) return;
    shoo(); clearTimeout(timer); last = `passage:${id}`;
    go({ name: last, fn: p.fn }, sc);
  }, 2200);
  return true;
}
// For a link to one passage: whether its visitor can move here. 'still': the phone asks for no motion; null: none.
export function passageStatus(id) { return PASSAGES[id] ? (reduced() ? 'still' : 'ok') : null; }
export function stopPassage() { clearTimeout(passageTimer); passage = null; if (active && String(last ?? '').startsWith('passage:')) shoo(); }
