import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { 
  Landmark, 
  Search, 
  ExternalLink, 
  Users, 
  GraduationCap, 
  Briefcase, 
  TrendingUp, 
  ArrowRight,
  Info,
  ChevronRight,
  Lightbulb,
  ArrowUpRight
} from 'lucide-react';
import { cn } from '../services/utils';

const SchemeCard = ({ name, description, eligibility, icon: Icon }) => (
  <div className="bg-white/2 border border-white/[0.05] rounded-[2.5rem] p-8 hover:bg-white/5 transition-all group flex flex-col h-full">
    <div className="flex items-center gap-5 mb-8">
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-white transition-all">
        <Icon size={22} />
      </div>
      <h3 className="text-base font-bold text-white group-hover:text-white/80 transition-colors uppercase tracking-tight leading-tight">{name}</h3>
    </div>
    
    <p className="text-muted text-[11px] font-medium mb-8 flex-1 leading-relaxed">
      {description}
    </p>

    <div className="bg-white/2 border border-white/[0.03] rounded-2xl p-6 mb-8">
      <div className="flex items-center gap-3 mb-3">
        <Users size={12} className="text-white/20" />
        <span className="text-[9px] font-black text-muted uppercase tracking-[0.2em]">Contextual Eligibility</span>
      </div>
      <p className="text-white/60 text-[10px] font-bold tracking-tight leading-relaxed">{eligibility}</p>
    </div>

    <button className="w-full py-4 bg-white/5 hover:bg-white text-white hover:text-black rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95 shadow-2xl">
      Sync with Registry
      <ArrowUpRight size={14} />
    </button>
  </div>
);

const GovernmentSchemes = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const schemes = [
    { name: "Skill India Mission", description: "Global technical market synchronization program for national workforce.", eligibility: "Citizens aged 15-45 targeting technical upward mobility.", icon: TrendingUp },
    { name: "PMKVY Initiatives", description: "Industry-aligned skill synchronization for unemployed youth sectors.", eligibility: "School/College graduates with valid biometric identification.", icon: GraduationCap },
    { name: "Startup Protocol", description: "Enterprise nurturing ecosystem for innovation and venture-level growth.", eligibility: "Entities with innovation-first models registered < 10 years.", icon: Lightbulb },
    { name: "Digital Infrastructure", description: "Empowering knowledge economies through digitized infrastructure training.", eligibility: "All citizens targeting digital literacy and e-governance.", icon: Landmark },
    { name: "Stand Up Logic", description: "Facilitates venture capital access for underrepresented demographic sectors.", eligibility: "SC/ST or Women entrepreneurs prioritizing new ventures.", icon: Briefcase }
  ];

  return (
    <DashboardLayout>
       <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full px-6 py-10">
        
        {/* Header Unit */}
        <div className="mb-16">
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-3">
             Institutional <span className="text-white/60">Schemes</span>
          </h1>
          <p className="text-sm text-muted font-medium">National empowered career initiatives synchronized with professional growth.</p>
        </div>

        {/* Global Registry Search */}
        <div className="bg-white/2 border border-white/5 rounded-[2.5rem] p-8 mb-20">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-muted group-focus-within:text-white transition-colors" />
            <input 
              type="text" 
              placeholder="Query National Database..." 
              className="w-full bg-white/2 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-xs text-white placeholder:text-muted/40 font-bold tracking-tight outline-none focus:border-white/20 transition-all uppercase"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Grid Layer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {schemes.map((scheme, i) => (
            <SchemeCard key={i} {...scheme} />
          ))}
        </div>

        {/* Support Unit */}
        <div className="mt-24 border-t border-white/[0.05] pt-24 pb-20">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-black text-white mb-6 uppercase tracking-tight">Assisted Protocol Entry</h2>
              <p className="text-muted text-sm leading-relaxed mb-10 max-w-md">Our AI Intelligence simplifies documentation logistics and direct portal synchronization for institutional programs.</p>
              <div className="space-y-5">
                {['Registry sync and verification', 'Document artifact generation', 'Direct access to official gateways'].map((text, i) => (
                  <div key={i} className="flex items-center gap-4 text-white/40">
                    <div className="h-1 w-1 rounded-full bg-white shadow-[0_0_5px_rgba(255,255,255,0.5)]" />
                    <span className="text-[10px] uppercase font-bold tracking-widest">{text}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:w-1/2 bg-white/2 border border-white/5 rounded-[3rem] p-10 relative overflow-hidden group">
              <Info className="absolute -right-8 -top-8 text-white/5 h-32 w-32 group-hover:scale-110 transition-transform" />
              <h3 className="text-xs font-black text-white mb-6 uppercase tracking-[0.2em]">Official Veracity</h3>
              <p className="text-muted text-[11px] leading-relaxed mb-10 font-medium">
                Always ensure synchronization with official gateways (.gov.in). 
                Axora AI facilitates informational discovery and reduces procedural latency.
              </p>
              <button className="flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-widest hover:translate-x-1 transition-transform group/btn">
                Visit Gateway <ArrowUpRight size={14} className="opacity-40" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GovernmentSchemes;
