import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  Search,
  Filter,
  Sparkles,
  Clock,
  Briefcase,
  ArrowUpRight
} from 'lucide-react';
import { cn } from '../services/utils';

/* ─────────────────────────────────────────────
   Job Card Component
───────────────────────────────────────────── */
const JobCard = ({ title, company, location, type, skills, recommended }) => {
  return (
    <div className={cn(
      "group flex flex-col justify-between h-full p-6 md:p-7 rounded-[24px] transition-all duration-300",
      "bg-[#0c0c14]/50 backdrop-blur-md border hover:-translate-y-1 shadow-lg cursor-pointer",
      recommended 
        ? "border-purple-500/20 hover:border-purple-500/40 hover:bg-[#0c0c14]/80 shadow-[0_0_30px_rgba(168,85,247,0.05)] hover:shadow-[0_4px_40px_rgba(168,85,247,0.1)]" 
        : "border-white/[0.05] hover:bg-white/[0.03] hover:border-white/[0.12] hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)]"
    )}>
      
      <div className="flex flex-col">
        {/* Top Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3.5">
            <div className={cn(
              "w-11 h-11 rounded-xl border flex items-center justify-center shadow-sm shrink-0 transition-colors",
              recommended ? "bg-gradient-to-br from-purple-500/20 to-indigo-500/10 border-purple-500/20 text-purple-400" : "bg-white/[0.02] border-white/[0.05] text-white/40 group-hover:bg-white/[0.04] group-hover:text-white/60"
            )}>
              <Building2 size={20} strokeWidth={1.5} />
            </div>
            <div className="flex flex-col gap-0.5">
              <h3 className="text-[15px] font-semibold text-white/90 leading-tight">{company}</h3>
              <p className="text-[12px] text-white/40 font-medium flex items-center gap-1.5">
                <MapPin size={11} /> {location}
              </p>
            </div>
          </div>
          {recommended && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] uppercase font-bold tracking-wider leading-none">
              <Sparkles size={10} />
              <span>Top Match</span>
            </div>
          )}
        </div>

        {/* Job Title & Meta */}
        <div className="flex flex-col items-start mb-6">
          <h2 className="text-[18px] md:text-[20px] font-semibold text-white tracking-tight leading-snug mb-3 group-hover:text-purple-400 transition-colors line-clamp-2">
            {title}
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-white/[0.03] text-[12px] font-medium text-white/50 border border-white/[0.05]">
              {type}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white/[0.03] text-[12px] font-medium text-white/50 border border-white/[0.05] flex items-center gap-1.5">
              <Clock size={11} /> 2 days ago
            </span>
          </div>
        </div>

        {/* Skills List */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {skills.map((skill, i) => (
            <span key={i} className={cn(
              "px-2.5 py-1 rounded-md text-[11px] font-medium transition-all",
              recommended 
                ? "text-purple-300/90 bg-purple-500/[0.08] border border-purple-500/20"
                : "text-white/40 bg-white/[0.02] border border-white/[0.05] group-hover:text-white/60"
            )}>
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Action */}
      <div className="mt-7 pt-5 border-t border-white/[0.05] flex items-center justify-between">
        <span className="text-[12px] font-medium text-white/30 group-hover:text-white/50 transition-colors">Multiple applicants</span>
        <button className={cn(
          "px-5 py-2 rounded-lg text-[12px] font-semibold transition-all flex items-center justify-center gap-2 group/btn",
          recommended 
            ? "bg-purple-500 hover:bg-purple-400 text-white shadow-lg shadow-purple-500/20 active:scale-[0.98]" 
            : "bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/[0.05] active:scale-[0.98]"
        )}>
          Apply <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Jobs & Internships Page
───────────────────────────────────────────── */
const JobsAndInternships = () => {
  const [activeTab, setActiveTab] = useState('all');
  const jobs = [
    { title: "Senior React Engineer", company: "Vercel", location: "San Francisco, CA", type: "Full-time", skills: ["React", "Next.js", "TypeScript"], recommended: true },
    { title: "Machine Learning Intern", company: "OpenAI", location: "San Francisco, CA", type: "Internship", skills: ["Python", "PyTorch", "NLP"], recommended: true },
    { title: "Backend Systems", company: "Stripe", location: "Seattle, WA", type: "Full-time", skills: ["Go", "AWS", "PostgreSQL"], recommended: true },
    { title: "Frontend Web Developer", company: "Figma", location: "Remote", type: "Contract", skills: ["Vue", "CSS", "UI/UX"], recommended: false },
    { title: "Security Analyst", company: "Cloudflare", location: "Remote", type: "Full-time", skills: ["Security", "Rust", "Networks"], recommended: false },
    { title: "Data Science Lead", company: "Spotify", location: "New York, NY", type: "Full-time", skills: ["SQL", "Python", "BigQuery"], recommended: false }
  ];

  const stats = [
    { label: "Matches", value: "124" },
    { label: "New Today", value: "12" },
    { label: "Top Skill", value: "React" }
  ];

  return (
    <div className="w-full h-full flex flex-col gap-6 px-4 md:px-8 lg:px-10 pb-6">
      <div className="max-w-7xl mx-auto w-full flex flex-col animate-in fade-in duration-500">
      
        {/* Page header */}
        <div className="shrink-0 mt-4 mb-10 flex flex-col items-center justify-center text-center">
          <h1 className="text-[32px] md:text-[40px] font-bold text-white tracking-tight mb-3">
            Discover <span className="text-white/30 font-light">Roles</span>
          </h1>
          <p className="text-[15px] md:text-[17px] text-white/40 max-w-2xl leading-relaxed">
            AI-curated opportunities perfectly aligned with your top skills and career trajectory.
          </p>
        </div>

        {/* Premium Search Command Container */}
        <div className="w-full relative mb-16 lg:mb-20 z-10">
          <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-full bg-gradient-to-r from-purple-500/10 via-transparent to-indigo-500/10 blur-[40px] -z-10 rounded-full opacity-30 mx-auto" />
          
          <div className="flex flex-col md:flex-row gap-0.5 w-full p-2 bg-[#0c0c14]/80 backdrop-blur-xl border border-white/[0.08] rounded-[28px] shadow-2xl items-center mx-auto max-w-5xl">
            {/* Main Search */}
            <div className="flex-1 flex items-center bg-transparent hover:bg-white/[0.02] rounded-[22px] px-6 py-2 transition-all focus-within:bg-white/[0.03] group w-full">
              <Search size={18} className="text-white/30 group-focus-within:text-purple-400 mr-3 shrink-0 transition-colors" />
              <input 
                type="text" 
                placeholder="Search roles, skills, or companies..." 
                className="w-full bg-transparent border-none py-3.5 text-[15px] font-medium text-white placeholder:text-white/25 outline-none tracking-wide"
              />
            </div>
            
            <div className="hidden md:block w-px h-10 bg-white/10 mx-2" />
            
            <div className="flex w-full md:w-auto gap-2 pr-1">
              {/* Location Search */}
              <div className="flex-1 md:flex-none flex items-center bg-transparent hover:bg-white/[0.02] rounded-[22px] px-6 py-2 transition-all focus-within:bg-white/[0.03] group md:w-[260px]">
                <MapPin size={18} className="text-white/30 group-focus-within:text-purple-400 mr-3 shrink-0 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Location..." 
                  className="w-full bg-transparent border-none py-3.5 text-[15px] font-medium text-white placeholder:text-white/25 outline-none tracking-wide"
                />
              </div>

              {/* Filter Button */}
              <button className="flex items-center justify-center gap-2.5 px-7 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 rounded-[20px] text-white/90 transition-all shadow-sm shrink-0 font-bold text-[11px] uppercase tracking-[0.2em] active:scale-95">
                <Filter size={14} className="opacity-70" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats & Filters Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16 max-w-6xl mx-auto w-full border-b border-white/[0.05] pb-12">
          <div className="flex items-center gap-1.5 bg-white/[0.03] p-1.5 rounded-[20px] border border-white/[0.05]">
            {['all', 'recommended', 'saved'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-7 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.15em] transition-all",
                  activeTab === tab 
                    ? "bg-white/10 text-white shadow-lg border border-white/10" 
                    : "text-white/30 hover:text-white/60"
                )}
              >
                {tab === 'all' ? 'All Roles' : tab === 'recommended' ? 'Top Matches' : 'Saved'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-12">
            {stats.map((s, i) => (
              <div key={i} className="flex flex-col items-end gap-1">
                <span className="text-[10px] uppercase tracking-[0.25em] font-black text-white/20">{s.label}</span>
                <span className="text-[18px] font-bold text-white/80">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Content Columns */}
        <div className="flex flex-col gap-24 mx-auto w-full pb-10">

          {/* Priority Section */}
          {(activeTab === 'all' || activeTab === 'recommended') && (
            <div className="space-y-10">
              <div className="flex items-center gap-6 opacity-90 max-w-6xl mx-auto w-full">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shadow-inner">
                    <Sparkles size={18} />
                  </div>
                  <span className="text-[14px] font-black uppercase tracking-[0.3em] text-white pt-0.5">Recommended for you</span>
                </div>
                <div className="h-px bg-white/5 flex-1" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {jobs.filter(j => j.recommended).map((job, i) => (
                  <JobCard key={i} {...job} />
                ))}
              </div>
            </div>
          )}

          {/* Normal Section */}
          {activeTab === 'all' && (
            <div className="space-y-10">
              <div className="flex items-center gap-6 opacity-70 max-w-6xl mx-auto w-full">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 text-white/30 flex items-center justify-center">
                    <Briefcase size={18} />
                  </div>
                  <span className="text-[14px] font-black uppercase tracking-[0.3em] text-white pt-0.5">Explore More</span>
                </div>
                <div className="h-px bg-white/5 flex-1" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {jobs.filter(j => !j.recommended).map((job, i) => (
                  <JobCard key={i} {...job} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-dashed border-white/10 flex items-center justify-center mb-6 text-white/20">
                <Filter size={32} />
              </div>
              <h3 className="text-[18px] font-bold text-white mb-2">No saved jobs yet</h3>
              <p className="text-[14px] text-white/40">Start exploring roles and save your favorites to track them here.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default JobsAndInternships;
