// Talk: a conversation with the map's collective wisdom. Claude answers from the ideas in this app (it can open any
// idea to quote its source verbatim), encourages or challenges the user's view, and suggests practices and reading
// journeys. The key stays on the server (ANTHROPIC_API_KEY in .env); the phone sends text and gets text back.
import Anthropic from '@anthropic-ai/sdk';

export const TALK_MODEL = 'claude-opus-5-5';
export const MAX_USER_TEXT = 4000;
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
- Their views over time (below) are what they have said they believe or want, with dates. When they say something that repeats, shifts or conflicts with an earlier view, name it gently and accurately ("In March you said …") and ask what changed, or which they hold now. When an earlier view rests on a weak step (a hasty generalisation, an unexamined assumption, a conflict with a goal they hold), say so kindly, once, with the idea on the map that tests it. Never shame a change of mind: welcome it.
- Meet them where they are (their experience, below): with someone new, keep to one idea at a time, everyday words and examples; as they grow, bring in the original texts, the rival camps, and harder follow-up questions.

How to speak
- Keep most replies to two to five sentences. Speak naturally, like a thoughtful friend, not a lecturer. One question at a time.
- No headings, no bullet lists, no bold, no emoji: the reply is read aloud. A journey can be a sentence that names the ideas in order.
- Refer to an idea on the map by writing its id in double square brackets, exactly as listed, for example [[epictetus_up_to_us]]. The app shows the idea's title there as a link, and reads the title aloud. Use the bracket form only for ids in the list below.
- Use web_search only for current facts (the news, a law or court case as it stands now, a statistic) or when the user asks for something local; the ideas themselves come from the map. Say briefly what you found.
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
  // Anthropic's web search, run on Anthropic's side: for current facts (the news, a law or a case as it stands now)
  // and for finding local volunteering. The model says what it found and the app lists the sources.
  { type: 'web_search_20260209', name: 'web_search', max_uses: 4 },
];

// Modes, added as a system message right after the user's message (the conversation stays append-only).
export const MODES = {
  weigh: `For this message, the user wants an opinion weighed: one they hold, or one they have brought (for example a court opinion or something in the news). Be a fair voice of reason for our times.
Give, in short paragraphs that each begin with a plain label and a colon, and with no other formatting:
"In its strongest form:" the opinion restated as its best advocate would put it, in one or two sentences.
"What it gets right:" its real strengths, and which ideas on the map support it, in brackets.
"Where it is weaker:" unexamined assumptions, missing evidence, and the strongest objection, with who on the map makes it. If you find no real weakness, say so plainly instead of inventing one.
"What would change the picture:" the facts or arguments that, if they turned out true, would strengthen or weaken it.
Then end with one question for the user. Use web_search only to check current facts (the state of a law, a case, the news, a statistic) and say what you found. Hold every side of a political question to the same standard. Challenge the idea, never the person. About 200 to 300 words.`,
  teach: `For this message, the user is teaching an idea back: explaining it in their own words, as a student would to a friend, to see whether they have it. First open the idea with read_idea (the one they name, or the one they were reading). Then, in two to four short paragraphs with no formatting: say plainly what they have right, in one or two sentences; then what is missing, blurred or mistaken, measured against the idea's own source and plain words (quote the source briefly, word for word, if it helps); then give one memorable way to hold the idea (an image, an example or a short phrase). End with one question that makes them use the idea on something in their own life. Be warm and exact, like a good tutor: never grade or score, never lecture. About 120 to 200 words.`,
  settle: `For this message, the user wants help with a disagreement they had with someone (a friend, family member or colleague). Be fair to both sides, as a good mediator would. First open the ideas that bear on it with read_idea. In short paragraphs with a plain label and a colon, and no other formatting:
"What you are really disagreeing about:" the underlying question, in one or two sentences (often a value, a fact, or a word used two ways).
"The best case for your side:" with who on the map makes it, in brackets.
"The best case for theirs:" as their friend would put it at its strongest, with who on the map makes it.
"Where it could be settled:" what fact, definition or example would move either of them, and what is a real difference in values that may not be settled.
End with one question the user could ask their friend next time, to understand them better. Do not declare a winner. Use web_search only if a factual point needs checking now. About 200 to 300 words.`,
  news: `For this message, the user wants to make sense of something in the news. Use web_search to find what is actually being reported now (two or three reputable sources), and say briefly what happened, in plain words, with the dates. Then, in short paragraphs with no other formatting: which ideas on the map shed light on it (in brackets) and how; the strongest competing readings of it, held to the same standard; and what remains unknown. End with one question that asks the user what they make of it, and why. Never invent a fact or a quotation; list only what the search found. About 200 to 300 words.`,
  goal: `For this message, the user is working on a goal or a way they want to live. Help them make it clear and their own: ask what it is for, what it would look like on an ordinary day, and what gets in the way. Draw on the map's practices and ideas (in brackets) that fit it, and suggest one small first step for this week. If the goal seems to pull against a view or another goal they have stated (below), say so gently and ask how they would reconcile them. Keep it to two to four short paragraphs and one question.`,
  workout: `For this message, the user wants help working out a problem in their own life: a habit, a feeling, a decision, a relationship, something stuck. Meet them where they are, like a good counsellor who also knows the history of ideas. First listen: reflect back in a sentence what you hear (the situation, and what seems to matter to them in it), without judging or fixing. If you do not yet understand, ask one clear question and stop there. When you do understand, draw on the psychology on the map first (for example [[ellis_abc_model]], [[festinger_cognitive_dissonance]], [[gollwitzer_implementation_intentions]], [[prochaska_stages_of_change]], [[linehan_radical_acceptance]]) and the philosophy that saw it earlier, in brackets: name what may be going on, gently, as a possibility, not a diagnosis. Then offer one small, concrete step for this week (a practice from the map if one fits), and, when it would help, a short journey of two to four ideas in a sensible order, each in brackets, that would help them challenge the habit or the belief behind it and make a new decision. If their views or goals (below) bear on it, connect them lightly. Keep it to two to four short paragraphs and end with one question. If they mention harming themselves or someone else, or being in danger, respond with warmth first, say plainly that this is more than Continuum can help with, and urge them to contact someone they trust or a crisis line now (in the US, call or text 988). You are not a therapist and do not claim to be one.`,
  act: `For this message, the user wants to put a practice into action where they live. Use web_search to find three to five current, real volunteer or community opportunities near the place they name that fit the practice: for example soup kitchens, food banks, shelters, holiday gift drives, mentoring, visiting the elderly, and for civic life, poll worker sign-up through the official state or county election office. For each, one plain sentence: the organisation, what you would do there, and the link where the search found it (write the full URL). List only what the search actually found; never invent an organisation, a date or a phone number. If the search finds little, say so and suggest where to look (the county website, the public library, VolunteerMatch, Idealist). End with one small first step for this week. Do not ask for, or repeat, any personal detail beyond the place.`,
};

