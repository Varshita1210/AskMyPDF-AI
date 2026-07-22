import { useState, useRef, useEffect } from 'react';
import { 
  Send, Trash2, Copy, RefreshCw, Brain, User, 
  Check, ChevronDown, ChevronUp, FileText, AlertCircle, Plus, MessageSquare
} from 'lucide-react';
import type { Message, ChatSession } from '../types';

interface AIChatProps {
  messages: Message[];
  onSendMessage: (content: string) => Promise<void>;
  onClearChat: () => void;
  onRegenerate: () => Promise<void>;
  isGenerating: boolean;
  documentsCount: number;
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onCreateSession: () => void;
  onDeleteSession: (id: string) => void;
}

export default function AIChat({ 
  messages, 
  onSendMessage, 
  onClearChat, 
  onRegenerate, 
  isGenerating,
  documentsCount,
  sessions,
  activeSessionId,
  onSelectSession,
  onCreateSession,
  onDeleteSession
}: AIChatProps) {
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedCitationIndex, setExpandedCitationIndex] = useState<{ [key: string]: boolean }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    "What is the maintenance schedule?",
    "Show safety procedures.",
    "Explain this document.",
    "Summarize this PDF.",
    "What are the inspection guidelines?"
  ];

  // Helper to safely highlight keywords in AI responses matching terms from the last user question
  const highlightKeywords = (text: string) => {
    const userMessages = messages.filter(m => m.role === 'user');
    if (userMessages.length === 0) return <span>{text}</span>;
    
    const lastUserQuery = userMessages[userMessages.length - 1].content;
    if (!lastUserQuery.trim()) return <span>{text}</span>;

    // Filter words to highlight: longer than 3 letters, alphanumeric
    const words = lastUserQuery
      .split(/[^a-zA-Z0-9]+/)
      .filter(w => w.length > 3)
      .map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

    if (words.length === 0) return <span>{text}</span>;

    try {
      const regex = new RegExp(`\\b(${words.join('|')})\\b`, 'gi');
      const parts = text.split(regex);

      return (
        <span>
          {parts.map((part, idx) => 
            regex.test(part) ? (
              <mark 
                key={idx} 
                className="bg-blue-50 text-blue-600 border border-blue-100/50 px-1 py-0.2 rounded font-bold"
              >
                {part}
              </mark>
            ) : (
              part
            )
          )}
        </span>
      );
    } catch (e) {
      return <span>{text}</span>;
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isGenerating) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handleSuggestClick = (prompt: string) => {
    if (isGenerating) return;
    onSendMessage(prompt);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleCitation = (msgId: string, citIdx: number) => {
    const key = `${msgId}-${citIdx}`;
    setExpandedCitationIndex(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-[#eaf6ff] overflow-hidden transition-colors duration-400">
      
      {/* Left Chat Sessions Sidebar */}
      <div className="w-60 border-r border-[#d6ecff] bg-[#dff3ff] flex flex-col justify-between hidden md:flex shrink-0">
        <div className="p-4 space-y-4 flex-1 flex flex-col overflow-y-auto">
          {/* New Chat Button */}
          <button
            onClick={onCreateSession}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold transition-all shadow-md shadow-blue-500/10 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>

          {/* Session Cards list */}
          <div className="space-y-1.5 flex-1">
            <span className="text-[9px] text-slate-400 uppercase tracking-wider font-extrabold block mb-2.5 px-2">Recent Chats</span>
            {sessions.map((session) => {
              const isActive = session.id === activeSessionId;
              return (
                <div
                  key={session.id}
                  className={`w-full group flex items-center justify-between rounded-xl p-2.5 text-xs font-semibold border transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600 border-blue-100 shadow-sm' 
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50 border-transparent'
                  }`}
                  onClick={() => onSelectSession(session.id)}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <MessageSquare className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span className="truncate pr-2">{session.title}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-50 hover:text-red-500 text-slate-400 transition-all shrink-0 cursor-pointer"
                    title="Delete Chat"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Central Chat Arena */}
      <div className="flex-1 flex flex-col justify-between h-full relative">
        {/* Chat Header */}
        <div className="h-14 border-b border-[#d6ecff] px-8 flex items-center justify-between bg-[#f8fcff] z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-sky-400 flex items-center justify-center shadow-md shadow-blue-500/15">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div className="text-left">
              <h2 className="text-xs md:text-sm font-extrabold text-slate-900 flex items-center gap-1.5 font-sans">
                AskMyPDF Copilot
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" title="Ready"></span>
              </h2>
              <p className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Gemini API Ingestion</p>
            </div>
          </div>
          
          <button
            onClick={onClearChat}
            disabled={messages.length === 0 || isGenerating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Session
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-thin">
          {documentsCount === 0 && (
            <div className="p-4 mb-6 rounded-2xl bg-amber-50 border border-amber-100 text-left max-w-xl mx-auto flex gap-3 text-xs text-amber-600 shadow-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold">No documents indexed</h4>
                <p className="text-slate-500 mt-0.5 leading-relaxed font-sans font-normal">
                  AskMyPDF AI doesn't have any uploaded documents to search details from yet. Please go to the **Upload Documents** tab to ingest manuals first!
                </p>
              </div>
            </div>
          )}

          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-8 mt-12">
              <div className="w-16 h-16 rounded-3xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-md shadow-blue-500/5">
                <Brain className="w-8 h-8 text-blue-600 animate-float-slow" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 font-sans tracking-tight">Ask My PDF Brain</h3>
                <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto leading-relaxed font-normal">
                  Query SOPs, spec sheets, maintenance intervals, and safety documents. Citations and matching segments are highlighted and returned automatically.
                </p>
              </div>
              
              {/* Suggested Pills */}
              <div className="w-full space-y-3">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold">Suggested Questions</p>
                <div className="flex flex-wrap justify-center gap-2.5 max-w-lg mx-auto">
                  {suggestedPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestClick(prompt)}
                      className="px-4 py-2.5 text-xs text-slate-700 bg-white border border-[#d6ecff] hover:border-blue-400 hover:bg-blue-50/50 rounded-2xl text-left transition-all shadow-sm font-semibold cursor-pointer"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 max-w-3xl mx-auto">
              {messages.map((msg) => (
                <div key={msg.id} className="flex gap-4">
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-slate-200 text-slate-600' 
                      : 'bg-gradient-to-br from-blue-600 to-sky-400 text-white'
                  }`}>
                    {msg.role === 'user' ? <User className="w-4.5 h-4.5" /> : <Brain className="w-4.5 h-4.5 text-white" />}
                  </div>

                  {/* Message body */}
                  <div className="flex-1 space-y-2 text-left">
                    <div className="flex items-center gap-2.5">
                      <span className="font-extrabold text-[10px] text-slate-400 uppercase tracking-wider">
                        {msg.role === 'user' ? 'Operator' : 'AskMyPDF Assistant'}
                      </span>
                      <span className="text-[9px] text-slate-400 font-bold block">{msg.timestamp}</span>

                      {/* Confidence Score */}
                      {msg.role === 'assistant' && msg.confidenceScore !== undefined && (
                        <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold ${
                          msg.confidenceScore >= 90 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                          msg.confidenceScore >= 70 ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                          'bg-red-50 text-red-600 border-red-100'
                        }`}>
                          {msg.confidenceScore}% Confidence
                        </span>
                      )}
                    </div>

                    <div className={`text-sm leading-relaxed p-4 rounded-[20px] border shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-blue-600 border-blue-500 text-white rounded-tr-sm font-semibold'
                        : 'bg-white border-[#d6ecff] text-slate-800 rounded-tl-sm font-normal font-sans'
                    }`}>
                      {msg.role === 'user' ? (
                        <p className="whitespace-pre-line">{msg.content}</p>
                      ) : (
                        <p className="whitespace-pre-line">{highlightKeywords(msg.content)}</p>
                      )}
                    </div>

                    {/* Citations Card Accordion */}
                    {msg.role === 'assistant' && msg.citations && msg.citations.length > 0 && (
                      <div className="mt-2.5 border border-[#d6ecff] rounded-[20px] overflow-hidden bg-white shadow-sm">
                        <div className="px-4 py-2.5 text-xs font-bold text-slate-500 bg-slate-50 border-b border-[#d6ecff] flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-600" />
                            Source Citations ({msg.citations.length})
                          </span>
                        </div>
                        <div className="divide-y divide-[#d6ecff]">
                          {msg.citations.map((citation, citIdx) => {
                            const citationKey = `${msg.id}-${citIdx}`;
                            const isExpanded = !!expandedCitationIndex[citationKey];
                            return (
                              <div key={citIdx} className="text-xs">
                                <button
                                  onClick={() => toggleCitation(msg.id, citIdx)}
                                  className="w-full px-4 py-2.5 text-left flex items-center justify-between text-slate-700 hover:bg-[#eaf6ff]/50 transition-colors font-sans font-bold"
                                >
                                  <span className="truncate max-w-[280px] sm:max-w-xs">
                                    {citation.doc_name} {citation.chunk_index !== undefined ? `(Chunk #${citation.chunk_index + 1})` : ''}
                                  </span>
                                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
                                </button>
                                {isExpanded && (
                                  <div className="px-4 pb-3.5 pt-1.5 text-slate-500 font-mono text-[11px] leading-relaxed bg-[#f8fcff] border-t border-[#d6ecff]">
                                    "{citation.text_snippet}"
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Actions Panel */}
                    {msg.role === 'assistant' && (
                      <div className="flex gap-2.5 pt-1">
                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="p-2 rounded-xl hover:bg-white text-slate-400 hover:text-slate-700 border border-transparent hover:border-[#d6ecff] transition-colors cursor-pointer shadow-sm"
                          title="Copy Answer"
                        >
                          {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        {msg.id === messages[messages.length - 1].id && (
                          <button
                            onClick={onRegenerate}
                            disabled={isGenerating}
                            className="p-2 rounded-xl hover:bg-white text-slate-400 hover:text-slate-700 border border-transparent hover:border-[#d6ecff] transition-colors cursor-pointer shadow-sm"
                            title="Regenerate Answer"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Loader for response generation */}
              {isGenerating && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-sky-400 text-white flex items-center justify-center animate-pulse shadow-sm">
                    <Brain className="w-4.5 h-4.5 text-white" />
                  </div>
                  <div className="flex-1 space-y-2 text-left">
                    <span className="font-extrabold text-[10px] text-slate-400 uppercase tracking-wider">AI Assistant</span>
                    <div className="p-4 rounded-2xl border border-blue-100 bg-white shadow-sm flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]"></span>
                      </div>
                      <span className="text-xs text-slate-500 italic">Reading indexed context & generating cited answers...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Bar Container */}
        <div className="p-6 border-t border-[#d6ecff] bg-[#f8fcff]">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex gap-3 relative items-center">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isGenerating}
              placeholder="Ask questions, summarize document text, query safety guidelines..."
              className="flex-1 h-12 bg-white rounded-2xl border border-[#d6ecff] pl-4 pr-14 text-sm text-slate-700 focus:border-blue-500 shadow-sm"
            />
            <button
              type="submit"
              disabled={isGenerating || !inputText.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-600 hover:bg-blue-700 disabled:opacity-30 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
