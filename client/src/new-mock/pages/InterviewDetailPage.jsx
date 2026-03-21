import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { interviewAPI } from "../api";
import VoiceAgent from "../components/VoiceAgent";
import { Card } from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { useToast } from "../components/ui/Toast";
import { Loader2, ArrowLeft, Trash2, CheckCircle2, Clock, Code2 } from "lucide-react";
import { formatDate, formatDuration, cn } from "../utils/helpers";
import { TYPE_COLOR, LEVEL_COLOR } from "../utils/constants";

export default function InterviewDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    interviewAPI.getOne(id)
      .then(({ data }) => setInterview(data.interview))
      .catch(() => toast({ title: "Interview not found", type: "error" }))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this interview?")) return;
    setDeleting(true);
    try {
      await interviewAPI.delete(id);
      toast({ title: "Interview deleted", type: "success" });
      navigate("/dashboard");
    } catch {
      toast({ title: "Failed to delete", type: "error" });
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 text-center">
        <p className="text-muted-foreground">Interview not found.</p>
        <Link to="/dashboard"><Button className="mt-4">Back to Dashboard</Button></Link>
      </div>
    );
  }

  const isCompleted = interview.status === "completed";

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      {/* Top Navigation & Status */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-white/[0.05]">
        <div className="flex items-center gap-4">
          <Link to="/interviews" className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-muted-foreground hover:text-white hover:bg-white/10 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
               <Badge variant="outline" className={cn("text-[10px] uppercase font-bold tracking-widest", isCompleted ? "text-emerald-400 border-emerald-500/20" : "text-amber-400 border-amber-500/20")}>
                {isCompleted ? "Session Finalized" : "Interview Active"}
              </Badge>
            </div>
            <h1 className="text-3xl font-black text-foreground tracking-tight">{interview.role}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isCompleted && (
            <Link to={`/interviews/${id}/feedback`}>
              <Button size="lg" className="rounded-2xl shadow-lg shadow-primary/20 bg-primary hover:scale-105 transition-transform font-bold gap-2">
                <CheckCircle2 className="w-5 h-5" /> Performance Report
              </Button>
            </Link>
          )}
          <Button variant="ghost" size="icon" onClick={handleDelete} loading={deleting} className="w-12 h-12 rounded-xl text-destructive hover:bg-destructive/10">
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Voice Agent Interaction Layer */}
          {!isCompleted ? (
            <Card className="p-10 border-white/[0.05] bg-card/60 backdrop-blur-3xl rounded-[32px] shadow-2xl relative overflow-hidden group">
              <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/30 to-indigo-500/20 rounded-[32px] blur-2xl opacity-10 group-hover:opacity-20 transition duration-1000 -z-10" />
              
              <div className="relative text-center space-y-8">
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-white">Interact with AI Agent</h2>
                  <p className="text-muted-foreground text-sm max-w-xs mx-auto">Click below to start your real-time voice interview session.</p>
                </div>

                <VoiceAgent
                  interview={interview}
                  onFinished={() => navigate(`/interviews/${id}/feedback`)}
                />
              </div>
            </Card>
          ) : (
            <Card className="p-12 text-center space-y-8 border-white/[0.05] bg-emerald-500/[0.02] border-emerald-500/10 rounded-[32px]">
              <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto text-4xl shadow-2xl shadow-emerald-500/20 animate-in zoom-in duration-500">
                🚀
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl font-black text-white">Interview Concluded!</h2>
                <p className="text-muted-foreground max-w-sm mx-auto">Excellent work! Our AI has analyzed your performance across multiple dimensions.</p>
              </div>
              <div className="flex justify-center gap-4">
                 <Link to={`/interviews/${id}/feedback`}>
                  <Button size="xl" className="rounded-2xl px-10 font-black tracking-widest uppercase">Analysis Report</Button>
                </Link>
              </div>
            </Card>
          )}

          {/* Scenario Overview */}
          <Card className="p-8 border-white/[0.05] bg-white/[0.02] rounded-[24px]">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Code2 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Interview Parameters</h3>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Session Type", val: interview.type },
                  { label: "Target Level", val: interview.level },
                  { label: "Date Created", val: formatDate(interview.createdAt) },
                  { label: "Duration", val: interview.duration > 0 ? formatDuration(interview.duration) : "N/A" },
                ].map((item) => (
                  <div key={item.label} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.02]">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{item.label}</p>
                    <p className="text-white font-medium capitalize">{item.val}</p>
                  </div>
                ))}
             </div>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
           {/* Detailed Profile */}
           <Card className="p-6 border-white/[0.05] bg-white/[0.03] rounded-[24px]">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest border-b border-white/5 pb-4 mb-4">Focused Domain</h3>
              <div className="flex flex-wrap gap-2">
                {interview.techstack?.length > 0 ? interview.techstack.map((t) => (
                  <Badge key={t} variant="secondary" className="px-3 py-1.5 rounded-xl bg-white/5 text-muted-foreground border-white/5 text-xs font-bold uppercase">
                    {t}
                  </Badge>
                )) : <p className="text-xs text-muted-foreground italic">No specific skills listed.</p>}
              </div>
           </Card>

           {/* Session Questions */}
           <Card className="p-6 border-white/[0.05] bg-white/[0.03] rounded-[24px]">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest border-b border-white/5 pb-4 mb-4 flex items-center justify-between">
                <span>Inquiry Scope</span>
                <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full">{interview.questions?.length} q</span>
              </h3>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 thin-scrollbar">
                {interview.questions?.map((q, i) => (
                  <div key={i} className="space-y-2 group/q">
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-black text-primary/50 group-hover/q:text-primary transition-colors">0{i+1}</span>
                       <div className="h-px flex-1 bg-white/5" />
                    </div>
                    {isCompleted ? (
                      <p className="text-xs leading-relaxed text-muted-foreground group-hover/q:text-white/90 transition-colors italic">{q}</p>
                    ) : (
                      <div className="space-y-2 opacity-30 pointer-events-none mt-1">
                        <div className="h-2 bg-white/30 rounded-full w-full"></div>
                        <div className="h-2 bg-white/20 rounded-full w-2/3"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
           </Card>

           {/* Performance Card (if completed) */}
           {isCompleted && interview.totalScore !== null && (
              <Card className="p-8 border-primary/20 bg-primary/5 rounded-[24px] text-center border-2 glow-primary">
                 <p className="text-xs font-black text-primary uppercase tracking-widest mb-4">Mastery Score</p>
                 <div className="text-6xl font-black text-white mb-2 tracking-tighter">{interview.totalScore}</div>
                 <Badge className="bg-primary text-white text-[10px] px-3 py-1 uppercase font-black">
                   {interview.totalScore >= 80 ? "Superior" : interview.totalScore >= 60 ? "Proficient" : "Developing"}
                 </Badge>
              </Card>
           )}
        </div>
      </div>
    </div>
  );
}
