import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../api";
import { useToast } from "../components/ui/Toast";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import { getInitials, formatDate } from "../utils/helpers";
import { User, Mail, Calendar, Award, Target, TrendingUp } from "lucide-react";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: user?.name || "", avatar: user?.avatar || "" });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await authAPI.updateProfile(form);
      updateUser(data.user);
      toast({ title: "Profile updated!", type: "success" });
    } catch (err) {
      toast({ title: "Update failed", description: err.response?.data?.message, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-3xl font-bold text-foreground">Profile</h1>

      {/* Avatar + stats */}
      <Card>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold shrink-0">
            {getInitials(user?.name)}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-bold text-foreground">{user?.name}</h2>
            <p className="text-muted-foreground">{user?.email}</p>
            <p className="text-xs text-muted-foreground mt-1 flex items-center justify-center sm:justify-start gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Joined {formatDate(user?.createdAt || new Date())}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
          {[
            { label: "Interviews", value: user?.interviewCount ?? 0, icon: Target, color: "text-blue-400" },
            { label: "Avg Score", value: user?.averageScore ? `${user.averageScore}` : "—", icon: TrendingUp, color: "text-emerald-400" },
            { label: "Completed", value: user?.interviewCount ?? 0, icon: Award, color: "text-purple-400" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="text-center">
              <div className={`text-2xl font-bold ${color}`}>{value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Edit form */}
      <Card>
        <h2 className="font-semibold text-foreground text-lg mb-5">Edit Profile</h2>
        <form onSubmit={handleSave} className="space-y-5">
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-muted-foreground shrink-0" />
            <Input
              label="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="flex-1"
            />
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
            <Input label="Email" value={user?.email} disabled className="flex-1 opacity-50 cursor-not-allowed" />
          </div>
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-muted-foreground shrink-0" />
            <Input
              label="Avatar URL (optional)"
              placeholder="https://..."
              value={form.avatar}
              onChange={(e) => setForm({ ...form, avatar: e.target.value })}
              className="flex-1"
            />
          </div>
          <Button type="submit" loading={saving}>Save Changes</Button>
        </form>
      </Card>
    </div>
  );
}
