// scenes/SuspectScene.js
// ONE scene reused for all 5 suspects. Which suspect it shows is decided
// entirely by data passed in when the scene starts:
//   this.scene.start(SCENE_KEYS.SUSPECT, { suspectId: SUSPECT_IDS.AGNES })

import { GAME_WIDTH, GAME_HEIGHT, INTERACT_RADIUS, TILE_SIZE } from "../config/constants.js";
import { SCENE_KEYS, SUSPECT_IDS } from "../config/keys.js";
import { agnesData } from "../data/suspects/agnes.data.js";
import { edwardData } from "../data/suspects/edward.data.js";
import { eleanorData } from "../data/suspects/eleanor.data.js";
import { edmundData } from "../data/suspects/edmund.data.js";
import { roseData } from "../data/suspects/rose.data.js";
import Player from "../entities/Player.js";
import { buildRoomNES, placeProp, registerPropFrames } from "../entities/RoomBuilder.js";
import { NES_PROP_FRAMES } from "../config/nesPropFrames.js";
import { showClue, showDialogueList, showAnswer, hide, isVisible } from "../ui/DialogueBox.js";
import { showDossier, hideBriefing } from "../ui/BriefingPanel.js";
import { buildCaseFileRoster } from "../data/caseFileRoster.js";
import { askSuspect } from "../services/api.js";
import { collectClue, getCollectedClues } from "../state/Corkboardstate.js";

// One lookup table mapping suspectId -> that suspect's whole data module.
// This is the thing that lets this single file work for all 5 suspects.
const SUSPECT_DATA = {
  [SUSPECT_IDS.AGNES]: agnesData,
  [SUSPECT_IDS.EDWARD]: edwardData,
  [SUSPECT_IDS.ELEANOR]: eleanorData,
  [SUSPECT_IDS.EDMUND]: edmundData,
  [SUSPECT_IDS.ROSE]: roseData
};

// Same room formula as StudyScene — one shared shape, only the furniture
// list changes per suspect. Keeps every room feeling like the same manor.
const ROOM_GRID = [
  "WWWWWWWWWWWWWWWW",
  "w..............w",
  "w..............w",
  "w..............w",
  "w..............w",
  "w..............w",
  "w..............w",
  "w..............w",
  "w..............w",
  "WWWWWWWDWWWWWWWW"
];
const ORIGIN_X = (GAME_WIDTH - ROOM_GRID[0].length * TILE_SIZE) / 2;
const ORIGIN_Y = (GAME_HEIGHT - ROOM_GRID.length * TILE_SIZE) / 2;

