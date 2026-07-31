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
    <button id="dialogue-close">Close</button>
  `;
  document.body.appendChild(boxEl);
  boxEl.querySelector("#dialogue-close").addEventListener("click", hide);
  return boxEl;
}
// 
export function showClue(name, description) {
  const box = ensureBox();
  box.querySelector("#dialogue-title").textContent = name;
  box.querySelector("#dialogue-text").innerHTML = "";
  box.querySelector("#dialogue-text").textContent = description;
  box.style.display = "block";
}

export function showQuestions(suspectName, dialogueList ,onPickQuestion){
    const box=ensureBox();
    box.querySelector("#dialogue-title")=suspectName;

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

export function showAnswer(question, answer) {
  const box = ensureBox();
  box.querySelector("#dialogue-title").textContent = question;
  box.querySelector("#dialogue-text").textContent = answer;
  box.style.display = "block";
}

export function hide() {
  if (boxEl) boxEl.style.display = "none";
}

export function isVisible() {
  return !!boxEl && boxEl.style.display === "block";
}



export function showDialogueList(npcName,questions,onSelect){
    const box= ensureBox();
    box.querySelector("#dialogue-title").textContent =npcName;
    
    const textEl=box.querySelector("#dialogue-text");
    textEl.innerHTML="";

    const list=document.createElement("div");
    list.id="dialogue-question-list";

    questions.forEach((q)=>{
        const btn= document.createElement("button");
        btn.className="dialogue-question-btn";
        btn.textContent=q.question;
        // arrow function here keeps its own "q" — no closure/loop-variable bug
        btn.addEventListener("click", () => onSelect(q));
        list.appendChild(btn);
    })

    textEl.appendChild(list);
   box.style.display = "block";



}