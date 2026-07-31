import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useMascot, muralPostLines } from "@/lib/mascot";
import { ThemeToggle } from "@/components/ThemeToggle";
import { allLessons, lessonById } from "@/data/content";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  BookHeart,
  CheckCircle2,
  Heart,
  MessageCircle,
  Rss,
  Camera,
  Pencil,
  BookOpen,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/mural")({
  component: MuralPage,
});

type Post = {
  id: string;
  author_name: string;
  body: string;
  is_answered: boolean;
  amens_seed: number;
  created_at: string;
  user_id: string | null;
};
type Diary = {
  id: string;
  lesson_id: string;
  lesson_title: string;
  question: string;
  answer: string;
  created_at: string;
};
type Activity = {
  id: string;
  user_id: string;
  type: string;
  title: string;
  subtitle: string | null;
  image_url: string | null;
  created_at: string;
};
type Comment = {
  id: string;
  activity_id: string;
  user_id: string;
  author_name: string;
  body: string;
  created_at: string;
};
type Author = { display_name: string; avatar_url: string | null };

function MuralPage() {
  const [tab, setTab] = useState<"feed" | "oracoes" | "diario">("feed");
  return (
    <div className="mx-auto max-w-lg space-y-4 px-4 pt-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Comunidade</p>
          <h1 className="text-xl font-semibold">Feed</h1>
        </div>
        <ThemeToggle />
      </header>

      <div className="relative flex rounded-full border border-border bg-surface p-1 text-sm">
        <button
          onClick={() => setTab("feed")}
          className={`flex-1 rounded-full py-2 font-medium transition-all ${tab === "feed" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
        >
          Feed
        </button>
        <button
          onClick={() => setTab("oracoes")}
          className={`flex-1 rounded-full py-2 font-medium transition-all ${tab === "oracoes" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
        >
          Orações
        </button>
        <button
          onClick={() => setTab("diario")}
          className={`flex-1 rounded-full py-2 font-medium transition-all ${tab === "diario" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
        >
          Meu Diário
        </button>
      </div>

      {tab === "feed" ? <Feed /> : tab === "oracoes" ? <Oracoes /> : <Diario />}
    </div>
  );
}

function activityIcon(type: string) {
  switch (type) {
    case "lesson_completed":
      return BookOpen;
    case "reading_plan_started":
    case "bible_study_started":
      return BookOpen;
    case "avatar_changed":
      return Camera;
    case "bio_changed":
      return Pencil;
    default:
      return Rss;
  }
}

function Feed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [authors, setAuthors] = useState<Record<string, Author>>({});
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [myLikes, setMyLikes] = useState<Set<string>>(new Set());
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [openComments, setOpenComments] = useState<Set<string>>(new Set());
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [me, setMe] = useState<{ id: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;
    void (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (u.user) {
        const { data: prof } = await supabase
          .from("profiles")
          .select("display_name")
          .eq("id", u.user.id)
          .maybeSingle();
        setMe({ id: u.user.id, name: prof?.display_name ?? u.user.email!.split("@")[0] });
      }
      await refresh(u.user?.id ?? null);
      setLoading(false);

      // Sem isso, atividades/curtidas/comentários de amigos só apareceriam após F5.
      channel = supabase
        .channel("mural-feed")
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "activities" }, () => void refresh(u.user?.id ?? null))
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "activity_likes" }, () => void refresh(u.user?.id ?? null))
        .on("postgres_changes", { event: "DELETE", schema: "public", table: "activity_likes" }, () => void refresh(u.user?.id ?? null))
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "activity_comments" }, () => void refresh(u.user?.id ?? null))
        .subscribe();
    })();
    return () => {
      if (channel) void supabase.removeChannel(channel);
    };
  }, []);

  const refresh = async (uid: string | null) => {
    const { data: a } = await supabase
      .from("activities")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(150);
    const list = (a ?? []) as Activity[];
    setActivities(list);
    if (list.length === 0) return;

    const ids = list.map((x) => x.id);
    const userIds = [...new Set(list.map((x) => x.user_id))];

    const [{ data: profs }, { data: likes }, { data: com }] = await Promise.all([
      supabase.from("profiles").select("id, display_name, avatar_url").in("id", userIds),
      supabase.from("activity_likes").select("activity_id, user_id").in("activity_id", ids),
      supabase
        .from("activity_comments")
        .select("*")
        .in("activity_id", ids)
        .order("created_at", { ascending: true }),
    ]);

    const authorMap: Record<string, Author> = {};
    for (const p of profs ?? []) {
      authorMap[p.id] = { display_name: p.display_name, avatar_url: p.avatar_url };
    }
    setAuthors(authorMap);

    const lc: Record<string, number> = {};
    const mine = new Set<string>();
    for (const l of likes ?? []) {
      lc[l.activity_id] = (lc[l.activity_id] ?? 0) + 1;
      if (uid && l.user_id === uid) mine.add(l.activity_id);
    }
    setLikeCounts(lc);
    setMyLikes(mine);

    const cm: Record<string, Comment[]> = {};
    for (const c of (com ?? []) as Comment[]) {
      if (!cm[c.activity_id]) cm[c.activity_id] = [];
      cm[c.activity_id].push(c);
    }
    setComments(cm);
  };

  const toggleLike = async (activityId: string) => {
    if (!me) return;
    const has = myLikes.has(activityId);
    if (has) {
      await supabase.from("activity_likes").delete().eq("activity_id", activityId).eq("user_id", me.id);
    } else {
      await supabase.from("activity_likes").insert({ activity_id: activityId, user_id: me.id });
    }
    await refresh(me.id);
  };

  const toggleComments = (activityId: string) => {
    setOpenComments((prev) => {
      const next = new Set(prev);
      if (next.has(activityId)) next.delete(activityId);
      else next.add(activityId);
      return next;
    });
  };

  const sendComment = async (activityId: string) => {
    const body = (draft[activityId] ?? "").trim();
    if (!body || !me) return;
    await supabase.from("activity_comments").insert({
      activity_id: activityId,
      user_id: me.id,
      author_name: me.name,
      body,
    });
    setDraft((prev) => ({ ...prev, [activityId]: "" }));
    await refresh(me.id);
  };

  if (loading) {
    return <div className="py-12 text-center text-sm text-muted-foreground">Carregando feed…</div>;
  }

  if (activities.length === 0) {
    return (
      <div className="card-elevated flex flex-col items-center px-6 py-12 text-center">
        <Rss className="mb-3 h-10 w-10 text-primary" />
        <h3 className="font-semibold">Seu feed está vazio</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Adicione irmãos pelo ID no Ranking ou no Perfil — as atividades deles (e as suas) aparecerão aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((a) => {
        const author = authors[a.user_id];
        const name = author?.display_name ?? "Discípulo";
        const Icon = activityIcon(a.type);
        const liked = myLikes.has(a.id);
        const activityComments = comments[a.id] ?? [];
        const commentsOpen = openComments.has(a.id);
        return (
          <article key={a.id} className="card-elevated p-4">
            <header className="flex items-center gap-2">
              {author?.avatar_url ? (
                <img src={author.avatar_url} alt={name} className="h-9 w-9 rounded-full object-cover" />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary">
                  {name[0]}
                </div>
              )}
              <div className="flex-1">
                <p className="text-sm font-semibold">{name}</p>
                <p className="text-[11px] text-muted-foreground">
                  {formatDistanceToNow(new Date(a.created_at), { locale: ptBR, addSuffix: true })}
                </p>
              </div>
              <Icon className="h-4 w-4 shrink-0 text-primary/70" />
            </header>

            <p className="mt-3 text-sm leading-relaxed">{a.title}</p>
            {a.subtitle && (
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {a.type === "bio_changed" ? `"${a.subtitle}"` : a.subtitle}
              </p>
            )}
            {a.image_url && (
              <img
                src={a.image_url}
                alt=""
                className="mt-3 h-40 w-40 rounded-xl border border-border object-cover"
              />
            )}

            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => void toggleLike(a.id)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                  liked
                    ? "border-primary bg-primary/20 text-primary"
                    : "border-border bg-background text-muted-foreground hover:border-primary/40"
                }`}
              >
                <Heart className={`h-3.5 w-3.5 ${liked ? "fill-current" : ""}`} />
                <span className="font-semibold">{likeCounts[a.id] ?? 0}</span>
              </button>
              <button
                onClick={() => toggleComments(a.id)}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-primary/40"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                <span className="font-semibold">{activityComments.length}</span>
              </button>
            </div>

            {commentsOpen && (
              <div className="mt-3 space-y-2 border-t border-border/60 pt-3">
                {activityComments.map((c) => (
                  <div key={c.id} className="rounded-xl bg-surface-2 p-2.5 text-sm">
                    <span className="font-semibold">{c.author_name}: </span>
                    <span className="text-foreground/90">{c.body}</span>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    value={draft[a.id] ?? ""}
                    onChange={(e) => setDraft((prev) => ({ ...prev, [a.id]: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") void sendComment(a.id);
                    }}
                    placeholder="Escreva um comentário…"
                    className="flex-1 rounded-full border border-border bg-input px-3 py-1.5 text-sm outline-none focus:border-primary"
                  />
                  <button
                    onClick={() => void sendComment(a.id)}
                    disabled={!(draft[a.id] ?? "").trim()}
                    className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary-glow disabled:opacity-50"
                  >
                    Enviar
                  </button>
                </div>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}

function Oracoes() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [myAmens, setMyAmens] = useState<Set<string>>(new Set());
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [text, setText] = useState("");
  const [me, setMe] = useState<{ id: string; name: string } | null>(null);
  const [posting, setPosting] = useState(false);
  const { say } = useMascot();

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let uid: string | null = null;
    void (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (u.user) {
        uid = u.user.id;
        const { data: prof } = await supabase.from("profiles").select("display_name").eq("id", u.user.id).maybeSingle();
        setMe({ id: u.user.id, name: prof?.display_name ?? u.user.email!.split("@")[0] });
      }
      await refresh(uid);

      // Sem isso, posts e "Amém" de outras pessoas só apareciam após F5.
      channel = supabase
        .channel("mural-clamores")
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "mural_posts" }, () => void refresh(uid))
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "mural_amens" }, () => void refresh(uid))
        .on("postgres_changes", { event: "DELETE", schema: "public", table: "mural_amens" }, () => void refresh(uid))
        .subscribe();
    })();
    return () => {
      if (channel) void supabase.removeChannel(channel);
    };
  }, []);

  const refresh = async (uid: string | null) => {
    const { data: p } = await supabase.from("mural_posts").select("*").order("created_at", { ascending: false });
    const list = (p ?? []) as Post[];
    setPosts(list);
    const { data: amens } = await supabase.from("mural_amens").select("post_id, user_id");
    const c: Record<string, number> = {};
    const mine = new Set<string>();
    for (const p of list) c[p.id] = p.amens_seed;
    for (const a of amens ?? []) {
      c[a.post_id] = (c[a.post_id] ?? 0) + 1;
      if (uid && a.user_id === uid) mine.add(a.post_id);
    }
    setCounts(c);
    setMyAmens(mine);
  };

  const clamar = async () => {
    if (!text.trim() || !me || posting) return;
    setPosting(true);
    const { error } = await supabase.from("mural_posts").insert({
      user_id: me.id,
      author_name: me.name,
      body: text.trim(),
    });
    setPosting(false);
    if (!error) {
      setText("");
      await refresh(me.id);
      const lines = muralPostLines();
      say(lines[Math.floor(Math.random() * lines.length)]);
    }
  };

  const toggleAmen = async (postId: string) => {
    if (!me) return;
    const has = myAmens.has(postId);
    if (has) {
      await supabase.from("mural_amens").delete().eq("post_id", postId).eq("user_id", me.id);
    } else {
      await supabase.from("mural_amens").insert({ post_id: postId, user_id: me.id });
    }
    await refresh(me.id);
  };

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl">
        <img
          src="/mural-banner.png"
          alt="Ovelha em oração em meio à tempestade"
          className="h-auto w-full object-cover"
        />
      </div>

      <div className="card-elevated p-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          placeholder="Escreva seu clamor para o mural…"
          className="w-full resize-none rounded-xl border border-border bg-input p-3 text-sm outline-none focus:border-primary"
        />
        <div className="mt-2 flex justify-end">
          <button
            onClick={() => void clamar()}
            disabled={!text.trim() || posting}
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary-glow disabled:opacity-50"
          >
            Clamar
          </button>
        </div>
      </div>

      {posts.map((p) => (
        <article key={p.id} className="card-elevated p-4">
          <header className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary">
              {p.author_name[0]}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">{p.author_name}</p>
              <p className="text-[11px] text-muted-foreground">
                {formatDistanceToNow(new Date(p.created_at), { locale: ptBR, addSuffix: true })}
              </p>
            </div>
            {p.is_answered && (
              <span className="inline-flex items-center gap-1 rounded-full bg-success/20 px-2.5 py-0.5 text-[10px] font-semibold text-success">
                <CheckCircle2 className="h-3 w-3" /> Pedido Respondido!
              </span>
            )}
          </header>
          <p className="mt-3 text-sm leading-relaxed">{p.body}</p>
          <button
            onClick={() => void toggleAmen(p.id)}
            className={`mt-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
              myAmens.has(p.id)
                ? "border-primary bg-primary/20 text-primary"
                : "border-border bg-background text-muted-foreground hover:border-primary/40"
            }`}
          >
            Amém 🙏 <span className="font-semibold">({counts[p.id] ?? 0})</span>
          </button>
        </article>
      ))}
    </div>
  );
}

function Diario() {
  const [entries, setEntries] = useState<Diary[]>([]);

  useEffect(() => {
    void (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { data } = await supabase
        .from("diary_entries")
        .select("*")
        .eq("user_id", u.user.id)
        .order("created_at", { ascending: false });
      setEntries((data ?? []) as Diary[]);
    })();
  }, []);

  // Ordem do currículo: cada lição de trilha tem um índice fixo (trilha → módulo → lição,
  // na mesma sequência em que o usuário as desbloqueia). Entradas de planos/estudos avulsos
  // (sem trilha) não têm posição no currículo e vão para o final, por data de criação.
  const curriculumOrder = useMemo(() => {
    const m = new Map<string, number>();
    allLessons().forEach((x, i) => m.set(x.lesson.id, i));
    return m;
  }, []);

  const sorted = useMemo(() => {
    return [...entries].sort((a, b) => {
      const oa = curriculumOrder.get(a.lesson_id) ?? Number.MAX_SAFE_INTEGER;
      const ob = curriculumOrder.get(b.lesson_id) ?? Number.MAX_SAFE_INTEGER;
      if (oa !== ob) return oa - ob;
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });
  }, [entries, curriculumOrder]);

  if (entries.length === 0) {
    return (
      <div className="card-elevated flex flex-col items-center px-6 py-12 text-center">
        <BookHeart className="mb-3 h-10 w-10 text-primary" />
        <h3 className="font-semibold">Seu diário está aguardando</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Complete uma lição — sua resposta de reflexão será salva aqui automaticamente.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sorted.map((e) => {
        const found = lessonById(e.lesson_id);
        return (
          <article key={e.id} className="card-elevated p-4">
            {found ? (
              <>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">{found.trail.title}</p>
                <p className="text-[11px] text-muted-foreground">{found.module.title}</p>
              </>
            ) : (
              <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">{e.lesson_title}</p>
            )}
            <p className="mt-1 text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(e.created_at), { locale: ptBR, addSuffix: true })}
            </p>
            <p className="mt-3 text-sm font-medium">{e.question}</p>
            <p className="mt-2 rounded-xl bg-surface-2 p-3 text-base leading-relaxed text-foreground/90 scripture">
              "{e.answer}"
            </p>
          </article>
        );
      })}
    </div>
  );
}
