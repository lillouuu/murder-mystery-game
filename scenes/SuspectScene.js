// scenes/StudyScene.js

import { GAME_WIDTH, GAME_HEIGHT, INTERACT_RADIUS } from "../config/constants.js";
import { SCENE_KEYS } from "../config/keys.js";
import { SUSPECT_IDS } from "../config/keys.js";
import { studyData } from "../data/study.data.js";
import Player from "../entities/Player.js";
import { showClue, hide, isVisible } from "../ui/DialogueBox.js";

export default class StudyScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.STUDY);
  }

  create() {
    this.cameras.main.setBackgroundColor("#2b2420");

    // Floor placeholder — swap for a tilemap once assets are dropped in
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x3a3028);

    // The body, roughly centered where the desk clues cluster
    this.add.text(410, 260, "🪑", { fontSize: "40px" }).setOrigin(0.5);
    this.add.text(410, 400, "Victor's Study", {
      fontFamily: "Georgia, serif",
      fontSize: "18px",
      color: "#a89a7a"
    }).setOrigin(0.5);

    this.player = new Player(this, 200, 400);

    // Build a clue sprite for every entry in study.data.js — no data duplication
    this.clueMarkers = studyData.clues.map((clue) => {
      const marker = this.add.circle(clue.x, clue.y, 8, 0xd8b04a).setStrokeStyle(2, 0xffffff);
      marker.setInteractive({ useHandCursor: true });
      this.physics.add.existing(marker, true); // static body, used only for distance check

      const label = this.add.text(clue.x, clue.y - 18, "?", {
        fontSize: "14px",
        color: "#ffffff"
      }).setOrigin(0.5);

      marker.on("pointerdown", () => this.tryExamine(clue));

      return { clue, marker, label };
    });

    // Exit prompt to the hallway (built later — for now just log)
    this.exitText = this.add.text(750, 460, "Exit →", {
      fontSize: "16px",
      color: "#d8c9a3"
    }).setOrigin(1, 1).setInteractive({ useHandCursor: true });

    this.exitText.on("pointerdown", () => {
      console.log("TODO: go to HallwayScene once it exists");
      // this.scene.start(SCENE_KEYS.HALLWAY);
    });

    this.input.keyboard.on("keydown-E", () => this.tryExamineNearest());
    this.input.keyboard.on("keydown-ESC", () => hide());
  }

  tryExamineNearest() {
    if (isVisible()) return hide();
    const nearest = this.clueMarkers.find(({ clue }) => {
      return Phaser.Math.Distance.Between(this.player.x, this.player.y, clue.x, clue.y) < INTERACT_RADIUS;
    });
    if (nearest) this.tryExamine(nearest.clue);
  }

  tryExamine(clue) {
    showClue(clue.name, clue.description);
  }

  update() {
    this.player.update();
  }
}