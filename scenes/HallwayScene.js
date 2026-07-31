// scenes/HallwayScene.js
// Menu-style hub, not a walkable room — fastest way to connect Study,
// the 5 suspect rooms, and the Grand Hall without building a second
// walkable map. Tracks which suspects have been visited using Phaser's
// registry, which persists across scene changes automatically.

import { GAME_WIDTH, GAME_HEIGHT } from "../config/constants.js";
import { SCENE_KEYS, SUSPECT_IDS, TINTS } from "../config/keys.js";
import { agnesData } from "../data/suspects/agnes.data.js";
import { edwardData } from "../data/suspects/edward.data.js";
import { eleanorData } from "../data/suspects/eleanor.data.js";
import { edmundData } from "../data/suspects/edmund.data.js";
import { roseData } from "../data/suspects/rose.data.js";

const SUSPECT_LIST = [
  { id: SUSPECT_IDS.AGNES, name: agnesData.suspectInfo.fullName, room: agnesData.roomInfo.name },
  { id: SUSPECT_IDS.EDWARD, name: edwardData.suspectInfo.fullName, room: edwardData.roomInfo.name },
  { id: SUSPECT_IDS.ELEANOR, name: eleanorData.suspectInfo.fullName, room: eleanorData.roomInfo.name },
  { id: SUSPECT_IDS.EDMUND, name: edmundData.suspectInfo.fullName, room: edmundData.roomInfo.name },
  { id: SUSPECT_IDS.ROSE, name: roseData.suspectInfo.fullName, room: roseData.roomInfo.name }
];

export default class HallwayScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.HALLWAY);
  }

  create() {
    this.cameras.main.setBackgroundColor("#1a1410");

    this.add.text(GAME_WIDTH / 2, 40, "Harlow Manor", {
      fontFamily: "Georgia, serif",
      fontSize: "26px",
      color: "#d8c9a3"
    }).setOrigin(0.5);

    const visited = this.registry.get("visitedSuspects") || [];

    this.add.text(GAME_WIDTH / 2, 75, `${visited.length} of ${SUSPECT_LIST.length} suspects questioned`, {
      fontFamily: "Georgia, serif",
      fontSize: "14px",
      color: "#8a7a5a"
    }).setOrigin(0.5);

    // Study button — always available, top of the list
    this.makeButton(GAME_WIDTH / 2, 115, "Return to the Study", 0x5a1f1f, () => {
      this.scene.start(SCENE_KEYS.STUDY);
    });

    // One button per suspect, checkmark if already visited
    SUSPECT_LIST.forEach((s, i) => {
      const y = 170 + i * 50;
      const isVisited = visited.includes(s.id);
      const label = `${isVisited ? "✓ " : ""}${s.name} — ${s.room}`;
      this.makeButton(GAME_WIDTH / 2, y, label, isVisited ? 0x3a4a3a : 0x33291f, () => {
        this.scene.start(SCENE_KEYS.SUSPECT, { suspectId: s.id });
      });
    });

    // Accusation — locked until every suspect has been questioned at least once.
    // (Points at AccusationScene for now, the hardcoded phase-1 version.
    // Swap this to SCENE_KEYS.GRAND_HALL once that scene's free-form
    // LLM-evaluated theory flow is actually built.)
    const allVisited = visited.length >= SUSPECT_LIST.length;
    const accusationY = 170 + SUSPECT_LIST.length * 50 + 20;
    const label = allVisited ? "Make Your Accusation" : "Make an Accusation (question everyone first)";
    this.makeButton(GAME_WIDTH / 2, accusationY, label, allVisited ? 0x7a2b2b : 0x2a2a2a, () => {
      if (allVisited) this.scene.start(SCENE_KEYS.ACCUSATION);
    }, !allVisited);
  }

  // Small helper so every button in this scene looks/behaves the same way
  makeButton(x, y, label, bgColor, onClick, disabled = false) {
    const btn = this.add.text(x, y, label, {
      fontFamily: "Georgia, serif",
      fontSize: "16px",
      color: disabled ? "#5a5a5a" : "#e8dcc0",
      backgroundColor: `#${bgColor.toString(16).padStart(6, "0")}`,
      padding: { x: 16, y: 8 }
    }).setOrigin(0.5);

    if (disabled) return btn;

    btn.setInteractive({ useHandCursor: true });
    btn.on("pointerdown", onClick);
    return btn;
  }
}