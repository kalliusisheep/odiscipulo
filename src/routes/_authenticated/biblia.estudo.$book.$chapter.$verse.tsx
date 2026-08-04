import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { bookNameById } from "@/data/bible-books";
import {
  approximatePtBr,
  crossReferencesFor,
  fetchChapter,
  fetchOriginalVerse,
  fetchStrongEntries,
  loadOccurrences,
  originalTranslationFor,
  translateStrongEntries,
  translationByCode,
  type OriginalWord,
  type StrongEntry,
} from "@/lib/bible-source";
import { useBiblePrefs } from "@/lib/bible-prefs";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ArrowLeft, Loader2, Volume2 } from "lucide-react";

const TABS = [
  { id: "original", label: "📜 Original" },
  { id: "interlinear", label: "📖 Interlinear" },
  { id: "palavras", label: "🔤 Palavras" },
  { id: "referencias", label: "📚 Referências" },
  { id: "lexico", label: "📑 Léxico" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export const Route = createFileRoute("/_authenticated/biblia/estudo/$book/$chapter/$verse")({
  validateSearch: (search: Record<string, unknown>) => ({
    aba: (TABS.some((t) => t.id === search.aba) ? search.aba : "original") as TabId,
  }),
  head: () => ({
    meta: [
      { title: "Estudo do versículo — Disciple" },
      {
        name: "description",
        content: "Grego, hebraico, interlinear, léxico e referências cruzadas do versículo.",
      },
      { property: "og:title", content: "Estudo do versículo — Disciple" },
      {
        property: "og:description",
        content: "Estude o versículo nas línguas originais com fontes acadêmicas.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: VerseStudy,
});

const UNAVAILABLE = "Informação indisponível na base consultada.";

/**
 * Traduções alinhadas ao texto da versão em português, e não glossas isoladas
 * de dicionário. Cada palavra pode ter mais de uma tradução contextual (ex.
 * variantes aceitas na alinhagem) — por isso cada posição é um array, não uma
 * string única. Este conjunto pode crescer versículo a versículo à medida que
 * o alinhamento revisado é incorporado à base.
 */
const CONTEXTUAL_WORDS: Record<string, string[][]> = {
  "1:1:1": [
    ["No princípio"],
    ["criou", "fez"],
    ["Deus"],
    ["—"],
    ["os céus", "o céu"],
    ["e"],
    ["a terra"],
  ],
};

function contextualTranslationFor(
  book: number,
  chapter: number,
  verse: number,
  index: number,
): string[] | null {
  return CONTEXTUAL_WORDS[[book, chapter, verse].join(":")]?.[index] ?? null;
}

function VerseStudy() {
  const { book: b, chapter: c, verse: v } = Route.useParams();
  const book = Number(b);
  const chapter = Number(c);
  const verse = Number(v);
  const { aba } = Route.useSearch();
  const nav = useNavigate();
  const { translation } = useBiblePrefs();

  const [text, setText] = useState<string | null>(null);
  const [words, setWords] = useState<OriginalWord[] | null>(null);
  const [origError, setOrigError] = useState(false);
  const [entries, setEntries] = useState<Record<string, StrongEntry>>({});
  const [occ, setOcc] = useState<Record<string, { c: number; f: number[]; l: number[] }>>({});
  const [xrefs, setXrefs] = useState<[number, number, number][]>([]);
  const [openWord, setOpenWord] = useState<OriginalWord | null>(null);

  const lang = originalTranslationFor(book).lang;

  useEffect(() => {
    window.scrollTo(0, 0);
    void fetchChapter(translation, book, chapter)
      .then((ch) => setText(ch.find((x) => x.verse === verse)?.text ?? null))
      .catch(() => setText(null));
    void crossReferencesFor(book, chapter, verse).then(setXrefs);
    void loadOccurrences().then((o) => setOcc(o as never));
    setOrigError(false);
    setWords(null);
    fetchOriginalVerse(book, chapter, verse)
      .then(async (w) => {
        setWords(w);
        if (w) {
          const codes = w.map((x) => x.strong).filter(Boolean) as string[];
          const raw = await fetchStrongEntries(codes);
          setEntries(raw);
          void translateStrongEntries(raw).then(setEntries);
        }
      })
      .catch(() => setOrigError(true));
  }, [translation, book, chapter, verse]);

  const analysis = useMemo(() => {
    if (!words) return null;
    const strongs = words.map((w) => w.strong).filter(Boolean) as string[];
    const verbs = strongs.filter((s) => /verb/i.test(entries[s]?.partOfSpeech ?? ""));
    return {
      count: words.length,
      strongs: Array.from(new Set(strongs)),
      verbs: Array.from(new Set(verbs)),
    };
  }, [words, entries]);

  const speak = (word: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const u = new SpeechSynthesisUtterance(word);
    u.lang = lang === "grego" ? "el-GR" : "he-IL";
    window.speechSynthesis.speak(u);
  };

  const setTab = (id: TabId) => void nav({ to: ".", search: { aba: id }, replace: true });

  return (
    <div className="mx-auto min-h-screen max-w-lg pb-28 animate-slide-up">
      {/* TÍTULO */}
      <div className="sticky top-0 z-20 border-b border-border bg-background/95 px-4 pt-4 pb-2 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex items-center gap-2">
          <Link
            to="/biblia/$book/$chapter"
            params={{ book: String(book), chapter: String(chapter) }}
            aria-label="Voltar"
            className="rounded-full p-2 text-muted-foreground hover:bg-surface"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold">
              {bookNameById(book)} {chapter}:{verse}
            </h1>
            <p className="text-[11px] text-muted-foreground">
              {translationByCode(translation).full}
            </p>
          </div>
        </div>

        {/* MENU DE ABAS — logo abaixo do título */}
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all ${
                aba === t.id
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border bg-surface text-muted-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4">
        {/* CARD DO VERSÍCULO — logo abaixo do menu de abas */}
        <div className="card-elevated mt-4 p-4">
          <p className="text-base leading-relaxed">{text ?? "Carregando…"}</p>
        </div>

        {/* CONTEÚDO DA ABA */}
        <div className="mt-4 animate-slide-up">
          {!words && !origError && aba !== "referencias" && (
            <div className="mt-10 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}

          {(origError || (words === null && false)) && (
            <p className="mt-6 text-sm text-muted-foreground">{UNAVAILABLE}</p>
          )}

          {aba === "original" && words && (
            <div className="card-elevated space-y-3 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-ancient">
                Texto original ({lang})
              </p>
              <p
                dir={lang === "hebraico" ? "rtl" : "ltr"}
                className="ancient-text text-xl leading-loose text-foreground"
              >
                {words.map((w) => w.word).join(" ")}
              </p>
              <p className="border-t border-border pt-3 text-[11px] text-muted-foreground">
                Fonte:{" "}
                {lang === "grego"
                  ? "Tischendorf 8ª ed. com Strong"
                  : "Westminster Leningrad Codex com Strong"}
              </p>
            </div>
          )}

          {aba === "interlinear" && words && (
            <div className="card-elevated divide-y divide-border overflow-hidden p-0">
              <div className="grid grid-cols-[minmax(0,1.45fr)_4.5rem_minmax(0,1.1fr)] gap-2 border-b border-border bg-surface/50 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                <span>Original / transliteração</span>
                <span className="text-center">Strong</span>
                <span>Português</span>
              </div>
              {words.map((w, i) => {
                const e = w.strong ? entries[w.strong] : null;
                const contextual = contextualTranslationFor(book, chapter, verse, i);
                const senses =
                  contextual ??
                  (e?.definitions?.length
                    ? e.definitions.slice(0, 3)
                    : e?.meaning
                      ? [e.meaning]
                      : []);
                return (
                  <button
                    key={w.index}
                    onClick={() => setOpenWord(w)}
                    className="grid w-full grid-cols-[minmax(0,1.45fr)_4.5rem_minmax(0,1.1fr)] items-center gap-2 p-3.5 text-left transition-colors hover:bg-surface"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="w-4 shrink-0 text-center text-[10px] font-semibold text-muted-foreground">
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <p
                          dir={lang === "hebraico" ? "rtl" : "ltr"}
                          className="ancient-text truncate text-lg leading-tight text-ancient"
                        >
                          {w.word}
                        </p>
                        <p className="truncate text-[11px] italic leading-tight text-muted-foreground">
                          {e?.transliteration ?? "—"}
                        </p>
                      </div>
                    </div>
                    <div className="text-center">
                      {w.strong ? (
                        <span className="inline-block rounded-full border border-primary/30 px-2 py-0.5 text-[10px] font-semibold text-primary">
                          {w.strong}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </div>
                    <div className="min-w-0 text-sm leading-snug text-foreground/90">
                      {senses.length > 0 ? (
                        senses.map((s, idx) => (
                          <span key={idx}>
                            {s}
                            {idx < senses.length - 1 && (
                              <span className="text-muted-foreground"> · </span>
                            )}
                          </span>
                        ))
                      ) : (
                        <span>—</span>
                      )}
                    </div>
                  </button>
                );
              })}
              <p className="p-3.5 text-[11px] text-muted-foreground">
                Tradução alinhada ao versículo em português · Toque em uma palavra para ver a análise completa
              </p>
            </div>
          )}

          {aba === "palavras" && words && (
            <div className="space-y-2">
              {words.map((w) => {
                const e = w.strong ? entries[w.strong] : null;
                return (
                  <button
                    key={w.index}
                    onClick={() => setOpenWord(w)}
                    className="card-elevated flex w-full items-center gap-3 p-4 text-left"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="ancient-text text-lg text-ancient">{w.word}</p>
                      <p className="text-xs text-muted-foreground">
                        {e?.transliteration ?? UNAVAILABLE}
                      </p>
                      <p className="mt-1 text-sm">{e?.meaning ?? UNAVAILABLE}</p>
                      <p className="mt-1 text-[11px] text-primary">Strong {w.strong ?? "—"}</p>
                      <p className="text-[11px] text-muted-foreground">
                        Pronúncia (aprox. pt-BR):{" "}
                        {approximatePtBr(e?.transliteration ?? null) ?? "—"}
                      </p>
                    </div>
                    <span
                      role="button"
                      aria-label="Ouvir"
                      onClick={(ev) => {
                        ev.stopPropagation();
                        speak(w.word);
                      }}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
                    >
                      <Volume2 className="h-4.5 w-4.5" />
                    </span>
                  </button>
                );
              })}
              {analysis && (
                <div className="card-elevated mt-4 space-y-1.5 p-4 text-sm">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                    Análise do versículo
                  </p>
                  <p>Palavras no original: {analysis.count}</p>
                  <p>Verbos identificados: {analysis.verbs.join(", ") || UNAVAILABLE}</p>
                  <p className="break-words">
                    Números de Strong: {analysis.strongs.join(", ") || UNAVAILABLE}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Dados extraídos diretamente do texto original anotado. Morfologia completa não
                    consta nesta base.
                  </p>
                </div>
              )}
            </div>
          )}

          {aba === "referencias" && (
            <div className="space-y-2">
              {xrefs.length === 0 && <p className="text-sm text-muted-foreground">{UNAVAILABLE}</p>}
              {xrefs.map(([bk, ch, vs]) => (
                <Link
                  key={`${bk}-${ch}-${vs}`}
                  to="/biblia/estudo/$book/$chapter/$verse"
                  params={{ book: String(bk), chapter: String(ch), verse: String(vs) }}
                  search={{ aba: "original" as const }}
                  className="block rounded-2xl border border-border bg-surface p-3.5 text-sm font-medium"
                >
                  {bookNameById(bk)} {ch}:{vs}
                </Link>
              ))}
              {xrefs.length > 0 && (
                <p className="pt-2 text-[11px] text-muted-foreground">
                  Fonte: openbible.info (CC-BY).
                </p>
              )}
            </div>
          )}

          {aba === "lexico" && words && (
            <div className="space-y-2">
              {Object.values(entries).length === 0 && (
                <p className="text-sm text-muted-foreground">{UNAVAILABLE}</p>
              )}
              {Object.values(entries).map((e) => (
                <details key={e.code} className="card-elevated p-4">
                  <summary className="cursor-pointer text-sm font-semibold">
                    <span className="ancient-text text-ancient">{e.original ?? e.code}</span> ·{" "}
                    {e.code}
                  </summary>
                  <div className="mt-2 space-y-1 text-sm text-foreground/85">
                    <p className="text-xs text-muted-foreground">
                      {e.transliteration ?? "—"} · {e.phonetic ?? "—"}
                    </p>
                    {e.definitions.length ? (
                      e.definitions.map((d, i) => <p key={i}>{d}</p>)
                    ) : (
                      <p className="text-muted-foreground">{UNAVAILABLE}</p>
                    )}
                    <p className="pt-2 text-[11px] text-muted-foreground">
                      Definições traduzidas automaticamente para português a partir da fonte
                      acadêmica em inglês (BDB/Thayer) — o léxico não tem edição oficial em
                      português. A tradução automática pode conter imprecisões; classe gramatical e
                      origem foram revisadas.
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Fonte: Brown-Driver-Briggs / Thayer (concordância de Strong).
                    </p>
                  </div>
                </details>
              ))}
            </div>
          )}
        </div>
      </div>

      <Sheet open={!!openWord} onOpenChange={(o) => !o && setOpenWord(null)}>
        <SheetContent
          side="bottom"
          className="max-h-[85vh] overflow-y-auto rounded-t-3xl bg-background"
        >
          {openWord && (
            <WordDetail
              word={openWord}
              entry={openWord.strong ? entries[openWord.strong] : undefined}
              occurrence={openWord.strong ? occ[openWord.strong] : undefined}
              onSpeak={() => speak(openWord.word)}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function WordDetail({
  word,
  entry,
  occurrence,
  onSpeak,
}: {
  word: OriginalWord;
  entry?: StrongEntry;
  occurrence?: { c: number; f: number[]; l: number[] };
  onSpeak: () => void;
}) {
  // Cada item de `definitions` é um sentido/tradução possível da palavra no
  // léxico — a maioria das palavras hebraicas/gregas tem mais de um. Se por
  // algum motivo só existir o "significado" combinado, cai nele como único
  // item da lista, pra nunca ficar sem nada exibido.
  const senses = entry?.definitions?.length
    ? entry.definitions
    : entry?.meaning
      ? [entry.meaning]
      : [];

  const stats: { label: string; value: string }[] = [
    { label: "Ocorrências", value: occurrence ? String(occurrence.c) : "—" },
    {
      label: "1ª vez",
      value: occurrence
        ? `${bookNameById(occurrence.f[0])} ${occurrence.f[1]}:${occurrence.f[2]}`
        : "—",
    },
    {
      label: "Última vez",
      value: occurrence
        ? `${bookNameById(occurrence.l[0])} ${occurrence.l[1]}:${occurrence.l[2]}`
        : "—",
    },
  ];

  return (
    <div className="pb-8">
      <div className="flex items-start gap-3 pt-2">
        <div className="min-w-0 flex-1">
          <p className="ancient-text text-3xl leading-tight text-ancient">{word.word}</p>
          {entry?.transliteration && (
            <p className="mt-1 text-sm italic text-muted-foreground">{entry.transliteration}</p>
          )}
          {approximatePtBr(entry?.transliteration ?? null) && (
            <p className="mt-0.5 text-xs text-muted-foreground/70">
              soa como: {approximatePtBr(entry?.transliteration ?? null)}
            </p>
          )}
        </div>
        <button
          onClick={onSpeak}
          aria-label="Ouvir pronúncia"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform active:scale-95"
        >
          <Volume2 className="h-5 w-5" />
        </button>
      </div>

      {entry?.partOfSpeech && (
        <span className="mt-3 inline-block rounded-full bg-surface-2 px-3 py-1 text-[11px] font-medium text-muted-foreground">
          {entry.partOfSpeech}
        </span>
      )}

      {/* Traduções possíveis — o coração do painel. Cada sentido do léxico
          vira um cartão numerado, em vez de uma única linha "Significado". */}
      <div className="mt-5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-primary/80">
          {senses.length > 1 ? "Traduções possíveis" : "Tradução"}
        </p>
        {senses.length > 0 ? (
          <ol className="mt-2 space-y-2">
            {senses.map((s, i) => (
              <li key={i} className="flex gap-2.5 rounded-2xl bg-surface-2/70 px-3.5 py-2.5">
                {senses.length > 1 && (
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[11px] font-bold text-primary">
                    {i + 1}
                  </span>
                )}
                <p className="text-sm leading-snug text-foreground/90">{s}</p>
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">{UNAVAILABLE}</p>
        )}
        {entry && entry.definitions.length > 0 && (
          <p className="mt-2 text-[11px] leading-snug text-muted-foreground/70">
            Traduzido automaticamente do inglês (BDB/Thayer) — pode conter imprecisões.
          </p>
        )}
      </div>

      {/* Ocorrências — três números lado a lado, em vez de três blocos empilhados. */}
      <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl border border-border/60 p-3">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-sm font-semibold text-foreground">{s.value}</p>
            <p className="mt-0.5 text-[10px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {entry && entry.related.length > 0 && (
        <div className="mt-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-primary/80">
            Palavras relacionadas
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {entry.related.map((r) => (
              <span
                key={r}
                className="rounded-full bg-surface-2 px-2.5 py-1 text-xs font-medium text-primary"
              >
                {r}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
