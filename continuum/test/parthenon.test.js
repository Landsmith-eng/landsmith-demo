import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { openDb, seedContent } from '../db.js';
import { createApp } from '../app.js';
import { createTalk } from '../talk.js';
import * as content from '../content/index.js';

let server, base; const modCalls = [];
before(async () => {
  const db = openDb(':memory:');
  seedContent(db, content);
  db.prepare('INSERT INTO users (token, name) VALUES (?, ?)').run('jon', 'Jon');
  db.prepare('INSERT INTO users (token, name) VALUES (?, ?)').run('outsider', 'Out');
  const talk = createTalk({ client: { beta: { messages: { create: async (req) => {
    if (req.output_config?.format) return { stop_reason: 'end_turn', content: [{ type: 'text', text: '{"views":[]}' }] };
    modCalls.push(req);
    return { stop_reason: 'end_turn', content: [{ type: 'text', text: 'Where the group stands: Jon holds firm. What no one has said yet: [[kant_ends_not_means]].' }] };
  } } } } });
  server = createApp(db, { talk }).listen(0);
  await new Promise((r) => server.once('listening', r));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => { server.closeAllConnections?.(); server.close(); });
const call = (path, { method = 'GET', body, token = 'jon' } = {}) => fetch(base + path, { method, headers: { ...(token ? { 'x-continuum-token': token } : {}), 'content-type': 'application/json' }, body: body && JSON.stringify(body) })
  .then(async (r) => ({ status: r.status, json: await r.json().catch(() => null) }));

test('the Parthenon: a group, an invite that lets someone new join by first name, live posts, and the moderator', async () => {
  const g = (await call('/api/groups', { method: 'POST', body: { name: 'Thursday thinkers' } })).json;
  const mine = (await call('/api/groups')).json.groups;
  assert.equal(mine.length, 1); assert.equal(mine[0].members, 1);
  const inviteCode = mine[0].invite_code;
  // Someone new, from the link: no account needed to see the group's name, then a first name is enough.
  assert.equal((await call(`/api/join/${inviteCode}`, { token: null })).json.group, 'Thursday thinkers');
  assert.equal((await call('/api/join', { method: 'POST', token: null, body: { code: inviteCode, name: '  ' } })).status, 400);
  const carey = (await call('/api/join', { method: 'POST', token: null, body: { code: inviteCode, name: 'Carey' } })).json.token;
  assert.ok(carey);
  const topic = (await call(`/api/groups/${g.id}/topics`, { method: 'POST', body: { question: 'Is it ever right to break a promise?', node_id: 'kant_ends_not_means' } })).json;
  // Outsiders cannot see or post.
  assert.equal((await call(`/api/topics/${topic.id}`, { token: 'outsider' })).status, 404);
  assert.equal((await call(`/api/topics/${topic.id}/posts`, { method: 'POST', token: 'outsider', body: { body: 'hi' } })).status, 404);
  // Jon listens live; Carey's post arrives on his line.
  const ctl = new AbortController();
  const res = await fetch(`${base}/api/topics/${topic.id}/live`, { headers: { 'x-continuum-token': 'jon' }, signal: ctl.signal });
  const reader = res.body.getReader(); const dec = new TextDecoder();
  const queue = []; let buf = '';
  const next = async () => {
    for (;;) {
      const m = queue.shift(); if (m) return m;
      const { value, done } = await reader.read(); if (done) throw new Error('stream ended');
      buf += dec.decode(value, { stream: true });
      let nl; while ((nl = buf.indexOf('\n')) >= 0) { const x = JSON.parse(buf.slice(0, nl)); buf = buf.slice(nl + 1); if (x.t !== 'ping' && x.t !== 'hello') queue.push(x); }
    }
  };
  await call(`/api/topics/${topic.id}/typing`, { method: 'POST', token: carey, body: {} });
  assert.deepEqual(await next(), { t: 'typing', name: 'Carey', user_id: 3 });
  await call(`/api/topics/${topic.id}/posts`, { method: 'POST', token: carey, body: { body: 'Only if keeping it would hurt someone.', date: '2026-11-01' } });
  const m = await next();
  assert.equal(m.t, 'post'); assert.equal(m.post.by, 'Carey'); assert.equal(m.post.body, 'Only if keeping it would hurt someone.');
  // The moderator reads the discussion (with names) and answers everyone.
  const mod = (await call(`/api/topics/${topic.id}/moderator`, { method: 'POST', token: carey, body: { date: '2026-11-01' } })).json.post;
  assert.equal(mod.moderator, true);
  assert.equal(mod.refs.kant_ends_not_means.title, content.nodes.find((n) => n.id === 'kant_ends_not_means').title);
  assert.match(modCalls[0].messages[0].content, /Carey: Only if keeping it would hurt someone\./);
  const live = await next();
  assert.ok(live.t === 'typing' ? (await next()).post.moderator : live.post.moderator);
  ctl.abort();
  const t = (await call(`/api/topics/${topic.id}`, { token: carey })).json;
  assert.deepEqual(t.members, ['Jon', 'Carey']);
  assert.equal(t.posts.length, 2);
  assert.equal(t.idea.id, 'kant_ends_not_means');
});
