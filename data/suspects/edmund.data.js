// data/suspects/edmund.data.js

export const edmundData = {
  suspectInfo: {
    id: "edmund_harlow",
    fullName: "Edmund Harlow",
    age: 39,
    dateOfBirth: "November 5, 1985",
    occupation: "Manager of Harlow Estates land holdings",
    personality: "Hollowed out tonight. A man whose bones stopped working. Drinks instead of acts. Feels everything too loudly.",
    backstory: "The legitimate son of Harold Harlow — born from Harold's lawful wife. Victor is the illegitimate son from Harold's mistress, yet Harold always favored Victor. Edmund managed the family land holdings competently for fifteen years and received twenty percent of the estate in the will this afternoon. This morning he found Rose and Victor together after receiving an anonymous photograph slipped under his door.",
    isGuilty: false,
    isRedHerring: true,
    motive: "Twenty percent inheritance after a lifetime of being second, discovered his wife's affair with Victor this morning",
    alibi: "In the east wing sitting room drinking, went to Victor's study around 11 PM but lost his nerve and walked away, went outside briefly around 11:15 PM",
    alibiIsTrue: true,
    hiddenSecret: "The anonymous photograph was planted deliberately — someone in the manor wanted Edmund visibly volatile on the day of the will reading to create a perfect red herring"
  },
  roomInfo: {
    id: "east_wing_room",
    type: "interrogation",
    name: "The East Wing Sitting Room",
    location: "East Wing, First Floor",
    atmosphere: "The east wing sitting room is dark except for a single lamp Edmund hasn't bothered to adjust. He has been drinking — the bottle on the table is two thirds empty, started before dinner by the look of it. He is not drunk exactly, just hollowed out. Jacket off, tie loose, sitting in the chair like a man whose bones stopped working. He looks up when you enter without surprise. A man expecting consequences he is not sure he deserves.",
    requiresTheory: true
  },
  phase1Clues: [
    {
      id: "clue_x",
      name: "The Whisky Bottle",
      x: 300, y: 200,
      description: "Two thirds empty. Harlow family stock — the good stuff Victor would have noticed missing. Edmund did not care enough to hide it. Started before dinner by the ring marks on the table.",
      category: "BEHAVIOR",
      phase: 1,
      playerHint: "He was already unraveling before the argument at dinner. Before the will reading even ended."
    },
    {
      id: "clue_y",
      name: "The Torn Envelope",
      x: 320, y: 280,
      description: "On the floor beside Edmund's chair — a torn open envelope. Inside, a printed photograph of Victor and Rose together, clearly intimate. No sender name on the envelope. No postmark. Delivered from inside the manor.",
      category: "MOTIVE",
      phase: 1,
      playerHint: "Someone sent this to him anonymously this morning. He did not stumble onto it accidentally. Someone wanted Edmund to know — and wanted him volatile today of all days."
    },
    {
      id: "clue_z",
      name: "The Muddy Shoes",
      x: 420, y: 310,
      description: "Edmund's shoes by the door are muddy — outdoor mud, not corridor mud. He went outside during the storm at some point tonight.",
      category: "ALIBI",
      phase: 1,
      playerHint: "When exactly? The study is accessible from an exterior garden door."
    }
  ],
  phase2Clues: [
    {
      id: "clue_aa",
      name: "The Anonymous Photograph — Source",
      description: "The envelope the photograph arrived in was placed under Edmund's door from inside the manor — the internal mail system confirms no external delivery. Someone in this house wanted Edmund furious today. Someone who needed a convincing red herring.",
      category: "PHYSICAL_EVIDENCE",
      phase: 2,
      playerHint: "Who benefits from Edmund looking guilty? Who needed him volatile and suspicious to draw attention away from themselves?"
    },
    {
      id: "clue_bb",
      name: "The Muddy Route Verified",
      description: "Examining the east garden path Edmund claims he walked — his footprints in the mud stop at the garden wall and return directly. He went nowhere near the study's exterior entrance. His alibi, as messy as it looks, is accidentally airtight.",
      category: "ALIBI",
      phase: 2,
      playerHint: "Edmund is telling the truth about the garden. His footprints confirm it. He is not your killer."
    }
  ],
  dialogue: {
    phase1: [
      { id: "dlg_edmund_1", question: "Where were you last night between 10 PM and 1 AM?", answer: "Here mostly. After the argument at dinner I came straight here and started drinking. I went to Victor's study around eleven — I was going to confront him properly, say everything I should have said at dinner. I got to the door and... I don't know. I just walked away. Came back here. Poured another drink. Heard Rose screaming an hour later. Story of my life, isn't it. Getting to the door and walking away." },
      { id: "dlg_edmund_2", question: "You had a very public argument with Victor at dinner. What was it about?", answer: "The will. What else. Twenty percent. Twenty. My father built half that empire on land I managed for fifteen years and he left me twenty percent because Victor — Victor, who spent half his time running his own firm on the side — apparently demonstrated more business acumen. Those were the exact words. Business acumen. My father looked me in the eye my whole life and chose him every single time. Today he just made it official." },
      { id: "dlg_edmund_3", question: "You discovered this morning that Victor had been involved with your wife. How did you find out?", answer: "Someone sent me a photograph. Anonymous. No note, just the photograph slipped under my bedroom door sometime before breakfast. I found it when I woke up. I sat with it for two hours before the will reading. Sat there looking at it thinking — of course. Of course it was Victor. He took everything else. Why not that too." },
      { id: "dlg_edmund_4", question: "You were seen near Victor's study around 11 PM. What exactly happened?", answer: "I walked down the corridor. I stood outside the door. I had my hand on the handle for probably two minutes. I could hear nothing from inside — no movement, no voice. I thought maybe he had already gone to bed. Or maybe I just told myself that because I could not make myself go in. I walked away. That is the truth of it." },
      { id: "dlg_edmund_5", question: "Your shoes are muddy. When did you go outside?", answer: "After I walked away from the study. Around quarter past eleven maybe. I needed air. The storm was bad but I did not care. I walked around the east garden for ten minutes then came back in through the side entrance. I was not near the main entrance or Victor's wing. I just needed to not be inside those walls for a few minutes." },
      { id: "dlg_edmund_6", question: "Who do you think killed your brother?", answer: "Half brother. He never let me forget that either. I wanted to kill him. I will not insult you by pretending otherwise — today gave me every reason a man could need. But I did not. I stood at his door and walked away. Whoever went in after I left is your answer, Detective. Not me." }
    ],
    phase2SystemPrompt: "You are Edmund Harlow, 39, Victor's half-brother. You are innocent of the murder. You did not kill Victor. You went to the door and walked away. You are drunk, hollowed out, and carrying the weight of a life spent being second. You are not clever tonight. You are not guarded. You are just a man who lost everything in one day and did not even have the nerve to confront the person responsible. Answer honestly. You have nothing left to hide and nothing left to lose. Respond in character, in first person, as Edmund Harlow."
  },
  theoryPrompt: "Before leaving this room, record your theory about Edmund Harlow. What do you think his role in this case is? Even a partial observation is enough to proceed.",
  theoryAcceptanceCriteria: "Theory is accepted if it contains at least one true observation about Edmund — his argument with Victor, his motive, his presence at the study door, his muddy shoes, or any assessment of his guilt or innocence."
};