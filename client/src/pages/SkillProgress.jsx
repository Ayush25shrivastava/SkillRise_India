import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { 
  TrendingUp, 
  BarChart3, 
  CheckCircle2, 
  Award, 
  Clock, 
  ChevronRight, 
  Target, 
  Zap, 
  BrainCircuit,
  ArrowUpRight,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { cn } from '../services/utils';

const ProgressBar = ({ label, percentage }) => (
  <div className="space-y-3">
    <div className="flex justify-between items-end px-1">
      <span className="text-[10px] font-black text-muted uppercase tracking-widest">{label}</span>
      <span className="text-[10px] font-black text-white">{percentage}%</span>
    </div>
    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
      <div 
        className="h-full bg-white rounded-full transition-all duration-1000 ease-out" 
        style={{ width: `${percentage}%` }} 
      />
    </div>
  </div>
);

const CompletedCourse = ({ title, date, score }) => (
  <div className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.01] border border-white/[0.05] hover:bg-white/5 transition-all group">
    <div className="flex items-center gap-5">
      <div className="h-10 w-10 rounded-xl bg-white/5 text-white/40 flex items-center justify-center group-hover:text-white transition-colors">
        <Award size={18} />
      </div>
      <div>
        <h4 className="text-xs font-bold text-white tracking-tight leading-tight uppercase">{title}</h4>
        <p className="text-muted text-[9px] font-black flex items-center gap-1.5 mt-1 uppercase tracking-widest">
          <Clock size={10} className="opacity-20" /> Protocol Sync: {date}
        </p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-white font-black text-sm">{score}%</p>
      <p className="text-[8px] text-muted font-black uppercase tracking-[0.2em]">Synchronization</p>
    </div>
  </div>
);

const SkillProgress = () => {
  const skills = [
    { label: "Python Logic", percentage: 80 },
    { label: "Neural Mapping", percentage: 65 },
    { label: "System Latency", percentage: 90 },
    { label: "Architecture", percentage: 45 },
    { label: "UI Protocols", percentage: 85 }
  ];

  return (
    <DashboardLayout>
       <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full px-6 py-10">
        
        {/* Header Unit */}
        <div className="mb-16">
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-3">
             Maturity <span className="text-white/60">Analytics</span>
          </h1>
          <p className="text-sm text-muted font-medium">Quantitative synchronization vectors across technical deployment domains.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* 1. Skill Registry */}
          <section className="lg:col-span-4 bg-white/2 border border-white/5 rounded-[2.5rem] p-10 flex flex-col">
            <div className="flex items-center justify-between mb-12">
              <h3 className="text-[10px] font-black text-white flex items-center gap-3 uppercase tracking-[0.2em]">
                <Zap size={14} className="text-white/40" /> Node Progress
              </h3>
            </div>
            
            <div className="space-y-10 flex-1">
              {skills.map((skill, i) => (
                <ProgressBar key={i} {...skill} />
              ))}
            </div>

            <div className="mt-16 p-6 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
              <p className="text-[9px] text-muted leading-relaxed text-center font-bold uppercase tracking-widest">
                Priority refocus identified: <span className="text-white">Distributed Architectures.</span>
              </p>
            </div>
          </section>

          <div className="lg:col-span-8 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 2. Growth Visualization */}
              <section className="bg-white/2 border border-white/5 rounded-[3rem] p-10 relative overflow-hidden group">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-[10px] font-black text-white flex items-center gap-3 uppercase tracking-[0.2em]">
                    <TrendingUp size={14} className="text-white/40" /> Intensity Curve
                  </h3>
                </div>
                
                <div className="h-40 w-full flex items-end gap-3 px-2">
                  {[40, 65, 45, 80, 55, 90, 75].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-4 group/bar">
                      <div 
                        className="w-full bg-white/5 border-t border-white/10 rounded-t-lg transition-all duration-700 hover:bg-white/20 cursor-pointer" 
                        style={{ height: `${h}%` }}
                      />
                      <span className="text-[8px] font-black text-muted uppercase tracking-widest">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-muted font-bold mt-10 text-center uppercase tracking-widest">Vector throughput increased by 12%</p>
              </section>

              {/* 4. Deployment Readiness Score */}
              <section className="bg-white text-black rounded-[2.5rem] p-10 relative overflow-hidden group shadow-2xl">
                <Sparkles size={180} className="absolute -right-16 -bottom-16 opacity-5 text-black rotate-12 group-hover:scale-110 transition-transform" />
                <div className="relative z-10 h-full flex flex-col">
                  <p className="text-black/40 font-black text-[10px] uppercase tracking-[0.2em] mb-4">Readiness Protocol</p>
                  <div className="flex items-baseline gap-2 mb-6">
                    <h3 className="text-7xl font-black leading-none tracking-tighter">78</h3>
                    <span className="text-xl font-bold opacity-30">/ 100</span>
                  </div>
                  
                  <div className="mt-auto">
                    <div className="flex items-center gap-2 text-black font-bold text-[10px] uppercase tracking-widest mb-10 decoration-black underline underline-offset-4">
                      <ArrowUpRight size={14} className="opacity-30" />
                      <span>Sync improved by 8%</span>
                    </div>
                    <button className="w-full py-4 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl">
                      Initialize Trial
                    </button>
                  </div>
                </div>
              </section>
            </div>

            {/* 3. Verified Certificates */}
            <section className="bg-white/2 border border-white/5 rounded-[3rem] p-10">
              <div className="flex items-center justify-between mb-10 px-2">
                 <h3 className="text-[10px] font-black text-white flex items-center gap-3 uppercase tracking-[0.2em]">
                   <CheckCircle2 size={16} className="text-white/40" /> Verified Protocols
                 </h3>
                 <button className="text-muted text-[10px] font-black uppercase tracking-[0.2em] hover:text-white transition-colors flex items-center gap-2 group">
                   Registry <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                 </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CompletedCourse title="Expert Logic Mastery" date="10.03.26" score="96" />
                <CompletedCourse title="System Orchestration" date="02.03.26" score="88" />
                <CompletedCourse title="Core Architecture" date="24.02.26" score="92" />
                <CompletedCourse title="distributed Logic" date="15.02.26" score="85" />
              </div>
            </section>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SkillProgress;
