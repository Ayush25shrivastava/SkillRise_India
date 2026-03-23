import React from "react";
import { Trash2, MapPin, Tag, Calendar, ExternalLink, Users } from "lucide-react";

const TYPE_STYLES = {
  training:  { bg: "bg-violet-500/10", border: "border-violet-500/20", text: "text-violet-400", label: "Training" },
  job_drive: { bg: "bg-cyan-500/10",   border: "border-cyan-500/20",   text: "text-cyan-400",   label: "Job Drive" },
  workshop:  { bg: "bg-amber-500/10",  border: "border-amber-500/20",  text: "text-amber-400",  label: "Workshop" },
  camp:      { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400", label: "Camp" },
};

export default function ProgramCard({ program, onDelete, readOnly = false }) {
  const style = TYPE_STYLES[program.type] || TYPE_STYLES.training;

  return (
    <div className="group bg-[#11111a] border border-white/[0.06] rounded-xl p-4 hover:bg-white/[0.02] transition-all duration-300 shadow-md shadow-black/20">
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <span className={`px-2 py-1 rounded-md ${style.bg} border ${style.border} text-[9px] font-black ${style.text} uppercase tracking-widest`}>
          {style.label}
        </span>
        {!readOnly && onDelete && (
          <button
            onClick={() => onDelete(program._id)}
            className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
            title="Delete Program"
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>

      {/* Title */}
      <h3 className="text-sm font-bold text-white tracking-tight leading-snug group-hover:text-emerald-400 transition-colors mb-1.5">
        {program.title}
      </h3>

      {/* Description */}
      {program.description && (
        <p className="text-white/40 text-xs leading-relaxed mb-3 line-clamp-2 font-medium">
          {program.description}
        </p>
      )}

      {/* Skills */}
      {program.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {program.skills.map((skill, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-[9px] font-bold text-white/30 uppercase tracking-wider flex items-center gap-1"
            >
              <Tag size={9} className="text-emerald-500" />
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-white/20 pt-2.5 border-t border-white/[0.04]">
        <div className="flex items-center gap-1">
          <MapPin size={11} className="text-cyan-500/50" />
          {program.location}
        </div>
        {program.eligibility && (
          <div className="flex items-center gap-1">
            <Users size={11} className="text-violet-500/50" />
            {program.eligibility}
          </div>
        )}
        {program.deadline && (
          <div className="flex items-center gap-1">
            <Calendar size={11} />
            {new Date(program.deadline).toLocaleDateString()}
          </div>
        )}
        {program.applyLink && (
          <a
            href={program.applyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-emerald-400/60 hover:text-emerald-400 transition-colors ml-auto"
          >
            <ExternalLink size={11} />
            Apply
          </a>
        )}
      </div>
    </div>
  );
}
