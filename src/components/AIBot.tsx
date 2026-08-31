import React, { useState } from 'react';
import { Bot, X, Send, Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const WORKER_URL =
  'https://llm-chat-app-template.cbmacademydelhi.workers.dev';

export const AIBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hi! I'm CBM Academy's AI Assistant. How can I help you today?",
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    const question = input.trim();

    if (!question || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: question,
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${WORKER_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('AI request failed');
      }

      if (!response.body) {
        throw new Error('No response received');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let assistantText = '';

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '',
        },
      ]);

      while (true) {
        const { value, done } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, {
          stream: true,
        });

        const lines = chunk.split('\n');

        for (const line of lines) {
