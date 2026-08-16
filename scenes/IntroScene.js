// scenes/IntroScene.js
// The dramatic beat between Title and the Case File dossier — sets the
// scene in the player's own time (typewriter reveal) before they start
// browsing profiles. Click/Space at any point skips straight to the full
// text, so it's never a chore on replay.
//
// Visually matched to TitleScene's palette (gold/maroon/parchment) instead
// of a bare black screen, plus a light rain effect since the setting text
// itself calls out a storm hammering the windows.
//
// Text is revealed one paragraph at a time (click/space to advance to the
// next, or to finish typing the current one early) instead of typing all
// three paragraphs together — easier to read as distinct story beats.

import { GAME_WIDTH, GAME_HEIGHT } from "../config/constants.js";
import { SCENE_KEYS } from "../config/keys.js";
import { gameInfo, victimData } from "../data/solution.data.js";

const GOLD = "#e8c987";
const GOLD_DIM = "#a9915f";
const PARCHMENT = "#c9bd94";
const BG_TOP = 0x1c0f0f;
const BG_BOTTOM = 0x0a0605;
const BRONZE = 0x8a6f3f;
const BRONZE_DARK = 0x4a3a20;

const LINES = [
  gameInfo.setting,
  gameInfo.detectiveIntro,
  `${victimData.fullName}, ${victimData.age}. ${victimData.occupation}.
    Found dead in his study less than an hour ago.`
];

const CHARS_PER_TICK = 2;
const TICK_DELAY = 35; // ms per reveal step — tune for faster/slower typewriter feel

const RAINDROP_COUNT = 45;

// Phaser Text objects render blurry on high-DPI/Retina screens unless told
// to rasterize at the device's actual pixel density — this does that
// per-object, without touching the game's canvas size or coordinate space
// (which every scene's positioning math depends on staying at 800x500).
const TEXT_RESOLUTION = window.devicePixelRatio || 1;

