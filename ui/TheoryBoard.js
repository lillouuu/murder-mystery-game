// ui/TheoryBoard.js
// Same DOM-overlay pattern as Notebook / CluesBoard / DialogueBox: a
// full-page overlay with a textarea, used for the final free-form theory
// the player submits in the Grand Hall. Disables Phaser's global keyboard
// capture while open so W/A/S/D/E/Space type normally instead of moving
// the player or re-triggering game actions.

let overlayEl = null;
let onSubmitCallback = null;

function ensureOverlay() {
  if (overlayEl) return overlayEl;

  overlayEl = document.createElement("div");
  overlayEl.id = "theory-overlay";
  overlayEl.className = "board-overlay";
  overlayEl.innerHTML = `
    <div class="notebook-panel">
      <div class="board-header">
        <span id="theory-prompt">Write Your Theory</span>
        <div class="board-header-actions">
          <button id="theory-close">Close</button>
        </div>
      </div>
      <textarea id="theory-text" placeholder="Name the killer or killers, explain their methods, their motives, and the sequence of events..."></textarea>
      <div id="theory-footer">
        <span id="theory-hint">This is your final theory — there's no undo once submitted.</span>
        <button id="theory-submit">Submit Theory</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlayEl);

  overlayEl.querySelector("#theory-close").addEventListener("click", closeTheoryBoard);

  const textarea = overlayEl.querySelector("#theory-text");
  const submitBtn = overlayEl.querySelector("#theory-submit");

  const submit = () => {
    const text = textarea.value.trim();
    if (!text) return;
    submitBtn.disabled = true;
    textarea.disabled = true;
    if (onSubmitCallback) onSubmitCallback(text);
  };
  submitBtn.addEventListener("click", submit);
  // Stop W/A/S/D/E/Space (and everything else) from reaching Phaser's key
  // handlers while typing — same fix as the custom-question input.
  textarea.addEventListener("keydown", (e) => e.stopPropagation());

  return overlayEl;
}

export function openTheoryBoard(promptText, onSubmit) {
  const overlay = ensureOverlay();
  overlay.querySelector("#theory-prompt").textContent = "Write Your Theory";
  const textarea = overlay.querySelector("#theory-text");
  textarea.value = "";
  textarea.disabled = false;
  textarea.placeholder = promptText || textarea.placeholder;
  overlay.querySelector("#theory-submit").disabled = false;
  onSubmitCallback = onSubmit;

  overlay.style.display = "flex";
  setGameKeyboardEnabled(false);
  textarea.focus();
}

export function closeTheoryBoard() {
  if (overlayEl) overlayEl.style.display = "none";
  setGameKeyboardEnabled(true);
}

export function isTheoryBoardOpen() {
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