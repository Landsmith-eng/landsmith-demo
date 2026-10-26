// All content: the daily line plus walk-only branch files in content/branches/.
// Branch nodes have no `seq`, so they are never daily cards; users reach them by walking.
// The same practice node may appear in several files; the first copy wins.
import { existsSync, readdirSync } from 'node:fs';
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

export const nodes = [...byId.values()];
export { edges, branchFiles };
