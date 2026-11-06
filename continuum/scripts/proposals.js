// Writes the open proposals from the local database to content/PROPOSALS.md, for a verification session.
//   npm run proposals          open proposals
//   npm run proposals -- all   every proposal, with its status
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { openDb } from '../db.js';
import { themes } from '../content/themes.js';
import { proposalsMarkdown } from '../public/proposals-format.js';

const db = openDb(process.env.CONTINUUM_DB ?? fileURLToPath(new URL('../data/continuum.db', import.meta.url)));
const proposals = db.prepare('SELECT id, payload, status, reply, created_at FROM proposals ORDER BY id').all()
  .map((r) => ({ ...r, payload: JSON.parse(r.payload) }));
const nodes = db.prepare('SELECT id, title, thinker, year FROM nodes').all();
const md = proposalsMarkdown(proposals, nodes, themes, { onlyOpen: process.argv[2] !== 'all' });
const out = new URL('../content/PROPOSALS.md', import.meta.url);
writeFileSync(out, md);
console.log(`${md.split('\n## ').length - 1} proposal(s) written to content/PROPOSALS.md`);
