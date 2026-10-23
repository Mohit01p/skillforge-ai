import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Zap, Eye, EyeOff, ArrowRight } from "lucide-react";
import api from "../context/axios";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", form);
      login(res.data.user, res.data.token);
      navigate("/onboarding");
    } catch (err) {
      setError(err.response?.data?.message || "Register failed");
    }
  };

  const input =
    "w-full mt-1 bg-surface-raised border border-surface-border rounded-lg px-3 py-2.5 text-sm text-ink placeholder-muted focus:outline-none focus:border-brand";

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-lg bg-brand flex items-center justify-center">
            <Zap size={18} className="text-white" />
          </div>
          <span className="font-semibold">SkillForge AI</span>
        </div>

        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-sm text-muted mb-6">Start your personalized placement prep.</p>

        <form onSubmit={handleSubmit} className="bg-surface-card border border-surface-border rounded-2xl p-5 space-y-4">
          {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-2">{error}</p>}

          <div>
            <label className="text-[11px] tracking-wider text-muted font-semibold">NAME</label>
            <input required placeholder="Your name" className={input}
              onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>

          <div>
            <label className="text-[11px] tracking-wider text-muted font-semibold">EMAIL</label>
            <input type="email" required placeholder="you@example.com" className={input}
              onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>

          <div>
            <label className="text-[11px] tracking-wider text-muted font-semibold">PASSWORD</label>
            <div className="relative">
              <input type={show ? "text" : "password"} required placeholder="••••••••" className={`${input} pr-10`}
                onChange={(e) => setForm({ ...form, password: e.target.value })} />
              <button type="button" onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 text-muted hover:text-ink">
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button className="w-full bg-brand hover:bg-brand-hover text-white font-medium rounded-lg py-2.5 text-sm flex items-center justify-center gap-2 transition-colors">
            Create account <ArrowRight size={16} />
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-5">
          Have an account? <Link to="/login" className="text-brand font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;