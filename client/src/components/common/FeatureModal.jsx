import React from 'react';
import { 
  X, 
  Upload, 
  Target, 
  BrainCircuit, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Search,
  Zap,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';
import { cn } from '../../services/utils';

const FeatureModal = ({ isOpen, onClose, feature }) => {
  if (!isOpen || !feature) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-500">
      {/* Dynamic Backdrop */}
      <div 
        className="absolute inset-0 bg-[#0a0a0a]/90 backdrop-blur-2xl"
        onClick={onClose}
      />
      
      {/* Optimized Modal Vault */}
      <div className="relative bg-[#0a0a0a] border border-white/10 w-full max-w-6xl max-h-[90vh] rounded-[3.5rem] overflow-hidden shadow-[0_0_100px_rgba(255,255,255,0.05)] flex flex-col animate-in slide-in-from-bottom-8 duration-700">
        
        {/* Header Unit */}
        <div className="flex items-center justify-between p-10 border-b border-white-[0.05] bg-white/[0.01]">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center text-white/50">
              {feature.icon ? <feature.icon size={24} /> : <Zap size={24} />}
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">{feature.title}</h2>
              <p className="text-muted text-[9px] font-black uppercase tracking-[0.2em] mt-2 opacity-50">Career Intelligence Module v4.2</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center active:scale-90"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Matrix */}
        <div className="flex-1 overflow-y-auto p-10 md:p-12 scrollbar-hide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* 1. Protocol Configuration (Input) */}
            <div className="space-y-12">
              <div>
                <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-10 flex items-center gap-3">
                   <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_5px_white]" />
                   Input Parameters
                </h3>
                
                <div className="space-y-10 px-2">
                  {/* Upload Vector */}
                  <div className="group">
                    <label className="text-[9px] font-black text-muted uppercase tracking-widest mb-4 block">Source Data Sync</label>
                    <div className="border border-dashed border-white/10 rounded-[2.5rem] p-12 flex flex-col items-center justify-center bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/20 transition-all cursor-pointer group">
                      <div className="h-12 w-12 rounded-2xl bg-white/5 text-white/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Upload size={20} />
                      </div>
                      <p className="text-white font-bold text-xs uppercase tracking-tight">Sync Artifact</p>
                      <p className="text-muted text-[9px] mt-2 font-black uppercase tracking-widest opacity-40">PDF / DOCX (10MB Limit)</p>
                    </div>
                  </div>

                  {/* Definition Vector */}
                  <div className="space-y-4">
                    <label className="text-[9px] font-black text-muted uppercase tracking-widest mb-4 block">Target Trajectory</label>
                    <div className="relative">
                       <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                       <input 
                         type="text" 
                         placeholder="Identify destination protocol..." 
                         className="w-full bg-white/2 border border-white/10 rounded-2xl py-4.5 pl-14 pr-6 text-xs text-white placeholder:text-muted/30 outline-none focus:border-white/20 transition-all uppercase tracking-tight font-bold"
                       />
                    </div>
                  </div>

                  {/* Execution Key */}
                  <button className="w-full py-4.5 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-2xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
                    <Sparkles size={16} /> Execute Logic Analysis
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Intelligence Projections (Output) */}
            <div className="space-y-12 bg-white/[0.01] rounded-[3rem] p-10 border border-white/[0.05] relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[100px] pointer-events-none" />
               
               <div>
                  <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-10 flex items-center gap-3">
                    <BrainCircuit size={16} className="text-white/40" /> Projected Insights
                  </h3>

                  <div className="space-y-12 px-2">
                     {/* Artifact Detection */}
                     <div>
                        <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-6">Detected Artifacts</p>
                        <div className="flex flex-wrap gap-2.5">
                           {["Core Logic", "ML Mastery", "Systems", "Frontend", "Calculus"].map((skill, i) => (
                             <span key={i} className="px-3 py-1.5 rounded-lg bg-white/2 border border-white/[0.03] text-[9px] font-black text-muted uppercase tracking-widest">
                               {skill}
                             </span>
                           ))}
                        </div>
                     </div>

                     {/* Role Synchronization */}
                     <div>
                        <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-6">Role Synchronization</p>
                        <div className="space-y-4">
                           {[
                             { title: "Systems Expert", match: "94%" },
                             { title: "AI Protocol Engineer", match: "88%" }
                           ].map((path, i) => (
                             <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.01] border border-white/[0.03] group hover:bg-white/2 transition-all">
                                <span className="text-xs font-bold text-white uppercase tracking-tight">{path.title}</span>
                                <span className="text-[9px] font-black text-white/40 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5 tracking-widest">{path.match} SYNC</span>
                             </div>
                           ))}
                        </div>
                     </div>

                     {/* Protocol Roadmap */}
                     <div>
                        <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-6">Sequential Milestones</p>
                        <div className="relative pl-6 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-white/10">
                           {[
                             { month: "MIL 01", task: "Advanced Node Logistics" },
                             { month: "MIL 02", task: "Statistical Optimization" }
                           ].map((step, i) => (
                             <div key={i} className="relative">
                                <div className="absolute -left-6 top-1.5 h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_5px_white]" />
                                <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] mb-1.5">{step.month}</p>
                                <p className="text-[11px] font-bold text-white tracking-tight uppercase">{step.task}</p>
                             </div>
                           ))}
                        </div>
                     </div>
                  </div>

                  {/* Terminal Link */}
                  <div className="mt-16 pt-8 border-t border-white/[0.05]">
                     <button className="text-white text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:translate-x-1 transition-transform group">
                        Complete Intelligence Details <ArrowUpRight size={14} className="opacity-20" />
                     </button>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Global Compliance Footer */}
        <div className="p-8 bg-white/[0.02] border-t border-white/[0.05] flex items-center justify-center gap-12 grayscale opacity-20">
           <div className="flex items-center gap-3 text-[7px] font-black text-white uppercase tracking-[0.4em]">
              <Sparkles size={10} /> Sync Encrypted
           </div>
           <div className="flex items-center gap-3 text-[7px] font-black text-white uppercase tracking-[0.4em]">
              <CheckCircle2 size={10} /> Model GPT-4o Synchronized
           </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureModal;
