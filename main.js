import { GAME_WIDTH, GAME_HEIGHT } from "./config/constants.js";
import BootScene from "./scenes/BootScene.js";
import TitleScene from "./scenes/TitleScene.js";
import StudyScene from "./scenes/StudyScene.js";
import SuspectScene from "./scenes/SuspectScene.js";
import GrandHallScene from "./scenes/GrandHallScene.js";
import HallwayScene from "./scenes/HallwayScene.js";
import BriefingScene from "./scenes/BriefingScene.js";
import IntroScene from "./scenes/IntroScene.js";
import "./ui/BoardButtons.js";

const config = {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent : "game-container",
    backgroundColor: "#000000",
    physics: {
    default: "arcade",
    arcade: { gravity: { y: 0 }, debug: false }
   },
    scene: [BootScene, TitleScene, IntroScene,StudyScene, SuspectScene, HallwayScene, GrandHallScene, BriefingScene]

};

const game =new Phaser.Game(config)

// DOM overlays (Notebook, CluesBoard) need to disable Phaser's global
// keyboard capture while open, otherwise WASD keystrokes get swallowed
// by Player movement instead of reaching the textarea.
window.game = game;