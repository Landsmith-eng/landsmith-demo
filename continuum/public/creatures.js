// Small visitors on the pictures, chosen to fit what each painting holds (see scenes.js): a sailboat crossing the sea
// on the horizon, sandpipers running at the water's edge, a school of fish; ducks paddling and an egret wading on a
// lake or river, a fish turning under the surface; a cat wandering, a bird landing to peck, birds passing over;
// caterpillars, inchworms, a dragonfly, and a spider building a small web and letting itself down on a thread.
// They are faint, see-through shapes blended into the painting (shadows on a light picture, a soft light on a dark
// one), behind the words, never in the way of a tap. One at a time, and more often while the reader sits still with a
// page: a small thing to watch while thinking. None while the phone asks to reduce motion, while the tab is hidden,
// or while the map or a picture fills the screen.
import { SCENES, DEFAULT_SCENE } from '/scenes.js';

const NS = 'http://www.w3.org/2000/svg';
const INK = 'rgba(16, 20, 18, .78)';
const rnd = (a, b) => a + Math.random() * (b - a);
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const busy = () => document.hidden || document.documentElement.matches('.map-full, .gazing') || document.querySelector('.tour, .intro');

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
// The water's band on the screen, kept above the menu.
function waterBand(sc, from = 0, to = 1) {
  const [a, b] = sc.water; const top = imgY(a + (b - a) * from, sc); const bottom = Math.min(imgY(a + (b - a) * to, sc), dockTop() - 12);
  return bottom > top + 8 ? [top, bottom] : null;
}

