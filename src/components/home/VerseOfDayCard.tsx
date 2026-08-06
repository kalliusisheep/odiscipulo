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
  const { bibleVersion, language } = useApp();

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

    fetchPassage(apiRefFor(verse), bibleVersion, language)
      .then((t) => alive && setText(stripVerseNumbers(t)))
      .catch(() => alive && setText(null));

    return () => {
      alive = false;
    };
  }, [verse, bibleVersion, language]);

  if (!verse) return null;

  return (
    <Link
      to="/versiculo"
      className="group relative block overflow-hidden transition-transform duration-300 hover:scale-[1.01]"
      style={{
        minHeight: "10rem",
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
        src="/images/barnabee-reading-closeup.webp"
        alt=""
        draggable={false}
        className="pointer-events-none absolute select-none"
        style={{
          right: "0",
          bottom: "0",
          width: "8.25rem",
          height: "auto",
          objectFit: "contain",
          objectPosition: "right bottom",
          filter: "drop-shadow(0 10px 12px rgba(0, 0, 0, 0.7))",
        }}
      />

      <div
        className="relative z-10"
        style={{
          padding: "1rem 8.5rem 0.85rem 1rem",
          minHeight: "11.5rem",
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-xl"
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
          className="mt-3 text-[13px] font-medium leading-6"
          style={{
            color: "rgba(255, 255, 255, 0.94)",
            fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
            fontStyle: "normal",
          }}
        >
          {text ? `"${text}"` : "Carregando..."}
        </p>

        <div className="mt-2">
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

        <div className="mt-3 flex items-center gap-3 text-sm text-white/70">
          <span className="inline-flex items-center gap-1">
            <Heart
              className={`h-5 w-5 ${
                counts.liked ? "fill-red-500 text-red-500" : ""
              }`}
            />
            {counts.likeCount}
          </span>

          <span className="inline-flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            {counts.commentCount}
          </span>

          <span className="inline-flex items-center gap-1">
            <Share2 className="h-4 w-4" />
            {counts.shareCount}
          </span>

          <BookOpen className="h-4 w-4 opacity-60" />
        </div>
      </div>
    </Link>
  );
}
