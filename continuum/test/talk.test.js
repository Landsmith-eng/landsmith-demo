import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openDb, seedContent } from '../db.js';
import { createApp } from '../app.js';
import { createTalk, TALK_MODEL, VIEWS_SCHEMA } from '../talk.js';
import * as content from '../content/index.js';

// A stand-in for the Anthropic SDK client: plays scripted turns and records each request.
function fakeClaude(turns) {
  const requests = [];
  const client = {
    beta: { messages: { stream(params) {
      requests.push(structuredClone(params));
      const msg = turns.shift();
      const listeners = [];
      return {
        on(ev, fn) { if (ev === 'text') listeners.push(fn); return this; },
        async finalMessage() {
          for (const b of msg.content) if (b.type === 'text') for (const fn of listeners) fn(b.text, b.text);
          return msg;
        },
      };
    } } },
  };
  return { client, requests };
}

async function boot(talk, opts = {}) {
  const db = openDb(':memory:');
  seedContent(db, content);
  db.prepare('INSERT INTO users (token, name) VALUES (?, ?)').run('t', 'T');
  const server = createApp(db, { talk, ...opts }).listen(0);
  await new Promise((r) => server.once('listening', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = (path, body) => fetch(base + path, {
    method: body ? 'POST' : 'GET', headers: { 'x-continuum-token': 't', 'content-type': 'application/json' }, body: body && JSON.stringify(body),
  });
  const lines = async (r) => (await r.text()).trim().split('\n').map((l) => JSON.parse(l));
  return { db, server, call, lines };
}
const D = '2026-11-01';

test('talk: off without a key', async () => {
  assert.equal(createTalk({}), null);
  const { server, call } = await boot(null);
  try {
    assert.equal((await (await call(`/api/talk?date=${D}`)).json()).enabled, false);
    assert.equal((await call('/api/talk', { text: 'Hello' })).status, 404);
  } finally { server.close(); }
});

test('talk: answers from the map, opens ideas to quote them, uses the diary, and never shows today\'s unwritten card', async () => {
  const turns = []; // scripted once the day's cards are known
  const fake = fakeClaude(turns);
  const { db, server, call, lines } = await boot(createTalk({ client: fake.client }));
  try {
    // Write day 1's card, so the diary has something in it; day 2's card is then today's, still unwritten.
    const written = (await (await call(`/api/today?date=${D}`)).json()).node.id;
    await call('/api/respond', { node_id: written, body: 'I fear losing what I love.', date: D });
    const D2 = '2026-11-02';
    const today = (await (await call(`/api/today?date=${D2}`)).json()).node.id;
    assert.notEqual(today, written);
    const title = db.prepare('SELECT title FROM nodes WHERE id = ?').get(written).title;
    turns.push(
      { stop_reason: 'tool_use', content: [
        { type: 'thinking', thinking: '', signature: 'sig' },
        { type: 'text', text: 'Let me look.' },
        { type: 'tool_use', id: 'tu1', name: 'read_idea', input: { id: written } }] },
      { stop_reason: 'end_turn', content: [{ type: 'text', text: `You wrote about fear. [[${written}]] would ask what fear is made of.` }] },
    );
    const out = await lines(await call('/api/talk', { text: 'Is it foolish to be afraid of death?', date: D2 }));
    assert.equal(out[0].t, 'start');
    const text = out.filter((o) => o.t === 'text').map((o) => o.d).join('');
    assert.match(text, new RegExp(`Let me look\\..*\\[\\[${written}\\]\\]`, 's'));
    const done = out.at(-1);
    assert.equal(done.t, 'done');
    assert.equal(done.refs[written].title, title);

    const [first, second] = fake.requests;
    assert.equal(first.model, TALK_MODEL);
    assert.equal(first.fallbacks, 'default');
    assert.deepEqual(first.betas, ['server-side-fallback-2026-07-01']);
    const system = first.system.map((b) => b.text).join('\n');
    assert.match(system, /I fear losing what I love\./); // the diary
    assert.ok(system.includes(`${written} | ${title}`)); // the map
    // Illustrated daily ideas are on the map now (none is held back as upcoming)...
    const daily = db.prepare('SELECT id, title FROM nodes WHERE seq IS NOT NULL AND id NOT IN (?, ?)').all(written, today);
    assert.ok(daily.every((n) => system.includes(`${n.id} | ${n.title}`)));
    // ...but today's own card, not yet written, is not on the map the model sees.
    assert.ok(!system.includes(`${today} |`), `${today} is in the catalogue`);
    // The tool result carried the source text, and the turn was sent back unedited (thinking block included).
    const result = second.messages.at(-1).content[0];
    assert.equal(result.type, 'tool_result');
    assert.ok(JSON.parse(result.content).source.length > 20);
    assert.equal(second.messages.at(-2).content[0].type, 'thinking');

    // The transcript shows only the user's words and the replies.
    const tr = await (await call(`/api/talk?date=${D2}&id=${out[0].id}`)).json();
    assert.deepEqual(tr.turns.map((x) => x.who), ['you', 'map']);
    assert.ok(tr.refs[written]);
  } finally { server.close(); }
});

test('talk: today\'s unwritten card cannot be opened; a daily limit keeps the bill predictable', async () => {
  const turns = [];
  const fake = fakeClaude(turns);
  const { server, call, lines } = await boot(createTalk({ client: fake.client }), { talkDailyLimit: 1 });
  try {
    const today = (await (await call(`/api/today?date=${D}`)).json()).node.id;
    turns.push(
      { stop_reason: 'tool_use', content: [{ type: 'tool_use', id: 'tu1', name: 'read_idea', input: { id: today } }] },
      { stop_reason: 'end_turn', content: [{ type: 'text', text: 'Fair enough.' }] },
    );
    await lines(await call('/api/talk', { text: 'Tell me about today\'s card.', date: D }));
    const result = fake.requests[1].messages.at(-1).content[0];
    assert.equal(result.is_error, true);
    assert.equal((await call('/api/talk', { text: 'Again', date: D })).status, 429);
    assert.equal((await call('/api/talk', { text: '', date: D })).status, 400);
  } finally { server.close(); }
});

test('talk: weighing an opinion adds the weigh instructions and returns web sources; finding local help keeps nothing', async () => {
  const fake = fakeClaude([
    { stop_reason: 'pause_turn', content: [{ type: 'server_tool_use', id: 'st1', name: 'web_search', input: { query: 'x' } }] },
    { stop_reason: 'end_turn', content: [{ type: 'text', text: 'In its strongest form: people deserve a say.', citations: [{ type: 'web_search_result_location', url: 'https://example.org/a', title: 'A source', cited_text: 'x' }] }] },
    { stop_reason: 'end_turn', content: [{ type: 'text', text: 'The county food bank sorts donations on Saturdays: https://example.org/food' }] },
  ]);
  const { db, server, call, lines } = await boot(createTalk({ client: fake.client }));
  try {
    const out = await lines(await call('/api/talk', { text: 'Voting should be compulsory.', mode: 'weigh', date: D }));
    const done = out.at(-1);
    assert.deepEqual(done.sources, [{ url: 'https://example.org/a', title: 'A source' }]);
    const req = fake.requests[0];
    assert.equal(req.messages.at(-1).role, 'system');
    assert.match(req.messages.at(-1).content, /strongest form/);
    assert.ok(req.tools.some((t) => t.type === 'web_search_20260209'));
    assert.equal(fake.requests.length, 2); // the paused turn was resumed
    // Finding local volunteering: the place is not kept.
    const before = db.prepare('SELECT COUNT(*) AS n FROM talks').get().n;
    const act = await lines(await call('/api/talk', { text: 'Invest in people, near Phoenix, AZ 85013', mode: 'act', date: D }));
    assert.equal(act[0].id, null);
    assert.equal(db.prepare('SELECT COUNT(*) AS n FROM talks').get().n, before);
    assert.doesNotMatch(db.prepare("SELECT group_concat(messages) AS m FROM talks").get().m ?? '', /Phoenix/);
    assert.equal((await call('/api/talk', { text: 'x', mode: 'nope', date: D })).status, 400);
  } finally { server.close(); }
});

test('a problem to consider: written once by Claude, kept, and never for today\'s card before it is written', async () => {
  const calls = [];
  const client = { beta: { messages: { create: async (params) => { calls.push(params); return { stop_reason: 'end_turn', content: [{ type: 'text', text: 'Mara finds a wallet. What should she do, and why?' }] }; } } } };
  // Only the problem writer's calls (Talk also notes views, and reads how the answer landed, in the background).
  const problemCalls = () => calls.filter((c) => c.output_config?.format?.schema !== VIEWS_SCHEMA && !c.output_config?.format?.schema?.properties?.strength);
  const { server, call } = await boot(createTalk({ client }));
  try {
    const today = (await (await call(`/api/today?date=${D}`)).json()).node.id;
    const id = 'sartre_existence_precedes_essence';
    assert.notEqual(id, today);
    const a = await (await call(`/api/problem/${id}?date=${D}`)).json();
    assert.equal(a.problem, 'Mara finds a wallet. What should she do, and why?');
    assert.match(problemCalls()[0].messages[0].content, /Existence precedes essence/);
    assert.equal(problemCalls()[0].output_config.effort, 'low');
    await call(`/api/problem/${id}?date=${D}`);
    assert.equal(problemCalls().length, 1); // kept, not written again
    // Today's card stays closed until written; then its problem may be written too.
    assert.equal((await call(`/api/problem/${today}?date=${D}`)).status, 404);
    assert.equal(problemCalls().length, 1);
    assert.equal((await call('/api/respond', { node_id: today, body: 'my take', date: D })).status, 200);
    const b = await call(`/api/problem/${today}?date=${D}`);
    assert.equal(b.status, 200);
    assert.equal((await b.json()).problem, 'Mara finds a wallet. What should she do, and why?');
    assert.equal(problemCalls().length, 2);
  } finally { server.close(); }
});

test('talk: each message keeps how it was said; a running summary with perspectives and sources, kept with the conversation; the history lists it', async () => {
  const reply = (text) => ({ stop_reason: 'end_turn', content: [{ type: 'text', text }] });
  const fake = fakeClaude([reply('Epictetus would say [[epictetus_up_to_us]]: your anger is a judgement.'), reply('Seneca agreed, and so does CBT.')]);
  const summaries = [];
  fake.client.beta.messages.create = async (params) => {
    const schema = params.output_config?.format?.schema;
    if (schema?.properties?.perspectives) {
      summaries.push(params.messages[0].content);
      const n = summaries.length;
      return { stop_reason: 'end_turn', content: [{ type: 'text', text: JSON.stringify({ title: 'Anger at work', points: n === 1 ? ['You said your boss makes you furious.'] : ['You said your boss makes you furious.', 'You asked whether anger is ever useful.'], perspectives: [{ kind: 'philosophy', name: 'Epictetus', gist: 'Anger comes from our judgement, not the event.' }], connections: [{ name: 'Epictetus on judgement', when: 'Nicopolis, 2nd century', link: 'Your fury at your boss is a judgement you can examine.', ask: 'Which part of the situation is actually up to you?' }] }) }] };
    }
    return { stop_reason: 'end_turn', content: [{ type: 'text', text: '{"items":[]}' }] };
  };
  const { server, call, lines } = await boot(createTalk({ client: fake.client }));
  try {
    const first = await lines(await call('/api/talk', { text: 'My boss makes me furious.', date: D, via: 'voice' }));
    const id = first[0].id;
    await lines(await call('/api/talk', { id, text: 'Is anger ever useful?', date: D }));
    for (let i = 0; i < 50 && summaries.length < 2; i++) await new Promise((r) => setTimeout(r, 20));
    await new Promise((r) => setTimeout(r, 20));
    const t = await (await call(`/api/talk?id=${id}&date=${D}`)).json();
    assert.deepEqual(t.turns.filter((x) => x.who === 'you').map((x) => x.via), ['voice', 'typed']);
    // Incremental: the second update sees the summary so far and only the new turns.
    assert.equal(summaries.length, 2);
    assert.match(summaries[1], /The summary so far/);
    assert.doesNotMatch(summaries[1], /boss makes me furious/);
    assert.match(summaries[0], /Epictetus|Some things are up to us/); // ids are names, not [[ids]], for the model
    const s = await (await call(`/api/talk/${id}/summary?date=${D}`)).json();
    assert.equal(s.title, 'Anger at work');
    assert.equal(s.points.length, 2);
    assert.equal(s.perspectives[0].name, 'Epictetus');
    assert.equal(s.sources.ideas[0].id, 'epictetus_up_to_us');
    assert.equal(s.connections[0].when, 'Nicopolis, 2nd century');
    assert.match(summaries[1], /Epictetus on judgement/); // the talking points so far go into the next update
    assert.equal(s.pending, false);
    const list = (await (await call('/api/talks')).json()).talks;
    assert.equal(list[0].id, id); assert.equal(list[0].title, 'Anger at work');
    assert.equal((await call('/api/talk/9999/summary')).status, 404);
  } finally { server.close(); }
});

test('talk is cached: the map for an hour, the conversation as it grows, the instructions unchanged through the day; usage is tallied', async () => {
  const usage = (read, written) => ({ input_tokens: 40, output_tokens: 120, cache_read_input_tokens: read, cache_creation_input_tokens: written, cache_creation: { ephemeral_1h_input_tokens: written, ephemeral_5m_input_tokens: 0 } });
  const turns = [
    { stop_reason: 'end_turn', content: [{ type: 'text', text: 'First answer.' }], usage: usage(0, 15000) },
    { stop_reason: 'end_turn', content: [{ type: 'text', text: 'Second answer.' }], usage: usage(15200, 0) },
  ];
  const fake = fakeClaude(turns);
  const { db, server, call, lines } = await boot(createTalk({ client: fake.client }));
  try {
    const first = await lines(await call('/api/talk', { text: 'What is courage?', date: D }));
    const id = first[0].id;
    // A view noted between the two messages (as happens after every message) must not change the instructions.
    db.prepare("INSERT INTO views (user_id, kind, topic, body, source, local_date) VALUES (1, 'view', 'courage', 'Courage is acting while afraid.', 'talk', ?)").run(D);
    await lines(await call('/api/talk', { id, text: 'And is it a virtue?', date: D }));
    const [a, b] = fake.requests;
    assert.deepEqual(a.cache_control, { type: 'ephemeral' }, 'the conversation tail is cached');
    assert.deepEqual(a.system[1].cache_control, { type: 'ephemeral', ttl: '1h' }, 'the map is cached for an hour');
    assert.equal(JSON.stringify(b.system), JSON.stringify(a.system), 'the instructions are byte-for-byte the same, so the cache holds');
    assert.equal(b.messages[0].content, a.messages[0].content, 'the conversation is only appended to');
    const u = await (await call('/api/diag/usage')).json();
    const day = u.days[0];
    assert.equal(day.calls >= 2, true);
    assert.ok(day.cached_share > .4, `most of the prompt read from the cache (${day.cached_share})`);
    assert.ok(day.usd > 0 && day.kinds[0].read >= 15200);
  } finally { server.close(); }
});

test('the usage governor: measures while testing, then near the allowance a heads-up, past it Claude rests and a bigger plan is offered', async () => {
  const big = { input_tokens: 100, output_tokens: 80000, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 }; // $1.60: past Free's allowance
  const turns = [1, 2, 3, 4].map((i) => ({ stop_reason: 'end_turn', content: [{ type: 'text', text: `Answer ${i}.` }], usage: big }));
  const fake = fakeClaude(turns);
  const { db, server, call, lines } = await boot(createTalk({ client: fake.client }), { adminKey: 'k' });
  const base = `http://127.0.0.1:${server.address().port}`;
  const admin = (path, body) => fetch(base + path, { method: body ? 'POST' : 'GET', headers: { 'x-admin-key': 'k', 'content-type': 'application/json' }, body: body && JSON.stringify(body) }).then((r) => r.json());
  try {
    // Testing (watch): counted to them, never limited, and they see nothing of it.
    let out = await lines(await call('/api/talk', { text: 'One.', date: D }));
    assert.equal(out.at(-1).t, 'done'); assert.equal(out.at(-1).allowance, undefined);
    out = await lines(await call('/api/talk', { id: out[0].id, text: 'Two.', date: D }));
    assert.equal(out.at(-1).t, 'done', 'not limited while measuring');
    let u = await admin('/admin/api/usage');
    assert.equal(u.mode, 'watch'); assert.equal(u.people[0].plan, 'free'); assert.ok(u.people[0].usd > 3 && u.people[0].calls >= 2);
    let me = await (await call('/api/me/allowance')).json();
    assert.equal(me.mode, 'watch'); assert.equal(me.used, undefined, 'never shown in money');
    // After the trial: on. Past Free's allowance, Talk says so before calling Claude, and no call is made.
    await admin('/admin/api/governor', { mode: 'on' });
    const asked = fake.requests.length;
    const r = await call('/api/talk', { text: 'Three.', date: D });
    assert.equal(r.status, 402); const j = await r.json();
    assert.equal(j.error, 'allowance'); assert.equal(j.allowance.name, 'Free'); assert.ok(j.allowance.over);
    assert.equal(fake.requests.length, asked, 'no call to Claude past the allowance');
    me = await (await call('/api/me/allowance')).json();
    assert.ok(me.over && me.plans.some((p) => p.id === 'plus') && !me.plans.some((p) => p.id === 'unlimited'));
    // They ask for a bigger plan; the owner sees it and moves them; Talk opens again, with a heads-up near the end.
    assert.equal((await (await call('/api/plan/request', { plan: 'plus' })).json()).ok, true);
    u = await admin('/admin/api/usage'); assert.equal(u.requests[0].plan, 'plus');
    await admin(`/admin/api/users/${u.people[0].id}/plan`, { plan: 'plus' });
    out = await lines(await call('/api/talk', { text: 'Three.', date: D }));
    assert.equal(out.at(-1).t, 'done');
    db.prepare('UPDATE usage_month SET usd = 6.6').run(); // under Plus's allowance, but past 80% of it
    out = await lines(await call('/api/talk', { text: 'Four.', date: D }));
    assert.equal(out.at(-1).t, 'done'); assert.equal(out.at(-1).allowance.name, 'Plus'); assert.ok(out.at(-1).allowance.near);
    assert.equal(out.at(-1).allowance.used, undefined);
  } finally { server.close(); }
});
