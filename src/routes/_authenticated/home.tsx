import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CHARACTERS } from "@/data/content";
import {
  getLevel,
  getNextLevel,
  xpToNextLevel,
  levelProgressPct,
  checkLevel50Status,
  GATED_LEVEL,
} from "@/data/levels";
import {
  MODULE_ORDER_TO_ICON,
  MODULE_ORDER_TO_GRADIENT,
  MODULE_ORDER_TO_RGB,
  DEFAULT_MODULE_GRADIENT,
  DEFAULT_MODULE_RGB,
} from "@/data/module-visuals";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MessagesLinkButton } from "@/components/MessagesLinkButton";
import { PushNotifications } from "@/components/PushNotifications";
import { useApp } from "@/lib/app-context";
import { ArrowLeft, Flame, Check, ChevronRight, Sparkles, BookOpen, Crown } from "lucide-react";
import { ChallengePanel } from "@/components/ChallengeProgressBar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/home")({
  component: HomePage,
});

type Profile = {
  display_name: string;
  first_name: string | null;
  avatar_char: string;
  xp: number;
  streak: number;
};

type ModuleRow = {
  id: string;
  ord: number;
  title: string;
  description: string | null;
  color: string | null;
};

type TrailRow = {
  id: string;
  module_id: string;
  ord: number;
  title: string;
  lesson_id: string | null;
};

const LEADER_LESSON_IDS = ["csl-1", "csl-2", "csl-3", "csl-4", "csl-5", "csl-6", "csl-7", "csl-8", "csl-9", "csl-10"];
const DISCIPLE_CONTENTS = [
  ["Orgulho", "Tiago 4:6", "Deus se opõe ao orgulhoso e concede graça ao humilde. O discipulado começa quando reconhecemos que dependemos de Cristo, não da nossa imagem ou capacidade.", "Em qual conversa desta semana posso ouvir antes de responder?"],
  ["Pecado", "1 João 1:9", "Pecado não é apenas falha moral: é rebelião contra Deus. Em Cristo há perdão real para quem confessa, abandona a ocultação e caminha na luz com a igreja.", "Ore com sinceridade e procure apoio pastoral quando a luta for persistente."],
  ["Casamento", "Efésios 5:25", "O casamento cristão é uma aliança de serviço, fidelidade e amor sacrificial. Cristo e sua igreja dão o padrão; nenhum cônjuge é chamado a controlar ou ferir o outro.", "Conversem sobre uma forma concreta de servir um ao outro nesta semana."],
  ["Namoro", "1 Tessalonicenses 4:3-4", "O namoro deve honrar a santidade, a dignidade e a clareza de propósito. Não é um ensaio de casamento, mas um relacionamento que precisa de limites, verdade e acompanhamento maduro.", "Definam limites que protejam a pureza e conversem com uma liderança confiável."],
  ["Pornografia", "1 Coríntios 6:18-20", "A pornografia reduz pessoas criadas à imagem de Deus a objetos de consumo. A libertação envolve arrependimento, graça, limites práticos, prestação de contas e ajuda pastoral especializada quando necessária.", "Não lute sozinho: remova acessos, procure um líder maduro e estabeleça apoio responsável."],
  ["Vícios (álcool/drogas)", "1 Coríntios 6:12", "Nada deve dominar o discípulo além de Cristo. Dependências pedem cuidado espiritual e, muitas vezes, acompanhamento médico, psicológico e familiar; buscar tratamento é um passo de coragem, não de vergonha.", "Converse hoje com alguém seguro e busque suporte profissional se houver risco ou abstinência."],
  ["Dificuldade financeira", "Mateus 6:33", "A ansiedade financeira não se vence com promessas fáceis. Deus chama seu povo à confiança, ao trabalho honesto, à mordomia, à generosidade e à sabedoria para pedir ajuda em tempos difíceis.", "Faça um orçamento simples, priorize o essencial e procure orientação prática na igreja."],
  ["Vida devocional", "Marcos 1:35", "Jesus buscava o Pai em oração. Vida devocional não é desempenho religioso; é um ritmo de escuta da Palavra, oração e obediência que sustenta a fé nos dias comuns.", "Separe dez minutos diários para ler um Evangelho e responder a Deus em oração."],
  ["Perdão", "Efésios 4:32", "Perdoar não chama o mal de bem nem dispensa justiça e limites. É entregar a vingança a Deus e recusar que a ofensa governe o coração, seguindo a graça que recebemos em Cristo.", "Nomeie a dor diante de Deus e converse com seu pastor em situações graves ou de abuso."],
  ["Empatia", "Romanos 12:15", "A empatia cristã se aproxima da alegria e da dor do próximo sem minimizar, corrigir apressadamente ou transformar a conversa em nós mesmos. Ela reflete o Deus que se fez carne.", "Pergunte a alguém como ele está e escute sem interromper nem oferecer soluções imediatas."],
  ["Serviço (Mordomia)", "1 Pedro 4:10", "Tudo o que recebemos pertence a Deus e foi confiado para servir. Tempo, dons, recursos e oportunidades florescem quando são oferecidos para o bem da igreja e do próximo.", "Escolha uma necessidade concreta da sua comunidade e sirva de forma prática."],
  ["Preparo para liderar", "2 Timóteo 2:15", "Preparar-se para liderar inclui caráter, conhecimento bíblico, vida de oração, serviço humilde e disposição para ser corrigido. O chamado é reconhecido e amadurecido no contexto da igreja local.", "Peça a um líder uma área específica para estudar e uma oportunidade simples para servir."],
  ["Batismo", "Romanos 6:3-4", "O batismo é a ordenança dada por Cristo à igreja: um testemunho público de união com sua morte e ressurreição. Não salva por si mesmo, mas expressa a fé e a nova vida do discípulo.", "Se você crê em Cristo e ainda não foi batizado, converse com seu pastor sobre os próximos passos."],
] as const;

