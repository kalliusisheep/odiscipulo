import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { aiMeditations } from "@/data/estudos";
import { ArrowLeft, Clock, Sparkles, Send, Loader2, NotebookPen, BookOpen } from "lucide-react";

export const Route = createFileRoute("/_authenticated/estudos/meditacao/$id")({
  component: MeditacaoPage,
});

type Msg = { role: "user" | "assistant" | "system"; content: string };

function MeditacaoPage() {
  const { id } = Route.useParams();
  const med = aiMeditations.find((m) => m.id === id);
  const notesKey = `disciple.med.${id}`;

  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(notesKey);
    if (raw) setNotes(raw);
  }, [notesKey]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  if (!med) {
    return (
      <div className="mx-auto max-w-lg p-6 text-center">
        <p>Meditação não encontrada.</p>
        <Link to="/estudos" className="mt-4 inline-block text-primary underline">Voltar</Link>
      </div>
    );
  }

  const stream = async (history: Msg[]) => {
    setLoading(true);
    try {
      const res = await fetch("/api/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      if (!res.ok || !res.body) throw new Error("stream falhou");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      setMessages((m) => [...m, { role: "assistant", content: "" }]);
      let buf = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          const l = line.trim();
          if (!l.startsWith("data:")) continue;
          const data = l.slice(5).trim();
          if (data === "[DONE]") continue;
          try {
            const j = JSON.parse(data);
            const delta = j.choices?.[0]?.delta?.content ?? "";
            if (delta) {
              acc += delta;
              setMessages((m) => {
                const copy = [...m];
                copy[copy.length - 1] = { role: "assistant", content: acc };
                return copy;
              });
            }
          } catch {
            /* ignore */
          }
        }
      }
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Perdão, tive dificuldade agora. Tente novamente." }]);
    } finally {
      setLoading(false);
    }
  };

  const start = async () => {
    setStarted(true);
    const first: Msg[] = [{ role: "user", content: med.seedPrompt }];
    setMessages(first);
    await stream(first);
  };

  const send = async () => {
    const t = input.trim();
    if (!t || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: t }];
    setMessages(next);
    setInput("");
    await stream(next);
  };

  const saveNotes = (v: string) => {
    setNotes(v);
    if (typeof window !== "undefined") window.localStorage.setItem(notesKey, v);
  };

  return (
    <div className="mx-auto max-w-lg space-y-5 px-4 pt-6">
      <Link to="/estudos" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Estudos
      </Link>

      <header className="space-y-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-ancient/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ancient">
          <Sparkles className="h-3 w-3" /> Meditação IA
        </span>
        <h1 className="text-2xl font-semibold">{med.title}</h1>
        <p className="text-sm text-muted-foreground">{med.description}</p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1 font-serif italic text-ancient">
            <BookOpen className="h-3 w-3" /> {med.passage}
          </span>
          <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {med.minutes} min</span>
        </div>
      </header>

      <div className="card-elevated p-4">
        <p className="text-sm leading-relaxed text-foreground/90">{med.intro}</p>
      </div>

      {!started ? (
        <button
          onClick={() => void start()}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-primary to-primary-glow px-4 py-3 font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          <Sparkles className="h-4 w-4" /> Iniciar meditação guiada
        </button>
      ) : (
        <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface">
          <div ref={scrollRef} className="max-h-[55vh] space-y-3 overflow-y-auto px-4 py-4">
            {messages
              .filter((_, i) => i !== 0) // esconde o seed prompt
              .map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      m.role === "user" ? "bg-primary text-primary-foreground" : "bg-surface-2 text-foreground"
                    }`}
                  >
                    {m.content || <span className="text-muted-foreground">…</span>}
                  </div>
                </div>
              ))}
            {loading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex items-center gap-2 rounded-2xl bg-surface-2 px-4 py-2.5 text-sm text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> refletindo…
              </div>
            )}
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); void send(); }}
            className="flex items-end gap-2 border-t border-border p-3"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void send(); }
              }}
              rows={1}
              placeholder="Responda ao Mentor…"
              className="flex-1 resize-none rounded-2xl border border-border bg-input px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all hover:bg-primary-glow disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      <section className="space-y-2">
        <div className="flex items-center gap-2">
          <NotebookPen className="h-4 w-4 text-primary" />
          <h2 className="text-lg font-semibold">Anotações da meditação</h2>
        </div>
        <textarea
          value={notes}
          onChange={(e) => saveNotes(e.target.value)}
          rows={5}
          placeholder="Registre o que o Espírito falou ao seu coração…"
          className="w-full resize-none rounded-2xl border border-border bg-input px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
        />
      </section>
    </div>
  );
}
