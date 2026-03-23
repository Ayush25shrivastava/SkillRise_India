import { Trash2, Edit, MapPin, Tag, Calendar, Eye, Heart } from "lucide-react";

export default function BlogCard({ blog, onDelete, onEdit, readOnly = false }) {
  return (
    <div className="group bg-[#11111a] border border-white/[0.06] rounded-xl p-4 hover:bg-white/[0.02] transition-all duration-300 shadow-md shadow-black/20">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-bold text-white tracking-tight leading-snug group-hover:text-violet-400 transition-colors">
          {blog.title}
        </h3>
        {!readOnly && (
          <div className="flex gap-1.5 ml-3 shrink-0">
            <button
              onClick={() => onEdit(blog)}
              className="p-1.5 rounded-lg bg-violet-500/10 text-violet-400 hover:bg-violet-500 hover:text-white transition-all border border-violet-500/20"
              title="Edit Post"
            >
              <Edit size={13} />
            </button>
            <button
              onClick={() => onDelete(blog._id)}
              className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
              title="Delete Post"
            >
              <Trash2 size={13} />
            </button>
          </div>
        )}
      </div>

      <p className="text-white/40 text-xs leading-relaxed mb-3 line-clamp-2 font-medium">
        {blog.description}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {blog.skills.map((skill, idx) => (
          <span
            key={idx}
            className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-[9px] font-bold text-white/30 uppercase tracking-wider flex items-center gap-1"
          >
            <Tag size={9} className="text-violet-500" />
            {skill}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-white/20 pt-2.5 border-t border-white/[0.04]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 group-hover:text-cyan-400/80 transition-colors">
            <MapPin size={11} className="text-cyan-500/50" />
            {blog.location || blog.region || "All India"}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 group-hover:text-rose-400/80 transition-colors">
            <Heart size={11} className="text-rose-500/50" />
            {blog.likes || 0}
          </div>
          <div className="flex items-center gap-1 group-hover:text-amber-400/80 transition-colors">
            <Eye size={11} className="text-amber-500/50" />
            {blog.views || 0}
          </div>
          <div className="flex items-center gap-1 group-hover:text-white/40 transition-colors">
            <Calendar size={11} />
            {new Date(blog.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}
