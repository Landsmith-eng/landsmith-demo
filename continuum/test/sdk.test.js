// The real Anthropic SDK, with the network faked: the usage meter and the governor's gate must leave its calls
// working exactly as before, plain and streamed (a wrapper that returned a plain promise broke streaming once).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import Anthropic from '@anthropic-ai/sdk';
import { createTalk, answer } from '../talk.js';

const usage = { input_tokens: 10, output_tokens: 5, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 };
const message = { id: 'msg_1', type: 'message', role: 'assistant', model: 'claude-opus-5-5', content: [{ type: 'text', text: 'Hello there.' }], stop_reason: 'end_turn', stop_sequence: null, usage };
function sse() {
  const ev = (type, data) => `event: ${type}\ndata: ${JSON.stringify({ type, ...data })}\n\n`;
  return [ev('message_start', { message: { ...message, content: [], stop_reason: null } }), ev('content_block_start', { index: 0, content_block: { type: 'text', text: '' } }),
    ev('content_block_delta', { index: 0, delta: { type: 'text_delta', text: 'Hello ' } }), ev('content_block_delta', { index: 0, delta: { type: 'text_delta', text: 'there.' } }),
    ev('content_block_stop', { index: 0 }), ev('message_delta', { delta: { stop_reason: 'end_turn', stop_sequence: null }, usage: { output_tokens: 5 } }), ev('message_stop', {})].join('');
}
const fakeFetch = async (url, init) => {
  const body = JSON.parse(init.body);
  return body.stream ? new Response(sse(), { headers: { 'content-type': 'text/event-stream' } }) : new Response(JSON.stringify(message), { headers: { 'content-type': 'application/json' } });
};

test('the real SDK works through the meter: plain calls, streamed calls, and Talk\'s answer', async () => {
  const talk = createTalk({ client: new Anthropic({ apiKey: 'test', fetch: fakeFetch, maxRetries: 0 }) });
  const seen = []; talk.onUsage = (u) => seen.push(u);
  const plain = await talk.client.beta.messages.create({ model: talk.model, max_tokens: 10, messages: [{ role: 'user', content: 'Hi' }] });
  assert.equal(plain.content[0].text, 'Hello there.');
  const streamed = await talk.client.beta.messages.stream({ model: talk.model, max_tokens: 10, messages: [{ role: 'user', content: 'Hi' }] }).finalMessage();
  assert.equal(streamed.content[0].text, 'Hello there.');
  let said = '';
  const out = await answer(talk, { system: [{ type: 'text', text: 'Rules.' }], messages: [{ role: 'user', content: 'Hi' }], onText: (d) => { said += d; }, readIdea: () => null });
  assert.equal(out.stop, 'end_turn'); assert.equal(said, 'Hello there.');
  await new Promise((r) => setTimeout(r, 20));
  assert.ok(seen.length >= 3, `usage noted for each call (${seen.length})`);
  // Past the allowance, a call does not go out at all.
  talk.blocked = () => ({ name: 'Free' });
  assert.throws(() => talk.client.beta.messages.create({ model: talk.model, max_tokens: 10, messages: [{ role: 'user', content: 'Hi' }] }), /allowance/);
});
