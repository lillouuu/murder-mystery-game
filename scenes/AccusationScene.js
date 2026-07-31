// scenes/AccusationScene.js
// Phase 1 version of the ending: no LLM call, no free-form theory —
// the player picks one suspect for each of three roles and we check
// the picks against a hardcoded answer key. GrandHallScene (later) can
// replace this with the free-form LLM-evaluated version; this one just
// needs to work today.

import { GAME_WIDTH, GAME_HEIGHT } from "../config/constants.js";
import { SCENE_KEYS, SUSPECT_IDS } from "../config/keys.js";
import { truthData } from "../data/solution.data.js";
import { agnesData } from "../data/suspects/agnes.data.js";
import { edwardData } from "../data/suspects/edward.data.js";
import { eleanorData } from "../data/suspects/eleanor.data.js";
import { edmundData } from "../data/suspects/edmund.data.js";
import { roseData } from "../data/suspects/rose.data.js";
import { showClue, hide } from "../ui/DialogueBox.js";

// One suspect can be picked for more than one role — nothing here
// stops the player from accusing the same person of everything, the
// wrong answer is still a wrong answer either way.
const SUSPECT_LIST = [
  { id: SUSPECT_IDS.AGNES, name: agnesData.suspectInfo.fullName },
  { id: SUSPECT_IDS.EDWARD, name: edwardData.suspectInfo.fullName },
  { id: SUSPECT_IDS.ELEANOR, name: eleanorData.suspectInfo.fullName },
  { id: SUSPECT_IDS.EDMUND, name: edmundData.suspectInfo.fullName },
  { id: SUSPECT_IDS.ROSE, name: roseData.suspectInfo.fullName }
];

// The hardcoded answer key. This is the only place these three lines
// live — if the mystery's solution ever changes, this is what to edit.
const CORRECT = {
  killerA: SUSPECT_IDS.EDWARD,
  killerB: SUSPECT_IDS.AGNES,
  accomplice: SUSPECT_IDS.ELEANOR
};

const CATEGORIES = [
  { key: "killerA", prompt: "Who delivered the fatal stab wound?" },
  { key: "killerB", prompt: "Who poisoned Victor's nightly tea?" },
  { key: "accomplice", prompt: "Who was the silent accomplice?" }
];

export default class AccusationScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.ACCUSATION);
  }

  create() {
    this.selections = { killerA: null, killerB: null, accomplice: null };
    this.choiceButtons = []; // flat list of every suspect button, across all 3 rows, so we can re-style them on selection

    this.cameras.main.setBackgroundColor("#14100c");

    this.add.text(GAME_WIDTH / 2, 30, "Make Your Accusation", {
      fontFamily: "Georgia, serif",
      fontSize: "26px",
      color: "#d8c9a3"
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 58, "Pick one suspect for each role, Detective. There is no undo once you submit.", {
      fontFamily: "Georgia, serif",
      fontSize: "13px",
      color: "#8a7a5a"
    }).setOrigin(0.5);

    CATEGORIES.forEach((category, i) => {
      const rowY = 100 + i * 100;

      this.add.text(GAME_WIDTH / 2, rowY, category.prompt, {
        fontFamily: "Georgia, serif",
        fontSize: "16px",
        color: "#a89a7a"
      }).setOrigin(0.5);

      const spacing = GAME_WIDTH / (SUSPECT_LIST.length + 1);
      SUSPECT_LIST.forEach((suspect, j) => {
        const x = spacing * (j + 1);
        const y = rowY + 32;
        const btn = this.makeChoiceButton(x, y, suspect.name, () => {
          this.selections[category.key] = suspect.id;
          this.refreshChoiceStyles();
          this.refreshSubmitState();
        });
        btn.categoryKey = category.key;
        btn.suspectId = suspect.id;
        this.choiceButtons.push(btn);
      });
    });

    this.submitBtn = this.add.text(GAME_WIDTH / 2, 440, "Submit Accusation", {
      fontFamily: "Georgia, serif",
      fontSize: "20px",
      color: "#5a5a5a",
      backgroundColor: "#2a2a2a",
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5);

    this.submitBtn.on("pointerdown", () => {
      if (this.allSelected()) this.revealVerdict();
    });

    this.input.keyboard.on("keydown-ESC", () => hide());
  }

  makeChoiceButton(x, y, label, onClick) {
    const btn = this.add.text(x, y, label, {
      fontFamily: "Georgia, serif",
      fontSize: "12px",
      color: "#c9bda0",
      backgroundColor: "#2b2420",
      align: "center",
      padding: { x: 8, y: 6 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btn.on("pointerdown", onClick);
    return btn;
  }

  // Re-colors every suspect button so the currently selected one per
  // row is visibly highlighted and the rest fall back to the default.
  refreshChoiceStyles() {
    this.choiceButtons.forEach((btn) => {
      const isSelected = this.selections[btn.categoryKey] === btn.suspectId;
      btn.setStyle({ backgroundColor: isSelected ? "#5a1f1f" : "#2b2420" });
    });
  }

  allSelected() {
    return this.selections.killerA && this.selections.killerB && this.selections.accomplice;
  }

  refreshSubmitState() {
    if (!this.allSelected()) return;
    this.submitBtn.setStyle({ color: "#ffffff", backgroundColor: "#5a1f1f" });
    this.submitBtn.setInteractive({ useHandCursor: true });
  }

  revealVerdict() {
    const killerACorrect = this.selections.killerA === CORRECT.killerA;
    const killerBCorrect = this.selections.killerB === CORRECT.killerB;
    const accompliceCorrect = this.selections.accomplice === CORRECT.accomplice;
    const score = [killerACorrect, killerBCorrect, accompliceCorrect].filter(Boolean).length;

    // Lock the board so the player can't keep clicking choices after submitting
    this.choiceButtons.forEach((btn) => btn.disableInteractive());
    this.submitBtn.disableInteractive();

    const verdictLine = `You got ${score} of 3 correct.`;

    const solutionText =
      `${verdictLine}\n\n` +
      `The truth: ${truthData.killerA.name} ${truthData.killerA.method}. Motive: ${truthData.killerA.motive}.\n\n` +
      `Separately, ${truthData.killerB.name} ${truthData.killerB.method}. Motive: ${truthData.killerB.motive}.\n\n` +
      `${truthData.accomplice.name} was the silent accomplice — ${truthData.accomplice.role}\n\n` +
      `Cause of death: ${truthData.causeOfDeath}\n\n` +
      `The forensic paradox: ${truthData.forensicParadox}`;

    showClue("Case Closed — Harlow Manor", solutionText);

    // Simple "return to hallway" escape hatch once they've read the reveal
    this.add.text(GAME_WIDTH / 2, 475, "Return to the Hallway", {
      fontFamily: "Georgia, serif",
      fontSize: "14px",
      color: "#8a7a5a"
    }).setOrigin(0.5).setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        hide();
        this.scene.start(SCENE_KEYS.HALLWAY);
      });
  }
}