// All content: the daily line plus walk-only branch files in content/branches/.
// Branch nodes have no `seq`, so they are never daily cards; users reach them by walking.
// The same practice node may appear in several files; the first copy wins.
import { existsSync, readdirSync, statSync } from 'node:fs';
import * as line from './line_poc.js';

const branchDir = new URL('./branches/', import.meta.url);
const branchFiles = existsSync(branchDir) ? readdirSync(branchDir).filter((f) => f.endsWith('.js')).sort() : [];
const branches = await Promise.all(branchFiles.map((f) => import(new URL(f, branchDir))));

const byId = new Map();
const tagged = [[line, 'line_poc.js'], ...branches.map((m, i) => [m, branchFiles[i]])];
for (const n of tagged.flatMap(([m, file]) => m.nodes.map((node) => ({ ...node, file })))) {
  if (byId.has(n.id) && n.type !== 'practice') throw new Error(`duplicate node id ${n.id}`);
  if (!byId.has(n.id)) byId.set(n.id, n);
}
const edgeKey = (e) => `${e.from}|${e.to}|${e.relation}`;
const edges = [...new Map([line, ...branches].flatMap((m) => m.edges).map((e) => [edgeKey(e), e])).values()];

// Deeper-analysis links live in one file so they can be checked and updated without touching the branches.
const { analysisLinks } = await import('./analysis_links.js');
for (const [id, url] of Object.entries(analysisLinks)) {
  const n = byId.get(id);
  if (!n) throw new Error(`analysis_links.js: unknown node ${id}`);
  n.analysis_url = url;
}

// Illustrations for the daily nodes. A bad or half-added entry is skipped here (the server keeps running) and
// reported by `npm run check`.
const { images, imageProblems, IMAGE_DIR } = await import('./images.js');
const imageSize = (file) => { try { return statSync(new URL(file, IMAGE_DIR)).size; } catch { return null; } };
const imageIssues = [];
for (const [id, img] of Object.entries(images)) {
  const n = byId.get(id);
  if (!n) throw new Error(`images.js: unknown node ${id}`);
  if (img == null) continue;
  if (n.seq == null) { imageIssues.push(`${id}: images are for the 14 daily nodes only`); continue; }
  const issues = imageProblems(id, img, imageSize);
  if (issues.length) { imageIssues.push(...issues); continue; }
  n.image = { src: `/img/nodes/${img.file}`, kind: img.kind, alt: img.alt.trim(), credit: img.credit.trim(), credit_url: img.credit_url ?? null };
}

export const nodes = [...byId.values()];
export { imageIssues };
export { edges, branchFiles };
