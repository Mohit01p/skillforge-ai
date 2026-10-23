import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";
import api from "../context/axios";
import { AuthContext } from "../context/AuthContext";
import { careerGoals } from "../data/careerGoals";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const goal = careerGoals.find((g) => g.id === user?.careerGoal);

  const [editing, setEditing] = useState(false);
  const [skills, setSkills] = useState(user?.currentSkills || []);
  const [saved, setSaved] = useState(false);

  if (!user) return null;

  const total = goal?.skills.length || 1;
  const readiness = Math.min(100, Math.round((user.currentSkills.length / total) * 100));
  const barColor = readiness >= 70 ? "bg-brand" : readiness >= 40 ? "bg-accent" : "bg-red-500";

  const toggle = (s) =>
    setSkills((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));

  const save = async () => {
    const res = await api.put("/user/onboarding", { careerGoal: user.careerGoal, currentSkills: skills });
    setUser(res.data);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const cancel = () => {
    setSkills(user.currentSkills);
    setEditing(false);
  };

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      <div className="bg-surface-card border border-surface-border rounded-xl p-6 mb-4">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center text-2xl font-bold text-white">
            {user.name[0].toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-semibold">{user.name}</p>
            <p className="text-sm text-muted">{user.email}</p>
            <span className="inline-block mt-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-brand/10 text-brand">
              {goal?.label}
            </span>
          </div>
        </div>

        <div className="border-t border-surface-border pt-4">
          <div className="flex justify-between items-end mb-2">
            <p className="text-[11px] tracking-wider text-muted font-semibold">PLACEMENT READINESS</p>
            <p className="text-xl font-bold">{readiness}%</p>
          </div>
          <div className="h-1.5 bg-surface-raised rounded-full">
            <div className={`h-1.5 rounded-full ${barColor}`} style={{ width: `${readiness}%` }} />
          </div>
          <p className="text-xs text-muted mt-2">{user.currentSkills.length} of {total} skills mastered</p>
        </div>
      </div>

      <div className="bg-surface-card border border-surface-border rounded-xl p-6 mb-4">
        <div className="flex justify-between items-center mb-4">
          <p className="text-[11px] tracking-wider text-muted font-semibold">CURRENT SKILLS</p>
          {!editing && (
            <button onClick={() => setEditing(true)} className="flex items-center gap-1 text-sm text-brand">
              <Pencil size={13} /> Edit Skills
            </button>
          )}
        </div>

        {saved && <p className="text-sm text-brand mb-3">✓ Skills updated</p>}

        {!editing ? (
          <div className="flex flex-wrap gap-2">
            {user.currentSkills.length
              ? user.currentSkills.map((s) => (
                  <span key={s} className="px-2.5 py-1 rounded-md text-xs bg-brand/10 text-brand">{s}</span>
                ))
              : <span className="text-sm text-muted">No skills added yet.</span>}
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2 mb-4">
              {goal.skills.map((s) => (
                <button key={s} onClick={() => toggle(s)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                    skills.includes(s) ? "border-brand bg-brand/10 text-brand" : "border-surface-border bg-surface-raised text-muted"}`}>
                  {s}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={save} className="bg-brand hover:bg-brand-hover text-white text-sm px-4 py-2 rounded-lg">Save</button>
              <button onClick={cancel} className="text-sm px-4 py-2 rounded-lg border border-surface-border hover:bg-surface-raised">Cancel</button>
            </div>
          </>
        )}
      </div>

      <div className="bg-surface-card border border-surface-border rounded-xl p-6">
        <p className="text-[11px] tracking-wider text-muted font-semibold mb-3">ACCOUNT</p>
        <button onClick={() => navigate("/onboarding")}
          className="text-sm px-4 py-2 rounded-lg border border-surface-border hover:bg-surface-raised">
          Redo Onboarding
        </button>
      </div>
    </div>
  );
};

export default Profile;