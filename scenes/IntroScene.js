
// The dramatic beat between Title and the Case File dossier — sets the
// scene in the player's own time (typewriter reveal) before they start
// browsing profiles. Click/Space at any point skips straight to the full
// text, so it's never a chore on replay.

import { GAME_WIDTH, GAME_HEIGHT } from "../config/constants.js";
import { SCENE_KEYS } from "../config/keys.js";
import { gameInfo, victimData } from "../data/solution.data.js";

const LINES=[
    gameInfo.setting,
    gameInfo.detectiveIntro,
    `${victimData.fullName}, ${victimData.age}. ${victimData.occupation}. 
    Found dead in his study less than an hour ago.`
]

const FULL_TEXT =LINES.join("\n\n");
const CHARS_PER_TICK=2;
const TICK_DELAY = 35; // ms per reveal step — tune for faster/slower typewriter feel

export default class IntroScene extends Phaser.Scene{
    constructor(){
        super(SCENE_KEYS.INTRO);
    }

    create(){
        this.cameras.main.setBackgroundColor("#0d0906");
        const cx= GAME_WIDTH/2;
     this.add.text(cx, 50, "1:00 AM — Harlow Manor", {
      fontFamily: "Georgia, serif",
      fontSize: "16px",
      color: "#8a7a5a",
      fontStyle: "italic"
    }).setOrigin(0.5);

    this.bodyText = this.add.text(cx, 250, "", {
      fontFamily: "Georgia, serif",
      fontSize: "16px",
      color: "#d8c9a3",
      align: "center",
      wordWrap: { width: 620 },
      lineSpacing: 10
    }).setOrigin(0.5, 0.5);

    this.prompt = this.add.text(cx, GAME_HEIGHT - 40, "click or press space to continue", {
      fontFamily: "Georgia, serif",
      fontSize: "13px",
      color: "#5a4a35"
    }).setOrigin(0.5).setAlpha(0);

    this.revealed = 0;
    this.done = false;

    this.typeTimer = this.time.addEvent({
      delay: TICK_DELAY,
      loop: true,
      callback: () => this.advanceType()
    });

    const goNext = () => this.done ? this.leaveScene() : this.skipToEnd();
    this.input.on("pointerdown", goNext);
    this.input.keyboard.on("keydown-SPACE", goNext);
  }

  advanceType() {
    this.revealed += CHARS_PER_TICK;
    if (this.revealed >= FULL_TEXT.length) {
      this.revealed = FULL_TEXT.length;
      this.finishTyping();
    }
    this.bodyText.setText(FULL_TEXT.slice(0, this.revealed));
  }

  skipToEnd() {
    this.revealed = FULL_TEXT.length;
    this.bodyText.setText(FULL_TEXT);
    this.finishTyping();
  }

  finishTyping() {
    if (this.done) return;
    this.done = true;
    this.typeTimer.remove();
    this.tweens.add({ targets: this.prompt, alpha: 1, duration: 400 });
  }

  leaveScene() {
    this.scene.start(SCENE_KEYS.BRIEFING);
  }
}