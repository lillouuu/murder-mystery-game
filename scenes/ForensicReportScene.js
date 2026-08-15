// scenes/ForensicReportScene.js
// Reached from the Hallway once every suspect has been questioned.
// The report itself is just a DOM overlay (ForensicReportPanel) — this
// scene's job is opening it and routing back to the Hallway when it closes.

import { SCENE_KEYS } from "../config/keys.js";
import { openForensicReportPanel, closeForensicReportPanel } from "../ui/ForensicReportPanel.js";

export default class ForensicReportScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.FORENSIC_REPORT);
  }

  create() {
    this.cameras.main.setBackgroundColor("#14100c");

    // Mark it read so the Hallway button can show a checkmark like the
    // suspect rows do.
    this.registry.set("forensicReportRead", true);

    openForensicReportPanel(() => {
      this.scene.start(SCENE_KEYS.HALLWAY);
    });

    this.input.keyboard.on("keydown-ESC", () => closeForensicReportPanel());
  }
}