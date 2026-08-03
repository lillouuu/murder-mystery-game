// scenes/StudyScene.js

import { GAME_WIDTH, GAME_HEIGHT, INTERACT_RADIUS, TILE_SIZE } from "../config/constants.js";
import { SCENE_KEYS } from "../config/keys.js";
import { TILES } from "../config/tileIds.js";
import { studyData } from "../data/study.data.js";
import Player from "../entities/Player.js";
import { buildRoom, placeFurniture } from "../entities/RoomBuilder.js";
import { showClue, hide, isVisible } from "../ui/DialogueBox.js";
import { collectClue } from "../state/CorkboardState.js";
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

    const { wallGroup, doorZones } = buildRoom(this, STUDY_GRID, {
      originX: ORIGIN_X,
      originY: ORIGIN_Y
    });
    this.doorZones = doorZones;

    // Desk, roughly centered — where the body/clues cluster
    placeFurniture(this, TILES.DESK, 7, 4, { originX: ORIGIN_X, originY: ORIGIN_Y });

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