// Furniture per suspect, from the new NES mansion tileset (nesProps).
// { prop, x, y } — x/y are grid cells, prop's top-left corner lands there.
// First pass by eye — nudge freely once you see it in the room.
const FURNITURE_LAYOUT = {
  [SUSPECT_IDS.AGNES]: [ // kitchen — bustling prep room, dual counters, staff table
    { prop: "SINK", x: 1, y: 1, texture: "nesProps" },
    { prop: "COOKER", x: 2.1, y: 1, texture: "nesProps" },
    { prop: "KITCHEN_STAND", x: 3.2, y: 1, texture: "nesProps" },
    { prop: "KITCHEN_STAND", x: 4.0, y: 1, texture: "nesProps" },
    { prop: "KITCHEN_STAND", x: 4.8, y: 1, texture: "nesProps" },
    { prop: "PLANTS_1", x: 7.3, y: 1, texture: "nesProps" },
    { prop: "CLOCK", x: 11.8, y: 0.5, texture: "nesProps" },
    { prop: "FRIDGE", x: 13, y: 0.5, texture: "nesProps" },
    { prop: "CUPBOARD", x: 14, y: 0.5, texture: "nesProps" },
    { prop: "CUPBOARD", x: 1, y: 3.0, texture: "nesProps" },
    { prop: "WASHER", x: 13, y: 3.1, texture: "nesProps" },
    { prop: "CUPBOARD", x: 1, y: 5.6, texture: "nesProps" },
    { prop: "SOFA_BACK_DOWN", x: 7.0, y: 2.0, texture: "nesProps" },
    { prop: "DINING_TABLE", x: 6.5, y: 3.5, texture: "nesProps" },
    { prop: "SOFA_BACK_UP", x: 7.0, y: 5.6, texture: "nesProps" },
    { prop: "PLANTS_1", x: 13, y: 8, texture: "nesProps" },
    { prop: "PLANTS_1", x: 14, y: 8, texture: "nesProps" }
  ],
  [SUSPECT_IDS.EDWARD]: [ // library — towering book wall, reading nook, cataloging desk
    { prop: "HUGE_CUPBOARD", x: 1, y: 0.5, texture: "nesProps" },
    { prop: "HUGE_CUPBOARD", x: 4, y: 0.5, texture: "nesProps" },
    { prop: "HUGE_CUPBOARD", x: 7, y: 0.5, texture: "nesProps" },
    { prop: "HUGE_CUPBOARD", x: 10, y: 0.5, texture: "nesProps" },
    { prop: "CLOCK", x: 14, y: 0.5, texture: "nesProps" },
    { prop: "CUPBOARD", x: 1, y: 3.2, texture: "nesProps" },
    { prop: "PIC", x: 13, y: 0.5, texture: "nesProps" },
    { prop: "RUG", x: 10.5, y: 4.3, texture: "nesProps" },
    { prop: "TABLE_STUDY", x: 4.5, y: 4.9, texture: "nesProps" },
    { prop: "DOUBLE_SOFA_ABOVE", x: 10.5, y: 3.5, texture: "nesProps" },
    { prop: "DOUBLE_SOFA_BACK", x: 10.5, y: 6.0, texture: "nesProps" },
    { prop: "CUPBOARD", x: 1, y: 5.8, texture: "nesProps" },
    { prop: "SOFA_BACK_UP", x: 5.0, y: 6.2, texture: "nesProps" },
    { prop: "PLANTS", x: 12.7, y: 6.5, texture: "nesProps" },
    { prop: "PLANTS", x: 3, y: 7.5, texture: "nesProps" },
    { prop: "NIGHT_STAND", x: 11, y: 7.5, texture: "nesProps" }
  ],
  [SUSPECT_IDS.ELEANOR]: [ // bedroom — lavish boudoir, mirrors, wardrobes, dressing sofa
    { prop: "NIGHT_STAND", x: 0.4, y: 0.5, texture: "nesProps" },
    { prop: "DOUBLE_BED", x: 1.5, y: 0.5, texture: "nesProps" },
    { prop: "NIGHT_STAND", x: 3.3, y: 0.5, texture: "nesProps" },
    { prop: "MIRROR", x: 6, y: 0.5, texture: "nesProps" },
    { prop: "SMALL_MIRROR", x: 7.3, y: 0.5, texture: "nesProps" },
    { prop: "HUGE_CUPBOARD", x: 10, y: 0.5, texture: "nesProps" },
    { prop: "HUGE_CUPBOARD", x: 13, y: 0.5, texture: "nesProps" },
    { prop: "PIC", x: 4.5, y:0.5, texture: "nesProps" },
    { prop: "RUG", x: 10.4, y: 5.5, texture: "nesProps" },
    { prop: "SOFA2_LEFT", x: 9.2, y: 5, texture: "nesProps" },
    { prop: "SOFA2_RIGHT", x: 12.4, y: 5, texture: "nesProps" },
    { prop: "CUPBOARD", x: 1, y: 5.5, texture: "nesProps" },
    { prop: "PLANTS_1", x: 14, y: 9, texture: "nesProps" },
    { prop: "PLANTS", x: 12, y: 9, texture: "nesProps" }
  ],
  [SUSPECT_IDS.EDMUND]: [ // parlor — entertainment salon, billiards, cards, two sofas
    { prop: "CUPBOARD", x: 1, y: 0.5, texture: "nesProps" },
    { prop: "CUPBOARD", x: 2, y: 0.5, texture: "nesProps" },
    { prop: "CUPBOARD", x: 3, y: 0.5, texture: "nesProps" },
    { prop: "PIC", x: 5, y: 0.5, texture: "nesProps" },
    { prop: "PIC", x: 6.5, y: 0.5, texture: "nesProps" },
    { prop: "PIC", x: 8, y: 0.5, texture: "nesProps" },
    { prop: "CLOCK", x: 13.5, y: 1, texture: "nesProps" },
    { prop: "BILLIARD_TABLE", x: 4.5, y: 4.0, texture: "nesProps" },
    { prop: "DINING_TABLE", x: 10, y: 1.7, texture: "nesProps" },
    { prop: "RUG", x: 12.5, y: 5.8, texture: "nesProps" },
    { prop: "SOFA2_LEFT", x: 11, y: 5.8, texture: "nesProps" },
    { prop: "SOFA2_RIGHT", x: 14, y: 5.8, texture: "nesProps" },
    { prop: "DOUBLE_SOFA_ABOVE", x: 12.5, y: 4.5, texture: "nesProps" },
    { prop: "DOUBLE_SOFA_BACK", x: 12.5, y: 7.7, texture: "nesProps" },
    { prop: "NIGHT_STAND", x: 3, y: 7.5, texture: "nesProps" },
    { prop: "PLANTS", x: 0.75, y: 8.5, texture: "nesProps" },
    { prop: "PLANTS", x: 5, y: 8.5, texture: "nesProps" },
    { prop: "PLANTS", x: 3, y: 8.5, texture: "nesProps" },
    { prop: "PLANTS", x: 2, y: 8.5, texture: "nesProps" }
  ],
  [SUSPECT_IDS.ROSE]: [ // conservatory — greenhouse, dense with plants, no
    // furniture in the middle. Table removed, plants filled in across 4 rows.
    { prop: "PLANT", x: 2, y: 2, texture: "nesProps" },
    { prop: "PLANT", x: 4, y: 2, texture: "nesProps" },
    { prop: "PLANT", x: 6, y: 2, texture: "nesProps" },
    { prop: "PLANT", x: 8, y: 2, texture: "nesProps" },
    { prop: "PLANT", x: 10, y: 2, texture: "nesProps" },
    { prop: "PLANT", x: 12, y: 2, texture: "nesProps" },
    { prop: "PLANTS", x: 2, y: 4, texture: "nesProps" },
    { prop: "PLANTS_1", x: 4.2, y: 4, texture: "nesProps" },
    { prop: "PLANTS", x: 6.4, y: 4, texture: "nesProps" },
    { prop: "PLANTS_1", x: 8.6, y: 4, texture: "nesProps" },
    { prop: "PLANTS", x: 10.8, y: 4, texture: "nesProps" },
    { prop: "PLANTS_1", x: 13, y: 4, texture: "nesProps" },
    { prop: "WALKWAY_H", x: 2, y: 6, texture: "nesProps" },
    { prop: "WALKWAY_H", x: 3.2, y: 6, texture: "nesProps" },
    { prop: "PLANTS_1", x: 6, y: 6, texture: "nesProps" },
    { prop: "PLANTS", x: 8, y: 6, texture: "nesProps" },
    { prop: "WALKWAY_H", x: 11, y: 6, texture: "nesProps" },
    { prop: "WALKWAY_H", x: 12.2, y: 6, texture: "nesProps" },
    { prop: "PLANT", x: 2, y: 7.5, texture: "nesProps" },
    { prop: "PLANT", x: 4, y: 7.5, texture: "nesProps" },
    { prop: "PLANT", x: 10, y: 7.5, texture: "nesProps" },
    { prop: "PLANT", x: 12, y: 7.5, texture: "nesProps" }
  ]
};

