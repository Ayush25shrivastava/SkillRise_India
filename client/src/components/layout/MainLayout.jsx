import React, { useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  FileSearch,
  Briefcase,
  Map,
  PlayCircle,
  MessageSquare,
  User,
  LogOut,
  Activity,
  X,
  ArrowLeft,
  Bot
} from "lucide-react";

/* ─────────────────────────────────────────────
   Sidebar Nav Item
───────────────────────────────────────────── */
const NavItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`group relative w-full flex items-center justify-start gap-4 px-3 py-3 rounded-[14px] text-[14px] font-medium transition-all duration-300 text-left ${active
        ? "bg-white/[0.08] text-white shadow-[0_0_20px_rgba(255,255,255,0.02)] border border-white/[0.05]"
        : "text-white/40 border border-transparent hover:text-white/80 hover:bg-white/[0.03]"
      }`}
  >
    <div className={`w-9 h-9 flex-shrink-0 rounded-[10px] flex items-center justify-center transition-all duration-300 ${active ? 'bg-purple-500/20 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]' : 'bg-white/5 text-white/50 group-hover:text-white group-hover:bg-white/10'}`}>
      <Icon size={18} strokeWidth={active ? 2.5 : 2} />
    </div>
    <span className="relative z-10 flex-1 tracking-wide">{label}</span>
    {active && (
      <div className="absolute left-0 w-1 h-[50%] top-1/2 -translate-y-1/2 rounded-r-full bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
    )}
  </button>
);

