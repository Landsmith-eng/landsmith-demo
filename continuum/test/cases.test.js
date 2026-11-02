import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { openDb, seedContent } from '../db.js';
import { createApp } from '../app.js';
import { createTalk } from '../talk.js';
import * as content from '../content/index.js';

// Working through a problem: interview (two questions), plan from the map, course, check-in that changes the course.
let server, base; let asked = 0; const seen = []; const sessionNext = ['go_on', 'repeat'];
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
        practice: 'practice_if_then_plan', first_step: 'Send one email.', check_in: 'Did you send it?',
        lenses: [{ school: 'cbt', sees: 's', method: 'm', practice: 'practice_thought_record' }, { school: 'not_a_school', sees: 'x', method: 'y', practice: '' }, { school: 'motivational', sees: 's2', method: 'm2', practice: 'not_real' }], survey: 'mood',
        wisdom: [{ tradition: 'The Stoics', idea: 'epictetus_up_to_us', counsel: 'c', question: 'What here is up to you?' }, { tradition: 'Nobody', idea: 'not_real', counsel: 'c2', question: 'q2' }],
        problems: ['procrastination', 'not_a_tag'],
        approach: { therapy: 'behavioural_activation', why: 'w', tailored: 't', professional: false, professional_note: '' },
        alternatives: [{ therapy: 'act', why: 'a' }, { therapy: 'nope', why: 'b' }],
        program: [{ title: 'S1', aim: 'a1', exercise: 'e1', practice: 'practice_behavioural_activation' }, { title: 'S2', aim: 'a2', exercise: 'e2', practice: 'not_real' }, { title: 'S3', aim: 'a3', exercise: 'e3', practice: '' }] });
      if (props.next && props.tip) return json({ concern: false, reply: 'Well done.', next: sessionNext.shift() ?? 'go_on', tip: 'Keep it small.' });
      if (props.tailored && props.program) return json({ why: 'ACT fits', tailored: 'tt', professional: false, professional_note: '', program: [{ title: 'A1', aim: 'x', exercise: 'y', practice: 'practice_values_compass' }, { title: 'A2', aim: 'x', exercise: 'y', practice: '' }, { title: 'A3', aim: 'x', exercise: 'y', practice: '' }, { title: 'A4', aim: 'x', exercise: 'y', practice: '' }] });
      if (req.tools?.some((t) => t.name === 'web_search')) return { stop_reason: 'end_turn', content: [{ type: 'text', text: 'Here is what I found.\nPLACE | Calm Minds Therapy | in person | CBT for anxiety, sliding scale | (555) 123-4567 | https://calmminds.example | Springfield, IL\nPLACE | Online CBT Co | online | licensed therapists by video | "" | not a url | ""\nPLACE |  | x | y | z | w | v\nNOTE: Ask about the approach by name.' }] };
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
  // Seen through the schools: only real schools and practices are kept; a survey is suggested.
  assert.deepEqual(c.plan.lenses.map((l) => [l.school, l.practice]), [['cbt', 'practice_thought_record'], ['motivational', '']]);
  assert.match(c.plan.lenses[0].name, /cognitive-behavioural/i);
  assert.equal(c.plan.survey, 'mood');
  assert.deepEqual(c.plan.wisdom.map((w) => w.idea), ['epictetus_up_to_us', '']);
  assert.deepEqual(c.plan.problems, ['procrastination']);
  assert.equal(c.program.therapy, 'behavioural_activation');
  assert.deepEqual(c.program.sessions.map((x) => x.practice), ['practice_behavioural_activation', '', '']);
  assert.deepEqual(c.program.alternatives.map((x) => x.therapy), ['act']);
  assert.equal(c.program.current, 0);
  assert.ok(c.refs.practice_thought_record);
  // The plan saw the interview, and the schools.
  const planReq = seen.find((r) => r.output_config.format.schema.properties.going_on);
  assert.match(planReq.messages[0].content, /A2: I tell myself it is pointless/);
  assert.match(planReq.system[1].text, /third_wave \| The third wave/);
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

test('a programme: a session a day, a repeat keeps the same one, and another approach can be chosen', async () => {
  const c0 = (await call('/api/cases', { method: 'POST', body: { problem: 'I put things off.', date: D } })).json.case;
  await call(`/api/cases/${c0.id}/answer`, { method: 'POST', body: { enough: true, date: D } });
  let c = (await call(`/api/cases/${c0.id}/session`, { method: 'POST', body: { reflection: 'I did the walk.', date: '2026-11-03' } })).json.case;
  assert.equal(c.program.current, 1);
  assert.equal(c.program.sessions[0].done[0].reply, 'Well done.\n\nKeep it small.');
  assert.equal(c.program.opens, '2026-11-04');
  assert.equal((await call(`/api/cases/${c0.id}/session`, { method: 'POST', body: { reflection: 'again', date: '2026-11-03' } })).status, 409);
  const t = (await call('/api/today?date=2026-11-04')).json;
  assert.equal(t.session.n, 2);
  c = (await call(`/api/cases/${c0.id}/session`, { method: 'POST', body: { reflection: 'Could not do it.', date: '2026-11-04' } })).json.case;
  assert.equal(c.program.current, 1); // repeat
  c = (await call(`/api/cases/${c0.id}/approach`, { method: 'POST', body: { therapy: 'act', date: '2026-11-05' } })).json.case;
  assert.equal(c.program.therapy, 'act'); assert.equal(c.program.current, 0); assert.equal(c.program.sessions.length, 4);
  assert.ok(c.program.alternatives.some((x) => x.therapy === 'behavioural_activation'));
  const g = (await call('/api/therapies')).json;
  assert.ok(g.therapies.length >= 25 && g.problems.low_mood);
});

test('finding a therapist reads the search listings; the summary is the user\'s own entries', async () => {
  const c = (await call('/api/cases?date=2026-11-05')).json.cases.find((x) => x.status === 'open');
  const r = (await call('/api/help/find', { method: 'POST', body: { place: '62704', how: 'either', case: c.id, date: '2026-11-05' } })).json;
  assert.deepEqual(r.places.map((x) => [x.name, x.phone, x.url]), [['Calm Minds Therapy', '(555) 123-4567', 'https://calmminds.example'], ['Online CBT Co', '', '']]);
  assert.equal(r.note, 'Ask about the approach by name.');
  assert.equal((await call('/api/help/find', { method: 'POST', body: { place: 'x<script>' } })).status, 400);
  const h = (await call(`/api/cases/${c.id}/handover?date=2026-11-05`)).json;
  assert.match(h.text, /^A summary for my therapist/);
  assert.match(h.text, /not a clinical assessment/);
  assert.match(h.text, /In my own words: I put things off\./);
  assert.match(h.text, /Self-guided sessions I did/);
  assert.match(h.text, /What I hope for from therapy:/);
});
