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
import {
  MODULE_ORDER_TO_ICON,
  MODULE_ORDER_TO_GRADIENT,
  MODULE_ORDER_TO_RGB,
  DEFAULT_MODULE_GRADIENT,
  DEFAULT_MODULE_RGB,
} from "@/data/module-visuals";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MessagesLinkButton } from "@/components/MessagesLinkButton";
import { useApp } from "@/lib/app-context";
import { Flame, Check, ChevronRight, Sparkles, BookOpen } from "lucide-react";

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

  // Títulos de nível variam muito de tamanho ("Crente Ruim" vs "Piloto de Carruagem
  // de Fogo") — em vez de cortar o texto (nowrap + overflow-hidden do card),
  // deixamos quebrar em até 2 linhas, com fonte um pouco menor para os títulos
  // mais compridos, pra garantir que nada fique cortado em telas estreitas.
  const levelTitleText = `Nível ${level.level}: ${level.title}`;
  const levelTitleSizeClass = levelTitleText.length > 32 ? "text-sm" : "text-base";

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
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>

      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Saudação</p>
          <h1 className="text-xl font-semibold">A Paz, {firstName}</h1>
        </div>
        <div className="flex items-center gap-2">
          <MessagesLinkButton />
          <ThemeToggle />
        </div>
      </header>

      <section className="card-elevated overflow-hidden">
        <div className="bg-gradient-to-br from-primary/20 via-primary-glow/10 to-transparent p-5">
          <div className="flex items-stretch gap-4">
            <div className="relative h-full w-20 shrink-0 overflow-hidden rounded-2xl bg-surface-2 ring-2 ring-primary/30">
              {level.avatar ? (
                <img src={level.avatar} alt={level.title} className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center text-4xl">{character.emoji}</span>
              )}
            </div>

            <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Seu progresso</p>
                <p className={`mt-0.5 font-bold leading-snug text-primary ${levelTitleSizeClass}`}>{levelTitleText}</p>
                <p className="text-xs text-muted-foreground">{profile?.xp ?? 0} XP acumulados</p>
                <p className="mt-1 truncate text-[10px] font-medium text-muted-foreground">
                  {nextLevel ? <>Próx: <span className="text-foreground font-semibold">Nv {nextLevel.level} · {nextLevel.title}</span></> : "Nível máximo"}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <div className="flex items-center gap-1 rounded-full bg-streak/20 px-2.5 py-1">
                  <Flame className="h-3.5 w-3.5 text-streak" />
                  <span className="text-xs font-bold text-streak">{profile?.streak ?? 0}</span>
                  <span className="text-[9px] text-muted-foreground">dias</span>
                </div>
                <span className="whitespace-nowrap text-[10px] font-medium text-primary">{xpLeft === null ? "🔥 Máx" : `Faltam ${xpLeft} XP`}</span>
              </div>
            </div>
          </div>

          <div className="mt-3">
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
        <div className="flex justify-end border-t border-border/60 p-3">
          <Link
            to="/niveis"
            className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
          >
            Conheça os níveis
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground">Módulos de Discipulado</h2>
        {modules.map((m) => {
          const mtrails = trailsByModule.get(m.id) ?? [];
          const withLesson = mtrails.filter((t) => t.lesson_id);
          const doneCount = withLesson.filter((t) => t.lesson_id && progressIds.has(t.lesson_id)).length;
          const total = mtrails.length;
          const pct = total ? (doneCount / total) * 100 : 0;

          const Icon = MODULE_ORDER_TO_ICON[m.ord] ?? BookOpen;
          const gradient = MODULE_ORDER_TO_GRADIENT[m.ord] ?? DEFAULT_MODULE_GRADIENT;
          const rgb = MODULE_ORDER_TO_RGB[m.ord] ?? DEFAULT_MODULE_RGB;
          const isLocked = pct === 0;
          const isComplete = pct === 100;
          const accentStyle = {
            "--accent": `rgb(${rgb})`,
            "--accent-light": `color-mix(in srgb, rgb(${rgb}) 72%, white)`,
            "--accent-dim": `color-mix(in srgb, rgb(${rgb}) 14%, transparent)`,
            "--accent-soft": `color-mix(in srgb, rgb(${rgb}) 20%, transparent)`,
            "--accent-border": `color-mix(in srgb, rgb(${rgb}) 30%, transparent)`,
            "--accent-badge": `color-mix(in srgb, rgb(${rgb}) 15%, transparent)`,
          } as React.CSSProperties;

          return (
            <Link
              key={m.id}
              to="/modulo/$id"
              params={{ id: m.id }}
              style={accentStyle}
              className={`group relative block overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} p-4 border border-white/10 transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_30px_var(--accent-dim)] hover:border-[var(--accent-border)]`}
            >
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-[var(--accent-soft)] blur-3xl rounded-full group-hover:bg-[var(--accent-dim)] transition-colors duration-500" />

              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-1000 ease-in-out pointer-events-none" />

              <div className="relative flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 bg-white/10 backdrop-blur-sm border border-white/10 group-hover:bg-[var(--accent-soft)] group-hover:border-[var(--accent-border)] transition-colors duration-300">
                  <Icon className="h-5 w-5 text-white/90 group-hover:text-[var(--accent)] transition-colors duration-300" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">
                      Módulo {m.ord}
                    </span>
                    {!isLocked && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[var(--accent-badge)] border border-[var(--accent-border)] text-[9px] font-bold uppercase tracking-wider text-[var(--accent)]">
                        <span className="w-1 h-1 rounded-full bg-[var(--accent)] animate-pulse" />
                        Nível {m.ord}
                      </span>
                    )}
                  </div>

                  <p className="font-semibold truncate text-white/95 mt-0.5">{m.title}</p>
                  {m.description && (
                    <p className="text-xs text-white/60 truncate">{m.description}</p>
                  )}

                  <div className="mt-2.5 flex items-center gap-3">
                    <div className="h-2 flex-1 rounded-full bg-white/10 overflow-hidden p-[2px]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-light)] shadow-[0_0_10px_var(--accent-soft)] transition-all duration-500 relative overflow-hidden"
                        style={{ width: `${pct}%` }}
                      >
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                          style={{ animation: "shimmer 2s infinite" }}
                        />
                      </div>
                    </div>
                    <span className="text-[10px] text-white/70 whitespace-nowrap font-bold">
                      {doneCount}/{total}
                    </span>
                  </div>
                </div>

                <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0 bg-white/5 border border-white/10 group-hover:bg-[var(--accent-soft)] group-hover:border-[var(--accent-border)] group-hover:translate-x-0.5 transition-all duration-300">
                  <ChevronRight className="h-4 w-4 text-white/60 group-hover:text-[var(--accent)] transition-colors duration-300" />
                </div>
              </div>

              {isComplete && (
                <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
              )}
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
