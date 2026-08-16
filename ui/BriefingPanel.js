// Two-pane case-file dossier: a roster list on the left (victim + every
// suspect, small portrait + name), and a detail pane on the right showing
// whichever person is selected.
//
// Portraits are cropped from the NPC spritesheets using a CSS background
// trick: the sheet is 832x256 sliced into 64x64 cells (13 cols x 4 rows,
// only cols 0-8 per row have real art). We pick one frame — the "down"
// row's standing pose, row 2 col 0 — and use background-size/position to
// zoom into just that cell, instead of showing the whole sheet squished
// into the box. Sizes are set inline so this doesn't depend on whatever
// width/height happens to be in the stylesheet for these classes.

const SHEET_W = 832;
const SHEET_H = 256;
const FRAME = 64;
const PORTRAIT_ROW = 2; // "down" / facing-camera row
const PORTRAIT_COL = 0; // standing frame, not mid-stride

const SMALL_DISPLAY = 56;  // roster thumbnail, px
const LARGE_DISPLAY = 160; // detail pane portrait, px

let overlayEl=null;

function ensureOverlay(){
    if (overlayEl)return overlayEl;
    overlayEl=document.createElement("div");
    overlayEl.id="briefing-overlay";
    overlayEl.className = "briefing-overlay";
    overlayEl.innerHTML = `
   <div class="briefing-panel dossier-panel">
      <div class="dossier-title"></div>
      <div class="dossier-body">
        <div class="dossier-roster"></div>
        <div class="dossier-detail"></div>
      </div>
      <button class="briefing-continue-btn"></button>
    </div>
  `;
   document.body.appendChild(overlayEl);
    return overlayEl;

}

// Builds the inline style string that crops a single 64x64 frame out of
// the full sheet and scales it up to `displaySize` px, crisp pixel-art style.
function portraitStyle(textureSrc, displaySize) {
  const scale = displaySize / FRAME;
  const bgW = SHEET_W * scale;
  const bgH = SHEET_H * scale;
  const posX = -(PORTRAIT_COL * FRAME * scale);
  const posY = -(PORTRAIT_ROW * FRAME * scale);
  return [
    `width:${displaySize}px`,
    `height:${displaySize}px`,
    `background-image:url(${textureSrc})`,
    `background-repeat:no-repeat`,
    `background-size:${bgW}px ${bgH}px`,
    `background-position:${posX}px ${posY}px`,
    `image-rendering:pixelated`
  ].join(";");
}

// roster: [{ id, name, subtitle, textureSrc, detailHTML }]
// roster: [{ id, name, subtitle, textureSrc, detailHTML }]
// initialId (optional): which roster entry to open on, by id. Falls back
// to the first entry (the victim, in BriefingScene's case) when omitted
// or not found — lets callers like SuspectScene open straight to whichever
// suspect the player is currently talking to.
export function showDossier(title, roster, continueLabel, onContinue, initialId) {
  const overlay = ensureOverlay();
  overlay.querySelector(".dossier-title").textContent = title;

  const rosterEl = overlay.querySelector(".dossier-roster");
  const detailEl = overlay.querySelector(".dossier-detail");
  rosterEl.innerHTML = "";

  function selectPerson(person, btnEl) {
    rosterEl.querySelectorAll(".dossier-roster-item").forEach((el) => el.classList.remove("active"));
    btnEl.classList.add("active");
    detailEl.innerHTML = `
      <div class="dossier-portrait-large" style="${portraitStyle(person.textureSrc, LARGE_DISPLAY)}"></div>
      <div class="dossier-detail-text">
        <h2>${person.name}</h2>
        <p class="dossier-subtitle">${person.subtitle}</p>
        ${person.detailHTML}
      </div>
    `;
    detailEl.scrollTop = 0;
  }

  let initialItem = null;
  let initialButton = null;

  roster.forEach((person, i) => {
    const item = document.createElement("button");
    item.className = "dossier-roster-item";
    item.innerHTML = `
      <div class="dossier-portrait-small" style="${portraitStyle(person.textureSrc, SMALL_DISPLAY)}"></div>
      <span>${person.name}</span>
    `;
    item.addEventListener("click", () => selectPerson(person, item));
    rosterEl.appendChild(item);
    if (person.id === initialId) {
      initialItem = person;
      initialButton = item;
    }
    if (i === 0 && !initialId) {
      initialItem = person;
      initialButton = item;
    }
  });
  if (!initialItem && roster.length) {
    initialItem = roster[0];
    initialButton = rosterEl.querySelector(".dossier-roster-item");
  }
  if (initialItem) selectPerson(initialItem, initialButton);

  const btn = overlay.querySelector(".briefing-continue-btn");
  btn.textContent = continueLabel;
  const freshBtn = btn.cloneNode(true);
  btn.replaceWith(freshBtn);
  freshBtn.addEventListener("click", () => {
    hideBriefing();
    onContinue();
  });

  overlay.style.display = "flex";
}

export function hideBriefing() {
  if (overlayEl) overlayEl.style.display = "none";
}