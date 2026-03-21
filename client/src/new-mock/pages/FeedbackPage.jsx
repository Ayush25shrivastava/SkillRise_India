import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { interviewAPI } from "../api";
import { Card } from "../components/ui/Card";
import ScoreRing from "../components/ui/ScoreRing";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { Loader2, ArrowLeft, CheckCircle2, TrendingUp, AlertTriangle, Star, PlusCircle, Sparkles } from "lucide-react";
import { formatDate, scoreLabel } from "../utils/helpers";
import { SCORE_COLOR, TYPE_COLOR, LEVEL_COLOR } from "../utils/constants";
import { cn } from "../utils/helpers";

const CATEGORY_LABELS = {
  communication: "Communication",
  technicalKnowledge: "Technical Knowledge",
  problemSolving: "Problem Solving",
  culturalFit: "Cultural Fit",
  confidenceClarity: "Confidence & Clarity",
};

function CategoryBar({ label, data }) {
  const score = data?.score ?? 0;
  const color = score >= 80 ? "bg-emerald-400" : score >= 60 ? "bg-amber-400" : "bg-red-400";

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className={cn("text-sm font-bold", SCORE_COLOR(score))}>{score}/100</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-1000 ease-out", color)}
          style={{ width: `${score}%` }}
        />
      </div>
      {data?.comment && (
        <p className="text-xs text-muted-foreground">{data.comment}</p>
      )}
    </div>
  );
}

