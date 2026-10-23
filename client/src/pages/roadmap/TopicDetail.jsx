import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ChevronLeft, BookOpen, Play, Code2, ArrowUpRight, CheckCircle2, Sparkles } from "lucide-react";
import api from "../../context/axios";
import { roadmaps, topicDetails } from "../../data/roadmaps";

const TopicDetail = () => {
  const { roadmapId, topicId } = useParams();
  const navigate = useNavigate();
  const topic = topicDetails[topicId];
  const index = roadmaps[roadmapId]?.nodes.findIndex((n) => n.id === topicId) + 1;

  const [completed, setCompleted] = useState(false);
  const [ai, setAi] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/progress/${roadmapId}`).then((r) =>
      setCompleted(r.data.completedTopics.some((t) => t.topicId === topicId))
    );
  }, [roadmapId, topicId]);

  if (!topic) return <p className="p-8 text-muted">Topic not found.</p>;

  const toggleComplete = async () => {
    if (completed) {
      await api.delete("/progress/uncomplete", { data: { roadmapId, topicId } });
      setCompleted(false);
    } else {
      await api.post("/progress/complete", { roadmapId, topicId, topicName: topic.label });
      setCompleted(true);
    }
  };

  const explain = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/ai/topic-explain", { topic: topic.label });
      setAi(res.data);
    } catch {
      setError("AI is busy. Please try again.");
    }
    setLoading(false);
  };

  const resources = [
    { icon: BookOpen, color: "text-brand", label: `${topic.label} — Official Docs`, url: topic.doc },
    { icon: Play, color: "text-red-400", label: `YouTube: ${topic.label} tutorials`, url: topic.youtube },
    { icon: Code2, color: "text-accent", label: `Practice: ${topic.label}`, url: topic.practice },
  ];

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex justify-between items-start mb-1">
        <h1 className="text-2xl font-bold">{topic.label}</h1>
        <button onClick={() => navigate(`/roadmap/${roadmapId}`)}
          className="flex items-center text-sm border border-surface-border rounded-lg px-3 py-1.5 hover:bg-surface-card">
          <ChevronLeft size={14} /> Back
        </button>
      </div>
      <p className="text-sm text-muted mb-6">
        {roadmaps[roadmapId]?.title.replace(" Roadmap", "")} · Module {index}
      </p>

      <div className="bg-surface-card border border-surface-border rounded-xl p-5 mb-4">
        <p className="text-[11px] tracking-wider text-muted font-semibold mb-3">RESOURCES</p>
        {resources.map(({ icon: Icon, color, label, url }) => (
          <a key={label} href={url} target="_blank" rel="noreferrer"
            className="flex items-center justify-between py-2.5 border-b border-surface-border last:border-0 hover:text-brand transition-colors">
            <span className="flex items-center gap-3 text-sm"><Icon size={15} className={color} />{label}</span>
            <ArrowUpRight size={14} className="text-muted" />
          </a>
        ))}
      </div>

      <div className="bg-surface-card border border-surface-border rounded-xl p-5 mb-4">
        <div className="flex justify-between items-center mb-3">
          <p className="text-[11px] tracking-wider text-muted font-semibold flex items-center gap-2">
            <Sparkles size={13} className="text-accent" /> AI EXPLANATION
          </p>
          <button onClick={explain} disabled={loading}
            className="text-sm border border-surface-border rounded-lg px-3 py-1 hover:bg-surface-raised disabled:opacity-50">
            {loading ? "Generating..." : ai ? "Regenerate" : "Generate"}
          </button>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}
        {!ai && !error && <p className="text-sm text-muted">Click Generate to get an AI explanation.</p>}
        {ai && (
          <div className="space-y-3 text-sm">
            <p>{ai.explanation}</p>
            <div className="bg-surface-raised border-l-2 border-brand rounded p-3">
              <p className="text-[11px] tracking-wider text-brand font-semibold mb-1">ANALOGY</p>
              <p className="text-muted">{ai.analogy}</p>
            </div>
            <ul className="list-disc ml-5 space-y-1 text-muted">
              {ai.keyPoints?.map((k, i) => <li key={i}>{k}</li>)}
            </ul>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button onClick={toggleComplete}
          className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium border transition-colors ${
            completed ? "bg-brand text-white border-brand" : "border-surface-border hover:bg-surface-card"}`}>
          <CheckCircle2 size={16} /> {completed ? "Completed" : "Mark as Complete"}
        </button>
        <Link to="/ai" className="px-5 py-2.5 rounded-lg text-sm border border-surface-border hover:bg-surface-card">
          View AI Tools
        </Link>
      </div>
    </div>
  );
};

export default TopicDetail;