import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Brain, 
  Award, 
  CheckCircle, 
  AlertCircle, 
  RefreshCcw,
  ChevronRight,
  TrendingUp,
  Target,
  Terminal,
  Cpu,
  PlayCircle,
  Briefcase,
  Layers
} from 'lucide-react';
import axios from 'axios';

const BASE_URL = "http://localhost:5000/api/interview";

/**
 * Technical Assessment Laboratory
 * A high-fidelity mock interview platform.
 */
const InterviewPage = () => {
  // ── Session State ──
  const [isStarted, setIsStarted] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]); 
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [questionNumber, setQuestionNumber] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [finalReport, setFinalReport] = useState(null);
  
  // ── Input State ──
  const [input, setInput] = useState("");
  const [role, setRole] = useState("MERN Stack Developer");
  const [level, setLevel] = useState("Intermediate");

  const chatEndRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // ── API Handlers ──

  const handleBeginAssessment = async () => {
    setLoading(true);
    setIsStarted(true);
    try {
      const response = await axios.post(`${BASE_URL}/start`, { role, level });
      const { sessionId, question, questionNumber } = response.data.data;
      
      setSessionId(sessionId);
      setQuestionNumber(questionNumber);
      setCurrentQuestion(question);
      setMessages([{ sender: 'ai', text: question }]);
    } catch (error) {
       console.error("Failed to start:", error);
       setMessages([{ sender: 'ai', text: "Critical link failure. Neural network unreachable. Check server status." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitLogic = async () => {
    if (!input.trim() || loading) return;

    const userEntry = input;
    setInput("");
    setMessages(prev => [...prev, { sender: 'user', text: userEntry }]);
    setLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/answer`, { 
        sessionId, 
        answer: userEntry 
      });
      
      const { evaluation, nextQuestion, questionNumber: nextNum, isComplete: done } = response.data.data;

      // 1. Audit Result
      setMessages(prev => [...prev, { sender: 'feedback', evaluation }]);

      // 2. Cascade or Terminate
      if (nextQuestion && !done) {
        setMessages(prev => [...prev, { sender: 'ai', text: nextQuestion }]);
        setQuestionNumber(nextNum);
        setCurrentQuestion(nextQuestion);
      } else {
        setIsComplete(true);
        handleGenerateReport(sessionId);
      }
    } catch (error) {
       console.error("Submission error:", error);
       setMessages(prev => [...prev, { sender: 'ai', text: "Internal processing error. Retrying logic synchronization..." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async (sid) => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/report`, { 
        params: { sessionId: sid } 
      });
      setFinalReport(response.data.data);
    } catch (error) {
       console.error("Report generation error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ── Sub-Components ──

  const AiMessage = ({ text }) => (
    <div className="flex gap-4 max-w-[85%] animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0 shadow-2xl shadow-indigo-600/30">
        <Bot size={20} className="text-white" />
      </div>
      <div className="p-5 rounded-[1.5rem] rounded-tl-none bg-white/[0.04] border border-white/10 text-white/90 text-[15px] leading-relaxed font-medium shadow-sm">
        {text}
      </div>
    </div>
  );

  const UserMessage = ({ text }) => (
    <div className="flex gap-4 max-w-[85%] ml-auto justify-end animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="p-5 rounded-[1.5rem] rounded-tr-none bg-indigo-500/10 border border-indigo-500/20 text-white text-[15px] leading-relaxed font-medium">
        {text}
      </div>
      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
        <User size={20} className="text-white/40" />
      </div>
    </div>
  );

  const FeedbackAudit = ({ evalData }) => (
    <div className="my-10 mx-auto max-w-[95%] animate-in zoom-in-95 duration-700">
        <div className="bg-gradient-to-br from-[#0f0f1a] to-[#050508] border border-white/10 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group">
            {/* Ambient Background UI */}
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                <Brain size={120} />
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40">Technical Audit Synthesis</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold text-white/20 uppercase">Score Gradient</span>
                    <div className="h-10 px-5 flex items-center bg-indigo-500/10 border border-indigo-500/20 rounded-full text-lg font-black text-indigo-400 font-mono">
                        {evalData.score.toFixed(1)} <span className="text-[10px] text-indigo-500/40 ml-1">/ 10.0</span>
                    </div>
                </div>
            </div>

            <div className="space-y-6 relative z-10">
                <p className="text-[16px] text-white/70 italic leading-relaxed font-medium">
                    "{evalData.feedback}"
                </p>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
                    <div className="p-6 bg-white/[0.02] rounded-2xl border border-white/5 flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-indigo-400">
                            <TrendingUp size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Growth Vector</span>
                        </div>
                        <p className="text-[13px] text-white/40 font-medium leading-relaxed">{evalData.improvement}</p>
                    </div>
                    <div className="p-6 bg-emerald-500/[0.03] rounded-2xl border border-emerald-500/10 flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-emerald-400">
                            <CheckCircle size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Optimized Logic</span>
                        </div>
                        <p className="text-[13px] text-emerald-400/60 font-medium leading-relaxed italic">{evalData.better_answer}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );

  // ── Main Page Render ──

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-8 font-sans">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse" />
              <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-purple-600/10 blur-[150px] rounded-full animate-pulse" />
          </div>

          <div className="max-w-2xl w-full relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                      <Cpu size={14} /> Systems Online
                  </div>
                  <h1 className="text-6xl font-black tracking-tighter mb-4">
                    Mock <span className="text-white/20 italic font-light">Laboratory</span>
                  </h1>
                  <p className="text-white/40 text-lg font-medium leading-relaxed">
                    Initialize an industrial-grade technical assessment session to calibrate your architectural logic.
                  </p>
              </div>

              <div className="bg-[#0c0c14]/50 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl space-y-8">
                  <div className="space-y-6">
                      <div className="space-y-3">
                          <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] ml-2">Assessment Role</label>
                          <div className="relative group">
                              <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-indigo-500 transition-colors" size={20} />
                              <input 
                                type="text" 
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-sm font-bold focus:border-indigo-500/50 outline-none transition-all"
                                placeholder="e.g. Frontend Architect"
                              />
                          </div>
                      </div>

                      <div className="space-y-3">
                          <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] ml-2">Experience Protocol</label>
                          <div className="grid grid-cols-3 gap-4">
                              {['Beginner', 'Intermediate', 'Advanced'].map(lvl => (
                                  <button
                                    key={lvl}
                                    onClick={() => setLevel(lvl)}
                                    className={`py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest border transition-all ${
                                        level === lvl 
                                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20' 
                                        : 'bg-white/[0.03] border-white/5 text-white/20 hover:bg-white/5'
                                    }`}
                                  >
                                      {lvl}
                                  </button>
                              ))}
                          </div>
                      </div>
                  </div>

                  <button 
                    onClick={handleBeginAssessment}
                    disabled={!role.trim() || loading}
                    className="w-full py-6 bg-white text-black rounded-2xl font-black uppercase tracking-[0.3em] text-sm flex items-center justify-center gap-4 hover:bg-indigo-50 transition-all active:scale-[0.98] shadow-2xl"
                  >
                      {loading ? (
                          <RefreshCcw size={20} className="animate-spin" />
                      ) : (
                          <PlayCircle size={20} />
                      )}
                      Initiate Protocol
                  </button>
              </div>
          </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#050505] text-white font-sans overflow-hidden">
      
      {/* ── Dashboard Header ── */}
      <header className="h-24 flex-shrink-0 border-b border-white/5 bg-[#08080c]/80 backdrop-blur-xl px-12 flex items-center justify-between z-20">
        <div className="flex items-center gap-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center shadow-inner">
                <Terminal size={24} className="text-indigo-400" />
            </div>
            <div>
                <h1 className="text-sm font-black uppercase tracking-[0.4em] text-white/40">Neural Assessment Log</h1>
                <div className="flex items-center gap-3">
                    <span className="text-xl font-bold tracking-tighter">{role}</span>
                    <div className="w-1 h-1 rounded-full bg-white/10" />
                    <span className="text-xs font-black text-indigo-500 uppercase tracking-widest">{level}</span>
                </div>
            </div>
        </div>

        <div className="flex gap-10">
            <div className="flex flex-col items-center">
                <span className="text-[10px] font-black text-white/10 uppercase tracking-widest mb-1">Sequence</span>
                <div className="flex items-end gap-1">
                    <span className="text-2xl font-black tabular-nums">{isComplete ? "5" : questionNumber}</span>
                    <span className="text-xs font-bold text-white/20 mb-1">/ 5</span>
                </div>
            </div>
            <div className="w-px h-10 bg-white/5 self-center" />
            <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-white/10 uppercase tracking-widest mb-1">Integrity Sync</span>
                <span className="text-sm font-black text-emerald-400 uppercase tracking-tighter">Optimal</span>
            </div>
        </div>
      </header>

      {/* ── Main Operations Floor ── */}
      <main className="flex-1 overflow-y-auto p-12 space-y-10 scrollbar-hide relative bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat opacity-[0.99] backdrop-brightness-50">
        
        {messages.map((m, i) => (
            m.sender === 'ai' ? <AiMessage key={i} text={m.text} /> :
            m.sender === 'user' ? <UserMessage key={i} text={m.text} /> :
            <FeedbackAudit key={i} evalData={m.evaluation} />
        ))}

        {loading && !isComplete && (
            <div className="flex items-center gap-4 text-white/20 px-6 animate-pulse">
                <RefreshCcw size={16} className="animate-spin text-indigo-500" />
                <span className="text-[11px] font-black uppercase tracking-[0.4em]">Calibrating Neural Response Matrix...</span>
            </div>
        )}

        {/* ── Final Evaluation Dossier ── */}
        {isComplete && finalReport && (
            <div className="max-w-5xl mx-auto py-16 animate-in zoom-in-95 duration-1000">
                <div className="bg-[#0c0c14] border border-white/10 rounded-[3rem] p-12 relative overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.02]">
                       <Award size={200} />
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
                        <div className="flex items-center gap-8">
                            <div className="w-20 h-20 rounded-3xl bg-indigo-600 flex items-center justify-center shadow-3xl shadow-indigo-600/50">
                                <Award size={40} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black tracking-tighter mb-1">Final Dossier</h1>
                                <span className="text-[11px] font-black text-white/20 uppercase tracking-[0.5em]">Candidate Audit Metadata Finalized</span>
                            </div>
                        </div>
                        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 text-center min-w-[150px]">
                             <div className="text-[11px] font-black text-white/20 uppercase tracking-widest mb-2">Composite Result</div>
                             <div className="text-6xl font-black tracking-tighter text-indigo-400 font-mono italic">
                                {finalReport.overall_score.toFixed(1)}
                             </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <section className="space-y-6 p-8 bg-emerald-500/[0.02] border border-emerald-500/10 rounded-[2rem]">
                            <h4 className="flex items-center gap-3 text-[12px] font-black uppercase text-emerald-400 tracking-[0.3em]">
                                <Target size={18} /> core technical assets
                            </h4>
                            <ul className="space-y-4">
                                {finalReport.strengths.map((s, i) => (
                                    <li key={i} className="text-[15px] text-white/50 flex items-start gap-4 leading-relaxed font-medium">
                                        <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0 shadow-[0_0_10px_rgba(52,211,153,0.5)]" /> {s}
                                    </li>
                                ))}
                            </ul>
                        </section>
                        <section className="space-y-6 p-8 bg-rose-500/[0.02] border border-rose-500/10 rounded-[2rem]">
                            <h4 className="flex items-center gap-3 text-[12px] font-black uppercase text-rose-400 tracking-[0.3em]">
                                <AlertCircle size={18} /> systemic gaps identified
                            </h4>
                            <ul className="space-y-4">
                                {finalReport.weaknesses.map((w, i) => (
                                    <li key={i} className="text-[15px] text-white/50 flex items-start gap-4 leading-relaxed font-medium">
                                        <div className="w-2 h-2 rounded-full bg-rose-400 mt-2 flex-shrink-0 shadow-[0_0_10px_rgba(251,113,133,0.5)]" /> {w}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>

                    <div className="mt-12 p-8 border border-white/5 rounded-[2rem] bg-white/[0.01]">
                        <h4 className="text-[11px] font-black text-white/20 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                            <Brain size={16} /> Executive Behavioral Summary
                        </h4>
                        <p className="text-[17px] text-white/60 leading-relaxed font-medium italic">"{finalReport.summary}"</p>
                    </div>

                    <div className="mt-12 flex flex-wrap gap-3 justify-center">
                         {finalReport.suggested_topics.map((t, i) => (
                             <span key={i} className="px-6 py-3 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl text-[10px] font-black text-indigo-400/60 uppercase tracking-widest">
                                {t}
                             </span>
                         ))}
                    </div>

                    <button 
                        onClick={() => window.location.reload()}
                        className="w-full mt-12 py-7 bg-white text-black rounded-3xl font-black uppercase tracking-[0.4em] text-sm hover:bg-white/90 transition-all active:scale-[0.98] shadow-2xl shadow-indigo-600/10"
                    >
                        Re-initialize Assessment Cycle
                    </button>
                </div>
            </div>
        )}

        <div ref={chatEndRef} />
      </main>

      {/* ── Dynamic Input Interface ── */}
      {!isComplete && isStarted && (
        <div className="p-10 border-t border-white/5 bg-[#08080c]/80 backdrop-blur-xl">
            <div className="max-w-4xl mx-auto relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-[2.5rem] blur opacity-0 group-hover:opacity-100 transition duration-1000" />
                <div className="relative bg-[#0c0c14] border border-white/10 rounded-[2.5rem] p-6 flex flex-col gap-6 shadow-2xl focus-within:border-indigo-500/50 transition-all">
                    <textarea 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Calibrate your response here and submit logic for audit..."
                        className="w-full bg-transparent border-none text-white text-[16px] font-medium outline-none resize-none pt-2 px-4 scrollbar-hide focus:ring-0 leading-relaxed"
                        rows="4"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmitLogic();
                            }
                        }}
                    />
                    <div className="flex items-center justify-between border-t border-white/5 pt-6">
                        <div className="flex gap-8 px-4">
                             <div className="flex items-center gap-2 text-white/20">
                                <Cpu size={16} />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Active Voice Output</span>
                             </div>
                             <div className="flex items-center gap-2 text-white/20">
                                <Target size={16} />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Precise Terminology</span>
                             </div>
                        </div>
                        <button 
                            onClick={handleSubmitLogic}
                            disabled={!input.trim() || loading}
                            className={`px-10 py-4 rounded-2xl flex items-center gap-4 transition-all duration-500 ${
                                !input.trim() || loading 
                                ? 'bg-white/5 text-white/20 cursor-not-allowed opacity-50' 
                                : 'bg-white text-black hover:bg-indigo-50 shadow-2xl shadow-white/10 active:scale-[0.95]'
                            }`}
                        >
                            <span className="text-xs font-black uppercase tracking-[0.4em]">Submit Logic</span>
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default InterviewPage;
