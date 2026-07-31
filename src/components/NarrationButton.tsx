import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, Loader2, AlertCircle } from "lucide-react";

/**
 * Divide um texto em sentenças respeitando pontuação portuguesa.
 * Mantém fragmentos curtos anexados à sentença anterior.
 */
function splitSentences(text: string): string[] {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return [];
  const matches = clean.match(/[^.!?…]+[.!?…]+["')\]]*|[^.!?…]+$/g);
  if (!matches) return [clean];
  const out: string[] = [];
  for (const raw of matches) {
    const s = raw.trim();
    if (!s) continue;
    if (s.length < 12 && out.length > 0) {
      out[out.length - 1] = `${out[out.length - 1]} ${s}`;
    } else {
      out.push(s);
    }
  }
  return out;
}

type SentenceUnit = {
  el: HTMLElement;
  originalHTML: string;
  sentences: string[];
  /** Spans de cada palavra, agrupados por sentença: wordGroups[sentIdx][wordIdx]. */
  wordGroups: HTMLSpanElement[][];
  /** Quando true, remove um número inicial (ex.: número de versículo) apenas do áudio enviado à narração — o texto exibido na tela não é alterado. */
  stripLeadingNumber: boolean;
};

type QueueItem = {
  unitIdx: number;
  sentIdx: number;
  /** Texto realmente falado (pode ter o número inicial removido). */
  spokenText: string;
  /** Índice (na palavra exibida) do primeiro item falado — usado quando um número inicial foi removido só do áudio. */
  removedCorrection: number;
  /** Posição (em caracteres, dentro de spokenText) em que cada palavra falada começa. */
  wordStarts: number[];
};

type Props = {
  /** CSS selector for the container that holds elements marked with data-narrate. */
  containerSelector?: string;
  /** Extra classes for the button */
  className?: string;
};

/** Depois dessa quantidade de falhas seguidas, paramos tudo em vez de tentar pra sempre. */
const MAX_CONSECUTIVE_FAILURES = 2;
/** Quanto tempo (ms) o ícone de erro fica visível antes de voltar ao estado normal. */
const ERROR_DISPLAY_MS = 2500;

/** Voz local (do próprio aparelho) em português — usada como rede de segurança. */
function pickPortugueseVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;
  return (
    voices.find((v) => v.lang?.toLowerCase().startsWith("pt-br")) ??
    voices.find((v) => v.lang?.toLowerCase().startsWith("pt")) ??
    null
  );
}

function localSpeechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function NarrationButton({ containerSelector, className }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "playing" | "paused" | "error">(
    "idle",
  );
  const unitsRef = useRef<SentenceUnit[]>([]);
  const queueRef = useRef<QueueItem[]>([]);
  const activeRef = useRef(false);
  const failuresRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Quando a geração de áudio de IA não está disponível (sem créditos, rede,
  // etc.), passamos a narrar com a voz do próprio aparelho — sempre grátis.
  const localModeRef = useRef(false);
  // Cache de áudio já buscado nesta sessão (evita rebaixar o mesmo trecho ao repetir).
  const audioCacheRef = useRef<Map<string, string>>(new Map());
  const abortRef = useRef<AbortController | null>(null);
  // Tempos estimados (segundos) de início de cada palavra da sentença tocando agora.
  const wordTimesRef = useRef<number[]>([]);
  // Palavra atualmente destacada — guardada por referência (não por índice)
  // pra poder limpar o destaque anterior mesmo trocando de sentença.
  const highlightedWordRef = useRef<HTMLSpanElement | null>(null);


  const restoreDOM = useCallback(() => {
    for (const u of unitsRef.current) {
      u.el.innerHTML = u.originalHTML;
    }
    unitsRef.current = [];
    queueRef.current = [];
    highlightedWordRef.current = null;
  }, []);

  const cleanup = useCallback(() => {
    activeRef.current = false;
    abortRef.current?.abort();
    abortRef.current = null;
    if (localSpeechSupported()) window.speechSynthesis.cancel();
    const audio = audioRef.current;
    if (audio) {
      audio.onloadedmetadata = null;
      audio.ontimeupdate = null;
      audio.onended = null;
      audio.onerror = null;
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }
    // Libera a memória dos áudios em cache (blob URLs) desta sessão de narração.
    for (const url of audioCacheRef.current.values()) URL.revokeObjectURL(url);
    audioCacheRef.current.clear();
    wordTimesRef.current = [];
    restoreDOM();
  }, [restoreDOM]);


  useEffect(() => {
    audioRef.current = new Audio();
    return () => cleanup();
  }, [cleanup]);

  // Destaca a palavra `wordIdx` da sentença em `idx` (índice na fila).
  const highlightWordAt = useCallback((idx: number, wordIdx: number) => {
    const item = queueRef.current[idx];
    if (!item) return;
    const unit = unitsRef.current[item.unitIdx];
    const words = unit?.wordGroups[item.sentIdx];
    const span = words?.[wordIdx];
    if (!span || span === highlightedWordRef.current) return;
    highlightedWordRef.current?.classList.remove("tts-active");
    span.classList.add("tts-active");
    highlightedWordRef.current = span;
    span.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const showErrorAndStop = useCallback(() => {
    activeRef.current = false;
    setStatus("error");
    cleanup();
    setTimeout(() => setStatus("idle"), ERROR_DISPLAY_MS);
  }, [cleanup]);

  /** Busca o áudio (via cache local ou pelo endpoint /api/tts) e devolve uma blob URL. */
  const fetchAudioUrl = useCallback(async (spokenText: string, signal: AbortSignal) => {
    const cached = audioCacheRef.current.get(spokenText);
    if (cached) return cached;
    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: spokenText }),
      signal,
    });
    if (!res.ok) throw new Error(`tts ${res.status}`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    audioCacheRef.current.set(spokenText, url);
    return url;
  }, []);

  // Referência para permitir recursão entre os dois modos de narração.
  const playFromRef = useRef<(idx: number) => void>(() => {});

  /** Narra com a voz do próprio aparelho (grátis e ilimitada). */
  const playLocalFrom = useCallback(
    (idx: number) => {
      if (!activeRef.current) return;
      if (!localSpeechSupported()) {
        showErrorAndStop();
        return;
      }
      if (idx >= queueRef.current.length) {
        setStatus("idle");
        cleanup();
        return;
      }
      const item = queueRef.current[idx];
      const synth = window.speechSynthesis;
      synth.cancel();

      const utter = new SpeechSynthesisUtterance(item.spokenText);
      utter.lang = "pt-BR";
      const voice = pickPortugueseVoice();
      if (voice) utter.voice = voice;
      utter.rate = 0.95;
      utter.pitch = 1;

      utter.onboundary = (event) => {
        if (!activeRef.current) return;
        const charIndex = event.charIndex ?? 0;
        let wordIdxInSpoken = 0;
        for (let i = 0; i < item.wordStarts.length; i++) {
          if (charIndex >= item.wordStarts[i]) wordIdxInSpoken = i;
          else break;
        }
        highlightWordAt(idx, wordIdxInSpoken + item.removedCorrection);
      };
      utter.onend = () => {
        if (!activeRef.current) return;
        playLocalFrom(idx + 1);
      };
      utter.onerror = () => {
        if (!activeRef.current) return;
        playLocalFrom(idx + 1);
      };

      setStatus("playing");
      highlightWordAt(idx, item.removedCorrection);
      synth.speak(utter);
    },
    [cleanup, highlightWordAt, showErrorAndStop],
  );

  /** Passa a usar a voz do aparelho quando a voz de IA não estiver disponível. */
  const switchToLocal = useCallback(
    (idx: number) => {
      if (!localSpeechSupported()) {
        showErrorAndStop();
        return;
      }
      localModeRef.current = true;
      playLocalFrom(idx);
    },
    [playLocalFrom, showErrorAndStop],
  );

  const playFrom = useCallback(
    (idx: number) => {
      if (!activeRef.current) return;
      if (localModeRef.current) {
        playLocalFrom(idx);
        return;
      }
      if (idx >= queueRef.current.length) {
        setStatus("idle");
        cleanup();
        return;
      }
      const audio = audioRef.current;
      if (!audio) {
        switchToLocal(idx);
        return;
      }

      setStatus("loading");
      const item = queueRef.current[idx];
      const controller = new AbortController();
      abortRef.current = controller;

      fetchAudioUrl(item.spokenText, controller.signal)
        .then((url) => {
          if (!activeRef.current) return;

          // Pré-busca a próxima sentença em paralelo, pra tocar sem espera na sequência.
          const next = queueRef.current[idx + 1];
          if (next && !audioCacheRef.current.has(next.spokenText)) {
            void fetchAudioUrl(next.spokenText, controller.signal).catch(() => {
              /* se a pré-busca falhar, tentamos de novo quando chegar a vez dela */
            });
          }

          audio.src = url;

          audio.onloadedmetadata = () => {
            const total = item.spokenText.length || 1;
            const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
            wordTimesRef.current = item.wordStarts.map((pos) => (pos / total) * duration);
          };

          audio.ontimeupdate = () => {
            if (!activeRef.current) return;
            const times = wordTimesRef.current;
            let wordIdxInSpoken = 0;
            for (let i = 0; i < times.length; i++) {
              if (audio.currentTime >= times[i]) wordIdxInSpoken = i;
              else break;
            }
            highlightWordAt(idx, wordIdxInSpoken + item.removedCorrection);
          };

          audio.onended = () => {
            if (!activeRef.current) return;
            playFromRef.current(idx + 1);
          };

          audio.onerror = () => {
            if (!activeRef.current) return;
            console.error("Narração: erro ao tocar áudio");
            failuresRef.current += 1;
            if (failuresRef.current >= MAX_CONSECUTIVE_FAILURES) {
              switchToLocal(idx);
              return;
            }
            playFromRef.current(idx + 1);
          };

          failuresRef.current = 0;
          setStatus("playing");
          highlightWordAt(idx, item.removedCorrection);
          void audio.play().catch(() => {
            if (!activeRef.current) return;
            failuresRef.current += 1;
            if (failuresRef.current >= MAX_CONSECUTIVE_FAILURES) switchToLocal(idx);
            else playFromRef.current(idx + 1);
          });
        })
        .catch((err) => {
          if (!activeRef.current || (err as Error)?.name === "AbortError") return;
          console.error("Narração: voz de IA indisponível, usando a voz do aparelho", err);
          // Sem áudio de IA (sem créditos, rede instável, etc.): a narração
          // continua com a voz nativa do aparelho, sem interromper a leitura.
          switchToLocal(idx);
        });
    },
    [cleanup, fetchAudioUrl, highlightWordAt, playLocalFrom, switchToLocal],
  );

  useEffect(() => {
    playFromRef.current = playFrom;
  }, [playFrom]);


  const buildQueue = useCallback((): boolean => {
    const container = containerSelector
      ? document.querySelector<HTMLElement>(containerSelector)
      : document;
    if (!container) return false;
    const nodes = Array.from(
      (container as ParentNode).querySelectorAll<HTMLElement>("[data-narrate]"),
    );
    if (nodes.length === 0) return false;

    const units: SentenceUnit[] = [];
    const queue: QueueItem[] = [];
    nodes.forEach((el) => {
      // Usa o texto visível original (mantém números de versículo etc. na
      // tela e no destaque); a remoção acontece só no áudio.
      const text = el.textContent ?? "";
      const sentences = splitSentences(text);
      if (sentences.length === 0) return;
      const originalHTML = el.innerHTML;
      // Reconstrói o innerHTML com um <span> por palavra (preserva classes
      // do elemento pai) — o destaque acontece palavra a palavra.
      el.textContent = "";
      const wordGroups: HTMLSpanElement[][] = [];
      const stripLeadingNumber = el.dataset.narrateStripNumbers === "true";
      sentences.forEach((s, i) => {
        const words = s.split(/\s+/).filter(Boolean);
        const wordSpans: HTMLSpanElement[] = [];
        words.forEach((w, wi) => {
          const span = document.createElement("span");
          span.className = "tts-word";
          span.textContent = w;
          el.appendChild(span);
          wordSpans.push(span);
          if (wi < words.length - 1) el.appendChild(document.createTextNode(" "));
        });
        wordGroups.push(wordSpans);
        if (i < sentences.length - 1) el.appendChild(document.createTextNode(" "));
      });

      const unitIdx = units.length;
      units.push({ el, originalHTML, sentences, wordGroups, stripLeadingNumber });

      sentences.forEach((s, i) => {
        let spokenText = s;
        let removedCorrection = 0;
        if (stripLeadingNumber) {
          const stripped = s.replace(/^\d{1,3}[.\s]+/, "").trim();
          if (stripped && stripped !== s.trim()) {
            const originalWordCount = s.split(/\s+/).filter(Boolean).length;
            const strippedWordCount = stripped.split(/\s+/).filter(Boolean).length;
            removedCorrection = Math.max(0, originalWordCount - strippedWordCount);
            spokenText = stripped;
          }
        }
        const spokenWords = spokenText.split(/\s+/).filter(Boolean);
        const wordStarts: number[] = [];
        let cursor = 0;
        for (const w of spokenWords) {
          const foundAt = spokenText.indexOf(w, cursor);
          const start = foundAt === -1 ? cursor : foundAt;
          wordStarts.push(start);
          cursor = start + w.length;
        }
        queue.push({ unitIdx, sentIdx: i, spokenText, removedCorrection, wordStarts });
      });
    });
    unitsRef.current = units;
    queueRef.current = queue;
    return queue.length > 0;
  }, [containerSelector]);

  const handleClick = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) {
      showErrorAndStop();
      return;
    }

    if (status === "playing") {
      audio.pause();
      setStatus("paused");
      return;
    }
    if (status === "paused") {
      void audio.play();
      setStatus("playing");
      return;
    }
    if (status === "error" || status === "loading") return;

    // idle → start
    activeRef.current = true;
    failuresRef.current = 0;
    const ok = buildQueue();
    if (!ok) {
      activeRef.current = false;
      return;
    }
    playFrom(0);
  }, [buildQueue, playFrom, status, showErrorAndStop]);

  const isBusy = status === "loading";
  const label =
    status === "playing"
      ? "Pausar narração"
      : status === "paused"
        ? "Continuar narração"
        : status === "loading"
          ? "Carregando narração"
          : status === "error"
            ? "Não foi possível narrar (tente novamente)"
            : "Ouvir narração";

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      title={label}
      disabled={status === "error"}
      className={
        className ??
        "inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-primary shadow-sm transition-colors hover:bg-primary/10"
      }
    >
      {isBusy ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : status === "error" ? (
        <AlertCircle className="h-4 w-4 text-destructive" />
      ) : status === "playing" ? (
        <Pause className="h-4 w-4" />
      ) : (
        <Play className="h-4 w-4" />
      )}
    </button>
  );
}
