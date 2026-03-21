import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { interviewAPI } from "../api";
import InterviewCard from "../components/InterviewCard";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { Loader2, PlusCircle, Search, Clock, CheckCircle2, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../utils/helpers";

const STATUS_FILTERS = ["all", "pending", "in-progress", "completed"];
const TYPE_FILTERS = ["all", "technical", "behavioral", "mixed"];

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, pages: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const params = { page: currentPage, limit: 10 };
    if (statusFilter !== "all") params.status = statusFilter;
    if (typeFilter !== "all") params.type = typeFilter;

    interviewAPI.getAll(params)
      .then(({ data }) => {
        if (!isMounted) return;
        setInterviews(data?.interviews || []);
        setPagination(data?.pagination || { total: 0, pages: 0 });
      })
      .catch((err) => {
        console.error("Failed to load interviews:", err);
        if (!isMounted) return;
        setInterviews([]);
        setPagination({ total: 0, pages: 0 });
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [currentPage, statusFilter, typeFilter]);

  const FilterBtn = ({ label, value, current, onChange }) => (
    <button
      onClick={() => { onChange(value); setCurrentPage(1); }}
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
    <div className="space-y-10 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 px-3 py-1">
            Career Growth
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
            Mock Interviews
          </h1>
          <p className="text-muted-foreground text-lg max-w-lg">
            Practice with our AI-powered interviewers and get instant feedback to sharpen your skills.
          </p>
        </div>
        <Link to="/interviews/new">
          <Button size="xl" className="rounded-2xl shadow-lg shadow-primary/20 transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 group">
            <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            Start New Session
          </Button>
        </Link>
      </div>

      {/* Stats Quick Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Sessions", value: pagination?.total || 0, icon: Clock, color: "text-blue-400" },
          { label: "Completion Rate", value: "85%", icon: CheckCircle2, color: "text-emerald-400" },
          { label: "Avg. Score", value: "72/100", icon: Sparkles, color: "text-amber-400" },
        ].map((stat, i) => (
          <Card key={i} className="flex items-center gap-4 p-5 bg-card/40 border-white/[0.03]">
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5", stat.color)}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters & Content Area */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 bg-secondary/20 rounded-2xl border border-white/[0.05]">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar w-full sm:w-auto p-1">
            {STATUS_FILTERS.map((s) => (
              <FilterBtn key={s} label={s === "all" ? "All Sessions" : s} value={s} current={statusFilter} onChange={setStatusFilter} />
            ))}
          </div>
          <div className="h-6 w-px bg-white/10 hidden sm:block" />
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar w-full sm:w-auto p-1">
            {TYPE_FILTERS.map((t) => (
              <FilterBtn key={t} label={t === "all" ? "All Types" : t} value={t} current={typeFilter} onChange={setTypeFilter} />
            ))}
          </div>
        </div>

        {/* List Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-b-primary/40 rounded-full animate-reverse-spin" />
            </div>
            <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading your sessions...</p>
          </div>
        ) : (interviews?.length === 0) ? (
          <Card className="text-center py-20 flex flex-col items-center border-dashed border-2 bg-transparent">
            <div className="w-20 h-20 rounded-full bg-secondary/30 flex items-center justify-center mb-6">
              <Search className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">No interviews yet</h3>
            <p className="text-muted-foreground max-w-sm mb-8">
              You haven't recorded any mock interviews yet. Start your first session to receive AI-powered feedback.
            </p>
            <Link to="/interviews/new">
              <Button size="lg" className="rounded-xl">Start Your First Interview</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {interviews?.map((iv) => (
              <InterviewCard key={iv._id} interview={iv} />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {(pagination?.pages > 1) && (
          <div className="flex items-center justify-center gap-6 pt-6">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={currentPage <= 1} 
              onClick={() => setCurrentPage((p) => p - 1)}
              className="rounded-xl border-white/10 hover:bg-white/5"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Previous
            </Button>
            <div className="flex items-center gap-2">
              {[...Array(pagination?.pages || 0)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={cn(
                    "w-8 h-8 rounded-lg text-xs font-bold transition-all",
                    currentPage === i + 1 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                      : "text-muted-foreground hover:bg-white/5"
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              disabled={currentPage >= pagination.pages} 
              onClick={() => setCurrentPage((p) => p + 1)}
              className="rounded-xl border-white/10 hover:bg-white/5"
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
