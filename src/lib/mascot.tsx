// Mascote vivo — Nível 1.
// Estado global e leve (sem novas dependências) que controla o "humor" e as
// reações da ovelha com base em dados reais: horário, dia da semana, streak e
// last_activity_date. Componentes de qualquer tela podem chamar `trigger(...)`
// para disparar uma reação pontual (pular ao ganhar XP, dançar ao subir de
// nível, comemorar streak etc).
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { xpToNextLevel } from "@/data/levels";

export type MascotEvent = "wave" | "jump" | "dance" | "streak" | "sad" | "pet" | null;

type MascotState = {
  event: MascotEvent;
  message: string | null;
  moodEmoji: string;
};

type MascotCtx = {
  state: MascotState;
  /** Dispara uma reação pontual. Some sozinha após `durationMs`. */
  trigger: (event: Exclude<MascotEvent, null>, message?: string, durationMs?: number) => void;
  /** Atualiza só a mensagem da ovelha, sem mexer na animação atual. */
  say: (message: string) => void;
  /** Toque de carinho: ela olha, sorri e pula — com uma fala afetuosa. */
  pet: () => void;
};

const Ctx = createContext<MascotCtx | null>(null);

// Falas de carinho — ditas quando o usuário toca na ovelha.
const PET_LINES = [
  "Adorei o carinho! 🥰",
  "Isso me deixa feliz!",
  "Você é muito gentil.",
  "😊 Obrigada!",
  "Vamos estudar juntos hoje?",
];

// Falas contextuais — ditas ocasionalmente, fora de um evento específico,
// para dar a sensação de companhia viva.
const CONTEXTUAL_LINES = [
  "Hoje vamos estudar?",
  "Estou feliz que você voltou.",
  "Vamos continuar?",
  "Que tal revisar sua trilha hoje?",
  "Estou aqui, no seu tempo.",
  // Progresso e trilhas, de forma genérica (não dependem de dados do usuário).
  "Cada lição é um passo na sua caminhada com Deus.",
  "Sua trilha está te esperando.",
  "Que tal terminar aquele módulo que você começou?",
  "Um passo de cada vez — e olha até onde você já chegou.",
  "Constância vale mais que pressa.",
  "Vamos avançar mais um pouco hoje?",
  "Toda lição concluída é uma semente plantada.",
];

// Falas que dependem de dados reais do usuário (streak, XP, lições concluídas).
// São montadas dinamicamente em runtime e somadas ao pool de CONTEXTUAL_LINES.
function buildProgressLines(opts: { streak: number; xpLeft: number | null; completedLessons: number }): string[] {
  const lines: string[] = [];
  const { streak, xpLeft, completedLessons } = opts;

  if (streak >= 7) {
    lines.push(`${streak} dias seguidos! Que sequência linda 🔥`);
  } else if (streak >= 3) {
    lines.push(`Você está há ${streak} dias seguidos! Não quebra a corrente agora 🔥`);
  } else if (streak === 1) {
    lines.push("Primeiro dia da sua sequência! Vamos até amanhã?");
  }

  if (xpLeft !== null && xpLeft <= 30) {
    lines.push(`Faltam só ${xpLeft} XP pra você subir de nível! 🎉`);
  }

  if (completedLessons >= 20) {
    lines.push(`${completedLessons} lições concluídas! Você está construindo um hábito e tanto.`);
  } else if (completedLessons >= 5) {
    lines.push(`Você já concluiu ${completedLessons} lições na sua trilha. Bora continuar?`);
  } else if (completedLessons === 0) {
    lines.push("Ainda não começou nenhuma lição — que tal a primeira hoje?");
  }

  return lines;
}

