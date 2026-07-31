// scenes/SuspectScene.js
// ONE scene reused for all 5 suspects. Which suspect it shows is decided
// entirely by data passed in when the scene starts:
//   this.scene.start(SCENE_KEYS.SUSPECT, { suspectId: SUSPECT_IDS.AGNES })

import { GAME_WIDTH, GAME_HEIGHT, INTERACT_RADIUS } from "../config/constants.js";
import { SCENE_KEYS, SUSPECT_IDS, TINTS } from "../config/keys.js";
import { agnesData } from "../data/suspects/agnes.data.js";
import { edwardData } from "../data/suspects/edward.data.js";
import { eleanorData } from "../data/suspects/eleanor.data.js";
import { edmundData } from "../data/suspects/edmund.data.js";
import { roseData } from "../data/suspects/rose.data.js";
import Player from "../entities/Player.js";
import { showClue, showDialogueList, showAnswer, hide, isVisible } from "../ui/DialogueBox.js";

// One lookup table mapping suspectId -> that suspect's whole data module.
// This is the thing that lets this single file work for all 5 suspects.
const SUSPECT_DATA = {
  [SUSPECT_IDS.AGNES]: agnesData,
  [SUSPECT_IDS.EDWARD]: edwardData,
  [SUSPECT_IDS.ELEANOR]: eleanorData,
  [SUSPECT_IDS.EDMUND]: edmundData,
  [SUSPECT_IDS.ROSE]: roseData
};

const NPC_START_POS = { x: 550, y: 260 };

export default class SuspectScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.SUSPECT);
  }

  // Called automatically by Phaser before create(), with whatever was
  // passed into scene.start(). This is how the scene knows which suspect.
  init(data) {
    this.suspectId = data.suspectId;
    this.data_ = SUSPECT_DATA[this.suspectId];

    if (!this.data_) {
      console.error(`SuspectScene: no data found for suspectId "${this.suspectId}"`);
    }
  }

  create() {
    const { roomInfo, suspectInfo, phase1Clues, dialogue } = this.data_;

    this.cameras.main.setBackgroundColor("#2b2420");
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x352a22);

    this.add.text(GAME_WIDTH / 2, 30, roomInfo.name, {
      fontFamily: "Georgia, serif",
      fontSize: "20px",
      color: "#a89a7a"
    }).setOrigin(0.5);

    this.player = new Player(this, 200, 400);

    // NPC sprite — texture key matches suspectId (see config/keys.js TEXTURE_KEYS),
    // tinted so reused base sheets still read as a distinct character.
    this.npc = this.add.sprite(NPC_START_POS.x, NPC_START_POS.y, this.suspectId);
    this.npc.setScale(0.5);
    this.npc.setTint(TINTS[this.suspectId] ?? 0xffffff);

    this.add.text(NPC_START_POS.x, NPC_START_POS.y - 50, suspectInfo.fullName, {
      fontSize: "13px",
      color: "#d8c9a3"
    }).setOrigin(0.5);

    // Same clue-marker pattern as StudyScene, reused for this room's clues
    this.clueMarkers = (phase1Clues ?? []).map((clue) => {
      const marker = this.add.circle(clue.x, clue.y, 8, 0xd8b04a).setStrokeStyle(2, 0xffffff);
      marker.setInteractive({ useHandCursor: true });
      marker.on("pointerdown", () => showClue(clue.name, clue.description));
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
    if (nearestClue) return showClue(nearestClue.clue.name, nearestClue.clue.description);

    const distToNpc = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.npc.x, this.npc.y);
    if (distToNpc < INTERACT_RADIUS + 20) this.openDialogue();
  }

  openDialogue() {
    const { suspectInfo, dialogue } = this.data_;
    showDialogueList(suspectInfo.fullName, dialogue.phase1, (selected) => {
      showAnswer(selected.question, selected.answer);
    });
  }

  update() {
    this.player.update();
  }
}