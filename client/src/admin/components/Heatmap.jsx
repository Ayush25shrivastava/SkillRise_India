import { useState, useMemo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { getStateAnalytics } from "../utils/calculations";
import { X, Users, AlertTriangle, CheckCircle2, MapPin } from "lucide-react";

const INDIA_TOPO_JSON =
  "https://gist.githubusercontent.com/jbrobst/56c13bbbf9d97d187fea01ca62ea5112/raw/e388c4cae20aa53cb5090210a42ebb9b765c0a36/india_states.json";

// Normalize state names between GeoJSON and our data
const STATE_NAME_MAP = {
  "Jammu & Kashmir": ["Jammu & Kashmir"],
  "NCT of Delhi": ["Delhi"],
  "Andaman & Nicobar Island": ["Andaman & Nicobar"],
};

function normalizeStateName(geoName) {
  for (const [, aliases] of Object.entries(STATE_NAME_MAP)) {
    if (aliases.includes(geoName)) return aliases[0];
  }
  return geoName;
}

export default function Heatmap() {
  const [tooltip, setTooltip] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const stateData = useMemo(() => {
    const analytics = getStateAnalytics();
    const map = {};
    analytics.forEach((s) => {
      map[s.state] = s;
      // Also map reversed names
      for (const [geoName, aliases] of Object.entries(STATE_NAME_MAP)) {
        if (aliases.includes(s.state)) {
          map[geoName] = s;
        }
      }
    });
    return map;
  }, []);

  const getColor = (geoName) => {
    const normalized =
      STATE_NAME_MAP[geoName]?.[0] || geoName;
    const data = stateData[normalized] || stateData[geoName];
    if (!data) return "rgba(255,255,255,0.04)"; // No data — dim

    if (data.totalGap > 4) return "rgba(239, 68, 68, 0.6)";   // Critical – Red
    if (data.totalGap > 2) return "rgba(245, 158, 11, 0.5)";  // Moderate – Yellow
    return "rgba(34, 197, 94, 0.5)";                           // Low – Green
  };

  const handleMouseEnter = (geo, evt) => {
    const name = geo.properties.ST_NM;
    const normalized = STATE_NAME_MAP[name]?.[0] || name;
    const data = stateData[normalized] || stateData[name];
    setTooltip({ name: normalized || name, data });
    setTooltipPos({ x: evt.clientX, y: evt.clientY });
  };

  return (
    <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8 relative">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-black text-white uppercase tracking-tight">
            🗺️ India Skill Gap Heatmap
          </h3>
          <p className="text-xs text-white/40 mt-1">
            Hover over states to explore — Click for details
          </p>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-[10px] text-white/50 font-semibold">Critical</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-[10px] text-white/50 font-semibold">Moderate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-[10px] text-white/50 font-semibold">Low</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-white/10" />
            <span className="text-[10px] text-white/50 font-semibold">No Data</span>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Map Container */}
        <div className="flex-1 relative" style={{ minHeight: 500 }}>
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 1100,
              center: [82, 22],
            }}
            style={{ width: "100%", height: "100%" }}
          >
            <ZoomableGroup zoom={1} minZoom={0.8} maxZoom={4}>
              <Geographies geography={INDIA_TOPO_JSON}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const name = geo.properties.ST_NM;
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={getColor(name)}
                        stroke="rgba(255,255,255,0.12)"
                        strokeWidth={0.5}
                        style={{
                          default: { outline: "none" },
                          hover: {
                            fill: "rgba(139, 92, 246, 0.6)",
                            stroke: "rgba(139, 92, 246, 0.8)",
                            strokeWidth: 1.5,
                            outline: "none",
                            cursor: "pointer",
                          },
                          pressed: { outline: "none" },
                        }}
                        onMouseEnter={(evt) => handleMouseEnter(geo, evt)}
                        onMouseLeave={() => setTooltip(null)}
                        onClick={() => {
                          const normalized = STATE_NAME_MAP[name]?.[0] || name;
                          const data = stateData[normalized] || stateData[name];
                          setSelectedState({ name: normalized || name, data });
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>

          {/* Floating Tooltip */}
          {tooltip && (
            <div
              className="fixed z-50 pointer-events-none bg-[#12121a]/95 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-4 shadow-2xl min-w-[220px]"
              style={{
                left: tooltipPos.x + 16,
                top: tooltipPos.y - 10,
              }}
            >
              <p className="text-white font-bold text-sm mb-2">{tooltip.name}</p>
              {tooltip.data ? (
                <div className="space-y-1.5 text-xs">
                  <p className="text-white/60">
                    Users: <span className="text-white font-bold">{tooltip.data.totalUsers}</span>
                  </p>
                  <p className="text-white/60">
                    Top Skills:{" "}
                    <span className="text-emerald-400 font-bold">
                      {tooltip.data.topSkills.join(", ") || "—"}
                    </span>
                  </p>
                  <p className="text-white/60">
                    Missing:{" "}
                    <span className="text-red-400 font-bold">
                      {tooltip.data.missingSkills.join(", ") || "None"}
                    </span>
                  </p>
                  <p className="text-white/60">
                    Gap Level:{" "}
                    <span
                      className="font-bold"
                      style={{ color: tooltip.data.gapColor }}
                    >
                      {tooltip.data.gapLevel}
                    </span>
                  </p>
                </div>
              ) : (
                <p className="text-white/40 text-xs">No user data available</p>
              )}
            </div>
          )}
        </div>

        {/* Side Panel – State Detail */}
        {selectedState && (
          <div className="w-80 shrink-0 bg-white/[0.03] border border-white/[0.08] rounded-3xl p-6 animate-in slide-in-from-right-5 space-y-5 relative">
            <button
              onClick={() => setSelectedState(null)}
              className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/5 text-white/40 hover:bg-white/10 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-violet-500/20 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <h4 className="text-white font-bold text-base">{selectedState.name}</h4>
                <p className="text-xs text-white/40">State Overview</p>
              </div>
            </div>

            {selectedState.data ? (
              <>
                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/[0.04] rounded-2xl p-4 text-center">
                    <Users className="w-5 h-5 text-violet-400 mx-auto mb-1" />
                    <p className="text-2xl font-black text-white">{selectedState.data.totalUsers}</p>
                    <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Users</p>
                  </div>
                  <div className="bg-white/[0.04] rounded-2xl p-4 text-center">
                    <AlertTriangle className="w-5 h-5 mx-auto mb-1" style={{ color: selectedState.data.gapColor }} />
                    <p className="text-2xl font-black" style={{ color: selectedState.data.gapColor }}>
                      {selectedState.data.gapLevel}
                    </p>
                    <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Gap Level</p>
                  </div>
                </div>

                {/* Top Skills */}
                <div>
                  <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">
                    Top Skills Present
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedState.data.topSkills.map((s) => (
                      <span
                        key={s}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold"
                      >
                        {s}
                      </span>
                    ))}
                    {selectedState.data.topSkills.length === 0 && (
                      <span className="text-white/30 text-xs">None tracked</span>
                    )}
                  </div>
                </div>

                {/* Missing Skills */}
                <div>
                  <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">
                    Missing Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedState.data.missingSkills.map((s) => (
                      <span
                        key={s}
                        className="px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold"
                      >
                        {s}
                      </span>
                    ))}
                    {selectedState.data.missingSkills.length === 0 && (
                      <span className="text-white/30 text-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        All skills covered
                      </span>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-white/30 text-sm">No user data for this state yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
