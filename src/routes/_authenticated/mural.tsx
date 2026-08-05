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
    description: "Compartilhe sua jornada e celebre cada passo de fÃ©.",
    icon: Radio,
  },
  oracoes: {
    label: "OraÃ§Ãµes",
    eyebrow: "Mural de oraÃ§Ã£o",
    title: "Ore em comunidade",
    description: "Divida seus pedidos e sustente outras pessoas em oraÃ§Ã£o.",
    icon: HeartHandshake,
  },
  diario: {
    label: "Meu DiÃ¡rio",
    eyebrow: "EspaÃ§o pessoal",
    title: "Guarde o que Deus falou",
    description: "Releia respostas e perceba seu crescimento ao longo da jornada.",
    icon: ScrollText,
  },
};

const TAB_BANNERS: Record<Tab, { src: string; alt: string }> = {
  feed: {
    src: "/mural-banner.png",
    alt: "Ovelha em capa azul lendo reaÃ§Ãµes no celular, sobre uma muralha",
  },
  oracoes: { src: "/oracoes-banner.png", alt: "Ovelha orando em um barco" },
  diario: { src: "/diario-banner.png", alt: "Ovelha escrevendo no diÃ¡rio encostada em uma Ã¡rvore" },
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
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight">Feed</h1>
          <p className="text-xs text-muted-foreground">FÃ© compartilhada fortalece a caminhada</p>
        </div>
        <ThemeToggle />
      </header>

      <section className="relative isolate min-h-[164px] overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-br from-[#2b3364] via-[#1b2344] to-[#101624] text-white shadow-2xl shadow-primary/10">
        <div className="pointer-events-none absolute -left-14 -top-20 h-48 w-48 rounded-full bg-primary/25 blur-3xl" />
        <img
          key={tab}
          src={TAB_BANNERS[tab].src}
          alt={TAB_BANNERS[tab].alt}
          className="pointer-events-none absolute inset-y-0 right-0 h-full w-[62%] object-cover object-center opacity-90"
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
        aria-label="Ãreas da comunidade"
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
              className={`flex min-h-12 items-center justify-center gap-1.5 rounded-[17px] px-2 text-[11px] font-bold transition-all ${
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

      <div key={tab} className="animate-slide-up">
        {tab === "feed" && <Feed />}
        {tab === "oracoes" && <Oracoes />}
        {tab === "diario" && <Diario />}
      </div>
    </div>
  );
}

// ============================================================
// FEED â€” publicaÃ§Ãµes reais dos amigos + eventos automÃ¡ticos
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

// Barra de destaque Ã  esquerda do card + rÃ³tulo do tipo de evento â€” Ã© o que
// dÃ¡ ao Feed uma identidade "linha do tempo" bem diferente do Mural de OraÃ§Ãµes.
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
  post: "PublicaÃ§Ã£o",
  lesson_completed: "LiÃ§Ã£o concluÃ­da",
  module_completed: "MÃ³dulo concluÃ­do",
  reading_plan_started: "Novo plano de leitura",
  bible_study_started: "Novo estudo bÃ­blico",
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

  // Busca curtidas dos comentÃ¡rios de um item especÃ­fico e mescla no estado
  // global (indexado por comment id, entÃ£o funciona para vÃ¡rios itens abertos).
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

      // Sem isso, posts, curtidas e comentÃ¡rios de outras pessoas sÃ³ apareciam apÃ³s F5.
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
      say("Publicado no feed! Seus amigos vÃ£o ver isso.");
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
      else nextïmw¶‰ËkºwµçA™½ÕÌéÉ¥¹œ´Ğ™½ÕÌéÉ¥¹œµÁÉ¥µ…Éä¼ÄÀˆ(€€€€€€€€€€¼ø(€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰µĞ´È¸Ô™±•à¥Ñ•µÌµ•¹Ñ•È©ÕÍÑ¥™äµ‰•Ñİ••¸…À´Èˆø(€€€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰™±•à¥Ñ•µÌµ•¹Ñ•È…À´Èˆø(€€€€€€€€€€€€€€ñY½¥•I•½É‘•È½¹M•¹õí±…µ…É½µÕ‘¥½ôµ…áM•½¹‘ÌõìØÁô€¼ø(€€€€€€€€€€€€€€ñÍÁ…¸±…ÍÍ9…µ”ô‰¡¥‘‘•¸¥Ñ•µÌµ•¹Ñ•È…À´ÄÑ•áĞµlÄÁÁátÑ•áĞµµÕÑ•µ™½É•É½Õ¹µ¥¸µlÌäÁÁáté™±•àˆø(€€€€€€€€€€€€€€€€ñ5¥ŒÈ±…ÍÍ9…µ”ô‰ ´ÌÜ´Ìˆ€¼ø½Ô•¹Ù¥”Á½ÈÙ½è(€€€€€€€€€€€€€€ğ½ÍÁ…¸ø(€€€€€€€€€€€€ğ½‘¥Øø(€€€€€€€€€€€€ñ‰ÕÑÑ½¸(€€€€€€€€€€€€€ÑåÁ”ô‰‰ÕÑÑ½¸ˆ(€€€€€€€€€€€€€½¹±¥¬õì ¤€ôøÙ½¥±…µ…È ¥ô(€€€€€€€€€€€€€‘¥Í…‰±•õì…Ñ•áĞ¹ÑÉ¥´ ¤ñğÁ½ÍÑ¥¹ô(€€€€€€€€€€€€€±…ÍÍ9…µ”ô‰¥¹±¥¹”µ™±•àµ¥¸µ ´ÄÀ¥Ñ•µÌµ•¹Ñ•È…À´ÈÉ½Õ¹‘•µ™Õ±°‰œµÁÉ¥µ…ÉäÁà´ÔÑ•áĞµáÌ™½¹Ğµ•áÑÉ…‰½±Ñ•áĞµÁÉ¥µ…Éäµ™½É•É½Õ¹Í¡…‘½Üµ±œÍ¡…‘½ÜµÁÉ¥µ…Éä¼ÈÀÑÉ…¹Í¥Ñ¥½¸µ…±°¡½Ù•ÈèµÑÉ…¹Í±…Ñ”µä´À¸Ô¡½Ù•Èé‰œµÁÉ¥µ…Éäµ±½Ü‘¥Í…‰±•éÑÉ…¹Í±…Ñ”µä´À‘¥Í…‰±•é½Á…¥Ñä´ÔÀ‘¥Í…‰±•éÍ¡…‘½Üµ¹½¹”ˆ(€€€€€€€€€€€€ø(€€€€€€€€€€€€€íÁ½ÍÑ¥¹œ€ü€‰¹Ù¥…¹‘¿Š˜ˆ€è€‰A•‘¥È½É‡Ÿ¼‰ô(€€€€€€€€€€€€€ì…Á½ÍÑ¥¹œ€˜˜€ñM•¹±…ÍÍ9…µ”ô‰ ´Ì¸ÔÜ´Ì¸Ôˆ€¼ùô(€€€€€€€€€€€€ğ½‰ÕÑÑ½¸ø(€€€€€€€€€€ğ½‘¥Øø(€€€€€€€€ğ½‘¥Øø(€€€€€€ğ½Í•Ñ¥½¸ø((€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰™±•à¥Ñ•µÌµ•¹©ÕÍÑ¥™äµ‰•Ñİ••¸…À´ÌÁà´Äˆø(€€€€€€€€ñ‘¥Øø(€€€€€€€€€€ñÀ±…ÍÍ9…µ”ô‰Ñ•áĞµlÄÁÁát™½¹Ğµ•áÑÉ…‰½±ÕÁÁ•É…Í”ÑÉ…­¥¹œµlÀ¸ÄÙ•µtÑ•áĞµÁÉ¥µ…Éäˆø(€€€€€€€€€€€=É”½´…±×¥´(€€€€€€€€€€ğ½Àø(€€€€€€€€€€ñ Ì±…ÍÍ9…µ”ô‰µĞ´À¸ÔÑ•áĞµ‰…Í”™½¹Ğµ•áÑÉ…‰½±ˆùA•‘¥‘½Ì‘„½µÕ¹¥‘…‘”ğ½ Ìø(€€€€€€€€ğ½‘¥Øø(€€€€€€€íÁ½ÍÑÌ¹±•¹Ñ €ø€À€˜˜€ (€€€€€€€€€€ñÍÁ…¸±…ÍÍ9…µ”ô‰É½Õ¹‘•µ™Õ±°‰œµÍÕÉ™…”´ÈÁà´È¸ÔÁä´ÄÑ•áĞµlÄÁÁát™½¹Ğµ‰½±Ñ•áĞµµÕÑ•µ™½É•É½Õ¹ˆø(€€€€€€€€€€€íÁ½ÍÑÌ¹±•¹Ñ¡ôíÁ½ÍÑÌ¹±•¹Ñ €ôôô€Ä€ü€‰Á•‘¥‘¼ˆ€è€‰Á•‘¥‘½Ì‰ô(€€€€€€€€€€ğ½ÍÁ…¸ø(€€€€€€€€¥ô(€€€€€€ğ½‘¥Øø((€€€€€íÁ½ÍÑÌ¹±•¹Ñ €ôôô€À€˜˜€ (€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰É•±…Ñ¥Ù”™±•à™±•àµ½°¥Ñ•µÌµ•¹Ñ•È½Ù•É™±½Üµ¡¥‘‘•¸É½Õ¹‘•µlÈÙÁát‰½É‘•È‰½É‘•Èµ‘…Í¡•‰½É‘•ÈµÁÉ¥µ…Éä¼ÈÔ‰œµÁÉ¥µ…Éä½lÀ¸ÀÌÕtÁà´ØÁä´ÄÈÑ•áĞµ•¹Ñ•Èˆø(€€€€€€€€€€ñÍÁ…¸±…ÍÍ9…µ”ô‰™±•à ´ÄĞÜ´ÄĞ¥Ñ•µÌµ•¹Ñ•È©ÕÍÑ¥™äµ•¹Ñ•ÈÉ½Õ¹‘•µlÈÁÁát‰œµÁÉ¥µ…Éä¼ÄÀÑ•áĞµÁÉ¥µ…ÉäÉ¥¹œ´ÄÉ¥¹œµÁÉ¥µ…Éä¼ÄÔˆø(€€€€€€€€€€€€ñ!•…ÉÑ!…¹‘Í¡…­”±…ÍÍ9…µ”ô‰ ´ØÜ´Øˆ€¼ø(€€€€€€€€€€ğ½ÍÁ…¸ø(€€€€€€€€€€ñ Ì±…ÍÍ9…µ”ô‰µĞ´Ğ™½¹Ğµ•áÑÉ…‰½±ˆù9•¹¡Õ´Á•‘¥‘¼Á½È…ÅÕ¤…¥¹‘„ğ½ Ìø(€€€€€€€€€€ñÀ±…ÍÍ9…µ”ô‰µĞ´Äµ…àµÜµlÈàÁÁátÑ•áĞµÍ´±•…‘¥¹œµÉ•±…á•Ñ•áĞµµÕÑ•µ™½É•É½Õ¹ˆø(€€€€€€€€€€€EÕ…¹‘¼…±×¥´½µÁ…ÉÑ¥±¡…ÈÕ´±…µ½È°Ù½¨Á½‘•Ë„…Á½¥…È½´ÍÕ„½É‡Ÿ¼¸(€€€€€€€€€€ğ½Àø(€€€€€€€€ğ½‘¥Øø(€€€€€€¥ô((€€€€€íÁ½ÍÑÌ¹µ…À ¡À¤€ôø€ (€€€€€€€€ñ…ÉÑ¥±”(€€€€€€€€€­•äõíÀ¹¥‘ô(€€€€€€€€€±…ÍÍ9…µ”ô‰É•±…Ñ¥Ù”½Ù•É™±½Üµ¡¥‘‘•¸É½Õ¹‘•µlÈÙÁát‰½É‘•È‰½É‘•Èµ‰½É‘•È¼ÜÀ‰œµÍÕÉ™…”À´ĞÍ¡…‘½ÜµÍ´ÑÉ…¹Í¥Ñ¥½¸µ…±°¡½Ù•Èé‰½É‘•ÈµÁÉ¥µ…Éä¼ÈÀ¡½Ù•ÈéÍ¡…‘½Üµ±œˆ(€€€€€€€€ø(€€€€€€€€€€ñEÕ½Ñ”±…ÍÍ9…µ”ô‰Á½¥¹Ñ•Èµ•Ù•¹ÑÌµ¹½¹”…‰Í½±ÕÑ”€µÉ¥¡Ğ´ÄÑ½À´È ´ÄØÜ´ÄØÑ•áĞµÁÉ¥µ…Éä½lÀ¸ÀĞÕtˆ€¼ø(€€€€€€€€€€ñ¡•…‘•È±…ÍÍ9…µ”ô‰É•±…Ñ¥Ù”™±•à¥Ñ•µÌµ•¹Ñ•È…À´Ìˆø(€€€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰™±•à ´ÄÄÜ´ÄÄ¥Ñ•µÌµ•¹Ñ•È©ÕÍÑ¥™äµ•¹Ñ•ÈÉ½Õ¹‘•µlÄÕÁát‰œµÁÉ¥µ…Éä¼ÄÔÑ•áĞµÍ´™½¹Ğµ•áÑÉ…‰½±Ñ•áĞµÁÉ¥µ…ÉäÉ¥¹œ´ÄÉ¥¹œµÁÉ¥µ…Éä¼ÄÀˆø(€€€€€€€€€€€€€íÀ¹…ÕÑ¡½É}¹…µ•lÁuô(€€€€€€€€€€€€ğ½‘¥Øø(€€€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰™±•à´Äˆø(€€€€€€€€€€€€€€ñÀ±…ÍÍ9…µ”ô‰Ñ•áĞµÍ´™½¹Ğµ•áÑÉ…‰½±ˆùíÀ¹…ÕÑ¡½É}¹…µ•ôğ½Àø(€€€€€€€€€€€€€€ñÀ±…ÍÍ9…µ”ô‰Ñ•áĞµlÄÅÁátÑ•áĞµµÕÑ•µ™½É•É½Õ¹ˆø(€€€€€€€€€€€€€€€í™½Éµ…Ñ¥ÍÑ…¹•Q½9½Ü¡¹•Ü…Ñ”¡À¹É•…Ñ•‘}…Ğ¤°ì±½…±”èÁÑ	H°…‘‘MÕ™™¥àèÑÉÕ”ô¥ô(€€€€€€€€€€€€€€ğ½Àø(€€€€€€€€€€€€ğ½‘¥Øø(€€€€€€€€€€€íÀ¹¥Í}…¹Íİ•É•€˜˜€ (€€€€€€€€€€€€€€ñÍÁ…¸±…ÍÍ9…µ”ô‰¥¹±¥¹”µ™±•à¥Ñ•µÌµ•¹Ñ•È…À´ÄÉ½Õ¹‘•µ™Õ±°‰œµÍÕ•ÍÌ¼ÄÔÁà´È¸ÔÁä´ÄÑ•áĞµlåÁát™½¹Ğµ•áÑÉ…‰½±Ñ•áĞµÍÕ•ÍÌÉ¥¹œ´ÄÉ¥¹œµÍÕ•ÍÌ¼ÄÔˆø(€€€€€€€€€€€€€€€€ñ¡•­¥É±”È±…ÍÍ9…µ”ô‰ ´ÌÜ´Ìˆ€¼øI•ÍÁ½¹‘¥‘¼(€€€€€€€€€€€€€€ğ½ÍÁ…¸ø(€€€€€€€€€€€€¥ô(€€€€€€€€€€ğ½¡•…‘•Èø(€€€€€€€€€íÀ¹…Õ‘¥½}ÕÉ°€ü€ (€€€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰É•±…Ñ¥Ù”µĞ´ĞÉ½Õ¹‘•µlÄáÁát‰œµÍÕÉ™…”´È¼ØÀÀ´ÈÉ¥¹œ´ÄÉ¥¹œµ‰½É‘•È¼ÔÀˆø(€€€€€€€€€€€€€€ñY½¥•9½Ñ•A±…å•ÈÍÉŒõíÀ¹…Õ‘¥½}ÕÉ±ô€¼ø(€€€€€€€€€€€€ğ½‘¥Øø(€€€€€€€€€€¤€è€ (€€€€€€€€€€€À¹‰½‘ä€˜˜€ (€€€€€€€€€€€€€€ñÀ±…ÍÍ9…µ”ô‰É•±…Ñ¥Ù”µĞ´ĞÑ•áĞµlÄÕÁát±•…‘¥¹œµÉ•±…á•Ñ•áĞµ™½É•É½Õ¹¼äÔˆø(€€€€€€€€€€€€€€€íÀ¹‰½‘åô(€€€€€€€€€€€€€€ğ½Àø(€€€€€€€€€€€€¤(€€€€€€€€€€¥ô(€€€€€€€€€€ñ‰ÕÑÑ½¸(€€€€€€€€€€€ÑåÁ”ô‰‰ÕÑÑ½¸ˆ(€€€€€€€€€€€½¹±¥¬õì ¤€ôøÙ½¥Ñ½±•µ•¸¡À¹¥¥ô(€€€€€€€€€€€±…ÍÍ9…µ”õíµĞ´Ğ¥¹±¥¹”µ™±•àµ¥¸µ ´ÄÀ¥Ñ•µÌµ•¹Ñ•È…À´ÈÉ½Õ¹‘•µlÄÕÁát‰½É‘•ÈÁà´ĞÑ•áĞµáÌ™½¹Ğµ‰½±ÑÉ…¹Í¥Ñ¥½¸µ…±°€‘ì(€€€€€€€€€€€€€µåµ•¹Ì¹¡…Ì¡À¹¥¤(€€€€€€€€€€€€€€€€ü€‰‰½É‘•ÈµÁÉ¥µ…Éä¼ÌÀ‰œµÁÉ¥µ…Éä¼ÄÔÑ•áĞµÁÉ¥µ…ÉäÍ¡…‘½ÜµÍ´ˆ(€€€€€€€€€€€€€€€€è€‰‰½É‘•Èµ‰½É‘•È¼ÜÀ‰œµ‰…­É½Õ¹¼ØÀÑ•áĞµµÕÑ•µ™½É•É½Õ¹¡½Ù•Èé‰½É‘•ÈµÁÉ¥µ…Éä¼ÌÀ¡½Ù•ÈéÑ•áĞµÁÉ¥µ…Éäˆ(€€€€€€€€€€€õô(€€€€€€€€€€ø(€€€€€€€€€€€€ñ!•…ÉÑ!…¹‘Í¡…­”±…ÍÍ9…µ”ô‰ ´ĞÜ´Ğˆ€¼ø·¥´(€€€€€€€€€€€€ñÍÁ…¸±…ÍÍ9…µ”ô‰™½¹Ğµ•áÑÉ…‰½±ˆùí½Õ¹ÑÍmÀ¹¥‘t€üü€Áôğ½ÍÁ…¸ø(€€€€€€€€€€ğ½‰ÕÑÑ½¸ø(€€€€€€€€ğ½…ÉÑ¥±”ø(€€€€€€¤¥ô(€€€€ğ½‘¥Øø(€€¤ì)ô((¼¼€ôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôô(¼¼5T'I%<ƒŠPÉ•ÍÁ½ÍÑ…Ì‘”É•™±•ã¼°½´·Í‘Õ±¼½ÑÉ¥±¡„°•‘§Ÿ¼”•á±ÕÏ¼(¼¼€ôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôôô()ÑåÁ”¥…ÉåI½Ü€ôì(€¥èÍÑÉ¥¹œì(€±•ÍÍ½¹}¥èÍÑÉ¥¹œì(€±•ÍÍ½¹}Ñ¥Ñ±”èÍÑÉ¥¹œì(€ÅÕ•ÍÑ¥½¸èÍÑÉ¥¹œì(€…¹Íİ•ÈèÍÑÉ¥¹œì(€É•…Ñ•‘}…ĞèÍÑÉ¥¹œì(€ÕÁ‘…Ñ•‘}…ĞèÍÑÉ¥¹œì)ôì()ÑåÁ”QÉ…¥±5•Ñ„€ôìµ½‘Õ±•=Éè¹Õµ‰•Èìµ½‘Õ±•Q¥Ñ±”èÍÑÉ¥¹œìÑÉ…¥±=Éè¹Õµ‰•ÈìÑÉ…¥±Q¥Ñ±”èÍÑÉ¥¹œôì()™Õ¹Ñ¥½¸¥…É¥¼ ¤ì(€½¹ÍĞm•¹ÑÉ¥•Ì°Í•Ñ¹ÑÉ¥•Ít€ôÕÍ•MÑ…Ñ”ñ¥…ÉåI½İmtø¡mt¤ì(€½¹ÍĞmÑÉ…¥±5•Ñ„°Í•ÑQÉ…¥±5•Ñ…t€ôÕÍ•MÑ…Ñ”ñI•½ÉñÍÑÉ¥¹œ°QÉ…¥±5•Ñ„øø¡íô¤ì(€½¹ÍĞm±½…‘¥¹œ°Í•Ñ1½…‘¥¹t€ôÕÍ•MÑ…Ñ”¡ÑÉÕ”¤ì(€½¹ÍĞm•‘¥Ñ¥¹%°Í•Ñ‘¥Ñ¥¹%‘t€ôÕÍ•MÑ…Ñ”ñÍÑÉ¥¹œğ¹Õ±°ø¡¹Õ±°¤ì(€½¹ÍĞm•‘¥ÑÉ…™Ğ°Í•Ñ‘¥ÑÉ…™Ñt€ôÕÍ•MÑ…Ñ” ˆˆ¤ì(€½¹ÍĞmÍ…Ù¥¹œ°Í•ÑM…Ù¥¹t€ôÕÍ•MÑ…Ñ”¡™…±Í”¤ì((€½¹ÍĞ±½…€ô…Íå¹Œ€ ¤€ôøì(€€€Í•Ñ1½…‘¥¹œ¡ÑÉÕ”¤ì(€€€½¹ÍĞì‘…Ñ„èÔô€ô…İ…¥ĞÍÕÁ…‰…Í”¹…ÕÑ ¹•ÑUÍ•È ¤ì(€€€¥˜€ …Ô¹ÕÍ•È¤ì(€€€€€Í•Ñ1½…‘¥¹œ¡™…±Í”¤ì(€€€€€É•ÑÕÉ¸ì(€€€ô(€€€½¹ÍĞmì‘…Ñ„è‘¥…ÉåI½İÌô°ì‘…Ñ„èÑÉ…¥±Ìô°ì‘…Ñ„èµ½‘Õ±•Ìõt€ô…İ…¥ĞAÉ½µ¥Í”¹…±°¡l(€€€€€ÍÕÁ…‰…Í”(€€€€€€€€¹™É½´ ‰‘¥…Éå}•¹ÑÉ¥•Ìˆ¤(€€€€€€€€¹Í•±•Ğ ˆ¨ˆ¤(€€€€€€€€¹•Ä ‰ÕÍ•É}¥ˆ°Ô¹ÕÍ•È¹¥¤(€€€€€€€€¹½É‘•È ‰É•…Ñ•‘}…Ğˆ°ì…Í•¹‘¥¹œè™…±Í”ô¤°(€€€€€ÍÕÁ…‰…Í”¹™É½´ ‰‘¥Í¥Á±•}ÑÉ…¥±Ìˆ¤¹Í•±•Ğ ‰±•ÍÍ½¹}¥°µ½‘Õ±•}¥°½É°Ñ¥Ñ±”ˆ¤°(€€€€€ÍÕÁ…‰…Í”¹™É½´ ‰‘¥Í¥Á±•}µ½‘Õ±•Ìˆ¤¹Í•±•Ğ ‰¥°½É°Ñ¥Ñ±”ˆ¤°(€€€t¤ì((€€€½¹ÍĞµ½‘Õ±•	å%€ô¹•Ü5…À ¡µ½‘Õ±•Ì€üümt¤¹µ…À ¡´¤€ôøm´¹¥°µt¤¤ì(€€€½¹ÍĞµ•Ñ„èI•½ÉñÍÑÉ¥¹œ°QÉ…¥±5•Ñ„ø€ôíôì(€€€™½È€¡½¹ÍĞĞ½˜ÑÉ…¥±Ì€üümt¤ì(€€€€€¥˜€ …Ğ¹±•ÍÍ½¹}¥¤½¹Ñ¥¹Õ”ì(€€€€€½¹ÍĞµ½€ôµ½‘Õ±•	å%¹•Ğ¡Ğ¹µ½‘Õ±•}¥¤ì(€€€€€¥˜€ …µ½¤½¹Ñ¥¹Õ”ì(€€€€€µ•Ñ…mĞ¹±•ÍÍ½¹}¥‘t€ôì(€€€€€€€µ½‘Õ±•=Éèµ½¹½É°(€€€€€€€µ½‘Õ±•Q¥Ñ±”èµ½¹Ñ¥Ñ±”°(€€€€€€€ÑÉ…¥±=ÉèĞ¹½É°(€€€€€€€ÑÉ…¥±Q¥Ñ±”èĞ¹Ñ¥Ñ±”°(€€€€€ôì(€€€ô(€€€Í•ÑQÉ…¥±5•Ñ„¡µ•Ñ„¤ì(€€€Í•Ñ¹ÑÉ¥•Ì ¡‘¥…ÉåI½İÌ€üümt¤…Ì¥…ÉåI½İmt¤ì(€€€Í•Ñ1½…‘¥¹œ¡™…±Í”¤ì(€ôì((€ÕÍ•™™•Ğ  ¤€ôøì(€€€Ù½¥±½… ¤ì(€ô°mt¤ì((€½¹ÍĞ½É‘•É•€ôÕÍ•5•µ¼  ¤€ôøì(€€€½¹ÍĞİ¥Ñ¡5•Ñ„€ô•¹ÑÉ¥•Ì¹µ…À ¡”¤€ôø€¡ì•¹ÑÉäè”°µ•Ñ„èÑÉ…¥±5•Ñ…m”¹±•ÍÍ½¹}¥‘tô¤¤ì(€€€İ¥Ñ¡5•Ñ„¹Í½ÉĞ ¡„°ˆ¤€ôøì(€€€€€¥˜€¡„¹µ•Ñ„€˜˜ˆ¹µ•Ñ„¤ì(€€€€€€€¥˜€¡„¹µ•Ñ„¹µ½‘Õ±•=É€„ôôˆ¹µ•Ñ„¹µ½‘Õ±•=É¤É•ÑÕÉ¸„¹µ•Ñ„¹µ½‘Õ±•=É€´ˆ¹µ•Ñ„¹µ½‘Õ±•=Éì(€€€€€€€É•ÑÕÉ¸„¹µ•Ñ„¹ÑÉ…¥±=É€´ˆ¹µ•Ñ„¹ÑÉ…¥±=Éì(€€€€€ô(€€€€€¥˜€¡„¹µ•Ñ„€˜˜€…ˆ¹µ•Ñ„¤É•ÑÕÉ¸€´Äì(€€€€€¥˜€ …„¹µ•Ñ„€˜˜ˆ¹µ•Ñ„¤É•ÑÕÉ¸€Äì(€€€€€É•ÑÕÉ¸¹•Ü…Ñ”¡„¹•¹ÑÉä¹É•…Ñ•‘}…Ğ¤¹•ÑQ¥µ” ¤€´¹•Ü…Ñ”¡ˆ¹•¹ÑÉä¹É•…Ñ•‘}…Ğ¤¹•ÑQ¥µ” ¤ì(€€€ô¤ì(€€€É•ÑÕÉ¸İ¥Ñ¡5•Ñ„ì(€ô°m•¹ÑÉ¥•Ì°ÑÉ…¥±5•Ñ…t¤ì((€½¹ÍĞÍÑ…ÉÑ‘¥Ğ€ô€¡•¹ÑÉäè¥…ÉåI½Ü¤€ôøì(€€€Í•Ñ‘¥Ñ¥¹%¡•¹ÑÉä¹¥¤ì(€€€Í•Ñ‘¥ÑÉ…™Ğ¡•¹ÑÉä¹…¹Íİ•È¤ì(€ôì((€½¹ÍĞ…¹•±‘¥Ğ€ô€ ¤€ôøì(€€€Í•Ñ‘¥Ñ¥¹%¡¹Õ±°¤ì(€€€Í•Ñ‘¥ÑÉ…™Ğ ˆˆ¤ì(€ôì((€½¹ÍĞÍ…Ù•‘¥Ğ€ô…Íå¹Œ€¡¥èÍÑÉ¥¹œ¤€ôøì(€€€¥˜€ …•‘¥ÑÉ…™Ğ¹ÑÉ¥´ ¤ñğÍ…Ù¥¹œ¤É•ÑÕÉ¸ì(€€€Í•ÑM…Ù¥¹œ¡ÑÉÕ”¤ì(€€€½¹ÍĞì•ÉÉ½Èô€ô…İ…¥ĞÍÕÁ…‰…Í”(€€€€€€¹™É½´ ‰‘¥…Éå}•¹ÑÉ¥•Ìˆ¤(€€€€€€¹ÕÁ‘…Ñ”¡ì…¹Íİ•Èè•‘¥ÑÉ…™Ğ¹ÑÉ¥´ ¤ô¤(€€€€€€¹•Ä ‰¥ˆ°¥¤ì(€€€Í•ÑM…Ù¥¹œ¡™…±Í”¤ì(€€€¥˜€ …•ÉÉ½È¤ì(€€€€€Í•Ñ¹ÑÉ¥•Ì ¡ÁÉ•Ø¤€ôø(€€€€€€€ÁÉ•Ø¹µ…À ¡”¤€ôø(€€€€€€€€€”¹¥€ôôô¥(€€€€€€€€€€€€üì€¸¸¹”°…¹Íİ•Èè•‘¥ÑÉ…™Ğ¹ÑÉ¥´ ¤°ÕÁ‘…Ñ•‘}…Ğè¹•Ü…Ñ” ¤¹Ñ½%M=MÑÉ¥¹œ ¤ô(€€€€€€€€€€€€è”°(€€€€€€€€¤°(€€€€€€¤ì(€€€€€Í•Ñ‘¥Ñ¥¹%¡¹Õ±°¤ì(€€€€€Í•Ñ‘¥ÑÉ…™Ğ ˆˆ¤ì(€€€ô(€ôì((€½¹ÍĞÉ•µ½Ù”€ô…Íå¹Œ€¡¥èÍÑÉ¥¹œ¤€ôøì(€€€¥˜€ …İ¥¹‘½Ü¹½¹™¥É´ ‰Á……È•ÍÑ„É•ÍÁ½ÍÑ„‘¼‘§…É¥¼üÍÍ„‡Ÿ¼»¼Á½‘”Í•È‘•Í™•¥Ñ„¸ˆ¤¤É•ÑÕÉ¸ì(€€€½¹ÍĞì•ÉÉ½Èô€ô…İ…¥ĞÍÕÁ…‰…Í”¹™É½´ ‰‘¥…Éå}•¹ÑÉ¥•Ìˆ¤¹‘•±•Ñ” ¤¹•Ä ‰¥ˆ°¥¤ì(€€€¥˜€ …•ÉÉ½È¤ì(€€€€€Í•Ñ¹ÑÉ¥•Ì ¡ÁÉ•Ø¤€ôøÁÉ•Ø¹™¥±Ñ•È ¡”¤€ôø”¹¥€„ôô¥¤¤ì(€€€ô(€ôì((€¥˜€¡±½…‘¥¹œ¤ì(€€€É•ÑÕÉ¸€ (€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰ÍÁ…”µä´Ìˆø(€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰ ´ÈĞ…¹¥µ…Ñ”µÁÕ±Í”É½Õ¹‘•µlÈÙÁát‰œµÍÕÉ™…”´È¼ÜÀˆ€¼ø(€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰ ´Ğà…¹¥µ…Ñ”µÁÕ±Í”É½Õ¹‘•µlÈÙÁát‰œµÍÕÉ™…”´È¼ÜÀˆ€¼ø(€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰ ´ĞÀ…¹¥µ…Ñ”µÁÕ±Í”É½Õ¹‘•µlÈÙÁát‰œµÍÕÉ™…”´È¼ÜÀˆ€¼ø(€€€€€€ğ½‘¥Øø(€€€€¤ì(€ô((€¥˜€¡•¹ÑÉ¥•Ì¹±•¹Ñ €ôôô€À¤ì(€€€É•ÑÕÉ¸€ (€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰É•±…Ñ¥Ù”™±•à™±•àµ½°¥Ñ•µÌµ•¹Ñ•È½Ù•É™±½Üµ¡¥‘‘•¸É½Õ¹‘•µlÈÙÁát‰½É‘•È‰½É‘•Èµ‘…Í¡•‰½É‘•ÈµÁÉ¥µ…Éä¼ÈÔ‰œµÁÉ¥µ…Éä½lÀ¸ÀÌÕtÁà´ØÁä´ÄÈÑ•áĞµ•¹Ñ•Èˆø(€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰Á½¥¹Ñ•Èµ•Ù•¹ÑÌµ¹½¹”…‰Í½±ÕÑ”€µÑ½À´ÄÈ ´ÌÈÜ´ÌÈÉ½Õ¹‘•µ™Õ±°‰œµÁÉ¥µ…Éä¼ÄÀ‰±ÕÈ´Íá°ˆ€¼ø(€€€€€€€€ñÍÁ…¸±…ÍÍ9…µ”ô‰É•±…Ñ¥Ù”™±•à ´ÄĞÜ´ÄĞ¥Ñ•µÌµ•¹Ñ•È©ÕÍÑ¥™äµ•¹Ñ•ÈÉ½Õ¹‘•µlÈÁÁát‰œµÁÉ¥µ…Éä¼ÄÀÑ•áĞµÁÉ¥µ…ÉäÉ¥¹œ´ÄÉ¥¹œµÁÉ¥µ…Éä¼ÄÔˆø(€€€€€€€€€€ñ	½½­!•…ÉĞ±…ÍÍ9…µ”ô‰ ´ØÜ´Øˆ€¼ø(€€€€€€€€ğ½ÍÁ…¸ø(€€€€€€€€ñ Ì±…ÍÍ9…µ”ô‰É•±…Ñ¥Ù”µĞ´Ğ™½¹Ğµ•áÑÉ…‰½±ˆùM•Ô‘§…É¥¼•ÍÓ„…Õ…É‘…¹‘¼ğ½ Ìø(€€€€€€€€ñÀ±…ÍÍ9…µ”ô‰É•±…Ñ¥Ù”µĞ´Äµ…àµÜµlÈäÁÁátÑ•áĞµÍ´±•…‘¥¹œµÉ•±…á•Ñ•áĞµµÕÑ•µ™½É•É½Õ¹ˆø(€€€€€€€€€½µÁ±•Ñ”Õµ„±§Ÿ¼ƒŠPÍÕ„É•ÍÁ½ÍÑ„‘”É•™±•ã¼Í•Ë„Í…±Ù„…ÅÕ¤…ÕÑ½µ…Ñ¥…µ•¹Ñ”¸(€€€€€€€€ğ½Àø(€€€€€€ğ½‘¥Øø(€€€€¤ì(€ô((€É•ÑÕÉ¸€ (€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰ÍÁ…”µä´Ğˆø(€€€€€€ñÍ•Ñ¥½¸±…ÍÍ9…µ”ô‰É•±…Ñ¥Ù”½Ù•É™±½Üµ¡¥‘‘•¸É½Õ¹‘•µlÈÙÁát‰½É‘•È‰½É‘•Èµ‰½É‘•È¼ÜÀ‰œµÉ…‘¥•¹ĞµÑ¼µ‰È™É½´µÁÉ¥µ…Éä½lÀ¸ÅtÙ¥„µÍÕÉ™…”Ñ¼µÍÕÉ™…”À´ĞÍ¡…‘½ÜµÍ´ˆø(€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰Á½¥¹Ñ•Èµ•Ù•¹ÑÌµ¹½¹”…‰Í½±ÕÑ”€µÉ¥¡Ğ´ÄÀ€µÑ½À´ÄÈ ´ÌÈÜ´ÌÈÉ½Õ¹‘•µ™Õ±°‰œµÁÉ¥µ…Éä¼ÄÀ‰±ÕÈ´Íá°ˆ€¼ø(€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰É•±…Ñ¥Ù”™±•à¥Ñ•µÌµ•¹Ñ•È…À´Ìˆø(€€€€€€€€€€ñÍÁ…¸±…ÍÍ9…µ”ô‰™±•à ´ÄÈÜ´ÄÈ¥Ñ•µÌµ•¹Ñ•È©ÕÍÑ¥™äµ•¹Ñ•ÈÉ½Õ¹‘•µlÄİÁát‰œµÁÉ¥µ…Éä¼ÄÔÑ•áĞµÁÉ¥µ…ÉäÉ¥¹œ´ÄÉ¥¹œµÁÉ¥µ…Éä¼ÄÔˆø(€€€€€€€€€€€€ñ1½­-•å¡½±”±…ÍÍ9…µ”ô‰ ´ÔÜ´Ôˆ€¼ø(€€€€€€€€€€ğ½ÍÁ…¸ø(€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰µ¥¸µÜ´À™±•à´Äˆø(€€€€€€€€€€€€ñÀ±…ÍÍ9…µ”ô‰Ñ•áĞµÍ´™½¹Ğµ•áÑÉ…‰½±ˆùM•Ô…‘•É¹¼‘”…µ¥¹¡…‘„ğ½Àø(€€€€€€€€€€€€ñÀ±…ÍÍ9…µ”ô‰µĞ´À¸ÔÑ•áĞµlÄÁÁát±•…‘¥¹œµÉ•±…á•Ñ•áĞµµÕÑ•µ™½É•É½Õ¹ˆø(€€€€€€€€€€€€€U´•ÍÁ‡¼Á•ÍÍ½…°Á…É„É•Ù•È…ÁÉ•¹‘¥é…‘½Ì”Á•É•‰•ÈÍ•ÔÉ•Í¥µ•¹Ñ¼¸(€€€€€€€€€€€€ğ½Àø(€€€€€€€€€€ğ½‘¥Øø(€€€€€€€€€€ñÍÁ…¸±…ÍÍ9…µ”ô‰™±•à ´äµ¥¸µÜ´ä¥Ñ•µÌµ•¹Ñ•È©ÕÍÑ¥™äµ•¹Ñ•ÈÉ½Õ¹‘•µ™Õ±°‰œµÁÉ¥µ…Éä¼ÄÀÁà´ÈÑ•áĞµáÌ™½¹Ğµ•áÑÉ…‰½±Ñ•áĞµÁÉ¥µ…Éäˆø(€€€€€€€€€€€í•¹ÑÉ¥•Ì¹±•¹Ñ¡ô(€€€€€€€€€€ğ½ÍÁ…¸ø(€€€€€€€€ğ½‘¥Øø(€€€€€€ğ½Í•Ñ¥½¸ø((€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰™±•à¥Ñ•µÌµ•¹©ÕÍÑ¥™äµ‰•Ñİ••¸…À´ÌÁà´Äˆø(€€€€€€€€ñ‘¥Øø(€€€€€€€€€€ñÀ±…ÍÍ9…µ”ô‰Ñ•áĞµlÄÁÁát™½¹Ğµ•áÑÉ…‰½±ÕÁÁ•É…Í”ÑÉ…­¥¹œµlÀ¸ÄÙ•µtÑ•áĞµÁÉ¥µ…Éäˆø(€€€€€€€€€€€MÕ„¡¥ÍÓÍÉ¥„(€€€€€€€€€€ğ½Àø(€€€€€€€€€€ñ Ì±…ÍÍ9…µ”ô‰µĞ´À¸ÔÑ•áĞµ‰…Í”™½¹Ğµ•áÑÉ…‰½±ˆùI•™±•ãÕ•ÌÍ…±Ù…Ìğ½ Ìø(€€€€€€€€ğ½‘¥Øø(€€€€€€ğ½‘¥Øø((€€€€€í½É‘•É•¹µ…À ¡ì•¹ÑÉäè”°µ•Ñ„ô¤€ôøì(€€€€€€€½¹ÍĞ¥Í‘¥Ñ¥¹œ€ô•‘¥Ñ¥¹%€ôôô”¹¥ì(€€€€€€€½¹ÍĞİ…Í‘¥Ñ•€ô”¹ÕÁ‘…Ñ•‘}…Ğ€˜˜”¹ÕÁ‘…Ñ•‘}…Ğ€„ôô”¹É•…Ñ•‘}…Ğì(€€€€€€€É•ÑÕÉ¸€ (€€€€€€€€€€ñ…ÉÑ¥±”(€€€€€€€€€€€­•äõí”¹¥‘ô(€€€€€€€€€€€±…ÍÍ9…µ”ô‰É•±…Ñ¥Ù”½Ù•É™±½Üµ¡¥‘‘•¸É½Õ¹‘•µlÈÙÁát‰½É‘•È‰½É‘•Èµ‰½É‘•È¼ÜÀ‰œµÍÕÉ™…”À´ĞÍ¡…‘½ÜµÍ´ÑÉ…¹Í¥Ñ¥½¸µ…±°¡½Ù•Èé‰½É‘•ÈµÁÉ¥µ…Éä¼ÈÀ¡½Ù•ÈéÍ¡…‘½Üµ±œˆ(€€€€€€€€€€ø(€€€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰…‰Í½±ÕÑ”¥¹Í•Ğµä´Ğ±•™Ğ´ÀÜ´ÄÉ½Õ¹‘•µÈµ™Õ±°‰œµÉ…‘¥•¹ĞµÑ¼µˆ™É½´µÁÉ¥µ…ÉäÑ¼µÁÉ¥µ…Éäµ±½Üˆ€¼ø(€€€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰™±•à¥Ñ•µÌµÍÑ…ÉĞ©ÕÍÑ¥™äµ‰•Ñİ••¸…À´Èˆø(€€€€€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰µ¥¸µÜ´Àˆø(€€€€€€€€€€€€€€€€ñÀ±…ÍÍ9…µ”ô‰Ñ•áĞµlåÁát™½¹Ğµ•áÑÉ…‰½±ÕÁÁ•É…Í”±•…‘¥¹œµÉ•±…á•ÑÉ…­¥¹œµlÀ¸ÄÑ•µtÑ•áĞµÁÉ¥µ…Éäˆø(€€€€€€€€€€€€€€€€€íµ•Ñ„(€€€€€€€€€€€€€€€€€€€€ü7Í‘Õ±¼€‘íµ•Ñ„¹µ½‘Õ±•=É‘ôƒ
Ü€‘íµ•Ñ„¹µ½‘Õ±•Q¥Ñ±•ôƒŠPQÉ¥±¡„è€‘íµ•Ñ„¹ÑÉ…¥±Q¥Ñ±•õ€(€€€€€€€€€€€€€€€€€€€€è”¹±•ÍÍ½¹}Ñ¥Ñ±•ô(€€€€€€€€€€€€€€€€ğ½Àø(€€€€€€€€€€€€€€€€ñÀ±…ÍÍ9…µ”ô‰µĞ´ÄÑ•áĞµlÄÁÁát™½¹Ğµµ•‘¥Õ´Ñ•áĞµµÕÑ•µ™½É•É½Õ¹ˆø(€€€€€€€€€€€€€€€€€í™½Éµ…Ñ¥ÍÑ…¹•Q½9½Ü¡¹•Ü…Ñ”¡”¹É•…Ñ•‘}…Ğ¤°ì±½…±”èÁÑ	H°…‘‘MÕ™™¥àèÑÉÕ”ô¥ô(€€€€€€€€€€€€€€€€€íİ…Í‘¥Ñ•€˜˜€ˆƒ
Ü•‘¥Ñ…‘¼‰ô(€€€€€€€€€€€€€€€€ğ½Àø(€€€€€€€€€€€€€€ğ½‘¥Øø(€€€€€€€€€€€€€ì…¥Í‘¥Ñ¥¹œ€˜˜€ (€€€€€€€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰™±•àÍ¡É¥¹¬´À…À´Äˆø(€€€€€€€€€€€€€€€€€€ñ‰ÕÑÑ½¸(€€€€€€€€€€€€€€€€€€€½¹±¥¬õì ¤€ôøÍÑ…ÉÑ‘¥Ğ¡”¥ô(€€€€€€€€€€€€€€€€€€€±…ÍÍ9…µ”ô‰™±•à ´àÜ´à¥Ñ•µÌµ•¹Ñ•È©ÕÍÑ¥™äµ•¹Ñ•ÈÉ½Õ¹‘•µlÄÅÁátÑ•áĞµµÕÑ•µ™½É•É½Õ¹ÑÉ…¹Í¥Ñ¥½¸µ½±½ÉÌ¡½Ù•Èé‰œµÁÉ¥µ…Éä¼ÄÀ¡½Ù•ÈéÑ•áĞµÁÉ¥µ…Éäˆ(€€€€€€€€€€€€€€€€€€€…É¥„µ±…‰•°ô‰‘¥Ñ…ÈÉ•ÍÁ½ÍÑ„ˆ(€€€€€€€€€€€€€€€€€€ø(€€€€€€€€€€€€€€€€€€€€ñA•¹¥°±…ÍÍ9…µ”ô‰ ´Ì¸ÔÜ´Ì¸Ôˆ€¼ø(€€€€€€€€€€€€€€€€€€ğ½‰ÕÑÑ½¸ø(€€€€€€€€€€€€€€€€€€ñ‰ÕÑÑ½¸(€€€€€€€€€€€€€€€€€€€½¹±¥¬õì ¤€ôøÙ½¥É•µ½Ù”¡”¹¥¥ô(€€€€€€€€€€€€€€€€€€€±…ÍÍ9…µ”ô‰™±•à ´àÜ´à¥Ñ•µÌµ•¹Ñ•È©ÕÍÑ¥™äµ•¹Ñ•ÈÉ½Õ¹‘•µlÄÅÁátÑ•áĞµµÕÑ•µ™½É•É½Õ¹ÑÉ…¹Í¥Ñ¥½¸µ½±½ÉÌ¡½Ù•Èé‰œµ‘•ÍÑÉÕÑ¥Ù”¼ÄÀ¡½Ù•ÈéÑ•áĞµ‘•ÍÑÉÕÑ¥Ù”ˆ(€€€€€€€€€€€€€€€€€€€…É¥„µ±…‰•°ô‰Á……ÈÉ•ÍÁ½ÍÑ„ˆ(€€€€€€€€€€€€€€€€€€ø(€€€€€€€€€€€€€€€€€€€€ñQÉ…Í È±…ÍÍ9…µ”ô‰ ´Ì¸ÔÜ´Ì¸Ôˆ€¼ø(€€€€€€€€€€€€€€€€€€ğ½‰ÕÑÑ½¸ø(€€€€€€€€€€€€€€€€ğ½‘¥Øø(€€€€€€€€€€€€€€¥ô(€€€€€€€€€€€€ğ½‘¥Øø(€€€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰µĞ´Ğ™±•à¥Ñ•µÌµÍÑ…ÉĞ…À´È¸Ôˆø(€€€€€€€€€€€€€€ñÍÁ…¸±…ÍÍ9…µ”ô‰™±•à ´ÜÜ´ÜÍ¡É¥¹¬´À¥Ñ•µÌµ•¹Ñ•È©ÕÍÑ¥™äµ•¹Ñ•ÈÉ½Õ¹‘•µlÄÁÁát‰œµÁÉ¥µ…Éä¼ÄÀÑ•áĞµÁÉ¥µ…Éäˆø(€€€€€€€€€€€€€€€€ñEÕ½Ñ”±…ÍÍ9…µ”ô‰ ´Ì¸ÔÜ´Ì¸Ôˆ€¼ø(€€€€€€€€€€€€€€ğ½ÍÁ…¸ø(€€€€€€€€€€€€€€ñÀ±…ÍÍ9…µ”ô‰ÁĞ´À¸ÔÑ•áĞµÍ´™½¹Ğµ‰½±±•…‘¥¹œµÉ•±…á•ˆùí”¹ÅÕ•ÍÑ¥½¹ôğ½Àø(€€€€€€€€€€€€ğ½‘¥Øø(€€€€€€€€€€€í¥Í‘¥Ñ¥¹œ€ü€ (€€€€€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰µĞ´ÌÍÁ…”µä´Èˆø(€€€€€€€€€€€€€€€€ñÑ•áÑ…É•„(€€€€€€€€€€€€€€€€€Ù…±Õ”õí•‘¥ÑÉ…™Ñô(€€€€€€€€€€€€€€€€€½¹¡…¹”õì¡•Ø¤€ôøÍ•Ñ‘¥ÑÉ…™Ğ¡•Ø¹Ñ…É•Ğ¹Ù…±Õ”¥ô(€€€€€€€€€€€€€€€€€É½İÌõìÑô(€€€€€€€€€€€€€€€€€±…ÍÍ9…µ”ô‰Üµ™Õ±°É•Í¥é”µ¹½¹”É½Õ¹‘•µlÄáÁát‰½É‘•È‰½É‘•Èµ‰½É‘•È¼ÜÀ‰œµ‰…­É½Õ¹¼ÜÀÀ´Ì¸ÔÑ•áĞµÍ´±•…‘¥¹œµÉ•±…á•½ÕÑ±¥¹”µ¹½¹”ÑÉ…¹Í¥Ñ¥½¸µ…±°™½ÕÌé‰½É‘•ÈµÁÉ¥µ…Éä¼ØÀ™½ÕÌéÉ¥¹œ´Ğ™½ÕÌéÉ¥¹œµÁÉ¥µ…Éä¼ÄÀˆ(€€€€€€€€€€€€€€€€¼ø(€€€€€€€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰™±•à©ÕÍÑ¥™äµ•¹…À´Èˆø(€€€€€€€€€€€€€€€€€€ñ‰ÕÑÑ½¸(€€€€€€€€€€€€€€€€€€€½¹±¥¬õí…¹•±‘¥Ñô(€€€€€€€€€€€€€€€€€€€±…ÍÍ9…µ”ô‰µ¥¸µ ´äÉ½Õ¹‘•µ™Õ±°‰½É‘•È‰½É‘•Èµ‰½É‘•ÈÁà´ĞÑ•áĞµáÌ™½¹Ğµ‰½±Ñ•áĞµµÕÑ•µ™½É•É½Õ¹ÑÉ…¹Í¥Ñ¥½¸µ½±½ÉÌ¡½Ù•Èé‰œµÍÕÉ™…”´Èˆ(€€€€€€€€€€€€€€€€€€ø(€€€€€€€€€€€€€€€€€€€…¹•±…È(€€€€€€€€€€€€€€€€€€ğ½‰ÕÑÑ½¸ø(€€€€€€€€€€€€€€€€€€ñ‰ÕÑÑ½¸(€€€€€€€€€€€€€€€€€€€½¹±¥¬õì ¤€ôøÙ½¥Í…Ù•‘¥Ğ¡”¹¥¥ô(€€€€€€€€€€€€€€€€€€€‘¥Í…‰±•õíÍ…Ù¥¹œñğ€…•‘¥ÑÉ…™Ğ¹ÑÉ¥´ ¥ô(€€€€€€€€€€€€€€€€€€€±…ÍÍ9…µ”ô‰µ¥¸µ ´äÉ½Õ¹‘•µ™Õ±°‰œµÁÉ¥µ…ÉäÁà´ĞÑ•áĞµáÌ™½¹Ğµ•áÑÉ…‰½±Ñ•áĞµÁÉ¥µ…Éäµ™½É•É½Õ¹Í¡…‘½ÜµÍ´‘¥Í…‰±•é½Á…¥Ñä´ÔÀˆ(€€€€€€€€€€€€€€€€€€ø(€€€€€€€€€€€€€€€€€€€M…±Ù…È(€€€€€€€€€€€€€€€€€€ğ½‰ÕÑÑ½¸ø(€€€€€€€€€€€€€€€€ğ½‘¥Øø(€€€€€€€€€€€€€€ğ½‘¥Øø(€€€€€€€€€€€€¤€è€ (€€€€€€€€€€€€€€ñÀ±…ÍÍ9…µ”ô‰ÍÉ¥ÁÑÕÉ”µĞ´ÌÉ½Õ¹‘•µlÄáÁát‰½É‘•È‰½É‘•Èµ‰½É‘•È¼ÔÀ‰œµÍÕÉ™…”´È¼ÜÀÀ´Ì¸ÔÑ•áĞµ‰…Í”±•…‘¥¹œµÉ•±…á•Ñ•áĞµ™½É•É½Õ¹¼äÀˆø(€€€€€€€€€€€€€€€ƒŠqí”¹…¹Íİ•É÷Št(€€€€€€€€€€€€€€ğ½Àø(€€€€€€€€€€€€¥ô(€€€€€€€€€€ğ½…ÉÑ¥±”ø(€€€€€€€€¤ì(€€€€€ô¥ô(€€€€ğ½‘¥Øø(€€¤ì)ô(