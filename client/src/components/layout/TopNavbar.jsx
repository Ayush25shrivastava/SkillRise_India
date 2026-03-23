import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  User, 
  ChevronDown, 
  LayoutDashboard, 
  Bot, 
  Sparkles,
  Command,
  Menu,
  X
} from 'lucide-react';
import { cn } from '../../services/utils';

const TopNavbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Mock Interview', path: '/interviews/new', icon: Bot },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <nav className="h-16 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50 flex items-center justify-between px-4 md:px-8">
      {/* Left: Logo */}
      <div className="flex items-center gap-8">
        <NavLink to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-transform">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent hidden sm:block">
            SkillRise AI
          </span>
        </NavLink>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-1 border-l border-white/10 pl-8 ml-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) => cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2",
                isActive 
                  ? "bg-white/5 text-white" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              )}
            >
              <link.icon size={16} />
              {link.name}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Center: Search */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div className="relative w-full group">
          <div className="absolute inset-0 bg-indigo-500/5 rounded-xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <div className="relative flex items-center bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 group-focus-within:border-indigo-500/50 transition-all">
            <Search className="h-4 w-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search careers, skills..." 
              className="bg-transparent border-none text-sm text-slate-200 placeholder:text-slate-500 focus:ring-0 w-full ml-3"
            />
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] text-slate-500 font-bold uppercase tracking-tight">
              <Command size={10} /> K
            </div>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-all">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-slate-950" />
        </button>

        <div className="h-6 w-px bg-white/10 mx-2 hidden sm:block" />

        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1 rounded-full sm:rounded-xl sm:bg-white/5 sm:pr-3 sm:pl-1 hover:bg-white/10 transition-all"
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs ring-1 ring-white/10">
              JD
            </div>
            <span className="text-sm font-semibold text-slate-200 hidden sm:block">John Doe</span>
            <ChevronDown size={14} className={cn("text-slate-500 hidden sm:block transition-transform", isProfileOpen && "rotate-180")} />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl py-2 z-50">
              <div className="px-4 py-2 border-b border-white/5 mb-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Account</p>
                <p className="text-sm font-semibold text-white mt-0.5 truncate">john.doe@skillrise.ai</p>
              </div>
              <button className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-all flex items-center gap-3">
                <User size={16} /> My Profile
              </button>
              <button className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-all flex items-center gap-3">
                <Settings2 size={16} /> Settings
              </button>
              <div className="h-px bg-white/5 my-2" />
              <button className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-400/10 transition-all">
                Sign Out
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-xl text-slate-400 hover:bg-white/5 lg:hidden transition-all"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-16 bg-slate-950 z-40 lg:hidden p-6">
          <div className="space-y-4">
             {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-4 p-4 rounded-3xl bg-white/5 text-lg font-bold text-white border border-white/5"
                >
                  <link.icon size={24} className="text-indigo-400" />
                  {link.name}
                </NavLink>
             ))}
          </div>
        </div>
      )}
    </nav>
  );
};

const Settings2 = ({ size }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 7h-9" />
    <path d="M14 17H5" />
    <circle cx="17" cy="17" r="3" />
    <circle cx="7" cy="7" r="3" />
  </svg>
);

export default TopNavbar;
