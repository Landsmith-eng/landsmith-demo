// Natural reading voices through ElevenLabs. The key stays on the server (from .env); the phone only ever gets audio.
// Every clip is saved by a hash of its voice, model and text, so a part is paid for once and replays for free.
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const API = 'https://api.elevenlabs.io/v1';
export const DEFAULT_VOICE = 'JBFqnCBsd6RMkjVDRZzb'; // "George": warm, unhurried narration
export const DEFAULT_MODEL = 'eleven_multilingual_v2';
export const MAX_TEXT = 2500;
const VOICE_RE = /^[A-Za-z0-9]{8,40}$/;

export function createTts({ apiKey, voiceId = DEFAULT_VOICE, model = DEFAULT_MODEL, cacheDir, fetchImpl = fetch } = {}) {
  if (!apiKey) return null;
  if (cacheDir) mkdirSync(cacheDir, { recursive: true });
  let voiceList = null; let voiceListAt = 0;

  return {
    voiceId,
    validVoice: (id) => typeof id === 'string' && VOICE_RE.test(id),

    // The voices on the user's ElevenLabs account, for the Voice sheet. Cached for ten minutes.
    async voices() {
      if (voiceList && Date.now() - voiceListAt < 600_000) return voiceList;
      const res = await fetchImpl(`${API}/voices`, { headers: { 'xi-api-key': apiKey } });
      if (!res.ok) throw Object.assign(new Error(`elevenlabs_${res.status}`), { status: res.status });
      const { voices = [] } = await res.json();
      voiceList = voices.map((v) => ({
        id: v.voice_id, name: v.name,
        note: [v.labels?.accent, v.labels?.description ?? v.labels?.descriptive, v.labels?.age, v.labels?.gender].filter(Boolean).join(', '),
      }));
      voiceListAt = Date.now();
      return voiceList;
    },

    // One clip of speech (MP3). Returns { audio: Buffer, cached: boolean }.
    async speak(text, voice = voiceId) {
      const key = createHash('sha256').update(`${voice}\n${model}\n${text}`).digest('hex').slice(0, 32);
      const file = cacheDir && join(cacheDir, `${key}.mp3`);
      if (file && existsSync(file)) return { audio: readFileSync(file), cached: true };
      const res = await fetchImpl(`${API}/text-to-speech/${voice}?output_format=mp3_44100_128`, {
        method: 'POST',
        headers: { 'xi-api-key': apiKey, 'content-type': 'application/json', accept: 'audio/mpeg' },
        body: JSON.stringify({ text, model_id: model }),
      });
      if (!res.ok) throw Object.assign(new Error(`elevenlabs_${res.status}`), { status: res.status });
      const audio = Buffer.from(await res.arrayBuffer());
      if (file) writeFileSync(file, audio);
      return { audio, cached: false };
    },
  };
}
