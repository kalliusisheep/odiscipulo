import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Check, ChevronRight, Lock, Play, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/modulo/$id")({
  component: ModulePage,
});

type ModuleRow = {
  id: string;
  ord: number;
  title: string;
  description: string | null;
  color: string | null;
};

type TrailRow = {
  id: string;
  ord: number;
  title: string;
  lesson_id: string | null;
};

function ModulePage() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const [mod, setMod] = useState<ModuleRow | null>(null);
  const [trails, setTrails] = useState<TrailRow[]>([]);
  const [progressIds, setProgressIds] = useState<Set<string>>(new Set());
  const [latestCompletedAt, setLatestCompletedAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      const { data: u } = await supabase.auth.getUser();
      const [{ data: m }, { data: ts }, lpRes] = await Promise.all([
        supabase
          .from("disciple_modules")
          .select("id, ord, title, description, color")
          .eq("id", id)
          .maybeSingle(),
        supabase
          .from("disciple_trails")
          .select("id, ord, title, lesson_id")
          .eq("module_id", id)
          .order("ord"),
        u.user
          ? supabase
              .from("lesson_progress")
              .select("lesson_id, completed_at")
              .eq("user_id", u.user.id)
          : Promise.resolve({ data: [] as { lesson_id: string; completed_at: string | null }[] }),
      ]);
      setMod((m ?? null) as ModuleRow | null);
      setTrails((ts ?? []) as TrailRow[]);
      const rows = (lpRes.data ?? []) as { lesson_id: string; completed_at: string | null }[];
      setProgressIds(new Set(rows.map((r) => r.lesson_id)));
      const latest = rows
        .map((r) => (r.completed_at ? new Date(r.completed_at) : null))
        .filter((d): d is Date => d !== null)
        .sort((a, b) => b.getTime() - a.getTime())[0] ?? null;
      setLatestCompletedAt(latest);
      setLoading(false);
    })();
  }, [id]);

  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const completedToday = latestCompletedAt !== null && latestCompletedAt >= todayMidnight;
  const nextUnlockAt = completedToday
    ? new Date(todayMidnight.getTime() + 24 * 60 * 60 * 1000)
    : null;

  if (loading) {
    return (
      <div className="mx-auto max-w-lg px-4 pt-6 text-sm text-muted-foreground">
        Carregando módulo...
      </div>
    );
  }

  if (!mod) {
    return (
      <div className="mx-auto max-w-lg space-y-4 px-4 pt-6">
        <button
          type="button"
          onClick={() => void nav({ to: "/home" })}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar
        </button>
        <div className="card-elevated p-5 text-sm">Módulo não encontrado.</div>
      </div>
    );
  }

  const withLesson = trails.filter((t) => t.lesson_id);
  const doneCount = withLesson.filter((t) => t.lesson_id && progressIds.has(t.lesson_id)).length;
  const total = trails.length;
  const pct = total ? (doneCount / total) * 100 : 0;

  // Determinar estado por trilha: apenas trilhas com lesson_id participam do progresso.
  // Sequência: uma trilha só fica "ativa" se a anterior (que tenha lesson_id) foi concluída.
  const gradient = mod.color ?? "from-slate-500 to-slate-700";

  let previousDoneOrEmpty = true; // primeira sempre disponível
  const rendered = trails.map((t) => {
    const hasLesson = !!t.lesson_id;
    const isDone = hasLesson && t.lesson_id && progressIds.has(t.lesson_id);
    let state: "done" | "active" | "locked" | "daily-locked" | "coming-soon";
    if (!hasLesson) {
      state = "coming-soon";
    } else if (isDone) {
      state = "done";
    } else if (previousDoneOrEmpty) {
      state = completedToday ? "daily-locked" : "active";
    } else {
      state = "locked";
    }
    // Para efeito de progresso sequencial, só bloqueamos a partir da primeira lição com conteúdo pendente.
    if (hasLesson && !isDone) {
      previousDoneOrEmpty = false;
    }
    return { trail: t, state };
  });

  return (
    <div className="mx-auto max-w-lg space-y-5 px-4 pt-6">
      <button
        type="button"
        onClick={() => void nav({ to: "/home" })}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar para Inicial
      </button>

      <section className={`card-elevated overflow-hidden`}>
        <div className={`bg-gradient-to-br ${gradient} px-5 py-5`}>
          <p className="text-[10px] font-bold uppercase tracking-wider text-white/80">
            Módulo {mod.ord}
          </p>
          <h1 className="mt-0.5 text-2xl font-bold text-white">{mod.title}</h1>
          {mod.description && (
            <p className="mt-1 text-sm text-white/85">{mod.description}</p>
          )}
          <div className="mt-4 flex items-center justify-between text-[11px] text-white/90">
            <span>Progresso do módulo</span>
            <span>{doneCount} de {total} trilhas</span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/20">
            <div className="h-full bg-white transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-muted-foreground">Trilhas</h2>
        {rendered.map(({ trail, state }, i) => (
          <TrailRow
            key={trail.id}
            index={i + 1}
            title={trail.title}
            lessonId={trail.lesson_id}
            state={state}
            nextUnlockAt={nextUnlockAt}
          />
        ))}
      </section>
    </div>
  );
}

