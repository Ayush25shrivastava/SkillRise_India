import React, { useState } from 'react';
import { Send, Star, Sparkles, MessageSquare, AlertCircle, Heart, CheckCircle2 } from 'lucide-react';
import { cn } from '../services/utils';

const FeedbackActionCard = ({ title, description, icon: Icon, colorClass, borderClass }) => (
  <div className={cn(
    "p-6 rounded-[2rem] bg-[#0c0c14]/50 border border-white/[0.05] hover:bg-white/[0.03] transition-all duration-300 cursor-pointer group flex flex-col items-center text-center md:items-start md:text-left",
    borderClass
  )}>
    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-inner", colorClass)}>
      <Icon size={20} />
    </div>
    <h3 className="text-white font-bold mb-2 text-[15px] tracking-tight">{title}</h3>
    <p className="text-[12px] text-white/40 leading-relaxed font-medium line-clamp-2">{description}</p>
  </div>
);

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <div className="w-full flex flex-col items-center py-6 px-6 md:px-12 lg:px-16 pb-20 relative animate-in fade-in duration-700">
      
      {/* Immersive Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-purple-600/5 blur-[120px] pointer-events-none rounded-full -z-10" />

      {/* Header Section */}
      <div className="w-full max-w-4xl flex flex-col items-center text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/5 border border-purple-500/10 mb-5">
          <MessageSquare size={13} className="text-purple-400" />
          <span className="text-[10px] font-black text-purple-300/60 uppercase tracking-[0.2em]">Community Interface</span>
        </div>
        <h1 className="text-[34px] md:text-[42px] font-black text-white tracking-tight leading-none mb-4">
          Share Your <span className="text-white/30 font-light italic">Insights</span>
        </h1>
        <p className="text-[14px] md:text-[15px] text-white/40 max-w-lg leading-relaxed font-medium">
          Help us refine the SkillRise AI experience. Every piece of feedback directly influences our neural development path.
        </p>
      </div>

      {/* Submission Status Overlay */}
      {isSubmitted && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 fade-in duration-500">
          <div className="bg-emerald-500/20 backdrop-blur-xl border border-emerald-500/30 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            <CheckCircle2 size={18} className="text-emerald-400" />
            <span className="text-[13px] font-bold text-emerald-400 uppercase tracking-widest">Feedback Transmitted</span>
          </div>
        </div>
      )}

      {/* Main Page Content Grid */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-10">
        
        {/* Left Column: Form (8 cols) */}
        <div className="md:col-span-12 lg:col-span-8 flex flex-col">
          <div className="bg-[#0c0c14]/60 backdrop-blur-2xl border border-white/[0.08] rounded-[2.5rem] p-8 md:p-10 shadow-3xl h-full flex flex-col">
            <form onSubmit={handleSubmit} className="space-y-10 flex-1 flex flex-col">
              
              {/* Star Rating Interaction */}
              <div className="flex flex-col items-center py-2 space-y-6">
                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.35em]">Experience Rating</span>
                <div className="flex gap-4">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button 
                      key={num}
                      type="button"
                      onMouseEnter={() => setHoveredRating(num)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRating(num)}
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 border shadow-inner",
                        (hoveredRating || rating) >= num 
                          ? "bg-purple-500/20 border-purple-500/30 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.15)] scale-110" 
                          : "bg-white/5 border-white/5 text-white/10 hover:text-white/30"
                      )}
                    >
                      <Star size={22} fill={(hoveredRating || rating) >= num ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback Textarea */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.35em] ml-2">Detail Narrative</label>
                <textarea 
                  required
                  rows="6"
                  placeholder="Express your technical findings or feature suggestions..."
                  className="w-full bg-[#0a0a0f] border border-white/[0.08] rounded-[1.8rem] p-6 text-white placeholder:text-white/10 outline-none focus:border-purple-500/30 transition-all resize-none text-[15px] leading-relaxed shadow-inner"
                />
              </div>

              <div className="mt-auto pt-6">
                <button 
                  type="submit"
                  className="w-full py-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl shadow-purple-500/20 group uppercase tracking-[0.25em] text-[12px]"
                >
                  <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  Transmit Module
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Secondary Cards (4 cols) */}
        <div className="md:col-span-12 lg:col-span-4 flex flex-col gap-6">
          <FeedbackActionCard 
            title="Technical Bug" 
            description="Report anomalies in our AI processing modules."
            icon={AlertCircle}
            colorClass="bg-red-500/10 text-red-400"
            borderClass="hover:border-red-500/20"
          />
          <FeedbackActionCard 
            title="Feature Request" 
            description="Influence the technical roadmap with your vision."
            icon={Sparkles}
            colorClass="bg-amber-500/10 text-amber-400"
            borderClass="hover:border-amber-500/20"
          />
          <FeedbackActionCard 
            title="Community Project" 
            description="Collaborative initiatives and open-source contributions."
            icon={Heart}
            colorClass="bg-pink-500/10 text-pink-400"
            borderClass="hover:border-pink-500/20"
          />
          
          {/* Subtle Help Text */}
          <div className="mt-auto p-6 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10 flex items-start gap-4">
             <div className="shrink-0 text-indigo-400 mt-1"><Sparkles size={14} /></div>
             <p className="text-[11px] text-white/30 font-medium leading-relaxed uppercase tracking-wider">
               Our average response cycle for technical queries is <span className="text-white/60">24 hours</span>.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
