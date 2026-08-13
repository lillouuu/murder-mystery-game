// scenes/GrandHallScene.js
// The final scene: the player writes their own free-form theory of what
// happened, it's judged by the LLM against grandHallConfig's evaluation
// prompt, and the full truth is revealed alongside the score/feedback.

import { GAME_WIDTH, GAME_HEIGHT } from "../config/constants.js";
import { SCENE_KEYS } from "../config/keys.js";
import { grandHallConfig, truthData } from "../data/solution.data.js";
import { getVerdict } from "../services/api.js";
import { showClue, hide as hideDialogue } from "../ui/DialogueBox.js";
import { openTheoryBoard, closeTheoryBoard, isTheoryBoardOpen } from "../ui/TheoryBoard.js";

// getVerdict() already catches network/API errors internally and returns a
// graceful fallback object — but if the request just hangs without ever
// resolving or rejecting (seen before with this Groq integration), the
// player would be stuck on "Judging your theory..." forever. This forces
// a hard ceiling so that never happens.
function withTimeout(promise, ms, fallback) {
  return Promise.race([
    promise,
    new Promise((resolve) => setTimeout(() => resolve(fallback), ms))
  ]);
}

export default class GrandHallScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.GRAND_HALL);
  }

  create() {
    this.submitted = false;
    this.cameras.main.setBackgroundColor("#14100c");

    this.add.text(GAME_WIDTH / 2, 30, grandHallConfig.name, {
      fontFamily: "Georgia, serif",
      fontSize: "26px",
      color: "#d8c9a3"
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 60, grandHallConfig.location, {
      fontFamily: "Georgia, serif",
      fontSize: "13px",
      color: "#8a7a5a"
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 230, grandHallConfig.atmosphere, {
      fontFamily: "Georgia, serif",
      fontSize: "13px",
      color: "#a89a7a",
      align: "center",
      wordWrap: { width: GAME_WIDTH - 140 }
    }).setOrigin(0.5);

    this.writeBtn = this.add.text(GAME_WIDTH / 2, 440, "Write Your Theory", {
      fontFamily: "Georgia, serif",
      fontSize: "18px",
      color: "#fff",
      backgroundColor: "#5a1f1f",
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    this.writeBtn.on("pointerdown", () => {
      if (this.submitted) return;
      openTheoryBoard(grandHallConfig.verdictPrompt, (theoryText) => this.submitTheory(theoryText));
    });

    this.input.keyboard.on("keydown-ESC", () => {
      if (isTheoryBoardOpen()) closeTheoryBoard();
      else hideDialogue();
    });
  }

  async submitTheory(theoryText) {
    if (this.submitted) return;
    this.submitted = true;
    closeTheoryBoard();
    this.writeBtn.disableInteractive().setStyle({ backgroundColor: "#2a2a2a", color: "#5a5a5a" });

    showClue(
      "Judging Your Theory...",
      "The detective's account is being weighed against the evidence. One moment."
    );

    const timedOutFallback = {
      score: null,
      feedback: "The verdict service took too long to respond — here's the full truth regardless.",
      verdict: "UNKNOWN"
    };

    const result = await withTimeout(
      getVerdict(grandHallConfig.verdictEvaluationSystemPrompt, theoryText),
      15000,
      timedOutFallback
    );

    this.revealVerdict(result);
  }

  revealVerdict(result) {
    const scoreLine = result.score != null
      ? `Score: ${result.score} / 100 — ${result.verdict}`
      : `Verdict: ${result.verdict}`;

    const solutionText =
      `${scoreLine}\n\n` +
      `${result.feedback}\n\n` +
      `— The Full Truth —\n\n` +
      `${truthData.killerA.name} ${truthData.killerA.method}. Motive: ${truthData.killerA.motive}.\n\n` +
      `Separately, ${truthData.killerB.name} ${truthData.killerB.method}. Motive: ${truthData.killerB.motive}.\n\n` +
      `${truthData.accomplice.name} was the silent accomplice — ${truthData.accomplice.role}\n\n` +
      `Cause of death: ${truthData.causeOfDeath}\n\n` +
      `The forensic paradox: ${truthData.forensicParadox}`;

    showClue("Case Closed — Harlow Manor", solutionText);

    this.add.text(GAME_WIDTH / 2, 475, "Return to the Hallway", {
      fontFamily: "Georgia, serif",
      fontSize: "14px",
      color: "#8a7a5a"
    }).setOrigin(0.5).setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        hideDialogue();
        this.scene.start(SCENE_KEYS.HALLWAY);
      });
  }
}