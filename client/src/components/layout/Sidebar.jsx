import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Plus,
  Send,
  Mic,
  Bot,
  Search,
  Command,
  PlusCircle,
  MoreHorizontal,
  LayoutDashboard,
  FileSearch,
  Briefcase,
  Map,
  MessageSquare,
  ClipboardList,
  User,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { cn } from '../../services/utils';

const Sidebar = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: FileSearch, label: 'Resume Analyzer', path: '/resume-analyzer' },
    { icon: Briefcase, label: 'Job Recommendations', path: '/jobs' },
    { icon: Map, label: 'Career Roadmap', path: '/learning-roadmap' },
    { icon: Bot, label: 'Agentic Chatbot', path: '/chatbot' },
    { icon: Mic, label: 'Mock Interview', path: '/mock-interview' },
    { icon: MessageSquare, label: 'Feedback', path: '/feedback' },
  ];

  const historyGroups = [
    {
      title: 'Today',
      items: [
        'Skills Analysis for ML',
        'Resume Feedback'
      ]
    },
    {
      title: 'Previous Month',
      items: [
        'Data Science Track',
        'Interview Prep'
      ]
    }
  ];

  return (
    <aside className="w-72 h-[calc(100vh-2.5rem)] my-5 ml-5 rounded-[2rem] bg-[#0f0f0f]/50 backdrop-blur-2xl border border-white/10 p-7 flex flex-col gap-8 sticky top-5 z-20">
      {/* Brand */}
      <div className="flex items-center gap-3 px-2">
        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
          <Command size={18} className="text-black" />
        </div>
        <span className="text-lg font-bold tracking-tight">SkillRise</span>
      </div>

      {/* Search */}
      <div className="relative group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none transition-colors group-focus-within:text-white">
          <Search size={14} />
        </div>
        <input
          type="text"
          placeholder="Search chats"
          className="w-full h-9 bg-white/5 border border-white/5 rounded-lg pl-9 pr-8 text-xs outline-none focus:border-white/10 transition-all placeholder:text-white/20"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] text-muted/50 uppercase font-bold tracking-widest px-1 py-0.5 bg-white/5 rounded border border-white/5">
          <Command size={8} /> K
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        {menuItems.map((item, i) => (
          <NavLink
            key={i}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-4 px-4 py-3 rounded-xl text-sm transition-all",
              isActive
                ? "bg-white/10 text-white font-medium shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] border border-white/5"
                : "text-white/40 hover:text-white hover:bg-white/5"
            )}
          >
            <item.icon size={18} strokeWidth={2} className="flex-shrink-0" />
            <span className="leading-none mt-0.5">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Divider */}
      <div className="h-px bg-white/5 mx-2" />

      {/* History Sections */}
      <div className="flex-1 overflow-y-auto space-y-8 scrollbar-hide pt-2">
        {historyGroups.map((group, i) => (
          <div key={i} className="space-y-4">
            <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em] px-4">{group.title}</h4>
            <div className="flex flex-col gap-2">
              {group.items.map((text, j) => (
                <button key={j} className="text-left px-4 py-2.5 text-xs text-white/50 hover:text-white transition-all truncate rounded-xl hover:bg-white/5 flex items-center gap-4">
                  <span className="leading-none mt-0.5">{text}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* User Section (Bottom) */}
      <div className="mt-auto pt-6 border-t border-white/5">
        <div className="space-y-2">
          <NavLink
            to="/profile"
            className={({ isActive }) => cn(
              "flex items-center gap-4 px-4 py-3 rounded-xl text-sm transition-all",
              isActive
                ? "bg-white/10 text-white font-medium"
                : "text-white/40 hover:text-white hover:bg-white/5"
            )}
          >
            <User size={18} className="flex-shrink-0" />
            <span className="leading-none mt-0.5">Profile</span>
          </NavLink>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm transition-all text-white/40 hover:text-red-400 hover:bg-red-400/5 group"
          >
            <LogOut size={18} className="group-hover:text-red-400 flex-shrink-0" />
            <span className="leading-none mt-0.5">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