const NPC_START_POS = { x: ORIGIN_X + 11 * TILE_SIZE + 16, y: ORIGIN_Y + 4 * TILE_SIZE + 16 };
const PLAYER_START_POS = { x: ORIGIN_X + 2 * TILE_SIZE + 16, y: ORIGIN_Y + 6 * TILE_SIZE + 16 };

export default class SuspectScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.SUSPECT);
  }

  // Called automatically by Phaser before create(), with whatever was
  // passed into scene.start(). This is how the scene knows which suspect.
  init(data) {
    this.suspectId = data.suspectId;
    this.data_ = SUSPECT_DATA[this.suspectId];
    this.conversationHistory = [];
    this.customQuestionsAsked = 0;
    this.MAX_CUSTOM_QUESTIONS = 3;

    if (!this.data_) {
      console.error(`SuspectScene: no data found for suspectId "${this.suspectId}"`);
    }
  }

  create() {
    hide();
    this.conversationHistory = [];
    const { roomInfo, suspectInfo, phase1Clues, dialogue } = this.data_;

    this.cameras.main.setBackgroundColor("#0d0906");

    const { wallGroup } = buildRoomNES(this, ROOM_GRID, {
      originX: ORIGIN_X,
      originY: ORIGIN_Y,
      floorFrame: this.suspectId === SUSPECT_IDS.ROSE ? "FLOOR_GARDEN" : "FLOOR",
      wallFrame: this.suspectId === SUSPECT_IDS.ROSE ? "WALL_PLANTS" : "WALL_BASE",
      doorFrame: this.suspectId === SUSPECT_IDS.ROSE ? "DOOR_OPEN" : "DOOR"
    });

    registerPropFrames(this, "nesProps", NES_PROP_FRAMES);
    (FURNITURE_LAYOUT[this.suspectId] ?? []).forEach(({ prop, x, y, texture }) => {
      placeProp(this, prop, x, y, { originX: ORIGIN_X, originY: ORIGIN_Y, texture });
    });

    this.add.text(GAME_WIDTH / 2, ORIGIN_Y - 16, roomInfo.name, {
      fontFamily: "Georgia, serif",
      fontSize: "18px",
      color: "#a89a7a"
    }).setOrigin(0.5);

    this.player = new Player(this, PLAYER_START_POS.x, PLAYER_START_POS.y);
    this.physics.add.collider(this.player.sprite, wallGroup);

    // NPC sprite — texture key matches suspectId (see config/keys.js TEXTURE_KEYS),
    // tinted so reused base sheets still read as a distinct character.
    this.npc = this.add.sprite(NPC_START_POS.x, NPC_START_POS.y, this.suspectId);
    this.npc.setScale(1); // matches Player's scale for the new 64x64 sheets
    this.npc.setFrame(26); // "down" row (frame 0 on this sheet is 'up'/back-facing, not 'down' like the old sheet)
    

    this.add.text(NPC_START_POS.x, NPC_START_POS.y - 50, suspectInfo.fullName, {
      fontSize: "13px",
      color: "#d8c9a3"
    }).setOrigin(0.5);

    // "Case File" box — top-left corner, opens the same dossier from the
    // briefing, pre-focused on whichever suspect this room belongs to.
    // Replaces the old "View Profile" button.
    this.add.text(20, 20, "📁 Case File", {
      fontSize: "13px",
      color: "#a89a7a",
      backgroundColor: "#2b2420",
      padding: { x: 8, y: 4 }
    }).setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        showDossier("The Case File", buildCaseFileRoster(), "Close", () => hideBriefing(), this.suspectId);
      });

    // Same clue-marker pattern as StudyScene, reused for this room's clues
    this.clueMarkers = (phase1Clues ?? []).map((clue) => {
      const marker = this.add.circle(clue.x, clue.y, 8, 0xd8b04a).setStrokeStyle(2, 0xffffff);
      marker.setInteractive({ useHandCursor: true });
      marker.on("pointerdown", () => {
        showClue(clue.name, clue.description);
        collectClue(clue, roomInfo.name);

      });
      this.add.text(clue.x, clue.y - 18, "?", { fontSize: "14px", color: "#ffffff" }).setOrigin(0.5);
      return { clue, marker };
    });

    // Talking to the NPC opens the question list
    this.npc.setInteractive({ useHandCursor: true });
    this.npc.on("pointerdown", () => this.openDialogue());

    this.exitText = this.add.text(GAME_WIDTH - 20, GAME_HEIGHT - 20, "Exit →", {
      fontSize: "16px",
      color: "#d8c9a3"
    }).setOrigin(1, 1).setInteractive({ useHandCursor: true });

    this.exitText.on("pointerdown", () => {
      this.scene.start(SCENE_KEYS.HALLWAY);
    });

    // Mark this suspect as questioned so the Hallway checklist and the
    // "everyone questioned" gate to the accusation know about it.
    const visited = this.registry.get("visitedSuspects") || [];
    if (!visited.includes(this.suspectId)) {
      this.registry.set("visitedSuspects", [...visited, this.suspectId]);
    }

    this.input.keyboard.on("keydown-E", () => this.handleInteractKey());
    this.input.keyboard.on("keydown-ESC", () => hide());
  }

  handleInteractKey() {
    if (isVisible()) return hide();

    // Nearest clue first, then NPC, whichever is in range
    const nearestClue = this.clueMarkers.find(({ clue }) =>
      Phaser.Math.Distance.Between(this.player.x, this.player.y, clue.x, clue.y) < INTERACT_RADIUS
    );
    if (nearestClue) {
      showClue(nearestClue.clue.name, nearestClue.clue.description);
      collectClue(nearestClue.clue, this.data_.roomInfo.name);
      return;
    }
    const distToNpc = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.npc.x, this.npc.y);
    if (distToNpc < INTERACT_RADIUS + 20) this.openDialogue();
  }

  openDialogue() {
  const { suspectInfo, dialogue } = this.data_;
  showDialogueList(suspectInfo.fullName, dialogue.phase1, (selected) => this.handlePremadeQuestion(selected), {
    allowCustom: true,
    customRemaining: this.MAX_CUSTOM_QUESTIONS - this.customQuestionsAsked,
    onCustomSubmit: (text) => this.handleCustomQuestion(text)
  });
}

