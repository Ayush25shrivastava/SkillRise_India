import React from "react";
import { generateSuggestions } from "../utils/calculations";
import { SKILL_LABELS } from "../utils/mockData";
import { Lightbulb, CheckCircle2, AlertCircle } from "lucide-react";

export default function Suggestions({ blogs }) {
  const allSkills = Object.keys(SKILL_LABELS);
  const suggestions = generateSuggestions(blogs, allSkills);

  return (
    <div className="bg-white/5 border border-white/10 p-8 rounded-2xl shadow-sm hover:border-blue-500/10 transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <Lightbulb className="text-yellow-500" size={24} />
        <h2 className="text-xl font-bold text-white tracking-tight">AI Insights & Suggestions</h2>
      </div>

      <div className="space-y-3">
        {suggestions.length > 0 ? (
          suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-start gap-4 p-5 bg-yellow-500/5 hover:bg-yellow-500/10 border border-yellow-500/10 hover:border-yellow-500/30 rounded-2xl transition-all duration-300 group">
              <AlertCircle className="text-yellow-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" size={20} />
              <p className="text-sm font-medium text-yellow-100 italic tracking-tight">
                {suggestion}
              </p>
            </div>
          ))
        ) : (
          <div className="flex items-center gap-4 p-6 bg-green-500/5 border border-green-500/10 rounded-2xl">
            <CheckCircle2 className="text-green-400 shrink-0" size={20} />
            <p className="text-sm font-medium text-green-100">
              All critical skills have sufficient content! Great job keeping the community educated.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
