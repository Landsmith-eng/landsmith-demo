import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { openDb, seedContent } from '../db.js';
import { createApp } from '../app.js';
import { createTalk } from '../talk.js';
import * as content from '../content/index.js';

// Working through a problem: interview (two questions), plan from the map, course, check-in that changes the course.
let server, base; let asked = 0; const seen = [];
before(async () => {
  const db = openDb(':memory:');
  seedContent(db, content);
  db.prepare('INSERT INTO users (token, name) VALUES (?, ?)').run('w', 'Worker');
  const json = (o) => ({ stop_reason: 'end_turn', content: [{ type: 'text', text: JSON.stringify(o) }] });
  const talk = createTalk({ client: { beta: { messages: {
    create: async (req) => {
      const props = req.output_config?.format?.schema?.properties ?? {};
      seen.push(req);
      if (props.views) return json({ views: [] });
      if (props.question) { asked++; return json(asked < 3 ? { concern: false, done: false, reflect: `Heard ${asked}.`, question: `Question ${asked}?` } : { concern: false, done: true, reflect: 'I think I understand.', question: '' }); }
      if (props.going_on) return json({ concern: false, title: 'Putting off the job search', heard: 'h', going_on: 'g',
        pitfalls: [{ kind: 'logic', name: 'All-or-nothing thinking', how: 'You said it is pointless unless perfect.', idea: 'ellis_abc_model' }, { kind: 'habit', name: 'x', how: 'y', idea: 'not_real' }],
        route: [{ id: 'ellis_abc_model', why: 'a' }, { id: 'not_real', why: 'b' }, { id: 'gollwitzer_implementation_intentions', why: 'c' }, { id: 'practice_if_then_plan', why: 'not a stop' }],
        practice: 'practice_if_then_plan', first_step: 'Send one email.', check_in: 'Did you send it?' });
      if (props.progress) return json({ concern: false, reply: 'Good.', progress: 'better', noticed: [{ kind: 'assumption', name: 'Mind reading', how: 'z', idea: '' }],
        route: [{ id: 'bandura_self_efficacy', why: 'next' }, { id: 'dweck_mindsets', why: 'then' }], next_step: 'Two emails.', check_in: 'And now?' });
      return json({});
    },
  } } } });
  server = createApp(db, { talk }).listen(0);
  await new Promise((r) => server.once('listening', r));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => server.close());
const call = (path, { method = 'GET', body } = {}) => fetch(base + path, { method, headers: { 'x-continuum-token': 'w', 'content-type': 'application/json' }, body: body && JSON.stringify(body) })
  .then(async (r) => ({ status: r.status, json: await r.json().catch(() => null) }));
const D = '2026-11-01';

test('an interview, then a plan from the map that keeps only real ideas', async () => {
  let c = (await call('/api/cases', { method: 'POST', body: { problem: 'I keep putting off applying for jobs.', date: D } })).json.case;
  assert.equal(c.status, 'interview');
  assert.equal(c.turns.at(-1).q, 'Question 1?');
  c = (await call(`/api/cases/${c.id}/answer`, { method: 'POST', body: { answer: 'For months.', date: D } })).json.case;
  assert.equal(c.turns.at(-1).q, 'Question 2?');
  c = (await call(`/api/cases/${c.id}/answer`, { method: 'POST', body: { answer: 'I tell myself it is pointless.', date: D } })).json.case;
  assert.equal(c.status, 'open');
  assert.equal(c.title, 'Putting off the job search');
  assert.deepEqual(c.route.map((r) => r.id), ['ellis_abc_model', 'gollwitzer_implementation_intentions']);
  assert.equal(c.plan.pitfalls[1].idea, '');
  assert.equal(c.plan.practice, 'practice_if_then_plan');
  assert.ok(c.refs.ellis_abc_model && c.refs.practice_if_then_plan);
  assert.equal(c.question, 'Did you send it?');
  // The plan saw the interview.
  assert.match(seen.find((r) => r.output_config.format.schema.properties.going_on).messages[0].content, /A2: I tell myself it is pointless/);
});

test('as a course, it leads the daily idea; check-ins come due, can change the course, and Talk sees the pitfalls', async () => {
  const id = (await call(`/api/cases?date=${D}`)).json.cases[0].id;
  await call(`/api/cases/${id}/start`, { method: 'POST', body: { date: D } });
  const t = (await call(`/api/today?date=${D}`)).json;
  assert.equal(t.node.id, 'ellis_abc_model');
  assert.match(t.node.why, /Putting off the job search/);
  assert.equal(t.checkin, null);
  const later = (await call('/api/today?date=2026-11-05')).json;
  assert.equal(later.checkin.id, id);
  assert.equal(later.checkin.question, 'Did you send it?');
  const c = (await call(`/api/cases/${id}/checkin`, { method: 'POST', body: { answer: 'I sent one, then stopped.', date: '2026-11-05' } })).json.case;
  assert.equal(c.checkins.length, 1);
  assert.equal(c.checkins[0].progress, 'better');
  assert.deepEqual(c.route.map((r) => r.id), ['bandura_self_efficacy', 'dweck_mindsets']);
  assert.equal(c.question, 'And now?');
  assert.equal((await call('/api/today?date=2026-11-06')).json.checkin, null);
  // Closed, it no longer leads or asks.
  await call(`/api/cases/${id}/status`, { method: 'POST', body: { status: 'closed' } });
  assert.equal((await call('/api/today?date=2026-11-20')).json.checkin, null);
});

test('"show me a route now" skips the rest of the interview', async () => {
  const c0 = (await call('/api/cases', { method: 'POST', body: { problem: 'A decision about moving.', date: D } })).json.case;
  const c = (await call(`/api/cases/${c0.id}/answer`, { method: 'POST', body: { enough: true, date: D } })).json.case;
  assert.equal(c.status, 'open');
  assert.equal(c.turns.filter((x) => x.q).length, 0); // the unanswered question was dropped
  assert.equal((await call(`/api/cases/${c0.id}/answer`, { method: 'POST', body: { answer: 'x', date: D } })).status, 404);
});
