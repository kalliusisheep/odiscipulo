import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { bookById, bookNameById } from "@/data/bible-books";
import { fetchChapter, translationByCode, PT_TRANSLATIONS, type Verse } from "@/lib/bible-source";
import {
  addNote,
  highlightClass,
  listChapterMarks,
  markChapterRead,
  toggleFavorite,
  toggleHighlight,
  type BibleHighlight,
  type BibleNote,
  type HighlightColor,
} from "@/lib/bible-user-data";
import { useBiblePrefs, BIBLE_FONT_SCALES } from "@/lib/bible-prefs";
import { VerseActionSheet } from "@/components/bible/VerseActionSheet";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useApp } from "@/lib/app-context";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Minus,
  Pause,
  Play,
  Plus,
  Square,
  Star,
  Volume2,
  StickyNote,
  Type,
  X,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/biblia/$book/$chapter")({
  head: () => ({
    meta: [
      { title: "Leitura bíblica — Disciple" },
      { name: "description", content: "Leia a Bíblia capítulo a capítulo com destaques, anotações e estudo das línguas originais." },
      { property: "og:title", content: "Leitura bíblica — Disciple" },
      { property: "og:description", content: "Capítulo bíblico com destaques, anotações e estudo original." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ChapterReader,
});

function ChapterReader() {
  const params = Route.useParams();
  const book = Number(params.book);
  const chapter = Number(params.chapter);
  const nav = useNavigate();
  const { translation, setTranslation, fontIndex, setFont, fontSize } = useBiblePrefs();
  const { theme } = useApp();

  const [verses, setVerses] = useState<Verse[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [highlights, setHighlights] = useState<BibleHighlight[]>([]);
  const [notes, setNotes] = useState<BibleNote[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [noteFor, setNoteFor] = useState<number | null>(null);
  const [noteText, setNoteText] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [chapterPicker, setChapterPicker] = useState(false);
  const [narrationIndex, setNarrationIndex] = useState<number | null>(null);
  const [narrationStarted, setNarrationStarted] = useState(false);
  const [narrationPaused, setNarrationPaused] = useState(false);
  const [narrationLoading, setNarrationLoading] = useState(false);
  const [narrationError, setNarrationError] = useState(false);
  const [narrationRate, setNarrationRate] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const speechTokenRef = useRef(0);
  const speakVerseRef = useRef<(index: number, token: number) => void>(() => undefined);
  const verseRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const chapterEndRef = useRef<HTMLDivElement | null>(null);
  const [chapterEndVisible, setChapterEndVisible] = useState(false);

  const meta = bookById(book);

  const stopNarration = useCallback(() => {
    speechTokenRef.current += 1;
    audioRef.current?.pause();
    audioRef.current = null;
    if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    audioUrlRef.current = null;
    setNarrationIndex(null);
    setNarrationStarted(false);
    setNarrationPaused(false);
    setNarrationLoading(false);
    setNarrationError(false);
  }, []);

  const failNarration = useCallback(() => {
    audioRef.current?.pause();
    audioRef.current = null;
    if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    audioUrlRef.current = null;
    setNarrationLoading(false);
    setNarrationPaused(true);
    setNarrationStarted(true);
    setNarrationError(true);
  }, []);

  const speakVerse = useCallback(
    async (index: number, token: number) => {
      if (!verses || token !== speechTokenRef.current) return;
      if (index >= verses.length) {
        stopNarration();
        return;
      }
      setNarrationLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke("bible-tts", {
          body: { text: verses[index].text, rate: narrationRate },
        });
        if (error || !(data instanceof Blob)) throw error ?? new Error("Áudio inválido");
        if (token !== speechTokenRef.current) return;
        const url = URL.createObjectURL(data);
        audioUrlRef.current = url;
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onloadedmetadata = () => {
          if (token !== speechTokenRef.current) return;
          setNarrationIndex(index);
          setNarrationLoading(false);
          setNarrationPaused(false);
          void audio.play();
        };
        audio.onended = () => {
          if (token === speechTokenRef.current) speakVerseRef.current(index + 1, token);
        };
        audio.onerror = () => {
          if (token !== speechTokenRef.current) return;
          failNarration();
          toast.error("Não foi possível carregar a narração.");
        };
      } catch (error) {
        if (token !== speechTokenRef.current) return;
        failNarration();
        toast.error("A narração externa está indisponível no momento.");
        console.error(error);
      }
    },
    [failNarration, narrationRate, stopNarration, verses],
  );

  speakVerseRef.current = speakVerse;

  const startNarration = useCallback(
    (index = 0) => {
      if (!verses) return;
      stopNarration();
      const token = speechTokenRef.current + 1;
      speechTokenRef.current = token;
      setNarrationStarted(true);
      setNarrationPaused(false);
      setNarrationError(false);
      speakVerseRef.current(index, token);
    },
    [stopNarration, verses],
  );

  const toggleNarrationPause = () => {
    const audio = audioRef.current;
    if (!audio || narrationIndex === null) return;
    if (narrationPaused) {
      void audio.play();
      setNarrationPaused(false);
    } else {
      audio.pause();
      setNarrationPaused(true);
    }
  };

  useEffect(() => {
    stopNarration();
  }, [book, chapter, translation, stopNarration]);

  useEffect(() => {
    if (narrationIndex === null || !verses) return;
    verseRefs.current[verses[narrationIndex]?.verse ?? -1]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [narrationIndex, verses]);

  useEffect(() => () => stopNarration(), [stopNarration]);

  useEffect(() => {
    const element = chapterEndRef.current;
    if (!element || !verses) return;
    const observer = new IntersectionObserver(
      ([entry]) => setChapterEndVisible(entry.isIntersecting),
      { threshold: 0.2, rootMargin: "0px 0px 140px 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [verses]);

  useEffect(() => {
    let alive = true;
    setVerses(null);
    setError(null);
    fetchChapter(translation, book, chapter)
      .then((v) => alive && setVerses(v))
      .catch(() => alive && setError("Não foi possível carregar este capítulo."));
    return () => {
      alive = false;
    };
  }, [translation, book, chapter]);

  const reloadMarks = useCallback(async () => {
    const m = await listChapterMarks(book, chapter);
    setHighlights(m.highlights);
    setNotes(m.notes);
    setFavorites(m.favorites.map((f) => f.verse));
  }, [book, chapter]);

  useEffect(() => {
    void reloadMarks();
    void markChapterRead(book, chapter);
    window.scrollTo(0, 0);
  }, [reloadMarks, book, chapter]);

  const highlightMap = useMemo(() => {
    const map: Record<number, string> = {};
    highlights.forEach((h) => (map[h.verse] = h.color));
    return map;
  }, [highlights]);

  const notesByVerse = useMemo(() => {
    const map: Record<number, number> = {};
    notes.forEach((n) => (map[n.verse] = (map[n.verse] ?? 0) + 1));
    return map;
  }, [notes]);

  const selectedText = verses?.find((v) => v.verse === selected)?.text ?? "";
  const label = translationByCode(translation).label;
  const fullRef = selected ? `${bookNameById(book)} ${chapter}:${selected} (${label})` : "";

  const go = (delta: number) => {
    const next = chapter + delta;
    if (!meta) return;
    if (next >= 1 && next <= meta.chapters) {
      void nav({ to: "/biblia/$book/$chapter", params: { book: String(book), chapter: String(next) } });
    }
  };

  const handleShare = async () => {
    const payload = `"${selectedText}"\n— ${fullRef}`;
    if (navigator.share) {
      try {
        await navigator.share({ text: payload });
        return;
      } catch {
        /* cancelado */
      }
    }
    await navigator.clipboard.writeText(payload);
    toast.success("Versículo copiado para compartilhar");
  };

  return (
    <div className={`min-h-screen pb-32 transition-colors ${theme === "light" ? "bg-[#fbfaf7] text-slate-900" : "bg-background text-foreground"}`}>
      {/* Barra superior fixa */}
      <div className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto grid max-w-lg grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 px-4 py-2.5">
          <Link
            to="/biblia"
            aria-label="Voltar"
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-surface"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <button
            onClick={() => setChapterPicker(true)}
            className="min-w-0 rounded-xl px-2 py-1 text-left transition-colors hover:bg-surface"
          >
            <span className="block truncate text-[15px] font-bold leading-tight">
              {bookNameById(book)} {chapter}
            </span>
            <span className="block truncate text-[10px] text-muted-foreground">
              Toque para trocar de capítulo · {label}
            </span>
          </button>
          <ThemeToggle className="h-9 w-9 border-border bg-surface" />
        </div>

      </div>

      <div className="mx-auto max-w-lg px-4 pt-4 animate-slide-up">
        {!verses && !error && (
          <div className="mt-16 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
        {error && <p className="mt-10 text-center text-sm text-destructive">{error}</p>}

        {verses && (
          <div className="space-y-1">
            {verses.map((v) => {
              const color = highlightMap[v.verse];
              return (
                <button
                  key={v.verse}
                  ref={(element) => {
                    verseRefs.current[v.verse] = element;
                  }}
                  onClick={() => setSelected(v.verse)}
                  className={`block w-full rounded-xl px-2 py-1.5 text-left transition-all ${
                    narrationIndex === verses.findIndex((item) => item.verse === v.verse)
                      ? "bg-primary/[0.08] shadow-[inset_3px_0_0_hsl(var(--primary)),0_0_22px_hsl(var(--primary)/0.10)]"
                      : color
                        ? highlightClass(color)
                        : "hover:bg-surface"
                  }`}
                >
                  <span className="mr-1.5 align-super text-[11px] font-bold text-primary">{v.verse}</span>
                  <span className="leading-relaxed" style={{ fontSize }}>
                    {v.text}
                  </span>
                  {favorites.includes(v.verse) && (
                    <Star className="ml-1 inline h-3.5 w-3.5 fill-current text-ancient" />
                  )}
                  {notesByVerse[v.verse] && (
                    <StickyNote className="ml-1 inline h-3.5 w-3.5 text-primary" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {notes.length > 0 && (
          <div className="mt-8 space-y-2">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Suas anotações neste capítulo
            </p>
            {notes.map((n) => (
              <div key={n.id} className="rounded-2xl border border-border bg-surface p-3.5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                  v. {n.verse}
                </p>
                <p className="mt-1 text-sm text-foreground/85">{n.content}</p>
              </div>
            ))}
          </div>
        )}

        {verses && <div ref={chapterEndRef} className="h-24" aria-hidden="true" />}
      </div>

      
      {verses && narrationStarted && (
        <div className="fixed inset-x-0 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-20 px-4">
          <div className="mx-auto flex max-w-lg items-center gap-3 rounded-2xl border border-border bg-background/95 px-3 py-2.5 shadow-xl backdrop-blur-xl">
            <button
              onClick={() => {
                if (narrationError) startNarration(narrationIndex ?? 0);
                else if (narrationIndex !== null) toggleNarrationPause();
              }}
              aria-label={
                narrationLoading
                  ? "Carregando narração"
                  : narrationError
                    ? "Tentar narração novamente"
                    : narrationPaused
                      ? "Continuar narração"
                      : "Pausar narração"
              }
              disabled={narrationLoading}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-transform active:scale-95 disabled:cursor-wait disabled:opacity-70"
            >
              {narrationLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : narrationError || narrationIndex === null || narrationPaused ? (
                <Play className="ml-0.5 h-5 w-5 fill-current" />
              ) : (
                <Pause className="h-5 w-5" />
              )}
            </button>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <Volume2 className="h-3.5 w-3.5 shrink-0 text-primary" />
                <span className="truncate text-[11px] font-bold">
                  {narrationError
                    ? "Não foi possível carregar · toque para tentar novamente"
                    : narrationIndex === null
                      ? "Ouvir capítulo"
                      : narrationPaused
                        ? "Narração pausada"
                        : "Narrando versículo"}
                </span>
                {narrationIndex !== null && <span className="ml-auto shrink-0 text-[10px] font-semibold text-muted-foreground">{narrationIndex + 1}/{verses.length}</span>}
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-2">
                <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${narrationIndex === null ? 0 : ((narrationIndex + 1) / verses.length) * 100}%` }} />
              </div>
            </div>
            <select aria-label="Velocidade da narração" value={narrationRate} onChange={(event) => setNarrationRate(Number(event.target.value))} className="rounded-lg border border-border bg-surface px-1.5 py-1 text-[10px] font-bold text-foreground outline-none">
              {[0.8, 1, 1.2, 1.5].map((rate) => <option key={rate} value={rate}>{rate}x</option>)}
            </select>
            {narrationIndex !== null && <button onClick={stopNarration} aria-label="Parar narração" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"><Square className="h-3.5 w-3.5 fill-current" /></button>}
            <button
              onClick={() => setSettingsOpen(true)}
              aria-label="Fonte e versões da Bíblia"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-primary transition-transform active:scale-95"
            >
              <Type className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Controles de leitura (player + fonte/versões) */}
      {verses && !narrationStarted && (
        <div className="fixed inset-x-0 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-20 px-4">
          <div className="mx-auto flex max-w-lg justify-end gap-2">
            <button
              onClick={() => startNarration()}
              aria-label={narrationLoading ? "Carregando narração" : "Ouvir narração"}
              disabled={narrationLoading}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-transform active:scale-95 disabled:cursor-wait disabled:opacity-70"
            >
              {narrationLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="ml-0.5 h-4 w-4 fill-current" />}
            </button>
            <button
              onClick={() => setSettingsOpen(true)}
              aria-label="Fonte e versões da Bíblia"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background/95 text-primary shadow-lg backdrop-blur-xl transition-transform active:scale-95"
            >
              <Type className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Navegação contextual no fim do capítulo */}
      {verses && chapterEndVisible && (
        <div className="fixed inset-x-0 bottom-[calc(9rem+env(safe-area-inset-bottom))] z-20 flex justify-center px-4 animate-slide-up">
          <div className="flex items-center gap-2 rounded-[1.5rem] border border-primary/20 bg-background/95 p-2 shadow-2xl shadow-primary/15 backdrop-blur-xl">
            <button
              onClick={() => go(-1)}
              disabled={chapter <= 1}
              aria-label="Capítulo anterior"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-border bg-surface text-muted-foreground transition-all hover:border-primary/40 hover:text-primary active:scale-95 disabled:opacity-30"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={() => setChapterPicker(true)}
              aria-label="Escolher capítulo"
              className="min-w-[132px] rounded-2xl px-3 py-1.5 text-center transition-colors hover:bg-surface"
            >
              <span className="block text-[10px] font-extrabold uppercase tracking-[0.16em] text-primary">
                Capítulo atual
              </span>
              <span className="mt-0.5 block text-base font-extrabold">
                {meta?.abbr} {chapter}
                <span className="ml-1 text-muted-foreground">/ {meta?.chapters}</span>
              </span>
            </button>
            <button
              onClick={() => go(1)}
              disabled={!meta || chapter >= meta.chapters}
              aria-label="Próximo capítulo"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-all active:scale-95 disabled:opacity-30"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}

      {/* Sheet de ajustes */}
      {settingsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-black/50 animate-fade-in"
          onClick={() => setSettingsOpen(false)}
        >
          <div
            className="w-full rounded-t-3xl border-t border-border bg-background p-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold">Ajustes de leitura</h2>
              <button
                aria-label="Fechar"
                onClick={() => setSettingsOpen(false)}
                className="rounded-full p-2 text-muted-foreground hover:bg-surface"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Tamanho do texto
            </p>
            <div className="mt-2 flex items-center gap-3">
              <button
                onClick={() => setFont(fontIndex - 1)}
                aria-label="Diminuir fonte"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface disabled:opacity-40"
                disabled={fontIndex <= 0}
              >
                <Minus className="h-4 w-4" />
              </button>
              <div className="flex flex-1 gap-1">
                {BIBLE_FONT_SCALES.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 flex-1 rounded-full ${i <= fontIndex ? "bg-primary" : "bg-surface-2"}`}
                  />
                ))}
              </div>
              <button
                onClick={() => setFont(fontIndex + 1)}
                aria-label="Aumentar fonte"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface disabled:opacity-40"
                disabled={fontIndex >= BIBLE_FONT_SCALES.length - 1}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Tradução
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {PT_TRANSLATIONS.map((t) => (
                <button
                  key={t.code}
                  onClick={() => {
                    setTranslation(t.code);
                    setSettingsOpen(false);
                  }}
                  className={`rounded-2xl border p-3 text-left transition-colors ${
                    translation === t.code
                      ? "border-primary bg-primary/10"
                      : "border-border bg-surface"
                  }`}
                >
                  <span
                    className={`block text-xs font-bold ${
                      translation === t.code ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {t.label}
                  </span>
                  <span className="mt-0.5 block text-[10px] leading-tight text-muted-foreground">
                    {t.full}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sheet de capítulos */}
      {chapterPicker && meta && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-black/50 animate-fade-in"
          onClick={() => setChapterPicker(false)}
        >
          <div
            className="max-h-[70vh] w-full overflow-y-auto rounded-t-3xl border-t border-border bg-background p-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold">{meta.name}</h2>
              <Link to="/biblia" className="text-[11px] font-semibold text-primary">
                Todos os livros
              </Link>
            </div>
            <div className="mt-4 grid grid-cols-6 gap-2">
              {Array.from({ length: meta.chapters }, (_, i) => i + 1).map((c) => (
                <Link
                  key={c}
                  to="/biblia/$book/$chapter"
                  params={{ book: String(book), chapter: String(c) }}
                  onClick={() => setChapterPicker(false)}
                  className={`flex h-11 items-center justify-center rounded-xl text-sm font-semibold transition-colors active:scale-95 ${
                    c === chapter
                      ? "bg-primary text-primary-foreground"
                      : "bg-surface text-foreground/80 hover:bg-primary/10"
                  }`}
                >
                  {c}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {selected !== null && (
        <VerseActionSheet
          open={selected !== null && noteFor === null}
          onOpenChange={(o) => !o && setSelected(null)}
          book={book}
          chapter={chapter}
          verse={selected}
          text={selectedText}
          translationLabel={label}
          isFavorite={favorites.includes(selected)}
          currentColor={highlightMap[selected]}
          onHighlight={async (c: HighlightColor) => {
            await toggleHighlight({ book, chapter, verse: selected }, c);
            await reloadMarks();
          }}
          onFavorite={async () => {
            const on = await toggleFavorite({ book, chapter, verse: selected });
            toast.success(on ? "Adicionado aos favoritos" : "Removido dos favoritos");
            await reloadMarks();
            setSelected(null);
          }}
          onNote={() => {
            setNoteFor(selected);
            setNoteText("");
          }}
          onCopy={async () => {
            await navigator.clipboard.writeText(`"${selectedText}"\n— ${fullRef}`);
            toast.success("Versículo copiado");
            setSelected(null);
          }}
          onShare={() => void handleShare()}
        />
      )}

      {noteFor !== null && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/50 p-0" onClick={() => setNoteFor(null)}>
          <div
            className="w-full rounded-t-3xl bg-background p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
              Anotação · {bookNameById(book)} {chapter}:{noteFor}
            </p>
            <textarea
              autoFocus
              rows={5}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Escreva sua anotação…"
              className="mt-3 w-full resize-none rounded-2xl border border-border bg-input p-3 text-sm outline-none focus:border-primary"
            />
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => setNoteFor(null)}
                className="flex-1 rounded-2xl border border-border py-3 text-sm font-medium text-muted-foreground"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  if (!noteText.trim()) return;
                  await addNote({ book, chapter, verse: noteFor }, noteText.trim());
                  setNoteFor(null);
                  setSelected(null);
                  await reloadMarks();
                  toast.success("Anotação salva");
                }}
                className="flex-1 rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
