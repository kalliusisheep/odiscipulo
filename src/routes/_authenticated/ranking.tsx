import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CHARACTERS } from "@/data/content";
import { getLevel } from "@/data/levels";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { normalizeUsername } from "@/lib/username";
import { Flame, Users, UserPlus, Share2, Copy, Search, Link2, Check, Crown, AtSign } from "lucide-react";

export const Route = createFileRoute("/_authenticated/ranking")({
  component: RankingPage,
});

type Row = {
  id: string;
  display_name: string;
  username: string | null;
  avatar_char: string;
  avatar_url?: string | null;
  xp: number;
  streak: number;
  isMe?: boolean;
  isFriend?: boolean;
  isDemo?: boolean;
};

function RankingPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [myUsername, setMyUsername] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<Row | null | "notfound">(null);
  const [alreadyFriend, setAlreadyFriend] = useState(false);
  const [adding, setAdding] = useState(false);
  const [copied, setCopied] = useState(false);
  const meRowRef = useRef<HTMLDivElement | null>(null);

  const load = async () => {
    const { data: u } = await supabase.auth.getUser();
    const myId = u.user?.id ?? null;
    const { data: me } = myId
      ? await supabase
          .from("profiles")
          .select("id, display_name, username, avatar_char, avatar_url, xp, streak")
          .eq("id", myId)
          .maybeSingle()
      : { data: null };
    if (me?.username) setMyUsername(me.username);

    // Friends
    let friendProfiles: Row[] = [];
    if (myId) {
      const { data: fr } = await supabase.from("friendships").select("friend_id").eq("user_id", myId);
      const friendIds = (fr ?? []).map((r) => r.friend_id);
      if (friendIds.length > 0) {
        const { data: fp } = await supabase
          .from("profiles")
          .select("id, display_name, username, avatar_char, avatar_url, xp, streak")
          .in("id", friendIds);
        friendProfiles = (fp ?? []).map((p) => ({ ...p, isFriend: true }) as Row);
      }
    }

    const { data: demo } = await supabase.from("demo_users").select("id, display_name, avatar_char, xp, streak");
    const merged: Row[] = [
      ...(demo ?? []).map((d) => ({ ...d, username: null, avatar_url: null, isDemo: true }) as Row),
      ...friendProfiles,
      ...(me ? [{ ...me, isMe: true } as Row] : []),
    ].sort((a, b) => b.xp - a.xp);
    setRows(merged);
  };

  useEffect(() => {
    void load();
  }, []);

  const myIndex = useMemo(() => rows.findIndex((r) => r.isMe), [rows]);
  const total = rows.length;

  const inviteLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/auth${myUsername ? `?invite=${encodeURIComponent(myUsername)}` : ""}`
      : "";

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
      ? `Estou em ${myIndex + 1}º de ${total} no Disciple — ${getLevel(me.xp).title} 🔥 ${me.streak} dias`
      : `Confira o ranking da minha célula no Disciple`;
    const nav = navigator as Navigator & { share?: (d: ShareData) => Promise<void> };
    if (typeof navigator !== "undefined" && nav.share) {
      try {
        await nav.share({ title: "Disciple", text, url: inviteLink });
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
    const raw = searchInput.trim().replace(/^@/, "");
    if (!raw) return;
    setSearching(true);
    setSearchResult(null);
    setAlreadyFriend(false);
    const uname = normalizeUsername(raw);
    const { data } = await supabase
      .from("profiles")
      .select("id, display_name, username, avatar_char, avatar_url, xp, streak")
      .ilike("username", uname)
      .maybeSingle();
    setSearching(false);
    if (!data) {
      setSearchResult("notfound");
      return;
    }
    setSearchResult(data as Row);
    const { data: u } = await supabase.auth.getUser();
    if (u.user && data.id === u.user.id) {
      setAlreadyFriend(true);
      return;
    }
    if (u.user) {
      const { data: existing } = await supabase
        .from("friendships")
        .select("user_id")
        .eq("user_id", u.user.id)
        .eq("friend_id", data.id)
        .maybeSingle();
      setAlreadyFriend(!!existing);
    }
  };

  const addFriend = async () => {
    if (!searchResult || searchResult === "notfound") return;
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    if (searchResult.id === u.user.id) {
      toast.error("Você não pode adicionar a si mesmo.");
      return;
    }
    setAdding(true);
    // bidirectional: two rows
    const { error } = await supabase.from("friendships").insert([
      { user_id: u.user.id, friend_id: searchResult.id },
      { user_id: searchResult.id, friend_id: u.user.id },
    ]);
    setAdding(false);
    if (error && !/duplicate/i.test(error.message)) {
      toast.error("Não foi possível adicionar. Tente novamente.");
      return;
    }
    toast.success(`${searchResult.display_name} adicionado(a) como irmão!`);
    setAddOpen(false);
    setSearchInput("");
    setSearchResult(null);
    await load();
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
        <section className="card-elevated overflow-hidden bg-gradient-to-b from-primary/15 via-primary/5 to-transparent">
         <div className="relative">
            <img
              src="/ranking-banner.png"
              alt="Ovelhas comemorando com troféu"
              className="h-96 w-full object-cover object-top"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-b from-transparent to-background" />
          </div>
          <div className="-mt-32 flex items-end justify-center gap-3 px-4 pb-4">
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
            setSearchInput("");
            setSearchResult(null);
            setAlreadyFriend(false);
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
          const level = getLevel(row.xp);
          const ch = CHARACTERS.find((c) => c.id === row.avatar_char) ?? CHARACTERS[0];
          const inner = (
            <div
              ref={row.isMe ? meRowRef : undefined}
              className={`flex items-center gap-3 rounded-2xl p-3 transition-all ${
                row.isMe
                  ? "border-2 border-primary bg-primary/10 shadow-[0_0_0_4px_hsl(var(--primary)/0.15)]"
                  : "border border-border bg-surface-2 hover:border-primary/40"
              }`}
            >
              <span className={`w-7 text-center text-sm font-bold ${row.isMe ? "text-primary" : "text-muted-foreground"}`}>
                {i + 1}
              </span>
              <div className="relative h-11 w-11 shrink-0">
                <div className={`h-11 w-11 overflow-hidden rounded-full bg-surface ${row.isMe ? "ring-2 ring-primary" : "ring-1 ring-border"}`}>
                  {row.avatar_url ? (
                    <img src={row.avatar_url} alt="" className="h-full w-full object-cover" />
                  ) : level.avatar ? (
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
                  {row.isFriend && !row.isMe && (
                    <span className="rounded bg-success/20 px-1.5 py-0.5 text-[9px] font-bold text-success">IRMÃO</span>
                  )}
                </p>
                <p className="truncate text-[11px] text-muted-foreground">{level.title}</p>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-streak/15 px-2.5 py-1 text-xs font-bold text-streak">
                <Flame className="h-3.5 w-3.5" /> {row.streak}
              </div>
            </div>
          );
          if (row.username && !row.isMe) {
            return (
              <Link key={row.id} to="/perfil/$username" params={{ username: row.username }} className="block">
                {inner}
              </Link>
            );
          }
          return <div key={row.id}>{inner}</div>;
        })}
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" /> Adicionar irmão
            </DialogTitle>
            <DialogDescription>
              Busque pelo @ID de usuário ou envie um convite pela sua rede.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Buscar por @ID</p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <AtSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") void findUser();
                    }}
                    placeholder="ex: pedro.silva123"
                    className="w-full rounded-xl border border-border bg-background pl-9 pr-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
                <button
                  onClick={() => void findUser()}
                  disabled={searching}
                  className="flex items-center gap-1 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
                >
                  <Search className="h-4 w-4" /> Buscar
                </button>
              </div>

              {searchResult === "notfound" && (
                <p className="mt-2 text-xs text-destructive">Nenhum irmão encontrado com esse @ID.</p>
              )}
              {searchResult && searchResult !== "notfound" && (
                <div className="mt-3 flex items-center gap-3 rounded-xl border border-border bg-surface-2 p-3">
                  <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-surface">
                    {searchResult.avatar_url ? (
                      <img src={searchResult.avatar_url} alt="" className="h-full w-full object-cover" />
                    ) : getLevel(searchResult.xp).avatar ? (
                      <img src={getLevel(searchResult.xp).avatar} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <span>👤</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold">{searchResult.display_name}</p>
                    <p className="truncate text-[11px] text-muted-foreground">
                      @{searchResult.username} · Nv {getLevel(searchResult.xp).level}
                    </p>
                  </div>
                  {alreadyFriend ? (
                    <span className="rounded-full bg-success/20 px-3 py-1.5 text-xs font-semibold text-success">Já adicionado</span>
                  ) : (
                    <button
                      onClick={() => void addFriend()}
                      disabled={adding}
                      className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground disabled:opacity-60"
                    >
                      {adding ? "Adicionando…" : "Adicionar"}
                    </button>
                  )}
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
  const level = getLevel(row.xp);
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

  const body = (
    <>
      {isFirst && (
        <div className="mb-1 flex items-center gap-1 rounded-full bg-ancient px-2 py-0.5 text-[10px] font-bold text-background shadow">
          <Crown className="h-3 w-3" /> LEVEL {level.level}
        </div>
      )}
      <div className={`relative ${size}`}>
        <div className={`h-full w-full overflow-hidden rounded-full bg-surface ${ring} ${row.isMe ? "outline outline-4 outline-primary/60" : ""}`}>
          {row.avatar_url ? (
            <img src={row.avatar_url} alt="" className="h-full w-full object-cover" />
          ) : level.avatar ? (
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
    </>
  );

  const cls = `flex w-1/3 flex-col items-center ${order}`;
  if (row.username && !row.isMe) {
    return (
      <Link to="/perfil/$username" params={{ username: row.username }} className={cls}>
        {body}
      </Link>
    );
  }
  return <div className={cls}>{body}</div>;
}
