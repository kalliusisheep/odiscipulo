import { supabase } from "@/integrations/supabase/client";
import { bookById } from "@/data/bible-books";
import type { AppLanguage } from "@/lib/i18n";
import { normalizeBibleSectionHeading } from "@/lib/bible-heading-normalizer";
import { NVI_SECTION_HEADINGS } from "@/data/nvi-section-headings";

const API = "https://bolls.life";
const REQUEST_TIMEOUT_MS = 15_000;

async function fetchWithTimeout(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

export type BibleTranslation = {
  code: string;
  label: string;
  full: string;
  language: AppLanguage;
  note?: string;
};

export type PtTranslation = BibleTranslation;

/**
 * Traduções públicas servidas pelo Bolls Bible API. As opções em português
 * preservam o catálogo original; WEB e RV1960 ampliam a leitura em inglês e
 * espanhol sem exigir chave ou assinatura.
 */
export const PT_TRANSLATIONS: PtTranslation[] = [
  { code: "NVIPT", label: "NVI", full: "Nova Versão Internacional", language: "pt-BR" },
  { code: "NAA", label: "NAA", full: "Nova Almeida Atualizada", language: "pt-BR" },
  { code: "ARC09", label: "ARC", full: "Almeida Revista e Corrigida", language: "pt-BR" },
  { code: "ACF11", label: "ACF", full: "Almeida Corrigida Fiel", language: "pt-BR" },
  { code: "TB10", label: "TB", full: "Tradução Brasileira", language: "pt-BR" },
  { code: "KJA", label: "KJA", full: "King James Atualizada", language: "pt-BR" },
];

export const BIBLE_TRANSLATIONS: BibleTranslation[] = [
  ...PT_TRANSLATIONS,
  {
    code: "WEB",
    label: "WEB",
    full: "World English Bible",
    language: "en",
    note: "Texto em inglês de uso livre",
  },
  {
    code: "KJV",
    label: "KJV",
    full: "King James Version",
    language: "en",
    note: "Texto em inglês de domínio público",
  },
  {
    code: "RV1960",
    label: "RVR60",
    full: "Reina-Valera 1960",
    language: "es",
    note: "Texto em espanhol servido pela API pública",
  },
];

export const DEFAULT_TRANSLATION = "NVIPT";

export function translationsForLanguage(language: AppLanguage): BibleTranslation[] {
  const available = BIBLE_TRANSLATIONS.filter((translation) => translation.language === language);
  return available.length > 0 ? available : PT_TRANSLATIONS;
}

export function translationByCode(code: string): BibleTranslation {
  return BIBLE_TRANSLATIONS.find((translation) => translation.code === code) ?? PT_TRANSLATIONS[0];
}

export type BibleSectionHeading = {
  verse: number;
  title: string;
};

export type Verse = {
  verse: number;
  text: string;
  heading?: string;
};

const VERIFIED_NVI_SECTION_HEADINGS: Record<string, BibleSectionHeading[]> = {
  "40:5": [
    { verse: 1, title: "As Bem-aventuranças" },
    { verse: 13, title: "O Sal da Terra e a Luz do Mundo" },
  ],
  "43:1": [{ verse: 1, title: "A Palavra Tornou-se Carne" }],
  "44:2": [{ verse: 42, title: "A Comunhão dos Cristãos" }],
  "45:8": [{ verse: 1, title: "A Vida pelo Espírito" }],
  ...NVI_SECTION_HEADINGS,
};

export function sectionHeadingFor(
  translation: string,
  book: number,
  chapter: number,
  verse: number,
): string | undefined {
  if (translation !== "NVIPT") return undefined;
  return VERIFIED_NVI_SECTION_HEADINGS[`${book}:${chapter}`]?.find(
    (heading) => heading.verse === verse,
  )?.title;
}
const FREE_PT_HEADING_TRANSLATIONS = new Set(
  PT_TRANSLATIONS
    .filter((translation) => translation.code !== "NVIPT")
    .map((translation) => translation.code),
);
const FREE_SECTION_HEADINGS_BASE = "/data/bible-section-headings-pt-1911";
type FreeSectionHeading = BibleSectionHeading & { chapter: number };
const freeSectionHeadingsCache = new Map<number, Promise<FreeSectionHeading[]>>();

function loadFreePortugueseSectionHeadings(book: number): Promise<FreeSectionHeading[]> {
  const cachedHeadings = freeSectionHeadingsCache.get(book);
  if (cachedHeadings) return cachedHeadings;

  const request = fetch(`${FREE_SECTION_HEADINGS_BASE}/${String(book).padStart(2, "0")}.json`)
    .then(async (response) => {
      if (!response.ok) return [];
      const data = (await response.json()) as FreeSectionHeading[];
      return Array.isArray(data) ? data : [];
    })
    .catch(() => []);

  freeSectionHeadingsCache.set(book, request);
  return request;
}
export type OriginalWord = { word: string; strong: string | null; index: number };
export type OriginalVerse = { verse: number; words: OriginalWord[] };

const mem = new Map<string, unknown>();

function lsGet<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function lsSet(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota — segue sem cache persistente */
  }
}

async function cached<T>(key: string, loader: () => Promise<T>, persist = true): Promise<T> {
  const hit = mem.get(key);
  if (hit) return hit as T;
  if (persist) {
    const stored = lsGet<T>(key);
    if (stored) {
      mem.set(key, stored);
      return stored;
    }
  }
  const value = await loader();
  mem.set(key, value);
  if (persist) lsSet(key, value);
  return value;
}

