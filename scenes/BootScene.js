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

    // New character sheets: 832x256, sliced as 64x64 cells -> 13 cols x 4 rows.
    // Only the first 9 columns of each row hold an actual walk-cycle frame;
    // columns 9-12 are blank filler (harmless, just unused frame indices).
    this.load.spritesheet("player", "assets/sprites/player.png", {
      frameWidth: 64,
      frameHeight: 64
    });

    this.load.spritesheet("agnes", "assets/sprites/npcs/agnes.png", { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet("edward", "assets/sprites/npcs/edward.png", { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet("eleanor", "assets/sprites/npcs/eleanor.png", { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet("edmund", "assets/sprites/npcs/edmund.png", { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet("rose", "assets/sprites/npcs/rose.png", { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet("victim", "assets/sprites/npcs/victim.png", { frameWidth: 64, frameHeight: 64 });

    this.load.spritesheet("tiles", "assets/titles/Spritesheet/roguelikeSheet_transparent.png", {
      frameWidth: 16,
      frameHeight: 16,
      margin: 1,
      spacing: 1
    });

    // Multi-tile furniture props (sofa, table, bookshelf, etc). Loaded as
    // one plain image — named regions get carved out of it in create(),
    // since pieces span different footprints and don't slice on a grid.
    this.load.image("interiorProps", "assets/interior/props.png");
 
    // Second furniture sheet — Gemini-generated, higher fidelity, used for
    // most rooms. Pixel Crawler stays loaded too since it's still the only
    // source with plants (Rose's conservatory needs them).
    this.load.image("manorProps", "assets/interior/manor_props.png");
  }

  create() {
    this.scene.start(SCENE_KEYS.TITLE);
  }
}
