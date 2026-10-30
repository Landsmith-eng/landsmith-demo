// The living painting: small parts of the picture itself move, a little and never quite the same way twice. A sailboat
// rocks on the water, a branch or the laundry sways in the wind (now and then a gust), sunflowers and reeds nod, a
// sleeping cat breathes, a pigeon dips its head, a candle flickers, a waterwheel turns. Each part is a soft-edged
// copy of that spot of the painting, laid exactly over it and moved by a pixel or two, so the painting seems to stir.
// The parts are listed per painting in scenes.js (live). Nothing moves while the phone asks to reduce motion.
import { SCENES } from '/scenes.js';

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
let wall = null; let wrap = null; let parts = []; let raf = 0; let shown = '';

// Smooth randomness: a few slow waves at random speeds, added together, between about -1 and 1.
function noise() {
  const w = Array.from({ length: 3 }, (_, i) => ({ f: (0.35 + Math.random() * 0.5) * (i + 1) / 1000, p: Math.random() * 6.28, a: 1 / (i + 1) }));
  const sum = w.reduce((s, x) => s + x.a, 0);
  return (t) => w.reduce((s, x) => s + x.a * Math.sin(t * x.f + x.p), 0) / sum;
}
// Now and then a gust or a quick movement: a random moment, rising and falling over `ms`.
function events(every, ms) {
  let next = performance.now() + every * (0.4 + Math.random()); let start = -1e9;
  return (t) => {
    if (t > next) { start = t; next = t + ms + every * (0.5 + Math.random()); }
    const k = (t - start) / ms; return k >= 0 && k <= 1 ? Math.sin(k * Math.PI) : 0;
  };
}

const ORIGIN = { bob: [.5, .95], sway: [.5, 1], breathe: [.5, 1], peck: [.5, 1], flicker: [.5, .9], spin: [.5, .5] };
function build() {
  cancelAnimationFrame(raf); raf = 0;
  if (!wrap) return;
  wrap.replaceChildren(); parts = [];
  const img = wall.querySelector('img'); const src = img?.getAttribute('src') ?? '';
  const sc = SCENES[src.replace(/^\/img\//, '').replace(/\.\w+$/, '')];
  shown = src;
  if (!sc?.live || reduced() || !wall.classList.contains('on')) return;
  if (!img.naturalWidth) { img.addEventListener('load', build, { once: true }); return; }
  // Where the picture lies on the screen (it covers the screen, centred).
  const W = innerWidth, H = innerHeight; const scale = Math.max(W / img.naturalWidth, H / img.naturalHeight);
  const dw = img.naturalWidth * scale, dh = img.naturalHeight * scale, ox = (W - dw) / 2, oy = (H - dh) / 2;
  for (const L of sc.live) {
    let [x0, y0, x1, y1] = L.r;
    let left = ox + x0 * dw, top = oy + y0 * dh, w = (x1 - x0) * dw, h = (y1 - y0) * dh;
    if (L.m === 'spin') { const d = Math.min(w, h); left += (w - d) / 2; top += (h - d) / 2; w = h = d; }
    const el = document.createElement('div'); el.className = `live-part live-${L.m}`;
    const o = L.p ?? ORIGIN[L.m] ?? [.5, .5];
    Object.assign(el.style, {
      left: `${left}px`, top: `${top}px`, width: `${w}px`, height: `${h}px`,
      backgroundImage: `url("${src}")`, backgroundSize: `${dw}px ${dh}px`, backgroundPosition: `${ox - left}px ${oy - top}px`,
      transformOrigin: `${o[0] * 100}% ${o[1] * 100}%`,
    });
    wrap.append(el);
    const k = L.soft ? .55 : 1;
    parts.push({ el, m: L.m, k, slow: L.slow, a: noise(), b: noise(), c: noise(), gust: events(L.m === 'peck' ? 5000 : 14000, L.m === 'peck' ? (L.slow ? 2600 : 420) : 3200) });
  }
  if (parts.length) raf = requestAnimationFrame(frame);
}
function frame(t) {
  raf = 0;
  if (document.hidden || !parts.length) return;
  for (const p of parts) {
    const { k } = p; let tf = '';
    if (p.m === 'bob') tf = `translate(${p.c(t) * 1.4 * k}px, ${p.a(t * 1.6) * 1.3 * k}px) rotate(${p.b(t * 1.3) * 1.5 * k}deg)`;
    else if (p.m === 'sway') tf = `rotate(${(p.a(t) * .7 + p.gust(t) * 1.1 * Math.sign(p.b(t) || 1)) * k}deg)`;
    else if (p.m === 'breathe') tf = `scale(${1 + .006 * k}, ${1 + (.012 + .004 * p.a(t)) * k * (0.5 + 0.5 * Math.sin(t / 620))})`;
    else if (p.m === 'peck') tf = `rotate(${p.gust(t) * (p.slow ? 7 : 9) * k}deg)`;
    else if (p.m === 'spin') tf = `rotate(${(t / 1000) * 7}deg)`;
    else if (p.m === 'flicker') { tf = `scale(${1 + .015 * p.a(t * 6)}, ${1 + .03 * p.b(t * 7)})`; p.el.style.filter = `brightness(${1.04 + .1 * p.c(t * 9)})`; }
    p.el.style.transform = tf;
  }
  raf = requestAnimationFrame(frame);
}

export function startLiving() {
  wall = document.getElementById('wallpaper'); if (!wall || wrap) return;
  wrap = document.createElement('div'); wrap.id = 'living'; wrap.setAttribute('aria-hidden', 'true');
  wall.append(wrap); // over the picture, under its shade
  new MutationObserver(() => {
    const src = wall.querySelector('img')?.getAttribute('src') ?? '';
    if (src !== shown || (!wall.classList.contains('on')) === Boolean(parts.length)) build();
  }).observe(wall, { subtree: true, attributes: true, attributeFilter: ['src', 'class'] });
  addEventListener('resize', build);
  document.addEventListener('visibilitychange', () => { if (!document.hidden && parts.length && !raf) raf = requestAnimationFrame(frame); });
  build();
}
