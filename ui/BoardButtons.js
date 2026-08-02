// ui/BoardButtons.js
// Injects the two always-visible corner buttons once. Imported for its
// side effect in main.js — nothing else needs to call this directly.

import { openCluesBoard } from "./CluesBoard.js";
import { openNotebook } from "./Notebook.js";

function init() {
  if (document.getElementById("board-toggle-buttons")) return;

  const container = document.getElementById("game-container");
  if (!container) return;

  const wrap = document.createElement("div");
  wrap.id = "board-toggle-buttons";
  wrap.innerHTML = `
    <button id="toggle-cluesboard" title="Clues Board">🗂 Clues</button>
    <button id="toggle-notebook" title="Notebook">📓 Notes</button>
  `;
  container.appendChild(wrap);

  wrap.querySelector("#toggle-cluesboard").addEventListener("click", openCluesBoard);
  wrap.querySelector("#toggle-notebook").addEventListener("click", openNotebook);
}

init();