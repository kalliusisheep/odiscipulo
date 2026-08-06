import type { GameDifficulty } from "@/data/biblical-characters";

export type VerseQuestion = {
  id: string;
  text: string;
  reference: string;
  alternatives: [string, string];
  context: string;
  difficulty: GameDifficulty;
};

export const VERSE_DIFFICULTY: Record<GameDifficulty, { label: string; multiplier: number; description: string }> = {
  facil: { label: "Fácil", multiplier: 1, description: "Versículos muito conhecidos e marcantes." },
  medio: { label: "Médio", multiplier: 1.25, description: "Passagens frequentes, mas com referências parecidas." },
  dificil: { label: "Difícil", multiplier: 1.5, description: "Textos que exigem memória do contexto bíblico." },
  bereano: { label: "Bereano Supremo", multiplier: 2, description: "Passagens menos populares e referências próximas." },
};

export const BIBLICAL_VERSES: VerseQuestion[] = [
  { id: "jo-3-16", text: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.", reference: "João 3:16", alternatives: ["Romanos 5:8", "Efésios 2:8"], context: "Jesus explicou a Nicodemos que a salvação nasce do amor de Deus e da fé no Filho.", difficulty: "facil" },
  { id: "sl-23-1", text: "O Senhor é o meu pastor; nada me faltará.", reference: "Salmos 23:1", alternatives: ["Salmos 27:1", "Isaías 40:11"], context: "O salmo apresenta Deus como pastor presente, que guia e sustenta seu povo.", difficulty: "facil" },
  { id: "fp-4-13", text: "Tudo posso naquele que me fortalece.", reference: "Filipenses 4:13", alternatives: ["2 Coríntios 12:9", "Isaías 41:10"], context: "Paulo fala de aprender a viver com fartura ou necessidade, sustentado por Cristo.", difficulty: "facil" },
  { id: "jr-29-11", text: "Porque eu bem sei os pensamentos que penso de vós, diz o Senhor; pensamentos de paz e não de mal, para vos dar o fim que esperais.", reference: "Jeremias 29:11", alternatives: ["Provérbios 16:9", "Romanos 8:28"], context: "A promessa foi dada aos exilados e aponta para a fidelidade de Deus ao longo do tempo.", difficulty: "medio" },
  { id: "rm-8-28", text: "Sabemos que todas as coisas cooperam para o bem daqueles que amam a Deus, daqueles que são chamados segundo o seu propósito.", reference: "Romanos 8:28", alternatives: ["Jeremias 29:11", "Tiago 1:2"], context: "Paulo encoraja a igreja em meio ao sofrimento, lembrando que Deus conduz sua criação ao propósito final.", difficulty: "medio" },
  { id: "mt-11-28", text: "Venham a mim, todos vocês que estão cansados e sobrecarregados, e eu lhes darei descanso.", reference: "Mateus 11:28", alternatives: ["João 14:27", "Salmos 46:1"], context: "Jesus convida os cansados a encontrarem nele descanso, aprendendo seu caminho manso e humilde.", difficulty: "medio" },
  { id: "pv-3-5", text: "Confie no Senhor de todo o seu coração e não se apoie em seu próprio entendimento.", reference: "Provérbios 3:5", alternatives: ["Salmos 37:5", "Isaías 26:3"], context: "O conselho faz parte de uma instrução de sabedoria sobre confiar na direção do Senhor.", difficulty: "medio" },
  { id: "gl-2-20", text: "Já não sou eu quem vive, mas Cristo vive em mim. E esse viver que agora tenho no corpo, vivo pela fé no Filho de Deus.", reference: "Gálatas 2:20", alternatives: ["Filipenses 1:21", "Romanos 6:11"], context: "Paulo descreve a união com Cristo como uma nova identidade que transforma a vida inteira.", difficulty: "dificil" },
  { id: "hb-4-12", text: "Pois a palavra de Deus é viva e eficaz, e mais afiada que qualquer espada de dois gumes.", reference: "Hebreus 4:12", alternatives: ["Efésios 6:17", "2 Timóteo 3:16"], context: "O autor alerta que a Palavra discerne o coração e chama o povo a perseverar na fé.", difficulty: "dificil" },
  { id: "mq-6-8", text: "Ele mostrou a você, ó homem, o que é bom e o que o Senhor exige: que pratique a justiça, ame a misericórdia e ande humildemente com o seu Deus.", reference: "Miquéias 6:8", alternatives: ["Isaías 1:17", "Amós 5:24"], context: "O profeta confronta uma religião exterior sem justiça, misericórdia e humildade diante de Deus.", difficulty: "dificil" },
  { id: "1co-13-13", text: "Assim, permanecem agora estes três: a fé, a esperança e o amor. O maior deles, porém, é o amor.", reference: "1 Coríntios 13:13", alternatives: ["1 Tessalonicenses 1:3", "Colossenses 3:14"], context: "Depois de ensinar sobre os dons, Paulo mostra que o amor é o caminho indispensável da comunidade.", difficulty: "dificil" },
  { id: "na-1-7", text: "O Senhor é bom, um refúgio em tempos de angústia. Ele protege os que nele confiam.", reference: "Naum 1:7", alternatives: ["Salmos 46:1", "Sofonias 3:17"], context: "No anúncio do juízo contra Nínive, o profeta também afirma o cuidado de Deus por quem nele se refugia.", difficulty: "bereano" },
  { id: "sf-3-17", text: "O Senhor, o seu Deus, está em seu meio, poderoso para salvar. Ele se regozijará em você com alegria.", reference: "Sofonias 3:17", alternatives: ["Isaías 62:5", "Salmos 147:11"], context: "A promessa encerra uma mensagem de restauração para o remanescente humilde do povo.", difficulty: "bereano" },
  { id: "3jo-1-4", text: "Não tenho alegria maior do que ouvir que meus filhos estão andando na verdade.", reference: "3 João 1:4", alternatives: ["2 João 1:4", "Provérbios 23:24"], context: "João se alegra ao saber que os irmãos permanecem fiéis à verdade do evangelho.", difficulty: "bereano" },
  { id: "hc-2-4", text: "O justo viverá pela sua fidelidade.", reference: "Habacuque 2:4", alternatives: ["Romanos 1:17", "Gálatas 3:11"], context: "A visão responde à espera do profeta e se torna uma afirmação central sobre viver confiando em Deus.", difficulty: "bereano" },
  { id: "ob-1-3", text: "A arrogância do seu coração o tem enganado, você que vive nas alturas das rochas.", reference: "Obadias 1:3", alternatives: ["Provérbios 16:18", "Jeremias 49:16"], context: "Obadias denuncia a falsa segurança de Edom e sua confiança em uma posição aparentemente impossível de alcançar.", difficulty: "bereano" },
];

export const versesForDifficulty = (difficulty: GameDifficulty) =>
  BIBLICAL_VERSES.filter((verse) => verse.difficulty === difficulty);
