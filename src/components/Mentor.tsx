import { useApp } from "@/lib/app-context";
import { useMascot, type MascotEvent } from "@/lib/mascot";
import { supabase } from "@/integrations/supabase/client";
import {
  fetchMentorMemories,
  buildMemoryContext,
  buildMemoryGreeting,
  extractAndSaveMemory,
} from "@/lib/mentor-memory";
import { fetchPassage } from "@/lib/bible";
import { Send, X, Loader2, RotateCcw } from "lucide-react";
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
  isError?: boolean;
  retryText?: string;
};

class MentorRequestError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "MentorRequestError";
  }
}

const MENTOR_RETRYABLE_STATUS = new Set([408, 409, 425, 429, 500, 502, 503, 504]);
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const BIBLE_REFERENCE =
  /\b(?:[1-3]\s*)?(?:G[eê]nesis|[ÊE]xodo|Lev[ií]tico|N[uú]meros|Deuteron[oô]mio|Josu[eé]|Ju[ií]zes|Rute|Samuel|Reis|Cr[oô]nicas|Esdras|Neemias|Ester|J[oó]|Salmos?|Prov[eé]rbios|Eclesiastes|Cantares|Isa[ií]as|Jeremias|Lamenta[cç][oõ]es|Ezequiel|Daniel|Os[eé]ias|Joel|Am[oó]s|Obadias|Jonas|Miqu[eé]ias|Naum|Habacuque|Sofonias|Ageu|Zacarias|Malaquias|Mateus|Marcos|Lucas|Jo[aã]o|Atos|Romanos|Cor[ií]ntios|G[aá]latas|Ef[eé]sios|Filipenses|Colossenses|Tessalonicenses|Tim[oó]teo|Tito|Filemom|Hebreus|Tiago|Pedro|Judas|Apocalipse)\s+\d{1,3}(?::\d{1,3}(?:-\d{1,3})?)?\b/i;

// Mantém uma resposta pastoral útil mesmo quando o provedor gratuito atinge a cota.
function shouldUseSupportMode(error: unknown) {
  if (!(error instanceof MentorRequestError)) return true;
  return !error.status || MENTOR_RETRYABLE_STATUS.has(error.status);
}

async function buildSupportReply(text: string) {
  const normalized = text.toLocaleLowerCase("pt-BR");
  const reference = text.match(BIBLE_REFERENCE)?.[0];

  if (reference) {
    const passage = await fetchPassage(reference, "NVI").catch(() => "");
    const biblicalText = passage
      ? `\n\n${reference}: “${passage.replace(/\s+/g, " ").trim()}”`
      : "";

    return `Claro — vamos começar por ${reference}.${biblicalText}\n\nPara compreender essa passagem com segurança, observe três pontos: o que acontece antes e depois, o que o texto revela sobre Deus e qual resposta prática ele pede de nós. Qual palavra ou parte de ${reference} gerou sua dúvida? Assim eu sigo com você sem tirar o versículo do contexto.`;
  }

  if (/entend|explic|vers[ií]culo|passagem|texto b[ií]blico/.test(normalized)) {
    return "Claro! Envie o livro, o capítulo e o versículo — por exemplo, João 3:16. Eu vou ajudar você a observar o contexto, a mensagem central e uma aplicação prática, sempre incentivando a leitura direta da Bíblia.";
  }

  if (/ora[cç][aã]o|orar|ore por mim/.test(normalized)) {
    return "Posso ajudar você a organizar esse momento de oração. Conte, em poucas palavras, pelo que deseja orar; então vamos separar a oração em gratidão, entrega do pedido e confiança em Deus. Em uma situação sensível, procure também seu pastor ou uma liderança de confiança.";
  }

  if (/ansied|medo|triste|desanim|ang[uú]st|sozinh|luto/.test(normalized)) {
    return "Sinto muito que você esteja passando por isso. Podemos olhar juntos para uma passagem bíblica e transformar o que você está sentindo em uma oração sincera. O que aconteceu hoje? Se houver risco imediato para você ou outra pessoa, busque ajuda presencial e um serviço de emergência agora.";
  }

  return "Estou aqui com você. Posso ajudar a estudar uma passagem, montar um plano de leitura, criar perguntas de reflexão ou organizar uma oração. Diga qual desses caminhos você quer seguir e, se for um texto bíblico, envie também a referência.";
}

async function mentorCredentials(attempt: number) {
  const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;

  if (!anonKey || !supabaseUrl) {
    throw new MentorRequestError("Configuração pública do Supabase ausente.");
  }

  if (attempt >= 2) return { anonKey, supabaseUrl, token: anonKey };

  const { data } =
    attempt === 1 ? await supabase.auth.refreshSession() : await supabase.auth.getSession();

  return {
    anonKey,
    supabaseUrl,
    token: data.session?.access_token ?? anonKey,
  };
}

