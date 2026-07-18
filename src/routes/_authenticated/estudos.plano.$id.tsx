import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { readingPlans } from "@/data/estudos";
import { ArrowLeft, CheckCircle2, Circle, Clock, CalendarDays } from "lucide-react";

export const Route = createFileRoute("/_authenticated/estudos/plano/$id")({
  component: PlanoPage,
});

function PlanoPage() {
  const { id } = Route.useParams();
  const plan = readingPlans.find((p) => p.id === id);
  const storageKey = `disciple.plan.${id}`;
  const [done, setDone] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(storageKey);
    if (raw) {
      try {
        setDone(new Set(JSON.parse(raw) as number[]));
      } catch {
        /* ignore */
      }
    }
  }, [storageKey]);

  if (!plan) {
    return (
      <div className="mx-auto max-w-lg p-6 text-center">
        <p>Plano não encontrado.</p>
        <Link to="/estudos" className="mt-4 inline-block text-primary underline">Voltar</Link>
      </div>
    );
  }

  const toggle = (day: number) => {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(storageKey, JSON.stringify([...next]));
      }
      return next;
    });
  };

  const pct = Math.round((done.size / plan.totalDays) * 100);

  return (
    <div className="mx-auto max-w-lg space-y-5 px-4 pt-6">
      <Link to="/estudos" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Estudos
      </Link>

      <header className="space-y-2">
        <span className="inline-block rounded-full bg-success/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-success">
          Plano de Leitura
        </span>
        <h1 className="text-2xl font-semibold">{plan.title}</h1>
        <p className="text-sm text-muted-foreground">{plan.description}</p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1"><CalendarDays className="h-3 w-3" /> {plan.totalDays} dias</span>
          <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {plan.minutesPerDay} min/dia</span>
        </div>
      </header>

      <div className="card-elevated p-4">
        <p className="font-serif text-sm leading-relaxed text-foreground/90">{plan.intro}</p>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Progresso</span>
          <span>{done.size}/{plan.totalDays} dias · {pct}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-surface-2">
          <div className="h-full bg-gradient-to-r from-primary to-primary-glow transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="space-y-2">
        {plan.days.map((d) => {
          const checked = done.has(d.day);
          return (
            <button
              key={d.day}
              onClick={() => toggle(d.day)}
              className={`card-elevated w-full p-3 text-left transition-all ${
                checked ? "border-success/40 bg-success/5" : "hover:border-primary/40"
              }`}
            >
              <div className="flex items-start gap-3">
                {checked ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                ) : (
                  <Circle className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Dia {d.day}
                    </span>
                    <span className="font-serif text-sm font-medium text-ancient">
                      {d.refs.join(" · ")}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-foreground/80">{d.focus}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
