import { fileURLToPath } from 'node:url';
import { openDb } from './db.js';
import { createApp } from './app.js';
import { createTts } from './tts.js';
import { existsSync, readFileSync } from 'node:fs';

// Private settings (the ElevenLabs key) live in .env next to this file, never in git. KEY=value, one per line.
const ENV_FILE = fileURLToPath(new URL('./.env', import.meta.url));
if (existsSync(ENV_FILE)) {
  for (const line of readFileSync(ENV_FILE, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !line.trimStart().startsWith('#') && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
  }
}

const PORT = Number(process.env.PORT ?? 8878);
const DB_PATH = process.env.CONTINUUM_DB ?? fileURLToPath(new URL('./data/continuum.db', import.meta.url));

const db = openDb(DB_PATH);
const { nodes, pictures } = db.prepare(
  'SELECT COUNT(*) AS nodes, COUNT(CASE WHEN seq IS NOT NULL AND image IS NOT NULL THEN 1 END) AS pictures FROM nodes').get();
if (nodes === 0) console.warn('No content loaded. Run `npm run seed` first.');

// Express 5 passes a listen error (such as the port being taken) to this callback.
const tts = createTts({
  apiKey: process.env.ELEVENLABS_API_KEY,
  voiceId: process.env.ELEVENLABS_VOICE_ID || undefined,
  model: process.env.ELEVENLABS_MODEL || undefined,
  cacheDir: fileURLToPath(new URL('./data/tts/', import.meta.url)),
});

createApp(db, { adminKey: process.env.CONTINUUM_ADMIN_KEY, tts }).listen(PORT, (err) => {
  if (err?.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use: another copy of Continuum is probably still running, with older code.`);
    console.error('Close it first (Ctrl+C in its window). On Windows, if you cannot find it: Get-Process node | Stop-Process');
    process.exit(1);
  }
  if (err) throw err;
  // The picture count comes from the database, so it shows whether `npm run seed` has picked up new images.
  console.log(`Continuum on http://localhost:${PORT} · ${nodes} nodes · daily pictures: ${pictures} of 14 · reading voice: ${tts ? 'ElevenLabs' : 'phone'}`);
  // Check the ElevenLabs key once at start, and say plainly what is wrong if it does not work.
  if (tts) tts.voices().then(
    (v) => console.log(`ElevenLabs: connected, ${v.length} voices on your account.`),
    (e) => console.warn(`ElevenLabs: the key did not work: ${e.message}${e.why ? ` (${e.why})` : ''}. The app will use the phone's voice.`));
});
