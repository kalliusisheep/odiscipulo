import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { LEVELS } from "@/data/levels";

export const Route = createFileRoute("/_authenticated/preview_niveis")({
  component: NiveisPage,
});

function NiveisPage() {
  return (
    <div className="mx-auto max-w-lg space-y-5 px-4 pt-6 pb-10">
      <header className="flex items-center gap-2">
        <Link to="/home" className="rounded-full p-2 hover:bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="text-xs text-muted-foreground">Progressão</p>
          <h1 className="text-xl font-semibold">Conheça os níveis</h1>
        </div>
      </header>

      <section className="space-y-2">
        {LEVELS.map((lvl) => (
          <div key={lvl.level} className="card-elevated flex items-center gap-4 p-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-surface-2 ring-2 ring-primary/20">
              {lvl.avatar ? (
                <img
                  src={lvl.avatar}
                  alt={lvl.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center text-xl">
                  ✦
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Nível {lvl.level}
              </p>
              <p className="truncate font-semibold text-foreground">{lvl.title}</p>
              <p className="text-[11px] text-muted-foreground">{lvl.minXp} XP</p>
            </div>
          </div>
        ))}
      </section>

      <div className="flex justify-center pt-2">
        <Link
          to="/home"
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para a página inicial
        </Link>
      </div>
    </div>
  );
}
