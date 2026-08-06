export type MillionQuestionType = "multiple" | "true-false" | "complete";
export type MillionDifficulty = "facil" | "medio" | "dificil" | "bereano";

export type MillionQuestion = {
  id: string;
  type: MillionQuestionType;
  prompt: string;
  options: string[];
  answer: string;
  explanation: string;
  reference: string;
  category: string;
  difficulty: MillionDifficulty;
};

export const MILLION_LEVELS = [
  { title: "Aprendiz", points: 0 },
  { title: "Discípulo", points: 400 },
  { title: "Servo", points: 900 },
  { title: "Escriba", points: 1600 },
  { title: "Guardião da Palavra", points: 2600 },
  { title: "Bereano Supremo", points: 4000 },
] as const;

export const MILLION_QUESTIONS: MillionQuestion[] = [
  { id: "m-01", type: "multiple", prompt: "Quem construiu a arca por ordem de Deus?", options: ["Abraão", "Noé", "Moisés", "Josué"], answer: "Noé", explanation: "Noé recebeu instruções para construir a arca e preservar sua família e os animais.", reference: "Gênesis 6:14-22", category: "Gênesis", difficulty: "facil" },
  { id: "m-02", type: "true-false", prompt: "Verdadeiro ou falso: Davi era o filho mais velho de Jessé.", options: ["Verdadeiro", "Falso"], answer: "Falso", explanation: "Davi era o filho mais novo; ele cuidava das ovelhas quando Samuel foi à casa de Jessé.", reference: "1 Samuel 16:10-13", category: "Reis", difficulty: "facil" },
  { id: "m-03", type: "complete", prompt: "Complete a passagem: ‘O Senhor é o meu ___; nada me faltará.’", options: ["pastor", "rei", "refúgio", "escudo"], answer: "pastor", explanation: "O salmista descreve o cuidado de Deus usando a imagem de um pastor.", reference: "Salmos 23:1", category: "Salmos", difficulty: "facil" },
  { id: "m-04", type: "multiple", prompt: "Qual foi o primeiro milagre de Jesus registrado no Evangelho de João?", options: ["A cura do paralítico", "A multiplicação dos pães", "A água transformada em vinho", "A ressurreição de Lázaro"], answer: "A água transformada em vinho", explanation: "Em Caná da Galileia, Jesus manifestou sua glória ao transformar água em vinho.", reference: "João 2:1-11", category: "Evangelhos", difficulty: "medio" },
  { id: "m-05", type: "true-false", prompt: "Verdadeiro ou falso: Paulo estava presente quando Estêvão foi apedrejado.", options: ["Verdadeiro", "Falso"], answer: "Verdadeiro", explanation: "As testemunhas deixaram suas capas aos pés de um jovem chamado Saulo.", reference: "Atos 7:58", category: "Atos", difficulty: "medio" },
  { id: "m-06", type: "multiple", prompt: "Qual profeta confrontou os profetas de Baal no monte Carmelo?", options: ["Eliseu", "Elias", "Samuel", "Natã"], answer: "Elias", explanation: "Elias chamou Israel a decidir entre o Senhor e Baal e Deus respondeu com fogo.", reference: "1 Reis 18:20-39", category: "Profetas", difficulty: "medio" },
  { id: "m-07", type: "complete", prompt: "Complete: ‘O justo viverá pela sua ___.’", options: ["força", "fidelidade", "riqueza", "sabedoria"], answer: "fidelidade", explanation: "A visão de Habacuque contrasta a arrogância com a vida sustentada pela confiança fiel.", reference: "Habacuque 2:4", category: "Profetas", difficulty: "dificil" },
  { id: "m-08", type: "multiple", prompt: "Qual igreja recebeu a advertência de ter abandonado o seu primeiro amor?", options: ["Éfeso", "Esmirna", "Pérgamo", "Laodiceia"], answer: "Éfeso", explanation: "A igreja de Éfeso tinha perseverança, mas precisava voltar à prática do amor inicial.", reference: "Apocalipse 2:1-5", category: "Apocalipse", difficulty: "dificil" },
  { id: "m-09", type: "true-false", prompt: "Verdadeiro ou falso: Melquisedeque era rei de Salém e sacerdote do Deus Altíssimo.", options: ["Verdadeiro", "Falso"], answer: "Verdadeiro", explanation: "Ele encontrou Abraão depois da batalha, trazendo pão e vinho e abençoando-o.", reference: "Gênesis 14:18-20", category: "Patriarcas", difficulty: "dificil" },
  { id: "m-10", type: "multiple", prompt: "Qual carta menciona a armadura de Deus e a espada do Espírito?", options: ["Romanos", "Efésios", "Hebreus", "1 Pedro"], answer: "Efésios", explanation: "Paulo usa a imagem da armadura para ensinar como permanecer firmes contra o mal.", reference: "Efésios 6:10-17", category: "Cartas", difficulty: "dificil" },
  { id: "m-11", type: "complete", prompt: "Complete a oração de Habacuque: ‘Ainda que a figueira não floresça... todavia eu ___ no Senhor.’", options: ["esperarei", "me alegrarei", "descansarei", "cantarei"], answer: "me alegrarei", explanation: "O profeta escolhe celebrar o Deus da salvação mesmo quando os sinais visíveis de prosperidade desaparecem.", reference: "Habacuque 3:17-18", category: "Profetas", difficulty: "bereano" },
  { id: "m-12", type: "multiple", prompt: "Quem recebeu a visão de um lençol com animais antes de visitar Cornélio?", options: ["Pedro", "Barnabé", "Filipe", "Tiago"], answer: "Pedro", explanation: "A visão preparou Pedro para compreender que Deus acolhe pessoas de todas as nações.", reference: "Atos 10:9-16, 28", category: "Atos", difficulty: "bereano" },
];
