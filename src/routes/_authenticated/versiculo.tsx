import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useApp } from "@/lib/app-context";
import { fetchPassage, stripVerseNumbers } from "@/lib/bible";
import {
  fetchDailyVersePool,
  pickTodayVerse,
  verseDateKey,
  apiRefFor,
  type DailyVerseRow,
} from "@/lib/daily-verse";
import {
  getCounts,
  toggleVerseLike,
  recordVerseShare,
  listComments,
  addComment,
  loadCommentLikes,
  toggleCommentLike,
  type DailyVerseComment,
} from "@/lib/daily-verse-social";
import { generateShareImage } from "@/lib/share-image";
import { ThemeToggle } from "@/components/ThemeToggle";
import { EmojiPicker } from "@/components/EmojiPicker";
import { GifPicker } from "@/components/GifPicker";
import {
  ArrowLeft,
  BookOpen,
  Heart,
  Loader2,
  MessageCircle,
  Send,
  Share2,
  Sparkles,
  X,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/versiculo")({
  head: () => ({
    meta: [
      { title: "Versículo do dia — Disciple" },
      {
        name: "description",
        content: "O versículo do dia, para refletir e compartilhar o evangelho.",
      },
    ],
  }),
  component: VerseOfDayPage,
});

type Me = { id: string; name: string; avatarUrl: string | null };

