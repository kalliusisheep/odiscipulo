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
  spans: HTMLSpanElement[];
  sentences: string[];
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

  const restoreDOM = useCallback(() => {
    for (const u of unitsRef.current) {
      u.el.innerHTML = u.originalHTML;
    }
    unitsRef.current = [];
    queueRef.current = [];
  }, []);

  const cleanup = useCallback(() => {
    activeRef.current = false;
    abortRef.current?.abort();
    abortRef.current = null;
    if (audioRef.current) {
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
    const p = (async () => {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: item.text }),
      });
      if (!res.ok) throw new Error(`TTS ${res.status}`);
      const blob = await res.blob();
      return URL.createObjectURL(blob);
    })();
    cacheRef.current.set(idx, p);
    return p;
  }, []);

  const highlight = useCallback((idx: number) => {
    // Remove previous
    for (const u of unitsRef.current) {
      for (const s of u.spans) s.classList.remove("tts-active");
    }
    const item = queueRef.current[idx];
    if (!item) return;
    const span = unitsRef.current[item.unitIdx]?.spans[item.sentIdx];
    if (!span) return;
    span.classList.add("tts-active");
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
        highlight(idx);
        await audio.play();
        setStatus("playing");
      } catch (e) {
        console.error("TTS error", e);
        if (activeRef.current) void playFrom(idx + 1);
      }
    },
    [cleanup, fetchAudio, highlight],
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
      const text = el.textContent ?? "";
      const sentences = splitSentences(text);
      if (sentences.length === 0) return;
      const originalHTML = el.innerHTML;
      // Rebuild innerHTML with sentence spans (text-only, preserves layout classes on parent)
      el.textContent = "";
      const spans: HTMLSpanElement[] = [];
      sentences.forEach((s, i) => {
        const span = document.createElement("span");
        span.className = "tts-sentence";
        span.textContent = s;
        el.appendChild(span);
        if (i < sentences.length - 1) el.appendChild(document.createTextNode(" "));
        spans.push(span);
      });
      const unitIdx = units.length;
      units.push({ el, originalHTML, spans, sentences });
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
