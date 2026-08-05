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
      className="group relative block overflow-hidden transition-transform duration-300 hover:scale-[1.01]"
      style={{
        minHeight: "11.5rem",
        border: "1px solid rgba(255, 255, 255, 0.18)",
        borderRadius: "1.5rem",
        background:
          "linear-gradient(135deg, rgba(161, 161, 170, 0.32) 0%, rgba(63, 63, 70, 0.56) 52%, rgba(0, 0, 0, 0.82) 100%)",
        boxShadow: "0 18px 36px -22px rgba(0, 0, 0, 0.85)",
        backdropFilter: "blur(16px)",
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "rgba(255, 255, 255, 0.025)" }}
      />

      <img
        src="/images/barnabee-reading.png"
        alt=""
        draggable={false}
        className="pointer-events-none absolute select-none"
        style={{
          right: "0.35rem",
          bottom: "0.35rem",
          width: "9.5rem",
          height: "9.5rem",
          objectFit: "contain",
          mixBlendMode: "screen",
          filter: "drop-shadow(0 10px 12px rgba(0, 0, 0, 0.7))",
        }}
      />

      <div
        className="relative z-10"
        style={{
          padding: "1.25rem 9.75rem 1.25rem 1.25rem",
          minHeight: "11.5rem",
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{ background: "rgba(255, 255, 255, 0.10)" }}
          >
            <Sparkles className="h-4 w-4 text-white/85" />
          </div>

          <span
            className="text-[10px] font-bold uppercase tracking-[0.18em]"
            style={{ color: "rgba(255, 255, 255, 0.70)" }}
          >
            Versículo do Dia
          </span>
        </div>

        <p
          className="mt-4 text-sm font-medium leading-7"
          style={{
            color: "rgba(255, 255, 255, 0.94)",
            fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
            fontStyle: "normal",
          }}
        >
          {text ? `"${text}"` : "Carregando..."}
        </p>

        <div className="mt-3">
          <span
            className="text-xs font-semibold"
            style={{
              color: "rgba(255, 255, 255, 0.72)",
              fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
            }}
          >
            — {verse.ref_label}
          </span>
        </div>

        <div className="mt-4 flex items-center gap-3 text-[11px] text-white/65">
          <span className="inline-flex items-center gap-1">
            <Heart
              className={`h-3.5 w-3.5 ${
                counts.liked ? "fill-red-500 text-red-500" : ""
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
