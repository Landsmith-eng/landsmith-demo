// Branch: modern thought beyond the line, part three: Hobbes, Hegel, Goethe, Du Bois, King, Arendt, Milgram, Kahneman.
// Walk-only nodes (no seq). Same shape as content/line_poc.js.
// Public-domain passages verified word for word against the Project Gutenberg texts cited.
// In-copyright works (King, Arendt, Milgram, Redelmeier & Kahneman) carry labelled summaries, not quotations.

export const nodes = [
  {
    id: 'hobbes_state_of_nature',
    type: 'quote',
    field: 'philosophy',
    thinker: 'Thomas Hobbes',
    year: 1651,
    title: 'Life in the state of nature: "solitary, poore, nasty, brutish, and short"',
    prompt: 'Think of one rule you obey without being watched. What would your week look like if nobody obeyed it?',
    plain_face:
      'Hobbes wrote during the English civil war, and he asked what people are like with the referee gone. Not wicked, just frightened: everyone roughly equal, everyone able to kill, nobody able to trust. In that state nothing worth building gets built, because the fruit of your work is not safe. His conclusion is that the laws and institutions we grumble about are the fence that lets us plant anything at all.',
    source_face:
      'Whatsoever therefore is consequent to a time of Warre, where every man is Enemy to every man; the same is consequent to the time, wherein men live without other security, than what their own strength, and their own invention shall furnish them withall. In such condition, there is no place for Industry; because the fruit thereof is uncertain; and consequently no Culture of the Earth; no Navigation, nor use of the commodities that may be imported by Sea; no commodious Building; no Instruments of moving, and removing such things as require much force; no Knowledge of the face of the Earth; no account of Time; no Arts; no Letters; no Society; and which is worst of all, continuall feare, and danger of violent death; And the life of man, solitary, poore, nasty, brutish, and short.',
    source_citation: 'Thomas Hobbes, Leviathan (London, 1651), Part I, ch. XIII, "Of the Naturall Condition of Mankind, as concerning their Felicity, and Misery". Spelling and capitals are as printed in the 1651 edition, which the Project Gutenberg text follows.',
    source_url: 'https://www.gutenberg.org/ebooks/3207',
  },
  {
    id: 'hegel_master_and_slave',
    type: 'concept',
    field: 'philosophy',
    thinker: 'G. W. F. Hegel',
    year: 1807,
    title: 'Master and slave: self-consciousness needs recognition',
    prompt: 'Whose recognition do you quietly depend on? What have you made with your own hands that did not need anyone\'s approval?',
    plain_face:
      'You cannot see your own face without a mirror, and Hegel says you cannot fully be a self without another self who recognises you. In his story two selves fight for that recognition; one risks death and becomes master, the other backs down and becomes servant. Then the twist: the master is recognised only by someone he does not respect, and does nothing himself, while the servant, through fear and work, shapes the world and finds himself in what he has made. The one who works ends up the freer.',
    source_face:
      'Das Selbstbewußtsein ist an und für sich, indem, und dadurch, daß es für ein Anderes an und für sich ist; d.h. es ist nur als ein Anerkanntes.\n\n[Self-consciousness exists in and for itself in that, and by the fact that, it exists in and for itself for another; that is, it exists only as something recognised.]\n\n… Durch die Arbeit kömmt es aber zu sich selbst. … Die Arbeit hingegen ist gehemmte Begierde, aufgehaltenes Verschwinden, oder sie bildet. … das arbeitende Bewußtsein kommt also hiedurch zur Anschauung des selbstständigen Seins, als seiner selbst.\n\n[Through work, however, it comes to itself. … Work, by contrast, is desire held in check, a vanishing held back; or rather, it forms. … the working consciousness thus comes to see independent being as itself.]',
    source_citation: 'G. W. F. Hegel, Phänomenologie des Geistes (1807), IV.A, "Selbstständigkeit und Unselbstständigkeit des Selbstbewußtseins; Herrschaft und Knechtschaft". German text as on Project Gutenberg; the bracketed English is a literal rendering for this card (J. B. Baillie\'s 1910 translation, The Phenomenology of Mind, could not be fetched to verify).',
    source_url: 'https://www.gutenberg.org/ebooks/6698',
  },
  {
    id: 'goethe_faust_striving',
    type: 'text',
    field: 'philosophy',
    thinker: 'Johann Wolfgang von Goethe',
    year: 1808,
    title: 'Faust\'s wager: "Ah, still delay—thou art so fair!"',
    prompt: 'Has there been a moment you would have been content to stay in forever? What did you do the next morning?',
    plain_face:
      'Faust, a scholar who has learned everything and enjoyed nothing, makes a bet with the devil. Not the usual one: Mephistopheles can have his soul only if Faust ever finds a moment so good that he asks it to stay. A runner who stops to admire the view has, by Faust\'s own rule, lost. Goethe\'s question is whether a life of endless striving is heroic, or whether the man who can never say "this is enough" has already damned himself.',
    source_face:
      'FAUST\n\nWhen on an idler\'s bed I stretch myself in quiet.\nThere let, at once, my record end!\nCanst thou with lying flattery rule me,\nUntil, self-pleased, myself I see,—\nCanst thou with rich enjoyment fool me,\nLet that day be the last for me!\nThe bet I offer.\n\nMEPHISTOPHELES\n\nDone!\n\nFAUST\n\nAnd heartily!\nWhen thus I hail the Moment flying:\n"Ah, still delay—thou art so fair!"\nThen bind me in thy bonds undying,\nMy final ruin then declare!\nThen let the death-bell chime the token.\nThen art thou from thy service free!\nThe clock may stop, the hand be broken,\nThen Time be finished unto me!',
    source_citation: 'Johann Wolfgang von Goethe, Faust, Part I (1808), scene IV, "The Study" (trans. Bayard Taylor, 1870). The German wager line is "Werd\' ich zum Augenblicke sagen: / Verweile doch! du bist so schön!" (Project Gutenberg #2229).',
    source_url: 'https://www.gutenberg.org/ebooks/14591',
  },
  {
    id: 'du_bois_double_consciousness',
    type: 'quote',
    field: 'philosophy',
    thinker: 'W. E. B. Du Bois',
    year: 1903,
    title: 'Double consciousness: seeing yourself through others\' eyes',
    prompt: 'In which room do you watch yourself being watched? What would you say or do there if that second pair of eyes went away?',
    plain_face:
      'Du Bois, the first Black American to earn a Harvard doctorate, described a sensation he had known since childhood: being an American and a Black person at once, in a country that treated the two as a contradiction. It is like trying to speak while hearing your own voice played back a half-second late; you never quite own it. He called it double consciousness: always measuring your own soul with a tape held by people who look on with contempt or pity.',
    source_face:
      'After the Egyptian and Indian, the Greek and Roman, the Teuton and Mongolian, the Negro is a sort of seventh son, born with a veil, and gifted with second-sight in this American world,—a world which yields him no true self-consciousness, but only lets him see himself through the revelation of the other world. It is a peculiar sensation, this double-consciousness, this sense of always looking at one\'s self through the eyes of others, of measuring one\'s soul by the tape of a world that looks on in amused contempt and pity. One ever feels his twoness,—an American, a Negro; two souls, two thoughts, two unreconciled strivings; two warring ideals in one dark body, whose dogged strength alone keeps it from being torn asunder.',
    source_citation: 'W. E. B. Du Bois, The Souls of Black Folk (Chicago: A. C. McClurg, 1903), ch. I, "Of Our Spiritual Strivings"',
    source_url: 'https://www.gutenberg.org/ebooks/408',
  },
  {
    id: 'king_letter_from_birmingham_jail',
    type: 'text',
    field: 'religion',
    thinker: 'Martin Luther King Jr.',
    year: 1963,
    title: 'Letter from Birmingham Jail',
    prompt: 'Is there an injustice near you that you have been calling "not my business"? What makes it yours?',
    plain_face:
      'Eight white clergymen had called King\'s Birmingham protests "unwise and untimely". From a jail cell, on scraps of paper, he answered them. His picture is a single garment: pull one thread of injustice anywhere and the whole cloth puckers everywhere, so nobody in the garment is a bystander. An unjust law, he argued with Augustine and Aquinas, is no law at all, and the person who breaks it openly and takes the penalty is showing the highest respect for law. The real obstacle, he said, is not the open enemy but the moderate who prefers quiet to justice.',
    source_face:
      'Summary (work under copyright): Writing on 16 April 1963 to the eight Alabama clergymen who had criticised the Birmingham campaign, King explains why he came: injustice in one place threatens justice in every place, because all communities are tied in a single garment of destiny. He sets out the four steps of a nonviolent campaign (gathering the facts, negotiation, self-purification, direct action) and defends breaking segregation laws by distinguishing just laws from unjust ones, citing Augustine\'s and Aquinas\'s teaching that an unjust law is no law at all; one who breaks such a law openly, lovingly and with willingness to accept the penalty is expressing the highest respect for law. He names Socrates among those who created necessary tension, and the early Christians and Boston Tea Party as civil disobedients. He confesses his deepest disappointment is with the white moderate who prefers order to justice, and with a church that has too often been a taillight rather than a headlight.',
    source_citation: 'Martin Luther King Jr., "Letter from Birmingham Jail" (16 April 1963), collected in Why We Can\'t Wait (New York: Harper & Row, 1964)',
    source_url: null,
  },
  {
    id: 'arendt_banality_of_evil',
    type: 'concept',
    field: 'philosophy',
    thinker: 'Hannah Arendt',
    year: 1963,
    title: 'The banality of evil',
    prompt: 'When did you last do something because it was the procedure, without stopping to ask whether it was right?',
    plain_face:
      'Arendt went to Jerusalem expecting to see a monster in the dock and found a clerk. Adolf Eichmann, who organised the transport of millions to the death camps, spoke in office clichés, worried about his career, and could not think from anyone else\'s point of view. Her unsettling claim is that great evil can come from a mind that simply never switches on, the way a car with no driver can still roll downhill into a crowd. Thinking, the inner conversation with yourself, is what applies the brakes.',
    source_face:
      'Summary (work under copyright): Arendt covered the 1961 trial of Adolf Eichmann for The New Yorker and published her report as a book in 1963. She found that Eichmann was neither a sadist nor a fanatic but an ordinary careerist who spoke in stock phrases and showed an almost total inability to think from the standpoint of another person. She calls this thoughtlessness, not stupidity, and argues that it, rather than any demonic depth, enabled his part in mass murder; her closing pages name "the banality of evil". In later essays, above all "Thinking and Moral Considerations" (1971), she took Socrates as the model of the thinking that might prevent such evil.',
    source_citation: 'Hannah Arendt, Eichmann in Jerusalem: A Report on the Banality of Evil (New York: Viking, 1963; first serialised in The New Yorker, 1963); "Thinking and Moral Considerations", Social Research 38 (1971)',
    source_url: null,
  },
  {
    id: 'milgram_obedience',
    type: 'concept',
    field: 'science',
    thinker: 'Stanley Milgram',
    year: 1963,
    title: 'The obedience experiments',
    prompt: 'What is the furthest you have gone because someone with authority told you to keep going? Where was your stop line, and did you know it in advance?',
    plain_face:
      'A Yale psychologist asked ordinary New Haven men to give a stranger electric shocks for wrong answers, raising the voltage each time, while a man in a grey coat said "Please continue." The shocks were fake; the sweating, pleading and obedience were real. About two in three went all the way to the top of the board. Milgram\'s point is like a fire drill: the people who stopped were not braver by nature, they had simply decided, in the moment, that the voice in the coat was not in charge of them.',
    source_face:
      'Summary (work under copyright): In the baseline study, 40 men aged 20 to 50 recruited by newspaper advertisement were told they were helping test the effect of punishment on learning. Each was to shock a "learner" (a confederate, strapped to a chair in the next room) with a generator marked from 15 to 450 volts, raising the level after every wrong answer, while an experimenter in a lab coat gave scripted prods to continue. The learner\'s protests were recorded; no shocks were given. All 40 participants went to 300 volts, and 26 (65%) continued to the maximum of 450 volts. Many showed severe tension, sweating, trembling and nervous laughter. In Obedience to Authority (1974) Milgram related the result to Arendt\'s account of Eichmann, arguing that ordinary people doing their job can become agents in a destructive process.',
    source_citation: 'Stanley Milgram, "Behavioral Study of Obedience", Journal of Abnormal and Social Psychology 67:4 (1963), 371–378; Obedience to Authority: An Experimental View (New York: Harper & Row, 1974)',
    source_url: null,
  },
  {
    id: 'kahneman_peak_end',
    type: 'concept',
    field: 'science',
    thinker: 'Daniel Kahneman',
    year: 1996,
    title: 'The peak–end rule: memory keeps the worst moment and the last',
    prompt: 'Think of a hard day that you remember fondly. What happened at its worst moment, and how did it end?',
    plain_face:
      'Patients having a colonoscopy rated their pain minute by minute, and then, afterwards, as a whole. The whole did not add up the minutes. Memory kept just two snapshots, the worst moment and the final moment, and threw away how long it lasted. A longer procedure with a gentler ending was remembered as less bad than a shorter, harsher one. The self that lives through an experience and the self that remembers it keep different books, and it is the remembering self that decides what we do again.',
    source_face:
      'Summary (work under copyright): Redelmeier and Kahneman recorded real-time pain ratings at regular intervals from patients undergoing colonoscopy and from patients undergoing lithotripsy, and afterwards asked them to rate the total pain of the procedure. The retrospective ratings were predicted by the peak intensity and by the intensity near the end, not by the duration, which the authors call duration neglect. A later randomised trial (Redelmeier, Katz and Kahneman, 2003) found that leaving the colonoscope in place for a short, less painful interval at the end made the procedure longer but reduced patients\' remembered pain and their reluctance to return.',
    source_citation: 'Donald A. Redelmeier and Daniel Kahneman, "Patients\' memories of painful medical treatments: real-time and retrospective evaluations of two minimally invasive procedures", Pain 66:1 (1996), 3–8; Redelmeier, Katz and Kahneman, "Memories of colonoscopy: a randomized trial", Pain 104 (2003), 187–194',
    source_url: null,
  },
];