// Falas específicas ditas quando o usuário conclui uma trilha em particular —
// uma frase pensada pro conteúdo real daquela trilha, não algo genérico.
// Chave = título exato da trilha em `disciple_trails.title`.
const TRAIL_COMMENTS: Record<string, string> = {
  // Módulo 1 — Novo Convertido
  "Quem é Jesus": "Jesus, Deus e homem, plenamente. Que descoberta 💛",
  "O Evangelho": "As boas novas! Isso muda tudo, não muda?",
  "Arrependimento e Fé": "Arrependimento e fé, de mãos dadas. Bonito passo.",
  "Graça e Adoção": "Filho(a) de Deus por graça — guarda isso no coração.",
  "A Palavra": "A Palavra é viva! Continue voltando a ela todo dia.",
  "A Oração": "Conversar com Deus fica mais natural a cada dia.",
  "Igreja e Comunhão": "Fé também se vive em comunidade. Já pensou em quem chamar pra caminhar junto?",
  "Batismo": "Um símbolo tão forte da sua nova vida. Já pensou nesse passo?",
  "Primeiros Tropeços": "Todo mundo tropeça — o que importa é levantar e seguir.",
  "Missão Inicial": "Primeira trilha de missão concluída! Pronto(a) pra mais.",
  // Módulo 2 — Fundamentos da Fé
  "Autoridade das Escrituras": "A Bíblia como fundamento — base sólida pro resto da caminhada.",
  "Deus e a Trindade": "Um só Deus em três pessoas — mistério que vale a vida toda meditar.",
  "Criação e Queda": "Do Éden à queda — o início de toda a história da redenção.",
  "História da Redenção": "Toda a Bíblia conta uma única grande história. Que panorama!",
  "A Pessoa de Cristo": "Plenamente Deus, plenamente homem — o coração da nossa fé.",
  "A Obra de Cristo": "A cruz e a ressurreição — tudo se resolve ali.",
  "O Espírito Santo": "Ele mora em você agora. Isso muda como você vive o dia a dia.",
  "A Salvação": "Salvação pela graça, mediante a fé — nunca por mérito.",
  "A Igreja": "Você faz parte de algo maior — o corpo de Cristo.",
  "Escatologia Básica": "O futuro já tem um final garantido. Isso te dá esperança?",
  // Módulo 3 — Como Estudar a Bíblia
  "A Metanarrativa Bíblica": "Criação, queda, redenção, restauração — agora você enxerga o mapa todo.",
  "Gêneros Literários": "Ler a Bíblia do jeito certo muda tudo. Ótimo passo!",
  "O Método Indutivo": "Observar, interpretar, aplicar — uma ferramenta pra vida toda.",
  "Contexto Histórico": "Entender o contexto evita muita interpretação torta. Bom trabalho!",
  "Ferramentas de Estudo": "Agora seu estudo bíblico ficou mais rico.",
  "Perguntas ao Texto": "Fazer boas perguntas ao texto já é meio caminho andado.",
  "Hermenêutica Cristocêntrica": "Toda a Escritura aponta pra Cristo — que jeito lindo de ler a Bíblia.",
  "Evitando Heresias": "Discernimento é essencial. Você está mais preparado(a) agora.",
  "Exegese e Aplicação": "Do texto à vida — é exatamente assim que deve ser.",
  "Hábito de Leitura": "Um hábito de leitura constante muda uma vida inteira.",
  // Módulo 4 — Oração
  "Teologia da Oração": "Orar é mais profundo do que parece, né? Bela trilha.",
  "O Jesus Orante": "Se até Jesus orava, imagina nós. Ótimo exemplo pra seguir.",
  "O Pai Nosso": "O modelo que o próprio Jesus deixou. Vale orar assim toda semana.",
  "Tipos de Oração": "Louvor, súplica, gratidão... sua vida de oração ficou mais rica.",
  "Inimigos da Oração": "Identificar o que atrapalha já é meio caminho pra vencer.",
  "Oração e Soberania": "Orar confiando no controle de Deus muda a ansiedade em paz.",
  "Oração e Jejum": "Jejum e oração juntos — disciplina que aproxima.",
  "Oração Corporativa": "Orar junto com outros tem um poder especial.",
  "Oração no Deserto": "Até nos desertos da vida, Ele ouve. Boa trilha.",
  "Vida Devocional": "Um tempo diário com Deus — pequeno hábito, grande fruto.",
};

/**
 * Fala específica sobre a trilha recém-concluída. Usa o comentário
 * dedicado quando existe; senão cai num comentário genérico que ainda
 * assim cita o título real da trilha (nunca deixa a fala vaga).
 */
export function trailCompletionLine(trailTitle: string): string {
  return TRAIL_COMMENTS[trailTitle] ?? `Você concluiu "${trailTitle}"! Mais um passo na sua caminhada 🐑`;
}

function pickRandom(list: string[]): string {
  return list[Math.floor(Math.random() * list.length)];
}

