import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useMascot, muralPostLines } from "@/lib/mascot";
import type { FeedItem, FeedKind } from "@/lib/feed";
import { ThemeToggle } from "@/components/ThemeToggle";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  BookHeart,
  BookOpen,
  Camera,
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  Heart,
  MessageCircle,
  MessageSquare,
  Pencil,
  Trash2,
  Trophy,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/mural")({
  component: MuralPage,
});

type Tab = "feed" | "oracoes" | "diario";

const TAB_LABELS: Record<Tab, string> = {
  feed: "Feed",
  oracoes: "Orações",
  diario: "Meu Diário",
};

function MuralPage() {
  const [tab, setTab] = useState<Tab>("feed");
  return (
    <div className="mx-auto max-w-lg space-y-4 px-4 pt-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Comunidade</p>
          <h1 className="text-xl font-semibold">{TAB_LABELS[tab]}</h1>
        </div>
        <ThemeToggle />
      </header>

      <div className="overflow-hidden rounded-2xl">
        <img
          src="/mural-banner.png"
          alt="Ovelha em oração em meio à tempestade"
          className="h-auto w-full object-cover"
        />
      </div>

      <div className="relative flex rounded-full border border-border bg-surface p-1 text-sm">
        {(Object.keys(TAB_LABELS) as Tab[]).map((key) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 rounded-full py-2 font-medium transition-all ${
              tab === key ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            {TAB_LABELS[key]}
          </button>
        ))}
      </div>

      {tab === "feed" && <Feed />}
      {tab === "oracoes" && <Oracoes />}
      {tab === "diario" && <Diario />}
    </div>
  );
}

// ============================================================
// FEED — publicações reais dos amigos + eventos automáticos
// ============================================================

type FeedComment = {
  id: string;
  item_id: string;
  user_id: string;
  author_name: string;
  body: string;
  created_at: string;
};

const FEED_KIND_ICON: Record<FeedKind, React.ElementType> = {
  post: MessageSquare,
  lesson_completed: GraduationCap,
  module_completed: Trophy,
  reading_plan_started: CalendarDays,
  bible_study_started: BookOpen,
  avatar_changed: Camera,
  bio_changed: Pencil,
};