buildSystemPrompt(groundTruthAnswer) {
  const { dialogue } = this.data_;
  let prompt = dialogue.phase2SystemPrompt;

  // Shared style rules applied to every suspect, on top of their individual
  // persona above. Without this the model defaults to generic roleplay-chatbot
  // habits (self-narrated action beats, over-helpfulness) that break both the
  // in-character illusion and the "evasive suspect" tone the personas set up.
  prompt += `\n\nSTYLE RULES (apply to every answer, no exceptions):\n` +
    `- Do not narrate your own body language, tone, or expressions in parentheses or asterisks ` +
    `(no "(pausing to collect my thoughts)", no "(my eyes narrow)", no stage directions of any kind). ` +
    `Speak only in plain spoken dialogue, first person, as if the words are being said out loud.\n` +
    `- Never describe or hint at your own strategy, feelings about the question, or what you are ` +
    `"attempting" to do — just answer as the character would.\n` +
    `- Stay guarded and evasive in tone as befits your character; do not become warm, helpful, or ` +
    `offer extra information the detective didn't ask for.`;

  if (groundTruthAnswer) {
    prompt += `\n\nGround truth for this specific question — stay factually consistent with this, ` +
      `but phrase it in your own voice, don't repeat it word for word: "${groundTruthAnswer}"`;
  }

  // Was `this.registry.get("collectedClues")` — that Phaser-registry key was
  // never set anywhere; clues actually live in Corkboardstate.js, which is
  // what collectClue() (used everywhere clues get picked up) writes to.
  const collected = getCollectedClues();
  const relevant = collected.filter(c => c.suspectId === this.suspectId).map(c => c.name);
  if (relevant.length) {
    prompt += `\n\nThe detective has already found these clues about you: ${relevant.join(", ")}.`;
  }

  return prompt;
}

