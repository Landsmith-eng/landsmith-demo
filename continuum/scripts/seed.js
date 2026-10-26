// Loads (or reloads) the content line. Safe to re-run: user responses are kept.
import { openDb, seedContent } from '../db.js';
import * as content from '../content/index.js';

const DB_PATH = process.env.CONTINUUM_DB ?? new URL('../data/continuum.db', import.meta.url).pathname;
const db = openDb(DB_PATH);
seedContent(db, content);
const { n } = db.prepare('SELECT COUNT(*) AS n FROM nodes WHERE seq IS NOT NULL').get();
const { e } = db.prepare('SELECT COUNT(*) AS e FROM edges').get();
const { b } = db.prepare('SELECT COUNT(*) AS b FROM nodes WHERE seq IS NULL').get();
console.log(`Seeded ${n} line nodes, ${b} branch/practice nodes and ${e} edges into ${DB_PATH}`);
