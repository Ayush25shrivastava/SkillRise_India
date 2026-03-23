import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Send, AlertCircle, CheckCircle2, MapPin, Calendar, Link as LinkIcon } from "lucide-react";

const PROGRAM_TYPES = [
  { value: "training", label: "Training" },
  { value: "job_drive", label: "Job Drive" },
  { value: "workshop", label: "Workshop" },
  { value: "camp", label: "Camp" },
];

export default function ProgramForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "training",
    skills: "",
    location: "",
    eligibility: "",
    deadline: "",
    contactInfo: "",
    applyLink: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.type || !formData.location) {
      setMsg({ type: "error", text: "Title, type, and location are required" });
      return;
    }

    setLoading(true);
    setMsg({ type: "", text: "" });
    try {
      await onSubmit(formData);
      setMsg({ type: "success", text: "Program created successfully!" });
      setFormData({
        title: "", description: "", type: "training", skills: "",
        location: "", eligibility: "", deadline: "", contactInfo: "", applyLink: "",
      });
      setTimeout(() => setMsg({ type: "", text: "" }), 3000);
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.message || "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  const update = (field, value) => setFormData({ ...formData, [field]: value });

  const inputClass = "w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-white placeholder-white/15 font-medium outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[#11111a] border border-white/[0.08] rounded-2xl p-5 shadow-2xl overflow-hidden relative"
    >
      <div className="flex items-center gap-3 mb-5 pb-3 border-b border-white/[0.04]">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
          <Plus size={18} />
        </div>
        <div>
          <h2 className="text-lg font-black text-white tracking-tight">Create Program</h2>
          <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mt-0.5">
            Training, workshops, job drives & camps
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {msg.text && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`flex items-center gap-2 px-3 py-2.5 mb-4 rounded-xl border text-xs ${
              msg.type === "error"
                ? "bg-red-500/10 border-red-500/20 text-red-400"
                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
            } font-medium`}
          >
            {msg.type === "error" ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
            {msg.text}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Row 1: Title + Type */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-0.5">Title *</label>
            <input type="text" placeholder="e.g., Web Dev Bootcamp" value={formData.title} onChange={(e) => update("title", e.target.value)} className={inputClass} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-0.5">Type *</label>
            <select value={formData.type} onChange={(e) => update("type", e.target.value)} className={`${inputClass} appearance-none cursor-pointer`}>
              {PROGRAM_TYPES.map(pt => (
                <option key={pt.value} value={pt.value} className="bg-[#11111a]">{pt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-0.5">Description</label>
          <textarea rows="2" placeholder="Describe the program..." value={formData.description} onChange={(e) => update("description", e.target.value)} className={`${inputClass} resize-none`} />
        </div>

        {/* Row 2: Location + Skills */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-0.5 flex items-center gap-1"><MapPin size={10} /> Location *</label>
            <input type="text" placeholder="e.g., Delhi" value={formData.location} onChange={(e) => update("location", e.target.value)} className={inputClass} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-0.5">Skills</label>
            <input type="text" placeholder="HTML, CSS, JS" value={formData.skills} onChange={(e) => update("skills", e.target.value)} className={inputClass} />
          </div>
        </div>

        {/* Row 3: Eligibility + Deadline */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-0.5">Eligibility</label>
            <input type="text" placeholder="e.g., Class 12 pass" value={formData.eligibility} onChange={(e) => update("eligibility", e.target.value)} className={inputClass} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-0.5 flex items-center gap-1"><Calendar size={10} /> Deadline</label>
            <input type="date" value={formData.deadline} onChange={(e) => update("deadline", e.target.value)} className={inputClass} />
          </div>
        </div>

        {/* Row 4: Contact + Apply Link */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-0.5">Contact</label>
            <input type="text" placeholder="Phone or email" value={formData.contactInfo} onChange={(e) => update("contactInfo", e.target.value)} className={inputClass} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-0.5 flex items-center gap-1"><LinkIcon size={10} /> Apply Link</label>
            <input type="text" placeholder="https://..." value={formData.applyLink} onChange={(e) => update("applyLink", e.target.value)} className={inputClass} />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full group flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg hover:shadow-emerald-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Publish Program
                <Send size={14} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
