import { GAME_WIDTH, GAME_HEIGHT } from "./config/constants.js";
import BootScene from "./scenes/BootScene.js";
import TitleScene from "./scenes/TitleScene.js";
import StudyScene from "./scenes/StudyScene.js";
import SuspectScene from "./scenes/SuspectScene.js";

const config = {
    type: Phaser.AUTO,
    width:GAME_HEIGHT,
    height: GAME_HEIGHT,
    parent : "game_container",
    backgroundColor: "#000000",
    physics: {
    default: "arcade",
    arcade: { gravity: { y: 0 }, debug: false }
   },
    scene: [BootScene, TitleScene, StudyScene, SuspectScene]

};

new Phaser.Game(config)