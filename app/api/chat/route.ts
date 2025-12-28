import { NextResponse } from "next/server"
import fs from "fs"
import crypto from "crypto"

type Message = { role: "user" | "assistant"; content: string }

const sessions = new Map<string, Message[]>()

function getSession(id: string) {
  if (!sessions.has(id)) sessions.set(id, [])
  return sessions.get(id)!
}

export async function POST(req: Request) {
  try {
    const { message, sessionId } = await req.json()

    const id = sessionId || crypto.randomUUID()
    const history = getSession(id)

    history.push({ role: "user", content: message })
    if (history.length > 10) history.shift()

    const filePath = "public/knowledge/company.txt"

    if (!fs.existsSync(filePath)) {
      throw new Error("Company knowledge file missing.")
    }

    const knowledge = fs.readFileSync(filePath, "utf8")

    const conversation = history
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n")

    const prompt = `
You are an AI assistant for Kenmark ITan Solutions.

You must answer ONLY using the information provided in the Company Knowledge.
If the answer is not present in the knowledge, respond exactly:
"I don't have that information yet."

Do NOT use any external knowledge.
Do NOT guess.
Do NOT hallucinate.

Company Knowledge:
${knowledge}

Conversation History:
${conversation}

User Question:
${message}

Answer the user.
`

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://kenmark-ai-chatbot.vercel.app",
        "X-Title": "Kenmark AI Chatbot"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [{ role: "system", content: prompt }]
      })
    })

    const data = await response.json()
    let reply = data?.choices?.[0]?.message?.content || "No response generated."

    history.push({ role: "assistant", content: reply })
    if (history.length > 10) history.shift()

    return NextResponse.json({ reply, sessionId: id })
  } catch (err: any) {
    console.error("CHAT ERROR:", err.message)
    return NextResponse.json(
      { reply: "AI backend error: " + err.message },
      { status: 500 }
    )
  }
}
