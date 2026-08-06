import { createFileRoute, Link, notFound, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getLevel, MAX_LEVEL, xpForLevel } from "@/data/levels";
import { CHARACTERS } from "@/data/content";
import { toast } from "sonner";
import { ArrowLeft, MessageCircle, Flame, Trophy, BookOpen, Clock, UserPlus, Check, Copy, Sparkles, Church } from "lucide-react";
import { ChallengeButton } from "@/components/ChallengeButton";
import { formatPresence } from "@/lib/presence";

export const Route = createFileRoute("/_authenticated/perfil_/$username")({
  component: PublicProfilePage,
  errorComponent: ({ error }) => (
    <div className="p-6 text-sm text-destructive">Erro: {(error as Error).message}</div>
  ),
  notFoundComponent: () => (
    <div className="p-6 text-sm text-muted-foreground">Perfil não encontrado.</div>
  ),
});

type Profile = {
  id: string;
  display_name: string;
  username: string;
  avatar_char: string;
  avatar_url: string | null;
  bio: string | null;
  xp: number;
  streak: number;
  church_name: string | null;
  last_seen_at: string | null;
};

function PublicProfilePage() {
  const { username } = useParams({ from: "/_authenticated/perfil_/$username" });
  const [profile, setProfile] = useState<Profile | null>(null);
  const [lessons, setLessons] = useState(0);
  const [loading, setLoading] = useState(true);
  const [myId, setMyId] = useState<string | null>(null);
  const [isFriend, setIsFriend] = useState(false);
  const [adding, setAdding] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      const { data: u } = await supabase.auth.getUser();
      setMyId(u.user?.id ?? null);
      const withPresence = await supabase
        .from("profiles")
        .select("id, display_name, username, avatar_char, avatar_url, bio, xp, streak, church_name, last_seen_at, updated_at")
        .ilike("username", username)
        .maybeSingle();
      const p = withPresence.error
        ? (await supabase
            .from("profiles")
            .select("id, display_name, username, avatar_char, avatar_url, bio, xp, streak, church_name, updated_at")
            .ilike("username", username)
            .maybeSingle()).data
        : withPresence.data;
      if (!p) {
        setLoading(false);
        throw notFound();
      }
      const row = p as { last_seen_at?: string | null; updated_at?: string | null };
      setProfile({ ...p, last_seen_at: row.last_seen_at ?? row.updated_at ?? null } as Profile);
      const { count } = await supabase
        .from("lesson_progress")
        .select("*", { count: "exact", head: true })
        .eq("user_id", p.id);
      setLessons(count ?? 0);
      if (u.user && u.user.id !== p.id) {
        const { data: fr } = await supabase
          .from("friendships")
          .select("user_id")
          .eq("user_id", u.user.id)
          .eq("friend_id", p.id)
          .maybeSingle();
        setIsFriend(!!fr);
      }
      setLoading(false);
    })();
  }, [username]);

  const copyUsername = async () => {
    if (!profile) return;
    await navigator.clipboard.writeText(`@${profile.username}`);
    setCopied(true);
    toast.success("ID copiado!");
    setTimeout(() => setCopied(false), 1800);
  };

  const addFriend = async () => {
    if (!profile || !myId || profile.id === myId) return;
    setAdding(true);
    const { error } = await supabase.rpc("add_friend", { _target: profile.id });
    setAdding(false);
    if (error) {
      toast.error("Erro ao adicionar.");
      return;
    }
    setIsFriend(true);
    toast.success("Irmão adicionado!");
  };

  if (loading) {
    return <div className="p-6 text-sm text-muted-foreground">Carregando…</div>;
  }
  if (!profile) return null;

  const level = getLevel(profile.xp);
  const ch = CHARACTERS.find((c) => c.id === profile.avatar_char) ?? CHARACTERS[0];
  const isSelf = myId === profile.id;
  const presence = formatPresence(profile.last_seen_at);
  const isOnline = presence === "Online agora";

  const currentLevelXp = xpForLevel(level.level);
  const nextLevelXp = xpForLevel(level.level + 1);
  const xpInLevel = Math.max(0, profile.xp - currentLevelXp);
  const xpNeeded = Math.max(1, nextLevelXp - currentLevelXp);
  const xpPct = Math.min(100, Math.round((xpInLevel / xpNeeded) * 100));

  return (
    <div className="mx-auto min-h-[100dvh] max-w-lg bg-gradient-to-b from-background via-background to-surface/30 px-4 pb-28 pt-4">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-primary via-primary/85 to-indigo-600 px-5 pb-9 pt-5 text-primary-foreground shadow-xl shadow-primary/20">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

        <div className="relative flex items-center justify-between">
          <Link
            to="/ranking"
            aria-label="Voltar"
            className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium backdrop-blur transition hover:bg-white/25"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Voltar
          </Link>
          <button
            onClick={() => void copyUsername()}
            className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium backdrop-blur transition hover:bg-white/25"
            aria-label="Copiar ID"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            @{profile.username}
          </button>
        </div>

        <div className="relative mt-6 flex flex-col items-center text-center">
          <div className="relative">
            {/* Anel */}
            <div className="absolute -inset-1.5 rounded-full bg-gradient-to-br from-yellow-300 via-white to-yellow-300 blur-md opacity-70" />
            <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-white ring-4 ring-white/60 text-6xl shadow-2xl">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="Foto" className="h-full w-full object-cover" />
              ) : level.avatar ? (
                <img src={level.avatar} alt={level.title} className="h-full w-full object-cover" />
              ) : (
                <span>{ch.emoji}</span>
              )}
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-1 text-[11px] font-bold text-primary shadow">
              Nível {level.level}
            </div>
          </div>

          <h1 className="mt-6 text-2xl font-extrabold leading-tight tracking-tight drop-shadow-sm">{profile.display_name}</h1>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold">
            <span className={`h-2 w-2 rounded-full ${isOnline ? "bg-emerald-300 shadow-[0_0_8px_rgba(110,231,183,0.85)]" : "bg-rose-300 shadow-[0_0_7px_rgba(251,113,133,0.55)]"}`} />
            <span className={isOnline ? "text-emerald-100" : "text-white/70"}>
              {isOnline ? "Online agora" : `Offline · ${presence.replace("Visto ", "")}`}
            </span>
          </div>
          <div className="mt-1.5 flex flex-wrap items-center justify-center gap-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">
              <Sparkles className="h-3 w-3" /> {level.title}
            </span>
            {profile.church_name && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">
                <Church className="h-3 w-3" /> {profile.church_name}
              </span>
            )}
          </div>

          {/* Barra de XP */}
          <div className="mt-4 w-full max-w-[16rem]">
            <div className="mb-1 flex items-center justify-between text-[10px] font-semibold text-white/85">
              <span>{profile.xp} XP</span>
              <span>Nível {Math.min(MAX_LEVEL, level.level + 1)}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)] transition-all"
                style={{ width: `${xpPct}%` }}
              />
            </div>
          </div>

          {profile.bio && (
            <p className="mt-5 max-w-[20rem] rounded-2xl bg-white/15 px-4 py-3 text-sm italic leading-relaxed text-white/95 backdrop-blur">
              "{profile.bio}"
            </p>
          )}
        </div>
      </section>

      <div className="space-y-5 pt-6">
        {/* Ações */}
        {!isSelf && (
          <>
            <div className="rounded-[1.75rem] border border-border bg-surface/70 p-2.5 shadow-sm">
              <p className="mb-2 px-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-primary">Conexão</p>
              <div className="grid grid-cols-2 gap-2">
              <Link
                to="/mensagens/$username"
                params={{ username: profile.username }}
                className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground shadow-md transition-transform active:scale-95"
              >
                <MessageCircle className="h-4 w-4" /> Mensagem
              </Link>
              {isFriend ? (
                <div className="flex items-center justify-center gap-2 rounded-2xl border border-success/40 bg-success/10 px-4 py-3.5 text-sm font-semibold text-success">
                  <Check className="h-4 w-4" /> Irmãos
                </div>
              ) : (
                <button
                  onClick={() => void addFriend()}
                  disabled={adding}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-surface-2 px-4 py-3.5 text-sm font-semibold transition-transform active:scale-95 disabled:opacity-60"
                >
                  <UserPlus className="h-4 w-4" /> {adding ? "Adicionando…" : "Adicionar"}
                </button>
              )}
              </div>
            </div>
            <ChallengeButton targetId={profile.id} targetName={profile.display_name} />
          </>
        )}

        {/* Estatísticas */}
        <section>
          <div className="mb-3 flex items-end justify-between px-1.5">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-primary">Visão geral</p>
              <p className="mt-1 text-sm font-extrabold">Estatísticas da caminhada</p>
            </div>
            <Trophy className="h-4 w-4 text-primary/70" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              icon={Trophy}
              label="Nível atual"
              value={`${level.level}/${MAX_LEVEL}`}
              tone="from-amber-500/25 to-orange-500/10"
              iconTone="text-amber-500"
            />
            <StatCard
              icon={Flame}
              label="Ofensiva"
              value={`${profile.streak}d`}
              tone="from-orange-500/25 to-red-500/10"
              iconTone="text-orange-500"
            />
            <StatCard
              icon={BookOpen}
              label="Lições"
              value={String(lessons)}
              tone="from-primary/25 to-indigo-500/10"
              iconTone="text-primary"
            />
            <StatCard
              icon={Clock}
              label="Tempo de estudo"
              value={`${lessons * 8}m`}
              tone="from-emerald-500/25 to-teal-500/10"
              iconTone="text-emerald-500"
            />
          </div>
        </section>

        {/* Card de XP total */}
        <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-surface-2 to-surface p-4">
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/20 blur-2xl" />
          <div className="relative flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/15">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Experiência total</p>
              <p className="text-xl font-bold">{profile.xp.toLocaleString("pt-BR")} XP</p>
              <p className="text-[11px] text-muted-foreground">
                {xpNeeded - xpInLevel} XP para o próximo nível
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
  iconTone,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  tone: string;
  iconTone: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${tone} p-4 shadow-sm`}>
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-background/30">
          <Icon className={`h-4 w-4 ${iconTone}`} />
        </span>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
      </div>
      <p className="mt-2 text-2xl font-extrabold leading-none tracking-tight">{value}</p>
    </div>
  );
}
