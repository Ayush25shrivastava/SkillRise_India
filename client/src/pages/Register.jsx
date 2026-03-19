// import { useState } from "react";
// import { registerUser } from "../services/authService.js";
// import { Link, useNavigate } from "react-router-dom";

// export default function Register() {
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: ""
//   });
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await registerUser(form);
//       alert("Registration successful! You can now log in.");
//       navigate("/login");
//     } catch (error) {
//       alert(error.response?.data?.message || "Registration failed");
//     }
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-card">
//         <h2>Join Us</h2>
//         <p className="subtitle">Create an account to get started</p>
        
//         <form onSubmit={handleSubmit}>
//           <div className="input-group">
//             <input
//               name="name"
//               type="text"
//               placeholder="Full Name"
//               required
//               onChange={handleChange}
//             />
//           </div>

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

//           <button type="submit">Create Account</button>
//         </form>

//         <div className="auth-footer">
//           Already have an account? <Link to="/login">Sign In</Link>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState } from "react";
import API from "../services/authService";

export default function Register() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({ name:"", email:"", password:"", otp:"" });

  const sendOtp = async () => {
    await API.post("/send-otp", { email: data.email });
    setStep(2);
  };

  const verifyOtp = async () => {
    await API.post("/verify-otp", {
      email: data.email,
      otp: data.otp
    });
    setStep(3);
  };

  // const register = async () => {
  //   const res = await API.post("/register", data);
  //   localStorage.setItem("token", res.data.token);
  //   window.location.href = "/dashboard";
  //   console.log("REGISTER DATA:", data);
  // };

const register = async () => {
  if (!data.name || !data.email || !data.password) {
    alert("Please fill all fields");
    return;
  }

  console.log("REGISTER DATA:", data);

  try {
    const res = await API.post("/register", data);

    localStorage.setItem("token", res.data.token);
    window.location.href = "/dashboard";

  } catch (err) {
    alert(err.response?.data?.message);
  }
};

  return (
    <div className="text-white">

      {step === 1 && (
        <>
          <input placeholder="Email"
            onChange={(e)=>setData({...data,email:e.target.value})} />
          <button onClick={sendOtp}>Send OTP</button>
        </>
      )}

      {step === 2 && (
        <>
          <input placeholder="Enter OTP"
            onChange={(e)=>setData({...data,otp:e.target.value})} />
          <button onClick={verifyOtp}>Verify OTP</button>
        </>
      )}

      {step === 3 && (
        <>
          
            <input
              placeholder="Name"
              value={data.name}
              onChange={(e) =>
                setData((prev) => ({ ...prev, name: e.target.value }))
              }
            />

            <input
              type="password"
              placeholder="Password"
              value={data.password}
              onChange={(e) =>
                setData((prev) => ({ ...prev, password: e.target.value }))
              }
            />
          <button onClick={register}>Register</button>
        </>
      )}

    </div>
  );
}


// {/* <input placeholder="Name"
//             onChange={(e)=>setData({...data,name:e.target.value})} />
//           <input type="password" placeholder="Password"
//             onChange={(e)=>setData({...data,password:e.target.value})} /> */}