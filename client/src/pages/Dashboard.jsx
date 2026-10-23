import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Flame, CheckCircle2, Clock, Target, ChevronRight } from "lucide-react";
import api from "../context/axios";
import { AuthContext } from "../context/AuthContext";
import { roadmaps } from "../data/roadmaps";
import { getStats } from "../utils/progress";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    api.get("/progress/all").then((r) => setProgress(r.data));
  }, []);

  const stats = (id) => getStats(progress, id);

  const totalDone = Object.keys(roadmaps).reduce((s, id) => s + stats(id).done, 0);
  const totalAll = Object.values(roadmaps).reduce((s, r) => s + r.nodes.length, 0);
  const ready = Math.round((totalDone / totalAll) * 100);

  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const date = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  const cards = [
    { label: "CURRENT STREAK", value: "—", icon: Flame, color: "text-accent" },
    { label: "TOPICS DONE", value: totalDone, icon: CheckCircle2, color: "text-brand" },
    { label: "STUDY HOURS", value: "—", icon: Clock, color: "text-brand" },
    { label: "INTERVIEW READY", value: `${ready}%`, icon: Target, color: "text-accent" },
  ];

  // last 3 completed topics across all roadmaps
  const recent = progress
    .flatMap((p) => p.completedTopics.map((t) => ({ ...t, roadmapId: p.roadmapId })))
    .filter((t) => roadmaps[t.roadmapId]?.nodes.some((n) => n.id === t.topicId))
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
    .slice(0, 3);

  const bar = ["bg-brand", "bg-accent", "bg-purple-500", "bg-brand", "bg-accent"];

  return (
    <div className="p-8 max-w-5xl">
      <p className="text-xs tracking-wider text-muted font-semibold uppercase">{date}</p>
      <h1 className="text-2xl font-bold mt-1">
        {greet}, <span className="text-brand">{user?.name?.split(" ")[0]}</span> 👋
      </h1>
      <p className="text-sm text-muted mb-6">Pick up where you left off.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-surface-card border border-surface-border rounded-xl p-4">
            <div className="flex justify-between items-start">
              <p className="text-[11px] tracking-wider text-muted font-semibold">{label}</p>
              <Icon size={16} className={color} />
            </div>
            <p className="text-2xl font-bold mt-3">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-surface-card border border-surface-border rounded-xl p-5">
          <div className="flex justify-between mb-4">
            <p className="text-[11px] tracking-wider text-muted font-semibold">RECENTLY COMPLETED</p>
            <Link to="/roadmaps" className="text-xs text-brand flex items-center">View all <ChevronRight size={14} /></Link>
          </div>
          {recent.length === 0 && <p className="text-sm text-muted">No topics completed yet. Open a roadmap to start.</p>}
          {recent.map((t, i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-surface-border last:border-0">
              <span className="text-sm">{t.topicName}</span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-brand/10 text-brand">{roadmaps[t.roadmapId]?.title.replace(" Roadmap", "")}</span>
            </div>
          ))}
        </div>

        <div className="bg-surface-card border border-surface-border rounded-xl p-5">
          <p className="text-[11px] tracking-wider text-muted font-semibold mb-4">ROADMAP PROGRESS</p>
          <div className="space-y-4">
            {Object.keys(roadmaps).map((id, i) => {
              const { pct } = stats(id);
              return (
                <div key={id}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span>{roadmaps[id].title.replace(" Roadmap", "")}</span>
                    <span className="text-muted text-xs">{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-surface-raised rounded-full">
                    <div className={`h-1.5 rounded-full ${bar[i]}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;