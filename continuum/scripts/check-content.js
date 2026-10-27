// Content gate. Runs the same checks the tests do, but reports every problem at once and
// counts what's in the graph. Run after writing or editing any file in content/.
//   npm run check           all content
//   npm run check -- NAME   one branch file (content/branches/NAME.js), checked against everything else
import * as content from '../content/index.js';

import { TYPES, FIELDS, RELS, DIRECTED, OPINION_ROLES } from '../content/model.js';
const only = process.argv[2] ? `${process.argv[2].replace(/\.js$/, '')}.js` : null;

const byId = new Map(content.nodes.map((n) => [n.id, n]));
const problems = [];
const bad = (msg) => problems.push(msg);

for (const n of content.nodes) {
  if (only && n.file !== only) continue;
  if (!/^[a-z0-9_]+$/.test(n.id)) bad(`${n.id}: id must be snake_case`);
  if (!TYPES.includes(n.type)) bad(`${n.id}: bad type "${n.type}"`);
  if (n.field && !FIELDS.includes(n.field)) bad(`${n.id}: bad field "${n.field}"`);
  if (!n.title || !n.plain_face) bad(`${n.id}: missing title or plain_face`);
  if (n.type !== 'practice' && !n.prompt) bad(`${n.id}: missing prompt`);
  if (!['thinker', 'practice'].includes(n.type) && !(n.source_face && n.source_citation)) bad(`${n.id}: non-thinker node needs source_face and source_citation`);
  if (n.source_face && !/^(Summary|Short quotation) \(/.test(n.source_face) && !n.source_url) bad(`${n.id}: quoted source needs a source_url (or label it: start the face with "Summary (…): " or "Short quotation (…): " saying why)`);
  if (n.plain_face && n.plain_face.length > 700) bad(`${n.id}: plain_face is ${n.plain_face.length} chars; keep it to one screen (<= 700)`);
  if (n.type !== 'practice' && !content.edges.some((e) => e.from === n.id || e.to === n.id)) bad(`${n.id}: has no edges`);
  // Court cases: field law, a decision year, and each opinion with a role, an author, our plain gist and a verbatim
  // passage. US federal court opinions are public domain, so the passages are quoted, never summarised.
  if (n.type === 'case') {
    if (n.field !== 'law') bad(`${n.id}: a case belongs in field "law"`);
    if (!Array.isArray(n.opinions) || !n.opinions.length) bad(`${n.id}: a case needs its opinions (majority first, then concurrences and dissents)`);
    else {
      if (!['majority', 'plurality'].includes(n.opinions[0].role)) bad(`${n.id}: the first opinion must be the majority or plurality`);
      for (const [i, o] of n.opinions.entries()) {
        if (!OPINION_ROLES.includes(o.role)) bad(`${n.id}: opinion ${i + 1} has a bad role "${o.role}"`);
        if (!o.author || !o.gist || !o.quote) bad(`${n.id}: opinion ${i + 1} needs author, gist (our plain words) and quote (verbatim)`);
        if (o.echoes && !byId.has(o.echoes)) bad(`${n.id}: opinion ${i + 1} echoes unknown node ${o.echoes}`);
        if (o.echoes && !o.echo_note) bad(`${n.id}: opinion ${i + 1} needs an echo_note (why it echoes ${o.echoes}; say "cited" or "ours")`);
      }
    }
    if (!n.source_url) bad(`${n.id}: a case needs a source_url to the full opinions`);
  } else if (n.opinions) bad(`${n.id}: only a case can have opinions`);
  // News: dated, linked to a reputable outlet, told in our own words (news text is in copyright), and tied to an
  // older idea. The prompt must be a question, not a verdict.
  if (n.type === 'event' || n.field === 'now') {
    if (n.type !== 'event' || n.field !== 'now') bad(`${n.id}: news nodes are type "event" in field "now"`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(n.as_of ?? '')) bad(`${n.id}: a news event needs as_of (YYYY-MM-DD)`);
    if (!n.source_url) bad(`${n.id}: a news event needs a source_url to a reputable outlet`);
    if (!/^Summary \(/.test(n.source_face ?? '')) bad(`${n.id}: a news event's source face is a labelled summary ("Summary (outlet, date): ...")`);
    if (!/\?\s*$/.test(n.prompt ?? '')) bad(`${n.id}: a news event's prompt must end with a question mark`);
    if (!content.edges.some((e) => e.to === n.id && e.relation === 'echoes')) bad(`${n.id}: a news event must echo an older idea (an "echoes" edge into it)`);
  }
  // Artworks need a page for the work itself (museum or Wikimedia Commons).
  if (n.type === 'work' && !n.source_url) bad(`${n.id}: an artwork needs a source_url (museum or Commons page)`);
}

for (const e of content.edges) {
  const a = byId.get(e.from), b = byId.get(e.to);
  if (!a || !b) { bad(`edge ${e.from} -> ${e.to}: unknown node`); continue; }
  if (only && a.file !== only && b.file !== only) continue;
  if (!RELS.includes(e.relation)) bad(`edge ${e.from} -> ${e.to}: bad relation "${e.relation}"`);
  if (e.relation === 'lands_on' && b.type !== 'practice') bad(`edge ${e.from} -> ${e.to}: lands_on must target a practice`);
  if (e.relation === 'echoes' && !['art', 'culture', 'law', 'now'].includes(b.field)) bad(`edge ${e.from} -> ${e.to}: echoes points at art, culture, law or the news`);
  if (e.relation !== 'lands_on' && b.type === 'practice') bad(`edge ${e.from} -> ${e.to}: only lands_on may point at a practice`);
  if (DIRECTED.includes(e.relation) && a.year != null && b.year != null && b.year < a.year - 30) bad(`edge ${e.from} -> ${e.to}: ${b.thinker ?? b.id} (${b.year}) cannot have ${e.relation} ${a.thinker ?? a.id} (${a.year})`);
  if (e.relation !== 'lands_on' && !e.note) bad(`edge ${e.from} -> ${e.to}: needs a one-line note`);
}

for (const msg of content.imageIssues) bad(msg);
// The index: every theme links real ideas, at least three of them, with a question.
{
  const { themes, THEME_KINDS } = await import('../content/themes.js');
  const seen = new Set();
  for (const t of themes) {
    if (seen.has(t.id)) bad(`themes.js: duplicate theme ${t.id}`); seen.add(t.id);
    if (!THEME_KINDS.includes(t.kind)) bad(`themes.js: ${t.id} has a bad kind "${t.kind}"`);
    if (!t.name || !t.question) bad(`themes.js: ${t.id} needs a name and a question`);
    if (new Set(t.nodes).size !== t.nodes.length) bad(`themes.js: ${t.id} lists a node twice`);
    if (t.nodes.length < 3) bad(`themes.js: ${t.id} links fewer than three ideas`);
    for (const id of t.nodes) if (!byId.has(id)) bad(`themes.js: ${t.id} links unknown node ${id}`);
  }
}
for (const n of content.nodes) if (n.type !== 'practice' && !n.room && (!only || n.file === only)) bad(`${n.id}: needs a gallery room in content/rooms.js`);

// Every non-practice node must be able to reach a practice by walking.
const adj = new Map();
for (const e of content.edges) for (const [x, y] of [[e.from, e.to], [e.to, e.from]]) adj.set(x, [...(adj.get(x) ?? []), y]);
for (const n of content.nodes) {
  if (n.type === 'practice' || (only && n.file !== only)) continue;
  const seen = new Set([n.id]); const queue = [n.id]; let found = false;
  while (queue.length && !found) for (const next of adj.get(queue.shift()) ?? []) {
    if (byId.get(next)?.type === 'practice') found = true;
    if (!seen.has(next)) { seen.add(next); queue.push(next); }
  }
  if (!found) bad(`${n.id}: cannot reach any practice`);
}

const line = content.nodes.filter((n) => n.seq != null).length;
const practices = content.nodes.filter((n) => n.type === 'practice').length;
const byField = {};
for (const n of content.nodes) byField[n.field ?? 'philosophy'] = (byField[n.field ?? 'philosophy'] ?? 0) + 1;
const summaries = content.nodes.filter((n) => /^(Summary|Short quotation) \(/.test(n.source_face ?? '')).length;
console.log(`${content.nodes.length} nodes (${line} daily, ${practices} practices, ${content.nodes.length - line - practices} walk-only), ${content.edges.length} edges`);
const imaged = content.nodes.filter((n) => n.image).length;
console.log(`images: ${imaged} of ${line} daily nodes`);
console.log(`fields: ${Object.entries(byField).map(([k, v]) => `${k} ${v}`).join(', ')}; ${summaries} in-copyright summaries; files: line_poc.js, ${content.branchFiles.join(', ')}`);
if (problems.length) { console.log(`\n${problems.length} problem(s):`); for (const p of problems) console.log('  ' + p); process.exit(1); }
console.log('content OK');
