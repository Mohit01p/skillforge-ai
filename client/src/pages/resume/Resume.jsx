import { useState } from "react";
import { FileText, Target } from "lucide-react";
import ResumeBuilder from "./ResumeBuilder";
import ATSScorer from "./ATSScorer";

const Resume = () => {
  const [tab, setTab] = useState("builder");
  const [generated, setGenerated] = useState(null);

  const tabs = [
    { id: "builder", label: "Resume Builder", icon: FileText },
    { id: "ats", label: "ATS Scorer", icon: Target },
  ];

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold">Resume</h1>
      <p className="text-sm text-muted mb-5">Build an AI-written resume and score it against a job</p>

      <div className="flex gap-2 mb-6">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm border transition-colors ${
              tab === id ? "border-brand bg-brand/10 text-brand font-medium" : "border-surface-border text-muted hover:text-ink"}`}>
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      <div className={tab === "builder" ? "" : "hidden"}>
        <ResumeBuilder onGenerated={setGenerated} />
      </div>
      {tab === "ats" && <ATSScorer resumeContent={generated} />}
    </div>
  );
};

export default Resume;