// ── The cat: walks in along the top of the menu, stops to look about (tail swaying), walks on. ──
async function cat(run) {
  const leg = (x, cls) => `<line class="${cls}" x1="${x}" y1="38" x2="${x}" y2="60" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;
  const el = svg('0 0 120 66', 104, `
    <g class="cat">
      <path class="tail" d="M27 32 C12 30 6 14 15 5" fill="none" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>
      ${leg(33, 'leg a')}${leg(40, 'leg b')}${leg(74, 'leg b')}${leg(80, 'leg a')}
      <ellipse cx="56" cy="36" rx="30" ry="11.5" fill="${INK}"/>
      <path d="M78 30 C82 22 86 18 92 18 L92 34 C86 36 81 36 78 34Z" fill="${INK}"/>
      <circle class="head" cx="93" cy="23" r="9.5" fill="${INK}"/>
      <path d="M86 17 L87.5 7 L93 14Z M95 14 L100 6.5 L101 17Z" fill="${INK}"/>
    </g>`);
  el.classList.add('creature', 'walker');
  const right = Math.random() < .5;
  if (!right) el.style.setProperty('--flip', '-1');
  layer.append(el);
  const w = innerWidth; const y = dockTop() - 104 * 61 / 120; // paws on the top edge of the menu
  const from = right ? -100 : w + 10; const to = right ? w + 10 : -100; const stop = rnd(.3, .65);
  const at = (k) => from + (to - from) * k;
  el.style.top = `${y}px`;
  const walk = (k0, k1, ms) => frames(run, (t) => { const k = Math.min(1, t / ms); el.style.transform = `translateX(${at(k0 + (k1 - k0) * k)}px)`; return k < 1; });
  const dur = Math.abs(to - from) * 26; // about 38 px a second
  await walk(0, stop, dur * stop);
  el.classList.add('still'); await wait(rnd(2500, 4500), run); el.classList.remove('still');
  await walk(stop, 1, dur * (1 - stop));
  el.remove();
}

// ── A bird: flies in on a curve, lands on the top edge of the menu, pecks, hops, and flies off. ──
async function bird(run) {
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

// ── The dragonfly: darts in, circles and hovers over the upper part of the picture, and darts away. ──
async function dragonfly(run) {
  const wing = (cx, cy, rot) => `<ellipse class="dw" cx="${cx}" cy="${cy}" rx="10.5" ry="3" transform="rotate(${rot} ${cx} ${cy})" fill="rgba(235,245,255,.42)" stroke="rgba(16,20,18,.55)" stroke-width=".6"/>`;
  const el = svg('0 0 50 50', 50, `
    <g class="dragon">
      ${wing(15, 17, -8)}${wing(35, 17, 8)}${wing(15.5, 23, 10)}${wing(34.5, 23, -10)}
      <line x1="25" y1="11" x2="25" y2="45" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>
      <ellipse cx="25" cy="17" rx="3.2" ry="5" fill="${INK}"/>
      <circle cx="25" cy="9" r="3.4" fill="${INK}"/>
    </g>`);
  el.classList.add('creature', 'darter');
  layer.append(el);
  const W = innerWidth, H = innerHeight;
  const c = { x: rnd(W * .3, W * .7), y: rnd(H * .18, H * .45) }; const R = rnd(45, 80);
  let x = Math.random() < .5 ? -50 : W + 10, y = rnd(H * .1, H * .5), heading = 0;
  const steer = (tx, ty, speed) => {
    const dx = tx - x, dy = ty - y, d = Math.hypot(dx, dy) || 1;
    const s = Math.min(speed, d); x += (dx / d) * s; y += (dy / d) * s;
    heading = Math.atan2(dy, dx) * 180 / Math.PI + 90;
    el.style.transform = `translate(${x - 20}px, ${y - 20}px) rotate(${heading}deg)`;
    return d;
  };
  await frames(run, () => steer(c.x + R, c.y, 7) > 2);
  const laps = rnd(1.4, 2.4); let a = 0; let hover = 0;
  await frames(run, (t) => {
    if (hover > 0) { hover--; el.style.transform = `translate(${x - 20 + Math.sin(t / 60)}px, ${y - 20}px) rotate(${heading}deg)`; return true; }
    if (Math.random() < .006) hover = Math.round(rnd(40, 110));
    a += .028; const r = R * (1 + .25 * Math.sin(a * 3));
    steer(c.x + Math.cos(a) * r, c.y + Math.sin(a) * r * .7, 6);
    return a < laps * Math.PI * 2;
  });
  const out = { x: Math.random() < .5 ? -60 : W + 60, y: rnd(-40, H * .3) };
  await frames(run, () => steer(out.x, out.y, 9) > 2);
  el.remove();
}

// ── A school of fish: twenty or so, swimming together through the sea in a slow wave. Drawn on one canvas. ──
async function school(run, sc) {
  const band = waterBand(sc, .25, 1); if (!band) return;
  const W = innerWidth, H = innerHeight; const dpr = Math.min(devicePixelRatio || 1, 2);
  const cv = document.createElement('canvas'); cv.className = 'creature school';
  cv.width = W * dpr; cv.height = H * dpr; cv.style.width = `${W}px`; cv.style.height = `${H}px`;
  layer.append(cv);
  const g = cv.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0);
  const right = Math.random() < .5; const base = rnd(band[0] + 30, Math.max(band[0] + 31, band[1] - 30)); const amp = Math.min(30, (band[1] - band[0]) / 4);
  const n = Math.round(rnd(14, 26));
  const fishes = Array.from({ length: n }, () => ({ dx: rnd(-90, 70), dy: rnd(-26, 26), len: rnd(11, 18), ph: rnd(0, 6.28), sp: rnd(.8, 1.3) }));
  const span = W + 320; const ms = span / rnd(.045, .07);
  await frames(run, (t) => {
    const k = Math.min(1, t / ms); const lead = right ? -160 + span * k : W + 160 - span * k;
    g.clearRect(0, 0, W, H);
    for (const f of fishes) {
      const x = lead + (right ? f.dx : -f.dx) + Math.sin(t / 900 * f.sp + f.ph) * 6;
      const y = base + f.dy + Math.sin((x / 170) + t / 2600) * amp + Math.cos(t / 700 * f.sp + f.ph) * 3;
      const ang = Math.atan2(Math.cos((x / 170) + t / 2600) * amp / 170 * (right ? 1 : -1), right ? 1 : -1);
      const wag = Math.sin(t / 110 * f.sp + f.ph) * .45; const L = f.len;
      g.save(); g.translate(x, y); g.rotate(ang); g.fillStyle = 'rgba(16,24,26,1)'; g.globalAlpha = .9;
      g.beginPath(); g.ellipse(0, 0, L / 2, L / 6.5, 0, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.moveTo(-L / 2 + 1, 0); g.lineTo(-L / 2 - L * .32, -L * .2 + wag * 3); g.lineTo(-L / 2 - L * .32, L * .2 + wag * 3); g.closePath(); g.fill();
      g.restore();
    }
    return k < 1;
  });
  cv.remove();
}

// ── One fish, under the surface: comes into view, wanders and turns, and sinks out of sight. ──
async function fishOne(run, sc) {
  const band = waterBand(sc, .2, 1); if (!band) return;
  const W = innerWidth; const L = rnd(26, 40);
  const el = svg('0 0 44 18', L, `<g class="onefish"><path class="tailfin" d="M9 9 L1 3 L2.5 9 L1 15Z" fill="${INK}"/><ellipse cx="23" cy="9" rx="14" ry="5" fill="${INK}"/><path d="M20 4.5 L25 1.5 L27 5Z" fill="${INK}"/></g>`);
  el.classList.add('creature', 'swimmer', 'gone'); layer.append(el);
  let x = rnd(W * .15, W * .85), y = rnd(band[0] + 10, band[1] - 10), heading = Math.random() < .5 ? 0 : Math.PI; let target = null; let rest = 0;
  const place = () => { el.style.transform = `translate(${x - L / 2}px, ${y - L * .2}px) rotate(${heading}rad)`; };
  place(); await wait(50, run); el.style.transition = 'opacity 2.5s ease'; el.classList.remove('gone');
  const until = rnd(18000, 28000);
  await frames(run, (t) => {
    if (rest > 0) { rest--; return t < until; }
    if (!target || Math.hypot(target.x - x, target.y - y) < 6) {
      target = { x: Math.max(20, Math.min(W - 20, x + rnd(-140, 140))), y: rnd(band[0] + 8, band[1] - 8) };
      if (Math.random() < .35) rest = Math.round(rnd(40, 120));
    }
    const want = Math.atan2(target.y - y, target.x - x); let turn = want - heading;
    while (turn > Math.PI) turn -= 2 * Math.PI; while (turn < -Math.PI) turn += 2 * Math.PI;
    heading += Math.max(-.04, Math.min(.04, turn));
    x += Math.cos(heading) * .45; y += Math.sin(heading) * .3; place();
    return t < until;
  });
  await fadeOut(el, run); el.remove();
}

// ── A sailboat: crosses the water slowly near the horizon, heeling a little; nearer boats are larger. ──
async function sailboat(run, sc) {
  const band = waterBand(sc, 0, 1); if (!band) return;
  const depth = rnd(.02, .28); const yb = band[0] + (band[1] - band[0]) * depth;
  const w = 15 + 40 * depth; const h = w * 44 / 40;
  const el = svg('0 0 40 44', w, `<g class="boat">
    <path d="M21 4 L21 33 L35 32Z" fill="rgba(252,250,242,.95)"/><path d="M19 8 L19 33 L7 32Z" fill="rgba(240,238,228,.85)"/>
    <line x1="20" y1="3" x2="20" y2="34" stroke="rgba(50,48,44,.8)" stroke-width="1"/>
    <path d="M3 34 L37 34 L32 40 L8 40Z" fill="rgba(46,48,50,.85)"/></g>`);
  el.classList.add('creature', 'sail'); const right = Math.random() < .5; if (!right) el.style.setProperty('--flip', '-1');
  lightLayer.append(el);
  const W = innerWidth; const speed = rnd(.009, .016) * (.6 + depth * 2); const from = right ? -w : W; const dist = W + w;
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
async function inchworm(run) {
  const L = 28; const d = 15;
  const el = svg('0 0 60 30', 60, `<g class="inch"><path d="" fill="none" stroke="${INK}" stroke-width="3.6" stroke-linecap="round"/><circle r="2.4" fill="${INK}"/></g>`);
  el.classList.add('creature', 'crawler', 'gone'); const right = Math.random() < .5;
  layer.append(el);
  const X = (v) => (right ? v : 60 - v); // drawn mirrored when going left (its outline changes every frame, so no flip)
  const path = el.querySelector('path'); const head = el.querySelector('circle'); const W = innerWidth;
  let x = rnd(W * .1, W * .7); const y = dockTop() - 28; let b = 4; let f = b + L;
  await wait(50, run); el.style.transition = 'opacity 2s ease'; el.classList.remove('gone');
  const until = rnd(18000, 26000); const P = 1700; let cycles = 0;
  await frames(run, (t) => {
    const c = Math.floor(t / P); const p = (t % P) / P;
    if (c > cycles) { cycles = c; x += (right ? 1 : -1) * d; } // a step done: the worm moved on by d
    let bb, ff;
    if (p < .5) { bb = b + d * (p / .5); ff = f; } else { bb = b + d; ff = f + d * ((p - .5) / .5); }
    const chord = ff - bb; const hgt = Math.sqrt(Math.max(0, (L / 2) ** 2 - (chord / 2) ** 2)) * 1.9;
    path.setAttribute('d', `M${X(bb)} 26 Q${X((bb + ff) / 2)} ${26 - 2 * hgt} ${X(ff)} 26`);
    head.setAttribute('cx', String(X(ff + 1))); head.setAttribute('cy', String(25 - (p > .5 && p < .9 ? 2 : 0)));
    el.style.transform = `translate(${x}px, ${y}px)`;
    return t < until;
  });
  await fadeOut(el, run); el.remove();
}

// ── A spider: spins a small web near the top of the page (spokes, then the spiral), lets itself down on a thread,
// sways, climbs back, and the web fades. ──
async function spider(run) {
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
  const left = Math.random() < .5; const x = left ? rnd(6, W * .22) : rnd(W * .62, W - size - 6); const y = rnd(64, 120);
  el.style.transform = `translate(${x}px, ${y}px)`;
  const bug = el.querySelector('.spider'); const silk = el.querySelector('.silk');
  const at = (px, py) => { bug.style.transform = `translate(${px}px, ${py}px)`; }; // a style, since the stylesheet sets these groups' transform
  const draw = async (p, ms, follow) => {
    const len = p.getTotalLength(); p.style.strokeDasharray = `${len}`; p.style.strokeDashoffset = `${len}`;
    await frames(run, (t) => { const k = Math.min(1, t / ms); p.style.strokeDashoffset = String(len * (1 - k)); if (follow) { const q = p.getPointAtLength(len * k); at(q.x, q.y); } return k < 1; });
  };
  at(cx, cy);
  for (const p of el.querySelectorAll('.spoke')) { p.style.strokeDasharray = '999'; p.style.strokeDashoffset = '999'; }
  for (const p of el.querySelectorAll('.spoke')) await draw(p, rnd(380, 600), true);
  await draw(el.querySelector('.spiral'), rnd(5000, 7000), true);
  at(cx, cy); await wait(rnd(1200, 2500), run);
  // Down on a thread, a sway, and back up.
  await frames(run, (t) => { const k = Math.min(1, t / 5500); const yy = cy + drop * (1 - (1 - k) ** 2); silk.setAttribute('y2', String(yy)); at(cx, yy); return k < 1; });
  await frames(run, (t) => { const sw = Math.sin(t / 700) * 3 * (1 - t / 3500); silk.setAttribute('x2', String(cx + sw)); at(cx + sw, cy + drop); return t < 3500; });
  await frames(run, (t) => { const k = Math.min(1, t / 4500); const yy = cy + drop * (1 - k); silk.setAttribute('y2', String(yy)); silk.setAttribute('x2', String(cx)); at(cx, yy); return k < 1; });
  await wait(rnd(1500, 3000), run);
  await fadeOut(el, run, 3000); el.remove();
}

// Who may visit which picture, and how often (weights).
const VISITORS = [
  { name: 'cat', fn: cat, w: 1.5, ok: (s) => s.has('out') || s.has('in') },
  { name: 'bird', fn: bird, w: 1.5, ok: (s) => s.has('out') || s.has('garden') },
  { name: 'flock', fn: flock, w: 1.3, ok: (s) => s.has('sky') },
  { name: 'dragonfly', fn: dragonfly, w: 1, ok: (s) => s.has('garden') || s.has('lake') },
  { name: 'fish', fn: school, w: 2, ok: (s) => s.has('sea') && s.water },
  { name: 'onefish', fn: fishOne, w: 1.5, ok: (s) => (s.has('lake') || s.has('sea')) && s.water },
  { name: 'sailboat', fn: sailboat, w: 3, ok: (s) => s.has('boats') && s.water },
  { name: 'ducks', fn: ducks, w: 2, ok: (s) => s.has('lake') && s.water },
  { name: 'egret', fn: egret, w: 1.5, ok: (s) => (s.has('lake') || s.has('sea')) && s.water },
  { name: 'sandpipers', fn: sandpipers, w: 2.5, ok: (s) => s.has('beach') && s.shore },
  { name: 'caterpillar', fn: caterpillar, w: 1, ok: (s) => s.has('garden') },
  { name: 'inchworm', fn: inchworm, w: 1, ok: (s) => s.has('garden') },
  { name: 'spider', fn: spider, w: 1, ok: (s) => s.has('in') || s.has('garden') },
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
  timer = setTimeout(visit, ms ?? (still ? rnd(4000, 11000) : rnd(16000, 34000)));
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
// For trying a visitor on a page: summon('sailboat'), and so on (it comes even where it would not belong).
export function summon(name) {
  const v = VISITORS.find((x) => x.name === name); if (!v || !layer) return;
  shoo(); clearTimeout(timer); last = null;
  const sc = scene(); if (!sc.water) sc.water = [.6, .95]; if (!sc.shore) sc.shore = .8;
  go(v, sc);
}
export const VISITOR_NAMES = VISITORS.map((v) => v.name);
