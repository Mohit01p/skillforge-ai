import { useState, useContext } from "react";
import api from "../../context/axios";
import { AuthContext } from "../../context/AuthContext";

const roles = [
  "MERN Developer", "Java Backend Developer", "Python Developer", "DevOps Engineer",
  "DSA and Competitive Programming", "Frontend Developer", "Full Stack Developer", "Data Scientist",
];

const SkillGap = () => {
  const { user } = useContext(AuthContext);
  const [role, setRole] = useState(roles[0]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/ai/skill-gap", { targetRole: role, userSkills: user.currentSkills });
      setResult(res.data);
    } catch {
      setError("AI is busy. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold">Skill Gap Analyzer</h1>
      <p className="text-sm text-muted mb-6">See what's missing for your target role</p>

      <div className="bg-surface-card border border-surface-border rounded-xl p-5 mb-5 space-y-4">
        <div>
          <label className="text-[11px] tracking-wider text-muted font-semibold">TARGET ROLE</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}
            className="w-full mt-1 bg-surface-raised border border-surface-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand">
            {roles.map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <p className="text-[11px] tracking-wider text-muted font-semibold mb-2">YOUR SKILLS</p>
          <div className="flex flex-wrap gap-2">
            {user.currentSkills.length
              ? user.currentSkills.map((s) => <span key={s} className="px-2.5 py-1 rounded-md text-xs bg-brand/10 text-brand">{s}</span>)
              : <span className="text-sm text-muted">No skills saved. Add them on Profile.</span>}
          </div>
        </div>
        <button onClick={analyze} disabled={loading}
          className="w-full bg-brand hover:bg-brand-hover disabled:opacity-50 text-white font-medium rounded-lg py-2.5 text-sm">
          {loading ? "Analyzing..." : "Analyze Skill Gap"}
        </button>
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>

      {result && (
        <div className="space-y-4">
          <div className="bg-surface-card border border-surface-border rounded-xl p-5">
            <div className="flex justify-between items-end mb-2">
              <p className="text-[11px] tracking-wider text-muted font-semibold">READINESS</p>
              <p className="text-2xl font-bold text-brand">{result.readinessPercent}%</p>
            </div>
            <div className="h-1.5 bg-surface-raised rounded-full">
              <div className="h-1.5 bg-brand rounded-full" style={{ width: `${result.readinessPercent}%` }} />
            </div>
            <p className="text-xs text-muted mt-2">Estimated time: {result.estimatedTime}</p>
          </div>

          <div className="bg-surface-card border border-surface-border rounded-xl p-5">
            <p className="text-[11px] tracking-wider text-muted font-semibold mb-3">MISSING SKILLS</p>
            <div className="flex flex-wrap gap-2">
              {result.missingSkills.map((s) => (
                <span key={s} className="px-2.5 py-1 rounded-md text-xs bg-red-500/10 text-red-400">{s}</span>
              ))}
            </div>
          </div>

          <div className="bg-surface-card border border-surface-border rounded-xl p-5">
            <p className="text-[11px] tracking-wider text-muted font-semibold mb-3">LEARNING PRIORITY</p>
            {result.priorityOrder.map((s, i) => (
              <div key={s} className="flex items-center gap-3 py-1.5">
                <span className="w-6 h-6 rounded-full bg-brand/10 text-brand text-xs font-semibold flex items-center justify-center">{i + 1}</span>
                <span className="text-sm">{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillGap;