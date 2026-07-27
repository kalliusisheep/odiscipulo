import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, Loader2 } from "lucide-react";

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
  /**
   * Ponto (0–1, cumulativo) em que cada palavra termina dentro do áudio da
   * sentença, estimado pelo tamanho da palavra (não pela contagem simples de
   * palavras) — palavras maiores levam mais tempo pra serem faladas.
   * wordBoundaries[sentIdx][wordIdx].
   */
  wordBoundaries: number[][];
  /** Quando true, remove um número inicial (ex.: número de versículo) apenas do áudio enviado à narração — o texto exibido na tela não é alterado. */
  stripLeadingNumber: boolean;
};

type Props = {
  /** CSS selector for the container that holds elements marked with data-narrate. */
  containerSelector?: string;
  /** Extra classes for the button */
  className?: string;
};

export function NarrationButton({ containerSelector, className }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "playing" | "paused">("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const unitsRef = useRef<SentenceUnit[]>([]);
  const queueRef = useRef<{ unitIdx: number; sentIdx: number; text: string }[]>([]);
  const cursorRef = useRef(0);
  const cacheRef = useRef<Map<number, Promise<string>>>(new Map());
  const abortRef = useRef<AbortController | null>(null);
  const activeRef = useRef(false);
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
    if (audioRef.current) {
      audioRef.current.ontimeupdate = null;
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    for (const [, p] of cacheRef.current) {
      void p.then((url) => URL.revokeObjectURL(url)).catch(() => {});
    }
    cacheRef.current.clear();
    restoreDOM();
  }, [restoreDOM]);

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  const fetchAudio = useCallback((idx: number): Promise<string> => {
    const cached = cacheRef.current.get(idx);
    if (cached) return cached;
    const item = queueRef.current[idx];
    if (!item) return Promise.reject(new Error("out of range"));
    const unit = unitsRef.current[item.unitIdx];
    // Ex.: "12 No princípio…" -> "No princípio…" só para o áudio (a tela
    // continua mostrando "12"). Só se aplica a blocos marcados explicitamente.
    let spokenText = item.text;
    if (unit?.stripLeadingNumber) {
      const stripped = item.text.replace(/^\d{1,3}[.\s]+/, "").trim();
      if (stripped) spokenText = stripped;
    }
    const p = (async () => {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: spokenText }),
      });
      if (!res.ok) throw new Error(`TTS ${res.status}`);
      const blob = await res.blob();
      return URL.createObjectURL(blob);
    })();
    cacheRef.current.set(idx, p);
    return p;
  }, []);

  // Destaca a palavra `wordIdx` da sentença em `idx` (índice na fila).
  // Idempotente: se já é a palavra destacada, não faz nada (evita
  // scroll/DOM redundantes a cada "timeupdate").
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

  const playFrom = useCallback(
    async (idx: number) => {
      if (!activeRef.current) return;
      if (idx >= queueRef.current.length) {
        setStatus("idle");
        cleanup();
        return;
      }
      cursorRef.current = idx;
      setStatus("loading");
      try {
        const [url] = await Promise.all([fetchAudio(idx)]);
        // Prefetch next in background
        if (idx + 1 < queueRef.current.length) {
          fetchAudio(idx + 1).catch(() => {});
        }
        if (!activeRef.current) return;
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onended = () => {
          if (!activeRef.current) return;
          void playFrom(idx + 1);
        };
        audio.onerror = () => {
          if (!activeRef.current) return;
          void playFrom(idx + 1);
        };
        // Sem timestamps reais por palavra vindos da API de voz — estima a
        // palavra atual pelas fronteiras ponderadas por tamanho de palavra
        // (wordBoundaries), com uma pequena antecipação pra compensar o
        // atraso natural de renderização/scroll e não parecer "atrasado".
        const LEAD_SECONDS = 0.12;
        audio.ontimeupdate = () => {
          if (!activeRef.current) return;
          const item = queueRef.current[idx];
          const unit = item ? unitsRef.current[item.unitIdx] : null;
          const words = item ? unit?.wordGroups[item.sentIdx] : null;
          const boundaries = item ? unit?.wordBoundaries[item.sentIdx] : null;
          if (!words || !boundaries || words.length === 0) return;
          const duration = audio.duration;
          if (!duration || Number.isNaN(duration)) return;
          const progress = Math.min(
            Math.max((audio.currentTime + LEAD_SECONDS) / duration, 0),
            0.999,
          );
          let wordIdx = boundaries.findIndex((b) => progress <= b);
          if (wordIdx === -1) wordIdx = boundaries.length - 1;
          highlightWordAt(idx, wordIdx);
        };
        highlightWordAt(idx, 0);
        await audio.play();
        setStatus("playing");
      } catch (e) {
        console.error("TTS error", e);
        if (activeRef.current) void playFrom(idx + 1);
      }
    },
    [cleanup, fetchAudio, highlightWordAt],
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
    const queue: { unitIdx: number; sentIdx: number; text: string }[] = [];
    nodes.forEach((el) => {
      // Usa o texto visível original (mantém números de versículo etc. na
      // tela e no destaque); a remoção acontece só no áudio, em fetchAudio.
      const text = el.textContent ?? "";
      const sentences = splitSentences(text);
      if (sentences.length === 0) return;
      const originalHTML = el.innerHTML;
      // Reconstrói o innerHTML com um <span> por palavra (preserva classes
      // do elemento pai) — o destaque acontece palavra a palavra.
      el.textContent = "";
      const wordGroups: HTMLSpanElement[][] = [];
      const wordBoundaries: number[][] = [];
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
        // Peso de cada palavra = número de caracteres + 1 (aproxima a pausa
        // entre palavras); palavras maiores "ocupam" mais tempo estimado.
        const weights = words.map((w) => w.length + 1);
        const total = weights.reduce((a, b) => a + b, 0) || 1;
        let acc = 0;
        const boundaries = weights.map((w) => {
          acc += w;
          return acc / total;
        });
        wordBoundaries.push(boundaries);
        if (i < sentences.length - 1) el.appendChild(document.createTextNode(" "));
      });
      const unitIdx = units.length;
      const stripLeadingNumber = el.dataset.narrateStripNumbers === "true";
      units.push({ el, originalHTML, sentences, wordGroups, wordBoundaries, stripLeadingNumber });
      sentences.forEach((s, i) => queue.push({ unitIdx, sentIdx: i, text: s }));
    });
    unitsRef.current = units;
    queueRef.current = queue;
    return queue.length > 0;
  }, [containerSelector]);

  const handleClick = useCallback(async () => {
    if (status === "playing") {
      audioRef.current?.pause();
      setStatus("paused");
      return;
    }
    if (status === "paused") {
      try {
        await audioRef.current?.play();
        setStatus("playing");
      } catch {
        /* ignore */
      }
      return;
    }
    // idle → start
    activeRef.current = true;
    const ok = buildQueue();
    if (!ok) {
      activeRef.current = false;
      return;
    }
    await playFrom(0);
  }, [buildQueue, playFrom, status]);

  const isBusy = status === "loading";
  const label =
    status === "playing"
      ? "Pausar narração"
      : status === "paused"
        ? "Continuar narração"
        : status === "loading"
          ? "Carregando narração"
          : "Ouvir narração";

  return (
    <button
      type="button"
      onClick={() => void handleClick()}
      aria-label={label}
      title={label}
      className={
        className ??
        "inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-primary shadow-sm transition-colors hover:bg-primary/10"
      }
    >
      {isBusy ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : status === "playing" ? (
        <Pause className="h-4 w-4" />
      ) : (
        <Play className="h-4 w-4" />
      )}
    </button>
  );
}
