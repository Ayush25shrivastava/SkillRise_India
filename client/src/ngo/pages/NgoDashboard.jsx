import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Plus, BookOpen, LayoutGrid, Search, AlertCircle, Loader2 } from "lucide-react";

import BlogForm from "../components/BlogForm";
import BlogCard from "../components/BlogCard";

// Base API configuration
const API_URL = import.meta.env.VITE_API_URL.replace("/auth", "/blogs");

export default function NgoDashboard() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingBlog, setEditingBlog] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("token");

  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` }
  };

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

  useEffect(() => {
    fetchMyBlogs();
  }, []);

  const handleCreateOrUpdate = async (data, id) => {
    if (id) {
      // Update
      const res = await axios.put(`${API_URL}/${id}`, data, axiosConfig);
      setBlogs(blogs.map(b => b._id === id ? res.data.blog : b));
      setEditingBlog(null);
    } else {
      // Create
      const res = await axios.post(API_URL, data, axiosConfig);
      setBlogs([res.data.blog, ...blogs]);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await axios.delete(`${API_URL}/${id}`, axiosConfig);
        setBlogs(blogs.filter(b => b._id !== id));
      } catch (err) {
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
      {/* Background elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[30%] bg-cyan-600/5 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-violet-500/20 ring-1 ring-white/10">
              <Building2 size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 tracking-tight">
                NGO Dashboard
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-xs text-white/30 font-bold uppercase tracking-widest leading-none">
                  SkillRise Partner Portal
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Blog Form */}
          <div className="lg:col-span-5 relative">
             <div className="sticky top-12">
               <BlogForm 
                 onSubmit={handleCreateOrUpdate} 
                 initialData={editingBlog}
                 onCancel={() => setEditingBlog(null)}
               />
             </div>
          </div>

          {/* Right Column: Blog List */}
          <div className="lg:col-span-7 space-y-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/[0.02] border border-white/[0.06] p-4 rounded-3xl backdrop-blur-sm">
              <div className="flex items-center gap-4 px-2 w-full sm:w-auto">
                <Search size={20} className="text-white/20" />
                <input 
                  type="text" 
                  placeholder="Search your courses or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-none outline-none text-white text-sm font-medium placeholder-white/20 w-full"
                />
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.04] rounded-xl border border-white/[0.08] text-[10px] font-black uppercase tracking-widest text-white/40">
                <LayoutGrid size={14} />
                {blogs.length} Total Posts
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="animate-spin text-violet-500" size={40} />
                <p className="text-white/20 font-bold uppercase tracking-widest text-sm">Synchronizing your content...</p>
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
                  {searchTerm ? "Try a different search term" : "Create your first blog post to get started with SkillRise community"}
                </p>
              </div>
            ) : (
              <motion.div 
                layout
                className="grid grid-cols-1 gap-6"
              >
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
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }} 
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
