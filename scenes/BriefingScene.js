// scenes/BriefingScene.js
// The case file: who the victim is, how he was found, and every person
// of interest with their full backstory — all up front, before the
// player is dropped into the Study to start clicking on clues blind.
// Reopenable later from the Hallway as "Case Notes" — returnTo tells
// this scene where the Continue/Close button should send the player.
import { SCENE_KEYS } from "../config/keys.js";
import { gameInfo } from "../data/solution.data.js";
import { studyData } from "../data/study.data.js";
import { agnesData } from "../data/suspects/agnes.data.js";
import { edwardData } from "../data/suspects/edward.data.js";
import { eleanorData } from "../data/suspects/eleanor.data.js";
import { edmundData } from "../data/suspects/edmund.data.js";
import { roseData } from "../data/suspects/rose.data.js";
import { showDossier } from "../ui/BriefingPanel.js";

const SUSPECTS = [
  { id: "agnes", data: agnesData },
  { id: "edward", data: edwardData },
  { id: "eleanor", data: eleanorData },
  { id: "edmund", data: edmundData },
  { id: "rose", data: roseData }
];
export default class BriefingScene extends Phaser.Scene{
    constructor(){
        super(SCENE_KEYS.BRIEFING);
    }

    init(data){
        this.returnTo=(data && data.returnTo)|| SCENE_KEYS.STUDY;
    }

    create(){
        this.cameras.main.setBackgroundColor("#14100c");
        // First time through (opened from the Title) it leads into the Study.
        // Reopened later as case notes from the Hallway, it just closes.
        const isFirstTime = this.returnTo === SCENE_KEYS.STUDY;
        const continueLabel = isFirstTime ? "Begin the Investigation" : "Close";
        const roster = [
      {
        id: "victim",
        name: `${victimData.fullName} — deceased`,
        subtitle: `Age ${victimData.age} — ${victimData.occupation}`,
        textureSrc: "assets/sprites/npcs/victim.png",
        tint: TINTS.victim,
        detailHTML: `<p>${victimData.personality}</p><p>${victimData.publicBackstory}</p>`
      },
      ...SUSPECTS.map(({ id, data }) => ({
        id,
        name: data.suspectInfo.fullName,
        subtitle: data.suspectInfo.occupation,
        textureSrc: `assets/sprites/npcs/${id}.png`,
        tint: TINTS[id],
        detailHTML: `<p>${data.suspectInfo.personality}</p><p>${data.suspectInfo.publicBackstory ?? data.suspectInfo.backstory}</p>`
      }))
    ];

    showDossier("The Case File", roster, continueLabel, () => {
      this.scene.start(this.returnTo);
    });
  }
}