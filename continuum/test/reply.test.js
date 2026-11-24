import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openDb, seedContent } from '../db.js';
import { createApp } from '../app.js';
import { createTalk } from '../talk.js';
import * as content from '../content/index.js';

const D = '2026-11-01';
async function boot(reply) {
  const db = openDb(':memory:'); seedContent(db, content);
  db.prepare('INSERT INTO users (token, name) VALUES (?, ?)').run('t', 'Sam');
  const asked = [];
  const client = { beta: { messages: { create: async (params) => {
    asked.push(params);
    if (params.output_config?.format?.schema?.properties?.themes) {
      if (reply === 'fail') throw Object.assign(new Error('down'), { status: 500 });
      return { stop_reason: 'end_turn', content: [{ type: 'text', text: JSON.stringify(reply(params)) }] };
    }
    throw new Error('not in this test'); // other calls (views, reflections) fall back
  } } } };
  const server = createApp(db, { talk: createTalk({ client }) }).listen(0);
  await new Promise((r) => server.once('listening', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = (path, body) => fetch(base + path, { method: body ? 'POST' : 'GET', headers: { 'x-continuum-token': 't', 'content-type': 'application/json' }, body: body && JSON.stringify(body) }).then(async (r) => ({ status: r.status, json: await r.json() }));
  return { db, server, call, asked };
}

test('a reply to an answer engages with it, links ideas found across the map, offers a next step, and keeps the themes', async () => {
  let candidates = [];
  const { db, server, call, asked } = await boot((params) => {
    candidates = [...params.messages[0].content.matchAll(/^([a-z0-9_]+) \|/gm)].map((m) => m[1]);
    const real = candidates.find((id) => !id.startsWith('practice_'));
    return { reply: 'You keep coming back to the people you would let down.', themes: ['Fear of letting others down', 'duty'],
      links: [{ id: real, line: 'This echoes Seneca on the day reviewed.' }, { id: 'made_up_idea', line: 'Invented.' }],
      next: { kind: 'practice', id: 'practice_examine_daily', label: 'Try it: look back on today tonight' } };
  });
  try {
    const n = (await call(`/api/trainer/next?date=${D}`)).json.story;
    const r = await call('/api/trainer/respond', { node: n.id, text: 'Honestly I worry I would freeze, and then think about how I let my family down.', question: 'Would you wade in?', date: D });
    const reply = r.json.reply;
    assert.equal(reply.text, 'You keep coming back to the people you would let down.');
    assert.equal(r.json.ack, '', 'the reply replaces the short line');
    assert.equal(reply.links.length, 1, 'an idea not on the map is dropped'); assert.ok(reply.links[0].title);
    assert.deepEqual(reply.next, { kind: 'practice', id: 'practice_examine_daily', label: 'Try it: look back on today tonight', title: db.prepare('SELECT title FROM nodes WHERE id = ?').get('practice_examine_daily').title });
    // What went to Claude: the passage, the question, the answer, related ideas from the whole map, the seven practices.
    const content = asked.at(-1).messages[0].content;
    assert.match(content, /Would you wade in\?/); assert.match(content, /let my family down/);
    assert.ok(candidates.filter((id) => !id.startsWith('practice_')).length >= 5, 'candidates found across the map');
    assert.equal((content.match(/^practice_/gm) ?? []).length, 7, 'the seven practices');
    assert.match(asked.at(-1).system, /Never diagnose/);
    // Themes kept with the answer, lowercased; findable from Recently read; known to Talk.
    assert.deepEqual(JSON.parse(db.prepare('SELECT themes FROM answer_themes').get().themes), ['fear of letting others down', 'duty']);
    assert.ok((await call('/api/recent?q=letting+others')).json.items.some((x) => x.id === n.id));
    // Trying replies out (before and after) keeps nothing.
    const before = (await call('/api/diag/answer-reply', { node: n.id, text: 'yes', depth: 3 })).json;
    assert.ok(before.before && before.after.text);
    assert.equal(db.prepare('SELECT COUNT(*) AS n FROM answer_themes').get().n, 1, 'trying replies out keeps nothing');
  } finally { server.close(); }
});

test('without Claude the short line stands in', async () => {
  const { server, call } = await boot('fail');
  try {
    const n = (await call(`/api/trainer/next?date=${D}`)).json.story;
    const r = (await call('/api/trainer/respond', { node: n.id, text: 'I think distance changes nothing at all, and that scares me a little because of what it asks of me every day.', date: D })).json;
    assert.equal(r.reply, null); assert.equal(typeof r.ack, 'string');
  } finally { server.close(); }
});