async function requestMentor(messages: Msg[], memoryContext?: string) {
  let lastError = new MentorRequestError("Falha ao conversar com o Mentor.");

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const { anonKey, supabaseUrl, token } = await mentorCredentials(attempt);
      const res = await fetch(`${supabaseUrl}/functions/v1/mentor-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: anonKey,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          messages: messages.map(({ role, content }) => ({ role, content })),
          memoryContext,
        }),
      });

      if (res.ok && res.body) return res;

      const detail = (await res.text().catch(() => "")).slice(0, 300);
      lastError = new MentorRequestError(
        detail || `Mentor indisponível (${res.status}).`,
        res.status,
      );

      const canRetry =
        res.status === 401 || (MENTOR_RETRYABLE_STATUS.has(res.status) && attempt < 2);
      if (!canRetry) break;
    } catch (error) {
      lastError =
        error instanceof MentorRequestError
          ? error
          : new MentorRequestError(error instanceof Error ? error.message : "Falha de conexão.");
    }

    if (attempt < 2) await wait(600 * (attempt + 1));
  }

  throw lastError;
}

async function readMentorStream(res: Response, onContent: (content: string) => void) {
  if (!res.body) throw new MentorRequestError("Resposta vazia do Mentor.", res.status);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let accumulated = "";
  let buffer = "";

  const consumeLine = (line: string) => {
    const normalized = line.trim();
    if (!normalized.startsWith("data:")) return;
    const data = normalized.slice(5).trim();
    if (!data || data === "[DONE]") return;

    try {
      const chunk = JSON.parse(data);
      const delta = chunk.choices?.[0]?.delta?.content;
      if (typeof delta === "string" && delta) {
        accumulated += delta;
        onContent(accumulated);
      }
    } catch {
      // Um evento incompleto permanece no buffer e será processado no próximo chunk.
    }
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop() ?? "";
    lines.forEach(consumeLine);
  }

  buffer += decoder.decode();
  buffer.split(/\r?\n/).forEach(consumeLine);

  if (!accumulated.trim()) {
    throw new MentorRequestError("O Mentor encerrou a resposta sem conteúdo.");
  }

  return accumulated;
}

function mentorErrorMessage(error: unknown) {
  if (error instanceof MentorRequestError && error.status === 429) {
    return "Estou recebendo muitas perguntas agora. Aguarde alguns segundos e tente novamente.";
  }
  if (error instanceof MentorRequestError && error.status === 401) {
    return "Sua sessão precisou ser renovada, mas não consegui concluir a resposta. Tente novamente.";
  }
  return "Tive uma instabilidade ao responder. Sua mensagem foi preservada — tente novamente.";
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
      setMessages((prev) => {
        if (prev.length !== 1 || prev[0].role !== "assistant") return prev;
        const greeting = buildMemoryGreeting(mems);
        return greeting ? [{ role: "assistant", content: greeting }] : prev;
      });
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

  const send = async (retryText?: string) => {
    const text = (retryText ?? input).trim();
    if (!text || loading) return;
    const validMessages = messages.filter((message) => !message.isError);
    const next: Msg[] = retryText
      ? validMessages
      : [...validMessages, { role: "user", content: text }];
    setMessages(next);
    if (!retryText) setInput("");
    setLoading(true);
    let placeholderAdded = false;
    try {
      const res = await requestMentor(next, memoryContext);
      setMessages((m) => [...m, { role: "assistant", content: "" }]);
      placeholderAdded = true;

      await readMentorStream(res, (content) => {
        setMessages((current) => {
          const copy = [...current];
          copy[copy.length - 1] = { role: "assistant", content };
          return copy;
        });
      });
    } catch (err) {
      console.warn("Mentor IA indisponível:", err instanceof Error ? err.message : err);
      if (shouldUseSupportMode(err)) {
        const supportReply = await buildSupportReply(text);
        setMessages((current) => {
          const clean = placeholderAdded ? current.slice(0, -1) : current;
          return [...clean, { role: "assistant", content: supportReply }];
        });
        return;
      }
      setMessages((current) => {
        const clean = placeholderAdded ? current.slice(0, -1) : current;
        return [
          ...clean,
          {
            role: "assistant",
            content: mentorErrorMessage(err),
            isError: true,
            retryText: text,
          },
        ];
      });
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
              <img
                src="/isheep-img.png"
                alt="Barnabéé, Mentor IA"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-sm font-semibold">Barnabéé</h2>
              <p className="text-[10px] text-muted-foreground">
                Mentor IA · Companheiro de estudo, não substituto pastoral
              </p>
            </div>
          </div>
          <button
            onClick={closeChat}
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
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : m.isError
                      ? "border border-amber-500/25 bg-amber-500/[0.08] text-foreground"
                      : "bg-surface-2 text-foreground"
                }`}
              >
                {m.content || <span className="text-muted-foreground">…</span>}
                {m.isError && m.retryText && (
                  <button
                    type="button"
                    onClick={() => void send(m.retryText)}
                    disabled={loading}
                    className="mt-2.5 flex min-h-9 items-center gap-2 rounded-full border border-amber-500/25 bg-background/60 px-3 text-xs font-bold text-amber-500 transition-colors hover:bg-amber-500/10 disabled:opacity-50"
                  >
                    <RotateCcw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                    Tentar novamente
                  </button>
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
