import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ui/Toast";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Mic, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    navigate("/dashboard");
  }, [navigate]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Minimum 6 characters";
    if (form.password !== form.confirm) e.confirm = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      toast({
        title: "Registration failed",
        description: err.response?.data?.message || "Something went wrong",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/30 mb-4">
            <Mic className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Interview<span className="text-primary">AI</span>
          </h1>
          <p className="text-muted-foreground mt-2">Create your account</p>
        </div>

        <div className="glass rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full Name" placeholder="Jane Doe" value={form.name} onChange={set("name")} error={errors.name} />
            <Input label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} error={errors.email} autoComplete="email" />

            <div className="relative">
              <Input
                label="Password"
                type={showPw ? "text" : "password"}
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={set("password")}
                error={errors.password}
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-8 text-muted-foreground hover:text-foreground">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Input
              label="Confirm Password"
              type={showPw ? "text" : "password"}
              placeholder="Re-enter password"
              value={form.confirm}
              onChange={set("confirm")}
              error={errors.confirm}
            />

            <Button type="submit" size="lg" loading={loading} className="w-full mt-2">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
