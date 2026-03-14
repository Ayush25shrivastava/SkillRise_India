import React from 'react';
import { Search, Bell, User, MessageSquare, ChevronDown } from 'lucide-react';
import { cn } from '../../services/utils';

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-white/10 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-40">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="w-full bg-slate-950/50 border border-white/5 rounded-full py-2 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
          <MessageSquare size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-slate-900" />
        </button>
        
        <button className="relative p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900" />
        </button>
        
        <div className="h-8 w-[1px] bg-white/10 mx-2" />

        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-white/5 transition-all group"
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs ring-2 ring-white/10 group-hover:ring-indigo-500/50 transition-all">
              JD
            </div>
            <div className="hidden sm:flex flex-col items-start leading-tight">
              <span className="text-sm font-semibold text-slate-200">John Doe</span>
              <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Premium Plan</span>
            </div>
            <ChevronDown size={14} className={cn("text-slate-500 group-hover:text-slate-300 transition-transform", isProfileOpen && "rotate-180")} />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-white/10 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
              <button className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">Your Profile</button>
              <button className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">Billing</button>
              <div className="h-px bg-white/5 my-1" />
              <button className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-400/10 transition-colors">Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
