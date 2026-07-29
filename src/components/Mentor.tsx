import { useApp } from "@/lib/app-context";
import { useMascot, type MascotEvent } from "@/lib/mascot";
import { Send, X, Loader2 } from "lucide-react";
import { useState, useRef, useEffect, type PointerEvent as ReactPointerEvent } from "react";

const FAB_SIZE = 56;
const STORAGE_KEY = "disciple.mentorFabPos";
const BUBBLE_VISIBLE_MS = 6000;
const FALLBACK_SRC = "/isheep-img.png";

const EVENT_TO_ANIM_CLASS: Record<Exclude<MascotEvent, null>, string> = {
  wave: "animate-mascot-wave",
  jump: "animate-mascot-jump",
  dance: "animate-mascot-dance",
  streak: "animate-mascot-dance",
  sad: "animate-mascot-sad",
  pet: "animate-mascot-pet",
};

export function MentorFAB() {
  const { setMentorOpen, mentorOpen } = useApp();
  const { state } = useMascot();
  const { event, message, moodEmoji } = state;

  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    moved: boolean;
    pointerId: number;
  } | null>(null);

  // Balão de fala: some sozinho depois de um tempo, e reaparece quando uma
  // nova fala contextual chega (saudação, "senti sua falta", subiu de nível…).
  const [showBubble, setShowBubble] = useState(false);
  const lastMessageRef = useRef<string | null>(null);
  const bubbleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (message && message !== lastMessageRef.current) {
      lastMessageRef.current = message;
      setShowBubble(true);
      if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
      bubbleTimer.current = setTimeout(() => setShowBubble(false), BUBBLE_VISIBLE_MS);
    }
    return () => {
      if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
    };
  }, [message]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const clamp = (x: number, y: number) => ({
      x: Math.min(Math.max(8, x), window.innerWidth - FAB_SIZE - 8),
      y: Math.min(Math.max(8, y), window.innerHeight - FAB_SIZE - 8),
    });
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const p = JSON.parse(saved) as { x: number; y: number };
        setPos(clamp(p.x, p.y));
        return;
      } catch {
        /* ignore */
      }
    }
    setPos(clamp(window.innerWidth - FAB_SIZE - 16, window.innerHeight - FAB_SIZE - 96));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onResize = () => {
      setPos((p) =>
        p
          ? {
              x: Math.min(Math.max(8, p.x), window.innerWidth - FAB_SIZE - 8),
              y: Math.min(Math.max(8, p.y), window.innerHeight - FAB_SIZE - 8),
            }
          : p,
      );
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  if (mentorOpen || !pos) return null;

  const onPointerDown = (e: ReactPointerEvent<HTMLButtonElement>) => {
    (e.currentTarget as HTMLButtonElement).setPointerCapture(e.pointerId);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: pos.x,
      origY: pos.y,
      moved: false,
      pointerId: e.pointerId,
    };
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const d = dragRef.current;
    if (!d || d.pointerId !== e.pointerId) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (!d.moved && Math.hypot(dx, dy) < 5) return;
    d.moved = true;
    const nx = Math.min(Math.max(8, d.origX + dx), window.innerWidth - FAB_SIZE - 8);
    const ny = Math.min(Math.max(8, d.origY + dy), window.innerHeight - FAB_SIZE - 8);
    setPos({ x: nx, y: ny });
  };

  const onPointerUp = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const d = dragRef.current;
    dragRef.current = null;
    if (!d) return;
    if (d.moved) {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(pos));
      }
    } else {
      setShowBubble(false);
      setMentorOpen(true);
    }
    try {
      (e.currentTarget as HTMLButtonElement).releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  const animClass = event ? EVENT_TO_ANIM_CLASS[event] : "animate-mascot-idle";
  const showParticles = event === "jump" || event === "dance" || event === "streak" || event === "pet";
  const particleEmoji = event === "streak" ? "🔥" : event === "dance" ? "⭐" : event === "pet" ? "❤️" : "✨";

  // Se a ovelha estiver muito perto do topo da tela, o balão abre pra baixo
  // em vez de pra cima, pra nunca ficar cortado fora da viewport.
  const bubbleBelow = pos.y < 140;

  return (
    <div className="fixed z-40" style={{ left: pos.x, top: pos.y, width: FAB_SIZE, height: FAB_SIZE }}>
      {showBubble && message && (
        <div
          className={`animate-fade-in pointer-events-none absolute max-w-[190px] rounded-2xl px-3 py-1.5 text-center text-[11px] font-medium leading-snug text-foreground shadow-md ring-1 ring-border ${
            bubbleBelow ? "rounded-tl-sm" : "rounded-bl-sm"
          }`}
          style={{
            left: "50%",
            transform: "translateX(-50%)",
            [bubbleBelow ? "top" : "bottom"]: FAB_SIZE + 8,
            background: "var(--surface)",
          }}
        >
          {message}
        </div>
      )}

      <button
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        aria-label="Abrir Barnabéé, Mentor IA (arraste para mover)"
        style={{ touchAction: "none" }}
        className={`relative h-14 w-14 cursor-grab overflow-hidden rounded-full bg-gradient-to-br from-primary to-primary-glow shadow-2xl shadow-primary/40 transition-transform active:scale-95 active:cursor-grabbing ${animClass}`}
      >
        <img
          src={FALLBACK_SRC}
          alt="Barnabéé, Mentor IA"
          className="pointer-events-none h-full w-full animate-mascot-face object-cover"
          draggable={false}
        />
      </button>

      <span className="pointer-events-none absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-surface text-[11px] shadow ring-1 ring-border">
        {moodEmoji}
      </span>

      {showParticles &&
        [...Array(6)].map((_, i) => (
          <span
            key={i}
            className="pointer-events-none absolute left-1/2 top-1/2 text-sm"
            style={{
              animation: `mascot-particle 1s ease-out ${i * 0.08}s forwards`,
              transform: `translate(-50%, -50%) rotate(${i * 60}deg)`,
            }}
          >
            {particleEmoji}
          </span>
        ))}
    </div>
  );
}

