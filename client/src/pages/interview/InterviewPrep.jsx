import { useState, useContext } from "react";
import { ChevronLeft, Sparkles } from "lucide-react";
import { interviewQuestions } from "../../data/interviewQuestions";
import api from "../../context/axios";
import { AuthContext } from "../../context/AuthContext";

const topics = Object.keys(interviewQuestions);
const defaultTopic = { mern: "JavaScript", "java-backend": "Java", python: "Python", devops: "DSA", "dsa-focus": "DSA" };

const diffStyle = {
  Easy: "bg-brand/10 text-brand",
  Medium: "bg-accent/10 text-accent",
  Hard: "bg-red-500/10 text-red-400",
};

const InterviewPrep = () => {
  const { user } = useContext(AuthContext);
  const [topic, setTopic] = useState(defaultTopic[user?.careerGoal] || topics[0]);
  const [diff, setDiff] = useState("All");
  const [revealed, setRevealed] = useState(null);
  const [active, setActive] = useState(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const questions = interviewQuestions[topic].filter((q) => diff === "All" || q.difficulty === diff);

  const chip = (on) =>
    `px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
      on ? "border-brand bg-brand/10 text-brand" : "border-surface-border text-muted hover:text-ink"}`;

  const practice = (q) => {
    setActive(q);
    setAnswer("");
    setFeedback(null);
    setError("");
  };

  const submit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/interview/attempt", { topic, question: active.question, userAnswer: answer });
      setFeedback(res.data.feedback);
    } catch {
      setError("AI is busy. Please try again.");
    }
    setLoading(false);
  };

  // ---------- AI Coach view ----------
  if (active) {
    const scoreColor = feedback?.score >= 8 ? "text-brand" : feedback?.score >= 5 ? "text-accent" : "text-red-400";
    return (
      <div className="p-8 max-w-3xl">
        <div className="flex justify-between items-start mb-1">
          <h1 className="text-2xl font-bold">AI Interview Coach</h1>
          <button onClick={() => setActive(null)}
            className="flex items-center text-sm border border-surface-border rounded-lg px-3 py-1.5 hover:bg-surface-card">
            <ChevronLeft size={14} /> Back
          </button>
        </div>
        <p className="text-sm text-muted mb-6">Get detailed feedback on your answers</p>

        <div className="bg-surface-card border border-surface-border border-l-2 border-l-brand rounded-xl p-4 mb-5">
          <p className="text-[11px] tracking-wider text-muted font-semibold mb-1">QUESTION</p>
          <p className="font-medium">{active.question}</p>
        </div>

        <label className="text-[11px] tracking-wider text-muted font-semibold">YOUR ANSWER</label>
        <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={7}
          placeholder="Explain as clearly as you would in a real interview..."
          className="w-full mt-1 mb-3 bg-surface-raised border border-surface-border rounded-xl p-4 text-sm placeholder-muted focus:outline-none focus:border-brand" />

        <button onClick={submit} disabled={loading || !answer.trim()}
          className="w-full flex items-center justify-center gap-2 bg-brand hover:bg-brand-hover disabled:opacity-50 text-white font-medium rounded-lg py-2.5 text-sm">
          <Sparkles size={15} /> {loading ? "AI is evaluating your answer..." : "Submit for AI Feedback"}
        </button>
        {error && <p className="text-sm text-red-400 mt-3">{error}</p>}

        {feedback && (
          <div className="mt-5 space-y-3">
            <div className="bg-surface-card border border-surface-border rounded-xl p-4 flex justify-between items-center">
              <p className="text-[11px] tracking-wider text-muted font-semibold">YOUR SCORE</p>
              <p className={`text-2xl font-bold ${scoreColor}`}>{feedback.score}/10</p>
            </div>
            {[
              ["WHAT WAS GOOD", feedback.whatWasGood, "border-l-brand"],
              ["WHAT WAS MISSING", feedback.whatWasMissing, "border-l-red-400"],
              ["IDEAL ANSWER", feedback.idealAnswer, "border-l-blue-400"],
              ["TIP", feedback.tip, "border-l-accent"],
            ].map(([title, text, border]) => (
              <div key={title} className={`bg-surface-card border border-surface-border border-l-2 ${border} rounded-xl p-4`}>
                <p className="text-[11px] tracking-wider text-muted font-semibold mb-1">{title}</p>
                <p className="text-sm">{text}</p>
              </div>
            ))}
            <div className="flex gap-3">
              <button onClick={() => { setAnswer(""); setFeedback(null); }}
                className="px-4 py-2 rounded-lg text-sm border border-surface-border hover:bg-surface-card">Try Another Answer</button>
              <button onClick={() => setActive(null)}
                className="px-4 py-2 rounded-lg text-sm bg-brand hover:bg-brand-hover text-white">Practice Another Question</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ---------- Browse view ----------
  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold">Interview Prep</h1>
      <p className="text-sm text-muted mb-5">{questions.length} curated questions</p>

      <div className="flex flex-wrap gap-2 mb-3">
        {topics.map((t) => (
          <button key={t} onClick={() => { setTopic(t); setRevealed(null); }} className={chip(topic === t)}>{t}</button>
        ))}
      </div>
      <div className="flex gap-2 mb-5">
        {["All", "Easy", "Medium", "Hard"].map((d) => (
          <button key={d} onClick={() => setDiff(d)} className={chip(diff === d)}>{d}</button>
        ))}
      </div>

      <div className="space-y-3">
        {questions.map((q) => (
          <div key={q.id} className="bg-surface-card border border-surface-border rounded-xl p-4">
            <div className="flex gap-2 mb-2">
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-brand/10 text-brand">{topic}</span>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${diffStyle[q.difficulty]}`}>{q.difficulty}</span>
            </div>
            <p className="text-sm mb-3">{q.question}</p>
            <div className="flex gap-2">
              <button onClick={() => setRevealed(revealed === q.id ? null : q.id)}
                className="px-3 py-1.5 rounded-lg text-xs border border-surface-border hover:bg-surface-raised">
                {revealed === q.id ? "Hide Answer" : "Show Answer"}
              </button>
              <button onClick={() => practice(q)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-brand hover:bg-brand-hover text-white">
                Practice with AI
              </button>
            </div>
            {revealed === q.id && (
              <p className="text-sm text-muted mt-3 pt-3 border-t border-surface-border">{q.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterviewPrep;