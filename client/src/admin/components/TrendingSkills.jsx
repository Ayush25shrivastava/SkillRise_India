// export default function TrendingSkills({ skills = [] }) {
//   const colors = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

//   return (
//     <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
//       <h3 className="text-lg font-bold text-white mb-4">Trending Skills</h3>
//       <div className="space-y-4">
//         {skills.slice(0, 5).map((skill, index) => (
//           <div key={index}>
//             <div className="flex justify-between text-sm mb-1">
//               <span className="text-white/80 capitalize">{skill.skill}</span>
//               <span className="text-white/60">{skill.count} users</span>
//             </div>
//             <div className="h-2 bg-white/10 rounded-full overflow-hidden">
//               <div
//                 className="h-full rounded-full transition-all duration-500"
//                 style={{
//                   width: `${skill.percentage}%`,
//                   backgroundColor: colors[index % colors.length]
//                 }}
//               ></div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


// client/src/admin/components/TrendingSkills.jsx
import { useState, useEffect } from "react";
import { Flame, TrendingUp, TrendingDown, Minus, Sparkles } from "lucide-react";

export default function TrendingSkills({ skills = [] }) {
  const [animatedSkills, setAnimatedSkills] = useState([]);

  useEffect(() => {
    // Animate skills on load
    setAnimatedSkills(skills.slice(0, 8));
  }, [skills]);

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp className="w-3 h-3 text-green-400" />;
    if (trend === 'down') return <TrendingDown className="w-3 h-3 text-red-400" />;
    return <Minus className="w-3 h-3 text-gray-400" />;
  };

  const getGradient = (index) => {
    const gradients = [
      "from-orange-500 to-red-500",
      "from-purple-500 to-pink-500",
      "from-blue-500 to-cyan-500",
      "from-green-500 to-emerald-500",
      "from-yellow-500 to-orange-500",
      "from-indigo-500 to-purple-500",
      "from-pink-500 to-rose-500",
      "from-teal-500 to-green-500"
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white uppercase tracking-tight">
              Trending Skills
            </h3>
            <p className="text-xs text-white/40">Real-time demand analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20">
          <Sparkles className="w-3 h-3 text-orange-400 animate-pulse" />
          <span className="text-xs font-bold text-orange-400">Live</span>
        </div>
      </div>

      <div className="space-y-3">
        {animatedSkills.map((skill, index) => (
          <div
            key={index}
            className="group relative p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] hover:border-white/[0.1] transition-all duration-300 hover:scale-[1.02]"
            style={{
              animation: `slideIn 0.5s ease-out ${index * 0.1}s both`
            }}
          >
            {/* Rank Badge */}
            <div className="absolute -left-3 -top-3 w-8 h-8 rounded-xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-lg">
              <span className="text-xs font-black text-white">#{index + 1}</span>
            </div>

            <div className="flex items-center gap-4">
              {/* Skill Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-white font-bold text-sm capitalize">{skill.skill}</p>
                  {skill.trend && (
                    <div className="flex items-center gap-1">
                      {getTrendIcon(skill.trend)}
                      {skill.growth && (
                        <span className="text-xs font-semibold text-green-400">
                          +{skill.growth}%
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="relative h-2 bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${getGradient(index)} transition-all duration-1000 ease-out`}
                    style={{
                      width: `${skill.percentage}%`,
                      animation: `expandWidth 1s ease-out ${index * 0.1}s both`
                    }}
                  />
                  {/* Shimmer effect */}
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    style={{
                      animation: `shimmer 2s infinite ${index * 0.2}s`
                    }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="text-right">
                <p className="text-lg font-black text-white tabular-nums">{skill.count}</p>
                <p className="text-xs text-white/40">users</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      
    </div>
  );
}
