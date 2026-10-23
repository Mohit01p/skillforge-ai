import { useState } from "react";
import { Check, X } from "lucide-react";
import api from "../../context/axios";

const topics = ["JavaScript", "React", "Node.js", "MongoDB", "Java", "Python", "DSA", "DevOps", "SQL", "System Design"];
const difficulties = ["Easy", "Medium", "Hard", "Mixed"];

const Quiz = () => {
  const [screen, setScreen] = useState("setup");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Mixed");
  const [questions, setQuestions] = useState([]);
  const [cur, setCur] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const chip = (on) =>
    `px-3 py-2 rounded-lg text-sm border transition-colors ${
      on ? "border-brand bg-brand/10 text-brand font-medium" : "border-surface-border bg-surface-card text-muted hover:text-ink"}`;

  const start = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/ai/generate-quiz", { topic, difficulty });
      setQuestions(res.data);
      setCur(0); setScore(0); setAnswers([]); setSelected(null);
      setScreen("quiz");
    } catch {
      setError("AI is busy. Please try again in a moment.");
    }
    setLoading(false);
  };

  const pick = (opt) => {
    if (selected) return;
    const q = questions[cur];
    const ok = opt === q.correctAnswer;
    setSelected(opt);
    if (ok) setScore((s) => s + 1);
    setAnswers((a) => [...a, { question: q.question, selected: opt, correct: q.correctAnswer, ok, explanation: q.explanation }]);
  };

  const next = () => {
    if (cur + 1 < questions.length) { setCur(cur + 1); setSelected(null); }
    else setScreen("results");
  };

  // ---------- Setup ----------
  if (screen === "setup") {
    return (
      <div className="p-8 max-w-2xl">
        <h1 className="text-2xl font-bold">AI Quiz</h1>
        <p className="text-sm text-muted mb-6">Fresh AI-generated questions every time</p>

        <p className="text-[11px] tracking-wider text-muted font-semibold mb-2">TOPIC</p>
        <div className="grid grid-cols-2 gap-2 mb-5">
          {topics.map((t) => <button key={t} onClick={() => setTopic(t)} className={chip(topic === t)}>{t}</button>)}
        </div>

        <p className="text-[11px] tracking-wider text-muted font-semibold mb-2">DIFFICULTY</p>
        <div className="flex gap-2 mb-5">
          {difficulties.map((d) => <button key={d} onClick={() => setDifficulty(d)} className={chip(difficulty === d)}>{d}</button>)}
        </div>

        <button onClick={start} disabled={!topic || loading}
          className="w-full bg-brand hover:bg-brand-hover disabled:opacity-50 text-white font-medium rounded-lg py-3 text-sm">
          {loading ? "Generating quiz... (10-15 sec)" : "Start Quiz"}
        </button>
        {error && <p className="text-sm text-red-400 mt-3">{error}</p>}
      </div>
    );
  }

  // ---------- Quiz ----------
  if (screen === "quiz") {
    const q = questions[cur];
    return (
      <div className="p-8 max-w-2xl">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted">Question {cur + 1} of {questions.length}</span>
          <span className="text-brand font-medium">{score} correct</span>
        </div>
        <div className="h-1.5 bg-surface-raised rounded-full mb-6">
          <div className="h-1.5 bg-brand rounded-full transition-all" style={{ width: `${((cur + 1) / questions.length) * 100}%` }} />
        </div>

        <div className="bg-surface-card border border-surface-border rounded-xl p-5 mb-4">
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-brand/10 text-brand">{topic}</span>
          <p className="text-lg font-medium mt-3">{q.question}</p>
        </div>

        <div className="space-y-2">
          {q.options.map((opt, i) => {
            let style = "border-surface-border bg-surface-card hover:border-brand/50 cursor-pointer";
            if (selected) {
              if (opt === q.correctAnswer) style = "border-brand bg-brand/10 text-brand";
              else if (opt === selected) style = "border-red-400 bg-red-500/10 text-red-400";
              else style = "border-surface-border bg-surface-card opacity-50";
            }
            return (
              <div key={i} onClick={() => pick(opt)}
                className={`flex items-center gap-3 border rounded-xl px-4 py-3 text-sm transition-colors ${style}`}>
                <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs">{"ABCD"[i]}</span>
                <span className="flex-1">{opt}</span>
                {selected && opt === q.correctAnswer && <Check size={16} />}
                {selected && opt === selected && opt !== q.correctAnswer && <X size={16} />}
              </div>
            );
          })}
        </div>

        {selected && (
          <>
            <div className="bg-surface-card border border-surface-border border-l-2 border-l-brand rounded-xl p-4 mt-4">
              <p className="text-[11px] tracking-wider text-muted font-semibold mb-1">EXPLANATION</p>
              <p className="text-sm">{q.explanation}</p>
            </div>
            <button onClick={next} className="mt-4 bg-brand hover:bg-brand-hover text-white text-sm font-medium px-5 py-2.5 rounded-lg">
              {cur + 1 === questions.length ? "See Results →" : "Next Question"}
            </button>
          </>
        )}
      </div>
    );
  }

  // ---------- Results ----------
  const pct = Math.round((score / questions.length) * 100);
  const emoji = pct >= 80 ? "🏆" : pct >= 60 ? "👍" : pct >= 40 ? "📚" : "💪";
  const color = pct >= 80 ? "text-brand" : pct >= 40 ? "text-accent" : "text-red-400";

  return (
    <div className="p-8 max-w-2xl">
      <div className="text-center mb-6">
        <p className="text-5xl mb-2">{emoji}</p>
        <p className={`text-3xl font-bold ${color}`}>{score}/{questions.length}</p>
        <p className="text-muted text-sm">{pct}%</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[["Correct", score, "text-brand"], ["Wrong", questions.length - score, "text-red-400"], ["Score", `${pct}%`, "text-accent"]].map(([l, v, c]) => (
          <div key={l} className="bg-surface-card border border-surface-border rounded-xl p-3 text-center">
            <p className={`text-xl font-bold ${c}`}>{v}</p>
            <p className="text-xs text-muted">{l}</p>
          </div>
        ))}
      </div>

      <div className="bg-surface-card border border-surface-border rounded-xl p-4 mb-5 max-h-96 overflow-y-auto">
        <p className="text-[11px] tracking-wider text-muted font-semibold mb-3">REVIEW ANSWERS</p>
        {answers.map((a, i) => (
          <div key={i} className="py-3 border-b border-surface-border last:border-0">
            <p className="text-sm flex gap-2">
              <span className={a.ok ? "text-brand" : "text-red-400"}>{a.ok ? "✓" : "✗"}</span>{a.question}
            </p>
            {!a.ok && <p className="text-xs text-red-400 mt-1">Your answer: {a.selected}</p>}
            <p className="text-xs text-brand mt-0.5">Correct: {a.correct}</p>
            <p className="text-xs text-muted mt-1">{a.explanation}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button onClick={() => setScreen("setup")} className="px-5 py-2.5 rounded-lg text-sm border border-surface-border hover:bg-surface-card">New Quiz</button>
        <button onClick={start} className="px-5 py-2.5 rounded-lg text-sm bg-brand hover:bg-brand-hover text-white">Retry Same Topic</button>
      </div>
    </div>
  );
};

export default Quiz;