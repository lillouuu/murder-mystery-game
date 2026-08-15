// config/nesPropFrames.js
// Named regions on assets/interior/nes_mansion_tileset.png.
// Coordinates came from a proper sprite-mapping tool (TexturePacker-style
// JSON export), not eyeballed -- these are exact. { x, y, w, h } in source
// pixels, top-left corner of each piece's footprint.

export const NES_PROP_FRAMES = {
  // -- floor / wall / door (used per-cell by buildRoomNES) --
  FLOOR:        { x: 159, y: 123, w: 16, h: 16 }, // general indoor floor tile
  FLOOR_GARDEN: { x: 185, y: 299, w: 20, h: 20 }, // exterior / garden ground
  WALL_TOP:     { x: 8,   y: 256, w: 16, h: 8  }, // wall cap trim
  WALL_BASE:    { x: 8,   y: 264, w: 16, h: 16 }, // main wall tile
  DOOR:         { x: 41,   y: 49, w: 15, h: 32 }, // closed double door, 2 cells tall
  DOOR_OPEN:    { x: 9,   y: 81,  w: 32, h: 32 }, // open doorway (arch look)
  DOOR_FRAME_SIMPLE: { x: 208, y: 81, w: 16, h: 28 },
  WINDOW:       { x: 178, y: 57, w: 30, h: 23 }, // open window
  WINDOW_PLAIN: { x: 105, y: 8,  w: 30, h: 24 }, // window, no curtains

  // -- study / library --
  HUGE_CUPBOARD: { x: 9, y: 49, w:47 , h: 32 }, // bookcase-style wall unit
  CUPBOARD:      { x: 8, y: 8,  w: 15, h:40},
  CLOCK:         { x: 24, y: 8,  w: 17, h: 40 },
  RUG:           { x: 152, y: 57, w: 23, h: 33 },
  PIC:           { x: 55, y: 95, w: 16, h: 16 }, // small framed picture
  DOUBLE_SOFA_BACK:  { x: 7,  y: 120, w: 34, h: 23 },
  DOUBLE_SOFA_ABOVE: { x: 10, y: 145, w: 29, h: 21 },
  SOFA_BACK_UP:  { x: 57, y: 144, w: 15, h: 23 }, // single chair, facing up/away
  SOFA_BACK_DOWN : { x: 55, y: 120, w: 18, h: 25 },
  TABLE_STUDY:   { x: 103, y: 152, w: 33, h: 25 },
  MIRROR:       { x: 175, y: 161, w: 17, h: 40 },
  SMALL_MIRROR: { x: 128, y: 86,  w: 25, h: 27 },

  // -- bedroom --
  DOUBLE_BED: { x: 117, y: 120, w: 27, h: 33 },
  SIMPLE_BED: { x: 103, y: 120,   w: 18, h: 32 },
  NIGHT_STAND: { x: 56, y: 10,   w: 16, h: 30 },

  // -- parlor --
  SOFA2_LEFT:  { x: 71, y: 120, w: 14, h: 42 },
  SOFA2_RIGHT: { x: 90, y: 120, w: 14, h: 42 },
  DINING_TABLE: { x: 70, y: 8, w: 34, h: 32 },
  BILLIARD_TABLE: { x: 280, y: 296, w: 40, h: 33 }, // "room game"

  // -- kitchen --
  SINK:          { x: 152, y: 39,  w: 15, h: 19 },
  COOKER:        { x: 176, y: 265, w: 16, h: 22 },
  KITCHEN_STAND: { x: 137, y: 39,  w: 14, h: 18 },
  WASHER:        { x: 103, y: 240, w: 16, h: 17 },
  FRIDGE:        { x:137,  y:224,  w:15,  h:33  },

  // -- conservatory / garden --
  PLANTS:      { x: 127, y: 313, w: 15, h: 17 },
  PLANTS_1:    { x: 96, y: 296, w: 15, h: 17 },
  PLANT:       { x: 75, y: 313, w: 9, h: 14 },
  WALL_PLANTS: { x: 38, y: 310, w: 34, h: 17 },
  WALKWAY_H:   { x: 144, y: 314, w: 19, h: 13 },
  WALKWAY_V:   { x: 152, y: 296, w: 15, h: 17 },
};