function VerseOfDayPage() {
  const { bibleVersion } = useApp();
  const dateKey = verseDateKey();

  const [verse, setVerse] = useState<DailyVerseRow | null>(null);
  const [text, setText] = useState<string | null>(null);
  const [textError, setTextError] = useState(false);
  const [me, setMe] = useState<Me | null>(null);

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [shareCount, setShareCount] = useState(0);
  const [sharing, setSharing] = useState(false);

  const [comments, setComments] = useState<DailyVerseComment[]>([]);
  const [commentLikeCounts, setCommentLikeCounts] = useState<Record<string, number>>({});
  const [myCommentLikes, setMyCommentLikes] = useState<Set<string>>(new Set());
  const [commentDraft, setCommentDraft] = useState("");
  const [pendingGif, setPendingGif] = useState<string | null>(null);
  const [sendingComment, setSendingComment] = useState(false);

  // Carrega o versículo de hoje + quem sou eu.
  useEffect(() => {
    let alive = true;
    void (async () => {
      const [pool, { data: u }] = await Promise.all([
        fetchDailyVersePool(),
        supabase.auth.getUser(),
      ]);
      if (!alive) return;
      const today = pickTodayVerse(pool, dateKey);
      setVerse(today);

      if (u.user) {
        const { data: prof } = await supabase
          .from("profiles")
          .select("display_name, avatar_url")
          .eq("id", u.user.id)
          .maybeSingle();
        if (alive) {
          setMe({
            id: u.user.id,
            name: prof?.display_name ?? u.user.email!.split("@")[0],
            avatarUrl: prof?.avatar_url ?? null,
          });
        }
      }

      const c = await getCounts(dateKey, u.user?.id ?? null);
      if (!alive) return;
      setLiked(c.liked);
      setLikeCount(c.likeCount);
      setShareCount(c.shareCount);

      const list = await listComments(dateKey);
      if (!alive) return;
      setComments(list);
      const { counts, mine } = await loadCommentLikes(
        list.map((c) => c.id),
        u.user?.id ?? null,
      );
      if (!alive) return;
      setCommentLikeCounts(counts);
      setMyCommentLikes(mine);
    })();
    return () => {
      alive = false;
    };
  }, [dateKey]);

  // Busca o texto do versículo na versão da Bíblia escolhida no Perfil.
  useEffect(() => {
    if (!verse) return;
    let alive = true;
    setText(null);
    setTextError(false);
    fetchPassage(apiRefFor(verse), bibleVersion)
      .then((t) => alive && setText(stripVerseNumbers(t)))
      .catch(() => alive && setTextError(true));
    return () => {
      alive = false;
    };
  }, [verse, bibleVersion]);

  // Realtime: curtidas/comentários de outros discípulos aparecem sem F5.
  useEffect(() => {
    const channel = supabase
      .channel(`daily-verse-${dateKey}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "daily_verse_likes",
          filter: `verse_date=eq.${dateKey}`,
        },
        () => void refreshCounts(),
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "daily_verse_shares",
          filter: `verse_date=eq.${dateKey}`,
        },
        () => void refreshCounts(),
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "daily_verse_comments",
          filter: `verse_date=eq.${dateKey}`,
        },
        () => void refreshComments(),
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateKey]);

  const refreshCounts = async () => {
    const c = await getCounts(dateKey, me?.id ?? null);
    setLiked(c.liked);
    setLikeCount(c.likeCount);
    setShareCount(c.shareCount);
  };

  const refreshComments = async () => {
    const list = await listComments(dateKey);
    setComments(list);
    const { counts, mine } = await loadCommentLikes(
      list.map((c) => c.id),
      me?.id ?? null,
    );
    setCommentLikeCounts(counts);
    setMyCommentLikes(mine);
  };

  const onToggleLike = async () => {
    if (!me) return;
    const next = !liked;
    setLiked(next);
    setLikeCount((n) => Math.max(0, n + (next ? 1 : -1)));
    await toggleVerseLike(dateKey, me.id, !next);
  };

  const onToggleCommentLike = async (commentId: string) => {
    if (!me) return;
    const has = myCommentLikes.has(commentId);
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
    await toggleCommentLike(commentId, me.id, has);
  };

  const onSendComment = async () => {
    const body = commentDraft.trim();
    if ((!body && !pendingGif) || !me || sendingComment) return;
    setSendingComment(true);
    const ok = await addComment({
      verseDate: dateKey,
      userId: me.id,
      authorName: me.name,
      authorAvatarUrl: me.avatarUrl,
      body,
      gifUrl: pendingGif,
    });
    setSendingComment(false);
    if (ok) {
      setCommentDraft("");
      setPendingGif(null);
      await refreshComments();
    }
  };

  const onShare = async () => {
    if (!verse || !text || sharing) return;
    setSharing(true);
    try {
      const blob = await generateShareImage({
        title: verse.ref_label,
        bodyText: text,
        backgroundSrc: "/share-bg-cross.jpg",
      });
      const file = new File([blob], "versiculo-do-dia.jpg", { type: "image/jpeg" });
      const nav = navigator as Navigator & {
        canShare?: (data?: ShareData) => boolean;
        share?: (data: ShareData) => Promise<void>;
      };

      if (me) {
        await recordVerseShare(dateKey, me.id);
        setShareCount((n) => n + 1);
      }

      if (nav.share && nav.canShare?.({ files: [file] })) {
        try {
          await nav.share({ files: [file], title: verse.ref_label });
          return;
        } catch (err) {
          if (err instanceof DOMException && err.name === "AbortError") return;
        }
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "versiculo-do-dia.jpg";
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
      toast.success("Imagem salva! Agora é só compartilhar onde quiser.");
    } catch (err) {
      console.error("Erro ao compartilhar versículo:", err);
      toast.error("Não foi possível preparar o compartilhamento. Tente novamente.");
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-5 px-4 pb-24 pt-6">
      <header className="flex items-center justify-between gap-3">
        <Link
          to="/home"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-surface-2"
          aria-label="Voltar"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-lg font-semibold">Versículo do dia</h1>
        <ThemeToggle />
      </header>

      {!verse ? (
        <div className="card-elevated flex items-center justify-center p-10">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-primary/15 via-primary-glow/5 to-transparent p-6 backdrop-blur-md">
            <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
            <span className="relative inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
              <Sparkles className="h-3 w-3" /> Palavra para hoje
            </span>

            {textError ? (
              <p className="relative mt-4 text-sm text-muted-foreground">
                Não foi possível carregar o texto agora. Tente novamente em instantes.
              </p>
            ) : (
              <p className="scripture relative mt-4 text-lg leading-relaxed text-foreground">
                {text ? `"${text}"` : "Carregando…"}
              </p>
            )}

            <p className="relative mt-4 text-right text-sm font-semibold text-primary">
              — {verse.ref_label}
            </p>
          </section>

          <div className="flex items-center gap-2 rounded-2xl border border-border bg-surface p-1.5">
            <button
              onClick={() => void onToggleLike()}
              className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-medium transition-all ${
                liked ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-surface-2"
              }`}
            >
              <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
              Curtir{likeCount > 0 && <span className="font-semibold">({likeCount})</span>}
            </button>
            <div className="h-4 w-px bg-border" />
            <a
              href="#comentarios"
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-medium text-muted-foreground transition-all hover:bg-surface-2"
            >
              <MessageCircle className="h-4 w-4" />
              Comentar
              {comments.length > 0 && <span className="font-semibold">({comments.length})</span>}
            </a>
            <div className="h-4 w-px bg-border" />
            <button
              onClick={() => void onShare()}
              disabled={sharing || !text}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-medium text-muted-foreground transition-all hover:bg-surface-2 disabled:opacity-50"
            >
              {sharing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Share2 className="h-4 w-4" />
              )}
              Compartilhar{shareCount > 0 && <span className="font-semibold">({shareCount})</span>}
            </button>
          </div>

          <Link
            to="/biblia/estudo/$book/$chapter/$verse"
            params={{
              book: String(verse.book),
              chapter: String(verse.chapter),
              verse: String(verse.verse_start),
            }}
            className="flex items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary-glow"
          >
            <BookOpen className="h-4 w-4" />
            Ir para a passagem na Bíblia de Estudos
          </Link>

          <section id="comentarios" className="space-y-3 scroll-mt-6">
            <h2 className="text-sm font-semibold text-muted-foreground">
              Comentários {comments.length > 0 && `(${comments.length})`}
            </h2>

            {comments.length === 0 && (
              <p className="rounded-2xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                Seja o primeiro a comentar sobre este versículo.
              </p>
            )}

            <div className="space-y-3">
              {comments.map((c) => {
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
                          onClick={() => void onToggleCommentLike(c.id)}
                          className={`inline-flex items-center gap-1 text-[10px] font-medium transition-colors ${
                            commentLiked
                              ? "text-primary"
                              : "text-muted-foreground hover:text-primary"
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
            </div>

            <div className="space-y-1.5 border-t border-border pt-3">
              {pendingGif && (
                <div className="relative inline-block">
                  <img src={pendingGif} alt="GIF selecionado" className="max-h-28 rounded-lg" />
                  <button
                    onClick={() => setPendingGif(null)}
                    aria-label="Remover GIF"
                    className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-background text-foreground shadow ring-1 ring-border"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <GifPicker onSelect={(url) => setPendingGif(url)} />
                <EmojiPicker
                  onSelect={(emoji) => setCommentDraft((t) => t + emoji)}
                  className="[&>button]:h-8 [&>button]:w-8"
                />
                <input
                  value={commentDraft}
                  onChange={(e) => setCommentDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") void onSendComment();
                  }}
                  placeholder="Escreva um comentário…"
                  className="min-w-0 flex-1 rounded-full border border-border bg-input px-3 py-2 text-xs outline-none focus:border-primary"
                />
                <button
                  onClick={() => void onSendComment()}
                  disabled={(!commentDraft.trim() && !pendingGif) || sendingComment}
                  aria-label="Enviar comentário"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50"
                >
                  {sendingComment ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
