import { useState } from "react";
import API from "../services/authService";

export default function ResetPassword() {
  const [data, setData] = useState({
    email:"", otp:"", newPassword:""
  });

  const reset = async () => {
    await API.post("/reset-password", data);
    window.location.href = "/login";
  };

  return (
    <div>
      <input placeholder="Email" onChange={(e)=>setData({...data,email:e.target.value})} />
      <input placeholder="OTP" onChange={(e)=>setData({...data,otp:e.target.value})} />
      <input type="password" placeholder="New Password"
        onChange={(e)=>setData({...data,newPassword:e.target.value})} />
      <button onClick={reset}>Reset</button>
    </div>
  );
}