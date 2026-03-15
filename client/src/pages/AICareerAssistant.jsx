import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Zap, 
  ArrowRight,
  Target,
  Clock,
  BarChart3,
  Award,
  PlayCircle,
  Briefcase,
  ChevronRight,
  Video,
  Settings2,
  Cpu,
  ShieldCheck,
  Terminal,
  Activity,
  Mic2,
  Plus,
  Layers,
  ShieldAlert,
  Dna,
  Database,
  Code2,
  Smartphone,
  Binary
} from 'lucide-react';
import { cn } from '../services/utils';

/* ─────────────────────────────────────────────
   Official Assessment Module (8-Block Grid)
───────────────────────────────────────────── */
const RoleCard = ({ role, level, icon: Icon, colorTheme, description, borderTheme, stats, delay, onClick }) => (
  <div 
    onClick={onClick}
    className={cn(
    "group relative h-full min-h-[300px] flex flex-col bg-[#0c0c14]/40 backdrop-blur-3xl border rounded-[2.5rem] p-8 transition-all duration-700 cursor-pointer overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-8",
    borderTheme,
    delay
  )}>
    {/* Dynamic Background Glow */}
    <div className={cn("absolute inset-0 opacity-0 blur-[100px] -z-10 group-hover:opacity-15 transition-opacity duration-1000", colorTheme)} />
    
    <div className="relative z-10 flex flex-col h-full">
      {/* Header Area */}
      <div className="flex justify-between items-start mb-6">
        <div className={cn(
          "w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/20 group-hover:text-white transition-all duration-500 shadow-inner group-hover:scale-110 group-hover:bg-white/10",
          colorTheme ? "group-hover:border-white/20" : ""
        )}>
          <Icon size={24} strokeWidth={1.5} />
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={cn(
             "text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-xl border backdrop-blur-md",
             level === 'Expert' ? "text-rose-400 border-rose-500/20 bg-rose-500/5" : 
             level === 'Advanced' ? "text-amber-400 border-amber-500/20 bg-amber-500/5" : 
             "text-emerald-400 border-emerald-500/20 bg-emerald-500/5"
          )}>
            {level}
          </span>
        </div>
      </div>

      {/* Title & Static Info */}
      <div className="flex-1">
        <h3 className="text-[20px] font-black text-white tracking-tight leading-none group-hover:translate-x-1 transition-transform duration-500">{role}</h3>
        
        {/* Animated Description: Revealed on Hover/Click */}
        <div className="relative mt-4 h-20 overflow-hidden">
          <p className="text-[13px] text-white/40 leading-relaxed font-medium transition-all duration-500 absolute top-2 opacity-0 group-hover:opacity-100 group-hover:top-0">
            {description}
          </p>
          <div className="text-[9px] font-black text-white/5 uppercase tracking-[0.4em] transition-all duration-500 absolute top-0 group-hover:opacity-0 group-hover:-top-2">
            Protocol Locked
          </div>
        </div>
      </div>

      {/* Interactive Footer */}
      <div className="mt-6">
        <button className="w-full py-3.5 rounded-2xl bg-white/[0.03] border border-white/5 text-white/20 text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 flex items-center justify-center gap-3 overflow-hidden group/btn relative hover:border-white/10">
           <span className="relative z-10 group-hover/btn:text-white transition-all">Launch Assessment</span>
           <div className={cn("absolute inset-y-0 left-0 w-0 group-hover/btn:w-full transition-all duration-700 -z-0", colorTheme.replace('bg-', 'bg-gradient-to-r '))} />
        </button>
      </div>
    </div>
  </div>
);

