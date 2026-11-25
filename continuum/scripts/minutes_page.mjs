// Builds a readable, searchable page from MINUTES.md, for publishing as a shared page (see CLAUDE.md, "Minutes").
//   node scripts/minutes_page.mjs [out.html]
// MINUTES.md stays the record; this page is only a view of it, rebuilt after each update. The Markdown it reads is
// the plain subset the minutes use: headings, paragraphs, bullet lists, tables, bold, inline code and links.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(join(here, '..', 'MINUTES.md'), 'utf8');
const out = process.argv[2] ?? join(here, '..', 'minutes.html');

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const inline = (s) => esc(s)
  .replace(/`([^`]+)`/g, '<code>$1</code>')
  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
  .replace(/(^|[\s(])(https?:\/\/[^\s<)]+)/g, '$1<a href="$2" target="_blank" rel="noopener">$2</a>');

// Split into the preamble, the kept sections (Open items, Standing decisions) and the days.
const lines = src.split('\n');
const blocks = []; let cur = { title: null, level: 1, body: [] };
for (const l of lines) {
  const m = /^(#{1,2}) (.*)$/.exec(l);
  if (m) { blocks.push(cur); cur = { title: m[2], level: m[1].length, body: [] }; } else cur.body.push(l);
}
blocks.push(cur);

function render(body) {
  const html = []; let i = 0;
  while (i < body.length) {
    const l = body[i];
    if (!l.trim() || /^---\s*$/.test(l)) { i++; continue; }
    if (l.startsWith('|')) {
      const rows = []; while (i < body.length && body[i].startsWith('|')) rows.push(body[i++]);
      const cells = (r) => r.replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
      const head = cells(rows[0]); const rest = rows.slice(2).map(cells);
      html.push(`<div class="table"><table><thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>${rest.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
      continue;
    }
    if (/^- /.test(l)) {
      const items = []; while (i < body.length && /^- /.test(body[i])) items.push(body[i++].slice(2));
      html.push(`<ul>${items.map((x) => `<li>${inline(x)}</li>`).join('')}</ul>`);
      continue;
    }
    const para = []; while (i < body.length && body[i].trim() && !/^(- |\||---)/.test(body[i])) para.push(body[i++]);
    const text = para.join(' ');
    // A line that is only a bold label ("**Major**") is a small heading within a day.
    html.push(/^\*\*[^*]+\*\*$/.test(text.trim()) ? `<h3>${esc(text.trim().slice(2, -2))}</h3>` : `<p>${inline(text)}</p>`);
  }
  return html.join('\n');
}

