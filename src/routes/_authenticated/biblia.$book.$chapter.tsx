import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
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
import { useBiblePrefs } from "@/lib/bible-prefs";
import { VerseActionSheet } from "@/components/bible/VerseActionSheet";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Minus,
  Plus,
  Star,
  StickyNote,
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

  const [verses, setVerses] = useState<Verse[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [highlights, setHighlights] = useState<BibleHighlight[]>([]);
  const [notes, setNotes] = useState<BibleNote[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [noteFor, setNoteFor] = useState<number | null>(null);
  const [noteText, setNoteText] = useState("");

  const meta = bookById(book);

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
    <div className="mx-auto max-w-lg px-4 pt-4 pb-28 animate-slide-up">
      <div className="flex items-center gap-2">
        <Link to="/biblia" aria-label="Voltar" className="rounded-full p-2 text-muted-foreground hover:bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-bold">
            {bookNameById(book)} {chapter}
          </h1>
          <p className="text-[11px] text-muted-foreground">{translationByCode(translation).full}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1 rounded-full border border-border bg-surface p-1">
          <button
            onClick={() => setFont(fontIndex - 1)}
            aria-label="Diminuir fonte"
            className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-background"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="text-[11px] font-bold text-muted-foreground">A</span>
          <button
            onClick={() => setFont(fontIndex + 1)}
            aria-label="Aumentar fonte"
            className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-background"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {PT_TRANSLATIONS.map((t) => (
          <button
            key={t.code}
            onClick={() => setTranslation(t.code)}
            className={`shrink-0 rounded-full border px-3 py-1 text-[11px] font-semibold transition-all ${
              translation === t.code
                ? "border-primary bg-primary/15 text-primary"
                : "border-border bg-surface text-muted-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {!verses && !error && (
        <div className="mt-16 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}
      {error && <p className="mt-10 text-center text-sm text-destructive">{error}</p>}

      {verses && (
        <div className="mt-5 space-y-1">
          {verses.map((v) => {
            const color = highlightMap[v.verse];
            return (
              <button
                key={v.verse}
                onClick={() => setSelected(v.verse)}
                className={`block w-full rounded-xl px-2 py-1.5 text-left transition-colors ${
                  color ? highlightClass(color) : "hover:bg-surface"
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

      <div className="mt-8 flex items-center justify-between gap-3">
        <button
          onClick={() => go(-1)}
          disabled={chapter <= 1}
          className="flex items-center gap-1.5 rounded-2xl border border-border bg-surface px-4 py-2.5 text-sm font-medium disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" /> Anterior
        </button>
        <button
          onClick={() => go(1)}
          disabled={!meta || chapter >= meta.chapters}
          className="flex items-center gap-1.5 rounded-2xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-40"
        >
          Próximo <ChevronRight className="h-4 w-4" />
        </button>
      </div>

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
