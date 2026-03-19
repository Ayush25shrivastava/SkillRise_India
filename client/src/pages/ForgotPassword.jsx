import { useState } from "react";
import API from "../services/authService";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const sendOtp = async () => {
    await API.post("/forgot-password", { email });
    window.location.href = "/reset-password";
  };

  return (
    <div>
      <input placeholder="Email" onChange={(e)=>setEmail(e.target.value)} />
      <button onClick={sendOtp}>Send OTP</button>
    </div>
  );
}