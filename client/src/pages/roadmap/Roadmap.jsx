import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import api from "../../context/axios";
import { roadmaps } from "../../data/roadmaps";

const Roadmap = () => {
  const { roadmapId } = useParams();
  const navigate = useNavigate();
  const roadmap = roadmaps[roadmapId];
  const [done, setDone] = useState([]);

  useEffect(() => {
    api.get(`/progress/${roadmapId}`).then((res) => {
      const valid = roadmaps[roadmapId]?.nodes.map((n) => n.id) || [];
      setDone([...new Set(res.data.completedTopics.map((t) => t.topicId))].filter((id) => valid.includes(id)));
    });
  }, [roadmapId]);

  if (!roadmap) return <p className="p-8 text-muted">Roadmap not found.</p>;

  const total = roadmap.nodes.length;
  const pct = Math.round((done.length / total) * 100);
  const firstPending = roadmap.nodes.findIndex((n) => !done.includes(n.id));

  const status = (n, i) => {
    if (done.includes(n.id)) return "done";
    if (i === firstPending) return "progress";
    return "pending";
  };

  const badge = {
    done: "bg-brand/10 text-brand",
    progress: "bg-brand/10 text-brand",
    pending: "bg-surface-raised text-muted",
  };
  const label = { done: "Done", progress: "In Progress", pending: "Pending" };

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex justify-between items-start mb-1">
        <h1 className="text-2xl font-bold">{roadmap.title}</h1>
        <button onClick={() => navigate("/roadmaps")}
          className="flex items-center text-sm border border-surface-border rounded-lg px-3 py-1.5 hover:bg-surface-card">
          <ChevronLeft size={14} /> Back
        </button>
      </div>
      <p className="text-sm text-muted mb-5">{total} topics · {pct}% complete</p>

      <div className="bg-surface-card border border-surface-border rounded-xl p-4 mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium">Overall Progress</span>
          <span className="text-brand font-medium">{pct}%</span>
        </div>
        <div className="h-1.5 bg-surface-raised rounded-full">
          <div className="h-1.5 bg-brand rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="space-y-3">
        {roadmap.nodes.map((n, i) => {
          const s = status(n, i);
          return (
            <div key={n.id} className="flex gap-4 items-stretch">
              <div className="flex flex-col items-center pt-5">
                <span className={`w-2.5 h-2.5 rounded-full ${s === "pending" ? "border border-muted" : "bg-brand"}`} />
                {i < total - 1 && <span className="w-px flex-1 bg-surface-border mt-1" />}
              </div>
              <Link to={`/topic/${roadmapId}/${n.id}`}
                className="flex-1 flex items-center justify-between bg-surface-card border border-surface-border rounded-xl px-4 py-3 hover:border-brand/50 transition-colors">
                <p className={`font-medium ${s === "pending" ? "" : "text-brand"}`}>{n.data.label}</p>
                <div className="flex items-center gap-3">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${badge[s]}`}>{label[s]}</span>
                  <ChevronRight size={14} className="text-muted" />
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Roadmap;