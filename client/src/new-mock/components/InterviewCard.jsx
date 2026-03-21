import { Link } from "react-router-dom";
import { Card } from "./ui/Card";
import Badge from "./ui/Badge";
import { formatDate, scoreLabel } from "../utils/helpers";
import { SCORE_COLOR, TYPE_COLOR, LEVEL_COLOR } from "../utils/constants";
import { Clock, ChevronRight, CheckCircle2, Circle, PlayCircle } from "lucide-react";

export default function InterviewCard({ interview }) {
  const { _id, role, type, level, techstack, status, totalScore, createdAt } = interview;

  const statusIcon = {
    completed: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
    "in-progress": <PlayCircle className="w-4 h-4 text-amber-400" />,
    pending: <Circle className="w-4 h-4 text-muted-foreground" />,
  };

  return (
    <Link to={`/interviews/${_id}`}>
      <Card hover className="group">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className={`text-xs px-2.5 py-0.5 rounded-md border font-medium capitalize ${TYPE_COLOR[type]}`}>
                {type}
              </span>
              <span className={`text-xs px-2.5 py-0.5 rounded-md border font-medium capitalize ${LEVEL_COLOR[level]}`}>
                {level}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                {statusIcon[status]}
                <span className="capitalize">{status.replace("-", " ")}</span>
              </span>
            </div>

            <h3 className="font-semibold text-foreground text-base truncate group-hover:text-primary transition-colors">
              {role}
            </h3>

            {techstack?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {techstack.slice(0, 4).map((tech) => (
                  <span key={tech} className="text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded">
                    {tech}
                  </span>
                ))}
                {techstack.length > 4 && (
                  <span className="text-xs text-muted-foreground">+{techstack.length - 4}</span>
                )}
              </div>
            )}

            <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              {formatDate(createdAt)}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {totalScore !== null && totalScore !== undefined && (
              <div className="text-right">
                <div className={`text-2xl font-bold ${SCORE_COLOR(totalScore)}`}>
                  {totalScore}
                </div>
                <div className="text-xs text-muted-foreground">{scoreLabel(totalScore)}</div>
              </div>
            )}
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </Card>
    </Link>
  );
}
