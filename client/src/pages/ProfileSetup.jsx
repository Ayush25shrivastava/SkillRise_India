import { useState, useEffect, useCallback, memo, useRef } from "react";
import {
  User, Phone, MapPin, BookOpen, GraduationCap, Target, Briefcase, Wrench,
  Edit3, X, Check, ChevronDown, FileText, Sparkles, TrendingUp, AlertCircle,
  ArrowRight, Upload, Globe, DollarSign, Clock, Zap
} from "lucide-react";

/* ─────────────────────────────────────────────
   Design tokens (from index.css @theme)
   bg-base:    #06060a
   bg-surface: #0a0a0f
   bg-card:    #12121a
   border:     white/[0.08]
   accent:     violet-500
───────────────────────────────────────────── */

// ─── Reusable Card Shell ──────────────────────────────────────────────────────
const ProfileCard = memo(({ icon: Icon, title, children, className = "" }) => (
  <div className={`bg-[#12121a] border border-white/[0.08] rounded-2xl p-5 transition-all duration-200 hover:scale-[1.01] hover:border-white/[0.12] ${className}`}>
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/30">
        <Icon size={16} />
      </div>
      <h3 className="text-xs font-bold text-white/40 uppercase tracking-[0.15em]">{title}</h3>
    </div>
    {children}
  </div>
));
ProfileCard.displayName = "ProfileCard";

// ─── Field Display ────────────────────────────────────────────────────────────
const FieldRow = memo(({ label, value }) => (
  <div className="py-2">
    <p className="text-[11px] font-medium text-white/25 uppercase tracking-wider mb-0.5">{label}</p>
    <p className="text-sm font-semibold text-white/80">{value || "—"}</p>
  </div>
));
FieldRow.displayName = "FieldRow";

// ─── Editable Field ──────────────────────────────────────────────────────────
const EditField = memo(({ icon: Icon, label, value, onChange, placeholder, type = "text" }) => (
  <div>
    <label className="text-[11px] font-medium text-white/30 uppercase tracking-wider mb-1.5 block">{label}</label>
    <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] focus-within:border-violet-500/40 transition-colors">
      {Icon && <Icon size={16} className="text-white/20 shrink-0" />}
      <input
        type={type}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        className="bg-transparent outline-none w-full text-white text-sm placeholder:text-white/20 font-medium"
      />
    </div>
  </div>
));
EditField.displayName = "EditField";

