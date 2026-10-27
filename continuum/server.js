import { fileURLToPath } from 'node:url';
import { openDb } from './db.js';
import { createApp } from './app.js';

const PORT = Number(process.env.PORT ?? 8878);
const DB_PATH = process.env.CONTINUUM_DB ?? fileURLToPath(new URL('./data/continuum.db', import.meta.url));

const db = openDb(DB_PATH);
const { nodes, pictures } = db.prepare(
  'SELECT COUNT(*) AS nodes, COUNT(CASE WHEN seq IS NOT NULL AND image IS NOT NULL THEN 1 END) AS pictures FROM nodes').get();
if (nodes === 0) console.warn('No content loaded. Run `npm run seed` first.');

// Express 5 passes a listen error (such as the port being taken) to this callback.
createApp(db, { adminKey: process.env.CONTINUUM_ADMIN_KEY }).listen(PORT, (err) => {
  if (err?.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use: another copy of Continuum is probably still running, with older code.`);
    console.error('Close it first (Ctrl+C in its window). On Windows, if you cannot find it: Get-Process node | Stop-Process');
    process.exit(1);
  }
  if (err) throw err;
  // The picture count comes from the database, so it shows whether `npm run seed` has picked up new images.
  console.log(`Continuum on http://localhost:${PORT} · ${nodes} nodes · daily pictures: ${pictures} of 14`);
});
