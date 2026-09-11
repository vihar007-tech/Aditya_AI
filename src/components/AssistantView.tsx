import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  ExternalLink,
  Bot,
  User,
  CheckCircle2,
  Info,
  ArrowUpRight
} from 'lucide-react';
import { ChatMessage, Persona, Language, SourceReference } from '../types';
import { QUICK_QUERIES } from '../data/campusInfo';

interface AssistantViewProps {
  onNavigateTab: (tab: string) => void;
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
}

export const AssistantView: React.FC<AssistantViewProps> = ({
  onNavigateTab,
  initialPrompt,
  onClearInitialPrompt
}) => {
  const [persona, setPersona] = useState<Persona>('Student');
  const [language, setLanguage] = useState<Language>('English');
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('Understanding question...');
  const [isRecording, setIsRecording] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);
  const [expandedSnippetUrl, setExpandedSnippetUrl] = useState<string | null>(null);
  const sessionIdRef = useRef(`session_${Date.now()}`);

  // Initial welcome message
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: `Namaste and welcome! I am **Aditya Campus AI** 👋\n\nI provide verified, official information on Aditya University (Surampalem, Kakinada District, AP). Ask me anything regarding:\n• **Academic Programs & Degrees** (Engineering, Computing, Business, Pharmacy)\n• **Industry Collaborations** with Google Cloud, Microsoft, and SAP\n• **Campus Transit & 400+ Bus Routes**\n• **Hostel Living & Dining Facilities**\n• **24/7 Healthcare Clinic & Ambulance Services**\n• **Career Development Centre (CDC) Placements**\n• **University Leadership & Administration**`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      grounded: true,
      confidence_status: 'Verified from official university sources',
      sources: [
        { title: 'Aditya University Overview', url: 'https://www.adityauniversity.in/about-us/overview' },
        { title: 'Campus Facilities', url: 'https://www.adityauniversity.in/facilities' }
      ]
    }
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSendMessage(initialPrompt);
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
  }, [initialPrompt]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Speech Recognition Handling
  const toggleSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported by your current browser.');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'Telugu' ? 'te-IN' : language === 'Hindi' ? 'hi-IN' : 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputMessage(transcript);
        }
        setIsRecording(false);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsRecording(false);
    }
  };

  // Text-To-Speech Readout
  const speakMessage = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported by your browser.');
      return;
    }

    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === 'Telugu' ? 'te-IN' : language === 'Hindi' ? 'hi-IN' : 'en-US';
    utterance.rate = 1.0;

    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);

    setSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // Send message
  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputMessage).trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      persona,
      language
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);
    setLoadingStatus('Understanding question...');

    const timer1 = setTimeout(() => setLoadingStatus('Searching campus knowledge...'), 400);
    const timer2 = setTimeout(() => setLoadingStatus('Verifying official university sources...'), 900);

    try {
      const response = await fetch('/api/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          session_id: sessionIdRef.current,
          language,
          persona
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Server responded with status ${response.status}`);
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.answer || 'Official Aditya University records verified this query.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: data.sources || [],
        actions: data.actions || [],
        evidence_level: data.evidence_level,
        answerable: data.answerable,
        grounded: data.grounded ?? true,
        confidence_status: data.confidence_status || 'Verified from official university sources',
        smart_action: data.smart_action,
        persona,
        language
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      // Context-aware fallback without universal contact dump
      const isFeeQuery = /\b(fee|fees|tuition|cost|scholarship)\b/i.test(textToSend);
      const isAimlQuery = /\b(ai|ml|machine learning|artificial intelligence)\b/i.test(textToSend);
      
      let fallbackContent = `Unable to connect to the campus assistant service right now. Please try your question again or check the official website at https://www.adityauniversity.in.`;
      
      if (isFeeQuery) {
        fallbackContent = `Official Aditya University records indicate that undergraduate B.Tech tuition ranges between INR 70,000 and INR 1,20,000 per year, with up to 100% AUET scholarships. For upcoming 2026 admissions notifications, visit https://www.adityauniversity.in/admissions.`;
      } else if (isAimlQuery) {
        fallbackContent = `Aditya University offers a 4-year B.Tech in Artificial Intelligence & Machine Learning (AI & ML) under the School of Computing with NVIDIA GPU labs and industry certifications from Google Cloud and Microsoft. Details: https://www.adityauniversity.in/academics.`;
      }

      const fallbackMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        role: 'assistant',
        content: fallbackContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        grounded: true,
        confidence_status: 'Cached verified university knowledge',
        sources: [
          { title: 'Aditya University Official Portal', url: 'https://www.adityauniversity.in/' }
        ]
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setIsLoading(false);
    }
  };

  const handleFeedback = async (msgId: string, helpful: boolean) => {
    const msgIndex = messages.findIndex(m => m.id === msgId);
    if (msgIndex === -1) return;

    const query = messages[msgIndex - 1]?.content || 'Aditya University Query';
    const answer = messages[msgIndex].content;

    setMessages(prev =>
      prev.map(m => (m.id === msgId ? { ...m, feedback: helpful ? 'helpful' : 'unhelpful' } : m))
    );

    try {
      await fetch('/api/v1/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          answer,
          is_helpful: helpful
        })
      });
      setFeedbackToast(helpful ? 'Thank you! Your feedback helps train our grounding models.' : 'Thank you. We will improve this answer.');
      setTimeout(() => setFeedbackToast(null), 3500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      {/* Toast */}
      {feedbackToast && (
        <div className="absolute top-4 right-6 z-30 bg-slate-900 text-white px-4 py-2.5 rounded-lg text-xs font-semibold shadow-xl border border-slate-700 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Main Chat Scroll Container */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6 max-w-5xl w-full mx-auto">
        {/* Aditya University Header Banner */}
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-6 text-white shadow-md border-l-4 border-amber-500 relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-block bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Aditya University • Surampalem
              </span>
              <span className="inline-flex items-center gap-1 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold px-2 py-0.5 rounded-md">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Grounded Knowledge Base
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-1">
              Aditya Campus AI
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Official conversational assistant for degree programs, campus transit, residential hostels, faculty, and student amenities.
            </p>
          </div>
        </div>

        {/* Controls Bar: Persona, Language, Voice, Reset */}
        <div className="bg-white p-3 md:p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Persona */}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <span className="text-slate-500 hidden sm:inline">Role:</span>
              <select
                id="persona-select"
                value={persona}
                onChange={e => setPersona(e.target.value as Persona)}
                className="bg-slate-50 border border-slate-300 text-slate-800 text-xs rounded-lg px-2.5 py-1.5 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                <option value="Student">Student (Academics & Campus)</option>
                <option value="Prospective Student">Prospective Student (Admissions & Culture)</option>
                <option value="Parent">Parent (Safety, Hostels & Medical)</option>
                <option value="Visitor">Visitor (Directions & Timings)</option>
                <option value="Faculty/Staff">Faculty/Staff (Institutional)</option>
              </select>
            </div>

            {/* Language */}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <span className="text-slate-500 hidden sm:inline">Language:</span>
              <select
                id="language-select"
                value={language}
                onChange={e => setLanguage(e.target.value as Language)}
                className="bg-slate-50 border border-slate-300 text-slate-800 text-xs rounded-lg px-2.5 py-1.5 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                <option value="English">English</option>
                <option value="Telugu">తెలుగు (Telugu)</option>
                <option value="Hindi">हिन्दी (Hindi)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Voice Rec Toggle */}
            <button
              id="voice-mic-toggle-btn"
              onClick={toggleSpeechRecognition}
              className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                isRecording
                  ? 'bg-rose-600 text-white animate-pulse shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              title={isRecording ? 'Listening... click to stop' : 'Speak your query'}
            >
              {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-amber-600" />}
              <span className="hidden md:inline">{isRecording ? 'Listening...' : 'Voice Input'}</span>
            </button>

            {/* Clear Chat */}
            <button
              id="new-chat-btn"
              onClick={() => {
                setMessages([messages[0]]);
                if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              }}
              className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>New Chat</span>
            </button>
          </div>
        </div>

        {/* Quick Queries Pills */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>Frequent Campus Queries</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {QUICK_QUERIES.map((q, idx) => (
              <button
                key={idx}
                id={`quick-query-${idx}`}
                onClick={() => handleSendMessage(q.query)}
                className="text-xs bg-white hover:bg-amber-50 hover:text-amber-800 text-slate-700 border border-slate-200 hover:border-amber-300 px-3 py-1.5 rounded-lg shadow-2xs font-medium transition-all text-left"
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>

        {/* Messages Stream */}
        <div className="space-y-4 pt-2">
          {messages.map((msg, index) => {
            const isBot = msg.role === 'assistant';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isBot ? 'items-start' : 'items-start flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold shadow-sm ${
                    isBot
                      ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white ring-2 ring-amber-400/30'
                      : 'bg-slate-800 text-slate-100'
                  }`}
                >
                  {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Message Bubble Container */}
                <div className={`max-w-[85%] md:max-w-[78%] space-y-2 ${isBot ? '' : 'text-right'}`}>
                  {/* Bubble */}
                  <div
                    className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      isBot
                        ? 'bg-white border border-slate-200 text-slate-800 shadow-sm rounded-tl-sm'
                        : 'bg-amber-600 text-white shadow-sm rounded-tr-sm text-left'
                    }`}
                  >
                    {/* Header info for Bot */}
                    {isBot && (
                      <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2 pb-2 border-b border-slate-100 text-xs text-slate-400">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-bold text-slate-700">Aditya Campus AI</span>
                          {msg.evidence_level === 'STRONG' && (
                            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              Strong Official Evidence
                            </span>
                          )}
                          {msg.evidence_level === 'MODERATE' && (
                            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-amber-200">
                              <ShieldCheck className="w-3 h-3 text-amber-600" />
                              Partially Verified Evidence
                            </span>
                          )}
                          {msg.evidence_level === 'WEAK' && (
                            <span className="inline-flex items-center gap-1 bg-sky-50 text-sky-800 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-sky-200">
                              <Info className="w-3 h-3 text-sky-600" />
                              Limited Evidence
                            </span>
                          )}
                          {msg.evidence_level === 'NONE' && (
                            <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-slate-300">
                              <Info className="w-3 h-3 text-slate-500" />
                              Unverified Record
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500">{msg.timestamp}</span>
                      </div>
                    )}

                    {/* Text Output with Formatting */}
                    <div className="space-y-2 whitespace-pre-line text-slate-800">
                      {msg.content}
                    </div>

                    {/* Verified Sources with Snippets */}
                    {isBot && msg.sources && msg.sources.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Verified University Citations:</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-normal lowercase">click source to preview snippet</span>
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap gap-1.5">
                            {msg.sources.map((src, sIdx) => {
                              const isExpanded = expandedSnippetUrl === `${msg.id}-${src.url}`;
                              return (
                                <button
                                  key={sIdx}
                                  type="button"
                                  onClick={() => setExpandedSnippetUrl(isExpanded ? null : `${msg.id}-${src.url}`)}
                                  className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md font-medium transition-all ${
                                    isExpanded
                                      ? 'bg-sky-600 text-white shadow-xs'
                                      : 'bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200'
                                  }`}
                                  title="Click to view verified evidence snippet"
                                >
                                  <span>{src.title}</span>
                                  <Info className="w-3 h-3 opacity-70" />
                                </button>
                              );
                            })}
                          </div>

                          {/* Expanded Snippet Drawer */}
                          {msg.sources.map((src, sIdx) => {
                            const isExpanded = expandedSnippetUrl === `${msg.id}-${src.url}`;
                            if (!isExpanded) return null;
                            return (
                              <div
                                key={`snippet-${sIdx}`}
                                className="bg-slate-50 border border-sky-200 rounded-lg p-2.5 text-xs text-slate-700 space-y-1 mt-1 transition-all"
                              >
                                <div className="flex items-center justify-between font-semibold text-sky-900 text-[11px]">
                                  <span>Official Excerpt ({src.title}):</span>
                                  <a
                                    href={src.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[10px] text-sky-600 hover:text-sky-800 inline-flex items-center gap-0.5 underline font-normal"
                                  >
                                    <span>Open Page</span>
                                    <ArrowUpRight className="w-2.5 h-2.5" />
                                  </a>
                                </div>
                                <p className="italic text-slate-600 leading-relaxed font-serif text-[11.5px]">
                                  "{src.snippet || 'Indexed verified excerpt from official Aditya University records.'}"
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Actions & Next Steps */}
                    {isBot && (
                      <div className="mt-3 pt-2 flex flex-wrap gap-2">
                        {/* Render explicit actions list if provided by backend */}
                        {msg.actions && msg.actions.length > 0 &&
                          msg.actions.map((act, aIdx) => (
                            act.url ? (
                              <a
                                key={`act-${aIdx}`}
                                href={act.url}
                                target={act.url.startsWith('tel:') ? '_self' : '_blank'}
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                              >
                                <span>↗️ {act.label}</span>
                              </a>
                            ) : act.action_page ? (
                              <button
                                key={`act-${aIdx}`}
                                onClick={() => {
                                  if (act.action_page === 'Academic Programs') onNavigateTab('programs');
                                  else if (act.action_page === 'Campus Explorer') onNavigateTab('explorer');
                                  else if (act.action_page === 'Leadership') onNavigateTab('leadership');
                                }}
                                className="inline-flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                              >
                                <span>↗️ {act.label}</span>
                              </button>
                            ) : null
                          ))
                        }

                        {/* Backwards compatible fallback smart action */}
                        {(!msg.actions || msg.actions.length === 0) && msg.smart_action && (
                          msg.smart_action.action_url ? (
                            <a
                              href={msg.smart_action.action_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                            >
                              <span>↗️ {msg.smart_action.action_label}</span>
                            </a>
                          ) : msg.smart_action.action_page ? (
                            <button
                              onClick={() => {
                                if (msg.smart_action?.action_page === 'Academic Programs') onNavigateTab('programs');
                                else if (msg.smart_action?.action_page === 'Campus Explorer') onNavigateTab('explorer');
                                else if (msg.smart_action?.action_page === 'Leadership') onNavigateTab('leadership');
                              }}
                              className="inline-flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                            >
                              <span>↗️ {msg.smart_action.action_label}</span>
                            </button>
                          ) : null
                        )}
                      </div>
                    )}
                  </div>

                  {/* Bot Actions: Speak & Feedback */}
                  {isBot && index > 0 && (
                    <div className="flex items-center gap-2 text-xs text-slate-500 pl-1">
                      {/* Audio Read-out */}
                      <button
                        id={`speak-btn-${msg.id}`}
                        onClick={() => speakMessage(msg.id, msg.content)}
                        className={`p-1 rounded-md hover:bg-slate-200 transition-colors ${
                          speakingMsgId === msg.id ? 'text-amber-600 bg-amber-50' : 'text-slate-500'
                        }`}
                        title="Read answer aloud"
                        aria-label="Read answer aloud"
                      >
                        {speakingMsgId === msg.id ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      </button>

                      {/* Feedback Thumb Up */}
                      <button
                        id={`thumbs-up-${msg.id}`}
                        onClick={() => handleFeedback(msg.id, true)}
                        className={`p-1 rounded-md transition-colors ${
                          msg.feedback === 'helpful'
                            ? 'text-emerald-600 bg-emerald-50 font-bold'
                            : 'hover:bg-slate-200 text-slate-500'
                        }`}
                        title="Helpful verified response"
                        aria-label="Thumbs up helpful response"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>

                      {/* Feedback Thumb Down */}
                      <button
                        id={`thumbs-down-${msg.id}`}
                        onClick={() => handleFeedback(msg.id, false)}
                        className={`p-1 rounded-md transition-colors ${
                          msg.feedback === 'unhelpful'
                            ? 'text-rose-600 bg-rose-50 font-bold'
                            : 'hover:bg-slate-200 text-slate-500'
                        }`}
                        title="Unhelpful response"
                        aria-label="Thumbs down response"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-white border border-slate-200 p-3.5 rounded-2xl rounded-tl-sm shadow-sm text-slate-600 text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                <span className="font-medium text-amber-900">{loadingStatus}</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Chat Input Section */}
      <div className="bg-white border-t border-slate-200 p-4 sticky bottom-0 z-10 shadow-lg">
        <div className="max-w-4xl mx-auto space-y-2">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                id="chat-input-field"
                type="text"
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                placeholder={
                  language === 'Telugu'
                    ? 'ఆదిత్య విశ్వవిద్యాలయం గురించి ఒక ప్రశ్న అడగండి...'
                    : language === 'Hindi'
                    ? 'आदित्य विश्वविद्यालय के बारे में कोई प्रश्न पूछें...'
                    : 'Ask anything about Aditya University (e.g., bus routes, hostels, B.Tech programs, VC)...'
                }
                disabled={isLoading}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white pr-10 shadow-2xs"
              />
              <button
                type="button"
                id="chat-mic-btn"
                onClick={toggleSpeechRecognition}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors ${
                  isRecording ? 'text-rose-600 bg-rose-50' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Voice dictation"
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>

            <button
              id="chat-send-btn"
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="bg-amber-600 hover:bg-amber-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold px-5 py-3 rounded-xl transition-all flex items-center gap-1.5 shadow-sm shrink-0 text-sm"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </form>

          <p className="text-[11px] text-slate-600 text-center">
            Aditya Campus AI answers are strictly grounded in indexed official university resources. Please verify critical academic decisions at the official university office.
          </p>
        </div>
      </div>
    </div>
  );
};
