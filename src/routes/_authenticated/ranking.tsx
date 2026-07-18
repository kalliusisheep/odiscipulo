import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ViewModeToggle } from "@/components/ViewModeToggle";
import { getLevel, CHARACTERS } from "@/data/content";
import { Flame, Trophy, Users, UserPlus, Medal } from "lucide-react";

export const Route = createFileRoute("/_authenticated/ranking")({
  component: RankingPage,
});

type Row = {
  id: string;
  display_name: string;
  avatar_char: string;
  xp: number;
  streak: number;
  isMe?: boolean;
};

function RankingPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [meId, setMeId] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const { data: u } = await supabase.auth.getUser();
      const myId = u.user?.id ?? null;
      setMeId(myId);
      const { data: me } = myId
        ? await supabase.from("profiles").select("id, display_name, avatar_char, xp, streak").eq("id", myId).maybeSingle()
        : { data: null };
      const { data: demo } = await supabase.from("demo_users").select("id, display_name, avatar_char, xp, streak");
      const merged: Row[] = [
        ...(demo ?? []).map((d) => ({ ...d, isMe: false }) as Row),
        ...(me ? [{ ...me, isMe: true } as Row] : []),
      ].sort((a, b) => b.xp - a.xp);
      setRows(merged);
    })();
  }, []);

  const medalColor = (i: number) =>
    i === 0 ? "text-ancient border-ancient" : i === 1 ? "text-muted-foreground border-muted-foreground" : i === 2 ? "text-orange-400 border-orange-400" : "text-muted-foreground border-border";

  return (
    <div className="mx-auto max-w-lg space-y-5 px-4 pt-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Sua célula</p>
          <h1 className="text-xl font-semibold">Ranking</h1>
        </div>
        <ViewModeToggle />
      </header>

      <section className="card-elevated overflow-hidden">
        <div className="bg-gradient-to-br from-primary/30 via-primary-glow/20 to-transparent p-5">
          <Trophy className="h-8 w-8 text-ancient" />
          <h2 className="mt-2 text-lg font-bold">Classificação</h2>
          <p className="text-xs text-muted-foreground">Discipulado e Constância — dentro do seu grupo.</p>
          <div className="mt-4 flex gap-2">
            <button className="flex flex-1 items-center justify-center gap-1 rounded-full bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground">
              <Users className="h-3.5 w-3.5" /> Convidar Célula
            </button>
            <button className="flex flex-1 items-center justify-center gap-1 rounded-full border border-border bg-background px-3 py-2 text-xs font-semibold">
              <UserPlus className="h-3.5 w-3.5" /> + Irmão
            </button>
          </div>
        </div>
      </section>

      <div className="space-y-2">
        {rows.map((row, i) => {
          const level = getLevel(row.xp);
          const ch = CHARACTERS.find((c) => c.id === row.avatar_char) ?? CHARACTERS[0];
          const isTop3 = i < 3;
          return (
            <div
              key={row.id}
              className={`card-elevated flex items-center gap-3 p-3 ${
                row.isMe ? "border-primary" : isTop3 ? `border ${medalColor(i).split(" ")[1]}` : ""
              }`}
            >
              <span className={`w-6 text-center text-sm font-bold ${medalColor(i).split(" ")[0]}`}>{i + 1}º</span>
              <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-surface-2 text-lg ${isTop3 ? `ring-2 ${medalColor(i).split(" ")[1]}` : ""}`}>
                {ch.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="flex items-center gap-1.5 truncate text-sm font-semibold">
                  {row.display_name}
                  {row.isMe && <span className="rounded bg-primary px-1.5 py-0.5 text-[9px] font-bold text-primary-foreground">VOCÊ</span>}
                </p>
                <p className="truncate text-[11px] text-muted-foreground">Nv {level.level} · {level.title}</p>
              </div>
              {isTop3 && <Medal className={`h-4 w-4 ${medalColor(i).split(" ")[0]}`} />}
              <div className="flex items-center gap-1 rounded-full bg-streak/15 px-2 py-1 text-xs font-bold text-streak">
                <Flame className="h-3 w-3" /> {row.streak}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
