import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      // In a real app, you'd verify the token with the backend here
      setUser({ name: "User" }); // Placeholder
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ textAlign: "center" }}>
        <h2>Dashboard</h2>
        <p className="subtitle">Welcome back to your workspace</p>
        <div style={{ margin: "2rem 0", padding: "2rem", background: "rgba(255,255,255,0.03)", borderRadius: "1rem" }}>
          <p>You are successfully logged in.</p>
        </div>
        <button onClick={handleLogout} style={{ background: "transparent", border: "1px solid var(--glass-border)", marginTop: "0" }}>
          Sign Out
        </button>
      </div>
    </div>
  );
}
