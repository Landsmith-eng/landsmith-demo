// Law and the state. Court cases: each opinion quoted verbatim (US federal court opinions are public domain),
// explained in plain words, and linked to the older idea it echoes. Verified against the Wikisource transcription of
// 319 U.S. 624; see SOURCES.md.
export const nodes = [
  {
    id: 'barnette_flag_salute',
    type: 'case',
    field: 'law',
    title: 'West Virginia v. Barnette: no one can be made to salute',
    thinker: 'US Supreme Court',
    year: 1943,
    plain_face:
      'In 1942 West Virginia ordered every schoolchild to salute the flag and recite the pledge. Children of Jehovah\'s '
      + 'Witnesses refused: their reading of Exodus forbade bowing to any image, and to them the flag was one. They were '
      + 'expelled, and their parents faced prosecution. Only three years earlier the Supreme Court had upheld a rule just '
      + 'like it. In June 1943, in the middle of a world war, the Court reversed itself, 6 to 3: the state may teach why '
      + 'the flag matters, but it may not make anyone profess it.',
    source_face:
      'If there is any fixed star in our constitutional constellation, it is that no official, high or petty, can '
      + 'prescribe what shall be orthodox in politics, nationalism, religion, or other matters of opinion or force '
      + 'citizens to confess by word or act their faith therein. If there are any circumstances which permit an '
      + 'exception, they do not now occur to us.',
    source_citation:
      'West Virginia State Board of Education v. Barnette, 319 U.S. 624 (1943), opinion of the Court by Justice '
      + 'Robert H. Jackson. A work of the US government, in the public domain.',
    source_url: 'https://en.wikisource.org/wiki/West_Virginia_State_Board_of_Education_v._Barnette',
    prompt:
      'The state said a shared pledge holds a country together; the children said no one can be made to mean it. '
      + 'Which opinion persuades you, and what would change your mind?',
    opinions: [
      {
        role: 'majority',
        author: 'Justice Robert H. Jackson, for six justices',
        gist:
          'The state may teach why the flag matters, but a compelled pledge reaches into the mind, which the First '
          + 'Amendment puts beyond any official\'s control. Forced unity does not work: from Rome against the Christians '
          + 'to the Inquisition, each attempt needed harsher coercion than the last. And freedom to differ only means '
          + 'something if it covers the things that matter most.',
        quote:
          'Those who begin coercive elimination of dissent soon find themselves exterminating dissenters. Compulsory '
          + 'unification of opinion achieves only the unanimity of the graveyard. … Authority here is to be controlled '
          + 'by public opinion, not public opinion by authority.',
        echoes: 'zera_yacob_hatata',
        echo_note: 'Ours, not cited: Zera Yacob fled a faith imposed by the state rather than profess it; Jackson rules that no official may prescribe what is orthodox.',
      },
      {
        role: 'concurrence',
        author: 'Justices Hugo Black and William O. Douglas',
        gist:
          'Both had voted to uphold the salute three years earlier, and they say so: long reflection changed their '
          + 'minds. Faith does not excuse anyone from laws that protect society from grave danger, but a ceremony forced '
          + 'on children who fear God\'s condemnation protects nothing. Words said under compulsion prove nothing.',
        quote:
          'Words uttered under coercion are proof of loyalty to nothing but self-interest. Love of country must spring '
          + 'from willing hearts and free minds …',
        echoes: 'sophocles_antigone',
        echo_note: 'Ours, not cited: a public command set against what someone holds sacred. Here, unlike in Thebes, the ruler gives way.',
      },
      {
        role: 'concurrence',
        author: 'Justice Frank Murphy',
        gist:
          'Freedom of thought includes the freedom to stay silent. Except where government truly needs it, as when a '
          + 'witness must testify, no one can be made to declare a belief.',
        quote:
          'The right of freedom of thought and of religion as guaranteed by the Constitution against State action '
          + 'includes both the right to speak freely and the right to refrain from speaking at all …',
        echoes: 'gandhi_satyagraha',
        echo_note: 'Ours, not cited: refusing, openly and at a cost, to do what conscience forbids, as the Barnette children did when they accepted expulsion.',
      },
      {
        role: 'dissent',
        author: 'Justice Felix Frankfurter (Justices Owen Roberts and Stanley Reed also dissented, without opinions)',
        gist:
          'Frankfurter, the only Jewish member of the Court, says his own sympathies lie with the children, but a judge '
          + 'must not write private convictions into the Constitution. Law governs conduct, not inner belief; elected '
          + 'officials chose the salute, and it was not for the Court to overrule them. He invokes Socrates, who died '
          + 'obeying a law he did not believe in, as proof that obedience need not mean agreement.',
        quote:
          'One who belongs to the most vilified and persecuted minority in history is not likely to be insensible to '
          + 'the freedoms guaranteed by our Constitution. … But as judges we are neither Jew nor Gentile, neither '
          + 'Catholic nor agnostic. … Law is concerned with external behavior and not with the inner life of man.',
        echoes: 'socrates_unexamined_life',
        echo_note: 'Cited: Frankfurter names Socrates, who accepted Athens\'s sentence. The majority is closer to the Socrates of this card, who would not stop questioning at the city\'s command.',
      },
    ],
  },
];

export const edges = [
  { from: 'socrates_unexamined_life', to: 'barnette_flag_salute', relation: 'echoes', year: 1943,
    note: 'Cited in the dissent: Frankfurter names Socrates, who died obeying a law he did not believe in. The majority answers with the Socrates of the Apology: some commands reach where the city may not.' },
  { from: 'sophocles_antigone', to: 'barnette_flag_salute', relation: 'echoes', year: 1943,
    note: 'Ours, not cited: a decree set against what someone holds sacred. This time the Court sides with the one who refuses.' },
  { from: 'zera_yacob_hatata', to: 'barnette_flag_salute', relation: 'echoes', year: 1943,
    note: 'Ours, not cited: Zera Yacob fled a state-imposed faith rather than profess it; Jackson rules that no official may prescribe what is orthodox.' },
  { from: 'gandhi_satyagraha', to: 'barnette_flag_salute', relation: 'echoes', year: 1943,
    note: 'Ours, not cited: the Witnesses refused openly and accepted expulsion and prosecution rather than salute, the method Gandhi named.' },
];
