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
import { SUPPORT_MODULES, type SupportLesson } from "@/data/leader-support-content";
import { SupportLessonFlow } from "@/components/LeaderResources";
import { toast } from "sonner";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Crown,
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

type AssignedLesson = {
  id: string;
  lesson: SupportLesson;
  leaderName: string;
};

function findSupportLesson(contentId: string) {
  for (const module of SUPPORT_MODULES) {
    const lesson = module.lessons.find((item) => item.id === contentId);
    if (lesson) return lesson;
  }
  return null;
}

function ModulePage() {
  const { id } = Route.useParams();
  const isLeadershipModule = id === "como-ser-lider";
  const isDiscipleshipModule = id === "meu-discipulado";
  const nav = useNavigate();
  const [mod, setMod] = useState<ModuleRow | null>(null);
  const [assignedLessons, setAssignedLessons] = useState<AssignedLesson[]>([]);
  const [assignedProgressIds, setAssignedProgressIds] = useState<Set<string>>(new Set());
  const [trails, setTrails] = useState<TrailRow[]>([]);
  const [progressIds, setProgressIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      const { data: u } = await supabase.auth.getUser();

      if (isDiscipleshipModule) {
        if (!u.user) {
          setLoading(false);
          return;
        }

        const { data: assignments } = await supabase
          .from("discipleship_assignments")
          .select("id, content_id, leader_id")
          .eq("disciple_id", u.user.id)
          .eq("status", "active")
          .order("assigned_at", { ascending: false });

        const rows = assignments ?? [];
        const contentIds = [...new Set(rows.map((row) => row.content_id))];
        const leaderIds = [...new Set(rows.map((row) => row.leader_id))];
        const [{ data: progress }, { data: leaders }] = await Promise.all([
          contentIds.length
            ? supabase
                .from("lesson_progress")
                .select("lesson_id")
                .eq("user_id", u.user.id)
                .in("lesson_id", contentIds)
            : Promise.resolve({ data: [] }),
          leaderIds.length
            ? supabase.from("profiles").select("id, display_name").in("id", leaderIds)
            : Promise.resolve({ data: [] }),
        ]);

        const leaderNames = new Map(
          (leaders ?? []).map((leader) => [leader.id, leader.display_name]),
        );
        setAssignedLessons(
          rows
            .map((row) => {
              const lesson = findSupportLesson(row.content_id);
              return lesson
                ? {
                    id: row.id,
                    lesson,
                    leaderName: leaderNames.get(row.leader_id) ?? "seu líder",
                  }
                : null;
            })
            .filter((row): row is AssignedLesson => row !== null),
        );
        setAssignedProgressIds(
          new Set((progress ?? []).map((row) => row.lesson_id)),
        );
        setLoading(false);
        return;
      }

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
  }, [id, isDiscipleshipModule]);

  if (loading) {
    return (
      <div className="mx-auto max-w-lg px-4 pt-6 text-sm text-muted-foreground">
        Carregando módulo...
      </div>
    );
  }

  if (isDiscipleshipModule) {
    return (
      <DiscipleshipModuleView
        lessons={assignedLessons}
        progressIds={assignedProgressIds}
        onProgress={(lessonId) =>
          setAssignedProgressIds((current) => new Set(current).add(lessonId))
        }
      />
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

function DiscipleshipModuleView({
  lessons,
  progressIds,
  onProgress,
}: {
  lessons: AssignedLesson[];
  progressIds: Set<string>;
  onProgress: (lessonId: string) => void;
}) {
  const nav = useNavigate();
  const [selected, setSelected] = useState<AssignedLesson | null>(null);
  const completedCount = lessons.filter((item) => progressIds.has(item.lesson.id)).length;
  const progressPercent = lessons.length
    ? Math.round((completedCount / lessons.length) * 100)
    : 0;

  if (selected) {
    return (
      <div className="mx-auto max-w-lg px-4 pb-24 pt-5">
        <SupportLessonFlow
          lesson={selected.lesson}
          onBack={() => setSelected(null)}
          onComplete={async () => {
            const { data: user } = await supabase.auth.getUser();
            if (!user.user) return;
            const { error } = await supabase
              .from("lesson_progress")
              .upsert(
                { user_id: user.user.id, lesson_id: selected.lesson.id, xp_gained: 0 },
                { onConflict: "user_id,lesson_id" },
              );
            if (error) {
              toast.error("Não foi possível salvar seu progresso.");
              throw error;
            }
            onProgress(selected.lesson.id);
            toast.success("Conteúdo concluído e progresso atualizado.");
          }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-5 px-4 pb-24 pt-5">
      <button
        type="button"
        onClick={() => void nav({ to: "/home" })}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </button>

      <section className="relative isolate overflow-hidden rounded-[28px] border border-amber-300/25 bg-gradient-to-br from-[#74511b] via-[#362a1d] to-[#151923] p-5 text-white shadow-2xl shadow-amber-950/20">
        <div className="pointer-events-none absolute -right-14 -top-16 h-48 w-48 rounded-full bg-amber-300/20 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-amber-200/75">
            <Crown className="h-3.5 w-3.5" /> Discipulado aplicado
          </div>
          <h1 className="mt-2 text-2xl font-extrabold">Meu Discipulado</h1>
          <p className="mt-1 text-sm text-white/70">
            Um caminho preparado para sua caminhada.
          </p>
          <div className="mt-4 flex items-center justify-between gap-3 text-[11px]">
            <span className="text-white/65">{completedCount} de {lessons.length} concluídas</span>
            <span className="font-bold text-amber-200">{progressPercent}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/30 p-[2px] ring-1 ring-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-300 via-yellow-200 to-white shadow-[0_0_12px_rgba(251,191,36,.65)] transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </section>

      {lessons.length === 0 ? (
        <div className="card-elevated p-5 text-center text-sm text-muted-foreground">
          Seu líder ainda não aplicou nenhum conteúdo.
        </div>
      ) : (
        <section className="space-y-2.5">
          <div className="flex items-end justify-between px-1">
            <div>
              <h2 className="text-sm font-bold">Suas trilhas</h2>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                O conteúdo foi preparado pelo seu líder.
              </p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-300">
              {lessons.length} lições
            </span>
          </div>
          {lessons.map((item, index) => {
            const done = progressIds.has(item.lesson.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelected(item)}
                className={`flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition-all hover:-translate-y-0.5 ${
                  done
                    ? "border-success/30 bg-success/5"
                    : "border-amber-300/20 bg-amber-300/5 hover:border-amber-300/50"
                }`}
              >
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                  done
                    ? "bg-success/15 text-success"
                    : "bg-amber-300/15 text-amber-500 dark:text-amber-300"
                }`}>
                  {done ? <Check className="h-4 w-4" /> : <span className="text-xs font-black">{String(index + 1).padStart(2, "0")}</span>}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold">{item.lesson.title}</span>
                  <span className="mt-0.5 block text-[11px] text-muted-foreground">
                    {done ? "Concluída" : "Disponível para você"} · {item.leaderName}
                  </span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </button>
            );
          })}
        </section>
      )}
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
