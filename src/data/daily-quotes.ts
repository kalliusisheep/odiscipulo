// Citações do dia — todas verificadas e referenciadas.
// Regra editorial: nada de conteúdo partidário nos debates soteriológicos
// (calvinismo x arminianismo) nem material que contrarie a linha teológica
// do app. Apenas autores da lista de referência aprovada.

import csLewisImg from "@/assets/authors/cs-lewis.jpg";
import spurgeonImg from "@/assets/authors/spurgeon.jpg";
import wesleyImg from "@/assets/authors/wesley.jpg";
import bonhoefferImg from "@/assets/authors/bonhoeffer.jpg";
import stottImg from "@/assets/authors/stott.jpg";
import defaultAuthorImg from "@/assets/authors/default.jpg";

export type DailyQuote = {
  id: string;
  author: string;
  text: string;
  source: string;
};

const AUTHOR_IMAGES: Record<string, string> = {
  "C.S. Lewis": csLewisImg,
  "Charles Spurgeon": spurgeonImg,
  "John Wesley": wesleyImg,
  "Dietrich Bonhoeffer": bonhoefferImg,
  "John Stott": stottImg,
};

export function authorImageFor(author: string): string {
  return AUTHOR_IMAGES[author] ?? defaultAuthorImg;
}

export const DAILY_QUOTES: DailyQuote[] = [
  {
    id: "lewis-outro-mundo",
    author: "C.S. Lewis",
    text: "Se encontro em mim mesmo um desejo que nenhuma experiência deste mundo pode satisfazer, a explicação mais provável é que fui feito para outro mundo.",
    source: "Cristianismo Puro e Simples (Mere Christianity), Livro III, cap. 10",
  },
  {
    id: "lewis-aponte-ceu",
    author: "C.S. Lewis",
    text: "Aponte para o céu e você terá a terra por acréscimo; aponte para a terra e não terá nenhum dos dois.",
    source: "Cristianismo Puro e Simples (Mere Christianity), Livro III, cap. 10",
  },
  {
    id: "lewis-mero-mortal",
    author: "C.S. Lewis",
    text: "Não existem pessoas comuns. Você nunca conversou com um mero mortal.",
    source: "O Peso da Glória (The Weight of Glory), sermão pregado em Oxford, 1941",
  },
  {
    id: "lewis-orgulho",
    author: "C.S. Lewis",
    text: "Um homem verdadeiramente humilde não estará pensando em humildade: ele simplesmente não estará pensando em si mesmo.",
    source: "Cristianismo Puro e Simples (Mere Christianity), Livro III, cap. 8",
  },
  {
    id: "spurgeon-fe-descansa",
    author: "Charles Spurgeon",
    text: "Minha fé não descansa no que eu sou, ou serei, ou sinto, ou sei, mas no que Cristo é, no que ele fez e no que está fazendo por mim.",
    source: "Tudo de Graça (All of Grace, 1886), cap. 'Fé, o que é?'",
  },
  {
    id: "spurgeon-tres-elementos",
    author: "Charles Spurgeon",
    text: "A fé é composta de três elementos: conhecimento, crença e confiança.",
    source: "Tudo de Graça (All of Grace, 1886), cap. 'Fé, o que é?'",
  },
  {
    id: "spurgeon-ganhar-almas",
    author: "Charles Spurgeon",
    text: "Ganhar almas é o principal negócio do cristão.",
    source: "O Ganhador de Almas (The Soul Winner, 1895), cap. 1",
  },
  {
    id: "spurgeon-bibline",
    author: "Charles Spurgeon",
    text: "Fure-o em qualquer lugar e verá que seu sangue é bíblico: a própria essência da Bíblia jorra dele.",
    source: "Sobre John Bunyan, em 'Mr. Spurgeon as a Literary Man' (Autobiografia, vol. 4)",
  },
  {
    id: "wesley-paroquia",
    author: "John Wesley",
    text: "Considero o mundo inteiro como a minha paróquia.",
    source: "Diário, 11 de junho de 1739",
  },
  {
    id: "wesley-livro",
    author: "John Wesley",
    text: "Dá-me esse livro! A qualquer preço, dá-me o livro de Deus! Eu o tenho; aqui há conhecimento suficiente para mim.",
    source: "Prefácio aos Sermões sobre Várias Ocasiões (1746)",
  },
  {
    id: "wesley-coracao",
    author: "John Wesley",
    text: "Se o teu coração é como o meu coração, dá-me a tua mão.",
    source: "Sermão 39 — 'Espírito Católico' (1750), sobre 2 Reis 10:15",
  },
  {
    id: "wesley-dinheiro",
    author: "John Wesley",
    text: "Ganhe tudo o que puder, poupe tudo o que puder, dê tudo o que puder.",
    source: "Sermão 50 — 'O Uso do Dinheiro'",
  },
  {
    id: "bonhoeffer-comunidade",
    author: "Dietrich Bonhoeffer",
    text: "Aquele que não pode estar sozinho tome cuidado com a comunidade; aquele que não está em comunidade tome cuidado com a solidão.",
    source: "Vida em Comunhão (Gemeinsames Leben, 1939), cap. 4",
  },
  {
    id: "bonhoeffer-chamado",
    author: "Dietrich Bonhoeffer",
    text: "Quando Cristo chama um homem, ele o convoca a vir e morrer.",
    source: "Discipulado (Nachfolge, 1937), cap. 4 — 'O chamado ao discipulado'",
  },
  {
    id: "bonhoeffer-graca",
    author: "Dietrich Bonhoeffer",
    text: "A graça barata é a pregação do perdão sem arrependimento; a graça preciosa é o Evangelho que precisa ser buscado sempre de novo.",
    source: "Discipulado (Nachfolge, 1937), cap. 1 — 'A graça preciosa'",
  },
  {
    id: "stott-igreja-centro",
    author: "John Stott",
    text: "A igreja está no centro mesmo do propósito eterno de Deus.",
    source: "A Mensagem de Efésios (BST), comentário sobre Efésios 3:10-11",
  },
  {
    id: "stott-verdade-amor",
    author: "John Stott",
    text: "A verdade se torna dura se não for suavizada pelo amor, e o amor se torna frouxo se não for fortalecido pela verdade.",
    source: "A Mensagem de Efésios (BST), comentário sobre Efésios 4:15",
  },
  {
    id: "stott-missao",
    author: "John Stott",
    text: "A missão descreve tudo aquilo que a igreja é enviada ao mundo para fazer.",
    source: "A Missão Cristã no Mundo Moderno (1975), cap. 1",
  },
  {
    id: "grudem-autoridade",
    author: "Wayne Grudem",
    text: "A autoridade da Escritura significa que todas as palavras da Escritura são palavras de Deus, de tal modo que descrer ou desobedecer a qualquer palavra da Escritura é descrer ou desobedecer ao próprio Deus.",
    source: "Teologia Sistemática, cap. 4",
  },
  {
    id: "grudem-dons",
    author: "Wayne Grudem",
    text: "Um dom espiritual é toda habilidade fortalecida pelo Espírito Santo e usada em qualquer ministério da igreja.",
    source: "Teologia Sistemática, cap. 52",
  },
  {
    id: "agostinho-inquieto",
    author: "Agostinho de Hipona",
    text: "Fizeste-nos para ti, e o nosso coração está inquieto enquanto não repousar em ti.",
    source: "Confissões, I.1 (Pais da Igreja)",
  },
  {
    id: "agostinho-evangelho",
    author: "Agostinho de Hipona",
    text: "Se crês no que te agrada no Evangelho e rejeitas o que não te agrada, não crês no Evangelho, mas em ti mesmo.",
    source: "Contra Fausto, XVII.3 (Pais da Igreja)",
  },
  {
    id: "agostinho-bispo",
    author: "Agostinho de Hipona",
    text: "Para vós sou bispo; convosco sou cristão.",
    source: "Sermão 340, 1 (Pais da Igreja)",
  },
  {
    id: "tertuliano-semente",
    author: "Tertuliano",
    text: "O sangue dos cristãos é semente.",
    source: "Apologeticum, 50.13 (Pais da Igreja, c. 197 d.C.)",
  },
  {
    id: "newbigin-alegria",
    author: "Leslie Newbigin",
    text: "A missão começa com um tipo de explosão de alegria.",
    source: "O Evangelho em uma Sociedade Pluralista (1989), cap. 10",
  },
  {
    id: "newbigin-hermeneutica",
    author: "Leslie Newbigin",
    text: "A única hermenêutica do evangelho é uma congregação de homens e mulheres que creem nele e vivem por ele.",
    source: "O Evangelho em uma Sociedade Pluralista (1989), cap. 18",
  },
  {
    id: "bosch-missao",
    author: "David Bosch",
    text: "A missão não é primariamente uma atividade da igreja, mas um atributo de Deus. Deus é um Deus missionário.",
    source: "Missão Transformadora (Transforming Mission, 1991), cap. 12",
  },
  {
    id: "foster-oracao",
    author: "Richard Foster",
    text: "De todas as Disciplinas Espirituais, a oração é a mais central, porque nos introduz em comunhão perpétua com o Pai.",
    source: "Celebração da Disciplina (1978), cap. 3",
  },
  {
    id: "carson-contexto",
    author: "D. A. Carson",
    text: "Um texto sem contexto é um pretexto para um texto de prova.",
    source: "Máxima de interpretação bíblica popularizada em 'Os Perigos da Interpretação Bíblica' (Exegetical Fallacies)",
  },
  {
    id: "swindoll-atitude",
    author: "Charles Swindoll",
    text: "A vida é dez por cento o que acontece comigo e noventa por cento como eu reajo a isso.",
    source: "Ensaio 'Attitude' (Atitude) — tradução livre",
  },
  {
    id: "comer-atencao",
    author: "John Mark Comer",
    text: "Aquilo a que você presta atenção determina a pessoa em que você se torna.",
    source: "O Fim Impiedoso da Pressa (2019) — tradução livre",
  },
  {
    id: "rainer-membresia",
    author: "Thom Rainer",
    text: "A membresia da igreja não é sobre mim; é sobre como Deus pode me usar para fazer diferença na vida de outros.",
    source: "Sou Membro da Igreja (I Am a Church Member), cap. 1",
  },
  {
    id: "lutero-doutrina",
    author: "Martinho Lutero",
    text: "A doutrina é o céu; a vida é a terra.",
    source: "Comentário à Epístola aos Gálatas (1535), prefácio",
  },
  {
    id: "calvino-disciplina",
    author: "João Calvino",
    text: "A disciplina é como os nervos pelos quais os membros do corpo se mantêm unidos, cada um em seu devido lugar.",
    source: "Institutas da Religião Cristã, IV.12.1",
  },
  {
    id: "calvino-sacramento",
    author: "João Calvino",
    text: "O sacramento é um testemunho externo da graça de Deus para conosco, confirmado por um sinal exterior.",
    source: "Institutas da Religião Cristã, IV.14.1",
  },
];

/** Índice estável por dia: todos os usuários veem a mesma citação no mesmo dia. */
export function quoteOfTheDay(date: Date = new Date()): DailyQuote {
  const dayNumber = Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000,
  );
  const index = ((dayNumber % DAILY_QUOTES.length) + DAILY_QUOTES.length) % DAILY_QUOTES.length;
  return DAILY_QUOTES[index];
}
