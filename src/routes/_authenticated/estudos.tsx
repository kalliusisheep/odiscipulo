import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { readingPlans, bibleStudies, aiMeditations } from "@/data/estudos";
import { planStorageKey } from "./estudos.plano.$id";

import { ViewModeToggle } from "@/components/ViewModeToggle";
import { Clock, CalendarDays, BookOpen, Sparkles, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/estudos")({
  component: EstudosPage,
});

type Tab = "planos" | "biblicos" | "meditacao";

const tabs: { id: Tab; label: string; icon: typeof BookOpen }[] = [
  { id: "planos", label: "Planos", icon: CalendarDays },
  { id: "biblicos", label: "Bíblicos", icon: BookOpen },
  { id: "meditacao", label: "Meditação IA", icon: Sparkles },
];

function EstudosPage() {
  const [tab, setTab] = useState<Tab>("planos");
  const [planProgress, setPlanProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    const next: Record<string, number> = {};
    for (const p of readingPlans) {
      const raw = window.localStorage.getItem(planStorageKey(p.id));
      if (raw) {
        try { next[p.id] = (JSON.parse(raw) as number[]).length; } catch { /* ignore */ }
      }
    }
    setPlanProgress(next);
  }, []);


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
        Conteúdo avulso — planos de leitura, estudos temáticos e meditações guiadas com IA.
      </p>

      <div className="flex gap-1 rounded-2xl border border-border bg-surface p-1">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-xs font-medium transition-all ${
                active
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "planos" && (
        <div className="space-y-3">
          {readingPlans.map((p) => (
            <Link
              key={p.id}
              to="/estudos/plano/$id"
              params={{ id: p.id }}
              className="card-elevated block p-4 transition-all hover:border-primary/50"
            >
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-success/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-success">
                  Plano de Leitura
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  <CalendarDays className="h-3 w-3" /> {p.totalDays} dias
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock className="h-3 w-3" /> {p.minutesPerDay} min/dia
                </span>
              </div>
              <h3 className="mt-2 font-semibold">{p.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
              <div className="mt-2 flex items-center gap-1 text-xs text-primary">
                Ver plano <ArrowRight className="h-3 w-3" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {tab === "biblicos" && (
        <div className="space-y-3">
          {bibleStudies.map((s) => (
            <Link
              key={s.id}
              to="/estudos/biblico/$id"
              params={{ id: s.id }}
              className="card-elevated block p-4 transition-all hover:border-primary/50"
            >
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-primary/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                  Estudo Bíblico
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock className="h-3 w-3" /> {s.minutes} min
                </span>
              </div>
              <h3 className="mt-2 font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
              <p className="mt-1 font-serif text-xs italic text-ancient">{s.passage}</p>
            </Link>
          ))}
        </div>
      )}

      {tab === "meditacao" && (
        <div className="space-y-3">
          {aiMeditations.map((m) => (
            <Link
              key={m.id}
              to="/estudos/meditacao/$id"
              params={{ id: m.id }}
              className="card-elevated block p-4 transition-all hover:border-primary/50"
            >
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-ancient/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ancient">
                  <Sparkles className="h-3 w-3" /> Meditação IA
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock className="h-3 w-3" /> {m.minutes} min
                </span>
              </div>
              <h3 className="mt-2 font-semibold">{m.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{m.description}</p>
              <p className="mt-1 font-serif text-xs italic text-ancient">{m.passage}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
