import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Zap, Mail, Lock, Eye, EyeOff, ArrowRight, Compass, Brain, BarChart3, Sun, Moon } from "lucide-react";
import api from "../context/axios";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const features = [
  { icon: Compass, text: "Personalized Learning Paths" },
  { icon: Brain, text: "AI Career Assistant" },
  { icon: BarChart3, text: "Track Progress" },
];

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/login", form);
      login(res.data.user, res.data.token);
      navigate(res.data.user.isOnboarded ? "/dashboard" : "/onboarding");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
    setLoading(false);
  };

  const field =
    "w-full bg-surface-raised border border-surface-border rounded-xl pl-10 pr-4 py-3.5 text-sm text-ink placeholder-muted focus:outline-none focus:border-brand transition-colors";

  return (
    <div className="relative min-h-screen bg-surface overflow-hidden">
      {/* background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 20% 100%, rgb(var(--brand) / 0.18), transparent 55%), radial-gradient(ellipse at 90% 0%, rgb(var(--brand) / 0.10), transparent 50%)",
        }}
      />
      {/* glowing arc */}
      <div className="hidden lg:block absolute -left-40 -bottom-56 w-[560px] h-[560px] rounded-full border border-brand/40 pointer-events-none">
        <span className="absolute top-[88px] right-[150px] w-3 h-3 rounded-full bg-brand shadow-[0_0_16px_rgb(var(--brand))]" />
        <div className="absolute inset-10 rounded-full bg-brand/15 blur-2xl" />
        <div className="absolute inset-16 rounded-full border border-brand/30" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 min-h-screen flex flex-col">
        {/* top bar */}
        <header className="flex items-center justify-between py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center">
              <Zap size={20} className="text-white" />
            </div>
            <span className="text-lg font-semibold">SkillForge AI</span>
          </div>
          <div className="flex items-center gap-5">
            <p className="hidden sm:block text-sm text-muted">Learn · Build · Grow</p>
            <button onClick={toggle} aria-label="Toggle theme"
              className="w-9 h-9 rounded-lg border border-surface-border bg-surface-card text-muted hover:text-ink flex items-center justify-center transition-colors">
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </header>

        <main className="flex-1 grid lg:grid-cols-2 gap-12 items-center pb-10">
          {/* hero */}
          <section className="hidden lg:block">
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand/10 text-brand text-sm font-medium mb-6">
              Your AI-Powered Learning Companion
            </span>
            <h1 className="text-6xl font-bold leading-[1.1]">
              Build Skills.
              <br />
              <span className="text-brand">Shape Your Future.</span>
            </h1>
            <p className="text-lg text-muted mt-6 max-w-md">
              Personalized roadmaps, AI-powered guidance, and the tools you need to grow in your career.
            </p>
            <div className="flex gap-8 mt-10">
              {features.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <span className="w-12 h-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0">
                    <Icon size={22} />
                  </span>
                  <span className="text-sm text-muted leading-snug max-w-[90px]">{text}</span>
                </div>
              ))}
            </div>
          </section>

          {/* sign-in card */}
          <section className="w-full max-w-md mx-auto lg:ml-auto">
            <form onSubmit={handleSubmit}
              className="bg-surface-card/90 backdrop-blur border border-surface-border rounded-3xl p-8 shadow-xl shadow-brand/5">
              <div className="w-14 h-14 rounded-2xl bg-brand flex items-center justify-center mx-auto mb-5">
                <Zap size={26} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold text-center">Welcome back</h2>
              <p className="text-sm text-muted text-center mt-2 mb-7">Sign in to continue your learning journey.</p>

              {error && (
                <p className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg p-2.5 mb-4">{error}</p>
              )}

              <label className="text-[11px] tracking-wider text-muted font-semibold">EMAIL</label>
              <div className="relative mt-2 mb-5">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input type="email" required placeholder="you@example.com" className={field}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>

              <label className="text-[11px] tracking-wider text-muted font-semibold">PASSWORD</label>
              <div className="relative mt-2 mb-6">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input type={show ? "text" : "password"} required placeholder="••••••••" className={`${field} pr-11`}
                  onChange={(e) => setForm({ ...form, password: e.target.value })} />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <button disabled={loading}
                className="w-full bg-gradient-to-r from-brand to-brand-hover hover:opacity-90 disabled:opacity-60 text-white font-semibold rounded-xl py-3.5 text-sm flex items-center justify-center gap-2 transition-opacity shadow-lg shadow-brand/25">
                {loading ? "Signing in..." : "Sign in"} {!loading && <ArrowRight size={16} />}
              </button>

              <p className="text-center text-sm text-muted mt-6">
                No account? <Link to="/register" className="text-brand font-medium">Create one free</Link>
              </p>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Login;