import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useApp } from "@/lib/app-context";
import { useCelebration } from "@/lib/celebration";
import { awardXpAndStreak } from "@/lib/progress";
import { logActivityOnce } from "@/lib/activities";
import { fetchPassage, bibleLabelFor, stripVerseNumbers } from "@/lib/bible";
import { NarrationButton } from "@/components/NarrationButton";
import { FontSizeControls } from "@/components/font-size-controls";
import { useReadingFontScale } from "@/hooks/use-reading-font-scale";
import type { BibleVersion } from "@/data/content";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock,
  Loader2,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/estudos/plano/$id")({
  component: PlanoPage,
});

export function planStorageKey(id: string) {
  return `disciple.plan.${id}`;
}

type Plan = {
  id: string;
  title: string;
  description: string | null;
  intro: string | null;
  total_days: number;
  minutes_per_day: number | null;
};

type PlanDay = {
  day: number;
  refs: string[];
  passage_api_refs: string[];
  focus: string;
  context: string;
  reflection: string;
  application: string;
  prayer: string;
};

function PlanoPage() {
  const { id } = Route.useParams();
  const storageKey = planStorageKey(id);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [days, setDays] = useState<PlanDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState<Set<number>>(new Set());
  const [openDay, setOpenDay] = useState<number | null>(null);
  const { celebrateActivity } = useCelebration();
  const { bibleVersion } = useApp();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const [{ data: p }, { data: d }] = await Promise.all([
        supabase.from("reading_plans").select("*").eq("id", id).maybeSingle(),
        supabase
          .from("reading_plan_days")
          .select("day, refs, passage_api_refs, focus, context, reflection, application, prayer")
          .eq("plan_id", id)
          .order("day"),
      ]);
      if (cancelled) return;
      setPlan((p as Plan) ?? null);
      setDays((d as PlanDay[]) ?? []);
      setLoading(false);
      if (p) {
        const { data: u } = await supabase.auth.getUser();
        if (u.user && !cancelled) {
          void logActivityOnce(`plan-started-${u.user.id}-${id}`, {
            userId: u.user.id,
            type: "reading_plan_started",
            title: `Iniciou o plano de leitura "${(p as Plan).title}"`,
          });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

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

  const nextDay = useMemo(() => {
    if (!plan) return null;
    for (let i = 1; i <= plan.total_days; i++) if (!done.has(i)) return i;
    return null;
  }, [done, plan]);

  useEffect(() => {
    if (openDay === null && nextDay) setOpenDay(nextDay);
  }, [nextDay, openDay]);

  if (loading) {
    return (
      <div className="mx-auto flex max-w-lg items-center justify-center px-4 pt-16">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="mx-auto max-w-lg p-6 text-center">
        <p>Plano não encontrado.</p>
        <Link to="/estudos" className="mt-4 inline-block text-primary underline">
          Voltar
        </Link>
      </div>
    );
  }

  const toggle = (day: number) => {
    let becameChecked = false;
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(day)) {
        next.delete(day);
      } else {
        next.add(day);
        becameChecked = true;
      }
      if (typeof window !== "undefined") {
        window.localStorage.setItem(storageKey, JSON.stringify([...next]));
      }
      return next;
    });
    if (becameChecked) {
      void (async () => {
        const { data: u } = await supabase.auth.getUser();
        if (!u.user) return;
        const xp = 30;
        await supabase.from("lesson_progress").upsert(
          { user_id: u.user.id, lesson_id: `plan:${id}:${day}`, xp_gained: xp },
          { onConflict: "user_id,lesson_id" },
        );
        const { prevXp, newXp } = await awardXpAndStreak(u.user.id, xp);
        celebrateActivity({ prevXp, newXp, xp });
      })();
    }
  };

  const pct = Math.round((done.size / plan.total_days) * 100);

  return (
    <div className="mx-auto max-w-lg space-y-5 px-4 pb-28 pt-5">
      <Link
        to="/estudos"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Estudos
      </Link>

      <header className="rounded-3xl border border-border bg-surface/70 p-5 shadow-sm">
        <span className="inline-block rounded-full bg-success/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-success">
          Plano de Leitura
        </span>
        <h1 className="text-2xl font-semibold">{plan.title}</h1>
        {plan.description && (
          <p className="text-sm text-muted-foreground">{plan.description}</p>
        )}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="h-3 w-3" /> {plan.total_days} dias
          </span>
          {plan.minutes_per_day && (
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" /> {plan.minutes_per_day} min/dia
            </span>
          )}
        </div>
      </header>

      {plan.intro && (
        <div className="rounded-3xl border border-success/25 bg-success/5 p-5 shadow-sm">
          <p className="scripture text-base leading-relaxed text-foreground/90">{plan.intro}</p>
        </div>
      )}

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Progresso</span>
          <span className="font-semibold text-foreground">
            {done.size}/{plan.total_days} dias · {pct}%
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full bg-gradient-to-r from-success to-primary transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="space-y-2">
        {days.map((d) => {
          const checked = done.has(d.day);
          const isNext = d.day === nextDay;
          const open = openDay === d.day;
          return (
            <article
              key={d.day}
              className={`card-elevated overflow-hidden transition-all ${
                checked
                  ? "border-success/40 bg-success/5"
                  : isNext
                    ? "border-primary/60 bg-primary/5 shadow-md shadow-primary/10"
                    : "border-border"
              }`}
            >
              <div className="flex items-start gap-3 p-4">
                <button
                  onClick={() => toggle(d.day)}
                  className="mt-0.5 shrink-0"
                  aria-label={
                    checked ? `Desmarcar dia ${d.day}` : `Marcar dia ${d.day} como lido`
                  }
                >
                  {checked ? (
                    <CheckCircle2 className="h-6 w-6 text-success" />
                  ) : (
                    <Circle className="h-6 w-6 text-muted-foreground hover:text-primary" />
                  )}
                </button>
                <button
                  onClick={() => setOpenDay(open ? null : d.day)}
                  className="flex-1 space-y-1.5 text-left"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        isNext ? "bg-primary/20 text-primary" : "bg-surface-2 text-muted-foreground"
                      }`}
                    >
                      Dia {d.day}
                    </span>
                    {isNext && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                        Próximo
                      </span>
                    )}
                    <ChevronDown
                      className={`ml-auto h-4 w-4 text-muted-foreground transition-transform ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  <p className="font-serif text-base font-medium text-ancient">
                    {d.refs.join(" · ")}
                  </p>
                  <p className="text-sm font-medium leading-relaxed text-foreground/80">{d.focus}</p>
                </button>
              </div>

              {open && (
                <DayDetails
                  day={d}
                  checked={checked}
                  onComplete={() => toggle(d.day)}
                  version={bibleVersion}
                />
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}

function DayDetails({
  day,
  checked,
  onComplete,
  version,
}: {
  day: PlanDay;
  checked: boolean;
  onComplete: () => void;
  version: BibleVersion;
}) {
  const { scaleIndex, increase, decrease, contentZoomStyle } = useReadingFontScale();

  return (
    <div className="space-y-5 border-t border-border/60 bg-surface/50 p-4 font-sans" data-tts-scope="plano-dia">
      <div className="rounded-[1.75rem] border border-primary/20 bg-gradient-to-br from-primary/12 via-surface to-surface p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-primary">Leitura do dia</p>
            <h2 className="mt-1 text-xl font-extrabold tracking-tight">Dia {day.day}</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{day.focus}</p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <NarrationButton containerSelector='[data-tts-scope="plano-dia"]' />
            <FontSizeControls
              scaleIndex={scaleIndex}
              onIncrease={increase}
              onDecrease={decrease}
            />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-[11px] text-muted-foreground">
          <BookOpen className="h-3.5 w-3.5 text-primary" />
          <span>{day.passage_api_refs.length} {day.passage_api_refs.length === 1 ? "passagem" : "passagens"} para ler com calma</span>
        </div>
      </div>

      <div style={contentZoomStyle} className="space-y-3">
        <Section title="Passagem" icon={<BookOpen className="h-3.5 w-3.5" />}>
          <div className="space-y-3">
            {day.passage_api_refs.map((ref, i) => (
            <PassageBlock
              key={ref}
              apiRef={ref}
              label={day.refs[i] ?? ref}
              version={version}
            />
            ))}
          </div>
        </Section>

        <Section title="Contexto">
          <p className="text-base leading-7 text-foreground/90" data-narrate>{day.context}</p>
        </Section>

        <Section title="Reflexão devocional">
          <div className="space-y-2">
            {day.reflection.split("\n").filter(Boolean).map((p, i) => (
              <p key={i} className="text-base leading-7 text-foreground/90" data-narrate>
                {p}
              </p>
            ))}
          </div>
        </Section>

        <Section title="Aplicação prática">
          <p className="text-base leading-7 text-foreground/90" data-narrate>{day.application}</p>
        </Section>

        <Section title="Oração">
          <p className="!font-sans text-lg font-normal leading-8 text-foreground/90 !not-italic" data-narrate>
            {day.prayer}
          </p>
        </Section>
      </div>

      {!checked && (
        <button
          onClick={onComplete}
          className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary-glow"
        >
          Marcar como concluído · +30 XP
        </button>
      )}
    </div>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <h3 className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-primary">
        {icon}
        {title}
      </h3>
      {children}
    </div>
  );
}

function PassageBlock({
  apiRef,
  label,
  version,
}: {
  apiRef: string;
  label: string;
  version: BibleVersion;
}) {
  const [text, setText] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    setText(null);
    fetchPassage(apiRef, version)
      .then((t) => {
        if (!cancelled) setText(t);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [apiRef, version]);

  return (
    <div className="rounded-[1.5rem] border border-border bg-surface-2/70 p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-primary">
          <span data-narrate>{label}</span>
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {bibleLabelFor(version)}
        </span>
      </div>
      {loading && (
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" /> Carregando passagem…
        </p>
      )}
      {error && (
        <p className="text-xs text-destructive">
          Não foi possível carregar a passagem. Abra sua Bíblia em {label}.
        </p>
      )}
      {text && (
        <p
          className="!font-sans text-lg font-normal leading-8 text-foreground/90 !not-italic"
          data-narrate
          data-narrate-text={stripVerseNumbers(text)}
        >
          {text}
        </p>
      )}
    </div>
  );
}