type Msg = { role: "user" | "assistant"; content: string };

export function MentorChat() {
  const { mentorOpen, setMentorOpen } = useApp();
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Paz de Cristo, irmão(ã). Sou o Barnabéé, seu Mentor IA — estou aqui para te ajudar a compreender a Palavra, mas jamais para substituir seu pastor, discipulador ou igreja local. Como posso servir você hoje?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  if (!mentorOpen) return null;

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok || !res.body) throw new Error("Falha ao conversar com o Mentor.");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      setMessages((m) => [...m, { role: "assistant", content: "" }]);
      // read SSE-ish stream from Lovable AI (chat.completions delta chunks)
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
            // ignore
          }
        }
      }
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Perdão, tive dificuldade em responder agora. Tente novamente." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center">
      <div className="flex h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-border bg-surface shadow-2xl sm:rounded-3xl animate-slide-up">
        <header className="flex items-center justify-between border-b border-border bg-gradient-to-r from-primary/20 to-primary-glow/20 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-primary-glow">
              <img src="/isheep-img.png" alt="Barnabéé, Mentor IA" className="h-full w-full object-cover" />
            </div>
            <div>
              <h2 className="text-sm font-semibold">Barnabéé</h2>
              <p className="text-[10px] text-muted-foreground">
                Mentor IA · Companheiro de estudo, não substituto pastoral
              </p>
            </div>
          </div>
          <button
            onClick={() => setMentorOpen(false)}
            aria-label="Fechar"
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {messages.map((m, i) => (
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
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl bg-surface-2 px-4 py-2.5 text-sm text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> refletindo…
              </div>
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send();
          }}
          className="flex items-end gap-2 border-t border-border bg-surface p-3"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send();
              }
            }}
            rows={1}
            placeholder="Pergunte sobre um versículo, dúvida ou tema…"
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
    </div>
  );
}
