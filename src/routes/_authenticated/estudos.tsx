import { createFileRoute } from "@tanstack/react-router";
import { studies } from "@/data/content";
import { ViewModeToggle } from "@/components/ViewModeToggle";
import { Clock } from "lucide-react";

export const Route = createFileRoute("/_authenticated/estudos")({
  component: EstudosPage,
});

const categoryColor: Record<string, string> = {
  "Estudo Bíblico": "bg-primary/20 text-primary",
  "Plano de Leitura": "bg-success/20 text-success",
  "Meditação IA": "bg-ancient/20 text-ancient",
};

function EstudosPage() {
  return (
    <div className="mx-auto max-w-lg space-y-5 px-4 pt-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Biblioteca</p>
          <h1 className="text-xl font-semibold">Estudos</h1>
        </div>
        <ViewModeToggle />
      </header>

      <p className="text-sm text-muted-foreground">
        Conteúdo avulso para consumo livre — separado das trilhas estruturadas.
      </p>

      <div className="space-y-3">
        {studies.map((s) => (
          <button
            key={s.id}
            className="card-elevated w-full p-4 text-left transition-all hover:border-primary/50"
          >
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${categoryColor[s.category]}`}>
                {s.category}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                <Clock className="h-3 w-3" /> {s.minutes} min
              </span>
            </div>
            <h3 className="mt-2 font-semibold">{s.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