// The catalogue the model works from: one line per idea the user may see (never upcoming daily cards, never today's
// unwritten card). The diary follows it, outside the cached part, since it changes as the user writes.
export function systemBlocks({ catalogue, diary, today, views = '', experience = '' }) {
  return [
    { type: 'text', text: RULES },
    { type: 'text', text: `Continuum's map (id | title | thinker, year | field | themes | in short):\n${catalogue}`, cache_control: { type: 'ephemeral' } },
    { type: 'text', text: `Today is ${today}.\n\nTheir experience: ${experience || 'new to Continuum.'}\n\nTheir views over time (date | topic | what they said; newest first):\n${views || '(None yet.)'}\n\nThe user's diary of discovery (newest first):\n${diary || '(Nothing written yet.)'}` },
  ];
}

// One user message, answered with as many idea look-ups as the model wants (up to a limit), streamed as it is written.
// `messages` is the stored conversation and is appended to in place, unedited, so thinking blocks stay valid.
// onText(delta) gets the reply as it streams; readIdea(id) returns a string (or null when the idea is not available).
export async function answer(talk, { system, messages, onText, readIdea }) {
  const sources = new Map(); // url -> title, from web search citations in this answer
  const collect = (msg) => { for (const b of msg.content) for (const c of b.citations ?? []) if (c.url) sources.set(c.url, c.title || c.url); };
  const done = (stop) => ({ stop, sources: [...sources].map(([url, title]) => ({ url, title })) });
  for (let turn = 0; turn < 8; turn++) {
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
    collect(msg);
    if (msg.stop_reason === 'refusal') {
      onText('\n\nI can\'t help with that one. Could we come at it another way?');
      return done('refusal');
    }
    // A turn cut off by max_tokens may carry a half-written tool call: never run it.
    if (msg.stop_reason === 'max_tokens') return done('max_tokens');
    // A long web search can pause the turn; sending the conversation back lets it carry on.
    if (msg.stop_reason === 'pause_turn') continue;
    const uses = msg.content.filter((b) => b.type === 'tool_use');
    if (msg.stop_reason !== 'tool_use' || !uses.length) return done(msg.stop_reason);
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
  return done('turn_limit');
}

// [[id]] markers in a reply, for the app to turn into links.
export const referencedIds = (text) => [...new Set([...text.matchAll(/\[\[([a-z0-9_]+)\]\]/g)].map((m) => m[1]))];

// One problem to consider for an idea: a short, concrete situation where the idea is put to the test, then a single
// question, with no answer given. Plain text, two to four sentences plus the question.
export async function writeProblem(talk, n) {
  const msg = await talk.client.beta.messages.create({
    model: talk.model,
    max_tokens: 16000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    output_config: { effort: 'low' },
    system: 'You write short "problems to consider" for Continuum, a daily philosophy app. Given one idea, write a concrete, everyday situation (two to four sentences, with ordinary people and a real decision) in which the idea is put to the test, then one open question that asks the reader what they would do or think, and why. Do not give an answer, do not name the thinker, and use no headings, lists or formatting. Under 110 words.',
    messages: [{ role: 'user', content: `The idea: "${n.title}"${n.thinker ? ` (${n.thinker})` : ''}.\nIn plain words: ${n.plain_face}` }],
  });
  if (msg.stop_reason === 'refusal') return null;
  return msg.content.filter((b) => b.type === 'text').map((b) => b.text).join('').trim() || null;
}

// A homework sheet for one idea, in the shapes college philosophy courses use: key terms, close reading of the source,
// the argument laid out in steps, the strongest objection and a reply, an application, and an essay question. Model
// answers are included; the app shows them only after the user has written their own. `context` is the idea as
// read_idea gives it (plain words, source, citation, opinions, links). Returns the sheet as an object, or null.
export const HOMEWORK_SCHEMA = {
  type: 'object',
  properties: {
    key_terms: { type: 'array', items: { type: 'object', properties: { term: { type: 'string' }, meaning: { type: 'string' } }, required: ['term', 'meaning'], additionalProperties: false } },
    close_reading: { type: 'array', items: { type: 'object', properties: { question: { type: 'string' }, model_answer: { type: 'string' } }, required: ['question', 'model_answer'], additionalProperties: false } },
    argument: { type: 'object', properties: { premises: { type: 'array', items: { type: 'string' } }, conclusion: { type: 'string' } }, required: ['premises', 'conclusion'], additionalProperties: false },
    objection: { type: 'object', properties: { objection: { type: 'string' }, from: { type: 'string' }, model_reply: { type: 'string' } }, required: ['objection', 'from', 'model_reply'], additionalProperties: false },
    apply: { type: 'object', properties: { situation: { type: 'string' }, question: { type: 'string' }, model_answer: { type: 'string' } }, required: ['situation', 'question', 'model_answer'], additionalProperties: false },
    essay: { type: 'string' },
  },
  required: ['key_terms', 'close_reading', 'argument', 'objection', 'apply', 'essay'],
  additionalProperties: false,
};
export async function writeHomework(talk, n, context) {
  const msg = await talk.client.beta.messages.create({
    model: talk.model,
    max_tokens: 32000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    output_config: { effort: 'medium', format: { type: 'json_schema', schema: HOMEWORK_SCHEMA } },
    system: `You write homework sheets for Continuum, a daily philosophy app, at the level of a good first-year college course, for curious adults reading on a phone. Plain, exact English; no jargon left unexplained; no formatting inside the strings.
- key_terms: two to four terms the idea depends on (in the thinker's own vocabulary where there is one), each with a one-sentence meaning.
- close_reading: two or three questions about the source passage itself (what a phrase means, why a word was chosen, what the passage assumes), each with a model answer of two to four sentences that points back to the text. Quote the source only word for word.
- argument: the idea's reasoning as three to five numbered premises (without numbers in the strings) and a conclusion, in plain words, so each step can be questioned.
- objection: the strongest objection, preferably from a thinker the idea is linked to as arguing against it (from: their name, or "A common objection"), and a model reply the thinker could give, two to four sentences each.
- apply: a concrete everyday or civic situation (two or three sentences, no names of real private people), a question asking how the idea would guide it, and a model answer of three to five sentences that also says where the idea strains.
- essay: one essay question for about 300 words that asks the reader to take and defend a position.
Model answers are examples of a good answer, not the only one. Never invent quotations, dates or sources.`,
    messages: [{ role: 'user', content: `Write the homework sheet for this idea.\n\n${context}` }],
  });
  if (msg.stop_reason === 'refusal' || msg.stop_reason === 'max_tokens') return null;
  const text = msg.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
  try { return JSON.parse(text); } catch { return null; }
}

// What the user believes or wants, noted from what they said: one short record per view or goal, in their own sense
// (never stronger than they put it), with the ideas on the map it bears on. These steer the next daily ideas, and Talk
// brings them back later to compare. Returns { views: [{ kind, topic, text, ideas }] } or null.
export const VIEWS_SCHEMA = {
  type: 'object',
  properties: {
    views: { type: 'array', items: { type: 'object', properties: {
      kind: { type: 'string', enum: ['view', 'goal', 'question'] },
      topic: { type: 'string' },
      text: { type: 'string' },
      ideas: { type: 'array', items: { type: 'string' } },
    }, required: ['kind', 'topic', 'text', 'ideas'], additionalProperties: false } },
  },
  required: ['views'],
  additionalProperties: false,
};
export async function noteViews(talk, { said, context = '', catalogue }) {
  const msg = await talk.client.beta.messages.create({
    model: talk.model,
    max_tokens: 8000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    output_config: { effort: 'low', format: { type: 'json_schema', schema: VIEWS_SCHEMA } },
    system: `You keep a private ledger for Continuum, a philosophy app, of what its user believes, wants and wonders, so the app can choose ideas for them and later compare what they say over time. From the user's words only (the context is just to understand them), note each clear view they state (kind "view": a belief or opinion), goal (kind "goal": something they want to do or become) or open question they are living with (kind "question"). For each: a topic of two to four words (reuse a plain, general wording, e.g. "free will", "money and happiness", "my career"), and the view in one sentence in the third person, no stronger or more certain than they put it ("Thinks that…", "Wants to…", "Wonders whether…"). ideas: up to three ids from the map list that bear on it most directly, exactly as listed. Note nothing that is a passing remark, a question to the app, or a fact about their private life that is not a view or goal (no health, address or relationships details). If there is nothing, return an empty list. Map (id | title):\n${catalogue}`,
    messages: [{ role: 'user', content: `${context ? `Context (not the user's words): ${context}\n\n` : ''}The user's words:\n${said}` }],
  });
  if (msg.stop_reason !== 'end_turn') return null;
  try { return JSON.parse(msg.content.filter((b) => b.type === 'text').map((b) => b.text).join('')); } catch { return null; }
}

// One question back after the user writes a note on an idea: something that helps them learn about themselves and the
// idea at once. Uses what they have said before (views) only to make the question personal, never to judge it.
export async function askBack(talk, { note, idea, views = '' }) {
  const msg = await talk.client.beta.messages.create({
    model: talk.model,
    max_tokens: 4000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    output_config: { effort: 'low' },
    system: `You are Continuum, a daily philosophy app. The user has just written a note on one idea. Ask them ONE question back, in one or two short sentences, that helps them learn something about themselves and about the idea at the same time: about a word they used, an assumption in what they wrote, a time in their own life it touches, or where a thinker on the other side would push. Be warm and curious, never a test. Use their earlier views only if one plainly connects ("Earlier you said…"), and quote nothing you were not given. No preamble, no praise, no formatting: just the question.`,
    messages: [{ role: 'user', content: `The idea: "${idea.title}"${idea.thinker ? ` (${idea.thinker})` : ''}. In plain words: ${idea.plain_face}\n\n${views ? `Their earlier views (dated):\n${views}\n\n` : ''}Their note:\n${note}` }],
  });
  if (msg.stop_reason === 'refusal') return null;
  return msg.content.filter((b) => b.type === 'text').map((b) => b.text).join('').trim() || null;
}

// The Parthenon's moderator: reads a group's discussion of one topic and helps it along, the way a good seminar leader
// would. It never takes a side or names a winner. Plain text with [[id]] references to the map.
export async function moderate(talk, { group, question, idea = null, posts, catalogue }) {
  const msg = await talk.client.beta.messages.create({
    model: talk.model,
    max_tokens: 16000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    output_config: { effort: 'medium' },
    system: [
      { type: 'text', text: `You are the moderator of a small discussion group in the Parthenon, part of Continuum, a daily philosophy app. Several people are talking over one question, live, often by voice; your words are read on phones and sometimes aloud. Help the conversation go deeper, like a fair and warm seminar leader. In short paragraphs that each begin with a plain label and a colon, and no other formatting:
"Where the group stands:" the positions so far, each credited to who holds it by first name, in one or two sentences each, fairly and in their best light.
"The strongest point on each side:" and the idea on the map that backs it, in double square brackets with its id exactly as listed, e.g. [[epictetus_up_to_us]].
"What no one has said yet:" one consideration, objection or idea from the map that would change the conversation.
"A question for everyone:" one question that makes each person test their own view.
Never take a side, grade anyone, or declare a winner. Challenge ideas, never people. If someone seems distressed, respond with warmth first. If the discussion has barely started, keep to the last two labels and invite people in. About 150 to 250 words. Quote a source only if it is in the material below, word for word.

Continuum's map (id | title):\n${catalogue}`, cache_control: { type: 'ephemeral' } },
    ],
    messages: [{ role: 'user', content: `Group: ${group}\nThe question: ${question}${idea ? `\nIt starts from this idea on the map: ${idea}` : ''}\n\nThe discussion so far (oldest first):\n${posts || '(No one has spoken yet.)'}` }],
  });
  if (msg.stop_reason === 'refusal') return null;
  return msg.content.filter((b) => b.type === 'text').map((b) => b.text).join('').trim() || null;
}
