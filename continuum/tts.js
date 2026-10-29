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

// ElevenLabs explains a refusal in its JSON body (a missing permission, no credits, a bad key): keep that message.
async function failure(res) {
  let why = '';
  try { const b = await res.json(); why = b?.detail?.message ?? b?.detail?.status ?? (typeof b?.detail === 'string' ? b.detail : '') ?? ''; } catch { /* not JSON */ }
  return Object.assign(new Error(`elevenlabs_${res.status}`), { status: res.status, why });
}

export const DEFAULT_STT_MODEL = 'scribe_v2';
export function createTts({ apiKey, voiceId = DEFAULT_VOICE, model = DEFAULT_MODEL, sttModel = DEFAULT_STT_MODEL, cacheDir, fetchImpl = fetch } = {}) {
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
      if (!res.ok) throw await failure(res);
      const { voices = [] } = await res.json();
      voiceList = voices.map((v) => ({
        id: v.voice_id, name: v.name,
        note: [v.labels?.accent, v.labels?.description ?? v.labels?.descriptive, v.labels?.age, v.labels?.gender].filter(Boolean).join(', '),
      }));
      voiceListAt = Date.now();
      return voiceList;
    },

    // Speech to text with ElevenLabs Scribe (POST /v1/speech-to-text, checked against ElevenLabs' API reference on
    // 2026-10-29): a recording from the phone (webm, ogg, mp4 or wav) becomes text. Much
    // more exact than the phone's own recognition. Nothing is kept: the audio goes to ElevenLabs and the text comes
    // back. Tries the current model, then the earlier one if the account does not offer it.
    async transcribe(audio, mime = 'audio/webm', { language = null } = {}) {
      let last = null;
      for (const model of [sttModel, 'scribe_v1'].filter((m, i, a) => a.indexOf(m) === i)) {
        const form = new FormData();
        form.append('file', new Blob([audio], { type: mime }), `speech.${mime.includes('mp4') ? 'mp4' : mime.includes('ogg') ? 'ogg' : mime.includes('wav') ? 'wav' : 'webm'}`);
        form.append('model_id', model);
        form.append('tag_audio_events', 'false');
        if (model === 'scribe_v2') form.append('no_verbatim', 'true'); // drop "um", false starts and the like
        if (language) form.append('language_code', language);
        const res = await fetchImpl(`${API}/speech-to-text`, { method: 'POST', headers: { 'xi-api-key': apiKey }, body: form });
        if (res.ok) { const b = await res.json(); return { text: (b.text ?? '').trim(), model }; }
        last = await failure(res);
        if (![400, 404, 422].includes(res.status)) break; // only a model the account lacks is worth a second try
      }
      throw last;
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
      if (!res.ok) throw await failure(res);
      const audio = Buffer.from(await res.arrayBuffer());
      if (file) writeFileSync(file, audio);
      return { audio, cached: false };
    },
  };
}
