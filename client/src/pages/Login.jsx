// import { useState } from "react";
// import { loginUser } from "../services/authService.js";
// import { Link, useNavigate, useLocation } from "react-router-dom";

// export default function Login() {
//   const [form, setForm] = useState({
//     email: "",
//     password: ""
//   });
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Extract the destination where the user was trying to go
//   const from = location.state?.from?.pathname || "/dashboard";

//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await loginUser(form);
//       localStorage.setItem("token", res.data.token);
      
//       // Redirect to the originally intended page or dashboard
//       navigate(from, { replace: true }); 
//     } catch (error) {
//       alert(error.response?.data?.message || "Login failed");
//     }
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-card">
//         <h2>Welcome Back</h2>
//         <p className="subtitle">Please enter your details to sign in</p>
        
//         <form onSubmit={handleSubmit}>
//           <div className="input-group">
//             <input
//               name="email"
//               type="email"
//               placeholder="Email Address"
//               required
//               onChange={handleChange}
//             />
//           </div>

//           <div className="input-group">
//             <input
//               name="password"
//               type="password"
//               placeholder="Password"
//               required
//               onChange={handleChange}
//             />
//           </div>

//           <button type="submit">Sign In</button>
//         </form>

//         <div className="auth-footer">
//           Don't have an account? <Link to="/register">Create one</Link>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import API from "../services/authService";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleLogin = async () => {
    const res = await API.post("/login", form);
    localStorage.setItem("token", res.data.token);
    window.location.href = "/dashboard";
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center text-white">
      <h1 className="text-3xl mb-4">Login</h1>

      <input placeholder="Email"
        onChange={(e)=>setForm({...form,email:e.target.value})} />

      <input type="password" placeholder="Password"
        onChange={(e)=>setForm({...form,password:e.target.value})} />

      <button onClick={handleLogin}>Login</button>

      <a href="/forgot-password">Forgot Password?</a>

      <button onClick={() => window.location.href="http://localhost:5000/api/auth/google"}>
        Login with Google
      </button>
    </div>
  );
}