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
/**
 * Intervalo (ms) do "keep-alive" que evita um bug conhecido do Chrome desktop
 * em que a fala para sozinha depois de ~15s em textos longos.
 */
const KEEP_ALIVE_MS = 10000;

/** Pistas de nomes tipicamente masculinos em vozes de sistema pt-BR/pt-PT. */
const MALE_VOICE_HINTS = [
  "daniel",
  "felipe",
  "ricardo",
  "diego",
  "thiago",
  "tiago",
  "francisco",
  "antonio",
  "antônio",
  "carlos",
  "bruno",
  "fernando",
  "male",
  "masculin",
  "homem",
];

function getVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      resolve([]);
      return;
    }
    const synth = window.speechSynthesis;
    const existing = synth.getVoices();
    if (existing.length > 0) {
      resolve(existing);
      return;
    }
    const handler = () => {
      const voices = synth.getVoices();
      if (voices.length > 0) {
        synth.removeEventListener("voiceschanged", handler);
        clearTimeout(timeoutId);
        resolve(voices);
      }
    };
    synth.addEventListener("voiceschanged", handler);
    // Alguns navegadores nunca disparam "voiceschanged" — depois de 3s,
    // resolve com o que tiver (mesmo que vazio) em vez de travar pra sempre.
    const timeoutId = setTimeout(() => {
      synth.removeEventListener("voiceschanged", handler);
      resolve(synth.getVoices());
    }, 3000);
  });
}

function pickVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null;
  const ptVoices = voices.filter((v) => /^pt/i.test(v.lang));
  const pool = ptVoices.length > 0 ? ptVoices : voices;
  const male = pool.find((v) =>
    MALE_VOICE_HINTS.some((hint) => v.name.toLowerCase().includes(hint)),
  );
  return male ?? pool[0] ?? null;
}

export function NarrationButton({ containerSelector, className }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "playing" | "paused" | "error">(
    "idle",
  );
  const unitsRef = useRef<SentenceUnit[]>([]);
  const queueRef = useRef<QueueItem[]>([]);
  const cursorRef = useRef(0);
  const activeRef = useRef(false);
  const failuresRef = useRef(0);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const keepAliveRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Palavra atualmente destacada — guardada por referência (não por índice)
  // pra poder limpar o destaque anterior mesmo trocando de sentença.
  const highlightedWordRef = useRef<HTMLSpanElement | null>(null);

  // Carrega a lista de vozes do sistema uma única vez e escolhe a melhor
  // voz masculina em português disponível no aparelho.
  useEffect(() => {
    let cancelled = false;
    void getVoices().then((voices) => {
      if (!cancelled) voiceRef.current = pickVoice(voices);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const restoreDOM = useCallback(() => {
    for (const u of unitsRef.current) {
      u.el.innerHTML = u.originalHTML;
    }
    unitsRef.current = [];
    queueRef.current = [];
    highlightedWordRef.current = null;
  }, []);

  const stopKeepAlive = useCallback(() => {
    if (keepAliveRef.current) {
      clearInterval(keepAliveRef.current);
      keepAliveRef.current = null;
    }
  }, []);

  const cleanup = useCallback(() => {
    activeRef.current = false;
    stopKeepAlive();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    utteranceRef.current = null;
    restoreDOM();
  }, [restoreDOM, stopKeepAlive]);

  useEffect(() => {
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

  const playFrom = useCallback(
    (idx: number) => {
      if (!activeRef.current) return;
      if (idx >= queueRef.current.length) {
        setStatus("idle");
        cleanup();
        return;
      }
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        showErrorAndStop();
        return;
      }
      cursorRef.current = idx;
      setStatus("loading");
      const item = queueRef.current[idx];

      const utterance = new SpeechSynthesisUtterance(item.spokenText);
      utterance.voice = voiceRef.current;
      utterance.lang = voiceRef.current?.lang || "pt-BR";
      utterance.rate = 0.97;
      utterance.pitch = 0.85;
      utterance.volume = 1;

      utterance.onstart = () => {
        if (!activeRef.current) return;
        failuresRef.current = 0;
        setStatus("playing");
        highlightWordAt(idx, item.removedCorrection);
      };

      utterance.onboundary = (event) => {
        if (!activeRef.current) return;
        if (event.name && event.name !== "word") return;
        const starts = item.wordStarts;
        let wordIdxInSpoken = 0;
        for (let i = 0; i < starts.length; i++) {
          if (event.charIndex >= starts[i]) wordIdxInSpoken = i;
          else break;
        }
        highlightWordAt(idx, wordIdxInSpoken + item.removedCorrection);
      };

      utterance.onend = () => {
        if (!activeRef.current) return;
        playFrom(idx + 1);
      };

      utterance.onerror = (event) => {
        if (!activeRef.current) return;
        // "interrupted"/"canceled" acontecem quando NÓS paramos de propósito
        // (ex.: usuário clicou em pausar/fechou) — isso não é uma falha real.
        if (event.error === "interrupted" || event.error === "canceled") return;
        console.error("Narração: erro", event.error);
        failuresRef.current += 1;
        if (failuresRef.current >= MAX_CONSECUTIVE_FAILURES) {
          showErrorAndStop();
          return;
        }
        playFrom(idx + 1);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);

      // Workaround para um bug conhecido do Chrome desktop: em textos
      // longos, a síntese de voz às vezes "trava" sozinha depois de ~15s.
      // Pausar e retomar periodicamente evita esse travamento.
      stopKeepAlive();
      keepAliveRef.current = setInterval(() => {
        if (!activeRef.current) return;
        const synth = window.speechSynthesis;
        if (synth.speaking && !synth.paused) {
          synth.pause();
          synth.resume();
        }
      }, KEEP_ALIVE_MS);
    },
    [cleanup, highlightWordAt, showErrorAndStop, stopKeepAlive],
  );

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
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      showErrorAndStop();
      return;
    }
    const synth = window.speechSynthesis;

    if (status === "playing") {
      synth.pause();
      setStatus("paused");
      return;
    }
    if (status === "paused") {
      synth.resume();
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
            ? "Não foi possível narrar (verifique se o navegador suporta narração de voz)"
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
