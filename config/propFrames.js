// config/propFrames.js
// Named regions on assets/interior/props.png (the Pixel Crawler interior
// sheet). Coordinates were read off a labeled grid overlay by eye — if any
// prop looks cropped or offset once it's in a room, nudge the numbers here,
// nowhere else needs to change.
//
// Each entry: { x, y, w, h } in *source pixels* (16px tile grid), where
// x/y is the top-left corner of the prop's footprint.

export const PROP_FRAMES = {
  SOFA:          { x: 0,   y: 0,   w: 48, h: 32 },
  CHAIR:         { x: 64,  y: 0,   w: 16, h: 32 },
  ROUND_TABLE:   { x: 96,  y: 0,   w: 32, h: 32 },
  STOVE:         { x: 128, y: 0,   w: 32, h: 32 },
  BOOKSHELF:     { x: 32,  y: 96,  w: 32, h: 48 },
  BED:           { x: 0,   y: 288, w: 32, h: 48 },
  WINDOW_GLASS:  { x: 0,   y: 192, w: 32, h: 32 },
  DOOR_ARCH:     { x: 96,  y: 192, w: 32, h: 32 },
  PLANT_A:       { x: 0,   y: 352, w: 32, h: 32 },
  PLANT_B:       { x: 32,  y: 352, w: 32, h: 32 },
  SIDE_TABLE:    { x: 192, y: 128, w: 16, h: 32 },
  PICTURE_FRAME: { x: 64,  y: 320, w: 16, h: 32 },
  LONG_TABLE:    { x: 224, y: 160, w: 64, h: 32 },
  FIREPLACE:     { x: 288, y: 64,  w: 80, h: 80 },
  LAMP:          { x: 480, y: 256, w: 16, h: 32 },
  BROOM:         { x: 576, y: 352, w: 16, h: 32 }
};