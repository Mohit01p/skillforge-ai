import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Doughnut } from "react-chartjs-2";
import api from "../context/axios";
import { roadmaps } from "../data/roadmaps";
import { getStats } from "../utils/progress";
import { useTheme } from "../context/ThemeContext";

const colors = { mern: "#00ABE4", "java-backend": "#F59E0B", python: "#10B981", devops: "#8B5CF6", "dsa-focus": "#EF4444" };

const ProgressDashboard = () => {
  const { theme } = useTheme();
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    api.get("/progress/all").then((r) => setProgress(r.data));
  }, []);

  const ids = Object.keys(roadmaps);
  const all = ids.map((id) => getStats(progress, id));
  const totalDone = all.reduce((s, x) => s + x.done, 0);
  const totalAll = all.reduce((s, x) => s + x.total, 0);
  const started = all.filter((x) => x.done > 0).length;
  const track = theme === "dark" ? "#374040" : "#DDE9F6";

  const stats = [
    { label: "TOPICS COMPLETED", value: totalDone },
    { label: "ROADMAPS STARTED", value: started },
    { label: "OVERALL PROGRESS", value: `${Math.round((totalDone / totalAll) * 100)}%` },
  ];

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-2xl font-bold">Progress</h1>
      <p className="text-sm text-muted mb-6">Your learning across all roadmaps</p>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-surface-card border border-surface-border rounded-xl p-4">
            <p className="text-[11px] tracking-wider text-muted font-semibold">{s.label}</p>
            <p className="text-2xl font-bold mt-2">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ids.map((id, i) => {
          const { done, total, pct } = all[i];
          const data = {
            labels: ["Completed", "Remaining"],
            datasets: [{ data: [done, total - done], backgroundColor: [colors[id], track], borderWidth: 0 }],
          };
          return (
            <Link key={id} to={`/roadmap/${id}`}
              className="bg-surface-card border border-surface-border rounded-xl p-5 hover:border-brand/50 transition-colors">
              <p className="font-semibold mb-3">{roadmaps[id].title.replace(" Roadmap", "")}</p>
              <div className="relative w-36 mx-auto">
                <Doughnut data={data} options={{ cutout: "75%", plugins: { legend: { display: false } } }} />
                <span className="absolute inset-0 flex items-center justify-center text-xl font-bold">{pct}%</span>
              </div>
              <p className="text-center text-xs text-muted mt-3">{done}/{total} topics</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressDashboard;