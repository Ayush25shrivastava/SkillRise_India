import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getInitials } from "../../utils/helpers";
import { LogOut, LayoutDashboard, PlusCircle, User, Mic } from "lucide-react";
import { useState } from "react";
import { cn } from "../../utils/helpers";

const navLinks = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/interviews/new", label: "New Interview", icon: PlusCircle },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all duration-300">
            <Mic className="w-4 h-4 text-primary group-hover:animate-pulse" />
          </div>
          <span className="font-bold text-foreground text-lg tracking-tight">
            Interview<span className="text-primary">AI</span>
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                "group flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                location.pathname === to
                  ? "bg-primary/10 text-primary shadow-[0_0_10px_rgba(139,92,246,0.2)]"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5 hover:-translate-y-0.5"
              )}
            >
              <Icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
              {label}
            </Link>
          ))}
        </nav>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-white/5 hover:scale-105 transition-all duration-300"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold">
              {getInitials(user?.name)}
            </div>
            <span className="hidden md:block text-sm font-medium text-foreground">{user?.name}</span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-52 glass rounded-xl shadow-xl border border-border py-1 z-50">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-medium text-foreground">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
              >
                <User className="w-4 h-4" /> Profile
              </Link>
              {/* Sign out removed in Auth-Free Mode */}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
