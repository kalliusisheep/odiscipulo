import { useApp } from "@/lib/app-context";
import { useMascot, type MascotEvent } from "@/lib/mascot";
import { supabase } from "@/integrations/supabase/client";
import {
  fetchMentorMemories,
  buildMemoryContext,
  buildMemoryGreeting,
  extractAndSaveMemory,
} from "@/lib/mentor-memory";
import { Send, X, Loader2, History } from "lucide-react";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { VoiceNotePlayer } from "@/components/VoiceNotePlayer";
import { uploadChatVoiceMessage } from "@/lib/voice-upload";
import { format } from "date-fns";
import { useState, useRef, useEffect, type PointerEvent as ReactPointerEvent } from "react";

const FAB_SIZE = 56;
const STORAGE_KEY = "disciple.mentorFabPos";
const BUBBLE_VISIBLE_MS = 6000;
const FALLBACK_SRC = "/mentor-fab.gif";

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
  const showParticles =
    event === "jump" || event === "dance" || event === "streak" || event === "pet";
  const particleEmoji =
    event === "streak" ? "🔥" : event === "dance" ? "⭐" : event === "pet" ? "❤️" : "✨";

  // Se a ovelha estiver muito perto do topo da tela, o balão abre pra baixo
  // em vez de pra cima, pra nunca ficar cortado fora da viewport.
  const bubbleBelow = pos.y < 140;

  return (
    <div
      className="fixed z-40"
      style={{ left: pos.x, top: pos.y, width: FAB_SIZE, height: FAB_SIZE }}
    >
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
        <div className="h-full w-full" style={{ transform: "scale(1.08)" }}>
          <img
            src={FALLBACK_SRC}
            alt="Barnabéé, Mentor IA"
            className="pointer-events-none h-full w-full animate-mascot-face object-cover"
            draggable={false}
          />
        </div>
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

type Msg = {
  role: "user" | "assistant";
  content: string;
  audioUrl?: string;
  audioDurationSeconds?: number;
  createdAt?: string;
};

function buildMentorFallback(text: string): string {
  const normalized = text.toLocaleLowerCase("pt-BR");

  if (
    normalized.includes("versículo") ||
    normalized.includes("versiculo") ||
    normalized.includes("passagem") ||
    normalized.includes("explicar")
  ) {
    return "Claro! Envie o livro, o capítulo e o versículo, por exemplo: João 3:16. Vou ajudar você a observar o contexto, a mensagem central e uma aplicação prática.";
  }

  if (
    normalized.includes("oração") ||
    normalized.includes("oracao") ||
    normalized.includes("orar")
  ) {
    return "Posso ajudar você a organizar esse momento de oração. Conte em poucas palavras pelo que deseja orar, e vamos começar com gratidão, entrega e confiança em Deus.";
  }

  return "Estou aqui com você. Posso ajudar a estudar uma passagem, montar um plano de leitura, criar perguntas de reflexão ou organizar uma oração. Qual caminho você quer seguir?";
}

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

  // Memória persistente: quem é o usuário e o que já sabemos dele de
  // conversas anteriores (pedidos de oração, lutas, áreas de crescimento).
  const [userId, setUserId] = useState<string | null>(null);
  const [memoryContext, setMemoryContext] = useState<string | undefined>(undefined);
  const [voiceExpanded, setVoiceExpanded] = useState(false);

  const persistMessage = async (message: Msg) => {
    if (!userId || (!message.content.trim() && !message.audioUrl)) return;
    await supabase.from("mentor_messages").insert({
      user_id: userId,
      role: message.role,
      content: message.content.trim() || null,
      audio_url: message.audioUrl ?? null,
      audio_duration_seconds: message.audioDurationSeconds ?? null,
    });
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  // Ao abrir o chat, busca a memória do usuário: monta o contexto que vai
  // junto em cada requisição ao Mentor e, se a conversa ainda estiver na
  // saudação padrão, personaliza a primeira fala com base no que ele já
  // compartilhou antes ("semana passada você comentou que...").
  useEffect(() => {
    if (!mentorOpen) return;
    let cancelled = false;
    void (async () => {
      const { data } = await supabase.auth.getUser();
      if (cancelled || !data.user) return;
      setUserId(data.user.id);
      const mems = await fetchMentorMemories(data.user.id);
      if (cancelled) return;
      setMemoryContext(buildMemoryContext(mems));
      const { data: savedMessages } = await supabase
        .from("mentor_messages")
        .select("role, content, audio_url, audio_duration_seconds, created_at")
        .eq("user_id", data.user.id)
        .order("created_at", { ascending: true })
        .limit(100);
      if (cancelled) return;
      if (savedMessages?.length) {
        setMessages(savedMessages.map((row) => ({
          role: row.role as "user" | "assistant",
          content: row.content ?? "",
          audioUrl: row.audio_url ?? undefined,
          audioDurationSeconds: row.audio_duration_seconds ?? undefined,
          createdAt: row.created_at,
        })));
      } else {
        setMessages((prev) => {
          if (prev.length !== 1 || prev[0].role !== "assistant") return prev;
          const greeting = buildMemoryGreeting(mems);
          return greeting ? [{ role: "assistant", content: greeting }] : prev;
        });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mentorOpen]);

  if (!mentorOpen) return null;

  const closeChat = () => {
    // Ao fechar, extrai (via um segundo prompt curto e barato) 2-3 fatos
    // duráveis desta conversa e guarda na memória — sem bloquear o fechamento.
    if (userId) void extractAndSaveMemory(userId, messages);
    setMentorOpen(false);
  };

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const userMessage: Msg = { role: "user", content: text, createdAt: new Date().toISOString() };
    const next: Msg[] = [...messages, userMessage];
    setMessages(next);
    void persistMessage(userMessage);
    setInput("");
    setLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
      const res = await fetch(`${supabaseUrl}/functions/v1/mentor-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: anonKey,
          Authorization: `Bearer ${sessionData.session?.access_token ?? anonKey}`,
        },
        body: JSON.stringify({ messages: next, memoryContext }),
      });
      if (!res.ok || !res.body) throw new Error("Falha ao conversar com o Mentor.");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      setMessages((m) => [...m, { role: "assistant", content: "", createdAt: new Date().toISOString() }]);
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
      if (acc.trim()) {
        void persistMessage({ role: "assistant", content: acc });
      }
    } catch {
      const fallback = buildMentorFallback(text);
      const fallbackMessage = { role: "assistant" as const, content: fallback };
      setMessages((m) => [...m, fallbackMessage]);
      void persistMessage(fallbackMessage);
    } finally {
      setLoading(false);
    }
  };

  const sendAudio = async (blob: Blob, seconds: number, mimeType: string) => {
    if (!userId || loading) return;
    const url = await uploadChatVoiceMessage(userId, blob, mimeType);
    const audioMessage: Msg = {
      role: "user",
      content: "",
      audioUrl: url,
      audioDurationSeconds: seconds,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, audioMessage]);
    await persistMessage(audioMessage);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="flex h-[min(760px,92vh)] w-full max-w-lg flex-col overflow-hidden rounded-t-[2rem] border border-primary/25 bg-background shadow-2xl shadow-primary/20 sm:rounded-[2rem] animate-slide-up">
        <header className="relative flex items-center justify-between overflow-hidden border-b border-primary/20 bg-gradient-to-br from-primary/35 via-primary/15 to-indigo-500/20 px-5 py-4">
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-glow p-0.5 shadow-lg shadow-primary/35 ring-2 ring-white/20">
              <img
                src="/isheep-img.png"
                alt="Barnabéé, Mentor IA"
                className="h-full w-full rounded-[0.85rem] object-cover"
              />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-tight">Barnabéé</h2>
              <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <History className="h-3.5 w-3.5 text-primary" />
                <span>Histórico salvo · não substitui o cuidado pastoral</span>
              </div>
            </div>
          </div>
          <button
            onClick={closeChat}
            aria-label="Fechar"
            className="relative z-10 rounded-full border border-white/10 bg-black/10 p-2.5 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-gradient-to-b from-background to-surface/40 px-4 py-5">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                  m.role === "user"
                    ? "rounded-br-md bg-primary text-primary-foreground"
                    : "rounded-bl-md border border-border/70 bg-surface-2 text-foreground"
                }`}
              >
                {m.audioUrl && <VoiceNotePlayer src={m.audioUrl} className="h-9 w-56 max-w-full" />}
                {m.content && <p className={m.audioUrl ? "mt-2" : ""}>{m.content}</p>}
                {m.createdAt && (
                  <p className="mt-1 text-right text-[10px] opacity-60">
                    {format(new Date(m.createdAt), "HH:mm")}
                  </p>
                )}
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
          className="border-t border-border bg-surface/95 p-3 backdrop-blur-xl"
        >
          <div className="flex items-end gap-2">
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
              className={`min-w-0 flex-1 resize-none rounded-2xl border border-border bg-input px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary ${voiceExpanded ? "hidden" : ""}`}
            />
            {input.trim() && !voiceExpanded ? (
              <button
                type="submit"
                disabled={loading}
                aria-label="Enviar mensagem"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all hover:bg-primary-glow disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            ) : (
              <VoiceRecorder
                onSend={sendAudio}
                maxSeconds={60}
                onExpandedChange={setVoiceExpanded}
              />
            )}
          </div>
          <p className="mt-2 px-1 text-[10px] text-muted-foreground">
            Você pode escrever ou enviar uma mensagem de voz para Barnabéé.
          </p>
        </form>
      </div>
    </div>
  );
}
