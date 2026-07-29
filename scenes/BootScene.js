// scenes/BootScene.js

import { SCENE_KEYS } from "../config/keys.js";

export default class BootScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.BOOT);
  }

  preload() {
    const barBg = this.add.rectangle(400, 260, 300, 20, 0x333333);
    const bar = this.add.rectangle(400 - 148, 260, 4, 16, 0xffffff).setOrigin(0, 0.5);
    this.load.on("progress", (value) => {
      bar.width = 296 * value;
    });

    // Confirmed from actual Kenney toon-character sheet: 864x640 / (9 cols x 5 rows) = 96x128
    this.load.spritesheet("player", "assets/sprites/player.png", {
      frameWidth: 96,
      frameHeight: 128
    });

    this.load.spritesheet("agnes", "assets/sprites/npcs/agnes.png", { frameWidth: 96, frameHeight: 128 });
    this.load.spritesheet("edward", "assets/sprites/npcs/edward.png", { frameWidth: 96, frameHeight: 128 });
    this.load.spritesheet("eleanor", "assets/sprites/npcs/eleanor.png", { frameWidth: 96, frameHeight: 128 });
    this.load.spritesheet("edmund", "assets/sprites/npcs/edmund.png", { frameWidth: 96, frameHeight: 128 });
    this.load.spritesheet("rose", "assets/sprites/npcs/rose.png", { frameWidth: 96, frameHeight: 128 });
    this.load.spritesheet("victim", "assets/sprites/npcs/victim.png", { frameWidth: 96, frameHeight: 128 });

    this.load.spritesheet("tiles", "assets/titles/Spritesheet/roguelikeSheet_transparent.png", {
      frameWidth: 16,
      frameHeight: 16
    });
  }

  create() {
    this.scene.start(SCENE_KEYS.TITLE);
  }
}
