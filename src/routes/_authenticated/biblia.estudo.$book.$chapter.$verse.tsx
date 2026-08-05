import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { bookNameById } from "@/data/bible-books";
import {
  approximatePtBr,
  crossReferencesFor,
  fetchChapter,
  fetchOriginalVerse,
  fetchStrongEntries,
  loadOccurrences,
  originalTranslationFor,
  translationByCode,
  type OriginalWord,
  type StrongEntry,
} from "@/lib/bible-source";
import { useBiblePrefs } from "@/lib/bible-prefs";
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
    label: "Original",
    eyebrow: "Texto-base",
    description: "Leia o vers√≠culo na l√≠ngua em que foi escrito.",
    icon: ScrollText,
  },
  {
    id: "interlinear",
    label: "Interlinear",
    eyebrow: "Linha a linha",
    description: "Compare cada termo original com sua tradu√ß√£o.",
    icon: Layers3,
  },
  {
    id: "palavras",
    label: "Palavras",
    eyebrow: "An√°lise",
    description: "Explore pron√∫ncia, sentidos e fun√ß√£o de cada palavra.",
    icon: Languages,
  },
  {
    id: "referencias",
    label: "Refer√™ncias",
    eyebrow: "Conex√µes",
    description: "Encontre outras passagens ligadas a este vers√≠culo.",
    icon: GitBranch,
  },
  {
    id: "lexico",
    label: "L√©xico",
    eyebrow: "Dicion√°rio",
    description: "Consulte os verbetes acad√™micos de Strong.",
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
      { title: "Estudo do vers√≠culo ‚Äî Disciple" },
      {
        name: "description",
        content: "Grego, hebraico, interlinear, l√©xico e refer√™ncias cruzadas do vers√≠culo.",
      },
      { property: "og:title", content: "Estudo do vers√≠culo ‚Äî Disciple" },
      {
        property: "og:description",
        content: "Estude o vers√≠culo nas l√≠nguas originais com fontes acad√™micas.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: VerseStudy,
});

const UNAVAILABLE = "Informa√ß√£o indispon√≠vel na base consultada.";

/**
 * Tradu√ß√µes alinhadas ao texto da vers√£o em portugu√™s, e n√£o glossas isoladas
 * de dicion√°rio. Cada palavra pode ter mais de uma tradu√ß√£o contextual (ex.
 * variantes aceitas na alinhagem) ‚Äî por isso cada posi√ß√£o √© um array, n√£o uma
 * string √∫nica. Este conjunto pode crescer vers√≠culo a vers√≠culo √† medida que
 * o alinhamento revisado √© incorporado √† base.
 */
