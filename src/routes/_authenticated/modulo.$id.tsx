import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  MODULE_ORDER_TO_ICON,
  MODULE_ORDER_TO_GRADIENT,
  MODULE_ORDER_TO_RGB,
  DEFAULT_MODULE_GRADIENT,
  DEFAULT_MODULE_RGB,
} from "@/data/module-visuals";
import { comoSerLider } from "@/data/como-ser-lider";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Play,
  Sparkles,
  Sprout,
} from "lucide-react";

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
  const isLeadershipModule = id === "como-ser-lider";
  const nav = useNavigate();
  const [mod, setMod] = useState<ModuleRow | null>(null);
  const [trails, setTrails] = useState<TrailRow[]>([]);
  const [progressIds, setProgressIds] = useState<Set<string>>(new Set());
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
              .select("lesson_id")
              .eq("user_id", u.user.id)
          : Promise.resolve({ data: [] as { lesson_id: string }[] }),
      ]);
      const leadershipTrails: TrailRow[] = comoSerLider.modules[0].lessons.map((lesson, index) => ({
        id: lesson.id,
        ord: index + 1,
        title: lesson.title,
        lesson_id: lesson.id,
      }));
      const leadershipFallback: ModuleRow = {
        id: "como-ser-lider",
        ord: 12,
        title: "Como ser um líder",
        description: "Uma formação inédita para liderar à maneira de Cristo.",
        color: null,
      };

      setMod((m ?? (isLeadershipModule ? leadershipFallback : null)) as ModuleRow | null);
      setTrails(((ts?.length ? ts : isLeadershipModule ? leadershipTrails : []) ?? []) as TrailRow[]);
      const rows = (lpRes.data ?? []) as { lesson_id: string }[];
      setProgressIds(new Set(rows.map((r) => r.lesson_id)));
      setLoading(false);
    })();
  }, [id]);

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

  const Icon = MODULE_ORDER_TO_ICON[mod.ord] ?? Sprout;
  const gradient = MODULE_ORDER_TO_GRADIENT[mod.ord] ?? DEFAULT_MODULE_GRADIENT;
  const rgb = MODULE_ORDER_TO_RGB[mod.ord] ?? DEFAULT_MODULE_RGB;
  const accentStyle = {
    "--accent": `rgb(${rgb})`,
    "--accent-badge": `color-mix(in srgb, rgb(${rgb}) 15%, transparent)`,
    "--accent-border": `color-mix(in srgb, rgb(${rgb}) 30%, transparent)`,
    "--accent-soft": `color-mix(in srgb, rgb(${rgb}) 20%, transparent)`,
  } as React.CSSProperties;

  const rendered = trails.map((t) => {
    const hasLesson = !!t.lesson_id;
    const isDone = hasLesson && t.lesson_id && progressIds.has(t.lesson_id);
    let state: "done" | "active" | "coming-soon";
    if (!hasLesson) {
      state = "coming-soon";
    } else if (isDone) {
      state = "done";
    } else {
      state = "active";
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
        <ArrowLeft className="h-4 w-4" /> Voltar
      </button>

      <section
        style={accentStyle}
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} p-5 border border-white/10`}
      >
        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-[var(--accent-soft)] blur-3xl" />

        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 backdrop-blur-sm">
            <Icon className="h-5 w-5 text-white/90" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">
              Módulo {mod.ord}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-[var(--accent-border)] bg-[var(--accent-badge)] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
              Nível {mod.ord}
            </span>
          </div>
        </div>

        <h1 className="relative mt-3 text-2xl font-bold text-white">{mod.title}</h1>
        {mod.description && (
          <p className="relative mt-1 text-sm text-white/85">{mod.description}</p>
        )}
      </section>

      <section className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          {total} Trilhas
        </h2>
        {rendered.map(({ trail, state }, i) => (
          <TrailRow
            key={trail.id}
            index={i + 1}
            title={trail.title}
            lessonId={trail.lesson_id}
            state={state}
            moduleId={mod.id}
          />
        ))}
      </section>
    </div>
  );
}

function TrailNumber({ index, tone }: { index: number; tone: "muted" | "primary" }) {
  return (
    <span
      className={`w-6 shrink-0 text-sm font-bold ${
        tone === "primary" ? "text-primary" : "text-muted-foreground/60"
      }`}
    >
      {String(index).padStart(2, "0")}
    </span>
  );
}

function TrailRow({
  index,
  title,
  lessonId,
  state,
  moduleId,
}: {
  index: number;
  title: string;
  lessonId: string | null;
  state: "done" | "active" | "coming-soon";
  moduleId: string;
}) {
  const base = "flex items-center gap-3 rounded-2xl border p-3.5 transition-all";

  if (state === "coming-soon") {
    return (
      <div className={`${base} border-border/60 bg-background/50 opacity-70`}>
        <TrailNumber index={index} tone="muted" />
        <div className="flex-1">
          <p className="text-sm font-semibold">{title}</p>
          <span className="text-[11px] text-muted-foreground">Conteúdo em breve</span>
        </div>
        <Sparkles className="h-4 w-4 text-muted-foreground" />
      </div>
    );
  }


  if (state === "done" && lessonId) {
    return (
      <Link
        to="/licao/$id"
        params={{ id: lessonId }}
        search={{ modulo: moduleId }}
        resetScroll
        className={`${base} border-success/30 bg-success/5 hover:border-success/60`}
      >
        <TrailNumber index={index} tone="muted" />
        <div className="flex-1">
          <p className="text-sm font-semibold">{title}</p>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-success">
            <Check className="h-3 w-3" /> Concluída
          </span>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </Link>
    );
  }

  if (lessonId) {
    return (
      <Link
        to="/licao/$id"
        params={{ id: lessonId }}
        search={{ modulo: moduleId }}
        resetScroll
        className={`${base} border-primary bg-primary/10 hover:bg-primary/15`}
      >
        <TrailNumber index={index} tone="primary" />
        <div className="flex-1">
          <p className="text-sm font-semibold">{title}</p>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary">
            <Play className="h-3 w-3" /> Disponível hoje
          </span>
        </div>
        <ChevronRight className="h-4 w-4 text-primary" />
      </Link>
    );
  }

  return null;
}
