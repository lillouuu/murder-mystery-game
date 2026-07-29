// data/suspects/rose.data.js

export const roseData = {
  suspectInfo: {
    id: "rose_harlow",
    fullName: "Rose Harlow",
    age: 35,
    dateOfBirth: "April 14, 1989",
    occupation: "Edmund Harlow's wife",
    personality: "Warm under normal circumstances. Tonight she is performing normality and failing at it visibly. Eyes that have been crying for hours.",
    backstory: "Married Edmund eight years ago. The affair with Victor began two years ago — Victor pursued her relentlessly as he pursued everything that belonged to Edmund. She ended it three weeks ago. This morning Edmund found out. She spent the entire day trying to appear normal.",
    isGuilty: false,
    isRedHerring: true,
    motive: "Affair exposure, fear of Edmund's reaction, potential divorce",
    alibi: "Went to Victor's study at 10:30 PM to confront him about Edmund finding out, saw Victor in distress and fled, retreated to the conservatory",
    alibiIsTrue: true,
    hiddenSecret: "She witnessed Victor in the early stages of oleander poisoning at 10:30 PM without knowing it — her testimony reframed after the forensic report is the most precise timestamp of when the poison took effect"
  },
  roomInfo: {
    id: "conservatory_room",
    type: "interrogation",
    name: "The Garden Conservatory",
    location: "South Wing, Ground Floor",
    atmosphere: "The conservatory is all glass and rain — the storm hammering the roof creates a constant white noise. Rose sits among the plants, arms wrapped around herself, still in her dinner dress. She has been crying — mascara dried on her cheeks, not fresh tears. She looks up when you enter with the expression of someone who has been rehearsing what to say and knows it is not enough.",
    requiresTheory: true
  },
  phase1Clues: [
    {
      id: "clue_cc",
      name: "The Oleander Bushes",
      x: 250, y: 160,
      description: "The conservatory's centerpiece — enormous ornamental oleander plants, ancient and well tended. A small placard identifies them: 'Nerium Oleander — Highly Toxic, Do Not Consume.'",
      category: "PHYSICAL_EVIDENCE",
      phase: 1,
      playerHint: "Highly toxic. Growing in abundance. In the same manor where a man was just poisoned."
    },
    {
      id: "clue_dd",
      name: "The Fresh Pruning Cuts",
      x: 270, y: 220,
      description: "Several oleander branches show very recent cuts — clean, deliberate, taken from the lower sections where leaves and stems are most potent. Not the work of casual maintenance.",
      category: "PHYSICAL_EVIDENCE",
      phase: 1,
      playerHint: "These cuts are recent. Within the last few weeks. Targeted at the most toxic parts of the plant. Who was out here and why?"
    },
    {
      id: "clue_ee",
      name: "Rose's Presence Here",
      x: 400, y: 200,
      description: "Rose retreated to the conservatory after seeing Victor in distress at 10:30 PM and has barely moved. She chose this room — full of the very plants connected to his death — without knowing the connection.",
      category: "BEHAVIOR",
      phase: 1,
      playerHint: "Of all the rooms in this manor she came here. She does not know yet what these plants mean. But you are beginning to."
    }
  ],
  phase2Clues: [
    {
      id: "clue_ff",
      name: "The Oleander Confirmed",
      description: "The forensic report confirms oleandrin poisoning. These conservatory bushes are now the most critical location in the manor. The recent pruning cuts match the timeline of Agnes's maintenance log entries exactly.",
      category: "PHYSICAL_EVIDENCE",
      phase: 2,
      playerHint: "Agnes was out here for six weeks harvesting from these exact plants. The conservatory is where the murder weapon was grown."
    },
    {
      id: "clue_gg",
      name: "Rose's Witness Account Reframed",
      description: "What Rose saw at 10:30 PM was not a drunk man or a medical episode. She witnessed Victor Harlow in the early stages of oleander poisoning — dizziness, inability to focus, grey complexion, difficulty speaking. Her testimony, reframed after the report, places the poisoning onset at exactly 10:30 PM — fifteen minutes after Agnes delivered the tea.",
      category: "TIMELINE",
      phase: 2,
      playerHint: "Rose is not a suspect. She is a witness. The most precise timestamp of the poisoning in the entire case came from a woman who had no idea what she was seeing."
    }
  ],
  dialogue: {
    phase1: [
      { id: "dlg_rose_1", question: "Where were you last night between 10 PM and 1 AM?", answer: "I went to speak with Victor around half ten. About Edmund. About what happened this morning. I needed to tell him to stay away from us, to stop, that it was over. I opened the study door and he looked wrong. He was sweating, his hands were shaking, he could not seem to focus on me. I thought he was having some kind of episode. I panicked and left. I came here after that and I have not moved." },
      { id: "dlg_rose_2", question: "What exactly did you see when you opened Victor's study door?", answer: "He was at his desk. He looked up when I opened the door but it took him a moment, like he was having trouble focusing. His face was grey. He tried to say something and could not get it out properly. I did not understand what was happening — I thought maybe he had too much to drink, or his heart, or — I don't know what I thought. I was frightened and I left. I should have called for help. I know that. I know that." },
      { id: "dlg_rose_3", question: "You have been in the conservatory since 10:30 PM. Why here specifically?", answer: "I do not know. I just walked and ended up here. It is quiet. Away from everyone. I could not face Edmund — not after this morning, not after everything. I just needed somewhere to sit and think." },
      { id: "dlg_rose_4", question: "Did you and Victor end the affair before last night?", answer: "Yes. Three weeks ago I told him it had to stop. He agreed — or he said he agreed. Coming to his study last night was a mistake. I should have left it alone. But after Edmund found out this morning I needed Victor to understand what he had done, what it had cost. I needed him to hear it. He never got to hear it." },
      { id: "dlg_rose_5", question: "Do you know who sent Edmund the photograph this morning?", answer: "No. I have been trying to work that out myself. Someone in this house knew. Someone chose today of all days to tell him. The day of the will reading, when everyone was already at their worst. That was not an accident, was it." },
      { id: "dlg_rose_6", question: "Who do you think killed Victor?", answer: "Edmund had every reason. But Edmund is not capable of that. He is angry, he is heartbroken, but he would not. He would sooner leave than hurt someone. Victor hurt a lot of people. People I probably do not even know about. It could be anyone in this house tonight and I am not sure I would be surprised by any of them." }
    ],
    phase2SystemPrompt: "You are Rose Harlow, 35, Edmund's wife. You are innocent of Victor's murder. You did not plan anything. You went to his study to confront him about Edmund finding out and you witnessed him in medical distress without understanding what you were seeing. You are now realizing, as the detective questions you after the forensic report, that what you saw at 10:30 PM was the poison taking effect. You are frightened, guilty about the affair, and genuinely horrified by what happened. You answer honestly because you have nothing to hide about the murder itself — only the affair. Respond in character, in first person, as Rose Harlow."
  },
  theoryPrompt: "Before leaving this room, record your theory about Rose Harlow. What do you think her role in this case is? Even a partial observation is enough to proceed.",
  theoryAcceptanceCriteria: "Theory is accepted if it contains at least one true observation about Rose — the affair, what she witnessed at 10:30 PM, her presence near the study, or any assessment of her guilt or innocence."
};