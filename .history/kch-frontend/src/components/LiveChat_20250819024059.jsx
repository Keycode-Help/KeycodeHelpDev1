import React, { useEffect, useRef, useState } from "react";
import api from "../services/request";

export default function LiveChat({ visible }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const listRef = useRef(null);

  useEffect(() => {
    if (!visible) return;
    let es;
    (async () => {
      try {
        const h = await api.get("/chat/history");
        setMessages(h.data || []);
      } catch {}
      // Use native EventSource for SSE
      const base = (api.defaults.baseURL || "").replace(/\/$/, "");
      es = new EventSource(`${base}/chat/stream`, { withCredentials: true });
      es.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          setMessages((prev) => [...prev, data]);
        } catch {}
      };
      es.onerror = () => {
        es.close();
      };
    })();
    return () => {
      try {
        es && es.close();
      } catch {}
    };
  }, [visible]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  const send = async (e) => {
    e?.preventDefault?.();
    const text = input.trim();
    if (!text) return;
    setInput("");
    try {
      await api.post("/chat/send", { message: text });
      const res = await api.get("/chat/history");
      setMessages(res.data || []);
    } catch {}
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 w-80 rounded-2xl border border-neutral-800 bg-black/70 backdrop-blur p-3 text-gray-200 shadow-2xl">
      <div className="font-semibold mb-2">Live Support Chat</div>
      <div ref={listRef} className="h-56 overflow-y-auto space-y-2 pr-1">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`text-sm ${
              m.sender === "USER" ? "text-white" : "text-emerald-300"
            }`}
          >
            <span className="opacity-60 mr-1">
              [{new Date(m.createdAt).toLocaleTimeString()}]
            </span>
            {m.sender === "USER" ? "You:" : "Agent:"} {m.message}
          </div>
        ))}
        {!messages.length && (
          <div className="text-sm text-gray-400">Start a conversation…</div>
        )}
      </div>
      <form onSubmit={send} className="mt-2 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
          className="flex-1 rounded-xl bg-black/40 border border-neutral-700 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        <button
          type="submit"
          className="rounded-xl bg-yellow-500/90 hover:bg-yellow-500 text-black font-semibold px-3 py-2"
        >
          Send
        </button>
      </form>
    </div>
  );
}
