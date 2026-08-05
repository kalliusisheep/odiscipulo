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
import { PushNotifications } from "@/components/PushNotifications";
import { VerseOfDayCard } from "@/components/home/VerseOfDayCard";
import { useApp } from "@/lib/app-context";
import { Flame, Check, ChevronRight, Sparkles, BookOpen } from "lucide-react";
import { ChallengePanel } from "@/components/ChallengeProgressBar";
import { LeaderResources } from "@/components/LeaderResources";


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
  const [userId, setUserId] = useState<string | null>(null);
  const [progressIds, setProgressIds] = useState<Set<string>>(new Set());
  const [modules, setModules] = useState<ModuleRow[]>([]);
  const [trails, setTrails] = useState<TrailRow[]>([]);

  useEffect(() => {
    void (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      setUserId(u.user.id);
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

      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Saudação</p>
            <h1 className="text-xl font-semibold">A Paz, {firstName}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <PushNotifications />
          <MessagesLinkButton />
          <ThemeToggle />
        </div>
      </header>

      <section
        className="relative isolate overflow-hidden rounded-[1.75rem] border border-violet-300/15 shadow-2xl shadow-black/35"
        style={{
          background:
            "linear-gradient(145deg, rgba(55, 48, 163, 0.64) 0%, rgba(30, 41, 59, 0.90) 48%, rgba(15, 23, 42, 0.98) 100%)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.18) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage: "linear-gradient(to bottom, black, transparent 72%)",
          }}
        />
        <div className="pointer-events-none absolute -right-14 -top-20 h-60 w-60 rounded-full bg-violet-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-8 h-52 w-52 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative z-10 p-5">
          <div className="flex items-start gap-3.5">
            <div className="relative shrink-0">
              <div className="absolute -inset-1 rounded-[1.4rem] bg-gradient-to-br from-violet-300/60 via-primary/35 to-transparent blur-[1px]" />
              <div className="relative h-[4.75rem] w-[4.75rem] overflow-hidden rounded-[1.2rem] bg-surface-2 ring-1 ring-white/25 shadow-xl shadow-black/30">
                {level.avatar ? (
                  <img src={level.avatar} alt={level.title} className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-4xl">{character.emoji}</span>
                )}
              </div>
            </div>

            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-violet-300" />
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-100/65">Sua jornada</p>
              </div>
              <p className={`mt-1.5 font-extrabold leading-tight text-white ${levelTitleSizeClass}`}>{levelTitleText}</p>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-bold text-white/80 ring-1 ring-white/10">
                  {xp} XP total
                </span>
                {nextLevel && (
                  <span className="rounded-full bg-violet-400/10 px-2 py-1 text-[10px] font-semibold text-violet-200 ring-1 ring-violet-300/15">
                    Meta: Nv {nextLevel.level}
                  </span>
                )}
              </div>
            </div>

            <div
              className="flex min-w-[3.45rem] shrink-0 flex-col items-center rounded-2xl px-2.5 py-2.5 shadow-lg shadow-orange-950/20"
              style={{
                background: "linear-gradient(180deg, rgba(251, 146, 60, 0.22), rgba(124, 45, 18, 0.16))",
                border: "1px solid rgba(251, 146, 60, 0.28)",
              }}
            >
              <Flame className="h-[1.1rem] w-[1.1rem] text-orange-300 drop-shadow-[0_0_8px_rgba(251,146,60,.6)]" />
              <span className="mt-0.5 text-base font-black leading-none text-orange-200">{profile?.streak ?? 0}</span>
              <span className="mt-1 text-[8px] font-bold uppercase tracking-wider text-orange-100/60">dias</span>
            </div>
          </div>

          <div
            className="mt-5 rounded-[1.25rem] p-3.5 shadow-inner"
            style={{
              background: "linear-gradient(180deg, rgba(2, 6, 23, 0.42), rgba(2, 6, 23, 0.24))",
              border: "1px solid rgba(255, 255, 255, 0.09)",
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/45">Rumo ao próximo nível</p>
                <p className="mt-1 truncate text-xs font-bold text-white/90">
                  {nextLevel ? `Nv ${nextLevel.level} · ${nextLevel.title}` : "Você alcançou o nível máximo"}
                </p>
              </div>
              <div className="shrink-0 rounded-xl bg-white/10 px-2.5 py-1.5 text-sm font-black text-white ring-1 ring-white/10">
                {Math.round(levelPct)}%
              </div>
            </div>

            <div className="relative mt-3 h-3 overflow-hidden rounded-full bg-slate-950/55 p-[2px] ring-1 ring-white/5">
              <div
                className="relative h-full rounded-full bg-gradient-to-r from-violet-500 via-primary-glow to-fuchsia-300 shadow-[0_0_14px_rgba(167,139,250,0.6)] transition-all duration-700"
                style={{ width: `${levelPct}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/35 to-transparent" />
              </div>
              {levelPct === 0 && <div className="absolute left-[3px] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-violet-300/55" />}
            </div>

            <div className="mt-2.5 flex items-center justify-between gap-3 text-[10px]">
              <span className="font-medium text-white/45">
                {xpLeft === null ? "Jornada concluída" : `${xp} de ${xp + xpLeft} XP`}
              </span>
              <span className="shrink-0 font-bold text-violet-200">
                {xpLeft === null ? "Nível máximo" : `Faltam ${xpLeft} XP`}
              </span>
            </div>
          </div>
        </div>

        {showLevel50Checklist && (
          <div className="relative z-10 border-t border-white/10 bg-ancient/10 px-5 py-4">
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-ancient">
              <Sparkles className="h-3.5 w-3.5" /> Rumo ao Nível {GATED_LEVEL} · Discípulo
            </p>
            <p className="mt-1 text-xs text-white/65">
              Você já tem XP suficiente. Para se tornar Discípulo, conclua todo o conteúdo.
            </p>
          </div>
        )}

        <Link
          to="/niveis"
          className="group relative z-10 flex items-center justify-between gap-3 border-t border-white/10 bg-white/[0.045] px-5 py-3.5 transition-colors hover:bg-white/[0.08]"
        >
          <div>
            <p className="text-xs font-bold text-white">Mapa da jornada</p>
            <p className="mt-0.5 text-[10px] text-white/50">Explore níveis, títulos e conquistas</p>
          </div>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/10 transition-transform group-hover:translate-x-0.5">
            <ChevronRight className="h-4 w-4 text-white/80" />
          </span>
        </Link>
      </section>

      {userId && <ChallengePanel myId={userId} />}

      <VerseOfDayCard />

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground">Módulos de Discipulado</h2>

        {modules.filter((m) => m.id !== "como-ser-lider").map((m) => {
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
    <div className="mx-auto max-w-lg space-y-5 px-4 pt-6 pb-24">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Modo Líder</h1>
        <ThemeToggle />
      </header>
      <div className="h-36 w-full overflow-hidden rounded-2xl sm:h-44">
        <img
          src="/lider-banner.jpg"
          alt=""
          className="h-full w-full object-cover object-[center_35%]"
        />
      </div>
      <div className="card-elevated p-5">
        <p className="text-sm text-muted-foreground">
          Acompanhe seus discípulos, crie grupos e envie mensagens.
        </p>
        <div className="mt-4 flex justify-center">
          <Link
            to="/lider"
            className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Abrir painel <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <LeaderResources />
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
