const API = "https://bolls.life";

export type PtTranslation = {
  code: string;
  label: string;
  full: string;
  note?: string;
};

/** TraduÃ§Ãµes em portuguÃªs disponÃ­veis no leitor (arquitetura extensÃ­vel:
 * basta acrescentar um item aqui para habilitar uma nova versÃ£o). */
export const PT_TRANSLATIONS: PtTranslation[] = [
  { code: "NVIPT", label: "NVI", full: "Nova VersÃ£o Internacional" },
  { code: "NAA", label: "NAA", full: "Nova Almeida Atualizada" },
  { code: "ARC09", label: "ARC", full: "Almeida Revista e Corrigida" },
  { code: "ACF11", label: "ACF", full: "Almeida Corrigida Fiel" },
  { code: "TB10", label: "TB", full: "TraduÃ§Ã£o Brasileira" },
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
    /* quota â€” segue sem cache persistente */
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

/** CapÃ­tulo em portuguÃªs. */
export async function fetchChapter(
  translation: string,
  book: number,
  chapter: number,
): Promise<Verse[]> {
  return cached(`bib:${translation}:${book}:${chapter}`, async () => {
    const res = await fetch(`${API}/get-text/${translation}/${book}/${chapter}/`);
    if (!res.ok) throw new Error("NÃ£o foi possÃ­vel carregar o capÃ­tulo.");
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

/** CapÃ­tulo no idioma original, palavra a palavra, com nÃºmeros de Strong. */
export async function fetchOriginalChapter(
  book: number,
  chapter: number,
): Promise<OriginalVerse[]> {
  const { code } = originalTranslationFor(book);
  const prefix = book >= 40 ? "G" : "H";
  return cached(`orig:${code}:${book}:${chapter}`, async () => {
    const res = await fetch(`${API}/get-text/${code}/${book}/${chapter}/`);
    if (!res.ok) throw new Error("Texto original indisponÃ­vel.");
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
   * (CORE_TERMS) Ã© a traduÃ§Ã£o conferida manualmente. Para os demais, combina
   * o 1Âº e o 2Âº sentido do lÃ©xico (quando o 2Âº for curto) em vez de trazer
   * sÃ³ um sentido isolado. */
  meaning: string | null;
  related: string[];
  /** true quando o verbete veio da lista curada manualmente (CORE_TERMS),
   * ou seja, nÃ£o depende da heurÃ­stica de leitura do HTML da fonte. */
  curated: boolean;
  /** Origem editorial da traduÃ§Ã£o exibida. */
  translationStatus?: "revisado" | "automatico" | "fonte-original";
  source?: string;
};

/**
 * Traduz os termos gramaticais recorrentes que vÃªm em inglÃªs na fonte
 * acadÃªmica (Brown-Driver-Briggs / Thayer, via bolls.life) para portuguÃªs.
 * Cobre o vocabulÃ¡rio fixo de classificaÃ§Ã£o gramatical â€” nÃ£o Ã© uma traduÃ§Ã£o
 * livre do texto do lÃ©xico (que permanece na fonte original em inglÃªs,
 * jÃ¡ que nÃ£o hÃ¡ uma base acadÃªmica equivalente em portuguÃªs).
 */
const GRAMMAR_TERMS: [RegExp, string][] = [
  [/\bMasculine\b/gi, "Masculino"],
  [/\bFeminine\b/gi, "Feminino"],
  [/\bCommon\b/gi, "Comum"],
  [/\bProper\b/gi, "PrÃ³prio"],
  [/\bNoun\b/gi, "Substantivo"],
  [/\bVerb\b/gi, "Verbo"],
  [/\bAdjective\b/gi, "Adjetivo"],
  [/\bAdverb\b/gi, "AdvÃ©rbio"],
  [/\bPronoun\b/gi, "Pronome"],
  [/\bPreposition\b/gi, "PreposiÃ§Ã£o"],
  [/\bConjunction\b/gi, "ConjunÃ§Ã£o"],
  [/\bInterjection\b/gi, "InterjeiÃ§Ã£o"],
  [/\bParticle\b/gi, "PartÃ­cula"],
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
  [/\bLetter\b/gi, "Letra"],
  [/\bCarta\b/gi, "Letra"],
  [/\bParticiple\b/gi, "ParticÃ­pio"],
  [/\bPassive\b/gi, "Passivo"],
  [/\bActive\b/gi, "Ativo"],
  [/\bPlural\b/gi, "Plural"],
  [/\bSingular\b/gi, "Singular"],
  [/\bfrom\b/gi, "de"],
  [/\ba primitive root\b/gi, "uma raiz primitiva"],
  [/\bprimitive root\b/gi, "raiz primitiva"],
  [/\bof uncertain derivation\b/gi, "de derivaÃ§Ã£o incerta"],
  [/\bcontracted from\b/gi, "contraÃ­do de"],
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
// Para estas ~45 palavras a traduÃ§Ã£o, a classe gramatical e o "Significado"
// exibido na interface NÃƒO dependem da extraÃ§Ã£o heurÃ­stica do HTML da fonte
// (bolls.life / BDBT) â€” foram conferidos manualmente e o resultado Ã© sempre
// o mesmo, independentemente de qualquer mudanÃ§a de formataÃ§Ã£o da fonte.
// Isso corrige especificamente casos como Elohim (H430), em que a extraÃ§Ã£o
// automÃ¡tica podia trazer um sentido secundÃ¡rio como se fosse o principal.
//
// Para acrescentar um novo termo Ã  lista curada, basta adicionar uma entrada
// aqui usando o cÃ³digo de Strong (ex.: "H430", "G5547") como chave.
// ---------------------------------------------------------------------------

type CoreTermOverride = {
  /** Palavra no idioma original (hebraico ou grego). */
  original: string;
  transliteration: string;
  phonetic?: string;
  partOfSpeech?: string;
  /** "Significado" â€” sentido principal, conferido manualmente. */
  meaning: string;
  /** Sentidos adicionais (1Âº = igual a `meaning`, 2Âº em diante = secundÃ¡rios). */
  definitions?: string[];
};

const CORE_TERMS: Record<string, CoreTermOverride> = {
  // --- Hebraico (Antigo Testamento) ---------------------------------------
  H430: {
    original: "×Ö±×œÖ¹×”Ö´×™×",
    transliteration: "Elohim",
    phonetic: "el-o-heem'",
    partOfSpeech: "Substantivo masculino, forma plural",
    meaning:
      "Deus â€” o Ãºnico Deus verdadeiro de Israel, tratado gramaticalmente como plural (plural de majestade/plenitude), mas concordando no singular quando se refere a Ele",
    definitions: [
      "Deus, o Ãºnico Deus verdadeiro de Israel (uso predominante no Antigo Testamento, com concordÃ¢ncia verbal no singular)",
      "deuses ou divindades pagÃ£s; juÃ­zes, governantes ou seres angelicais/divinos (usos secundÃ¡rios e dependentes do contexto)",
    ],
  },
  H3068: {
    original: "×™×”×•×”",
    transliteration: "YHWH (JavÃ©/JeovÃ¡)",
    phonetic: "yeh-ho-vaw'",
    partOfSpeech: "Nome prÃ³prio",
    meaning:
      'SENHOR â€” o nome pessoal e prÃ³prio de Deus, revelado a Israel (ÃŠx 3.14-15); geralmente vertido como "SENHOR" em versalete nas traduÃ§Ãµes em portuguÃªs',
    definitions: [
      'SENHOR â€” o nome prÃ³prio e pessoal do Deus de Israel, ligado ao verbo "ser/existir" (ÃŠx 3.14)',
      'forma reverencial: por tradiÃ§Ã£o judaica, lido em voz alta como "Adonai" para evitar pronunciar o Nome diretamente',
    ],
  },
  H136: {
    original: "×Ö²×“Ö¹× Ö¸×™",
    transliteration: "Adonai",
    phonetic: "ad-o-noy'",
    partOfSpeech: "Substantivo masculino, forma plural (uso como tÃ­tulo)",
    meaning:
      "Senhor, Soberano â€” tÃ­tulo de domÃ­nio e autoridade, usado como forma de tratamento para Deus",
    definitions: [
      "Senhor, Soberano â€” tÃ­tulo de autoridade e domÃ­nio aplicado a Deus",
      "senhor, dono, superior â€” usado tambÃ©m para autoridades humanas (uso secundÃ¡rio)",
    ],
  },
  H7307: {
    original: "×¨×•Ö¼×—Ö·",
    transliteration: "Ruach",
    phonetic: "roo'-akh",
    partOfSpeech: "Substantivo comum (masculino/feminino)",
    meaning:
      "EspÃ­rito, vento, fÃ´lego â€” o sopro vital; usado para o EspÃ­rito de Deus, o espÃ­rito humano e o vento",
    definitions: [
      "espÃ­rito â€” o EspÃ­rito de Deus, ou o espÃ­rito/fÃ´lego de vida no ser humano",
      "vento, sopro â€” movimento de ar (uso literal, frequente em contextos nÃ£o teolÃ³gicos)",
    ],
  },
  H2617: {
    original: "×—Ö¶×¡Ö¶×“",
    transliteration: "Chesed",
    phonetic: "kheh'-sed",
    partOfSpeech: "Substantivo masculino",
    meaning:
      "Benignidade alianÃ§eira, misericÃ³rdia leal â€” o amor fiel de Deus que sustenta a alianÃ§a com o Seu povo",
    definitions: [
      "benignidade, bondade leal e fiel â€” especialmente a fidelidade de Deus Ã  Sua alianÃ§a",
      "misericÃ³rdia, favor â€” bondade demonstrada entre pessoas, dentro de um vÃ­nculo de lealdade",
    ],
  },
  H6918: {
    original: "×§Ö¸×“×•Ö¹×©×",
    transliteration: "Qadosh",
    phonetic: "kaw-doshe'",
    partOfSpeech: "Adjetivo",
    meaning: "Santo â€” separado, consagrado; atributo central de Deus e do que Lhe Ã© dedicado",
    definitions: [
      "santo â€” separado para Deus, consagrado, moralmente puro",
      "sagrado â€” aquilo que pertence Ã  esfera do culto e nÃ£o pode ser tratado como comum",
    ],
  },
  H1285: {
    original: "×‘Ö°Ö¼×¨Ö´×™×ª",
    transliteration: "Berith",
    phonetic: "ber-eeth'",
    partOfSpeech: "Substantivo feminino",
    meaning:
      "AlianÃ§a, pacto â€” compromisso solene, geralmente selado por juramento ou sinal, entre Deus e o Seu povo (ou entre pessoas)",
    definitions: [
      "alianÃ§a, pacto â€” compromisso solene entre Deus e o Seu povo",
      "acordo, tratado â€” pacto formal entre pessoas ou naÃ§Ãµes (uso secundÃ¡rio)",
    ],
  },
  H3444: {
    original: "×™Ö°×©××•Ö¼×¢Ö¸×”",
    transliteration: "Yeshuah",
    phonetic: "yesh-oo'-aw",
    partOfSpeech: "Substantivo feminino",
    meaning: "SalvaÃ§Ã£o, livramento â€” libertaÃ§Ã£o operada por Deus, fÃ­sica ou espiritual",
    definitions: [
      "salvaÃ§Ã£o â€” livramento operado por Deus, com sentido espiritual",
      "livramento, vitÃ³ria â€” libertaÃ§Ã£o de perigo fÃ­sico ou inimigos (uso concreto)",
    ],
  },
  H8451: {
    original: "×ªÖ¼×•Ö¹×¨Ö¸×”",
    transliteration: "Torah",
    phonetic: "to-raw'",
    partOfSpeech: "Substantivo feminino",
    meaning:
      "Lei, instruÃ§Ã£o â€” o ensino divino; refere-se tanto Ã  Lei de MoisÃ©s quanto Ã  instruÃ§Ã£o em sentido amplo",
    definitions: [
      "lei â€” a Lei de MoisÃ©s, o corpo de mandamentos dados por Deus a Israel",
      "instruÃ§Ã£o, ensino â€” orientaÃ§Ã£o ou direÃ§Ã£o dada (uso mais amplo, nÃ£o exclusivamente legal)",
    ],
  },
  H6664: {
    original: "×¦Ö¶×“Ö¶×§",
    transliteration: "Tsedeq",
    phonetic: "tseh'-dek",
    partOfSpeech: "Substantivo masculino",
    meaning: "JustiÃ§a, retidÃ£o â€” conformidade com o padrÃ£o reto de Deus",
    definitions: [
      "justiÃ§a, retidÃ£o â€” o que Ã© correto segundo o padrÃ£o de Deus",
      "equidade â€” justiÃ§a aplicada em juÃ­zo ou nas relaÃ§Ãµes humanas (uso secundÃ¡rio)",
    ],
  },
  H4899: {
    original: "×Ö¸×©Ö´××™×—Ö·",
    transliteration: "Mashiach",
    phonetic: "maw-shee'-akh",
    partOfSpeech: "Substantivo masculino",
    meaning:
      "Ungido, Messias â€” aquele consagrado por unÃ§Ã£o; tÃ­tulo messiÃ¢nico do libertador prometido",
    definitions: [
      "ungido â€” pessoa consagrada por unÃ§Ã£o com Ã³leo (rei, sacerdote ou profeta)",
      "Messias â€” o Ungido prometido, o libertador escatolÃ³gico (sentido que se desenvolve ao longo do AT)",
    ],
  },
  H3820: {
    original: "×œÖµ×‘",
    transliteration: "Lev",
    phonetic: "labe",
    partOfSpeech: "Substantivo masculino",
    meaning:
      "CoraÃ§Ã£o â€” sede da mente, da vontade e das emoÃ§Ãµes (nÃ£o apenas do sentimento, como em portuguÃªs)",
    definitions: [
      "coraÃ§Ã£o â€” sede da mente, vontade, intenÃ§Ã£o e emoÃ§Ã£o",
      "interior, Ã¢mago â€” o centro Ã­ntimo da pessoa (uso figurado mais amplo)",
    ],
  },
  H5315: {
    original: "× Ö¶×¤Ö¶×©×",
    transliteration: "Nephesh",
    phonetic: "neh'-fesh",
    partOfSpeech: "Substantivo feminino",
    meaning:
      "Alma, ser vivo â€” a pessoa viva como um todo (corpo e vida), nÃ£o uma alma imaterial separada do corpo",
    definitions: [
      "alma, ser vivo â€” a pessoa como um todo animado pelo fÃ´lego de vida",
      "vida, apetite, desejo â€” usado tambÃ©m para a vida fÃ­sica ou para desejos/apetites (usos secundÃ¡rios)",
    ],
  },
  H1004: {
    original: "×‘Ö·Ö¼×™Ö´×ª",
    transliteration: "Bayith",
    phonetic: "bah'-yith",
    partOfSpeech: "Substantivo masculino",
    meaning: "Casa â€” aß:¶‰ËkºwµçIÉ•½¹¡••È°…‘µ¥Ñ¥ÈƒŠP½¹½É‘…ÈÁÕ‰±¥…µ•¹Ñ”½´Õ´™…Ñ¼€¡ÕÍ¼µ…¥Ì•É…°¤ˆ°(€€€t°(€ô°(€ÌÌĞÄèì(€€€½É¥¥¹…°è€‹:ó:×>:³:÷:ÿ:ç:Äˆ°(€€€ÑÉ…¹Í±¥Ñ•É…Ñ¥½¸è€‰5•Ñ…¹½¥„ˆ°(€€€Á¡½¹•Ñ¥Œè€‰µ•Ğµ…¸œµ½äµ… ˆ°(€€€Á…ÉÑ=™MÁ•• è€‰MÕ‰ÍÑ…¹Ñ¥Ù¼™•µ¥¹¥¹¼ˆ°(€€€µ•…¹¥¹œè(€€€€€€‰ÉÉ•Á•¹‘¥µ•¹Ñ¼ƒŠPµÕ‘…»„‘”µ•¹Ñ””‘”ÉÕµ¼‘”Ù¥‘„°…™…ÍÑ…¹‘¼µÍ”‘¼Á•…‘¼”Ù½±Ñ…¹‘¼µÍ”Á…É„•ÕÌˆ°(€€€‘•™¥¹¥Ñ¥½¹Ìèl(€€€€€€‰…ÉÉ•Á•¹‘¥µ•¹Ñ¼ƒŠPµÕ‘…»„¥¹Ñ•É¥½È‘”µ•¹Ñ””‘”‘¥É—Ÿ¼‘”Ù¥‘„‘¥…¹Ñ”‘”•ÕÌˆ°(€€€€€€‰µÕ‘…»„‘”Á•¹Í…µ•¹Ñ¼ƒŠPÍ•¹Ñ¥‘¼•Ñ¥µ½³Í¥¼µ…¥Ì…µÁ±¼°»¼É•ÍÑÉ¥Ñ¼…¼½¹Ñ•áÑ¼É•±¥¥½Í¼ˆ°(€€€t°(€ô°(€äÀÜèì(€€€½É¥¥¹…°è€‹:Ë:Ç>>:¿:Û>$ˆ°(€€€ÑÉ…¹Í±¥Ñ•É…Ñ¥½¸è€‰	…ÁÑ¥é¼ˆ°(€€€Á¡½¹•Ñ¥Œè€‰‰…ÀµÑ¥œµé¼ˆ°(€€€Á…ÉÑ=™MÁ•• è€‰Y•É‰¼ˆ°(€€€µ•…¹¥¹œè€‰	…Ñ¥é…ÈƒŠP¥µ•É¥Èì¼É¥Ñ¼É¥ÍÓ¼‘¼‰…Ñ¥Íµ¼ˆ°(€€€‘•™¥¹¥Ñ¥½¹Ìèl(€€€€€€‰‰…Ñ¥é…ÈƒŠPÉ•…±¥é…È¼É¥Ñ¼‘¼‰…Ñ¥Íµ¼Á½È¥µ•ÉÏ¼ˆ°(€€€€€€‰¥µ•É¥È°µ•ÉÕ±¡…ÈƒŠPÍ•¹Ñ¥‘¼±¥Ñ•É…°‘”µ•ÉÕ±¡…È•´ƒ…Õ„€¡ÕÍ¼•Ñ¥µ½³Í¥¼¤ˆ°(€€€t°(€ô°(€ÄÈĞÈèì(€€€½É¥¥¹…°è€‹:Ó:ç:Ç:ã:»:ë:Üˆ°(€€€ÑÉ…¹Í±¥Ñ•É…Ñ¥½¸è€‰¥…Ñ¡•­”ˆ°(€€€Á¡½¹•Ñ¥Œè€‰‘•”µ…Ñ µ…äœµ­…äˆ°(€€€Á…ÉÑ=™MÁ•• è€‰MÕ‰ÍÑ…¹Ñ¥Ù¼™•µ¥¹¥¹¼ˆ°(€€€µ•…¹¥¹œè(€€€€€€‰±¥…»„°Ñ•ÍÑ…µ•¹Ñ¼ƒŠPÁ…Ñ¼Í½±•¹”ì¹¼9P°•ÍÁ•¥…±µ•¹Ñ”„¹½Ù„…±¥…»„Í•±…‘„Á½ÈÉ¥ÍÑ¼ˆ°(€€€‘•™¥¹¥Ñ¥½¹Ìèl(€€€€€€‰…±¥…»„°Á…Ñ¼ƒŠP½µÁÉ½µ¥ÍÍ¼Í½±•¹”•¹ÑÉ”•ÕÌ”¼M•ÔÁ½Ù¼ˆ°(€€€€€€‰Ñ•ÍÑ…µ•¹Ñ¼ƒŠP‘¥ÍÁ½Í§Ÿ¼‘”ƒé±Ñ¥µ„Ù½¹Ñ…‘”€¡Í•¹Ñ¥‘¼©ÕËµ‘¥¼É•¼°ÕÍ¼Í•Õ¹“…É¥¼¤ˆ°(€€€t°(€ô°(€ÈÈÈÈèì(€€€½É¥¥¹…°è€‹:Û>':¸ˆ°(€€€ÑÉ…¹Í±¥Ñ•É…Ñ¥½¸è€‰i½”ˆ°(€€€Á¡½¹•Ñ¥Œè€‰‘é¼µ…äœˆ°(€€€Á…ÉÑ=™MÁ•• è€‰MÕ‰ÍÑ…¹Ñ¥Ù¼™•µ¥¹¥¹¼ˆ°(€€€µ•…¹¥¹œè€‰Y¥‘„ƒŠP„Ù¥‘„•´Í•¹Ñ¥‘¼Á±•¹¼ì¹¼9P°•ÍÁ•¥…±µ•¹Ñ”„Ù¥‘„•Ñ•É¹„‘…‘„Á½È•ÕÌˆ°(€€€‘•™¥¹¥Ñ¥½¹Ìèl(€€€€€€‰Ù¥‘„ƒŠP•á¥ÍÓ©¹¥„›µÍ¥„ì¹¼9P°•ÍÁ•¥…±µ•¹Ñ”„Ù¥‘„•Ñ•É¹„”Á±•¹„‘…‘„Á½È•ÕÌˆ°(€€€€€€‰ÍÕÍÑ•¹Ñ¼°µ½‘¼‘”Ù¥Ù•ÈƒŠPÍ•¹Ñ¥‘¼µ…¥Ì½¹É•Ñ¼”½Ñ¥‘¥…¹¼€¡ÕÍ¼Í•Õ¹“…É¥¼¤ˆ°(€€€t°(€ô°(€Èààäèì(€€€½É¥¥¹…°è€‹:ë>3>:ó:ÿ>ˆ°(€€€ÑÉ…¹Í±¥Ñ•É…Ñ¥½¸è€‰-½Íµ½Ìˆ°(€€€Á¡½¹•Ñ¥Œè€‰­½Ìœµµ½Ìˆ°(€€€Á…ÉÑ=™MÁ•• è€‰MÕ‰ÍÑ…¹Ñ¥Ù¼µ…ÍÕ±¥¹¼ˆ°(€€€µ•…¹¥¹œè(€€€€€€‰5Õ¹‘¼ƒŠP„½É‘•´É¥…‘„°„¡Õµ…¹¥‘…‘”°½Ô¼Í¥ÍÑ•µ„‘”Ù…±½É•Ì½Á½ÍÑ½Ì„•ÕÌ°½¹™½Éµ”¼½¹Ñ•áÑ¼ˆ°(€€€‘•™¥¹¥Ñ¥½¹Ìèl(€€€€€€‰µÕ¹‘¼ƒŠP„É¥‡Ÿ¼°„¡Õµ…¹¥‘…‘”½Ô„½É‘•´µÕ¹‘¥…°ˆ°(€€€€€€½É¹…µ•¹Ñ¼°…ÉÉ…¹©¼ƒŠPÍ•¹Ñ¥‘¼½É¥¥¹…°‘”€‰½É‘•´½‰•±•é„ˆ€¡ÕÍ¼•Ñ¥µ½³Í¥¼Í•Õ¹“…É¥¼¤œ°(€€€t°(€ô°(€ĞÀèì(€€€½É¥¥¹…°è€‹†ò:Ï:ç:ÿ>ˆ°(€€€ÑÉ…¹Í±¥Ñ•É…Ñ¥½¸è€‰!…¥½Ìˆ°(€€€Á¡½¹•Ñ¥Œè€‰¡…œœµ•”µ½Ìˆ°(€€€Á…ÉÑ=™MÁ•• è€‰‘©•Ñ¥Ù¼ˆ°(€€€µ•…¹¥¹œè(€€€€€€‰M…¹Ñ¼ƒŠPÍ•Á…É…‘¼Á…É„•ÕÌ°ÁÕÉ¼ìÕÍ…‘¼Á…É„¼ÍÃµÉ¥Ñ¼M…¹Ñ¼°Á…É„•ÕÌ”Á…É„½ÌÉ•¹Ñ•Ìˆ°(€€€‘•™¥¹¥Ñ¥½¹Ìèl(€€€€€€‰Í…¹Ñ¼ƒŠPÍ•Á…É…‘¼Á…É„•ÕÌ°½¹Í…É…‘¼°µ½É…±µ•¹Ñ”ÁÕÉ¼ˆ°(€€€€€€‰Í…¹Ñ½Ì€¡ÍÕ‰ÍÑ…¹Ñ¥Ù…‘¼¤ƒŠP½ÌÉ•¹Ñ•Ì°¼Á½Ù¼½¹Í…É…‘¼‘”•ÕÌ€¡ÕÍ¼ÍÕ‰ÍÑ…¹Ñ¥Ù…‘¼½µÕ´¹¼9P¤ˆ°(€€€t°(€ô°(€ÌÈèì(€€€½É¥¥¹…°è€‹†ò:Ï:Ï:×:ï:ÿ>ˆ°(€€€ÑÉ…¹Í±¥Ñ•É…Ñ¥½¸è€‰¹•±½Ìˆ°(€€€Á¡½¹•Ñ¥Œè€‰…¹œœµ•°µ½Ìˆ°(€€€Á…ÉÑ=™MÁ•• è€‰MÕ‰ÍÑ…¹Ñ¥Ù¼µ…ÍÕ±¥¹¼ˆ°(€€€µ•…¹¥¹œè(€€€€€€‰¹©¼°µ•¹Í…•¥É¼ƒŠPÍ•È•ÍÁ¥É¥ÑÕ…°•¹Ù¥…‘¼Á½È•ÕÌìÑ…µ‹¥´ÕÍ…‘¼Á…É„µ•¹Í…•¥É½Ì¡Õµ…¹½Ìˆ°(€€€‘•™¥¹¥Ñ¥½¹Ìèl(€€€€€€‰…¹©¼ƒŠPÍ•È•ÍÁ¥É¥ÑÕ…°•±•ÍÑ¥…°•¹Ù¥…‘¼Á½È•ÕÌ½µ¼µ•¹Í…•¥É¼ˆ°(€€€€€€‰µ•¹Í…•¥É¼ƒŠPÁ•ÍÍ½„¡Õµ…¹„•¹Ù¥…‘„½´Õµ„µ•¹Í…•´€¡ÕÍ¼Í•Õ¹“…É¥¼°µ…¥ÌÉ…É¼¤ˆ°(€€€t°(€ô°(€ØÔÈèì(€€€½É¥¥¹…°è€‹†ò>>3>>:ÿ:ï:ÿ>ˆ°(€€€ÑÉ…¹Í±¥Ñ•É…Ñ¥½¸è€‰Á½ÍÑ½±½Ìˆ°(€€€Á¡½¹•Ñ¥Œè€‰…Àµ½ÌœµÑ½°µ½Ìˆ°(€€€Á…ÉÑ=™MÁ•• è€‰MÕ‰ÍÑ…¹Ñ¥Ù¼µ…ÍÕ±¥¹¼ˆ°(€€€µ•…¹¥¹œè(€€€€€€‰ÃÍÍÑ½±¼ƒŠP•¹Ù¥…‘¼½´…ÕÑ½É¥‘…‘”ìÓµÑÕ±¼‘½Ì½é””‘”½ÕÑÉ½Ì•¹Ù¥…‘½Ì‘¥É•Ñ…µ•¹Ñ”Á½ÈÉ¥ÍÑ¼ˆ°(€€€‘•™¥¹¥Ñ¥½¹Ìèl(€€€€€€‰…ÃÍÍÑ½±¼ƒŠP•¹Ù¥…‘¼½´…ÕÑ½É¥‘…‘”Á½ÈÉ¥ÍÑ¼°ÓµÑÕ±¼‘½Ì½é””‘”½ÕÑÉ½Ì½µ¼A…Õ±¼ˆ°(€€€€€€•¹Ù¥…‘¼°µ•¹Í…•¥É¼ƒŠPÍ•¹Ñ¥‘¼µ…¥Ì•É…°‘”€‰…ÅÕ•±”ÅÕ”ƒ¤•¹Ù¥…‘¼ˆ€¡ÕÍ¼•Ñ¥µ½³Í¥¼Í•Õ¹“…É¥¼¤œ°(€€€t°(€ô°(€ÄĞÄÄèì(€€€½É¥¥¹…°è€‹:Ó>7:÷:Ç:ó:ç>ˆ°(€€€ÑÉ…¹Í±¥Ñ•É…Ñ¥½¸è€‰å¹…µ¥Ìˆ°(€€€Á¡½¹•Ñ¥Œè€‰‘½¼œµ¹…´µ¥Ìˆ°(€€€Á…ÉÑ=™MÁ•• è€‰MÕ‰ÍÑ…¹Ñ¥Ù¼™•µ¥¹¥¹¼ˆ°(€€€µ•…¹¥¹œè€‰A½‘•ÈƒŠP…Á…¥‘…‘””™½Ë„ì™É•ÅÕ•¹Ñ•µ•¹Ñ”¼Á½‘•È‘”•ÕÌµ…¹¥™•ÍÑ¼•´µ¥±…É•Ìˆ°(€€€‘•™¥¹¥Ñ¥½¹Ìèl(€€€€€€‰Á½‘•È°™½Ë„ƒŠP…Á…¥‘…‘”‘”É•…±¥é…È°•ÍÁ•¥…±µ•¹Ñ”¼Á½‘•È‘”•ÕÌˆ°(€€€€€€‰µ¥±…É”°½‰É„Á½‘•É½Í„ƒŠPµ…¹¥™•ÍÑ‡Ÿ¼½¹É•Ñ„‘•ÍÍ”Á½‘•È€¡ÕÍ¼½¹É•Ñ¼¹¼9P¤ˆ°(€€€t°(€ô°)ôì()™Õ¹Ñ¥½¸É…ˆ¡¡Ñµ°èÍÑÉ¥¹œ°±…‰•°èÍÑÉ¥¹œ¤èÍÑÉ¥¹œğ¹Õ±°ì(€½¹ÍĞÉ”€ô¹•ÜI•áÀ¡€µqqÌ¨‘í±…‰•±ôéqqÌ¨ üèñˆø¤ü ¸¨ü¤ üèğ½ˆø¤ıqqÌ¨ñÁ€°€‰¤ˆ¤ì(€½¹ÍĞ´€ô¡Ñµ°¹µ…Ñ ¡É”¤ì(€½¹ÍĞÙ…±Õ”€ô´€üÍÑÉ¥ÁQ…Ì¡µlÅt¤€è€ˆˆì(€É•ÑÕÉ¸Ù…±Õ”ñğ¹Õ±°ì)ô((¼¨¨½Éµ…Ñ¼‘”…‘„¥Ñ•´‘•Ù½±Ù¥‘¼Á½È€½‘¥Ñ¥½¹…Éäµ‘•™¥¹¥Ñ¥½¸½		P¼ñ½‘”ø¼(€¨€¡Ù•È‘½Õµ•¹Ñ‡Ÿ¼½™¥¥…°‘„‰½±±Ì¹±¥™”¤¸³¥´‘¼!Q50±¥ÙÉ”•´(€¨‘•™¥¹¥Ñ¥½¹€°„A$«„‘•Ù½±Ù”…µÁ½Ì•ÍÑÉÕÑÕÉ…‘½Ì”½¹™§…Ù•¥ÌƒŠP(€¨±•á•µ•€°ÑÉ…¹Í±¥Ñ•É…Ñ¥½¹€°ÁÉ½¹Õ¹¥…Ñ¥½¹€°Í¡½ÉÑ}‘•™¥¹¥Ñ¥½¹€ƒŠPÅÕ”(€¨;<‘•Á•¹‘•´‘”„™½Éµ…Ñ‡Ÿ¼‘¼!Q50Í•Õ¥ÈÕ´Á…‘Ë¼‘”ËÍÑÕ±½Ì¸€¨¼)ÑåÁ”	½±±Í¥Ñ!¥Ğ€ôì(€Ñ½Á¥ŒèÍÑÉ¥¹œì(€‘•™¥¹¥Ñ¥½¸èÍÑÉ¥¹œì(€±•á•µ”üèÍÑÉ¥¹œğ¹Õ±°ì(€ÑÉ…¹Í±¥Ñ•É…Ñ¥½¸üèÍÑÉ¥¹œğ¹Õ±°ì(€ÁÉ½¹Õ¹¥…Ñ¥½¸üèÍÑÉ¥¹œğ¹Õ±°ì(€Í¡½ÉÑ}‘•™¥¹¥Ñ¥½¸üèÍÑÉ¥¹œğ¹Õ±°ì)ôì()™Õ¹Ñ¥½¸Á…ÉÍ••™¥¹¥Ñ¥½¹A…É…É…Á¡Ì¡¡Ñµ°èÍÑÉ¥¹œ¤èÍÑÉ¥¹mtì(€½¹ÍĞ‘•™	±½¬€ô¡Ñµ°¹ÍÁ±¥Ğ ¼ñÀ±…ÍÌô‰‘•˜ˆø¸¨üñp½Àø½¤¥lÅt€üü€ˆˆì(€½¹ÍĞ‰•™½É•=É¥¥¸€ô‘•™	±½¬¹ÍÁ±¥Ğ ¼ñÀ±…ÍÌô‰½É¥¥¸ˆ½¤¥lÁt€üü€ˆˆì(€É•ÑÕÉ¸‰•™½É•=É¥¥¸(€€€€¹ÍÁ±¥Ğ ¼ñp½Àø½¤¤(€€€€¹µ…À ¡À¤€ôøÍÑÉ¥ÁQ…Ì¡À¤¤(€€€€¹™¥±Ñ•È ¡À¤€ôøÀ¹±•¹Ñ €ø€Ä¤ì)ô()½¹ÍĞM=9}M9M}5a}19Q €ô€äÀì()™Õ¹Ñ¥½¸‰Õ¥±‘5•…¹¥¹œ (€Í¡½ÉÑ•™¥¹¥Ñ¥½¸èÍÑÉ¥¹œğ¹Õ±°°(€‘•™¥¹¥Ñ¥½¹ÌèÍÑÉ¥¹mt°(€ÍÑÉ½¹Í±½ÍÌèÍÑÉ¥¹œğ¹Õ±°°(¤èÍÑÉ¥¹œğ¹Õ±°ì(€½¹ÍĞÁÉ¥µ…Éä€ôÍ¡½ÉÑ•™¥¹¥Ñ¥½¸ñğ‘•™¥¹¥Ñ¥½¹ÍlÁtñğÍÑÉ½¹Í±½ÍÌñğ¹Õ±°ì(€¥˜€ …ÁÉ¥µ…Éä¤É•ÑÕÉ¸¹Õ±°ì((€€¼¼M”¼Í•¹Ñ¥‘¼ÁÉ¥¹¥Á…°«„Ù•¥¼‘¼Í¡½ÉÑ}‘•™¥¹¥Ñ¥½¹€½™¥¥…°°¼€Ë
è(€€¼¼Í•¹Ñ¥‘¼…¹‘¥‘…Ñ¼ƒ¤¼ÁËÍÁÉ¥¼€Ç
èÁ…Ë…É…™¼‘¼³¥á¥¼ì…Í¼½¹ÑË…É¥¼°(€€¼¼ƒ¤¼€Ë
èÁ…Ë…É…™¼€¡«„ÅÕ”¼€Ç
èÙ¥É½Ô¼Í•¹Ñ¥‘¼ÁÉ¥¹¥Á…°¤¸(€½¹ÍĞ…¹‘¥‘…Ñ•Ì€ôÍ¡½ÉÑ•™¥¹¥Ñ¥½¸€ü‘•™¥¹¥Ñ¥½¹Ì€è‘•™¥¹¥Ñ¥½¹Ì¹Í±¥” Ä¤ì(€½¹ÍĞÍ•½¹‘…Éä€ô…¹‘¥‘…Ñ•Ì¹™¥¹ (€€€€¡¤€ôø(€€€€€¹±•¹Ñ €ø€À€˜˜(€€€€€¹±•¹Ñ €ğôM=9}M9M}5a}19Q €˜˜(€€€€€¹Ñ½1½İ•É…Í” ¤€„ôôÁÉ¥µ…Éä¹Ñ½1½İ•É…Í” ¤°(€€¤ì(€É•ÑÕÉ¸Í•½¹‘…Éä€ü€‘íÁÉ¥µ…Éåôì€‘íÍ•½¹‘…Éåõ€€èÁÉ¥µ…Éäì)ô((¼¨¨5½¹Ñ„Õ´MÑÉ½¹¹ÑÉä„Á…ÉÑ¥È‘”Õ´¥Ñ•´‰ÉÕÑ¼‘•Ù½±Ù¥‘¼Á•±„A$‘”(€¨‘¥¥½»…É¥¼‘„‰½±±Ì¹±¥™”¸UÍ„½Ì…µÁ½Ì•ÍÑÉÕÑÕÉ…‘½Ì€¡±•á•µ•€°(€¨ÑÉ…¹Í±¥Ñ•É…Ñ¥½¹€°ÁÉ½¹Õ¹¥…Ñ¥½¹€°Í¡½ÉÑ}‘•™¥¹¥Ñ¥½¹€¤½µ¼™½¹Ñ”(€¨ÁÉ¥·…É¥„ƒŠP•±•ÌÛ©´Í•µÁÉ”ÁÉ••¹¡¥‘½ÌÁ•±„A$°¥¹‘•Á•¹‘•¹Ñ•µ•¹Ñ”‘”¼(€¨!Q50‘”‘•™¥¹¥Ñ¥½¹€Í•Õ¥È½Ô»¼¼Á…‘Ë¼‘”ËÍÑÕ±½Ì•ÍÁ•É…‘¼¸=Ì(€¨ËÍÑÕ±½Ì‘•¹ÑÉ¼‘¼!Q50€ ‰A…ÉĞ¡Ì¤½˜ÍÁ•• èˆ°€‰=É¥¥¸èˆ¤½¹Ñ¥¹Õ…´Í•¹‘¼(€¨±¥‘½Ì½µ¼½µÁ±•µ•¹Ñ¼°ÅÕ…¹‘¼‘¥ÍÁ½»µÙ•¥Ì¸€¨¼)™Õ¹Ñ¥½¸‰Õ¥±‘MÑÉ½¹¹ÑÉä¡¡¥Ğè	½±±Í¥Ñ!¥Ğ¤èMÑÉ½¹¹ÑÉäì(€½¹ÍĞ½‘”€ô€¡¡¥Ğ¹Ñ½Á¥Œ€üü€ˆˆ¤¹Ñ½UÁÁ•É…Í” ¤ì(€½¹ÍĞ¡Ñµ°€ô¡¥Ğ¹‘•™¥¹¥Ñ¥½¸€üü€ˆˆì((€½¹ÍĞ‘•™¥¹¥Ñ¥½¹Ì€ôÁ…ÉÍ••™¥¹¥Ñ¥½¹A…É…É…Á¡Ì¡¡Ñµ°¤ì(€½¹ÍĞÍÑÉ½¹Í5…Ñ €ô¡Ñµ°¹µ…Ñ  ¼µqÌ©MÑÉ½¹ÌéqÌ¨¡mqÍqMt¨ü¤ üèñÁğ¤½¤¤ì(€½¹ÍĞÍÑÉ½¹Í±½ÍÌ€ôÍÑÉ½¹Í5…Ñ €üÍÑÉ¥ÁQ…Ì¡ÍÑÉ½¹Í5…Ñ¡lÅt¤€è¹Õ±°ì(€½¹ÍĞÍ¡½ÉÑ•™¥¹¥Ñ¥½¸€ô¡¥Ğ¹Í¡½ÉÑ}‘•™¥¹¥Ñ¥½¸€üÍÑÉ¥ÁQ…Ì¡¡¥Ğ¹Í¡½ÉÑ}‘•™¥¹¥Ñ¥½¸¤€è¹Õ±°ì((€É•ÑÕÉ¸ì(€€€½‘”°(€€€½É¥¥¹…°è¡¥Ğ¹±•á•µ”ñğÉ…ˆ¡¡Ñµ°°€‰=É¥¥¹…°ˆ¤°(€€€ÑÉ…¹Í±¥Ñ•É…Ñ¥½¸è¡¥Ğ¹ÑÉ…¹Í±¥Ñ•É…Ñ¥½¸ñğÉ…ˆ¡¡Ñµ°°€‰QÉ…¹Í±¥Ñ•É…Ñ¥½¸ˆ¤°(€€€Á¡½¹•Ñ¥Œè¡¥Ğ¹ÁÉ½¹Õ¹¥…Ñ¥½¸ñğÉ…ˆ¡¡Ñµ°°€‰A¡½¹•Ñ¥Œˆ¤°(€€€Á…ÉÑ=™MÁ•• èÑÉ…¹Í±…Ñ•É…µµ…ÉQ•ÉµÌ¡É…ˆ¡¡Ñµ°°€‰A…ÉÑqp¡Íqp¤½˜ÍÁ•• ˆ¤¤°(€€€½É¥¥¸èÑÉ…¹Í±…Ñ•É…µµ…ÉQ•ÉµÌ¡É…ˆ¡¡Ñµ°°€‰=É¥¥¸ˆ¤¤°(€€€‘•™¥¹¥Ñ¥½¹Ìè‘•™¥¹¥Ñ¥½¹Ì¹±•¹Ñ €ü‘•™¥¹¥Ñ¥½¹Ì€èÍ¡½ÉÑ•™¥¹¥Ñ¥½¸€ümÍ¡½ÉÑ•™¥¹¥Ñ¥½¹t€èmt°(€€€ÍÑÉ½¹Í±½ÍÌ°(€€€µ•…¹¥¹œè‰Õ¥±‘5•…¹¥¹œ¡Í¡½ÉÑ•™¥¹¥Ñ¥½¸°‘•™¥¹¥Ñ¥½¹Ì°ÍÑÉ½¹Í±½ÍÌ¤°(€€€É•±…Ñ•èÉÉ…ä¹™É½´¡¹•ÜM•Ğ ¡¡Ñµ°¹µ…Ñ  ½Lè¡m!uq¬¤½œ¤€üümt¤¹µ…À ¡Ì¤€ôøÌ¹Í±¥” È¤¤¤¤¹™¥±Ñ•È (€€€€€€¡Œ¤€ôøŒ€„ôô½‘”°(€€€€¤°(€€€ÕÉ…Ñ•è™…±Í”°(€€€ÑÉ…¹Í±…Ñ¥½¹MÑ…ÑÕÌè€‰™½¹Ñ”µ½É¥¥¹…°ˆ°(€€€Í½ÕÉ”è€‰	É½İ¸µÉ¥Ù•Èµ	É¥Ì€¼Q¡…å•ÈÙ¥„‰½±±Ì¹±¥™”ˆ°(€ôì)ô()ÑåÁ”=Á•¹AÑ1•á¥½¹I•½É€ôì(€¼èÍÑÉ¥¹œğ¹Õ±°ì(€ĞèÍÑÉ¥¹œğ¹Õ±°ì(€ÀèÍÑÉ¥¹œğ¹Õ±°ì(€œèÍÑÉ¥¹œì(€”èÍÑÉ¥¹œì(€èÍÑÉ¥¹mtì(€ÈèÍÑÉ¥¹mtì)ôì()½¹ÍĞ½Á•¹AÑ	Õ­•ÑÌ€ô¹•Ü5…ÀñÍÑÉ¥¹œ°AÉ½µ¥Í”ñI•½ÉñÍÑÉ¥¹œ°=Á•¹AÑ1•á¥½¹I•½Éøøø ¤ì()™Õ¹Ñ¥½¸½Á•¹AÑ	Õ­•Ñ½È¡½‘”èÍÑÉ¥¹œ¤èÍÑÉ¥¹œğ¹Õ±°ì(€½¹ÍĞµ…Ñ €ô½‘”¹Ñ½UÁÁ•É…Í” ¤¹µ…Ñ  ½x¡m!t¤¡q¬¤¼¤ì(€É•ÑÕÉ¸µ…Ñ €ü€‘íµ…Ñ¡lÅuô‘í5…Ñ ¹™±½½È¡9Õµ‰•È¡µ…Ñ¡lÉt¤€¼€ÄÀÀ¥õ€€è¹Õ±°ì)ô()™Õ¹Ñ¥½¸±½…‘=Á•¹AÑ	Õ­•Ğ¡‰Õ­•ĞèÍÑÉ¥¹œ¤èAÉ½µ¥Í”ñI•½ÉñÍÑÉ¥¹œ°=Á•¹AÑ1•á¥½¹I•½Éøøì(€±•ĞÁÉ½µ¥Í”€ô½Á•¹AÑ	Õ­•ÑÌ¹•Ğ¡‰Õ­•Ğ¤ì(€¥˜€ …ÁÉ½µ¥Í”¤ì(€€€ÁÉ½µ¥Í”€ô™•Ñ ¡€½‘…Ñ„½±•á¥½¸µÁĞ¼‘í‰Õ­•Ñô¹©Í½¹€¤(€€€€€€¹Ñ¡•¸ ¡É•ÍÁ½¹Í”¤€ôø€¡É•ÍÁ½¹Í”¹½¬€üÉ•ÍÁ½¹Í”¹©Í½¸ ¤€èíô¤¤(€€€€€€¹…Ñ   ¤€ôø€¡íô¤¤ì(€€€½Á•¹AÑ	Õ­•ÑÌ¹Í•Ğ¡‰Õ­•Ğ°ÁÉ½µ¥Í”¤ì(€ô(€É•ÑÕÉ¸ÁÉ½µ¥Í”ì)ô()…Íå¹Œ™Õ¹Ñ¥½¸™•Ñ¡=Á•¹AÑ¹ÑÉä¡½‘”èÍÑÉ¥¹œ¤èAÉ½µ¥Í”ñMÑÉ½¹¹ÑÉäğ¹Õ±°øì(€½¹ÍĞ‰Õ­•Ğ€ô½Á•¹AÑ	Õ­•Ñ½È¡½‘”¤ì(€¥˜€ …‰Õ­•Ğ¤É•ÑÕÉ¸¹Õ±°ì(€½¹ÍĞÉ•½É€ô€¡…İ…¥Ğ±½…‘=Á•¹AÑ	Õ­•Ğ¡‰Õ­•Ğ¤¥m½‘•tì(€¥˜€ …É•½É¤É•ÑÕÉ¸¹Õ±°ì(€½¹ÍĞ‘•™¥¹¥Ñ¥½¹Ì€ôÉ•½É¹¹™¥±Ñ•È¡	½½±•…¸¤¹Í±¥” À°€Ì¤ì(€É•ÑÕÉ¸ì(€€€½‘”°(€€€½É¥¥¹…°èÉ•½É¹¼°(€€€ÑÉ…¹Í±¥Ñ•É…Ñ¥½¸èÉ•½É¹Ğ°(€€€Á¡½¹•Ñ¥ŒèÉ•½É¹À°(€€€Á…ÉÑ=™MÁ•• èÑÉ…¹Í±…Ñ•É…µµ…ÉQ•ÉµÌ¡É•½É¹œ¤°(€€€½É¥¥¸èÑÉ…¹Í±…Ñ•É…µµ…ÉQ•ÉµÌ¡É•½É¹”¤°(€€€‘•™¥¹¥Ñ¥½¹Ì°(€€€ÍÑÉ½¹Í±½ÍÌè‘•™¥¹¥Ñ¥½¹Ì¹©½¥¸ ˆì€ˆ¤ñğ¹Õ±°°(€€€µ•…¹¥¹œè‰Õ¥±‘5•…¹¥¹œ¡‘•™¥¹¥Ñ¥½¹ÍlÁt€üü¹Õ±°°‘•™¥¹¥Ñ¥½¹Ì¹Í±¥” Ä¤°¹Õ±°¤°(€€€É•±…Ñ•èÉ•½É¹È°(€€€ÕÉ…Ñ•è™…±Í”°(€€€ÑÉ…¹Í±…Ñ¥½¹MÑ…ÑÕÌè€‰…ÕÑ½µ…Ñ¥¼ˆ°(€€€Í½ÕÉ”è€‰	½Q¡…å•Èƒ
ÜÑÉ…‘×Ÿ¼½™™±¥¹”…‰•ÉÑ„Á…É„Á½ÉÑÕ×©Ìˆ°(€ôì)ô((¼¨¨Y•É‰•Ñ”‘¼³¥á¥¼€¡	Á…É„¡•‰É…¥¼°Q¡…å•ÈÁ…É„É•¼¤¸(€¨(€¨A…É„½ÌÍ‘¥½ÌÁÉ•Í•¹Ñ•Ì•´=I}QI5L°¼É•ÍÕ±Ñ…‘¼ƒ¤µ½¹Ñ…‘¼(€¨‘¥É•Ñ…µ•¹Ñ”„Á…ÉÑ¥È‘„±¥ÍÑ„ÕÉ…‘„€¡½¹™•É¥‘„µ…¹Õ…±µ•¹Ñ”¤”»¼(€¨‘•Á•¹‘”‘„™½¹Ñ”•áÑ•É¹„¹•´‘”¡•ÕËµÍÑ¥„‘”±•¥ÑÕÉ„‘”!Q50ƒŠP…É…¹Ñ”(€¨ÅÕ”Á…±…ÙÉ…ÌÑ•½±½¥…µ•¹Ñ”•¹ÑÉ…¥Ì€¡±½¡¥´°e!] °É¥ÍÑ¼°ÍÃµÉ¥Ñ¼(€¨•ÑŒ¸¤Í•µÁÉ”ÑÉ……´¼Í•¹Ñ¥‘¼½ÉÉ•Ñ¼¸€¨¼)•áÁ½ÉĞ…Íå¹Œ™Õ¹Ñ¥½¸™•Ñ¡MÑÉ½¹¹ÑÉä¡½‘”èÍÑÉ¥¹œ¤èAÉ½µ¥Í”ñMÑÉ½¹¹ÑÉäğ¹Õ±°øì(€½¹ÍĞÕÁÁ•É½‘”€ô½‘”¹Ñ½UÁÁ•É…Í” ¤ì(€€¼¼€‰ØÔˆ¹„¡…Ù”è¹½Ù„Ù•ÉÏ¼Á…É„¥¹Ù…±¥‘…ÈEU1EUH…¡”…¹Ñ•É¥½È(€€¼¼€¡±½…±MÑ½É…”‘¼¹…Ù•…‘½È‘¼ÕÍ×…É¥¼¤ÅÕ”Á½ÍÍ„Ñ•ÈÍ¥‘¼Í…±Ù¼…¹Ñ•Ì(€€¼¼‘”„±¥ÍÑ„ÕÉ…‘„€¡=I}QI5L¤•ÍÑ…È½µÁ±•Ñ„ƒŠPÍ•´¥ÍÍ¼°ÅÕ•´«„(€€¼¼Ñ¥Ù•ÍÍ”…‰•ÉÑ¼Õ´Ù•ÉÏµÕ±¼…¹Ñ•ÌÁ•Éµ…¹••É¥„Ù•¹‘¼‘…‘½Ì…¹Ñ¥½Ì¼(€€¼¼¥¹½µÁ±•Ñ½ÌÁ…É„Í•µÁÉ”°µ•Íµ¼‘•Á½¥Ì‘¼‘•Á±½ä‘„½ÉÉ—Ÿ¼¸(€½¹ÍĞ…¡•-•ä€ôÍÑÉ½¹œéØØè‘íÕÁÁ•É½‘•õ€ì(€½¹ÍĞ½Ù•ÉÉ¥‘”€ô=I}QI5MmÕÁÁ•É½‘•tì(€¥˜€¡½Ù•ÉÉ¥‘”¤ì(€€€É•ÑÕÉ¸…¡•¡…¡•-•ä°…Íå¹Œ€ ¤€ôøì(€€€€€½¹ÍĞ‘•™¥¹¥Ñ¥½¹Ì€ô½Ù•ÉÉ¥‘”¹‘•™¥¹¥Ñ¥½¹Ì€üüm½Ù•ÉÉ¥‘”¹µ•…¹¥¹tì(€€€€€É•ÑÕÉ¸ì(€€€€€€€½‘”èÕÁÁ•É½‘”°(€€€€€€€½É¥¥¹…°è½Ù•ÉÉ¥‘”¹½É¥¥¹…°°(€€€€€€€ÑÉ…¹Í±¥Ñ•É…Ñ¥½¸è½Ù•ÉÉ¥‘”¹ÑÉ…¹Í±¥Ñ•É…Ñ¥½¸°(€€€€€€€Á¡½¹•Ñ¥Œè½Ù•ÉÉ¥‘”¹Á¡½¹•Ñ¥Œ€üü¹Õ±°°(€€€€€€€Á…ÉÑ=™MÁ•• è½Ù•ÉÉ¥‘”¹Á…ÉÑ=™MÁ•• €üü¹Õ±°°(€€€€€€€½É¥¥¸è¹Õ±°°(€€€€€€€‘•™¥¹¥Ñ¥½¹Ì°(€€€€€€€ÍÑÉ½¹Í±½ÍÌè½Ù•ÉÉ¥‘”¹µ•…¹¥¹œ°(€€€€€€€µ•…¹¥¹œè½Ù•ÉÉ¥‘”¹µ•…¹¥¹œ°(€€€€€€€É•±…Ñ•èmt°(€€€€€€€ÕÉ…Ñ•èÑÉÕ”°(€€€€€€€ÑÉ…¹Í±…Ñ¥½¹MÑ…ÑÕÌè€‰É•Ù¥Í…‘¼ˆ°(€€€€€€€Í½ÕÉ”è€‰Y•É‰•Ñ”É•Ù¥Í…‘¼µ…¹Õ…±µ•¹Ñ”„Á…ÉÑ¥È‘¼³¥á¥¼”‘¼½¹Ñ•áÑ¼‹µ‰±¥¼ˆ°(€€€€€ôì(€€€ô¤ì(€ô((€É•ÑÕÉ¸…¡•¡…¡•-•ä°…Íå¹Œ€ ¤€ôøì(€€€½¹ÍĞ±½…±¹ÑÉä€ô…İ…¥Ğ™•Ñ¡=Á•¹AÑ¹ÑÉä¡ÕÁÁ•É½‘”¤ì(€€€¥˜€¡±½…±¹ÑÉä¤É•ÑÕÉ¸±½…±¹ÑÉäì((€€€½¹ÍĞÉ•Ì€ô…İ…¥Ğ™•Ñ ¡€‘íA%ô½‘¥Ñ¥½¹…Éäµ‘•™¥¹¥Ñ¥½¸½		P¼‘íÕÁÁ•É½‘•ô½€¤ì(€€€¥˜€ …É•Ì¹½¬¤É•ÑÕÉ¸¹Õ±°ì(€€€½¹ÍĞ©Í½¸€ô€¡…İ…¥ĞÉ•Ì¹©Í½¸ ¤¤…Ì	½±±Í¥Ñ!¥Ñmtì(€€€¥˜€ …ÉÉ…ä¹¥ÍÉÉ…ä¡©Í½¸¤ñğ©Í½¸¹±•¹Ñ €ôôô€À¤É•ÑÕÉ¸¹Õ±°ì(€€€½¹ÍĞ¡¥Ğ€ô©Í½¸¹™¥¹ ¡¤€ôø¹Ñ½Á¥Œü¹Ñ½UÁÁ•É…Í” ¤€ôôôÕÁÁ•É½‘”¤€üü©Í½¹lÁtì(€€€¥˜€ …¡¥Ğ¤É•ÑÕÉ¸¹Õ±°ì(€€€É•ÑÕÉ¸‰Õ¥±‘MÑÉ½¹¹ÑÉä¡¡¥Ğ¤ì(€ô¤ì)ô()•áÁ½ÉĞ…Íå¹Œ™Õ¹Ñ¥½¸™•Ñ¡MÑÉ½¹¹ÑÉ¥•Ì¡½‘•ÌèÍÑÉ¥¹mt¤èAÉ½µ¥Í”ñI•½ÉñÍÑÉ¥¹œ°MÑÉ½¹¹ÑÉäøøì(€½¹ÍĞÕ¹¥ÅÕ”€ôÉÉ…ä¹™É½´¡¹•ÜM•Ğ¡½‘•Ì¤¤ì(€½¹ÍĞÉ•ÍÕ±ÑÌ€ô…İ…¥ĞAÉ½µ¥Í”¹…±°¡Õ¹¥ÅÕ”¹µ…À ¡Œ¤€ôø™•Ñ¡MÑÉ½¹¹ÑÉä¡Œ¤¹…Ñ   ¤€ôø¹Õ±°¤¤¤ì(€½¹ÍĞ½ÕĞèI•½ÉñÍÑÉ¥¹œ°MÑÉ½¹¹ÑÉäø€ôíôì(€Õ¹¥ÅÕ”¹™½É…  ¡Œ°¤¤€ôøì(€€€½¹ÍĞ•¹ÑÉä€ôÉ•ÍÕ±ÑÍm¥tì(€€€¥˜€¡•¹ÑÉä¤½ÕÑmt€ô•¹ÑÉäì(€ô¤ì(€É•ÑÕÉ¸½ÕĞì)ô()•áÁ½ÉĞÑåÁ”=ÕÉÉ•¹”€ôìŒè¹Õµ‰•Èì˜èm¹Õµ‰•È°¹Õµ‰•È°¹Õµ‰•Étì°èm¹Õµ‰•È°¹Õµ‰•È°¹Õµ‰•Étôì()±•Ğ½ÕÉÉ•¹•ÍAÉ½µ¥Í”èAÉ½µ¥Í”ñI•½ÉñÍÑÉ¥¹œ°=ÕÉÉ•¹”øøğ¹Õ±°€ô¹Õ±°ì((¼¨¨ƒ5¹‘¥”‘”½½ÉË©¹¥…ÌÁ½È»éµ•É¼‘”MÑÉ½¹œ€¡½¹Ñ…•´°ÁÉ¥µ•¥É„”ƒé±Ñ¥µ„¤¸€¨¼)•áÁ½ÉĞ™Õ¹Ñ¥½¸±½…‘=ÕÉÉ•¹•Ì ¤èAÉ½µ¥Í”ñI•½ÉñÍÑÉ¥¹œ°=ÕÉÉ•¹”øøì(€¥˜€ …½ÕÉÉ•¹•ÍAÉ½µ¥Í”¤ì(€€€½ÕÉÉ•¹•ÍAÉ½µ¥Í”€ô™•Ñ  ˆ½‘…Ñ„½ÍÑÉ½¹Ìµ½ÕÉÉ•¹•Ì¹©Í½¸ˆ¤(€€€€€€¹Ñ¡•¸ ¡È¤€ôø€¡È¹½¬€üÈ¹©Í½¸ ¤€èíô¤¤(€€€€€€¹…Ñ   ¤€ôø€¡íô¤¤ì(€ô(€É•ÑÕÉ¸½ÕÉÉ•¹•ÍAÉ½µ¥Í”ì)ô()•áÁ½ÉĞÑåÁ”aÉ•™Q…É•Ğ€ôm¹Õµ‰•È°¹Õµ‰•È°¹Õµ‰•Étì()½¹ÍĞáÉ•™…¡”€ô¹•Ü5…Àñ¹Õµ‰•È°AÉ½µ¥Í”ñI•½ÉñÍÑÉ¥¹œ°aÉ•™Q…É•Ñmtøøø ¤ì((¼¨¨I•™•Ë©¹¥…ÌÉÕé…‘…ÌÉ•…¥Ì€¡½Á•¹‰¥‰±”¹¥¹™¼°µ	d¤Á…É„Õ´±¥ÙÉ¼¸€¨¼)•áÁ½ÉĞ™Õ¹Ñ¥½¸±½…‘aÉ•™Ì¡‰½½¬è¹Õµ‰•È¤èAÉ½µ¥Í”ñI•½ÉñÍÑÉ¥¹œ°aÉ•™Q…É•Ñmtøøì(€±•ĞÀ€ôáÉ•™…¡”¹•Ğ¡‰½½¬¤ì(€¥˜€ …À¤ì(€€€À€ô™•Ñ ¡€½‘…Ñ„½áÉ•™Ì¼‘í‰½½­ô¹©Í½¹€¤(€€€€€€¹Ñ¡•¸ ¡È¤€ôø€¡È¹½¬€üÈ¹©Í½¸ ¤€èíô¤¤(€€€€€€¹…Ñ   ¤€ôø€¡íô¤¤ì(€€€áÉ•™…¡”¹Í•Ğ¡‰½½¬°À¤ì(€ô(€É•ÑÕÉ¸Àì)ô()•áÁ½ÉĞ…Íå¹Œ™Õ¹Ñ¥½¸É½ÍÍI•™•É•¹•Í½È (€‰½½¬è¹Õµ‰•È°(€¡…ÁÑ•Èè¹Õµ‰•È°(€Ù•ÉÍ”è¹Õµ‰•È°(¤èAÉ½µ¥Í”ñaÉ•™Q…É•Ñmtøì(€½¹ÍĞ‘…Ñ„€ô…İ…¥Ğ±½…‘aÉ•™Ì¡‰½½¬¤ì(€É•ÑÕÉ¸‘…Ñ…m€‘í¡…ÁÑ•Éôè‘íÙ•ÉÍ•õt€üümtì)ô((¼¨¨	ÕÍ„Ñ•áÑÕ…°¹¼…ÃµÑÕ±¼½ÑÉ…‘×Ÿ¼•Í½±¡¥‘½Ì€¡•¹‘Á½¥¹Ğ½™¥¥…°‘„™½¹Ñ”¤¸€¨¼)•áÁ½ÉĞ…Íå¹Œ™Õ¹Ñ¥½¸Í•…É¡	¥‰±” (€ÑÉ…¹Í±…Ñ¥½¸èÍÑÉ¥¹œ°(€ÅÕ•ÉäèÍÑÉ¥¹œ°(¤èAÉ½µ¥Í”ñì‰½½¬è¹Õµ‰•Èì¡…ÁÑ•Èè¹Õµ‰•ÈìÙ•ÉÍ”è¹Õµ‰•ÈìÑ•áĞèÍÑÉ¥¹œõmtøì(€½¹ÍĞÕÉ°€ô€‘íA%ô½ØÈ½™¥¹¼‘íÑÉ…¹Í±…Ñ¥½¹ôıÍ•…É ô‘í•¹½‘•UI%½µÁ½¹•¹Ğ¡ÅÕ•Éä¥ô™µ…Ñ¡}…Í”õ™…±Í”™µ…Ñ¡}İ¡½±”õ™…±Í•€ì(€½¹ÍĞÉ•Ì€ô…İ…¥Ğ™•Ñ ¡ÕÉ°¤ì(€¥˜€ …É•Ì¹½¬¤Ñ¡É½Ü¹•ÜÉÉ½È ‰	ÕÍ„¥¹‘¥ÍÁ½»µÙ•°¹¼µ½µ•¹Ñ¼¸ˆ¤ì(€½¹ÍĞ©Í½¸€ô€¡…İ…¥ĞÉ•Ì¹©Í½¸ ¤¤…Ìì(€€€É•ÍÕ±ÑÌüèì‰½½¬è¹Õµ‰•Èì¡…ÁÑ•Èè¹Õµ‰•ÈìÙ•ÉÍ”è¹Õµ‰•ÈìÑ•áĞèÍÑÉ¥¹œõmtì(€ôì(€½¹ÍĞ±¥ÍĞ€ô©Í½¸¹É•ÍÕ±ÑÌ€üümtì(€É•ÑÕÉ¸±¥ÍĞ¹Í±¥” À°€ØÀ¤¹µ…À ¡È¤€ôø€¡ì(€€€‰½½¬èÈ¹‰½½¬°(€€€¡…ÁÑ•ÈèÈ¹¡…ÁÑ•È°(€€€Ù•ÉÍ”èÈ¹Ù•ÉÍ”°(€€€Ñ•áĞèÍÑÉ¥ÁQ…Ì¡È¹Ñ•áĞ¤°(€ô¤¤ì)ô((¼¨¨U´ƒé¹¥¼Ù•ÉÏµÕ±¼•´Á½ÉÑÕ×©Ì€¡ÕÍ…‘¼¹…ÌÉ•™•Ë©¹¥…ÌÉÕé…‘…Ì¤¸€¨¼)•áÁ½ÉĞ…Íå¹Œ™Õ¹Ñ¥½¸™•Ñ¡Y•ÉÍ” (€ÑÉ…¹Í±…Ñ¥½¸èÍÑÉ¥¹œ°(€‰½½¬è¹Õµ‰•È°(€¡…ÁÑ•Èè¹Õµ‰•È°(€Ù•ÉÍ”è¹Õµ‰•È°(¤èAÉ½µ¥Í”ñÍÑÉ¥¹œğ¹Õ±°øì(€½¹ÍĞ¡…À€ô…İ…¥Ğ™•Ñ¡¡…ÁÑ•È¡ÑÉ…¹Í±…Ñ¥½¸°‰½½¬°¡…ÁÑ•È¤ì(€É•ÑÕÉ¸¡…À¹™¥¹ ¡Ø¤€ôøØ¹Ù•ÉÍ”€ôôôÙ•ÉÍ”¤ü¹Ñ•áĞ€üü¹Õ±°ì)ô((¼¨¨(€¨1•¥ÑÕÉ„…ÁÉ½á¥µ…‘„•´Á½ÉÑÕ×©ÌƒŠPÑÉ…¹ÍÉ§Ÿ¼Á½ÈÉ•É…Ì„Á…ÉÑ¥È‘„(€¨ÑÉ…¹Í±¥Ñ•É‡Ÿ¼……“©µ¥„¸ƒ$•áÁ±¥¥Ñ…µ•¹Ñ”É½ÑÕ±…‘„½µ¼…ÁÉ½á¥µ‡Ÿ¼¹„(€¨¥¹Ñ•É™…”€¡»¼ƒ¤‘…‘¼‘”™½¹Ñ”……“©µ¥„¤¸(€¨¼)•áÁ½ÉĞ™Õ¹Ñ¥½¸…ÁÁÉ½á¥µ…Ñ•AÑ	È¡ÑÉ…¹Í±¥Ñ•É…Ñ¥½¸èÍÑÉ¥¹œğ¹Õ±°¤èÍÑÉ¥¹œğ¹Õ±°ì(€¥˜€ …ÑÉ…¹Í±¥Ñ•É…Ñ¥½¸¤É•ÑÕÉ¸¹Õ±°ì(€±•ĞÌ€ôÑÉ…¹Í±¥Ñ•É…Ñ¥½¸¹Ñ½1½İ•É…Í” ¤ì(€½¹ÍĞÉÕ±•ÌèmI•áÀ°ÍÑÉ¥¹umt€ôl(€€€l½ ½œ°€‰Œ‰t°(€€€l½Á ½œ°€‰˜‰t°(€€€l½Ñ ½œ°€‰Ğ‰t°(€€€l½­ ½œ°€‰Œ‰t°(€€€l½ÑÌ½œ°€‰Ñè‰t°(€€€l½Í ½œ°€‰ ‰t°(€€€l½½Ô½œ°€‰Ô‰t°(€€€l½•¤½œ°€‰•¤‰t°(€€€l½ä½œ°€‰¤‰t°(€€€l½¬½œ°€‰Œ‰t°(€€€l½ ½œ°€ˆ‰t°(€tì(€™½È€¡½¹ÍĞmÉ”°Ñ½t½˜ÉÕ±•Ì¤Ì€ôÌ¹É•Á±…”¡É”°Ñ¼¤ì(€É•ÑÕÉ¸Ìì)ô