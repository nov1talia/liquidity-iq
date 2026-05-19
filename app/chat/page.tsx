'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Welcome to LiquidityIQ AI Chat! I can help you with:\n\n• Analyzing DLMM pools\n• Explaining liquidity strategies\n• Checking pool risks\n• Providing DeFi insights\n\nHow can I help you today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMsg }],
        }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] page-enter">
      <div className="mb-6">
        <h1 className="text-3xl font-bold gradient-text" style={{ fontSize: '36px' }}>AI Chat</h1>
        <p style={{ color: '#959597', marginTop: '4px' }}>Ask anything about DLMM liquidity management</p>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className="max-w-[75%] px-5 py-3"
              style={{
                border: '1px solid',
                borderColor: msg.role === 'user' ? 'rgba(228, 2, 13, 0.4)' : '#28282c',
                borderRadius: '12px',
                background: msg.role === 'user' ? 'rgba(228, 2, 13, 0.1)' : '#18181a',
                color: msg.role === 'user' ? '#ffffff' : '#ffffff',
              }}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div
              className="px-5 py-3"
              style={{
                background: '#18181a',
                border: '1px solid #28282c',
                borderRadius: '12px',
              }}
            >
              <div className="flex gap-2">
                <span style={{ color: '#e4020d', animation: 'subtlePulse 1.4s ease-in-out infinite' }}>●</span>
                <span style={{ color: '#e4020d', animation: 'subtlePulse 1.4s ease-in-out 0.2s infinite' }}>●</span>
                <span style={{ color: '#e4020d', animation: 'subtlePulse 1.4s ease-in-out 0.4s infinite' }}>●</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div
        className="p-4"
        style={{
          background: '#18181a',
          border: '1px solid #28282c',
          borderRadius: '12px',
        }}
      >
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1 input"
            placeholder="Ask about pools, strategies, risks..."
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="btn-primary"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
