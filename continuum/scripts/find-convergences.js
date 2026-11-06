// Convergence-finder: proposes `converged` edges (same idea, no contact) for a researcher to verify.
//
// Idea borrowed from thephilosophymap.com (see content/PHILOSOPHYMAP.md): a thinker's teaching text places
// them on a "semantic" map; the influence graph places them on another. Pairs that are close on the first but
// unlinked on the second are exactly Continuum's convergences. Here the "semantic" signal is TF-IDF cosine
// similarity over each idea node's title, plain face and prompt (pure Node, no model, no network), and
// "unlinked" means no edge of any type between the two nodes.
//
//   npm run converge                 top 40 candidates to stdout and content/CONVERGENCE_CANDIDATES.md
//   npm run converge -- 80           top 80
//   npm run converge -- 40 all       include pairs from the same field and era (default keeps only pairs
//                                    that cross a field or sit more than 300 years apart)
//
// Output is a proposal list, not content. Every candidate still needs a verified note before it becomes an edge.
import { writeFileSync } from 'node:fs';
import * as content from '../content/index.js';

const TOP = Number(process.argv[2]) || 40;
const ALL = process.argv[3] === 'all';
const YEAR_GAP = 300;

const STOP = new Set(`a an the and or but if then than so of to in on at by for from with without into out up down over
under as is are was were be been being have has had do does did not no nor can could would should may might will shall
this that these those it its he his him she her they them their we our you your i me my who whom whose which what when
where why how all any each every some such only own same other another more most much many few less very just also
even still yet ever never here there once again about above below between through during before after because while
until against among around both either neither one two three first last next new old long great little big make made
makes making say says said saying think thinks thought thinking know knows knew known thing things way ways man men
person people life live lives living day days time times world world's himself herself itself themselves something
anything nothing everything someone anyone everyone thy thou thee thine ye hath doth dost shalt wilt unto thereof whereof art copyright summary work short quotation trans translated translation went go goes going come comes came take takes took get gets got
give gives gave put see sees saw look looks looked call called like likes wants want wanted need needs use used
tells tell told asks ask asked let lets keep keeps kept find finds found turn turns turned become becomes became
own back off far away ago later earlier whole part real really ever often always sometimes mean means meant seems
seem seemed point points fact facts case cases end ends ended name names named upon within whether rather quite
almost enough too both much idea ideas says said wrote writes writing written book books word words`.split(/\s+/));

// Light stemmer: merges plurals and verb endings ("desires/desired/desiring" -> "desir") without mangling roots.
function stem(w) {
  if (w.length <= 4) return w;
  return w.replace(/(ies)$/, 'y').replace(/(ings?|edly|ed|es|s)$/, '').replace(/(ness|ment)$/, '');
}
// Thinkers' names are excluded: a face that mentions "Socrates" should match on ideas, not on the name.
const NAMES = new Set(content.nodes.flatMap((n) => (n.thinker ?? '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().match(/[a-z]{3,}/g) ?? []));
const tokens = (t) => (t.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().match(/[a-z]{3,}/g) ?? [])
  .filter((w) => !STOP.has(w) && !NAMES.has(w)).map(stem).filter((w) => w.length > 2);

const nodes = content.nodes.filter((n) => n.type !== 'practice');
// Title, prompt and plain face carry the idea in our words; the source face carries the doctrine in the thinker's.
// Including both keeps a shared analogy (two gardens) from outweighing a shared claim. Summaries of in-copyright
// works count too, since they are our prose about the idea.
const docs = nodes.map((n) => tokens([n.title, n.prompt ?? '', n.plain_face, n.source_face ?? ''].join(' ')));
const df = new Map();
for (const d of docs) for (const w of new Set(d)) df.set(w, (df.get(w) ?? 0) + 1);
const N = docs.length;
const vectors = docs.map((d) => {
  const tf = new Map();
  for (const w of d) tf.set(w, (tf.get(w) ?? 0) + 1);
  const v = new Map();
  let norm = 0;
  for (const [w, c] of tf) {
    if (df.get(w) === N) continue; // in every node: carries nothing
    const x = (1 + Math.log(c)) * Math.log(N / df.get(w));
    v.set(w, x); norm += x * x;
  }
  norm = Math.sqrt(norm) || 1;
  for (const [w, x] of v) v.set(w, x / norm);
  return v;
});

const linked = new Set(content.edges.flatMap((e) => [`${e.from}|${e.to}`, `${e.to}|${e.from}`]));
const crosses = (a, b) => a.field !== b.field || (a.year != null && b.year != null && Math.abs(a.year - b.year) > YEAR_GAP);

const pairs = [];
for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
  const a = nodes[i], b = nodes[j];
  if (linked.has(`${a.id}|${b.id}`)) continue;
  if (a.thinker && a.thinker === b.thinker) continue;
  if (!ALL && !crosses(a, b)) continue;
  const [small, big] = vectors[i].size < vectors[j].size ? [vectors[i], vectors[j]] : [vectors[j], vectors[i]];
  let score = 0; const shared = [];
  for (const [w, x] of small) { const y = big.get(w); if (y) { score += x * y; shared.push([w, x * y]); } }
  if (score > 0) pairs.push({ a, b, score, shared: shared.sort((p, q) => q[1] - p[1]).slice(0, 6).map((p) => p[0]) });
}
pairs.sort((p, q) => q.score - p.score);

const yr = (y) => (y == null ? '' : y < 0 ? `${-y} BCE` : String(y));
const who = (n) => `${n.thinker ?? n.title}${n.year != null ? ` (${yr(n.year)})` : ''}`;
const lines = [
  '# Convergence candidates',
  '',
  `Generated ${new Date().toISOString().slice(0, 10)} by \`npm run converge\` over ${nodes.length} idea nodes and ${content.edges.length} edges.`,
  'Each row is a pair of nodes with **no edge between them** whose plain faces use similar language, ranked by TF-IDF cosine.',
  ALL ? 'All pairs included.' : `Only pairs that cross a field or sit more than ${YEAR_GAP} years apart are shown.`,
  '',
  'These are proposals, not content. A candidate becomes a `converged` edge only after a researcher writes a specific,',
  'true one-line note (and checks that there really was no contact; if there was, the relation is `extended` or `refuted`).',
  'Pairs already covered by an edge never appear here, so re-running after each batch shows what is new.',
  '',
  '| # | Score | A | B | Shared words | Verdict |',
  '|---|---|---|---|---|---|',
  ...pairs.slice(0, TOP).map((p, i) => `| ${i + 1} | ${p.score.toFixed(2)} | ${who(p.a)}: ${p.a.title} \`${p.a.id}\` | ${who(p.b)}: ${p.b.title} \`${p.b.id}\` | ${p.shared.join(', ')} | |`),
  '',
];
writeFileSync(new URL('../content/CONVERGENCE_CANDIDATES.md', import.meta.url), lines.join('\n'));
console.log(`${pairs.length} unlinked ${ALL ? '' : 'cross-tradition '}pairs scored; top ${Math.min(TOP, pairs.length)} written to content/CONVERGENCE_CANDIDATES.md\n`);
for (const [i, p] of pairs.slice(0, TOP).entries()) console.log(`${String(i + 1).padStart(2)}  ${p.score.toFixed(2)}  ${who(p.a)} ↔ ${who(p.b)}   [${p.shared.join(', ')}]`);
