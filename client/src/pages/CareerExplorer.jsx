import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { 
  Search, 
  Filter, 
  DollarSign, 
  BarChart3, 
  ChevronRight, 
  Sparkles,
  TrendingUp,
  Shield,
  Layout,
  BrainCircuit,
  Settings2,
  ArrowUpRight
} from 'lucide-react';
import { cn } from '../services/utils';

const CareerCard = ({ title, salary, skills, demand, icon: Icon }) => (
  <div className="bg-white/2 border border-white/[0.05] rounded-[2.5rem] p-8 hover:bg-white/5 transition-all group flex flex-col h-full relative overflow-hidden">
    <div className="flex justify-between items-start mb-8">
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-white group-hover:scale-110 transition-all duration-500">
        <Icon size={22} />
      </div>
      <div className={cn(
        "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all",
        demand === 'High' 
          ? "bg-white/10 border-white/10 text-white" 
          : "bg-white/2 border-white/5 text-muted"
      )}>
        {demand} Demand
      </div>
    </div>
    
    <h3 className="text-xl font-bold text-white mb-2 tracking-tight group-hover:text-white/80 transition-colors uppercase">{title}</h3>
    
    <div className="flex items-center gap-2 text-muted font-bold text-[10px] tracking-widest uppercase mb-8">
      <DollarSign size={12} className="text-white/20" />
      {salary} <span className="text-white/10 font-black">/ Year</span>
    </div>

    <div className="flex flex-wrap gap-2 mb-10">
      {skills.map((skill, i) => (
        <span key={i} className="px-3 py-1.5 rounded-xl bg-white/2 border border-white/[0.03] text-[9px] text-muted font-black uppercase tracking-widest hover:text-white hover:bg-white/5 transition-all">
          {skill}
        </span>
      ))}
    </div>

    <button className="mt-auto w-full py-3.5 bg-white/5 hover:bg-white text-white hover:text-black rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 group/btn">
      Sync Protocol
      <ArrowUpRight size={14} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
    </button>
  </div>
);

const FilterChip = ({ icon: Icon, label }) => (
  <button className="flex items-center gap-2 px-6 py-3 bg-white/2 border border-white/5 rounded-2xl hover:bg-white/5 transition-all">
    <Icon size={14} className="text-muted" />
    <span className="text-[10px] font-black text-muted uppercase tracking-widest">{label}</span>
  </button>
);

const CareerExplorer = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const careers = [
    { title: "Data Scientist", salary: "$125k - $185k", skills: ["Python", "ML", "Stats"], demand: "High", icon: BarChart3 },
    { title: "AI Engineer", salary: "$145k - $210k", skills: ["PyTorch", "NLP", "CV"], demand: "High", icon: BrainCircuit },
    { title: "Full Stack", salary: "$110k - $165k", skills: ["React", "Node.js", "Systems"], demand: "High", icon: Layout },
    { title: "Cybersecurity", salary: "$120k - $175k", skills: ["Networking", "Hacking", "Cloud"], demand: "Med", icon: Shield },
    { title: "Product Mgr", salary: "$130k - $190k", skills: ["Strategy", "UX", "Agile"], demand: "High", icon: TrendingUp },
    { title: "DevOps", salary: "$135k - $195k", skills: ["Docker", "K8s", "CI/CD"], demand: "High", icon: Settings2 }
  ];

  return (
    <DashboardLayout>
      <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full px-6 py-10">
        
        {/* Header Section */}
        <div className="mb-16">
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-3">
             Career <span className="text-white/60">Explorer</span>
          </h1>
          <p className="text-sm text-muted font-medium">Discover synchronized trajectory vectors across elite technical domains.</p>
        </div>

        {/* Search & Filter Matrix */}
        <div className="flex flex-col gap-10 mb-20 px-2">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-muted group-focus-within:text-white transition-colors" />
              <input 
                type="text" 
                placeholder="Search Career Protocols..." 
                className="w-full bg-white/2 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-xs text-white placeholder:text-muted/40 font-bold tracking-tight outline-none focus:border-white/20 transition-all uppercase"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-3">
               <FilterChip icon={Filter} label="Industry" />
               <FilterChip icon={DollarSign} label="Revenue" />
               <FilterChip icon={TrendingUp} label="Seniority" />
            </div>
          </div>
        </div>

        {/* Global Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {careers.map((career, i) => (
            <CareerCard key={i} {...career} />
          ))}
        </div>
        
        {/* Bottom Call to Action */}
        <div className="p-12 rounded-[3.5rem] bg-white text-black relative overflow-hidden group">
          <div className="relative z-10 text-center md:text-left">
            <h3 className="text-3xl font-black tracking-tighter uppercase mb-2">Initialize Personal Suggestion</h3>
            <p className="text-black/60 text-xs font-bold uppercase tracking-widest max-w-md mb-8 leading-relaxed">
              Our AI engine identifies secondary domains based on your latent skill artifacts.
            </p>
            <button className="px-8 py-3.5 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl">
              Execute Intelligence Scan
            </button>
          </div>
          <Sparkles size={240} className="absolute -right-20 -bottom-20 text-black/5 rotate-12 group-hover:scale-110 transition-transform" />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CareerExplorer;