const CONTEXTUAL_WORDS: Record<string, string[][]> = {
  "1:1:1": [
    ["No princ√≠pio"],
    ["criou", "fez"],
    ["Deus"],
    ["‚Äî"],
    ["os c√©us", "o c√©u"],
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

/**
 * Sentidos exibidos para uma palavra: prioriza a tradu√ß√£o contextual alinhada
 * ao vers√≠culo (CONTEXTUAL_WORDS) e cai para os sentidos do l√©xico
 * (definitions) ou para o `meaning` combinado, quando n√£o h√° alinhamento
 * manual para aquela posi√ß√£o. Usada tanto na aba Interlinear quanto na aba
 * Palavras, para que as duas sempre mostrem a mesma tradu√ß√£o.
 */
function sensesFor(
  book: number,
  chapter: number,
  verse: number,
  index: number,
  entry: StrongEntry | null | undefined,
): string[] {
  const contextual = contextualTranslationFor(book, chapter, verse, index);
  if (contextual) return contextual;
  if (entry?.definitions?.length) return entry.definitions.slice(0, 3);
  if (entry?.meaning) return [entry.meaning];
  return [];
}

type VerseAnalysis = {
  verbos: string[];
  substantivos: string[];
  resumo: string;
};

function localVerseAnalysis(
  words: OriginalWord[] | null,
  entries: Record<string, StrongEntry>,
): VerseAnalysis | null {
  if (!words?.length || Object.keys(entries).length === 0) return null;

  const verbos: string[] = [];
  const substantivos: string[] = [];
  for (const word of words) {
    const entry = word.strong ? entries[word.strong] : null;
    if (!entry) continue;
    const label = `${word.word}${entry.meaning ? ` ‚Äî ${entry.meaning.split(";")[0]}` : ""}`;
    const grammar = entry.partOfSpeech?.toLocaleLowerCase("pt-BR") ?? "";
    if (grammar.includes("verbo")) verbos.push(label);
    if (grammar.includes("substantivo") || grammar.includes("nome pr√≥prio")) {
      substantivos.push(label);
    }
  }

  const parts: string[] = [];
  if (verbos.length) parts.push(`${verbos.length} ${verbos.length === 1 ? "verbo" : "verbos"}`);
  if (substantivos.length) {
    parts.push(
      `${substantivos.length} ${substantivos.length === 1 ? "substantivo ou nome" : "substantivos ou nomes"}`,
    );
  }
  const resumo = parts.length
    ? `A estrutura identificada no texto original re√∫ne ${parts.join(" e ")}. Toque em cada palavra para conferir forma, sentidos e fonte.`
    : "A fonte n√£o classificou palavras deste vers√≠culo como verbos ou substantivos. Consulte cada termo para ver os dados dispon√≠veis.";

  return { verbos, substantivos, resumo };
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
  const [textLoading, setTextLoading] = useState(true);
  const [words, setWords] = useState<OriginalWord[] | null>(null);
  const [wordsLoading, setWordsLoading] = useState(true);
  const [origError, setOrigError] = useState(false);
  const [entries, setEntries] = useState<Record<string, StrongEntry>>({});
  const [occ, setOcc] = useState<Record<string, { c: number; f: number[]; l: number[] }>>({});
  const [xrefs, setXrefs] = useState<[number, number, number][]>([]);
  const [xrefsLoading, setXrefsLoading] = useState(true);
  const [openWord, setOpenWord] = useState<OriginalWord | null>(null);

  const lang = originalTranslationFor(book).lang;

  useEffect(() => {
    window.scrollTo(0, 0);

    setText(null);
    setTextLoading(true);
    void fetchChapter(translation, book, chapter)
      .then((ch) => setText(ch.find((x) => x.verse === verse)?.text ?? null))
      .catch(() => setText(null))
      .finally(() => setTextLoading(false));

    setXrefs([]);
    setXrefsLoading(true);
    void crossReferencesFor(book, chapter, verse)
      .then(setXrefs)
      .catch(() => setXrefs([]))
      .finally(() => setXrefsLoading(false));

    void loadOccurrences().then((o) => setOcc(o as never));

    setOrigError(false);
    setWords(null);
    setWordsLoading(true);
    setEntries({});
    fetchOriginalVerse(book, chapter, verse)
      .then(async (loadedWords) => {
        if (!loadedWords?.length) {
          setWords([]);
          setOrigError(true);
          return;
        }

        setWords(loadedWords);
        const codes = loadedWords.map((word) => word.strong).filter(Boolean) as string[];
        const raw = await fetchStrongEntries(codes);
        setEntries(raw);
      })
      .catch(() => {
        setWords([]);
        setOrigError(true);
      })
      .finally(() => setWordsLoading(false));
  }, [translation, book, chapter, verse]);

  const analysis = useMemo(() => localVerseAnalysis(words, entries), [words, entries]);

  const speak = (word: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const u = new SpeechSynthesisUtterance(word);
    u.lang = lang === "grego" ? "el-GR" : "he-IL";
    const targetLanguage = u.lang.toLocaleLowerCase();
    u.voice =
      window.speechSynthesis
        .getVoices()
        .find((voice) => voice.lang.toLocaleLowerCase() === targetLanguage) ??
      window.speechSynthesis
        .getVoices()
        .find((voice) => voice.lang.toLocaleLowerCase().startsWith(targetLanguage.slice(0, 2))) ??
      null;
    u.rate = 0.78;
    u.pitch = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };

  const setTab = (id: TabId) => void nav({ to: ".", search: { aba: id }, replace: true });

  const activeTab = TABS.find((tab) => tab.id === aba) ?? TABS[0];
  const ActiveTabIcon = activeTab.icon;
  const lexicalEntries = useMemo(
    () => Object.values(entries).sort((left, right) => left.code.localeCompare(right.code)),
    [entries],
  );
  const sourceName =
    lang === "grego"
      ? "Tischendorf, 8¬™ edi√ß√£o, com Strong"
      : "Westminster Leningrad Codex com Strong";

  return (
    <div className="mx-auto min-h-screen max-w-lg overflow-x-hidden pb-28">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="px-4 pb-2 pt-3">
          <div className="flex items-center gap-3">
            <Link
              to="/biblia/$book/$chapter"
              params={{ book: String(book), chapter: String(chapter) }}
              aria-label="Voltar para o cap√≠tulo"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-border/70 bg-surface text-muted-foreground shadow-sm transition-all hover:border-primary/40 hover:text-primary active:scale-95"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>

            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                Estude o vers√≠culo
              </p>
              <h1 className="truncate text-lg font-extrabold tracking-tight">
                {bookNameById(book)} {chapter}:{verse}
              </h1>
            </div>

            <span className="max-w-[7.5rem] truncate rounded-full border border-border/70 bg-surface-2/70 px-2.5 py-1 text-[10px] font-semibold text-muted-foreground">
              {translationByCode(translation).code}
            </span>
          </div>

          <nav
            aria-label="Ferramentas de estudo"
            className="-mx-1 mt-3 flex snap-x gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {TABS.map((tab) => {
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
                    "flex min-h-11 shrink-0 snap-start items-center gap-2 rounded-2xl border px-3.5 py-2 text-xs font-bold transition-all active:scale-[0.98] " +
                    (selected
                      ? "border-primary/45 bg-primary text-primary-foreground shadow-[0_8px_24px_-12px_hsl(var(--primary))]"
                      : "border-border/70 bg-surface text-muted-foreground hover:border-primary/25 hover:text-foreground")
                  }
                >
                  <TabIcon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="space-y-5 px-4 pt-4">
        <section className="relative overflow-hidden rounded-[28px] border border-primary/20 bg-gradient-to-br from-primary/20 via-surface to-surface p-5 shadow-[0_20px_60px_-42px_hsl(var(--primary))]">
          <Quote className="absolute -right-3 -top-4 h-24 w-24 rotate-12 text-primary/[0.08]" />
          <div className="relative">
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
                <Sparkles className="h-3 w-3" />
                Vers√≠culo em foco
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
              <p className="mt-4 text-[17px] font-semibold leading-relaxed text-foreground">
                ‚Äú{text ?? UNAVAILABLE}‚Äù
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
            {TABS.findIndex((tab) => tab.id === aba) + 1}/{TABS.length}
          </span>
        </section>

        <div key={aba} className="animate-slide-up">
          {wordsLoading && aba !== "referencias" && <StudyLoading />}

          {!wordsLoading && origError && aba !== "referencias" && (
            <UnavailableState
              title="Texto original indispon√≠vel"
              description="N√£o foi poss√≠vel consultar a base acad√™mica para esta passagem agora."
            />
          )}

          {aba === "original" && !wordsLoading && words && words.length > 0 && (
            <div className="space-y-3">
              <section className="overflow-hidden rounded-[26px] bo„z∂âûÀk∫wµÁ@ÄÄÄÄÄÄÄΩÕ¡Ö∏¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒÕ¡Ö∏Åç±ÖÕÕ9ÖµîÙâµ•∏µ‹¥¿Åô±ï‡¥ƒà¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒÕ¡Ö∏Åç±ÖÕÕ9ÖµîÙââ±Ωç¨Å—ï·–µlƒ¡¡·tÅôΩπ–µâΩ±êÅ’¡¡ï…çÖÕîÅ—…Öç≠•πúµ›•ëï»Å—ï·–µµ’—ïêµôΩ…ïù…Ω’πêà¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅΩπï„çºÅÌ•πëï‡Ä¨Ä≈Ù(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄΩÕ¡Ö∏¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒÕ¡Ö∏Åç±ÖÕÕ9ÖµîÙâµ–¥¿∏‘Åâ±Ωç¨Å—ï·–µÕ¥ÅôΩπ–µï·—…ÖâΩ±êà¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅÌâΩΩ≠9Öµï	Â%ê°…ïôï…ïπçï	ΩΩ¨•ÙÅÌ…ïôï…ïπçï°Ö¡—ï…ÙÈÌ…ïôï…ïπçïYï…ÕïÙ(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄΩÕ¡Ö∏¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒÕ¡Ö∏Åç±ÖÕÕ9ÖµîÙâµ–¥ƒÅâ±Ωç¨Å—ï·–µ·ÃÅ—ï·–µµ’—ïêµôΩ…ïù…Ω’πêà¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅâ…•»ÅïÕ—ÑÅ¡ÖÕÕÖùï¥ÅπºÅµΩëºÅëîÅïÕ—’ëº(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄΩÕ¡Ö∏¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄΩÕ¡Ö∏¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒ°ïŸ…ΩπI•ù°–Åç±ÖÕÕ9ÖµîÙâ†¥‘Å‹¥‘ÅÕ°…•π¨¥¿Å—ï·–µµ’—ïêµôΩ…ïù…Ω’πêº‘¿Å—…ÖπÕ•—•Ω∏µ—…ÖπÕôΩ…¥Åù…Ω’¿µ°ΩŸï»È—…ÖπÕ±Ö—îµ‡¥¿∏‘Åù…Ω’¿µ°ΩŸï»È—ï·–µ¡…•µÖ…‰àÄº¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄΩ1•π¨¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ§•Ù((ÄÄÄÄÄÄÄÄÄÄÄÄÄÅÏÖ·…ïôÕ1ΩÖë•πúÄòòÅ·…ïôÃπ±ïπù—†Ä¯Ä¿ÄòòÄ†(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒMΩ’…çï9Ω—î¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅIïôïÀ©πç•ÖÃÅç…’ÈÖëÖÃÅôΩ…πïç•ëÖÃÅ¡Ω»ÅΩ¡ïπâ•â±îπ•πôºÅÕΩàÅ±•çïªùÑÅµ	d∏(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄΩMΩ’…çï9Ω—î¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄ•Ù(ÄÄÄÄÄÄÄÄÄÄÄÄΩë•ÿ¯(ÄÄÄÄÄÄÄÄÄÄ•Ù((ÄÄÄÄÄÄÄÄÄÅÌÖâÑÄÙÙÙÄâ±ï·•çºàÄòòÄÖ›Ω…ëÕ1ΩÖë•πúÄòòÅ›Ω…ëÃÄòòÅ›Ω…ëÃπ±ïπù—†Ä¯Ä¿ÄòòÄ†(ÄÄÄÄÄÄÄÄÄÄÄÄÒë•ÿÅç±ÖÕÕ9ÖµîÙâÕ¡Öçîµ‰¥Ãà¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÅÌ±ï·•çÖ±π—…•ïÃπ±ïπù—†ÄÙÙÙÄ¿ÄòòÄ†(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒM—’ëÂ1ΩÖë•πúÅ±Öâï∞ÙâÖ……ïùÖπëºÅŸï…âï—ïÃÅëºÅ≥•·•çøäòàÅçΩµ¡Öç–Äº¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄ•Ù((ÄÄÄÄÄÄÄÄÄÄÄÄÄÅÌ±ï·•çÖ±π—…•ïÃπµÖ¿†°ïπ—…‰∞Å•πëï‡§ÄÙ¯Ä†(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒëï—Ö•±Ã(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅ≠ï‰ıÌïπ—…‰πçΩëïÙ(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅç±ÖÕÕ9ÖµîÙâù…Ω’¿ÅΩŸï…ô±Ω‹µ°•ëëï∏Å…Ω’πëïêµl»—¡·tÅâΩ…ëï»ÅâΩ…ëï»µâΩ…ëï»º‹¿ÅâúµÕ’…ôÖçîÅÕ°ÖëΩ‹µÕ¥Å—…ÖπÕ•—•Ω∏µçΩ±Ω…ÃÅΩ¡ï∏ÈâΩ…ëï»µ¡…•µÖ…‰º»‘à(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒÕ’µµÖ…‰Åç±ÖÕÕ9ÖµîÙâô±ï‡Åç’…ÕΩ»µ¡Ω•π—ï»Å±•Õ–µπΩπîÅ•—ïµÃµçïπ—ï»ÅùÖ¿¥ÃÅ¿¥–ÅlòËËµ›ïâ≠•–µëï—Ö•±ÃµµÖ…≠ï…tÈ°•ëëï∏à¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒÕ¡Ö∏Åç±ÖÕÕ9ÖµîÙâô±ï‡Å†¥ƒ¿Å‹¥ƒ¿ÅÕ°…•π¨¥¿Å•—ïµÃµçïπ—ï»Å©’Õ—•ô‰µçïπ—ï»Å…Ω’πëïê¥…·∞ÅâúµÖπç•ïπ–ºƒ¿Å—ï·–µ·ÃÅôΩπ–µï·—…ÖâΩ±êÅ—ï·–µÖπç•ïπ–à¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅÌ•πëï‡Ä¨Ä≈Ù(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄΩÕ¡Ö∏¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒÕ¡Ö∏Åç±ÖÕÕ9ÖµîÙâµ•∏µ‹¥¿Åô±ï‡¥ƒà¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒÕ¡Ö∏Åç±ÖÕÕ9ÖµîÙâô±ï‡Åô±ï‡µ›…Ö¿Å•—ïµÃµâÖÕï±•πîÅùÖ¿µ‡¥»ÅùÖ¿µ‰¥ƒà¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒÕ¡Ö∏Åç±ÖÕÕ9ÖµîÙâÖπç•ïπ–µ—ï·–Å—ï·–µ·∞Å—ï·–µÖπç•ïπ–à¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅÌïπ—…‰πΩ…•ù•πÖ∞Ä¸¸Åïπ—…‰πçΩëïÙ(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄΩÕ¡Ö∏¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒÕ¡Ö∏Åç±ÖÕÕ9ÖµîÙâ…Ω’πëïêµô’±∞ÅâΩ…ëï»ÅâΩ…ëï»µ¡…•µÖ…‰º»¿Åâúµ¡…•µÖ…‰º‘Å¡‡¥»Å¡‰¥¿∏‘Å—ï·–µlƒ¡¡·tÅôΩπ–µï·—…ÖâΩ±êÅ—ï·–µ¡…•µÖ…‰à¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅÌïπ—…‰πçΩëïÙ(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄΩÕ¡Ö∏¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄΩÕ¡Ö∏¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒÕ¡Ö∏Åç±ÖÕÕ9ÖµîÙâµ–¥¿∏‘Åâ±Ωç¨Å—…’πçÖ—îÅ—ï·–µ·ÃÅ•—Ö±•åÅ—ï·–µµ’—ïêµôΩ…ïù…Ω’πêà¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅÌïπ—…‰π—…ÖπÕ±•—ï…Ö—•Ω∏Ä¸¸ÄâQ…ÖπÕ±•—ï…áüçºÅ•πë•Õ¡ΩªµŸï∞âÙ(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅÌïπ—…‰π¡°Ωπï—•åÄ¸ÄàÉ
‹ÄàÄ¨Åïπ—…‰π¡°Ωπï—•åÄËÄàâÙ(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄΩÕ¡Ö∏¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄΩÕ¡Ö∏¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒ°ïŸ…ΩπΩ›∏Åç±ÖÕÕ9ÖµîÙâ†¥‘Å‹¥‘ÅÕ°…•π¨¥¿Å—ï·–µµ’—ïêµôΩ…ïù…Ω’πêÅ—…ÖπÕ•—•Ω∏µ—…ÖπÕôΩ…¥Åë’…Ö—•Ω∏¥»¿¿Åù…Ω’¿µΩ¡ï∏È…Ω—Ö—î¥ƒ‡¿Åù…Ω’¿µΩ¡ï∏È—ï·–µ¡…•µÖ…‰àÄº¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄΩÕ’µµÖ…‰¯((ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒë•ÿÅç±ÖÕÕ9ÖµîÙââΩ…ëï»µ–ÅâΩ…ëï»µâΩ…ëï»ºÿ¿Å¡‡¥–Å¡à¥–Å¡–¥Ãà¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒë•ÿÅç±ÖÕÕ9ÖµîÙâô±ï‡Å•—ïµÃµÕ—Ö…–Å©’Õ—•ô‰µâï—›ïï∏ÅùÖ¿¥Ãà¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒë•ÿÅç±ÖÕÕ9ÖµîÙâô±ï‡Åô±ï‡µ›…Ö¿ÅùÖ¿¥ƒ∏‘à¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅÌïπ—…‰π¡Ö…—=ôM¡ïïç†ÄòòÄ†(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒÕ¡Ö∏Åç±ÖÕÕ9ÖµîÙâ•π±•πîµô±ï‡Å…Ω’πëïêµô’±∞ÅâúµÕ’…ôÖçî¥»Å¡‡¥»∏‘Å¡‰¥ƒÅ—ï·–µlƒ¡¡·tÅôΩπ–µâΩ±êÅ—ï·–µµ’—ïêµôΩ…ïù…Ω’πêà¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅÌïπ—…‰π¡Ö…—=ôM¡ïïç°Ù(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄΩÕ¡Ö∏¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ•Ù(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄΩë•ÿ¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒâ’——Ω∏(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅ—Â¡îÙââ’——Ω∏à(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅΩπ±•ç¨ıÏ†§ÄÙ¯ÅÕ¡ïÖ¨°ïπ—…‰πΩ…•ù•πÖ∞Ä¸¸Åïπ—…‰π—…ÖπÕ±•—ï…Ö—•Ω∏Ä¸¸Åïπ—…‰πçΩëî•Ù(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅç±ÖÕÕ9ÖµîÙâ•π±•πîµô±ï‡Åµ•∏µ†¥‰ÅÕ°…•π¨¥¿Å•—ïµÃµçïπ—ï»ÅùÖ¿¥ƒ∏‘Å…Ω’πëïêµ·∞ÅâΩ…ëï»ÅâΩ…ëï»µ¡…•µÖ…‰º»¿Åâúµ¡…•µÖ…‰Ωl¿∏¿›tÅ¡‡¥ÃÅ—ï·–µlƒ¡¡·tÅôΩπ–µâΩ±êÅ—ï·–µ¡…•µÖ…‰Å—…ÖπÕ•—•Ω∏µçΩ±Ω…ÃÅ°ΩŸï»Èâúµ¡…•µÖ…‰ºƒ»ÅÖç—•ŸîÈÕçÖ±î¥‰‘à(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅÖ…•Ñµ±Öâï∞ıÌÅ=’Ÿ•»ÄëÌïπ—…‰πΩ…•ù•πÖ∞Ä¸¸Åïπ—…‰π—…ÖπÕ±•—ï…Ö—•Ω∏Ä¸¸Åïπ—…‰πçΩëïıÅÙ(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒYΩ±’µî»Åç±ÖÕÕ9ÖµîÙâ†¥Ã∏‘Å‹¥Ã∏‘àÄº¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅ=’Ÿ•»(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄΩâ’——Ω∏¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄΩë•ÿ¯((ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒ¿Åç±ÖÕÕ9ÖµîÙâµ–¥ÃÅ—ï·–µlƒ¡¡·tÅôΩπ–µâΩ±êÅ’¡¡ï…çÖÕîÅ—…Öç≠•πúµl¿∏ƒ—ïµtÅ—ï·–µ¡…•µÖ…‰à¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅMïπ—•ëΩÃÅ¡ΩÕœµŸï•Ã(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄΩ¿¯((ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅÌïπ—…‰πëïô•π•—•ΩπÃπ±ïπù—†Ä¸Ä†(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒΩ∞Åç±ÖÕÕ9ÖµîÙâµ–¥»ÅÕ¡Öçîµ‰¥»à¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅÌïπ—…‰πëïô•π•—•ΩπÃπµÖ¿†°ëïô•π•—•Ω∏∞Åëïô•π•—•Ωπ%πëï‡§ÄÙ¯Ä†(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒ±§(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅ≠ï‰ıÌëïô•π•—•Ωπ%πëï·Ù(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅç±ÖÕÕ9ÖµîÙâô±ï‡ÅùÖ¿¥»∏‘Å…Ω’πëïê¥…·∞ÅâúµÕ’…ôÖçî¥»º‹¿Å¡‡¥ÃÅ¡‰¥»∏‘à(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒÕ¡Ö∏Åç±ÖÕÕ9ÖµîÙâô±ï‡Å†¥‘Å‹¥‘ÅÕ°…•π¨¥¿Å•—ïµÃµçïπ—ï»Å©’Õ—•ô‰µçïπ—ï»Å…Ω’πëïêµô’±∞Åâúµ¡…•µÖ…‰ºƒ¿Å—ï·–µlƒ¡¡·tÅôΩπ–µï·—…ÖâΩ±êÅ—ï·–µ¡…•µÖ…‰à¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅÌëïô•π•—•Ωπ%πëï‡Ä¨Ä≈Ù(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄΩÕ¡Ö∏¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒÕ¡Ö∏Åç±ÖÕÕ9ÖµîÙâ—ï·–µÕ¥Å±ïÖë•πúµÕπ’úÅ—ï·–µôΩ…ïù…Ω’πêº‰¿à¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅÌëïô•π•—•ΩπÙ(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄΩÕ¡Ö∏¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄΩ±§¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ§•Ù(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄΩΩ∞¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ§ÄËÄ†(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒ¿Åç±ÖÕÕ9ÖµîÙâµ–¥»Å—ï·–µÕ¥Å—ï·–µµ’—ïêµôΩ…ïù…Ω’πêà˘ÌU9Y%1	1ÙΩ¿¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ•Ù((ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒë•ÿÅç±ÖÕÕ9ÖµîÙâµ–¥ÃÅ…Ω’πëïê¥…·∞ÅâΩ…ëï»ÅâΩ…ëï»µâΩ…ëï»ºÿ¿ÅâúµâÖç≠ù…Ω’πêº‘¿Å¿¥ÃÅ—ï·–µlƒ¡¡·tÅ±ïÖë•πúµ…ï±Ö·ïêÅ—ï·–µµ’—ïêµôΩ…ïù…Ω’πêà¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅΩπ—îÅ±ï·•çÖ∞ËÅ	…Ω›∏µ…•Ÿï»µ	…•ùùÃÄºÅQ°ÖÂï»∏ÅΩµ¡Ö…îÅΩÃÅÕïπ—•ëΩÃÅçΩ¥ÅÑ(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅΩçΩ…À©πç•ÑÅîÅºÅçΩπ—ï·—ºÅëºÅŸï…œµç’±º∏(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄΩë•ÿ¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄΩë•ÿ¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄΩëï—Ö•±Ã¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄ§•Ù((ÄÄÄÄÄÄÄÄÄÄÄÄÄÅÌ±ï·•çÖ±π—…•ïÃπ±ïπù—†Ä¯Ä¿ÄòòÄ†(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒMΩ’…çï9Ω—î¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅΩπ—îËÅ	…Ω›∏µ…•Ÿï»µ	…•ùùÃÄºÅQ°ÖÂï»∞ÅçΩπçΩ…ìâπç•ÑÅëîÅM—…Ωπú∏Å=ÃÅëÖëΩÃÅï¥Å¡Ω…—’ù◊©Ã(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅœçºÅ±ΩçÖ•ÃÏÅπïπ°’¥Å—ï·—ºÉ§ÅïπŸ•ÖëºÅÑÅ’¥Å—…Öë’—Ω»Åë’…Öπ—îÅºÅ’Õº∏(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄΩMΩ’…çï9Ω—î¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄ•Ù(ÄÄÄÄÄÄÄÄÄÄÄÄΩë•ÿ¯(ÄÄÄÄÄÄÄÄÄÄ•Ù(ÄÄÄÄÄÄÄÄΩë•ÿ¯(ÄÄÄÄÄÄΩµÖ•∏¯((ÄÄÄÄÄÄÒM°ïï–ÅΩ¡ï∏ıÏÑÖΩ¡ïπ]Ω…ëÙÅΩπ=¡ïπ°ÖπùîıÏ°Ω¡ï∏§ÄÙ¯ÄÖΩ¡ï∏ÄòòÅÕï—=¡ïπ]Ω…ê°π’±∞•Ù¯(ÄÄÄÄÄÄÄÄÒM°ïï—Ωπ—ïπ–(ÄÄÄÄÄÄÄÄÄÅÕ•ëîÙââΩ——Ω¥à(ÄÄÄÄÄÄÄÄÄÅç±ÖÕÕ9ÖµîÙâµÖ‡µ†µl‡·Ÿ°tÅΩŸï…ô±Ω‹µ‰µÖ’—ºÅ…Ω’πëïêµ–µlÃ¡¡·tÅâΩ…ëï»µ–ÅâΩ…ëï»µ¡…•µÖ…‰º»¿ÅâúµâÖç≠ù…Ω’πêÅ¿¥¿à(ÄÄÄÄÄÄÄÄ¯(ÄÄÄÄÄÄÄÄÄÅÌΩ¡ïπ]Ω…êÄòòÄ†(ÄÄÄÄÄÄÄÄÄÄÄÄÒ]Ω…ëï—Ö•∞(ÄÄÄÄÄÄÄÄÄÄÄÄÄÅ›Ω…êıÌΩ¡ïπ]Ω…ëÙ(ÄÄÄÄÄÄÄÄÄÄÄÄÄÅïπ—…‰ıÌΩ¡ïπ]Ω…êπÕ—…ΩπúÄ¸Åïπ—…•ïÕmΩ¡ïπ]Ω…êπÕ—…ΩπùtÄËÅ’πëïô•πïëÙ(ÄÄÄÄÄÄÄÄÄÄÄÄÄÅΩçç’……ïπçîıÌΩ¡ïπ]Ω…êπÕ—…ΩπúÄ¸ÅΩççmΩ¡ïπ]Ω…êπÕ—…ΩπùtÄËÅ’πëïô•πïëÙ(ÄÄÄÄÄÄÄÄÄÄÄÄÄÅΩπM¡ïÖ¨ıÏ†§ÄÙ¯ÅÕ¡ïÖ¨°Ω¡ïπ]Ω…êπ›Ω…ê•Ù(ÄÄÄÄÄÄÄÄÄÄÄÄº¯(ÄÄÄÄÄÄÄÄÄÄ•Ù(ÄÄÄÄÄÄÄÄΩM°ïï—Ωπ—ïπ–¯(ÄÄÄÄÄÄΩM°ïï–¯(ÄÄÄÄΩë•ÿ¯(ÄÄ§Ï)Ù()ô’πç—•Ω∏ÅM—’ëÂ1ΩÖë•πú°Ï(ÄÅ±Öâï∞ÄÙÄâΩπÕ’±—ÖπëºÅÖÃÅôΩπ—ïÃÅÖçÖì©µ•çÖœäòà∞(ÄÅçΩµ¡Öç–ÄÙÅôÖ±Õî∞)ÙËÅÏ(ÄÅ±Öâï∞¸ËÅÕ—…•πúÏ(ÄÅçΩµ¡Öç–¸ËÅâΩΩ±ïÖ∏Ï)Ù§ÅÏ(ÄÅ…ï—’…∏Ä†(ÄÄÄÄÒë•ÿ(ÄÄÄÄÄÅç±ÖÕÕ9ÖµîıÏ(ÄÄÄÄÄÄÄÄâô±ï‡Å•—ïµÃµçïπ—ï»ÅùÖ¿¥ÃÅ…Ω’πëïêµl»—¡·tÅâΩ…ëï»ÅâΩ…ëï»µâΩ…ëï»º‹¿ÅâúµÕ’…ôÖçîÄàÄ¨(ÄÄÄÄÄÄÄÄ°çΩµ¡Öç–Ä¸Äâ¿¥–àÄËÄâ¿¥‘à§(ÄÄÄÄÄÅÙ(ÄÄÄÄ¯(ÄÄÄÄÄÄÒÕ¡Ö∏Åç±ÖÕÕ9ÖµîÙâô±ï‡Å†¥ƒƒÅ‹¥ƒƒÅÕ°…•π¨¥¿Å•—ïµÃµçïπ—ï»Å©’Õ—•ô‰µçïπ—ï»Å…Ω’πëïê¥…·∞Åâúµ¡…•µÖ…‰ºƒ¿Å—ï·–µ¡…•µÖ…‰à¯(ÄÄÄÄÄÄÄÄÒ1ΩÖëï»»Åç±ÖÕÕ9ÖµîÙâ†¥‘Å‹¥‘ÅÖπ•µÖ—îµÕ¡•∏àÄº¯(ÄÄÄÄÄÄΩÕ¡Ö∏¯(ÄÄÄÄÄÄÒë•ÿÅç±ÖÕÕ9ÖµîÙâµ•∏µ‹¥¿Åô±ï‡¥ƒà¯(ÄÄÄÄÄÄÄÄÒ¿Åç±ÖÕÕ9ÖµîÙâ—ï·–µÕ¥ÅôΩπ–µâΩ±êà˘A…ï¡Ö…ÖπëºÅÕï‘ÅïÕ—’ëºΩ¿¯(ÄÄÄÄÄÄÄÄÒ¿Åç±ÖÕÕ9ÖµîÙâµ–¥¿∏‘Å—ï·–µ·ÃÅ—ï·–µµ’—ïêµôΩ…ïù…Ω’πêà˘Ì±Öâï±ÙΩ¿¯(ÄÄÄÄÄÄΩë•ÿ¯(ÄÄÄÄΩë•ÿ¯(ÄÄ§Ï)Ù()ô’πç—•Ω∏ÅUπÖŸÖ•±Öâ±ïM—Ö—î°ÏÅ—•—±î∞ÅëïÕç…•¡—•Ω∏ÅÙËÅÏÅ—•—±îËÅÕ—…•πúÏÅëïÕç…•¡—•Ω∏ËÅÕ—…•πúÅÙ§ÅÏ(ÄÅ…ï—’…∏Ä†(ÄÄÄÄÒë•ÿÅç±ÖÕÕ9ÖµîÙâ…Ω’πëïêµl»—¡·tÅâΩ…ëï»ÅâΩ…ëï»µëÖÕ°ïêÅâΩ…ëï»µâΩ…ëï»ÅâúµÕ’…ôÖçîºÿ¿Å¿¥‘Å—ï·–µçïπ—ï»à¯(ÄÄÄÄÄÄÒÕ¡Ö∏Åç±ÖÕÕ9ÖµîÙâµ‡µÖ’—ºÅô±ï‡Å†¥ƒƒÅ‹¥ƒƒÅ•—ïµÃµçïπ—ï»Å©’Õ—•ô‰µçïπ—ï»Å…Ω’πëïê¥…·∞ÅâúµÕ’…ôÖçî¥»Å—ï·–µµ’—ïêµôΩ…ïù…Ω’πêà¯(ÄÄÄÄÄÄÄÄÒ•…ç±ï±ï…–Åç±ÖÕÕ9ÖµîÙâ†¥‘Å‹¥‘àÄº¯(ÄÄÄÄÄÄΩÕ¡Ö∏¯(ÄÄÄÄÄÄÒ¿Åç±ÖÕÕ9ÖµîÙâµ–¥ÃÅ—ï·–µÕ¥ÅôΩπ–µï·—…ÖâΩ±êà˘Ì—•—±ïÙΩ¿¯(ÄÄÄÄÄÄÒ¿Åç±ÖÕÕ9ÖµîÙâµ‡µÖ’—ºÅµ–¥ƒÅµÖ‡µ‹µ·ÃÅ—ï·–µ·ÃÅ±ïÖë•πúµ…ï±Ö·ïêÅ—ï·–µµ’—ïêµôΩ…ïù…Ω’πêà¯(ÄÄÄÄÄÄÄÅÌëïÕç…•¡—•ΩπÙ(ÄÄÄÄÄÄΩ¿¯(ÄÄÄÄΩë•ÿ¯(ÄÄ§Ï)Ù()ô’πç—•Ω∏ÅMΩ’…çï9Ω—î°ÏÅç°•±ë…ï∏ÅÙËÅÏÅç°•±ë…ï∏ËÅIïÖç—9ΩëîÅÙ§ÅÏ(ÄÅ…ï—’…∏Ä†(ÄÄÄÄÒë•ÿÅç±ÖÕÕ9ÖµîÙâô±ï‡ÅùÖ¿¥»∏‘Å…Ω’πëïê¥…·∞ÅâΩ…ëï»ÅâΩ…ëï»µâΩ…ëï»ºÿ¿ÅâúµÕ’…ôÖçî¥»º‘¿Å¿¥ÃÅ—ï·–µlƒ≈¡·tÅ±ïÖë•πúµ…ï±Ö·ïêÅ—ï·–µµ’—ïêµôΩ…ïù…Ω’πêà¯(ÄÄÄÄÄÄÒ1•Õ—Q…ïîÅç±ÖÕÕ9ÖµîÙâµ–¥¿∏‘Å†¥–Å‹¥–ÅÕ°…•π¨¥¿Å—ï·–µ¡…•µÖ…‰àÄº¯(ÄÄÄÄÄÄÒ¿˘Ìç°•±ë…ïπÙΩ¿¯(ÄÄÄÄΩë•ÿ¯(ÄÄ§Ï)Ù()ô’πç—•Ω∏ÅπÖ±ÂÕ•ÕQÖùÃ°ÏÅ±Öâï∞∞Å•—ïµÃÅÙËÅÏÅ±Öâï∞ËÅÕ—…•πúÏÅ•—ïµÃËÅÕ—…•πùmtÅÙ§ÅÏ(ÄÅ…ï—’…∏Ä†(ÄÄÄÄÒë•ÿ¯(ÄÄÄÄÄÄÒ¿Åç±ÖÕÕ9ÖµîÙâ—ï·–µlƒ¡¡·tÅôΩπ–µâΩ±êÅ’¡¡ï…çÖÕîÅ—…Öç≠•πúµ›•ëï»Å—ï·–µµ’—ïêµôΩ…ïù…Ω’πêà¯(ÄÄÄÄÄÄÄÅÌ±Öâï±Ù(ÄÄÄÄÄÄΩ¿¯(ÄÄÄÄÄÄÒë•ÿÅç±ÖÕÕ9ÖµîÙâµ–¥ƒ∏‘Åô±ï‡Åô±ï‡µ›…Ö¿ÅùÖ¿¥ƒ∏‘à¯(ÄÄÄÄÄÄÄÅÌ•—ïµÃπ±ïπù—†Ä¸Ä†(ÄÄÄÄÄÄÄÄÄÅ•—ïµÃπµÖ¿†°•—ï¥§ÄÙ¯Ä†(ÄÄÄÄÄÄÄÄÄÄÄÄÒÕ¡Ö∏(ÄÄÄÄÄÄÄÄÄÄÄÄÄÅ≠ï‰ıÌ•—ïµÙ(ÄÄÄÄÄÄÄÄÄÄÄÄÄÅç±ÖÕÕ9ÖµîÙâ…Ω’πëïêµô’±∞ÅâΩ…ëï»ÅâΩ…ëï»µ¡…•µÖ…‰ºƒ‘Åâúµ¡…•µÖ…‰Ωl¿∏¿›tÅ¡‡¥»∏‘Å¡‰¥ƒÅ—ï·–µlƒ≈¡·tÅôΩπ–µÕïµ•âΩ±êÅ—ï·–µôΩ…ïù…Ω’πêà(ÄÄÄÄÄÄÄÄÄÄÄÄ¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÅÌ•—ïµÙ(ÄÄÄÄÄÄÄÄÄÄÄÄΩÕ¡Ö∏¯(ÄÄÄÄÄÄÄÄÄÄ§§(ÄÄÄÄÄÄÄÄ§ÄËÄ†(ÄÄÄÄÄÄÄÄÄÄÒÕ¡Ö∏Åç±ÖÕÕ9ÖµîÙâ—ï·–µ·ÃÅ—ï·–µµ’—ïêµôΩ…ïù…Ω’πêà˘ÌU9Y%1	1ÙΩÕ¡Ö∏¯(ÄÄÄÄÄÄÄÄ•Ù(ÄÄÄÄÄÄΩë•ÿ¯(ÄÄÄÄΩë•ÿ¯(ÄÄ§Ï)Ù()ô’πç—•Ω∏Å]Ω…ëï—Ö•∞°Ï(ÄÅ›Ω…ê∞(ÄÅïπ—…‰∞(ÄÅΩçç’……ïπçî∞(ÄÅΩπM¡ïÖ¨∞)ÙËÅÏ(ÄÅ›Ω…êËÅ=…•ù•πÖ±]Ω…êÏ(ÄÅïπ—…‰¸ËÅM—…Ωπùπ—…‰Ï(ÄÅΩçç’……ïπçî¸ËÅÏÅåËÅπ’µâï»ÏÅòËÅπ’µâï…mtÏÅ∞ËÅπ’µâï…mtÅÙÏ(ÄÅΩπM¡ïÖ¨ËÄ†§ÄÙ¯ÅŸΩ•êÏ)Ù§ÅÏ(ÄÅçΩπÕ–ÅÕïπÕïÃÄÙÅïπ—…‰¸πëïô•π•—•ΩπÃ¸π±ïπù—†(ÄÄÄÄ¸Åïπ—…‰πëïô•π•—•ΩπÃ(ÄÄÄÄËÅïπ—…‰¸πµïÖπ•πú(ÄÄÄÄÄÄ¸Åmïπ—…‰πµïÖπ•πùt(ÄÄÄÄÄÄËÅmtÏ(ÄÅçΩπÕ–Å¡…Ωπ’πç•Ö—•Ω∏ÄÙÅÖ¡¡…Ω·•µÖ—ïA—	»°ïπ—…‰¸π—…ÖπÕ±•—ï…Ö—•Ω∏Ä¸¸Åπ’±∞§Ï((ÄÅçΩπÕ–ÅÕ—Ö—ÃËÅÏÅ±Öâï∞ËÅÕ—…•πúÏÅŸÖ±’îËÅÕ—…•πúÅımtÄÙÅl(ÄÄÄÅÏÅ±Öâï∞ËÄâ=çΩ…À©πç•ÖÃà∞ÅŸÖ±’îËÅΩçç’……ïπçîÄ¸ÅM—…•πú°Ωçç’……ïπçîπå§ÄËÄãäPàÅÙ∞(ÄÄÄÅÏ(ÄÄÄÄÄÅ±Öâï∞ËÄâA…•µï•…ÑÅŸïËà∞(ÄÄÄÄÄÅŸÖ±’îËÅΩçç’……ïπçî(ÄÄÄÄÄÄÄÄ¸ÅâΩΩ≠9Öµï	Â%ê°Ωçç’……ïπçîπôl¡t§Ä¨ÄàÄàÄ¨ÅΩçç’……ïπçîπôl≈tÄ¨ÄàËàÄ¨ÅΩçç’……ïπçîπôl…t(ÄÄÄÄÄÄÄÄËÄãäPà∞(ÄÄÄÅÙ∞(ÄÄÄÅÏ(ÄÄÄÄÄÅ±Öâï∞ËÄãi±—•µÑÅŸïËà∞(ÄÄÄÄÄÅŸÖ±’îËÅΩçç’……ïπçî(ÄÄÄÄÄÄÄÄ¸ÅâΩΩ≠9Öµï	Â%ê°Ωçç’……ïπçîπ±l¡t§Ä¨ÄàÄàÄ¨ÅΩçç’……ïπçîπ±l≈tÄ¨ÄàËàÄ¨ÅΩçç’……ïπçîπ±l…t(ÄÄÄÄÄÄÄÄËÄãäPà∞(ÄÄÄÅÙ∞(ÄÅtÏ((ÄÅ…ï—’…∏Ä†(ÄÄÄÄÒë•ÿÅç±ÖÕÕ9ÖµîÙâ¡à¥‡à¯(ÄÄÄÄÄÄÒë•ÿÅç±ÖÕÕ9ÖµîÙâµ‡µÖ’—ºÅµ–¥»Å†¥ƒ∏‘Å‹¥ƒ»Å…Ω’πëïêµô’±∞ÅâúµâΩ…ëï»àÄº¯((ÄÄÄÄÄÄÒÕïç—•Ω∏Åç±ÖÕÕ9ÖµîÙâ…ï±Ö—•ŸîÅµ–¥ÃÅΩŸï…ô±Ω‹µ°•ëëï∏ÅâΩ…ëï»µàÅâΩ…ëï»µâΩ…ëï»ºÿ¿Åâúµù…Öë•ïπ–µ—ºµâ»Åô…Ω¥µ¡…•µÖ…‰ºƒ‘ÅŸ•ÑµâÖç≠ù…Ω’πêÅ—ºµâÖç≠ù…Ω’πêÅ¡‡¥‘Å¡à¥‘Å¡–¥–à¯(ÄÄÄÄÄÄÄÄÒMç…Ω±±Qï·–Åç±ÖÕÕ9ÖµîÙâÖâÕΩ±’—îÄµ…•ù°–¥ÃÄµ—Ω¿¥–Å†¥»–Å‹¥»–Å…Ω—Ö—î¥ƒ»Å—ï·–µ¡…•µÖ…‰Ωl¿∏¿ŸtàÄº¯(ÄÄÄÄÄÄÄÄÒë•ÿÅç±ÖÕÕ9ÖµîÙâ…ï±Ö—•ŸîÅ¡»¥‡à¯(ÄÄÄÄÄÄÄÄÄÄÒ¿Åç±ÖÕÕ9ÖµîÙâ—ï·–µlƒ¡¡·tÅôΩπ–µâΩ±êÅ’¡¡ï…çÖÕîÅ—…Öç≠•πúµl¿∏ƒŸïµtÅ—ï·–µ¡…•µÖ…‰à¯(ÄÄÄÄÄÄÄÄÄÄÄÅªÖ±•ÕîÅëÑÅ¡Ö±ÖŸ…Ñ(ÄÄÄÄÄÄÄÄÄÄΩ¿¯(ÄÄÄÄÄÄÄÄÄÄÒë•ÿÅç±ÖÕÕ9ÖµîÙâµ–¥»Åô±ï‡Å•—ïµÃµÕ—Ö…–ÅùÖ¿¥Ãà¯(ÄÄÄÄÄÄÄÄÄÄÄÄÒë•ÿÅç±ÖÕÕ9ÖµîÙâµ•∏µ‹¥¿Åô±ï‡¥ƒà¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒ¿Åç±ÖÕÕ9ÖµîÙâÖπç•ïπ–µ—ï·–Åâ…ïÖ¨µ›Ω…ëÃÅ—ï·–¥—·∞Å±ïÖë•πúµ—•ù°–Å—ï·–µÖπç•ïπ–à¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅÌ›Ω…êπ›Ω…ëÙ(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄΩ¿¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒ¿Åç±ÖÕÕ9ÖµîÙâµ–¥ƒÅ—ï·–µÕ¥Å•—Ö±•åÅ—ï·–µµ’—ïêµôΩ…ïù…Ω’πêà¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅÌïπ—…‰¸π—…ÖπÕ±•—ï…Ö—•Ω∏Ä¸¸ÄâQ…ÖπÕ±•—ï…áüçºÅ•πë•Õ¡ΩªµŸï∞âÙ(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄΩ¿¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÅÌ¡…Ωπ’πç•Ö—•Ω∏ÄòòÄ†(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒ¿Åç±ÖÕÕ9ÖµîÙâµ–¥¿∏‘Å—ï·–µ·ÃÅ—ï·–µµ’—ïêµôΩ…ïù…Ω’πêà¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅA…ΩªÈπç•ÑÅÖ¡…Ω·•µÖëÑËÄÒÕ—…ΩπúÅç±ÖÕÕ9ÖµîÙâ—ï·–µôΩ…ïù…Ω’πêà˘Ì¡…Ωπ’πç•Ö—•ΩπÙΩÕ—…Ωπú¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄΩ¿¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄ•Ù(ÄÄÄÄÄÄÄÄÄÄÄÄΩë•ÿ¯(ÄÄÄÄÄÄÄÄÄÄΩë•ÿ¯((ÄÄÄÄÄÄÄÄÄÄÒë•ÿÅç±ÖÕÕ9ÖµîÙâµ–¥–Åô±ï‡Åô±ï‡µ›…Ö¿Å•—ïµÃµçïπ—ï»ÅùÖ¿¥»à¯(ÄÄÄÄÄÄÄÄÄÄÄÅÌ›Ω…êπÕ—…ΩπúÄòòÄ†(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒÕ¡Ö∏Åç±ÖÕÕ9ÖµîÙâ…Ω’πëïêµô’±∞Åâúµ¡…•µÖ…‰Å¡‡¥ÃÅ¡‰¥ƒÅ—ï·–µlƒ≈¡·tÅôΩπ–µï·—…ÖâΩ±êÅ—ï·–µ¡…•µÖ…‰µôΩ…ïù…Ω’πêà¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅM—…ΩπúÅÌ›Ω…êπÕ—…ΩπùÙ(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄΩÕ¡Ö∏¯(ÄÄÄÄÄÄÄÄÄÄÄÄ•Ù(ÄÄÄÄÄÄÄÄÄÄÄÅÌïπ—…‰¸π¡Ö…—=ôM¡ïïç†ÄòòÄ†(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒÕ¡Ö∏Åç±ÖÕÕ9ÖµîÙâ…Ω’πëïêµô’±∞ÅâΩ…ëï»ÅâΩ…ëï»µâΩ…ëï»ÅâúµÕ’…ôÖçîÅ¡‡¥ÃÅ¡‰¥ƒÅ—ï·–µlƒ≈¡·tÅôΩπ–µÕïµ•âΩ±êÅ—ï·–µµ’—ïêµôΩ…ïù…Ω’πêà¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅÌïπ—…‰π¡Ö…—=ôM¡ïïç°Ù(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄΩÕ¡Ö∏¯(ÄÄÄÄÄÄÄÄÄÄÄÄ•Ù(ÄÄÄÄÄÄÄÄÄÄΩë•ÿ¯((ÄÄÄÄÄÄÄÄÄÄÒâ’——Ω∏(ÄÄÄÄÄÄÄÄÄÄÄÅ—Â¡îÙââ’——Ω∏à(ÄÄÄÄÄÄÄÄÄÄÄÅΩπ±•ç¨ıÌΩπM¡ïÖ≠Ù(ÄÄÄÄÄÄÄÄÄÄÄÅç±ÖÕÕ9ÖµîÙâµ–¥–Å•π±•πîµô±ï‡Åµ•∏µ†¥ƒƒÅ•—ïµÃµçïπ—ï»ÅùÖ¿¥»Å…Ω’πëïê¥…·∞ÅâΩ…ëï»ÅâΩ…ëï»µ¡…•µÖ…‰º»¿Åâúµ¡…•µÖ…‰ºƒ¿Å¡‡¥–Å¡‰¥»Å—ï·–µ·ÃÅôΩπ–µâΩ±êÅ—ï·–µ¡…•µÖ…‰Å—…ÖπÕ•—•Ω∏µçΩ±Ω…ÃÅ°ΩŸï»Èâúµ¡…•µÖ…‰ºƒ‘ÅÖç—•ŸîÈÕçÖ±îµl¿∏‰·tà(ÄÄÄÄÄÄÄÄÄÄ¯(ÄÄÄÄÄÄÄÄÄÄÄÄÒYΩ±’µî»Åç±ÖÕÕ9ÖµîÙâ†¥–Å‹¥–àÄº¯(ÄÄÄÄÄÄÄÄÄÄÄÅ=’Ÿ•»Å¡…ΩªÈπç•Ñ(ÄÄÄÄÄÄÄÄÄÄΩâ’——Ω∏¯(ÄÄÄÄÄÄÄÄΩë•ÿ¯(ÄÄÄÄÄÄΩÕïç—•Ω∏¯((ÄÄÄÄÄÄÒë•ÿÅç±ÖÕÕ9ÖµîÙâÕ¡Öçîµ‰¥‘Å¡‡¥‘Å¡–¥‘à¯(ÄÄÄÄÄÄÄÄÒÕïç—•Ω∏¯(ÄÄÄÄÄÄÄÄÄÄÒ¿Åç±ÖÕÕ9ÖµîÙâ—ï·–µlƒ¡¡·tÅôΩπ–µâΩ±êÅ’¡¡ï…çÖÕîÅ—…Öç≠•πúµl¿∏ƒŸïµtÅ—ï·–µ¡…•µÖ…‰à¯(ÄÄÄÄÄÄÄÄÄÄÄÅÌÕïπÕïÃπ±ïπù—†Ä¯ÄƒÄ¸ÄâMïπ—•ëΩÃÅ¡ΩÕœµŸï•ÃàÄËÄâMïπ—•ëºâÙ(ÄÄÄÄÄÄÄÄÄÄΩ¿¯(ÄÄÄÄÄÄÄÄÄÅÌÕïπÕïÃπ±ïπù—†Ä¯Ä¿Ä¸Ä†(ÄÄÄÄÄÄÄÄÄÄÄÄÒΩ∞Åç±ÖÕÕ9ÖµîÙâµ–¥»ÅÕ¡Öçîµ‰¥»à¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÅÌÕïπÕïÃπµÖ¿†°ÕïπÕî∞Å•πëï‡§ÄÙ¯Ä†(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒ±§(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅ≠ï‰ıÌ•πëï·Ù(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅç±ÖÕÕ9ÖµîÙâô±ï‡ÅùÖ¿¥ÃÅ…Ω’πëïêµl»¡¡·tÅâΩ…ëï»ÅâΩ…ëï»µâΩ…ëï»ºÿ¿ÅâúµÕ’…ôÖçîÅ¿¥Ã∏‘à(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒÕ¡Ö∏Åç±ÖÕÕ9ÖµîÙâô±ï‡Å†¥ÿÅ‹¥ÿÅÕ°…•π¨¥¿Å•—ïµÃµçïπ—ï»Å©’Õ—•ô‰µçïπ—ï»Å…Ω’πëïêµô’±∞Åâúµ¡…•µÖ…‰ºƒ¿Å—ï·–µlƒ≈¡·tÅôΩπ–µï·—…ÖâΩ±êÅ—ï·–µ¡…•µÖ…‰à¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅÌ•πëï‡Ä¨Ä≈Ù(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄΩÕ¡Ö∏¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒ¿Åç±ÖÕÕ9ÖµîÙâ—ï·–µÕ¥ÅôΩπ–µµïë•’¥Å±ïÖë•πúµ…ï±Ö·ïêÅ—ï·–µôΩ…ïù…Ω’πêº‰¿à˘ÌÕïπÕïÙΩ¿¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄΩ±§¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄ§•Ù(ÄÄÄÄÄÄÄÄÄÄÄÄΩΩ∞¯(ÄÄÄÄÄÄÄÄÄÄ§ÄËÄ†(ÄÄÄÄÄÄÄÄÄÄÄÄÒ¿Åç±ÖÕÕ9ÖµîÙâµ–¥»Å—ï·–µÕ¥Å—ï·–µµ’—ïêµôΩ…ïù…Ω’πêà˘ÌU9Y%1	1ÙΩ¿¯(ÄÄÄÄÄÄÄÄÄÄ•Ù(ÄÄÄÄÄÄÄÄΩÕïç—•Ω∏¯((ÄÄÄÄÄÄÄÄÒÕïç—•Ω∏¯(ÄÄÄÄÄÄÄÄÄÄÒ¿Åç±ÖÕÕ9ÖµîÙâ—ï·–µlƒ¡¡·tÅôΩπ–µâΩ±êÅ’¡¡ï…çÖÕîÅ—…Öç≠•πúµl¿∏ƒŸïµtÅ—ï·–µ¡…•µÖ…‰à¯(ÄÄÄÄÄÄÄÄÄÄÄÅUÕºÅπÖÃÅÕç…•—’…ÖÃ(ÄÄÄÄÄÄÄÄÄÄΩ¿¯(ÄÄÄÄÄÄÄÄÄÄÒë•ÿÅç±ÖÕÕ9ÖµîÙâµ–¥»Åù…•êÅù…•êµçΩ±Ã¥ÃÅùÖ¿¥»à¯(ÄÄÄÄÄÄÄÄÄÄÄÅÌÕ—Ö—ÃπµÖ¿†°Õ—Ö–§ÄÙ¯Ä†(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒë•ÿ(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅ≠ï‰ıÌÕ—Ö–π±Öâï±Ù(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅç±ÖÕÕ9ÖµîÙâµ•∏µ‹¥¿Å…Ω’πëïêµlƒ·¡·tÅâΩ…ëï»ÅâΩ…ëï»µâΩ…ëï»ºÿ¿ÅâúµÕ’…ôÖçîÅ¿¥ÃÅ—ï·–µçïπ—ï»à(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒ¿Åç±ÖÕÕ9ÖµîÙââ…ïÖ¨µ›Ω…ëÃÅ—ï·–µ·ÃÅôΩπ–µï·—…ÖâΩ±êÅ±ïÖë•πúµÕπ’úÅ—ï·–µôΩ…ïù…Ω’πêà¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅÌÕ—Ö–πŸÖ±’ïÙ(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄΩ¿¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒ¿Åç±ÖÕÕ9ÖµîÙâµ–¥ƒÅ—ï·–µlÂ¡·tÅôΩπ–µÕïµ•âΩ±êÅ—ï·–µµ’—ïêµôΩ…ïù…Ω’πêà˘ÌÕ—Ö–π±Öâï±ÙΩ¿¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄΩë•ÿ¯(ÄÄÄÄÄÄÄÄÄÄÄÄ§•Ù(ÄÄÄÄÄÄÄÄÄÄΩë•ÿ¯(ÄÄÄÄÄÄÄÄΩÕïç—•Ω∏¯((ÄÄÄÄÄÄÄÅÌïπ—…‰ÄòòÅïπ—…‰π…ï±Ö—ïêπ±ïπù—†Ä¯Ä¿ÄòòÄ†(ÄÄÄÄÄÄÄÄÄÄÒÕïç—•Ω∏¯(ÄÄÄÄÄÄÄÄÄÄÄÄÒ¿Åç±ÖÕÕ9ÖµîÙâ—ï·–µlƒ¡¡·tÅôΩπ–µâΩ±êÅ’¡¡ï…çÖÕîÅ—…Öç≠•πúµl¿∏ƒŸïµtÅ—ï·–µ¡…•µÖ…‰à¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÅAÖ±ÖŸ…ÖÃÅ…ï±Öç•ΩπÖëÖÃ(ÄÄÄÄÄÄÄÄÄÄÄÄΩ¿¯(ÄÄÄÄÄÄÄÄÄÄÄÄÒë•ÿÅç±ÖÕÕ9ÖµîÙâµ–¥»Åô±ï‡Åô±ï‡µ›…Ö¿ÅùÖ¿¥ƒ∏‘à¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÅÌïπ—…‰π…ï±Ö—ïêπµÖ¿†°…ï±Ö—ïëΩëî§ÄÙ¯Ä†(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒÕ¡Ö∏(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅ≠ï‰ıÌ…ï±Ö—ïëΩëïÙ(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅç±ÖÕÕ9ÖµîÙâ…Ω’πëïêµô’±∞ÅâΩ…ëï»ÅâΩ…ëï»µ¡…•µÖ…‰ºƒ‘Åâúµ¡…•µÖ…‰Ωl¿∏¿›tÅ¡‡¥ÃÅ¡‰¥ƒ∏‘Å—ï·–µ·ÃÅôΩπ–µâΩ±êÅ—ï·–µ¡…•µÖ…‰à(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅÌ…ï±Ö—ïëΩëïÙ(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄΩÕ¡Ö∏¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄ§•Ù(ÄÄÄÄÄÄÄÄÄÄÄÄΩë•ÿ¯(ÄÄÄÄÄÄÄÄÄÄΩÕïç—•Ω∏¯(ÄÄÄÄÄÄÄÄ•Ù((ÄÄÄÄÄÄÄÅÌïπ—…‰ÄòòÄ†(ÄÄÄÄÄÄÄÄÄÄÒMΩ’…çï9Ω—î¯(ÄÄÄÄÄÄÄÄÄÄÄÅΩπ—îÅ±ï·•çÖ∞ËÅ	…Ω›∏µ…•Ÿï»µ	…•ùùÃÄºÅQ°ÖÂï»∏ÅΩπÕ’±—îÅºÅçΩπ—ï·—ºÅëºÅŸï…œµç’±ºÅÖπ—ïÃÅëî(ÄÄÄÄÄÄÄÄÄÄÄÅïÕçΩ±°ï»Å’¥ÅÕïπ—•ëº∏(ÄÄÄÄÄÄÄÄÄÄΩMΩ’…çï9Ω—î¯(ÄÄÄÄÄÄÄÄ•Ù(ÄÄÄÄÄÄΩë•ÿ¯(ÄÄÄÄΩë•ÿ¯(ÄÄ§Ï)Ù