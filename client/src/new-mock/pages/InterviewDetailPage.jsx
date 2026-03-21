import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { interviewAPI } from "../api";
import VoiceAgent from "../components/VoiceAgent";
import { Card } from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { useToast } from "../components/ui/Toast";
import { Loader2, ArrowLeft, Trash2, CheckCircle2, Clock, Code2 } from "lucide-react";
import { formatDate, formatDuration } from "../utils/helpers";
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
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      {/* Back + actions */}
      <div className="flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </Link>
        <div className="flex items-center gap-2">
          {isCompleted && (
            <Link to={`/interviews/${id}/feedback`}>
              <Button variant="outline" size="sm">
                <CheckCircle2 className="w-4 h-4" /> View Feedback
              </Button>
            </Link>
          )}
          <Button variant="ghost" size="icon" onClick={handleDelete} loading={deleting} className="text-destructive hover:bg-destructive/10">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Interview info */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{interview.role}</h1>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className={`text-xs px-2.5 py-1 rounded-md border font-medium capitalize ${TYPE_COLOR[interview.type]}`}>
                {interview.type}
              </span>
              <span className={`text-xs px-2.5 py-1 rounded-md border font-medium capitalize ${LEVEL_COLOR[interview.level]}`}>
                {interview.level}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                {formatDate(interview.createdAt)}
              </span>
              {interview.duration > 0 && (
                <span className="text-xs text-muted-foreground">
                  Duration: {formatDuration(interview.duration)}
                </span>
              )}
            </div>

            {interview.techstack?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {interview.techstack.map((t) => (
                  <span key={t} className="flex items-center gap-1 text-xs bg-secondary border border-border text-muted-foreground px-2 py-0.5 rounded">
                    <Code2 className="w-3 h-3" /> {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {isCompleted && interview.totalScore !== null && (
            <div className="text-right shrink-0">
              <div className="text-4xl font-bold text-primary">{interview.totalScore}</div>
              <div className="text-sm text-muted-foreground">out of 100</div>
            </div>
          )}
        </div>
      </Card>

      {/* Questions */}
      {interview.questions?.length > 0 && !isCompleted && (
        <Card>
          <h2 className="font-semibold text-foreground mb-4">Interview Questions</h2>
          <ol className="space-y-3">
            {interview.questions.map((q, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="text-primary font-bold shrink-0">{i + 1}.</span>
                <span className="text-foreground/80">{q}</span>
              </li>
            ))}
          </ol>
        </Card>
      )}

      {/* Voice Agent or Completed state */}
      {!isCompleted ? (
        <Card>
          <h2 className="font-semibold text-foreground mb-6 text-center">
            {interview.status === "in-progress" ? "Resume Your Interview" : "Start Your Interview"}
          </h2>
          <VoiceAgent
            interview={interview}
            onFinished={() => navigate(`/interviews/${id}/feedback`)}
          />
        </Card>
      ) : (
        <Card className="text-center py-8">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Interview Completed!</h2>
          <p className="text-muted-foreground mb-6">Your AI feedback report is ready.</p>
          <Link to={`/interviews/${id}/feedback`}>
            <Button size="lg">View Full Feedback Report</Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
