import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useMascot, muralPostLines } from "@/lib/mascot";
import type { FeedItem, FeedKind } from "@/lib/feed";
import { ThemeToggle } from "@/components/ThemeToggle";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { VoiceNotePlayer } from "@/components/VoiceNotePlayer";
import { GifPicker } from "@/components/GifPicker";
import { EmojiPicker } from "@/components/EmojiPicker";
import { uploadMuralVoiceNote } from "@/lib/voice-upload";
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
  Send,
  Trash2,
  Trophy,
  Users,
  X,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/mural")({
  component: MuralPage,
});

type Tab = "feed" | "oracoes" | "diario";

const TAB_LABELS: Record<Tab, string> = 
  feed: "Feed",
  oracoes: "Orações",
  diario: "Meu Diário",
};

const TAB_BANNERS: Record<Tab, { src: string; alt: string }> = {
  feed: {
    src: "/mural-banner.png",
    alt: "Ovelha em capa azul lendo reações no celular, sobre uma muralha",
  },
  oracoes: { src: "/oracoes-banner.png", alt: "Ovelha orando em um barco" },
  diario: { src: "/diario-banner.png", alt: "Ovelha escrevendo no diário encostada em uma árvore" },
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
          key={tab}
          src={TAB_BANNERS[tab].src}
          alt={TAB_BANNERS[tab].alt}
          className="aspect-[21/9] w-full object-cover object-top"
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
  author_avatar_url: string | null;
  body: string | null;
  gif_url: string | null;
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

const FEED_KIND_STYLE: Record<FeedKind, string> = {
  post: "bg-primary/15 text-primary",
  lesson_completed: "bg-success/15 text-success",
  module_completed: "bg-streak/20 text-streak",
  reading_plan_started: "bg-ancient/15 text-ancient",
  bible_study_started: "bg-ancient/15 text-ancient",
  avatar_changed: "bg-accent text-accent-foreground",
  bio_changed: "bg-accent text-accent-foreground",
};

// Barra de destaque à esquerda do card + rótulo do tipo de evento — é o que
// dá ao Feed uma identidade "linha do tempo" bem diferente do Mural de Orações.
const FEED_KIND_ACCENT: Record<FeedKind, string> = {
  post: "bg-primary",
  lesson_completed: "bg-success",
  module_completed: "bg-streak",
  reading_plan_started: "bg-ancient",
  bible_study_started: "bg-ancient",
  avatar_changed: "bg-accent-foreground/40",
  bio_changed: "bg-accent-foreground/40",
};

const FEED_KIND_LABEL: Record<FeedKind, string> = {
  post: "Publicação",
  lesson_completed: "Lição concluída",
  module_completed: "Módulo concluído",
  reading_plan_started: "Novo plano de leitura",
  bible_study_started: "Novo estudo bíblico",
  avatar_changed: "Foto atualizada",
  bio_changed: "Bio atualizada",
};

function Feed() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [myLikes, setMyLikes] = useState<Set<string>>(new Set());
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
  const [openComments, setOpenComments] = useState<Set<string>>(new Set());
  const [comments, setComments] = useState<Record<string, FeedComment[]>>({});
  const [commentDraft, setCommentDraft] = useState<Record<string, string>>({});
  const [pendingGif, setPendingGif] = useState<Record<string, string | null>>({});
  const [commentLikeCounts, setCommentLikeCounts] = useState<Record<string, number>>({});
  const [myCommentLikes, setMyCommentLikes] = useState<Set<string>>(new Set());
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

    const { data: likes } = await supabase
      .from("feed_likes")
      .select("item_id, user_id")
      .in("item_id", ids);
    const likeC: Record<string, number> = {};
    const mine = new Set<string>();
    for (const l of likes ?? []) {
      likeC[l.item_id] = (likeC[l.item_id] ?? 0) + 1;
      if (uid && l.user_id === uid) mine.add(l.item_id);
    }
    setLikeCounts(likeC);
    setMyLikes(mine);

    const { data: allComments } = await supabase
      .from("feed_comments")
      .select("item_id")
      .in("item_id", ids);
    const cc: Record<string, number> = {};
    for (const c of allComments ?? []) cc[c.item_id] = (cc[c.item_id] ?? 0) + 1;
    setCommentCounts(cc);
  };

  // Busca curtidas dos comentários de um item específico e mescla no estado
  // global (indexado por comment id, então funciona para vários itens abertos).
  const loadCommentLikes = async (commentIds: string[], uid: string | null) => {
    if (commentIds.length === 0) return;
    const { data } = await supabase
      .from("feed_comment_likes")
      .select("comment_id, user_id")
      .in("comment_id", commentIds);
    const counts: Record<string, number> = {};
    const mine = new Set<string>();
    for (const l of data ?? []) {
      counts[l.comment_id] = (counts[l.comment_id] ?? 0) + 1;
      if (uid && l.user_id === uid) mine.add(l.comment_id);
    }
    setCommentLikeCounts((prev) => ({ ...prev, ...counts }));
    setMyCommentLikes((prev) => {
      const next = new Set(prev);
      for (const id of mine) next.add(id);
      return next;
    });
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
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "feed_items" },
          () => void refresh(uid),
        )
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "feed_likes" },
          () => void refresh(uid),
        )
        .on(
          "postgres_changes",
          { event: "DELETE", schema: "public", table: "feed_likes" },
          () => void refresh(uid),
        )
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "feed_comments" },
          () => void refresh(uid),
        )
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
      const list = (data ?? []) as FeedComment[];
      setComments((prev) => ({ ...prev, [itemId]: list }));
      void loadCommentLikes(
        list.map((c) => c.id),
        me?.id ?? null,
      );
    }
  };

  const sendComment = async (itemId: string) => {
    const text = (commentDraft[itemId] ?? "").trim();
    const gifUrl = pendingGif[itemId] ?? null;
    if ((!text && !gifUrl) || !me) return;
    const { error } = await supabase.from("feed_comments").insert({
      item_id: itemId,
      user_id: me.id,
      author_name: me.name,
      author_avatar_url: me.avatarUrl,
      body: text,
      gif_url: gifUrl,
    });
    if (!error) {
      setCommentDraft((prev) => ({ ...prev, [itemId]: "" }));
      setPendingGif((prev) => ({ ...prev, [itemId]: null }));
      const { data } = await supabase
        .from("feed_comments")
        .select("*")
        .eq("item_id", itemId)
        .order("created_at", { ascending: true });
      setComments((prev) => ({ ...prev, [itemId]: (data ?? []) as FeedComment[] }));
      setCommentCounts((prev) => ({ ...prev, [itemId]: (prev[itemId] ?? 0) + 1 }));
    }
  };

  const toggleCommentLike = async (commentId: string) => {
    if (!me) return;
    const has = myCommentLikes.has(commentId);
    // Otimista: atualiza a UI na hora, sem esperar a rede.
    setMyCommentLikes((prev) => {
      const next = new Set(prev);
      if (has) next.delete(commentId);
      else next.add(commentId);
      return next;
    });
    setCommentLikeCounts((prev) => ({
      ...prev,
      [commentId]: Math.max(0, (prev[commentId] ?? 0) + (has ? -1 : 1)),
    }));
    if (has) {
      await supabase
        .from("feed_comment_likes")
        .delete()
        .eq("comment_id", commentId)
        .eq("user_id", me.id);
    } else {
      await supabase.from("feed_comment_likes").insert({ comment_id: commentId, user_id: me.id });
    }
  };

  const insertComposerEmoji = (emoji: string) => setComposerText((t) => t + emoji);

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-surface to-surface-2 shadow-sm">
        <div className="h-1 w-full bg-gradient-to-r from-primary via-primary-glow to-accent" />
        <div className="flex gap-3 p-4">
          <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/20 text-sm font-semibold text-primary ring-2 ring-background">
            {me?.avatarUrl ? (
              <img src={me.avatarUrl} alt={me.name} className="h-full w-full object-cover" />
            ) : (
              (me?.name?.[0] ?? "?")
            )}
          </div>
          <div className="min-w-0 flex-1">
            <textarea
              value={composerText}
              onChange={(e) => setComposerText(e.target.value)}
              rows={3}
              placeholder="Escreva algo para compartilhar com seus amigos…"
              className="w-full resize-none rounded-xl border border-border bg-input p-3 text-sm outline-none focus:border-primary"
            />
            <div className="mt-2 flex items-center justify-between gap-2">
              <EmojiPicker onSelect={insertComposerEmoji} />
              <button
                onClick={() => void publish()}
                disabled={!composerText.trim() || posting}
                className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary-glow hover:shadow-md disabled:opacity-50 disabled:shadow-none"
              >
                {posting ? "Publicando…" : "Publicar"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {items.length === 0 && (
        <div className="flex flex-col items-center rounded-3xl border border-dashed border-border px-6 py-12 text-center">
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
          pendingGif={pendingGif[item.id] ?? null}
          commentLikeCounts={commentLikeCounts}
          myCommentLikes={myCommentLikes}
          onToggleLike={() => void toggleLike(item.id)}
          onToggleComments={() => void toggleComments(item.id)}
          onCommentDraftChange={(v) => setCommentDraft((prev) => ({ ...prev, [item.id]: v }))}
          onPendingGifChange={(url) => setPendingGif((prev) => ({ ...prev, [item.id]: url }))}
          onSendComment={() => void sendComment(item.id)}
          onToggleCommentLike={(commentId) => void toggleCommentLike(commentId)}
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
  pendingGif,
  commentLikeCounts,
  myCommentLikes,
  onToggleLike,
  onToggleComments,
  onCommentDraftChange,
  onPendingGifChange,
  onSendComment,
  onToggleCommentLike,
}: {
  item: FeedItem;
  liked: boolean;
  likeCount: number;
  commentCount: number;
  commentsOpen: boolean;
  commentsList: FeedComment[];
  commentDraft: string;
  pendingGif: string | null;
  commentLikeCounts: Record<string, number>;
  myCommentLikes: Set<string>;
  onToggleLike: () => void;
  onToggleComments: () => void;
  onCommentDraftChange: (v: string) => void;
  onPendingGifChange: (url: string | null) => void;
  onSendComment: () => void;
  onToggleCommentLike: (commentId: string) => void;
}) {
  const Icon = FEED_KIND_ICON[item.kind];

  return (
    <article className="relative overflow-hidden rounded-3xl border border-border bg-surface pl-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <div className={`absolute inset-y-0 left-0 w-1.5 ${FEED_KIND_ACCENT[item.kind]}`} />
      <div className="p-4 pl-3">
        <header className="flex items-start gap-2.5">
          <div className="relative shrink-0">
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-primary/20 text-sm font-semibold text-primary ring-2 ring-background">
              {item.author_avatar_url ? (
                <img
                  src={item.author_avatar_url}
                  alt={item.author_name}
                  className="h-full w-full object-cover"
                />
              ) : (
                item.author_name[0]
              )}
            </div>
            <div
              className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full ring-2 ring-surface ${FEED_KIND_STYLE[item.kind]}`}
            >
              <Icon className="h-3 w-3" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-tight">{item.author_name}</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className={`font-medium ${FEED_KIND_STYLE[item.kind].split(" ")[1]}`}>
                {FEED_KIND_LABEL[item.kind]}
              </span>
              <span aria-hidden>·</span>
              {formatDistanceToNow(new Date(item.created_at), { locale: ptBR, addSuffix: true })}
            </p>
          </div>
        </header>

        <div className="mt-3 text-sm leading-relaxed">
          {item.kind === "post" && <p className="whitespace-pre-wrap">{item.body}</p>}

          {item.kind === "avatar_changed" && (
            <div className="flex items-center gap-3">
              <p className="text-muted-foreground">Trocou a foto de perfil</p>
              {item.author_avatar_url && (
                <img
                  src={item.author_avatar_url}
                  alt="Nova foto de perfil"
                  className="h-12 w-12 rounded-xl object-cover ring-1 ring-border"
                />
              )}
            </div>
          )}

          {item.kind === "bio_changed" && (
            <div>
              <p className="text-muted-foreground">Atualizou a bio</p>
              {item.body && (
                <p className="mt-1 rounded-xl bg-surface-2 p-3 text-sm italic text-foreground/90">
                  "{item.body}"
                </p>
              )}
            </div>
          )}

          {(item.kind === "lesson_completed" ||
            item.kind === "module_completed" ||
            item.kind === "reading_plan_started" ||
            item.kind === "bible_study_started") && <p>{item.body}</p>}
        </div>

        <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
          <button
            onClick={onToggleLike}
            className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-full py-1.5 text-xs font-medium transition-all ${
              liked ? "text-primary" : "text-muted-foreground hover:bg-surface-2"
            }`}
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
            Curtir{likeCount > 0 && <span className="font-semibold">({likeCount})</span>}
          </button>
          <div className="h-4 w-px bg-border" />
          <button
            onClick={onToggleComments}
            className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-full py-1.5 text-xs font-medium transition-all ${
              commentsOpen ? "text-primary" : "text-muted-foreground hover:bg-surface-2"
            }`}
          >
            <MessageCircle className="h-4 w-4" />
            Comentar{commentCount > 0 && <span className="font-semibold">({commentCount})</span>}
          </button>
        </div>

        {commentsOpen && (
          <div className="mt-3 space-y-3 border-t border-border pt-3">
            {commentsList.map((c) => {
              const commentLiked = myCommentLikes.has(c.id);
              const commentLikeCount = commentLikeCounts[c.id] ?? 0;
              return (
                <div key={c.id} className="flex items-start gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/20 text-[11px] font-semibold text-primary">
                    {c.author_avatar_url ? (
                      <img
                        src={c.author_avatar_url}
                        alt={c.author_name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      c.author_name[0]
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="inline-block max-w-full rounded-2xl bg-surface-2 px-3 py-2">
                      <span className="text-xs font-semibold">{c.author_name}</span>
                      {c.body && (
                        <p className="mt-0.5 text-xs leading-relaxed text-foreground/90">
                          {c.body}
                        </p>
                      )}
                      {c.gif_url && (
                        <img
                          src={c.gif_url}
                          alt="GIF enviado no comentário"
                          className="mt-1.5 max-h-40 w-auto rounded-lg"
                          loading="lazy"
                        />
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-3 px-1">
                      <span className="text-[10px] text-muted-foreground">
                        {formatDistanceToNow(new Date(c.created_at), {
                          locale: ptBR,
                          addSuffix: true,
                        })}
                      </span>
                      <button
                        onClick={() => onToggleCommentLike(c.id)}
                        className={`inline-flex items-center gap-1 text-[10px] font-medium transition-colors ${
                          commentLiked ? "text-primary" : "text-muted-foreground hover:text-primary"
                        }`}
                      >
                        <Heart className={`h-3 w-3 ${commentLiked ? "fill-current" : ""}`} />
                        Curtir{commentLikeCount > 0 && ` (${commentLikeCount})`}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="space-y-1.5">
              {pendingGif && (
                <div className="relative inline-block">
                  <img src={pendingGif} alt="GIF selecionado" className="max-h-28 rounded-lg" />
                  <button
                    onClick={() => onPendingGifChange(null)}
                    aria-label="Remover GIF"
                    className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-background text-foreground shadow ring-1 ring-border"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <GifPicker onSelect={(url) => onPendingGifChange(url)} />
                <EmojiPicker
                  onSelect={(emoji) => onCommentDraftChange(commentDraft + emoji)}
                  className="[&>button]:h-8 [&>button]:w-8"
                />
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
                  disabled={!commentDraft.trim() && !pendingGif}
                  aria-label="Enviar comentário"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all hover:bg-primary-glow disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

// ============================================================
// ORAÇÕES — mesmo sistema de "clamores" compartilhados de sempre
// ============================================================

type Post = {
  id: string;
  author_name: string;
  body: string | null;
  audio_url: string | null;
  audio_duration_seconds: number | null;
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
        const { data: prof } = await supabase
          .from("profiles")
          .select("display_name")
          .eq("id", u.user.id)
          .maybeSingle();
        setMe({ id: u.user.id, name: prof?.display_name ?? u.user.email!.split("@")[0] });
      }
      await refresh(uid);

      // Sem isso, posts e "Amém" de outras pessoas só apareciam após F5.
      channel = supabase
        .channel("mural-clamores")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "mural_posts" },
          () => void refresh(uid),
        )
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "mural_amens" },
          () => void refresh(uid),
        )
        .on(
          "postgres_changes",
          { event: "DELETE", schema: "public", table: "mural_amens" },
          () => void refresh(uid),
        )
        .subscribe();
    })();
    return () => {
      if (channel) void supabase.removeChannel(channel);
    };
  }, []);

  const refresh = async (uid: string | null) => {
    const { data: p } = await supabase
      .from("mural_posts")
      .select("*")
      .order("created_at", { ascending: false });
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

  const clamarComAudio = async (blob: Blob, seconds: number, mimeType: string) => {
    if (!me) return;
    const url = await uploadMuralVoiceNote(me.id, blob, mimeType);
    const { error } = await supabase.from("mural_posts").insert({
      user_id: me.id,
      author_name: me.name,
      body: null,
      audio_url: url,
      audio_duration_seconds: seconds,
    });
    if (!error) {
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
        <div className="mt-2 flex items-center justify-between gap-2">
          <VoiceRecorder onSend={clamarComAudio} maxSeconds={60} />
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
          {p.audio_url ? (
            <div className="mt-3">
              <VoiceNotePlayer src={p.audio_url} />
            </div>
          ) : (
            p.body && <p className="mt-3 text-sm leading-relaxed">{p.body}</p>
          )}
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
    const { error } = await supabase
      .from("diary_entries")
      .update({ answer: editDraft.trim() })
      .eq("id", id);
    setSaving(false);
    if (!error) {
      setEntries((prev) =>
        prev.map((e) =>
          e.id === id
            ? { ...e, answer: editDraft.trim(), updated_at: new Date().toISOString() }
            : e,
        ),
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
