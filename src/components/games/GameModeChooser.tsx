import { ArrowLeft, ArrowRight, Swords, Sparkles, UserRound, Users } from "lucide-react";

type GameModeChooserProps = {
  title: string;
  description: string;
  onBack: () => void;
  onSinglePlayer: () => void;
  onMultiplayer: () => void;
};

export function GameModeChooser({ title, description, onBack, onSinglePlayer, onMultiplayer }: GameModeChooserProps) {
  return (
    <main className="game-arena-page min-h-screen bg-background">
      <div className="mx-auto max-w-lg px-4 pb-28 pt-5">
        <button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Jogos
        </button>
        <header className="game-mode-hero relative mt-10 overflow-hidden rounded-[2rem] border border-primary/20 bg-gradient-to-br from-primary/20 via-surface to-ancient/10 p-5 shadow-xl shadow-primary/10">
          <Sparkles className="pointer-events-none absolute -right-3 -top-3 h-24 w-24 text-primary/10" />
          <p className="relative text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">Escolha como jogar</p>
          <h1 className="relative mt-1 text-3xl font-extrabold">{title}</h1>
          <p className="relative mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
          <div className="relative mt-4 flex flex-wrap gap-2 text-[10px] font-bold text-muted-foreground"><span className="rounded-full bg-background/50 px-2.5 py-1.5 ring-1 ring-white/10">Pontuação salva</span><span className="rounded-full bg-background/50 px-2.5 py-1.5 ring-1 ring-white/10">Desafio bíblico</span></div>
        </header>
        <section className="mt-8 space-y-3">
          <button type="button" onClick={onSinglePlayer} className="game-mode-card group flex w-full items-center gap-4 rounded-3xl border border-primary/30 bg-surface p-5 text-left shadow-lg shadow-primary/5 transition hover:-translate-y-1 hover:border-primary/70">
            <span className="game-mode-icon flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.35rem] bg-primary/15 text-primary"><UserRound className="h-8 w-8" /></span>
            <span className="min-w-0 flex-1"><span className="block text-base font-extrabold">Single Player</span><span className="mt-1 block text-xs leading-relaxed text-muted-foreground">Jogue no seu ritmo e acompanhe seu próprio desempenho.</span></span>
            <ArrowRight className="h-5 w-5 shrink-0 text-primary transition group-hover:translate-x-1" />
          </button>
          <button type="button" onClick={onMultiplayer} className="game-mode-card group flex w-full items-center gap-4 rounded-3xl border border-ancient/30 bg-surface p-5 text-left shadow-lg shadow-ancient/5 transition hover:-translate-y-1 hover:border-ancient/70">
            <span className="game-mode-icon flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.35rem] bg-ancient/15 text-ancient"><Users className="h-8 w-8" /></span>
            <span className="min-w-0 flex-1"><span className="flex items-center gap-2 text-base font-extrabold">Multiplayer <Swords className="h-4 w-4 text-ancient" /></span><span className="mt-1 block text-xs leading-relaxed text-muted-foreground">Crie uma sala e compita com até quatro jogadores.</span></span>
            <ArrowRight className="h-5 w-5 shrink-0 text-ancient transition group-hover:translate-x-1" />
          </button>
        </section>
      </div>
    </main>
  );
}
