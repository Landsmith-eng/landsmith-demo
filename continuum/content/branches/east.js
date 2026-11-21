// Branch: East (Islamic, Persian and Chinese thought), where it crosses the daily line.
// Walk-only nodes (no seq). Every source_face below was checked word for word against the cited
// public-domain text (Gutenberg / Wikisource), except the Avicenna node, which is a labelled summary
// (no public-domain English translation of the floating-man passage could be verified).

export const nodes = [
  {
    id: 'avicenna_floating_man',
    type: 'puzzle',
    field: 'philosophy',
    thinker: 'Avicenna (Ibn Sina)',
    year: 1020,
    title: 'The floating man',
    prompt: 'Strip away everything you can see, hear and touch, including your own body. What, if anything, is left that you would still call "me"?',
    plain_face:
      'Picture a person created all at once, fully grown, floating in mid-air: eyes covered, limbs spread so nothing touches anything, no sound, no smell, no sense of their own body at all. Avicenna, a Persian physician and philosopher, says this person would still be sure of one thing: that they exist. Like a radio with every station switched off that still hums when you put your ear to it, the self is there before any signal arrives. So the self, he concludes, is not the body.',
    source_face:
      'Summary (work under copyright): In the Psychology of his encyclopaedia The Cure (Kitab al-Shifa, al-Nafs I.1), Avicenna asks the reader to imagine a person created in an instant, fully formed, suspended in the air with sight veiled, limbs held apart and no sensation of the body or the world. Such a person, he argues, would still affirm their own existence without affirming any limb, organ or external thing. He draws the conclusion that the self one is aware of is distinct from the body, and offers the thought experiment as a reminder to anyone attentive enough to notice their own soul.',
    source_citation: 'Avicenna, Kitab al-Shifa, Psychology (al-Nafs) I.1 (c. 1020). Discussed and translated in Michael E. Marmura, "Avicenna\'s \'Flying Man\' in Context", The Monist 69:3 (1986), pp. 383–395. Summary, not a quotation.',
    source_url: null,
  },
  {
    id: 'rumi_reed_flute',
    type: 'quote',
    field: 'religion',
    thinker: 'Rumi (Jalal al-Din Rumi)',
    year: 1260,
    title: 'Hear what the reed-flute tells',
    prompt: 'What are you homesick for? Not a place, necessarily: a person, a time, a version of yourself.',
    plain_face:
      'A flute is a reed that was cut from its reed-bed, and every note it plays is the sound of that cut. Rumi, a Persian Sufi poet, opens his great Masnavi with that flute. Its song moves everyone, he says, because everyone was torn from somewhere and longs to go back. The ache is not a fault to fix; it is the fire of love, and love is the road home.',
    source_face:
      'From reed-flute hear what tale it tells;\nWhat plaint it makes of absence\' ills:\n\n"From jungle-bed since me they tore,\nMen\'s, women\'s, eyes have wept right sore.\nMy breast I tear and rend in twain,\nTo give, through sighs, vent to my pain.\nWho\'s from his home snatched far away,\nLongs to return some future day.\nI sob and sigh in each retreat,\nBe\'t joy or grief for which men meet.\nThey fancy they can read my heart;\nGrief\'s secrets I to none impart.\nMy throes and moans form but one chain,\nMen\'s eyes and ears catch not their train.\nThough soul and body be as one,\nSight of his soul hath no man won.\nA flame\'s the flute\'s wail; not a breath,\nThat flame who feels not, doom him death.\nThe flame of love, \'tis, prompts the flute,\nWine\'s ferment, love; its tongue not mute."',
    source_citation: 'Rumi, The Mesnevi, Book I, Proem "The Reed-Flute", lines 1–10 (trans. Sir James W. Redhouse, 1881)',
    source_url: 'https://www.gutenberg.org/ebooks/61724',
  },
  {
    id: 'mencius_child_at_the_well',
    type: 'concept',
    field: 'philosophy',
    thinker: 'Mencius',
    year: -300,
    title: 'The child at the well: goodness is a sprout',
    prompt: 'When did you last feel a jolt of concern for a stranger before you had time to think? What does that reflex tell you about yourself?',
    plain_face:
      'See a toddler wobbling at the edge of a well and your stomach drops before you have thought anything at all. Mencius, the second great Confucian, says that jolt proves something: compassion is built in, not taught. Goodness is a seed in everyone, like the four limbs are. Seeds do not guarantee a harvest, though. Water them, and you get a good person; neglect them, and you get the people we complain about.',
    source_face:
      'Mencius said, \'All men have a mind which cannot bear to see the sufferings of others. …\n\nWhen I say that all men have a mind which cannot bear to see the sufferings of others, my meaning may be illustrated thus: even now-a-days, if men suddenly see a child about to fall into a well, they will without exception experience a feeling of alarm and distress. They will feel so, not as a ground on which they may gain the favour of the child\'s parents, nor as a ground on which they may seek the praise of their neighbours and friends, nor from a dislike to the reputation of having been unmoved by such a thing.\n\nFrom this case we may perceive that the feeling of commiseration is essential to man, that the feeling of shame and dislike is essential to man, that the feeling of modesty and complaisance is essential to man, and that the feeling of approving and disapproving is essential to man.\n\nThe feeling of commiseration is the principle of benevolence. The feeling of shame and dislike is the principle of righteousness. The feeling of modesty and complaisance is the principle of propriety. The feeling of approving and disapproving is the principle of knowledge.\n\nMen have these four principles just as they have their four limbs.',
    source_citation: 'Mencius, Book II (Gong Sun Chou) Part I, ch. 6, in The Chinese Classics, Vol. II (trans. James Legge, 1861; 2nd ed. 1895)',
    source_url: 'https://en.wikisource.org/wiki/The_Chinese_Classics/Volume_2/The_Works_of_Mencius/chapter03',
  },
  {
    id: 'zhuangzi_butterfly_dream',
    type: 'puzzle',
    field: 'philosophy',
    thinker: 'Zhuangzi',
    year: -300,
    title: 'The butterfly dream',
    prompt: 'What is one thing you are certain of right now? How would you check that you are not dreaming it?',
    plain_face:
      'Zhuangzi dreamed he was a butterfly, happily flitting about with no idea it had ever been a man. Then he woke up. And then came the question: was that a man dreaming he was a butterfly, or is this a butterfly dreaming it is a man? It is like waking from a dream so vivid you check your phone to see which life is real. Zhuangzi, a Daoist, does not answer. He wants you to hold your certainties a little more lightly: things change into one another, and the line between "me" and "not me" is thinner than it feels.',
    source_face:
      'Once upon a time, I, Chuang Tzŭ, dreamt I was a butterfly, fluttering hither and thither, to all intents and purposes a butterfly. I was conscious only of following my fancies as a butterfly, and was unconscious of my individuality as a man. Suddenly, I awaked, and there I lay, myself again. Now I do not know whether I was then a man dreaming I was a butterfly, or whether I am now a butterfly dreaming I am a man. Between a man and a butterfly there is necessarily a barrier. The transition is called Metempsychosis.',
    source_citation: 'Zhuangzi, ch. II "The Identity of Contraries", closing passage, in Chuang Tzŭ: Mystic, Moralist, and Social Reformer (trans. Herbert A. Giles, 1889)',
    source_url: 'https://www.gutenberg.org/ebooks/59709',
  },
];

