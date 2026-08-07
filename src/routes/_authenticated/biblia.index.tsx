import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BIBLE_BOOKS, bookById, bookNameById } from "@/data/bible-books";
import { searchBible, translationByCode, translationsForLanguage } from "@/lib/bible-source";
import { listReadChapters } from "@/lib/bible-user-data";
import { useBiblePrefs } from "@/lib/bible-prefs";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useApp } from "@/lib/app-context";
import {
  BookMarked,
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  Loader2,
  Play,
  Search,
  Sparkles,
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
  const { language } = useApp();
  const availableTranslations = useMemo(() => translationsForLanguage(language), [language]);
  const [testament, setTestament] = useState<"AT" | "NT" | null>("AT");
  const [openBook, setOpenBook] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [hits, setHits] = useState<SearchHit[] | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [read, setRead] = useState<{ book: number; chapter: number }[]>([]);
  const [readLoading, setReadLoading] = useState(true);
  const [readError, setReadError] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  const loadReadProgress = useCallback(async () => {
    setReadLoading(true);
    setReadError(false);
    try {
      setRead(await listReadChapters());
    } catch {
      setReadError(true);
    } finally {
      setReadLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadReadProgress();
  }, [loadReadProgress]);

  const readSet = useMemo(() => new Set(read.map((r) => `${r.book}:${r.chapter}`)), [read]);
  const last = read[read.length - 1];
  const progressPct = Math.min(100, Math.round((read.length / 1189) * 100));

  const q = query.trim();
  const bookMatches = useMemo(() => {
    if (q.length < 1) return [];
    const n = normalize(q);
    return BIBLE_BOOKS.filter(
      (b) => normalize(b.name).includes(n) || normalize(b.abbr).startsWith(n),
    ).slice(0, 6);
  }, [q]);


  const readByBook = useMemo(() => {
    const map: Record<number, number> = {};
    read.forEach((r) => (map[r.book] = (map[r.book] ?? 0) + 1));
    return map;
  }, [read]);

  const runSearch = async () => {
    if (q.length < 3) return;
    setSearchError(null);

    const reference = q.match(/^(.+?)\s+(\d{1,3})(?::|\.)(\d{1,3})$/);
    if (reference) {
      const normalizedBook = normalize(reference[1]);
      const book = BIBLE_BOOKS.find(
        (item) => normalize(item.name) === normalizedBook || normalize(item.abbr) === normalizedBook,
      );
      const chapter = Number(reference[2]);
      const verse = Number(reference[3]);
      if (book && chapter >= 1 && chapter <= book.chapters && verse >= 1) {
        await nav({
          to: "/biblia/$book/$chapter",
          params: { book: String(book.id), chapter: String(chapter) },
          hash: "v-" + verse,
        });
        return;
      }
      setSearchError("Referência não encontrada. Use, por exemplo, João 3:16.");
      return;
    }

    setSearching(true);
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
    <div className="bible-index-shell pb-28">
      <div className="bible-index-header sticky top-0 z-30 border-b border-border/20 bg-background/85 backdrop-blur-2xl">
        <div className="bible-index-header-inner mx-auto max-w-lg px-5 pb-4 pt-4">
          <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2">
            <div className="min-w-0">
              <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-muted-foreground/70">
                Bíblia
              </p>
              <h1 className="mt-1 truncate text-[1.35rem] font-semibold leading-none tracking-[-0.02em]">
                Bíblia de Estudos
              </h1>
            </div>

            <ThemeToggle className="h-9 w-9 rounded-full border-border/40 bg-transparent" />
            <Link
              to="/biblia/marcados"
              aria-label="Meus marcadores"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/40 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary active:scale-95"
            >
              <BookMarked className="h-4 w-4" />
            </Link>
          </div>

          <div className="bible-search-panel mt-4">
            <div className="flex items-center gap-2.5 border-b border-border/40 pb-2 transition-colors focus-within:border-primary/50">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground/70" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && void runSearch()}
                placeholder="Buscar livro, referência ou frase"
                aria-label="Buscar na Bíblia"
                className="min-w-0 flex-1 bg-transparent py-1 text-[15px] font-light tracking-[-0.01em] outline-none placeholder:text-muted-foreground/50"
              />
              {searching ? (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />
              ) : query ? (
                <button
                  aria-label="Limpar busca"
                  onClick={clearSearch}
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : null}
              <button
                onClick={() => void runSearch()}
                disabled={q.length < 3 || searching}
                className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary transition-opacity disabled:opacity-30"
              >
                Buscar
              </button>
            </div>

            <div className="mt-2.5 flex items-center justify-end">
              <label className="flex items-center gap-2">
                <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/60">
                  Versão
                </span>
                <span className="relative">
                  <select
                    aria-label="Tradução"
                    value={translation}
                    onChange={(e) => setTranslation(e.target.value)}
                    className="appearance-none rounded-full border border-border/40 bg-transparent py-1 pl-3 pr-7 text-[10px] font-semibold uppercase tracking-[0.12em] text-foreground/80 outline-none transition-colors hover:border-primary/40"
                  >
                    {availableTranslations.map((t) => (
                      <option key={t.code} value={t.code}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
                </span>
              </label>
            </div>
          </div>

          {bookMatches.length > 0 && !hits && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {bookMatches.map((b) => (
                <button
                  key={b.id}
                  onClick={() => openChapters(b.id)}
                  className="shrink-0 rounded-full border border-border/40 px-3 py-1.5 text-[11px] font-medium text-foreground/80 transition-colors hover:border-primary/40 hover:text-primary"
                >
                  {b.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <main className="bible-index-main mx-auto max-w-lg px-5 pt-6 animate-slide-up">
        {searchError && (
          <div className="mb-4 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-xs text-destructive">
            {searchError}
          </div>
        )}

        {readError && (
          <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-border/40 px-4 py-3 text-xs text-muted-foreground">
            <span>Não foi possível carregar seu progresso de leitura.</span>
            <button
              type="button"
              onClick={() => void loadReadProgress()}
              className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {hits && (
          <section aria-live="polite">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-muted-foreground/70">
                  Resultados
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {hits.length} resultado(s) · {translationByCode(translation).label}
                </p>
              </div>
              <button
                onClick={clearSearch}
                className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary"
              >
                Limpar
              </button>
            </div>

            <div className="mt-3 divide-y divide-border/25 border-y border-border/25">
              {hits.map((h) => (
                <Link
                  key={`${h.book}-${h.chapter}-${h.verse}`}
                  to="/biblia/$book/$chapter"
                  params={{ book: String(h.book), chapter: String(h.chapter) }}
                  hash={`v-${h.verse}`}
                  className="group flex items-start gap-3 py-3.5 transition-colors hover:bg-foreground/[0.02]"
                >
                  <span className="min-w-0 flex-1">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
                      {bookNameById(h.book)} {h.chapter}:{h.verse}
                    </span>
                    <span className="mt-1.5 block line-clamp-2 text-[13px] font-light leading-relaxed text-foreground/75">
                      {h.text}
                    </span>
                  </span>
                  <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </Link>
              ))}
            </div>

            {hits.length === 0 && (
              <div className="px-6 py-16 text-center">
                <Search className="mx-auto h-5 w-5 text-muted-foreground/50" />
                <p className="mt-4 text-sm font-medium">Nenhum resultado encontrado</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Tente outra palavra, referência ou expressão.
                </p>
              </div>
            )}
          </section>
        )}

        {!hits && (
          <>
            <section className="bible-journey-card relative isolate overflow-hidden rounded-[1.5rem] border border-border/30 bg-surface/40 p-5">
              <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />

              <div className="relative z-10">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3 w-3 text-primary/70" />
                  <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-muted-foreground/70">
                    Sua jornada na Palavra
                  </p>
                </div>

                {last ? (
                  <Link
                    to="/biblia/$book/$chapter"
                    params={{ book: String(last.book), chapter: String(last.chapter) }}
                    className="group mt-4 flex items-center gap-3.5"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary/25 text-primary transition-colors group-hover:bg-primary/10">
                      <Play className="ml-0.5 h-4 w-4 fill-current" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[9px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/70">
                        Continuar de onde parou
                      </span>
                      <span className="mt-1 block truncate text-lg font-semibold tracking-[-0.02em] text-foreground">
                        {bookNameById(last.book)} {last.chapter}
                      </span>
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                  </Link>
                ) : (
                  <div className="mt-4">
                    <p className="text-lg font-semibold tracking-[-0.02em]">Comece sua leitura hoje</p>
                    <p className="mt-1 text-xs font-light text-muted-foreground">
                      Escolha um livro abaixo e marque seu primeiro capítulo.
                    </p>
                  </div>
                )}

                <div className="mt-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/60">
                      Progresso
                    </span>
                    <span className="text-[10px] font-light text-muted-foreground">
                      {readLoading ? "Carregando…" : `${read.length} de 1189 capítulos · ${progressPct}%`}
                    </span>
                  </div>
                  <div className="mt-2 h-px w-full bg-border/50">
                    <div
                      className="h-px bg-primary transition-all duration-700"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>

                <div className="bible-journey-stats mt-5 grid grid-cols-3 divide-x divide-border/30 border-t border-border/30 pt-4">
                  <div className="pr-3">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/60">
                      Lidos
                    </p>
                    <p className="mt-1.5 text-base font-semibold tracking-[-0.02em]">{read.length}</p>
                  </div>
                  <div className="px-3">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/60">
                      Livros
                    </p>
                    <p className="mt-1.5 text-base font-semibold tracking-[-0.02em]">
                      {new Set(read.map((item) => item.book)).size}/66
                    </p>
                  </div>
                  <div className="pl-3">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/60">
                      Versão
                    </p>
                    <p className="mt-1.5 truncate text-base font-semibold tracking-[-0.02em] text-primary/85">
                      {translationByCode(translation).label}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-9">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="text-[9px] font-semibold uppercase tracking-[0.24em] text-muted-foreground/70">
                  Explore os livros
                </h2>
                <span className="text-[10px] font-light text-muted-foreground/70">66 livros</span>
              </div>

              <div className="bible-testament-accordion mt-3">
                {(["AT", "NT"] as const).map((t) => {
                  const expanded = testament === t;
                  const booksForTestament = BIBLE_BOOKS.filter((book) => book.testament === t);
                  const panelId = `bible-testament-books-${t.toLowerCase()}`;

                  return (
                    <div
                      key={t}
                      className={`bible-testament-group border-t border-border/30 last:border-b ${expanded ? "is-open" : ""}`}
                    >
                      <button
                        type="button"
                        onClick={() => setTestament((current) => (current === t ? null : t))}
                        aria-expanded={expanded}
                        aria-controls={panelId}
                        className="bible-testament-option group flex w-full items-center gap-3 py-4 text-left"
                      >
                        <span
                          className={`bible-testament-badge flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[9px] font-semibold tracking-[0.08em] transition-colors ${
                            expanded
                              ? "border-primary/40 text-primary"
                              : "border-border/50 text-muted-foreground"
                          }`}
                        >
                          {t}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span
                            className={`block text-sm font-medium tracking-[-0.01em] ${expanded ? "text-primary" : "text-foreground"}`}
                          >
                            {t === "AT" ? "Antigo Testamento" : "Novo Testamento"}
                          </span>
                          <span className="mt-0.5 block text-[10px] font-light text-muted-foreground">
                            {t === "AT" ? "39 livros" : "27 livros"}
                          </span>
                        </span>
                        <ChevronDown
                          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 ease-out ${expanded ? "rotate-180 text-primary" : ""}`}
                        />
                      </button>

                      <div
                        id={panelId}
                        role="region"
                        hidden={!expanded}
                        className={`bible-testament-books ${expanded ? "is-open" : ""}`}
                        aria-hidden={!expanded}
                      >
                        <div className="bible-testament-books-inner divide-y divide-border/20 border-t border-border/20 pb-2">
                          {booksForTestament.map((b) => {
                            const done = readByBook[b.id] ?? 0;
                            const complete = done >= b.chapters;
                            const bookPct = Math.round((done / b.chapters) * 100);

                            return (
                              <button
                                key={b.id}
                                type="button"
                                tabIndex={expanded ? 0 : -1}
                                onClick={() => openChapters(b.id)}
                                aria-label={`Abrir ${b.name}`}
                                className="bible-book-card group flex w-full items-center gap-3.5 py-3 text-left transition-colors hover:bg-foreground/[0.02]"
                              >
                                <span
                                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-[9px] font-semibold transition-colors ${
                                    complete
                                      ? "border-primary/40 bg-primary/10 text-primary"
                                      : "border-border/45 text-muted-foreground group-hover:border-primary/30 group-hover:text-primary"
                                  }`}
                                >
                                  {complete ? <Check className="h-3.5 w-3.5" /> : b.abbr}
                                </span>

                                <span className="min-w-0 flex-1">
                                  <span className="flex items-baseline justify-between gap-3">
                                    <span className="truncate text-[14px] font-medium tracking-[-0.01em]">
                                      {b.name}
                                    </span>
                                    <span className="shrink-0 text-[10px] font-light text-muted-foreground/70">
                                      {done > 0 ? `${done}/${b.chapters}` : `${b.chapters} cap.`}
                                    </span>
                                  </span>
                                  <span className="mt-2 block h-px w-full bg-border/40">
                                    <span
                                      className={`block h-px transition-all duration-500 ${complete ? "bg-primary" : "bg-primary/60"}`}
                                      style={{ width: `${bookPct}%` }}
                                    />
                                  </span>
                                </span>

                                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </main>

      {pickerOpen && picker && (
        <div
          className="bible-picker-overlay fixed inset-0 z-50 flex items-end bg-black/65 backdrop-blur-sm animate-fade-in"
          onClick={() => setPickerOpen(false)}
        >
          <div
            className="bible-picker-sheet max-h-[calc(100dvh-1rem)] w-full overflow-y-auto rounded-t-[2rem] border-t border-border/30 bg-background pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-2xl animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 border-b border-border/15 bg-background/95 px-4 pb-3 pt-3 backdrop-blur-xl">
              <div className="mx-auto mb-4 h-1 w-9 rounded-full bg-foreground/15" />
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-muted-foreground">Capítulos</p>
                  <h2 className="mt-1 truncate text-xl font-black tracking-tight">{picker.name}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-primary/10 px-2.5 py-1.5 text-[10px] font-extrabold text-primary">
                    {picker.chapters} capítulos
                  </span>
                  <button
                    aria-label="Fechar"
                    onClick={() => setPickerOpen(false)}
                    className="bible-close-button flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-4 text-[9px] text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Lido
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-surface ring-1 ring-border" /> Não lido
                </span>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-1.5 px-3 pb-5 pt-4 sm:gap-2 sm:px-5">
              {Array.from({ length: picker.chapters }, (_, i) => i + 1).map((c) => {
                const done = readSet.has(`${picker.id}:${c}`);
                return (
                  <Link
                    key={c}
                    to="/biblia/$book/$chapter"
                    params={{ book: String(picker.id), chapter: String(c) }}
                    onClick={() => setPickerOpen(false)}
                    className={`bible-chapter-option relative flex h-11 items-center justify-center rounded-[0.7rem] text-[13px] font-extrabold shadow-sm transition-all active:scale-[0.98] ${
                      done
                        ? "bg-primary text-primary-foreground shadow-primary/15"
                        : "border border-border/30 bg-surface text-foreground/80 hover:border-primary/30 hover:bg-primary/10"
                    }`}
                  >
                    {c}
                    {done && <Check className="absolute right-1 top-1 h-2.5 w-2.5 opacity-75" />}
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
