import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { 
  Target, 
  BrainCircuit, 
  AlertCircle, 
  GraduationCap, 
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  Zap,
  BookOpen,
  Clock,
  Briefcase,
  ChevronDown,
  ArrowRight
} from 'lucide-react';
import { cn } from '../services/utils';

const PriorityBadge = ({ level }) => {
  const styles = {
    high: "text-white bg-white/10",
    medium: "text-white/70 bg-white/5",
    low: "text-white/40 bg-white/5"
  };
  
  return (
    <span className={cn(
      "px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border border-white/5",
      styles[level.toLowerCase()]
    )}>
      {level} Priority
    </span>
  );
};

const SkillBadge = ({ name, type = 'current' }) => (
  <div className={cn(
    "flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] font-bold border transition-all hover:scale-105",
    type === 'current' 
      ? "bg-white/2 border-white/5 text-white/50"
      : "bg-white/5 border-white/10 text-white"
  )}>
    <div className={cn("h-1.5 w-1.5 rounded-full shadow-sm", type === 'current' ? "bg-white/20" : "bg-white animate-pulse" )} />
    {name}
  </div>
);

const CourseCard = ({ title, provider, duration, level }) => (
  <div className="bg-white/2 border border-white/[0.05] p-6 rounded-[2rem] hover:bg-white/5 transition-all group flex flex-col gap-4">
    <div className="flex items-center justify-between">
      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 group-hover:text-white transition-colors">
        <BookOpen size={14} />
      </div>
      <span className="text-[9px] font-black text-muted uppercase tracking-[0.2em]">{level}</span>
    </div>
    <div>
      <h4 className="text-sm font-bold text-white mb-2 leading-tight tracking-tight">{title}</h4>
      <p className="text-[10px] text-muted font-medium uppercase tracking-tight">{provider}</p>
    </div>
    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white-[0.05]">
      <div className="flex items-center gap-2 text-muted text-[10px] font-bold">
        <Clock size={12} />
        {duration}
      </div>
      <button className="text-white text-[10px] font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform flex items-center gap-1">
        Access <ChevronRight size={12} />
      </button>
    </div>
  </div>
);

const SkillGapAnalysis = () => {
  const [selectedRole, setSelectedRole] = useState('Senior AI Engineer');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const currentSkills = ['React', 'Node.js', 'Python', 'TailwindCSS', 'MongoDB'];
  
  const gapData = [
    { skill: 'PyTorch Framework', priority: 'High', reason: 'Core requirement for AI modeling roles.' },
    { skill: 'Distributed Systems', priority: 'High', reason: 'Essential for high-scale architectural decisions.' },
    { skill: 'MLOps v2', priority: 'Medium', reason: 'Needed for deploying and managing production models.' },
  ];

  const recommendations = [
    { title: 'Advanced Neural Networks', provider: 'Axora Academy', duration: '24h', level: 'Intermediate' },
    { title: 'System Design: Scaling AI', provider: 'ByteByteGo', duration: '12h', level: 'Advanced' },
  ];

  return (
    <DashboardLayout>
      <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full px-6 py-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
          <div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight mb-3">
               Competency <span className="text-white/60">Benchmarking</span>
            </h1>
            <p className="text-sm text-muted font-medium">Quantum profile comparison against target professional protocols.</p>
          </div>

          <div className="relative group">
            <div className="absolute -top-3 left-4 bg-[#0a0a0a] px-2 text-[9px] font-black text-muted uppercase tracking-[0.2em] z-10 transition-colors group-hover:text-white">
               Focus Protocol
            </div>
            <div className="relative">
              <select 
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="bg-white/2 border border-white/10 rounded-2xl py-3.5 pl-6 pr-12 text-white font-bold text-xs focus:outline-none focus:border-white/20 appearance-none cursor-pointer transition-all hover:bg-white/5 min-w-[260px] uppercase tracking-widest"
              >
                <option>Senior AI Engineer</option>
                <option>Full Stack Developer</option>
                <option>Data Scientist</option>
                <option>System Architect</option>
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" size={14} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-12">
            {/* 1. Verified Skills */}
            <section className="bg-white/2 border border-white/5 rounded-[2.5rem] p-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-white/40">
                  <CheckCircle2 size={18} />
                </div>
                <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em]">Verified Assets</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {currentSkills.map(skill => (
                  <SkillBadge key={skill} name={skill} />
                ))}
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/30 border border-dashed border-white/10 hover:border-white/30 hover:text-white transition-all">
                  + Add Protocol
                </button>
              </div>
            </section>

            {/* 2. Gap Identification */}
            <section className="bg-white/2 border border-white/5 rounded-[2.5rem] p-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-white/40">
                  <AlertCircle size={18} />
                </div>
                <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em]">Optimization Vectors</h3>
              </div>

              <div className="space-y-4">
                {gapData.map((item, i) => (
                  <div key={i} className="group p-6 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-white/10 hover:bg-white/2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-start gap-5">
                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-white opacity-20 group-hover:opacity-100 transition-opacity" />
                      <div>
                        <h4 className="text-white font-bold text-sm mb-1 tracking-tight">{item.skill}</h4>
                        <p className="text-muted text-[11px] leading-relaxed max-w-sm">{item.reason}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 shrink-0">
                      <PriorityBadge level={item.priority} />
                      <button className="text-muted hover:text-white transition-colors">
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-4 space-y-12">
            {/* Match Insight */}
            <div className="bg-white text-black rounded-[2.5rem] p-10 relative overflow-hidden group shadow-2xl">
              <div className="relative z-10">
                <p className="text-black/40 font-black text-[10px] uppercase tracking-[0.2em] mb-4">Match Efficiency</p>
                <h3 className="text-7xl font-black mb-4 tracking-tighter">62 <span className="text-lg opacity-30">%</span></h3>
                <p className="text-black/60 text-xs leading-relaxed font-bold uppercase tracking-widest mb-10">
                  Protocol synchronization is <span className="text-black underline decoration-black/20 underline-offset-4">partial</span>.
                </p>
                <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden">
                  <div className="h-full bg-black w-[62%] rounded-full" />
                </div>
              </div>
              <Sparkles className="absolute -right-8 -top-8 text-black/5" size={160} />
            </div>

            {/* 3. Learning Protocols */}
            <section className="space-y-8">
              <div className="flex items-center gap-3">
                 <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                 <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em]">Learning Vectors</h3>
              </div>
              <div className="space-y-5">
                {recommendations.map((course, i) => (
                  <CourseCard key={i} {...course} />
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SkillGapAnalysis;
