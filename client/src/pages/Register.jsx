/**
 * Register Page — Dark futuristic design matching the landing page
 * 3-step OTP flow: Email → Verify OTP → Name + Password
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Mail, Lock, User, ArrowRight, Eye, EyeOff,
  AlertCircle, KeyRound, CheckCircle2, Loader2
} from "lucide-react";
import API from "../services/authService";
import ParticleField from "../components/landing/ParticleField";

export default function Register() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({ name: "", email: "", password: "", otp: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await API.post("/send-otp", { email: data.email });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await API.post("/verify-otp", { email: data.email, otp: data.otp });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const register = async (e) => {
    e.preventDefault();
    setError("");
    if (!data.name || !data.email || !data.password) {
      setError("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await API.post("/register", data);
      localStorage.setItem("token", res.data.token);
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step indicator data
  const steps = [
    { num: 1, label: "Email" },
    { num: 2, label: "Verify" },
    { num: 3, label: "Profile" },
  ];

  return (
    <div className="relative min-h-screen bg-[#06060a] flex items-center justify-center px-6 py-12">
      {/* Background effects */}
      <ParticleField />
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-violet-600/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-[400px] h-[400px] bg-cyan-600/6 rounded-full blur-[100px] pointer-events-none" />

      {/* Register Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-shadow">
              <Sparkles size={20} className="text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white">
              Skill<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Rise</span>
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-3xl p-10 sm:p-12 backdrop-blur-sm">
          {/* Header */}
          <div className="text-center mb-10 space-y-3">
            <h1 className="text-3xl font-black text-white tracking-tight">Create Account</h1>
            <p className="text-white/30 font-medium">Start your AI-powered career journey</p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {steps.map((s, idx) => (
              <div key={s.num} className="flex items-center gap-2">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    step > s.num
                      ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400"
                      : step === s.num
                      ? "bg-violet-500/20 border border-violet-500/30 text-violet-400"
                      : "bg-white/[0.04] border border-white/[0.08] text-white/20"
                  }`}
                >
                  {step > s.num ? <CheckCircle2 size={16} /> : s.num}
                </div>
                <span
                  className={`text-xs font-bold uppercase tracking-wider hidden sm:inline ${
                    step >= s.num ? "text-white/40" : "text-white/15"
                  }`}
                >
                  {s.label}
                </span>
                {idx < steps.length - 1 && (
                  <div className={`w-8 h-px mx-1 transition-colors ${step > s.num ? "bg-emerald-500/30" : "bg-white/[0.06]"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 px-5 py-4 mb-8 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium"
            >
              <AlertCircle size={18} className="shrink-0" />
              {error}
            </motion.div>
          )}

          {/* Step Forms */}
          <AnimatePresence mode="wait">
            {/* Step 1: Email */}
            {step === 1 && (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={sendOtp}
                className="space-y-6"
              >
                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-white/30 uppercase tracking-widest">Email Address</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" />
                    <input
                      type="email"
                      value={data.email}
                      onChange={(e) => setData({ ...data, email: e.target.value })}
                      placeholder="you@example.com"
                      required
                      className="w-full pl-14 pr-5 py-4 bg-white/[0.04] border border-white/[0.08] rounded-2xl text-white placeholder-white/20 font-medium focus:outline-none focus:border-violet-500/40 focus:bg-white/[0.06] transition-all"
                    />
                  </div>
                  <p className="text-xs text-white/15 font-medium pl-1">We'll send a verification code to this email</p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full flex items-center justify-center gap-3 py-4.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-2xl hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <>
                      Send Verification Code
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </motion.form>
            )}

            {/* Step 2: OTP Verification */}
            {step === 2 && (
              <motion.form
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={verifyOtp}
                className="space-y-6"
              >
                <div className="text-center mb-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold">
                    <Mail size={14} />
                    Code sent to {data.email}
                  </div>
                </div>

                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-white/30 uppercase tracking-widest">Verification Code</label>
                  <div className="relative">
                    <KeyRound size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" />
                    <input
                      type="text"
                      value={data.otp}
                      onChange={(e) => setData({ ...data, otp: e.target.value })}
                      placeholder="Enter 6-digit code"
                      required
                      maxLength={6}
                      className="w-full pl-14 pr-5 py-4 bg-white/[0.04] border border-white/[0.08] rounded-2xl text-white placeholder-white/20 font-medium text-center text-lg tracking-[0.5em] focus:outline-none focus:border-violet-500/40 focus:bg-white/[0.06] transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full flex items-center justify-center gap-3 py-4.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-2xl hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <>
                      Verify Code
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => { setStep(1); setError(""); }}
                  className="w-full text-center text-sm text-white/25 hover:text-white/50 font-medium transition-colors"
                >
                  Use a different email
                </button>
              </motion.form>
            )}

            {/* Step 3: Name + Password */}
            {step === 3 && (
              <motion.form
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={register}
                className="space-y-6"
              >
                <div className="text-center mb-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                    <CheckCircle2 size={14} />
                    Email verified successfully!
                  </div>
                </div>

                {/* Name Field */}
                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-white/30 uppercase tracking-widest">Full Name</label>
                  <div className="relative">
                    <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" />
                    <input
                      type="text"
                      value={data.name}
                      onChange={(e) => setData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="John Doe"
                      required
                      className="w-full pl-14 pr-5 py-4 bg-white/[0.04] border border-white/[0.08] rounded-2xl text-white placeholder-white/20 font-medium focus:outline-none focus:border-violet-500/40 focus:bg-white/[0.06] transition-all"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-white/30 uppercase tracking-widest">Password</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={data.password}
                      onChange={(e) => setData((prev) => ({ ...prev, password: e.target.value }))}
                      placeholder="Create a strong password"
                      required
                      className="w-full pl-14 pr-14 py-4 bg-white/[0.04] border border-white/[0.08] rounded-2xl text-white placeholder-white/20 font-medium focus:outline-none focus:border-violet-500/40 focus:bg-white/[0.06] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full flex items-center justify-center gap-3 py-4.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-2xl hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <>
                      Create Account
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Login Link */}
          <p className="text-center mt-10 text-sm text-white/25 font-medium">
            Already have an account?{" "}
            <Link to="/login" className="text-violet-400 hover:text-violet-300 font-bold transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}