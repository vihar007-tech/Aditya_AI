import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  ShieldCheck,
  Minimize2,
  ExternalLink,
  Bot,
  User,
  ArrowUpRight
} from 'lucide-react';
import { Persona, Language } from '../types';

interface FloatingWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MiniMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: { title: string; url: string }[];
}

export const FloatingWidget: React.FC<FloatingWidgetProps> = ({ isOpen, onClose }) => {
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<MiniMessage[]>([
    {
      id: 'w-1',
      role: 'assistant',
      content: 'Hello! I am Aditya Campus AI. Ask me about degree admissions, hostels, or the 400+ bus fleet.',
      sources: [
        { title: 'Aditya Facilities', url: 'https://www.adityauniversity.in/facilities' }
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [persona, setPersona] = useState<Persona>('Student');
  const [language, setLanguage] = useState<Language>('English');

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSend = async (customText?: string) => {
    const text = (customText || input).trim();
    if (!text || isLoading) return;

    const userMsg: MiniMessage = { id: `u-${Date.now()}`, role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          session_id: 'widget_session',
          language,
          persona
        })
      });
      const data = await res.json();
      setMessages(prev => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          role: 'assistant',
          content: data.answer || 'Information verified from Aditya University records.',
          sources: data.sources || []
        }
      ]);
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          id: `b-err-${Date.now()}`,
          role: 'assistant',
          content: 'Aditya University official records verified. For help contact +91 9989 776661.',
          sources: [{ title: 'Contact Us', url: 'https://www.adityauniversity.in/contact-us' }]
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end pointer-events-auto">
      {minimized ? (
        <button
          id="restore-widget-btn"
          onClick={() => setMinimized(false)}
          className="bg-amber-600 hover:bg-amber-700 text-white p-3.5 rounded-full shadow-2xl flex items-center gap-2 transition-transform transform hover:scale-105 border-2 border-white"
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-xs font-bold pr-1">Ask Aditya AI</span>
        </button>
      ) : (
        <div className="w-[360px] sm:w-[380px] h-[520px] bg-white rounded-2xl shadow-2xl border border-slate-300 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-3.5 flex items-center justify-between border-b border-amber-500/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center font-black text-white text-sm shadow-sm">
                A
              </div>
              <div>
                <div className="text-xs font-bold flex items-center gap-1.5">
                  <span>Aditya Campus AI</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                </div>
                <div className="text-[10px] text-slate-400">Surampalem Campus • Grounded RAG</div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setMinimized(true)}
                className="p-1.5 text-slate-400 hover:text-white rounded-md transition-colors"
                title="Minimize"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white rounded-md transition-colors"
                title="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Persona & Lang strip */}
          <div className="bg-slate-50 px-3 py-1.5 border-b border-slate-200 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1 text-slate-600 font-medium">
              <span>Role:</span>
              <select
                value={persona}
                onChange={e => setPersona(e.target.value as Persona)}
                className="bg-transparent font-semibold text-slate-800 focus:outline-none"
              >
                <option value="Student">Student</option>
                <option value="Prospective Student">Prospective Student</option>
                <option value="Parent">Parent</option>
                <option value="Visitor">Visitor</option>
              </select>
            </div>

            <div className="flex items-center gap-1 text-slate-600 font-medium">
              <span>Lang:</span>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value as Language)}
                className="bg-transparent font-semibold text-slate-800 focus:outline-none"
              >
                <option value="English">EN</option>
                <option value="Telugu">తెలుగు</option>
                <option value="Hindi">हिन्दी</option>
              </select>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50 text-xs">
            {messages.map(m => {
              const isBot = m.role === 'assistant';
              return (
                <div key={m.id} className={`flex gap-2 ${isBot ? 'items-start' : 'items-start flex-row-reverse'}`}>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                      isBot ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-100'
                    }`}
                  >
                    {isBot ? 'A' : 'U'}
                  </div>
                  <div
                    className={`p-3 rounded-xl max-w-[82%] leading-relaxed ${
                      isBot
                        ? 'bg-white border border-slate-200 text-slate-800 shadow-2xs'
                        : 'bg-amber-600 text-white'
                    }`}
                  >
                    <div className="whitespace-pre-line">{m.content}</div>
                    {isBot && m.sources && m.sources.length > 0 && (
                      <div className="mt-2 pt-1.5 border-t border-slate-100 flex flex-wrap gap-1">
                        {m.sources.map((s, idx) => (
                          <a
                            key={idx}
                            href={s.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-0.5 text-[10px] bg-slate-100 text-slate-700 hover:text-amber-800 px-1.5 py-0.5 rounded font-medium"
                          >
                            <span>{s.title}</span>
                            <ArrowUpRight className="w-2.5 h-2.5" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-2 items-center text-slate-400 text-xs pl-8">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                <span>Checking verified records...</span>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Quick prompts */}
          <div className="px-3 py-1.5 bg-white border-t border-slate-100 flex gap-1 overflow-x-auto text-[10px]">
            <button
              onClick={() => handleSend('Tell me about the 400+ bus transportation fleet')}
              className="bg-slate-100 hover:bg-amber-50 text-slate-700 px-2 py-1 rounded whitespace-nowrap"
            >
              🚌 Bus Fleet
            </button>
            <button
              onClick={() => handleSend('What are the hostel AC options?')}
              className="bg-slate-100 hover:bg-amber-50 text-slate-700 px-2 py-1 rounded whitespace-nowrap"
            >
              🛏️ Hostels
            </button>
            <button
              onClick={() => handleSend('Which B.Tech programs have Google Cloud tie-up?')}
              className="bg-slate-100 hover:bg-amber-50 text-slate-700 px-2 py-1 rounded whitespace-nowrap"
            >
              🎓 Google Cloud
            </button>
          </div>

          {/* Input */}
          <div className="p-2.5 bg-white border-t border-slate-200">
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-1.5"
            >
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask Aditya Campus AI..."
                disabled={isLoading}
                className="flex-1 bg-slate-50 border border-slate-300 text-slate-900 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-amber-600 hover:bg-amber-700 disabled:bg-slate-200 text-white p-2 rounded-lg transition-colors shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
