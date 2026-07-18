import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ViewModeToggle } from "@/components/ViewModeToggle";
import { CHARACTERS } from "@/data/content";
import { getLevel } from "@/data/levels";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";

import { Flame, Trophy, Users, UserPlus, Medal, BarChart3, Copy, Search, Link2, Check } from "lucide-react";

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
  const [addOpen, setAddOpen] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState<Row | null | "notfound">(null);
  const [copied, setCopied] = useState(false);
  const meRowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    void (async () => {
      const { data: u } = await supabase.auth.getUser();
      const myId = u.user?.id ?? null;
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

  const myIndex = useMemo(() => rows.findIndex((r) => r.isMe), [rows]);
  const myRow = myIndex >= 0 ? rows[myIndex] : null;
  const total = rows.length;

  const inviteLink = typeof window !== "undefined" ? `${window.location.origin}/auth?invite=celula` : "";

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      toast.success("Link copiado!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Não foi possível copiar.");
    }
  };

  const findUser = async () => {
    const id = searchId.trim();
    if (!id) return;
    const { data } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_char, xp, streak")
      .eq("id", id)
      .maybeSingle();
    setSearchResult((data as Row) ?? "notfound");
  };

  const medalColor = (i: number) =>
    i === 0
      ? "text-ancient border-ancient"
      : i === 1
      ? "text-muted-foreground border-muted-foreground"
      : i === 2
      ? "text-orange-400 border-orange-400"
      : "text-muted-foreground border-border";

  const scrollToMe = () => {
    meRowRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="mx-auto max-w-lg space-y-5 px-4 pt-6 pb-24">
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
            <Link
              to="/ranking-detalhes"
              className="flex flex-1 items-center justify-center gap-1 rounded-full bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
            >
              <BarChart3 className="h-3.5 w-3.5" /> Detalhes
            </Link>
            <button
              onClick={() => {
                setSearchId("");
                setSearchResult(null);
                setAddOpen(true);
              }}
              className="flex flex-1 items-center justify-center gap-1 rounded-full border border-border bg-background px-3 py-2 text-xs font-semibold"
            >
              <UserPlus className="h-3.5 w-3.5" /> + Irmão
            </button>
          </div>
        </div>
      </section>

      {myRow && (
        <button
          onClick={scrollToMe}
          className="card-elevated flex w-full items-center gap-3 border-primary bg-primary/5 p-3 text-left transition-all hover:bg-primary/10"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/20 text-primary">
            <Trophy className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Sua posição</p>
            <p className="text-sm font-bold">
              {myIndex + 1}º de {total} · {getLevel(myRow.streak).title}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-primary">{myRow.xp}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">XP</p>
          </div>
        </button>
      )}

      <div className="space-y-2">
        {rows.map((row, i) => {
          const level = getLevel(row.streak);
          const ch = CHARACTERS.find((c) => c.id === row.avatar_char) ?? CHARACTERS[0];
          const isTop3 = i < 3;
          return (
            <div
              key={row.id}
              ref={row.isMe ? meRowRef : undefined}
              className={`card-elevated flex items-center gap-3 p-3 transition-all ${
                row.isMe
                  ? "border-2 border-primary bg-primary/10 shadow-[0_0_0_4px_hsl(var(--primary)/0.15)]"
                  : isTop3
                  ? `border ${medalColor(i).split(" ")[1]}`
                  : ""
              }`}
            >
              <span className={`w-6 text-center text-sm font-bold ${row.isMe ? "text-primary" : medalColor(i).split(" ")[0]}`}>
                {i + 1}º
              </span>
              <div
                className={`flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-surface-2 text-lg ${
                  row.isMe ? "ring-2 ring-primary" : isTop3 ? `ring-2 ${medalColor(i).split(" ")[1]}` : ""
                }`}
              >
                {level.avatar ? (
                  <img src={level.avatar} alt={level.title} className="h-full w-full object-cover" />
                ) : (
                  <span>{ch.emoji}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="flex items-center gap-1.5 truncate text-sm font-semibold">
                  {row.display_name}
                  {row.isMe && (
                    <span className="rounded bg-primary px-1.5 py-0.5 text-[9px] font-bold text-primary-foreground">VOCÊ</span>
                  )}
                </p>
                <p className="truncate text-[11px] text-muted-foreground">
                  Nv {level.level} · {level.title}
                </p>
              </div>
              {isTop3 && !row.isMe && <Medal className={`h-4 w-4 ${medalColor(i).split(" ")[0]}`} />}
              <div className="flex items-center gap-1 rounded-full bg-streak/15 px-2 py-1 text-xs font-bold text-streak">
                <Flame className="h-3 w-3" /> {row.streak}
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" /> Adicionar irmão
            </DialogTitle>
            <DialogDescription>
              Encontre um irmão pelo ID de usuário ou envie um convite pela sua rede.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Buscar por ID</p>
              <div className="flex gap-2">
                <input
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="Cole o ID de usuário"
                  className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
                <button
                  onClick={() => void findUser()}
                  className="flex items-center gap-1 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
                >
                  <Search className="h-4 w-4" /> Buscar
                </button>
              </div>

              {searchResult === "notfound" && (
                <p className="mt-2 text-xs text-destructive">Nenhum irmão encontrado com esse ID.</p>
              )}
              {searchResult && searchResult !== "notfound" && (
                <div className="mt-3 flex items-center gap-3 rounded-xl border border-border bg-surface-2 p-3">
                  <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-surface">
                    {getLevel(searchResult.streak).avatar ? (
                      <img
                        src={getLevel(searchResult.streak).avatar}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span>👤</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold">{searchResult.display_name}</p>
                    <p className="truncate text-[11px] text-muted-foreground">
                      Nv {getLevel(searchResult.streak).level} · {getLevel(searchResult.streak).title}
                    </p>
                  </div>
                  <button
                    onClick={() => toast.success("Convite enviado!")}
                    className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                  >
                    Convidar
                  </button>
                </div>
              )}
            </div>

            <div className="border-t border-border pt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Link compartilhável</p>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-2 p-2">
                <Link2 className="ml-1 h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="flex-1 truncate text-xs">{inviteLink}</span>
                <button
                  onClick={() => void copyLink()}
                  className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copiado" : "Copiar"}
                </button>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                Compartilhe pelo WhatsApp, e-mail ou redes sociais para chamar sua célula.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
