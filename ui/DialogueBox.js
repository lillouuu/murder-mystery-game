// ui/DialogueBox.js
// A single reusable DOM overlay for showing clue text and NPC Q&A.
// Not a Phaser GameObject on purpose — DOM is faster to style and edit.

let boxEl = null;

function ensureBox() {
  if (boxEl) return boxEl;
  boxEl = document.createElement("div");
  boxEl.id = "dialogue-box";
  boxEl.innerHTML = `
    <div id="dialogue-title"></div>
    <div id="dialogue-text"></div>
    <div id="dialogue-box-actions">
      <button id="dialogue-back" style="display:none;">Back to Questions</button>
      <button id="dialogue-close">Close</button>
    </div>
  `;
  document.body.appendChild(boxEl);
  boxEl.querySelector("#dialogue-close").addEventListener("click", hide);
  return boxEl;
}

export function showClue(name, description) {
  const box = ensureBox();
  box.querySelector("#dialogue-title").textContent = name;
  box.querySelector("#dialogue-text").innerHTML = "";
  box.querySelector("#dialogue-text").textContent = description;
  hideBackButton(box);
  box.style.display = "block";
}

export function showQuestions(suspectName, dialogueList ,onPickQuestion){
    const box=ensureBox();
    box.querySelector("#dialogue-title").textContent=suspectName;

    const textEl=box.querySelector("#dialogue-text");
    textEl.innerHTML="";
    
    const list = document.createElement("div");
    list.id="question-list";
    dialogueList.forEach((entry) => {
        const btn=document.createElement("button");
        btn.className="question-btn";
        btn.textContent=entry.question;
        btn.addEventListener("click",()=>onPickQuestion(entry));
        list.appendChild(btn);
        
    });
    textEl.appendChild(list);
    box.style.display="block";
}

export function showAnswer(question, answer, onBack) {
  const box = ensureBox();
  box.querySelector("#dialogue-title").textContent = question;
  box.querySelector("#dialogue-text").textContent = answer;

  const backBtn = box.querySelector("#dialogue-back");
  if (onBack) {
    backBtn.style.display = "inline-block";
    // .onclick (not addEventListener) so re-calling showAnswer replaces the
    // handler instead of stacking a new listener on the same button each time.
    backBtn.onclick = onBack;
  } else {
    hideBackButton(box);
  }

  box.style.display = "block";
}

function hideBackButton(box) {
  const backBtn = box.querySelector("#dialogue-back");
  backBtn.style.display = "none";
  backBtn.onclick = null;
}

export function hide() {
  if (boxEl) boxEl.style.display = "none";
  // Safety net: if the box is hidden while the custom-question input still
  // had focus (e.g. ESC handling elsewhere), make sure movement isn't left
  // permanently disabled.
  setGameKeyboardEnabled(true);
}

// Same pattern as CluesBoard.js / Notebook.js: Phaser's keyboard plugin
// captures W/A/S/D/E/Space at the window level and calls preventDefault on
// them, which stops those characters from ever reaching a focused <input>.
// We only need to suspend it while the custom-question field is focused.
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

export function isVisible() {
  return !!boxEl && boxEl.style.display === "block";
}



export function showDialogueList(npcName, questions, onSelect, customOpts = {}) {
  const box = ensureBox();
  box.querySelector("#dialogue-title").textContent = npcName;
  hideBackButton(box);

  const textEl = box.querySelector("#dialogue-text");
  textEl.innerHTML = "";

  const list = document.createElement("div");
  list.id = "dialogue-question-list";
  questions.forEach((q) => {
    const btn = document.createElement("button");
    btn.className = "dialogue-question-btn";
    btn.textContent = q.question;
    btn.addEventListener("click", () => onSelect(q));
    list.appendChild(btn);
  });
  textEl.appendChild(list);

  if (customOpts.allowCustom) {
    const wrap = document.createElement("div");
    wrap.id = "custom-question-wrap";

    const remaining = customOpts.customRemaining ?? 0;
    const label = document.createElement("div");
    label.id = "custom-question-label";
    label.textContent = remaining > 0
      ? `Ask your own question (${remaining} left)`
      : "No custom questions left";
    wrap.appendChild(label);

    if (remaining > 0) {
      const input = document.createElement("input");
      input.type = "text";
      input.id = "custom-question-input";
      input.placeholder = "Type your question...";
      input.maxLength = 150;

      const submitBtn = document.createElement("button");
      submitBtn.id = "custom-question-submit";
      submitBtn.textContent = "Ask";
      const submit = () => {
        const text = input.value.trim();
        if (!text) return;
        input.disabled = true;
        submitBtn.disabled = true;
        customOpts.onCustomSubmit(text);
      };
      submitBtn.addEventListener("click", submit);
      input.addEventListener("keydown", (e) => {
        // Stop W/A/S/D/E/Space from reaching Phaser's key handlers while
        // typing (moving the player / re-triggering "examine" mid-sentence).
        e.stopPropagation();
        if (e.key === "Enter") submit();
      });
      input.addEventListener("focus", () => setGameKeyboardEnabled(false));
      input.addEventListener("blur", () => setGameKeyboardEnabled(true));

      wrap.appendChild(input);
      wrap.appendChild(submitBtn);
    }

    textEl.appendChild(wrap);
  }

  box.style.display = "block";
}