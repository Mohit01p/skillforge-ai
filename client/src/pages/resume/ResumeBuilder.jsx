import { useState, useContext } from "react";
import { X, Plus, Copy, Check } from "lucide-react";
import api from "../../context/axios";
import { AuthContext } from "../../context/AuthContext";
import { careerGoals } from "../../data/careerGoals";

const input =
  "w-full bg-surface-raised border border-surface-border rounded-lg px-3 py-2 text-sm placeholder-muted focus:outline-none focus:border-brand";

const Card = ({ title, children }) => (
  <div className="bg-surface-card border border-surface-border rounded-xl p-5 mb-4">
    <p className="text-[11px] tracking-wider text-muted font-semibold mb-3">{title}</p>
    {children}
  </div>
);

const ResumeBuilder = ({ onGenerated }) => {
  const { user } = useContext(AuthContext);
  const goal = careerGoals.find((g) => g.id === user?.careerGoal);

  const [info, setInfo] = useState({ name: user?.name || "", email: user?.email || "", phone: "" });
  const [skills, setSkills] = useState(user?.currentSkills || []);
  const [skillInput, setSkillInput] = useState("");
  const [experience, setExperience] = useState([{ company: "", role: "", duration: "" }]);
  const [education, setEducation] = useState([{ institution: "", degree: "", year: "" }]);
  const [projects, setProjects] = useState([{ name: "", techStack: "", description: "" }]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) setSkills([...skills, s]);
    setSkillInput("");
  };

  const edit = (list, setList, i, field, value) => {
    const copy = [...list];
    copy[i] = { ...copy[i], [field]: value };
    setList(copy);
  };

  const generate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/ai/build-resume", {
        name: info.name, email: info.email, careerGoal: goal?.label,
        skills, experience, education, projects,
      });
      setResult(res.data);
      onGenerated({ ...res.data, name: info.name, email: info.email });
    } catch {
      setError("AI is busy. Please try again.");
    }
    setLoading(false);
  };

  const copy = () => {
    const r = result;
    const text = [
      info.name, `${info.email}${info.phone ? " | " + info.phone : ""}`, "",
      "SUMMARY", r.summary, "",
      "SKILLS", r.skillsSection.join(", "), "",
      "EXPERIENCE", ...r.experienceBullets.map((e) => `${e.company} - ${e.role}\n${e.bullets.map((b) => "• " + b).join("\n")}`), "",
      "PROJECTS", ...r.projectBullets.map((p) => `${p.name}\n${p.bullets.map((b) => "• " + b).join("\n")}`), "",
      "EDUCATION", r.educationLine,
    ].join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const label = "text-[11px] text-muted mb-1 block";

  return (
    <div>
      <Card title="PERSONAL INFORMATION">
        <div className="grid sm:grid-cols-3 gap-3">
          <div><span className={label}>Name</span><input className={input} value={info.name} onChange={(e) => setInfo({ ...info, name: e.target.value })} /></div>
          <div><span className={label}>Email</span><input className={input} value={info.email} onChange={(e) => setInfo({ ...info, email: e.target.value })} /></div>
          <div><span className={label}>Phone</span><input className={input} placeholder="+91 ..." value={info.phone} onChange={(e) => setInfo({ ...info, phone: e.target.value })} /></div>
        </div>
      </Card>

      <Card title="SKILLS">
        <div className="flex gap-2 mb-3">
          <input className={input} placeholder="Add a skill and press Enter" value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addSkill()} />
          <button onClick={addSkill} className="px-3 rounded-lg border border-surface-border hover:bg-surface-raised"><Plus size={16} /></button>
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.map((s) => (
            <span key={s} className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-brand/10 text-brand">
              {s}<button onClick={() => setSkills(skills.filter((x) => x !== s))}><X size={12} /></button>
            </span>
          ))}
        </div>
      </Card>

      <Card title="EXPERIENCE">
        {experience.map((e, i) => (
          <div key={i} className="grid sm:grid-cols-3 gap-3 mb-3">
            <input className={input} placeholder="Company" value={e.company} onChange={(ev) => edit(experience, setExperience, i, "company", ev.target.value)} />
            <input className={input} placeholder="Role" value={e.role} onChange={(ev) => edit(experience, setExperience, i, "role", ev.target.value)} />
            <input className={input} placeholder="Duration" value={e.duration} onChange={(ev) => edit(experience, setExperience, i, "duration", ev.target.value)} />
          </div>
        ))}
        <button onClick={() => setExperience([...experience, { company: "", role: "", duration: "" }])} className="text-sm text-brand">+ Add More</button>
      </Card>

      <Card title="EDUCATION">
        {education.map((e, i) => (
          <div key={i} className="grid sm:grid-cols-3 gap-3 mb-3">
            <input className={input} placeholder="Institution" value={e.institution} onChange={(ev) => edit(education, setEducation, i, "institution", ev.target.value)} />
            <input className={input} placeholder="Degree" value={e.degree} onChange={(ev) => edit(education, setEducation, i, "degree", ev.target.value)} />
            <input className={input} placeholder="Year" value={e.year} onChange={(ev) => edit(education, setEducation, i, "year", ev.target.value)} />
          </div>
        ))}
        <button onClick={() => setEducation([...education, { institution: "", degree: "", year: "" }])} className="text-sm text-brand">+ Add More</button>
      </Card>

      <Card title="PROJECTS">
        {projects.map((p, i) => (
          <div key={i} className="grid sm:grid-cols-3 gap-3 mb-3">
            <input className={input} placeholder="Name" value={p.name} onChange={(ev) => edit(projects, setProjects, i, "name", ev.target.value)} />
            <input className={input} placeholder="Tech stack" value={p.techStack} onChange={(ev) => edit(projects, setProjects, i, "techStack", ev.target.value)} />
            <input className={input} placeholder="Short description" value={p.description} onChange={(ev) => edit(projects, setProjects, i, "description", ev.target.value)} />
          </div>
        ))}
        <button onClick={() => setProjects([...projects, { name: "", techStack: "", description: "" }])} className="text-sm text-brand">+ Add More</button>
      </Card>

      <button onClick={generate} disabled={loading || !info.name}
        className="w-full bg-brand hover:bg-brand-hover disabled:opacity-50 text-white font-medium rounded-lg py-3 text-sm mb-2">
        {loading ? "AI is building your resume..." : result ? "Regenerate Resume" : "Generate Resume"}
      </button>
      {error && <p className="text-sm text-red-400 mb-3">{error}</p>}

      {result && (
        <div className="bg-surface-card border border-surface-border rounded-xl mt-4 overflow-hidden">
          <div className="flex justify-between items-center px-5 py-3 border-b border-surface-border">
            <p className="text-sm font-semibold">Your AI-Generated Resume</p>
            <button onClick={copy} className="flex items-center gap-2 text-xs bg-brand hover:bg-brand-hover text-white px-3 py-1.5 rounded-lg">
              {copied ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy Resume</>}
            </button>
          </div>
          <div className="p-6 space-y-4 text-sm">
            <div>
              <p className="text-xl font-bold">{info.name}</p>
              <p className="text-muted">{info.email}{info.phone && ` | ${info.phone}`}</p>
            </div>
            <div><p className="text-[11px] tracking-widest text-brand font-semibold mb-1">SUMMARY</p><p>{result.summary}</p></div>
            <div>
              <p className="text-[11px] tracking-widest text-brand font-semibold mb-2">SKILLS</p>
              <div className="flex flex-wrap gap-2">
                {result.skillsSection.map((s) => <span key={s} className="px-2.5 py-1 rounded-md text-xs bg-surface-raised">{s}</span>)}
              </div>
            </div>
            <div>
              <p className="text-[11px] tracking-widest text-brand font-semibold mb-2">EXPERIENCE</p>
              {result.experienceBullets.map((e, i) => (
                <div key={i} className="mb-3">
                  <p className="font-semibold">{e.company} — {e.role}</p>
                  <ul className="list-disc ml-5 text-muted space-y-0.5">{e.bullets.map((b, j) => <li key={j}>{b}</li>)}</ul>
                </div>
              ))}
            </div>
            <div>
              <p className="text-[11px] tracking-widest text-brand font-semibold mb-2">PROJECTS</p>
              {result.projectBullets.map((p, i) => (
                <div key={i} className="mb-3">
                  <p className="font-semibold">{p.name}</p>
                  <ul className="list-disc ml-5 text-muted space-y-0.5">{p.bullets.map((b, j) => <li key={j}>{b}</li>)}</ul>
                </div>
              ))}
            </div>
            <div><p className="text-[11px] tracking-widest text-brand font-semibold mb-1">EDUCATION</p><p>{result.educationLine}</p></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeBuilder;