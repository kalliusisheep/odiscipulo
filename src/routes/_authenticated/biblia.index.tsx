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
  const [testament, setTestament] = useState<"AT" | "NT">("AT");
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

  const books = useMemo(() => BIBLE_BOOKS.filter((b) => b.testament === testament), [testament]);

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
      <div className="bible-index-header sticky top-0 z-30 bg-background/80 backdrop-blur-2xl">
        <div className="bible-index-header-inner mx-auto max-w-lg px-4 pb-3 pt-3">
          <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3">
            <div className="min-w-0">
              <h1 className="truncate text-lg font-extrabold leading-tight">Bíblia de Estudos</h1>
              <p className="mt-0.5 truncate text-[10px] text-muted-foreground">Leia, marque e aprofunde cada passagem</p>
            </div>

            <ThemeToggle className="h-10 w-10 border-border bg-surface/80" />
            <Link
              to="/biblia/marcados"
              aria-label="Meus marcadores"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-sm transition-all hover:bg-primary/15 active:scale-95"
            >
              <BookMarked className="h-4.5 w-4.5" />
            </Link>
          </div>

          <div className="bible-search-panel mt-3 rounded-[1.35rem] border border-border/30 bg-surface/85 p-1.5 shadow-lg shadow-black/10">
            <div className="flex items-center gap-2 px-2">
              <Search className="h-4.5 w-4.5 shrink-0 text-primary" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && void runSearch()}
                placeholder="Busque livro, referência ou frase"
                aria-label="Buscar na Bíblia"
                className="min-w-0 flex-1 bg-transparent py-2.5 text-[15px] outline-none placeholder:text-muted-foreground/70"
              />
              {searching ? (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />
              ) : query ? (
                <button
                  aria-label="Limpar busca"
                  onClick={clearSearch}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
              <button
                onClick={() => void runSearch()}
                disabled={q.length < 3 || searching}
                className="min-h-10 shrink-0 rounded-xl bg-primary px-3.5 py-2 text-[11px] font-bold text-primary-foreground shadow-md shadow-primary/15 transition-all hover:bg-primary-glow disabled:cursor-not-allowed disabled:opacity-40"
              >
                Buscar
              </button>
            </div>

            <div className="mt-1 flex items-center justify-end gap-2 border-t border-border/20 px-2 pb-0.5 pt-2"><label className="flex items-center gap-2"><span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Versão</span>
                <span className="relative">
                  <select
                    aria-label="Tradução"
                    value={translation}
                    onChange={(e) => setTranslation(e.target.value)}
                    className="appearance-none rounded-lg border border-primary/20 bg-primary/10 py-1.5 pl-2.5 pr-7 text-[10px] font-extrabold text-primary outline-none"
                  >
                    {availableTranslations.map((t) => (
                      <option key={t.code} value={t.code}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-primary" />
                </span>
              </label>
            </div>
          </div>

          {bookMatches.length > 0 && !hits && (
            <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
              {bookMatches.map((b) => (
                <button
                  key={b.id}
                  onClick={() => openChapters(b.id)}
                  className="shrink-0 rounded-full border border-border/30 bg-surface px-3 py-1.5 text-[11px] font-semibold shadow-sm transition-colors hover:border-primary/40 hover:text-primary"
                >
                  {b.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <main className="bible-index-main mx-auto max-w-lg px-4 pt-5 animate-slide-up">
        {searchError && (
          <div className="mb-3 rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-xs text-destructive">
            {searchError}
          </div>
        )}

        {readError && (
          <div className="mb-3 flex items-center justify-between gap-3 rounded-2xl border border-amber-400/25 bg-amber-400/5 px-4 py-3 text-xs text-muted-foreground">
            <span>Não foi possível carregar seu progresso de leitura.</span>
            <button type="button" onClick={() => void loadReadProgress()} className="shrink-0 rounded-xl bg-primary px-3 py-2 font-bold text-primary-foreground">
              Tentar novamente
            </button>
          </div>
        )}

        {hits && (
          <section aria-live="polite" className="space-y-2.5">
            <div className="flex items-end justify-between gap-3 px-1">
              <div>
                <p className="text-xs font-bold text-foreground">Resultados da busca</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">
                  {hits.length} resultado(s) · {translationByCode(translation).label}
                </p>
              </div>
              <button
                onClick={clearSearch}
                className="rounded-full bg-primary/10 px-3 py-1.5 text-[10px] font-bold text-primary transition-colors hover:bg-primary/15"
              >
                Limpar busca
              </button>
            </div>

            {hits.map((h) => (
              <Link
                key={`${h.book}-${h.chapter}-${h.verse}`}
                to="/biblia/$book/$chapter"
                params={{ book: String(h.book), chapter: String(h.chapter) }}
                hash={`v-${h.verse}`}
                className="group flex items-center gap-3 rounded-2xl border border-border/30 bg-surface/80 p-3.5 shadow-sm transition-all hover:border-primary/30 hover:bg-surface"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
                  <BookOpen className="h-4.5 w-4.5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary">
                    {bookNameById(h.book)} {h.chapter}:{h.verse}
                  </span>
                  <span className="mt-1 block line-clamp-2 text-xs leading-relaxed text-foreground/75">
                    {h.text}
                  </span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            ))}

            {hits.length === 0 && (
              <div className="rounded-3xl border border-dashed border-border px-6 py-12 text-center">
                <Search className="mx-auto h-6 w-6 text-muted-foreground/60" />
                <p className="mt-3 text-sm font-semibold">Nenhum resultado encontrado</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Tente outra palavra, referência ou expressão.
                </p>
              </div>
            )}
          </section>
        )}

        {!hits && (
          <>
            <section
              className="bible-journey-card relative isolate overflow-hidden rounded-[1.9rem] border border-primary/20 bg-gradient-to-br from-primary/25 via-surface to-background shadow-xl shadow-black/25"
            >
              <div className="pointer-events-none absolute -right-12 -top-16 h-52 w-52 rounded-full bg-primary/20 blur-3xl" />
              <BookOpen className="pointer-events-none absolute -bottom-7 -right-3 h-36 w-36 rotate-[-8deg] text-foreground/[0.035]" />

              <div className="relative z-10 p-5">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-foreground/60">
                    Sua jornada na Palavra
                  </p>
                </div>

                {last ? (
                  <Link
                    to="/biblia/$book/$chapter"
                    params={{ book: String(last.book), chapter: String(last.chapter) }}
                    className="group mt-3 flex items-center gap-3 rounded-2xl border border-border/30 bg-foreground/[0.07] p-3.5 transition-colors hover:bg-foreground/[0.11]"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-foreground/10 text-foreground shadow-lg ring-1 ring-foreground/10">
                      <Play className="ml-0.5 h-5 w-5 fill-current" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-primary/80">
                        Continuar de onde parou
                      </span>
                      <span className="mt-1 block truncate text-base font-extrabold text-foreground">
                        {bookNameById(last.book)} {last.chapter}
                      </span>
                    </span>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground/10">
                      <ChevronRight className="h-4 w-4 text-foreground/75 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                ) : (
                  <div className="mt-3 rounded-2xl border border-border/30 bg-foreground/[0.06] p-4">
                    <p className="text-sm font-bold text-foreground">Comece sua leitura hoje</p>
                    <p className="mt-1 text-xs text-foreground/60">
                      Escolha um livro abaixo e marque seu primeiro capítulo.
                    </p>
                  </div>
                )}

                <div className="mt-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[10px] font-semibold text-foreground/55">Progresso completo</span>
                    <span className="text-[10px] font-bold text-foreground/80">
                      {readLoading ? "Carregando progresso…" : `${read.length} de 1189 capítulos`}
                    </span>
                  </div>
                  <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-background/45 p-[2px] ring-1 ring-foreground/5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary via-primary-glow to-primary shadow-[0_0_12px_rgba(167,139,250,.55)] transition-all duration-700"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                  <div className="mt-2 flex justify-end text-[10px]"><span className="font-extrabold text-primary/80">{progressPct}% concluído</span></div>
                </div>

                <div className="bible-journey-stats mt-4 grid grid-cols-3 gap-2 border-t border-border/30 pt-4">
                  <div className="rounded-2xl bg-foreground/[0.06] px-2.5 py-2.5"><p className="text-[9px] font-bold uppercase tracking-wider text-foreground/50">Lidos</p><p className="mt-1 text-sm font-extrabold text-foreground">{read.length}</p></div>
                  <div className="rounded-2xl bg-foreground/[0.06] px-2.5 py-2.5"><p className="text-[9px] font-bold uppercase tracking-wider text-foreground/50">Livros</p><p className="mt-1 text-sm font-extrabold text-foreground">{new Set(read.map((item) => item.book)).size}/66</p></div>
                  <div className="rounded-2xl bg-foreground/[0.06] px-2.5 py-2.5"><p className="text-[9px] font-bold uppercase tracking-wider text-foreground/50">Versão</p><p className="mt-1 truncate text-sm font-extrabold text-primary/80">{translationByCode(translation).label}</p></div>
                </div>
              </div>
            </section>

            <section className="mt-6">
              <div className="flex items-end justify-between gap-3 px-1">
                <div>
                  <h2 className="text-sm font-extrabold">Explore os livros</h2>
                </div>
                <span className="rounded-full bg-surface px-2.5 py-1 text-[10px] font-bold text-muted-foreground ring-1 ring-border">
                  {testament === "AT" ? "39 livros" : "27 livros"}
                </span>
              </div>

              <div className="bible-testament-switcher mt-3 grid grid-cols-2 gap-2">
                {(["AT", "NT"] as const).map((t) => {
                  const active = testament === t;
                  return (
                    <button
                      key={t}
                      onClick={() => setTestament(t)}
                      aria-pressed={active}
                      className={`bible-testament-option group relative overflow-hidden rounded-2xl border px-3 py-3 text-left transition-all ${
                        active
                          ? "border-primary/45 bg-primary/10 shadow-sm shadow-primary/15"
                          : "border-border/40 bg-surface/50 hover:border-primary/20 hover:bg-surface/80"
                      }`}
                    >
                      <span className="flex items-center justify-between gap-2">
                        <span className={`text-[12px] font-black uppercase tracking-[0.04em] ${
                          active ? "text-primary" : "text-foreground/80"
                        }`}>
                          {t === "AT" ? "Antigo Testamento" : "Novo Testamento"}
                        </span>
                        <span className={`rounded-full px-2 py-1 text-[10px] font-extrabold ${
                          active ? "bg-primary/15 text-primary" : "bg-background/60 text-muted-foreground"
                        }`}>
                          {t === "AT" ? "39" : "27"}
                        </span>
                      </span>
                      <span className="mt-1 block text-[10px] font-semibold text-muted-foreground">
                        {active ? "Livros selecionados" : "Explorar livros"}
                      </span>
                      {active && <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-primary" />}
                    </button>
                  );
                })}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2.5">
                {books.map((b) => {
                  const done = readByBook[b.id] ?? 0;
                  const complete = done >= b.chapters;
                  const bookPct = Math.round((done / b.chapters) * 100);
                  return (
                    <button
                      key={b.id}
                      onClick={() => openChapters(b.id)}
                      aria-label={`Abrir ${b.name}`}
                      className="bible-book-card group relative min-h-[96px] overflow-hidden rounded-[1.05rem] border border-border/30 bg-surface/75 p-2.5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/35 hover:bg-surface active:scale-[0.98]"
                    >
                      <div className="flex items-start gap-2">
                        <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[0.7rem] text-[9px] font-black ring-1 shadow-sm ${
                            complete
                              ? "bg-ancient/15 text-ancient ring-ancient/20"
                              : testament === "AT"
                                ? "bg-amber-400/10 text-amber-300 ring-amber-300/15"
                                : "bg-violet-400/10 text-violet-300 ring-violet-300/15"
                          }`}
                        >
                          {complete ? <Check className="h-4 w-4" /> : b.abbr}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block line-clamp-1 text-[13px] font-black leading-tight tracking-[-0.01em]">{b.name}</span>
                          <span className="mt-1 block text-[9px] text-muted-foreground">
                            {done > 0 ? `${done}/${b.chapters} lidos` : `${b.chapters} capítulos`}
                          </span>
                        </span>
                        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/45 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                      </div>

                      <div className="mt-2 flex items-center justify-between gap-2 text-[9px] font-semibold text-muted-foreground/75">
                        <span>{complete ? "Concluído" : done > 0 ? `${bookPct}% em andamento` : "Pronto para começar"}</span>
                        <span>{bookPct}%</span>
                      </div>

                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-background/70 ring-1 ring-black/10">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            complete
                              ? "bg-ancient"
                              : testament === "AT"
                                ? "bg-gradient-to-r from-amber-500 to-orange-300"
                                : "bg-gradient-to-r from-violet-500 to-fuchsia-300"
                          }`}
                          style={{ width: `${bookPct}%` }}
                        />
                      </div>
                    </button>
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
