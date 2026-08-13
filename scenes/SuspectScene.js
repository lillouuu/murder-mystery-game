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
import { buildRoom, placeProp, registerPropFrames } from "../entities/RoomBuilder.js";
import { PROP_FRAMES } from "../config/propFrames.js";
import { MANOR_PROP_FRAMES } from "../config/manorPropFrames.js";
import { showClue, showDialogueList, showAnswer, hide, isVisible } from "../ui/DialogueBox.js";
import { askSuspect } from "../services/api.js";
import { collectClue } from "../state/Corkboardstate.js";

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

// Furniture per suspect, from the new Pixel Crawler interior props sheet.
// { prop, x, y } — x/y are grid cells, prop's top-left corner lands there.
// First pass by eye — nudge freely once you see it in the room.
const FURNITURE_LAYOUT = {
  [SUSPECT_IDS.AGNES]: [
    { prop: "STOVE", x: 2, y: 1, texture: "manorProps" },
    { prop: "PANTRY_SHELF", x: 6, y: 1, texture: "manorProps" },
    { prop: "COOK_COUNTER", x: 10, y: 1, texture: "manorProps" },
    { prop: "LONG_BENCH", x: 5, y: 5, texture: "manorProps" }
  ],
  [SUSPECT_IDS.EDWARD]: [
    { prop: "FIREPLACE_BRICK", x: 6, y: 1, texture: "manorProps" },
    { prop: "BOOKSHELF_BOOKS", x: 1, y: 1, texture: "manorProps" },
    { prop: "BOOKSHELF_TALL", x: 12, y: 1, texture: "manorProps" },
    { prop: "ARMCHAIR", x: 4, y: 6, texture: "manorProps" },
    { prop: "CHAIR_GREEN", x: 10, y: 6, texture: "manorProps" }
  ],
  [SUSPECT_IDS.ELEANOR]: [
    { prop: "BED_CANOPY", x: 2, y: 1, texture: "manorProps" },
    { prop: "VANITY", x: 9, y: 1, texture: "manorProps" },
    { prop: "MIRROR", x: 9, y: 5, texture: "manorProps" },
    { prop: "NIGHTSTAND", x: 5, y: 2, texture: "manorProps" }
  ],
  [SUSPECT_IDS.EDMUND]: [
    { prop: "ARMCHAIR", x: 6, y: 4, texture: "manorProps" },
    { prop: "CONSOLE_TABLE", x: 8, y: 5, texture: "manorProps" },
    { prop: "LAMP_TABLE", x: 9, y: 4, texture: "manorProps" },
    { prop: "CLOCK_GRANDFATHER", x: 2, y: 1, texture: "manorProps" }
  ],
  [SUSPECT_IDS.ROSE]: [
    { prop: "PLANT_A", x: 2, y: 6, texture: "interiorProps" },
    { prop: "PLANT_B", x: 11, y: 6, texture: "interiorProps" },
    { prop: "PLANT_A", x: 7, y: 1, texture: "interiorProps" },
    { prop: "PLANT_B", x: 7, y: 6, texture: "interiorProps" },
    { prop: "CONSOLE_TABLE", x: 6, y: 4, texture: "manorProps" }
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

    const { wallGroup } = buildRoom(this, ROOM_GRID, {
      originX: ORIGIN_X,
      originY: ORIGIN_Y
    });

    registerPropFrames(this, "interiorProps", PROP_FRAMES);
    registerPropFrames(this, "manorProps", MANOR_PROP_FRAMES);
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

    this.add.text(NPC_START_POS.x, NPC_START_POS.y + 60, "View Profile", {
  fontSize: "13px", color: "#a89a7a", backgroundColor: "#2b2420", padding: { x: 8, y: 4 }
}).setOrigin(0.5).setInteractive({ useHandCursor: true })
  .on("pointerdown", () => {
    showClue(
      `${suspectInfo.fullName} — ${suspectInfo.occupation}`,
      `${suspectInfo.personality}\n\n${suspectInfo.publicBackstory ?? suspectInfo.backstory}`
    );
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

  if (groundTruthAnswer) {
    prompt += `\n\nGround truth for this specific question — stay factually consistent with this, ` +
      `but phrase it in your own voice, don't repeat it word for word: "${groundTruthAnswer}"`;
  }

  const collected = this.registry.get("collectedClues") || [];
  const relevant = collected.filter(c => c.suspectId === this.suspectId).map(c => c.name);
  if (relevant.length) {
    prompt += `\n\nThe detective has already found these clues about you: ${relevant.join(", ")}.`;
  }

  return prompt;
}

async handlePremadeQuestion(selected) {
  showAnswer(selected.question, "...");
  const context = this.buildSystemPrompt(selected.answer);
  const aiAnswer = await askSuspect(context, selected.question, this.conversationHistory);

  this.conversationHistory.push(
    { role: "user", content: selected.question },
    { role: "assistant", content: aiAnswer }
  );
  showAnswer(selected.question, aiAnswer);
}

async handleCustomQuestion(text) {
  if (this.customQuestionsAsked >= this.MAX_CUSTOM_QUESTIONS) return;
  this.customQuestionsAsked++;

  showAnswer(text, "...");
  const context = this.buildSystemPrompt(null);
  const aiAnswer = await askSuspect(context, text, this.conversationHistory);

  this.conversationHistory.push(
    { role: "user", content: text },
    { role: "assistant", content: aiAnswer }
  );
  showAnswer(text, aiAnswer);
  this.openDialogue(); // refresh so the counter updates
}

  update() {
    this.player.update();
  }
}