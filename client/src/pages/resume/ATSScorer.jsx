import { useState } from "react";
import api from "../../context/axios";

const ATSScorer = ({ resumeContent }) => {
  const [jd, setJd] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!resumeContent) {
    return (
      <p className="text-sm text-accent bg-accent/10 border border-accent/20 rounded-xl p-4">
        Build a resume first in the Resume Builder tab, then come back to score it.
      </p>
    );
  }

  const check = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/ai/ats-score", { resumeContent, jobDescription: jd });
      setResult(res.data);
    } catch {
      setError("AI is busy. Please try again.");
    }
    setLoading(false);
  };

  const tone = (n) => (n >= 80 ? ["text-brand", "bg-brand"] : n >= 60 ? ["text-accent", "bg-accent"] : ["text-red-400", "bg-red-500"]);

  if (result) {
    const [txt, bg] = tone(result.score);
    return (
      <div className="space-y-4">
        <div className="bg-surface-card border border-surface-border rounded-xl p-5">
          <div className="flex justify-between items-end mb-2">
            <p className="text-[11px] tracking-wider text-muted font-semibold">ATS SCORE</p>
            <p className={`text-3xl font-bold ${txt}`}>{result.score}%</p>
          </div>
          <div className="h-1.5 bg-surface-raised rounded-full mb-3">
            <div className={`h-1.5 rounded-full ${bg}`} style={{ width: `${result.score}%` }} />
          </div>
          <p className="text-sm text-muted">{result.verdict}</p>
        </div>

        <div className="bg-surface-card border border-surface-border rounded-xl p-5 space-y-3">
          <p className="text-[11px] tracking-wider text-muted font-semibold">SECTION BREAKDOWN</p>
          {Object.entries(result.sectionScores).map(([k, v]) => (
            <div key={k}>
              <div className="flex justify-between text-sm mb-1"><span className="capitalize">{k}</span><span className="text-muted">{v}%</span></div>
              <div className="h-1.5 bg-surface-raised rounded-full"><div className={`h-1.5 rounded-full ${tone(v)[1]}`} style={{ width: `${v}%` }} /></div>
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-surface-card border border-surface-border rounded-xl p-5">
            <p className="text-[11px] tracking-wider text-muted font-semibold mb-3">MATCHED KEYWORDS</p>
            <div className="flex flex-wrap gap-2">
              {result.matchedKeywords.map((k) => <span key={k} className="px-2.5 py-1 rounded-md text-xs bg-brand/10 text-brand">{k}</span>)}
            </div>
          </div>
          <div className="bg-surface-card border border-surface-border rounded-xl p-5">
            <p className="text-[11px] tracking-wider text-muted font-semibold mb-3">MISSING KEYWORDS</p>
            <div className="flex flex-wrap gap-2">
              {result.missingKeywords.map((k) => <span key={k} className="px-2.5 py-1 rounded-md text-xs bg-red-500/10 text-red-400">{k}</span>)}
            </div>
          </div>
        </div>

        <div className="bg-surface-card border border-surface-border rounded-xl p-5">
          <p className="text-[11px] tracking-wider text-muted font-semibold mb-3">IMPROVEMENT SUGGESTIONS</p>
          {result.suggestions.map((s, i) => (
            <div key={i} className="flex gap-3 py-2 text-sm">
              <span className="w-6 h-6 shrink-0 rounded-full bg-brand/10 text-brand text-xs font-semibold flex items-center justify-center">{i + 1}</span>{s}
            </div>
          ))}
        </div>

        <button onClick={() => setResult(null)} className="px-5 py-2.5 rounded-lg text-sm border border-surface-border hover:bg-surface-card">
          Score Against Another Job
        </button>
      </div>
    );
  }

  return (
    <div className="bg-surface-card border border-surface-border rounded-xl p-5">
      <label className="text-[11px] tracking-wider text-muted font-semibold">JOB DESCRIPTION</label>
      <textarea value={jd} onChange={(e) => setJd(e.target.value)} rows={9}
        placeholder="Paste the full job description here (responsibilities, requirements, tech stack)..."
        className="w-full mt-1 mb-3 bg-surface-raised border border-surface-border rounded-lg p-3 text-sm placeholder-muted focus:outline-none focus:border-brand" />
      <button onClick={check} disabled={loading || jd.trim().length < 20}
        className="w-full bg-brand hover:bg-brand-hover disabled:opacity-50 text-white font-medium rounded-lg py-2.5 text-sm">
        {loading ? "AI is analyzing your resume..." : "Check ATS Score"}
      </button>
      {error && <p className="text-sm text-red-400 mt-3">{error}</p>}
    </div>
  );
};

export default ATSScorer;