import { useState } from "react";
import { registerUser } from "../services/authService.js";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(form);
      alert("Registration successful! You can now log in.");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Join Us</h2>
        <p className="subtitle">Create an account to get started</p>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              required
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              required
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              onChange={handleChange}
            />
          </div>

          <button type="submit">Create Account</button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
}