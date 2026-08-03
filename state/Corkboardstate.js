// state/corkboardState.js
// Plain JS singleton (not Phaser registry) so the DOM-based board/notebook
// overlays can read and write it without caring which scene is active.
// Any UI that wants to stay in sync calls subscribe(fn) and re-renders on change.

const listeners = new Set();

const state = {
  collectedClues: [],  // { id, name, description, room }
  pinned: [],          // { id, type: 'clue'|'note', clueId?, text?, x, y }
  connections: [],     // { id, fromId, toId, color }
  notebookText: ""
};

function notify() {
  listeners.forEach((fn) => fn());
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// ---- Clues (the pool of things the player has actually found in-game) ----

export function collectClue(clue, room) {
  if (state.collectedClues.some((c) => c.id === clue.id)) return;
  state.collectedClues.push({ id: clue.id, name: clue.name, description: clue.description, room });
  notify();
}

export function isClueCollected(clueId) {
  return state.collectedClues.some((c) => c.id === clueId);
}

export function getCollectedClues() {
  return state.collectedClues;
}

// ---- Pinboard items (clues or freeform notes placed on the corkboard) ----

export function isCluePinned(clueId) {
  return state.pinned.some((p) => p.type === "clue" && p.clueId === clueId);
}

export function pinClue(clueId, x, y) {
  if (isCluePinned(clueId)) return;
  const clue = state.collectedClues.find((c) => c.id === clueId);
  if (!clue) return;
  state.pinned.push({ id: `pin_${clueId}`, type: "clue", clueId, x, y });
  notify();
}

export function addTextBlock(x, y) {
  const id = `note_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  state.pinned.push({ id, type: "note", text: "", x, y });
  notify();
  return id;
}

export function updateTextBlock(id, text) {
  const item = state.pinned.find((p) => p.id === id);
  if (item) {
    item.text = text;
    // deliberately no notify() here — same reasoning as movePinned() below.
    // The textarea being typed into is the only thing that renders this
    // text, and a full board re-render on every keystroke destroys and
    // recreates the DOM node mid-input, which drops focus after each
    // character and makes typing look broken.
  }
}

export function movePinned(id, x, y) {
  const item = state.pinned.find((p) => p.id === id);
  if (item) {
    item.x = x;
    item.y = y;
    // deliberately no notify() here — callers update the DOM directly
    // during drag for smoothness, and only need this to persist the value
  }
}
 
export function resizePinned(id, width, height) {
  const item = state.pinned.find((p) => p.id === id);
  if (item) {
    item.width = width;
    item.height = height;
    // same reasoning as movePinned() — resizing fires continuously while
    // the user drags the corner handle, and a re-render mid-drag would
    // destroy the element the browser's native resize is acting on
  }
}

export function setPinnedFontSize(id, fontSize) {
  const item = state.pinned.find((p) => p.id === id);
  if (item) {
    item.fontSize = fontSize;
    notify();
  }
}


export function removePinned(id) {
  state.pinned = state.pinned.filter((p) => p.id !== id);
  state.connections = state.connections.filter((c) => c.fromId !== id && c.toId !== id);
  notify();
}

// ---- Connections (colored strings between two pinned items) ----

export function addConnection(fromId, toId, color) {
  if (fromId === toId) return;
  const exists = state.connections.some(
    (c) => (c.fromId === fromId && c.toId === toId) || (c.fromId === toId && c.toId === fromId)
  );
  if (exists) return;
  state.connections.push({
    id: `conn_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    fromId,
    toId,
    color
  });
  notify();
}

export function removeConnection(id) {
  state.connections = state.connections.filter((c) => c.id !== id);
  notify();
}

// ---- Notebook (free text, persists across every room) ----

export function setNotebookText(text) {
  state.notebookText = text;
  // no notify() — the notebook textarea is the only thing that renders this,
  // and re-rendering it on every keystroke would fight the user's cursor
}

export function getNotebookText() {
  return state.notebookText;
}

export function getState() {
  return state;
}