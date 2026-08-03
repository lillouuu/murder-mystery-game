// ui/CluesBoard.js
// Same DOM-overlay pattern as DialogueBox / Notebook.
// A pinboard: collected clues live in a side tray until pinned onto a large
// scrollable board, freeform notes can be added directly, pins/notes can be
// resized and have their text size adjusted, and connections between two
// pins use whatever color is currently selected in the header swatch.

import {
  getCollectedClues,
  isCluePinned,
  pinClue,
  addTextBlock,
  updateTextBlock,
  removePinned,
  resizePinned,
  setPinnedFontSize,
  addConnection,
  removeConnection,
  getState,
  subscribe
} from "../state/corkboardState.js";

let overlayEl = null;
let unsubscribe = null;
let linkFromId = null; // pin currently selected as the start of a connection

const DEFAULT_FONT_SIZE = 12;
const MIN_FONT_SIZE = 9;
const MAX_FONT_SIZE = 20;
const RESIZE_HANDLE_ZONE = 16; // px, matches roughly where the native resize grip sits

//const LINK_COLORS = ["#c0392b", "#2c7a4b", "#d8b04a", "#5a6ac0"];
//let nextColorIndex = 0;

export function initCluesBoard() {
  if (overlayEl) return;

  overlayEl = document.createElement("div");
  overlayEl.id = "cluesboard-overlay";
  overlayEl.className = "board-overlay";
  overlayEl.innerHTML = `
    <div class="corkboard-panel">
      <div class="board-header">
        <span>Clues Board</span>
        <div class="board-header-actions">
          <label class="corkboard-color-label" title="Color for the next connection you draw">
            Link color
            <input type="color" id="cluesboard-link-color" value="#c0392b">
          </label>
          <button id="cluesboard-add-note">+ Note</button>
          <button id="cluesboard-close">Close</button>
        </div>
      </div>
      <div class="corkboard-body">
        <div class="corkboard-tray" id="corkboard-tray"></div>
        <div class="corkboard-scroll" id="corkboard-scroll">
          <div class="corkboard-board" id="corkboard-board">
            <svg id="corkboard-connections"></svg>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(overlayEl);

  overlayEl.querySelector("#cluesboard-close").addEventListener("click", closeCluesBoard);
  overlayEl.querySelector("#cluesboard-add-note").addEventListener("click", () => {
    const board = overlayEl.querySelector("#corkboard-board");
    const id = addTextBlock(40 + Math.random() * 60, 40 + Math.random() * 60);
    render();
    const textarea = board.querySelector(`[data-id="${id}"] textarea`);
    if (textarea) textarea.focus();
  });

  overlayEl.querySelector("#corkboard-board").addEventListener("click", (e) => {
    if (e.target.id === "corkboard-board" || e.target.id === "corkboard-connections") {
      linkFromId = null;
      render();
    }
  });

  unsubscribe = subscribe(render);
}

export function openCluesBoard() {
  initCluesBoard();
  linkFromId = null;
  render();
  overlayEl.style.display = "flex";
  setGameKeyboardEnabled(false);
}

export function closeCluesBoard() {
  if (overlayEl) overlayEl.style.display = "none";
  setGameKeyboardEnabled(true);
}

function setGameKeyboardEnabled(enabled) {
  const keyboard = window.game && window.game.input && window.game.input.keyboard;
  if (!keyboard) return;
  keyboard.enabled = enabled;
  keyboard.preventDefault = enabled;
}

export function isCluesBoardOpen() {
  return !!overlayEl && overlayEl.style.display === "flex";
}

function render() {
  if (!overlayEl) return;
  renderTray();
  renderBoard();
  renderConnections();
}

function renderTray() {
  const tray = overlayEl.querySelector("#corkboard-tray");
  const clues = getCollectedClues().filter((c) => !isCluePinned(c.id));

  tray.innerHTML = "";
  const heading = document.createElement("div");
  heading.className = "corkboard-tray-heading";
  heading.textContent = "Collected Clues";
  tray.appendChild(heading);

  if (clues.length === 0) {
    const empty = document.createElement("div");
    empty.className = "corkboard-tray-empty";
    empty.textContent = "Nothing new to pin.";
    tray.appendChild(empty);
    return;
  }

  clues.forEach((clue) => {
    const item = document.createElement("div");
    item.className = "corkboard-tray-item";
    item.textContent = clue.name;
    item.title = clue.description;
    item.addEventListener("click", () => {
      pinClue(clue.id, 60 + Math.random() * 120, 40 + Math.random() * 120);
    });
    tray.appendChild(item);
  });
}

function renderBoard() {
  const board = overlayEl.querySelector("#corkboard-board");
  board.querySelectorAll(".corkboard-pin, .corkboard-note").forEach((el) => {
    if (el._resizeObserver) el._resizeObserver.disconnect();
    el.remove();
  });

  const state = getState();
  const clueLookup = new Map(state.collectedClues.map((c) => [c.id, c]));

  state.pinned.forEach((pin) => {
    const card = document.createElement("div");
    card.dataset.id = pin.id;
    card.style.left = `${pin.x}px`;
    card.style.top = `${pin.y}px`;
    if (pin.width) card.style.width = `${pin.width}px`;
    if (pin.height) card.style.height = `${pin.height}px`;

    const fontSize = pin.fontSize || DEFAULT_FONT_SIZE;

    if (pin.type === "clue") {
      const clue = clueLookup.get(pin.clueId);
      card.className = "corkboard-pin";
      if (linkFromId === pin.id) card.classList.add("linking");
      card.innerHTML = `
        <div class="corkboard-card-toolbar">
          <button class="corkboard-link" title="Connect">link</button>
          <button class="corkboard-font-dec" title="Smaller text">A-</button>
          <button class="corkboard-font-inc" title="Larger text">A+</button>
          <button class="corkboard-remove" title="Unpin">&times;</button>
        </div>
        <div class="corkboard-card-body" style="font-size:${fontSize}px">
          <div class="corkboard-pin-title">${clue ? clue.name : "Unknown clue"}</div>
          <div class="corkboard-pin-desc">${clue ? clue.description : ""}</div>
        </div>
      `;
    } else {
      card.className = "corkboard-note";
      card.innerHTML = `
        <div class="corkboard-card-toolbar">
          <button class="corkboard-link" title="Connect">link</button>
          <button class="corkboard-font-dec" title="Smaller text">A-</button>
          <button class="corkboard-font-inc" title="Larger text">A+</button>
          <button class="corkboard-remove" title="Remove">&times;</button>
        </div>
        <div class="corkboard-card-body">
          <textarea style="font-size:${fontSize}px" placeholder="Write a theory...">${pin.text || ""}</textarea>
        </div>
      `;
      const textarea = card.querySelector("textarea");
      textarea.addEventListener("input", () => updateTextBlock(pin.id, textarea.value));
      textarea.addEventListener("mousedown", (e) => e.stopPropagation());
    }

    card.querySelector(".corkboard-remove").addEventListener("click", (e) => {
      e.stopPropagation();
      if (linkFromId === pin.id) linkFromId = null;
      removePinned(pin.id);
    });

    card.querySelector(".corkboard-link").addEventListener("click", (e) => {
      e.stopPropagation();
      if (!linkFromId) {
        linkFromId = pin.id;
        render();
        return;
      }
      if (linkFromId !== pin.id) {
        const colorInput = overlayEl.querySelector("#cluesboard-link-color");
        const color = colorInput ? colorInput.value : "#c0392b";
        addConnection(linkFromId, pin.id, color);
      }
      linkFromId = null;
      render();
    });

    card.querySelector(".corkboard-font-dec").addEventListener("click", (e) => {
      e.stopPropagation();
      setPinnedFontSize(pin.id, Math.max(MIN_FONT_SIZE, fontSize - 1));
    });
    card.querySelector(".corkboard-font-inc").addEventListener("click", (e) => {
      e.stopPropagation();
      setPinnedFontSize(pin.id, Math.min(MAX_FONT_SIZE, fontSize + 1));
    });

    makeDraggable(card, board, pin.id);
    observeResize(card, pin.id);
    board.appendChild(card);
  });
}

function renderConnections() {
  const svg = overlayEl.querySelector("#corkboard-connections");
  const board = overlayEl.querySelector("#corkboard-board");
  const state = getState();

  svg.innerHTML = "";
  state.connections.forEach((conn) => {
    const fromEl = board.querySelector(`[data-id="${conn.fromId}"]`);
    const toEl = board.querySelector(`[data-id="${conn.toId}"]`);
    if (!fromEl || !toEl) return;

    const x1 = fromEl.offsetLeft + fromEl.offsetWidth / 2;
    const y1 = fromEl.offsetTop + fromEl.offsetHeight / 2;
    const x2 = toEl.offsetLeft + toEl.offsetWidth / 2;
    const y2 = toEl.offsetTop + toEl.offsetHeight / 2;

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", conn.color);
    line.setAttribute("stroke-width", "2");
    line.style.cursor = "pointer";
    line.style.pointerEvents = "stroke";
    line.addEventListener("click", () => removeConnection(conn.id));
    svg.appendChild(line);
  });
}

function observeResize(el, id) {
  const ro = new ResizeObserver((entries) => {
    const entry = entries[0];
    if (!entry) return;
    const { width, height } = entry.contentRect;
    resizePinned(id, Math.round(width), Math.round(height));
    renderConnections();
  });
  ro.observe(el);
  el._resizeObserver = ro;
}

function makeDraggable(el, board, id) {
  let dragging = false;
  let offsetX = 0;
  let offsetY = 0;

  el.addEventListener("mousedown", (e) => {
    if (e.target.closest("button, textarea")) return;

    // Don't hijack the browser's native resize-handle drag in the corner.
    const rect = el.getBoundingClientRect();
    const nearBottomRight = rect.right - e.clientX < RESIZE_HANDLE_ZONE &&
      rect.bottom - e.clientY < RESIZE_HANDLE_ZONE;
    if (nearBottomRight) return;

    dragging = true;
    offsetX = e.clientX - el.offsetLeft;
    offsetY = e.clientY - el.offsetTop;
    e.preventDefault();
  });

  window.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    const boardRect = board.getBoundingClientRect();
    let x = e.clientX - offsetX;
    let y = e.clientY - offsetY;
    x = Math.max(0, Math.min(x, boardRect.width - el.offsetWidth));
    y = Math.max(0, Math.min(y, boardRect.height - el.offsetHeight));
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    renderConnections();
  });

  window.addEventListener("mouseup", () => {
    if (!dragging) return;
    dragging = false;
    const state = getState();
    const pin = state.pinned.find((p) => p.id === id);
    if (pin) {
      pin.x = parseFloat(el.style.left);
      pin.y = parseFloat(el.style.top);
    }
  });
}