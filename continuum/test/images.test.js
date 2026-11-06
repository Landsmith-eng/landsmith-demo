import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openDb, seedContent } from '../db.js';
import { createApp } from '../app.js';
import * as content from '../content/index.js';
import { images, imageProblems } from '../content/images.js';

const daily = content.nodes.filter((n) => n.seq != null).map((n) => n.id).sort();
const good = { file: 'x.webp', kind: 'illustration', alt: 'Dust motes drifting in a sunbeam.', credit: 'Generated for Continuum' };
const size = (bytes) => () => bytes;

test('the image manifest lists exactly the 14 daily nodes', () => {
  assert.deepEqual(Object.keys(images).sort(), daily);
  assert.deepEqual(content.imageIssues, []);
});

test('image entries need a real file, a kind, alt text and a credit', () => {
  assert.deepEqual(imageProblems('n', good, size(1000)), []);
  assert.match(imageProblems('n', good, size(null)).join(), /not found/);
  assert.match(imageProblems('n', good, size(900 * 1024)).join(), /under 400 KB/);
  assert.match(imageProblems('n', { ...good, file: '../x.webp' }, size(1)).join(), /plain filename/);
  assert.match(imageProblems('n', { ...good, file: 'x.gif' }, size(1)).join(), /plain filename/);
  assert.match(imageProblems('n', { ...good, kind: 'portrait' }, size(1)).join(), /kind/);
  assert.match(imageProblems('n', { ...good, alt: '' }, size(1)).join(), /alt text/);
  assert.match(imageProblems('n', { ...good, credit: ' ' }, size(1)).join(), /credit/);
  assert.match(imageProblems('n', { ...good, credit_url: 'http://x' }, size(1)).join(), /https/);
});

test('closed card gets a faded backdrop; the full image arrives only after writing', async () => {
  const db = openDb(':memory:');
  seedContent(db, content);
  db.prepare('INSERT INTO users (token, name) VALUES (?, ?)').run('t', 'T');
  const server = createApp(db, {}).listen(0);
  await new Promise((r) => server.once('listening', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = (path, body) => fetch(base + path, {
    method: body ? 'POST' : 'GET', headers: { 'x-continuum-token': 't', 'content-type': 'application/json' }, body: body && JSON.stringify(body),
  }).then((r) => r.json());
  try {
    // Whatever day 1's card is, give it a picture of its own to test with.
    const id = (await call('/api/today?date=2026-11-01')).node.id;
    const image = { src: `/img/nodes/${id}.webp`, kind: 'illustration', alt: good.alt, credit: good.credit, credit_url: null };
    db.prepare('UPDATE nodes SET image = ? WHERE id = ?').run(JSON.stringify(image), id);
    const today = await call('/api/today?date=2026-11-01');
    assert.equal(today.node.id, id); // stable for the day
    // The closed card carries the picture's address only, for the faded backdrop: no alt text or credit yet.
    assert.equal(today.node.backdrop, image.src);
    assert.equal(today.node.image, undefined);
    assert.equal(JSON.stringify(today).includes(image.alt), false);
    const after = await call('/api/respond', { node_id: id, body: 'x', date: '2026-11-01' });
    assert.deepEqual(after.node.image, image);
    // Walking to an illustrated idea you have not written on yet: no picture, no misreading (both belong to the reveal).
    const next = (await call('/api/today?date=2026-11-02')).node.id;
    const ahead = content.nodes.find((n) => n.seq != null && n.image && n.misreading && n.id !== id && n.id !== next);
    const walked = await call(`/api/node/${ahead.id}?date=2026-11-01`);
    assert.equal(walked.node.entry, null);
    assert.equal(walked.node.image, null);
    assert.equal(walked.node.misreading, null);
    // Tomorrow's card, written: its own picture and misreading arrive with the reveal.
    const written = await call('/api/respond', { node_id: next, body: 'y', date: '2026-11-02' });
    const real = db.prepare('SELECT image, misreading FROM nodes WHERE id = ?').get(next);
    assert.deepEqual(written.node.image, real.image ? JSON.parse(real.image) : null);
    assert.equal(written.node.misreading, real.misreading);
    // The idea walked to earlier still withholds its picture on later days, until it is written on.
    assert.equal((await call(`/api/node/${ahead.id}?date=2026-11-02`)).node.image, null);
  } finally { server.close(); }
});