export const edges = [
  // Hobbes
  { from: 'hobbes_state_of_nature', to: 'xunzi_human_nature_is_bad', relation: 'converged', year: 1651, note: 'Xunzi (3rd c. BCE) and Hobbes both hold that people need ritual, law and institutions to live together because their untaught nature does not supply order; no contact between them.' },
  { from: 'aristotle_friendship', to: 'hobbes_state_of_nature', relation: 'refuted', year: 1651, note: 'Leviathan ch. XV rejects Aristotle\'s Politics I, which makes some men by nature fit to command and others to serve, "as if Master and Servant were not introduced by consent of men, but by difference of Wit"; for Hobbes all are naturally equal.' },
  { from: 'hobbes_state_of_nature', to: 'spinoza_freedom_understanding_necessity', relation: 'extended', year: 1670, note: 'Spinoza\'s Tractatus Theologico-Politicus (1670), ch. XVI, takes up Hobbes\'s natural right and social contract; in a 1674 letter to Jarig Jelles he says the difference is that he keeps natural right whole even under the state.' },
  { from: 'hobbes_state_of_nature', to: 'practice_invest_in_people', relation: 'lands_on', note: 'Hobbes\'s way out of the war of all against all is a promise people make to each other and keep; peace is built from trust, one covenant at a time.' },
  // Hegel
  { from: 'hegel_master_and_slave', to: 'douglass_learning_to_read', relation: 'converged', year: 1845, note: 'Douglass\'s fight with the overseer Covey (Narrative ch. X), after which he says he was a slave in form but no longer in fact, reads like Hegel\'s struggle for recognition; there is no evidence Douglass had read Hegel.' },
  { from: 'hegel_master_and_slave', to: 'kierkegaard_fear_and_trembling', relation: 'refuted', year: 1843, note: 'Fear and Trembling\'s preface mocks the Hegelians of Copenhagen: "To proceed further than Hegel is a wonderful feat, but to proceed further than Abraham, why, nothing is easier!" (trans. Hollander, 1923).' },
  { from: 'hegel_master_and_slave', to: 'sartre_existence_precedes_essence', relation: 'extended', year: 1943, note: 'Being and Nothingness (1943) builds its account of "the look" and of being-for-others on Hegel\'s master–slave dialectic, which Sartre read through Kojève\'s 1930s Paris lectures.' },
  { from: 'hegel_master_and_slave', to: 'du_bois_double_consciousness', relation: 'converged', year: 1903, note: 'Du Bois studied in Berlin in 1892–94 and his "double consciousness" has been read against Hegel\'s divided self-consciousness, but the Souls does not cite Hegel, so this is a resemblance, not a documented debt.' },
  { from: 'hegel_master_and_slave', to: 'practice_work_that_outlasts_you', relation: 'lands_on', note: 'For Hegel it is the bondsman\'s work, not the master\'s enjoyment, that gives a lasting form to the world and so a self to the worker.' },
  // Goethe
  { from: 'goethe_faust_striving', to: 'schopenhauer_will_source_of_suffering', relation: 'extended', year: 1818, note: 'Schopenhauer knew Goethe in Weimar and worked with him on colour theory; The World as Will and Idea cites "Goethe\'s discovery of the origin of physical colours" and defends his colour doctrine against Newton.' },
  { from: 'goethe_faust_striving', to: 'nietzsche_amor_fati', relation: 'extended', year: 1888, note: 'Twilight of the Idols, "Skirmishes" §49, calls Goethe "a European event" and says "That to which he aspired was totality"; "he created himself" (trans. Ludovici), a model for Nietzsche\'s yes-saying.' },
  { from: 'goethe_faust_striving', to: 'practice_work_that_outlasts_you', relation: 'lands_on', note: 'Faust is saved, in Part II, while at work on a project for others; Goethe\'s striver is redeemed by what he builds, not by what he enjoys.' },
  // Du Bois
  { from: 'douglass_learning_to_read', to: 'du_bois_double_consciousness', relation: 'extended', year: 1903, note: 'The Souls of Black Folk ch. III, "Of Mr. Booker T. Washington and Others", names Douglass as the leader who "still bravely stood for the ideals of his early manhood,—ultimate assimilation through self-assertion".' },
  { from: 'du_bois_double_consciousness', to: 'practice_examine_daily', relation: 'lands_on', note: 'Du Bois\'s point is that some people are forced to watch themselves through hostile eyes all day; the evening review is a chance to look with your own.' },
  // King
  { from: 'gandhi_satyagraha', to: 'king_letter_from_birmingham_jail', relation: 'extended', year: 1963, note: 'King adopted Gandhi\'s method of nonviolent direct action after reading him in 1950 and visiting India in 1959; the Letter\'s four steps of a nonviolent campaign are satyagraha in practice.' },
  { from: 'aquinas_unjust_law_is_no_law', to: 'king_letter_from_birmingham_jail', relation: 'extended', year: 1963, note: 'The Letter cites Aquinas directly: an unjust law is a human law not rooted in eternal and natural law, and so, with Augustine, "no law at all".' },
  { from: 'socrates_unexamined_life', to: 'king_letter_from_birmingham_jail', relation: 'extended', year: 1963, note: 'The Letter invokes Socrates twice: as one who created the tension in the mind needed for growth, and as a practitioner of civil disobedience to whom academic freedom is owed.' },
  { from: 'thoreau_live_deliberately', to: 'king_letter_from_birmingham_jail', relation: 'extended', year: 1963, note: 'King credited Thoreau\'s "Civil Disobedience" in Stride Toward Freedom (1958) as his first contact with nonviolent resistance; the Letter itself does not name Thoreau.' },
  { from: 'king_letter_from_birmingham_jail', to: 'practice_invest_in_people', relation: 'lands_on', note: 'King\'s single garment of destiny: whatever affects one directly affects all indirectly.' },
  // Arendt
  { from: 'socrates_unexamined_life', to: 'arendt_banality_of_evil', relation: 'extended', year: 1971, note: 'In "Thinking and Moral Considerations" (1971) Arendt takes Socrates as her model of the thinker whose inner dialogue, the "two-in-one", is what keeps a person from doing evil.' },
  { from: 'augustine_restless_heart', to: 'arendt_banality_of_evil', relation: 'extended', year: 1929, note: 'Arendt\'s doctoral thesis, Der Liebesbegriff bei Augustin (Heidelberg, 1929), was on Augustine\'s concept of love; Augustine stayed a reference point through The Human Condition.' },
  { from: 'arendt_banality_of_evil', to: 'milgram_obedience', relation: 'measured', year: 1963, note: 'Milgram began his experiments in 1961, the year of the Eichmann trial, and in Obedience to Authority (1974) says his findings bear out Arendt\'s banality of evil more than he had expected.' },
  { from: 'arendt_banality_of_evil', to: 'practice_examine_daily', relation: 'lands_on', note: 'Arendt\'s remedy for thoughtlessness is the daily inner conversation with yourself that Socrates practised.' },
  // Milgram
  { from: 'milgram_obedience', to: 'practice_control_your_response', relation: 'lands_on', note: 'The participants who stopped did so by deciding that the experimenter\'s order was not a reason; the order was the event, their judgment of it was theirs.' },
  // Kahneman
  { from: 'epicurus_absence_of_pain', to: 'kahneman_peak_end', relation: 'measured', year: 1996, note: 'Kahneman revived Bentham\'s "experienced utility", the hedonic calculus that runs from Epicurus through Bentham, and found that remembered pain does not sum moments at all: it keeps the peak and the end.' },
  { from: 'kahneman_peak_end', to: 'practice_examine_daily', relation: 'lands_on', note: 'The remembering self rewrites the day around its worst moment and its last; an honest evening review is a chance to check the record before it sets.' },
];
