import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { interviewAPI, vapiAPI } from "../api";
import { useToast } from "../components/ui/Toast";
import Button from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import {
  USER_CATEGORIES,
  INTERVIEW_TYPES,
  CATEGORY_TYPES,
  EXPERIENCE_LEVELS,
  TECH_STACK_OPTIONS,
} from "../utils/constants";
import { cn } from "../utils/helpers";
import { ChevronRight, Sparkles, UserCircle } from "lucide-react";

const STEPS = ["Identify", "Deploy"];

export default function NewInterviewPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [generatingQ, setGeneratingQ] = useState(false);
  const [form, setForm] = useState({
    userCategory: "white-collar",
    role: "",
    type: "technical",
    level: "mid",
    techstack: [],
    questionCount: 5,
    language: "English",
    questions: [],
  });

  // When category changes, reset type if it's not compatible
  useEffect(() => {
    const allowedTypes = CATEGORY_TYPES[form.userCategory];
    if (!allowedTypes.includes(form.type)) {
      setForm((f) => ({ ...f, type: allowedTypes[0] }));
    }
  }, [form.userCategory]);

  const toggleTech = (tech) => {
    setForm((f) => ({
      ...f,
      techstack: f.techstack.includes(tech)
        ? f.techstack.filter((t) => t !== tech)
        : [...f.techstack, tech],
    }));
  };

  const generateQuestionsAndCreate = async () => {
    setLoading(true);
    let finalQuestions = form.questions;
    
    if (finalQuestions.length === 0) {
      setGeneratingQ(true);
      try {
        const { data } = await vapiAPI.generateQuestions({
          userCategory: form.userCategory,
          role: form.role,
          type: form.type,
          level: form.level,
          techstack: form.techstack,
          language: form.language,
          amount: form.questionCount,
        });
        finalQuestions = data.questions;
      } catch (err) {
        finalQuestions = [
          `Tell me about your experience as a ${form.role}.`,
          "Describe a challenging situation you handled recently.",
          "How do you ensure quality in your work?",
          "What's your approach to teamwork?",
          "Where do you see yourself in 3 years?",
        ].slice(0, form.questionCount);
      } finally {
        setGeneratingQ(false);
      }
    }

    try {
      const { data } = await interviewAPI.create({
        userCategory: form.userCategory,
        role: form.role,
        type: form.type,
        level: form.level,
        techstack: form.techstack,
        language: form.language,
        questions: finalQuestions,
      });
      toast({ title: "Session Launched!", type: "success" });
      navigate(`/interviews/${data.interview._id}`);
    } catch (err) {
      toast({ title: "Launch Failed", description: err.response?.data?.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 animate-fade-in">
      {/* HUD Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] font-black uppercase tracking-[0.4em]">
          <Sparkles className="w-3 h-3" /> Terminal Protocol {step + 1}/{STEPS.length}
        </div>
        <h1 className="text-5xl font-black text-white tracking-tighter leading-none italic uppercase">
          {step === 0 ? "Identify Status" : "Deploy Logic"}
        </h1>
      </div>

      <Card className="p-10 md:p-14 border-0 bg-white/[0.02] backdrop-blur-3xl rounded-[48px] shadow-3xl relative overflow-visible group">
        <div className="absolute -inset-0.5 bg-gradient-to-br from-indigo-500/20 to-purple-500/10 rounded-[48px] blur-3xl opacity-50 -z-10" />

        <div className="min-h-[400px]">
          {/* Step 0: Identity (Category + Role) */}
          {step === 0 && (
            <div className="space-y-14 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {USER_CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setForm({ ...form, userCategory: cat.value })}
                    className={cn(
                      "flex flex-col items-center text-center p-8 rounded-[32px] border-2 transition-all duration-500 relative group/btn",
                      form.userCategory === cat.value 
                        ? "border-indigo-500 bg-indigo-500/10 shadow-[0_0_40px_rgba(99,102,241,0.2)]" 
                        : "border-white/5 bg-white/[0.02] hover:border-white/10"
                    )}
                  >
                    <div className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 transition-all duration-500",
                      form.userCategory === cat.value ? "bg-indigo-500 text-white scale-110" : "bg-white/5"
                    )}>
                      {cat.icon}
                    </div>
                    <h3 className={cn("text-sm font-black uppercase tracking-widest", form.userCategory === cat.value ? "text-indigo-400" : "text-white/40")}>
                      {cat.label}
                    </h3>
                  </button>
                ))}
              </div>

              <div className="space-y-6 max-w-xl mx-auto">
                <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] pl-2">Designation Matrix</label>
                <div className="relative">
                   <UserCircle className={cn("absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 transition-colors", form.role ? "text-indigo-500" : "text-white/10")} />
                   <input
                    type="text"
                    placeholder="ENTER ROLE DESIGNATION..."
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full h-20 pl-16 pr-8 rounded-[2rem] bg-white/[0.03] border border-white/5 focus:border-indigo-500/40 outline-none text-xl font-black uppercase tracking-widest text-white transition-all placeholder:text-white/5"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Integrated Deployment (Type, Level, Skills, Count, Language) */}
          {step === 1 && (
            <div className="space-y-12 animate-fade-in max-w-3xl mx-auto">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] pl-1">Assessment Track</label>
                    <div className="grid grid-cols-1 gap-4">
                      {INTERVIEW_TYPES.filter(t => CATEGORY_TYPES[form.userCategory].includes(t.value)).map((t) => (
                        <button
                          key={t.value}
                          onClick={() => setForm({ ...form, type: t.value })}
                          className={cn(
                            "flex items-center gap-5 p-5 rounded-[2rem] border-2 transition-all group/opt",
                            form.type === t.value ? "border-indigo-500 bg-indigo-500/5" : "border-white/5 bg-white/5 hover:border-white/20"
                          )}
                        >
                          <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all", form.type === t.value ? "bg-indigo-500 text-white" : "bg-white/10 group-hover/opt:bg-white/20")}>{t.icon}</div>
                          <div className="text-left">
                            <p className={cn("text-xs font-black uppercase tracking-widest", form.type === t.value ? "text-indigo-400" : "text-white")}>{t.label}</p>
                            <p className="text-[9px] text-white/20 font-bold uppercase tracking-tighter">{t.description}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-8">
                    <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] pl-1">Seniority Parameter</label>
                    <div className="grid grid-cols-1 gap-4">
                      {EXPERIENCE_LEVELS.map((l) => (
                        <button
                          key={l.value}
                          onClick={() => setForm({ ...form, level: l.value })}
                          className={cn(
                            "flex justify-between items-center px-6 h-16 rounded-[2rem] border-2 transition-all",
                            form.level === l.value ? "border-indigo-500 bg-indigo-500/10" : "border-white/5 bg-white/5"
                          )}
                        >
                          <span className={cn("text-xs font-black uppercase tracking-widest", form.level === l.value ? "text-indigo-400" : "text-white/40")}>{l.label}</span>
                          <span className="text-[10px] text-white/10 uppercase font-black tracking-widest">{l.years}</span>
                        </button>
                      ))}
                    </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-white/5">
                  <div className="space-y-6">
                    <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Node Matrix</label>
                    <div className="flex gap-3">
                      {[3, 5, 10].map(n => (
                        <button key={n} onClick={() => setForm({...form, questionCount: n})} className={cn("w-14 h-14 rounded-2xl border-2 font-black text-xs transition-all", form.questionCount === n ? "bg-indigo-500 border-indigo-500 text-white shadow-xl shadow-indigo-500/20" : "border-white/5 bg-white/5 text-white/20")}>{n}</button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Protocol Language</label>
                    <div className="flex gap-3">
                      {["English", "Hinglish"].map(lang => (
                        <button key={lang} onClick={() => setForm({...form, language: lang})} className={cn("px-6 h-14 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest transition-all", form.language === lang ? "bg-indigo-500 border-indigo-500 text-white shadow-xl shadow-indigo-500/20" : "border-white/5 bg-white/5 text-white/20")}>{lang}</button>
                      ))}
                    </div>
                  </div>
               </div>

               {form.userCategory !== "blue-collar" && (
                <div className="space-y-6 pt-6 border-t border-white/5">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Technical Matrix</label>
                  <div className="flex flex-wrap gap-2">
                    {TECH_STACK_OPTIONS.slice(0, 10).map(tech => (
                      <button
                        key={tech}
                        onClick={() => toggleTech(tech)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-[9px] font-black uppercase border transition-all",
                          form.techstack.includes(tech) ? "bg-indigo-500 border-indigo-500 text-white shadow-lg" : "bg-white/5 border-white/5 text-white/20 hover:border-white/20"
                        )}
                      >
                        {tech}
                      </button>
                    ))}
                  </div>
                </div>
               )}
            </div>
          )}
        </div>

        {/* Global Progress Line */}
        <div className="absolute bottom-0 left-0 h-1 bg-indigo-500 transition-all duration-1000 ease-out" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
      </Card>

      {/* Control Interface */}
      <div className="flex items-center justify-between max-w-xl mx-auto">
        <button 
          onClick={() => setStep(0)} 
          disabled={step === 0} 
          className={cn(
            "text-[10px] font-black uppercase tracking-[0.4em] transition-all",
            step === 0 ? "opacity-0 pointer-events-none" : "text-white/20 hover:text-white"
          )}
        >
          [ RESET ]
        </button>
        
        {step === 0 ? (
          <Button 
            onClick={() => setStep(1)} 
            disabled={!form.role.trim()} 
            className="px-16 h-20 rounded-[2.5rem] shadow-2xl shadow-indigo-500/20 font-black tracking-[0.5em] uppercase text-[11px] bg-white text-black hover:bg-indigo-500 hover:text-white transition-all transform hover:scale-105 active:scale-95"
          >
            CONFIGURE
            <ChevronRight size={20} className="ml-2" />
          </Button>
        ) : (
          <Button 
            onClick={generateQuestionsAndCreate} 
            loading={loading || generatingQ} 
            className="px-20 h-20 rounded-[2.5rem] text-[11px] font-black tracking-[0.6em] shadow-2xl shadow-indigo-500/40 bg-indigo-600 text-white hover:bg-indigo-500 transition-all uppercase transform hover:scale-110 active:scale-95 glow-primary"
          >
            DEPLOY INTERVIEW
          </Button>
        )}
      </div>
    </div>
  );
}
