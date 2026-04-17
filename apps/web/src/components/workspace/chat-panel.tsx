'use client';

import { useState, useRef, useEffect } from 'react';

export type ChatMessage = {
  from: string;
  agent?: 'pm' | 'teammate';
  text: string;
  timestamp: string;
};

const nameColor: Record<string, string> = {
  'AI PM': 'var(--accent)',
  'AI Teammate': 'var(--green)',
  user: 'var(--text-light)',
};

export function ChatPanel({
  messages,
  onSendMessage,
  sending,
}: {
  messages: ChatMessage[];
  onSendMessage: (text: string, agent: 'pm' | 'teammate') => void;
  sending: boolean;
}) {
  const [input, setInput] = useState('');
  const [activeAgent, setActiveAgent] = useState<'pm' | 'teammate'>('pm');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleSend() {
    const text = input.trim();
    if (!text || sending) return;
    setInput('');
    onSendMessage(text, activeAgent);
  }

  return (
    <div
      style={{
        width: 300,
        borderLeft: '1px solid var(--border)',
        background: 'var(--surface)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '8px 12px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: 'rgba(139,143,163,0.35)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          Team Chat
        </span>
      </div>

      {/* Agent tabs */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--border)',
        }}
      >
        {([
          { id: 'pm' as const, label: 'PM' },
          { id: 'teammate' as const, label: 'Teammate' },
        ]).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveAgent(tab.id)}
            style={{
              flex: 1,
              padding: '7px 0',
              fontSize: 11,
              fontWeight: 600,
              border: 'none',
              borderBottom:
                activeAgent === tab.id
                  ? '2px solid var(--accent)'
                  : '2px solid transparent',
              background: 'transparent',
              color:
                activeAgent === tab.id
                  ? 'var(--white)'
                  : 'rgba(139,143,163,0.5)',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.15s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          padding: 12,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        {messages.length === 0 ? (
          <span
            style={{
              color: 'rgba(139,143,163,0.3)',
              fontSize: 12,
              textAlign: 'center',
              marginTop: 20,
            }}
          >
            Chat with your AI team...
          </span>
        ) : (
          messages.map((msg, i) => {
            const isUser = msg.from === 'user';
            return (
              <div
                key={i}
                style={{
                  maxWidth: '90%',
                  alignSelf: isUser ? 'flex-end' : 'flex-start',
                }}
              >
                {!isUser && (
                  <div
                    style={{
                      fontSize: 9.5,
                      fontWeight: 700,
                      color: nameColor[msg.from] || 'var(--text)',
                      marginBottom: 3,
                    }}
                  >
                    {msg.from}
                  </div>
                )}
                <div
                  style={{
                    fontSize: 12,
                    lineHeight: 1.55,
                    padding: '8px 10px',
                    borderRadius: 8,
                    background: isUser
                      ? 'rgba(99,108,240,0.1)'
                      : 'var(--surface-light)',
                    border: isUser
                      ? '1px solid rgba(99,108,240,0.15)'
                      : '1px solid var(--border)',
                    color: 'var(--text-light)',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
        {sending && (
          <div
            style={{
              alignSelf: 'flex-start',
              fontSize: 12,
              color: 'rgba(139,143,163,0.4)',
              padding: '8px 10px',
            }}
          >
            Thinking...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        style={{
          padding: '10px 12px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          gap: 8,
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder={`Ask the ${activeAgent === 'pm' ? 'PM' : 'Teammate'}...`}
          disabled={sending}
          style={{
            flex: 1,
            padding: '8px 12px',
            fontSize: 12,
            borderRadius: 8,
            border: '1px solid var(--border)',
            background: 'var(--bg)',
            color: 'var(--white)',
            outline: 'none',
            fontFamily: 'inherit',
          }}
        />
        <button
          onClick={handleSend}
          disabled={sending || !input.trim()}
          style={{
            padding: '8px 14px',
            fontSize: 11,
            fontWeight: 600,
            borderRadius: 8,
            border: 'none',
            background:
              input.trim() && !sending
                ? 'var(--accent)'
                : 'var(--surface-light)',
            color:
              input.trim() && !sending
                ? '#fff'
                : 'rgba(139,143,163,0.35)',
            cursor: input.trim() && !sending ? 'pointer' : 'default',
            fontFamily: 'inherit',
            transition: 'all 0.15s',
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}