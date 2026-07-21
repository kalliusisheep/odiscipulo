import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getLevel, xpToNextLevel, levelProgressPct, MAX_LEVEL } from "@/data/levels";
import { CHARACTERS } from "@/data/content";
import { toast } from "sonner";
import {
  ArrowLeft,
  Flame,
  Trophy,
  BookOpen,
  Clock,
  Share2,
  Copy,
  Check,
  TrendingUp,
  Award,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/ranking-detalhes")({
  component: RankingDetalhesPage,
});

type Profile = {
  id: string;
  display_name: string;
  avatar_char: string;
  xp: number;
  streak: number;
};

function RankingDetalhesPage() {
  const [me, setMe] = useState<Profile | null>(null);
  const [lessonsCount, setLessonsCount] = useState(0);
  const [rankPos, setRankPos] = useState<{ pos: number; total: number } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    void (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { data: p } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_char, xp, streak")
        .eq("id", u.user.id)
        .maybeSingle();
      if (p) setMe(p as Profile);

      const { count } = await supabase
        .from("lesson_progress")
        .select("*", { count: "exact", head: true })
        .eq("user_id", u.user.id);
      setLessonsCount(count ?? 0);

      const { data: demo } = await supabase.from("demo_users").select("xp");
      const all = [...(demo ?? []).map((d) => d.xp), ...(p ? [p.xp] : [])].sort((a, b) => b - a);
      if (p) {
        const pos = all.findIndex((x) => x === p.xp) + 1;
        setRankPos({ pos, total: all.length });
      }
    })();
  }, []);

  const level = useMemo(() => (me ? getLevel(me.xp) : null), [me]);
  const toNext = useMemo(() => (me ? xpToNextLevel(me.xp) : null), [me]);
  const ch = me ? CHARACTERS.find((c) => c.id === me.avatar_char) ?? CHARACTERS[0] : null;

  const shareText = me && level && rankPos
    ? `🔥 Estou em ${rankPos.pos}º lugar no Disciple!\n\n${level.title} · Nível ${level.level}\n⚡ ${me.xp} XP · 🔥 ${me.streak} dias de ofensiva\n📖 ${lessonsCount} lições concluídas\n\nDiscípule-se comigo:`
    : "";
  const shareUrl = typeof window !== "undefined" ? window.location.origin : "";

  const copyShare = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setCopied(true);
      toast.success("Copiado para compartilhar!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Não foi possível copiar.");
    }
  };

  const nativeShare = async () => {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await (navigator as Navigator).share({ title: "Meu ranking no Disciple", text: shareText, url: shareUrl });
      } catch {
        /* cancelado */
      }
    } else {
      void copyShare();
    }
  };

  if (!me || !level) return <div className="p-6 text-sm text-muted-foreground">Carregando…</div>;

  const progressPct = levelProgressPct(me.xp);

  return (
    <div className="mx-auto max-w-lg space-y-5 px-4 pt-6 pb-24">
      <header className="flex items-center gap-3">
        <Link
          to="/ranking"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <p className="text-xs text-muted-foreground">Ranking</p>
          <h1 className="text-xl font-semibold">Meus detalhes</h1>
        </div>
      </header>

      <section className="card-elevated overflow-hidden">
        <div className="bg-gradient-to-br from-primary/30 via-primary-glow/20 to-transparent p-6 text-center">
          <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl bg-surface-2 ring-2 ring-primary/40 text-6xl">
            {level.avatar ? (
              <img src={level.avatar} alt={level.title} className="h-full w-full object-cover" />
            ) : (
              <span>{ch?.emoji}</span>
            )}
          </div>
          <h2 className="mt-3 text-lg font-bold">{me.display_name}</h2>
          <p className="text-xs text-muted-foreground">Sua Patente</p>
          <p className="text-base font-semibold text-primary">
            Nível {level.level} / {MAX_LEVEL} · {level.title}
          </p>
          {rankPos && (
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-3 py-1 text-xs font-bold text-primary">
              <Trophy className="h-3.5 w-3.5" /> {rankPos.pos}º de {rankPos.total} na sua célula
            </div>
          )}
        </div>

        <div className="border-t border-border p-4">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progresso ao próximo nível</span>
            <span className="font-semibold">
              {toNext === null ? "Máximo!" : `Faltam ${toNext} XP`}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary-glow transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <Stat icon={Trophy} label="Nível" value={String(level.level)} />
        <Stat icon={Flame} label="Ofensiva" value={`${me.streak}d`} accent="text-streak" />
        <Stat icon={TrendingUp} label="XP total" value={String(me.xp)} />
        <Stat icon={BookOpen} label="Lições" value={String(lessonsCount)} />
        <Stat icon={Clock} label="Tempo estudo" value={`${lessonsCount * 8}m`} />
        <Stat icon={Award} label="Posição" value={rankPos ? `${rankPos.pos}º` : "—"} accent="text-primary" />
      </section>

      <section className="card-elevated p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Prévia do compartilhamento
        </p>
        <pre className="whitespace-pre-wrap rounded-xl bg-surface-2 p-3 text-xs leading-relaxed">{shareText}</pre>
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => void nativeShare()}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            <Share2 className="h-4 w-4" /> Compartilhar
          </button>
          <button
            onClick={() => void copyShare()}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-border bg-background px-3 py-2.5 text-sm font-semibold"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copiado" : "Copiar texto"}
          </button>
        </div>
      </section>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="card-elevated p-3 text-center">
      <Icon className={`mx-auto h-4 w-4 ${accent ?? "text-primary"}`} />
      <p className="mt-1 text-lg font-bold">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}
