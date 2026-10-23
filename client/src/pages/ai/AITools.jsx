import { Link } from "react-router-dom";
import { Map, Target, CalendarCheck, Lightbulb, MessageCircle, ArrowUpRight } from "lucide-react";

const tools = [
  { to: "/ai/roadmap-generator", label: "Roadmap Generator", desc: "Month-by-month plan for your goal", icon: Map },
  { to: "/ai/skill-gap", label: "Skill Gap Analyzer", desc: "Find what's missing for a role", icon: Target },
  { to: "/ai/daily-planner", label: "Daily Planner", desc: "A study plan for today", icon: CalendarCheck },
  { to: "/ai/project-ideas", label: "Project Ideas", desc: "Projects that fit your skills", icon: Lightbulb },
  { to: "/ai/mentor", label: "AI Mentor", desc: "Ask anything about code or careers", icon: MessageCircle },
];

const AITools = () => (
  <div className="p-8 max-w-5xl">
    <h1 className="text-2xl font-bold">AI Tools</h1>
    <p className="text-sm text-muted mb-6">Gemini-powered tools personalised to your goal</p>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {tools.map(({ to, label, desc, icon: Icon }) => (
        <Link key={to} to={to}
          className="bg-surface-card border border-surface-border rounded-xl p-5 hover:border-brand/50 transition-colors">
          <div className="flex justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-brand/10 text-brand flex items-center justify-center"><Icon size={18} /></div>
            <ArrowUpRight size={15} className="text-muted" />
          </div>
          <p className="font-semibold">{label}</p>
          <p className="text-xs text-muted mt-1">{desc}</p>
        </Link>
      ))}
    </div>
  </div>
);

export default AITools;