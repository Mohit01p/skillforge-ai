import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import {
  Zap, LayoutDashboard, Map, Cpu, MessageSquare, Puzzle,
    FileText, BookOpen, TrendingUp, User, LogOut, Sun, Moon,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  const links = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/roadmaps", label: "Roadmaps", icon: Map },
    { to: "/ai", label: "AI Tools", icon: Cpu },
    { to: "/interview", label: "Interview Prep", icon: MessageSquare },
    { to: "/quiz", label: "AI Quiz", icon: Puzzle },
    { to: "/resume", label: "Resume", icon: FileText },
    { to: "/document", label: "Document Chat", icon: BookOpen },
    { to: "/progress", label: "Progress", icon: TrendingUp },
    { to: "/profile", label: "Profile", icon: User },
  ];

  const shortcuts = [
    { to: "/ai/mentor", label: "AI Mentor", dot: "bg-brand" },
    { to: "/ai/daily-planner", label: "Daily Planner", dot: "bg-accent" },
    { to: "/interview", label: "Interview Coach", dot: "bg-accent" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-60 shrink-0 h-screen sticky top-0 bg-surface border-r border-surface-border flex flex-col">
      <div className="flex items-center gap-3 p-4 border-b border-surface-border">
        <div className="w-9 h-9 rounded-lg bg-brand flex items-center justify-center">
          <Zap size={18} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight">SkillForge AI</p>
          <p className="text-[10px] tracking-widest text-accent font-semibold">DEV PLATFORM</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={label}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive ? "bg-brand/10 text-brand font-medium" : "text-muted hover:text-ink hover:bg-surface-card"
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}

        <div className="border-t border-surface-border my-3" />

        {shortcuts.map((s) => (
          <NavLink key={s.label} to={s.to}
            className="flex items-center gap-3 px-3 py-1.5 text-xs text-muted hover:text-ink transition-colors">
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            {s.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-surface-border space-y-2">
        <div className="flex items-center gap-3 bg-surface-card rounded-lg p-2">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white text-sm font-semibold">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-[11px] text-muted truncate capitalize">{user?.careerGoal?.replace("-", " ")}</p>
          </div>
        </div>
          <button onClick={toggle}
          className="flex items-center gap-3 px-3 py-2 text-sm text-muted hover:text-ink w-full transition-colors">
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </button>
        <button onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 text-sm text-muted hover:text-ink w-full transition-colors">
          <LogOut size={16} /> Log out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;