"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Welcome to Luxury Villas Dubrovnik! ☀️ I'm your AI concierge. Whether you're dreaming of a city escape near Dubrovnik's Old City walls or a secluded island retreat on Šipan — I'm here to help you find the perfect villa. How may I assist you?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [msgCount, setMsgCount] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading || msgCount >= 20) return;

    const userMsg: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setMsgCount((c) => c + 1);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();

      if (data.error) {
        setMessages([
          ...newMessages,
          { role: "assistant", content: data.error },
        ]);
      } else {
        setMessages([
          ...newMessages,
          { role: "assistant", content: data.message },
        ]);
      }
    } catch {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Ups, nešto je pošlo krivo. Pokušajte ponovno.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto">
      {/* Demo Banner */}
      <div className="bg-amber-700 text-white text-center py-1.5 text-xs font-medium tracking-wide">
        ✨ AI CONCIERGE DEMO —{" "}
        <a
          href="https://siriusgrupa.com"
          target="_blank"
          className="underline hover:text-amber-200"
        >
          Powered by Sirius AI
        </a>
      </div>

      {/* Header */}
      <div className="bg-stone-900 px-4 py-4 flex items-center gap-3 shadow-sm">
        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-xl">
          🏛️
        </div>
        <div>
          <h1 className="font-semibold text-amber-50 text-lg">
            Luxury Villas Dubrovnik
          </h1>
          <p className="text-xs text-amber-400 flex items-center gap-1">
            <span className="w-2 h-2 bg-amber-400 rounded-full inline-block animate-pulse"></span>
            AI Concierge — Available 24/7
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-stone-50">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-amber-700 text-white rounded-br-md"
                  : "bg-white text-stone-700 border border-stone-200 rounded-bl-md shadow-sm"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-stone-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce [animation-delay:0ms]"></span>
                <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce [animation-delay:150ms]"></span>
                <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce [animation-delay:300ms]"></span>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t px-4 py-3">
        {msgCount >= 20 ? (
          <p className="text-center text-sm text-stone-500">
            Demo limit reached (20 messages).{" "}
            <a
              href="https://siriusgrupa.com"
              className="text-amber-700 underline"
            >
              Contact us
            </a>{" "}
            for the full version.
          </p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Upišite poruku..."
              className="flex-1 border border-stone-300 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-amber-700 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-amber-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
              </svg>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
