// scenes/StudyScene.js

import { GAME_WIDTH, GAME_HEIGHT, INTERACT_RADIUS, TILE_SIZE } from "../config/constants.js";
import { SCENE_KEYS } from "../config/keys.js";
import { studyData } from "../data/study.data.js";
import Player from "../entities/Player.js";
import { buildRoomNES, placeProp, registerPropFrames } from "../entities/RoomBuilder.js";
import { NES_PROP_FRAMES } from "../config/nesPropFrames.js";
import { showClue, hide, isVisible } from "../ui/DialogueBox.js";
import { collectClue } from "../state/Corkboardstate.js";
// "wwwwwwwwwwwwwwww"
// 16 cols x 10 rows. W = top wall, w = bottom wall trim, D = door, . = floor
const STUDY_GRID = [
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

// Centers the 16x10 room (at 32px tiles = 512x320) inside the 800x500 canvas
const ORIGIN_X = (GAME_WIDTH - STUDY_GRID[0].length * TILE_SIZE) / 2;
const ORIGIN_Y = (GAME_HEIGHT - STUDY_GRID.length * TILE_SIZE) / 2;
const DOOR_RADIUS = 24;

export default class StudyScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.STUDY);
  }

  create() {
    hide(); // close any dialogue box left open from the previous room
    this.cameras.main.setBackgroundColor("#0d0906");

    const { wallGroup, doorZones } = buildRoomNES(this, STUDY_GRID, {
      originX: ORIGIN_X,
      originY: ORIGIN_Y
    });
    this.doorZones = doorZones;

    // Densely packed scholarly study — wall-to-wall cupboards as a research
    // library, central desk (table+chair+rug), a small gallery of pictures,
    // and a bit of greenery. From the Gemini-planned layout.
    registerPropFrames(this, "nesProps", NES_PROP_FRAMES);

    // left wall: unbroken row of cupboards forming the library wall
    placeProp(this, "HUGE_CUPBOARD", 1, 0.5, { originX: ORIGIN_X, originY: ORIGIN_Y, texture: "nesProps" });
    placeProp(this, "HUGE_CUPBOARD", 4, 0.5, { originX: ORIGIN_X, originY: ORIGIN_Y, texture: "nesProps" });
    placeProp(this, "HUGE_CUPBOARD", 7, 0.5, { originX: ORIGIN_X, originY: ORIGIN_Y, texture: "nesProps" });
    placeProp(this, "CLOCK", 13, 0.5, { originX: ORIGIN_X, originY: ORIGIN_Y, texture: "nesProps" });
    placeProp(this, "CUPBOARD", 14, 0.5, { originX: ORIGIN_X, originY: ORIGIN_Y, texture: "nesProps" });

    // evidence/ledger cabinet, lower-left
    placeProp(this, "CUPBOARD", 1, 5.5, { originX: ORIGIN_X, originY: ORIGIN_Y, texture: "nesProps" });

    // central desk: table + chair + rug underneath
    placeProp(this, "RUG", 5.8, 4.7, { originX: ORIGIN_X, originY: ORIGIN_Y, texture: "nesProps" });
    placeProp(this, "TABLE_STUDY", 5.5, 4.5, { originX: ORIGIN_X, originY: ORIGIN_Y, texture: "nesProps" });
    placeProp(this, "SOFA_BACK_UP", 6.0, 6.2, { originX: ORIGIN_X, originY: ORIGIN_Y, texture: "nesProps" });

    // small portrait gallery, right wall
    placeProp(this, "PIC", 10, 0.5, { originX: ORIGIN_X, originY: ORIGIN_Y, texture: "nesProps" });
    placeProp(this, "PIC", 11.5, 0.5, { originX: ORIGIN_X, originY: ORIGIN_Y, texture: "nesProps" });

    // greenery accents
    placeProp(this, "PLANTS", 1, 3.2, { originX: ORIGIN_X, originY: ORIGIN_Y, texture: "nesProps" });
    placeProp(this, "PLANTS_1", 13.5, 6.5, { originX: ORIGIN_X, originY: ORIGIN_Y, texture: "nesProps" });
    placeProp(this, "PLANTS_1", 15.5, 6.5, { originX: ORIGIN_X, originY: ORIGIN_Y, texture: "nesProps" });
    placeProp(this, "PLANT", 10, 2.2, { originX: ORIGIN_X, originY: ORIGIN_Y, texture: "nesProps" });

    this.add.text(GAME_WIDTH / 2, ORIGIN_Y - 16, "Victor's Study", {
      fontFamily: "Georgia, serif",
      fontSize: "16px",
      color: "#a89a7a"
    }).setOrigin(0.5);

    this.player = new Player(this, ORIGIN_X + TILE_SIZE * 2, ORIGIN_Y + TILE_SIZE * 5);
    this.physics.add.collider(this.player.sprite, wallGroup);

    // Clue markers — unchanged positions for now; nudge study.data.js x/y
    // once you see how they sit relative to the real desk.
    this.clueMarkers = studyData.clues.map((clue) => {
      const marker = this.add.circle(clue.x, clue.y, 8, 0xd8b04a).setStrokeStyle(2, 0xffffff);
      marker.setInteractive({ useHandCursor: true });
      marker.on("pointerdown", () => {
        showClue(clue.name, clue.description);
        collectClue(clue, "Victor's Study");
      });
      this.add.text(clue.x, clue.y - 18, "?", { fontSize: "14px", color: "#ffffff" }).setOrigin(0.5);
      return { clue, marker };
    });

    this.input.keyboard.on("keydown-E", () => this.tryExamineNearest());
    this.input.keyboard.on("keydown-ESC", () => hide());
  }

  tryExamineNearest() {
    if (isVisible()) return hide();
    const nearest = this.clueMarkers.find(({ clue }) =>
      Phaser.Math.Distance.Between(this.player.x, this.player.y, clue.x, clue.y) < INTERACT_RADIUS
    );
    if (nearest){
       showClue(nearest.clue.name, nearest.clue.description);
       collectClue(nearest.clue, "Victor's Study");
    }
  }

  update() {
    this.player.update();

    // Walking into the door tile transitions to the Hallway — no button needed
    const atDoor = this.doorZones.some((d) =>
      Phaser.Math.Distance.Between(this.player.x, this.player.y, d.x, d.y) < DOOR_RADIUS
    );
    if (atDoor) this.scene.start(SCENE_KEYS.HALLWAY);
  }
}