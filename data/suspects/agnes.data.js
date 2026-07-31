// data/suspects/agnes.data.js

export const agnesData = {
  suspectInfo: {
    id: "agnes_reed",
    fullName: "Agnes Reed",
    age: 57,
    dateOfBirth: "June 12, 1967",
    occupation: "Head Maid, Harlow Manor — 6 years",
    personality: "Quiet, efficient, invisible. Perfectly composed. The kind of woman nobody looks at twice.",
   
    publicBackstory: "Seven years ago Victor Harlow, drunk and reckless, struck and killed her husband Thomas (55) and son James (20) as they walked home from a football match. Victor's lawyers dismantled the case, and his innocent chauffeur went to prison in his place. Agnes lost everything in one night. She has worked at Harlow Manor for six years.",
    backstory: "Seven years ago Victor Harlow, drunk and reckless, struck and killed her husband Thomas (55) and son James (20) as they walked home from a football match. Victor's lawyers dismantled the case. He blamed his chauffeur — an innocent man who went to prison. Agnes lost everything in one night. She applied for the position at Harlow Manor deliberately. Spent six years earning trust, learning Victor's routines, and waiting for the right moment.",
    isGuilty: true,
    guiltType: "KILLER_B",
    motive: "Revenge for the murder of her husband and son",
    alibi: "Was in the kitchen cleaning up after dinner, briefly visited the study at 10:15 PM to deliver tea, returned at 11:30 PM to collect the tray",
    alibiIsTrue: false,
    hiddenSecret: "Replaced Victor's sleeping pills with oleander extract capsules she cultivated from the manor conservatory over six weeks"
  },
  roomInfo: {
    id: "kitchen_room",
    type: "interrogation",
    name: "The Kitchen and Pantry",
    location: "Ground Floor, Service Wing",
    atmosphere: "The kitchen is the warmest room in the manor tonight. Still smells of the evening's dinner — roasted meat, herbs, chamomile. Everything is immaculately clean. Every surface wiped. Every pot in its place. A single lamp burns over the central prep table. Agnes Reed sits at the far end, hands folded, a cold cup of tea in front of her she has not touched. She looks like a woman who has been waiting patiently — for what, you cannot tell.",
    requiresTheory: true
  },
  phase1Clues: [
    {
      id: "clue_f",
      name: "The Spotless Kitchen",
      x: 200, y: 150,
      description: "Everything has been thoroughly cleaned for this hour of night. Pots scrubbed, surfaces wiped, the hearth swept. For a kitchen that served a full family dinner hours ago it is almost unnaturally clean.",
      category: "BEHAVIOR",
      phase: 1,
      playerHint: "Who cleans this thoroughly at midnight after a murder has just been discovered?"
    },
    {
      id: "clue_g",
      name: "The Household Maintenance Log",
      x: 350, y: 200,
      description: "A worn ledger sitting open on the kitchen counter. Agnes logs all household tasks — shopping, repairs, gardening. Recent entries show she spent several afternoons over the past six weeks tending specifically to the conservatory hedges.",
      category: "TIMELINE",
      phase: 1,
      playerHint: "Six weeks of conservatory visits. Every entry in the same calm handwriting. What was she doing out there for six weeks?"
    },
    {
      id: "clue_h",
      name: "The Silver Pill Dish",
      x: 300, y: 220,
      description: "A small ornate silver dish sitting on Agnes's tea tray, still unwashed. Normally used to present Victor his nightly medication alongside his chamomile tea.",
      category: "PHYSICAL_EVIDENCE",
      phase: 1,
      playerHint: "Why is the pill dish still here in the kitchen and not in the study with the rest of the tea service?"
    }
  ],
  phase2Clues: [
    {
      id: "clue_i",
      name: "The Mason Jar",
      description: "Hidden at the very back of the pantry behind heavy flour sacks. An unmarked glass jar containing crushed dried green leaves and a small handmade pestle tool. The bitter organic scent is identical to the chemical residue found in the study teacup.",
      category: "WEAPON",
      phase: 2,
      playerHint: "Someone was processing plant material in this kitchen. The scent matches the poison in Victor's tea exactly."
    },
    {
      id: "clue_j",
      name: "The Conservatory Connection",
      description: "Cross-referencing the maintenance log with the manor conservatory layout reveals Agnes was tending specifically to the ornamental oleander bushes — the only section of the conservatory not visible from the main house windows.",
      category: "PHYSICAL_EVIDENCE",
      phase: 2,
      playerHint: "Six weeks of unsupervised access to highly toxic oleander plants. The maintenance log is not a record of gardening. It is a record of harvesting."
    },
    {
      id: "clue_k",
      name: "The Newspaper Clipping",
      description: "Tucked inside Agnes's personal recipe book on the kitchen shelf — a folded, yellowed newspaper article. Headline: 'Chauffeur Sentenced — Harlow Heir Cleared In Fatal Collision.' Two names circled in faded ink: Thomas Reed. James Reed.",
      category: "MOTIVE",
      phase: 2,
      playerHint: "She has been carrying this for seven years. Thomas Reed. James Reed. Her husband and her son. Killed by Victor Harlow. And she has been making his tea every night for six years."
    }
  ],
  dialogue: {
    phase1: [
      { id: "dlg_agnes_1", question: "Where were you last night between 10 PM and 1 AM?", answer: "In the kitchen mostly, cleaning up after dinner. I brought Mr. Harlow his nightly chamomile tea and his medication around quarter past ten as I always do. After that I tidied up in here, checked the pantry stock for tomorrow's breakfast, and retired to my quarters around half eleven. I heard the screaming just after half twelve and came running like everyone else." },
      { id: "dlg_agnes_2", question: "What was your relationship with Mr. Harlow?", answer: "I have worked at Harlow Manor for six years. Mr. Harlow was my employer. He was a demanding man — particular about his routines, his meals, his study being kept a certain way. But he was never unkind to me directly. I respected the household and did my job well. That is the extent of it." },
      { id: "dlg_agnes_3", question: "When you brought the tea, how did Mr. Harlow seem?", answer: "Tired. More than usual. He had been in that meeting with Mr. Blackwell all evening and they did not part on good terms from what I could hear through the door. He seemed agitated when I entered, but he calmed once he sat back and took his tea. He dismissed me without much word. That was normal for him after a difficult evening." },
      { id: "dlg_agnes_4", question: "Did you notice anything unusual in the manor yesterday?", answer: "The atmosphere was very tense from the afternoon onward. The will reading upset Mr. Edmund terribly — you could hear it in his voice at dinner. And Mr. Edmund and Mr. Victor had that argument at the table which made everything worse. Mr. Blackwell seemed distracted all evening. I kept to the kitchen as much as possible. It was not a night to be underfoot." },
      { id: "dlg_agnes_5", question: "Did you see anyone near Mr. Harlow's study after you delivered the tea?", answer: "I returned briefly around half eleven to collect the tray — Mr. Harlow preferred the study cleared before he slept. When I entered he was at his desk, very still. I assumed he had fallen asleep in his chair as he sometimes did after a difficult day. I left the tray and did not wish to disturb him. I wish now I had looked more closely. I wish I had looked more closely." },
      { id: "dlg_agnes_6", question: "Who do you think could have done this?", answer: "I would not wish to point fingers without knowing the facts, Detective. But I will say this — Mr. Edmund was not himself yesterday. Finding out about the will on top of everything else he was carrying... a person can only take so much before something breaks. And Mr. Blackwell left that meeting looking like a man who had made a decision about something. I noticed it at the time and thought nothing of it. Now I am not so sure. Mr. Victor made enemies easily. He always had. I just never thought one of them would follow him all the way to his study." }
    ],
    phase2SystemPrompt: "You are Agnes Reed, 57, the head maid of Harlow Manor. You poisoned Victor Harlow by replacing his sleeping pills with oleander extract capsules you cultivated from the manor conservatory over six weeks. Seven years ago Victor killed your husband Thomas and son James in a drunk driving accident and framed his innocent chauffeur. You have waited six years for this moment. You are now being questioned by a detective who has the forensic report confirming oleander poisoning. You know they are getting close. You NEVER confess. You remain composed, polite, and careful. Your answers become more measured and precise — a pause too long here, a word chosen too carefully there. You deflect, reframe, and redirect. But cracks are beginning to show. You are not afraid of death or prison. You got what you came for. Respond in character, in first person, as Agnes Reed."
  },
  theoryPrompt: "Before leaving this room, record your theory about Agnes Reed. What do you think her connection to this case is? Even a partial observation is enough to proceed.",
  theoryAcceptanceCriteria: "Theory is accepted if it contains at least one true observation about Agnes — her access to Victor, her kitchen role, her composure, the maintenance log, the pill dish, or any suspicion about her motives."
};