function TrailRow({
  index,
  title,
  lessonId,
  state,
  nextUnlockAt,
}: {
  index: number;
  title: string;
  lessonId: string | null;
  state: "done" | "active" | "locked" | "daily-locked" | "coming-soon";
  nextUnlockAt: Date | null;
}) {
  const base = "flex items-center gap-3 rounded-2xl border p-3 transition-all";

  if (state === "coming-soon") {
    return (
      <div className={`${base} border-border/60 bg-background/50 opacity-70`}>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
          <Sparkles className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">
            <span className="mr-1.5 text-muted-foreground">{index}.</span>
            {title}
          </p>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Em breve</span>
        </div>
      </div>
    );
  }

  if (state === "daily-locked") {
    const label = nextUnlockAt
      ? `Disponível ${nextUnlockAt.toLocaleDateString("pt-BR", { weekday: "long" })}`
      : "Disponível amanhã";
    return (
      <div className={`${base} border-primary/30 bg-primary/5 opacity-80`}>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20">
          <Lock className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">
            <span className="mr-1.5 text-muted-foreground">{index}.</span>
            {title}
          </p>
          <span className="text-[10px] uppercase tracking-wider text-primary">Disponível amanhã</span>
        </div>
        <span className="text-[11px] capitalize text-primary">{label}</span>
      </div>
    );
  }

  if (state === "locked") {
    return (
      <div className={`${base} border-border bg-background/50 opacity-60`}>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
          <Lock className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">
            <span className="mr-1.5 text-muted-foreground">{index}.</span>
            {title}
          </p>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Bloqueada</span>
        </div>
        <span className="text-xs text-muted-foreground">Aguarde</span>
      </div>
    );
  }

  if (state === "done" && lessonId) {
    return (
      <Link
        to="/licao/$id"
        params={{ id: lessonId }}
        className={`${base} border-success/30 bg-success/5 hover:border-success/60`}
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-success text-success-foreground">
          <Check className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">
            <span className="mr-1.5 text-muted-foreground">{index}.</span>
            {title}
          </p>
          <span className="text-[10px] uppercase tracking-wider text-success">Concluída</span>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </Link>
    );
  }

  // active
  if (lessonId) {
    return (
      <Link
        to="/licao/$id"
        params={{ id: lessonId }}
        className={`${base} border-primary bg-primary/10 hover:bg-primary/15`}
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Play className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold">
            <span className="mr-1.5 text-primary/80">{index}.</span>
            {title}
          </p>
          <span className="text-[10px] uppercase tracking-wider text-primary">Para hoje</span>
        </div>
        <span className="rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground">
          Estudar
        </span>
      </Link>
    );
  }

  return null;
}
