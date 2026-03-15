import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Send, 
  Bot, 
  User, 
  Brain, 
  Award, 
  CheckCircle, 
  AlertCircle, 
  RefreshCcw,
  Target,
  Terminal,
  Cpu,
  Layers,
  ChevronRight,
  Plus,
  Download,
  ArrowLeft,
  Clock,
  Sparkles,
  Search,
  Zap,
  ShieldCheck,
  Ghost
} from 'lucide-react';
import axios from 'axios';
import { cn } from '../services/utils';

const BASE_URL = "http://localhost:5000/api/interview";

// ── Components ──

const SkillTag = ({ name, onRemove }) => (
  <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400 text-[10px] font-black uppercase tracking-widest animate-in zoom-in duration-300 group">
    {name}
    {onRemove && (
      <button onClick={onRemove} className="text-indigo-400/40 hover:text-white transition-colors">
        <Plus size={12} className="rotate-45" />
      </button>
    )}
  </div>
);

const ConfigInput = ({ label, value, onChange, placeholder, icon: Icon }) => (
  <div className="space-y-3">
    <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] ml-2 flex items-center gap-2">
      {Icon && <Icon size={12} />} {label}
    </label>
    <div className="relative group">
       <input 
          type="text" value={value} onChange={e => onChange(e.target.value)}
          className="w-full bg-white/[0.02] border border-white/5 rounded-[1.2rem] p-5 text-sm font-bold text-white outline-none focus:border-indigo-500/40 transition-all placeholder:text-white/5"
          placeholder={placeholder}
       />
       <div className="absolute inset-0 rounded-[1.2rem] bg-indigo-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
    </div>
  </div>
);

const InterviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // ── States ──
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [recentDossier, setRecentDossier] = useState(null);
  
  const [role, setRole] = useState(location.state?.role || "Software Engineer");
  const [level, setLevel] = useState("Intermediate");
  const [skills, setSkills] = useState(["React", "Node.js", "Javascript"]);
  const [skillInput, setSkillInput] = useState("");
  const [maxQuestions, setMaxQuestions] = useState(5);
  
  const [sessionId, setSessionId] = useState(null);
  const [rounds, setRounds] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentSkill, setCurrentSkill] = useState("");
  const [questionNumber, setQuestionNumber] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [finalReport, setFinalReport] = useState(null);
  const [input, setInput] = useState("");
  
  const chatEndRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('skillrise_last_report');
    if (saved) try { setRecentDossier(JSON.parse(saved)); } catch(e) {}
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [rounds, currentQuestion, loading]);

  useEffect(() => {
    const handleKey = (e) => {
      if (isSetupComplete && !isStarted && e.key === 'Enter') handleBeginAssessment();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isSetupComplete, isStarted]);

  // ── Logic ──

  const handleBeginAssessment = async () => {
    setLoading(true);
    setIsStarted(true);
    setRounds([]);
    try {
      const response = await axios.post(`${BASE_URL}/start`, { role, level, skills, maxQuestions });
      const { sessionId: sid, question, questionNumber: qNum, skill } = response.data;
      setSessionId(sid);
      setQuestionNumber(qNum);
      setCurrentQuestion(question);
      setCurrentSkill(skill);
    } catch (error) {
       console.error("Neural uplink failed:", error);
       setCurrentQuestion("Connection lost. Please ensure the AI lab server is active.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!input.trim() || loading) return;
    const userEntry = input;
    const answeredQuestion = currentQuestion;
    const answeredSkill = currentSkill;

    setInput("");
    setLoading(true);
    setCurrentQuestion(null); // Fix: Remove active question immediately to prevent duplication

    // Push User bubble to history
    setRounds(prev => [...prev, { type: 'user', text: userEntry, question: answeredQuestion, skill: answeredSkill }]);

    try {
      const resp = await axios.post(`${BASE_URL}/answer`, { sessionId, answer: userEntry });
      const { conversationalResponse, nextQuestion, questionNumber: nNum, skill: nSkill, isComplete: done } = resp.data;

      // Add AI Acknowledgment bubble
      setRounds(prev => [...prev, { type: 'ai', text: conversationalResponse, isAck: true }]);

      if (nextQuestion && !done) {
        setQuestionNumber(nNum);
        setCurrentSkill(nSkill);
        // Small delay for natural feel
        setTimeout(() => setCurrentQuestion(nextQuestion), 100);
      } else {
        setIsComplete(true);
        handleFetchReport(sessionId);
      }
    } catch (err) {
       console.error("Transmission error:", err);
       setRounds(prev => [...prev, { type: 'system', text: "Signal lost. Attempting reconnection..." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchReport = async (sid) => {
    setLoading(true);
    try {
      const resp = await axios.get(`${BASE_URL}/report`, { params: { sessionId: sid } });
      setFinalReport(resp.data);
      // Sync rounds with polished analysis
      if (resp.data.questionAnalysis) {
        const syncedRounds = resp.data.questionAnalysis.flatMap(node => [
          { type: 'user', text: node.answer, question: node.question, skill: 'Analyzed' },
          { type: 'ai', text: node.feedback, isAck: true, isHistoricalFeedback: true }
        ]);
        setRounds(syncedRounds);
      }
      localStorage.setItem('skillrise_last_report', JSON.stringify({ ...resp.data, timestamp: new Date().toISOString(), role, level }));
    } catch (e) {
       console.error("Dossier pull failed:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!finalReport) return;
    const blob = new Blob([JSON.stringify(finalReport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skillrise_dossier_${role.replace(/\s+/g, '_')}.json`;
    a.click();
  };

  // ── Render ──

  if (!isSetupComplete) {
    return (
      <div className="w-full h-full bg-[#050505] flex flex-col items-center px-10 py-12 lg:px-20 overflow-y-auto scrollbar-hide">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 py-12">
          
          <div className="lg:col-span-7 space-y-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-5 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-[10px] font-black uppercase tracking-[0.5em]">
                <Zap size={14} className="fill-indigo-400" /> Assessment Terminal
              </div>
              <h1 className="text-8xl font-black text-white tracking-tighter leading-[0.9]">
                PREPARE FOR <br /> <span className="text-indigo-500 italic">IMPACT.</span>
              </h1>
              <p className="text-white/20 text-xl font-medium leading-relaxed max-w-xl">
                The laboratory uses Gemini Intelligence to create a adaptive technical dialogue. No fixed questions. Just real engineering.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] space-y-4 hover:border-indigo-500/20 transition-all group">
                  <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all"><Cpu size={24} /></div>
                  <h3 className="text-lg font-bold text-white">Adaptive Difficulty</h3>
                  <p className="text-sm text-white/20 font-medium">The AI adjusts question depth based on your previous answers.</p>
               </div>
               <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] space-y-4 hover:border-emerald-500/20 transition-all group">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all"><ShieldCheck size={24} /></div>
                  <h3 className="text-lg font-bold text-white">Deep Core Audit</h3>
                  <p className="text-sm text-white/20 font-medium">Receive a comprehensive Dossier covering logic, tech, and grit.</p>
               </div>
            </div>

            {recentDossier && (
              <div className="pt-12 border-t border-white/5 space-y-6">
                 <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] ml-1">Historical Dossier</h4>
                 <button 
                  onClick={() => { 
                    setFinalReport(recentDossier); 
                    // Populate rounds from analysis data
                    if (recentDossier.questionAnalysis) {
                      const historicalRounds = recentDossier.questionAnalysis.flatMap(node => [
                        { type: 'user', text: node.answer, question: node.question, skill: 'Historical' },
                        { type: 'ai', text: node.feedback, isAck: true, isHistoricalFeedback: true }
                      ]);
                      setRounds(historicalRounds);
                    }
                    setIsSetupComplete(true); 
                    setIsStarted(true); 
                    setIsComplete(true); 
                  }}
                  className="w-full p-8 bg-indigo-600/5 border border-indigo-500/10 rounded-[2.5rem] flex items-center justify-between hover:bg-indigo-600 transition-all text-left group"
                 >
                    <div className="flex items-center gap-6">
                       <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:bg-white group-hover:text-indigo-600"><Award size={28} /></div>
                       <div className="space-y-1">
                          <p className="text-md font-black text-white group-hover:text-white">Review Last Assessment</p>
                          <p className="text-[11px] text-white/30 uppercase tracking-widest font-black">{recentDossier.role} • Score {recentDossier.overallScore}</p>
                       </div>
                    </div>
                    <ChevronRight size={24} className="text-white/20 group-hover:text-white group-hover:translate-x-2 transition-all" />
                 </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-5 relative">
            <div className="absolute inset-0 bg-indigo-600/5 blur-[100px] rounded-full -z-10" />
            <div className="bg-[#0c0c14] border border-white/10 rounded-[3.5rem] p-12 space-y-12 shadow-4xl relative z-10">
               <ConfigInput label="Target Designation" value={role} onChange={setRole} placeholder="e.g. Lead Architect" icon={Target} />
               
               <div className="space-y-4">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] ml-2 flex items-center gap-2"><Target size={12} /> Mission Level</label>
                  <div className="flex bg-white/[0.02] p-1.5 rounded-[1.3rem] border border-white/5">
                     {['Beginner', 'Intermediate', 'Advanced'].map(l => (
                       <button 
                        key={l} onClick={() => setLevel(l)}
                        className={cn("flex-1 py-4 rounded-[1rem] text-[10px] font-black uppercase tracking-widest transition-all", level === l ? "bg-white text-black shadow-2xl" : "text-white/20 hover:text-white/40")}
                       >
                         {l}
                       </button>
                     ))}
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="flex justify-between items-center px-1">
                     <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] flex items-center gap-2"><Layers size={12} /> Inquiry Volume</label>
                     <span className="text-indigo-400 font-mono text-xs font-black">{maxQuestions} Nodes</span>
                  </div>
                  <input type="range" min="3" max="10" value={maxQuestions} onChange={e => setMaxQuestions(parseInt(e.target.value))} className="w-full h-1.5 bg-white/5 rounded-full appearance-none accent-indigo-500 cursor-pointer" />
               </div>

               <div className="space-y-6">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] ml-2 flex items-center gap-2"><Terminal size={12} /> Skill Matrix</label>
                  <div className="relative group">
                    <input 
                      type="text" value={skillInput} onChange={e => setSkillInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), (skillInput.trim() && !skills.includes(skillInput.trim()) && (setSkills([...skills, skillInput.trim()]), setSkillInput(""))))}
                      className="w-full bg-white/[0.02] border border-white/5 rounded-[1.2rem] p-5 pr-16 text-sm font-bold text-white outline-none focus:border-indigo-500/40"
                      placeholder="Add tech stack..."
                    />
                    <button onClick={() => { if(skillInput.trim() && !skills.includes(skillInput.trim())) { setSkills([...skills, skillInput.trim()]); setSkillInput(""); } }} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all"><Plus size={18} /></button>
                  </div>
                  <div className="flex flex-wrap gap-2.5 min-h-[50px]">
                     {skills.map(s => <SkillTag key={s} name={s} onRemove={() => setSkills(skills.filter(i => i !== s))} />)}
                  </div>
               </div>

               <button 
                onClick={() => setIsSetupComplete(true)} disabled={!role || skills.length === 0}
                className="w-full py-8 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-[0.6em] text-[11px] flex items-center justify-center gap-6 hover:bg-indigo-500 transition-all shadow-indigo-600/20 shadow-2xl active:scale-95 group disabled:opacity-20"
               >
                  ESTABLISH NEURAL LINK
                  <ChevronRight size={18} className="group-hover:translate-x-2 transition-transform" />
               </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isSetupComplete && !isStarted) {
    return (
      <div className="w-full h-full bg-[#050505] flex flex-col items-center justify-center p-12 text-center relative overflow-hidden">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-600/[0.08] blur-[150px] rounded-full pointer-events-none animate-pulse" />
         <div className="space-y-16 relative z-10 max-w-2xl">
            <div className="w-40 h-40 bg-indigo-600 rounded-[3.5rem] flex items-center justify-center mx-auto shadow-[0_0_80px_rgba(99,102,241,0.3)] border border-white/20 animate-bounce"><Brain size={80} className="text-white" /></div>
            <div className="space-y-6">
               <h2 className="text-7xl font-black text-white tracking-tighter leading-none">SYSTEM <br /> <span className="text-indigo-400 italic">CALIBRATED</span></h2>
               <p className="text-white/30 text-xl font-medium max-w-lg mx-auto leading-relaxed">Prepare for a high-intensity technical dialogue. Gemini is scanning your profile for {role}.</p>
            </div>
            <div className="pt-10">
               <p className="text-indigo-500/40 text-[11px] font-black uppercase tracking-[1em] mb-10 animate-pulse">[ PRESS ENTER TO ENGAGE ]</p>
               <button onClick={handleBeginAssessment} className="group px-24 py-8 bg-white text-black rounded-full text-xs font-black uppercase tracking-[1.5em] hover:bg-indigo-600 hover:text-white transition-all shadow-4xl relative overflow-hidden">
                  <span className="relative z-10">ENGAGE</span>
                  <div className="absolute inset-0 bg-indigo-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
               </button>
            </div>
         </div>
      </div>
    );
  }

  // ── Chat Stream ──

  return (
    <div className="w-full h-full flex flex-col bg-[#08080c] relative overflow-hidden border border-white/5 rounded-[3rem]">
      
      {/* Header HUD */}
      <header className="shrink-0 h-24 border-b border-white/5 bg-[#0c0c14]/60 backdrop-blur-3xl px-12 flex items-center justify-between z-50">
        <div className="flex items-center gap-10">
           <div className="flex flex-col">
              <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] mb-1">Session Protocol</span>
              <div className="flex items-center gap-4">
                 <h2 className="text-xl font-black text-white tracking-tight">{role}</h2>
                 <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-md text-[9px] font-black text-indigo-400 uppercase tracking-widest">{level}</div>
              </div>
           </div>
        </div>
        <div className="flex items-center gap-16">
           <div className="flex flex-col items-center">
              <span className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1 font-mono">NODE STATUS</span>
              <div className="flex items-baseline gap-2 text-white/30">
                 <span className="text-4xl font-black text-white font-mono leading-none drop-shadow-sm">{isComplete ? maxQuestions : questionNumber}</span>
                 <span className="text-sm font-bold">/ {maxQuestions}</span>
              </div>
           </div>
           <div className="h-10 w-px bg-white/10" />
           <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1 font-mono">STABILITY</span>
              <div className="flex items-center gap-3">
                 <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                 <span className="text-[12px] font-black text-emerald-400 tracking-[0.2em] uppercase leading-none">SECURE</span>
              </div>
           </div>
        </div>
      </header>

      {/* Message Flow */}
      <main className="flex-1 overflow-y-auto p-12 space-y-16 scrollbar-hide relative z-30">
        <div className="max-w-5xl mx-auto space-y-16 pb-20">
          
          {rounds.map((round, i) => (
            <div key={i} className="animate-in slide-in-from-bottom-4 duration-500 space-y-10">
               {/* Historical Question */}
               {round.question && (
                 <div className="flex items-start gap-6 max-w-[90%]">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/20 shrink-0 border border-white/5 shadow-sm"><Bot size={22} /></div>
                    <div className="space-y-3">
                       <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] ml-1">AI LABS • {round.skill}</p>
                       <div className="bg-[#11111d] border border-white/5 rounded-3xl rounded-tl-none p-8 py-7 shadow-xl">
                          <p className="text-xl text-white/90 font-medium leading-[1.65] font-sans">{round.question}</p>
                       </div>
                    </div>
                 </div>
               )}
               {/* Historical User Answer */}
               {round.type === 'user' && (
                 <div className="flex items-start gap-6 justify-end">
                    <div className="space-y-3 max-w-[85%] text-right">
                       <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mr-1">CANDIDATE LOG</p>
                       <div className="bg-indigo-600 rounded-[2.5rem] rounded-tr-none p-8 py-7 text-xl text-white font-medium leading-[1.65] shadow-2xl relative overflow-hidden text-left group">
                          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <p className="relative z-10">{round.text}</p>
                       </div>
                    </div>
                    <div className="w-12 h-12 bg-white text-indigo-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg"><User size={22} /></div>
                 </div>
               )}
               {/* Historical AI Acknowledgment */}
               {round.isAck && (
                 <div className="flex items-start gap-6 max-w-[85%] pb-4">
                    <div className="w-9 h-9 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 shrink-0 border border-emerald-500/20"><Sparkles size={16} /></div>
                    <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl px-6 py-4 text-emerald-400/80 text-[15px] font-medium italic backdrop-blur-md shadow-sm">
                       {round.text}
                    </div>
                 </div>
               )}
            </div>
          ))}

          {/* Active Question Portal */}
          {currentQuestion && !isComplete && (
            <div className="flex items-start gap-6 animate-in fade-in slide-in-from-bottom-12 duration-1000">
               <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-[0_0_30px_rgba(99,102,241,0.3)] border border-white/10"><Bot size={28} /></div>
               <div className="space-y-6 max-w-[85%]">
                  <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-[10px] font-black uppercase tracking-[0.6em]">
                    Active Inquiry • {currentSkill}
                  </div>
                  <div className="bg-[#11111d] border border-indigo-500/20 rounded-3xl rounded-tl-none p-8 py-7 shadow-xl relative group">
                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity"><Zap size={18} className="text-white" /></div>
                     <h3 className="text-xl text-white/90 font-medium leading-[1.65] font-sans">{currentQuestion}</h3>
                  </div>
               </div>
            </div>
          )}

          {/* Typing indicator */}
          {loading && !currentQuestion && !isComplete && (
             <div className="flex items-start gap-6 opacity-30">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/20 shrink-0 border border-white/5"><Bot size={22} /></div>
                <div className="bg-[#11111d] rounded-2xl px-8 py-6 flex gap-2 items-center">
                   <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                   <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                   <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                </div>
             </div>
          )}

          {/* End of Interview Dossier */}
          {isComplete && finalReport && (
            <div className="py-20 animate-in slide-in-from-bottom-24 duration-1500 space-y-20">
               
               {/* Impact Card */}
               <div className="bg-gradient-to-br from-[#0c0c14] to-[#050508] border border-indigo-500/30 rounded-[5rem] p-24 text-center relative overflow-hidden shadow-4xl">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/5 via-transparent to-transparent" />
                  <div className="space-y-12 relative z-10 flex flex-col items-center">
                     <div className="w-28 h-28 bg-indigo-600 rounded-[3rem] flex items-center justify-center shadow-3xl transform -rotate-6"><Award size={56} className="text-white" /></div>
                     <div className="space-y-4">
                        <h2 className="text-[12px] font-black text-white/30 uppercase tracking-[1em] mb-4">INTELLIGENCE QUOTIENT</h2>
                        <div className="text-[200px] font-black text-white font-mono italic leading-none tracking-tighter drop-shadow-[0_0_60px_rgba(255,255,255,0.05)]">{finalReport.overallScore}</div>
                     </div>
                     <div className="p-8 border border-white/5 rounded-[3rem] bg-white/[0.01] max-w-2xl px-12">
                        <p className="text-3xl font-light text-white/70 italic leading-tight tracking-tight">"{finalReport.summary || "Consistent technical logic and rapid concept synthesis."}"</p>
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="p-12 bg-emerald-500/[0.02] border border-emerald-500/10 rounded-[4rem] space-y-8 backdrop-blur-3xl relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-8 opacity-20"><ShieldCheck size={32} className="text-emerald-400" /></div>
                     <h4 className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.6em] pl-1">Logic Strengths</h4>
                     <ul className="space-y-6">
                       {finalReport.strengths.map((s, i) => <li key={i} className="text-white/60 font-bold text-xl flex items-start gap-6 leading-tight"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-2 shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.5)]" /> {s}</li>)}
                     </ul>
                  </div>
                  <div className="p-12 bg-rose-500/[0.02] border border-rose-500/10 rounded-[4rem] space-y-8 backdrop-blur-3xl relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-8 opacity-20"><AlertCircle size={32} className="text-rose-400" /></div>
                     <h4 className="text-[11px] font-black text-rose-400 uppercase tracking-[0.6em] pl-1">Knowledge Gaps</h4>
                     <ul className="space-y-6">
                       {finalReport.weaknesses.map((w, i) => <li key={i} className="text-white/60 font-bold text-xl flex items-start gap-6 leading-tight"><div className="w-2.5 h-2.5 rounded-full bg-rose-500 mt-2 shrink-0 shadow-[0_0_10px_rgba(244,63,94,0.5)]" /> {w}</li>)}
                     </ul>
                  </div>
               </div>

               {/* Breakdown */}
               <div className="space-y-12">
                  <h3 className="text-[11px] font-black text-white/20 uppercase tracking-[1em] text-center pt-10">NODE-BY-NODE ANALYSIS</h3>
                  <div className="space-y-10">
                    {finalReport.questionAnalysis?.map((node, idx) => (
                      <div key={idx} className="bg-white/[0.01] border border-white/5 rounded-[4rem] p-16 space-y-16 group hover:bg-white/[0.02] transition-all">
                         <div className="flex flex-col md:flex-row justify-between items-start gap-10">
                            <div className="space-y-4 flex-1">
                               <p className="text-[11px] font-black text-white/20 uppercase tracking-[0.5em]">Probe {idx+1}</p>
                               <h4 className="text-4xl font-black text-white leading-tight tracking-tight">{node.question}</h4>
                            </div>
                            <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-center shrink-0 min-w-[140px] shadow-2xl">
                               <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">Score</p>
                               <p className="text-6xl font-black text-white font-mono leading-none tracking-tighter italic">{node.score}</p>
                            </div>
                         </div>
                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                            <div className="space-y-6">
                               <h5 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.5em] flex items-center gap-3"><Ghost size={16} /> Technical Critique</h5>
                               <p className="text-white/40 text-[18px] font-medium leading-[1.8] italic">"{node.feedback}"</p>
                            </div>
                            <div className="space-y-6">
                               <h5 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.5em] flex items-center gap-3"><CheckCircle size={16} /> Optimized Projection</h5>
                               <div className="p-10 bg-emerald-500/[0.02] border border-emerald-500/10 rounded-[3rem]">
                                  <p className="text-emerald-400/60 text-[16px] font-semibold leading-[1.8] italic">"{node.betterAnswer}"</p>
                               </div>
                            </div>
                         </div>
                      </div>
                    ))}
                  </div>
               </div>

               <div className="flex flex-col sm:flex-row gap-8 pb-40">
                  <button onClick={handleDownload} className="flex-1 py-12 bg-indigo-600 text-white rounded-[3.5rem] font-black uppercase tracking-[1em] text-xs flex items-center justify-center gap-6 hover:bg-white hover:text-indigo-600 transition-all shadow-3xl"><Download size={22} /> EXPORT DOSSIER</button>
                  <button onClick={() => navigate('/dashboard')} className="flex-1 py-12 bg-white/5 border border-white/10 text-white/40 rounded-[3.5rem] font-black uppercase tracking-[1em] text-xs flex items-center justify-center gap-6 hover:bg-white hover:text-black transition-all group"><ArrowLeft size={22} className="group-hover:-translate-x-2 transition-transform" /> COMMAND BASE</button>
               </div>

            </div>
          )}
        </div>
        <div ref={chatEndRef} className="h-60" />
      </main>

      {/* Input Module */}
      {!isComplete && isStarted && (
        <footer className="shrink-0 p-12 pt-0 bg-transparent z-50">
           <div className="max-w-5xl mx-auto group">
              <div className="bg-[#0c0c14] border border-white/10 rounded-[3rem] p-5 pr-5 flex gap-5 shadow-4xl focus-within:border-indigo-500/30 transition-all hover:bg-[#11111d]">
                  <textarea 
                    value={input} onChange={e => setInput(e.target.value)}
                    placeholder="Calibrate and transmit your response..."
                    className="flex-1 bg-transparent border-none text-white text-2xl font-medium outline-none resize-none px-8 py-6 min-h-[80px] max-h-[300px] scrollbar-hide focus:ring-0 placeholder:text-white/10"
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSubmitAnswer())}
                  />
                  <button 
                    onClick={handleSubmitAnswer} 
                    disabled={!input.trim() || loading} 
                    className={cn("w-20 h-20 rounded-[2rem] flex items-center justify-center transition-all shadow-3xl group/btn", 
                      !input.trim() || loading ? "bg-white/5 text-white/10" : "bg-white text-black hover:scale-110 active:scale-95")}
                  >
                    {loading ? <RefreshCcw size={28} className="animate-spin text-indigo-500" /> : <Send size={28} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />}
                  </button>
              </div>
              <div className="flex justify-between px-10 py-4 opacity-20 text-[9px] font-black text-white uppercase tracking-[0.5em]">
                 <span>NEURAL LINK ENCRYPTED</span>
                 <span>VOICE SYNTHESIS READY</span>
              </div>
           </div>
        </footer>
      )}
    </div>
  );
};

export default InterviewPage;
