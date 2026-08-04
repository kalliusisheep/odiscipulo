// Metadados dos 66 livros da Bíblia (nomes em pt-BR).
// Número de capítulos conferido com a Almeida Corrigida Fiel (ACF).

export type Testament = "AT" | "NT";

export type BibleBook = {
  id: number;
  name: string;
  abbr: string;
  chapters: number;
  testament: Testament;
};

export const BIBLE_BOOKS: BibleBook[] = [
  { id: 1, name: "Gênesis", abbr: "Gn", chapters: 50, testament: "AT" },
  { id: 2, name: "Êxodo", abbr: "Êx", chapters: 40, testament: "AT" },
  { id: 3, name: "Levítico", abbr: "Lv", chapters: 27, testament: "AT" },
  { id: 4, name: "Números", abbr: "Nm", chapters: 36, testament: "AT" },
  { id: 5, name: "Deuteronômio", abbr: "Dt", chapters: 34, testament: "AT" },
  { id: 6, name: "Josué", abbr: "Js", chapters: 24, testament: "AT" },
  { id: 7, name: "Juízes", abbr: "Jz", chapters: 21, testament: "AT" },
  { id: 8, name: "Rute", abbr: "Rt", chapters: 4, testament: "AT" },
  { id: 9, name: "1 Samuel", abbr: "1Sm", chapters: 31, testament: "AT" },
  { id: 10, name: "2 Samuel", abbr: "2Sm", chapters: 24, testament: "AT" },
  { id: 11, name: "1 Reis", abbr: "1Rs", chapters: 22, testament: "AT" },
  { id: 12, name: "2 Reis", abbr: "2Rs", chapters: 25, testament: "AT" },
  { id: 13, name: "1 Crônicas", abbr: "1Cr", chapters: 29, testament: "AT" },
  { id: 14, name: "2 Crônicas", abbr: "2Cr", chapters: 36, testament: "AT" },
  { id: 15, name: "Esdras", abbr: "Ed", chapters: 10, testament: "AT" },
  { id: 16, name: "Neemias", abbr: "Ne", chapters: 13, testament: "AT" },
  { id: 17, name: "Ester", abbr: "Et", chapters: 10, testament: "AT" },
  { id: 18, name: "Jó", abbr: "Jó", chapters: 42, testament: "AT" },
  { id: 19, name: "Salmos", abbr: "Sl", chapters: 150, testament: "AT" },
  { id: 20, name: "Provérbios", abbr: "Pv", chapters: 31, testament: "AT" },
  { id: 21, name: "Eclesiastes", abbr: "Ec", chapters: 12, testament: "AT" },
  { id: 22, name: "Cânticos", abbr: "Ct", chapters: 8, testament: "AT" },
  { id: 23, name: "Isaías", abbr: "Is", chapters: 66, testament: "AT" },
  { id: 24, name: "Jeremias", abbr: "Jr", chapters: 52, testament: "AT" },
  { id: 25, name: "Lamentações", abbr: "Lm", chapters: 5, testament: "AT" },
  { id: 26, name: "Ezequiel", abbr: "Ez", chapters: 48, testament: "AT" },
  { id: 27, name: "Daniel", abbr: "Dn", chapters: 12, testament: "AT" },
  { id: 28, name: "Oseias", abbr: "Os", chapters: 14, testament: "AT" },
  { id: 29, name: "Joel", abbr: "Jl", chapters: 3, testament: "AT" },
  { id: 30, name: "Amós", abbr: "Am", chapters: 9, testament: "AT" },
  { id: 31, name: "Obadias", abbr: "Ob", chapters: 1, testament: "AT" },
  { id: 32, name: "Jonas", abbr: "Jn", chapters: 4, testament: "AT" },
  { id: 33, name: "Miqueias", abbr: "Mq", chapters: 7, testament: "AT" },
  { id: 34, name: "Naum", abbr: "Na", chapters: 3, testament: "AT" },
  { id: 35, name: "Habacuque", abbr: "Hc", chapters: 3, testament: "AT" },
  { id: 36, name: "Sofonias", abbr: "Sf", chapters: 3, testament: "AT" },
  { id: 37, name: "Ageu", abbr: "Ag", chapters: 2, testament: "AT" },
  { id: 38, name: "Zacarias", abbr: "Zc", chapters: 14, testament: "AT" },
  { id: 39, name: "Malaquias", abbr: "Ml", chapters: 4, testament: "AT" },
  { id: 40, name: "Mateus", abbr: "Mt", chapters: 28, testament: "NT" },
  { id: 41, name: "Marcos", abbr: "Mc", chapters: 16, testament: "NT" },
  { id: 42, name: "Lucas", abbr: "Lc", chapters: 24, testament: "NT" },
  { id: 43, name: "João", abbr: "Jo", chapters: 21, testament: "NT" },
  { id: 44, name: "Atos", abbr: "At", chapters: 28, testament: "NT" },
  { id: 45, name: "Romanos", abbr: "Rm", chapters: 16, testament: "NT" },
  { id: 46, name: "1 Coríntios", abbr: "1Co", chapters: 16, testament: "NT" },
  { id: 47, name: "2 Coríntios", abbr: "2Co", chapters: 13, testament: "NT" },
  { id: 48, name: "Gálatas", abbr: "Gl", chapters: 6, testament: "NT" },
  { id: 49, name: "Efésios", abbr: "Ef", chapters: 6, testament: "NT" },
  { id: 50, name: "Filipenses", abbr: "Fp", chapters: 4, testament: "NT" },
  { id: 51, name: "Colossenses", abbr: "Cl", chapters: 4, testament: "NT" },
  { id: 52, name: "1 Tessalonicenses", abbr: "1Ts", chapters: 5, testament: "NT" },
  { id: 53, name: "2 Tessalonicenses", abbr: "2Ts", chapters: 3, testament: "NT" },
  { id: 54, name: "1 Timóteo", abbr: "1Tm", chapters: 6, testament: "NT" },
  { id: 55, name: "2 Timóteo", abbr: "2Tm", chapters: 4, testament: "NT" },
  { id: 56, name: "Tito", abbr: "Tt", chapters: 3, testament: "NT" },
  { id: 57, name: "Filemom", abbr: "Fm", chapters: 1, testament: "NT" },
  { id: 58, name: "Hebreus", abbr: "Hb", chapters: 13, testament: "NT" },
  { id: 59, name: "Tiago", abbr: "Tg", chapters: 5, testament: "NT" },
  { id: 60, name: "1 Pedro", abbr: "1Pe", chapters: 5, testament: "NT" },
  { id: 61, name: "2 Pedro", abbr: "2Pe", chapters: 3, testament: "NT" },
  { id: 62, name: "1 João", abbr: "1Jo", chapters: 5, testament: "NT" },
  { id: 63, name: "2 João", abbr: "2Jo", chapters: 1, testament: "NT" },
  { id: 64, name: "3 João", abbr: "3Jo", chapters: 1, testament: "NT" },
  { id: 65, name: "Judas", abbr: "Jd", chapters: 1, testament: "NT" },
  { id: 66, name: "Apocalipse", abbr: "Ap", chapters: 22, testament: "NT" },
];

export function bookById(id: number): BibleBook | undefined {
  return BIBLE_BOOKS.find((b) => b.id === id);
}

export function bookNameById(id: number): string {
  return bookById(id)?.name ?? `Livro ${id}`;
}

export function bookAbbrById(id: number): string {
  return bookById(id)?.abbr ?? String(id);
}

export function refLabel(book: number, chapter: number, verse?: number): string {
  return `${bookAbbrById(book)} ${chapter}${verse ? `:${verse}` : ""}`;
}
