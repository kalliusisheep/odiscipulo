import { createFileRoute, Link, notFound, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getLevel, MAX_LEVEL } from "@/data/levels";
import { CHARACTERS } from "@/data/content";
import { toast } from "sonner";
import { ArrowLeft, MessageCircle, Flame, Trophy, BookOpen, Clock, UserPlus, Check, Copy } from "lucide-react";

export const Route = createFileRoute("/_authenticated/perfil/$username")({
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
};

function PublicProfilePage() {
  const { username } = useParams({ from: "/_authenticated/perfil/$username" });
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
      const { data: p } = await supabase
        .from("profiles")
        .select("id, display_name, username, avatar_char, avatar_url, bio, xp, streak")
        .ilike("username", username)
        .maybeSingle();
      if (!p) {
        setLoading(false);
        throw notFound();
      }
      setProfile(p as Profile);
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
    const { error } = await supabase.from("friendships").insert([
      { user_id: myId, friend_id: profile.id },
      { user_id: profile.id, friend_id: myId },
    ]);
    setAdding(false);
    if (error && !/duplicate/i.test(error.message)) {
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

  return (
    <div className="mx-auto max-w-lg space-y-4 px-4 pt-6 pb-24">
      <Link to="/ranking" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Voltar ao ranking
      </Link>

      <section className="card-elevated overflow-hidden">
        <div className="bg-gradient-to-br from-primary/20 to-primary-glow/10 p-5 text-center">
          <div className="mx-auto h-28 w-28">
            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl bg-surface-2 ring-2 ring-primary/40 text-6xl">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="Foto" className="h-full w-full object-cover" />
              ) : level.avatar ? (
                <img src={level.avatar} alt={level.title} className="h-full w-full object-cover" />
              ) : (
                <span>{ch.emoji}</span>
              )}
            </div>
          </div>
          <h2 className="mt-3 text-lg font-bold">{profile.display_name}</h2>
          <div className="mt-1 flex items-center justify-center gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">@{profile.username}</span>
            <button
              onClick={() => void copyUsername()}
              className="rounded-full p-1 text-muted-foreground hover:bg-surface-2 hover:text-primary"
              aria-label="Copiar ID"
            >
              {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
            </button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Patente:</p>
          <p className="text-base font-semibold text-primary">Nível {level.level} / {MAX_LEVEL}: {level.title}</p>
          {profile.bio && (
            <p className="mt-3 rounded-2xl bg-surface-2 px-4 py-2 text-sm italic text-foreground/90">"{profile.bio}"</p>
          )}
        </div>
      </section>

      {!isSelf && (
        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/mensagens/$username"
            params={{ username: profile.username }}
            className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-transform active:scale-95"
          >
            <MessageCircle className="h-4 w-4" /> Enviar mensagem
          </Link>
          {isFriend ? (
            <div className="flex items-center justify-center gap-2 rounded-2xl border border-success/40 bg-success/10 px-4 py-3 text-sm font-semibold text-success">
              <Check className="h-4 w-4" /> Irmãos
            </div>
          ) : (
            <button
              onClick={() => void addFriend()}
              disabled={adding}
              className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-surface-2 px-4 py-3 text-sm font-semibold transition-transform active:scale-95 disabled:opacity-60"
            >
              <UserPlus className="h-4 w-4" /> {adding ? "Adicionando…" : "Adicionar irmão"}
            </button>
          )}
        </div>
      )}

      <section className="card-elevated p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estatísticas</p>
        <div className="grid grid-cols-2 gap-2 text-center">
          <Stat icon={Trophy} label="Nível" value={String(level.level)} />
          <Stat icon={Flame} label="Ofensiva 🔥" value={`${profile.streak}d`} />
          <Stat icon={BookOpen} label="Lições" value={String(lessons)} />
          <Stat icon={Clock} label="Estudo" value={`${lessons * 8}m`} />
        </div>
      </section>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-surface-2 p-3">
      <Icon className="mx-auto h-4 w-4 text-primary" />
      <p className="mt-1 text-lg font-bold">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}
