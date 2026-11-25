// China's great argument over how to make people good: Confucius's virtue and ritual against the Legalists' law and
// punishment (Shang Yang, Han Fei, Li Si), with Zhu Xi's Neo-Confucian revival and Aristotle as the Western parallel.
// Walk-only. Verbatim faces are public-domain (Legge 1861/1893; Ross 1908) and checked by scripts/verify-quotes.js;
// works with no public-domain English are labelled "Summary" and told from the Chinese.
export const nodes = [
  {
    id: 'confucius_rule_by_virtue',
    type: 'quote',
    field: 'philosophy',
    thinker: 'Confucius',
    year: -500,
    title: 'Lead them by virtue, not by punishment',
    prompt: 'Think of a rule you keep because you would be ashamed to break it, and one you keep only to avoid the fine. Which one do you keep when no one is checking?',
    plain_face:
      'Think of two teams. One plays fair because the referee hands out fines; the other plays fair because the coach they admire has made fairness part of who they are. The first team looks for what it can get away with; the second does not need a referee. Confucius, a teacher in the state of Lu who never held real power, said a country works the same way. Govern people by laws and punishments and they will dodge the punishment without any sense of shame. Lead them by your own example and by ritual (li, the shared forms of courtesy and respect), and they will feel shame, and become good. Government, for him, starts with the character of whoever is in charge.',
    source_face:
      'The Master said, "If the people be led by laws, and uniformity sought to be given them by punishments, they will try to avoid the punishment, but have no sense of shame.\n\n"If they be led by virtue, and uniformity sought to be given them by the rules of propriety, they will have the sense of shame, and moreover will become good."',
    source_citation: 'Confucian Analects II.3, in The Chinese Classics, Vol. I (trans. James Legge, 1861; rev. ed. 1893)',
    source_url: 'https://en.wikisource.org/wiki/The_Chinese_Classics/Volume_1/Confucian_Analects/II',
  },
  {
    id: 'shang_yang_moving_the_log',
    type: 'concept',
    field: 'philosophy',
    thinker: 'Shang Yang',
    year: -359,
    title: 'Moving the log: making the law believed',
    prompt: 'Which rules around you are real, and which are only written down? How can you tell?',
    plain_face:
      'A speed camera that never issues tickets soon slows no one. Shang Yang, chief minister of the state of Qin, knew a law is only as strong as the belief that it will be enforced. Before announcing his laws, he had a log set up at the south gate of the capital and promised ten pieces of gold to anyone who carried it to the north gate. No one believed him, so he raised it to fifty. When one man finally carried it, Shang Yang paid him on the spot. Then he published the laws: rewards for farming and courage in war, harsh punishments, one law for noble and commoner. Qin became the strongest state in China; Shang Yang, when his patron died, was hunted down under his own laws.',
    source_face:
      'Summary (no public-domain English text reachable; the Book of Lord Shang in J. J. L. Duyvendak\'s 1928 translation and Sima Qian\'s biography in the Records of the Grand Historian are known in English only in translations still in copyright): Sima Qian (Shiji ch. 68) tells that when Shang Yang\'s laws were ready, he feared the people would not believe them. He set up a pole thirty feet long at the south gate of the market and offered ten gold to whoever moved it to the north gate; when no one did, he raised the reward to fifty, paid the man who moved it, and so showed that he did not deceive; then he issued the laws. The Book of Lord Shang argues that a state grows strong through agriculture and war, that people seek profit and fear punishment, that punishments should be heavy so that crimes are rare, that rewards should be sure, and that law (fa) applies to all ranks alike. Shiji ch. 68 also records that after Duke Xiao died, Shang Yang fled, was refused lodging at an inn because his own law punished innkeepers who took in guests without papers, and was killed.',
    source_citation: 'Sima Qian, Records of the Grand Historian (Shiji), ch. 68, "Biography of Lord Shang"; The Book of Lord Shang (Shangjunshu), trans. J. J. L. Duyvendak (London: Probsthain, 1928) and Yuri Pines (Columbia, 2017). Summary from the Chinese text, not quotation.',
    source_url: null,
  },
  {
    id: 'li_si_burning_the_books',
    type: 'concept',
    field: 'philosophy',
    thinker: 'Li Si',
    year: -213,
    title: 'The burning of the books',
    prompt: 'Is there an idea you would rather not hear argued, because it unsettles what you have built? What would it cost you to hear it out?',
    plain_face:
      'Picture a company that shreds every old memo and lets staff read only the official handbook. Meetings get quieter; nobody can show the handbook is wrong. Li Si studied with the Confucian Xunzi alongside Han Fei, then rose to be chief minister of Qin, the state that conquered all of China in 221 BCE. When scholars praised the old ways to criticize the new empire, Li Si proposed burning the other states\' histories and the classics, sparing books on medicine, divination and farming, and having students learn the law from officials. The emperor agreed. The dynasty fell within fifteen years, and for two thousand years Chinese scholars remembered Qin as the warning against ruling by force alone.',
    source_face:
      'Summary (no public-domain English text reachable; Sima Qian\'s Records of the Grand Historian is known in English in translations still in copyright): In 213 BCE, according to Sima Qian (Shiji ch. 6, "Basic Annals of the First Emperor", and ch. 87, "Biography of Li Si"), the chancellor Li Si told the First Emperor that scholars "do not take the present as their teacher but study the past in order to criticize the present", confusing the people. He proposed that all records of the states other than Qin be burned; that, except in the official academy, anyone holding the Songs, the Documents or the writings of the hundred schools hand them in to be burned; that those who discussed the Songs and Documents be executed and those who used the past to criticize the present be killed with their families; that books on medicine, divination and agriculture be spared; and that anyone who wished to study take officials as teachers. The emperor approved. Ch. 87 records that Li Si had studied with Xunzi, and that after the First Emperor\'s death he was put to death by the eunuch Zhao Gao in 208 BCE.',
    source_citation: 'Sima Qian, Records of the Grand Historian (Shiji), ch. 6 and ch. 87; English in Burton Watson, Records of the Grand Historian: Qin Dynasty (Columbia, 1993). Summary from the Chinese text, not quotation.',
    source_url: null,
  },
  {
    id: 'virtue_or_law',
    type: 'dilemma',
    field: 'philosophy',
    thinker: 'Confucius and Han Fei',
    year: -233,
    title: 'Virtue or law: how do you make people good?',
    prompt: 'You run a team, a classroom or a household. Do you rely on people\'s character, or on clear rules with consequences? Where has each worked for you, and where has it failed?',
    plain_face:
      'Parents know this argument. One says: model kindness and the kids will grow good. The other: kids need clear rules that stick. Ancient China argued it for three centuries. Confucius held that a ruler leads by example and ritual, and people who feel shame need few laws. Han Fei answered that sages are rare, and a state that waits for virtue waits forever. A mother\'s love, he wrote, does not reform a bad son; the magistrate\'s soldiers do. The empire that united China in 221 BCE ran on Han Fei\'s answer and fell within fifteen years; the Han dynasty that followed made Confucius official and kept the laws. Most governments since have done the same.',
    source_face:
      'Summary (no public-domain English text of the Han Feizi reachable; the Liao and Watson translations are in copyright): In "The Five Vermin" (Han Feizi ch. 49), Han Fei argues that the Confucians, who praise the ancient sage kings and ask rulers to govern by benevolence and righteousness, are a vermin of the state: times have changed, people have multiplied, and what suited the ancients will not serve now. He gives the case of a son of bad character whom neither his parents\' love, nor the village elders\' wisdom, nor his teachers\' instruction can change, but who becomes afraid and mends his ways when the district officer arrives with soldiers to enforce the law; hence love does not make people obey, but authority does. In "Eminence in Learning" (ch. 50) he says the ruler cannot count on people doing good of their own accord, only on preventing them from doing wrong. Against this stands the Analects II.3: led by laws and punishments, people avoid the punishment but have no sense of shame; led by virtue and ritual, they have a sense of shame and become good.',
    source_citation: 'Han Feizi, ch. 49 "The Five Vermin" (五蠹) and ch. 50 "Eminence in Learning" (顯學); English in W. K. Liao, The Complete Works of Han Fei Tzu (1939, 1959) and Burton Watson, Han Feizi: Basic Writings (1964); with Confucian Analects II.3 (Legge). Summary from the Chinese text, not quotation.',
    source_url: null,
  },
  {
    id: 'zhu_xi_investigation_of_things',
    type: 'quote',
    field: 'philosophy',
    thinker: 'Zhu Xi',
    year: 1190,
    title: 'Investigate things, and the mind is made clear',
    prompt: 'What have you studied closely enough that it changed how you act, not just what you know?',
    plain_face:
      'A carpenter who truly learns one wood, its grain and how it splits, starts to understand every wood. Zhu Xi, a Song-dynasty scholar, revived Confucianism after centuries in which Buddhism and Daoism had drawn China\'s best minds. He chose four short books (the Analects, the Mencius, the Great Learning and the Doctrine of the Mean) and wrote the commentary every civil-service candidate memorised from 1313 to 1905. His starting point was a line in the Great Learning: to set the world in order, begin by "investigating things". Everything has its pattern (li); study the patterns of things and conduct a little each day, and one day the whole fits together and your own character is set right.',
    source_face:
      'Wishing to be sincere in their thoughts, they first extended to the utmost their knowledge. Such extension of knowledge lay in the investigation of things.\n\nThings being investigated, knowledge became complete.',
    source_citation: 'The Great Learning, text of Confucius, 4–5, in The Chinese Classics, Vol. I (trans. James Legge, 1861; rev. ed. 1893); the passage Zhu Xi made the root of his teaching in his Commentary on the Great Learning (Daxue zhangju, 1189)',
    source_url: 'https://en.wikisource.org/wiki/The_Great_Learning',
  },
  {
    id: 'aristotle_virtue_is_habit',
    type: 'quote',
    field: 'philosophy',
    thinker: 'Aristotle',
    year: -340,
    title: 'We become just by doing just acts',
    prompt: 'What are you practising every day without meaning to? Who is it making you into?',
    plain_face:
      'Nobody becomes a pianist by reading about the piano; they become one by playing, badly and then better. Aristotle, the Greek philosopher who taught Alexander the Great, said character works the same way. We are not born generous or brave; we have the capacity, and we become generous by doing generous things and brave by facing fears, until it comes naturally. That is why he thought laws and upbringing matter so much: good lawmakers shape good habits in citizens. Two centuries earlier and four thousand miles away, Confucius had said much the same: goodness is made by practice and example, not by rules alone.',
    source_face:
      'men become builders by building and lyre-players by playing the lyre; so too we become just by doing just acts,\n\ntemperate by doing temperate acts, brave by doing brave acts. This is confirmed by what happens in states; for legislators make the citizens good by forming habits in them, and this is the wish of every legislator',
    source_citation: 'Aristotle, Nicomachean Ethics II.1, 1103a–b (trans. W. D. Ross, 1908)',
    source_url: 'https://en.wikisource.org/wiki/Nicomachean_Ethics_(Ross)/Book_Two',
  },
];

