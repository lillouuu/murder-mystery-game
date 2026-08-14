// ui/ForensicReportPanel.js
// Same DOM-overlay pattern as Notebook / CluesBoard / TheoryBoard.
// Unlike Study/suspect room clues (which need a click on a marker),
// every forensic finding is auto-collected into the corkboard's clue pool
// the moment this panel opens — the whole point of the report existing is
// that it's handed to the detective all at once, not scattered pickups.

import { forensicReport } from "../data/solution.data.js";
import { collectClue } from "../state/Corkboardstate.js";

let overlayEl = null;
let onCloseCallback = null;

function ensureOverlay() {
  if (overlayEl) return overlayEl;

  overlayEl = document.createElement("div");
  overlayEl.id = "forensic-overlay";
  overlayEl.className = "board-overlay";
  overlayEl.innerHTML = `
    <div class="notebook-panel forensic-panel">
      <div class="board-header">
        <span>${forensicReport.title}</span>
        <div class="board-header-actions">
          <button id="forensic-close">Close</button>
        </div>
      </div>
      <div id="forensic-meta">
        Filed by ${forensicReport.filedBy} &middot; Time of death: ${forensicReport.timeOfDeath}<br/>
        Official cause: ${forensicReport.officialCause}
      </div>
      <div id="forensic-findings"></div>
    </div>
  `;
  document.body.appendChild(overlayEl);

  const list = overlayEl.querySelector("#forensic-findings");
  forensicReport.findings.forEach((finding) => {
    const card = document.createElement("div");
    card.className = "forensic-finding";
    card.innerHTML = `
      <div class="forensic-finding-title">${finding.title}</div>
      <div class="forensic-finding-detail">${finding.detail}</div>
    `;
    list.appendChild(card);
  });

  overlayEl.querySelector("#forensic-close").addEventListener("click", closeForensicReportPanel);

  return overlayEl;
}

export function openForensicReportPanel(onClose) {
  ensureOverlay();
  onCloseCallback = onClose || null;

  // Auto-collect every finding as a clue right away — collectClue() already
  // dedupes by id, so opening this panel more than once is harmless.
  forensicReport.findings.forEach((finding) => {
    collectClue(
      { id: finding.id, name: finding.title, description: finding.detail },
      "Forensic Report"
    );
  });

  overlayEl.style.display = "flex";
  setGameKeyboardEnabled(false);
}

export function closeForensicReportPanel() {
  if (overlayEl) overlayEl.style.display = "none";
  setGameKeyboardEnabled(true);
  if (onCloseCallback) onCloseCallback();
}

export function isForensicReportPanelOpen() {
  return !!overlayEl && overlayEl.style.display === "flex";
}

let savedCaptures = null;

function setGameKeyboardEnabled(enabled) {
  const keyboard = window.game && window.game.input && window.game.input.keyboard;
  if (!keyboard) return;
  keyboard.enabled = enabled;
  keyboard.preventDefault = enabled;

  if (!enabled) {
    savedCaptures = keyboard.captures.slice();
    keyboard.captures = [];
  } else if (savedCaptures) {
    keyboard.captures = savedCaptures;
    savedCaptures = null;
  }
}