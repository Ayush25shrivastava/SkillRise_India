import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="auth-nav flex items-center justify-between px-8 py-4 backdrop-blur-md bg-white/5 border-b border-white/5 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10 shadow-lg">
          <img src="/favicon.png" alt="SkillRise Logo" className="w-full h-full object-cover" />
        </div>
        <span className="text-white font-black tracking-tighter text-lg uppercase italic">SkillRise</span>
      </div>
      
      <div className="flex gap-8">
        <NavLink
          to="/login"
          className={({ isActive }) => (isActive ? "active text-purple-400 font-bold" : "text-white/40 hover:text-white transition-all font-medium")}
        >
          Login
        </NavLink>
        <NavLink
          to="/register"
          className={({ isActive }) => (isActive ? "active text-purple-400 font-bold" : "text-white/40 hover:text-white transition-all font-medium")}
        >
          Register
        </NavLink>
      </div>
    </nav>
  );
}
