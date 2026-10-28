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
