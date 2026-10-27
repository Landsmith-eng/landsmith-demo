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

test('the image reaches the API only after the user has written', async () => {
  const image = { src: '/img/nodes/democritus_atoms_and_void.webp', kind: 'illustration', alt: good.alt, credit: good.credit, credit_url: null };
  const nodes = content.nodes.map((n) => (n.id === 'democritus_atoms_and_void' ? { ...n, image } : n));
  const db = openDb(':memory:');
  seedContent(db, { nodes, edges: content.edges });
  db.prepare('INSERT INTO users (token, name) VALUES (?, ?)').run('t', 'T');
  const server = createApp(db, {}).listen(0);
  await new Promise((r) => server.once('listening', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = (path, body) => fetch(base + path, {
    method: body ? 'POST' : 'GET', headers: { 'x-continuum-token': 't', 'content-type': 'application/json' }, body: body && JSON.stringify(body),
  }).then((r) => r.json());
  try {
    const today = await call('/api/today?date=2026-11-01');
    assert.equal(today.node.id, 'democritus_atoms_and_void');
    assert.equal(JSON.stringify(today).includes('img/nodes'), false); // closed card carries no picture
    const after = await call('/api/respond', { node_id: 'democritus_atoms_and_void', body: 'x', date: '2026-11-01' });
    assert.deepEqual(after.node.image, image);
    // Walking to a daily node you have not written on yet: no picture, no misreading.
    const ahead = await call('/api/node/epicurus_absence_of_pain?date=2026-11-01');
    assert.equal(ahead.node.entry, null);
    assert.equal(ahead.node.image, null);
    assert.equal(ahead.node.misreading, null);
    const written = await call('/api/respond', { node_id: 'epicurus_absence_of_pain', body: 'y', date: '2026-11-02' });
    const real = content.nodes.find((n) => n.id === 'epicurus_absence_of_pain');
    assert.deepEqual(written.node.image, real.image ?? null);
    assert.equal(written.node.misreading, real.misreading);
  } finally { server.close(); }
});
