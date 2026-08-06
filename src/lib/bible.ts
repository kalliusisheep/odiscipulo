import type { BibleVersion } from "@/data/content";
import { BIBLE_BOOKS } from "@/data/bible-books";
import type { AppLanguage } from "@/lib/i18n";

const MEM: Record<string, string> = {};
const BOLLS_API = "https://bolls.life";
const REQUEST_TIMEOUT_MS = 15_000;

const VERSION_TO_API: Record<BibleVersion, string> = {
  NVI: "almeida",
  NAA: "almeida",
  ACF: "almeida",
  NVT: "almeida",
};

const VERSION_TO_BOLLS: Record<BibleVersion, string> = {
  NVI: "NVIPT",
  NAA: "NAA",
  ACF: "ACF11",
  NVT: "NVIPT",
};

const LANGUAGE_TO_BOLLS: Record<Exclude<AppLanguage, "pt-BR">, string> = {
  en: "WEB",
  es: "RV1960",
};

async function fetchWithTimeout(input: RequestInfo | URL): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(input, { signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

export function apiTranslationFor(
  version: BibleVersion,
  language: AppLanguage = "pt-BR",
): string {
  if (language !== "pt-BR") return LANGUAGE_TO_BOLLS[language];
  return VERSION_TO_API[version] ?? "almeida";
}

export function bibleLabelFor(version: BibleVersion): string {
  return version;
}

function bollsTranslationFor(
  version: BibleVersion,
  language: AppLanguage,
): string {
  return language === "pt-BR"
    ? VERSION_TO_BOLLS[version] ?? VERSION_TO_BOLLS.NVI
    : LANGUAGE_TO_BOLLS[language];
}

function normalizeBookName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.’']/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

const BOOK_ALIASES: Record<string, number> = {
  genesis: 1,
  gen: 1,
  exodus: 2,
  exodo: 2,
  ex: 2,
  leviticus: 3,
  levitico: 3,
  lev: 3,
  numbers: 4,
  numeros: 4,
  num: 4,
  deuteronomy: 5,
  deuteronomio: 5,
  deut: 5,
  deuter: 5,
  joshua: 6,
  josue: 6,
  josh: 6,
  judges: 7,
  juizes: 7,
  jueces: 7,
  judg: 7,
  ruth: 8,
  rute: 8,
  rut: 8,
  "1 samuel": 9,
  "2 samuel": 10,
  "1 kings": 11,
  "2 kings": 12,
  "1 reis": 11,
  "2 reis": 12,
  "1 chronicles": 13,
  "2 chronicles": 14,
  "1 cronicas": 13,
  "2 cronicas": 14,
  ezra: 15,
  esdras: 15,
  nehemiah: 16,
  neemias: 16,
  esther: 17,
  ester: 17,
  job: 18,
  jo: 18,
  psalms: 19,
  psalm: 19,
  salmos: 19,
  ps: 19,
  proverbs: 20,
  proverbios: 20,
  prov: 20,
  ecclesiastes: 21,
  eclesiastes: 21,
  eccl: 21,
  "song of solomon": 22,
  "song of songs": 22,
  cantares: 22,
  isaias: 23,
  isaiah: 23,
  isa: 23,
  jeremiah: 24,
  jeremias: 24,
  jer: 24,
  lamentations: 25,
  lamentacoes: 25,
  lam: 25,
  ezekiel: 26,
  ezequiel: 26,
  ezek: 26,
  daniel: 27,
  dan: 27,
  hosea: 28,
  oseias: 28,
  hos: 28,
  joel: 29,
  amos: 30,
  obadiah: 31,
  obadias: 31,
  jonah: 32,
  jonas: 32,
  micah: 33,
  miqueias: 33,
  nahum: 34,
  naum: 34,
  habakkuk: 35,
  habacuque: 35,
  zephaniah: 36,
  sofonias: 36,
  haggai: 37,
  ageu: 37,
  zechariah: 38,
  zacarias: 38,
  malachi: 39,
  malaquias: 39,
  matthew: 40,
  mateus: 40,
  matt: 40,
  mark: 41,
  marcos: 41,
  mk: 41,
  luke: 42,
  lucas: 42,
  john: 43,
  joao: 43,
  acts: 44,
  atos: 44,
  romans: 45,
  romanos: 45,
  "1 corinthians": 46,
  "2 corinthians": 47,
  "1 corintios": 46,
  "2 corintios": 47,
  galatians: 48,
  galatas: 48,
  ephesians: 49,
  efesios: 49,
  philippians: 50,
  filipenses: 50,
  colossians: 51,
  colossenses: 51,
  "1 thessalonians": 52,
  "2 thessalonians": 53,
  "1 tessalonicenses": 52,
  "2 tessalonicenses": 53,
  "1 timothy": 54,
  "2 timothy": 55,
  "1 timoteo": 54,
  "2 timoteo": 55,
  titus: 56,
  tito: 56,
  philemon: 57,
  filemom: 57,
  hebrews: 58,
  hebreus: 58,
  james: 59,
  tiago: 59,
  "1 peter": 60,
  "2 peter": 61,
  "1 pedro": 60,
  "2 pedro": 61,
  "1 john": 62,
  "2 john": 63,
  "3 john": 64,
  "1 joao": 62,
  "2 joao": 63,
  "3 joao": 64,
  jude: 65,
  judas: 65,
  revelation: 66,
  apocalipsis: 66,
  apocalipse: 66,
};

function resolveBookNumber(bookName: string): number | null {
  const normalized = normalizeBookName(bookName);
  const direct = BIBLE_BOOKS.find(
    (book) =>
      normalizeBookName(book.name) === normalized ||
      normalizeBookName(book.abbr) === normalized,
  );
  return direct?.id ?? BOOK_ALIASES[normalized] ?? null;
}

function parseReference(ref: string): {
  bookNumber: number;
  chapter: number;
  verseStart: number | null;
  verseEnd: number | null;
} | null {
  const cleaned = ref.replace(/[()]/g, "").replace(/\s+/g, " ").trim();
  const match = cleaned.match(/^(.+?)\s+(\d+)(?::(\d+)(?:-(\d+))?)?$/);
  if (!match) return null;
  const bookNumber = resolveBookNumber(match[1]);
  if (!bookNumber) return null;
  return {
    bookNumber,
    chapter: Number(match[2]),
    verseStart: match[3] ? Number(match[3]) : null,
    verseEnd: match[4] ? Number(match[4]) : match[3] ? Number(match[3]) : null,
  };
}

function cleanBollsText(text: string): string {
  return text
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchFromBolls(
  ref: string,
  translation: string,
): Promise<string> {
  const parsed = parseReference(ref);
  if (!parsed) throw new Error("Referência não reconhecida");
  const response = await fetchWithTimeout(
    `${BOLLS_API}/get-text/${translation}/${parsed.bookNumber}/${parsed.chapter}/`,
  );
  if (!response.ok) throw new Error("Passagem indisponível");
  const verses = (await response.json()) as { verse: number; text: string }[];
  const selected = verses.filter((verse) => {
    if (parsed.verseStart === null) return true;
    return (
      verse.verse >= parsed.verseStart &&
      verse.verse <= (parsed.verseEnd ?? parsed.verseStart)
    );
  });
  if (selected.length === 0) throw new Error("Versículo indisponível");
  return selected.map((verse) => `${verse.verse} ${cleanBollsText(verse.text)}`).join(" ");
}

/**
 * Remove os números de versículo embutidos no texto (ex.: "1 No princípio…
 * 2 A terra…") para uso na narração por voz, sem afetar o texto exibido
 * na tela (que mantém os números como referência visual).
 */
export function stripVerseNumbers(text: string): string {
  return text.replace(/(^|(?<=[.!?"”'’)\]]\s))\d{1,3}\s+/g, "").trim();
}

export async function fetchPassage(
  ref: string,
  version: BibleVersion = "NVI",
  language: AppLanguage = "pt-BR",
): Promise<string> {
  const translation = apiTranslationFor(version, language);
  const bollsTranslation = bollsTranslationFor(version, language);
  const key = `bible:${language}:${bollsTranslation}:${ref}`;
  if (MEM[key]) return MEM[key];

  if (typeof window !== "undefined") {
    const cached = window.localStorage.getItem(key);
    if (cached) {
      MEM[key] = cached;
      return cached;
    }
  }

  let text: string;
  try {
    text = await fetchFromBolls(ref, bollsTranslation);
  } catch {
    const url = `https://bible-api.com/${encodeURIComponent(ref)}?translation=${translation}`;
    const response = await fetchWithTimeout(url);
    if (!response.ok) throw new Error(`Falha ao buscar ${ref}`);
    const json = (await response.json()) as {
      text?: string;
      verses?: { verse: number; text: string }[];
    };
    text =
      json.verses?.map((verse) => `${verse.verse} ${verse.text.trim()}`).join(" ") ??
      (json.text ?? "").trim();
  }

  MEM[key] = text;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(key, text);
    } catch {
      /* quota */
    }
  }
  return text;
}