async handlePremadeQuestion(selected) {
  showAnswer(selected.question, "...");
  const context = this.buildSystemPrompt(selected.answer);
  // Falls back to the suspect's own scripted answer (instead of the generic
  // "nothing further to say" line) if the LLM call fails, so a dropped
  // request still gives a real, in-character answer.
  const aiAnswer = await askSuspect(context, selected.question, this.conversationHistory, selected.answer);

  this.conversationHistory.push(
    { role: "user", content: selected.question },
    { role: "assistant", content: aiAnswer }
  );
  showAnswer(selected.question, aiAnswer, () => this.openDialogue());
}

async handleCustomQuestion(text) {
  if (this.customQuestionsAsked >= this.MAX_CUSTOM_QUESTIONS) {
    // TEMP DEBUG: if you see this, previous silent attempts already used
    // up your 3 custom questions for this suspect.
    showAnswer(text, "[debug] no custom questions left for this suspect.", () => this.openDialogue());
    return;
  }
  this.customQuestionsAsked++;

  // TEMP DEBUG: showAnswer updates are visible in-game with no dev tools
  // needed, so wherever this stops updating tells us where it's stalling.
  showAnswer(text, "[debug] building context...");
  try {
    const context = this.buildSystemPrompt(null);
    showAnswer(text, "[debug] calling askSuspect...");
    const aiAnswer = await askSuspect(context, text, this.conversationHistory);
    showAnswer(text, "[debug] got: " + JSON.stringify(aiAnswer));

    this.conversationHistory.push(
      { role: "user", content: text },
      { role: "assistant", content: aiAnswer }
    );
    showAnswer(text, aiAnswer, () => this.openDialogue());
  } catch (err) {
    showAnswer(text, "[debug] THREW: " + err.message, () => this.openDialogue());
    console.error("handleCustomQuestion error:", err);
  }
}

  update() {
    this.player.update();
  }
}