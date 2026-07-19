import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { readingPlans } from "@/data/estudos";
import { supabase } from "@/integrations/supabase/client";
import { useCelebration } from "@/lib/celebration";
import { awardXpAndStreak } from "@/lib/progress";
import { ArrowLeft, CalendarDays, CheckCircle2, Circle, Clock, Lock } from "lucide-react";

export const Route = createFileRoute("/_authenticated/estudos/plano/$id")({
  component: PlanoPage,
});

export function planStorageKey(id: string) {
  return `disciple.plan.${id}`;
}

function PlanoPage() {
  const { id } = Route.useParams();
  const plan = readingPlans.find((p) => p.id === id);
  const storageKey = planStorageKey(id);
  const [done, setDone] = useState<Set<number>>(new Set());
  const { celebrateActivity } = useCelebration();

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
  const nextDay = (() => {
    for (let d = 1; d <= plan.totalDays; d++) if (!done.has(d)) return d;
    return null;
  })();

  return (
    <div className="mx-auto max-w-lg space-y-5 px-4 pt-6 pb-24">
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

      <div className="card-elevated border-l-4 border-l-success p-4">
        <p className="scripture text-sm leading-relaxed text-foreground/90">{plan.intro}</p>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Progresso</span>
          <span className="font-semibold text-foreground">{done.size}/{plan.totalDays} dias · {pct}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-surface-2">
          <div className="h-full bg-gradient-to-r from-success to-primary transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="space-y-2">
        {plan.days.map((d) => {
          const checked = done.has(d.day);
          const isNext = d.day === nextDay;
          const previousDone = d.day === 1 || done.has(d.day - 1);
          const dimmed = !checked && !isNext && !previousDone;
          return (
            <article
              key={d.day}
              className={`card-elevated overflow-hidden p-4 transition-all ${
                checked
                  ? "border-success/40 bg-success/5"
                  : isNext
                    ? "border-primary/60 bg-primary/5 shadow-md shadow-primary/10"
                    : dimmed
                      ? "opacity-60"
                      : "border-border"
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggle(d.day)}
                  className="mt-0.5 shrink-0"
                  aria-label={checked ? `Desmarcar dia ${d.day}` : `Marcar dia ${d.day} como lido`}
                >
                  {checked ? (
                    <CheckCircle2 className="h-6 w-6 text-success" />
                  ) : dimmed ? (
                    <Lock className="h-6 w-6 text-muted-foreground" />
                  ) : (
                    <Circle className="h-6 w-6 text-muted-foreground hover:text-primary" />
                  )}
                </button>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                      isNext ? "bg-primary/20 text-primary" : "bg-surface-2 text-muted-foreground"
                    }`}>
                      Dia {d.day}
                    </span>
                    {isNext && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">Próximo</span>
                    )}
                  </div>
                  <p className="font-serif text-sm font-medium text-ancient">{d.refs.join(" · ")}</p>
                  <p className="text-xs font-medium text-foreground/80">{d.focus}</p>
                  <p className="text-xs leading-relaxed text-muted-foreground">{d.commentary}</p>
                  {!checked && (
                    <button
                      onClick={() => toggle(d.day)}
                      className={`mt-1 w-full rounded-xl py-2 text-xs font-semibold transition-all ${
                        isNext
                          ? "bg-primary text-primary-foreground hover:bg-primary-glow"
                          : "border border-border text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      Marcar como lido
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
