import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  PlayCircle,
  Plus,
  Mic,
  FileSearch,
  Briefcase,
  Map,
  Binary,
  TrendingUp,
  ArrowRight,
  X,
  FileText,
  Sparkles,
  Zap
} from "lucide-react";

import FeatureModal from "../components/common/FeatureModal";

/* ─────────────────────────────────────────────
   Feature Card Colors
───────────────────────────────────────────── */
const featureColors = {
  purple: {
    border: 'border-purple-500/30 hover:border-purple-400/60',
    shadow: 'shadow-[0_0_15px_rgba(168,85,247,0.1)] hover:shadow-[0_0_25px_rgba(168,85,247,0.3)]',
    glow: 'from-purple-600/20 to-indigo-600/10 hover:from-purple-500/30 hover:to-indigo-500/20',
    iconText: 'text-purple-300',
    iconBg: 'bg-gradient-to-br from-purple-500/30 to-indigo-500/30 border-purple-500/50'
  },
  emerald: {
    border: 'border-emerald-500/30 hover:border-emerald-400/60',
    shadow: 'shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:shadow-[0_0_25px_rgba(16,185,129,0.3)]',
    glow: 'from-emerald-600/20 to-teal-600/10 hover:from-emerald-500/30 hover:to-teal-500/20',
    iconText: 'text-emerald-300',
    iconBg: 'bg-gradient-to-br from-emerald-500/30 to-teal-500/30 border-emerald-500/50'
  },
  amber: {
    border: 'border-amber-500/30 hover:border-amber-400/60',
    shadow: 'shadow-[0_0_15px_rgba(245,158,11,0.1)] hover:shadow-[0_0_25px_rgba(245,158,11,0.3)]',
    glow: 'from-amber-600/20 to-orange-600/10 hover:from-amber-500/30 hover:to-orange-500/20',
    iconText: 'text-amber-300',
    iconBg: 'bg-gradient-to-br from-amber-500/30 to-orange-500/30 border-amber-500/50'
  },
  rose: {
    border: 'border-rose-500/30 hover:border-rose-400/60',
    shadow: 'shadow-[0_0_15px_rgba(244,63,94,0.1)] hover:shadow-[0_0_25px_rgba(244,63,94,0.3)]',
    glow: 'from-rose-600/20 to-pink-600/10 hover:from-rose-500/30 hover:to-pink-500/20',
    iconText: 'text-rose-300',
    iconBg: 'bg-gradient-to-br from-rose-500/30 to-pink-500/30 border-rose-500/50'
  },
  cyan: {
    border: 'border-cyan-500/30 hover:border-cyan-400/60',
    shadow: 'shadow-[0_0_15px_rgba(6,182,212,0.1)] hover:shadow-[0_0_25px_rgba(6,182,212,0.3)]',
    glow: 'from-cyan-600/20 to-blue-600/10 hover:from-cyan-500/30 hover:to-blue-500/20',
    iconText: 'text-cyan-300',
    iconBg: 'bg-gradient-to-br from-cyan-500/30 to-sky-500/30 border-cyan-500/50'
  },
  indigo: {
    border: 'border-indigo-500/30 hover:border-indigo-400/60',
    shadow: 'shadow-[0_0_15px_rgba(99,102,241,0.1)] hover:shadow-[0_0_25px_rgba(99,102,241,0.3)]',
    glow: 'from-indigo-600/20 to-blue-600/10 hover:from-indigo-500/30 hover:to-blue-500/20',
    iconText: 'text-indigo-300',
    iconBg: 'bg-gradient-to-br from-indigo-500/30 to-violet-500/30 border-indigo-500/50'
  }
};

/* ─────────────────────────────────────────────
   Feature Card — Large Grid Style
───────────────────────────────────────────── */
const FeatureCard = ({ title, description, icon: Icon, onClick, colorName = "purple" }) => {
  const color = featureColors[colorName] || featureColors.purple;
  return (
    <button
      onClick={onClick}
      className={`
        group relative flex flex-col items-center justify-center w-full
        p-5 md:p-6 rounded-3xl text-center
        bg-[#0c0c14]/80 backdrop-blur-xl border ${color.border}
        transition-all duration-400 hover:-translate-y-1.5 ${color.shadow}
        min-h-[150px] overflow-hidden
      `}
    >
      {/* Vibrant Background Glow */}
      <div className={`absolute inset-0 opacity-100 transition-opacity duration-500 bg-gradient-to-br ${color.glow} pointer-events-none`} />

      <div className={`relative z-10 flex-shrink-0 w-12 h-12 mb-4 rounded-2xl border flex items-center justify-center ${color.iconText} ${color.iconBg} transition-all duration-300 group-hover:scale-110 shadow-inner`}>
        <Icon size={22} strokeWidth={2} />
      </div>

      <div className="relative z-10 flex flex-col items-center mt-auto w-full">
        <h3 className="text-[15px] font-bold text-white tracking-tight">{title}</h3>
        <p className="text-[12px] text-white/50 mt-1.5 leading-relaxed font-medium px-2">{description}</p>
      </div>
    </button>
  );
};