// ─── Select Field ────────────────────────────────────────────────────────────
const EditSelect = memo(({ label, value, options, onChange }) => (
  <div>
    <label className="text-[11px] font-medium text-white/30 uppercase tracking-wider mb-1.5 block">{label}</label>
    <div className="relative">
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm font-medium focus:outline-none focus:border-violet-500/40 appearance-none cursor-pointer transition-colors"
      >
        {options.map((opt, i) => (
          <option key={i} value={typeof opt === "string" ? opt : opt.value} className="bg-[#12121a] text-white">
            {typeof opt === "string" ? opt : opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" size={14} />
    </div>
  </div>
));
EditSelect.displayName = "EditSelect";

// ─── Skill Chips ─────────────────────────────────────────────────────────────
const SkillChips = memo(({ skills }) => {
  if (!skills) return <p className="text-sm text-white/30">No skills added</p>;
  const list = typeof skills === "string" ? skills.split(",").map(s => s.trim()).filter(Boolean) : [];
  if (list.length === 0) return <p className="text-sm text-white/30">No skills added</p>;

  return (
    <div className="flex flex-wrap gap-2">
      {list.map((skill, i) => (
        <span
          key={i}
          className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs font-semibold text-white/60 transition-all hover:bg-white/[0.08] hover:text-white/80"
        >
          {skill}
        </span>
      ))}
    </div>
  );
});
SkillChips.displayName = "SkillChips";

// ─── Profile Strength Bar ────────────────────────────────────────────────────
const ProfileStrength = memo(({ data, role }) => {
  const fields = role === "student"
    ? ["name", "phone", "location", "college", "degree", "year", "interests", "goal"]
    : role === "professional"
    ? ["name", "phone", "location", "role", "exp", "company", "skills", "salary", "goal"]
    : ["name", "phone", "location", "skill", "exp", "skills", "tools", "work", "radius"];

  const filled = fields.filter(f => data?.[f] && String(data[f]).trim()).length;
  const pct = Math.round((filled / fields.length) * 100);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold text-white/30 uppercase tracking-wider">Profile Strength</span>
        <span className="text-xs font-bold text-white/50">{pct}%</span>
      </div>
      <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${pct}%`,
            background: pct < 40 ? "#ef4444" : pct < 70 ? "#f59e0b" : "#22c55e",
          }}
        />
      </div>
    </div>
  );
});
ProfileStrength.displayName = "ProfileStrength";

// ─── AI Insight Card ─────────────────────────────────────────────────────────
const AIInsightCard = memo(({ data, role }) => {
  const readiness = role === "student" ? 45 : role === "professional" ? 72 : 58;
  const missingSkills = role === "student"
    ? ["Data Structures", "System Design"]
    : role === "professional"
    ? ["Cloud Architecture", "Team Leadership"]
    : ["Safety Certification", "Digital Tools"];
  const nextStep = role === "student"
    ? "Complete an internship in your field of interest"
    : role === "professional"
    ? "Get certified in cloud platforms to reach senior roles"
    : "Obtain a government-recognized skill certificate";

  return (
    <ProfileCard icon={Sparkles} title="AI Career Insights" className="border-violet-500/20 bg-gradient-to-br from-[#12121a] to-violet-950/10">
      {/* Readiness */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-white/30 uppercase tracking-wider">Career Readiness</span>
          <span className="text-lg font-black text-white">{readiness}<span className="text-xs text-white/30 ml-0.5">%</span></span>
        </div>
        <div className="h-2 w-full bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-1000 ease-out"
            style={{ width: `${readiness}%` }}
          />
        </div>
      </div>

      {/* Missing skills */}
      <div className="mb-5">
        <p className="text-[11px] font-bold text-white/30 uppercase tracking-wider mb-2">Skills to Develop</p>
        <div className="flex flex-wrap gap-2">
          {missingSkills.map((s, i) => (
            <span key={i} className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[11px] font-semibold text-rose-300/80">
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Next step */}
      <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
        <Zap size={16} className="text-amber-400/60 mt-0.5 shrink-0" />
        <div>
          <p className="text-[11px] font-bold text-white/30 uppercase tracking-wider mb-1">Suggested Next Step</p>
          <p className="text-sm text-white/70 font-medium leading-relaxed">{nextStep}</p>
        </div>
      </div>
    </ProfileCard>
  );
});
AIInsightCard.displayName = "AIInsightCard";

// ─── Avatar ──────────────────────────────────────────────────────────────────
const Avatar = memo(({ name }) => {
  const initials = (name || "U")
    .split(" ")
    .map(w => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600/30 to-indigo-600/30 border border-white/[0.08] flex items-center justify-center">
      <span className="text-2xl font-black text-white/70">{initials}</span>
    </div>
  );
});
Avatar.displayName = "Avatar";

// ─── Role Label ──────────────────────────────────────────────────────────────
const getRoleLabel = (role, data) => {
  if (role === "student") return data?.degree ? `${data.degree} Student` : "Student";
  if (role === "professional") return data?.role || "Professional";
  if (role === "worker") return data?.skill || "Skilled Worker";
  return "User";
};

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function ProfileSetup() {
  const [formData, setFormData] = useState({});
  const [role, setRole] = useState("student");
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  // ── Fetch Profile ──────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5050/api/profile/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          setIsEdit(true);
          setIsLoading(false);
          return;
        }

        const data = await res.json();
        if (data?.profile) {
          setFormData(data.profile.data || {});
          setRole(data.profile.role || "student");
          setIsEdit(false);
        } else {
          setIsEdit(true);
        }
      } catch (err) {
        console.error(err);
        setIsEdit(true);
      }
      setIsLoading(false);
    };

    // Try local first
    const local = localStorage.getItem("profile");
    if (local && local !== "undefined") {
      try {
        setFormData(JSON.parse(local) || {});
        setIsEdit(false);
      } catch { setFormData({}); }
    }

    fetchProfile();
  }, []);

  // ── Save Profile ───────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5050/api/profile/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role, data: formData }),
      });

      const result = await res.json();
      if (!res.ok) {
        alert("Save failed ❌");
        setSaving(false);
        return;
      }

      setFormData(result.profile.data || formData);
      setIsEdit(false);
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  }, [role, formData]);

  const handleFileUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData(prev => ({ ...prev, resume: file.name }));
  }, []);

  // ── Loading State ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-3 text-white/30">
          <div className="w-5 h-5 border-2 border-white/20 border-t-violet-500 rounded-full animate-spin" />
          <span className="text-sm font-medium">Loading profile...</span>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  EDIT MODE
  // ══════════════════════════════════════════════════════════════════════════
  if (isEdit) {
    return (
      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full py-8 px-2">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Edit Profile</h1>
            <p className="text-sm text-white/30 mt-1">Update your information</p>
          </div>
          <button
            onClick={() => setIsEdit(false)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white/40 hover:text-white border border-white/[0.08] hover:border-white/15 bg-white/[0.02] transition-all"
          >
            <X size={16} /> Cancel
          </button>
        </div>

        {/* Role Tabs */}
        <div className="flex bg-white/[0.03] border border-white/[0.08] p-1 rounded-xl mb-8">
          {[
            { key: "student", label: "Student" },
            { key: "professional", label: "Professional" },
            { key: "worker", label: "Worker" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setRole(tab.key)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                role === tab.key
                  ? "bg-white/10 text-white border border-white/[0.06]"
                  : "text-white/30 hover:text-white/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Fields */}
        <div className="space-y-8">
          {/* Common fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <EditField icon={User} label="Full Name" value={formData.name} placeholder="Your full name" onChange={(e) => handleChange("name", e.target.value)} />
            </div>
            <EditField icon={Phone} label="Phone" value={formData.phone} placeholder="Phone number" onChange={(e) => handleChange("phone", e.target.value)} />
            <EditField icon={MapPin} label="Location" value={formData.location} placeholder="City, State" onChange={(e) => handleChange("location", e.target.value)} />
          </div>

          {/* Student-specific */}
          {role === "student" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <EditField icon={GraduationCap} label="College" value={formData.college} placeholder="College name" onChange={(e) => handleChange("college", e.target.value)} />
              </div>
              <EditField icon={BookOpen} label="Degree" value={formData.degree} placeholder="e.g. B.Tech CS" onChange={(e) => handleChange("degree", e.target.value)} />
              <EditSelect label="Year" value={formData.year} options={["", "1st", "2nd", "3rd", "4th"]} onChange={(v) => handleChange("year", v)} />
              <div className="md:col-span-2">
                <EditField icon={Target} label="Interests" value={formData.interests} placeholder="Interests (comma separated)" onChange={(e) => handleChange("interests", e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <EditField icon={Target} label="Career Goal" value={formData.goal} placeholder="e.g. Full Stack Developer" onChange={(e) => handleChange("goal", e.target.value)} />
              </div>
            </div>
          )}

          {/* Professional-specific */}
          {role === "professional" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EditField icon={Briefcase} label="Job Role" value={formData.role} placeholder="e.g. Software Engineer" onChange={(e) => handleChange("role", e.target.value)} />
              <EditField icon={Clock} label="Experience" value={formData.exp} placeholder="e.g. 3 years" onChange={(e) => handleChange("exp", e.target.value)} />
              <div className="md:col-span-2">
                <EditField icon={Briefcase} label="Company" value={formData.company} placeholder="Current company" onChange={(e) => handleChange("company", e.target.value)} />
              </div>
              <EditField icon={Globe} label="Language" value={formData.lang} placeholder="e.g. English, Hindi" onChange={(e) => handleChange("lang", e.target.value)} />
              <EditField icon={DollarSign} label="Expected Salary" value={formData.salary} placeholder="e.g. 12 LPA" onChange={(e) => handleChange("salary", e.target.value)} />
              <div className="md:col-span-2">
                <EditField icon={Wrench} label="Skills" value={formData.skills} placeholder="Skills (comma separated)" onChange={(e) => handleChange("skills", e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <EditSelect label="Career Goal" value={formData.goal} options={["", "Switch", "Growth"]} onChange={(v) => handleChange("goal", v)} />
              </div>
            </div>
          )}

          {/* Worker-specific */}
          {role === "worker" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EditSelect label="Skill Type" value={formData.skill} options={["", "Electrician", "Driver", "Plumber", "Carpenter", "Mason", "Other"]} onChange={(v) => handleChange("skill", v)} />
              <EditSelect label="Experience" value={formData.exp} options={["", "Beginner", "Intermediate", "Expert"]} onChange={(v) => handleChange("exp", v)} />
              <EditField icon={Globe} label="Language" value={formData.lang} placeholder="e.g. Hindi" onChange={(e) => handleChange("lang", e.target.value)} />
              <EditField icon={Wrench} label="Tools" value={formData.tools} placeholder="Tools you use" onChange={(e) => handleChange("tools", e.target.value)} />
              <div className="md:col-span-2">
                <EditField icon={Wrench} label="Skills" value={formData.skills} placeholder="Skills (comma separated)" onChange={(e) => handleChange("skills", e.target.value)} />
              </div>
              <EditSelect label="Work Type" value={formData.work} options={["", "Daily", "Contract", "Full-time"]} onChange={(v) => handleChange("work", v)} />
              <EditField icon={MapPin} label="Work Radius" value={formData.radius} placeholder="e.g. 10 km" onChange={(e) => handleChange("radius", e.target.value)} />
            </div>
          )}

          {/* Resume Upload */}
          <div>
            <label className="text-[11px] font-medium text-white/30 uppercase tracking-wider mb-1.5 block">Upload Resume</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-dashed border-white/[0.1] cursor-pointer hover:border-violet-500/30 transition-colors"
            >
              <Upload size={18} className="text-white/25" />
              <span className="text-sm text-white/40 font-medium">
                {formData.resume || "Choose a PDF or DOCX file"}
              </span>
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileUpload} />
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="mt-8 w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:bg-white/5 disabled:text-white/20 text-white font-semibold text-sm transition-all active:scale-[0.98]"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  VIEW MODE
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full py-8 px-2">
      
      {/* ── Profile Header ────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
        <Avatar name={formData.name} />

        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white tracking-tight">{formData.name || "Your Name"}</h1>
          <p className="text-sm font-semibold text-violet-400/70 mt-0.5">{getRoleLabel(role, formData)}</p>
          {formData.location && (
            <div className="flex items-center gap-1.5 mt-2 text-white/30">
              <MapPin size={13} />
              <span className="text-xs font-medium">{formData.location}</span>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsEdit(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white/60 hover:text-white border border-white/[0.08] hover:border-white/15 bg-white/[0.03] hover:bg-white/[0.06] transition-all active:scale-95"
        >
          <Edit3 size={15} /> Edit Profile
        </button>
      </div>

      {/* ── Strength Bar ──────────────────────────────────────────────────── */}
      <div className="mb-8">
        <ProfileStrength data={formData} role={role} />
      </div>

      {/* ── Cards Grid ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Education Card — student only */}
        {role === "student" && (
          <ProfileCard icon={GraduationCap} title="Education">
            <FieldRow label="College" value={formData.college} />
            <FieldRow label="Degree" value={formData.degree} />
            <FieldRow label="Year" value={formData.year} />
          </ProfileCard>
        )}

        {/* Work Card — professional */}
        {role === "professional" && (
          <ProfileCard icon={Briefcase} title="Work Experience">
            <FieldRow label="Role" value={formData.role} />
            <FieldRow label="Company" value={formData.company} />
            <FieldRow label="Experience" value={formData.exp} />
          </ProfileCard>
        )}

        {/* Work Card — worker */}
        {role === "worker" && (
          <ProfileCard icon={Wrench} title="Work Details">
            <FieldRow label="Skill Type" value={formData.skill} />
            <FieldRow label="Experience" value={formData.exp} />
            <FieldRow label="Work Type" value={formData.work} />
            <FieldRow label="Tools" value={formData.tools} />
          </ProfileCard>
        )}

        {/* Skills Card — all roles */}
        <ProfileCard icon={Zap} title="Skills">
          <SkillChips skills={formData.skills || formData.interests} />
        </ProfileCard>

        {/* Goal Card — all roles */}
        <ProfileCard icon={Target} title="Career Goal">
          <p className="text-sm font-semibold text-white/70 leading-relaxed">
            {formData.goal || "No goal set yet"}
          </p>
        </ProfileCard>

        {/* Preferences Card — professional and worker */}
        {(role === "professional" || role === "worker") && (
          <ProfileCard icon={Globe} title="Preferences">
            {role === "professional" && (
              <>
                <FieldRow label="Expected Salary" value={formData.salary} />
                <FieldRow label="Language" value={formData.lang} />
              </>
            )}
            {role === "worker" && (
              <>
                <FieldRow label="Work Radius" value={formData.radius} />
                <FieldRow label="Language" value={formData.lang} />
              </>
            )}
          </ProfileCard>
        )}

        {/* Contact Card */}
        <ProfileCard icon={Phone} title="Contact">
          <FieldRow label="Phone" value={formData.phone} />
          <FieldRow label="Location" value={formData.location} />
        </ProfileCard>

        {/* Documents Card — if resume exists */}
        {formData.resume && (
          <ProfileCard icon={FileText} title="Documents">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <FileText size={18} className="text-violet-400/60" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white/70 truncate">{formData.resume}</p>
                <p className="text-[11px] text-white/30">Resume</p>
              </div>
            </div>
          </ProfileCard>
        )}

        {/* AI Insights — full width */}
        <div className="md:col-span-2">
          <AIInsightCard data={formData} role={role} />
        </div>
      </div>
    </div>
  );
}
