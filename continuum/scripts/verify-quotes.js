// Independent quote check: every source_face fragment that is not labelled a summary must appear
// verbatim (whitespace/quote-mark normalised) in one of the downloaded source texts.
//   node scripts/verify-quotes.js <dir-of-downloaded-texts> [branch-file-name]
// Download the texts yourself (Gutenberg .txt, Wikisource raw pages) into that directory first; they are
// not kept in the repo. Fragments are split on ellipses and paragraph breaks, so each cut is checked separately.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
const root = process.argv[2];
const only = process.argv[3] ? `${process.argv[3].replace(/\.js$/, '')}.js` : null;
const contentIndex = new URL('../content/index.js', import.meta.url);
if (!root) { console.error('usage: node scripts/verify-quotes.js <texts-dir> [branch-file]'); process.exit(2); }
const files = [];
const walk = (d) => { for (const f of readdirSync(d)) { const p = join(d, f); if (statSync(p).isDirectory()) walk(p); else files.push(p); } };
walk(root);
const norm = (t) => t.normalize('NFKC').replace(/<[^>]+>/g, ' ').replace(/'''?|\[\[|\]\]|\{\{[^}]*\}\}|_/g, '').replace(/[“”«»]/g, '"').replace(/[‘’]/g, "'").replace(/[—–]|--/g, '-').replace(/-\s*-/g,'-').replace(/\s+/g, ' ').toLowerCase();
const corpus = files.map((f) => norm(readFileSync(f, 'utf8'))).join(' \u0000 ');
const { nodes } = await import(contentIndex);
let bad = 0;
for (const n of nodes) {
  if (!n.source_face || (only && n.file !== only)) continue;
  if (/^(Summary|Short quotation)/.test(n.source_face)) { console.log(`SKIP  ${n.id} (labelled summary/short quotation)`); continue; }
  const frags = n.source_face.split(/\s*…\s*|\n\n|\n/).map((x) => x.trim()).filter((x) => x.length > 12);
  // A fragment may end with our own closing punctuation where the passage was cut.
  const missing = frags.filter((f) => !corpus.includes(norm(f).replace(/^"|"$/g, '').trim().replace(/[.:;,]+$/, '')));
  if (missing.length) { bad++; console.log(`MISS  ${n.id}:`); for (const m of missing) console.log('        ' + m.slice(0, 110)); }
  else console.log(`OK    ${n.id} (${frags.length} fragment${frags.length > 1 ? 's' : ''})`);
}
console.log(bad ? `\n${bad} node(s) with unmatched text` : '\nall quoted passages matched');
process.exit(bad ? 1 : 0);