/* ─────────────────────────────────────────────
   Dashboard
───────────────────────────────────────────── */
const Dashboard = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  
useEffect(() => {
  const params = new URLSearchParams(location.search);
  const token = params.get("token");

  if (token) {
    localStorage.setItem("token", token);

    // remove token from URL (clean URL)
    window.history.replaceState({}, document.title, "/dashboard");
  }
}, []);
  const features = [
    { title: "Resume Analyzer", description: "Instant ATS feedback & structure review", icon: FileSearch, path: "/resume-analyzer", colorName: "indigo" },
    { title: "Job Recommendations", description: "High-match roles at top companies", icon: Briefcase, path: "/jobs", colorName: "emerald" },
    { title: "Career Roadmap", description: "Month-by-month journey to success", icon: Map, path: "/learning-roadmap", colorName: "amber" },
    { title: "Mock Interview", description: "High-pressure AI-driven simulations", icon: PlayCircle, path: "/ai-assistant", colorName: "rose" },
    { title: "Skill Gap Analysis", description: "Find missing skills for your target role", icon: Binary, path: "/skill-gap", colorName: "cyan" },
    { title: "Skill Progress", description: "Track growth and readiness index", icon: TrendingUp, path: "/progress", colorName: "purple" },
  ];

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      {/* Vibrant Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-purple-600/15 blur-[140px] animate-pulse duration-[8s]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px] animate-pulse duration-[10s]" />
        <div className="absolute top-[30%] left-[60%] w-[45%] h-[45%] rounded-full bg-emerald-600/5 blur-[100px] animate-pulse duration-[12s]" />
      </div>

      <style>{`
        @keyframes slow-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes reverse-spin { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        @keyframes float-fast { 
           0%, 100% { transform: translateY(0px) translateX(0px); } 
           33% { transform: translateY(-10px) translateX(5px); }
           66% { transform: translateY(5px) translateX(-5px); }
        }
        .animate-slow-spin { animation: slow-spin 12s linear infinite; }
        .animate-reverse-spin { animation: reverse-spin 8s linear infinite; }
        .animate-neural-core { animation: pulse 4s ease-in-out infinite; }
        
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee { animation: marquee 30s linear infinite; }
      `}</style>

      <div className="relative z-10 w-full h-full flex flex-col gap-10 px-10">

        {/* Greeting */}
        <div className="w-full flex flex-col items-center text-center mt-4">
          
          {/* Advanced Neural Core Animation */}
          <div className="relative w-36 h-36 mb-6 flex items-center justify-center scale-90 md:scale-100">
            {/* Outer Orbiting Ring */}
            <div className="absolute inset-0 rounded-full border border-purple-500/10 border-t-purple-500/40 animate-slow-spin shadow-[inset_0_0_20px_rgba(168,85,247,0.1)]" />
            {/* Mid Orbiting Ring */}
            <div className="absolute inset-4 rounded-full border border-white/5 border-b-white/20 animate-reverse-spin" />
            {/* Core Energy Field */}
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-purple-500/20 to-indigo-500/20 backdrop-blur-3xl flex items-center justify-center p-1 border border-white/10 shadow-[0_0_40px_rgba(168,85,247,0.3)] animate-neural-core">
               <div className="w-full h-full rounded-full bg-white/40 blur-[1.5px] opacity-80" />
               {/* Tiny Rapid Particles */}
               {[...Array(4)].map((_, i) => (
                 <div 
                   key={i} 
                   className="absolute w-1 h-1 bg-white rounded-full blur-[0.5px]"
                   style={{
                     animation: `float-fast ${2 + i}s infinite`,
                     left: `${20 + i * 15}%`,
                     top: `${20 + i * 15}%`
                   }}
                 />
               ))}
            </div>
          </div>

          <h1 className="text-[32px] lg:text-[40px] font-bold text-white tracking-tight leading-[1.2]">
            Good Evening, DeepAI.
            <br />
            Can I help you with anything?
          </h1>
        </div>

        {/* ── Chat Input ── */}
        <div className="w-full flex justify-center mt-2">
          <div className="w-full max-w-3xl relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/30 via-cyan-500/30 to-blue-500/30 rounded-[28px] blur-xl opacity-30 z-0 transition-opacity duration-1000" />

            <div className="relative z-10 flex flex-col rounded-[24px] bg-[#0c0c14]/90 backdrop-blur-3xl border border-white/[0.15] shadow-[0_8px_40px_rgba(0,0,0,0.6)] focus-within:border-purple-500/50 focus-within:shadow-[0_8px_50px_rgba(167,134,255,0.2)] transition-all duration-300 overflow-hidden">
              
              {/* File Preview block (if file selected) */}
              {selectedFile && (
                <div className="flex items-center gap-3 w-full bg-white/[0.05] border-b border-white/[0.08] px-4 py-3 transition-all animate-in fade-in slide-in-from-top-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <FileText size={16} strokeWidth={2} />
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="text-[13px] text-white/90 font-medium truncate">{selectedFile.name}</span>
                    <span className="text-[10px] text-white/40 uppercase tracking-wider">{(selectedFile.size / 1024).toFixed(1)} KB</span>
                  </div>
                  <button 
                    onClick={removeFile}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white/30 hover:text-white/90 hover:bg-white/10 transition-all opacity-80 hover:opacity-100"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              <div className="flex items-center gap-3 px-2 py-2">
                
                {/* Left Side: Actions */}
                <div className="flex items-center gap-1 pl-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all bg-white/5 group"
                    title="Attach Resume"
                  >
                    <Plus size={18} strokeWidth={2.5} className="group-hover:rotate-90 transition-transform duration-300" />
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                </div>

                <input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask anything, format resume, try a module..."
                  className="flex-1 bg-transparent text-white/90 text-[15px] placeholder:text-white/30 outline-none h-12 px-2"
                />

                {/* Right Side: Send/Voice */}
                <div className="flex items-center gap-2 pr-2">
                  <button className="w-10 h-10 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all">
                    <Mic size={18} strokeWidth={2} />
                  </button>
                  <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 text-white hover:opacity-90 transition-all shadow-lg active:scale-95">
                    <ArrowRight size={18} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Modules Grid ── */}
        <div className="flex flex-col items-center gap-5 w-full mt-2">
          <div className="flex items-center justify-center gap-4 w-full opacity-60">
            <div className="h-px bg-gradient-to-r from-transparent to-white/20 flex-1" />
            <p className="text-[10px] font-bold tracking-[0.45em] uppercase text-white/40 whitespace-nowrap">
              Core Modules
            </p>
            <div className="h-px bg-gradient-to-l from-transparent to-white/20 flex-1" />
          </div>

          <div className="grid grid-cols-3 gap-6 w-full pb-10">
            {features.map((f, i) => (
              <FeatureCard key={i} {...f} onClick={() => navigate(f.path)} />
            ))}
          </div>

          {/* AI Vision Ticker (Improvement) */}
          <div className="w-full max-w-4xl bg-white/[0.03] border border-white/5 rounded-2xl py-3 px-6 overflow-hidden relative group">
            <div className="flex items-center gap-4 animate-marquee whitespace-nowrap">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex gap-12 items-center">
                  <span className="flex items-center gap-2 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
                    <Sparkles size={12} className="text-purple-400/50" />
                    AI Intelligence: Global hiring in <span className="text-white/40 italic">Artificial Intelligence</span> up 24% this quarter
                  </span>
                  <span className="flex items-center gap-2 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
                    <TrendingUp size={12} className="text-emerald-400/50" />
                    Skill Trend: <span className="text-white/40">React Hostile Architecture</span> is currently trending in Tier-1 firms
                  </span>
                  <span className="flex items-center gap-2 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
                    <Zap size={12} className="text-amber-400/50" />
                    System Status: <span className="text-white/40">Neural Synthesis Engine</span> online and optimized
                  </span>
                </div>
              ))}
            </div>
            {/* Fade Edges */}
            <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#0a0a0f] to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#0a0a0f] to-transparent pointer-events-none" />
          </div>
        </div>

      </div>

      <FeatureModal
        isOpen={!!selectedFeature}
        onClose={() => setSelectedFeature(null)}
        feature={selectedFeature}
      />
    </>
  );
};

export default Dashboard;