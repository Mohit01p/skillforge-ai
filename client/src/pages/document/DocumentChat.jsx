import { useState, useEffect, useRef } from "react";
import { Upload, FileText, Send, Trash2, Sparkles } from "lucide-react";
import api from "../../context/axios";

const DocumentChat = () => {
  const [docs, setDocs] = useState([]);
  const [active, setActive] = useState(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [indexing, setIndexing] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const ragInput = useRef(null);
  const endRef = useRef(null);

  const load = async () => setDocs((await api.get("/document/history")).data);
  useEffect(() => { load(); }, []);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [active?.chatHistory, sending]);

  const upload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("pdf", file);
      await api.post("/document/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      await load();
    } catch {
      setError("Upload failed. Please try again.");
    }
    setUploading(false);
    e.target.value = "";
  };

  const open = async (id) => {
    setError("");
    setActive((await api.get(`/document/${id}`)).data);
  };

  const remove = async (e, id) => {
    e.stopPropagation();
    await api.delete(`/document/${id}`);
    if (active?._id === id) setActive(null);
    load();
  };

  const indexRag = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIndexing(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("pdf", file);
      fd.append("documentId", active._id);
      await api.post("/document/rag-upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setActive((await api.get(`/document/${active._id}`)).data);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "RAG indexing failed.");
    }
    setIndexing(false);
    e.target.value = "";
  };

  const send = async () => {
    if (!message.trim() || sending) return;
    const text = message;
    const rag = active.mode === "rag";
    setMessage("");
    setSending(true);
    setError("");
    setActive((a) => ({ ...a, chatHistory: [...a.chatHistory, { role: "user", content: text }] }));
    try {
      const res = await api.post(rag ? "/document/rag-query" : "/document/chat",
        rag ? { documentId: active._id, question: text } : { documentId: active._id, message: text });
      const reply = rag ? res.data.answer : res.data.reply;
      setActive((a) => ({ ...a, chatHistory: [...a.chatHistory, { role: "assistant", content: reply }] }));
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    }
    setSending(false);
  };

  return (
    <div className="flex h-screen">
      {/* documents list */}
      <div className="w-64 shrink-0 border-r border-surface-border p-4 flex flex-col">
        <h1 className="text-lg font-bold mb-3">Document Chat</h1>
        <label className="flex items-center justify-center gap-2 bg-brand hover:bg-brand-hover text-white text-sm font-medium rounded-lg py-2 cursor-pointer mb-4">
          <Upload size={15} /> {uploading ? "Uploading..." : "Upload PDF"}
          <input type="file" accept="application/pdf" className="hidden" onChange={upload} disabled={uploading} />
        </label>
        <div className="flex-1 overflow-y-auto space-y-2">
          {docs.length === 0 && <p className="text-xs text-muted">No documents yet.</p>}
          {docs.map((d) => (
            <div key={d._id} onClick={() => open(d._id)}
              className={`group flex items-center gap-2 p-2.5 rounded-lg cursor-pointer border transition-colors ${
                active?._id === d._id ? "border-brand bg-brand/10" : "border-surface-border bg-surface-card hover:border-muted"}`}>
              <FileText size={15} className="text-muted shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm truncate">{d.fileName}</p>
                <p className="text-[10px] text-muted">{new Date(d.createdAt).toLocaleDateString()} · {d.mode === "rag" ? "RAG" : "Gemini"}</p>
              </div>
              <button onClick={(e) => remove(e, d._id)} className="opacity-0 group-hover:opacity-100 text-muted hover:text-red-400">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* chat panel */}
      <div className="flex-1 flex flex-col min-w-0">
        {!active ? (
          <div className="flex-1 flex items-center justify-center text-sm text-muted">
            Upload or select a PDF to start chatting.
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center px-6 py-4 border-b border-surface-border">
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate">{active.fileName}</p>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${active.mode === "rag" ? "bg-purple-500/10 text-purple-400" : "bg-brand/10 text-brand"}`}>
                  {active.mode === "rag" ? "RAG Mode" : "Gemini Mode"}
                </span>
              </div>
              {active.mode !== "rag" && (
                <>
                  <button onClick={() => ragInput.current.click()} disabled={indexing}
                    className="flex items-center gap-2 text-xs border border-surface-border rounded-lg px-3 py-1.5 hover:bg-surface-card disabled:opacity-50">
                    <Sparkles size={13} /> {indexing ? "Indexing..." : "Index for RAG"}
                  </button>
                  <input ref={ragInput} type="file" accept="application/pdf" className="hidden" onChange={indexRag} />
                </>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {active.chatHistory.length === 0 && (
                <p className="text-sm text-muted">Ask anything about this document.</p>
              )}
              {active.chatHistory.map((m, i) =>
                m.role === "user" ? (
                  <div key={i} className="flex justify-end">
                    <p className="bg-brand text-white text-sm rounded-xl px-4 py-2.5 max-w-xl whitespace-pre-wrap">{m.content}</p>
                  </div>
                ) : (
                  <div key={i} className="flex">
                    <p className="bg-surface-card border border-surface-border text-sm rounded-xl px-4 py-2.5 max-w-2xl whitespace-pre-wrap">{m.content}</p>
                  </div>
                )
              )}
              {sending && <p className="text-sm text-muted">Thinking...</p>}
              <div ref={endRef} />
            </div>

            {error && <p className="px-6 pb-2 text-sm text-red-400">{error}</p>}
            <div className="p-4 border-t border-surface-border flex gap-3">
              <input value={message} onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask about this document..."
                className="flex-1 bg-surface-raised border border-surface-border rounded-lg px-4 py-2.5 text-sm placeholder-muted focus:outline-none focus:border-brand" />
              <button onClick={send} disabled={sending}
                className="w-11 bg-brand hover:bg-brand-hover disabled:opacity-50 rounded-lg flex items-center justify-center text-white">
                <Send size={16} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DocumentChat;