import { useState, useContext } from "react";
import api from "../../context/axios";
import { AuthContext } from "../../context/AuthContext";
import { careerGoals } from "../../data/careerGoals";

const diffStyle = {
  Beginner: "bg-brand/10 text-brand",
  Intermediate: "bg-accent/10 text-accent",
  Advanced: "bg-red-500/10 text-red-400",
};

const ProjectIdeas = () => {
  const { user } = useContext(AuthContext);
  const goal = careerGoals.find((g) => g.id === user?.careerGoal);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/ai/project-ideas", { skills: user.currentSkills, goal: goal?.label });
      setResult(res.data);
    } catch {
      setError("AI is busy. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold">Project Ideas</h1>
      <p className="text-sm text-muted mb-6">Portfolio projects that fit your skills</p>

      <button onClick={generate} disabled={loading}
        className="w-full bg-brand hover:bg-brand-hover disabled:opacity-50 text-white font-medium rounded-lg py-2.5 text-sm mb-2">
        {loading ? "Generating ideas..." : result ? "Generate New Ideas" : "Generate Project Ideas"}
      </button>
      {error && <p className="text-sm text-red-400 mb-3">{error}</p>}

      {result && (
        <div className="space-y-4 mt-4">
          {result.projects.map((p, i) => (
            <div key={i} className="bg-surface-card border border-surface-border rounded-xl p-5">
              <div className="flex justify-between items-start gap-3 mb-2">
                <p className="font-semibold">{p.title}</p>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded shrink-0 ${diffStyle[p.difficulty] || diffStyle.Intermediate}`}>
                  {p.difficulty}
                </span>
              </div>
              <p className="text-sm text-muted mb-3">{p.description}</p>
              {p.features && (
                <ul className="list-disc ml-5 text-sm space-y-0.5 mb-3">
                  {p.features.map((f, j) => <li key={j}>{f}</li>)}
                </ul>
              )}
              <div className="flex flex-wrap items-center gap-2">
                {p.techStack.map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-md text-xs bg-surface-raised text-muted">{t}</span>
                ))}
                {p.estimatedDays && <span className="text-xs text-muted ml-auto">~{p.estimatedDays} days</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectIdeas;