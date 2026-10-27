import { fileURLToPath } from 'node:url';
import { openDb } from './db.js';
import { createApp } from './app.js';

const PORT = Number(process.env.PORT ?? 8878);
const DB_PATH = process.env.CONTINUUM_DB ?? fileURLToPath(new URL('./data/continuum.db', import.meta.url));

const db = openDb(DB_PATH);
if (db.prepare('SELECT COUNT(*) AS n FROM nodes').get().n === 0) {
  console.warn('No content loaded. Run `npm run seed` first.');
}
createApp(db, { adminKey: process.env.CONTINUUM_ADMIN_KEY }).listen(PORT, () => {
  console.log(`Continuum on http://localhost:${PORT}`);
});
