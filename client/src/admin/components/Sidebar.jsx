import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  ArrowLeft,
  LogOut,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/ngo-register", icon: Building2, label: "NGO Registration" },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 bg-[#08080e] border-r border-white/[0.06] flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-violet-500/25">
            SR
          </div>
          <div>
            <h1 className="text-white font-black text-base tracking-tight">SkillRise</h1>
            <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-violet-500/10 text-violet-400 border border-violet-500/20 shadow-lg shadow-violet-500/5"
                  : "text-white/40 hover:text-white/70 hover:bg-white/[0.04]"
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-white/[0.06] space-y-2">
        <NavLink
          to="/dashboard"
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to App
        </NavLink>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-red-400/50 hover:text-red-400 hover:bg-red-400/5 transition-all"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
