import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowLeft, Loader2, Frown, Rocket, FileText } from "lucide-react";
import RecommendationCard from "../components/recommendations/RecommendationCard";
import SkillGapSection from "../components/recommendations/SkillGapSection";
import API from "../services/authService";

const RecommendationPage = () => {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const analyzedSkills = localStorage.getItem("analyzedSkills");
        const params = {};
        if (analyzedSkills) {
          params.skills = JSON.parse(analyzedSkills).join(",");
        }

        const res = await API.get("/recommendations", { params });
        setRecommendations(res.data);
      } catch (err) {
        console.error("Fetch recommendations error:", err);
        setError("Failed to initialize recommendation engine. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#06060a] flex items-center justify-center flex-col gap-6">
        <div className="relative">
          <Loader2 size={48} className="text-violet-600 animate-spin" />
          <Sparkles size={20} className="absolute top-0 -right-4 text-cyan-400 animate-pulse" />
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-white tracking-widest uppercase mb-1">Synchronizing Vectors</p>
          <p className="text-xs font-black text-white/20 uppercase tracking-[0.5em] animate-pulse">Running AI Inference...</p>
        </div>
      </div>
    );
  }

  if (error || !recommendations) {
    return (
      <div className="min-h-screen bg-[#06060a] flex items-center justify-center flex-col p-10 text-center">
        <Frown size={64} className="text-white/10 mb-8" />
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Inference Failure</h2>
        <p className="text-white/30 font-medium max-w-sm mb-10 leading-relaxed">
          {error || "We couldn't generate recommendations for your profile at this moment."}
        </p>
        <Link 
          to="/dashboard" 
          className="px-8 py-4 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-white hover:text-black transition-all"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const { high_match, medium_match, skill_gap_insights, recommended_learning_paths } = recommendations;

  // ONBOARDING / EMPTY STATE (FOR NEW USERS)
  if (high_match.length === 0 && medium_match.length === 0) {
    return (
      <div className="min-h-screen bg-[#06060a] p-8 md:p-12 lg:p-16 flex items-center justify-center">
        <div className="max-w-2xl w-full text-center space-y-12 animate-in fade-in zoom-in-95 duration-700">
          
          <div className="space-y-6">
            <div className="w-24 h-24 rounded-3xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mx-auto shadow-[0_0_50px_rgba(139,92,246,0.15)]">
              <Sparkles size={48} className="animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic">
              Your Professional <span className="text-violet-400">Trajectory</span> is Locked
            </h1>
            <p className="text-white/40 text-lg font-medium leading-relaxed">
              We need to map your skill artifacts before we can synthesize NGO matches. Start your journey by analyzing your professional resume.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <Link 
              to="/resume-analyzer"
              className="px-12 py-5 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-violet-400 transition-all flex items-center gap-3 shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(139,92,246,0.3)] hover:scale-105 active:scale-95 transition-transform"
            >
              Analyze Resume First
              <FileText size={16} />
            </Link>
            
            <p className="text-[10px] text-white/20 font-black uppercase tracking-widest mt-4">
              Step 1: Resume Intake • Step 2: AI Synthesis • Step 3: Match Deployment
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06060a] text-white">
      {/* Header Container */}
      <div className="max-w-7xl mx-auto px-6 pt-12">
        <div className="flex items-center justify-between mb-20">
          <Link 
            to="/dashboard" 
            className="group flex items-center gap-4 text-white/40 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest"
          >
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/10 transition-all">
              <ArrowLeft size={16} />
            </div>
            Back
          </Link>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Sparkles size={20} className="text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white uppercase">
              Skill<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Rise</span> AI
            </span>
          </div>
        </div>

        <div className="mb-24 space-y-8 max-w-3xl">
          <div className="space-y-4">
            <h1 className="text-6xl font-black tracking-tighter leading-none mb-6">
              <span className="text-white/50 block mb-2">DYNAMIC</span>
              TRAJECTORY ANALYSIS
            </h1>
            <p className="text-lg text-white/40 font-medium leading-relaxed max-w-2xl">
              We've analyzed your latent skill artifacts and experience vectors to identify the most synchronized opportunities in the NGO ecosystem.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 pt-4">
            <Link 
              to="/resume-analyzer"
              className="px-8 py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 shadow-[0_0_30px_rgba(124,58,237,0.3)] hover:shadow-[0_0_40px_rgba(124,58,237,0.5)] active:scale-95"
            >
              Analyze Resume for Enhanced Results
              <Sparkles size={16} />
            </Link>
          </div>
        </div>

        {/* 1. HIGH MATCH SECTION */}
        <div className="space-y-10 mb-24 px-2">
          <div className="flex items-center gap-6">
             <div className="h-px flex-1 bg-white/[0.06]" />
             <h2 className="text-2xl font-black text-white uppercase tracking-tighter shrink-0 flex items-center gap-4">
                🔥 Best Matches <span className="text-white/20">For You</span>
             </h2>
             <div className="h-px flex-1 bg-white/[0.06]" />
          </div>

          {!high_match || high_match.length === 0 ? (
            <div className="bg-white/2 border border-white/5 rounded-[2.5rem] p-16 text-center">
              <p className="text-white/20 font-black text-xs uppercase tracking-[0.5rem]">No high-probability vectors found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {high_match.map((recom) => (
                <RecommendationCard key={recom.id} recommendation={recom} />
              ))}
            </div>
          )}
        </div>

        {/* 2. SKILL GAP SECTION */}
        <SkillGapSection insights={skill_gap_insights} />

        {/* 3. LEARNING PATHS (Secondary Section) */}
        {recommended_learning_paths && recommended_learning_paths.length > 0 && (
          <div className="mt-24 mb-32 space-y-12">
            <div className="space-y-2">
              <h2 className="text-4xl font-black text-white tracking-tighter uppercase shrink-0 flex items-center gap-4">
                <Rocket className="text-white/20" size={32} />
                Learning <span className="text-white/30">Paths</span>
              </h2>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Accelerated Domain Acquisition Program</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommended_learning_paths.map((path, index) => (
                <div 
                  key={index} 
                  className="p-8 rounded-[2.5rem] bg-gradient-to-br from-white/[0.04] to-transparent border border-white/[0.06] hover:border-white/[0.1] transition-all group"
                >
                  <div className="flex items-start gap-6">
                     <span className="text-4xl font-black text-white/5 opacity-50 group-hover:text-violet-500/20 transition-colors">0{index + 1}</span>
                     <p className="text-lg font-bold text-white/70 group-hover:text-white transition-colors pt-2 leading-relaxed">
                       {path}
                     </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Footer Design */}
      <footer className="border-t border-white/5 pb-20 pt-12">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em] text-white/10">
          <span>Vector Integrity Certified</span>
          <div className="flex gap-10">
            <Link to="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="#" className="hover:text-white transition-colors">Ethics</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RecommendationPage;
