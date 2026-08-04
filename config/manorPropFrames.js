// config/manorPropFrames.js
// Named regions on assets/interior/manor_props.png. Unlike propFrames.js,
// these coordinates weren't read off a screenshot by eye — they came from
// auto-detecting each piece's exact bounding box (connected-component
// analysis against the sheet's flat background), then visually confirmed
// one by one. Should not have the mis-crop problem the first pass had.

export const MANOR_PROP_FRAMES = {
  ARMCHAIR:            { x: 75,   y: 22,  w: 52,  h: 64 },
  WARDROBE:            { x: 1169, y: 43,  w: 85,  h: 131 },
  VANITY:              { x: 478,  y: 86,  w: 89,  h: 71 },
  NIGHTSTAND:          { x: 789,  y: 123, w: 40,  h: 52 },
  CHAIR_GREEN:         { x: 29,   y: 167, w: 30,  h: 59 },
  MIRROR:              { x: 603,  y: 174, w: 51,  h: 62 },
  BUST:                { x: 402,  y: 179, w: 22,  h: 36 },
  CLOCK_MANTEL:        { x: 353,  y: 186, w: 39,  h: 29 },
  CABINET_GLASS:       { x: 352,  y: 236, w: 103, h: 125 },
  CONSOLE_TABLE:       { x: 468,  y: 301, w: 86,  h: 60 },
  BOOKSHELF_TALL:      { x: 23,   y: 394, w: 66,  h: 118 },
  BOOKSHELF_BOOKS:     { x: 93,   y: 407, w: 64,  h: 105 },
  FIREPLACE_BRICK:     { x: 469,  y: 409, w: 77,  h: 102 },
  FIREPLACE_STONE:     { x: 550,  y: 409, w: 43,  h: 102 },
  STOVE:               { x: 661,  y: 407, w: 90,  h: 103 },
  PANTRY_SHELF:        { x: 754,  y: 419, w: 86,  h: 89 },
  COOK_COUNTER:        { x: 850,  y: 436, w: 108, h: 74 },
  CHANDELIER:          { x: 980,  y: 437, w: 77,  h: 71 },
  CLOCK_GRANDFATHER:   { x: 26,   y: 521, w: 48,  h: 109 },
  LONG_BENCH:          { x: 387,  y: 545, w: 168, h: 85 },
  BED_CANOPY:          { x: 671,  y: 23,  w: 114, h: 194 },
  PICTURE_FRAME_EMPTY: { x: 926,  y: 635, w: 40,  h: 50 },
  LAMP_TABLE:          { x: 927,  y: 703, w: 30,  h: 65 }
};