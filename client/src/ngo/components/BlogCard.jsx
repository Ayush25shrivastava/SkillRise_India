import React from "react";
import { Trash2, Edit, MapPin, Tag, Calendar } from "lucide-react";

export default function BlogCard({ blog, onDelete, onEdit }) {
  return (
    <div className="group bg-[#11111a] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.02] transition-all duration-300 shadow-lg shadow-black/20">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white tracking-tight leading-tight group-hover:text-violet-400 transition-colors">
          {blog.title}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(blog)}
            className="p-2 rounded-xl bg-violet-500/10 text-violet-400 hover:bg-violet-500 hover:text-white transition-all border border-violet-500/20"
            title="Edit Post"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(blog._id)}
            className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
            title="Delete Post"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <p className="text-white/50 text-sm leading-relaxed mb-6 line-clamp-3 font-medium">
        {blog.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {blog.skills.map((skill, idx) => (
          <span
            key={idx}
            className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[10px] sm:text-xs font-bold text-white/30 uppercase tracking-widest flex items-center gap-1.5"
          >
            <Tag size={12} className="text-violet-500" />
            {skill}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-white/20 pt-4 border-t border-white/[0.04]">
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-cyan-500/50" />
          {blog.region || "All India"}
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={14} />
          {new Date(blog.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
