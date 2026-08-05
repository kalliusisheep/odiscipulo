import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { BIBLE_BOOKS, bookById, bookNameById } from "@/data/bible-books";
import { PT_TRANSLATIONS, searchBible, translationByCode } from "@/lib/bible-source";
import { listReadChapters } from "@/lib/bible-user-data";
import { useBiblePrefs } from "@/lib/bible-prefs";
import {
  ArrowLeft,
  BookMarked,
  Check,
  ChevronDown,
  Loader2,
  Play,
  Search,
  X,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/biblia/")({
  head: () => ({
    meta: [
      { title: "Bíblia de Estudos — Disciple" },
      {
        name: "description",
        content:
          "Leia a Bíblia em português com estudo das línguas originais: grego, hebraico, Strong, léxico e referências cruzadas.",
      },
      { property: "og:title", content: "Bíblia de Estudos — Disciple" },
      {
        property: "og:description",
        content: "Leitura bíblica premium com grego, hebraico, léxico e referências cruzadas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: BibliaIndex,
});

type SearchHit = { book: number; chapter: number; verse: number; text: string };

const normalize = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function BibliaIndex() {
  const nav = useNavigate();
  const { translation, setTranslation } = useBiblePrefs();
  const [testament, setTestament] = useState<"AT" | "NT">("AT");
  const [openBook, setOpenBook] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [hits, setHits] = useState<SearchHit[] | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [read, setRead] = useState<{ book: number; chapter: number }[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    void listReadChapters().then(setRead);
  }, []);

  const readSet = useMemo(() => new Set(read.map((r) => `${r.book}:${r.chapter}`)), [read]);
  const last = read[read.length - 1];
  const progressPct = Math.round((read.length / 1189) * 100);

  const q = query.trim();
  const bookMatches = useMemo(() => {
    if (q.length < 1) return [];
    const n = normalize(q);
    return BIBLE_BOOKS.filter(
      (b) => normalize(b.name).includes(n) || normalize(b.abbr).startsWith(n),
    ).slice(0, 6);
  }, [q]);

  const books = useMemo(() => BIBLE_BOOKS.filter((b) => b.testament === testament), [testament]);

  const readByBook = useMemo(() => {
    const map: Record<number, number> = {};
    read.forEach((r) => (map[r.book] = (map[r.book] ?? 0) + 1));
    return map;
  }, [read]);

  const runSearch = async () => {
    if (q.length < 3) return;
    setSearching(true);
    setSearchError(null);
    try {
      setHits(await searchBible(translation, q));
    } catch {
      setHits(null);
      setSearchError("Não foi possível buscar agora. Tente novamente.");
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setHits(null);
    setSearchError(null);
  };

  const openChapters = (id: number) => {
    setOpenBook(id);
    setPickerOpen(true);
  };

  const picker = openBook ? bookById(openBook) : null;

  return (
    <div className="pb-28">
      {/* Header fixo */}
      <div className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto max-w-lg px-4 pt-3 pb-3">
          <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2">
            <button
              onClick={() => void nav({ to: "/perfil" })}
              aria-label="Voltar"
              className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-surface"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <h1 className="truncate text-base font-bold leading-tight">Bíblia de Estudos</h1>
              <p className="truncate text-[10px] text-muted-foreground">
                Grego, hebraico e léxico com fontes acadêmicas
              </p>
            </div>
            <Link
              to="/biblia/marcados"
              aria-label="Meus marcadores"
              className="shrink-0 rounded-full border border-border bg-surface p-2.5 text-primary transition-transform active:scale-95"
            >
              <BookMarked className="h-4 w-4" />
            </Link>
          </div>

          {/* Busca + tradução */}
          <div className="mt-3 flex items-center gap-2">
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-2">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && void runSearch()}
                placeholder="Livro, palavra ou frase…"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              {searching ? (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />
              ) : (
                query && (
                  <button aria-label="Limpar busca" onClick={clearSearch} className="shrink-0">
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                )
              )}
            </div>
            <div className="relative shrink-0">
              <select
                aria-label="Tradução"
                value={translation}
                onChange={(e) => setTranslation(e.target.value)}
                className="appearance-none rounded-full border border-primary/40 bg-primary/10 py-2 pl-3.5 pr-8 text-xs font-bold text-primary outline-none"
              >
                {PT_TRANSLATIONS.map((t) => (
                  <option key={t.code} value={t.code}>
                    {t.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-primary" />
            </div>
          </div>

          {/* Sugestões instantâneas de livro */}
          {bookMatches.length > 0 && !hits && (
            <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
              {bookMatches.map((b) => (
                <button
                  key={b.id}
                  onClick={() => openChapters(b.id)}
                  className="shrink-0 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold transition-colors hover:border-primary/50"
                >
                  {b.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-lg px-4 pt-4 animate-slide-up">
        {searchError && <p className="text-xs text-destructive">{searchError}</p>}

        {hits && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                {hits.length} resultado(s) em {translationByCode(translation).label}
              </p>
              <button onClick={clearSearch} className="text-[11px] font-semibold text-primary">
                Limpar
              </button>
            </div>
            {hits.map((h) => (
              <Link
                key={`${h.book}-${h.chapter}-${h.verse}`}
                to="/biblia/$book/$chapter"
                params={{ book: String(h.book), chapter: String(h.chapter) }}
                className="block rounded-2xl border border-border bg-surface p-3.5 transition-colors hover:border-primary/40"
              >
                <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                  {bookNameById(h.book)} {h.chapter}:{h.verse}
                </p>
                <p className="mt-1 line-clamp-2 text-sm text-foreground/85">{h.text}</p>
              </Link>
            ))}
            {hits.length === 0 && (
              <p className="py-10 text-center text-sm text-muted-foreground">
                Nada encontrado para “{q}”.
              </p>
            )}
          </div>
        )}

        {!hits && (
          <>
            {/* Continuar leitura + progresso num só card */}
            <div className="card-elevated overflow-hidden p-0">
              {last && (
                <Link
                  to="/biblia/$book/$chapter"
                  params={{ book: String(last.book), chapter: String(last.chapter) }}
                  className="flex items-center gap-3 border-b border-border/60 p-4 transition-colors hover:bg-surface-2"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                    <Play className="h-5 w-5 fill-current" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-primary">
                      Continuar leitura
                    </span>
                    <span className="block truncate text-sm font-bold">
                      {bookNameById(last.book)} {last.chapter}
                    </span>
                  </span>
                </Link>
              )}
              <div className="p-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold">Progresso de leitura</span>
                  <span className="text-muted-foreground">
                    {read.length}/1189 · {progressPct}%
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-background">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${Math.max(progressPct, 1)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Testamento */}
            <div className="mt-5 flex rounded-full border border-border bg-surface p-1">
              {(["AT", "NT"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTestament(t)}
                  className={`flex-1 rounded-full py-2 text-xs font-semibold transition-all ${
                    testament === t
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground"
                  }`}
                >
                  {t === "AT" ? "Antigo Testamento" : "Novo Testamento"}
                </button>
              ))}
            </div>

            {/* Grade de livros */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              {books.map((b) => {
                const done = readByBook[b.id] ?? 0;
                const complete = done >= b.chapters;
                return (
                  <button
                    key={b.id}
                    onClick={() => openChapters(b.id)}
                    className="group flex items-center gap-2.5 rounded-2xl border border-border bg-surface p-2.5 text-left transition-all active:scale-[0.98] hover:border-primary/50"
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[11px] font-bold ${
                        complete
                          ? "bg-ancient/20 text-ancient"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {complete ? <Check className="h-4 w-4" /> : b.abbr}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-semibold leading-tight">
                        {b.name}
                      </span>
                      <span className="block text-[10px] text-muted-foreground">
                        {done > 0 ? `${done}/${b.chapters} cap.` : `${b.chapters} cap.`}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Bottom sheet de capítulos */}
      {pickerOpen && picker && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-black/50 animate-fade-in"
          onClick={() => setPickerOpen(false)}
        >
          <div
            className="max-h-[75vh] w-full overflow-y-auto rounded-t-3xl border-t border-border bg-background p-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <h2 className="truncate text-base font-bold">{picker.name}</h2>
                <p className="text-[11px] text-muted-foreground">
                  {picker.chapters} capítulos · toque para ler
                </p>
              </div>
              <button
                aria-label="Fechar"
                onClick={() => setPickerOpen(false)}
                className="rounded-full p-2 text-muted-foreground hover:bg-surface"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 grid grid-cols-6 gap-2">
              {Array.from({ length: picker.chapters }, (_, i) => i + 1).map((c) => {
                const done = readSet.has(`${picker.id}:${c}`);
                return (
                  <Link
                    key={c}
                    to="/biblia/$book/$chapter"
                    params={{ book: String(picker.id), chapter: String(c) }}
                    onClick={() => setPickerOpen(false)}
                    className={`flex h-11 items-center justify-center rounded-xl text-sm font-semibold transition-colors active:scale-95 ${
                      done
                        ? "bg-primary/20 text-primary"
                        : "bg-surface text-foreground/80 hover:bg-primary/10"
                    }`}
                  >
                    {c}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