export default class IntroScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.INTRO);
  }

  create() {
    // Same font-ready guard as TitleScene, otherwise Phaser bakes the text
    // into the canvas texture using the fallback font on first paint.
    if (document.fonts && document.fonts.ready) {
      document.fonts.load("700 16px Cinzel");
      document.fonts.load("italic 500 16px 'Cormorant Garamond'");
      document.fonts.ready.then(() => this.buildScene());
    } else {
      this.buildScene();
    }
  }

  buildScene() {
    const cx = GAME_WIDTH / 2;

    this.drawBackground(cx);
    this.drawRain();
    this.drawHeader(cx);
    this.drawTextPanel(cx);
    this.drawVignette();

    this.prompt = this.add.text(cx, GAME_HEIGHT - 34, "click or press space to continue", {
      fontFamily: "Cinzel, Georgia, serif",
      fontSize: "12px",
      color: GOLD_DIM,
      resolution: TEXT_RESOLUTION
    }).setOrigin(0.5).setAlpha(0).setDepth(20);

    this.lineIndex = 0;
    this.revealed = 0;
    this.lineDone = false;

    this.typeTimer = this.time.addEvent({
      delay: TICK_DELAY,
      loop: true,
      callback: () => this.advanceType()
    });

    const goNext = () => this.lineDone ? this.advanceLine() : this.skipToEndOfLine();
    this.input.on("pointerdown", goNext);
    this.input.keyboard.on("keydown-SPACE", goNext);
  }

  drawBackground(cx) {
    const g = this.add.graphics();
    g.fillGradientStyle(BG_TOP, BG_TOP, BG_BOTTOM, BG_BOTTOM, 1);
    g.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // faint warm glow, same trick as the title plaque, kept subtle so text stays legible
    const glow = this.add.graphics();
    glow.fillStyle(0x4a1518, 0.18);
    glow.fillEllipse(cx, GAME_HEIGHT / 2, 520, 260);
  }

  drawRain() {
    // Cheap rain: short diagonal streaks, each on its own looping tween
    // falling top-to-bottom then resetting. Low alpha so it reads as
    // atmosphere behind the text rather than competing with it.
    for (let i = 0; i < RAINDROP_COUNT; i++) {
      const x = Phaser.Math.Between(0, GAME_WIDTH);
      const startY = Phaser.Math.Between(-GAME_HEIGHT, 0);
      const len = Phaser.Math.Between(10, 20);
      const drop = this.add.graphics().setDepth(1);
      drop.lineStyle(1, 0x8fa3b8, Phaser.Math.FloatBetween(0.12, 0.3));
      drop.beginPath();
      drop.moveTo(0, 0);
      drop.lineTo(-4, len);
      drop.strokePath();
      drop.x = x;
      drop.y = startY;

      this.tweens.add({
        targets: drop,
        y: GAME_HEIGHT + 20,
        duration: Phaser.Math.Between(900, 1600),
        delay: Phaser.Math.Between(0, 1500),
        repeat: -1,
        ease: "Linear"
      });
    }
  }

  drawHeader(cx) {
    this.add.text(cx, 46, "1:00 AM — Harlow Manor", {
      fontFamily: "Cinzel, Georgia, serif",
      fontSize: "17px",
      fontStyle: "600",
      color: GOLD,
      resolution: TEXT_RESOLUTION
    }).setOrigin(0.5).setDepth(10).setShadow(0, 2, "rgba(0,0,0,0.7)", 3, true, true);

    // small ornamental divider under the header, echoes the plaque's gem accents
    const dividerY = 68;
    const line = this.add.graphics().setDepth(10);
    line.lineStyle(1, BRONZE, 0.8);
    line.lineBetween(cx - 70, dividerY, cx - 12, dividerY);
    line.lineBetween(cx + 12, dividerY, cx + 70, dividerY);
    line.fillStyle(0x6b1f22, 1);
    line.fillCircle(cx, dividerY, 3);
    line.lineStyle(1, BRONZE, 1);
    line.strokeCircle(cx, dividerY, 3);
  }

  drawTextPanel(cx) {
    const w = 620, h = 300, x = cx - w / 2, y = 95;

    const panel = this.add.graphics().setDepth(5);
    panel.fillStyle(0x140d0a, 0.82);
    panel.fillRoundedRect(x, y, w, h, 10);
    panel.lineStyle(1, BRONZE_DARK, 1);
    panel.strokeRoundedRect(x, y, w, h, 10);

    this.bodyText = this.add.text(cx, y + h / 2, "", {
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      fontSize: "17px",
      fontStyle: "italic",
      color: PARCHMENT,
      align: "center",
      wordWrap: { width: w - 70 },
      lineSpacing: 10,
      resolution: TEXT_RESOLUTION
    }).setOrigin(0.5, 0.5).setDepth(10);

    // small "1 / 3" style progress indicator, upper-right of the panel
    this.progressText = this.add.text(x + w - 14, y + 12, "", {
      fontFamily: "Cinzel, Georgia, serif",
      fontSize: "11px",
      color: GOLD_DIM,
      resolution: TEXT_RESOLUTION
    }).setOrigin(1, 0).setDepth(10);
  }

  drawVignette() {
    const vig = this.add.graphics().setDepth(15);
    vig.fillStyle(0x000000, 0.5);
    vig.fillEllipse(0, 0, 260, 260);
    vig.fillEllipse(GAME_WIDTH, 0, 260, 260);
    vig.fillEllipse(0, GAME_HEIGHT, 260, 260);
    vig.fillEllipse(GAME_WIDTH, GAME_HEIGHT, 260, 260);
  }

  get currentLine() {
    return LINES[this.lineIndex];
  }

  advanceType() {
    if (this.lineDone) return;
    this.revealed += CHARS_PER_TICK;
    const text = this.currentLine;
    if (this.revealed >= text.length) {
      this.revealed = text.length;
      this.finishLineTyping();
    }
    this.bodyText.setText(text.slice(0, this.revealed));
  }

  skipToEndOfLine() {
    this.revealed = this.currentLine.length;
    this.bodyText.setText(this.currentLine);
    this.finishLineTyping();
  }

  finishLineTyping() {
    if (this.lineDone) return;
    this.lineDone = true;
    this.progressText.setText(`${this.lineIndex + 1} / ${LINES.length}`);
    this.tweens.add({ targets: this.prompt, alpha: 1, duration: 400 });
  }

  advanceLine() {
    if (this.lineIndex >= LINES.length - 1) {
      this.leaveScene();
      return;
    }
    this.lineIndex++;
    this.revealed = 0;
    this.lineDone = false;
    this.bodyText.setText("");
    this.progressText.setText(`${this.lineIndex + 1} / ${LINES.length}`);
    this.prompt.setAlpha(0);
  }

  leaveScene() {
    this.typeTimer.remove();
    this.scene.start(SCENE_KEYS.BRIEFING);
  }
}