const AICareerAssistant = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('simulate');

  const modules = [
    { 
      role: "Frontend Architect", 
      level: "Expert", 
      icon: Layers, 
      colorTheme: "bg-purple-600",
      borderTheme: "border-purple-500/10 hover:border-purple-500/40 hover:shadow-purple-500/10",
      description: "Analyze React architecture, scaling patterns, and high-performance design system implementations.",
      delay: "duration-300"
    },
    { 
      role: "Backend Infrastructure", 
      level: "Expert", 
      icon: Database, 
      colorTheme: "bg-indigo-600",
      borderTheme: "border-indigo-500/10 hover:border-indigo-500/40 hover:shadow-indigo-500/10",
      description: "Assess distributed systems logic, API orchestration, and database performance metrics.",
      delay: "duration-500"
    },
    { 
      role: "Fullstack Systems", 
      level: "Expert", 
      icon: Code2, 
      colorTheme: "bg-blue-600",
      borderTheme: "border-blue-500/10 hover:border-blue-500/40 hover:shadow-blue-500/10",
      description: "End-to-end simulation covering the entire technical stack from UI to deployment logic.",
      delay: "duration-700"
    },
    { 
      role: "Data Analytics Lead", 
      level: "Advanced", 
      icon: Binary, 
      colorTheme: "bg-cyan-600",
      borderTheme: "border-cyan-500/10 hover:border-cyan-500/40 hover:shadow-cyan-500/10",
      description: "Evaluate neural network protocols, statistical models, and predictive data synthesis.",
      delay: "duration-1000"
    },
    { 
      role: "AI Security Defense", 
      level: "Expert", 
      icon: ShieldAlert, 
      colorTheme: "bg-rose-600",
      borderTheme: "border-rose-500/10 hover:border-rose-500/40 hover:shadow-rose-500/10",
      description: "Stress-test infrastructure defenses against simulated security probes and penetration tests.",
      delay: "duration-500"
    },
    { 
      role: "DevOps Operations", 
      level: "Advanced", 
      icon: Settings2, 
      colorTheme: "bg-emerald-600",
      borderTheme: "border-emerald-500/10 hover:border-emerald-500/40 hover:shadow-emerald-500/10",
      description: "Evaluate mastery over CI/CD pipelines, container orchestration, and cloud architecture.",
      delay: "duration-700"
    },
    { 
      role: "Product Strategy", 
      level: "Advanced", 
      icon: Target, 
      colorTheme: "bg-amber-600",
      borderTheme: "border-amber-500/10 hover:border-amber-500/40 hover:shadow-amber-500/10",
      description: "Official evaluation of UX logic, strategic thinking, and stakeholder management protocols.",
      delay: "duration-1000"
    },
    { 
      role: "Mobile App Logic", 
      level: "Advanced", 
      icon: Smartphone, 
      colorTheme: "bg-sky-600",
      borderTheme: "border-sky-500/10 hover:border-sky-500/40 hover:shadow-sky-500/10",
      description: "Assess cross-platform mobile architecture, native scaling, and mobile-first logic.",
      delay: "duration-1200"
    }
  ];

  return (
    <div className="w-full min-h-screen flex flex-col items-center py-10 px-8 md:px-12 lg:px-16 relative animate-in fade-in duration-1000 overflow-x-hidden">
      
      {/* Immersive Background Gradients */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header - Industrial Official Design */}
      <div className="w-full max-w-[1400px] flex flex-col md:flex-row items-end justify-between gap-10 mb-20 px-4">
        <div className="flex flex-col gap-6 max-w-3xl">
          <div className="flex items-center gap-4 animate-in slide-in-from-left-8 duration-700">
             <div className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.8)]" />
             <span className="text-[11px] font-black text-white/40 uppercase tracking-[0.5em]">Neural Assessment Network Active</span>
          </div>
          <h1 className="text-[48px] md:text-[64px] font-black text-white tracking-tighter leading-none">
            Mock <span className="text-white/20 italic font-light">Laboratory</span>
          </h1>
          <p className="text-[16px] md:text-[18px] text-white/40 leading-relaxed font-medium">
            Industrial-grade career simulations engineered to quantify technical articulation and high-pressure cognitive response.
          </p>
        </div>

        <div className="hidden lg:flex items-center gap-6 animate-in slide-in-from-right-8 duration-700">
           <div className="flex flex-col items-end">
             <span className="text-[10px] font-black text-white/10 uppercase tracking-[0.4em]">Environmental Status</span>
             <span className="text-[16px] font-bold text-emerald-400 uppercase tracking-tighter">Optimal Sync</span>
           </div>
           <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-emerald-500/40 shadow-inner">
             <Cpu size={24} />
           </div>
        </div>
      </div>

      {/* ── 8-BLOCK MODULE MATRIX ── */}
      <div className="w-full max-w-[1400px] flex-1 px-4">
        
        {/* Module Categories Navigation */}
        <div className="flex items-center justify-between border-b border-white/[0.05] mb-12 px-6">
          <div className="flex gap-12">
            {[
              { id: 'simulate', label: 'Select Module' },
              { id: 'logs', label: 'Assessment Logs' },
              { id: 'intel', label: 'Neural Intelligence' }
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "text-[11px] font-black uppercase tracking-[0.4em] transition-all relative pb-6 px-2",
                  activeTab === tab.id ? "text-white" : "text-white/20 hover:text-white/40"
                )}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-purple-500 to-indigo-600 shadow-[0_0_20px_rgba(168,85,247,0.5)] animate-in zoom-in-50 duration-500" />
                )}
              </button>
            ))}
          </div>
          
          <button className="hidden md:flex items-center gap-4 px-8 py-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-white/30 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/10 hover:text-white transition-all group">
            <Settings2 size={16} className="group-hover:rotate-90 transition-transform duration-700" />
            Environments
          </button>
        </div>

        {/* The Matrix Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-32">
          {modules.map((m, idx) => (
            <RoleCard 
              key={idx} 
              {...m} 
              onClick={() => navigate('/mock-interview', { state: { role: m.role } })}
            />
          ))}
          
          {/* Custom Matrix Initiation Entry */}
          <div className="group relative flex flex-col items-center justify-center p-10 rounded-[2.5rem] border-2 border-dashed border-white/[0.05] hover:border-purple-500/40 hover:bg-white/[0.01] cursor-pointer transition-all duration-700 min-h-[300px] animate-in fade-in slide-in-from-bottom-12">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-white/10 group-hover:scale-110 group-hover:bg-purple-500/10 group-hover:text-purple-400 transition-all duration-700 mb-6">
              <Plus size={28} />
            </div>
            <div className="text-center">
              <h3 className="text-[14px] text-white/30 font-black tracking-[0.2em] uppercase group-hover:text-white transition-colors duration-500">
                Engineer Custom<br />Interface
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICareerAssistant;
