import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { BookOpen, Heart, MessageCircle, Share2, Sparkles } from "lucide-react";
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
      const [c] = await Promise.all([getCounts(dateKey, u.user?.id ?? null)]);
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
      className="group relative block overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-all duration-300 hover:scale-[1.01] hover:border-primary/30 hover:bg-white/[0.08]"
    >
      <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary/20 blur-3xl transition-colors duration-500 group-hover:bg-primary/30" />

      <div className="relative flex items-center gap-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Sparkles className="h-4 w-4" />
        </span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-primary/90">
          Versículo do dia
        </span>
      </div>

      <p className="relative mt-3 line-clamp-3 text-sm italic leading-relaxed text-foreground/90 scripture">
        {text ? `"${text}"` : "Carregando…"}
      </p>

      <div className="relative mt-2 flex items-center justify-between">
        <span className="text-xs font-semibold text-primary/80">— {verse.ref_label}</span>
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Heart className={`h-3.5 w-3.5 ${counts.liked ? "fill-red-500 text-red-500" : ""}`} />
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
