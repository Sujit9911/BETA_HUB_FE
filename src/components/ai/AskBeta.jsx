import { useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import ReactMarkdown from "react-markdown";

const SUGGESTIONS = [
  {
    label: "📅 Upcoming events",
    question: "Show upcoming events",
  },
  {
    label: "👥 Find an alumni",
    question: "Find alumni working in software",
  },
  {
    label: "🏆 Team members",
    question: "Who are the current team members?",
  },
  {
    label: "📢 Latest notices",
    question: "Show the latest notices",
  },
];

async function askBeta(question) {
  const res = await axiosInstance.post("/ai/ask", {
    question,
  });

  return res.data.answer;
}

export default function AskBeta() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async (question) => {
    const q = question ?? input;

    if (!q.trim() || loading) return;

    setMessages((m) => [
      ...m,
      {
        role: "user",
        text: q,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const answer = await askBeta(q);

      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: answer,
        },
      ]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: "Sorry, I couldn't process that right now. Please try again.",
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    if (messages.length === 0) return;

    const confirmed = window.confirm(
      "Clear this chat? All messages will be removed."
    );

    if (!confirmed) return;

    setMessages([]);
    setInput("");
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-blue-800 hover:bg-blue-700 text-white text-sm font-semibold pl-4 pr-5 py-3 rounded-full shadow-lg shadow-blue-800/30 hover:-translate-y-0.5 transition-all duration-200"
      >
        <span className="flex items-center justify-center w-5 h-5 rounded-md bg-white/15 text-[10px] font-bold">
          AI
        </span>

        Ask BETA
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          <div className="relative w-full max-w-md h-full bg-slate-50 dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-800 flex items-center justify-center text-white text-[11px] font-bold">
                  AI
                </div>

                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    Ask BETA
                  </p>

                  <p className="text-xs text-slate-400 mt-0.5">
                    BETA Hub Assistant
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    onClick={clearChat}
                    title="Clear chat"
                    className="px-2.5 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                  >
                    Clear chat
                  </button>
                )}

                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Chat */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">

              {/* Default greeting */}
              {messages.length === 0 && (
                <div className="pt-3">

                  <div className="flex items-start gap-3 mb-6">
                    <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-blue-800 flex items-center justify-center text-white text-[10px] font-bold">
                      AI
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl rounded-tl-md px-4 py-3.5 shadow-sm">
                      <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                        Hello! 👋
                      </p>

                      <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
                        I'm Ask BETA, your BETA Hub assistant. I can help you
                        with events, teams, alumni, notices, and other
                        information available on the portal.
                      </p>
                    </div>
                  </div>

                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">
                    Try asking
                  </p>

                  <div className="space-y-2.5">
                    {SUGGESTIONS.map((item) => (
                      <button
                        key={item.label}
                        onClick={() => send(item.question)}
                        className="group w-full flex items-center justify-between text-left bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 rounded-xl px-4 py-3.5 shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-700 dark:group-hover:text-blue-400">
                          {item.label}
                        </span>

                        <span className="text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          →
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages */}
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex gap-2.5 ${
                    m.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {m.role === "assistant" && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-800 flex items-center justify-center text-white text-[10px] font-bold">
                      AI
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] px-4 py-3 text-sm shadow-sm ${
                      m.role === "user"
                        ? "bg-blue-800 text-white rounded-2xl rounded-br-md"
                        : m.error
                        ? "bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900 rounded-2xl rounded-bl-md"
                        : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-2xl rounded-bl-md"
                    } prose prose-sm dark:prose-invert max-w-none prose-p:my-1.5 prose-headings:my-2 prose-headings:text-sm prose-ul:my-1.5`}
                  >
                    {m.role === "user" ? (
                      m.text
                    ) : (
                      <ReactMarkdown>{m.text}</ReactMarkdown>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-800 flex items-center justify-center text-white text-[10px] font-bold">
                    AI
                  </div>

                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                    <div className="flex gap-1.5">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />

                      <span
                        className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.15s" }}
                      />

                      <span
                        className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.3s" }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
                className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/10 transition"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask something about BETA..."
                  disabled={loading}
                  className="flex-1 bg-transparent px-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none"
                />

                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="w-10 h-10 flex items-center justify-center bg-blue-800 hover:bg-blue-700 disabled:opacity-40 text-white rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  ↑
                </button>
              </form>

              <p className="text-[10px] text-slate-400 text-center mt-2.5">
                Ask BETA can answer questions about your BETA Hub
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}