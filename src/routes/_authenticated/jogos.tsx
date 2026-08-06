import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Brain, CheckCircle2, Gamepad2, HelpCircle, LockKeyhole, Sparkles, Trophy } from "lucide-react";

export const Route = createFileRoute("/_authenticated/jogos")({ component: JogosPage });

const games = [
  { title: "Quem é o personagem?", description: "Descubra personagens bíblicos usando três pistas da Palavra.", to: "/jogos/personagem" as const, icon: Brain, tone: "from-primary/30 to-primary/5", active: true },
  { title: "Qual é o versículo?", description: "Reconheça o contexto e encontre a passagem certa.", to: "/jogos/versiculo" as const, icon: HelpCircle, tone: "from-success/20 to-success/5", active: true },
  { title: "Palavras cruzadas", description: "Complete o desafio com termos e histórias bíblicas.", to: "/jogos/cruzadas" as const, icon: Sparkles, tone: "from-ancient/25 to-ancient/5", active: true },
  { title: "Quiz do milhão", description: "Suba a escada de perguntas e teste seu conhecimento.", to: "/jogos/milhao" as const, icon: Trophy, tone: "from-purple-500/25 to-purple-500/5", active: true },
];

function JogosPage() {
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

        <section className="mt-7 rounded-[1.75rem] border border-border bg-surface/70 p-5 shadow-lg shadow-black/10">
          <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ancient/15 text-ancient"><Trophy className="h-5 w-5" /></span><div><p className="text-sm font-extrabold">Uma pausa que edifica</p><p className="text-xs text-muted-foreground">Pontue e compartilhe seu resultado.</p></div></div>
        </section>

        <section className="mt-7 space-y-3">
          <div className="px-1"><p className="text-xs font-extrabold uppercase tracking-[0.16em] text-muted-foreground">Escolha um desafio</p></div>
          {games.map((game) => {
            const Icon = game.icon;
            const content = <><span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${game.tone} text-primary ring-1 ring-white/5`}><Icon className="h-6 w-6" /></span><span className="min-w-0 flex-1"><span className="flex items-center gap-2"><span className="text-base font-extrabold">{game.title}</span>{!game.active && <span className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground"><LockKeyhole className="h-3 w-3" /> Em breve</span>}</span><span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{game.description}</span></span>{game.active ? <ArrowRight className="h-5 w-5 shrink-0 text-primary transition-transform group-hover:translate-x-1" /> : <LockKeyhole className="h-4 w-4 shrink-0 text-muted-foreground/50" />}</>;
            return game.active ? <Link key={game.title} to={game.to} className="group flex items-center gap-4 rounded-3xl border border-primary/25 bg-surface p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/55 hover:shadow-primary/10">{content}</Link> : <div key={game.title} className="flex items-center gap-4 rounded-3xl border border-border bg-surface/50 p-4 opacity-75">{content}</div>;
          })}
        </section>
        <p className="mt-6 flex items-center justify-center gap-2 text-center text-[11px] text-muted-foreground"><CheckCircle2 className="h-3.5 w-3.5 text-success" /> Conteúdo revisado com referências bíblicas.</p>
      </div>
    </main>
  );
}
