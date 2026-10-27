// Checks that every source_url and analysis_url answers (HTTP 200–399). Needs network access to
// gutenberg.org, wikisource.org, perseus.tufts.edu and plato.stanford.edu.
//   node scripts/check-links.js            all links
//   node scripts/check-links.js analysis   analysis links only
import * as content from '../content/index.js';

const which = process.argv[2];
const links = [];
for (const n of content.nodes) {
  if (which !== 'analysis' && n.source_url) links.push([n.id, 'source', n.source_url]);
  if (which !== 'source' && n.analysis_url) links.push([n.id, 'analysis', n.analysis_url]);
}
const UA = 'ContinuumLinkCheck/0.1';
let bad = 0;
for (const [id, kind, url] of links) {
  let status;
  try {
    const r = await fetch(url, { method: 'HEAD', redirect: 'follow', headers: { 'User-Agent': UA } });
    status = r.status === 405 ? (await fetch(url, { headers: { 'User-Agent': UA } })).status : r.status;
  } catch (err) { status = err.cause?.code ?? err.message; }
  const ok = typeof status === 'number' && status < 400;
  if (!ok) bad++;
  console.log(`${ok ? 'ok  ' : 'BAD '} ${String(status).padEnd(12)} ${kind.padEnd(8)} ${id}  ${url}`);
  await new Promise((r) => setTimeout(r, 400));
}
console.log(`\n${links.length} links checked, ${bad} bad`);
process.exit(bad ? 1 : 0);
