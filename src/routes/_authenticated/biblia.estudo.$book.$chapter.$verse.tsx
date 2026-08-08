import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { bookNameById } from "@/data/bible-books";
import {
  approximatePtBr,
  contextualMeaningFor,
  crossReferencesFor,
  fetchChapter,
  fetchOriginalVerse,
  fetchStrongEntries,
  loadOccurrences,
  originalTranslationFor,
  translateStrongEntries,
  translationByCode,
  verifiedLexicalVariants,
  type OriginalWord,
  type StrongEntry,
} from "@/lib/bible-source";
import { useBiblePrefs } from "@/lib/bible-prefs";
import { useApp } from "@/lib/app-context";
import { supabase } from "@/integrations/supabase/client";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  ArrowLeft,
  BookOpen,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  GitBranch,
  Languages,
  Layers3,
  ListTree,
  Loader2,
  Quote,
  ScrollText,
  Sparkles,
  Volume2,
} from "lucide-react";

const TABS = [
  {
    id: "original",
    labelKey: "bible.tabOriginal",
    eyebrowKey: "bible.tabOriginalEyebrow",
    descriptionKey: "bible.tabOriginalDescription",
    icon: ScrollText,
  },
  {
    id: "interlinear",
    labelKey: "bible.tabInterlinear",
    eyebrowKey: "bible.tabInterlinearEyebrow",
    descriptionKey: "bible.tabInterlinearDescription",
    icon: Layers3,
  },
  {
    id: "palavras",
    labelKey: "bible.tabWords",
    eyebrowKey: "bible.tabWordsEyebrow",
    descriptionKey: "bible.tabWordsDescription",
    icon: Languages,
  },
  {
    id: "referencias",
    labelKey: "bible.tabReferences",
    eyebrowKey: "bible.tabReferencesEyebrow",
    descriptionKey: "bible.tabReferencesDescription",
    icon: GitBranch,
  },
  {
    id: "lexico",
    labelKey: "bible.tabLexicon",
    eyebrowKey: "bible.tabLexiconEyebrow",
    descriptionKey: "bible.tabLexiconDescription",
    icon: BookOpen,
  },
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
        content: "Grego, hebraico, interlinear, léxico e referências cruzadas do versículo.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: VerseStudy,
});



/**
 * A interface mostra um único sentido contextual por ocorrência. A seleção
 * é centralizada em bible-source.ts para que Interlinear, Palavras e Léxico
 * nunca exibam listas genéricas diferentes para o mesmo termo.
 */
function sensesFor(
  book: number,
  chapter: number,
  verse: number,
  index: number,
  word: OriginalWord | null | undefined,
  entry: StrongEntry | null | undefined,
  verseText: string | null = null,
): string[] {
  return [contextualMeaningFor(book, chapter, verse, index, word, entry, verseText)];
}

function contextualMeaningForEntry(
  book: number,
  chapter: number,
  verse: number,
  words: OriginalWord[],
  entry: StrongEntry,
  verseText: string | null,
): string {
  const index = words.findIndex((word) => word.strong?.toUpperCase() === entry.code.toUpperCase());
  return contextualMeaningFor(
    book,
    chapter,
    verse,
    index,
    index >= 0 ? words[index] : undefined,
    entry,
    verseText,
  );
}
type VerseAnalysis = {
  verbos: string[];
  substantivos: string[];
  resumo: string;
};

