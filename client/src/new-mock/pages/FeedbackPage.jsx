import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { interviewAPI } from "../api";
import { Card } from "../components/ui/Card";
import ScoreRing from "../components/ui/ScoreRing";
import Button from "../components/ui/Button";
import { Loader2, ArrowLeft, CheckCircle2, TrendingUp, AlertTriangle, Star, PlusCircle } from "lucide-react";
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

  const { feedback, totalScore, role, type, level, createdAt } = interview;
  const cats = feedback.categoryScores || {};

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8 animate-fade-in">
      {/* Back */}
      <div className="flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </Link>
        <Link to="/interviews/new">
          <Button size="sm">
            <PlusCircle className="w-4 h-4" /> New Interview
          </Button>
        </Link>
      </div>

      {/* Hero score card */}
      <Card className="text-center border border-primary/20 glow-primary">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
          <ScoreRing score={totalScore} size={140} strokeWidth={12} />
          <div className="text-left">
            <h1 className="text-2xl font-bold text-foreground">{role}</h1>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className={`text-xs px-2.5 py-1 rounded-md border font-medium capitalize ${TYPE_COLOR[type]}`}>{type}</span>
              <span className={`text-xs px-2.5 py-1 rounded-md border font-medium capitalize ${LEVEL_COLOR[level]}`}>{level}</span>
            </div>
            <p className="text-muted-foreground text-sm mt-2">{formatDate(createdAt)}</p>
            <p className={cn("text-xl font-bold mt-3", SCORE_COLOR(totalScore))}>
              {scoreLabel(totalScore)}
            </p>
          </div>
        </div>

        {feedback.finalAssessment && (
          <div className="mt-6 pt-6 border-t border-border text-left">
            <p className="text-sm text-muted-foreground leading-relaxed">{feedback.finalAssessment}</p>
          </div>
        )}
      </Card>

      {/* Category scores */}
      <Card>
        <h2 className="font-bold text-foreground text-lg mb-6">Performance Breakdown</h2>
        <div className="space-y-6">
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <CategoryBar key={key} label={label} data={cats[key]} />
          ))}
        </div>
      </Card>

      {/* Strengths & improvements */}
      <div className="grid sm:grid-cols-2 gap-6">
        {/* Strengths */}
        <Card className="border-emerald-500/20">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="font-semibold text-foreground">Strengths</h3>
          </div>
          <ul className="space-y-2.5">
            {feedback.strengths?.length > 0
              ? feedback.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                    <Star className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    {s}
                  </li>
                ))
              : <p className="text-sm text-muted-foreground">No specific strengths noted.</p>
            }
          </ul>
        </Card>

        {/* Areas to improve */}
        <Card className="border-amber-500/20">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-amber-400" />
            </div>
            <h3 className="font-semibold text-foreground">Areas to Improve</h3>
          </div>
          <ul className="space-y-2.5">
            {feedback.areasForImprovement?.length > 0
              ? feedback.areasForImprovement.map((a, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                    <TrendingUp className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    {a}
                  </li>
                ))
              : <p className="text-sm text-muted-foreground">No specific areas noted.</p>
            }
          </ul>
        </Card>
      </div>

      {/* Transcript */}
      {interview.transcript?.length > 0 && (
        <Card>
          <h2 className="font-bold text-foreground text-lg mb-4">Interview Transcript</h2>
          <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {interview.transcript.map((entry, i) => (
              <div key={i} className={cn("flex gap-2", entry.role === "user" ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[85%] rounded-xl px-4 py-3 text-sm",
                  entry.role === "user"
                    ? "bg-primary/10 text-primary border border-primary/20 rounded-br-none"
                    : "bg-secondary text-foreground border border-border rounded-bl-none"
                )}>
                  <p className="text-xs font-semibold mb-1 opacity-60">
                    {entry.role === "user" ? "You" : "Interviewer"}
                  </p>
                  {entry.content}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/interviews/new" className="flex-1">
          <Button size="lg" className="w-full">
            <PlusCircle className="w-5 h-5" /> Practice Again
          </Button>
        </Link>
        <Link to="/dashboard" className="flex-1">
          <Button size="lg" variant="outline" className="w-full">
            View All Interviews
          </Button>
        </Link>
      </div>
    </div>
  );
}
