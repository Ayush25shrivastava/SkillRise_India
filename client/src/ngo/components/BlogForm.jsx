import React, { useState, useEffect } from "react";
import { Plus, Send, X, Edit2, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function BlogForm({ onSubmit, initialData, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skills: "",
    region: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        skills: Array.isArray(initialData.skills) ? initialData.skills.join(", ") : "",
        region: initialData.region || "",
      });
    } else {
      setFormData({ title: "", description: "", skills: "", region: "" });
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.skills) {
      setMsg({ type: "error", text: "Please fill all required fields" });
      return;
    }

    setLoading(true);
    setMsg({ type: "", text: "" });
    try {
      await onSubmit(formData, initialData?._id);
      setMsg({ type: "success", text: initialData ? "Blog updated successfully!" : "Blog created successfully!" });
      if (!initialData) setFormData({ title: "", description: "", skills: "", region: "" });
      
      // Clear success message after 3 seconds
      setTimeout(() => setMsg({ type: "", text: "" }), 3000);
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.message || "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[#11111a] border border-white/[0.08] rounded-3xl p-8 shadow-2xl overflow-hidden relative"
    >
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.04]">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${initialData ? 'bg-amber-500/20 text-amber-400' : 'bg-violet-500/20 text-violet-400'}`}>
            {initialData ? <Edit2 size={24} /> : <Plus size={24} />}
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              {initialData ? "Update Blog Post" : "Create New Content"}
            </h2>
            <p className="text-xs text-white/30 uppercase tracking-widest font-bold mt-1">
              {initialData ? "Refining existing course information" : "Sharing knowledge with the community"}
            </p>
          </div>
        </div>
        {initialData && (
          <button
            onClick={onCancel}
            className="p-2 rounded-xl bg-white/[0.04] text-white/50 hover:bg-white/10 hover:text-white transition-all border border-white/[0.06]"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {msg.text && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`flex items-center gap-3 px-5 py-4 mb-8 rounded-2xl border transition-all ${
              msg.type === "error"
                ? "bg-red-500/10 border-red-500/20 text-red-400 font-medium"
                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-medium font-bold"
            }`}
          >
            {msg.type === "error" ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
            {msg.text}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/30 uppercase tracking-widest pl-1">Course Title *</label>
            <input
              type="text"
              placeholder="e.g., Intro to Digital Literacy"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-5 py-4 bg-white/[0.03] border border-white/[0.08] rounded-2xl text-white placeholder-white/15 font-medium outline-none focus:border-violet-500/50 focus:bg-white/[0.05] transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-white/30 uppercase tracking-widest pl-1">Active Region</label>
            <input
              type="text"
              placeholder="e.g., Uttar Pradesh"
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              className="w-full px-5 py-4 bg-white/[0.03] border border-white/[0.08] rounded-2xl text-white placeholder-white/15 font-medium outline-none focus:border-violet-500/50 focus:bg-white/[0.05] transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-white/30 uppercase tracking-widest pl-1">Brief Description *</label>
          <textarea
            rows="3"
            placeholder="Describe the skills or outcomes of this course..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-5 py-4 bg-white/[0.03] border border-white/[0.08] rounded-2xl text-white placeholder-white/15 font-medium outline-none focus:border-violet-500/50 focus:bg-white/[0.05] transition-all resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-white/30 uppercase tracking-widest pl-1">Skills Tags (comma separated) *</label>
          <input
            type="text"
            placeholder="e.g., digital, literacy, communication, resume_builder"
            value={formData.skills}
            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
            className="w-full px-5 py-4 bg-white/[0.03] border border-white/[0.08] rounded-2xl text-white placeholder-white/15 font-medium outline-none focus:border-violet-500/50 focus:bg-white/[0.05] transition-all"
          />
        </div>

        <div className="pt-4 flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 group flex items-center justify-center gap-3 py-4.5 rounded-2xl font-black text-white shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed ${
              initialData
                ? "bg-gradient-to-r from-amber-600 to-orange-600 hover:shadow-amber-500/20"
                : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:shadow-violet-500/20"
            }`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {initialData ? "Update Post" : "Publish Content"}
                <Send size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
