// scenes/TitleScene.js

import { GAME_WIDTH, GAME_HEIGHT } from "../config/constants.js";
import { SCENE_KEYS } from "../config/keys.js";
import { gameInfo } from "../data/solution.data.js";

const GOLD = "#e8c987";
const GOLD_DIM = "#a9915f";
const PARCHMENT = "#c9bd94";
const BG_TOP = 0x1c0f0f;
const BG_BOTTOM = 0x0a0605;
const MAROON = 0x4a1518;
const MAROON_LIGHT = 0x6a2226;
const BRONZE = 0x8a6f3f;
const BRONZE_DARK = 0x4a3a20;
const METAL_LIGHT = 0x5a5248;
const METAL_DARK = 0x2a251e;

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.TITLE);
  }

  create() {
    const cx = GAME_WIDTH / 2;

    // Wait for the webfonts to actually be ready, otherwise Phaser bakes
    // the text into the canvas texture using the fallback font on first paint.
    if (document.fonts && document.fonts.ready) {
      document.fonts.load("700 40px Cinzel");
      document.fonts.load("italic 500 16px 'Cormorant Garamond'");
      document.fonts.ready.then(() => this.buildScene(cx));
    } else {
      this.buildScene(cx);
    }
  }

  buildScene(cx) {
    this.drawBackground(cx);
    this.drawMoon();
    this.drawPlaque(cx);
    this.drawDescription(cx);
    this.drawButton(cx);
    this.drawSparkle();
  }

  drawBackground(cx) {
    const g = this.add.graphics();
    g.fillGradientStyle(BG_TOP, BG_TOP, BG_BOTTOM, BG_BOTTOM, 1);
    g.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // soft warm glow behind the plaque
    const glow = this.add.graphics();
    glow.fillStyle(MAROON_LIGHT, 0.25);
    glow.fillEllipse(cx, 95, 420, 220);
    glow.fillStyle(MAROON_LIGHT, 0.15);
    glow.fillEllipse(cx, 95, 560, 300);

    // vignette corners
    const vig = this.add.graphics();
    vig.fillStyle(0x000000, 0.55);
    vig.fillEllipse(0, 0, 260, 260);
    vig.fillEllipse(GAME_WIDTH, 0, 260, 260);
    vig.fillEllipse(0, GAME_HEIGHT, 260, 260);
    vig.fillEllipse(GAME_WIDTH, GAME_HEIGHT, 260, 260);
  }

  drawMoon() {
    const g = this.add.graphics();
    g.fillStyle(0xe8dcae, 0.85);
    g.fillCircle(60, 45, 22);
    // carve the crescent by covering part of the moon with a background-toned circle
    g.fillStyle(BG_TOP, 1);
    g.fillCircle(70, 38, 20);
  }

  drawPlaque(cx) {
    const w = 480, h = 150, x = cx - w / 2, y = 35;

    // outer metal frame
    const frame = this.add.graphics();
    frame.fillGradientStyle(METAL_LIGHT, METAL_LIGHT, METAL_DARK, METAL_DARK, 1);
    frame.fillRoundedRect(x, y, w, h, 14);
    frame.lineStyle(2, BRONZE, 1);
    frame.strokeRoundedRect(x, y, w, h, 14);

    // inner dark panel
    const innerPad = 10;
    const panel = this.add.graphics();
    panel.fillStyle(0x120c0a, 1);
    panel.fillRoundedRect(x + innerPad, y + innerPad, w - innerPad * 2, h - innerPad * 2, 8);
    panel.lineStyle(1, BRONZE_DARK, 1);
    panel.strokeRoundedRect(x + innerPad, y + innerPad, w - innerPad * 2, h - innerPad * 2, 8);

    // corner gems
    [[x + 18, y + 18], [x + w - 18, y + 18], [x + 18, y + h - 18], [x + w - 18, y + h - 18]].forEach(([gx, gy]) => {
      const gem = this.add.graphics();
      gem.fillStyle(0x6b1f22, 1);
      gem.fillCircle(gx, gy, 6);
      gem.lineStyle(1.5, BRONZE, 1);
      gem.strokeCircle(gx, gy, 6);
    });

    // title
    const title = this.add.text(cx, y + 55, gameInfo.title, {
      fontFamily: "Cinzel, Georgia, serif",
      fontSize: "42px",
      fontStyle: "700",
      color: GOLD
    }).setOrigin(0.5);
    title.setStroke("#2a1508", 4);
    title.setShadow(0, 3, "rgba(0,0,0,0.7)", 4, true, true);

    // subtitle banner
    const bannerW = 220, bannerH = 30;
    const banner = this.add.graphics();
    banner.fillStyle(MAROON, 1);
    banner.fillRoundedRect(cx - bannerW / 2, y + h - bannerH - 8, bannerW, bannerH, 6);
    banner.lineStyle(1, BRONZE, 1);
    banner.strokeRoundedRect(cx - bannerW / 2, y + h - bannerH - 8, bannerW, bannerH, 6);

    this.add.text(cx, y + h - bannerH / 2 - 8, gameInfo.subtitle, {
      fontFamily: "Cinzel, Georgia, serif",
      fontSize: "15px",
      color: GOLD
    }).setOrigin(0.5);
  }

  drawDescription(cx) {
    const w = 460, h = 110, x = cx - w / 2, y = 210;

    const panel = this.add.graphics();
    panel.fillStyle(0x1e1710, 0.9);
    panel.fillRoundedRect(x, y, w, h, 8);
    panel.lineStyle(1, BRONZE_DARK, 1);
    panel.strokeRoundedRect(x, y, w, h, 8);

    // TODO(Louu): swap this copy for the final blurb later
    this.add.text(cx, y + h / 2, gameInfo.setting, {
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      fontSize: "17px",
      fontStyle: "italic",
      color: PARCHMENT,
      align: "center",
      wordWrap: { width: w - 50 },
      lineSpacing: 4
    }).setOrigin(0.5);
  }

  drawButton(cx) {
    const w = 260, h = 46, y = 355;
    const x = cx - w / 2;

    const btnBg = this.add.graphics();
    btnBg.fillStyle(MAROON, 1);
    btnBg.fillRoundedRect(x, y, w, h, 6);
    btnBg.lineStyle(1.5, BRONZE, 1);
    btnBg.strokeRoundedRect(x, y, w, h, 6);

    const label = this.add.text(cx, y + h / 2, "Begin the Investigation", {
      fontFamily: "Cinzel, Georgia, serif",
      fontSize: "17px",
      fontStyle: "600",
      color: "#f0e6c8"
    }).setOrigin(0.5);

    const hitZone = this.add.zone(x, y, w, h).setOrigin(0, 0).setInteractive({ useHandCursor: true });

    hitZone.on("pointerover", () => {
      btnBg.clear();
      btnBg.fillStyle(MAROON_LIGHT, 1);
      btnBg.fillRoundedRect(x, y, w, h, 6);
      btnBg.lineStyle(1.5, GOLD_DIM, 1);
      btnBg.strokeRoundedRect(x, y, w, h, 6);
    });
    hitZone.on("pointerout", () => {
      btnBg.clear();
      btnBg.fillStyle(MAROON, 1);
      btnBg.fillRoundedRect(x, y, w, h, 6);
      btnBg.lineStyle(1.5, BRONZE, 1);
      btnBg.strokeRoundedRect(x, y, w, h, 6);
    });
    hitZone.on("pointerdown", () => this.scene.start(SCENE_KEYS.INTRO));
  }

  drawSparkle() {
    const g = this.add.graphics();
    g.fillStyle(0xe8dcae, 0.9);
    const drawDiamond = (cx, cy, r) => {
      g.beginPath();
      g.moveTo(cx, cy - r);
      g.lineTo(cx + r * 0.4, cy);
      g.lineTo(cx, cy + r);
      g.lineTo(cx - r * 0.4, cy);
      g.closePath();
      g.fillPath();
    };
    drawDiamond(GAME_WIDTH - 60, GAME_HEIGHT - 60, 10);

    this.tweens.add({
      targets: g,
      alpha: { from: 0.4, to: 1 },
      duration: 1400,
      yoyo: true,
      repeat: -1
    });
  }
}