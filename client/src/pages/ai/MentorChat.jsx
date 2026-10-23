import { useState, useContext, useRef, useEffect } from "react";
import { Zap, Send, Brain } from "lucide-react";
import api from "../../context/axios";
import { AuthContext } from "../../context/AuthContext";

const MentorChat = () => {
  const { user } = useContext(AuthContext);
  const first = user?.name?.split(" ")[0];
  const [messages, setMessages] = useState([
    { role: "assistant", content: `Hey ${first}! I'm your AI mentor. Ask me anything about code, projects, or your learning path.` },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const text = input;
    const history = [...messages, { role: "user", content: text }];
    setMessages(history);
    setInput("");
    setLoading(true);
    try {
      const res = await api.post("/ai/mentor", {
        message: text,
        history: history.slice(-10),
        userContext: { name: user.name, careerGoal: user.careerGoal, currentSkills: user.currentSkills },
      });
      setMessages([...history, { role: "assistant", content: res.data.reply }]);
    } catch {
      setMessages([...history, { role: "assistant", content: "Sorry, the AI is busy right now. Please try again." }]);
    }
    setLoading(false);
  };

  const Avatar = () => (
    <div className="w-7 h-7 shrink-0 rounded-lg bg-brand/10 text-brand flex items-center justify-center"><Zap size={14} /></div>
  );

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-surface-border">
        <div className="w-9 h-9 rounded-lg bg-brand/10 text-brand flex items-center justify-center"><Brain size={18} /></div>
        <div>
          <p className="font-semibold text-sm">AI Mentor</p>
          <p className="text-xs text-brand flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-brand" /> Online</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="flex justify-end">
              <p className="bg-brand text-white text-sm rounded-xl px-4 py-2.5 max-w-xl whitespace-pre-wrap">{m.content}</p>
            </div>
          ) : (
            <div key={i} className="flex gap-3">
              <Avatar />
              <p className="bg-surface-card border border-surface-border text-sm rounded-xl px-4 py-2.5 max-w-2xl whitespace-pre-wrap">{m.content}</p>
            </div>
          )
        )}
        {loading && (
          <div className="flex gap-3">
            <Avatar />
            <p className="text-sm text-muted px-4 py-2.5">Thinking...</p>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="p-4 border-t border-surface-border flex gap-3">
        <input value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask anything about code or your roadmap..."
          className="flex-1 bg-surface-raised border border-surface-border rounded-lg px-4 py-2.5 text-sm placeholder-muted focus:outline-none focus:border-brand" />
        <button onClick={send} disabled={loading}
          className="w-11 bg-brand hover:bg-brand-hover disabled:opacity-50 rounded-lg flex items-center justify-center text-white">
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};

export default MentorChat;