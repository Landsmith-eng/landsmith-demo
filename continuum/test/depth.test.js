import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openDb, seedContent } from '../db.js';
import { createApp } from '../app.js';
import { createTalk } from '../talk.js';
import * as content from '../content/index.js';

// A stand-in for Claude: streamed replies are scripted; the risk check and summaries answer from `judge`.
function fake(replies, judge = () => ({ risk: 'none', imminent: false })) {
  const streamed = [];
  const client = { beta: { messages: {
    stream(params) {
      streamed.push(structuredClone(params)); const text = replies.shift() ?? 'Mm.'; const fns = [];
      return { on(ev, fn) { if (ev === 'text') fns.push(fn); return this; }, async finalMessage() { fns.forEach((f) => f(text)); return { stop_reason: 'end_turn', content: [{ type: 'text', text }] }; } };
    },
    async create(params) {
      const p = params.output_config?.format?.schema?.properties ?? {};
      const body = p.risk ? judge(params.messages[0].content) : p.perspectives ? { title: 'A dream of water', points: ['You dreamt of a flood.'], perspectives: [], connections: [{ name: 'Jung on water', when: 'Zurich, 1930s', link: 'Water as the unconscious rising.', ask: 'What was the water carrying?' }] } : { items: [] };
      return { stop_reason: 'end_turn', content: [{ type: 'text', text: JSON.stringify(body) }] };
    },
  } } };
  return { client, streamed };
}
async function boot(client) {
  const db = openDb(':memory:'); seedContent(db, content);
  for (const t of ['t', 'u']) db.prepare('INSERT INTO users (token, name) VALUES (?, ?)').run(t, t.toUpperCase());
  const server = createApp(db, { talk: createTalk({ client }) }).listen(0);
  await new Promise((r) => server.once('listening', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = (path, body, token = 't') => fetch(base + path, { method: body ? 'POST' : 'GET', headers: { 'x-continuum-token': token, 'content-type': 'application/json' }, body: body && JSON.stringify(body) });
  const lines = async (r) => (await r.text()).trim().split('\n').map((l) => JSON.parse(l));
  return { db, server, call, lines };
}
const sys = (params) => params.system.map((b) => b.text).join('\n');

test('depth: level 1 by default; the user sets their own; an offer raises it for one conversation only; a role is kept', async () => {
  const f = fake(['A flood is an old image. Would you like to go further with this? [[go_deeper]]', 'Tell me about the water.', 'And the house?', 'Mm.']);
  const { server, call, lines } = await boot(f.client);
  try {
    const a = await lines(await call('/api/talk', { text: 'I dreamt of a flood.', date: '2026-11-10' }));
    const id = a[0].id;
    assert.match(sys(f.streamed[0]), /Depth: level 1, ideas/);
    assert.equal(a.at(-1).offer, 2); // the marker becomes a button for level 2
    // Accepting the offer: this conversation only.
    let s = await (await call('/api/talk/settings', { id, depth: 2, scope: 'talk' })).json();
    assert.deepEqual([s.depth, s.depth_default, s.depth_here], [2, 1, 2]);
    // A role for this conversation.
    s = await (await call('/api/talk/settings', { id, role: '  a shaman ' })).json();
    assert.equal(s.role, 'a shaman');
    await lines(await call('/api/talk', { id, text: 'The water was warm.', date: '2026-11-10' }));
    assert.match(sys(f.streamed[1]), /Depth: level 2, your life/);
    assert.match(sys(f.streamed[1]), /speak as a shaman/);
    assert.equal(f.streamed[1].system[0].cache_control, undefined); // the rules stay the same; the cached map is untouched
    const t = await (await call(`/api/talk?id=${id}&date=2026-11-10`)).json();
    assert.deepEqual([t.depth, t.role], [2, 'a shaman']);
    // A new conversation starts from their own setting, without the role.
    const b = await lines(await call('/api/talk', { text: 'Something else.', date: '2026-11-10' }));
    assert.match(sys(f.streamed[2]), /Depth: level 1/);
    assert.doesNotMatch(sys(f.streamed[2]), /speak as/);
    // Their own default, from the options: level 3 everywhere.
    s = await (await call('/api/talk/settings', { id: b[0].id, depth: 3, scope: 'default' })).json();
    assert.deepEqual([s.depth, s.depth_default], [3, 3]);
    await lines(await call('/api/talk', { id: b[0].id, text: 'Go on.', date: '2026-11-10' }));
    assert.match(sys(f.streamed[3]), /Depth: level 3, all the way/);
    assert.match(sys(f.streamed[3]), /What you have talked about before[\s\S]*A dream of water[\s\S]*Jung on water/); // the earlier conversation, woven in
    assert.equal((await call('/api/talk/settings', { depth: 7 })).status, 400);
  } finally { server.close(); }
});

test('safety: signs of danger to others or themselves put help on screen; nothing else happens', async () => {
  const f = fake(['I hear how angry you are. Are you and they safe right now?', 'That sounds maddening.'], (m) => (/shoot/.test(m) ? { risk: 'others', imminent: true } : { risk: 'none', imminent: false }));
  const { server, call, lines } = await boot(f.client);
  try {
    const a = await lines(await call('/api/talk', { text: 'The landlord ignores the mold. I could shoot him.', date: '2026-11-10' }));
    assert.deepEqual(a.find((m) => m.t === 'safety'), { t: 'safety', risk: 'others', imminent: true });
    const b = await lines(await call('/api/talk', { id: a[0].id, text: 'The mold is back again.', date: '2026-11-10' }));
    assert.equal(b.find((m) => m.t === 'safety'), undefined);
    assert.match(sys(f.streamed[0]), /911 if anyone is in danger now/);
  } finally { server.close(); }
});

test('a thread from an earlier conversation comes back on the opening screen, once, and not too often', async () => {
  const f = fake(['Tell me about the water.']);
  const { db, server, call, lines } = await boot(f.client);
  try {
    const a = await lines(await call('/api/talk', { text: 'I dreamt of a flood.', date: '2026-11-01' }));
    for (let i = 0; i < 50; i++) { if (db.prepare('SELECT summary FROM talks WHERE id = ?').get(a[0].id).summary) break; await new Promise((r) => setTimeout(r, 10)); }
    db.prepare("UPDATE talks SET updated_at = '2026-11-01 10:00:00'").run();
    assert.equal((await (await call('/api/lure?date=2026-11-02')).json()).revisit, null); // too soon
    const o = await (await call('/api/lure?date=2026-11-06')).json();
    assert.equal(o.revisit.name, 'Jung on water'); assert.equal(o.revisit.talk, a[0].id);
    assert.equal((await (await call('/api/lure?date=2026-11-06')).json()).revisit.name, 'Jung on water'); // the same all day
    assert.equal((await (await call('/api/lure?date=2026-11-12')).json()).revisit, null); // each thread once
  } finally { server.close(); }
});

test('their data: download everything (no keys), delete everything (a group they started passes on)', async () => {
  const f = fake(['Mm.']);
  const { db, server, call, lines } = await boot(f.client);
  try {
    await call('/api/today?date=2026-11-01');
    const n = (await (await call('/api/today?date=2026-11-01')).json()).node.id;
    await call('/api/respond', { node_id: n, body: 'My own words.', date: '2026-11-01' });
    await lines(await call('/api/talk', { text: 'About my boss.', date: '2026-11-01' }));
    await call('/api/push', { subscription: { endpoint: 'https://push.example/x', keys: { p256dh: 'p', auth: 'q' } } });
    const uid = db.prepare("SELECT id FROM users WHERE token = 't'").get().id; const other = db.prepare("SELECT id FROM users WHERE token = 'u'").get().id;
    const g = Number(db.prepare("INSERT INTO groups (name, invite_code, created_by) VALUES ('Friends', 'abc', ?)").run(uid).lastInsertRowid);
    db.prepare('INSERT INTO group_members (group_id, user_id) VALUES (?, ?), (?, ?)').run(g, uid, g, other);
    const r = await call('/api/me/export');
    assert.match(r.headers.get('content-disposition'), /attachment; filename="continuum-/);
    const x = await r.json();
    assert.equal(x.journal[0].body, 'My own words.');
    assert.equal(x.talks[0].conversation[0].text, 'About my boss.');
    assert.equal(x.push_subs[0].keys, undefined);
    assert.equal((await call('/api/me/delete', { confirm: 'no' })).status, 400);
    assert.deepEqual(await (await call('/api/me/delete', { confirm: 'DELETE' })).json(), { deleted: true });
    assert.equal(db.prepare('SELECT COUNT(*) AS n FROM users WHERE id = ?').get(uid).n, 0);
    for (const t of ['journal', 'talks', 'events', 'lures', 'push_subs', 'group_members']) assert.equal(db.prepare(`SELECT COUNT(*) AS n FROM ${t} WHERE user_id = ?`).get(uid).n, 0, t);
    assert.equal(db.prepare('SELECT created_by FROM groups WHERE id = ?').get(g).created_by, other);
    assert.equal((await call('/api/today?date=2026-11-01')).status, 401); // the link no longer works
  } finally { server.close(); }
});
