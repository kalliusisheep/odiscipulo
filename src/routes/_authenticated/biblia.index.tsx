import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { BIBLE_BOOKS, bookNameById } from "@/data/bible-books";
import { PT_TRANSLATIONS, searchBible, translationByCode } from "@/lib/bible-source";
import { listReadChapters } from "@/lib/bible-user-data";
import { useBiblePrefs } from "@/lib/bible-prefs";
import { ArrowLeft, BookMarked, Check, Loader2, Search, X } from "lucide-react";

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

  useEffect(() => {
    void listReadChapters().then(setRead);
  }, []);

  const books = useMemo(() => BIBLE_BOOKS.filter((b) => b.testament === testament), [testament]);
  const readSet = useMemo(() => new Set(read.map((r) => `${r.book}:${r.chapter}`)), [read]);
  const last = read[read.length - 1];
  const progressPct = Math.round((read.length / 1189) * 100);

  const runSearch = async () => {
    const q = query.trim();
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

  return (
    <div className="mx-auto max-w-lg px-4 pt-4 pb-28 animate-slide-up">
      <div className="flex items-center gap-3">
        <button
          onClick={() => void nav({ to: "/perfil" })}
          aria-label="Voltar"
          className="rounded-full p-2 text-muted-foreground hover:bg-surface"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl font-bold">Bíblia de Estudos</h1>
          <p className="text-[11px] text-muted-foreground">
            Grego, hebraico e léxico com fontes acadêmicas
          </p>
        </div>
        <Link
          to="/biblia/marcados"
          aria-label="Meus marcadores"
          className="rounded-full border border-border bg-surface p-2.5 text-primary"
        >
          <BookMarked className="h-4.5 w-4.5" />
        </Link>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {PT_TRANSLATIONS.map((t) => (
          <button
            key={t.code}
            onClick={() => setTranslation(t.code)}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all ${
              translation === t.code
                ? "border-primary bg-primary/15 text-primary"
                : "border-border bg-surface text-muted-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <p className="mt-1.5 text-[11px] text-muted-foreground">
        {translationByCode(translation).full}
      </p>

      <div className="mt-4 flex items-center gap-2 rounded-2xl border border-border bg-surface px-3.5 py-2.5">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && void runSearch()}
          placeholder="Buscar palavra ou frase…"
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        {query && (
          <button
            aria-label="Limpar busca"
            onClick={() => {
              setQuery("");
              setHits(null);
              setSearchError(null);
            }}
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
        {searching && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
      </div>

      {searchError && <p className="mt-3 text-xs text-destructive">{searchError}</p>}

      {hits && (
        <div className="mt-4 space-y-2">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
            {hits.length} resultado(s)
          </p>
          {hits.map((h) => (
            <Link
              key={`${h.book}-${h.chapter}-${h.verse}`}
              to="/biblia/$book/$chapter"
              params={{ book: String(h.book), chapter: String(h.chapter) }}
              className="block rounded-2xl border border-border bg-surface p-3.5"
            >
              <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                {bookNameById(h.book)} {h.chapter}:{h.verse}
              </p>
              <p className="mt-1 line-clamp-2 text-sm text-foreground/85">{h.text}</p>
            </Link>
          ))}
        </div>
      )}

      {!hits && (
        <>
          {last && (
            <Link
              to="/biblia/$book/$chapter"
              params={{ book: String(last.book), chapter: String(last.chapter) }}
              className="card-elevated mt-4 block p-4"
            >
              <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                Continuar leitura
              </p>
              <p className="mt-1 text-sm font-semibold">
                {bookNameById(last.book)} {last.chapter}
              </p>
            </Link>
          )}

          <div className="card-elevated mt-3 p-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold">Progresso de leitura</span>
              <span className="text-muted-foreground">
                {read.length} de 1189 capítulos · {progressPct}%
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-background">
              <div className="h-full bg-primary transition-all" style={{ width: `${progressPct}%` }} />
            </div>
          </div>

          <div className="mt-5 flex rounded-full border border-border bg-surface p-1">
            {(["AT", "NT"] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTestament(t);
                  setOpenBook(null);
                }}
                className={`flex-1 rounded-full py-2 text-xs font-semibold transition-all ${
                  testament === t ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                {t === "AT" ? "Antigo Testamento" : "Novo Testamento"}
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-2">
            {books.map((b) => (
              <div key={b.id} className="overflow-hidden rounded-2xl border border-border bg-surface">
                <button
                  onClick={() => setOpenBook(openBook === b.id ? null : b.id)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-[11px] font-bold text-primary">
                    {b.abbr}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold">{b.name}</span>
                  <span className="text-[11px] text-muted-foreground">{b.chapters} cap.</span>
                </button>
                {openBook === b.id && (
                  <div className="grid grid-cols-6 gap-2 border-t border-border p-3 animate-slide-up">
                    {Array.from({ length: b.chapters }, (_, i) => i + 1).map((c) => {
                      const done = readSet.has(`${b.id}:${c}`);
                      return (
                        <Link
                          key={c}
                          to="/biblia/$book/$chapter"
                          params={{ book: String(b.id), chapter: String(c) }}
                          className={`relative flex h-10 items-center justify-center rounded-xl text-sm font-medium transition-colors ${
                            done
                              ? "bg-primary/15 text-primary"
                              : "bg-background text-foreground/80 hover:bg-primary/10"
                          }`}
                        >
                          {c}
                          {done && <Check className="absolute right-1 top-1 h-2.5 w-2.5" />}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