function VerseStudy() {
  const { book: b, chapter: c, verse: v } = Route.useParams();
  const book = Number(b);
  const chapter = Number(c);
  const verse = Number(v);
  const { aba } = Route.useSearch();
  const nav = useNavigate();
  const { translation } = useBiblePrefs();
  const { t } = useApp();

  const [text, setText] = useState<string | null>(null);
  const [textLoading, setTextLoading] = useState(true);
  const [words, setWords] = useState<OriginalWord[] | null>(null);
  const [wordsLoading, setWordsLoading] = useState(true);
  const [origError, setOrigError] = useState(false);
  const [entries, setEntries] = useState<Record<string, StrongEntry>>({});
  const [lexiconLoading, setLexiconLoading] = useState(true);
  const [occ, setOcc] = useState<Record<string, { c: number; f: number[]; l: number[] }>>({});
  const [xrefs, setXrefs] = useState<[number, number, number][]>([]);
  const [xrefsLoading, setXrefsLoading] = useState(true);
  const [openWord, setOpenWord] = useState<OriginalWord | null>(null);
  const [analysis, setAnalysis] = useState<VerseAnalysis | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState(false);

  const lang = originalTranslationFor(book).lang;

  useEffect(() => {
    let cancelled = false;
    window.scrollTo(0, 0);

    setText(null);
    setTextLoading(true);
    void fetchChapter(translation, book, chapter)
      .then((ch) => {
        if (!cancelled) setText(ch.find((x) => x.verse === verse)?.text ?? null);
      })
      .catch(() => {
        if (!cancelled) setText(null);
      })
      .finally(() => {
        if (!cancelled) setTextLoading(false);
      });

    setXrefs([]);
    setXrefsLoading(true);
    void crossReferencesFor(book, chapter, verse)
      .then((items) => {
        if (!cancelled) setXrefs(items);
      })
      .catch(() => {
        if (!cancelled) setXrefs([]);
      })
      .finally(() => {
        if (!cancelled) setXrefsLoading(false);
      });

    void loadOccurrences()
      .then((occurrences) => {
        if (!cancelled) setOcc(occurrences as never);
      })
      .catch(() => {
        if (!cancelled) setOcc({});
      });

    setOrigError(false);
    setWords(null);
    setWordsLoading(true);
    setEntries({});
    setLexiconLoading(true);
    setAnalysis(null);

    const contextTextPromise = fetchChapter(translation, book, chapter)
      .then((chapterVerses) => chapterVerses.find((item) => item.verse === verse)?.text ?? null)
      .catch(() => null);

    void fetchOriginalVerse(book, chapter, verse)
      .then(async (loadedWords) => {
        if (cancelled) return;
        if (!loadedWords?.length) {
          setWords([]);
          setOrigError(true);
          setLexiconLoading(false);
          return;
        }

        setWords(loadedWords);
        const codes = loadedWords.map((word) => word.strong).filter(Boolean) as string[];
        const raw = await fetchStrongEntries(codes);
        const contextText = await contextTextPromise;
        const translated = await translateStrongEntries(raw, {
          book,
          chapter,
          verse,
          translation,
          verseText: contextText,
          originalWords: loadedWords,
        });
        if (cancelled) return;
        setEntries(translated);
        setLexiconLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setWords([]);
        setOrigError(true);
        setLexiconLoading(false);
      })
      .finally(() => {
        if (!cancelled) setWordsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [translation, book, chapter, verse]);

  // Análise do versículo, gerada pelo Gemini a partir das palavras do
  // original e do léxico já carregado (roda de novo quando `entries` chega
  // da tradução, para a IA receber os dados já em português).
  useEffect(() => {
    if (!words || words.length === 0 || Object.keys(entries).length === 0) return;
    let cancelled = false;
    setAnalysisLoading(true);
    setAnalysisError(false);
    const payload = words.map((w) => ({
      word: w.word,
      strong: w.strong,
      partOfSpeech: w.strong ? (entries[w.strong]?.partOfSpeech ?? null) : null,
      meaning: w.strong ? (entries[w.strong]?.meaning ?? null) : null,
    }));

    void supabase.functions
      .invoke<VerseAnalysis>("verse-analysis", { body: { words: payload } })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error || !data) {
          setAnalysisError(true);
          return;
        }
        setAnalysis(data);
      })
      .catch(() => {
        if (!cancelled) setAnalysisError(true);
      })
      .finally(() => {
        if (!cancelled) setAnalysisLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [words, entries]);

  const speak = (word: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(word);
    u.lang = lang === "grego" ? "el-GR" : "he-IL";
    window.speechSynthesis.speak(u);
  };

  const setTab = (id: TabId) => void nav({ to: ".", search: { aba: id }, replace: true });

  const tabs = TABS.map((tab) => ({
    ...tab,
    label: t(tab.labelKey),
    eyebrow: t(tab.eyebrowKey),
    description: t(tab.descriptionKey),
  }));
  const activeTab = tabs.find((tab) => tab.id === aba) ?? tabs[0];
  const ActiveTabIcon = activeTab.icon;
  const lexicalEntries = useMemo(
    () => Object.values(entries).sort((left, right) => left.code.localeCompare(right.code)),
    [entries],
  );
  const sourceName =
    lang === "grego"
      ? "Tischendorf, 8ª edição, com Strong"
      : "Westminster Leningrad Codex com Strong";

  return (
    <div className="bible-secondary-page mx-auto min-h-screen max-w-lg overflow-x-hidden pb-28">
      <header className="bible-study-header sticky top-0 z-30 bg-background/90 backdrop-blur-xl">
        <div className="px-4 pb-2 pt-3">
          <div className="flex items-center gap-3">
            <Link
              to="/biblia/$book/$chapter"
              params={{ book: String(book), chapter: String(chapter) }}
              aria-label={t("bible.backToChapter")}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-border/70 bg-surface text-muted-foreground shadow-sm transition-all hover:border-primary/40 hover:text-primary active:scale-95"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>

            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                {t("bible.studyVerse")}
              </p>
              <h1 className="truncate text-lg font-extrabold tracking-tight">
                {bookNameById(book)} {chapter}:{verse}
              </h1>
            </div>

            <span className="max-w-[7.5rem] truncate rounded-full border border-border/70 bg-surface-2/70 px-2.5 py-1 text-[10px] font-semibold text-muted-foreground">
              {translationByCode(translation).label}
            </span>
          </div>

          <nav
            aria-label="Ferramentas de estudo"
            className="bible-study-tabs -mx-1 mt-3 grid grid-cols-6 gap-1 rounded-[22px] border border-border/60 bg-surface/30 p-1.5 shadow-[inset_0_1px_0_color-mix(in_oklab,var(--foreground)_5%,transparent)]"
          >
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              const selected = aba === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setTab(tab.id)}
                  className={
                    "flex min-h-12 min-w-0 flex-col items-center justify-center gap-1 rounded-[15px] border px-1.5 py-2 text-[10px] font-bold leading-tight transition-all active:scale-[0.98] " +
                    (tab.id === "referencias" || tab.id === "lexico" ? "col-span-3 " : "col-span-2 ") +
                    (selected
                      ? "border-primary/45 bg-primary text-primary-foreground shadow-[0_8px_24px_-12px_hsl(var(--primary))]"
                      : "border-transparent bg-transparent text-muted-foreground hover:border-primary/20 hover:bg-surface hover:text-foreground")
                  }
                >
                  <TabIcon className="h-4 w-4" />
                  <span className="max-w-full whitespace-normal break-words text-center">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="space-y-4 px-4 pt-4">
        <section className="relative overflow-hidden rounded-[24px] border border-primary/20 bg-gradient-to-br from-primary/20 via-surface to-surface p-5 shadow-[0_20px_60px_-42px_hsl(var(--primary))]">
          <Quote className="absolute -right-3 -top-4 h-24 w-24 rotate-12 text-primary/[0.08]" />
          <div className="relative">
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
                <Sparkles className="h-3 w-3" />
                {t("bible.focusVerse")}
              </span>
              <span className="text-[10px] font-medium text-muted-foreground">
                {translationByCode(translation).full}
              </span>
            </div>

            {textLoading ? (
              <div className="mt-5 space-y-2.5">
                <div className="h-4 w-full animate-pulse rounded-full bg-foreground/10" />
                <div className="h-4 w-10/12 animate-pulse rounded-full bg-foreground/10" />
                <div className="h-4 w-7/12 animate-pulse rounded-full bg-foreground/10" />
              </div>
            ) : (
              <p className="bible-verse-quote mt-4 text-[17px] font-semibold leading-relaxed text-foreground">
                “{text ?? t("bible.infoUnavailable")}”
              </p>
            )}

            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-primary">
              <span className="h-px w-5 bg-primary/50" />
              {bookNameById(book)} {chapter}:{verse}
            </div>
          </div>
        </section>

        <section className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
            <ActiveTabIcon className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
              {activeTab.eyebrow}
            </p>
            <h2 className="text-base font-extrabold">{activeTab.label}</h2>
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
              {activeTab.description}
            </p>
          </div>
          <span className="rounded-full bg-surface-2 px-2 py-1 text-[10px] font-bold text-muted-foreground">
            {tabs.findIndex((tab) => tab.id === aba) + 1}/{tabs.length}
          </span>
        </section>

        <div key={aba} className="animate-slide-up">
          {wordsLoading && aba !== "referencias" && <StudyLoading />}

          {!wordsLoading && origError && aba !== "referencias" && (
            <UnavailableState
              title={t("bible.originalUnavailable")}
              description={t("bible.originalUnavailableDescription")}
            />
          )}

          {aba === "original" && !wordsLoading && words && words.length > 0 && (
            <div className="space-y-3">
              <section className="overflow-hidden rounded-[26px] border border-ancient/25 bg-gradient-to-br from-ancient/10 via-surface to-surface shadow-sm">
                <div className="flex items-center justify-between gap-3 border-b border-border/60 px-4 py-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-ancient">
                      {t("bible.originalText")}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {lang === "hebraico" ? t("bible.biblicalHebrew") : t("bible.koineGreek")}
                    </p>
                  </div>
                  <span className="rounded-full border border-ancient/25 bg-ancient/10 px-2.5 py-1 text-[10px] font-bold capitalize text-ancient">
                    {lang}
                  </span>
                </div>

                <p
                  dir={lang === "hebraico" ? "rtl" : "ltr"}
                  className="ancient-text break-words px-5 py-6 text-2xl leading-[2.1] text-foreground"
                >
                  {words.map((word) => word.word).join(" ")}
                </p>
              </section>

              <SourceNote>
                <strong className="text-foreground/80">{t("bible.academicSource")}:</strong> {sourceName}.
                {t("bible.strongConnection")}
              </SourceNote>
            </div>
          )}

          {aba === "interlinear" && !wordsLoading && words && words.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-end justify-between gap-3 px-1">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                    {t("bible.lineByLine")}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t("bible.wordOriginalMeaning")}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-surface-2 px-2.5 py-1 text-[10px] font-bold text-muted-foreground">
                  {words.length} {t("bible.terms")}
                </span>
              </div>

              <section className="overflow-hidden rounded-[28px] border border-border/50 bg-surface/[0.72] p-1 shadow-[0_18px_48px_-38px_hsl(var(--primary))]">
                {words.map((word, index) => {
                  const entry = word.strong ? entries[word.strong] : null;
                  const sense = sensesFor(book, chapter, verse, index, word, entry, text)[0] ?? t("bible.infoUnavailable");

                  return (
                    <button
                      key={word.index}
                      type="button"
                      onClick={() => setOpenWord(word)}
                      aria-label={t("bible.openAnalysis") + " " + word.word}
                      className={
                        "group relative w-full rounded-[22px] px-3.5 py-4 text-left transition-all duration-200 " +
                        (index > 0 ? "border-t border-border/40 " : "") +
                        "hover:bg-surface-2/50 active:scale-[0.995] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                      }
                    >
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-background/60 font-mono text-[10px] font-bold text-muted-foreground">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p
                                dir={lang === "hebraico" ? "rtl" : "ltr"}
                                className="ancient-text break-words text-[23px] leading-none text-ancient"
                              >
                                {word.word}
                              </p>
                              <p className="mt-2 truncate text-xs italic text-muted-foreground">
                                {entry?.transliteration ?? t("bible.transliterationUnavailable")}
                              </p>
                            </div>

                            {word.strong && (
                              <span className="shrink-0 rounded-full border border-border/60 bg-background/50 px-2.5 py-1 font-mono text-[10px] font-bold text-muted-foreground transition-colors group-hover:border-primary/30 group-hover:text-primary">
                                {word.strong}
                              </span>
                            )}
                          </div>

                          <div className="mt-3 grid grid-cols-2 gap-2">
                            <div className="min-w-0 rounded-2xl bg-background/45 px-3 py-2.5">
                              <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                                {t("bible.pronunciation")}
                              </p>
                              <p className="mt-1 truncate text-xs font-semibold text-foreground">
                                {approximatePtBr(entry?.transliteration ?? null) ?? "—"}
                              </p>
                            </div>

                            <div className="min-w-0 rounded-2xl bg-primary/[0.07] px-3 py-2.5 text-center">
                              <p className="text-center text-[9px] font-bold uppercase tracking-[0.12em] text-primary/75">
                                {t("bible.contextMeaning")}
                              </p>
                              <p className="mt-1 truncate text-center text-xs font-semibold text-foreground">
                                {sense}
                              </p>
                            </div>
                          </div>

                          <div className="mt-3 flex items-center justify-end gap-1 text-[11px] font-bold text-primary/80 transition-colors group-hover:text-primary">
                            {t("bible.openAnalysis")}
                            <ChevronRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </section>

              <SourceNote>
                {t("bible.interlinearNote")}
              </SourceNote>
            </div>
          )}

          {aba === "palavras" && !wordsLoading && words && words.length > 0 && (
            <div className="space-y-3">
              {words.map((word, index) => {
                const entry = word.strong ? entries[word.strong] : null;
                const senses = sensesFor(book, chapter, verse, index, word, entry, text);
                return (
                  <article
                    key={word.index}
                    className="flex items-stretch overflow-hidden rounded-[24px] border border-border/70 bg-surface shadow-sm transition-colors hover:border-primary/30"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenWord(word)}
                      className="min-w-0 flex-1 p-4 text-left active:bg-surface-2/60"
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xs font-extrabold text-primary">
                          {index + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                            <p className="ancient-text break-words text-xl text-ancient">{word.word}</p>
                            <span className="text-[10px] font-bold text-primary">
                              {word.strong ?? t("bible.noStrong")}
                            </span>
                          </div>
                          <p className="mt-0.5 text-xs italic text-muted-foreground">
                            {entry?.transliteration ?? t("bible.transliterationUnavailable")}
                          </p>
                          <p className="mt-2 text-sm font-semibold leading-snug">
                            {senses.length ? senses.join(" · ") : t("bible.infoUnavailable")}
                          </p>
                          {entry?.partOfSpeech && (
                            <span className="mt-2 inline-flex rounded-full bg-surface-2 px-2 py-1 text-[10px] font-semibold text-muted-foreground">
                              {entry.partOfSpeech}
                            </span>
                          )}
                        </div>
                        <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/50" />
                      </div>
                    </button>

                    <button
                      type="button"
                      aria-label={"Ouvir " + word.word}
                      onClick={() => speak(word.word)}
                      className="flex w-14 shrink-0 flex-col items-center justify-center gap-1 border-l border-border/60 bg-primary/[0.06] text-primary transition-colors hover:bg-primary/10 active:bg-primary/15"
                    >
                      <Volume2 className="h-5 w-5" />
                      <span className="text-[9px] font-bold">{t("bible.listen")}</span>
                    </button>
                  </article>
                );
              })}

              {analysisLoading && (
                <div className="flex items-center gap-3 rounded-[24px] border border-primary/15 bg-primary/[0.05] p-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </span>
                  <div>
                    <p className="text-sm font-bold">{t("bible.preparingAnalysis")}</p>
                    <p className="text-xs text-muted-foreground">
                      {t("bible.identifyingStructure")}
                    </p>
                  </div>
                </div>
              )}

              {!analysisLoading && analysis && (
                <section className="overflow-hidden rounded-[26px] border border-primary/20 bg-gradient-to-br from-primary/15 via-surface to-surface p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                      <Sparkles className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                        {t("bible.overview")}
                      </p>
                      <h3 className="text-sm font-extrabold">{t("bible.verseAnalysis")}</h3>
                    </div>
                  </div>

                  <p className="mt-4 text-sm font-medium leading-relaxed">{analysis.resumo}</p>

                  <div className="mt-4 space-y-3">
                    <AnalysisTags label={t("bible.verbs")} items={analysis.verbos} />
                    <AnalysisTags label={t("bible.nouns")} items={analysis.substantivos} />
                  </div>

                  <p className="mt-4 border-t border-border/60 pt-3 text-[10px] leading-relaxed text-muted-foreground">
                    {t("bible.aiAnalysisNote")}
                  </p>
                </section>
              )}

              {!analysisLoading && analysisError && (
                <UnavailableState
                  title={t("bible.analysisUnavailable")}
                  description={t("bible.wordsAndLexiconAvailable")}
                />
              )}
            </div>
          )}

          {aba === "referencias" && (
            <div className="space-y-3">
              {xrefsLoading && <StudyLoading compact />}

              {!xrefsLoading && xrefs.length === 0 && (
                <UnavailableState
                  title={t("bible.noCrossReferences")}
                  description={t("bible.noCrossReferencesDescription")}
                />
              )}

              {!xrefsLoading &&
                xrefs.map(([referenceBook, referenceChapter, referenceVerse], index) => (
                  <Link
                    key={[referenceBook, referenceChapter, referenceVerse].join("-")}
                    to="/biblia/estudo/$book/$chapter/$verse"
                    params={{
                      book: String(referenceBook),
                      chapter: String(referenceChapter),
                      verse: String(referenceVerse),
                    }}
                    search={{ aba: "original" as const }}
                    className="group flex items-center gap-3 rounded-[24px] border border-border/70 bg-surface p-4 shadow-sm transition-all hover:border-primary/30 hover:bg-surface-2/50 active:scale-[0.99]"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <GitBranch className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        {t("bible.connection")} {index + 1}
                      </span>
                      <span className="mt-0.5 block text-sm font-extrabold">
                        {bookNameById(referenceBook)} {referenceChapter}:{referenceVerse}
                      </span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {t("bible.openPassageInStudy")}
                      </span>
                    </span>
                    <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                  </Link>
                ))}

              {!xrefsLoading && xrefs.length > 0 && (
                <SourceNote>
                  {t("bible.crossReferenceSource")}
                </SourceNote>
              )}
            </div>
          )}

          {aba === "lexico" && !wordsLoading && words && words.length > 0 && (
            <div className="space-y-3">
              {lexiconLoading && <StudyLoading label={t("bible.loadingLexicon")} compact />}

              {!lexiconLoading && lexicalEntries.length === 0 && (
                <UnavailableState
                  title={t("bible.noLexicon")}
                  description={t("bible.noLexiconDescription")}
                />
              )}

              {!lexiconLoading && lexicalEntries.map((entry, index) => (
                <details
                  key={entry.code}
                  className="group overflow-hidden rounded-[24px] border border-border/70 bg-surface shadow-sm transition-colors open:border-primary/25"
                >
                  <summary className="flex cursor-pointer list-none items-center gap-3 p-4 [&::-webkit-details-marker]:hidden">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-ancient/10 text-xs font-extrabold text-ancient">
                      {index + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                        <span className="ancient-text text-xl text-ancient">
                          {entry.original ?? entry.code}
                        </span>
                        <span className="rounded-full border border-primary/20 bg-primary/5 px-2 py-0.5 text-[10px] font-extrabold text-primary">
                          {entry.code}
                        </span>
                      </span>
                      <span className="mt-0.5 block truncate text-xs italic text-muted-foreground">
                        {entry.transliteration ?? t("bible.transliterationUnavailable")}
                        {entry.phonetic ? " · " + entry.phonetic : ""}
                      </span>
                    </span>
                    <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180 group-open:text-primary" />
                  </summary>

                  <div className="border-t border-border/60 px-4 pb-4 pt-3">
                    {entry.partOfSpeech && (
                      <span className="inline-flex rounded-full bg-surface-2 px-2.5 py-1 text-[10px] font-bold text-muted-foreground">
                        {entry.partOfSpeech}
                      </span>
                    )}

                    <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
                      {t("bible.contextMeaning")}
                    </p>

                    <ol className="mt-2 space-y-2">
                      <li className="flex gap-2.5 rounded-2xl bg-surface-2/70 px-3 py-2.5">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-extrabold text-primary">
                          1
                        </span>
                        <span className="text-sm leading-snug text-foreground/90">
                          {contextualMeaningForEntry(book, chapter, verse, words, entry, text)}
                        </span>
                      </li>
                    </ol>

                    <p className="mt-3 rounded-2xl border border-border/60 bg-background/50 p-3 text-[10px] leading-relaxed text-muted-foreground">
                      {t("bible.lexiconSourceNote")}
                    </p>
                  </div>
                </details>
              ))}

              {lexicalEntries.length > 0 && (
                <SourceNote>
                  {t("bible.lexiconSource")}
                </SourceNote>
              )}
            </div>
          )}
        </div>
      </main>

      <Sheet open={!!openWord} onOpenChange={(open) => !open && setOpenWord(null)}>
        <SheetContent
          side="bottom"
          className="max-h-[88vh] overflow-y-auto rounded-t-[30px] border-t border-primary/20 bg-background p-0"
        >
          {openWord && (
            <WordDetail
              word={openWord}
              entry={openWord.strong ? entries[openWord.strong] : undefined}
              occurrence={openWord.strong ? occ[openWord.strong] : undefined}
              contextualMeaning={contextualMeaningFor(
                book,
                chapter,
                verse,
                openWord.index,
                openWord,
                openWord.strong ? entries[openWord.strong] : undefined,
                text,
              )}
              onSpeak={() => speak(openWord.word)}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function StudyLoading({
  label,
  compact = false,
}: {
  label?: string;
  compact?: boolean;
}) {
  const { t } = useApp();
  return (
    <div
      className={
        "flex items-center gap-3 rounded-[24px] border border-border/70 bg-surface " +
        (compact ? "p-4" : "p-5")
      }
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Loader2 className="h-5 w-5 animate-spin" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold">{t("bible.preparingStudy")}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{label ?? t("bible.loadingAcademic")}</p>
      </div>
    </div>
  );
}

function UnavailableState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[24px] border border-dashed border-border bg-surface/60 p-5 text-center">
      <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-surface-2 text-muted-foreground">
        <CircleAlert className="h-5 w-5" />
      </span>
      <p className="mt-3 text-sm font-extrabold">{title}</p>
      <p className="mx-auto mt-1 max-w-xs text-xs leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function SourceNote({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-2.5 rounded-2xl border border-border/60 bg-surface-2/50 p-3 text-[11px] leading-relaxed text-muted-foreground">
      <ListTree className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <p>{children}</p>
    </div>
  );
}

function AnalysisTags({ label, items }: { label: string; items: string[] }) {
  const { t } = useApp();
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {items.length ? (
          items.map((item) => (
            <span
              key={item}
              className="rounded-full border border-primary/15 bg-primary/[0.07] px-2.5 py-1 text-[11px] font-semibold text-foreground"
            >
              {item}
            </span>
          ))
        ) : (
          <span className="text-xs text-muted-foreground">{t("bible.infoUnavailable")}</span>
        )}
      </div>
    </div>
  );
}

function WordDetail({
  word,
  entry,
  contextualMeaning,
  occurrence,
  verseText,
  onSpeak,
}: {
  word: OriginalWord;
  entry?: StrongEntry;
  contextualMeaning: string;
  occurrence?: { c: number; f: number[]; l: number[] };
  onSpeak: () => void;
}) {
  const senses = Array.from(
    new Map(
      [contextualMeaning, ...verifiedLexicalVariants(entry)].map((sense) => [
        sense.trim().toLocaleLowerCase("pt-BR"),
        sense.trim(),
      ]),
    ).values(),
  ).slice(0, 6);
  const pronunciation = approximatePtBr(entry?.transliteration ?? null);
  const { t } = useApp();

  const [occurrencesOpen, setOccurrencesOpen] = useState(false);

  const occurrenceRefs = occurrence
    ? [
        {
          label: t("bible.firstOccurrence"),
          book: occurrence.f[0],
          chapter: occurrence.f[1],
          verse: occurrence.f[2],
        },
        {
          label: t("bible.lastOccurrence"),
          book: occurrence.l[0],
          chapter: occurrence.l[1],
          verse: occurrence.l[2],
        },
      ].filter(
        (reference, index, references) =>
          index === 0 ||
          reference.book !== references[index - 1].book ||
          reference.chapter !== references[index - 1].chapter ||
          reference.verse !== references[index - 1].verse,
      )
    : [];

  const stats: { label: string; value: string }[] = [
    { label: t("bible.occurrences"), value: occurrence ? String(occurrence.c) : "—" },
    {
      label: t("bible.firstOccurrence"),
      value: occurrence
        ? bookNameById(occurrence.f[0]) + " " + occurrence.f[1] + ":" + occurrence.f[2]
        : "—",
    },
    {
      label: t("bible.lastOccurrence"),
      value: occurrence
        ? bookNameById(occurrence.l[0]) + " " + occurrence.l[1] + ":" + occurrence.l[2]
        : "—",
    },
  ];

  return (
    <div className="pb-8">
      <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-border" />

      <section className="relative mt-3 overflow-hidden border-b border-border/60 bg-gradient-to-br from-primary/15 via-background to-background px-5 pb-5 pt-4">
        <ScrollText className="absolute -right-3 -top-4 h-24 w-24 rotate-12 text-primary/[0.06]" />
        <div className="relative pr-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
            {t("bible.wordAnalysis")}
          </p>
          <div className="mt-2 flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <p className="ancient-text break-words text-4xl leading-tight text-ancient">
                {word.word}
              </p>
              <p className="mt-1 text-sm italic text-muted-foreground">
                {entry?.transliteration ?? t("bible.transliterationUnavailable")}
              </p>
              {pronunciation && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {t("bible.approximatePronunciation")}: <strong className="text-foreground">{pronunciation}</strong>
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {word.strong && (
              <span className="rounded-full bg-primary px-3 py-1 text-[11px] font-extrabold text-primary-foreground">
                Strong {word.strong}
              </span>
            )}
            {entry?.partOfSpeech && (
              <span className="rounded-full border border-border bg-surface px-3 py-1 text-[11px] font-semibold text-muted-foreground">
                {entry.partOfSpeech}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onSpeak}
            className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-2xl border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-bold text-primary transition-colors hover:bg-primary/15 active:scale-[0.98]"
          >
            <Volume2 className="h-4 w-4" />
            {t("bible.listenPronunciation")}
          </button>
        </div>
      </section>

      <div className="space-y-5 px-5 pt-5">
        <section>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
            {senses.length > 1 ? t("bible.possibleSenses") : t("bible.sense")}
          </p>
          {senses.length > 0 ? (
            <ol className="mt-2 space-y-2">
              {senses.map((sense, index) => (
                <li
                  key={index}
                  className="flex gap-3 rounded-[20px] border border-border/60 bg-surface p-3.5"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-extrabold text-primary">
                    {index + 1}
                  </span>
                  <p className="text-sm font-medium leading-relaxed text-foreground/90">{sense}</p>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">{t("bible.infoUnavailable")}</p>
          )}
        </section>

        <section>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
            {t("bible.scriptureUse")}
          </p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setOccurrencesOpen((open) => !open)}
              className="min-w-0 rounded-[18px] border border-primary/30 bg-primary/[0.08] p-3 text-center transition-colors hover:bg-primary/[0.14]"
              aria-expanded={occurrencesOpen}
            >
              <p className="break-words text-xs font-extrabold leading-snug text-foreground">{stats[0].value}</p>
              <p className="mt-1 text-[9px] font-semibold text-primary">{t("bible.viewOccurrences")}</p>
            </button>
            {stats.slice(1).map((stat) => (
              <div
                key={stat.label}
                className="min-w-0 rounded-[18px] border border-border/60 bg-surface p-3 text-center"
              >
                <p className="break-words text-xs font-extrabold leading-snug text-foreground">
                  {stat.value}
                </p>
                <p className="mt-1 text-[9px] font-semibold text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {occurrencesOpen && occurrence && (
          <section className="rounded-[22px] border border-primary/20 bg-primary/[0.05] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                  {t("bible.referencesFound")}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {occurrence.c} {t("bible.indexOccurrences")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOccurrencesOpen(false)}
                className="rounded-full border border-border bg-surface px-3 py-1.5 text-[10px] font-bold text-muted-foreground"
              >
                Fechar
              </button>
            </div>
            <div className="mt-3 space-y-2">
              {occurrenceRefs.map((reference) => (
                <Link
                  key={reference.label}
                  to="/biblia/$book/$chapter"
                  params={{ book: String(reference.book), chapter: String(reference.chapter) }}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-surface px-3.5 py-3 transition-colors hover:border-primary/40 hover:bg-primary/10"
                >
                  <span>
                    <span className="block text-[10px] font-semibold text-muted-foreground">{reference.label}</span>
                    <span className="mt-0.5 block text-sm font-extrabold text-foreground">
                      {bookNameById(reference.book)} {reference.chapter}:{reference.verse}
                    </span>
                    </span>
                  </span>
                  <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
