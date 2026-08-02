// Two-pane case-file dossier: a roster list on the left (victim + every
// suspect, small portrait + name), and a detail pane on the right showing
// whichever person is selected. Portraits are cropped straight from the
// existing NPC spritesheets (their default facing-down frame) — no new
// art assets needed, since the sheet's first frame IS a clean portrait
// shot at 96x128, and a div sized exactly that crops it automatically.

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
function hexToCss(hex) {
  return "#" + hex.toString(16).padStart(6, "0");
}

// roster: [{ id, name, subtitle, textureSrc, tint, detailHTML }]
export function showDossier(title, roster, continueLabel, onContinue) {
  const overlay = ensureOverlay();
  overlay.querySelector(".dossier-title").textContent = title;

  const rosterEl = overlay.querySelector(".dossier-roster");
  const detailEl = overlay.querySelector(".dossier-detail");
  rosterEl.innerHTML = "";

  function selectPerson(person, btnEl) {
    rosterEl.querySelectorAll(".dossier-roster-item").forEach((el) => el.classList.remove("active"));
    btnEl.classList.add("active");
    detailEl.innerHTML = `
      <div class="dossier-portrait-large" style="background-image:url(${person.textureSrc})">
        <div class="dossier-tint-overlay" style="background-color:${hexToCss(person.tint)}"></div>
      </div>
      <div class="dossier-detail-text">
        <h2>${person.name}</h2>
        <p class="dossier-subtitle">${person.subtitle}</p>
        ${person.detailHTML}
      </div>
    `;
    detailEl.scrollTop = 0;
  }

  roster.forEach((person, i) => {
    const item = document.createElement("button");
    item.className = "dossier-roster-item";
    item.innerHTML = `
      <div class="dossier-portrait-small" style="background-image:url(${person.textureSrc})">
        <div class="dossier-tint-overlay" style="background-color:${hexToCss(person.tint)}"></div>
      </div>
      <span>${person.name}</span>
    `;
    item.addEventListener("click", () => selectPerson(person, item));
    rosterEl.appendChild(item);
    if (i === 0) selectPerson(person, item);
  });

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