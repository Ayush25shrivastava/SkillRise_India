import { useState } from "react";
import API from "../../services/authService";
import { Building2, Mail, Tag, CheckCircle2, Send, Lock, Loader2, AlertCircle } from "lucide-react";

const ORG_TYPES = [
  "Education",
  "Technology",
  "Community",
  "Youth Development",
  "Vocational Training",
  "Healthcare",
  "Government Body",
  "Other",
];

export default function NgoRegister() {
  const [form, setForm] = useState({ name: "", email: "", type: "", password: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Organization name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Enter a valid email";
    if (form.password.length < 8) errs.password = "Password must be at least 8 characters";
    if (!form.type) errs.type = "Select an organization type";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      await API.post("/create-ngo", form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubmitted(true);
    } catch (err) {
      setErrors({ api: err.response?.data?.message || "Failed to create NGO account" });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Registration Submitted!
          </h2>
          <p className="text-white/50 text-sm leading-relaxed">
            <strong className="text-white">{form.name}</strong> has been registered
            successfully. Our team will review and onboard your organization within 48
            hours.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setForm({ name: "", email: "", type: "" });
            }}
            className="px-6 py-3 rounded-2xl bg-violet-500/20 text-violet-400 font-bold text-sm hover:bg-violet-500/30 transition-all border border-violet-500/20"
          >
            Register Another NGO
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-black text-white tracking-tight">
          NGO Registration
        </h1>
        <p className="text-sm text-white/40 mt-1 font-medium">
          Register a new NGO partner organization
        </p>
      </div>

      <div className="max-w-2xl">
        <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-10">
          {/* API Error Alert */}
          {errors.api && (
            <div className="flex items-center gap-3 px-5 py-4 mb-8 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={18} className="shrink-0" />
              {errors.api}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-7">
            {/* NGO Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest">
                Organization Name
              </label>
              <div
                className={`flex items-center gap-3 px-5 py-4 rounded-2xl bg-white/[0.03] border transition-all ${
                  errors.name
                    ? "border-red-500/40 focus-within:border-red-500"
                    : "border-white/[0.06] focus-within:border-violet-500/40"
                }`}
              >
                <Building2 className="w-5 h-5 text-white/30 shrink-0" />
                <input
                  type="text"
                  placeholder="e.g. Digital India Trust"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className="flex-1 bg-transparent text-white placeholder-white/20 text-sm font-medium outline-none"
                />
              </div>
              {errors.name && (
                <p className="text-xs text-red-400 font-medium">{errors.name}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest">
                  Contact Email
                </label>
                <div
                  className={`flex items-center gap-3 px-5 py-4 rounded-2xl bg-white/[0.03] border transition-all ${
                    errors.email
                      ? "border-red-500/40 focus-within:border-red-500"
                      : "border-white/[0.06] focus-within:border-violet-500/40"
                  }`}
                >
                  <Mail className="w-5 h-5 text-white/30 shrink-0" />
                  <input
                    type="email"
                    placeholder="contact@organization.org"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="flex-1 bg-transparent text-white placeholder-white/20 text-sm font-medium outline-none"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-400 font-medium">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest">
                  Temporary Password
                </label>
                <div
                  className={`flex items-center gap-3 px-5 py-4 rounded-2xl bg-white/[0.03] border transition-all ${
                    errors.password
                      ? "border-red-500/40 focus-within:border-red-500"
                      : "border-white/[0.06] focus-within:border-violet-500/40"
                  }`}
                >
                  <Lock className="w-5 h-5 text-white/30 shrink-0" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className="flex-1 bg-transparent text-white placeholder-white/20 text-sm font-medium outline-none"
                  />
                </div>
                {errors.password && (
                  <p className="text-xs text-red-400 font-medium">{errors.password}</p>
                )}
              </div>
            </div>

            {/* Organization Type */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest">
                Organization Type
              </label>
              <div
                className={`flex items-center gap-3 px-5 py-4 rounded-2xl bg-white/[0.03] border transition-all ${
                  errors.type
                    ? "border-red-500/40 focus-within:border-red-500"
                    : "border-white/[0.06] focus-within:border-violet-500/40"
                }`}
              >
                <Tag className="w-5 h-5 text-white/30 shrink-0" />
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm({ ...form, type: e.target.value })
                  }
                  className="flex-1 bg-transparent text-white text-sm font-medium outline-none appearance-none cursor-pointer [&>option]:bg-[#12121a] [&>option]:text-white"
                >
                  <option value="" disabled>
                    Select type...
                  </option>
                  {ORG_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              {errors.type && (
                <p className="text-xs text-red-400 font-medium">{errors.type}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-gradient-to-r from-violet-500 to-blue-500 text-white font-bold text-sm hover:shadow-xl hover:shadow-violet-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Register Organization
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
