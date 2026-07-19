import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { trails, getLevel, CHARACTERS } from "@/data/content";
import { streakToNextLevel } from "@/data/levels";
import { ViewModeToggle } from "@/components/ViewModeToggle";
import { useApp } from "@/lib/app-context";
import { Flame, Check, Lock, Play, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/home")({
  component: HomePage,
});

type Profile = {
  display_name: string;
  avatar_char: string;
  xp: number;
  streak: number;
};

function HomePage() {
  const { viewMode } = useApp();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  useEffect(() => {
    void (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { data: p } = await supabase.from("profiles").select("display_name, avatar_char, xp, streak").eq("id", u.user.id).maybeSingle();
      if (p) setProfile(p as Profile);
      const { data: lp } = await supabase.from("lesson_progress").select("lesson_id").eq("user_id", u.user.id);
      setCompleted(new Set((lp ?? []).map((r) => r.lesson_id)));
    })();
  }, []);

  const level = getLevel(profile?.streak ?? 0);
  const character = CHARACTERS.find((c) => c.id === profile?.avatar_char) ?? CHARACTERS[0];
  const toNext = streakToNextLevel(profile?.streak ?? 0);
  const currentLevelMin = (level.level - 1) * 3;
  const levelProgress = Math.min(100, Math.max(0, ((profile?.streak ?? 0) - currentLevelMin) / 3 * 100));

  if (viewMode === "lider") {
    return <LiderInline />;
  }

  return (
    <div className="mx-auto max-w-lg space-y-5 px-4 pt-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Paz de Cristo,</p>
          <h1 className="text-xl font-semibold">{profile?.display_name ?? "Discípulo"}</h1>
        </div>
        <ViewModeToggle />
      </header>

      <section className="card-elevated overflow-hidden">
        <div className="bg-gradient-to-br from-primary/20 via-primary-glow/10 to-transparent p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-surface-2 ring-2 ring-primary/30">
              {level.avatar ? (
                <img src={level.avatar} alt={level.title} className="h-full w-full object-cover" />
              ) : (
                <span className="text-3xl">{character.emoji}</span>
              )}
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Seu progresso</p>
              <p className="mt-0.5 text-lg font-bold text-primary">Nível {level.level}: {level.title}</p>
              <p className="text-xs text-muted-foreground">{profile?.xp ?? 0} XP acumulados</p>
            </div>
            <div className="flex flex-col items-center rounded-2xl bg-streak/20 px-3 py-2">
              <Flame className="h-5 w-5 text-streak" />
              <span className="text-sm font-bold text-streak">{profile?.streak ?? 0}</span>
              <span className="text-[9px] text-muted-foreground">dias</span>
            </div>
          </div>

          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between text-[11px] font-medium">
              <span className="text-muted-foreground">Progresso para o próximo nível</span>
              <span className="text-primary">{toNext === null ? "Nível máximo" : `Faltam ${toNext} dia${toNext === 1 ? "" : "s"}`}</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-surface-2">
              <div className="h-full rounded-full bg-gradient-to-r from-primary to-primary-glow transition-all" style={{ width: `${levelProgress}%` }} />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground">Trilhas de Discipulado</h2>
        {trails.map((t) => {
          const allLessons = t.modules.flatMap((m) => m.lessons);
          const doneCount = allLessons.filter((l) => completed.has(l.id)).length;
          const total = allLessons.length;
          const pct = total ? (doneCount / total) * 100 : 0;
          return (
            <div key={t.id} className="card-elevated overflow-hidden">
              <div className={`bg-gradient-to-r ${t.color} px-5 py-4`}>
                <h3 className="text-base font-bold text-white">{t.title}</h3>
                <p className="mt-0.5 text-xs text-white/80">{t.description}</p>
                {total > 0 && (
                  <>
                    <div className="mt-3 flex items-center justify-between text-[11px] text-white/90">
                      <span>Trilha de Estudos</span>
                      <span>{doneCount} de {total} lições</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/20">
                      <div className="h-full bg-white transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </>
                )}
              </div>

              {t.modules.length === 0 ? (
                <div className="px-5 py-4 text-xs text-muted-foreground">
                  Em breve — módulos e lições estão sendo preparados.
                </div>
              ) : (
                <div className="space-y-4 p-4">
                  {t.modules.map((mod) => (
                    <div key={mod.id}>
                      <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{mod.title}</p>
                      <div className="space-y-2">
                        {mod.lessons.map((lesson, i) => {
                          const isDone = completed.has(lesson.id);
                          const prevDone = i === 0 ? true : completed.has(mod.lessons[i - 1].id);
                          const isActive = !isDone && prevDone;
                          const isLocked = !isDone && !isActive;
                          return (
                            <LessonRow key={lesson.id} title={lesson.title} id={lesson.id}
                              state={isDone ? "done" : isActive ? "active" : "locked"} />
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}

function LessonRow({ title, id, state }: { title: string; id: string; state: "done" | "active" | "locked" }) {
  const base = "flex items-center gap-3 rounded-2xl border p-3 transition-all";
  if (state === "locked") {
    return (
      <div className={`${base} border-border bg-background/50 opacity-60`}>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
          <Lock className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">{title}</p>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Bloqueada</span>
        </div>
        <span className="text-xs text-muted-foreground">Aguarde</span>
      </div>
    );
  }
  if (state === "done") {
    return (
      <Link to="/licao/$id" params={{ id }} className={`${base} border-success/30 bg-success/5 hover:border-success/60`}>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-success text-success-foreground">
          <Check className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">{title}</p>
          <span className="text-[10px] uppercase tracking-wider text-success">Concluída</span>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </Link>
    );
  }
  return (
    <Link to="/licao/$id" params={{ id }} className={`${base} border-primary bg-primary/10 hover:bg-primary/15`}>
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Play className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold">{title}</p>
        <span className="text-[10px] uppercase tracking-wider text-primary">Para hoje</span>
      </div>
      <span className="rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground">Estudar</span>
    </Link>
  );
}

function LiderInline() {
  return (
    <div className="mx-auto max-w-lg space-y-5 px-4 pt-6">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Modo Líder</h1>
        <ViewModeToggle />
      </header>
      <div className="card-elevated p-5">
        <p className="text-sm text-muted-foreground">
          Acompanhe seus discípulos, crie grupos e envie mensagens.
        </p>
        <Link
          to="/lider"
          className="mt-4 inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          Abrir painel <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
