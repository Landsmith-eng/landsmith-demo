// Law and the state, now. One recent decision, Mahmoud v. Taylor (2025), quoted from the Court's slip opinion like
// Barnette in law.js, and four cases of October Term 2026 that are set for argument but undecided. A pending case has
// `as_of` and no opinions: its source face is the Question Presented, quoted verbatim, and its plain face gives both
// sides in our words. Everything here comes from supremecourt.gov (slip opinion, dockets, Questions Presented and the
// parties' briefs); see SOURCES.md, batch 10. When a pending case is decided, drop `as_of` and add its opinions.
export const nodes = [
  {
    id: 'mahmoud_storybook_opt_outs',
    type: 'case',
    field: 'law',
    title: 'Mahmoud v. Taylor: may parents take their children out of the lesson?',
    thinker: 'US Supreme Court',
    year: 2025,
    plain_face:
      'In 2022 the school board of Montgomery County, Maryland, added LGBTQ-inclusive storybooks to its elementary '
      + 'reading lessons. At first parents could have their children excused. Less than a year later the board ended '
      + 'the opt outs and said it would not tell parents when the books were used. Parents of diverse faiths, whose '
      + 'religious views on marriage, sex and gender the books contradict, sued. In June 2025 the Supreme Court ruled '
      + 'for them, 6 to 3: instruction that seriously threatens the faith parents are passing on burdens their '
      + 'religious freedom, and free public schooling cannot be made conditional on accepting it. Until the case '
      + 'ends, the board must give notice and allow opt outs.',
    source_face:
      'Today, we hold that the parents have shown that they are entitled to a preliminary injunction. A government '
      + 'burdens the religious exercise of parents when it requires them to submit their children to instruction that '
      + 'poses “a very real threat of undermining” the religious beliefs and practices that the parents wish to instill. '
      + '… And a government cannot condition the benefit of free public education on parents’ acceptance of such '
      + 'instruction.',
    source_citation:
      'Mahmoud v. Taylor, No. 24-297, 606 U.S. 522 (2025), argued April 22, 2025, decided June 27, 2025; opinion of the '
      + 'Court by Justice Alito. Quoted from the Court\'s slip opinion. A work of the US government, in the '
      + 'public domain.',
    source_url: 'https://www.supremecourt.gov/opinions/24pdf/24-297_4f14.pdf',
    prompt:
      'The board says a public school must be free to show every child the whole society they live in; the parents say '
      + 'the state may not use the classroom to undo the faith they are raising their children in. Which opinion '
      + 'persuades you, and where would you draw the line between exposing a child to an idea and pressing it on them?',
    opinions: [
      {
        role: 'majority',
        author: 'Justice Alito, for six justices (with Chief Justice Roberts and Justices Thomas, Gorsuch, Kavanaugh and Barrett)',
        gist:
          'Teaching children their faith is, for many families, a religious duty, and the right to direct a child\'s '
          + 'religious upbringing would be an empty promise if it stopped at the schoolhouse door. Barnette protected '
          + 'children from being made to profess a belief; Wisconsin v. Yoder (1972) protected Amish families from subtler '
          + 'pressure to conform. These books are not neutral exposure: they celebrate one view of marriage and gender and '
          + 'suggest the parents\' view is hurtful. Telling parents they can go private or teach at home is no answer, '
          + 'and the board, which allows opt outs for other reasons, has not shown it needs this policy.',
        quote:
          'We reject this chilling vision of the power of the state to strip away the critical right of parents to guide '
          + 'the religious development of their children. Yoder and Barnette embody a very different view of religious '
          + 'liberty, one that comports with the fundamental values of the American people.',
        echoes: 'barnette_flag_salute',
        echo_note: 'Cited: the Court calls Barnette "an early example" of limits on how far a public school may interfere with a child\'s religious upbringing, and reads it together with Yoder.',
      },
      {
        role: 'concurrence',
        author: 'Justice Thomas',
        gist:
          'Thomas joins the Court in full and adds that the policy rests on the kind of conformity the Court rejected in '
          + 'Pierce v. Society of Sisters (1925), which denied the state any general power to "standardize its children". '
          + 'He points to a board member who likened objecting parents to "white supremacists" and "xenophobes", and warns that a school cannot escape the '
          + 'First Amendment by weaving contested material through every lesson so that opting out becomes impossible.',
        quote:
          'The curriculum itself also betrays an attempt to impose ideological conformity with specific views on sexuality '
          + 'and gender. … The Board’s exclusion of traditional religious views, coupled with a curriculum that '
          + '“pressure[s students] to conform,” … constitute an impermissible attempt to “standardize” the views of students',
        echoes: 'burke_little_platoon',
        echo_note: 'Ours, not cited: Burke held that love of country grows out of the small loyalties, the family first; Thomas resists a state that would standardize what children are taught to love and believe.',
      },
      {
        role: 'dissent',
        author: 'Justice Sotomayor, joined by Justices Kagan and Jackson',
        gist:
          'Barnette drew the line between forcing a student to declare a belief and merely exposing a student to ideas, '
          + 'and storybooks that show LGBTQ people exist and celebrate their weddings fall on the exposure side. The new '
          + 'rule has no limit: almost any lesson can offend someone\'s faith, so schools face impossible opt-out burdens, '
          + 'and those that cannot afford lawsuits may censor their books instead. A subset of parents gets a veto '
          + 'over what elected boards decide to teach.',
        quote:
          'Today’s ruling threatens the very essence of public education. The Court, in effect, constitutionalizes a '
          + 'parental veto power over curricular choices long left to the democratic process and local administrators. '
          + 'That decision guts our free exercise precedent and strikes at the core premise of public schools: that children '
          + 'may come together to learn not the teachings of a particular faith, but a range of concepts and views that '
          + 'reflect our entire society.',
        echoes: 'socrates_unexamined_life',
        echo_note: 'Ours, not cited: Athens tried Socrates on a charge of corrupting the young; Sotomayor defends a school whose task is to put new questions to children, even ones their families would rather they did not hear.',
      },
    ],
  },
  {
    id: 'st_mary_catholic_preschool',
    type: 'case',
    field: 'law',
    title: 'St. Mary Catholic Parish v. Roy: may a state fund only preschools that admit every family?',
    thinker: 'US Supreme Court',
    year: 2026,
    as_of: '2026-10-29',
    plain_face:
      'Colorado pays for a year of preschool for every child before kindergarten, public or private, religious ones '
      + 'included. Each school must give all families an equal chance to enroll regardless of, among other things, religion, '
      + 'sexual orientation and gender identity. Catholic preschools that admit only families who support Catholic '
      + 'teaching, including on sex and gender, cannot join unless they drop that policy; parishes and parents sued. '
      + 'They say Colorado lets other preschools serve chosen communities, so it must meet the strictest test. '
      + 'Colorado says one rule binds all: no child turned away for who they or their parents are. Lower courts '
      + 'agreed. Set for argument on 3 November 2026; undecided.',
    source_face:
      '1. Whether proving a lack of general applicability under Employment Division v. Smith requires showing unfettered '
      + 'discretion or categorical exemptions for identical secular conduct.\n'
      + '2. Whether Carson v. Makin displaces the rule of Employment Division v. Smith only when the government '
      + 'explicitly excludes religious people and institutions.',
    source_citation:
      'St. Mary Catholic Parish, Littleton, Colorado, et al. v. Roy, No. 25-581, Questions Presented (certiorari granted '
      + 'April 20, 2026, limited to Questions 1 and 2), on review from the Tenth Circuit, 154 F.4th 752 (2025). Set for '
      + 'argument on Tuesday, November 3, 2026. Undecided as of October 29, 2026. A US government document, in the public '
      + 'domain.',
    source_url: 'https://www.supremecourt.gov/docket/docketfiles/html/public/25-581.html',
    prompt:
      'Should a public program that pays for preschool be able to require every school it funds to admit every family, '
      + 'or should a faith community be able to take the money and still keep its school for families who share its '
      + 'teaching? What do you think, and why?',
  },
  {
    id: 'jouppi_airplane_forfeiture',
    type: 'case',
    field: 'law',
    title: 'Jouppi v. Alaska: should the punishment fit the crime, or the person?',
    thinker: 'US Supreme Court',
    year: 2026,
    as_of: '2026-10-29',
    plain_face:
      'Some remote Alaska villages have voted to ban alcohol, and state law makes a pilot convicted of knowingly flying '
      + 'it into one forfeit the plane. Kenneth Jouppi, a bush pilot, was convicted of carrying beer into the village of '
      + 'Beaver, and the Alaska courts upheld the forfeiture of his 1969 Cessna. The Constitution forbids fines grossly out of proportion to the '
      + 'offense. Jouppi says courts must weigh what he himself did: a first offense, a misdemeanor, a passenger\'s '
      + 'six-pack he could see. Alaska says he loaded two cases and four six-packs, threatened just the harm the law targets, '
      + 'and that the legislature\'s judgment deserves deference. Set for argument on 1 December 2026; undecided.',
    source_face:
      'The question presented is whether, in determining whether a fine contravenes the Excessive Fines Clause, courts may '
      + 'consider the gravity of the underlying offense purely in the abstract or should consider the gravity of the '
      + 'specific defendant\'s wrongdoing.',
    source_citation:
      'Jouppi v. Alaska, No. 25-246, Question Presented (certiorari granted July 20, 2026), on review from the Supreme '
      + 'Court of Alaska, 566 P.3d 943. Set for argument on Tuesday, December 1, 2026. Undecided as of October 29, 2026. '
      + 'A US government document, in the public domain.',
    source_url: 'https://www.supremecourt.gov/docket/docketfiles/html/public/25-246.html',
    prompt:
      'Should a punishment be measured against the harm a kind of crime does to a community, or against what this one '
      + 'person actually did? What do you think, and why?',
  },
  {
    id: 'viramontes_grant_semiautomatic_rifles',
    type: 'case',
    field: 'law',
    title: 'Viramontes v. Cook County and Grant v. Higgins: may a government ban the AR-15?',
    thinker: 'US Supreme Court',
    year: 2026,
    as_of: '2026-10-29',
    plain_face:
      'Cook County, Illinois, and the State of Connecticut ban AR-15 style and similar semiautomatic rifles. Gun owners '
      + 'challenged both bans and lost in the federal appeals courts; the Supreme Court will hear the cases together. The '
      + 'owners say the Second Amendment protects arms in common use, that tens of millions of Americans choose these '
      + 'rifles for self-defense, hunting and target shooting, and that weighing their danger is for the people, not '
      + 'judges. Cook County answers that legislatures have long restricted weapons at odds with moderate, proportionate '
      + 'self-defense, and that these rifles are the weapon of choice for massacres. Set for argument on 2 December 2026; '
      + 'undecided.',
    source_face:
      'Whether the Second and Fourteenth Amendments guarantee the right to possess AR-15 platform and similar '
      + 'semiautomatic rifles.',
    source_citation:
      'Viramontes v. Cook County, Illinois, No. 25-238 (Seventh Circuit), consolidated with Grant v. Higgins, No. 25-566 '
      + '(Second Circuit, 153 F.4th 213), Question Presented in No. 25-238, on which both petitions were granted June 30, '
      + '2026. Set for argument on Wednesday, December 2, 2026 (one hour, consolidated). Undecided as of October 29, '
      + '2026. A US government document, in the public domain.',
    source_url: 'https://www.supremecourt.gov/docket/docketfiles/html/public/25-238.html',
    prompt:
      'When a weapon is both what many people choose to defend themselves and what a few have used to kill many, who '
      + 'should decide whether ordinary people may keep it: voters, legislatures or the Constitution? What do you think, '
      + 'and why?',
  },
  {
    id: 'rnc_proof_of_citizenship',
    type: 'case',
    field: 'law',
    title: 'RNC v. Mi Familia Vota: what may a state demand before you can vote?',
    thinker: 'US Supreme Court',
    year: 2026,
    as_of: '2026-10-29',
    plain_face:
      'Only citizens may vote in federal elections. Arizona makes people registering on its state form show '
      + 'documents proving citizenship, and cancels a registration when its checks find the person is not a citizen. '
      + 'A federal law limits what registration forms may demand and pauses systematic purges in the 90 days before a '
      + 'federal election. The Ninth Circuit held that law blocks both rules. The Republican National Committee, '
      + 'backed by the United States, says a state may verify the one qualification everyone accepts. Voting-rights '
      + 'groups and Democrats answer that Congress chose a sworn form, and the pause shields citizens wrongly '
      + 'flagged. Set for argument on 8 December 2026; undecided.',
    source_face:
      '(1) Does the National Voter Registration Act or a federal consent decree prohibit Arizona from requiring '
      + 'voter-registration applicants to produce "satisfactory evidence" of U.S. citizenship when registering with a '
      + 'state registration form?\n'
      + '(2) Does the National Voter Registration Act prohibit Arizona from implementing a program within 90 days of a '
      + 'federal election to cancel the registrations of voters who are not U.S. citizens?',
    source_citation:
      'Republican National Committee v. Mi Familia Vota, No. 25-1017, Questions Presented (certiorari granted June 29, '
      + '2026), on review from the Ninth Circuit, 129 F.4th 691. Set for argument on Tuesday, December 8, 2026. '
      + 'Undecided as of October 29, 2026. A US government document, in the public domain.',
    source_url: 'https://www.supremecourt.gov/docket/docketfiles/html/public/25-1017.html',
    prompt:
      'Is it fairer to make every new voter prove they belong, or to accept their sworn word and risk a few ineligible '
      + 'names on the rolls? What do you think, and why?',
  },
];

