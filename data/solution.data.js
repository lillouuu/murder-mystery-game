// data/solution.data.js

export const gameInfo = {
  title: "Harlow Manor",
  subtitle: "A Murder Mystery",
  setting: "Harlow Manor — a grand estate on the outskirts of the city. A storm has cut the manor off from the outside world. Nobody is leaving tonight.",
  detectiveIntro: "You are Detective Marlowe. You have been called to Harlow Manor at 1:00 AM. Harold Harlow's eldest son, Victor, has been found dead in his study. Everyone in the house is a suspect. Nobody is leaving until you have answers."
};

export const truthData = {
  killerA: {
    name: "Edward Blackwell",
    method: "Stabbed Victor twice in the chest with the Harlow family silver letter opener",
    motive: "Secretly in love with Eleanor, Victor was destroying their shared company through embezzlement, Victor had stolen Eleanor from him years ago by bribing her family",
    time: "12:00 AM",
    knewAboutPoison: false
  },
  killerB: {
    name: "Agnes Reed",
    method: "Replaced Victor's sleeping pills with oleander extract capsules, administered via his nightly tea at 10:15 PM",
    motive: "Seven years ago Victor killed her husband Thomas and son James in a drunk driving accident and framed his innocent chauffeur who went to prison",
    time: "10:15 PM",
    knewAboutStabbing: false
  },
  accomplice: {
    name: "Eleanor Harlow",
    role: "Silent accomplice — knew Edward was capable of acting, said enough during their private library conversation to light the fuse. Never explicitly planned anything. Cannot be proven.",
    benefit: "Inherits everything as Victor's widow, free to be with Edward"
  },
  causeOfDeath: "Combined trauma — oleander poisoning severely weakened Victor's cardiovascular system, stab wounds delivered the fatal blow to an already failing heart. Neither killer alone would have killed Victor at midnight. Together they were absolute.",
  forensicParadox: "Because the poison had slowed Victor's circulatory system to near failure by midnight, the stab wounds bled very little — leaving Edward's clothes completely clean. The sluggish blood pattern at the wound site is the key forensic anomaly that reveals two causes of death."
};

export const timelineData = [
  { time: "Morning", event: "Edmund receives anonymous photograph of Victor and Rose under his bedroom door", significance: "Someone deliberately planted this to make Edmund volatile today" },
  { time: "Morning", event: "Edmund finds Rose and Victor together", significance: "Edmund's world collapses before the will reading even begins" },
  { time: "2:00 PM", event: "Harold's will read in the drawing room — Victor receives 80%, Edmund receives 20%", significance: "The official trigger for the evening's events" },
  { time: "3:00 PM", event: "Edmund confronts Edward about contesting the will — Edward says it is legally airtight", significance: "Edmund has no legal recourse" },
  { time: "4:00 PM", event: "Edward attempts to leave — car engine fails in the driveway", significance: "Convenient mechanical failure traps Edward at the manor" },
  { time: "5:00 PM", event: "Storm arrives — manor effectively cut off from outside world", significance: "Nobody is leaving tonight" },
  { time: "6:00 PM", event: "Eleanor and Edward speak privately in the library", significance: "Content of conversation unknown — both give different accounts of when it ended" },
  { time: "8:00 PM", event: "Family dinner — tense, everyone present, Edmund barely speaking", significance: "Last time everyone is seen together" },
  { time: "9:00 PM", event: "Edmund and Victor argue loudly about the inheritance at the dinner table — Edmund storms off", significance: "Most visible motive display of the evening" },
  { time: "9:30 PM", event: "Edward and Victor have private meeting in the study about Harlow & Blackwell finances", significance: "Edward's last conversation with Victor — ends badly" },
  { time: "10:00 PM", event: "Meeting ends — Victor dismisses Edward's concerns, laughs them off, rings service bell for his nightly tea", significance: "The final straw for Edward" },
  { time: "10:15 PM", event: "Agnes enters the study with chamomile tea and two oleander capsules in the silver pill dish. She watches Victor swallow them. Smiles. Leaves.", significance: "The trap is sprung" },
  { time: "10:30 PM", event: "Rose goes to Victor's study to confront him. Opens the door. Sees Victor sweating, grey-faced, shaking, unable to speak clearly. Panics and flees.", significance: "Rose is an accidental witness to the poison taking effect — she does not know this" },
  { time: "11:00 PM", event: "Oleander reaches full effect — Victor completely paralyzed at his desk, heart failing slowly", significance: "Victor is dying but not yet dead" },
  { time: "11:15 PM", event: "Edmund paces outside the study door. Opens it. Sees Victor slumped, assumes he is drunk. Gets disgusted. Walks away.", significance: "Edmund is an accidental witness — he saw Victor incapacitated and did nothing" },
  { time: "11:30 PM", event: "Agnes returns to collect the tea tray. Finds Victor paralyzed, staring at her in horror. She looks him in the eye. Says nothing. Turns off the main light. Leaves him to die in the dark.", significance: "The most chilling moment of the night" },
  { time: "12:00 AM", event: "Edward enters the study. Finds Victor barely alive, barely breathing. Assumes he is drunk or ill. Takes the silver letter opener from the desk and stabs Victor twice in the chest.", significance: "The killing blow — accelerates what the poison had already made inevitable" },
  { time: "12:30 AM", event: "Rose notices the study light is back on. Opens the door. Finds the body. Screams.", significance: "The discovery" },
  { time: "12:35 AM", event: "Everyone rushes to the study", significance: "The gathering" },
  { time: "1:00 AM", event: "Detective arrives at Harlow Manor", significance: "The game begins" }
];

