import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CHARACTERS } from "@/data/content";
import {
  getLevel,
  getNextLevel,
  xpToNextLevel,
  levelProgressPct,
  checkLevel50Status,
  GATED_LEVEL,
} from "@/data/levels";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useApp } from "@/lib/app-context";
import { Flame, Check, ChevronRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/home")({
  component: HomePage,
});

type Profile = {
  display_name: string;
  first_name: string | null;
  avatar_char: string;
  xp: number;
  streak: number;
};

type ModuleRow = {
  id: string;
  ord: number;
  title: string;
  description: string | null;
  color: string | null;
};

type TrailRow = {
  id: string;
  module_id: string;
  ord: number;
  title: string;
  lesson_id: string | null;
};

function HomePage() {
  const { viewMode } = useApp();
  const nav = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [progressIds, setProgressIds] = useState<Set<string>>(new Set());
  const [modules, setModules] = useState<ModuleRow[]>([]);
  const [trails, setTrails] = useState<TrailRow[]>([]);

  useEffect(() => {
    void (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const [{ data: p }, { data: lp }, { data: mods }, { data: trs }] = await Promise.all([
        supabase
          .from("profiles")
          .select("display_name, first_name, avatar_char, xp, streak, onboarded")
          .eq("id", u.user.id)
          .maybeSingle(),
        supabase.from("lesson_progress").select("lesson_id").eq("user_id", u.user.id),
        supabase.from("disciple_modules").select("id, ord, title, description, color").order("ord"),
        supabase.from("disciple_trails").select("id, module_id, ord, title, lesson_id").order("ord"),
      ]);
      if (p && !p.onboarded) {
        void nav({ to: "/bem-vindo" });
        return;
      }
      if (p) setProfile(p as Profile);
      setProgressIds(new Set((lp ?? []).map((r) => r.lesson_id)));
      setModules((mods ?? []) as ModuleRow[]);
      setTrails((trs ?? []) as TrailRow[]);
    })();
  }, [nav]);

  const xp = profile?.xp ?? 0;
  const level50 = useMemo(() => checkLevel50Status(xp, progressIds), [xp, progressIds]);
  const level = getLevel(xp, { level50Unlocked: level50.unlocked });
  const nextLevel = getNextLevel(xp, { level50Unlocked: level50.unlocked });
  const character = CHARACTERS.find((c) => c.id === profile?.avatar_char) ?? CHARACTERS[0];
  const xpLeft = xpToNextLevel(xp, { level50Unlocked: level50.unlocked });
  const levelPct = levelProgressPct(xp, { level50Unlocked: level50.unlocked });
  const showLevel50Checklist = level50.xpOk && !level50.unlocked;

  if (viewMode === "lider") {
    return <LiderInline />;
  }

  const firstName =
    profile?.first_name?.trim() ||
    profile?.display_name?.trim().split(/\s+/)[0] ||
    "irmão";

  const trailsByModule = new Map<string, TrailRow[]>();
  for (const t of trails) {
    const arr = trailsByModule.get(t.module_id) ?? [];
    arr.push(t);
    trailsByModule.set(t.module_id, arr);
  }

  return (
    <div className="mx-auto max-w-lg space-y-5 px-4 pt-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Saudação</p>
          <h1 className="text-xl font-semibold">A Paz, {firstName}</h1>
        </div>
        <ThemeToggle />
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
            <div className="mb-1.5 flex items-center justify-between gap-2 text-[11px] font-medium">
              <span className="text-muted-foreground">
                {nextLevel ? <>Próximo: <span className="text-foreground font-semibold">Nível {nextLevel.level} · {nextLevel.title}</span></> : "Você atingiu o nível máximo"}
              </span>
              <span className="whitespace-nowrap text-primary">{xpLeft === null ? "🔥 Máximo" : `Faltam ${xpLeft} XP`}</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-surface-2">
              <div className="h-full rounded-full bg-gradient-to-r from-primary to-primary-glow transition-all" style={{ width: `${levelPct}%` }} />
            </div>
          </div>
        </div>
        {showLevel50Checklist && (
          <div className="border-t border-border/60 bg-ancient/10 p-4">
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-ancient">
              <Sparkles className="h-3.5 w-3.5" /> Rumo ao Nível {GATED_LEVEL} · Discípulo
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Você já tem XP suficiente. Para se tornar Discípulo, conclua todo o conteúdo.
            </p>
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground">Módulos de Discipulado</h2>
        {modules.map((m) => {
          const mtrails = trailsByModule.get(m.id) ?? [];
          const withLesson = mtrails.filter((t) => t.lesson_id);
          const doneCount = withLesson.filter((t) => t.lesson_id && progressIds.has(t.lesson_id)).length;
          const total = mtrails.length;
          const pct = total ? (doneCount / total) * 100 : 0;
          return (
            <Link
              key={m.id}
              to="/modulo/$id"
              params={{ id: m.id }}
              className="card-elevated block overflow-hidden transition-transform active:scale-[0.99]"
            >
              <div className={`bg-gradient-to-r ${m.color ?? "from-slate-500 to-slate-700"} px-5 py-4`}>
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/70">
                      Módulo {m.ord}
                    </p>
                    <h3 className="mt-0.5 text-base font-bold text-white">{m.title}</h3>
                    {m.description && (
                      <p className="mt-0.5 text-xs text-white/80">{m.description}</p>
                    )}
                    <div className="mt-3 flex items-center justify-between text-[11px] text-white/90">
                      <span>Progresso</span>
                      <span>{doneCount} de {total} trilhas</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/20">
                      <div className="h-full bg-white transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-white/90" />
                </div>
              </div>
            </Link>
          );
        })}
        {modules.length === 0 && (
          <div className="card-elevated p-4 text-center text-xs text-muted-foreground">
            Carregando módulos...
          </div>
        )}
      </section>
    </div>
  );
}

function LiderInline() {
  return (
    <div className="mx-auto max-w-lg space-y-5 px-4 pt-6">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Modo Líder</h1>
        <ThemeToggle />
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

// Confetti/celebração removida deste arquivo — permanece disponível globalmente pelos hooks de lição.
export function ChecklistDone({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-success">
      <Check className="h-3.5 w-3.5" /> {label}
    </span>
  );
}