const pre = blocks.find((b) => b.level === 1 && b.title);
const kept = blocks.filter((b) => b.level === 2 && !/^\d{4}-\d{2}-\d{2}$/.test(b.title));
const days = blocks.filter((b) => b.level === 2 && /^\d{4}-\d{2}-\d{2}$/.test(b.title));
const dayName = (d) => new Date(`${d}T12:00:00Z`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
const latest = days[0]?.title ?? '';

const page = `<title>Continuum Minutes</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lora:wght@500;600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400&display=swap">
<style>
/* A working journal: one column of days, newest first, with a search and a day index beside it on wide screens. */
:root {
  --bg: #f6f7f4; --surface: #ffffff; --fg: #1d2420; --muted: #5d6a63; --line: #dbe1dc; --accent: #2f7a55; --accent-soft: #e2efe7; --mark: #fbe9a6;
  --display: "Lora", Georgia, serif; --body: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif; --mono: "JetBrains Mono", ui-monospace, monospace;
}
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { --bg: #121815; --surface: #19211d; --fg: #e4ebe6; --muted: #98a69e; --line: #2b3630; --accent: #6cc79a; --accent-soft: #1f3329; --mark: #5b4c12; color-scheme: dark; } }
:root[data-theme="dark"] { --bg: #121815; --surface: #19211d; --fg: #e4ebe6; --muted: #98a69e; --line: #2b3630; --accent: #6cc79a; --accent-soft: #1f3329; --mark: #5b4c12; color-scheme: dark; }
body { background: var(--bg); color: var(--fg); font: 15px/1.6 var(--body); }
.wrap { max-width: 1080px; margin: 0 auto; padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); padding-block: 28px 64px; }
header h1 { font: 600 2rem/1.15 var(--display); margin: 0 0 6px; text-wrap: balance; }
header .intro { color: var(--muted); max-width: 68ch; margin: 0 0 18px; }
.search { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; margin-bottom: 22px; }
.search input { flex: 1 1 260px; min-width: 0; font: inherit; padding: 10px 12px; border-radius: 8px; border: 1px solid var(--line); background: var(--surface); color: var(--fg); }
.search input:focus-visible { outline: 2px solid var(--accent); outline-offset: 1px; }
.search .count { color: var(--muted); font-size: .85rem; font-variant-numeric: tabular-nums; }
.grid { display: grid; grid-template-columns: 180px minmax(0, 1fr); gap: 32px; }
nav.days { position: sticky; top: calc(env(safe-area-inset-top, 0px) + 16px); align-self: start; font-size: .85rem; max-height: calc(100vh - 32px); overflow: auto; }
nav.days a { display: block; padding: 3px 8px; border-radius: 6px; color: var(--muted); text-decoration: none; font-variant-numeric: tabular-nums; }
nav.days a:hover, nav.days a:focus-visible { color: var(--fg); background: var(--accent-soft); outline: none; }
nav.days .label { text-transform: uppercase; letter-spacing: .08em; font-size: .7rem; color: var(--muted); margin: 0 0 6px 8px; }
main { min-width: 0; }
section { border-top: 1px solid var(--line); padding: 18px 0 8px; }
section h2 { font: 600 1.3rem/1.3 var(--display); margin: 0 0 4px; display: flex; gap: 10px; align-items: baseline; flex-wrap: wrap; }
section h2 .date { font: 400 .8rem var(--mono); color: var(--muted); }
section.kept { background: var(--surface); border: 1px solid var(--line); border-radius: 10px; padding: 16px 18px 6px; margin-bottom: 18px; }
section.kept + section:not(.kept) { border-top: none; }
h3 { font: 600 .72rem var(--body); text-transform: uppercase; letter-spacing: .09em; color: var(--accent); margin: 14px 0 4px; }
p, li { max-width: 72ch; }
ul { padding-left: 1.2em; margin: 4px 0 10px; }
li { margin: 3px 0; }
code { font: .86em var(--mono); background: var(--accent-soft); padding: 1px 5px; border-radius: 4px; overflow-wrap: anywhere; }
a { color: var(--accent); }
.table { overflow-x: auto; margin: 6px 0 12px; }
table { border-collapse: collapse; width: 100%; font-size: .9rem; }
th, td { text-align: left; vertical-align: top; padding: 7px 8px; border-top: 1px solid var(--line); }
th { color: var(--muted); font-weight: 500; font-size: .78rem; text-transform: uppercase; letter-spacing: .05em; }
mark { background: var(--mark); color: inherit; border-radius: 2px; }
.empty { color: var(--muted); padding: 24px 0; }
@media (max-width: 760px) { .grid { grid-template-columns: minmax(0, 1fr); } nav.days { display: none; } header h1 { font-size: 1.6rem; } }
@media (prefers-reduced-motion: no-preference) { html { scroll-behavior: smooth; } }
</style>
<div class="wrap">
<header>
  <h1>Continuum Minutes</h1>
  <p class="intro">${inline(pre.body.find((l) => l.trim()) ?? '')} Latest entry: ${esc(dayName(latest))}.</p>
  <div class="search"><input id="q" type="search" placeholder="Search the minutes: caching, voice, Trainer, John…" aria-label="Search the minutes"><span class="count" id="count"></span></div>
</header>
<div class="grid">
  <nav class="days" aria-label="Days"><p class="label">Days</p>${['open', 'decisions'].map((id, k) => `<a href="#${id}">${esc(kept[k]?.title.replace(/ \(.*\)$/, '') ?? '')}</a>`).join('')}${days.map((d) => `<a href="#d${d.title.replace(/-/g, '')}">${esc(dayName(d.title).replace(/, \d{4}$/, ''))}</a>`).join('')}</nav>
  <main id="m">
${kept.map((b, k) => `<section class="kept" id="${['open', 'decisions'][k] ?? `kept${k}`}"><h2>${inline(b.title)}</h2>${render(b.body)}</section>`).join('\n')}
${days.map((d) => `<section class="day" id="d${d.title.replace(/-/g, '')}"><h2>${esc(dayName(d.title))} <span class="date">${d.title}</span></h2>${render(d.body)}</section>`).join('\n')}
<p class="empty" id="none" hidden>Nothing in the minutes matches that.</p>
  </main>
</div>
</div>
<script>
// Search: keep the days (and kept sections) that mention every word typed, and mark the words.
const q = document.getElementById('q'); const count = document.getElementById('count'); const none = document.getElementById('none');
const sections = [...document.querySelectorAll('main section')];
const original = new Map(sections.map((s) => [s, s.innerHTML]));
const escRe = (s) => s.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&');
function mark(node, re) {
  const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT); const hits = []; const has = new RegExp(re.source, 'i');
  while (walker.nextNode()) if (has.test(walker.currentNode.nodeValue)) hits.push(walker.currentNode);
  for (const t of hits) {
    const span = document.createElement('span'); span.innerHTML = t.nodeValue.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(re, '<mark>$1</mark>');
    t.replaceWith(...span.childNodes);
  }
}
function run() {
  const words = q.value.trim().toLowerCase().split(/\\s+/).filter(Boolean);
  let shown = 0;
  for (const s of sections) {
    s.innerHTML = original.get(s);
    const text = s.textContent.toLowerCase();
    const ok = words.every((w) => text.includes(w));
    s.hidden = !ok; if (ok) shown++;
    if (ok && words.length) mark(s, new RegExp('(' + words.map(escRe).join('|') + ')', 'gi'));
  }
  none.hidden = shown > 0;
  count.textContent = words.length ? shown + (shown === 1 ? ' section' : ' sections') : '';
}
q.addEventListener('input', run);
</script>
`;
writeFileSync(out, page);
console.log(`Wrote ${out} (${days.length} days).`);
