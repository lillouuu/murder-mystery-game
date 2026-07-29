// data/suspects/eleanor.data.js

export const eleanorData = {
  suspectInfo: {
    id: "eleanor_harlow",
    fullName: "Eleanor Harlow",
    age: 41,
    dateOfBirth: "February 28, 1983",
    occupation: "Victor Harlow's wife",
    personality: "Elegant, composed, controlled. Never shows more than she intends to. Twelve years of surviving Victor taught her that.",
    backstory: "In college she was deeply in love with Edward Blackwell. Victor pursued her knowing this — a deliberate move to take something from his best friend. He paid off her father's considerable debts and applied enough pressure that she had no real choice. She has known since the first year that Victor targeted her deliberately. Has been quietly in love with Edward ever since. Neither has acted on it.",
    isGuilty: false,
    isAccomplice: true,
    motive: "Trapped in a loveless forced marriage, in love with Edward, stands to inherit everything as Victor's widow",
    alibi: "Was in the library with Edward until approximately 9 PM, then retired to her bedroom in the west wing",
    alibiIsTrue: false,
    hiddenSecret: "Was in the library with Edward until closer to 10 PM — an hour later than she admits. Said enough during that conversation to push Edward toward action without ever explicitly saying so. Wrote Victor a divorce letter that morning before the will reading — she was prepared to walk away with nothing, suggesting she already anticipated not needing to."
  },
  roomInfo: {
    id: "bedroom_room",
    type: "interrogation",
    name: "The Master Bedroom",
    location: "West Wing, First Floor",
    atmosphere: "The master bedroom is immaculate and cold. Eleanor sits at the vanity, still fully dressed at 1 AM, not a hair out of place. The bed behind her is untouched — she has not tried to sleep. Two things sit on the vanity: a glass of water she has not touched and a folded piece of paper. She watches you in the mirror as you enter rather than turning around. A woman completely in control of how she is perceived.",
    requiresTheory: true
  },
  phase1Clues: [
    {
      id: "clue_r",
      name: "The Folded Letter",
      x: 380, y: 220,
      description: "The document on the vanity. When the detective asks to see it Eleanor pauses — just a fraction of a second too long — then hands it over. A handwritten letter to Victor dated this morning requesting a formal divorce, citing irreconcilable differences. Unsigned. Never delivered.",
      category: "MOTIVE",
      phase: 1,
      playerHint: "She wrote this before the will reading — before she knew how financially trapped she was. She was prepared to walk away with nothing. Why?"
    },
    {
      id: "clue_s",
      name: "The Single Whisky Glass",
      x: 250, y: 190,
      description: "On the nightstand — a crystal glass identical to the ones in the library. Same whisky. Small amount still remaining.",
      category: "ALIBI",
      phase: 1,
      playerHint: "Same crystal set as the library glasses. Same whisky. She was in the library with Edward. The question is — until when exactly?"
    },
    {
      id: "clue_t",
      name: "The Dry Eyes",
      x: 400, y: 200,
      description: "A forensic observation. Eleanor has not cried. Her makeup is perfect. Her hands are completely steady. She identified her husband's body less than an hour ago.",
      category: "BEHAVIOR",
      phase: 1,
      playerHint: "This is not shock. Shock trembles, pales, stares blankly. This is a woman who has already processed this information."
    }
  ],
  phase2Clues: [
    {
      id: "clue_u",
      name: "The Library Timeframe Discrepancy",
      description: "Eleanor says she left the library at approximately 9 PM. Edward says he was alone from 10 PM onward. That is an unaccounted gap of one hour where both of their statements diverge — and both cannot be correct.",
      category: "ALIBI",
      phase: 2,
      playerHint: "One of them is lying about when Eleanor left the library. Or both are. What happened in that hour?"
    },
    {
      id: "clue_v",
      name: "The Perfume on the Empty Glass",
      description: "The empty glass in the library — the one with the lipstick mark — carries a faint but identifiable scent. Eleanor's perfume. She was in the library later than she admitted.",
      category: "ALIBI",
      phase: 2,
      playerHint: "She was there until at least 10 PM. The same time Edward's meeting with Victor ended. She heard Edward come back from that meeting."
    },
    {
      id: "clue_w",
      name: "The Divorce Letter Reframed",
      description: "Re-reading the divorce letter after the forensic report: Eleanor wrote it before the will reading, knowing it would leave her with nothing financially. She was prepared to walk away from everything — unless she already knew she would not have to.",
      category: "MOTIVE",
      phase: 2,
      playerHint: "A woman prepared to sacrifice financial security to leave her husband. Then her husband dies and she inherits everything. She walked away with everything after all."
    }
  ],
  dialogue: {
    phase1: [
      { id: "dlg_eleanor_1", question: "Where were you last night between 10 PM and 1 AM?", answer: "I was in the library with Edward from around six until perhaps nine. We were discussing the implications of the will — as Victor's wife I had concerns about my position going forward. After that I came upstairs. I have been in this room since approximately half nine. I did not leave until I heard Rose." },
      { id: "dlg_eleanor_2", question: "How was your relationship with your husband?", answer: "Complicated. I imagine that is not surprising given what this morning revealed about his character. Victor and I had grown very distant over the years. I had made a decision this morning to pursue a separation. I had not yet communicated that to him formally. I suppose the point is moot now." },
      { id: "dlg_eleanor_3", question: "You were in the library with Mr. Blackwell for several hours. What exactly did you discuss?", answer: "The will. My financial position. What options existed for me going forward. Edward is my lawyer as much as he was Victor's — he has handled my personal affairs separately for years. It was a professional conversation about a difficult situation. Nothing more." },
      { id: "dlg_eleanor_4", question: "You asked Victor for a divorce this morning. How did he respond?", answer: "He laughed. Then he told me I had nothing — that everything was his, that I would leave with whatever he decided to give me, and that I should think very carefully before doing anything rash. It was a very Victor response to a very serious conversation. He was right about the financial position, incidentally. Which is why the conversation with Edward this evening was necessary." },
      { id: "dlg_eleanor_5", question: "Did you hear or see anything unusual after you came upstairs?", answer: "I heard Edmund and Victor arguing downstairs around nine. That was not unusual — they had been circling each other all day. After that the manor was quiet from where I was. My room is in the west wing, away from Victor's study. I heard nothing until Rose screamed." },
      { id: "dlg_eleanor_6", question: "Who do you think killed your husband?", answer: "Edmund had every reason. The inheritance, what Victor did with Rose — that combination would break most men. Edmund is not a violent person by nature but there are limits to what any person absorbs quietly. Victor spent his life collecting enemies, Detective. The more relevant question might be who did not want him dead." }
    ],
    phase2SystemPrompt: "You are Eleanor Harlow, 41, Victor Harlow's widow. You did not kill Victor. But you knew Edward Blackwell was capable of it, and during your private conversation in the library you said enough — not explicitly, but enough — to push him toward action. You have been in love with Edward for over twenty years. Victor stole you from Edward by bribing your family. You will never confess to any complicity. You are too intelligent for that. You are composed, precise, and careful. Every answer is technically true while revealing nothing that matters. But the right question, asked exactly right, will produce something just slightly too knowing to be innocent. Respond in character, in first person, as Eleanor Harlow."
  },
  theoryPrompt: "Before leaving this room, record your theory about Eleanor Harlow. What do you think her role in this case is? Even a partial observation is enough to proceed.",
  theoryAcceptanceCriteria: "Theory is accepted if it contains at least one true observation about Eleanor — her unhappy marriage, the divorce letter, her relationship with Edward, her composure, or any suspicion about her timeline."
};