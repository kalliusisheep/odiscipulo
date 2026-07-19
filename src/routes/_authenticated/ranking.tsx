import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CHARACTERS } from "@/data/content";
import { getLevel } from "@/data/levels";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Flame, Users, UserPlus, Share2, Copy, Search, Link2, Check, Crown } from "lucide-react";

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

  const shareRanking = async () => {
    const me = rows[myIndex];
    const text = me
      ? `Estou em ${myIndex + 1}º de ${total} no Disciple — ${getLevel(me.streak).title} 🔥 ${me.streak} dias`
      : `Confira o ranking da minha célula no Disciple`;
    if (typeof navigator !== "undefined" && (navigator as Navigator & { share?: (d: ShareData) => Promise<void> }).share) {
      try {
        await (navigator as Navigator & { share: (d: ShareData) => Promise<void> }).share({ title: "Disciple", text, url: inviteLink });
        return;
      } catch {
        /* cancelled */
      }
    }
    try {
      await navigator.clipboard.writeText(`${text} — ${inviteLink}`);
      toast.success("Copiado para compartilhar!");
    } catch {
      toast.error("Não foi possível compartilhar.");
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

  const top3 = rows.slice(0, 3);
  const rest = rows.slice(3);
  const [first, second, third] = [top3[0], top3[1], top3[2]];

  return (
    <div className="mx-auto max-w-lg space-y-6 px-4 pt-6 pb-24">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Sua célula</p>
          <h1 className="text-xl font-semibold">Ranking</h1>
        </div>
        <ThemeToggle />
      </header>

      {/* Podium */}
      {top3.length > 0 && (
        <section className="card-elevated overflow-hidden bg-gradient-to-b from-primary/15 via-primary/5 to-transparent p-4 pt-6">
          <div className="flex items-end justify-center gap-3">
            {second && <PodiumSpot row={second} place={2} />}
            {first && <PodiumSpot row={first} place={1} />}
            {third && <PodiumSpot row={third} place={3} />}
          </div>
        </section>
      )}

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => void shareRanking()}
          className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-transform active:scale-95"
        >
          <Share2 className="h-4 w-4" /> Compartilhar
        </button>
        <button
          onClick={() => {
            setSearchId("");
            setSearchResult(null);
            setAddOpen(true);
          }}
          className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-surface-2 px-4 py-3 text-sm font-semibold transition-transform active:scale-95"
        >
          <UserPlus className="h-4 w-4" /> Adicionar Irmão
        </button>
      </div>

      {/* List */}
      <div className="space-y-2">
        {rest.map((row, idx) => {
          const i = idx + 3;
          const level = getLevel(row.streak);
          const ch = CHARACTERS.find((c) => c.id === row.avatar_char) ?? CHARACTERS[0];
          return (
            <div
              key={row.id}
              ref={row.isMe ? meRowRef : undefined}
              className={`flex items-center gap-3 rounded-2xl p-3 transition-all ${
                row.isMe
                  ? "border-2 border-primary bg-primary/10 shadow-[0_0_0_4px_hsl(var(--primary)/0.15)]"
                  : "border border-border bg-surface-2"
              }`}
            >
              <span className={`w-7 text-center text-sm font-bold ${row.isMe ? "text-primary" : "text-muted-foreground"}`}>
                {i + 1}
              </span>
              <div className="relative h-11 w-11 shrink-0">
                <div
                  className={`h-11 w-11 overflow-hidden rounded-full bg-surface ${
                    row.isMe ? "ring-2 ring-primary" : "ring-1 ring-border"
                  }`}
                >
                  {level.avatar ? (
                    <img src={level.avatar} alt={level.title} className="h-full w-full object-cover" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-lg">{ch.emoji}</span>
                  )}
                </div>
                <span className="absolute -bottom-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full border-2 border-background bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                  {level.level}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 truncate text-sm font-semibold">
                  {row.display_name}
                  {row.isMe && (
                    <span className="rounded bg-primary px-1.5 py-0.5 text-[9px] font-bold text-primary-foreground">VOCÊ</span>
                  )}
                </p>
                <p className="truncate text-[11px] text-muted-foreground">{level.title}</p>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-streak/15 px-2.5 py-1 text-xs font-bold text-streak">
                <Flame className="h-3.5 w-3.5" /> {row.streak}
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
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PodiumSpot({ row, place }: { row: Row; place: 1 | 2 | 3 }) {
  const level = getLevel(row.streak);
  const isFirst = place === 1;
  const size = isFirst ? "h-24 w-24" : "h-20 w-20";
  const ring =
    place === 1
      ? "ring-4 ring-ancient shadow-[0_0_24px_hsl(var(--ancient)/0.5)]"
      : place === 2
      ? "ring-4 ring-slate-300"
      : "ring-4 ring-orange-400";
  const block =
    place === 1
      ? "h-24 bg-gradient-to-b from-ancient to-ancient/60 text-background"
      : place === 2
      ? "h-16 bg-gradient-to-b from-slate-300 to-slate-400 text-slate-900"
      : "h-12 bg-gradient-to-b from-orange-400 to-orange-600 text-white";
  const order = place === 2 ? "order-1" : place === 1 ? "order-2" : "order-3";

  return (
    <div className={`flex w-1/3 flex-col items-center ${order}`}>
      {isFirst && (
        <div className="mb-1 flex items-center gap-1 rounded-full bg-ancient px-2 py-0.5 text-[10px] font-bold text-background shadow">
          <Crown className="h-3 w-3" /> LEVEL {level.level}
        </div>
      )}
      <div className={`relative ${size}`}>
        <div className={`h-full w-full overflow-hidden rounded-full bg-surface ${ring} ${row.isMe ? "outline outline-4 outline-primary/60" : ""}`}>
          {level.avatar ? (
            <img src={level.avatar} alt={level.title} className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-3xl">👤</span>
          )}
        </div>
        <span className="absolute -bottom-1 -right-1 flex h-6 min-w-[24px] items-center justify-center rounded-full border-2 border-background bg-primary px-1 text-[11px] font-bold text-primary-foreground">
          {level.level}
        </span>
      </div>
      <p className="mt-2 line-clamp-1 max-w-full text-center text-xs font-semibold">
        {row.display_name}
        {row.isMe && <span className="ml-1 rounded bg-primary px-1 text-[9px] text-primary-foreground">VOCÊ</span>}
      </p>
      <p className="flex items-center gap-1 text-[10px] font-bold text-streak">
        <Flame className="h-3 w-3" /> {row.streak}d
      </p>
      <div className={`mt-2 flex w-full items-start justify-center rounded-t-xl pt-2 text-lg font-black ${block}`}>
        {place}º
      </div>
    </div>
  );
}