function HomePage() {
  const { viewMode } = useApp();
  const nav = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [progressIds, setProgressIds] = useState<Set<string>>(new Set());
  const [modules, setModules] = useState<ModuleRow[]>([]);
  const [trails, setTrails] = useState<TrailRow[]>([]);

  useEffect(() => {
    void (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      setUserId(u.user.id);
      const [{ data: p }, { data: lp }, { data: mods }, { data: trs }] = await Promise.all([
        supabase
          .from("profiles")
          .select("display_name, first_name, avatar_char, xp, streak, onboarded")
          .eq("id", u.user.id)
          .maybeSingle(),
        supabase.from("lesson_progress").select("lesson_id").eq("user_id", u.user.id),
        supabase.from("disciple_modules").select("id, ord, title, description, color").order("ord"),
        supabase.from("disciple_trails").select("id, module_id, ord, title, lesson_id").order("ord"),
      ]);
      if (p && !p.onboarded) {
        void nav({ to: "/bem-vindo" });
        return;
      }
      if (p) setProfile(p as Profile);
      setProgressIds(new Set((lp ?? []).map((r) => r.lesson_id)));
      setModules((mods ?? []) as ModuleRow[]);
      setTrails((trs ?? []) as TrailRow[]);
    })();
  }, [nav]);

  const xp = profile?.xp ?? 0;
  const level50 = useMemo(() => checkLevel50Status(xp, progressIds), [xp, progressIds]);
  const level = getLevel(xp, { level50Unlocked: level50.unlocked });
  const nextLevel = getNextLevel(xp, { level50Unlocked: level50.unlocked });
  const character = CHARACTERS.find((c) => c.id === profile?.avatar_char) ?? CHARACTERS[0];
  const xpLeft = xpToNextLevel(xp, { level50Unlocked: level50.unlocked });
  const levelPct = levelProgressPct(xp, { level50Unlocked: level50.unlocked });
  const showLevel50Checklist = level50.xpOk && !level50.unlocked;

  // Títulos de nível variam muito de tamanho ("Crente Ruim" vs "Piloto de Carruagem
  // de Fogo") — em vez de cortar o texto (nowrap + overflow-hidden do card),
  // deixamos quebrar em até 2 linhas, com fonte um pouco menor para os títulos
  // mais compridos, pra garantir que nada fique cortado em telas estreitas.
  const levelTitleText = `Nível ${level.level}: ${level.title}`;
  const levelTitleSizeClass = levelTitleText.length > 32 ? "text-sm" : "text-base";

  if (viewMode === "lider") {
    return <LiderInline progressIds={progressIds} />;
  }

  const firstName =
    profile?.first_name?.trim() ||
    profile?.display_name?.trim().split(/\s+/)[0] ||
    "irmão";

  const trailsByModule = new Map<string, TrailRow[]>();
  for (const t of trails) {
    const arr = trailsByModule.get(t.module_id) ?? [];
    arr.push(t);
    trailsByModule.set(t.module_id, arr);
  }

  return (
    <div className="mx-auto max-w-lg space-y-5 px-4 pt-6">
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>

      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Saudação</p>
            <h1 className="text-xl font-semibold">A Paz, {firstName}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <PushNotifications />
          <MessagesLinkButton />
          <ThemeToggle />
        </div>
      </header>

      <section className="card-elevated overflow-hidden">
        <div className="bg-gradient-to-br from-primary/20 via-primary-glow/10 to-transparent p-5">
          <div className="flex items-stretch gap-4">
            <div className="relative w-20 shrink-0 overflow-hidden rounded-2xl bg-surface-2 ring-2 ring-primary/30">
              {level.avatar ? (
                <img src={level.avatar} alt={level.title} className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center text-4xl">{character.emoji}</span>
              )}
            </div>

            <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Seu progresso</p>
                <p className={`mt-0.5 font-bold leading-snug text-primary ${levelTitleSizeClass}`}>{levelTitleText}</p>
                <p className="text-xs text-muted-foreground">{profile?.xp ?? 0} XP acumulados</p>
                <p className="mt-1 truncate text-[10px] font-medium text-muted-foreground">
                  {nextLevel ? <>Próx: <span className="text-foreground font-semibold">Nv {nextLevel.level} · {nextLevel.title}</span></> : "Nível máximo"}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <div className="flex items-center gap-1 rounded-full bg-streak/20 px-2.5 py-1">
                  <Flame className="h-3.5 w-3.5 text-streak" />
                  <span className="text-xs font-bold text-streak">{profile?.streak ?? 0}</span>
                  <span className="text-[9px] text-muted-foreground">dias</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <div className="mb-1 flex justify-end">
              <span className="text-[10px] font-semibold text-muted-foreground">{Math.round(levelPct)}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-surface-2">
              <div className="h-full rounded-full bg-gradient-to-r from-primary to-primary-glow transition-all" style={{ width: `${levelPct}%` }} />
            </div>
            <div className="mt-1 flex justify-end">
              <span className="whitespace-nowrap text-[10px] font-medium text-primary">{xpLeft === null ? "🔥 Nível máximo" : `Faltam ${xpLeft} XP`}</span>
            </div>
          </div>
        </div>
        {showLevel50Checklist && (
          <div className="border-t border-border/60 bg-ancient/10 p-4">
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-ancient">
              <Sparkles className="h-3.5 w-3.5" /> Rumo ao Nível {GATED_LEVEL} · Discípulo
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Você já tem XP suficiente. Para se tornar Discípulo, conclua todo o conteúdo.
            </p>
          </div>
        )}
        <div className="flex justify-end border-t border-border/60 p-3">
          <Link
            to="/niveis"
            className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
          >
            Conheça os níveis
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {userId && <ChallengePanel myId={userId} />}



      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground">Módulos de Discipulado</h2>
        {modules.map((m) => {
          const mtrails = trailsByModule.get(m.id) ?? [];
          const withLesson = mtrails.filter((t) => t.lesson_id);
          const doneCount = withLesson.filter((t) => t.lesson_id && progressIds.has(t.lesson_id)).length;
          const total = mtrails.length;
          const pct = total ? (doneCount / total) * 100 : 0;

          const Icon = MODULE_ORDER_TO_ICON[m.ord] ?? BookOpen;
          const gradient = MODULE_ORDER_TO_GRADIENT[m.ord] ?? DEFAULT_MODULE_GRADIENT;
          const rgb = MODULE_ORDER_TO_RGB[m.ord] ?? DEFAULT_MODULE_RGB;
          const isLocked = pct === 0;
          const isComplete = pct === 100;
          const accentStyle = {
            "--accent": `rgb(${rgb})`,
            "--accent-light": `color-mix(in srgb, rgb(${rgb}) 72%, white)`,
            "--accent-dim": `color-mix(in srgb, rgb(${rgb}) 14%, transparent)`,
            "--accent-soft": `color-mix(in srgb, rgb(${rgb}) 20%, transparent)`,
            "--accent-border": `color-mix(in srgb, rgb(${rgb}) 30%, transparent)`,
            "--accent-badge": `color-mix(in srgb, rgb(${rgb}) 15%, transparent)`,
          } as React.CSSProperties;

          return (
            <Link
              key={m.id}
              to="/modulo/$id"
              params={{ id: m.id }}
              style={accentStyle}
              className={`group relative block overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} p-4 border border-white/10 transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_30px_var(--accent-dim)] hover:border-[var(--accent-border)]`}
            >
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-[var(--accent-soft)] blur-3xl rounded-full group-hover:bg-[var(--accent-dim)] transition-colors duration-500" />

              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-1000 ease-in-out pointer-events-none" />

              <div className="relative flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 bg-white/10 backdrop-blur-sm border border-white/10 group-hover:bg-[var(--accent-soft)] group-hover:border-[var(--accent-border)] transition-colors duration-300">
                  <Icon className="h-5 w-5 text-white/90 group-hover:text-[var(--accent)] transition-colors duration-300" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">
                      Módulo {m.ord}
                    </span>
                    {!isLocked && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[var(--accent-badge)] border border-[var(--accent-border)] text-[9px] font-bold uppercase tracking-wider text-[var(--accent)]">
                        <span className="w-1 h-1 rounded-full bg-[var(--accent)] animate-pulse" />
                        Nível {m.ord}
                      </span>
                    )}
                  </div>

                  <p className="font-semibold truncate text-white/95 mt-0.5">{m.title}</p>
                  {m.description && (
                    <p className="text-xs text-white/60 truncate">{m.description}</p>
                  )}

                  <div className="mt-2.5 flex items-center gap-3">
                    <div className="h-2 flex-1 rounded-full bg-white/10 overflow-hidden p-[2px]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-light)] shadow-[0_0_10px_var(--accent-soft)] transition-all duration-500 relative overflow-hidden"
                        style={{ width: `${pct}%` }}
                      >
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                          style={{ animation: "shimmer 2s infinite" }}
                        />
                      </div>
                    </div>
                    <span className="text-[10px] text-white/70 whitespace-nowrap font-bold">
                      {doneCount}/{total}
                    </span>
                  </div>
                </div>

                <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0 bg-white/5 border border-white/10 group-hover:bg-[var(--accent-soft)] group-hover:border-[var(--accent-border)] group-hover:translate-x-0.5 transition-all duration-300">
                  <ChevronRight className="h-4 w-4 text-white/60 group-hover:text-[var(--accent)] transition-colors duration-300" />
                </div>
              </div>

              {isComplete && (
                <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
              )}
            </Link>
          );
        })}
        {modules.length === 0 && (
          <div className="card-elevated p-4 text-center text-xs text-muted-foreground">
            Carregando módulos...
          </div>
        )}
      </section>
    </div>
  );
}