function stripTags(html: string): string {
  return html
    .replace(/<S>\d+<\/S>/g, "")
    .replace(/<br\s*\/?>/g, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function assertValidBibleReference(book: number, chapter: number) {
  const meta = bookById(book);
  if (
    !meta ||
    !Number.isInteger(book) ||
    !Number.isInteger(chapter) ||
    chapter < 1 ||
    chapter > meta.chapters
  ) {
    throw new Error("Referência bíblica inválida.");
  }
}

function assertSupportedTranslation(translation: string) {
  if (!BIBLE_TRANSLATIONS.some((item) => item.code === translation)) {
    throw new Error("Tradução bíblica inválida.");
  }
}

/** Capítulo em português. */
export async function fetchChapter(
  translation: string,
  book: number,
  chapter: number,
): Promise<Verse[]> {
  assertSupportedTranslation(translation);
  assertValidBibleReference(book, chapter);

  const [verses, freeHeadings] = await Promise.all([
    cached(`bib:${translation}:${book}:${chapter}`, async () => {
      const res = await fetchWithTimeout(`${API}/get-text/${translation}/${book}/${chapter}/`);
      if (!res.ok) throw new Error("Não foi possível carregar o capítulo.");
      const json = (await res.json()) as unknown;
      if (!Array.isArray(json)) throw new Error("A fonte retornou um capítulo inválido.");

      const parsed = json
        .filter((item): item is { verse: number; text: string } => {
          if (!item || typeof item !== "object") return false;
          const value = item as { verse?: unknown; text?: unknown };
          return Number.isInteger(value.verse) && typeof value.text === "string";
        })
        .map((item) => ({ verse: item.verse, text: stripTags(item.text) }));

      if (parsed.length === 0) throw new Error("A fonte não retornou versículos.");
      return parsed;
    }),
    FREE_PT_HEADING_TRANSLATIONS.has(translation)
      ? loadFreePortugueseSectionHeadings(book)
      : Promise.resolve([] as FreeSectionHeading[]),
  ]);
  const freeHeadingByVerse = new Map(
    freeHeadings
      .filter((heading) => heading.chapter === chapter)
      .map((heading) => [heading.verse, heading.title]),
  );

  return verses.map((verse) => ({
    ...verse,
    heading: normalizeBibleSectionHeading(
      sectionHeadingFor(translation, book, chapter, verse.verse) ??
        freeHeadingByVerse.get(verse.verse),
    ),
  }));
}

export function originalTranslationFor(book: number): { code: string; lang: "grego" | "hebraico" } {
  return book >= 40 ? { code: "TISCH", lang: "grego" } : { code: "WLCa", lang: "hebraico" };
}

function parseOriginal(text: string, prefix: "G" | "H"): OriginalWord[] {
  const tokens = text.split(/\s+/).filter(Boolean);
  return tokens.map((tok, index) => {
    const m = tok.match(/<S>(\d+)<\/S>/);
    return {
      word: tok.replace(/<[^>]+>/g, "").trim(),
      strong: m ? `${prefix}${Number(m[1])}` : null,
      index,
    };
  });
}

/** Capítulo no idioma original, palavra a palavra, com números de Strong. */
export async function fetchOriginalChapter(
  book: number,
  chapter: number,
): Promise<OriginalVerse[]> {
  assertValidBibleReference(book, chapter);
  const { code } = originalTranslationFor(book);
  const prefix = book >= 40 ? "G" : "H";
  return cached(`orig:${code}:${book}:${chapter}`, async () => {
    const res = await fetchWithTimeout(`${API}/get-text/${code}/${book}/${chapter}/`);
    if (!res.ok) throw new Error("Texto original indisponível.");
    const json = (await res.json()) as { verse: number; text: string }[];
    return json.map((v) => ({ verse: v.verse, words: parseOriginal(v.text, prefix) }));
  });
}

export async function fetchOriginalVerse(
  book: number,
  chapter: number,
  verse: number,
): Promise<OriginalWord[] | null> {
  const all = await fetchOriginalChapter(book, chapter);
  return all.find((v) => v.verse === verse)?.words ?? null;
}

export type StrongEntry = {
  code: string;
  original: string | null;
  transliteration: string | null;
  phonetic: string | null;
  partOfSpeech: string | null;
  origin: string | null;
  definitions: string[];
  strongsGloss: string | null;
  /** "Significado" a ser exibido na interface. Para termos da lista curada
   * (CORE_TERMS) é a tradução conferida manualmente. Para os demais, combina
   * o 1º e o 2º sentido do léxico (quando o 2º for curto) em vez de trazer
   * só um sentido isolado. */
  meaning: string | null;
  related: string[];
  /** true quando o verbete veio da lista curada manualmente (CORE_TERMS),
   * ou seja, não depende da heurística de leitura do HTML da fonte. */
  curated: boolean;
  translationSource?: "curated" | "local" | "ai" | "source";
  /** Um único sentido selecionado para a ocorrência deste versículo. */
  contextualMeaning?: string | null;
};

export type LexiconContext = {
  book: number;
  chapter: number;
  verse: number;
  verseText: string | null;
  originalWords?: OriginalWord[];
  wordIndex?: number | null;
  word?: string | null;
};

/**
 * Alinhamentos contextuais revisados manualmente para ocorrências sensíveis.
 * H853 é uma partícula acusativa: não deve receber uma tradução lexical
 * inventada nem aparecer como se fosse uma palavra independente em português.
 */
const VERIFIED_CONTEXTUAL_MEANINGS: Record<string, string> = {
  "1:1:1:H7225": "No princípio",
  "1:1:1:H1254": "criou",
  "1:1:1:H430": "Deus",
  "1:1:1:H8064": "os céus",
  "1:1:1:H776": "a terra",
  "1:1:2:H776": "a terra",
  "1:1:2:H1961": "era",
  "1:1:2:H8415": "sem forma",
  "1:1:2:H922": "vazia",
  "1:1:2:H2822": "trevas",
  "1:1:2:H6440": "face",
  "1:1:2:H7307": "Espírito",
  "1:1:2:H4325": "águas",
  "1:1:2:H5921": "sobre",
  "1:1:2:H7363": "pairava",
};

/** Sentidos específicos quando a mesma partícula aparece mais de uma vez na ocorrência. */
const VERIFIED_CONTEXTUAL_OCCURRENCES: Record<string, string> = {
  "1:1:1:3:H853": "objeto direto: os céus",
  "1:1:1:5:H853": "objeto direto: a terra",
};

const CONTEXTUAL_STRONG_FALLBACKS: Record<string, string> = {
  H5921: "sobre",
  H8414: "sem forma",
  H8415: "sem forma",
  H7307: "Espírito",
  H7363: "pairava",
  H430: "Deus",
  H2822: "trevas",
  H6440: "face",
  H4325: "águas",
  H8064: "os céus",
  H776: "a terra",
  H1961: "era",
  H1254: "criou",
  H7225: "No princípio",
  H853: "marca o objeto direto",
  G2532: "e",
  G3588: "o",
  G2316: "Deus",
  G2962: "Senhor",
  G2424: "Jesus",
  G5547: "Cristo",
  G4151: "Espírito",
  G3056: "Palavra",
  G26: "amor",
  G5485: "graça",
  G4102: "fé",
  G4991: "salvação",
};

function contextualFallbackFromEntry(
  code: string | null,
  entry: StrongEntry | null | undefined,
): string {
  if (code && CONTEXTUAL_STRONG_FALLBACKS[code]) {
    return CONTEXTUAL_STRONG_FALLBACKS[code];
  }

  const candidates = [
    entry?.meaning,
    entry?.strongsGloss,
    ...(entry?.definitions ?? []),
  ];
  for (const candidate of candidates) {
    const concise = concisePortugueseMeaning(candidate);
    if (concise && !containsEnglishLexicon(concise)) {
      const beforeExplanation = concise.split(/\s+[—–-]\s+/)[0]?.trim() ?? concise;
      const firstMeaning = beforeExplanation.split(/[,;:]/)[0]?.trim() ?? beforeExplanation;
      if (firstMeaning.length > 0) return firstMeaning;
    }
  }

  return "sentido determinado pelo contexto";
}

function concisePortugueseMeaning(value: string | null | undefined): string | null {
  if (!value) return null;
  const first = value
    .split(/\s*;\s*/)[0]
    .replace(/\s+/g, " ")
    .trim();
  return first || null;
}

/**
 * Retorna apenas um significado contextual em português. Quando a tradução
 * contextual ainda não chegou ou a fonte deixou inglês residual, não exibe
 * um glossário genérico como se fosse a tradução daquele versículo.
 */
export function contextualMeaningFor(
  book: number,
  chapter: number,
  verse: number,
  index: number,
  word: OriginalWord | null | undefined,
  entry: StrongEntry | null | undefined,
): string {
  const code = entry?.code ?? word?.strong ?? null;
  const occurrenceKey = code
    ? book + ":" + chapter + ":" + verse + ":" + index + ":" + code
    : null;
  const occurrenceMeaning = occurrenceKey
    ? VERIFIED_CONTEXTUAL_OCCURRENCES[occurrenceKey]
    : null;
  if (occurrenceMeaning) return occurrenceMeaning;

  // אֵת (H853) exerce função gramatical no hebraico bíblico; no português,
  // a forma correta de apresentar seu valor é explicar a função na frase.
  // Isso evita exibir um rótulo vazio ou sugerir uma tradução lexical inexistente.
  if (code === "H853") return CONTEXTUAL_STRONG_FALLBACKS.H853;

  const verified = code
    ? VERIFIED_CONTEXTUAL_MEANINGS[book + ":" + chapter + ":" + verse + ":" + code]
    : null;
  if (verified) return verified;

  const contextual = concisePortugueseMeaning(entry?.contextualMeaning);
  if (
    contextual &&
    !containsEnglishLexicon(contextual) &&
    !/sem tradução isolada|sentido contextual indisponível|informação indisponível/i.test(contextual)
  ) {
    return contextual;
  }

  return contextualFallbackFromEntry(code, entry);
}

/**
 * Traduz os termos gramaticais recorrentes que vêm em inglês na fonte
 * acadêmica (Brown-Driver-Briggs / Thayer, via bolls.life) para português.
 * Cobre o vocabulário fixo de classificação gramatical — não é uma tradução
 * livre do texto do léxico (que permanece na fonte original em inglês,
 * já que não há uma base acadêmica equivalente em português).
 */
const GRAMMAR_TERMS: [RegExp, string][] = [
  [/\bMasculine\b/gi, "Masculino"],
  [/\bFeminine\b/gi, "Feminino"],
  [/\bCommon\b/gi, "Comum"],
  [/\bProper\b/gi, "Próprio"],
  [/\bNoun\b/gi, "Substantivo"],
  [/\bVerb\b/gi, "Verbo"],
  [/\bAdjective\b/gi, "Adjetivo"],
  [/\bAdverb\b/gi, "Advérbio"],
  [/\bPronoun\b/gi, "Pronome"],
  [/\bPreposition\b/gi, "Preposição"],
  [/\bConjunction\b/gi, "Conjunção"],
  [/\bInterjection\b/gi, "Interjeição"],
  [/\bParticle\b/gi, "Partícula"],
  [/\bArticle\b/gi, "Artigo"],
  [/\bDefinite\b/gi, "Definido"],
  [/\bIndefinite\b/gi, "Indefinido"],
  [/\bDemonstrative\b/gi, "Demonstrativo"],
  [/\bPersonal\b/gi, "Pessoal"],
  [/\bRelative\b/gi, "Relativo"],
  [/\bInterrogative\b/gi, "Interrogativo"],
  [/\bReflexive\b/gi, "Reflexivo"],
  [/\bPossessive\b/gi, "Possessivo"],
  [/\bNumeral\b/gi, "Numeral"],
  [/\bCardinal\b/gi, "Cardinal"],
  [/\bOrdinal\b/gi, "Ordinal"],
  [/\bParticiple\b/gi, "Particípio"],
  [/\bPassive\b/gi, "Passivo"],
  [/\bActive\b/gi, "Ativo"],
  [/\bPlural\b/gi, "Plural"],
  [/\bSingular\b/gi, "Singular"],
  [/\bfrom\b/gi, "de"],
  [/\ba primitive root\b/gi, "uma raiz primitiva"],
  [/\bprimitive root\b/gi, "raiz primitiva"],
  [/\bof uncertain derivation\b/gi, "de derivação incerta"],
  [/\bcontracted from\b/gi, "contraído de"],
];

export function translateGrammarTerms(text: string | null): string | null {
  if (!text) return text;
  let out = text;
  for (const [re, pt] of GRAMMAR_TERMS) out = out.replace(re, pt);
  return out;
}

// ---------------------------------------------------------------------------
// Lista curada de termos hebraicos e gregos teologicamente centrais.
//
// Para estas ~45 palavras a tradução, a classe gramatical e o "Significado"
// exibido na interface NÃO dependem da extração heurística do HTML da fonte
// (bolls.life / BDBT) — foram conferidos manualmente e o resultado é sempre
// o mesmo, independentemente de qualquer mudança de formatação da fonte.
// Isso corrige especificamente casos como Elohim (H430), em que a extração
// automática podia trazer um sentido secundário como se fosse o principal.
//
// Para acrescentar um novo termo à lista curada, basta adicionar uma entrada
// aqui usando o código de Strong (ex.: "H430", "G5547") como chave.
// ---------------------------------------------------------------------------

type CoreTermOverride = {
  /** Palavra no idioma original (hebraico ou grego). */
  original: string;
  transliteration: string;
  phonetic?: string;
  partOfSpeech?: string;
  /** "Significado" — sentido principal, conferido manualmente. */
  meaning: string;
  /** Sentidos adicionais (1º = igual a `meaning`, 2º em diante = secundários). */
  definitions?: string[];
};

const CORE_TERMS: Record<string, CoreTermOverride> = {
  // --- Hebraico (Antigo Testamento) ---------------------------------------
  H430: {
    original: "אֱלֹהִים",
    transliteration: "Elohim",
    phonetic: "el-o-heem'",
    partOfSpeech: "Substantivo masculino, forma plural",
    meaning:
      "Deus — o único Deus verdadeiro de Israel, tratado gramaticalmente como plural (plural de majestade/plenitude), mas concordando no singular quando se refere a Ele",
    definitions: [
      "Deus, o único Deus verdadeiro de Israel (uso predominante no Antigo Testamento, com concordância verbal no singular)",
      "deuses ou divindades pagãs; juízes, governantes ou seres angelicais/divinos (usos secundários e dependentes do contexto)",
    ],
  },
  H3068: {
    original: "יהוה",
    transliteration: "YHWH (Javé/Jeová)",
    phonetic: "yeh-ho-vaw'",
    partOfSpeech: "Nome próprio",
    meaning:
      'SENHOR — o nome pessoal e próprio de Deus, revelado a Israel (Êx 3.14-15); geralmente vertido como "SENHOR" em versalete nas traduções em português',
    definitions: [
      'SENHOR — o nome próprio e pessoal do Deus de Israel, ligado ao verbo "ser/existir" (Êx 3.14)',
      'forma reverencial: por tradição judaica, lido em voz alta como "Adonai" para evitar pronunciar o Nome diretamente',
    ],
  },
  H136: {
    original: "אֲדֹנָי",
    transliteration: "Adonai",
    phonetic: "ad-o-noy'",
    partOfSpeech: "Substantivo masculino, forma plural (uso como título)",
    meaning:
      "Senhor, Soberano — título de domínio e autoridade, usado como forma de tratamento para Deus",
    definitions: [
      "Senhor, Soberano — título de autoridade e domínio aplicado a Deus",
      "senhor, dono, superior — usado também para autoridades humanas (uso secundário)",
    ],
  },
  H7307: {
    original: "רוּחַ",
    transliteration: "Ruach",
    phonetic: "roo'-akh",
    partOfSpeech: "Substantivo comum (masculino/feminino)",
    meaning:
      "Espírito, vento, fôlego — o sopro vital; usado para o Espírito de Deus, o espírito humano e o vento",
    definitions: [
      "espírito — o Espírito de Deus, ou o espírito/fôlego de vida no ser humano",
      "vento, sopro — movimento de ar (uso literal, frequente em contextos não teológicos)",
    ],
  },
  H2617: {
    original: "חֶסֶד",
    transliteration: "Chesed",
    phonetic: "kheh'-sed",
    partOfSpeech: "Substantivo masculino",
    meaning:
      "Benignidade aliançeira, misericórdia leal — o amor fiel de Deus que sustenta a aliança com o Seu povo",
    definitions: [
      "benignidade, bondade leal e fiel — especialmente a fidelidade de Deus à Sua aliança",
      "misericórdia, favor — bondade demonstrada entre pessoas, dentro de um vínculo de lealdade",
    ],
  },
  H6918: {
    original: "קָדוֹשׁ",
    transliteration: "Qadosh",
    phonetic: "kaw-doshe'",
    partOfSpeech: "Adjetivo",
    meaning: "Santo — separado, consagrado; atributo central de Deus e do que Lhe é dedicado",
    definitions: [
      "santo — separado para Deus, consagrado, moralmente puro",
      "sagrado — aquilo que pertence à esfera do culto e não pode ser tratado como comum",
    ],
  },
  H1285: {
    original: "בְּרִית",
    transliteration: "Berith",
    phonetic: "ber-eeth'",
    partOfSpeech: "Substantivo feminino",
    meaning:
      "Aliança, pacto — compromisso solene, geralmente selado por juramento ou sinal, entre Deus e o Seu povo (ou entre pessoas)",
    definitions: [
      "aliança, pacto — compromisso solene entre Deus e o Seu povo",
      "acordo, tratado — pacto formal entre pessoas ou nações (uso secundário)",
    ],
  },
  H3444: {
    original: "יְשׁוּעָה",
    transliteration: "Yeshuah",
    phonetic: "yesh-oo'-aw",
    partOfSpeech: "Substantivo feminino",
    meaning: "Salvação, livramento — libertação operada por Deus, física ou espiritual",
    definitions: [
      "salvação — livramento operado por Deus, com sentido espiritual",
      "livramento, vitória — libertação de perigo físico ou inimigos (uso concreto)",
    ],
  },
  H8451: {
    original: "תּוֹרָה",
    transliteration: "Torah",
    phonetic: "to-raw'",
    partOfSpeech: "Substantivo feminino",
    meaning:
      "Lei, instrução — o ensino divino; refere-se tanto à Lei de Moisés quanto à instrução em sentido amplo",
    definitions: [
      "lei — a Lei de Moisés, o corpo de mandamentos dados por Deus a Israel",
      "instrução, ensino — orientação ou direção dada (uso mais amplo, não exclusivamente legal)",
    ],
  },
  H6664: {
    original: "צֶדֶק",
    transliteration: "Tsedeq",
    phonetic: "tseh'-dek",
    partOfSpeech: "Substantivo masculino",
    meaning: "Justiça, retidão — conformidade com o padrão reto de Deus",
    definitions: [
      "justiça, retidão — o que é correto segundo o padrão de Deus",
      "equidade — justiça aplicada em juízo ou nas relações humanas (uso secundário)",
    ],
  },
  H4899: {
    original: "מָשִׁיחַ",
    transliteration: "Mashiach",
    phonetic: "maw-shee'-akh",
    partOfSpeech: "Substantivo masculino",
    meaning:
      "Ungido, Messias — aquele consagrado por unção; título messiânico do libertador prometido",
    definitions: [
      "ungido — pessoa consagrada por unção com óleo (rei, sacerdote ou profeta)",
      "Messias — o Ungido prometido, o libertador escatológico (sentido que se desenvolve ao longo do AT)",
    ],
  },
  H3820: {
    original: "לֵב",
    transliteration: "Lev",
    phonetic: "labe",
    partOfSpeech: "Substantivo masculino",
    meaning:
      "Coração — sede da mente, da vontade e das emoções (não apenas do sentimento, como em português)",
    definitions: [
      "coração — sede da mente, vontade, intenção e emoção",
      "interior, âmago — o centro íntimo da pessoa (uso figurado mais amplo)",
    ],
  },
  H5315: {
    original: "נֶפֶשׁ",
    transliteration: "Nephesh",
    phonetic: "neh'-fesh",
    partOfSpeech: "Substantivo feminino",
    meaning:
      "Alma, ser vivo — a pessoa viva como um todo (corpo e vida), não uma alma imaterial separada do corpo",
    definitions: [
      "alma, ser vivo — a pessoa como um todo animado pelo fôlego de vida",
      "vida, apetite, desejo — usado também para a vida física ou para desejos/apetites (usos secundários)",
    ],
  },
  H1004: {
    original: "בַּיִת",
    transliteration: "Bayith",
    phonetic: "bah'-yith",
    partOfSpeech: "Substantivo masculino",
    meaning: "Casa — a habitação; por extensão, família, linhagem ou dinastia",
    definitions: [
      "casa — a construção onde se habita",
      'família, casa (linhagem) — descendência ou dinastia (uso figurado, ex.: "casa de Davi")',
    ],
  },
  H776: {
    original: "אֶרֶץ",
    transliteration: "Erets",
    phonetic: "eh'-rets",
    partOfSpeech: "Substantivo feminino",
    meaning: "Terra — o planeta, o solo, ou um território/país específico, conforme o contexto",
    definitions: [
      "terra — o mundo, o solo, a superfície terrestre",
      'país, território — uma região ou nação específica (ex.: "terra de Canaã")',
    ],
  },
  H1288: {
    original: "בָּרַךְ",
    transliteration: "Barak",
    phonetic: "baw-rak'",
    partOfSpeech: "Verbo",
    meaning:
      "Abençoar — invocar o favor de Deus sobre alguém; também usado no sentido de louvar a Deus",
    definitions: [
      "abençoar — invocar ou conceder favor e bem sobre alguém",
      "louvar, bendizer — ajoelhar-se diante de Deus em adoração (uso relacionado)",
    ],
  },
  H2403: {
    original: "חַטָּאת",
    transliteration: "Chatta'ah",
    phonetic: "khat-taw-aw'",
    partOfSpeech: "Substantivo feminino",
    meaning: "Pecado — falta, transgressão; também designa a oferta ritual pelo pecado",
    definitions: [
      "pecado — transgressão, falta, culpa diante de Deus",
      "oferta pelo pecado — o sacrifício ritual prescrito para expiação (uso técnico-cultual)",
    ],
  },
  H1697: {
    original: "דָּבָר",
    transliteration: "Dabar",
    phonetic: "daw-baw'",
    partOfSpeech: "Substantivo masculino",
    meaning: "Palavra, coisa — a palavra falada; por extensão, um assunto, coisa ou acontecimento",
    definitions: [
      "palavra — o que é dito ou declarado, inclusive a palavra de Deus",
      "coisa, assunto, acontecimento — uso mais amplo, não restrito à fala (uso secundário)",
    ],
  },
  H8064: {
    original: "שָׁמַיִם",
    transliteration: "Shamayim",
    phonetic: "shaw-mah'-yim",
    partOfSpeech: "Substantivo masculino, forma plural",
    meaning: "Céus — o firmamento visível e, por extensão, a morada de Deus",
    definitions: [
      "céus — o firmamento, a abóbada celeste visível",
      "céu (morada de Deus) — o lugar habitado por Deus, em sentido teológico (uso secundário)",
    ],
  },
  H3117: {
    original: "יוֹם",
    transliteration: "Yom",
    phonetic: "yome",
    partOfSpeech: "Substantivo masculino",
    meaning:
      "Dia — período de 24 horas, o período de luz, ou um tempo/época em sentido mais amplo, conforme o contexto",
    definitions: [
      "dia — período de vinte e quatro horas, ou o período de luz do dia",
      'tempo, época — período indefinido ou momento específico (ex.: "o Dia do SENHOR")',
    ],
  },

  // --- Grego (Novo Testamento) ---------------------------------------------
  G2316: {
    original: "θεός",
    transliteration: "Theos",
    phonetic: "theh'-os",
    partOfSpeech: "Substantivo masculino",
    meaning:
      "Deus — a Divindade suprema; no Novo Testamento, usado tanto para o Pai como, em contextos específicos, para Cristo",
    definitions: [
      "Deus — a Divindade suprema, o único Deus verdadeiro",
      "deus, divindade — usado também, em sentido secundário, para falsas divindades pagãs",
    ],
  },
  G2962: {
    original: "κύριος",
    transliteration: "Kyrios",
    phonetic: "koo'-ree-os",
    partOfSpeech: "Substantivo masculino",
    meaning:
      "Senhor — título de autoridade e domínio; no NT, aplicado a Deus e, centralmente, a Jesus Cristo",
    definitions: [
      "Senhor — título de soberania aplicado a Deus e a Jesus Cristo",
      "senhor, dono, mestre — forma de tratamento respeitoso usada também para pessoas (uso secundário)",
    ],
  },
  G5547: {
    original: "Χριστός",
    transliteration: "Christos",
    phonetic: "khris-tos'",
    partOfSpeech: "Substantivo masculino (nome/título)",
    meaning:
      "Cristo, Ungido — tradução grega do hebraico Mashiach (Messias); título de Jesus como o Ungido de Deus",
    definitions: [
      "Cristo, Ungido — o Messias prometido, título central de Jesus no Novo Testamento",
      'usado também como parte do nome próprio "Jesus Cristo" (uso onomástico)',
    ],
  },
  G2424: {
    original: "Ἰησοῦς",
    transliteration: "Iesous",
    phonetic: "ee-ay-sooce'",
    partOfSpeech: "Substantivo masculino (nome próprio)",
    meaning:
      'Jesus — forma grega do nome hebraico Yeshua ("o SENHOR salva"); nome próprio do Filho de Deus',
    definitions: [
      "Jesus — nome próprio do Filho de Deus, forma grega de Yeshua/Josué",
      "usado também, poucas vezes, para outras pessoas de nome Josué/Jesus no NT (uso secundário e raro)",
    ],
  },
  G4151: {
    original: "πνεῦμα",
    transliteration: "Pneuma",
    phonetic: "pnyoo'-mah",
    partOfSpeech: "Substantivo neutro",
    meaning: "Espírito — o Espírito Santo, o espírito humano, ou vento/fôlego, conforme o contexto",
    definitions: [
      "espírito — o Espírito Santo de Deus, ou o espírito humano (imaterial)",
      "vento, fôlego, sopro — sentido literal, mais raro no NT (uso secundário)",
    ],
  },
  G3056: {
    original: "λόγος",
    transliteration: "Logos",
    phonetic: "log'-os",
    partOfSpeech: "Substantivo masculino",
    meaning:
      "Palavra, Verbo — a palavra falada ou a mensagem; em João 1, título de Cristo como a Palavra eterna de Deus",
    definitions: [
      "palavra, mensagem, discurso — aquilo que é dito ou comunicado",
      "Verbo (Logos) — título cristológico de Jesus como a expressão eterna de Deus (Jo 1.1, uso teológico específico)",
    ],
  },
  G26: {
    original: "ἀγάπη",
    transliteration: "Agape",
    phonetic: "ag-ah'-pay",
    partOfSpeech: "Substantivo feminino",
    meaning:
      "Amor — o amor de doação e benevolência, característico do amor de Deus e do amor cristão",
    definitions: [
      "amor — afeição benevolente e sacrificial, especialmente o amor de Deus",
      "amor fraternal — o amor demonstrado entre os cristãos (uso relacional secundário)",
    ],
  },
  G5485: {
    original: "χάρις",
    transliteration: "Charis",
    phonetic: "khar'-ece",
    partOfSpeech: "Substantivo feminino",
    meaning: "Graça — favor imerecido; a benevolência gratuita de Deus para com o ser humano",
    definitions: [
      "graça — favor gratuito e imerecido de Deus",
      'graciosidade, agrado — qualidade que desperta favor; também usado como "agradecimento" (usos secundários)',
    ],
  },
  G4102: {
    original: "πίστις",
    transliteration: "Pistis",
    phonetic: "pis'-tis",
    partOfSpeech: "Substantivo feminino",
    meaning: "Fé — confiança e convicção; a fé que confia em Deus e em Cristo",
    definitions: [
      "fé — confiança, convicção e adesão pessoal a Deus/Cristo",
      "fidelidade — qualidade de ser fiel e confiável (uso secundário, aplicado a pessoas)",
    ],
  },
  G1391: {
    original: "δόξα",
    transliteration: "Doxa",
    phonetic: "dox'-ah",
    partOfSpeech: "Substantivo feminino",
    meaning: "Glória — esplendor, majestade e honra, sobretudo a glória própria de Deus",
    definitions: [
      "glória — esplendor e majestade, especialmente de Deus",
      "honra, louvor, reputação — reconhecimento público de valor (uso secundário)",
    ],
  },
  G1577: {
    original: "ἐκκλησία",
    transliteration: "Ekklesia",
    phonetic: "ek-klay-see'-ah",
    partOfSpeech: "Substantivo feminino",
    meaning:
      "Igreja, assembleia — a comunidade dos convocados por Deus; a Igreja local ou universal",
    definitions: [
      "igreja — a comunidade dos crentes convocados por Deus, local ou universal",
      "assembleia — reunião ou ajuntamento de pessoas em sentido geral, não necessariamente religioso (uso secundário)",
    ],
  },
  G4990: {
    original: "σωτήρ",
    transliteration: "Soter",
    phonetic: "so-tare'",
    partOfSpeech: "Substantivo masculino",
    meaning: "Salvador — aquele que salva; título de Deus e de Jesus Cristo",
    definitions: [
      "Salvador — título de Deus e de Jesus Cristo como aquele que salva",
      "libertador — usado também, em sentido mais amplo, para quem livra de perigo (uso secundário)",
    ],
  },
  G4991: {
    original: "σωτηρία",
    transliteration: "Soteria",
    phonetic: "so-tay-ree'-ah",
    partOfSpeech: "Substantivo feminino",
    meaning:
      "Salvação — o livramento operado por Deus por meio de Cristo, do pecado e de suas consequências",
    definitions: [
      "salvação — o livramento espiritual e eterno operado por Deus em Cristo",
      "livramento, preservação — libertação de perigo ou dano físico (uso concreto secundário)",
    ],
  },
  G266: {
    original: "ἁμαρτία",
    transliteration: "Hamartia",
    phonetic: "ham-ar-tee'-ah",
    partOfSpeech: "Substantivo feminino",
    meaning: 'Pecado — literalmente "errar o alvo"; transgressão da vontade de Deus',
    definitions: [
      "pecado — transgressão ou falta em relação à vontade de Deus",
      'erro, falta — sentido mais literal de "errar o alvo" (uso etimológico)',
    ],
  },
  G1343: {
    original: "δικαιοσύνη",
    transliteration: "Dikaiosyne",
    phonetic: "dik-ah-yos-oo'-nay",
    partOfSpeech: "Substantivo feminino",
    meaning:
      "Justiça — retidão diante de Deus; no NT, também a justiça que vem de Deus pela fé em Cristo",
    definitions: [
      "justiça — retidão de caráter e de conduta diante de Deus",
      "justificação — o estado de ser declarado justo por Deus mediante a fé (uso teológico paulino)",
    ],
  },
  G3670: {
    original: "ὁμολογέω",
    transliteration: "Homologeo",
    phonetic: "hom-ol-og-eh'-o",
    partOfSpeech: "Verbo",
    meaning:
      "Confessar — declarar publicamente e de acordo com a verdade; confessar a fé em Cristo",
    definitions: [
      "confessar — declarar publicamente a fé ou a verdade sobre algo",
      "reconhecer, admitir — concordar publicamente com um fato (uso mais geral)",
    ],
  },
  G3341: {
    original: "μετάνοια",
    transliteration: "Metanoia",
    phonetic: "met-an'-oy-ah",
    partOfSpeech: "Substantivo feminino",
    meaning:
      "Arrependimento — mudança de mente e de rumo de vida, afastando-se do pecado e voltando-se para Deus",
    definitions: [
      "arrependimento — mudança interior de mente e de direção de vida diante de Deus",
      "mudança de pensamento — sentido etimológico mais amplo, não restrito ao contexto religioso",
    ],
  },
  G907: {
    original: "βαπτίζω",
    transliteration: "Baptizo",
    phonetic: "bap-tid'-zo",
    partOfSpeech: "Verbo",
    meaning: "Batizar — imergir; o rito cristão do batismo",
    definitions: [
      "batizar — realizar o rito do batismo por imersão",
      "imergir, mergulhar — sentido literal de mergulhar em água (uso etimológico)",
    ],
  },
  G1242: {
    original: "διαθήκη",
    transliteration: "Diatheke",
    phonetic: "dee-ath-ay'-kay",
    partOfSpeech: "Substantivo feminino",
    meaning:
      "Aliança, testamento — pacto solene; no NT, especialmente a nova aliança selada por Cristo",
    definitions: [
      "aliança, pacto — compromisso solene entre Deus e o Seu povo",
      "testamento — disposição de última vontade (sentido jurídico grego, uso secundário)",
    ],
  },
  G2222: {
    original: "ζωή",
    transliteration: "Zoe",
    phonetic: "dzo-ay'",
    partOfSpeech: "Substantivo feminino",
    meaning: "Vida — a vida em sentido pleno; no NT, especialmente a vida eterna dada por Deus",
    definitions: [
      "vida — existência física; no NT, especialmente a vida eterna e plena dada por Deus",
      "sustento, modo de viver — sentido mais concreto e cotidiano (uso secundário)",
    ],
  },
  G2889: {
    original: "κόσμος",
    transliteration: "Kosmos",
    phonetic: "kos'-mos",
    partOfSpeech: "Substantivo masculino",
    meaning:
      "Mundo — a ordem criada, a humanidade, ou o sistema de valores opostos a Deus, conforme o contexto",
    definitions: [
      "mundo — a criação, a humanidade ou a ordem mundial",
      'ornamento, arranjo — sentido original de "ordem/beleza" (uso etimológico secundário)',
    ],
  },
  G40: {
    original: "ἅγιος",
    transliteration: "Hagios",
    phonetic: "hag'-ee-os",
    partOfSpeech: "Adjetivo",
    meaning:
      "Santo — separado para Deus, puro; usado para o Espírito Santo, para Deus e para os crentes",
    definitions: [
      "santo — separado para Deus, consagrado, moralmente puro",
      "santos (substantivado) — os crentes, o povo consagrado de Deus (uso substantivado comum no NT)",
    ],
  },
  G32: {
    original: "ἄγγελος",
    transliteration: "Angelos",
    phonetic: "ang'-el-os",
    partOfSpeech: "Substantivo masculino",
    meaning:
      "Anjo, mensageiro — ser espiritual enviado por Deus; também usado para mensageiros humanos",
    definitions: [
      "anjo — ser espiritual celestial enviado por Deus como mensageiro",
      "mensageiro — pessoa humana enviada com uma mensagem (uso secundário, mais raro)",
    ],
  },
  G652: {
    original: "ἀπόστολος",
    transliteration: "Apostolos",
    phonetic: "ap-os'-tol-os",
    partOfSpeech: "Substantivo masculino",
    meaning:
      "Apóstolo — enviado com autoridade; título dos Doze e de outros enviados diretamente por Cristo",
    definitions: [
      "apóstolo — enviado com autoridade por Cristo, título dos Doze e de outros como Paulo",
      'enviado, mensageiro — sentido mais geral de "aquele que é enviado" (uso etimológico secundário)',
    ],
  },
  G1411: {
    original: "δύναμις",
    transliteration: "Dynamis",
    phonetic: "doo'-nam-is",
    partOfSpeech: "Substantivo feminino",
    meaning: "Poder — capacidade e força; frequentemente o poder de Deus manifesto em milagres",
    definitions: [
      "poder, força — capacidade de realizar, especialmente o poder de Deus",
      "milagre, obra poderosa — manifestação concreta desse poder (uso concreto no NT)",
    ],
  },
};

function grab(html: string, label: string): string | null {
  const re = new RegExp(`-\\s*${label}:\\s*(?:<b>)?(.*?)(?:</b>)?\\s*<p`, "i");
  const m = html.match(re);
  const value = m ? stripTags(m[1]) : "";
  return value || null;
}

/** Formato de cada item devolvido por /dictionary-definition/BDBT/<code>/
 * (ver documentação oficial da bolls.life). Além do HTML livre em
 * `definition`, a API já devolve campos estruturados e confiáveis —
 * `lexeme`, `transliteration`, `pronunciation`, `short_definition` — que
 * NÃO dependem de a formatação do HTML seguir um padrão de rótulos. */
type BollsDictHit = {
  topic: string;
  definition: string;
  lexeme?: string | null;
  transliteration?: string | null;
  pronunciation?: string | null;
  short_definition?: string | null;
};

type LocalLexiconHit = {
  o?: string;
  t?: string;
  p?: string;
  g?: string;
  e?: string;
  d?: string[];
  r?: string[];
};

const localLexiconBuckets = new Map<string, Record<string, LocalLexiconHit>>();

async function fetchLocalLexiconEntry(code: string): Promise<LocalLexiconHit | null> {
  const match = code.match(/^([GH])(\d+)$/i);
  if (!match) return null;

  const bucket = match[1].toUpperCase() + Math.floor(Number(match[2]) / 100);
  let entries = localLexiconBuckets.get(bucket);
  if (!entries) {
    try {
      const response = await fetch("/data/lexicon-pt/" + bucket + ".json");
      if (!response.ok) return null;
      entries = (await response.json()) as Record<string, LocalLexiconHit>;
      localLexiconBuckets.set(bucket, entries);
    } catch {
      return null;
    }
  }

  return entries[code.toUpperCase()] ?? entries[code] ?? null;
}

const LOCAL_LEXICON_FIXES: [RegExp, string][] = [
  [/Latchet/gi, "Correia"],
  [/Bough/gi, "Ramo"],
  [/Jordan/gi, "Jordão"],
  [/Jeremiah/gi, "Jeremias"],
  [/Isaiah/gi, "Isaías"],
  [/Ephraim/gi, "Efraim"],
  [/Shadrach/gi, "Sadraque"],
  [/Jericho/gi, "Jericó"],
  [/Joppa/gi, "Jope"],
  [/Sodom/gi, "Sodoma"],
  [/Gomorrah/gi, "Gomorra"],
  [/Bethlehem/gi, "Belém"],
  [/Jerusalem/gi, "Jerusalém"],
  [/Galilee/gi, "Galileia"],
  [/Samaria/gi, "Samaria"],
  [/primitive root/gi, "raiz primitiva"],
  [/uncertain derivation/gi, "derivação incerta"],
  [/proper noun/gi, "nome próprio"],
  [/place noun/gi, "nome de lugar"],
  [/masculine noun/gi, "substantivo masculino"],
  [/feminine noun/gi, "substantivo feminino"],
  [/neuter noun/gi, "substantivo neutro"],
  [/same as/gi, "o mesmo que"],
  [/probably/gi, "provavelmente"],
  [/perhaps/gi, "talvez"],
];

function translateLocalLexiconText(text: string | null | undefined): string | null {
  if (!text) return null;
  let translated = translateGrammarTerms(text) ?? text;
  for (const [pattern, replacement] of LOCAL_LEXICON_FIXES) {
    translated = translated.replace(pattern, replacement);
  }
  return translated.trim() || null;
}

const ENGLISH_LEXICON_MARKERS =
  /\b(?:part(?:s)? of speech|primitive root|proper noun|place noun|masculine|feminine|neuter|a root|from the|of the|to be|to do|the place|the name|used of|denotes the)\b/i;

function containsEnglishLexicon(text: string | null | undefined): boolean {
  return Boolean(text && ENGLISH_LEXICON_MARKERS.test(text));
}

function entryNeedsTranslation(entry: StrongEntry): boolean {
  return [
    entry.partOfSpeech,
    entry.origin,
    entry.meaning,
    entry.strongsGloss,
    ...entry.definitions,
  ].some(containsEnglishLexicon);
}

function buildLocalStrongEntry(
  base: StrongEntry,
  local: LocalLexiconHit,
): StrongEntry {
  const definitions = (local.d ?? [])
    .map((definition) => translateLocalLexiconText(definition))
    .filter((definition): definition is string => Boolean(definition));
  const meaningParts = definitions.slice(0, 2);

  return {
    ...base,
    transliteration: base.transliteration ?? local.t ?? null,
    phonetic: base.phonetic ?? local.p ?? null,
    partOfSpeech:
      translateLocalLexiconText(local.g) ?? base.partOfSpeech ?? null,
    origin: translateLocalLexiconText(local.e) ?? base.origin ?? null,
    definitions: definitions.length ? definitions : base.definitions,
    strongsGloss: definitions[0] ?? null,
    meaning: meaningParts.length
      ? meaningParts.join("; ")
      : base.meaning,
    related: local.r?.length ? local.r : base.related,
    translationSource: "local",
  };
}

function parseDefinitionParagraphs(html: string): string[] {
  const defBlock = html.split(/<p class="def">.*?<\/p>/i)[1] ?? "";
  const beforeOrigin = defBlock.split(/<p class="origin"/i)[0] ?? "";
  return beforeOrigin
    .split(/<\/p>/i)
    .map((p) => stripTags(p))
    .filter((p) => p.length > 1);
}

const SECOND_SENSE_MAX_LENGTH = 90;

function buildMeaning(
  shortDefinition: string | null,
  definitions: string[],
  strongsGloss: string | null,
): string | null {
  const primary = shortDefinition || definitions[0] || strongsGloss || null;
  if (!primary) return null;

  const candidates = shortDefinition ? definitions : definitions.slice(1);
  const secondary = candidates.find(
    (d) =>
      d.length > 0 &&
      d.length <= SECOND_SENSE_MAX_LENGTH &&
      d.toLowerCase() !== primary.toLowerCase(),
  );
  return secondary ? primary + "; " + secondary : primary;
}

function buildStrongEntry(hit: BollsDictHit): StrongEntry {
  const code = (hit.topic ?? "").toUpperCase();
  const html = hit.definition ?? "";

  const definitions = parseDefinitionParagraphs(html);
  const strongsMatch = html.match(/-\s*Strongs:\s*([\s\S]*?)(?:<p|$)/i);
  const strongsGloss = strongsMatch ? stripTags(strongsMatch[1]) : null;
  const shortDefinition = hit.short_definition
    ? stripTags(hit.short_definition)
    : null;

  return {
    code,
    original: hit.lexeme || grab(html, "Original"),
    transliteration: hit.transliteration || grab(html, "Transliteration"),
    phonetic: hit.pronunciation || grab(html, "Phonetic"),
    partOfSpeech: translateGrammarTerms(grab(html, "Part\\(s\\) of speech")),
    origin: translateGrammarTerms(grab(html, "Origin")),
    definitions: definitions.length
      ? definitions
      : shortDefinition
        ? [shortDefinition]
        : [],
    strongsGloss,
    meaning: buildMeaning(shortDefinition, definitions, strongsGloss),
    related: Array.from(
      new Set(
        (html.match(/S:([GH]\d+)/g) ?? []).map((value) => value.slice(2)),
      ),
    ).filter((relatedCode) => relatedCode !== code),
    curated: false,
    translationSource: "source",
  };
}

export async function fetchStrongEntry(code: string): Promise<StrongEntry | null> {
  const upperCode = code.toUpperCase();
  const cacheKey = `strong:v7:${upperCode}`;
  const override = CORE_TERMS[upperCode];

  if (override) {
    return cached(cacheKey, async () => {
      const definitions = override.definitions ?? [override.meaning];
      return {
        code: upperCode,
        original: override.original,
        transliteration: override.transliteration,
        phonetic: override.phonetic ?? null,
        partOfSpeech: override.partOfSpeech ?? null,
        origin: null,
        definitions,
        strongsGloss: override.meaning,
        meaning: override.meaning,
        related: [],
        curated: true,
        translationSource: "curated",
        contextualMeaning: null,
      };
    });
  }

  return cached(cacheKey, async () => {
    const local = await fetchLocalLexiconEntry(upperCode);
    const response = await fetch(`${API}/dictionary-definition/BDBT/${upperCode}/`);

    if (!response.ok) {
      if (!local) return null;
      return buildLocalStrongEntry(
        {
          code: upperCode,
          original: local.o ?? null,
          transliteration: local.t ?? null,
          phonetic: local.p ?? null,
          partOfSpeech: translateLocalLexiconText(local.g),
          origin: translateLocalLexiconText(local.e),
          definitions: [],
          strongsGloss: null,
          meaning: null,
          related: local.r ?? [],
          curated: false,
          translationSource: "source",
        },
        local,
      );
    }

    const json = (await response.json()) as BollsDictHit[];
    if (!Array.isArray(json) || json.length === 0) {
      return local
        ? buildLocalStrongEntry(
            {
              code: upperCode,
              original: local.o ?? null,
              transliteration: local.t ?? null,
              phonetic: local.p ?? null,
              partOfSpeech: translateLocalLexiconText(local.g),
              origin: translateLocalLexiconText(local.e),
              definitions: [],
              strongsGloss: null,
              meaning: null,
              related: local.r ?? [],
              curated: false,
              translationSource: "source",
            },
            local,
          )
        : null;
    }

    const hit = json.find((item) => item.topic?.toUpperCase() === upperCode) ?? json[0];
    if (!hit) return null;

    const remoteEntry = buildStrongEntry(hit);
    return local ? buildLocalStrongEntry(remoteEntry, local) : remoteEntry;
  });
}

export async function fetchStrongEntries(codes: string[]): Promise<Record<string, StrongEntry>> {
  const unique = Array.from(new Set(codes));
  const results = await Promise.all(unique.map((c) => fetchStrongEntry(c).catch(() => null)));
  const out: Record<string, StrongEntry> = {};
  unique.forEach((c, i) => {
    const entry = results[i];
    if (entry) out[c] = entry;
  });
  return out;
}

/** Traduz `meaning`, `definitions` e `strongsGloss` (léxico BDB/Thayer,
 * originalmente em inglês) para português — cacheado para sempre por
 * número de Strong, então cada palavra só passa pela tradução uma única
 * vez neste dispositivo. Verbetes da lista curada (CORE_TERMS) já estão em
 * português e não passam por aqui. */
export async function translateStrongEntry(
  entry: StrongEntry,
  context?: LexiconContext,
): Promise<StrongEntry> {
  if (!context && (entry.curated || (entry.translationSource === "local" && !entryNeedsTranslation(entry)))) {
    return entry;
  }

  const contextKey = context
    ? String(context.book) + ":" + String(context.chapter) + ":" + String(context.verse) + ":" + String(context.wordIndex ?? "na")
    : "generic";

  return cached("xlex:v3:" + entry.code + ":" + contextKey, async () => {
    try {
      const { data, error } = await supabase.functions.invoke<{
        meaning: string | null;
        definitions: string[];
        strongsGloss: string | null;
        contextualMeaning: string | null;
      }>("translate-lexicon", {
        body: {
          meaning: entry.meaning,
          definitions: entry.definitions,
          strongsGloss: entry.strongsGloss,
          contextual: context
            ? {
                reference: String(context.book) + ":" + String(context.chapter) + ":" + String(context.verse),
                verseText: context.verseText,
                word: context.word,
                strong: entry.code,
                originalWords: context.originalWords?.map((item) => ({
                  word: item.word,
                  strong: item.strong,
                })),
              }
            : null,
        },
      });
      if (error || !data) return entry;
      return {
        ...entry,
        meaning: data.meaning ?? entry.meaning,
        definitions: data.definitions?.length ? data.definitions : entry.definitions,
        strongsGloss: data.strongsGloss ?? entry.strongsGloss,
        contextualMeaning: data.contextualMeaning ?? entry.contextualMeaning ?? null,
        translationSource: "ai",
      };
    } catch {
      return entry;
    }
  });
}

export async function translateStrongEntries(
  entries: Record<string, StrongEntry>,
  context?: Omit<LexiconContext, "wordIndex" | "word">,
): Promise<Record<string, StrongEntry>> {
  const codes = Object.keys(entries);
  const translated = await Promise.all(
    codes.map((code) => {
      const wordIndex = context?.originalWords?.findIndex(
        (word) => word.strong?.toUpperCase() === code.toUpperCase(),
      );
      const word = wordIndex !== undefined && wordIndex >= 0 ? context?.originalWords?.[wordIndex] : undefined;
      return translateStrongEntry(
        entries[code],
        context
          ? {
              ...context,
              wordIndex: wordIndex !== undefined && wordIndex >= 0 ? wordIndex : null,
              word: word?.word ?? null,
            }
          : undefined,
      );
    }),
  );
  const out: Record<string, StrongEntry> = {};
  codes.forEach((c, i) => (out[c] = translated[i]));
  return out;
}

export type Occurrence = { c: number; f: [number, number, number]; l: [number, number, number] };

let occurrencesPromise: Promise<Record<string, Occurrence>> | null = null;

/** Índice de ocorrências por número de Strong (contagem, primeira e última). */
export function loadOccurrences(): Promise<Record<string, Occurrence>> {
  if (!occurrencesPromise) {
    occurrencesPromise = fetch("/data/strongs-occurrences.json")
      .then((r) => (r.ok ? r.json() : {}))
      .catch(() => ({}));
  }
  return occurrencesPromise;
}

export type XrefTarget = [number, number, number];

const xrefCache = new Map<number, Promise<Record<string, XrefTarget[]>>>();

/** Referências cruzadas reais (openbible.info, CC-BY) para um livro. */
export function loadXrefs(book: number): Promise<Record<string, XrefTarget[]>> {
  let p = xrefCache.get(book);
  if (!p) {
    p = fetch(`/data/xrefs/${book}.json`)
      .then((r) => (r.ok ? r.json() : {}))
      .catch(() => ({}));
    xrefCache.set(book, p);
  }
  return p;
}

export async function crossReferencesFor(
  book: number,
  chapter: number,
  verse: number,
): Promise<XrefTarget[]> {
  const data = await loadXrefs(book);
  return data[`${chapter}:${verse}`] ?? [];
}

/** Busca textual no capítulo/tradução escolhidos (endpoint oficial da fonte). */
export async function searchBible(
  translation: string,
  query: string,
): Promise<{ book: number; chapter: number; verse: number; text: string }[]> {
  assertSupportedTranslation(translation);
  const normalizedQuery = query.trim();
  if (normalizedQuery.length < 3) return [];

  const url = `${API}/v2/find/${translation}?search=${encodeURIComponent(normalizedQuery)}&match_case=false&match_whole=false`;
  const res = await fetchWithTimeout(url);
  if (!res.ok) throw new Error("Busca indisponível no momento.");
  const json = (await res.json()) as {
    results?: { book: number; chapter: number; verse: number; text: string }[];
  };
  const list = json.results ?? [];
  return list.slice(0, 60).map((r) => ({
    book: r.book,
    chapter: r.chapter,
    verse: r.verse,
    text: stripTags(r.text),
  }));
}

/** Um único versículo em português (usado nas referências cruzadas). */
export async function fetchVerse(
  translation: string,
  book: number,
  chapter: number,
  verse: number,
): Promise<string | null> {
  const chap = await fetchChapter(translation, book, chapter);
  return chap.find((v) => v.verse === verse)?.text ?? null;
}

/**
 * Leitura aproximada em português — transcrição por regras a partir da
 * transliteração acadêmica. É explicitamente rotulada como aproximação na
 * interface (não é dado de fonte acadêmica).
 */
export function approximatePtBr(transliteration: string | null): string | null {
  if (!transliteration) return null;
  let s = transliteration.toLowerCase();
  const rules: [RegExp, string][] = [
    [/ch/g, "c"],
    [/ph/g, "f"],
    [/th/g, "t"],
    [/kh/g, "c"],
    [/ts/g, "tz"],
    [/sh/g, "ch"],
    [/ou/g, "u"],
    [/ei/g, "ei"],
    [/y/g, "i"],
    [/k/g, "c"],
    [/h$/g, ""],
  ];
  for (const [re, to] of rules) s = s.replace(re, to);
  return s;
}