export const edges = [
  // Mahmoud v. Taylor (2025)
  { from: 'barnette_flag_salute', to: 'mahmoud_storybook_opt_outs', relation: 'echoes', year: 2025,
    note: 'Cited by both sides: the majority reads Barnette with Yoder as protecting a child\'s religious upbringing in a public school; the dissent reads it as drawing the line between compelling a declaration of belief and exposing students to ideas.' },
  { from: 'socrates_unexamined_life', to: 'mahmoud_storybook_opt_outs', relation: 'echoes', year: 2025,
    note: 'Ours, not cited: Athens charged Socrates with corrupting the young. Mahmoud asks the same question from the families\' side: when does teaching children to question become undoing what their parents taught them?' },
  { from: 'zera_yacob_hatata', to: 'mahmoud_storybook_opt_outs', relation: 'echoes', year: 2025,
    note: 'Ours, not cited: Zera Yacob saw that people hold their faith because they were raised in it, and tested his against reason. Mahmoud turns on who decides what a child is raised in, and when the child meets the rest.' },
  { from: 'burke_little_platoon', to: 'mahmoud_storybook_opt_outs', relation: 'echoes', year: 2025,
    note: 'Ours, not cited: Burke\'s "little platoon", the family and the near community, as the first school of public affection; the majority and Thomas defend the family\'s part in forming a child against the state\'s.' },
  // St. Mary Catholic Parish v. Roy (pending)
  { from: 'mahmoud_storybook_opt_outs', to: 'st_mary_catholic_preschool', relation: 'echoes', year: 2026,
    note: 'Cited by both sides: the parishes list Mahmoud among the cases where the Court did not let Smith decide a free-exercise claim; Colorado quotes Mahmoud\'s restatement of Smith, that a neutral, generally applicable policy may burden religion incidentally.' },
  { from: 'sophocles_antigone', to: 'st_mary_catholic_preschool', relation: 'echoes', year: 2026,
    note: 'Cited in the parishes\' brief: it opens its argument by noting that limits on religious freedom have long invoked "the specter of anarchy", citing Antigone 751-752 (Fagles) alongside Employment Division v. Smith.' },
  { from: 'mozi_impartial_care', to: 'st_mary_catholic_preschool', relation: 'echoes', year: 2026,
    note: 'Ours, not cited: Mozi asked us to care for every family as our own; Colorado asks each funded preschool to take every family. The parishes answer that a community may serve its own and still serve the public.' },
  // Jouppi v. Alaska (pending)
  { from: 'han_feizi_two_handles', to: 'jouppi_airplane_forfeiture', relation: 'echoes', year: 2026,
    note: 'Ours, not cited: Han Fei held that sure, uniform punishment governs better than judging each case. Alaska defends a mandatory forfeiture that deters every pilot alike; Jouppi asks the court to look at what he did.' },
  { from: 'kant_ends_not_means', to: 'jouppi_airplane_forfeiture', relation: 'echoes', year: 2026,
    note: 'Ours, not cited: if a penalty is sized to the harm a whole class of crimes does rather than to this person\'s act, is he punished for what he did, or used as a warning to others?' },
  // Viramontes v. Cook County / Grant v. Higgins (pending)
  { from: 'hobbes_state_of_nature', to: 'viramontes_grant_semiautomatic_rifles', relation: 'echoes', year: 2026,
    note: 'Ours, not cited: Hobbes argued we accept a common power so that no one has to live by their own strength alone. The case asks how much of that strength a person keeps: the county, that it may ban arms it judges too dangerous; the owners, that self-defense was never handed over.' },
  { from: 'dostoevsky_grand_inquisitor', to: 'viramontes_grant_semiautomatic_rifles', relation: 'echoes', year: 2026,
    note: 'Ours, not cited: the Inquisitor says people will give up freedom for security. Each side here says the other has the trade wrong.' },
  // RNC v. Mi Familia Vota (pending)
  { from: 'rousseau_born_free', to: 'rnc_proof_of_citizenship', relation: 'echoes', year: 2026,
    note: 'Ours, not cited: for Rousseau only the citizens, agreeing as equals, can make law legitimate. Who proves membership in that body, and how, is what this case is about.' },
  { from: 'tocqueville_individualism', to: 'rnc_proof_of_citizenship', relation: 'echoes', year: 2026,
    note: 'Ours, not cited: Tocqueville feared citizens drifting out of public life; the case weighs keeping the rolls accurate against making it harder for eligible citizens to take part.' },
];
