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
import { showBriefing } from "../ui/BriefingPanel.js";

const SUSPECTS = [agnesData, edwardData, eleanorData, edmundData, roseData];

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
         showBriefing("The Case File", this.buildBodyHTML(), continueLabel, () => {
      this.scene.start(this.returnTo);
    });
  }
 
  buildBodyHTML() {
    const section = (heading, ...paragraphs) => `
      <div class="briefing-section">
        <h3>${heading}</h3>
        ${paragraphs.map((p) => `<p>${p}</p>`).join("")}
      </div>
    `;
 
    const victimSection = section("The Victim", gameInfo.detectiveIntro, gameInfo.setting);
 
    const sceneSection = section(
      `The Scene — ${studyData.name}`,
      studyData.atmosphere,
      studyData.bodyDescription
    );
 
    const rosterHeading = `<div class="briefing-section"><h3>Persons of Interest</h3></div>`;
 
    const suspectSections = SUSPECTS.map((s) =>
      section(`${s.suspectInfo.fullName} — ${s.suspectInfo.occupation}`, s.suspectInfo.backstory)
    ).join("");
 
    return victimSection + sceneSection + rosterHeading + suspectSections;
  }
}