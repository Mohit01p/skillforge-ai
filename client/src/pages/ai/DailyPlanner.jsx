import { useState, useContext } from "react";
import { Check } from "lucide-react";
import api from "../../context/axios";
import { AuthContext } from "../../context/AuthContext";
import { careerGoals } from "../../data/careerGoals";

const tagStyle = {
  Study: "bg-brand/10 text-brand",
  Project: "bg-brand/10 text-brand",
  DSA: "bg-accent/10 text-accent",
  Review: "bg-accent/10 text-accent",
};

const DailyPlanner = () => {
  const { user } = useContext(AuthContext);
  const goal = careerGoals.find((g) => g.id === user?.careerGoal);
  const pending = goal ? goal.skills.filter((s) => !user.currentSkills.includes(s)) : [];

  const [topics, setTopics] = useState(pending.slice(0, 4).join(", "));
  const [hours, setHours] = useState(2);
  const [plan, setPlan] = useState(null);
  const [done, setDone] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/ai/daily-planner", {
        remainingTopics: topics.split(",").map((s) => s.trim()).filter(Boolean),
        hours,
      });
      setPlan(res.data);
      setDone([]);
    } catch {
      setError("AI is busy. Please try again.");
    }
    setLoading(false);
  };

  const toggle = (i) => setDone((d) => (d.includes(i) ? d.filter((x) => x !== i) : [...d, i]));
  const pct = plan ? Math.round((done.length / plan.tasks.length) * 100) : 0;
  const date = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold">Daily Planner</h1>
      <p className="text-sm text-muted mb-6">{date}</p>

      <div className="bg-surface-card border border-surface-border rounded-xl p-5 mb-4 space-y-3">
        <div>
          <label className="text-[11px] tracking-wider text-muted font-semibold">TOPICS TO COVER</label>
          <input value={topics} onChange={(e) => setTopics(e.target.value)}
            placeholder="React, Node.js, MongoDB"
            className="w-full mt-1 bg-surface-raised border border-surface-border rounded-lg px-3 py-2.5 text-sm placeholder-muted focus:outline-none focus:border-brand" />
        </div>
        <div>
          <label className="text-[11px] tracking-wider text-muted font-semibold">HOURS AVAILABLE: {hours}</label>
          <input type="range" min="1" max="8" value={hours} onChange={(e) => setHours(Number(e.target.value))}
            className="w-full mt-2 accent-brand" />
        </div>
        <button onClick={generate} disabled={loading || !topics.trim()}
          className="w-full bg-brand hover:bg-brand-hover disabled:opacity-50 text-white font-medium rounded-lg py-2.5 text-sm">
          {loading ? "Planning your day..." : plan ? "Regenerate Plan" : "Plan My Day"}
        </button>
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>

      {plan && (
        <>
          <div className="bg-surface-card border border-surface-border rounded-xl p-4 mb-3">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-[11px] tracking-wider text-muted font-semibold">TODAY'S PLAN</span>
              <span className="text-brand font-medium">{done.length}/{plan.tasks.length} done</span>
            </div>
            <div className="h-1.5 bg-surface-raised rounded-full">
              <div className="h-1.5 bg-brand rounded-full transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>

          <div className="space-y-2">
            {plan.tasks.map((t, i) => {
              const checked = done.includes(i);
              return (
                <div key={i} onClick={() => toggle(i)}
                  className="flex items-center gap-3 bg-surface-card border border-surface-border rounded-xl px-4 py-3 cursor-pointer hover:border-brand/40 transition-colors">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                    checked ? "bg-brand border-brand text-white" : "border-muted"}`}>
                    {checked && <Check size={12} />}
                  </span>
                  <span className={`flex-1 text-sm ${checked ? "line-through text-muted" : ""}`}>{t.task}</span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${tagStyle[t.category] || tagStyle.Study}`}>{t.category}</span>
                  <span className="text-xs text-muted w-12 text-right">{t.minutes} min</span>
                </div>
              );
            })}
          </div>

          {plan.motivationalNote && (
            <p className="text-sm text-brand bg-brand/10 border border-brand/20 rounded-xl p-4 mt-4">{plan.motivationalNote}</p>
          )}
        </>
      )}
    </div>
  );
};

export default DailyPlanner;