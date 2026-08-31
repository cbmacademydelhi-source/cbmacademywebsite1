import React, { useState } from "react";
import { Bot, Send, X } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const AIBot: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I am CBM Academy AI Assistant. Ask me about our courses, fees, curriculum, admissions, projects, digital marketing, AI tools, or career guidance.",
    },
  ]);

  const sendMessage = async () => {
    const question = input.trim();

    if (!question || loading) return;

    const userMessage: Message = {
      role: "user",
      content: question,
    };

    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "You are the official AI assistant for CBM Academy. Answer questions about CBM Academy, its digital marketing courses, curriculum, admissions, fees, projects, AI marketing tools, career guidance and digital marketing. Be friendly, professional and concise. Never invent CBM Academy information. If you do not know something, say so. Always answer in English.",
            },
            ...newMessages,
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("AI request failed");
      }

      const reader = response.body?.getReader();

      if (!reader) {
        throw new Error("No response body");
      }

      const decoder = new TextDecoder();
      let answer = "";

      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "",
        },
      ]);

      while (true) {
        const result = await reader.read();

        if (result.done) break;

        const text = decoder.decode(result.value, {
          stream: true,
        });

        const lines = text.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data:")) continue;

          const data = line.substring(5).trim();

          if (!data || data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data);

            const token =
              parsed.response ||
              parsed.text ||
              parsed.output ||
              "";

            if (typeof token === "string") {
              answer += token;

              setMessages([
                ...newMessages,
                {
                  role: "assistant",
                  content: answer,
                },
              ]);
            }
          } catch {
            continue;
          }
        }
      }

      if (!answer) {
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content:
              "Sorry, I could not generate an answer right now. Please try again.",
          },
        ]);
      }
    } catch (error) {
      console.error("AI error:", error);

      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content:
            "Sorry, I am having trouble connecting right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open CBM Academy AI Assistant"
          className="fixed bottom-5 right-24 z-50 w-14 h-14 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center shadow-xl transition-all hover:scale-105"
        >
          <Bot className="w-7 h-7" />
        </button>
      )}

      {open && (
        <div className="fixed bottom-5 right-5 z-50 w-[calc(100vw-2rem)] max-w-[390px] h-[560px] max-h-[calc(100vh-2rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
          <div className="bg-orange-500 text-white px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>

              <div>
                <h3 className="font-bold text-sm">
                  CBM Academy AI Assistant
                </h3>

                <p className="text-xs text-orange-100">
                  Ask me anything
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close AI Assistant"
              className="p-2 rounded-full hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
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
                      ? "max-w-[82%] px-4 py-3 rounded-2xl bg-orange-500 text-white text-sm"
                      : "max-w-[82%] px-4 py-3 rounded-2xl bg-white text-slate-700 border border-slate-200 text-sm"
                  }
                >
                  {message.content ||
                    (loading ? "Thinking..." : "")}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-white border-t border-slate-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask your question..."
                disabled={loading}
                className="flex-1 min-w-0 px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-orange-500 text-sm"
              />

              <button
                type="button"
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                aria-label="Send message"
                className="w-11 h-11 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 text-white flex items-center justify-center"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

            <p className="text-[10px] text-slate-400 text-center mt-2">
              Powered by CBM Academy AI
            </p>
          </div>
        </div>
      )}
    </>
  );
};