export const forensicReport = {
  releasedAfter: "all_rooms_cleared",
  title: "Forensic Report — Victor Harlow — Harlow Manor",
  filedBy: "Dr. Helena Cross, County Medical Examiner",
  timeOfDeath: "Approximately 12:05 AM",
  officialCause: "Combined Trauma — Cardiac Glycoside Poisoning and Penetrating Chest Wounds",
  findings: [
    {
      id: "finding_1",
      title: "Stab Wounds",
      detail: "Two penetrating wounds to the chest cavity. Both struck vital structures. Delivered with a narrow, sharp blade consistent with the letter opener recovered from the scene. Fatal in isolation — but the victim would have survived longer than he did without the secondary condition."
    },
    {
      id: "finding_2",
      title: "Anomalous Blood Pattern",
      detail: "Blood loss from the stab wounds is significantly below what would be expected from wounds of this severity in a living patient. The blood pooled slowly and did not spray or arterialize. This indicates the victim's cardiovascular system was already severely compromised before the blade entered the chest."
    },
    {
      id: "finding_3",
      title: "Oleandrin Detected",
      detail: "Toxicology screening confirms the presence of Oleandrin — a cardiac glycoside derived from Nerium Oleander — in the victim's bloodstream, stomach contents, and the residue of the teacup recovered from the study. Concentration indicates ingestion of a lethal dose approximately 90 minutes before time of death. Source: capsules substituted for the victim's prescribed sleeping medication."
    },
    {
      id: "finding_4",
      title: "Pill Bottle",
      detail: "The victim's prescription sleeping pill bottle was recovered from the study desk. Laboratory analysis confirms the capsules inside are not the prescribed medication. They are hand-processed oleander extract — shaped and colored to match the prescription precisely. This required significant preparation time and botanical knowledge."
    },
    {
      id: "finding_5",
      title: "Combined Cause Conclusion",
      detail: "Without the poisoning, the stab wounds would have caused significantly more blood loss and a slower death. Without the stabbing, the oleander would have caused cardiac arrest within 2-3 hours. The combination of both — the poison destroying the cardiovascular defenses, the blade delivering the fatal trauma — resulted in death at approximately 12:05 AM. Both agents contributed. Neither perpetrator can claim sole responsibility."
    },
    {
      id: "finding_6",
      title: "Fiber Evidence",
      detail: "A microscopic dark fabric fiber was recovered from the engraved groove of the letter opener handle. Consistent with leather glove material. No fingerprints were found on the handle — it was wiped clean. The fiber suggests the perpetrator wore gloves and removed them after the act."
    }
  ]
};

export const grandHallConfig = {
  id: "final_room",
  type: "final",
  name: "The Grand Hall",
  location: "Central Manor, Ground Floor",
  atmosphere: "The grand hall is the heart of Harlow Manor — high ceilings, ancestral portraits lining the walls, a long oak table running the length of the room. Harold Harlow stares down from the largest portrait, painted in his prime. The detective stands alone here for the first time all night. No suspects. No performances. Just the notebook, the theories, the forensic report, and the truth waiting to be assembled. On the table — every room theory laid out in order. The forensic report beside them. A single empty page and pen waiting.",
  requiresTheory: false,
  suspectId: null,
  verdictPrompt: "You have questioned every person in this house. You have read the forensic report. You have the clues. Now write your complete account of what happened at Harlow Manor tonight. Name the killer or killers, explain their methods, their motives, and the exact sequence of events that led to Victor Harlow's death. If you believe more than one person is responsible, explain how. The truth is yours to assemble.",
  verdictEvaluationSystemPrompt: `You are evaluating a player's murder mystery solution for the Harlow Manor case. The complete truth is: Victor Harlow was killed by TWO people who never coordinated. Agnes Reed (the maid) replaced his sleeping pills with oleander extract capsules she cultivated over six weeks from the manor conservatory — motivated by revenge for Victor killing her husband Thomas and son James seven years ago in a drunk driving accident he blamed on his innocent chauffeur. Edward Blackwell (the family lawyer) entered the study at midnight, found Victor incapacitated by the poison, and stabbed him twice with the Harlow family silver letter opener — motivated by his secret love for Eleanor, Victor's embezzlement of their shared firm, and Victor having stolen Eleanor from him years ago by bribing her family. Eleanor Harlow is a silent accomplice — she knew Edward was capable of acting and said enough during their private library conversation to push him toward it, though she never explicitly planned anything. The official cause of death is combined trauma — the poison destroyed Victor's cardiovascular defenses, the stabbing delivered the fatal blow. Neither killer alone would have killed Victor at midnight. Evaluate the player's theory and return ONLY a JSON object in this exact format: {score: number 0-100, killer_a_correct: boolean, killer_b_correct: boolean, eleanor_identified: boolean, method_correct: boolean, motive_correct: boolean, feedback: string of 3-4 sentences explaining what they got right and what they missed, verdict: one of PERFECT / GOOD / PARTIAL / INCOMPLETE}. Score 100 for perfect identification of both killers, methods, motives, and Eleanor. Score 80 for both killers without Eleanor. Score 60 for one killer fully correct. Score 40 for one killer partially correct. Score 20 for logical reasoning even if wrong conclusion. Score 0 for completely wrong with no supporting logic.`
};