function greetingForNow(): { text: string; emoji: string } {
  const now = new Date();
  const hour = now.getHours();
  const isSunday = now.getDay() === 0;

  if (isSunday) return { text: "Hoje é dia de culto? 🙏", emoji: "🙏" };
  if (hour >= 5 && hour < 12) return { text: "Bom dia! Vamos estudar?", emoji: "☀️" };
  if (hour >= 12 && hour < 18) return { text: "Boa tarde! Pronto pra continuar?", emoji: "🌤️" };
  if (hour >= 18 && hour < 23) return { text: "Boa noite!", emoji: "🌙" };
  return { text: "Já tá tarde… não esquece de descansar.", emoji: "😴" };
}

export function MascotProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MascotState>({ event: null, message: null, moodEmoji: "😀" });
  const clearTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sadTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const trigger = useCallback(
    (event: Exclude<MascotEvent, null>, message?: string, durationMs = 1600) => {
      if (clearTimer.current) clearTimeout(clearTimer.current);
      setState((s) => ({ event, message: message ?? s.message, moodEmoji: s.moodEmoji }));
      clearTimer.current = setTimeout(() => {
        setState((s) => ({ ...s, event: null }));
      }, durationMs);
    },
    [],
  );

  const say = useCallback((message: string) => {
    setState((s) => ({ ...s, message }));
  }, []);

  const pet = useCallback(() => {
    if (clearTimer.current) clearTimeout(clearTimer.current);
    setState((s) => ({ event: "pet", message: pickRandom(PET_LINES), moodEmoji: "😊" }));
    clearTimer.current = setTimeout(() => {
      setState((s) => ({ ...s, event: null }));
    }, 1400);
  }, []);

  // Ao abrir o app: busca a última atividade real do usuário e decide entre
  // "senti sua falta" (streak quebrado) ou uma saudação normal de boas-vindas.
  useEffect(() => {
    let cancelled = false;
    const contextualTimer: ReturnType<typeof setTimeout>[] = [];
    void (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user || cancelled) return;
      const [{ data: p }, { count: completedLessons }] = await Promise.all([
        supabase
          .from("profiles")
          .select("last_activity_date, xp, streak")
          .eq("id", u.user.id)
          .maybeSingle(),
        supabase
          .from("lesson_progress")
          .select("lesson_id", { count: "exact", head: true })
          .eq("user_id", u.user.id),
      ]);
      if (cancelled) return;

      const xpLeft = xpToNextLevel((p?.xp as number | null) ?? 0);
      const progressLines = buildProgressLines({
        streak: (p?.streak as number | null) ?? 0,
        xpLeft,
        completedLessons: completedLessons ?? 0,
      });
      const contextualPool = [...CONTEXTUAL_LINES, ...progressLines];

      const todayStr = new Date().toISOString().slice(0, 10);
      const last = (p?.last_activity_date as string | null) ?? null;
      const diffDays = last
        ? Math.floor((new Date(todayStr).getTime() - new Date(last).getTime()) / 86400000)
        : null;
      const missedDays = diffDays !== null && diffDays >= 2;

      if (missedDays) {
        setState({ event: "sad", message: "Senti sua falta…", moodEmoji: "😔" });
        sadTimer.current = setTimeout(() => {
          if (!cancelled) setState({ event: null, message: "Vamos recomeçar hoje?", moodEmoji: "🙂" });
        }, 3200);
      } else {
        const g = greetingForNow();
        setState({ event: "wave", message: g.text, moodEmoji: g.emoji });
        clearTimer.current = setTimeout(() => {
          if (!cancelled) setState((s) => ({ ...s, event: null }));
        }, 1500);

        // Uma fala contextual solta, de vez em quando, depois que a saudação
        // inicial já sumiu — só pra ela parecer viva, sem repetir sempre.
        // Quando existem falas de progresso reais (streak, XP perto do próximo
        // nível, lições concluídas), elas têm prioridade sobre as genéricas.
        if (Math.random() < 0.5) {
          contextualTimer.push(
            setTimeout(() => {
              if (cancelled) return;
              const pool = progressLines.length > 0 && Math.random() < 0.7 ? progressLines : contextualPool;
              say(pickRandom(pool));
            }, 7000 + Math.random() * 4000),
          );
        }
      }
    })();
    return () => {
      cancelled = true;
      if (clearTimer.current) clearTimeout(clearTimer.current);
      if (sadTimer.current) clearTimeout(sadTimer.current);
      contextualTimer.forEach(clearTimeout);
    };
  }, [say]);

  return <Ctx.Provider value={{ state, trigger, say, pet }}>{children}</Ctx.Provider>;
}

export function useMascot() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useMascot must be used within MascotProvider");
  return ctx;
}
