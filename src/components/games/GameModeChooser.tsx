import { ArrowLeft, ArrowRight, Swords, UserRound, Users } from "lucide-react";

type GameModeChooserProps = {
  title: string;
  description: string;
  onBack: () => void;
  onSinglePlayer: () => void;
  onMultiplayer: () => void;
};

export function GameModeChooser({ title, description, onBack, onSinglePlayer, onMultiplayer }: GameModeChooserProps) {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-lg px-4 pb-28 pt-5">
        <button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Jogos
        </button>
        <header className="mt-10">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">Escolha como jogar</p>
          <h1 className="mt-1 text-3xl font-extrabold">{title}</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
        </header>
        <section className="mt-8 space-y-3">
          <button type="button" onClick={onSinglePlayer} className="group flex w-full items-center gap-4 rounded-3xl border border-primary/30 bg-surface p-5 text-left shadow-lg shadow-primary/5 transition hover:-translate-y-0.5 hover:border-primary/70">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary"><UserRound className="h-7 w-7" /></span>
            <span className="min-w-0 flex-1"><span className="block text-base font-extrabold">Single Player</span><span className="mt-1 block text-xs leading-relaxed text-muted-foreground">Jogue no seu ritmo e acompanhe seu próprio desempenho.</span></span>
            <ArrowRight className="h-5 w-5 shrink-0 text-primary transition group-hover:translate-x-1" />
          </button>
          <button type="button" onClick={onMultiplayer} className="group flex w-full items-center gap-4 rounded-3xl border border-ancient/30 bg-surface p-5 text-left shadow-lg shadow-ancient/5 transition hover:-translate-y-0.5 hover:border-ancient/70">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-ancient/15 text-ancient"><Users className="h-7 w-7" /></span>
            <span className="min-w-0 flex-1"><span className="flex items-center gap-2 text-base font-extrabold">Multiplayer <Swords className="h-4 w-4 text-ancient" /></span><span className="mt-1 block text-xs leading-relaxed text-muted-foreground">Crie uma sala e compita com até quatro jogadores.</span></span>
            <ArrowRight className="h-5 w-5 shrink-0 text-ancient transition group-hover:translate-x-1" />
          </button>
        </section>
      </div>
    </main>
  );
}
