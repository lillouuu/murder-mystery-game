export const studyData = {
  id: "opening_room",
  type: "crime_scene",
  name: "Victor's Study",
  location: "East Wing, Ground Floor",
  atmosphere: "The study is dimly lit — the main overhead light is off, a single desk lamp casting a pale circle over the body. The room smells of chamomile tea and something else underneath it, something faintly bitter you cannot place. Rain hammers the windows. Victor Harlow sits slumped in his leather chair behind a mahogany desk, head tilted back, eyes half open. He looks almost peaceful. Almost.",
  bodyDescription: "Victor Harlow, 44. Found in his study chair. Two stab wounds to the chest, delivered with precision. Remarkably little blood for wounds of this severity — it pooled slowly rather than spraying, thick and dark. His complexion is grey. His hands rest in his lap, fingers slightly curled. On the desk in front of him: a half-drained teacup, a small silver pill dish, scattered financial documents, and an empty slot in the Harlow family stationary set where the letter opener should be.",
  requiresTheory: false,
  suspectId: null,
  clues: [
    {
      id: "clue_a",
      name: "The Harlow Family Letter Opener",
      x: 400,
      y: 280,
      description: "Found buried deep in Victor's chest. Antique silver, heavy, with the Harlow Family Crest engraved on the handle. It belongs to the stationary set on the desk — the empty slot confirms it came from this room.",
      category: "WEAPON",
      phase: 1,
      twist: "The polished handle is pristine — wiped completely clean of fingerprints. But caught deep in the engraved groove of the crest, a microscopic dark fiber. Leather. Glove leather."
    },
    {
      id: "clue_b",
      name: "The Sluggish Blood Pattern",
      x: 420,
      y: 310,
      description: "A forensic observation. The chest wounds bled — but not as they should have. No spray, no pooling across the desk. The blood oozed slowly, thick and dark, as if the heart behind the wounds was barely pumping when the blade went in.",
      category: "PHYSICAL_EVIDENCE",
      phase: 1,
      twist: "A healthy man stabbed in the chest bleeds heavily and fast. This man did not. His blood pressure was dangerously, unnaturally low before the blade entered. Something was already shutting him down."
    },
    {
      id: "clue_c",
      name: "The Teacup and Silver Pill Dish",
      x: 450,
      y: 270,
      description: "A half-drained cup of chamomile tea sits on the desk beside a small ornate silver dish. The dish held something small — two circular impressions in the velvet lining. His nightly medication, presumably.",
      category: "PHYSICAL_EVIDENCE",
      phase: 1,
      twist: "Laboratory testing of the tea dregs confirms trace amounts of Oleandrin — a cardiac glycoside derived from Nerium Oleander. A natural poison. In his tea. Mixed with his medication."
    },
    {
      id: "clue_d",
      name: "The Financial Documents",
      x: 360,
      y: 270,
      description: "Scattered across the desk — Harlow & Blackwell investment reports, internal account statements, a letter from Edward Blackwell dated three weeks ago flagging financial irregularities. Victor's handwritten notes in the margins: 'handled', 'not urgent', 'E overreacting'.",
      category: "MOTIVE",
      phase: 1,
      twist: "Cross-referencing the account statements reveals systematic fund withdrawals over 18 months — money moving from firm accounts into a private account registered to a shell company. Embezzlement. Victor was draining the firm he and Edward built together."
    },
    {
      id: "clue_e",
      name: "The Pill Bottle",
      x: 480,
      y: 290,
      description: "Victor's prescription sleeping medication — found on the desk. Bottle almost full despite Victor reportedly taking them nightly for years.",
      category: "PHYSICAL_EVIDENCE",
      phase: 2,
      twist: "Laboratory analysis confirms the capsules in the bottle are not the prescribed medication. They are hand-processed oleander extract — shaped and colored to match the prescription precisely. Someone replaced the entire bottle. This required weeks of preparation."
    }
  ]
};