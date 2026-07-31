// config/keys.js
// Every string identifier used across the project lives here.
// Nothing anywhere else should hardcode a scene name, texture name, or suspect id —
// import from here instead. This is what prevents typo bugs like "SudyScene" vs "StudyScene".

export const SCENE_KEYS = {
  BOOT: "BootScene",
  TITLE: "TitleScene",
  STUDY: "StudyScene",
  HALLWAY: "HallwayScene",
  SUSPECT: "SuspectScene",
  GRAND_HALL: "GrandHallScene",
  ACCUSATION: "AccusationScene"
  
};

// Texture/spritesheet keys — must match what's loaded in BootScene.js
export const TEXTURE_KEYS = {
  PLAYER: "player",
  TILES: "tiles",
  AGNES: "agnes",
  EDWARD: "edward",
  ELEANOR: "eleanor",
  EDMUND: "edmund",
  ROSE: "rose",
  VICTIM: "victim"
};

// Suspect ids — must match the `id` field inside each suspect's data.js
// and the key used when launching SuspectScene, e.g.
// this.scene.start(SCENE_KEYS.SUSPECT, { suspectId: SUSPECT_IDS.AGNES })
export const SUSPECT_IDS = {
  AGNES: "agnes",
  EDWARD: "edward",
  ELEANOR: "eleanor",
  EDMUND: "edmund",
  ROSE: "rose"
};

// Animation keys, shared by Player.js and NPC.js
export const ANIM_KEYS = {
  WALK_DOWN: "walk-down",
  WALK_LEFT: "walk-left",
  WALK_RIGHT: "walk-right",
  WALK_UP: "walk-up"
};

export const TINTS = {
  agnes: 0x8a9a8a,
  edward: 0x3a3a4a,
  eleanor: 0x9a5a6a,
  edmund: 0x6a5a4a,
  rose: 0xc08a9a,
  victim: 0x6a8a6a
};