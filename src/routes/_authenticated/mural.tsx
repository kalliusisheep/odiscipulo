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
  ChevronDown,
  GraduationCap,
  Heart,
  ImageIcon,
  Loader2,
  MessageCircle,
  MessageSquare,
  Pencil,
  Send,
  Trash2,
  Trophy,
  Users,
  X,
  HeartHandshake,
  ScrollText,
  Radio,
  Sparkles,
  Mic2,
  LockKeyhole,
  Quote,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/mural")({
  component: MuralPage,
});

type Tab = "feed" | "oracoes" | "diario";

const TAB_META: Record<
  Tab,
  {
    label: string;
    eyebrow: string;
    title: string;
    description: string;
    icon: React.ElementType;
  }
> = {
  feed: {
    label: "Feed",
    eyebrow: "Comunidade viva",
    title: "Caminhe junto",
    description: "Compartilhe sua jornada e celebre cada passo de fé.",
    icon: Radio,
  },
  oracoes: {
    label: "Orações",
    eyebrow: "Mural de oração",
    title: "Ore em comunidade",
    description: "Divida seus pedidos e sustente outras pessoas em oração.",
    icon: HeartHandshake,
  },
  diario: {
    label: "Meu Diário",
    eyebrow: "Espaço pessoal",
    title: "Guarde o que Deus falou",
    description: "Releia respostas e perceba seu crescimento ao longo da jornada.",
    icon: ScrollText,
  },
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
  const active = TAB_META[tab];
  const ActiveIcon = active.icon;

  return (
    <div className="mx-auto max-w-lg space-y-5 px-3 pt-5 sm:px-4">
      <header className="flex items-center justify-between gap-3 px-1">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
            <Users className="h-3.5 w-3.5" /> Comunidade
          </div>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight">{active.label}</h1>
          <p className="text-xs text-muted-foreground">Fé compartilhada fortalece a caminhada</p>
        </div>
        <ThemeToggle />
      </header>

      <section className="relative isolate min-h-[164px] overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-br from-[#2b3364] via-[#1b2344] to-[#101624] text-white shadow-2xl shadow-primary/10">
        <div className="pointer-events-none absolute -left-14 -top-20 h-48 w-48 rounded-full bg-primary/25 blur-3xl" />
        <img
          key={tab}
          src={TAB_BANNERS[tab].src}
          alt={TAB_BANNERS[tab].alt}
          className="pointer-events-none absolute inset-y-0 right-0 h-full w-[62%] object-cover object-center opacity-90 animate-fade-in"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#161d36] via-[#161d36]/90 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
        <div className="relative flex min-h-[164px] max-w-[64%] flex-col justify-center px-5 py-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-[14px] border border-white/10 bg-white/10 text-primary-foreground backdrop-blur-sm">
            <ActiveIcon className="h-[18px] w-[18px]" />
          </span>
          <p className="mt-3 text-[9px] font-extrabold uppercase tracking-[0.18em] text-primary-foreground/75">
            {active.eyebrow}
          </p>
          <h2 className="mt-1 text-lg font-extrabold leading-tight">{active.title}</h2>
          <p className="mt-1.5 text-[11px] leading-relaxed text-white/60">{active.description}</p>
        </div>
      </section>

      <nav
        className="grid grid-cols-3 gap-1 rounded-[22px] border border-border/70 bg-surface p-1.5 shadow-sm"
        aria-label="Áreas da comunidade"
      >
        {(Object.keys(TAB_META) as Tab[]).map((key) => {
          const item = TAB_META[key];
          const Icon = item.icon;
          const selected = tab === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              aria-selected={selected}
              className={`flex min-h-12 items-center justify-center gap-1.5 rounded-[17px] px-2 text-[11px] font-bold transition-all duration-200 ${
                selected
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div key={tab} className="animate-slide-up pb-6">
        {tab === "feed" && <Feed />}
        {tab === "oracoes" && <Oracoes />}
        {tab === "diario" && <Diario />}
      </div>
    </div>
  );
}

// ============================================================
// SKELETON — usado no Feed e nas Orações enquanto carrega
// ============================================================

function CardSkeleton() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="animate-pulse rounded-[26px] border border-border/60 bg-surface p-4"
        >
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-[15px] bg-surface-2" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-1/3 rounded-full bg-surface-2" />
              <div className="h-2.5 w-1/4 rounded-full bg-surface-2" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-2.5 w-full rounded-full bg-surface-2" />
            <div className="h-2.5 w-4/5 rounded-full bg-surface-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="relative flex flex-col items-center overflow-hidden rounded-[26px] border border-dashed border-primary/25 bg-primary/[0.035] px-6 py-12 text-center">
      <div className="pointer-events-none absolute -top-12 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
      <span className="relative flex h-14 w-14 items-center justify-center rounded-[20px] bg-primary/10 text-primary ring-1 ring-primary/15">
        <Icon className="h-6 w-6" />
      </span>
      <h3 className="relative mt-4 font-extrabold">{title}</h3>
      <p className="relative mt-1 max-w-[280px] text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function Avatar({
  name,
  url,
  size = "md",
  ring,
}: {
  name: string;
  url?: string | null;
  size?: "sm" | "md";
  ring?: string;
}) {
  const dims = size === "sm" ? "h-8 w-8 text-xs rounded-[11px]" : "h-11 w-11 text-sm rounded-[15px]";
  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden bg-primary/15 font-extrabold text-primary ${dims} ${
        ring ?? "ring-1 ring-primary/15"
      }`}
    >
      {url ? (
        <img src={url} alt={name} className="h-full w-full object-cover" />
      ) : (
        (name?.[0] ?? "?").toUpperCase()
      )}
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

// Cor sólida usada no "pingo" da linha do tempo e no fio que conecta
// marcos consecutivos do mesmo dia — é a assinatura visual do Feed.
const FEED_KIND_DOT: Record<FeedKind, string> = {
  post: "bg-primary",
  lesson_completed: "bg-success",
  module_completed: "bg-streak",
  reading_plan_started: "bg-ancient",
  bible_study_started: "bg-ancient",
  avatar_changed: "bg-accent-foreground/70",
  bio_changed: "bg-accent-foreground/70",
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

function lowerFirst(text: string) {
  return text ? text.charAt(0).toLocaleLowerCase("pt-BR") + text.slice(1) : text;
}

// Eventos automáticos já vêm com uma frase pronta do backend ("Terminou a
// trilha…"). Aqui só ajustamos para caber depois do nome, em uma linha só.
function milestoneText(item: FeedItem) {
  if (item.kind === "avatar_changed") return "atualizou a foto de perfil";
  if (item.kind === "bio_changed") return `atualizou a bio para “${item.body}”`;
  return lowerFirst(item.body);
}

function dayLabel(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const startOf = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diffDays = Math.round((startOf(now) - startOf(d)) / 86_400_000);
  if (diffDays === 0) return "Hoje";
  if (diffDays === 1) return "Ontem";
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

function DayDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 px-1 py-1">
      <span className="h-px flex-1 bg-border/60" />
      <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </span>
      <span className="h-px flex-1 bg-border/60" />
    </div>
  );
}

type ActionsHandlers = {
  liked: boolean;
  likeCount: number;
  commentCount: number;
  onToggleLike: () => void;
  onToggleComments: () => void;
};

function FullActions({ liked, likeCount, commentCount, onToggleLike, onToggleComments, commentsOpen }: ActionsHandlers & { commentsOpen: boolean }) {
  return (
    <div className="flex items-center gap-1 border-t border-border/50 pt-3">
      <button
        type="button"
        onClick={onToggleLike}
        className={`inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 text-xs font-bold transition-all ${
          liked
            ? "bg-destructive/10 text-destructive"
            : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"
        }`}
      >
        <Heart className={`h-4 w-4 transition-transform ${liked ? "scale-110 fill-destructive" : ""}`} />
        {likeCount > 0 && likeCount}
      </button>
      <button
        type="button"
        onClick={onToggleComments}
        className="inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 text-xs font-bold text-muted-foreground transition-all hover:bg-surface-2 hover:text-foreground"
      >
        <MessageCircle className="h-4 w-4" />
        {commentCount > 0 && commentCount}
      </button>
      <ChevronDown
        onClick={onToggleComments}
        className={`ml-auto h-4 w-4 cursor-pointer text-muted-foreground transition-transform duration-300 ${
          commentsOpen ? "rotate-180" : ""
        }`}
      />
    </div>
  );
}

function CompactActions({ liked, likeCount, commentCount, onToggleLike, onToggleComments }: ActionsHandlers) {
  return (
    <div className="mt-1 flex items-center gap-3.5">
      <button
        type="button"
        onClick={onToggleLike}
        className={`inline-flex items-center gap-1 text-[11px] font-bold transition-colors ${
          liked ? "text-destructive" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Heart className={`h-3.5 w-3.5 transition-transform ${liked ? "scale-110 fill-destructive" : ""}`} />
        {likeCount > 0 && likeCount}
      </button>
      <button
        type="button"
        onClick={onToggleComments}
        className="inline-flex items-center gap-1 text-[11px] font-bold text-muted-foreground transition-colors hover:text-foreground"
      >
        <MessageCircle className="h-3.5 w-3.5" />
        {commentCount > 0 && commentCount}
      </button>
    </div>
  );
}

function CommentsPanel({
  open,
  loading,
  list,
  draft,
  pendingGif,
  sending,
  commentLikeCounts,
  myCommentLikes,
  onDraftChange,
  onGifSelect,
  onGifClear,
  onSend,
  onToggleCommentLike,
}: {
  open: boolean;
  loading: boolean;
  list: FeedComment[];
  draft: string;
  pendingGif: string | null;
  sending: boolean;
  commentLikeCounts: Record<string, number>;
  myCommentLikes: Set<string>;
  onDraftChange: (text: string) => void;
  onGifSelect: (url: string) => void;
  onGifClear: () => void;
  onSend: () => void;
  onToggleCommentLike: (commentId: string) => void;
}) {
  return (
    <div
      className={`grid transition-[grid-template-rows] duration-300 ease-out ${
        open ? "mt-3 grid-rows-[1fr]" : "grid-rows-[0fr]"
      }`}
    >
      <div className="overflow-hidden">
        <div className="space-y-3 border-t border-border/50 pt-3">
          {loading && (
            <div className="flex items-center gap-2 py-2 text-xs text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Carregando comentários…
            </div>
          )}

          {!loading && list.length === 0 && (
            <p className="py-1 text-xs text-muted-foreground">Seja o primeiro a comentar.</p>
          )}

          {list.map((c) => (
            <div key={c.id} className="flex items-start gap-2.5">
              <Avatar name={c.author_name} url={c.author_avatar_url} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="rounded-[16px] bg-surface-2/70 px-3 py-2">
                  <p className="text-xs font-extrabold">{c.author_name}</p>
                  {c.body && (
                    <p className="mt-0.5 text-sm leading-relaxed text-foreground/90">{c.body}</p>
                  )}
                  {c.gif_url && (
                    <img
                      src={c.gif_url}
                      alt="GIF"
                      className="mt-1.5 max-h-40 rounded-[12px] object-cover"
                    />
                  )}
                </div>
                <div className="mt-1 flex items-center gap-2.5 px-1">
                  <span className="text-[10px] text-muted-foreground">
                    {formatDistanceToNow(new Date(c.created_at), { locale: ptBR, addSuffix: true })}
                  </span>
                  <button
                    type="button"
                    onClick={() => onToggleCommentLike(c.id)}
                    className={`inline-flex items-center gap-1 text-[10px] font-bold transition-colors ${
                      myCommentLikes.has(c.id) ? "text-destructive" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Heart className={`h-3 w-3 ${myCommentLikes.has(c.id) ? "fill-destructive" : ""}`} />
                    {(commentLikeCounts[c.id] ?? 0) > 0 && commentLikeCounts[c.id]}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {pendingGif && (
            <div className="relative inline-block">
              <img src={pendingGif} alt="GIF selecionado" className="max-h-28 rounded-[12px]" />
              <button
                type="button"
                onClick={onGifClear}
                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-background shadow"
                aria-label="Remover GIF"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 pt-1">
            <input
              value={draft}
              onChange={(e) => onDraftChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSend();
                }
              }}
              placeholder="Escreva um comentário…"
              className="min-h-9 flex-1 rounded-full border border-border/70 bg-background/70 px-3.5 text-xs outline-none transition-all placeholder:text-muted-foreground focus:border-primary/60 focus:ring-4 focus:ring-primary/10"
            />
            <GifPicker onSelect={onGifSelect} />
            <button
              type="button"
              onClick={onSend}
              disabled={(!draft.trim() && !pendingGif) || sending}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-primary-glow disabled:opacity-40"
              aria-label="Enviar comentário"
            >
              {sending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

type CardCommonProps = {
  item: FeedItem;
  liked: boolean;
  likeCount: number;
  commentCount: number;
  commentsOpen: boolean;
  commentsLoading: boolean;
  commentsList: FeedComment[];
  commentDraft: string;
  pendingGif: string | null;
  sending: boolean;
  commentLikeCounts: Record<string, number>;
  myCommentLikes: Set<string>;
  onToggleLike: () => void;
  onToggleComments: () => void;
  onDraftChange: (text: string) => void;
  onGifSelect: (url: string) => void;
  onGifClear: () => void;
  onSendComment: () => void;
  onToggleCommentLike: (commentId: string) => void;
};

// Card cheio — reservado para publicações reais das pessoas.
function PostCard(props: CardCommonProps) {
  const { item } = props;
  return (
    <article className="animate-fade-in overflow-hidden rounded-[26px] border border-border/70 bg-surface shadow-sm transition-all hover:border-primary/20 hover:shadow-lg">
      <div className="p-4">
        <header className="flex items-center gap-3">
          <Avatar name={item.author_name} url={item.author_avatar_url} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-extrabold">{item.author_name}</p>
            <p className="text-[10px] text-muted-foreground">
              {formatDistanceToNow(new Date(item.created_at), { locale: ptBR, addSuffix: true })}
            </p>
          </div>
        </header>

        {item.body && (
          <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed text-foreground/95">
            {item.body}
          </p>
        )}

        <div className="mt-3.5">
          <FullActions
            liked={props.liked}
            likeCount={props.likeCount}
            commentCount={props.commentCount}
            commentsOpen={props.commentsOpen}
            onToggleLike={props.onToggleLike}
            onToggleComments={props.onToggleComments}
          />
        </div>

        <CommentsPanel
          open={props.commentsOpen}
          loading={props.commentsLoading}
          list={props.commentsList}
          draft={props.commentDraft}
          pendingGif={props.pendingGif}
          sending={props.sending}
          commentLikeCounts={props.commentLikeCounts}
          myCommentLikes={props.myCommentLikes}
          onDraftChange={props.onDraftChange}
          onGifSelect={props.onGifSelect}
          onGifClear={props.onGifClear}
          onSend={props.onSendComment}
          onToggleCommentLike={props.onToggleCommentLike}
        />
      </div>
    </article>
  );
}

// Linha compacta — reservada para eventos automáticos (lição concluída,
// módulo, plano de leitura...). Vários marcos do mesmo dia se conectam
// por um fio vertical, como pontos de uma trilha.
function MilestoneItem(props: CardCommonProps & { connectTop: boolean; connectBottom: boolean }) {
  const { item, connectTop, connectBottom } = props;
  const Icon = FEED_KIND_ICON[item.kind];

  return (
    <div className="animate-fade-in relative flex gap-3 rounded-[20px] px-2 py-2 transition-colors hover:bg-surface-2/50">
      {(connectTop || connectBottom) && (
        <span
          className={`absolute left-[23px] w-px bg-border/70 ${connectTop ? "top-0" : "top-1/2"} ${
            connectBottom ? "bottom-0" : "bottom-1/2"
          }`}
        />
      )}
      <div className="relative z-10 shrink-0">
        <Avatar name={item.author_name} url={item.author_avatar_url} size="sm" ring="ring-2 ring-background" />
        <span
          className={`absolute -bottom-1 -right-1 flex h-[18px] w-[18px] items-center justify-center rounded-full text-white ring-2 ring-background ${FEED_KIND_DOT[item.kind]}`}
          aria-label={FEED_KIND_LABEL[item.kind]}
        >
          <Icon className="h-[10px] w-[10px]" />
        </span>
      </div>
      <div className="min-w-0 flex-1 pb-0.5 pt-0.5">
        <p className="text-[13px] leading-snug text-foreground/90">
          <span className="font-extrabold">{item.author_name}</span> {milestoneText(item)}
        </p>
        <div className="mt-0.5 flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground">
            {formatDistanceToNow(new Date(item.created_at), { locale: ptBR, addSuffix: true })}
          </span>
          <CompactActions
            liked={props.liked}
            likeCount={props.likeCount}
            commentCount={props.commentCount}
            onToggleLike={props.onToggleLike}
            onToggleComments={props.onToggleComments}
          />
        </div>
        <CommentsPanel
          open={props.commentsOpen}
          loading={props.commentsLoading}
          list={props.commentsList}
          draft={props.commentDraft}
          pendingGif={props.pendingGif}
          sending={props.sending}
          commentLikeCounts={props.commentLikeCounts}
          myCommentLikes={props.myCommentLikes}
          onDraftChange={props.onDraftChange}
          onGifSelect={props.onGifSelect}
          onGifClear={props.onGifClear}
          onSend={props.onSendComment}
          onToggleCommentLike={props.onToggleCommentLike}
        />
      </div>
    </div>
  );
}

function Feed() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [myLikes, setMyLikes] = useState<Set<string>>(new Set());
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
  const [openComments, setOpenComments] = useState<Set<string>>(new Set());
  const [comments, setComments] = useState<Record<string, FeedComment[]>>({});
  const [commentsLoading, setCommentsLoading] = useState<Set<string>>(new Set());
  const [commentDraft, setCommentDraft] = useState<Record<string, string>>({});
  const [pendingGif, setPendingGif] = useState<Record<string, string | null>>({});
  const [sendingComment, setSendingComment] = useState<Set<string>>(new Set());
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
    setLoading(false);

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
    setMyLikes((prev) => {
      const next = new Set(prev);
      if (has) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
    setLikeCounts((prev) => ({ ...prev, [itemId]: Math.max(0, (prev[itemId] ?? 0) + (has ? -1 : 1)) }));
    if (has) {
      await supabase.from("feed_likes").delete().eq("item_id", itemId).eq("user_id", me.id);
    } else {
      await supabase.from("feed_likes").insert({ item_id: itemId, user_id: me.id });
    }
  };

  const toggleComments = async (itemId: string) => {
    setOpenComments((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
    if (!comments[itemId]) {
      setCommentsLoading((prev) => new Set(prev).add(itemId));
      const { data } = await supabase
        .from("feed_comments")
        .select("*")
        .eq("item_id", itemId)
        .order("created_at", { ascending: true });
      const list = (data ?? []) as FeedComment[];
      setComments((prev) => ({ ...prev, [itemId]: list }));
      setCommentsLoading((prev) => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
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
    setSendingComment((prev) => new Set(prev).add(itemId));
    const { error } = await supabase.from("feed_comments").insert({
      item_id: itemId,
      user_id: me.id,
      author_name: me.name,
      author_avatar_url: me.avatarUrl,
      body: text,
      gif_url: gifUrl,
    });
    setSendingComment((prev) => {
      const next = new Set(prev);
      next.delete(itemId);
      return next;
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

  // Agrupa por dia ("Hoje", "Ontem"…) mantendo a ordem que já vem do
  // Supabase (mais recente primeiro), sem precisar reordenar nada.
  const groups = useMemo(() => {
    const out: { label: string; items: FeedItem[] }[] = [];
    for (const item of items) {
      const label = dayLabel(item.created_at);
      const last = out[out.length - 1];
      if (last && last.label === label) last.items.push(item);
      else out.push({ label, items: [item] });
    }
    return out;
  }, [items]);

  return (
    <div className="space-y-5">
      <section className="group relative overflow-hidden rounded-[26px] border border-border/70 bg-gradient-to-br from-surface via-surface to-primary/[0.06] shadow-lg shadow-black/5 transition-all focus-within:border-primary/50 focus-within:shadow-primary/10">
        <div className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-primary/10 blur-3xl transition-opacity group-focus-within:opacity-70" />
        <div className="relative p-4">
          <div className="mb-3 flex items-center gap-3">
            <Avatar name={me?.name ?? "?"} url={me?.avatarUrl} ring="ring-2 ring-primary/20" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-extrabold">Compartilhe sua caminhada</p>
              <p className="text-[10px] text-muted-foreground">
                Uma reflexão, conquista ou motivo de gratidão
              </p>
            </div>
            <Sparkles className="h-4 w-4 shrink-0 text-primary/60" />
          </div>
          <textarea
            value={composerText}
            onChange={(e) => setComposerText(e.target.value)}
            rows={3}
            maxLength={600}
            placeholder="O que você gostaria de compartilhar hoje?"
            className="w-full resize-none rounded-[18px] border border-border/70 bg-background/70 p-3.5 text-sm leading-relaxed outline-none transition-all placeholder:text-muted-foreground focus:border-primary/60 focus:ring-4 focus:ring-primary/10"
          />
          <div className="mt-2.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <EmojiPicker onSelect={insertComposerEmoji} />
              <span className="hidden text-[10px] text-muted-foreground min-[390px]:inline">
                Adicione uma reação
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              {composerText.length > 0 && (
                <span
                  className={`text-[10px] font-bold tabular-nums ${
                    composerText.length > 560 ? "text-destructive" : "text-muted-foreground"
                  }`}
                >
                  {composerText.length}/600
                </span>
              )}
              <button
                type="button"
                onClick={() => void publish()}
                disabled={!composerText.trim() || posting}
                className="inline-flex min-h-10 items-center gap-2 rounded-full bg-primary px-5 text-xs font-extrabold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary-glow disabled:translate-y-0 disabled:opacity-50 disabled:shadow-none"
              >
                {posting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <>
                    Publicar <Send className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="flex items-end justify-between gap-3 px-1">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-primary">
            Agora na comunidade
          </p>
          <h3 className="mt-0.5 text-base font-extrabold">Últimas atividades</h3>
        </div>
        {items.length > 0 && (
          <span className="rounded-full bg-surface-2 px-2.5 py-1 text-[10px] font-bold text-muted-foreground">
            {items.length} {items.length === 1 ? "registro" : "registros"}
          </span>
        )}
      </div>

      {loading && <CardSkeleton />}

      {!loading && items.length === 0 && (
        <EmptyState
          icon={Users}
          title="Sua comunidade está começando"
          description="Adicione amigos e continue estudando. As conquistas de vocês aparecerão aqui."
        />
      )}

      {groups.map((group) => (
        <div key={group.label} className="space-y-2.5">
          <DayDivider label={group.label} />
          {group.items.map((item, index) => {
            const shared: CardCommonProps = {
              item,
              liked: myLikes.has(item.id),
              likeCount: likeCounts[item.id] ?? 0,
              commentCount: commentCounts[item.id] ?? 0,
              commentsOpen: openComments.has(item.id),
              commentsLoading: commentsLoading.has(item.id),
              commentsList: comments[item.id] ?? [],
              commentDraft: commentDraft[item.id] ?? "",
              pendingGif: pendingGif[item.id] ?? null,
              sending: sendingComment.has(item.id),
              commentLikeCounts,
              myCommentLikes,
              onToggleLike: () => void toggleLike(item.id),
              onToggleComments: () => void toggleComments(item.id),
              onDraftChange: (text) => setCommentDraft((prev) => ({ ...prev, [item.id]: text })),
              onGifSelect: (url) => setPendingGif((prev) => ({ ...prev, [item.id]: url })),
              onGifClear: () => setPendingGif((prev) => ({ ...prev, [item.id]: null })),
              onSendComment: () => void sendComment(item.id),
              onToggleCommentLike: (commentId) => void toggleCommentLike(commentId),
            };

            if (item.kind === "post") {
              return <PostCard key={item.id} {...shared} />;
            }

            const prev = group.items[index - 1];
            const next = group.items[index + 1];
            return (
              <MilestoneItem
                key={item.id}
                {...shared}
                connectTop={!!prev && prev.kind !== "post"}
                connectBottom={!!next && next.kind !== "post"}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ============================================================
// ORAÇÕES — mural de clamores/pedidos de oração
// ============================================================

type Post = {
  id: string;
  user_id: string;
  author_name: string;
  body: string | null;
  audio_url: string | null;
  audio_duration_seconds: number | null;
  is_answered: boolean;
  amens_seed: number;
  created_at: string;
};

function Oracoes() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
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
    setLoading(false);
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
    setMyAmens((prev) => {
      const next = new Set(prev);
      if (has) next.delete(postId);
      else next.add(postId);
      return next;
    });
    setCounts((prev) => ({ ...prev, [postId]: Math.max(0, (prev[postId] ?? 0) + (has ? -1 : 1)) }));
    if (has) {
      await supabase.from("mural_amens").delete().eq("post_id", postId).eq("user_id", me.id);
    } else {
      await supabase.from("mural_amens").insert({ post_id: postId, user_id: me.id });
    }
  };

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-[26px] border border-primary/20 bg-gradient-to-br from-primary/[0.12] via-surface to-surface shadow-lg shadow-primary/5">
        <div className="pointer-events-none absolute -right-12 -top-14 h-36 w-36 rounded-full bg-primary/15 blur-3xl" />
        <div className="relative p-4">
          <div className="mb-3 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-primary/15 text-primary ring-1 ring-primary/15">
              <HeartHandshake className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-extrabold">Compartilhe seu clamor</p>
              <p className="text-[10px] text-muted-foreground">A comunidade pode orar com você</p>
            </div>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            maxLength={600}
            placeholder="Como podemos orar por você hoje?"
            className="w-full resize-none rounded-[18px] border border-border/70 bg-background/70 p-3.5 text-sm leading-relaxed outline-none transition-all placeholder:text-muted-foreground focus:border-primary/60 focus:ring-4 focus:ring-primary/10"
          />
          <div className="mt-2.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <VoiceRecorder onSend={clamarComAudio} maxSeconds={60} />
              <span className="hidden items-center gap-1 text-[10px] text-muted-foreground min-[390px]:flex">
                <Mic2 className="h-3 w-3" /> ou envie por voz
              </span>
            </div>
            <button
              type="button"
              onClick={() => void clamar()}
              disabled={!text.trim() || posting}
              className="inline-flex min-h-10 items-center gap-2 rounded-full bg-primary px-5 text-xs font-extrabold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary-glow disabled:translate-y-0 disabled:opacity-50 disabled:shadow-none"
            >
              {posting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <>
                  Pedir oração <Send className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      <div className="flex items-end justify-between gap-3 px-1">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-primary">
            Ore com alguém
          </p>
          <h3 className="mt-0.5 text-base font-extrabold">Pedidos da comunidade</h3>
        </div>
        {posts.length > 0 && (
          <span className="rounded-full bg-surface-2 px-2.5 py-1 text-[10px] font-bold text-muted-foreground">
            {posts.length} {posts.length === 1 ? "pedido" : "pedidos"}
          </span>
        )}
      </div>

      {loading && <CardSkeleton />}

      {!loading && posts.length === 0 && (
        <EmptyState
          icon={HeartHandshake}
          title="Nenhum pedido por aqui ainda"
          description="Quando alguém compartilhar um clamor, você poderá apoiar com sua oração."
        />
      )}

      {posts.map((p) => (
        <article
          key={p.id}
          className="relative overflow-hidden rounded-[26px] border border-border/70 bg-surface p-4 shadow-sm transition-all hover:border-primary/20 hover:shadow-lg"
        >
          <Quote className="pointer-events-none absolute -right-1 top-2 h-16 w-16 text-primary/[0.045]" />
          <header className="relative flex items-center gap-3">
            <Avatar name={p.author_name} />
            <div className="flex-1">
              <p className="text-sm font-extrabold">{p.author_name}</p>
              <p className="text-[11px] text-muted-foreground">
                {formatDistanceToNow(new Date(p.created_at), { locale: ptBR, addSuffix: true })}
              </p>
            </div>
            {p.is_answered && (
              <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 text-[9px] font-extrabold text-success ring-1 ring-success/15">
                <CheckCircle2 className="h-3 w-3" /> Respondido
              </span>
            )}
          </header>
          {p.audio_url ? (
            <div className="relative mt-4 rounded-[18px] bg-surface-2/60 p-2 ring-1 ring-border/50">
              <VoiceNotePlayer src={p.audio_url} />
            </div>
          ) : (
            p.body && (
              <p className="relative mt-4 text-[15px] leading-relaxed text-foreground/95">
                {p.body}
              </p>
            )
          )}
          <button
            type="button"
            onClick={() => void toggleAmen(p.id)}
            className={`mt-4 inline-flex min-h-10 items-center gap-2 rounded-[15px] border px-4 text-xs font-bold transition-all ${
              myAmens.has(p.id)
                ? "border-primary/30 bg-primary/15 text-primary shadow-sm"
                : "border-border/70 bg-background/60 text-muted-foreground hover:border-primary/30 hover:text-primary"
            }`}
          >
            <HeartHandshake className={`h-4 w-4 transition-transform ${myAmens.has(p.id) ? "scale-110" : ""}`} />{" "}
            Amém
            <span className="font-extrabold">{counts[p.id] ?? 0}</span>
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
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
    setDeletingId(id);
    const { error } = await supabase.from("diary_entries").delete().eq("id", id);
    setDeletingId(null);
    if (!error) {
      setEntries((prev) => prev.filter((e) => e.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="h-24 animate-pulse rounded-[26px] bg-surface-2/70" />
        <div className="h-48 animate-pulse rounded-[26px] bg-surface-2/70" />
        <div className="h-40 animate-pulse rounded-[26px] bg-surface-2/70" />
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <EmptyState
        icon={BookHeart}
        title="Seu diário está aguardando"
        description="Complete uma lição — sua resposta de reflexão será salva aqui automaticamente."
      />
    );
  }

  return (
    <div className="space-y-4">
      <section className="relative overflow-hidden rounded-[26px] border border-border/70 bg-gradient-to-br from-primary/[0.1] via-surface to-surface p-4 shadow-sm">
        <div className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-[17px] bg-primary/15 text-primary ring-1 ring-primary/15">
            <LockKeyhole className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-extrabold">Seu caderno de caminhada</p>
            <p className="mt-0.5 text-[10px] leading-relaxed text-muted-foreground">
              Um espaço pessoal para rever aprendizados e perceber seu crescimento.
            </p>
          </div>
          <span className="flex h-9 min-w-9 items-center justify-center rounded-full bg-primary/10 px-2 text-xs font-extrabold text-primary">
            {entries.length}
          </span>
        </div>
      </section>

      <div className="flex items-end justify-between gap-3 px-1">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-primary">
            Sua história
          </p>
          <h3 className="mt-0.5 text-base font-extrabold">Reflexões salvas</h3>
        </div>
      </div>

      {ordered.map(({ entry: e, meta }) => {
        const isEditing = editingId === e.id;
        const wasEdited = e.updated_at && e.updated_at !== e.created_at;
        const isDeleting = deletingId === e.id;
        return (
          <article
            key={e.id}
            className="relative overflow-hidden rounded-[26px] border border-border/70 bg-surface p-4 shadow-sm transition-all hover:border-primary/20 hover:shadow-lg"
          >
            <div className="absolute inset-y-4 left-0 w-1 rounded-r-full bg-gradient-to-b from-primary to-primary-glow" />
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[9px] font-extrabold uppercase leading-relaxed tracking-[0.14em] text-primary">
                  {meta
                    ? `Módulo ${meta.moduleOrd} · ${meta.moduleTitle} — Trilha: ${meta.trailTitle}`
                    : e.lesson_title}
                </p>
                <p className="mt-1 text-[10px] font-medium text-muted-foreground">
                  {formatDistanceToNow(new Date(e.created_at), { locale: ptBR, addSuffix: true })}
                  {wasEdited && " · editado"}
                </p>
              </div>
              {!isEditing && (
                <div className="flex shrink-0 gap-1">
                  <button
                    onClick={() => startEdit(e)}
                    className="flex h-8 w-8 items-center justify-center rounded-[11px] text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                    aria-label="Editar resposta"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => void remove(e.id)}
                    disabled={isDeleting}
                    className="flex h-8 w-8 items-center justify-center rounded-[11px] text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-40"
                    aria-label="Apagar resposta"
                  >
                    {isDeleting ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              )}
            </div>
            <div className="mt-4 flex items-start gap-2.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[10px] bg-primary/10 text-primary">
                <Quote className="h-3.5 w-3.5" />
              </span>
              <p className="pt-0.5 text-sm font-bold leading-relaxed">{e.question}</p>
            </div>
            {isEditing ? (
              <div className="mt-3 space-y-2">
                <textarea
                  value={editDraft}
                  onChange={(ev) => setEditDraft(ev.target.value)}
                  rows={4}
                  className="w-full resize-none rounded-[18px] border border-border/70 bg-background/70 p-3.5 text-sm leading-relaxed outline-none transition-all focus:border-primary/60 focus:ring-4 focus:ring-primary/10"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={cancelEdit}
                    className="min-h-9 rounded-full border border-border px-4 text-xs font-bold text-muted-foreground transition-colors hover:bg-surface-2"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => void saveEdit(e.id)}
                    disabled={saving || !editDraft.trim()}
                    className="min-h-9 rounded-full bg-primary px-4 text-xs font-extrabold text-primary-foreground shadow-sm disabled:opacity-50"
                  >
                    {saving ? "Salvando…" : "Salvar"}
                  </button>
                </div>
              </div>
            ) : (
              <p className="scripture mt-3 rounded-[18px] border border-border/50 bg-surface-2/70 p-3.5 text-base leading-relaxed text-foreground/90">
                “{e.answer}”
              </p>
            )}
          </article>
        );
      })}
    </div>
  );
}
