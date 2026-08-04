// Camada de dados do módulo "Bíblia de Estudos".
//
// Fontes (todas acadêmicas e verificáveis — nada é gerado por IA):
// - Texto em português: bolls.life (Almeida Revista e Corrigida, Almeida
//   Corrigida Fiel, Tradução Brasileira, King James Atualizada, Nova
//   Versão Internacional, Nova Almeida Atualizada)
// - Grego do NT: Tischendorf 8ª edição com numeração de Strong (TISCH)
// - Hebraico do AT: Westminster Leningrad Codex com Strong (WLCa)
// - Léxico: Brown-Driver-Briggs (hebraico) / Thayer (grego) — dicionário BDBT
// - Referências cruzadas: openbible.info (CC-BY), pré-processadas em
//   /data/xrefs/<livro>.json
// - Ocorrências de cada número de Strong: índice pré-calculado a partir dos
//   textos TISCH/WLCa em /data/strongs-occurrences.json
//
// Se um dado não existir na fonte, a interface informa que está indisponível.
// Nenhuma informação bíblica é inventada, estimada ou completada por IA.

const API = "https://bolls.life";

export type PtTranslation = {
  code: string;
  label: string;
  full: string;
  note?: string;
};

/** Traduções em português disponíveis no leitor (arquitetura extensível:
 * basta acrescentar um item aqui para habilitar uma nova versão). */
export const PT_TRANSLATIONS: PtTranslation[] = [
  { code: "NVIPT", label: "NVI", full: "Nova Versão Internacional" },
  { code: "NAA", label: "NAA", full: "Nova Almeida Atualizada" },
  { code: "ARC09", label: "ARC", full: "Almeida Revista e Corrigida" },
  { code: "ACF11", label: "ACF", full: "Almeida Corrigida Fiel" },
  { code: "TB10", label: "TB", full: "Tradução Brasileira" },
  { code: "KJA", label: "KJA", full: "King James Atualizada" },
];

export const DEFAULT_TRANSLATION = "NVIPT";

export function translationByCode(code: string): PtTranslation {
  return PT_TRANSLATIONS.find((t) => t.code === code) ?? PT_TRANSLATIONS[0];
}

export type Verse = { verse: number; text: string };
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

/** Capítulo em português. */
export async function fetchChapter(
  translation: string,
  book: number,
  chapter: number,
): Promise<Verse[]> {
  return cached(`bib:${translation}:${book}:${chapter}`, async () => {
    const res = await fetch(`${API}/get-text/${translation}/${book}/${chapter}/`);
    if (!res.ok) throw new Error("Não foi possível carregar o capítulo.");
    const json = (await res.json()) as { verse: number; text: string }[];
    return json.map((v) => ({ verse: v.verse, text: stripTags(v.text) }));
  });
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
  const { code } = originalTranslationFor(book);
  const prefix = book >= 40 ? "G" : "H";
  return cached(`orig:${code}:${book}:${chapter}`, async () => {
    const res = await fetch(`${API}/get-text/${code}/${book}/${chapter}/`);
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
  related: string[];
};

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

/**
 * Extrai um campo rotulado do HTML do léxico, como fallback para quando a
 * API não devolve o dado já pronto em um campo JSON separado. O traço
 * ("- Label:") é tratado como opcional, porque o HTML real da API bolls.life
 * nem sempre o inclui (ex.: "Transliteration: <b>...</b>" sem traço) — o
 * regex antigo exigia o traço e por isso nunca encontrava nada.
 */
function grab(html: string, label: string): string | null {
  const re = new RegExp(`-?\\s*${label}:\\s*(?:<b>)?([\\s\\S]*?)(?:<\\/b>)?\\s*(?:<p|<br|$)`, "i");
  const m = html.match(re);
  const value = m ? stripTags(m[1]) : "";
  return value || null;
}

/** Campos que a API bolls.life já entrega prontos, fora do HTML. */
type StrongApiFields = {
  lexeme?: string | null;
  transliteration?: string | null;
  pronunciation?: string | null;
  short_definition?: string | null;
};

function parseStrongHtml(code: string, html: string, apiFields: StrongApiFields = {}): StrongEntry {
  const defBlock = html.split(/<p class="def">.*?<\/p>/i)[1] ?? "";
  const beforeOrigin = defBlock.split(/<p class="origin"/i)[0] ?? "";
  const definitions = beforeOrigin
    .split(/<\/p>/i)
    .map((p) => stripTags(p))
    .filter((p) => p.length > 1);

  // A API já devolve "lexeme", "transliteration", "pronunciation" e
  // "short_definition" como campos separados no JSON — usamos esses valores
  // diretamente. O grab() no HTML só entra como reforço, caso algum verbete
  // específico não traga o campo pronto.
  const original = (apiFields.lexeme && apiFields.lexeme.trim()) || grab(html, "Original");
  const transliteration =
    (apiFields.transliteration && apiFields.transliteration.trim()) || grab(html, "Transliteration");
  const phonetic = (apiFields.pronunciation && apiFields.pronunciation.trim()) || grab(html, "Phonetic");

  const strongsGloss =
    (apiFields.short_definition && stripTags(apiFields.short_definition).trim()) ||
    (() => {
      const strongsMatch = html.match(/-?\s*Strongs:\s*([\s\S]*?)(?:<p|$)/i);
      return strongsMatch ? stripTags(strongsMatch[1]) : null;
    })();

  return {
    code,
    original: original || null,
    transliteration: transliteration || null,
    phonetic: phonetic || null,
    partOfSpeech: translateGrammarTerms(grab(html, "Part\\(s\\) of speech")),
    origin: translateGrammarTerms(grab(html, "Origin")),
    definitions,
    strongsGloss: strongsGloss || null,
    related: Array.from(new Set((html.match(/S:([GH]\d+)/g) ?? []).map((s) => s.slice(2)))).filter(
      (c) => c !== code,
    ),
  };
}

/** Verbete do léxico (BDB para hebraico, Thayer para grego). */
export async function fetchStrongEntry(code: string): Promise<StrongEntry | null> {
  // Chave de cache trocada para "strong:v2:" para invalidar automaticamente
  // qualquer resultado quebrado ("—") que já esteja salvo no localStorage
  // dos usuários a partir da versão anterior, com o parser com bug.
  return cached(`strong:v2:${code}`, async () => {
    const res = await fetch(`${API}/dictionary-definition/BDBT/${code}/`);
    if (!res.ok) return null;
    const json = (await res.json()) as (StrongApiFields & { topic: string; definition: string })[];
    const hit = json.find((d) => d.topic?.toUpperCase() === code.toUpperCase()) ?? json[0];
    if (!hit) return null;
    return parseStrongHtml(code, hit.definition ?? "", {
      lexeme: hit.lexeme,
      transliteration: hit.transliteration,
      pronunciation: hit.pronunciation,
      short_definition: hit.short_definition,
    });
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
  const url = `${API}/v2/find/${translation}?search=${encodeURIComponent(query)}&match_case=false&match_whole=false`;
  const res = await fetch(url);
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
