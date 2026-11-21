// Usage: npm run invite -- "Tester Name" [base-url]
// Prints a personal link. The token in the link is the tester's only credential.
import { fileURLToPath } from 'node:url';
import { randomBytes } from 'node:crypto';
import { openDb } from '../db.js';

const [name, base = 'http://localhost:8878'] = process.argv.slice(2);
if (!name) {
  console.error('Usage: npm run invite -- "Tester Name" [base-url]');
  process.exit(1);
}
const DB_PATH = process.env.CONTINUUM_DB ?? fileURLToPath(new URL('../data/continuum.db', import.meta.url));
const token = randomBytes(12).toString('base64url');
openDb(DB_PATH).prepare('INSERT INTO users (token, name) VALUES (?, ?)').run(token, name);
console.log(`${name}: ${base.replace(/\/$/, '')}/?u=${token}`);
