import React, { useState, useRef, useEffect } from "react";
import { Bot, Send, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const AIBot: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I am CBM Academy AI Assistant. Ask me about our courses, fees, curriculum, admissions, projects, digital marketing, AI tools, or career guidance.",
    },
  ]);

  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isChatOpen, loading]);

  const sendMessage = async () => {
    const question = input.trim();

    if (!question || loading) {
      return;
    }

    const userMessage: Message = {
      role: "user",
      content: question,
    };

    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://llm-chat-app-template.cbmacademydelhi.workers.dev/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [
              {
                role: "system",
                content:
                  "You are the official AI assistant for CBM Academy (Delhi). Answer questions about CBM Academy, its digital marketing courses, curriculum, admissions, fees, projects, AI marketing tools, career guidance and digital marketing. Be friendly, helpful, professional, and concise. Key Academy Facts: Flagship Program: Master in AI-Powered Digital Marketing & Performance Growth. Modules include AI-Driven SEO & GEO, Meta Ads & Performance Marketing, Google Ads (PMax, Search), AI Content Creation (ChatGPT, Midjourney), GA4 & Analytics, Social Media & Influencer Marketing, Marketing Automation & E-commerce. Features: 15+ live projects, ₹10,000 live ad spend project, 100% placement assistance, industry certifications (Google, Meta, CBM Academy). Batches: Weekday and Weekend available (Classroom and Online). For fee details, scholarships, and free demo classes, guide users to contact CBM Academy via WhatsApp (+91 9211583150) or apply on the website. Always answer in English.",
              },
              ...newMessages,
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`AI request failed with status ${response.status}`);
      }

      let answer = "";
      const contentType = response.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        const data = await response.json();
        answer =
          data.response ||
          data.text ||
          data.output ||
          data.message?.content ||
          "";
      } else {
        const text = await response.text();
        try {
          const parsed = JSON.parse(text);
          answer =
            parsed.response ||
            parsed.text ||
            parsed.output ||
            parsed.message?.content ||
            "";
        } catch {
          // Check if SSE formatted stream was returned
          const lines = text.split("\n");
          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith("data:")) {
              const raw = trimmed.replace(/^data:\s*/, "");
              if (raw && raw !== "[DONE]") {
                try {
                  const p = JSON.parse(raw);
                  answer += p.response || p.text || p.output || "";
                } catch {
                  answer += raw;
                }
              }
            }
          }
          if (!answer) {
            answer = text;
          }
        }
      }

      if (answer && answer.trim().length > 0) {
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content: answer.trim(),
          },
        ]);
      } else {
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content:
              "I'm having trouble connecting right now. Please try again in a moment.",
          },
        ]);
      }
    } catch (error) {
      console.error("AI Assistant error:", error);

      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content:
            "I'm having trouble connecting right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* =====================================================
          FLOATING CBM AI BOT BUTTON
          Fixed directly to the viewport.
          Desktop: right: 110px; bottom: 24px;
          Mobile: right: 96px; bottom: 16px;
          z-index: 9999;
      ===================================================== */}
      <div className="fixed z-[9999] right-[96px] bottom-[16px] sm:right-[110px] sm:bottom-[24px] flex flex-col items-center gap-1.5 pointer-events-auto">
        <span className="rounded-full bg-white px-3 py-1 text-[11px] font-extrabold text-[#072B57] border border-slate-200 shadow-sm whitespace-nowrap select-none pointer-events-none">
          CBM AI Bot
        </span>

        <button
          type="button"
          onClick={() => setIsChatOpen((prev) => !prev)}
          aria-label={isChatOpen ? "Close CBM Academy AI Assistant" : "Open CBM Academy AI Assistant"}
          aria-expanded={isChatOpen}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-xl transition-transform duration-150 hover:scale-105 active:scale-95 hover:bg-orange-600 hover:shadow-2xl cursor-pointer"
        >
          <Bot className="h-7 w-7" />
        </button>
      </div>

      {/* =====================================================
          AI CHAT POPUP WINDOW
          Fixed directly to the viewport (above the floating button).
          Desktop: right: 24px; bottom: 90px; width: 380px; max-height: 70vh;
          Mobile: left: 12px; right: 12px; bottom: 80px; width: auto; max-height: 75vh;
          z-index: 10000;
          Subtle opacity and scale animation only (no position/translate shift).
      ===================================================== */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            key="cbm-ai-chat-window"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed z-[10000] left-[12px] right-[12px] bottom-[80px] w-auto max-h-[75vh] sm:left-auto sm:right-[24px] sm:bottom-[90px] sm:w-[380px] sm:max-w-[calc(100vw-32px)] sm:max-h-[70vh] h-[560px] flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
            role="dialog"
            aria-label="CBM Academy AI Assistant Chat"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-orange-500 px-4 py-3.5 sm:py-4 text-white shrink-0 select-none">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                  <Bot className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-sm font-bold leading-tight">
                    CBM Academy AI Assistant
                  </h3>

                  <p className="text-xs text-orange-100">
                    Ask me anything
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsChatOpen(false)}
                aria-label="Close AI Assistant"
                className="rounded-full p-2 transition-colors hover:bg-white/20 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={
                    message.role === "user"
                      ? "flex justify-end"
                      : "flex justify-start"
                  }
                >
                  <div
                    className={
                      message.role === "user"
                        ? "max-w-[82%] rounded-2xl rounded-br-md bg-orange-500 px-4 py-3 text-sm leading-relaxed text-white whitespace-pre-wrap"
                        : "max-w-[82%] rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-sm leading-relaxed text-[#072B57] shadow-sm whitespace-pre-wrap"
                    }
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
                    <span className="inline-block h-2 w-2 rounded-full bg-orange-400 animate-pulse" />
                    <span>Thinking...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-slate-200 bg-white p-3 shrink-0">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(event) =>
                    setInput(event.target.value)
                  }
                  onKeyDown={handleKeyDown}
                  placeholder="Ask your question..."
                  disabled={loading}
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm text-[#072B57] outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:bg-slate-100"
                />

                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  aria-label="Send message"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white transition-colors hover:bg-orange-600 disabled:bg-slate-300 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>

              <p className="mt-2 text-center text-[10px] text-slate-400">
                Powered by CBM Academy AI
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
