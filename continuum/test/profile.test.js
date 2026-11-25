import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openDb, seedContent } from '../db.js';
import { createApp } from '../app.js';
import { createTalk, RULES, TRUSTED_DOMAINS } from '../talk.js';
import * as content from '../content/index.js';

const D = '2026-11-01';
test('what Continuum has learned: built from what they do, theirs to reword, remove, add to or forget, and used by Talk', async () => {
  const db = openDb(':memory:'); seedContent(db, content);
  db.prepare('INSERT INTO users (token, name) VALUES (?, ?)').run('t', 'Sam');
  const asked = [];
  const client = { beta: { messages: {
    stream(params) { asked.push(params); return { on() { return this; }, async finalMessage() { return { stop_reason: 'end_turn', content: [{ type: 'text', text: 'Hm.' }] }; } }; },
    create: async () => { throw new Error('not here'); },
  } } };
  const server = createApp(db, { talk: createTalk({ client }) }).listen(0);
  await new Promise((r) => server.once('listening', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = (path, body, method) => fetch(base + path, { method: method ?? (body ? 'POST' : 'GET'), headers: { 'x-continuum-token': 't', 'content-type': 'application/json' }, body: body && JSON.stringify(body) }).then((r) => r.json());
  try {
    // Signals: themes noticed in answers, thumbs, a debate answered.
    const n = (await call(`/api/trainer/next?date=${D}`)).story;
    db.prepare("INSERT INTO answer_themes (user_id, node_id, source, themes, local_date) VALUES (1, ?, 'respond', ?, ?)").run(n.id, JSON.stringify(['worry for a grown child', 'valuing honesty']), D);
    db.prepare("INSERT INTO answer_themes (user_id, node_id, source, themes, local_date) VALUES (1, ?, 'respond', ?, ?)").run(n.id, JSON.stringify(['worry for a grown child']), D);
    await call('/api/vote', { node_id: n.id, vote: 1 }); await call('/api/vote', { node_id: n.id, vote: 1 });
    db.prepare("INSERT INTO trainer_log (user_id, node_id, action, local_date) VALUES (1, ?, 'respond', ?)").run(n.id, D);
    await call('/api/stance', { answers: [{ id: 'human_nature', agree: 2, basis: 'thought' }] });
    let items = (await call('/api/me/profile')).items;
    const theme = items.find((i) => i.key === 'theme:worry for a grown child');
    assert.ok(theme && /2 of your answers/.test(theme.from));
    assert.ok(items.some((i) => i.kind === 'lands'), `a room that lands: ${JSON.stringify(items.map((i) => i.key))} room=${db.prepare('SELECT room FROM nodes WHERE id = ?').get(n.id).room}`);
    assert.ok(items.some((i) => i.key === 'stance:human_nature' && /Mencius, clearly/.test(i.text)));
    assert.ok(items.some((i) => i.kind === 'depth' && i.fixed));
    // Theirs to change: reword, remove, add.
    items = (await call('/api/me/profile/item', { key: theme.key, text: 'missing my son since he moved' })).items;
    assert.ok(items.some((i) => i.text === 'missing my son since he moved' && i.edited));
    items = (await call('/api/me/profile/item', { key: 'theme:valuing honesty', text: null })).items;
    assert.ok(!items.some((i) => i.key === 'theme:valuing honesty'), 'removed');
    items = (await call('/api/me/profile/note', { text: 'I teach high school history' })).items;
    assert.ok(items.some((i) => i.kind === 'note' && i.text === 'I teach high school history'));
    // Talk uses it (loosely), with the friend's instructions, the seven practices and trusted search only.
    await fetch(`${base}/api/talk`, { method: 'POST', headers: { 'x-continuum-token': 't', 'content-type': 'application/json' }, body: JSON.stringify({ text: 'I heard something on the radio about loneliness.', date: D }) }).then((r) => r.text());
    const sys = asked.at(-1).system.map((b) => b.text).join('\n');
    assert.match(sys, /a wise friend who has read everything worth reading/);
    assert.match(sys, /What Continuum has learned about them[^\n]*missing my son since he moved[^\n]*They told us: I teach high school history/);
    assert.doesNotMatch(sys, /valuing honesty/, 'a removed item is not used');
    for (const id of ['practice_examine_daily', 'practice_keep_death_in_view', 'practice_invest_in_people']) assert.ok(RULES.includes(`[[${id}]]`));
    const search = asked.at(-1).tools.find((t) => t.name === 'web_search');
    assert.deepEqual(search.allowed_domains, TRUSTED_DOMAINS); assert.ok(TRUSTED_DOMAINS.includes('plato.stanford.edu'));
    // Forget it all: starts again from now.
    items = (await call('/api/me/profile/forget', {})).items;
    assert.ok(!items.some((i) => ['theme', 'lands', 'note'].includes(i.kind)), 'forgotten');
    assert.equal(db.prepare('SELECT COUNT(*) AS n FROM answer_themes').get().n, 0);
  } finally { server.close(); }
});

test('people they mention are learned from their own words; nothing is kept from a message the safety check flags', async () => {
  const db = openDb(':memory:'); seedContent(db, content);
  db.prepare('INSERT INTO users (token, name) VALUES (?, ?)').run('t', 'Sam');
  let danger = false;
  const client = { beta: { messages: {
    stream() { return { on() { return this; }, async finalMessage() { return { stop_reason: 'end_turn', content: [{ type: 'text', text: 'I hear you.' }] }; } }; },
    create: async (params) => {
      const props = params.output_config?.format?.schema?.properties ?? {};
      if (props.risk) return { stop_reason: 'end_turn', content: [{ type: 'text', text: JSON.stringify(danger ? { risk: 'self', imminent: false } : { risk: 'none', imminent: false }) }] };
      if (props.themes) return { stop_reason: 'end_turn', content: [{ type: 'text', text: JSON.stringify({ reply: 'That is a lot to carry.', themes: ['feeling alone'], links: [], next: { kind: 'none', id: '', label: '' } }) }] };
      throw new Error('not here');
    },
  } } };
  const server = createApp(db, { talk: createTalk({ client }) }).listen(0);
  await new Promise((r) => server.once('listening', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = (path, body) => fetch(base + path, { method: 'POST', headers: { 'x-continuum-token': 't', 'content-type': 'application/json' }, body: JSON.stringify(body) }).then((r) => r.text());
  const people = () => db.prepare('SELECT who, n FROM people_mentioned ORDER BY who').all().map((r) => `${r.who}:${r.n}`);
  try {
    await post('/api/talk', { text: 'My wife and I keep arguing about my mom visiting.', date: D });
    await new Promise((r) => setTimeout(r, 50));
    assert.deepEqual(people(), ['mother:1', 'wife:1']);
    const items = await fetch(`${base}/api/me/profile`, { headers: { 'x-continuum-token': 't' } }).then((r) => r.json());
    assert.ok(items.items.some((i) => i.kind === 'people' && i.text === 'Your wife'));
    // A message the safety check flags: nothing kept about them from it.
    danger = true;
    await post('/api/talk', { text: 'My brother says I should just end it all, and lately I think he is right.', date: D });
    await new Promise((r) => setTimeout(r, 50));
    assert.deepEqual(people(), ['mother:1', 'wife:1'], 'no one from a flagged message');
    const n = JSON.parse(await fetch(`${base}/api/trainer/next?date=${D}`, { headers: { 'x-continuum-token': 't' } }).then((r) => r.text())).story;
    const r = JSON.parse(await post('/api/trainer/respond', { node: n.id, text: 'My sister is gone and I do not want to be here either.', date: D }));
    assert.ok(r.reply.safety, 'help with the reply'); assert.deepEqual(r.reply.themes, []);
    assert.equal(db.prepare('SELECT COUNT(*) AS n FROM answer_themes').get().n, 0, 'no themes kept');
    assert.deepEqual(people(), ['mother:1', 'wife:1']);
  } finally { server.close(); }
});
