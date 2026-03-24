
import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileSearch,
  Compass,
  Map,
  Bot,
  Mic,
  MessageSquare,
  Sparkles,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Command,
  X
} from "lucide-react";
import { cn } from "../../services/utils";
const user = JSON.parse(localStorage.getItem("user") || "{}");
const username = user?.name || "User";

const Sidebar = ({ isCollapsed, toggleSidebar, closeMobileMenu }) => {
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Sparkles, label: "AI Recommendations", path: "/recommendations" },
    { icon: FileSearch, label: "Resume Analyzer", path: "/resume-analyzer" },
    { icon: Compass, label: "Personalized Feed", path: "/feed" },
    { icon: Map, label: "Career Roadmap", path: "/learning-roadmap" },
    { icon: Bot, label: "Agentic Chatbot", path: "/chatbot" },
    { icon: Mic, label: "Mock Interview", path: "/interviews" },
    { icon: MessageSquare, label: "Feedback", path: "/feedback" }
  ];

  return (
    <aside
      className={cn(
        "h-full bg-[#0a0a0f] border border-white/[0.06] md:rounded-[24px] flex flex-col relative transition-all duration-300",
        isCollapsed ? "w-[84px]" : "w-[260px]",
        "w-[260px] md:w-auto" // Ensure full width on mobile overlay
      )}
    >
      {/* Collapse Button - Desktop Only */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-7 bg-[#0f0f0f] border border-white/10 rounded-lg p-1.5 hover:bg-white/10 transition hidden md:block"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Close Button - Mobile Only */}
      <button
        onClick={closeMobileMenu}
        className="absolute right-4 top-4 p-2 text-white/40 hover:text-white md:hidden"
      >
        <X size={20} />
      </button>

      {/* Logo */}
      <div className="flex items-center gap-3 px-6 h-[72px] border-b border-white/[0.06]">
        <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center">
          <Command size={18} className="text-black" />
        </div>

        {(!isCollapsed || (typeof window !== 'undefined' && window.innerWidth < 768)) && (
          <span className="text-[17px] font-bold tracking-tight text-white">
            SkillRise
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 px-3 py-6 overflow-y-auto scrollbar-hide">
        {menuItems.map((item, i) => (
          <NavLink
            key={i}
            to={item.path}
            onClick={() => closeMobileMenu && closeMobileMenu()}
            className={({ isActive }) =>
              cn(
                "group flex items-center rounded-xl transition-all duration-200",
                isCollapsed
                  ? "md:justify-center md:h-11 md:w-11 md:mx-auto"
                  : "gap-4 px-4 h-11",
                "gap-4 px-4 h-11 md:gap-unset", // Force full layout on mobile
                isActive
                  ? "bg-white/10 text-white border border-white/5"
                  : "text-white/40 hover:text-white hover:bg-white/5"
              )
            }
          >
            <item.icon size={20} strokeWidth={2} className="flex-shrink-0" />

            {(!isCollapsed || (typeof window !== 'undefined' && window.innerWidth < 768)) && (
              <span className="text-[14px] font-medium tracking-wide">
                {item.label}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto flex flex-col">

        {/* Profile + Logout */}
        <div className="border-t border-white/[0.05] px-3 py-6 flex flex-col gap-3">

          {/* Profile */}
          <NavLink
            to="/profile"
            onClick={() => closeMobileMenu && closeMobileMenu()}
            className={({ isActive }) =>
              cn(
                "flex items-center rounded-xl transition-all duration-200",
                isCollapsed
                  ? "md:justify-center md:h-11 md:w-11 md:mx-auto"
                  : "gap-4 px-4 h-11",
                "gap-4 px-4 h-11",
                isActive
                  ? "bg-white/10 text-white"
                  : "text-white/40 hover:text-white hover:bg-white/5"
              )
            }
          >
            <User size={20} />
            {(!isCollapsed || (typeof window !== 'undefined' && window.innerWidth < 768)) && (
              <span className="text-[14px] font-medium">Profile</span>
            )}
          </NavLink>

          {/* Logout */}
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            className={cn(
              "flex items-center rounded-xl transition-all duration-200 text-white/40 hover:text-red-400 hover:bg-red-400/10",
              isCollapsed
                ? "md:justify-center md:h-11 md:w-11 md:mx-auto"
                : "gap-4 px-4 h-11",
              "gap-4 px-4 h-11"
            )}
          >
            <LogOut size={20} />
            {(!isCollapsed || (typeof window !== 'undefined' && window.innerWidth < 768)) && (
              <span className="text-[14px] font-medium">Logout</span>
            )}
          </button>

        </div>

        {/* Welcome User */}

      </div>
    </aside>
  );
};

export default Sidebar;