export const edges = [
  // Confucius and his heirs
  { from: 'confucius_rule_by_virtue', to: 'zengzi_three_daily_examinations', relation: 'taught', year: -480, note: 'Zengzi was one of Confucius\'s youngest disciples; his three daily questions are in the Analects (I.4), the book of Confucius\'s sayings his school compiled.' },
  { from: 'confucius_rule_by_virtue', to: 'mencius_child_at_the_well', relation: 'extended', year: -300, note: 'Mencius called Confucius the greatest of the sages and grounded his "government by benevolence" in the claim that people are born with sprouts of goodness, which rule by virtue only has to grow.' },
  { from: 'confucius_rule_by_virtue', to: 'xunzi_human_nature_is_bad', relation: 'extended', year: -250, note: 'Xunzi kept Confucius\'s ritual and teachers but argued they work by reshaping a nature that is not good, as steam straightens a warped board.' },
  { from: 'confucius_rule_by_virtue', to: 'mozi_impartial_care', relation: 'refuted', year: -430, note: 'Mozi trained in the Confucian school and turned on it: the "Against the Confucians" chapters attack its graded love, costly rituals and long mourning as harmful to the people.' },
  { from: 'confucius_rule_by_virtue', to: 'zhuangzi_butterfly_dream', relation: 'refuted', year: -300, note: 'The Zhuangzi makes Confucius a character, often lectured by Daoist sages and sometimes converted, to mock the Confucian faith in rules of propriety and fixed distinctions.' },
  { from: 'laozi_sufficiency_of_contentment', to: 'confucius_rule_by_virtue', relation: 'converged', note: 'Both prefer a ruler who governs by example and little force; the Daodejing goes further and distrusts the Confucian virtues themselves ("when the great Way is lost, there is benevolence and righteousness", ch. 18).' },
  { from: 'confucius_rule_by_virtue', to: 'aristotle_virtue_is_habit', relation: 'converged', note: 'Both teach that goodness is made by practice and example, and that the lawmaker\'s real task is forming character; there was no contact between them.' },
  { from: 'confucius_rule_by_virtue', to: 'practice_invest_in_people', relation: 'lands_on' },
  { from: 'confucius_rule_by_virtue', to: 'practice_examine_daily', relation: 'lands_on' },

  // The Legalists
  { from: 'shang_yang_moving_the_log', to: 'han_feizi_two_handles', relation: 'extended', year: -240, note: 'Han Fei names Shang Yang\'s fa (law) as one of the three tools a ruler needs, beside Shen Buhai\'s methods and Shen Dao\'s position, and builds on his rewards and punishments.' },
  { from: 'mozi_impartial_care', to: 'shang_yang_moving_the_log', relation: 'converged', note: 'Both want public, objective standards (fa) in place of the Confucians\' inherited rites, and both judge a policy by whether it makes the state rich and orderly; Mozi aims at the good of all, Shang Yang at the ruler\'s power.' },
  { from: 'shang_yang_moving_the_log', to: 'machiavelli_fortune_and_virtu', relation: 'converged', note: 'Both counsel rulers by what works rather than what is admired, and both say a ruler must be feared and his promises seen to be kept; no contact, nineteen centuries apart.' },
  { from: 'shang_yang_moving_the_log', to: 'practice_control_your_response', relation: 'lands_on' },
  { from: 'laozi_sufficiency_of_contentment', to: 'han_feizi_two_handles', relation: 'extended', year: -240, note: 'Han Feizi chs. 20 and 21, "Explaining Laozi" and "Illustrating Laozi", are the oldest surviving commentaries on the Daodejing; Han Fei turns its still, empty sage into a ruler who hides his intentions and lets the law work.' },
  { from: 'han_feizi_two_handles', to: 'practice_control_your_response', relation: 'lands_on' },
  { from: 'xunzi_human_nature_is_bad', to: 'li_si_burning_the_books', relation: 'taught', year: -250, note: 'Sima Qian (Shiji ch. 87) says Li Si studied "the methods of emperors and kings" under Xunzi before going to Qin.' },
  { from: 'han_feizi_two_handles', to: 'li_si_burning_the_books', relation: 'extended', year: -213, note: 'Li Si quoted Han Fei to the First Emperor and put his program into effect; he also, by Sima Qian\'s account, had his fellow student Han Fei imprisoned in Qin, where Han Fei died in 233 BCE.' },
  { from: 'li_si_burning_the_books', to: 'practice_hold_beliefs_loosely', relation: 'lands_on' },

  // The debate
  { from: 'confucius_rule_by_virtue', to: 'virtue_or_law', relation: 'taught', note: 'Analects II.3 is the Confucian side of the debate in a sentence: punishment brings compliance without shame; virtue and ritual bring shame, and goodness.' },
  { from: 'han_feizi_two_handles', to: 'virtue_or_law', relation: 'refuted', year: -233, note: 'The Legalist side: "The Five Vermin" calls the Confucians a pest on the state and argues that only law and authority, not love or teaching, reliably make people behave.' },
  { from: 'hobbes_state_of_nature', to: 'virtue_or_law', relation: 'converged', note: 'Hobbes, like Han Fei, reasons that "covenants, without the sword, are but words": without a power that punishes, people will not keep faith.' },
  { from: 'virtue_or_law', to: 'practice_invest_in_people', relation: 'lands_on' },
  { from: 'virtue_or_law', to: 'practice_hold_beliefs_loosely', relation: 'lands_on' },

  // Zhu Xi and the Neo-Confucian revival
  { from: 'mencius_child_at_the_well', to: 'zhu_xi_investigation_of_things', relation: 'extended', year: 1190, note: 'Zhu Xi put the Mencius among the Four Books and read Mencius\'s good human nature as the pattern (li) of Heaven in each person, clouded by the material force (qi) we are born with.' },
  { from: 'zengzi_three_daily_examinations', to: 'zhu_xi_investigation_of_things', relation: 'extended', year: 1189, note: 'Zhu Xi credited the Great Learning\'s commentary to Zengzi and made it the first of the Four Books, the gateway to Confucian study.' },
  { from: 'zhu_xi_investigation_of_things', to: 'wang_yangming_unity_of_knowing_and_acting', relation: 'refuted', year: 1509, note: 'Wang tried Zhu Xi\'s method by sitting for seven days investigating the bamboo in his courtyard, fell ill, and concluded the pattern is found in one\'s own mind, not out in things; his unity of knowing and acting is aimed at Zhu Xi.' },
  { from: 'zhu_xi_investigation_of_things', to: 'practice_examine_daily', relation: 'lands_on' },
  { from: 'zhu_xi_investigation_of_things', to: 'practice_work_that_outlasts_you', relation: 'lands_on' },

  // Aristotle's virtue ethics
  { from: 'aristotle_virtue_is_habit', to: 'aristotle_friendship', relation: 'extended', note: 'Same book: the Nicomachean Ethics turns from virtue as habit (Book II) to friendship (Books VIII–IX), the best kind being friendship between people of good character.' },
  { from: 'xunzi_human_nature_is_bad', to: 'aristotle_virtue_is_habit', relation: 'converged', note: 'Both hold that we are not born good but made good by training and practice, and that laws and teachers do the shaping; no contact.' },
  { from: 'aristotle_virtue_is_habit', to: 'william_james_habit', relation: 'extended', year: 1890, note: 'James\'s chapter "Habit" in The Principles of Psychology gives the physiology of what Aristotle said: character is a bundle of habits laid down by repeated acts.' },
  { from: 'aristotle_virtue_is_habit', to: 'practice_examine_daily', relation: 'lands_on' },
  { from: 'aristotle_virtue_is_habit', to: 'practice_control_your_response', relation: 'lands_on' },
];