// Direction: `from` is the earlier idea; `relation` says what `to` did with it.
// converged is symmetric (no contact); lands_on points from any node to a practice.
export const edges = [
  // Avicenna
  { from: 'aristotle_friendship', to: 'avicenna_floating_man', relation: 'extended', year: 1020, note: 'Avicenna built his whole system on Aristotle; his autobiography says he read the Metaphysics forty times before al-Farabi\'s commentary unlocked it.' },
  { from: 'avicenna_floating_man', to: 'descartes_i_think_therefore_i_am', relation: 'converged', note: 'Both find the self certain of itself with the body doubted away, six centuries apart; Descartes is not known to have read Avicenna.' },
  { from: 'avicenna_floating_man', to: 'ghazali_crisis_of_doubt', relation: 'refuted', year: 1095, note: 'Al-Ghazali names "Ibn Sina (Avicenna) and Farabi" and wrote his Destruction of the Philosophers to combat their system.' },
  { from: 'avicenna_floating_man', to: 'practice_hold_beliefs_loosely', relation: 'lands_on' },

  // Rumi
  { from: 'augustine_restless_heart', to: 'rumi_reed_flute', relation: 'converged', note: 'Both hear in human restlessness a longing for the home it was torn from, with no contact between them.' },
  { from: 'ghazali_crisis_of_doubt', to: 'rumi_reed_flute', relation: 'extended', year: 1260, note: 'Al-Ghazali\'s turn from scholarship to Sufism, a century and a half earlier, set the path Rumi\'s poetry walks; his works were standard reading in the schooling Rumi received.' },
  { from: 'rumi_reed_flute', to: 'practice_invest_in_people', relation: 'lands_on' },

  // Mencius
  { from: 'zengzi_three_daily_examinations', to: 'mencius_child_at_the_well', relation: 'extended', year: -300, note: 'Same Confucian line: Mencius studied under a pupil of Zisi, Confucius\'s grandson, whose teacher was Zengzi.' },
  { from: 'mencius_child_at_the_well', to: 'practice_invest_in_people', relation: 'lands_on' },

  // Zhuangzi
  { from: 'laozi_sufficiency_of_contentment', to: 'zhuangzi_butterfly_dream', relation: 'extended', year: -300, note: 'The Zhuangzi is the second Daoist classic and quotes and reworks the Tao Te Ching throughout.' },
  { from: 'zhuangzi_butterfly_dream', to: 'descartes_i_think_therefore_i_am', relation: 'converged', note: 'Descartes asks the same question in Discourse IV: "how do we know that the thoughts which occur in dreaming are false rather than those other which we experience when awake"; no contact.' },
  { from: 'zhuangzi_butterfly_dream', to: 'ghazali_crisis_of_doubt', relation: 'converged', note: 'Al-Ghazali\'s doubt also turns on dreams that feel "indisputably real" until we wake; no contact.' },
  { from: 'zhuangzi_butterfly_dream', to: 'practice_hold_beliefs_loosely', relation: 'lands_on' },
];
