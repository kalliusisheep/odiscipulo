import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, BookOpenText, CheckCircle2, Gamepad2, Grid2X2, Trophy, UserRound, Users } from "lucide-react";
import { GameAudioControls } from "@/components/games/GameAudioControls";

export const Route = createFileRoute("/_authenticated/jogos")({ component: JogosPage });

const games = [
  { title: "Quiz do milhão", description: "Suba a escada de perguntas e teste seu conhecimento.", meta: "Combo e ranking", tag: "Escalada", to: "/jogos/milhao" as const, icon: Trophy, tone: "from-fuchsia-500/30 via-purple-500/15 to-surface", accent: "text-fuchsia-200", dot: "bg-fuchsia-300" },
  { title: "Quem é o personagem?", description: "Descubra personagens bíblicos usando quatro pistas da Palavra.", meta: "Pistas e velocidade", tag: "Arena", to: "/jogos/personagem" as const, icon: UserRound, tone: "from-violet-500/35 via-primary/15 to-surface", accent: "text-violet-200", dot: "bg-violet-300" },
  { title: "Qual é o versículo?", description: "Reconheça o contexto e encontre a passagem certa.", meta: "Memória e contexto", tag: "Bíblia", to: "/jogos/versiculo" as const, icon: BookOpenText, tone: "from-emerald-500/30 via-teal-500/15 to-surface", accent: "text-emerald-200", dot: "bg-emerald-300" },
  { title: "Palavras cruzadas", description: "Complete o desafio com termos e histórias bíblicas.", meta: "Precisão e sequência", tag: "Grade", to: "/jogos/cruzadas" as const, icon: Grid2X2, tone: "from-amber-500/30 via-orange-500/15 to-surface", accent: "text-amber-200", dot: "bg-amber-300" },
];

function JogosPage() {
  const location = useLocation();
  if (location.pathname !== "/jogos") return <><Outlet /><GameAudioControls /></>;

  return (
    <main className="game-arena-page min-h-screen bg-background">
      <div className="mx-auto max-w-lg px-4 pb-28 pt-5">
        <header className="flex items-start justify-between gap-4">
          <div>
            <Link to="/perfil" className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground"><ArrowLeft className="h-3.5 w-3.5" /> Você</Link>
            <p className="mt-6 text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">Comunidade</p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight">Jogos</h1>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">Aprenda, relembre e desafie seus irmãos com experiências baseadas na Bíblia.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="game-stat-pill"><Trophy className="h-3.5 w-3.5" /> 4 arenas</span>
              <span className="game-stat-pill"><Users className="h-3.5 w-3.5" /> Até 4 players</span>
            </div>
          </div>
          <span className="mt-8 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary"><Gamepad2 className="h-6 w-6" /></span>
        </header>

        <Link to="/ranking" className="mt-5 flex items-center justify-between rounded-2xl border border-ancient/25 bg-ancient/10 px-4 py-3 text-sm font-extrabold text-ancient"><span className="flex items-center gap-2"><Trophy className="h-4 w-4" /> Ranking global dos jogos</span><ArrowRight className="h-4 w-4" /></Link>

        <section className="relative mt-7 h-40 overflow-hidden rounded-[1.75rem] border border-white/10 bg-surface shadow-xl shadow-black/20" aria-label="Comunidade jogando">
          <img src="/jogos-hero.jpeg" alt="Ovelhas jogando juntas" className="absolute inset-0 h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080b18]/95 via-[#080b18]/55 to-[#080b18]/10" />
          <div className="relative flex h-full max-w-[72%] flex-col justify-end p-5">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-primary-foreground/75">Comunidade em jogo</p>
            <h2 className="mt-1 text-xl font-extrabold tracking-tight text-white">Jogue junto. Aprenda sempre.</h2>
            <p className="mt-1 text-xs leading-relaxed text-white/70">Desafios rápidos para transformar conhecimento em uma caminhada compartilhada.</p>
          </div>
        </section>

        <section className="mt-8 space-y-3">
          <div className="px-1"><p className="text-xs font-extrabold uppercase tracking-[0.16em] text-muted-foreground">Escolha um desafio</p></div>
          {games.map((game) => {
            const Icon = game.icon;
            return <Link key={game.title} to={game.to} search={{} as never} className={`game-card group flex min-h-[124px] items-center gap-4 rounded-[1.75rem] border border-white/10 bg-gradient-to-br ${game.tone} p-4 shadow-lg shadow-black/10 transition-all hover:-translate-y-1 hover:border-white/30 hover:shadow-primary/15`}>
              <span className={`game-card-icon flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.35rem] bg-background/45 ring-1 ring-white/15 ${game.accent}`} aria-hidden="true"><Icon className="h-8 w-8" strokeWidth={2} /></span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2"><span className="block text-base font-extrabold tracking-tight">{game.title}</span><span className="hidden rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-white/70 min-[390px]:inline">{game.tag}</span></span>
                <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{game.description}</span>
                <span className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-bold text-white/55"><span className={`h-1.5 w-1.5 rounded-full ${game.dot}`} /> {game.meta}</span>
              </span>
              <span className="game-card-arrow flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-background/25 text-foreground/75 ring-1 ring-white/10 transition-transform group-hover:translate-x-1"><ArrowRight className="h-5 w-5" /></span>
            </Link>;
          })}
        </section>
        <p className="mt-6 flex items-center justify-center gap-2 text-center text-[11px] text-muted-foreground"><CheckCircle2 className="h-3.5 w-3.5 text-success" /> Conteúdo revisado com referências bíblicas.</p>
      </div>
    </main>
  );
}
