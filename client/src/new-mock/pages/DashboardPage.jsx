import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { interviewAPI } from "../api";
import InterviewCard from "../components/InterviewCard";
import { Card } from "../components/ui/Card";
import Button from "../components/ui/Button";
import { Loader2, PlusCircle, TrendingUp, Target, Award, BarChart3, ChevronRight } from "lucide-react";

function StatCard({ label, value, icon: Icon, color = "text-primary", sub }) {
  return (
    <Card hover className="flex items-center gap-4 transition-transform duration-300 hover:scale-105">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-current/10 shrink-0 ${color} group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
        {sub && <p className="text-xs text-muted-foreground/70 mt-0.5">{sub}</p>}
      </div>
    </Card>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [ivRes, stRes] = await Promise.all([
          interviewAPI.getAll({ limit: 6 }),
          interviewAPI.getStats(),
        ]);
        setInterviews(ivRes.data.interviews);
        setStats(stRes.data.stats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-muted-foreground text-sm">{greeting},</p>
          <h1 className="text-3xl font-bold text-foreground">{user?.name} 👋</h1>
          <p className="text-muted-foreground mt-1">
            {stats?.completedInterviews > 0
              ? `You've completed ${stats.completedInterviews} interview${stats.completedInterviews !== 1 ? "s" : ""}. Keep it up!`
              : "Start your first interview and begin improving!"}
          </p>
        </div>
        <Link to="/interviews/new">
          <Button size="lg" className="gap-2 shrink-0">
            <PlusCircle className="w-5 h-5" />
            New Interview
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Interviews" value={stats?.totalInterviews ?? 0} icon={Target} color="text-blue-400" />
        <StatCard label="Completed" value={stats?.completedInterviews ?? 0} icon={Award} color="text-emerald-400" />
        <StatCard label="Average Score" value={user?.averageScore ? `${user.averageScore}%` : "—"} icon={TrendingUp} color="text-purple-400" />
        <StatCard
          label="By Type"
          value={stats?.byType?.length ?? 0}
          icon={BarChart3}
          color="text-amber-400"
          sub={stats?.byType?.map((t) => `${t._id}: ${t.count}`).join(" · ") || "No data yet"}
        />
      </div>

      {/* Recent interviews */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold text-foreground">Recent Interviews</h2>
          <Link to="/interviews" className="flex items-center gap-1 text-sm text-primary hover:underline">
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {interviews.length === 0 ? (
          <Card className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground text-lg mb-2">No interviews yet</h3>
            <p className="text-muted-foreground mb-6">Practice makes perfect. Start your first mock interview now!</p>
            <Link to="/interviews/new">
              <Button>Start Your First Interview</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {interviews.map((iv) => (
              <InterviewCard key={iv._id} interview={iv} />
            ))}
          </div>
        )}
      </div>

      {/* CTA banner */}
      {interviews.length > 0 && (
        <div className="glass rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border border-primary/20 glow-primary hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all duration-500 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-foreground">Ready for another round?</h3>
            <p className="text-muted-foreground mt-1">Consistent practice is the key to interview success.</p>
          </div>
          <Link to="/interviews/new">
            <Button size="lg" className="shrink-0 relative z-10">
              <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" /> New Interview
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
