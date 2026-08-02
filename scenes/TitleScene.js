// scenes/TitleScene.js

import { GAME_WIDTH, GAME_HEIGHT } from "../config/constants.js";
import { SCENE_KEYS } from "../config/keys.js";
import { gameInfo } from "../data/solution.data.js";

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.TITLE);
  }

  create() {
    this.cameras.main.setBackgroundColor("#1a1410");

    this.add.text(GAME_WIDTH / 2, 160, gameInfo.title, {
      fontFamily: "Georgia, serif",
      fontSize: "48px",
      color: "#d8c9a3"
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 210, gameInfo.subtitle, {
      fontFamily: "Georgia, serif",
      fontSize: "20px",
      color: "#a89a7a"
    }).setOrigin(0.5);

    const startBtn = this.add.text(GAME_WIDTH / 2, 320, "Begin the Investigation", {
      fontFamily: "Georgia, serif",
      fontSize: "24px",
      color: "#ffffff",
      backgroundColor: "#5a1f1f",
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    startBtn.on("pointerover", () => startBtn.setStyle({ backgroundColor: "#7a2b2b" }));
    startBtn.on("pointerout", () => startBtn.setStyle({ backgroundColor: "#5a1f1f" }));
    startBtn.on("pointerdown", () => this.scene.start(SCENE_KEYS.INTRO));
  }
}