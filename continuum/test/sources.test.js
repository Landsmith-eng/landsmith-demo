import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openDb, seedContent } from '../db.js';
import { createApp } from '../app.js';
import { createSources, mirrorPath, gutenbergId } from '../sources.js';
import * as content from '../content/index.js';

// A pretend internet: which hosts are up, and every request made.
function net(up) {
  const calls = [];
  const fetchImpl = async (url, opts = {}) => {
    calls.push({ url, method: opts.method ?? 'GET' });
    const host = new URL(url).hostname;
    if (!up.has(host)) throw Object.assign(new Error('down'), { name: 'TypeError' });
    if (host === 'standardebooks.org' && url.includes('?query=')) return new Response('<a href="/ebooks/epictetus/short-works/george-long">Short Works</a>');
    if (host === 'archive.org' && url.includes('advancedsearch')) return new Response(JSON.stringify({ response: { docs: [{ identifier: 'found-on-ia' }] } }));
    return new Response('ok', { status: 200 });
  };
  return { fetchImpl, calls };
}
const BOOK = 'https://www.gutenberg.org/ebooks/45109';
const books = { 45109: { title: 'The Enchiridion', author: 'Epictetus', ia: 'theenchiridion45109gut' } };

test('the mirror layout and the book number', () => {
  assert.equal(mirrorPath('45109'), '4/5/1/0/45109/');
  assert.equal(mirrorPath('10'), '1/10/');
  assert.equal(mirrorPath('7'), '0/7/');
  assert.equal(gutenbergId(BOOK), '45109');
  assert.equal(gutenbergId('https://en.wikisource.org/wiki/X'), null);
});

test('Gutenberg first; when it is down, a mirror, then Standard Ebooks, then the Internet Archive; else no link', async () => {
  const fails = [];
  const run = async (up) => { const n = net(new Set(up)); const s = createSources({ fetchImpl: n.fetchImpl, books, onFailure: (host) => fails.push(host) }); return { r: await s.resolve(BOOK), n, s }; };
  let { r } = await run(['www.gutenberg.org']);
  assert.deepEqual([r.ok, r.url, r.via], [true, BOOK, 'gutenberg']);
  ({ r } = await run(['gutenberg.pglaf.org']));
  assert.deepEqual([r.via, r.url], ['mirror', 'https://gutenberg.pglaf.org/4/5/1/0/45109/']);
  ({ r } = await run(['aleph.gutenberg.org']));
  assert.equal(r.url, 'https://aleph.gutenberg.org/4/5/1/0/45109/');
  ({ r } = await run(['standardebooks.org']));
  assert.deepEqual([r.via, r.url], ['standardebooks', 'https://standardebooks.org/ebooks/epictetus/short-works/george-long']);
  ({ r } = await run(['archive.org']));
  assert.deepEqual([r.via, r.url], ['archive', 'https://archive.org/details/theenchiridion45109gut']);
  assert.equal(r.book.title, 'The Enchiridion');
  fails.length = 0;
  ({ r } = await run([]));
  assert.equal(r.ok, false);
  assert.ok(['www.gutenberg.org', 'gutenberg.pglaf.org', 'aleph.gutenberg.org'].every((h) => fails.includes(h)), fails.join());
  // A book not known ahead: the Internet Archive is searched by its title and author.
  const n = net(new Set(['archive.org']));
  const s2 = createSources({ fetchImpl: n.fetchImpl, books: { 1: { title: 'Meditations', author: 'Marcus Aurelius' } } });
  assert.equal((await s2.resolve('https://www.gutenberg.org/ebooks/1')).url, 'https://archive.org/details/found-on-ia');
});

test('checks are kept for fifteen minutes; a refused HEAD is tried as a GET', async () => {
  let t = 0; const n = net(new Set(['www.gutenberg.org']));
  const s = createSources({ fetchImpl: n.fetchImpl, books, now: () => t });
  await s.resolve(BOOK); await s.resolve(BOOK);
  assert.equal(n.calls.length, 1);
  t = 16 * 60_000; await s.resolve(BOOK);
  assert.equal(n.calls.length, 2);
  const calls = [];
  const s3 = createSources({ fetchImpl: async (url, o) => { calls.push(o.method); return new Response('', { status: o.method === 'HEAD' ? 405 : 200 }); } });
  assert.equal(await s3.check('https://example.org/x'), true);
  assert.deepEqual(calls, ['HEAD', 'GET']);
});

test('the app: links go through /go, which opens a working copy or says the source is unavailable; failures logged by site and time', async () => {
  const db = openDb(':memory:'); seedContent(db, content);
  db.prepare('INSERT INTO users (token, name) VALUES (?, ?)').run('t', 'T');
  let up = new Set(['archive.org']);
  const server = createApp(db, { adminKey: 'k', sourceFetch: (u, o) => net(up).fetchImpl(u, o) }).listen(0);
  await new Promise((r) => server.once('listening', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const id = db.prepare("SELECT id FROM nodes WHERE source_url LIKE 'https://www.gutenberg.org/ebooks/%' ORDER BY id LIMIT 1").get().id;
  try {
    const a = await (await fetch(`${base}/api/source/${id}`, { headers: { 'x-continuum-token': 't' } })).json();
    assert.equal(a.ok, true); assert.equal(a.via, 'archive');
    const go = await fetch(`${base}/go/${id}`, { redirect: 'manual' });
    assert.equal(go.status, 302); assert.match(go.headers.get('location'), /^https:\/\/archive\.org\/details\//);
    // Everything down (a different idea, so nothing is cached for it).
    up = new Set();
    const other = db.prepare("SELECT id FROM nodes WHERE source_url LIKE 'https://www.gutenberg.org/ebooks/%' AND source_url != (SELECT source_url FROM nodes WHERE id = ?) ORDER BY id LIMIT 1").get(id).id;
    const b = await (await fetch(`${base}/api/source/${other}`, { headers: { 'x-continuum-token': 't' } })).json();
    assert.deepEqual([b.ok, b.message], [false, 'Source temporarily unavailable — try again later']);
    const page = await fetch(`${base}/go/${other}`);
    assert.equal(page.status, 503); assert.match(await page.text(), /Source temporarily unavailable/);
    const log = await (await fetch(`${base}/admin/api/sources`, { headers: { 'x-admin-key': 'k' } })).json();
    assert.ok(log.by_site.some((x) => x.host === 'www.gutenberg.org'));
    assert.deepEqual(Object.keys(log.recent[0]).sort(), ['at', 'host', 'why']); // nothing about who
    assert.equal((await fetch(`${base}/api/source/no_such`, { headers: { 'x-continuum-token': 't' } })).status, 404);
  } finally { server.close(); }
});
