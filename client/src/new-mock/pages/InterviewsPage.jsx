import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { interviewAPI } from "../api";
import InterviewCard from "../components/InterviewCard";
import Button from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Loader2, PlusCircle, Search, Filter } from "lucide-react";
import { cn } from "../utils/helpers";

const STATUS_FILTERS = ["all", "pending", "in-progress", "completed"];
const TYPE_FILTERS = ["all", "technical", "behavioral", "mixed"];

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 10 };
    if (statusFilter !== "all") params.status = statusFilter;
    if (typeFilter !== "all") params.type = typeFilter;

    interviewAPI.getAll(params)
      .then(({ data }) => {
        setInterviews(data.interviews);
        setPagination(data.pagination);
      })
      .finally(() => setLoading(false));
  }, [page, statusFilter, typeFilter]);

  const FilterBtn = ({ label, value, current, onChange }) => (
    <button
      onClick={() => { onChange(value); setPage(1); }}
      className={cn(
        "px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all border",
        current === value
          ? "bg-primary/10 border-primary text-primary"
          : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
      )}
    >
      {label}
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">All Interviews</h1>
          <p className="text-muted-foreground mt-1">{pagination.total ?? 0} total sessions</p>
        </div>
        <Link to="/interviews/new">
          <Button size="lg">
            <PlusCircle className="w-5 h-5" /> New Interview
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Status:
          </span>
          {STATUS_FILTERS.map((s) => (
            <FilterBtn key={s} label={s === "all" ? "All" : s} value={s} current={statusFilter} onChange={setStatusFilter} />
          ))}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">Type:</span>
          {TYPE_FILTERS.map((t) => (
            <FilterBtn key={t} label={t === "all" ? "All" : t} value={t} current={typeFilter} onChange={setTypeFilter} />
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : interviews.length === 0 ? (
        <Card className="text-center py-16">
          <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-foreground text-lg mb-2">No interviews found</h3>
          <p className="text-muted-foreground mb-6">Try a different filter or start a new interview.</p>
          <Link to="/interviews/new"><Button>Start New Interview</Button></Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {interviews.map((iv) => (
            <InterviewCard key={iv._id} interview={iv} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {pagination.pages}
          </span>
          <Button variant="outline" size="sm" disabled={page >= pagination.pages} onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
