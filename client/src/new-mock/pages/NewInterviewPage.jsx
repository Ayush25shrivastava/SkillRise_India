import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { interviewAPI, vapiAPI } from "../api";
import { useToast } from "../components/ui/Toast";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import {
  USER_CATEGORIES,
  INTERVIEW_TYPES,
  CATEGORY_TYPES,
  EXPERIENCE_LEVELS,
  TECH_STACK_OPTIONS,
  QUESTION_COUNTS,
} from "../utils/constants";
import { cn } from "../utils/helpers";
import { Check, Search, ChevronRight, ChevronLeft, Sparkles, UserCircle } from "lucide-react";

const STEPS = ["Category", "Role", "Type & Level", "Skills", "Questions", "Review"];

export default function NewInterviewPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [generatingQ, setGeneratingQ] = useState(false);
  const [techSearch, setTechSearch] = useState("");
  const [form, setForm] = useState({
    userCategory: "white-collar",
    role: "",
    type: "technical",
    level: "mid",
    techstack: [],
    questionCount: 5,
    questions: [],
  });

  // Filter tech options based on search
  const filteredTech = TECH_STACK_OPTIONS.filter((t) =>
    t.toLowerCase().includes(techSearch.toLowerCase())
  );

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

  const generateQuestions = async () => {
    setGeneratingQ(true);
    try {
      const { data } = await vapiAPI.generateQuestions({
        userCategory: form.userCategory,
        role: form.role,
        type: form.type,
        level: form.level,
        techstack: form.techstack,
        amount: form.questionCount,
      });
      setForm((f) => ({ ...f, questions: data.questions }));
      toast({ title: "Questions generated!", type: "success" });
    } catch (err) {
      toast({ title: "Using default questions", description: err.response?.data?.message, type: "info" });
      const defaults = [
        `Tell me about your experience as a ${form.role}.`,
        "Describe a challenging situation you handled recently.",
        "How do you ensure quality in your work?",
        "What's your approach to teamwork?",
        "Where do you see yourself in 3 years?",
      ].slice(0, form.questionCount);
      setForm((f) => ({ ...f, questions: defaults }));
    } finally {
      setGeneratingQ(false);
    }
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      const { data } = await interviewAPI.create({
        userCategory: form.userCategory,
        role: form.role,
        type: form.type,
        level: form.level,
        techstack: form.techstack,
        questions: form.questions,
      });
      toast({ title: "Interview created!", type: "success" });
      navigate(`/interviews/${data.interview._id}`);
    } catch (err) {
      toast({ title: "Failed to create", description: err.response?.data?.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const canNext = () => {
    if (step === 0) return !!form.userCategory;
    if (step === 1) return form.role.trim().length > 1;
    if (step === 4) return form.questions.length > 0;
    return true;
  };

  const next = () => {
    if (step === 4 && form.questions.length === 0) {
      generateQuestions();
      return;
    }

    let nextStep = step + 1;
    // Skip Skills (Step 3) for Blue Collar
    if (nextStep === 3 && form.userCategory === "blue-collar") {
      nextStep = 4;
    }

    if (nextStep < STEPS.length) setStep(nextStep);
  };

  const back = () => {
    let prevStep = step - 1;
    // Skip Skills (Step 3) for Blue Collar
    if (prevStep === 3 && form.userCategory === "blue-collar") {
      prevStep = 2;
    }
    if (prevStep >= 0) setStep(prevStep);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {STEPS.map((label, i) => {
            if (i === 3 && form.userCategory === "blue-collar") return null;
            return (
              <div key={i} className="flex items-center gap-1">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all",
                  i < step ? "bg-primary border-primary text-white" :
                  i === step ? "border-primary text-primary" :
                  "border-border text-muted-foreground"
                )}>
                  {i < step ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={cn("h-px flex-1 w-8 sm:w-12", i < step ? "bg-primary" : "bg-border")} />
                )}
              </div>
            );
          })}
        </div>
        <div className="flex justify-between">
          {STEPS.map((label, i) => {
            if (i === 3 && form.userCategory === "blue-collar") return null;
            return (
              <span key={i} className={cn("text-xs", i === step ? "text-primary font-medium" : "text-muted-foreground")}>
                {label}
              </span>
            );
          })}
        </div>
      </div>

      <Card className="min-h-80">
        {/* Step 0: Category */}
        {step === 0 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-bold text-foreground mb-1">Select your profile category</h2>
              <p className="text-muted-foreground text-sm">We'll tailor the interview experience to your track.</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {USER_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setForm({ ...form, userCategory: cat.value })}
                  className={cn(
                    "flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left",
                    form.userCategory === cat.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/40 bg-secondary/20"
                  )}
                >
                  <span className="text-3xl">{cat.icon}</span>
                  <div className="flex-1">
                    <p className={cn("font-bold", form.userCategory === cat.value ? "text-primary" : "text-foreground")}>{cat.label}</p>
                    <p className="text-sm text-muted-foreground">{cat.description}</p>
                  </div>
                  {form.userCategory === cat.value && <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"><Check className="w-4 h-4 text-white" /></div>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Role */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-bold text-foreground mb-1">What role are you interviewing for?</h2>
              <p className="text-muted-foreground text-sm">Be specific for the most relevant questions.</p>
            </div>
            <Input
              label={form.userCategory === "blue-collar" ? "Job Type / Trade" : "Job Title / Role"}
              placeholder={form.userCategory === "blue-collar" ? "e.g. Forklift Operator, Electrician, Warehouse lead..." : "e.g. Senior Frontend Engineer, Backend Developer…"}
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              autoFocus
            />
            <div className="flex flex-wrap gap-2">
              {(form.userCategory === "blue-collar" 
                ? ["Forklift Operator", "Electrician", "Warehouse Associate", "Operations Lead", "Delivery Driver", "Security Officer"]
                : ["Frontend Engineer", "Backend Developer", "Product Manager", "UI/UX Designer", "Data Analyst", "Project Manager"]
              ).map((r) => (
                <button
                  key={r}
                  onClick={() => setForm({ ...form, role: r })}
                  className={cn(
                    "px-3 py-1.5 rounded-lg border text-sm transition-all",
                    form.role === r ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/50"
                  )}
                >{r}</button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Type & Level */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-bold text-foreground mb-1">Interview type & level</h2>
              <p className="text-muted-foreground text-sm">Tailor the difficulty and focus.</p>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-3">Available Track</p>
              <div className={cn("grid gap-3", CATEGORY_TYPES[form.userCategory].length === 2 ? "grid-cols-2" : "grid-cols-3")}>
                {INTERVIEW_TYPES.filter(t => CATEGORY_TYPES[form.userCategory].includes(t.value)).map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setForm({ ...form, type: t.value })}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                      form.type === t.value ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"
                    )}
                  >
                    <span className="text-2xl">{t.icon}</span>
                    <span className={cn("text-sm font-medium text-center", form.type === t.value ? "text-primary" : "text-foreground")}>{t.label}</span>
                    <span className="text-[10px] sm:text-xs text-muted-foreground text-center line-clamp-2">{t.description}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-3">Experience Level</p>
              <div className="grid grid-cols-3 gap-3">
                {EXPERIENCE_LEVELS.map((l) => (
                  <button
                    key={l.value}
                    onClick={() => setForm({ ...form, level: l.value })}
                    className={cn(
                      "flex flex-col items-center gap-1 p-4 rounded-xl border-2 transition-all",
                      form.level === l.value ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"
                    )}
                  >
                    <span className={cn("text-sm font-semibold", form.level === l.value ? "text-primary" : "text-foreground")}>{l.label}</span>
                    <span className="text-xs text-muted-foreground">{l.years}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Skills / Tech Stack */}
        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h2 className="text-xl font-bold text-foreground mb-1">Relevant Skills</h2>
              <p className="text-muted-foreground text-sm">Select key skills or tools for this position.</p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <input
                placeholder="Search skills, tools, frameworks…"
                value={techSearch}
                onChange={(e) => setTechSearch(e.target.value)}
                className="w-full h-10 pl-9 pr-4 rounded-lg border border-border bg-secondary/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            {form.techstack.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.techstack.map((t) => (
                  <button key={t} onClick={() => toggleTech(t)} className="flex items-center gap-1 px-3 py-1 rounded-lg bg-primary/10 border border-primary/30 text-primary text-sm hover:bg-primary/20 transition-colors">
                    {t} <Check className="w-3 h-3" />
                  </button>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1 thin-scrollbar">
              {filteredTech.filter((t) => !form.techstack.includes(t)).map((tech) => (
                <button
                  key={tech}
                  onClick={() => toggleTech(tech)}
                  className="px-3 py-1.5 rounded-lg border border-border text-muted-foreground text-sm hover:border-primary/50 hover:text-foreground transition-all"
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Questions */}
        {step === 4 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h2 className="text-xl font-bold text-foreground mb-1">Interview questions</h2>
              <p className="text-muted-foreground text-sm">How many questions for your session?</p>
            </div>
            <div className="flex gap-3">
              {QUESTION_COUNTS.map((n) => (
                <button
                  key={n}
                  onClick={() => setForm({ ...form, questionCount: n, questions: [] })}
                  className={cn(
                    "w-14 h-14 rounded-xl border-2 font-bold text-lg transition-all",
                    form.questionCount === n ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/50"
                  )}
                >{n}</button>
              ))}
            </div>
            {form.questions.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Generated Questions:</p>
                {form.questions.map((q, i) => (
                  <div key={i} className="flex gap-3 p-3 bg-secondary/50 rounded-lg border border-border">
                    <span className="text-primary font-bold text-sm shrink-0">{i + 1}.</span>
                    <p className="text-sm text-foreground">{q}</p>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => { setForm((f) => ({ ...f, questions: [] })); generateQuestions(); }} loading={generatingQ}>
                  <Sparkles className="w-4 h-4" /> Regenerate
                </Button>
              </div>
            ) : (
              <Button onClick={generateQuestions} loading={generatingQ} variant="outline" className="w-full h-12">
                <Sparkles className="w-4 h-4" />
                {generatingQ ? "Generating with AI…" : "Generate Questions with AI"}
              </Button>
            )}
          </div>
        )}

        {/* Step 5: Review */}
        {step === 5 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <h2 className="text-xl font-bold text-foreground mb-1">Review & Start</h2>
              <p className="text-muted-foreground text-sm">Everything looks good?</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                ["Profile", USER_CATEGORIES.find(c => c.value === form.userCategory)?.label],
                ["Role", form.role],
                ["Track", INTERVIEW_TYPES.find(t => t.value === form.type)?.label],
                ["Level", form.level],
                ["Questions", form.questions.length],
              ].map(([label, val]) => (
                <div key={label} className="p-3 bg-secondary/50 rounded-lg border border-border">
                  <p className="text-muted-foreground text-xs mb-1">{label}</p>
                  <p className="font-medium text-foreground capitalize italic">{val}</p>
                </div>
              ))}
            </div>
            {form.techstack.length > 0 && (
              <div className="p-3 bg-secondary/50 rounded-lg border border-border">
                <p className="text-muted-foreground text-xs mb-2">Key Skills / Tools</p>
                <div className="flex flex-wrap gap-1.5">
                  {form.techstack.map((t) => (
                    <span key={t} className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded text-xs">{t}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={back} disabled={step === 0}>
          <ChevronLeft className="w-4 h-4" /> Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={next} disabled={!canNext()} loading={generatingQ}>
            {step === 4 && form.questions.length === 0 ? "Generate & Continue" : "Continue"}
            <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button onClick={handleCreate} loading={loading} size="lg" className="px-8 flex gap-2">
            🚀 Launch Interview
          </Button>
        )}
      </div>
    </div>
  );
}
