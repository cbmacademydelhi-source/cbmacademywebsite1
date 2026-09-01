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
                  "You are the official AI assistant for CBM Academy. Answer questions about CBM Academy, its digital marketing courses, curriculum, admissions, fees, projects, AI marketing tools, career guidance and digital marketing. Be friendly, professional and concise. Never invent CBM Academy information. If you do not know something, clearly say that you do not know. Always answer in English.",
              },
              ...newMessages,
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error("AI request failed");
      }

      if (!response.body) {
        throw new Error("No response received");
      }

      const reader = response.body.getReader();
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
        const { value, done } = await reader.read();

        if (done) {
          break;
        }

        const chunk = decoder.decode(value, {
          stream: true,
        });

        const lines = chunk.split("\n");

        for (const line of lines) {
          const trimmed = line.trim();

          if (!trimmed || !trimmed.startsWith("data:")) {
            continue;
          }

          const data = trimmed.replace(/^data:\s*/, "");

          if (!data || data === "[DONE]") {
            continue;
          }

          try {
            const parsed = JSON.parse(data);

            const text =
              parsed.response ||
              parsed.text ||
              parsed.output ||
              "";

            if (typeof text === "string" && text.length > 0) {
              answer += text;

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
      console.error("AI Assistant error:", error);

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
      {/* =====================================================
          AI BOT BUTTON
          Position is controlled by App.tsx
      ===================================================== */}

      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open CBM Academy AI Assistant"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-xl transition-all duration-200 hover:scale-110 hover:bg-orange-600 hover:shadow-2xl"
        >
          <Bot className="h-7 w-7" />
        </button>
      )}

      {/* =====================================================
          AI CHAT WINDOW
      ===================================================== */}

      {open && (
        <div className="fixed bottom-5 right-5 z-[70] flex h-[560px] max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[390px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

          {/* Header */}
          <div className="flex items-center justify-between bg-orange-500 px-4 py-4 text-white">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <Bot className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-sm font-bold">
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
              className="rounded-full p-2 transition-colors hover:bg-white/20"
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
                      : "max-w-[82%] rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-sm leading-relaxed text-slate-700 shadow-sm whitespace-pre-wrap"
                  }
                >
                  {message.content ||
                    (loading &&
                    index === messages.length - 1
                      ? "Thinking..."
                      : "")}
                </div>

              </div>
            ))}

            {loading &&
              messages[messages.length - 1]?.role === "user" && (
                <div className="flex justify-start">

                  <div className="rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
                    Thinking...
                  </div>

                </div>
              )}

          </div>

          {/* Input */}
          <div className="border-t border-slate-200 bg-white p-3">

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
                className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:bg-slate-100"
              />

              <button
                type="button"
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                aria-label="Send message"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white transition-colors hover:bg-orange-600 disabled:bg-slate-300"
              >
                <Send className="h-5 w-5" />
              </button>

            </div>

            <p className="mt-2 text-center text-[10px] text-slate-400">
              Powered by CBM Academy AI
            </p>

          </div>

        </div>
      )}
    </>
  );
};
