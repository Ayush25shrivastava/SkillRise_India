import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { 
  User, 
  Edit3, 
  Target, 
  TrendingUp, 
  Award, 
  Clock, 
  ChevronRight, 
  Sparkles,
  Zap,
  BookOpen,
  Settings,
  ArrowRight
} from 'lucide-react';
import { cn } from '../services/utils';

const ProgressBar = ({ label, percentage }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-end px-1">
      <span className="text-[10px] font-black text-muted uppercase tracking-widest">{label}</span>
      <span className="text-[10px] font-black text-white">{percentage}%</span>
    </div>
    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
      <div 
        className="h-full bg-white rounded-full transition-all duration-1000 ease-out" 
        style={{ width: `${percentage}%` }} 
      />
    </div>
  </div>
);

const CompletedCourseCard = ({ title, provider, date, score }) => (
  <div className="bg-white/2 border border-white/[0.05] p-6 rounded-[2rem] hover:bg-white/5 transition-all group flex items-center justify-between">
    <div className="flex items-center gap-5">
      <div className="h-10 w-10 rounded-xl bg-white/5 text-white/40 flex items-center justify-center group-hover:text-white transition-colors">
        <Award size={18} />
      </div>
      <div>
        <h4 className="text-xs font-bold text-white tracking-tight uppercase group-hover:text-white transition-colors">{title}</h4>
        <p className="text-muted text-[9px] font-black mt-1 uppercase tracking-widest">{provider} • {date}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-white font-black text-sm">{score}%</p>
      <p className="text-[8px] text-muted font-black uppercase tracking-[0.2em] leading-none">Sycned</p>
    </div>
  </div>
);

const Profile = () => {
  const skills = [
    { label: "Python Expert", percentage: 80 },
    { label: "ML Systems", percentage: 60 },
    { label: "Architecture", percentage: 40 }
  ];

  const completedCourses = [
    { title: "Advanced Logic Protocol", provider: "Axora Academy", date: "10.03.26", score: "96" },
    { title: "Deep Systems Sync", provider: "Coursera", date: "24.02.26", score: "88" },
    { title: "Infrastructure v4", provider: "Udemy Platinum", date: "15.02.26", score: "92" }
  ];

  return (
    <DashboardLayout>
       <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full px-6 py-10">
        
        {/* Header Unit */}
        <div className="mb-16">
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-3">
             Identity <span className="text-white/60">Registry</span>
          </h1>
          <p className="text-sm text-muted font-medium">Management of your synchronized professional artifacts and growth vectors.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Core Identity */}
          <div className="lg:col-span-4 space-y-10">
            {/* Profile Unit */}
            <section className="bg-white/2 border border-white/5 rounded-[3rem] p-10 text-center relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-full h-24 bg-white/5" />
               
               <div className="relative z-10 pt-4">
                  <div className="h-28 w-28 rounded-[2rem] bg-white text-black mx-auto flex items-center justify-center text-3xl font-black shadow-2xl ring-8 ring-[#0a0a0a] mb-6 group-hover:scale-105 transition-transform">
                    JD
                  </div>
                  <h2 className="text-2xl font-bold text-white tracking-tight uppercase">John Doe</h2>
                  <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Aspiring AI Architect</p>
                  
                  <div className="mt-12 grid grid-cols-2 gap-4 px-2">
                    <button className="px-5 py-3 bg-white text-black rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
                      <Edit3 size={12} /> Sync Info
                    </button>
                    <button className="px-5 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                       Protocol
                    </button>
                  </div>
               </div>
            </section>

            {/* Target Trajectory */}
            <section className="bg-white text-black rounded-[2.5rem] p-10 relative overflow-hidden group shadow-2xl">
              <Sparkles className="absolute -right-8 -bottom-8 opacity-5 text-black rotate-12 group-hover:scale-110 transition-transform" size={160} />
              <div className="relative z-10">
                <p className="text-black/40 font-black text-[9px] uppercase tracking-[0.2em] mb-4">Primary Target</p>
                <h3 className="text-xl font-black leading-tight uppercase tracking-widest mb-6">ML Systems Architect</h3>
                <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-black/60">
                  <div className="w-1.5 h-1.5 rounded-full bg-black shadow-[0_0_5px_black]" />
                  Protocol Locked
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Maturity Analytics */}
          <div className="lg:col-span-8 space-y-12">
            {/* Maturity Index */}
            <section className="bg-white/2 border border-white/5 rounded-[3rem] p-12">
              <div className="flex items-center justify-between mb-16 px-2">
                <h3 className="text-xs font-bold text-white flex items-center gap-3 uppercase tracking-[0.2em]">
                  <TrendingUp size={16} className="text-white/40" /> Maturity Progress
                </h3>
                <div className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full">
                  <span className="text-[9px] font-black text-white uppercase tracking-widest">Real-Time Sync</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 mb-12">
                {skills.map((skill, i) => (
                  <div key={i} className="group">
                    <ProgressBar {...skill} />
                  </div>
                ))}
                <div className="flex flex-col justify-center items-center bg-white/[0.01] border border-dashed border-white/10 rounded-[2rem] p-8 cursor-pointer hover:bg-white/5 transition-all">
                  <div className="flex items-center gap-3 text-white/20 text-[9px] font-black uppercase tracking-[0.2em]">
                    <Zap size={12} /> Sync New Protocol
                  </div>
                </div>
              </div>
            </section>

            {/* Verified History */}
            <section className="pb-20">
              <div className="flex items-center justify-between mb-10 px-4">
                <h3 className="text-xs font-bold text-white flex items-center gap-3 uppercase tracking-[0.2em]">
                  <BookOpen size={16} className="text-white/40" /> Verified Protocols
                </h3>
                <button className="text-muted text-[10px] font-black uppercase tracking-[0.2em] hover:text-white transition-colors flex items-center gap-2 group">
                  Registry Search <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {completedCourses.map((course, i) => (
                  <CompletedCourseCard key={i} {...course} />
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
