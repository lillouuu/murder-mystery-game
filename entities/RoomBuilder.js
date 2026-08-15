// entities/RoomBuilder.js
//
// Takes a scene + a simple text grid and draws the whole room from it,
// using the tile numbers in config/tileIds.js. One function, reused by
// every room, so adding a 6th room is "write a new grid", not "write
// new tile-placement code."
//
// Grid legend (extend as needed per room):
//   . = floor
//   W = wall (top row of a wall run)
//   w = wall (bottom row of a wall run)
//   D = door (walkable, triggers a transition — handled by Door.js separately)
//   space = empty / outside the room, nothing drawn
//
// Furniture is NOT part of the grid — it's a separate list of
// { tile, x, y } placed on top, since furniture doesn't tile like floor/walls.

import { TILE_SIZE } from "../config/constants.js";
import { TILES } from "../config/tileIds.js";
import { PROP_FRAMES } from "../config/propFrames.js";
import { NES_PROP_FRAMES } from "../config/nesPropFrames.js";

const SOURCE_TILE_SIZE = 16; // actual pixel size in the Kenney sheet
const SCALE = TILE_SIZE / SOURCE_TILE_SIZE; // 32 / 16 = 2x, so rooms don't look tiny

function pick(tileOrArray) {
  // Some tiles (walls, counters) are defined as a 3-wide strip in
  // tileIds.js. For now we just cycle through them left-to-right so a
  // wall run doesn't look like one tile copy-pasted — call this per
  // column index if you want variety, or pass a single number for
  // tiles that only have one frame (floor, door, desk, etc).
  return Array.isArray(tileOrArray) ? tileOrArray : [tileOrArray];
}

export function buildRoom(scene, grid, { originX = 0, originY = 0 } = {}) {
  const floorLayer = scene.add.group();
  const wallGroup = scene.physics.add.staticGroup(); // collidable walls
  const doorZones = []; // returned so the scene can wire Door.js to these

  const rows = grid.map((row) => row.split(""));

  rows.forEach((row, ry) => {
    row.forEach((cell, cx) => {
      const x = originX + cx * TILE_SIZE + TILE_SIZE / 2;
      const y = originY + ry * TILE_SIZE + TILE_SIZE / 2;

      if (cell === "." ) {
        scene.add.image(x, y, "tiles", TILES.FLOOR).setScale(SCALE);
      } else if (cell === "W" || cell === "w") {
        const strip = pick(cell === "W" ? TILES.WALL_TOP : TILES.WALL_BOTTOM);
        const frame = strip[cx % strip.length];
        // floor underneath first, so there's no black gap behind the wall sprite
        scene.add.image(x, y, "tiles", TILES.FLOOR).setScale(SCALE);
        const wall = wallGroup.create(x, y, "tiles", frame);
        wall.setScale(SCALE);
        wall.setSize(SOURCE_TILE_SIZE, SOURCE_TILE_SIZE); // hitbox in source-pixel units, scale handles the rest
      } else if (cell === "D") {
        scene.add.image(x, y, "tiles", TILES.FLOOR).setScale(SCALE);
        scene.add.image(x, y, "tiles", TILES.DOOR).setScale(SCALE);
        doorZones.push({ x, y });
      }
      // space / anything else = draw nothing (outside the room footprint)
    });
  });

  return { wallGroup, doorZones };
}

// Places one furniture piece (or a vertical pair like the large window /
// mirror counter) at a grid cell. Call this after buildRoom() for each
// piece of furniture a room needs.
export function placeFurniture(scene, tileOrPair, gridX, gridY, { originX = 0, originY = 0 } = {}) {
  const x = originX + gridX * TILE_SIZE + TILE_SIZE / 2;
  const y = originY + gridY * TILE_SIZE + TILE_SIZE / 2;

  if (Array.isArray(tileOrPair) && tileOrPair.length === 2) {
    // stacked pair, e.g. TILES.WINDOW_LARGE_TOP/BOTTOM or MIRROR_COUNTER
    scene.add.image(x, y, "tiles", tileOrPair[0]).setScale(SCALE);
    scene.add.image(x, y + TILE_SIZE, "tiles", tileOrPair[1]).setScale(SCALE);
    return;
  }
  scene.add.image(x, y, "tiles", tileOrPair).setScale(SCALE);
}

// One-time setup per scene: carves the named rectangles in a frame dict
// out of a raw image texture so they can be placed like normal sprite
// frames. Safe to call every scene create() — no-ops after the first.
export function registerPropFrames(scene, textureKey = "interiorProps", frames = PROP_FRAMES) {
  const texture = scene.textures.get(textureKey);
  Object.entries(frames).forEach(([name, { x, y, w, h }]) => {
    if (texture.has(name)) return;
    texture.add(name, 0, x, y, w, h);
  });
}

// Places a multi-tile prop (sofa, bookshelf, fireplace, etc) with its
// top-left corner at the given grid cell — unlike placeFurniture, these
// don't get centered on one cell since most span several.
export function placeProp(scene, propName, gridX, gridY, { originX = 0, originY = 0, texture = "interiorProps" } = {}) {
  const x = originX + gridX * TILE_SIZE;
  const y = originY + gridY * TILE_SIZE;
  return scene.add.image(x, y, texture, propName).setOrigin(0, 0).setScale(SCALE);
}

// Same job as buildRoom(), but draws floor/wall/door from the new NES
// mansion sheet (named frames on the "nesProps" texture) instead of
// numeric frames on the old "tiles" spritesheet. Furniture still goes
// through the existing placeProp()/registerPropFrames() pair -- this
// function only replaces the grid pass.
export function buildRoomNES(scene, grid, { originX = 0, originY = 0, floorFrame = "FLOOR", wallFrame = "WALL_BASE", doorFrame = "DOOR" } = {}) {
  const wallGroup = scene.physics.add.staticGroup();
  const doorZones = [];

  registerPropFrames(scene, "nesProps", NES_PROP_FRAMES); // no-op after first call

  const rows = grid.map((row) => row.split(""));

  rows.forEach((row, ry) => {
    row.forEach((cell, cx) => {
      const x = originX + cx * TILE_SIZE + TILE_SIZE / 2;
      const y = originY + ry * TILE_SIZE + TILE_SIZE / 2;

      if (cell === ".") {
        scene.add.image(x, y, "nesProps", floorFrame).setScale(SCALE);
      } else if (cell === "W" || cell === "w") {
        scene.add.image(x, y, "nesProps", floorFrame).setScale(SCALE);
        const wall = wallGroup.create(x, y, "nesProps", wallFrame);
        wall.setScale(SCALE);
        wall.setSize(SOURCE_TILE_SIZE, SOURCE_TILE_SIZE);
      } else if (cell === "D") {
        scene.add.image(x, y, "nesProps", floorFrame).setScale(SCALE);
        // DOOR frame is 2 cells tall -- anchor its bottom to this cell's
        // bottom edge so it rises into the wall row above it.
        scene.add.image(x, y + TILE_SIZE / 2, "nesProps", doorFrame)
          .setOrigin(0.5, 1)
          .setScale(SCALE);
        doorZones.push({ x, y });
      }
    });
  });

  return { wallGroup, doorZones };
}