function LiderInline({ progressIds }: { progressIds: Set<string> }) {
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<number | null>(null);
  const leaderLessonsDone = LEADER_LESSON_IDS.filter((lessonId) => progressIds.has(lessonId)).length;

  return <div className="mx-auto max-w-lg space-y-5 px-4 pt-6">
    <header className="flex items-center justify-between">
      <h1 className="text-xl font-semibold">Modo Líder</h1>
      <ThemeToggle />
    </header>

    <section className="space-y-2">
      <h2 className="px-1 text-sm font-semibold text-muted-foreground">Formação de liderança</h2>
      <Link to="/modulo/$id" params={{ id: "como-ser-lider" }} className="group relative block overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-950 via-indigo-950 to-slate-900 p-4 transition-all duration-300 hover:scale-[1.01]">
        <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-violet-400/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10"><Crown className="h-5 w-5 text-white/90" /></div>
          <div className="min-w-0 flex-1"><span className="text-[10px] font-bold uppercase tracking-widest text-white/70">Módulo de liderança</span><p className="mt-0.5 truncate font-semibold text-white/95">Como ser um líder</p><p className="truncate text-xs text-white/60">10 trilhas para liderar à maneira de Cristo</p><div className="mt-2.5 flex items-center gap-3"><div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10 p-[2px]"><div className="h-full rounded-full bg-gradient-to-r from-violet-300 to-indigo-200" style={{ width: `${leaderLessonsDone * 10}%` }} /></div><span className="text-[10px] font-bold text-white/70">{leaderLessonsDone}/10</span></div></div>
          <ChevronRight className="h-4 w-4 text-white/60" />
        </div>
      </Link>
    </section>

    <section className="space-y-2">
      <h2 className="px-1 text-sm font-semibold text-muted-foreground">Apoio ao discipulado</h2>
      <button onClick={() => { setSelectedContent(null); setLibraryOpen(true); }} className="group relative block w-full overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-black via-zinc-900 to-black p-4 text-left transition-all hover:scale-[1.01]">
        <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex items-center gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10"><BookOpen className="h-5 w-5 text-white" /></div><div className="min-w-0 flex-1"><span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Biblioteca pastoral</span><p className="mt-0.5 font-semibold text-white">Conteúdos para discípulos</p><p className="truncate text-xs text-white/60">13 temas para conversas e acompanhamento</p></div><ChevronRight className="h-4 w-4 text-white/60" /></div>
      </button>
    </section>

    <Link to="/lider" className="card-elevated flex items-center justify-between p-4 text-sm font-semibold transition-colors hover:border-primary/50"><span>Gerenciar discípulos, grupos e encontros</span><ChevronRight className="h-4 w-4 text-primary" /></Link>

    <Dialog open={libraryOpen} onOpenChange={setLibraryOpen}><DialogContent className="max-h-[85vh] overflow-y-auto"><DialogHeader><DialogTitle>Conteúdos para discípulos</DialogTitle><DialogDescription>Material de apoio bíblico. Ele complementa, mas não substitui, a comunhão e o cuidado da igreja local.</DialogDescription></DialogHeader>{selectedContent === null ? <div className="grid gap-2">{DISCIPLE_CONTENTS.map(([title, verse], index) => <button key={title} onClick={() => setSelectedContent(index)} className="flex items-center justify-between rounded-xl border border-border p-3 text-left hover:border-primary/60"><div><p className="text-sm font-semibold">{title}</p><p className="text-xs text-muted-foreground">{verse}</p></div><ChevronRight className="h-4 w-4 text-muted-foreground" /></button>)}</div> : <LeaderContentDetail content={DISCIPLE_CONTENTS[selectedContent]} onBack={() => setSelectedContent(null)} />}</DialogContent></Dialog>
  </div>;
}

