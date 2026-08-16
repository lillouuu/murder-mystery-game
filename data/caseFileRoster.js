// data/caseFileRoster.js
// Shared roster-building logic for the "Case File" dossier (ui/BriefingPanel.js
// showDossier). Pulled out of BriefingScene.js so SuspectScene can open the
// same dossier, pre-focused on whichever suspect the player is talking to,
// without duplicating the victim+suspects wiring.

import { victimData } from "./solution.data.js";
import { agnesData } from "./suspects/agnes.data.js";
import { edwardData } from "./suspects/edward.data.js";
import { eleanorData } from "./suspects/eleanor.data.js";
import { edmundData } from "./suspects/edmund.data.js";
import { roseData } from "./suspects/rose.data.js";

const SUSPECTS = [
  { id: "agnes", data: agnesData },
  { id: "edward", data: edwardData },
  { id: "eleanor", data: eleanorData },
  { id: "edmund", data: edmundData },
  { id: "rose", data: roseData }
];

export function buildCaseFileRoster() {
  return [
    {
      id: "victim",
      name: `${victimData.fullName} — deceased`,
      subtitle: `Age ${victimData.age} — ${victimData.occupation}`,
      textureSrc: "assets/sprites/npcs/victim.png",
      detailHTML: `<p>${victimData.personality}</p><p>${victimData.publicBackstory}</p>`
    },
    ...SUSPECTS.map(({ id, data }) => ({
      id,
      name: data.suspectInfo.fullName,
      subtitle: data.suspectInfo.occupation,
      textureSrc: `assets/sprites/npcs/${id}.png`,
      detailHTML: `<p>${data.suspectInfo.personality}</p><p>${data.suspectInfo.publicBackstory ?? data.suspectInfo.backstory}</p>`
    }))
  ];
}