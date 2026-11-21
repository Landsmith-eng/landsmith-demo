import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openDb, seedContent } from '../db.js';
import { createApp } from '../app.js';
import { planFor, PATHS } from '../content/paths.js';
import * as content from '../content/index.js';

async function boot() {
  const db = openDb(':memory:'); seedContent(db, content);
  db.prepare('INSERT INTO users (token, name) VALUES (?, ?)').run('t', 'Sam');
  const server = createApp(db, {}).listen(0);
  await new Promise((r) => server.once('listening', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = (path, body) => fetch(base + path, { method: body ? 'POST' : 'GET', headers: { 'x-continuum-token': 't', 'content-type': 'application/json' }, body: body && JSON.stringify(body) }).then(async (r) => ({ status: r.status, json: await r.json() }));
  return { db, server, call };
}
const day = (n) => new Date(Date.UTC(2026, 10, 1 + n)).toISOString().slice(0, 10);
const answerAll = async (call, cur, date, text = 'Yes.') => { for (const a of [...cur.morning, ...cur.evening]) if (!a.answer) await call('/api/paths/entry', { anchor: a.id, body: text, date }); };

test('every path day asks real anchors; the month builds up a week at a time; the long course ends with what it sums to', () => {
  for (const p of PATHS) for (let d = 1; d <= p.days; d++) { const pl = planFor(p.id, d); assert.ok(pl.morning.length + pl.evening.length > 0, `${p.id} ${d}`); }
  assert.deepEqual(planFor('month', 1).morning, ['body_am']);
  assert.equal(planFor('month', 22).morning.length, 5);
  assert.ok(planFor('month', 30).evening.includes('monthly'));
  assert.ok(planFor('course', 84).evening.includes('sums'));
  assert.ok(planFor('light', 7).evening.includes('weekly'));
});

test('a light path: chosen with examples and reasons, it steers the day\'s idea, counts the days you show up, and ends with what you wrote', async () => {
  const { db, server, call } = await boot();
  try {
    const cat = (await call(`/api/paths?date=${day(0)}`)).json;
    assert.deepEqual(cat.paths.map((p) => p.id), ['light', 'month', 'course']);
    assert.ok(cat.paths.every((p) => p.examples.length >= 3));
    assert.ok(cat.why.some((w) => w.id === 'harvard_study_adult_development'));
    assert.equal(cat.current, null);
    // The day's card was already chosen; starting a path steers it (not yet written).
    await call(`/api/today?date=${day(0)}`);
    let cur = (await call('/api/paths/start', { path: 'light', date: day(0) })).json.current;
    assert.deepEqual([cur.name, cur.day, cur.days], ['A light path', 1, 14]);
    const t = (await call(`/api/today?date=${day(0)}`)).json;
    assert.match(t.node.why, /A light path, day 1 of 14/);
    const lands = db.prepare("SELECT 1 FROM edges WHERE from_id = ? AND to_id = 'practice_examine_daily' AND relation = 'lands_on'").get(t.node.id);
    assert.ok(lands, 'an idea behind the practice in focus');
    cur = (await call(`/api/paths?date=${day(0)}`)).json.current;
    assert.equal(cur.idea.id, t.node.id);
    assert.deepEqual(cur.evening.map((a) => a.id), ['ledger_pm']);
    assert.match(cur.evening[0].source, /Seneca/);
    assert.equal((await call('/api/paths/entry', { anchor: 'body_am', body: 'x', date: day(0) })).status, 400); // not today's
    assert.equal((await call('/api/paths/entry', { anchor: 'ledger_pm', body: '  ', date: day(0) })).status, 400);
    cur = (await call('/api/paths/entry', { anchor: 'ledger_pm', body: 'Snapped at a colleague; finished the report.', date: day(0) })).json.current;
    assert.equal(cur.done.all, true);
    // The opening screen knows where they are.
    assert.deepEqual((await call(`/api/lure?date=${day(0)}`)).json.path, { name: 'A light path', day: 1, days: 14, morning: true, evening: true });
    // Two days off: the path waits.
    cur = (await call(`/api/paths?date=${day(3)}`)).json.current;
    assert.equal(cur.day, 2);
    assert.equal(cur.focus.id, 'practice_care_for_the_body');
    // Through to the end.
    let finished = null;
    for (let n = 3; n < 30 && !finished; n++) {
      cur = (await call(`/api/paths?date=${day(n)}`)).json.current;
      for (const a of [...cur.morning, ...cur.evening]) {
        const r = (await call('/api/paths/entry', { anchor: a.id, body: `Day ${cur.day}: ${a.label}`, date: day(n) })).json;
        if (r.finished) finished = r.finished;
      }
    }
    assert.equal(finished.practised, 14);
    assert.equal(finished.status, 'done');
    assert.ok(finished.anchors.some((a) => a.id === 'seven'));
    const after = (await call(`/api/paths?date=${day(40)}`)).json;
    assert.equal(after.current, null);
    assert.equal(after.past[0].status, 'done');
    assert.equal((await call(`/api/paths/${after.past[0].run}`)).json.answers, finished.answers);
  } finally { server.close(); }
});

test('the month: the morning names a time the evening comes back to; a new path leaves the old one; deleting the account takes it all', async () => {
  const { db, server, call } = await boot();
  try {
    await call('/api/paths/start', { path: 'month', date: day(0) });
    let cur = (await call('/api/paths/entry', { anchor: 'body_am', body: 'Bed by 10:30, walk at noon.', date: day(0) })).json.current;
    assert.equal(cur.named, 'Bed by 10:30, walk at noon.');
    assert.deepEqual(cur.evening.map((a) => a.id), ['ledger_pm', 'body_pm']);
    assert.equal(cur.done.morning, true); assert.equal(cur.done.evening, false);
    await answerAll(call, cur, day(0));
    cur = (await call('/api/paths/start', { path: 'course', date: day(1) })).json.current;
    assert.equal(cur.name, 'The long course'); assert.equal(cur.day, 1); assert.equal(cur.morning.length, 5);
    assert.equal(cur.focus.full, true);
    assert.equal((await call(`/api/paths?date=${day(1)}`)).json.past[0].status, 'left');
    assert.deepEqual((await call('/api/me/delete', { confirm: 'delete' })).json, { deleted: true });
    assert.equal(db.prepare('SELECT COUNT(*) AS n FROM path_entries').get().n, 0);
    assert.equal(db.prepare('SELECT COUNT(*) AS n FROM path_runs').get().n, 0);
  } finally { server.close(); }
});
