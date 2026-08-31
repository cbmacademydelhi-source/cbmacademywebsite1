import React, { useState } from "react";
import { Bot, Send, X, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const AIBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm CBM Academy's AI Assistant. Ask me anything about our courses, curriculum, admissions, fees, projects, career guidance, or digital marketing programs.",
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

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
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
                "You are CBM Academy's helpful AI assistant. Answer questions about CBM Academy, its digital marketing courses, curriculum, AI marketing tools, projects, career guidance, admissions and general digital marketing topics. Be friendly, professional and concise. If you do not know a CBM Academy-specific detail, clearly say that you do not have that information instead of making it up. Answer in English.",
            },
            ...updatedMessages,
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to connect to AI");
      }

      if (!response.body) {
        throw new Error("No response received");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let assistantText = "";

      setMessages([
        ...updatedMessages,
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

        const chunk = decoder.decode(value, { stream: true });

        const lines = chunk.split("\n");

        for (const line of lines) {
          const trimmed = line.trim();

          if (!trimmed || !trimmed.startsWith("data:")) {
            continue;
          }

          const data = trimmed.replace(/^data:\s*/, "");

          if (data === "[DONE]") {
            continue;
          }

          try {
            const parsed = JSON.parse(data);

            const text =
              parsed.response ||
              parsed.response?.text ||
              parsed.text ||
              parsed.output ||
              "";

            if (typeof text === "string") {
              assistantText += text;

              setMessages([
                ...updatedMessages,
                {
                  role: "assistant",
                  content: assistantText,
                },
              ]);
            }
          } catch {
            if (data && data !== "[DONE]") {
              assistantText += data;

              setMessages([
                ...updatedMessages,
                {
                  role: "assistant",
                  content: assistantText,
                },
              ]);
            }
          }
        }
      }

      if (!assistantText) {
        setMessages([
          ...updatedMessages,
          {
            role: "assistant",
            content:
              "Sorry, I couldn't generate a response right now. Please try again.",
          },
        ]);
      }
    } catch (error) {
      console.error("AI chatbot error:", error);

      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content:
            "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating AI Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open CBM Academy AI Assistant"
          className="fixed bottom-5 right-24 z-50 w-14 h-14 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center shadow-xl transition-all duration-200 hover:scale-105"
        >
          <Bot className="w-7 h-7" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 z-50 w-[calc(100vw-2rem)] max-w-[390px] h-[560px] max-h-[calc(100vh-2rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-orange-500 text-white px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
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
              onClick={() => setIsOpen(false)}
              aria-label="Close AI Assistant"
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[82%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    message.role === "user"
                      ? "bg-orange-500 text-white rounded-br-md"
                      : "bg-white text-slate-700 border border-slate-200 rounded-bl-md shadow-sm"
                  `}
                >
                  {message.content ||
                    (loading && index === messages.length - 1
                      ? "Thinking..."
                      : "")}
                </div>
              </div>
            ))}

            {loading &&
              messages[messages.length - 1]?.role === "user" && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-bl-md text-sm text-slate-500">
                    Thinking...
                  </div>
                </div>
              )}
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-slate-200">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask your question..."
                disabled={loading}
                className="flex-1 min-w-0 px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 text-sm text-slate-800 disabled:bg-slate-100"
              />

              <button
                type="button"
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                aria-label="Send message"
                className="w-11 h-11 shrink-0 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 text-white flex items-center justify-center transition-colors"
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
