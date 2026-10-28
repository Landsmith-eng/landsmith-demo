import { fileURLToPath } from 'node:url';
import { openDb } from './db.js';
import { createApp } from './app.js';
import { createTts } from './tts.js';
import { createTalk, connectTalk } from './talk.js';
import { existsSync, readFileSync } from 'node:fs';

// Private settings (the API keys) live in .env next to this file, never in git. KEY=value, one per line. A value in
// .env wins over the same name set elsewhere on the computer, so the file is the one place to change a key.
const ENV_FILE = fileURLToPath(new URL('./.env', import.meta.url));
const fromFile = new Set();
if (existsSync(ENV_FILE)) {
  for (const line of readFileSync(ENV_FILE, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    const value = m && m[2].replace(/^(['"])(.*)\1$/, '$2');
    if (m && value && !line.trimStart().startsWith('#')) { process.env[m[1]] = value; fromFile.add(m[1]); }
  }
}
// Where a key came from, and its shape (never the key itself): enough to see a wrong, cut-off or stray key.
const keyShape = (name, expect) => {
  const k = process.env[name] ?? '';
  return `the key ${fromFile.has(name) ? 'in .env' : 'set elsewhere on this computer (not in .env)'} starts with "${k.slice(0, 7)}" and is ${k.length} characters long; ${expect}`;
};

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

const talk = createTalk({ apiKey: process.env.ANTHROPIC_API_KEY, model: process.env.CONTINUUM_TALK_MODEL || undefined });

createApp(db, {
  adminKey: process.env.CONTINUUM_ADMIN_KEY, tts, talk,
  talkDailyLimit: Number(process.env.CONTINUUM_TALK_DAILY_LIMIT) || undefined,
}).listen(PORT, (err) => {
  if (err?.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use: another copy of Continuum is probably still running, with older code.`);
    console.error('Close it first (Ctrl+C in its window). On Windows, if you cannot find it: Get-Process node | Stop-Process');
    process.exit(1);
  }
  if (err) throw err;
  // The picture count comes from the database, so it shows whether `npm run seed` has picked up new images.
  console.log(`Continuum on http://localhost:${PORT} · ${nodes} nodes · daily pictures: ${pictures} of 14 · reading voice: ${tts ? 'ElevenLabs' : 'phone'}`);
  // Check the Anthropic key once at start (looking up the model costs nothing).
  if (talk) connectTalk(talk).then(({ ok, via, error: e }) => {
    if (ok) return console.log(`Talk: connected to Claude (${talk.model}${via === 'x-api-key' ? ', key sent as x-api-key' : ''}).`);
    console.warn(`Talk: the Anthropic key did not work (${e.status ?? ''}). Talk is off until it does.`);
    console.warn(`  ${keyShape('ANTHROPIC_API_KEY', 'an Anthropic key starts with "sk-ant-api" or "sk-ant-usr" and is about 108 characters.')}`);
    if (process.env.ANTHROPIC_BASE_URL && !/^https:\/\/api\.anthropic\.com\/?$/.test(process.env.ANTHROPIC_BASE_URL)) console.warn(`  ANTHROPIC_BASE_URL is set to ${process.env.ANTHROPIC_BASE_URL}, which sends requests somewhere other than Anthropic.`);
    if (e?.message) console.warn(`  Anthropic said: ${e.message.slice(0, 300)}`);
  });
  else console.log('Talk: off (add ANTHROPIC_API_KEY to .env to turn it on).');
  // Check the ElevenLabs key once at start, and say plainly what is wrong if it does not work.
  if (tts) tts.voices().then(
    (v) => console.log(`ElevenLabs: connected, ${v.length} voices on your account.`),
    (e) => {
      console.warn(`ElevenLabs: the key did not work: ${e.message}${e.why ? ` (${e.why})` : ''}. The app will use the phone's voice.`);
      // The key's shape, never the key: a cut-off or masked copy is the usual cause.
      console.warn(`  ${keyShape('ELEVENLABS_API_KEY', 'a full ElevenLabs key starts with "sk_" and is about 51 characters.')}`);
    });
});