/* ─────────────────────────────────────────────
   Recent Item
───────────────────────────────────────────── */
const RecentItem = ({ title, subtitle }) => (
  <div className="group px-4 py-4 rounded-xl border border-transparent hover:border-white/[0.05] hover:bg-white/[0.02] cursor-pointer transition-all duration-200 text-left flex flex-col gap-1.5 w-full">
    <p className="text-[14px] font-medium text-white/60 group-hover:text-white/90 transition-colors truncate">
      {title}
    </p>
    <p className="text-[12px] font-bold tracking-widest uppercase text-white/30 truncate">{subtitle}</p>
  </div>
);

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { label: "Resume Analyzer", icon: FileSearch, path: "/resume-analyzer" },
    { label: "Job Recommendations", icon: Briefcase, path: "/jobs" },
    { label: "Career Roadmap", icon: Map, path: "/learning-roadmap" },
    { label: "Agentic Chatbot", icon: Bot, path: "/chatbot" },
    { label: "Mock Interview", icon: PlayCircle, path: "/mock-interview" },
    { label: "Feedback", icon: MessageSquare, path: "/feedback" },
  ];

  const recent = [
    { title: "Skills Analysis for ML", tag: "today" },
    { title: "Resume Feedback", tag: "today" },
    { title: "Data Science Track", tag: "month" },
    { title: "Interview Prep", tag: "month" },
  ];

  const activeRouteName =
    navItems.find((item) => item.path === location.pathname)?.label ||
    "Dashboard";

  return (
    <div className={`grid ${isRightSidebarOpen ? 'grid-cols-[240px_1fr_300px]' : 'grid-cols-[240px_1fr]'} gap-6 p-4 md:p-6 h-screen w-screen bg-[#06060a] overflow-hidden text-white font-sans transition-all duration-500`}>
      {/* ══════ LEFT SIDEBAR ══════ */}
      <aside className="flex flex-col h-full border border-white/[0.06] bg-[#0a0a0f] rounded-[24px] transition-all duration-300 overflow-hidden">
        <div className="flex items-center justify-start gap-3 px-8 h-[90px] border-b border-white/[0.06] flex-shrink-0">
          <div className="w-10 h-10 rounded-[12px] overflow-hidden flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/10 border border-white/10">
            <img src="/favicon.png" alt="SkillRise Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-[15px] font-bold text-white/90 tracking-tight">
            SkillRise
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto px-5 py-8 flex flex-col gap-2 scrollbar-hide">
          {navItems.map((item) => (
            <NavItem
              key={item.path}
              {...item}
              active={location.pathname === item.path || (location.pathname === "/" && item.path === "/dashboard")}
              onClick={() => navigate(item.path)}
            />
          ))}
        </nav>

        <div className="px-5 py-6 border-t border-white/[0.06] flex flex-col gap-2 flex-shrink-0">
          <NavItem
            icon={User}
            label="Profile"
            active={location.pathname === "/profile"}
            onClick={() => navigate("/profile")}
          />
          <NavItem
            icon={LogOut}
            label="Logout"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
          />
        </div>
      </aside>

      {/* ══════ CENTER ══════ */}
      <main className="w-full h-full flex flex-col overflow-hidden bg-[#0a0a0f] border border-white/[0.06] rounded-[24px]">
        <div className="flex items-center justify-between px-8 h-[72px] border-b border-white/[0.06] bg-transparent flex-shrink-0">
          <div className="flex items-center gap-4">
            {location.pathname !== "/dashboard" && location.pathname !== "/" && (
              <button 
                onClick={() => navigate(-1)}
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all active:scale-90"
                title="Go Back"
              >
                <ArrowLeft size={16} />
              </button>
            )}
            <span className="text-[14px] font-bold tracking-wide uppercase text-white/50">
              {activeRouteName}
            </span>
          </div>
          <div className="flex items-center gap-6 pr-4">
            <button
              onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)} 
              className={`flex items-center gap-3 px-5 py-2.5 rounded-xl border transition-all duration-300 shadow-sm ${isRightSidebarOpen ? 'bg-white/15 border-white/20 text-white shadow-white/5' : 'bg-white/5 border-white/5 text-white/60 hover:text-white hover:bg-white/10 hover:border-white/10 hover:shadow-white/5'}`}
            >
              <Activity size={18} strokeWidth={2.5} className={isRightSidebarOpen ? "text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" : "text-white/60 group-hover:text-white"} />
              <span className="text-[12px] uppercase tracking-[0.15em] font-bold">Activity Log</span>
            </button>
            <div className="w-11 h-11 py-1 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 border border-white/20 flex items-center justify-center shadow-lg shadow-purple-500/30 cursor-pointer hover:scale-105 transition-transform">
              <span className="text-[15px] font-black text-white drop-shadow-md">D</span>
            </div>
          </div>
        </div>

        <div className="w-full h-full overflow-y-auto pt-8 pb-10 scrollbar-hide">
          <Outlet />
        </div>
      </main>

      {/* ══════ RIGHT SIDEBAR ══════ */}
      {isRightSidebarOpen && (
        <aside className="w-[320px] flex flex-col h-full border border-white/[0.06] bg-[#0a0a0f] rounded-[24px] overflow-hidden animate-in slide-in-from-right-8 fade-in flex-shrink-0 duration-500">
          <div className="flex items-center justify-between px-6 h-[72px] border-b border-white/[0.06] flex-shrink-0">
            <p className="text-[14px] font-bold tracking-[0.3em] uppercase text-white/40">
              Activity
            </p>
            <button onClick={() => setIsRightSidebarOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all">
              <X size={16} />
            </button>
          </div>

        <div className="flex-1 overflow-y-auto px-4 py-8 space-y-6 scrollbar-hide text-left">
          <div className="mb-6">
            <p className="text-[12px] font-bold text-white/50 uppercase tracking-[0.2em] px-4 pt-2 pb-4">
              Today
            </p>
            <div className="space-y-3">
              {recent
                .filter((i) => i.tag === "today")
                .map((item, idx) => (
                  <RecentItem key={idx} title={item.title} subtitle="Today" />
                ))}
            </div>
          </div>

          <div className="mt-8">
            <p className="text-[12px] font-bold text-white/50 uppercase tracking-[0.2em] px-4 pt-8 pb-4">
              Previous Month
            </p>
            <div className="space-y-3">
              {recent
                .filter((i) => i.tag === "month")
                .map((item, idx) => (
                  <RecentItem
                    key={idx}
                    title={item.title}
                    subtitle="Previous month"
                  />
                ))}
            </div>
          </div>
        </div>

        {/* Readiness */}
        <div className="px-6 py-10 border-t border-white/[0.06] space-y-8 flex-shrink-0 text-left">
          <p className="text-[12px] font-bold text-white/50 uppercase tracking-[0.2em]">
            Readiness
          </p>

          <div className="space-y-5 flex flex-col items-start pb-2 w-full mt-6">
            <div className="flex items-center justify-between w-full">
              <span className="text-[14px] text-white/70 font-medium">Core Skills</span>
              <span className="text-[14px] text-indigo-400 font-bold">58%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/[0.06]">
              <div className="h-full w-[58%] rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 shadow-[0_0_12px_rgba(99,102,241,0.5)]" />
            </div>
          </div>
        </div>
      </aside>
      )}
    </div>
  );
};

export default MainLayout;
