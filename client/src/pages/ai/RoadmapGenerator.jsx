import { useState, useContext } from "react";
import api from "../../context/axios";
import { AuthContext } from "../../context/AuthContext";
import { careerGoals } from "../../data/careerGoals";

const RoadmapGenerator = () => {
  const { user } = useContext(AuthContext);
  const goal = careerGoals.find((g) => g.id === user?.careerGoal);
  const [months, setMonths] = useState(3);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/ai/roadmap-generator", {
        goal: goal?.label, currentSkills: user.currentSkills, months,
      });
      setResult(res.data);
    } catch {
      setError("AI is busy. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold">Roadmap Generator</h1>
      <p className="text-sm text-muted mb-6">A month-by-month plan for your goal</p>

      <div className="bg-surface-card border border-surface-border rounded-xl p-5 mb-5 space-y-4">
        <div className="bg-brand/10 border border-brand/20 rounded-lg p-3 text-sm">
          <span className="text-muted">Goal: </span><span className="text-brand font-medium">{goal?.label}</span>
          <span className="text-muted text-xs block mt-0.5">Change your goal from Profile → Redo Onboarding.</span>
        </div>
        <div>
          <label className="text-[11px] tracking-wider text-muted font-semibold">TIME AVAILABLE: {months} MONTH{months > 1 ? "S" : ""}</label>
          <input type="range" min="1" max="12" value={months} onChange={(e) => setMonths(Number(e.target.value))}
            className="w-full mt-2 accent-brand" />
        </div>
        <button onClick={generate} disabled={loading}
          className="w-full bg-brand hover:bg-brand-hover disabled:opacity-50 text-white font-medium rounded-lg py-2.5 text-sm">
          {loading ? "Generating..." : result ? "Regenerate Roadmap" : "Generate Roadmap"}
        </button>
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>

      {result && (
        <div className="space-y-3">
          {result.map((m) => (
            <div key={m.month} className="bg-surface-card border border-surface-border rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-full bg-brand text-white text-sm font-semibold flex items-center justify-center">{m.month}</span>
                <div>
                  <p className="font-semibold">{m.title}</p>
                  <p className="text-xs text-muted">{m.goal}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {m.topics.map((t, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-md text-xs bg-surface-raised text-muted">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoadmapGenerator;