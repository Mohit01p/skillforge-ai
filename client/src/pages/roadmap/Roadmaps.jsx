import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layers, Coffee, Code2, Server, GitBranch } from "lucide-react";
import api from "../../context/axios";
import { roadmaps } from "../../data/roadmaps";
import { getStats } from "../../utils/progress";

const meta = {
  mern: { icon: Layers, sub: "Full-stack JavaScript", bar: "bg-brand" },
  "java-backend": { icon: Coffee, sub: "Spring Boot & MySQL", bar: "bg-accent" },
  python: { icon: Code2, sub: "Web & data science", bar: "bg-brand" },
  devops: { icon: Server, sub: "CI/CD, Docker & cloud", bar: "bg-accent" },
  "dsa-focus": { icon: GitBranch, sub: "Algorithms & data structures", bar: "bg-purple-500" },
};

const Roadmaps = () => {
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    api.get("/progress/all").then((r) => setProgress(r.data));
  }, []);

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-2xl font-bold">Roadmaps</h1>
      <p className="text-sm text-muted mb-6">Structured learning paths to your career goal</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.keys(roadmaps).map((id) => {
          const { icon: Icon, sub, bar } = meta[id];
          const { total, pct } = getStats(progress, id);
          return (
            <Link key={id} to={`/roadmap/${id}`}
              className="bg-surface-card border border-surface-border rounded-xl p-5 hover:border-brand/50 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-brand/10 text-brand flex items-center justify-center mb-3">
                <Icon size={18} />
              </div>
              <p className="font-semibold">{roadmaps[id].title.replace(" Roadmap", "")}</p>
              <p className="text-xs text-muted mb-4">{sub}</p>
              <div className="h-1.5 bg-surface-raised rounded-full mb-2">
                <div className={`h-1.5 rounded-full ${bar}`} style={{ width: `${pct}%` }} />
              </div>
              <div className="flex justify-between text-[11px] text-muted">
                <span>{pct}%</span><span>{total} topics</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Roadmaps;