// Small visitors on the pictures: a cat wandering along the bottom, a school of fish swimming across, a bird flying in
// to land, a dragonfly circling. They are faint, see-through shapes blended into the painting (by day they darken it
// like a shadow; by night they lighten it like a reflection), behind the text, never in the way of a tap. One at a
// time, every half minute or so; fish come more often over water. None while the phone asks to reduce motion, while
// the tab is hidden, or while the map or a picture fills the screen.

const NS = 'http://www.w3.org/2000/svg';
const INK = 'rgba(16, 20, 18, .78)';
const rnd = (a, b) => a + Math.random() * (b - a);
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const busy = () => document.hidden || document.documentElement.matches('.map-full, .gazing') || document.querySelector('.tour, .intro');

let layer = null; let timer = 0; let active = null;
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

// ── The bird: flies in on a curve, lands on the top edge of the menu, pecks, hops, and flies off. ──
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
  for (let i = 0; i < 2 + Math.round(rnd(0, 2)); i++) {
    await wait(rnd(700, 1600), run);
    el.classList.add('peck'); await wait(260, run); el.classList.remove('peck');
  }
  await wait(rnd(500, 1200), run);
  const hop = right ? 14 : -14; land.x += hop;
  el.classList.add('hop'); place(land.x, land.y); await wait(320, run); el.classList.remove('hop');
  await wait(rnd(900, 2000), run);
  el.classList.replace('perched', 'flying');
  const away = { x: right ? W + 60 : -80, y: rnd(-80, innerHeight * .15) };
  await curve(land, { x: land.x + (right ? 60 : -60), y: land.y - 40 }, away, rnd(2600, 3400), (k) => k * k);
  el.remove();
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
  // In, to the edge of its circle.
  await frames(run, () => steer(c.x + R, c.y, 7) > 2);
  // Round and round, with pauses to hover.
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

// ── A school of fish: twenty or so, swimming together across the lower part of the picture in a slow wave, each
// with its own small wander and a flick of the tail. Drawn on one canvas. ──
async function fish(run) {
  const W = innerWidth, H = innerHeight; const dpr = Math.min(devicePixelRatio || 1, 2);
  const cv = document.createElement('canvas'); cv.className = 'creature school';
  cv.width = W * dpr; cv.height = H * dpr; cv.style.width = `${W}px`; cv.style.height = `${H}px`;
  layer.append(cv);
  const g = cv.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0);
  const right = Math.random() < .5; const base = rnd(H * .45, H * .78); const amp = rnd(14, 34);
  const n = Math.round(rnd(14, 26));
  const school = Array.from({ length: n }, () => ({ dx: rnd(-90, 70), dy: rnd(-34, 34), len: rnd(11, 18), ph: rnd(0, 6.28), sp: rnd(.8, 1.3) }));
  const span = W + 320; const ms = span / rnd(.045, .07); // 45 to 70 px a second
  const fill = night() ? 'rgba(235,242,236,1)' : 'rgba(16,24,26,1)';
  await frames(run, (t) => {
    const k = Math.min(1, t / ms); const lead = right ? -160 + span * k : W + 160 - span * k;
    g.clearRect(0, 0, W, H);
    for (const f of school) {
      const x = lead + (right ? f.dx : -f.dx) + Math.sin(t / 900 * f.sp + f.ph) * 6;
      const y = base + f.dy + Math.sin((x / 170) + t / 2600) * amp + Math.cos(t / 700 * f.sp + f.ph) * 3;
      const ang = Math.atan2(Math.cos((x / 170) + t / 2600) * amp / 170 * (right ? 1 : -1), right ? 1 : -1);
      const wag = Math.sin(t / 110 * f.sp + f.ph) * .45; const L = f.len;
      g.save(); g.translate(x, y); g.rotate(ang); g.fillStyle = fill; g.globalAlpha = .9;
      g.beginPath(); g.ellipse(0, 0, L / 2, L / 6.5, 0, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.moveTo(-L / 2 + 1, 0); g.lineTo(-L / 2 - L * .32, -L * .2 + wag * 3); g.lineTo(-L / 2 - L * .32, L * .2 + wag * 3); g.closePath(); g.fill();
      g.restore();
    }
    return k < 1;
  });
  cv.remove();
}

const night = () => { const hr = new Date().getHours(); return hr < 7 || hr >= 17; };
const overWater = () => /sea|sail|beach|lake|coast|river|bay|harbou?r|fish|regatta|pond|rain|bridge/i.test(document.querySelector('#wallpaper img')?.src ?? '');
const VISITORS = [cat, fish, bird, dragonfly];
let last = null;
async function visit() {
  timer = 0;
  if (!layer || active || reduced() || busy()) return schedule(20000);
  const pick = VISITORS.filter((v) => v !== last); if (overWater() && last !== fish) pick.push(fish, fish);
  const who = pick[Math.floor(Math.random() * pick.length)]; last = who;
  layer.classList.toggle('night', night());
  const run = active = { stopped: false, raf: 0, cancel: [] };
  try { await who(run); } catch { /* a visitor never breaks the page */ }
  if (active === run) active = null;
  schedule();
}
function schedule(ms = rnd(22000, 50000)) { clearTimeout(timer); timer = setTimeout(visit, ms); }
function shoo() {
  if (!active) return;
  active.stopped = true; cancelAnimationFrame(active.raf); active.cancel.forEach((f) => f());
  layer.replaceChildren(); active = null;
}

// Starts the visits: the first after about half a minute. The page stays the same if this is never called.
export function startCreatures() {
  if (layer) return;
  layer = document.createElement('div'); layer.id = 'creatures'; layer.setAttribute('aria-hidden', 'true');
  const motif = document.getElementById('motif'); if (motif) motif.after(layer); else document.body.prepend(layer);
  document.addEventListener('visibilitychange', () => { if (document.hidden) shoo(); });
  addEventListener('resize', shoo);
  schedule(rnd(8000, 16000));
}
// For testing on a page: bring one now ('cat', 'fish', 'bird' or 'dragonfly').
export function summon(name) { shoo(); clearTimeout(timer); last = null; const v = { cat, bird, dragonfly, fish }[name]; if (!v || !layer) return; layer.classList.toggle('night', night()); const run = active = { stopped: false, raf: 0, cancel: [] }; v(run).finally(() => { if (active === run) active = null; schedule(); }); }
