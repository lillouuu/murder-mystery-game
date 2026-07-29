// entities/Player.js
// Self-contained player controller. One instance per scene.
// Assumes a spritesheet with 4 rows (down, left, right, up) — adjust
// frame ranges below once you check your Kenney toon-characters sheet layout.

import { PLAYER_SPEED } from "../config/constants.js";

export default class Player {
  constructor(scene, x, y, textureKey = "player") {
    this.scene = scene;
    this.textureKey = textureKey;
    this.sprite = scene.physics.add.sprite(x, y, textureKey);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setScale(0.5); // 96x128 source is large for an 800x500 room — shrink to ~48x64 on screen
    this.sprite.setSize(50, 40).setOffset(23, 80); // tight hitbox around the feet, in source-pixel units

    this.cursors = scene.input.keyboard.createCursorKeys();
    this.wasd = scene.input.keyboard.addKeys("W,A,S,D");

    // This Kenney sheet is a pose library, not a clean walk-cycle strip,
    // so instead of animating we just swap to one static "facing" frame
    // per direction. Simple, always looks correct, zero risk of a glitchy
    // animation from guessed frame ranges. Adjust these frame numbers by
    // eye once you see the sheet in-game — pick whichever frame index
    // faces that direction.
    this.facingFrame = {
      down: 0,
      left: 9,
      right: 18,
      up: 27
    };
    this.sprite.setFrame(this.facingFrame.down);
  }

  update() {
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

    if (!left && !right && !up && !down) {
      // stay on last facing frame, no idle animation needed
    }

    this.sprite.setVelocity(vx, vy);
  }

  get x() { return this.sprite.x; }
  get y() { return this.sprite.y; }
}
