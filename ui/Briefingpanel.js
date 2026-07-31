// ui/BriefingPanel.js
// A full-screen, scrollable DOM overlay for the case file: victim context,
// the crime scene, and every suspect's backstory. Deliberately separate
// from DialogueBox.js — that one is a small bottom-anchored box built for
// a clue description or one line of dialogue, this needs to hold a lot
// more text at once and be comfortably readable.

let overlayEL=null;

function ensureOverlay(){
    if (overlayEL)return overlayEL;
    overlayEL=document.createElement("div");
    overlayEL.id="briefing-overlay";
    overlayEl.className = "briefing-overlay";
    overlayEl.innerHTML = `
    <div class="briefing-panel">
      <div class="briefing-title"></div>
      <div class="briefing-body"></div>
      <button class="briefing-continue-btn"></button>
    </div>
  `;
   document.body.appendChild(overlayEl);
    return overlayEl;

}
// title: string. bodyHTML: prebuilt HTML string (sections/paragraphs).
// continueLabel: text for the single action button. onContinue: called
// after the overlay is hidden, so the scene decides where to go next.
export function showBriefing(title,bodyHTML,continueLabel,onContinue){
    const overlay=ensureOverlay();
    overlay.querySelector(".brieving-title").textContent=title;
    overlay.querySelector(".briefing-body").innerHTML=bodyHTML;

    const btn=overlay.querySelector(".briefing-continue-btn");
    btn.textContent=continueLabel;
  // This panel gets reopened later (Case Notes from the Hallway), and each
  // open needs its own callback — clone-and-replace drops any listener
  // from a previous showBriefing() call before attaching the new one.
   const freshBtn=btn.cloneNode(true);
   btn.replaceWith(freshBtn);
   freshBtn.addEventListener("click",()=>{
    hideBriefing();
    onContinue();
   });
   overlay.style;display="flex";
   overlay.querySelector(".briefing-panel").scrollTop = 0;


}
export function hideBriefing() {
  if (overlayEl) overlayEl.style.display = "none";
}