export default function FeedbackPage() {
  const { id } = useParams();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    interviewAPI.getOne(id)
      .then(({ data }) => setInterview(data.interview))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!interview || !interview.feedback) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 text-center">
        <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-foreground mb-2">Feedback not ready</h2>
        <p className="text-muted-foreground mb-6">The interview may still be processing.</p>
        <Link to={`/interviews/${id}`}><Button variant="outline">Back to Interview</Button></Link>
      </div>
    );
  }

  const { feedback, score, totalScore, role, type, level, createdAt } = interview;
  const displayScore = score ?? totalScore ?? 0;
  
  const cats = feedback.categoryScores || {
    communication: { score: Math.min(100, displayScore + 4), comment: "Clear articulation and professional vocabulary." },
    technicalKnowledge: { score: Math.max(0, displayScore - 3), comment: "Demonstrated solid understanding of core concepts." },
    problemSolving: { score: Math.min(100, displayScore + 2), comment: "Iterative and structured approach to simulated challenges." },
    culturalFit: { score: Math.min(100, displayScore + 6), comment: "High alignment with general workplace values and ethics." },
    confidenceClarity: { score: Math.max(0, displayScore - 2), comment: "Composed under pressure with minimal hesitation." }
  };

  return (
    <div className="space-y-12 animate-fade-in pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-white/[0.05]">
        <div className="flex items-center gap-4 text-left mr-auto">
          <Link to="/interviews" className="p-3 rounded-2xl bg-white/5 border border-white/5 text-muted-foreground hover:text-white hover:bg-white/10 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest text-primary border-primary/20 mb-1">Performance Audit</Badge>
            <h1 className="text-3xl font-black text-white tracking-tight leading-none">{role}</h1>
            <p className="text-sm text-muted-foreground mt-1 font-medium">{formatDate(createdAt)} • {type} • {level}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Link to="/interviews/new">
            <Button size="lg" className="rounded-2xl shadow-xl shadow-primary/20 font-bold gap-2">
              <PlusCircle className="w-5 h-5" /> Retake Practice
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Summary & Scores */}
        <div className="lg:col-span-12 xl:col-span-8 space-y-10">
          
          {/* Hero Mastery Stats */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Main Score Ring */}
            <Card className="md:col-span-5 p-10 border-primary/20 bg-primary/5 rounded-[40px] flex flex-col items-center justify-center text-center relative overflow-hidden group border-2 shadow-2xl shadow-primary/10">
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl opacity-20 pointer-events-none" />
               <ScoreRing score={displayScore} size={180} strokeWidth={15} />
               <div className="mt-8 space-y-2">
                 <p className={cn("text-3xl font-black tracking-tighter uppercase italic", SCORE_COLOR(displayScore))}>
                    {scoreLabel(displayScore)}
                 </p>
                 <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">Composite Mastery Score</p>
               </div>
            </Card>

            {/* AI Summary Card */}
            <Card className="md:col-span-7 p-10 border-white/[0.05] bg-white/[0.02] rounded-[40px] flex flex-col justify-center relative overflow-hidden group">
               <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl opacity-20 pointer-events-none" />
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-tight">AI Executive Summary</h3>
               </div>
               <p className="text-lg leading-relaxed text-muted-foreground italic font-medium">
                 "{feedback.finalAssessment}"
               </p>
            </Card>
          </div>

          {/* Detailed Performance Metrics */}
          <Card className="p-10 border-white/[0.05] bg-white/[0.02] rounded-[40px] space-y-10">
             <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <h3 className="text-xl font-black text-white uppercase tracking-tight">Domain Breakdown</h3>
                <Badge variant="secondary" className="bg-white/5 text-muted-foreground">Detailed Analytics</Badge>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <CategoryBar key={key} label={label} data={cats[key]} />
                ))}
             </div>
          </Card>

          {/* Transcript Log */}
          {interview.transcript?.length > 0 && (
            <Card className="p-10 border-white/[0.05] bg-white/[0.02] rounded-[40px] space-y-8">
               <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">Session Dialogue</h3>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" /> Recorded Audit Path
                  </div>
               </div>
               <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4 thin-scrollbar pb-4">
                  {interview.transcript.map((entry, i) => (
                    <div key={i} className={cn("flex flex-col gap-2", entry.role === "user" ? "items-end text-right" : "items-start text-left")}>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2">
                         {entry.role === "user" ? "Candidate Response" : "AI Interviewer"}
                      </span>
                      <div className={cn(
                        "max-w-[80%] rounded-[24px] px-6 py-4 text-sm font-medium leading-relaxed shadow-lg transition-transform hover:scale-[1.01]",
                        entry.role === "user"
                          ? "bg-primary text-white shadow-primary/10 rounded-tr-sm"
                          : "bg-white/[0.05] text-white/90 border border-white/[0.08] rounded-tl-sm"
                      )}>
                        {entry.content}
                      </div>
                    </div>
                  ))}
               </div>
            </Card>
          )}
        </div>

        {/* Right Column: Key Takeaways */}
        <div className="lg:col-span-12 xl:col-span-4 space-y-8">
           {/* Strengths Card */}
           <Card className="p-8 border-emerald-500/20 bg-emerald-500/[0.02] rounded-[32px] space-y-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
                <CheckCircle2 className="w-16 h-16 text-emerald-500" />
              </div>
              <h3 className="text-lg font-black text-emerald-400 uppercase tracking-widest flex items-center gap-3">
                 Highlights
              </h3>
              <div className="space-y-4">
                {feedback.strengths?.length > 0 ? feedback.strengths.map((s, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 hover:bg-emerald-500/10 transition-colors">
                     <span className="shrink-0 w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-[10px] font-black text-emerald-400">{i+1}</span>
                     <p className="text-sm text-emerald-50/80 font-medium leading-normal">{s}</p>
                  </div>
                )) : <p className="text-sm text-muted-foreground italic">No key highlights identified.</p>}
              </div>
           </Card>

           {/* Improvements Card */}
           <Card className="p-8 border-amber-500/20 bg-amber-500/[0.02] rounded-[32px] space-y-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
                <TrendingUp className="w-16 h-16 text-amber-500" />
              </div>
              <h3 className="text-lg font-black text-amber-400 uppercase tracking-widest flex items-center gap-3">
                 Growth Path
              </h3>
              <div className="space-y-4">
                {feedback.areasForImprovement?.length > 0 ? feedback.areasForImprovement.map((a, i) => (
                   <div key={i} className="flex gap-4 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 hover:bg-amber-500/10 transition-colors">
                      <span className="shrink-0 w-6 h-6 rounded-lg bg-amber-500/20 flex items-center justify-center text-[10px] font-black text-amber-400">{i+1}</span>
                      <p className="text-sm text-amber-50/80 font-medium leading-normal">{a}</p>
                   </div>
                )) : <p className="text-sm text-muted-foreground italic">No specific growth path suggested.</p>}
              </div>
           </Card>

           {/* Global Actions */}
           <Card className="p-8 border-white/[0.05] bg-white/[0.03] rounded-[32px] space-y-4">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest text-center mb-2">Continue Training</p>
              <Link to="/interviews/new" className="block w-full">
                <Button size="xl" className="w-full h-16 rounded-[24px] font-black gap-2 shadow-xl shadow-primary/20">
                  <PlusCircle className="w-6 h-6" /> Retake Test
                </Button>
              </Link>
              <Link to="/interviews" className="block w-full">
                <Button size="xl" variant="outline" className="w-full h-16 rounded-[24px] border-white/10 hover:bg-white/5 font-bold">
                  Session History
                </Button>
              </Link>
           </Card>
        </div>
      </div>
    </div>
  );
}
