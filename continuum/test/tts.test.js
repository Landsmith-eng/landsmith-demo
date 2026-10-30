import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { openDb, seedContent } from '../db.js';
import { createApp } from '../app.js';
import { createTts, DEFAULT_VOICE } from '../tts.js';
import * as content from '../content/index.js';

async function boot(tts) {
  const db = openDb(':memory:');
  seedContent(db, content);
  db.prepare('INSERT INTO users (token, name) VALUES (?, ?)').run('t', 'T');
  const server = createApp(db, { tts }).listen(0);
  await new Promise((r) => server.once('listening', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = (path, body, token = 't') => fetch(base + path, {
    method: body ? 'POST' : 'GET', headers: { 'x-continuum-token': token, 'content-type': 'application/json' }, body: body && JSON.stringify(body),
  });
  return { server, call };
}

// A stand-in for the ElevenLabs API: records each request and answers like the real one.
function fakeElevenLabs() {
  const calls = [];
  const fetchImpl = async (url, opts = {}) => {
    calls.push({ url, opts });
    if (url.endsWith('/voices')) {
      return new Response(JSON.stringify({ voices: [{ voice_id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George', labels: { accent: 'british', description: 'warm', gender: 'male' } }] }));
    }
    return new Response(new Uint8Array([0x49, 0x44, 0x33, 1, 2, 3]), { headers: { 'content-type': 'audio/mpeg' } });
  };
  return { calls, fetchImpl };
}

test('tts: off without a key; the phone voice is used and the endpoints say so', async () => {
  assert.equal(createTts({}), null);
  const { server, call } = await boot(null);
  try {
    assert.deepEqual(await (await call('/api/tts')).json(), { enabled: false, voice_id: null });
    assert.equal((await call('/api/tts', { text: 'Hello.' })).status, 404);
  } finally { server.close(); }
});

test('tts: speaks through ElevenLabs with the key on the server, and saves each clip so it is paid for once', async () => {
  const el = fakeElevenLabs();
  const tts = createTts({ apiKey: 'secret-key', cacheDir: mkdtempSync(join(tmpdir(), 'tts-')), fetchImpl: el.fetchImpl });
  const { server, call } = await boot(tts);
  try {
    assert.deepEqual(await (await call('/api/tts')).json(), { enabled: true, voice_id: DEFAULT_VOICE });
    let r = await call('/api/tts', { text: 'Some things are up to us.' });
    assert.equal(r.status, 200);
    assert.equal(r.headers.get('content-type'), 'audio/mpeg');
    assert.equal(r.headers.get('x-tts-cache'), 'miss');
    assert.equal((await r.arrayBuffer()).byteLength, 6);
    const sent = el.calls[0];
    assert.match(sent.url, new RegExp(`/text-to-speech/${DEFAULT_VOICE}\\?output_format=mp3`));
    assert.equal(sent.opts.headers['xi-api-key'], 'secret-key');
    assert.equal(JSON.parse(sent.opts.body).text, 'Some things are up to us.');
    // The same words again come from the saved clip, not from ElevenLabs.
    r = await call('/api/tts', { text: 'Some things are up to us.' });
    assert.equal(r.headers.get('x-tts-cache'), 'hit');
    assert.equal(el.calls.length, 1);
    // Another voice is another clip.
    await call('/api/tts', { text: 'Some things are up to us.', voice_id: 'pNInz6obpgDQGcFmaJgB' });
    assert.equal(el.calls.length, 2);
    // The account's voices, for the Voice sheet.
    const v = await (await call('/api/tts/voices')).json();
    assert.deepEqual(v.voices[0], { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George', note: 'british, warm, male' });
    // Guards: sign-in, empty or overlong text, a malformed voice id.
    assert.equal((await call('/api/tts', { text: 'x' }, 'wrong')).status, 401);
    assert.equal((await call('/api/tts', { text: '  ' })).status, 400);
    assert.equal((await call('/api/tts', { text: 'a'.repeat(2501) })).status, 400);
    assert.equal((await call('/api/tts', { text: 'x', voice_id: '../../etc' })).status, 400);
  } finally { server.close(); }
});

test('tts: an ElevenLabs failure (no credits, bad key) comes back as an error the app can fall back from', async () => {
  const tts = createTts({ apiKey: 'k', cacheDir: mkdtempSync(join(tmpdir(), 'tts-')), fetchImpl: async () => new Response('{}', { status: 401 }) });
  const { server, call } = await boot(tts);
  try {
    const r = await call('/api/tts', { text: 'Hello.' });
    assert.equal(r.status, 502);
    assert.equal((await r.json()).error, 'elevenlabs_401');
  } finally { server.close(); }
});

test('speech to text: the recording goes to ElevenLabs Scribe and the text comes back; an older model is tried if needed', async () => {
  const calls = [];
  const fetchImpl = async (url, opts = {}) => {
    calls.push({ url, model: opts.body?.get?.('model_id'), file: opts.body?.get?.('file') });
    if (opts.body?.get?.('model_id') === 'scribe_v2') return new Response(JSON.stringify({ detail: { message: 'model not available' } }), { status: 422 });
    return new Response(JSON.stringify({ text: ' I think a promise is a promise. ' }));
  };
  const tts = createTts({ apiKey: 'k', fetchImpl });
  const { server, call } = await boot(tts);
  try {
    assert.deepEqual(await (await call('/api/stt')).json(), { enabled: true });
    const audio = new Uint8Array(4000).fill(7);
    const r = await fetch(`${new URL((await call('/api/stt')).url).origin}/api/stt?lang=en`, { method: 'POST', headers: { 'x-continuum-token': 't', 'content-type': 'audio/webm' }, body: audio });
    assert.deepEqual(await r.json(), { text: 'I think a promise is a promise.' });
    assert.deepEqual(calls.map((c) => c.model), ['scribe_v2', 'scribe_v1']);
    assert.ok(calls.every((c) => c.url.endsWith('/speech-to-text') && c.file.size === 4000));
    // Too short to be speech: refused without calling ElevenLabs.
    const short = await fetch(`${new URL(r.url).origin}/api/stt`, { method: 'POST', headers: { 'x-continuum-token': 't', 'content-type': 'audio/webm' }, body: new Uint8Array(10) });
    assert.equal(short.status, 400);
    assert.equal(calls.length, 2);
  } finally { server.close(); }
  const off = await boot(null);
  try { assert.deepEqual(await (await off.call('/api/stt')).json(), { enabled: false }); } finally { off.server.close(); }
});

test('reading with timings: the clip and each letter\'s start time, kept beside the clip', async () => {
  const calls = [];
  const fetchImpl = async (url, opts) => {
    calls.push(url);
    return new Response(JSON.stringify({ audio_base64: Buffer.from('MP3DATA').toString('base64'),
      alignment: { characters: [...'Hi you'], character_start_times_seconds: [0, .1, .2, .25, .3, .41234], character_end_times_seconds: [] } }));
  };
  const tts = createTts({ apiKey: 'k', cacheDir: mkdtempSync(join(tmpdir(), 'tts-')), fetchImpl });
  const { server, call } = await boot(tts);
  const r = await call('/api/tts/timed', { text: 'Hi you' }).then((x) => x.json());
  assert.match(calls[0], /\/text-to-speech\/[A-Za-z0-9]+\/with-timestamps\?output_format=mp3_44100_128$/);
  assert.equal(Buffer.from(r.audio, 'base64').toString(), 'MP3DATA');
  assert.deepEqual(r.starts, [0, .1, .2, .25, .3, .412]);
  await call('/api/tts/timed', { text: 'Hi you' }).then((x) => x.json());
  assert.equal(calls.length, 1); // the second time from the kept copy
  server.close();
});
