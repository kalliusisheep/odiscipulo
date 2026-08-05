import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  Heart,
  MessageCircle,
  Share2,
  Sparkles,
} from "lucide-react";
import { fetchPassage, stripVerseNumbers } from "@/lib/bible";
import {
  fetchDailyVersePool,
  pickTodayVerse,
  verseDateKey,
  apiRefFor,
  type DailyVerseRow,
} from "@/lib/daily-verse";
import { getCounts } from "@/lib/daily-verse-social";
import { useApp } from "@/lib/app-context";
import { supabase } from "@/integrations/supabase/client";

export function VerseOfDayCard() {
  const { bibleVersion } = useApp();

  const [verse, setVerse] = useState<DailyVerseRow | null>(null);
  const [text, setText] = useState<string | null>(null);

  const [counts, setCounts] = useState({
    likeCount: 0,
    liked: false,
    commentCount: 0,
    shareCount: 0,
  });

  useEffect(() => {
    let alive = true;

    void (async () => {
      const pool = await fetchDailyVersePool();
      const today = pickTodayVerse(pool);

      if (!alive || !today) return;

      setVerse(today);

      const { data: u } = await supabase.auth.getUser();

      const dateKey = verseDateKey();

      const [c] = await Promise.all([
        getCounts(dateKey, u.user?.id ?? null),
      ]);

      if (alive) setCounts(c);
    })();

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!verse) return;

    let alive = true;

    fetchPassage(apiRefFor(verse), bibleVersion)
      .then((t) => alive && setText(stripVerseNumbers(t)))
      .catch(() => alive && setText(null));

    return () => {
      alive = false;
    };
  }, [verse, bibleVersion]);

  if (!verse) return null;

  return (
    <Link
      to="/versiculo"
      style={{
        background: "linear-gradient(135deg, rgba(161, 161, 170, 0.40) 0%, rgba(39, 39, 42, 0.72) 55%, rgba(0, 0, 0, 0.92) 100%)",
        minHeight: "11rem",
      }}
      className="
        group
        relative
        min-h-44
        overflow-hidden
        rounded-3xl
        border
        border-white/20
        bg-gradient-to-br
        from-zinc-400/40
        via-zinc-800/75
        to-black/90
        backdrop-blur-xl
        shadow-xl
        shadow-black/40
        transition-all
        duration-300
        hover:scale-[1.01]
        hover:bg-white/[0.06]
        hover:border-primary/30
      "
    >
      {/* Glow */}
      <div className="absolute -top-16 -right-16 h-44 w-44 rounded-full bg-zinc-100/10 blur-3xl transition-all duration-500 group-hover:bg-zinc-100/15" />

      {/* Barnabé */}
      <img
        src="/images/barnabee-reading.png"
        alt=""
        draggable={false}
        style={{ mixBlendMode: "screen" }}
        className="
          pointer-events-none
          select-none
          absolute
          right-1
          bottom-1
          h-44
          w-44
          object-contain
          object-bottom
          mix-blend-screen
          drop-shadow-2xl
          sm:h-48
          sm:w-48
          transition-all
          duration-500
          group-hover:opacity-100
          group-hover:scale-105
        "
      />

      <div className="relative z-10 p-5 pr-36 sm:pr-40">

        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
            <Sparkles className="h-4 w-4 text-white/80" />
          </div>

          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">
            Versículo do Dia
          </span>
        </div>

        <p
          className="
            mt-4
            font-sans
            not-italic
            text-sm
            leading-7
            font-medium
            text-white/95
          "
          style={{ fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" }}
        >
          {text
            ? `"${text}"`
            : "Carregando..."}
        </p>

        <div className="mt-3">
          <span className="text-xs font-semibold text-white/75">
            — {verse.ref_label}
          </span>
        </div>

        <div className="mt-4 flex items-center gap-4 text-[11px] text-muted-foreground">

          <span className="inline-flex items-center gap-1">
            <Heart
              className={`h-3.5 w-3.5 ${
                counts.liked
                  ? "fill-red-500 text-red-500"
                  : ""
              }`}
            />
            {counts.likeCount}
          </span>

          <span className="inline-flex items-center gap-1">
            <MessageCircle className="h-3.5 w-3.5" />
            {counts.commentCount}
          </span>

          <span className="inline-flex items-center gap-1">
            <Share2 className="h-3.5 w-3.5" />
            {counts.shareCount}
          </span>

          <BookOpen className="h-3.5 w-3.5 opacity-60" />

        </div>

      </div>

    </Link>
  );
}
