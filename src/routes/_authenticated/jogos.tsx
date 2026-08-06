import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, Gamepad2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/jogos")({ component: JogosPage });

const games = [
  { title: "Quem é o personagem?", description: "Descubra personagens bíblicos usando três pistas da Palavra.", to: "/jogos/personagem" as const, symbol: "✦", tone: "from-violet-500/30 via-primary/10 to-surface", accent: "text-violet-200" },
  { title: "Qual é o versículo?", description: "Reconheça o contexto e encontre a passagem certa.", to: "/jogos/versiculo" as const, symbol: "⌁", tone: "from-emerald-500/25 via-teal-500/10 to-surface", accent: "text-emerald-200" },
  { title: "Palavras cruzadas", description: "Complete o desafio com termos e histórias bíblicas.", to: "/jogos/cruzadas" as const, symbol: "╳", tone: "from-amber-500/25 via-orange-500/10 to-surface", accent: "text-amber-200" },
  { title: "Quiz do milhão", description: "Suba a escada de perguntas e teste seu conhecimento.", to: "/jogos/milhao" as const, symbol: "◆", tone: "from-fuchsia-500/25 via-purple-500/10 to-surface", accent: "text-fuchsia-200" },
];

function JogosPage() {
  const location = useLocation();
  if (location.pathname !== "/jogos") return <Outlet />;

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-lg px-4 pb-28 pt-5">
        <header className="flex items-start justify-between gap-4">
          <div>
            <Link to="/perfil" className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground"><ArrowLeft className="h-3.5 w-3.5" /> Você</Link>
            <p className="mt-6 text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">Comunidade</p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight">Jogos</h1>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">Aprenda, relembre e desafie seus irmãos com experiências baseadas na Bíblia.</p>
          </div>
          <span className="mt-8 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary"><Gamepad2 className="h-6 w-6" /></span>
        </header>

        <section className="mt-8 space-y-3">
          <div className="px-1"><p className="text-xs font-extrabold uppercase tracking-[0.16em] text-muted-foreground">Escolha um desafio</p></div>
          {games.map((game) => {
            return <Link key={game.title} to={game.to} className={`group flex min-h-[112px] items-center gap-4 rounded-[1.75rem] border border-white/10 bg-gradient-to-br ${game.tone} p-4 shadow-lg shadow-black/10 transition-all hover:-translate-y-0.5 hover:border-white/25 hover:shadow-primary/10`}><span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-background/40 text-3xl font-black leading-none ring-1 ring-white/10 ${game.accent}`} aria-hidden="true">{game.symbol}</span><span className="min-w-0 flex-1"><span className="block text-base font-extrabold tracking-tight">{game.title}</span><span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{game.description}</span></span><ArrowRight className="h-5 w-5 shrink-0 text-foreground/70 transition-transform group-hover:translate-x-1" /></Link>;
          })}
        </section>
        <p className="mt-6 flex items-center justify-center gap-2 text-center text-[11px] text-muted-foreground"><CheckCircle2 className="h-3.5 w-3.5 text-success" /> Conteúdo revisado com referências bíblicas.</p>
      </div>
    </main>
  );
}
