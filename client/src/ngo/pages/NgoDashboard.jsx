import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, BookOpen, LayoutGrid, Search,
  AlertCircle, Loader2, BarChart3, Tag, Lightbulb
} from "lucide-react";

import BlogForm from "../components/BlogForm";
import BlogCard from "../components/BlogCard";
import ImpactPanel from "../components/ImpactPanel";
import SkillsPanel from "../components/SkillsPanel";
import Suggestions from "../components/Suggestions";

// Base API configuration
const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5050/api/auth").replace("/auth", "/blogs");

const NAV_TABS = [
  { id: "blogs",     label: "Blog Posts",        icon: BookOpen },
  { id: "impact",    label: "Impact Stats",       icon: BarChart3 },
  { id: "skills",    label: "Skills Breakdown",   icon: Tag },
  { id: "insights",  label: "AI Insights",        icon: Lightbulb },
];

export default function NgoDashboard() {
  const [blogs, setBlogs]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [editingBlog, setEditingBlog] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab]   = useState("blogs");

  const token = localStorage.getItem("token");
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  const fetchMyBlogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/my`, axiosConfig);
      setBlogs(res.data.blogs);
    } catch (err) {
      setError("Failed to fetch blogs. Please refresh.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMyBlogs(); }, []);

  const handleCreateOrUpdate = async (data, id) => {
    if (id) {
      const res = await axios.put(`${API_URL}/${id}`, data, axiosConfig);
      setBlogs(blogs.map(b => b._id === id ? res.data.blog : b));
      setEditingBlog(null);
    } else {
      const res = await axios.post(API_URL, data, axiosConfig);
      setBlogs([res.data.blog, ...blogs]);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await axios.delete(`${API_URL}/${id}`, axiosConfig);
        setBlogs(blogs.filter(b => b._id !== id));
      } catch {
        alert("Delete failed.");
      }
    }
  };

  const filteredBlogs = blogs.filter(b =>
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.skills.some(sk => sk.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#06060a] text-white selection:bg-violet-500/30">

      {/* ── Background blobs ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[30%] bg-cyan-600/5 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">

        {/* ── Header ── */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10"
        >
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-violet-500/20 ring-1 ring-white/10">
              <Building2 size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 tracking-tight">
                NGO Dashboard
              </h1>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-xs text-white/30 font-bold uppercase tracking-widest">
                  SkillRise Partner Portal
                </p>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          {!loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3 px-5 py-3 bg-white/[0.03] border border-white/[0.07] rounded-2xl"
            >
              <LayoutGrid size={16} className="text-violet-400" />
              <span className="text-sm font-bold text-white/50">
                <span className="text-white">{blogs.length}</span> Total Posts
              </span>
            </motion.div>
          )}
        </motion.header>

        {/* ── Tab Navigation ── */}
        <motion.nav
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-10 p-1.5 bg-white/[0.02] border border-white/[0.06] rounded-2xl w-fit"
        >
          {NAV_TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                activeTab === id
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20"
                  : "text-white/30 hover:text-white/60 hover:bg-white/[0.04]"
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </motion.nav>

        {/* ── Tab Content ── */}
        <AnimatePresence mode="wait">

          {/* BLOGS TAB */}
          {activeTab === "blogs" && (
            <motion.div
              key="blogs"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10"
            >
              {/* Left: Form */}
              <div className="lg:col-span-5">
                <div className="sticky top-12">
                  <BlogForm
                    onSubmit={handleCreateOrUpdate}
                    initialData={editingBlog}
                    onCancel={() => setEditingBlog(null)}
                  />
                </div>
              </div>

              {/* Right: Blog list */}
              <div className="lg:col-span-7 space-y-8">
                {/* Search bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/[0.02] border border-white/[0.06] p-4 rounded-3xl backdrop-blur-sm">
                  <div className="flex items-center gap-4 px-2 w-full sm:w-auto">
                    <Search size={20} className="text-white/20 shrink-0" />
                    <input
                      type="text"
                      placeholder="Search courses or skills..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-transparent border-none outline-none text-white text-sm font-medium placeholder-white/20 w-full"
                    />
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.04] rounded-xl border border-white/[0.08] text-[10px] font-black uppercase tracking-widest text-white/40 shrink-0">
                    <LayoutGrid size={14} />
                    {filteredBlogs.length} posts
                  </div>
                </div>

                {/* States */}
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="animate-spin text-violet-500" size={40} />
                    <p className="text-white/20 font-bold uppercase tracking-widest text-sm">Synchronizing content...</p>
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4 bg-red-500/5 border border-red-500/10 rounded-3xl">
                    <AlertCircle className="text-red-400" size={40} />
                    <p className="text-red-400/80 font-bold uppercase tracking-widest text-sm">{error}</p>
                  </div>
                ) : filteredBlogs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-32 rounded-3xl border border-dashed border-white/10 bg-white/[0.01]">
                    <div className="w-20 h-20 rounded-full bg-white/[0.03] flex items-center justify-center mb-6 text-white/10">
                      <BookOpen size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-white/30 tracking-tight">No content found</h3>
                    <p className="text-white/10 text-sm mt-2 max-w-xs text-center font-medium">
                      {searchTerm ? "Try a different search term" : "Create your first blog post to get started"}
                    </p>
                  </div>
                ) : (
                  <motion.div layout className="grid grid-cols-1 gap-6">
                    <AnimatePresence>
                      {filteredBlogs.map(blog => (
                        <motion.div
                          key={blog._id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          layout
                        >
                          <BlogCard
                            blog={blog}
                            onDelete={handleDelete}
                            onEdit={(b) => {
                              setEditingBlog(b);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* IMPACT STATS TAB */}
          {activeTab === "impact" && (
            <motion.div
              key="impact"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            >
              {loading ? (
                <div className="flex items-center justify-center py-32">
                  <Loader2 className="animate-spin text-violet-500" size={40} />
                </div>
              ) : (
                <ImpactPanel blogs={blogs} />
              )}
            </motion.div>
          )}

          {/* SKILLS BREAKDOWN TAB */}
          {activeTab === "skills" && (
            <motion.div
              key="skills"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            >
              {loading ? (
                <div className="flex items-center justify-center py-32">
                  <Loader2 className="animate-spin text-violet-500" size={40} />
                </div>
              ) : blogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 rounded-3xl border border-dashed border-white/10">
                  <Tag size={40} className="text-white/10 mb-4" />
                  <p className="text-white/30 font-bold">No skill data yet. Create some blog posts first.</p>
                </div>
              ) : (
                <SkillsPanel blogs={blogs} />
              )}
            </motion.div>
          )}

          {/* AI INSIGHTS TAB */}
          {activeTab === "insights" && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            >
              {loading ? (
                <div className="flex items-center justify-center py-32">
                  <Loader2 className="animate-spin text-violet-500" size={40} />
                </div>
              ) : (
                <Suggestions blogs={blogs} />
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