function Feed() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [myLikes, setMyLikes] = useState<Set<string>>(new Set());
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
  const [openComments, setOpenComments] = useState<Set<string>>(new Set());
  const [comments, setComments] = useState<Record<string, FeedComment[]>>({});
  const [commentDraft, setCommentDraft] = useState<Record<string, string>>({});
  const [composerText, setComposerText] = useState("");
  const [posting, setPosting] = useState(false);
  const [me, setMe] = useState<{ id: string; name: string; avatarUrl: string | null } | null>(null);
  const { say } = useMascot();

  const refresh = async (uid: string | null) => {
    const { data: feedItems } = await supabase
      .from("feed_items")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(150);
    const list = (feedItems ?? []) as FeedItem[];
    setItems(list);

    const ids = list.map((i) => i.id);
    if (ids.length === 0) {
      setLikeCounts({});
      setMyLikes(new Set());
      setCommentCounts({});
      return;
    }

    const { data: likes } = await supabase.from("feed_likes").select("item_id, user_id").in("item_id", ids);
    const likeC: Record<string, number> = {};
    const mine = new Set<string>();
    for (const l of likes ?? []) {
      likeC[l.item_id] = (likeC[l.item_id] ?? 0) + 1;
      if (uid && l.user_id === uid) mine.add(l.item_id);
    }
    setLikeCounts(likeC);
    setMyLikes(mine);

    const { data: allComments } = await supabase.from("feed_comments").select("item_id").in("item_id", ids);
    const cc: Record<string, number> = {};
    for (const c of allComments ?? []) cc[c.item_id] = (cc[c.item_id] ?? 0) + 1;
    setCommentCounts(cc);
  };

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let uid: string | null = null;
    void (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (u.user) {
        uid = u.user.id;
        const { data: prof } = await supabase
          .from("profiles")
          .select("display_name, avatar_url")
          .eq("id", u.user.id)
          .maybeSingle();
        setMe({
          id: u.user.id,
          name: prof?.display_name ?? u.user.email!.split("@")[0],
          avatarUrl: prof?.avatar_url ?? null,
        });
      }
      await refresh(uid);

      // Sem isso, posts, curtidas e comentários de outras pessoas só apareciam após F5.
      channel = supabase
        .channel("feed-realtime")
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "feed_items" }, () => void refresh(uid))
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "feed_likes" }, () => void refresh(uid))
        .on("postgres_changes", { event: "DELETE", schema: "public", table: "feed_likes" }, () => void refresh(uid))
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "feed_comments" }, () => void refresh(uid))
        .subscribe();
    })();
    return () => {
      if (channel) void supabase.removeChannel(channel);
    };
  }, []);

  const publish = async () => {
    if (!composerText.trim() || !me || posting) return;
    setPosting(true);
    const { error } = await supabase.from("feed_items").insert({
      user_id: me.id,
      author_name: me.name,
      author_avatar_url: me.avatarUrl,
      kind: "post",
      body: composerText.trim(),
    });
    setPosting(false);
    if (!error) {
      setComposerText("");
      await refresh(me.id);
      say("Publicado no feed! Seus amigos vão ver isso.");
    }
  };

  const toggleLike = async (itemId: string) => {
    if (!me) return;
    const has = myLikes.has(itemId);
    if (has) {
      await supabase.from("feed_likes").delete().eq("item_id", itemId).eq("user_id", me.id);
    } else {
      await supabase.from("feed_likes").insert({ item_id: itemId, user_id: me.id });
    }
    await refresh(me.id);
  };

  const toggleComments = async (itemId: string) => {
    setOpenComments((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
    if (!comments[itemId]) {
      const { data } = await supabase
        .from("feed_comments")
        .select("*")
        .eq("item_id", itemId)
        .order("created_at", { ascending: true });
      setComments((prev) => ({ ...prev, [itemId]: (data ?? []) as FeedComment[] }));
    }
  };

  const sendComment = async (itemId: string) => {
    const text = (commentDraft[itemId] ?? "").trim();
    if (!text || !me) return;
    const { error } = await supabase.from("feed_comments").insert({
      item_id: itemId,
      user_id: me.id,
      author_name: me.name,
      body: text,
    });
    if (!error) {
      setCommentDraft((prev) => ({ ...prev, [itemId]: "" }));
      const { data } = await supabase
        .from("feed_comments")
        .select("*")
        .eq("item_id", itemId)
        .order("created_at", { ascending: true });
      setComments((prev) => ({ ...prev, [itemId]: (data ?? []) as FeedComment[] }));
      setCommentCounts((prev) => ({ ...prev, [itemId]: (prev[itemId] ?? 0) + 1 }));
    }
  };

  return (
    <div className="space-y-4">
      <div className="card-elevated p-4">
        <textarea
          value={composerText}
          onChange={(e) => setComposerText(e.target.value)}
          rows={3}
          placeholder="Escreva algo para compartilhar com seus amigos…"
          className="w-full resize-none rounded-xl border border-border bg-input p-3 text-sm outline-none focus:border-primary"
        />
        <div className="mt-2 flex justify-end">
          <button
            onClick={() => void publish()}
            disabled={!composerText.trim() || posting}
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary-glow disabled:opacity-50"
          >
            Publicar
          </button>
        </div>
      </div>

      {items.length === 0 && (
        <div className="card-elevated flex flex-col items-center px-6 py-12 text-center">
          <Users className="mb-3 h-10 w-10 text-primary" />
          <h3 className="font-semibold">Seu feed está vazio</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Adicione amigos e comece a estudar — as atividades aparecem aqui.
          </p>
        </div>
      )}

      {items.map((item) => (
        <FeedCard
          key={item.id}
          item={item}
          liked={myLikes.has(item.id)}
          likeCount={likeCounts[item.id] ?? 0}
          commentCount={commentCounts[item.id] ?? 0}
          commentsOpen={openComments.has(item.id)}
          commentsList={comments[item.id] ?? []}
          commentDraft={commentDraft[item.id] ?? ""}
          onToggleLike={() => void toggleLike(item.id)}
          onToggleComments={() => void toggleComments(item.id)}
          onCommentDraftChange={(v) => setCommentDraft((prev) => ({ ...prev, [item.id]: v }))}
          onSendComment={() => void sendComment(item.id)}
        />
      ))}
    </div>
  );
}

function FeedCard({
  item,
  liked,
  likeCount,
  commentCount,
  commentsOpen,
  commentsList,
  commentDraft,
  onToggleLike,
  onToggleComments,
  onCommentDraftChange,
  onSendComment,
}: {
  item: FeedItem;
  liked: boolean;
  likeCount: number;
  commentCount: number;
  commentsOpen: boolean;
  commentsList: FeedComment[];
  commentDraft: string;
  onToggleLike: () => void;
  onToggleComments: () => void;
  onCommentDraftChange: (v: string) => void;
  onSendComment: () => void;
}) {
  const Icon = FEED_KIND_ICON[item.kind];

  return (
    <article className="card-elevated p-4">
      <header className="flex items-start gap-2">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/20 text-sm font-semibold text-primary">
          {item.author_avatar_url ? (
            <img src={item.author_avatar_url} alt={item.author_name} className="h-full w-full object-cover" />
          ) : (
            item.author_name[0]
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{item.author_name}</p>
          <p className="text-[11px] text-muted-foreground">
            {formatDistanceToNow(new Date(item.created_at), { locale: ptBR, addSuffix: true })}
          </p>
        </div>
        <Icon className="h-4 w-4 shrink-0 text-primary/70" />
      </header>

      <div className="mt-3 text-sm leading-relaxed">
        {item.kind === "post" && <p>{item.body}</p>}

        {item.kind === "avatar_changed" && (
          <div className="flex items-center gap-3">
            <p className="text-muted-foreground">Trocou a foto de perfil</p>
            {item.author_avatar_url && (
              <img
                src={item.author_avatar_url}
                alt="Nova foto de perfil"
                className="h-12 w-12 rounded-xl object-cover"
              />
            )}
          </div>
        )}

        {item.kind === "bio_changed" && (
          <div>
            <p className="text-muted-foreground">Atualizou a bio</p>
            {item.body && (
              <p className="mt-1 rounded-xl bg-surface-2 p-3 text-sm italic text-foreground/90">"{item.body}"</p>
            )}
          </div>
        )}

        {(item.kind === "lesson_completed" ||
          item.kind === "module_completed" ||
          item.kind === "reading_plan_started" ||
          item.kind === "bible_study_started") && <p>{item.body}</p>}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={onToggleLike}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
            liked
              ? "border-primary bg-primary/20 text-primary"
              : "border-border bg-background text-muted-foreground hover:border-primary/40"
          }`}
        >
          <Heart className={`h-3.5 w-3.5 ${liked ? "fill-current" : ""}`} /> Curtir{" "}
          <span className="font-semibold">({likeCount})</span>
        </button>
        <button
          onClick={onToggleComments}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-primary/40"
        >
          <MessageCircle className="h-3.5 w-3.5" /> Comentar{" "}
          <span className="font-semibold">({commentCount})</span>
        </button>
      </div>

      {commentsOpen && (
        <div className="mt-3 space-y-2 border-t border-border pt-3">
          {commentsList.map((c) => (
            <div key={c.id} className="rounded-xl bg-surface-2 p-2.5 text-xs">
              <span className="font-semibold">{c.author_name}</span> <span className="text-foreground/80">{c.body}</span>
            </div>
          ))}
          <div className="flex gap-2">
            <input
              value={commentDraft}
              onChange={(e) => onCommentDraftChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSendComment();
              }}
              placeholder="Escreva um comentário…"
              className="flex-1 rounded-full border border-border bg-input px-3 py-1.5 text-xs outline-none focus:border-primary"
            />
            <button
              onClick={onSendComment}
              disabled={!commentDraft.trim()}
              className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground disabled:opacity-50"
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

// ============================================================
// ORAÇÕES — mesmo sistema de "clamores" compartilhados de sempre
// ============================================================

type Post = {
  id: string;
  author_name: string;
  body: string;
  is_answered: boolean;
  amens_seed: number;
  created_at: string;
  user_id: string | null;
};

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

// ============================================================
// MEU DIÁRIO — respostas de reflexão, com módulo/trilha, edição e exclusão
// ============================================================

type DiaryRow = {
  id: string;
  lesson_id: string;
  lesson_title: string;
  question: string;
  answer: string;
  created_at: string;
  updated_at: string;
};

type TrailMeta = { moduleOrd: number; moduleTitle: string; trailOrd: number; trailTitle: string };

function Diario() {
  const [entries, setEntries] = useState<DiaryRow[]>([]);
  const [trailMeta, setTrailMeta] = useState<Record<string, TrailMeta>>({});
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) {
      setLoading(false);
      return;
    }
    const [{ data: diaryRows }, { data: trails }, { data: modules }] = await Promise.all([
      supabase
        .from("diary_entries")
        .select("*")
        .eq("user_id", u.user.id)
        .order("created_at", { ascending: false }),
      supabase.from("disciple_trails").select("lesson_id, module_id, ord, title"),
      supabase.from("disciple_modules").select("id, ord, title"),
    ]);

    const moduleById = new Map((modules ?? []).map((m) => [m.id, m]));
    const meta: Record<string, TrailMeta> = {};
    for (const t of trails ?? []) {
      if (!t.lesson_id) continue;
      const mod = moduleById.get(t.module_id);
      if (!mod) continue;
      meta[t.lesson_id] = {
        moduleOrd: mod.ord,
        moduleTitle: mod.title,
        trailOrd: t.ord,
        trailTitle: t.title,
      };
    }
    setTrailMeta(meta);
    setEntries((diaryRows ?? []) as DiaryRow[]);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const ordered = useMemo(() => {
    const withMeta = entries.map((e) => ({ entry: e, meta: trailMeta[e.lesson_id] }));
    withMeta.sort((a, b) => {
      if (a.meta && b.meta) {
        if (a.meta.moduleOrd !== b.meta.moduleOrd) return a.meta.moduleOrd - b.meta.moduleOrd;
        return a.meta.trailOrd - b.meta.trailOrd;
      }
      if (a.meta && !b.meta) return -1;
      if (!a.meta && b.meta) return 1;
      return new Date(a.entry.created_at).getTime() - new Date(b.entry.created_at).getTime();
    });
    return withMeta;
  }, [entries, trailMeta]);

  const startEdit = (entry: DiaryRow) => {
    setEditingId(entry.id);
    setEditDraft(entry.answer);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDraft("");
  };

  const saveEdit = async (id: string) => {
    if (!editDraft.trim() || saving) return;
    setSaving(true);
    const { error } = await supabase.from("diary_entries").update({ answer: editDraft.trim() }).eq("id", id);
    setSaving(false);
    if (!error) {
      setEntries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, answer: editDraft.trim(), updated_at: new Date().toISOString() } : e)),
      );
      setEditingId(null);
      setEditDraft("");
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm("Apagar esta resposta do diário? Essa ação não pode ser desfeita.")) return;
    const { error } = await supabase.from("diary_entries").delete().eq("id", id);
    if (!error) {
      setEntries((prev) => prev.filter((e) => e.id !== id));
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-sm text-muted-foreground">Carregando…</div>;
  }

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
      {ordered.map(({ entry: e, meta }) => {
        const isEditing = editingId === e.id;
        const wasEdited = e.updated_at && e.updated_at !== e.created_at;
        return (
          <article key={e.id} className="card-elevated p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                  {meta
                    ? `Módulo ${meta.moduleOrd} · ${meta.moduleTitle} — Trilha: ${meta.trailTitle}`
                    : e.lesson_title}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(e.created_at), { locale: ptBR, addSuffix: true })}
                  {wasEdited && " · editado"}
                </p>
              </div>
              {!isEditing && (
                <div className="flex shrink-0 gap-1">
                  <button
                    onClick={() => startEdit(e)}
                    className="rounded-full p-1.5 text-muted-foreground hover:bg-surface hover:text-primary"
                    aria-label="Editar resposta"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => void remove(e.id)}
                    className="rounded-full p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    aria-label="Apagar resposta"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
            <p className="mt-3 text-sm font-medium">{e.question}</p>
            {isEditing ? (
              <div className="mt-2 space-y-2">
                <textarea
                  value={editDraft}
                  onChange={(ev) => setEditDraft(ev.target.value)}
                  rows={4}
                  className="w-full resize-none rounded-xl border border-border bg-input p-3 text-sm outline-none focus:border-primary"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={cancelEdit}
                    className="rounded-full border border-border px-4 py-1.5 text-xs font-medium text-muted-foreground"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => void saveEdit(e.id)}
                    disabled={saving || !editDraft.trim()}
                    className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground disabled:opacity-50"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-2 rounded-xl bg-surface-2 p-3 text-base leading-relaxed text-foreground/90 scripture">
                "{e.answer}"
              </p>
            )}
          </article>
        );
      })}
    </div>
  );
}