function LeaderContentDetail({ content, onBack }: { content: readonly [string, string, string, string]; onBack: () => void }) {
  const [title, verse, teaching, practice] = content;
  return <div className="space-y-4"><button onClick={onBack} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Todos os temas</button><section className="rounded-2xl border border-border bg-surface p-4"><p className="text-xs font-semibold uppercase tracking-wider text-primary">Fundamentação bíblica</p><h3 className="mt-1 text-xl font-bold">{title}</h3><p className="mt-3 font-medium text-primary">{verse}</p></section><section className="card-elevated p-4"><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Para caminhar junto</p><p className="mt-2 text-sm leading-relaxed">{teaching}</p></section><section className="rounded-2xl border border-ancient/30 bg-ancient/5 p-4"><p className="text-xs font-semibold uppercase tracking-wider text-ancient">Passo prático</p><p className="mt-2 text-sm leading-relaxed">{practice}</p></section><p className="text-center text-xs text-muted-foreground">Estude a Bíblia em oração e, quando necessário, procure seu pastor, líder ou um profissional qualificado.</p></div>;
}

// Confetti/celebração removida deste arquivo — permanece disponível globalmente pelos hooks de lição.
export function ChecklistDone({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-success">
      <Check className="h-3.5 w-3.5" /> {label}
    </span>
  );
}
