import {GROQ_API_KEY, GROQ_API_URL, GROQ_MODEL} from "../config/constants.js";

async function callLLM(systemPrompt,userMessage,history=[]) {
    try{
        const res=await fetch(GROQ_API_URL,{
            method: "POST",
            headers:{
                "content-Type":"application/json",
                "Authorization": `Bearer ${GROQ_API_KEY}`
            },
            body :JSON.stringify({
                model:GROQ_MODEL,
                messages : [
                    {
                        role :"system",content: systemPrompt
                    },...history,{
                        role: "user", content: userMessage
                    }
                ]
            })
        });
        if (!res.ok)throw new Error (`API error: ${res.status}`);

        const data= await res.json();
        return data.choices[0].message.content.trim();

    }catch (err){
        console.error("LLM call failed",err);
        return null;
    }
    
}

export async function askSuspect(systemPrompt, playerQuestion, history = []) {
    const reply= await callLLM(systemPrompt,playerQuestion,history);
    return reply ?? "I... have nothing further to say, Detective.";
    
}

export async function checkTheory(suspectContext, playerTheory) {
    const systemPrompt =
    `You are a lenient mystery-game judge. Context about this suspect: ${suspectContext}\n` +
    `The player just wrote a theory about them. Reply with ONLY one word: ` +
    `"ACCEPTED" if they got at least one real thing right (a motive, method, or reasonable suspicion), ` +
    `or "TRYAGAIN" if they are completely off. After the word, add a one-sentence hint on a new line.`;
    const reply= await callLLM(systemPrompt,playerTheory,[]);
    if (!reply) return { accepted : true, hint:""};
    const accepted =reply.toUpperCase().startsWith("ACCEPTED");
    const hint=reply.split("\n").slice(1).join(" ").trim();
    return {accpted , hint};
}

export async function getVerdict( verdictSystemPrompt, playerSolution){
    const reply= await callLLM(verdictSystemPrompt,playerSolution,[]);
    if (!reply){
        return{
            score : null,
            feedback: "Couldn't reach the verdict service — but you made it to the end. Nice work, Detective.",
            verdict : "UNKNOWN"
        };   
    }
    try {
        const clean = reply.replace(/```json|```/g, "").trim();
        return JSON.parse(clean);
    }catch {
    return { score: null, feedback: reply, verdict: "UNKNOWN" };
  }
}
