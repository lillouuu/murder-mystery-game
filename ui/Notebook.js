// ui/Notebook.js
// Same DOM-overlay pattern as DialogueBox / CluesBoard.

import { getNotebookText, setNotebookText } from "../state/Corkboardstate.js";

let overlayEl = null;

export function initNotebook() {
  if (overlayEl) return;

  overlayEl = document.createElement("div");
  overlayEl.id = "notebook-overlay";
  overlayEl.className = "board-overlay";
  overlayEl.innerHTML = `
    <div class="notebook-panel">
      <div class="board-header">
        <span>Detective's Notebook</span>
        <div class="board-header-actions">
          <button id="notebook-close">Close</button>
        </div>
      </div>
      <textarea id="notebook-text" placeholder="Record your theories here. Nothing here is graded — think out loud."></textarea>
    </div>
  `;
  document.body.appendChild(overlayEl);

  const textarea = overlayEl.querySelector("#notebook-text");
  textarea.value = getNotebookText();
  textarea.addEventListener("input", () => setNotebookText(textarea.value));

  overlayEl.querySelector("#notebook-close").addEventListener("click", closeNotebook);
}

export function openNotebook() {
  initNotebook();
  overlayEl.querySelector("#notebook-text").value = getNotebookText();
  overlayEl.style.display = "flex";
  setGameKeyboardEnabled(false);
  overlayEl.querySelector("#notebook-text").focus();
}

export function closeNotebook() {
  if (overlayEl) overlayEl.style.display = "none";
  setGameKeyboardEnabled(true);
}

let savedCaptures = null;

function setGameKeyboardEnabled(enabled) {
   const keyboard = window.game && window.game.input && window.game.input.keyboard;
  if (!keyboard) return;
  keyboard.enabled = enabled;
  // .enabled alone stops Phaser from reading keys, but the DOM-level
  // preventDefault() on captured keys (W/A/S/D) is gated by this separate
  // flag — without clearing it too, typing those letters still gets eaten.
  keyboard.preventDefault = enabled;

  if (!enabled) {
    // Belt-and-suspenders: directly empty the capture list so nothing in
    // it can call preventDefault() on a keystroke while we're typing,
    // regardless of the flags above.
    savedCaptures = keyboard.captures.slice();
    keyboard.captures = [];
  } else if (savedCaptures) {
    keyboard.captures = savedCaptures;
    savedCaptures = null;
  }
}

export function isNotebookOpen() {
  return !!overlayEl && overlayEl.style.display === "flex";
}