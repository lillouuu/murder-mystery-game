// data/suspects/edward.data.js

export const edwardData = {
  suspectInfo: {
    id: "edward_blackwell",
    fullName: "Edward Blackwell",
    age: 44,
    dateOfBirth: "September 17, 1980",
    occupation: "Family Lawyer, Co-founder of Harlow & Blackwell Investments",
    personality: "Composed, precise, measured. The kind of man who chooses every word carefully. Carries grief quietly.",
    backstory: "Victor's childhood best friend. Co-founded Harlow & Blackwell Investments with Victor. Has been the Harlow family lawyer for fifteen years. In college he fell deeply in love with Eleanor — everyone assumed they would end up together. Then Victor bribed Eleanor's family and took her. Edward never fully understood why until years later. He buried it and watched Eleanor suffer in a marriage she never chose for over a decade.",
    isGuilty: true,
    guiltType: "KILLER_A",
    motive: "Secretly in love with Eleanor, Victor was destroying their shared firm through embezzlement, Victor had stolen Eleanor from him by bribing her family",
    alibi: "Was in the library alone from 10 PM onward, reviewing documents, did not go near Victor's study",
    alibiIsTrue: false,
    hiddenSecret: "Entered Victor's study at midnight, found Victor incapacitated, stabbed him twice with the Harlow family letter opener. Burned his gloves and outer clothing in the library fireplace afterward."
  },
  roomInfo: {
    id: "library_room",
    type: "interrogation",
    name: "The Library",
    location: "West Wing, Ground Floor",
    atmosphere: "The library is all dark wood and leather. Floor to ceiling bookshelves, a dying fire in the hearth, two crystal glasses on the side table — one half full, one empty and dry. Edward Blackwell stands by the window watching the storm, his back to the door when you enter. He turns slowly. Composed. The kind of composed that takes effort to maintain. His jacket is perfectly pressed, his tie still straight at 1 AM. A man who has not let himself fall apart yet.",
    requiresTheory: true
  },
  phase1Clues: [
    {
      id: "clue_l",
      name: "The Two Glasses",
      x: 220, y: 180,
      description: "Two crystal whisky glasses on the side table. One half full, one empty and dry. Someone sat here with Edward earlier tonight and left.",
      category: "TIMELINE",
      phase: 1,
      playerHint: "Who was he drinking with? The empty glass has a faint lipstick mark on the rim."
    },
    {
      id: "clue_m",
      name: "The Briefcase",
      x: 340, y: 250,
      description: "Edward's leather briefcase sits open on the reading table. Inside — Harold's will documents, Harlow & Blackwell financial statements, and a personal letter from Victor dated three weeks ago dismissing Edward's concerns about the firm's accounts. Victor's tone is dismissive, almost mocking.",
      category: "MOTIVE",
      phase: 1,
      playerHint: "The financial statements show systematic fund withdrawals over 18 months. Someone was draining this firm from the inside."
    },
    {
      id: "clue_n",
      name: "The Broken Car",
      x: 500, y: 120,
      description: "Through the library window the detective can see Edward's car in the driveway. Hood still open from the afternoon. Rainwater pooling inside the engine bay.",
      category: "ALIBI",
      phase: 1,
      playerHint: "A car that conveniently fails on the night of a murder during a storm that traps everyone inside. Convenient."
    }
  ],
  phase2Clues: [
    {
      id: "clue_o",
      name: "The Fireplace Ashes",
      description: "A closer examination of the library fireplace reveals ash residue inconsistent with wood alone. Fragments of dark fabric and what appears to be melted rubber — the remains of burned gloves and outer clothing incinerated in the hearth sometime after midnight.",
      category: "PHYSICAL_EVIDENCE",
      phase: 2,
      playerHint: "Someone burned their clothes in this fireplace tonight. After midnight. In a room Edward claims he was alone in all evening."
    },
    {
      id: "clue_p",
      name: "The Empty Letter Opener Slot",
      description: "The Harlow family stationary set on Victor's desk has a specific fitted slot for the silver letter opener — the murder weapon. Edward was the last confirmed person in that study before midnight at 10 PM. He failed to mention this.",
      category: "WEAPON",
      phase: 2,
      playerHint: "He was in that study. He knew where the letter opener lived. And he never mentioned being there."
    },
    {
      id: "clue_q",
      name: "The College Photograph",
      description: "Inside Edward's briefcase, tucked behind the legal documents — a photograph. Three young people at a college formal. Victor, Edward, and Eleanor. Eleanor and Edward are looking at each other. Victor has his arm around Eleanor's shoulder, eyes on the camera. On the back in faded handwriting: 'The night everything changed. E.'",
      category: "MOTIVE",
      phase: 2,
      playerHint: "He has been carrying this photograph for over twenty years. The night everything changed. Victor took her that night."
    }
  ],
  dialogue: {
    phase1: [
      { id: "dlg_edward_1", question: "Where were you last night between 10 PM and 1 AM?", answer: "After my meeting with Victor ended around ten I came directly here to the library. I needed to think through some things. I poured myself a drink, sat by the fire, went over some documents. I was here alone until I heard Rose screaming from upstairs. I went up immediately like everyone else." },
      { id: "dlg_edward_2", question: "What was the nature of your meeting with Mr. Harlow?", answer: "Business. The firm has been facing some financial irregularities that needed urgent discussion. I had hoped to resolve them quietly tonight given we were all gathered here anyway. Victor was... unconcerned. He felt the situation was manageable and that I was overreacting. We disagreed and left it at that. We disagreed quite significantly." },
      { id: "dlg_edward_3", question: "How would you describe your relationship with Victor?", answer: "We were childhood friends. Business partners for sixteen years. I handled his family's legal affairs for fifteen of those. Victor was brilliant in many ways — charismatic, decisive, fearless with risk. He could also be extraordinarily selfish when it suited him. As his lawyer I learned to separate the personal from the professional a long time ago. Or I tried to." },
      { id: "dlg_edward_4", question: "Your car broke down this afternoon. Did you attempt to get it repaired?", answer: "I called a garage in town around four o'clock. They said nobody could get out in the storm. I had no choice but to stay. I won't pretend the timing wasn't inconvenient — I had planned to be back in the city tonight. But there was nothing to be done about it." },
      { id: "dlg_edward_5", question: "Did you see or hear anything unusual after your meeting with Victor ended?", answer: "Edmund was pacing the corridor around eleven — I heard his footsteps from in here. He seemed agitated, more so than at dinner. I considered checking on him but decided against it. The family needed space tonight, not a lawyer hovering in the hallway. I heard nothing from Victor's study after our meeting ended." },
      { id: "dlg_edward_6", question: "Who do you think is responsible for Victor's death?", answer: "Edmund had the most visible motive — anyone at that dinner table could see he was at a breaking point. The argument about the will, whatever else he was dealing with personally... a man can only absorb so much in one day. I'm not accusing anyone. I'm simply observing what was visible to everyone in that house last night. Victor was not an easy man to love. Or to work with. The list of people he hurt is longer than one night's conversation, Detective." }
    ],
    phase2SystemPrompt: "You are Edward Blackwell, 44, family lawyer and childhood friend of Victor Harlow. At midnight you entered Victor's study, found him incapacitated, and stabbed him twice with the Harlow family silver letter opener. You then burned your gloves and outer clothing in the library fireplace. You did not know Victor had already been poisoned. You believed you acted alone. You are secretly in love with Eleanor Harlow — Victor stole her from you years ago by bribing her family. You are now being questioned by a detective who has the forensic report. You are a lawyer. You know exactly what not to say. Your answers are precise, measured, and carefully constructed. You never confess. You never contradict yourself directly. But the right question will produce an answer that is just slightly too careful to be innocent. Respond in character, in first person, as Edward Blackwell."
  },
  theoryPrompt: "Before leaving this room, record your theory about Edward Blackwell. What do you think his role in this case is? Even a partial observation is enough to proceed.",
  theoryAcceptanceCriteria: "Theory is accepted if it contains at least one true observation about Edward — his business dispute with Victor, his feelings for Eleanor, his convenient car breakdown, his presence in the study, or any suspicion about his alibi."
};