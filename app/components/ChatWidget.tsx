"use client"
import { useState } from "react"

type Message = { role: "user" | "assistant"; content: string }

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [dark, setDark] = useState(true)
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm the Kenmark AI assistant. How can I help you today?" }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  function getSessionId() {
    let id = localStorage.getItem("chat_session")
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem("chat_session", id)
    }
    return id
  }

  async function sendMessage() {
    if (!input.trim() || loading) return

    const userMessage = input
    const sessionId = getSessionId()

    setMessages(prev => [...prev, { role: "user", content: userMessage }])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, sessionId })
      })

      const data = await res.json()
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }])
    } catch {
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "Error connecting to AI backend." }
      ])
    } finally {
      setLoading(false)
    }
  }

  const theme = dark
    ? {
        shell: "bg-gray-900 border-gray-700",
        header: "bg-gray-800 text-white",
        body: "bg-gray-900",
        input: "bg-gray-700 text-white",
        user: "bg-blue-600 text-white",
        bot: "bg-gray-700 text-gray-100",
        typing: "bg-gray-700 text-gray-300"
      }
    : {
        shell: "bg-white border-gray-200",
        header: "bg-gray-100 text-gray-900",
        body: "bg-white",
        input: "bg-gray-100 text-black",
        user: "bg-blue-600 text-white",
        bot: "bg-gray-200 text-gray-900",
        typing: "bg-gray-200 text-gray-500"
      }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-full shadow-xl"
      >
        Chat with AI
      </button>

      {open && (
        <div
          className={`fixed bottom-24 right-6 w-96 h-[540px] rounded-2xl shadow-2xl border flex flex-col overflow-hidden ${theme.shell}`}
        >
          <div className={`p-4 font-semibold flex items-center justify-between ${theme.header}`}>
            <span>Kenmark AI Assistant</span>
            <div className="flex gap-3">
              <button onClick={() => setDark(!dark)} className="text-sm opacity-80 hover:opacity-100">
                {dark ? "🌙" : "☀️"}
              </button>
              <button onClick={() => setOpen(false)} className="opacity-80 hover:opacity-100">
                ✕
              </button>
            </div>
          </div>

          <div className={`flex-1 p-4 space-y-3 overflow-y-auto ${theme.body}`}>
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm leading-relaxed ${
                  m.role === "user" ? `ml-auto ${theme.user}` : theme.bot
                }`}
              >
                {m.content}
              </div>
            ))}

            {loading && (
              <div className={`px-4 py-2 rounded-2xl w-fit animate-pulse ${theme.typing}`}>
                Kenmark is typing...
              </div>
            )}
          </div>

          <div className={`p-3 flex gap-2 ${theme.header}`}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
              placeholder="Type your message..."
              className={`flex-1 px-4 py-2 rounded-xl outline-none ${theme.input} disabled:opacity-50`}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 rounded-xl disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  )
}
