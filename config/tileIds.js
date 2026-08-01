// config/tileIds.js
// Every raw tile-frame number from tile-picker.html lives here, named.
// Nothing else in the project should hardcode a number like 697 directly —
// import from here so a re-pick later only means editing one file.

export const TILES = {
  FLOOR: 120,

  WALL_TOP: [697, 698, 699],
  WALL_BOTTOM: [872, 873, 874],

  DOOR: 444,

  WINDOW_LARGE_TOP: 158,
  WINDOW_LARGE_BOTTOM: 215,
  WINDOW_SMALL: [45, 46],

  BED: 129,

  BONFIRE: 511,
  WALL_DECOR: [599, 600, 601], // hanging decorations

  COUNTER: [315, 316],
  MIRROR_COUNTER: [200, 257], // top/bottom pair, same pattern as the large window
  ORGANIZER_COUNTER: [311, 386],

  DESK: 250

  // RUGS: filled in once you send those — likely a multi-tile block like the window
};