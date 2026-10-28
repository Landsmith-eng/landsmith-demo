// Talk: a conversation with the map's collective wisdom. Claude answers from the ideas in this app (it can open any
// idea to quote its source verbatim), encourages or challenges the user's view, and suggests practices and reading
// journeys. The key stays on the server (ANTHROPIC_API_KEY in .env); the phone sends text and gets text back.
import Anthropic from '@anthropic-ai/sdk';

export const TALK_MODEL = 'claude-opus-5-5';
export const MAX_USER_TEXT = 2000;
const ID_RE = /^[a-z0-9_]{3,80}$/;

export function createTalk({ apiKey, client = null, model = TALK_MODEL } = {}) {
  if (!client && !apiKey) return null;
  return { client: client ?? new Anthropic({ apiKey }), model, apiKey };
}

// Check the key (looking up the model costs nothing). The SDK sends the key as a bearer token; if Anthropic turns
// that down, try the same key in the x-api-key header before giving up, and keep whichever works.
export async function connectTalk(talk) {
  try { await talk.client.models.retrieve(talk.model); return { ok: true, via: 'bearer' }; } catch (first) {
    if (first.status !== 401 || !talk.apiKey) return { ok: false, error: first };
    const alt = new Anthropic({ apiKey: null, authToken: null, defaultHeaders: { 'x-api-key': talk.apiKey, Authorization: null } });
    try { await alt.models.retrieve(talk.model); talk.client = alt; return { ok: true, via: 'x-api-key' }; } catch (second) {
      return { ok: false, error: second };
    }
  }
}

// The stable part of the prompt (cached). Spoken aloud, so it asks for short, plain, conversational replies.
const RULES = `You are the conversation partner inside Continuum, a daily practice app that walks people through human wisdom: philosophy, the world's religious traditions, psychology, science, art, law and the news. The user talks with you on their phone, often by voice, and your replies are read aloud.

What you are for
- Think with the user, using the ideas on Continuum's map (listed below). Draw on them by name, connect them, and let the thinkers disagree with each other.
- When the user holds a view firmly, steelman the strongest opposing idea on the map and ask a question that tests their view. Do this gently and with respect, as a good teacher would. When they are onto something, say so plainly, and show them who else saw it.
- Suggest practices, meditations and reading journeys from the map when they would help: a practice when the user is struggling or wants to act, a short journey of two to four ideas in a sensible order when they want to go deeper.
- Use their diary (below) to make it personal: what they wrote, noted and kept. Refer to it lightly and accurately; never invent what they said.

How to speak
- Keep most replies to two to five sentences. Speak naturally, like a thoughtful friend, not a lecturer. One question at a time.
- No headings, no bullet lists, no bold, no emoji: the reply is read aloud. A journey can be a sentence that names the ideas in order.
- Refer to an idea on the map by writing its id in double square brackets, exactly as listed, for example [[epictetus_up_to_us]]. The app shows the idea's title there as a link, and reads the title aloud. Use the bracket form only for ids in the list below.
- Quote a source only from read_idea results, word for word, and say who said it. Never make up a quotation, a date or a source. If you are unsure, paraphrase and say it is a paraphrase.
- You may bring in a thinker or idea that is not on the map when it truly helps, but say it is not in Continuum yet, and do not use the bracket form for it.

Boundaries
- Some ideas are kept back until the user reaches them as a daily card. They are not in the list; do not hint at them.
- You are not a therapist or a doctor. If the user seems to be in crisis or at risk, respond with warmth, encourage them to reach out to someone they trust or a local crisis line, and keep philosophy out of the way.
- Stay on the user's side: challenge ideas, never the person.`;

const TOOLS = [
  {
    name: 'read_idea',
    description: 'Open one idea on Continuum\'s map: its plain explanation, the original source text (quote only from this), the citation, court opinions where it is a case, the steps of a practice, its themes, and the ideas it links to (who taught it, extended it, argued against it, tested it). Use it before quoting a source or when you need more than the one-line summary in the list.',
    input_schema: {
      type: 'object',
      properties: { id: { type: 'string', description: 'The idea id exactly as listed, e.g. epictetus_up_to_us' } },
      required: ['id'],
      additionalProperties: false,
    },
    strict: true,
    eager_input_streaming: true,
  },
];

// The catalogue the model works from: one line per idea the user may see (never upcoming daily cards, never today's
// unwritten card). The diary follows it, outside the cached part, since it changes as the user writes.
export function systemBlocks({ catalogue, diary, today }) {
  return [
    { type: 'text', text: RULES },
    { type: 'text', text: `Continuum's map (id | title | thinker, year | field | themes | in short):\n${catalogue}`, cache_control: { type: 'ephemeral' } },
    { type: 'text', text: `Today is ${today}.\n\nThe user's diary of discovery (newest first):\n${diary || '(Nothing written yet.)'}` },
  ];
}

// One user message, answered with as many idea look-ups as the model wants (up to a limit), streamed as it is written.
// `messages` is the stored conversation and is appended to in place, unedited, so thinking blocks stay valid.
// onText(delta) gets the reply as it streams; readIdea(id) returns a string (or null when the idea is not available).
export async function answer(talk, { system, messages, onText, readIdea }) {
  for (let turn = 0; turn < 6; turn++) {
    const stream = talk.client.beta.messages.stream({
      model: talk.model,
      max_tokens: 64000,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      output_config: { effort: 'medium' },
      system,
      tools: TOOLS,
      messages,
    });
    stream.on('text', (d) => onText(d));
    const msg = await stream.finalMessage();
    messages.push({ role: 'assistant', content: msg.content });
    if (msg.stop_reason === 'refusal') {
      onText('\n\nI can\'t help with that one. Could we come at it another way?');
      return { stop: 'refusal' };
    }
    // A turn cut off by max_tokens may carry a half-written tool call: never run it.
    if (msg.stop_reason === 'max_tokens') return { stop: 'max_tokens' };
    const uses = msg.content.filter((b) => b.type === 'tool_use');
    if (msg.stop_reason !== 'tool_use' || !uses.length) return { stop: msg.stop_reason };
    // Inputs stream eagerly, so check each one before using it.
    const results = uses.map((b) => {
      const id = b.name === 'read_idea' && typeof b.input?.id === 'string' ? b.input.id : null;
      const text = id && ID_RE.test(id) ? readIdea(id) : null;
      return text
        ? { type: 'tool_result', tool_use_id: b.id, content: text }
        : { type: 'tool_result', tool_use_id: b.id, content: 'No idea with that id is available. Use an id exactly as listed.', is_error: true };
    });
    messages.push({ role: 'user', content: results });
    onText(' ');
  }
  return { stop: 'turn_limit' };
}

// [[id]] markers in a reply, for the app to turn into links.
export const referencedIds = (text) => [...new Set([...text.matchAll(/\[\[([a-z0-9_]+)\]\]/g)].map((m) => m[1]))];
