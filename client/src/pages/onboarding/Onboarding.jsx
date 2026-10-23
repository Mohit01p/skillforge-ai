import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Layers, Coffee, Code2, Server, GitBranch, ArrowRight, Check } from "lucide-react";
import api from "../../context/axios";
import { AuthContext } from "../../context/AuthContext";
import { careerGoals } from "../../data/careerGoals";

const icons = { Layers, Coffee, Code2, Server, GitBranch };

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState(null);
  const [skills, setSkills] = useState([]);
  const [saving, setSaving] = useState(false);
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleSkill = (s) =>
    setSkills((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const handleSubmit = async () => {
    setSaving(true);
    const res = await api.put("/user/onboarding", { careerGoal: goal.id, currentSkills: skills });
    if (setUser) setUser(res.data);
    navigate("/dashboard");
  };

  const btn = "bg-brand hover:bg-brand-hover text-white font-medium rounded-lg py-2.5 text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-40";
  const back = "px-5 py-2.5 rounded-lg text-sm border border-surface-border text-ink hover:bg-surface-raised transition-colors";

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
      {/* step indicator */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3].map((n) => (
          <div key={n} className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
              step >= n ? "bg-brand text-white" : "bg-surface-card border border-surface-border text-muted"}`}>
              {step > n ? <Check size={12} /> : n}
            </div>
            {n < 3 && <div className={`w-8 h-px ${step > n ? "bg-brand" : "bg-surface-border"}`} />}
          </div>
        ))}
      </div>

      <div className="w-full max-w-lg bg-surface-card border border-surface-border rounded-2xl p-6">
        {step === 1 && (
          <>
            <h2 className="text-xl font-bold">What's your career goal?</h2>
            <p className="text-sm text-muted mb-5">Choose the track you want to focus on.</p>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {careerGoals.map((g) => {
                const Icon = icons[g.icon];
                const active = goal?.id === g.id;
                return (
                  <button key={g.id} onClick={() => { setGoal(g); setSkills([]); }}
                    className={`flex items-center gap-3 p-3 rounded-lg border text-left text-sm transition-colors ${
                      active ? "border-brand bg-brand/10 text-brand font-medium" : "border-surface-border bg-surface-raised hover:border-muted"}`}>
                    <span className="w-8 h-8 rounded-md bg-surface flex items-center justify-center"><Icon size={16} /></span>
                    {g.label}
                  </button>
                );
              })}
            </div>
            <button disabled={!goal} onClick={() => setStep(2)} className={`${btn} w-full`}>
              Continue <ArrowRight size={16} />
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-xl font-bold">What do you already know?</h2>
            <p className="text-sm text-muted mb-5">Select all that apply. Be honest — it helps us tailor your path.</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {goal.skills.map((s) => (
                <button key={s} onClick={() => toggleSkill(s)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                    skills.includes(s) ? "border-brand bg-brand/10 text-brand" : "border-surface-border bg-surface-raised text-muted hover:text-ink"}`}>
                  {s}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted mb-4">{skills.length} selected</p>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className={back}>Back</button>
              <button onClick={() => setStep(3)} className={`${btn} flex-1`}>Continue <ArrowRight size={16} /></button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-xl font-bold">You're all set, {user?.name}! 🎉</h2>
            <p className="text-sm text-muted mb-5">Here's your learning profile.</p>
            <div className="bg-surface-raised border border-surface-border rounded-lg p-4 mb-5">
              <p className="text-[11px] tracking-wider text-muted font-semibold mb-1">CAREER GOAL</p>
              <p className="font-medium mb-3">{goal.label}</p>
              <p className="text-[11px] tracking-wider text-muted font-semibold mb-2">SKILLS</p>
              <div className="flex flex-wrap gap-2">
                {skills.length ? skills.map((s) => (
                  <span key={s} className="px-2 py-1 rounded-md text-xs bg-brand/10 text-brand">{s}</span>
                )) : <span className="text-xs text-muted">None selected</span>}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className={back}>Back</button>
              <button onClick={handleSubmit} disabled={saving} className={`${btn} flex-1`}>
                {saving ? "Saving..." : "Launch Dashboard"} <ArrowRight size={16} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Onboarding;