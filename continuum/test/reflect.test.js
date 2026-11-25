import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openDb, seedContent } from '../db.js';
import { createApp } from '../app.js';
import { createTalk } from '../talk.js';
import * as content from '../content/index.js';

async function boot(talk = null) {
  const db = openDb(':memory:'); seedContent(db, content);
  db.prepare('INSERT INTO users (token, name) VALUES (?, ?)').run('t', 'Sam');
  const server = createApp(db, { talk }).listen(0);
  await new Promise((r) => server.once('listening', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = (path, body) => fetch(base + path, { method: body ? 'POST' : 'GET', headers: { 'x-continuum-token': 't', 'content-type': 'application/json' }, body: body && JSON.stringify(body) }).then(async (r) => ({ status: r.status, json: await r.json(), text: r.headers.get('content-type')?.includes('ndjson') ? null : undefined }));
  return { db, server, call };
}
const D = '2026-11-19';
// Ideas with a practice they lead to and a neighbour on the map, so all three kinds are possible.
const RICH = ['epictetus_up_to_us', 'seneca_evening_review', 'aristotle_friendship'];

test('Thoughts without Claude: a question, then something to try, then a parallel story, all from the map; answered or skipped, kept', async () => {
  const { db, server, call } = await boot();
  try {
    const got = [];
    for (const id of RICH) got.push((await call(`/api/trainer/reflect?node=${id}&date=${D}`)).json);
    assert.deepEqual(got.map((r) => r.kind), ['question', 'try', 'parallel']);
    assert.deepEqual(got.map((r) => r.label), ['Question', 'Try this', 'A parallel story']);
    assert.ok(got[0].question.length > 10);
    assert.ok(got[1].text.length > 10 && /notice/i.test(got[1].question));
    const p = got[2].parallel;
    assert.equal(db.prepare('SELECT plain_face FROM nodes WHERE id = ?').get(p.id).plain_face, p.story); // a real idea, in its own words
    assert.ok(db.prepare('SELECT 1 FROM edges WHERE (from_id = ? AND to_id = ?) OR (from_id = ? AND to_id = ?)').get(RICH[2], p.id, p.id, RICH[2]));
    // The same passage the same day: the same prompt.
    assert.equal((await call(`/api/trainer/reflect?node=${RICH[0]}&date=${D}`)).json.id, got[0].id);
    // Answer one; skip another and share thoughts on the passage.
    assert.equal((await call(`/api/trainer/reflect/${got[0].id}`, { text: ' ', date: D })).status, 400);
    const a = (await call(`/api/trainer/reflect/${got[0].id}`, { text: 'Last week, when the flight was cancelled.', via: 'voice', date: D })).json;
    assert.equal(typeof a.ack, 'string'); assert.equal(a.reflection.response, 'Last week, when the flight was cancelled.');
    const b = (await call(`/api/trainer/reflect/${got[1].id}`, { text: 'I liked the idea but did not try it.', skipped: true, date: D })).json;
    assert.equal(b.reflection.skipped, true);
    const rows = db.prepare('SELECT kind, prompt, response, skipped, via FROM reflections ORDER BY id').all();
    assert.equal(rows[0].via, 'voice'); assert.equal(rows[1].skipped, 1);
    assert.match(db.prepare('SELECT body FROM notes WHERE node_id = ?').get(RICH[0]).body, /Question: .+\nLast week, when the flight was cancelled\./);
    assert.equal((await call(`/api/trainer/reflect?node=nope&date=${D}`)).status, 404);
    assert.equal((await call('/api/trainer/reflect/9999', { text: 'x', date: D })).status, 404);
  } finally { server.close(); }
});

test('Thoughts with Claude: written to the user\'s depth, the parallel supplied from the map; Talk comes back to the answer', async () => {
  const asked = []; const streamed = [];
  const client = { beta: { messages: {
    async create(params) {
      const props = params.output_config?.format?.schema?.properties ?? {};
      if (props.question && props.text) {
        asked.push(params);
        const kind = /parallel story/.test(params.messages[0].content) ? 'parallel' : /activity/.test(params.messages[0].content) ? 'try' : 'question';
        const body = { question: { text: '', question: 'When did a plan of yours last fall apart, and what did you do first?' }, try: { text: 'Before lunch, name one thing that annoys you and say out loud which part is up to you.', question: 'What changed, if anything?' }, parallel: { text: 'Both say the same about what we can govern.', question: 'Which of the two would you rather have at your side on a bad day?' } }[kind];
        return { stop_reason: 'end_turn', content: [{ type: 'text', text: JSON.stringify(body) }] };
      }
      return { stop_reason: 'end_turn', content: [{ type: 'text', text: JSON.stringify(props.risk ? { risk: 'none', imminent: false } : { items: [] }) }] };
    },
    stream(params) { streamed.push(params); const fns = []; const t = 'Mm.'; return { on(e, f) { if (e === 'text') fns.push(f); return this; }, async finalMessage() { fns.forEach((f) => f(t)); return { stop_reason: 'end_turn', content: [{ type: 'text', text: t }] }; } }; },
  } } };
  const { db, server, call } = await boot(createTalk({ client }));
  try {
    db.prepare('UPDATE users SET depth = 2').run();
    const q1 = (await call(`/api/trainer/reflect?node=${RICH[0]}&date=${D}`)).json;
    assert.match(q1.question, /plan of yours/);
    assert.match(asked[0].system, /Depth level 2/);
    assert.match(asked[0].system, /never preachy/);
    await call(`/api/trainer/reflect?node=${RICH[1]}&date=${D}`);
    const q3 = (await call(`/api/trainer/reflect?node=${RICH[2]}&date=${D}`)).json;
    assert.equal(q3.kind, 'parallel');
    assert.match(asked[2].messages[0].content, new RegExp(q3.parallel.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))); // the model is given the real parallel
    await call(`/api/trainer/reflect/${q1.id}`, { text: 'The move to Denver. I made a list.', date: D });
    await fetch(`http://127.0.0.1:${server.address().port}/api/talk`, { method: 'POST', headers: { 'x-continuum-token': 't', 'content-type': 'application/json' }, body: JSON.stringify({ text: 'Hello again.', date: D }) }).then((r) => r.text());
    const sys = streamed[0].system.map((b) => b.text).join('\n');
    assert.match(sys, /Lately, after passages in the trainer:[\s\S]*plan of yours[\s\S]*The move to Denver/);
  } finally { server.close(); }
});
