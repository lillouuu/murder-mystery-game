// entities/Player.js
// Self-contained player controller. One instance per scene.
// Sheet is 832x256 sliced into 64x64 cells -> 13 cols x 4 rows, 9 real
// walk-cycle frames per row (cols 9-12 are blank filler, never referenced).
// Row order (verified by eye, double-check in-game): row0 = up, row1 = left,
// row2 = down, row3 = right. Unlike the old pose-library sheet, this one
// is a real walk cycle, so we play actual animations instead of swapping
// to a single static frame.

import { PLAYER_SPEED } from "../config/constants.js";

function isTypingElsewhere() {
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || el.isContentEditable;
}

export default class Player {
  constructor(scene, x, y, textureKey = "player") {
    this.scene = scene;
    this.textureKey = textureKey;
    this.sprite = scene.physics.add.sprite(x, y, textureKey);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setScale(1); // 64x64 source, actual character art is ~30x53 within that cell — 1:1 reads well at this room scale; tune if it feels too big/small
    this.sprite.setSize(24, 16).setOffset(20, 46); // tight hitbox around the feet, in source-pixel units

    this.cursors = scene.input.keyboard.createCursorKeys();
    this.wasd = scene.input.keyboard.addKeys("W,A,S,D");

    // 13 columns per row now  since the sheet slices cleanly into
    // 64x64 cells — each row's first frame is row_index * 13.
    this.facingFrame = {
      up: 0,
      left: 13,
      right: 26,
      down: 39
    };
     this.createAnims();
    this.facing = "down";
    this.sprite.setFrame(this.facingFrame.down); // standing-still pose, col 0 of the "down" row

  }
  // Registered on the scene's global anim manager, so this only needs to
  // run once even though a new Player() is created per scene.
  createAnims() {
    const anims = this.scene.anims;
    const dirs = [
      ["up", this.facingFrame.up],
      ["left", this.facingFrame.left],
      ["down", this.facingFrame.down],
      ["right", this.facingFrame.right]
    ];
    dirs.forEach(([dir, start]) => {
      const key = `${this.textureKey}-walk-${dir}`;
      if (anims.exists(key)) return;
      anims.create({
        key,
        frames: anims.generateFrameNumbers(this.textureKey, { start, end: start + 8 }),
        frameRate: 10,
        repeat: -1
      });
    });
  }

  update() {
    if (isTypingElsewhere()) {
      this.sprite.setVelocity(0, 0);
      this.sprite.anims.stop();
      this.sprite.setFrame(this.facingFrame[this.facing]);
      return;
    }

    const left = this.cursors.left.isDown || this.wasd.A.isDown;
    const right = this.cursors.right.isDown || this.wasd.D.isDown;
    const up = this.cursors.up.isDown || this.wasd.W.isDown;
    const down = this.cursors.down.isDown || this.wasd.S.isDown;

    let vx = 0;
    let vy = 0;

    if (left) { vx = -PLAYER_SPEED; this.sprite.setFrame(this.facingFrame.left); }
    else if (right) { vx = PLAYER_SPEED; this.sprite.setFrame(this.facingFrame.right); }
    else if (up) { vy = -PLAYER_SPEED; this.sprite.setFrame(this.facingFrame.up); }
    else if (down) { vy = PLAYER_SPEED; this.sprite.setFrame(this.facingFrame.down); }

    if (up && (left || right)) vy = -PLAYER_SPEED;
    if (down && (left || right)) vy = PLAYER_SPEED;

    const isMoving = left || right || up || down;

    if (isMoving) {
      this.sprite.anims.play(`${this.textureKey}-walk-${this.facing}`, true);
    } else {
      this.sprite.anims.stop();
      this.sprite.setFrame(this.facingFrame[this.facing]); // standing pose facing whichever way we last walked
    }

    this.sprite.setVelocity(vx, vy);
  }

  get x() { return this.sprite.x; }
  get y() { return this.sprite.y; }
}
 