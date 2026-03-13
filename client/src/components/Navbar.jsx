import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav>
      <NavLink 
        to="/login" 
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        Login
      </NavLink>
      <NavLink 
        to="/register" 
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        Register
      </NavLink>
    </nav>
  );
}
