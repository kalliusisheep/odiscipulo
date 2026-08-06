import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, Copy, Crown, Loader2, Plus, Search, Share2, Sparkles, UserPlus, Users, Wifi } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/jogos/multiplayer")({
  validateSearch: (search: Record<string, unknown>) => ({
    roomId: typeof search.roomId === "string" ? search.roomId : undefined,
  }),
  component: MultiplayerPage,
});

type Friend = { id: string; display_name: string; avatar_url: string | null };
type Player = { user_id: string; role: "host" | "player"; state: string; display_name: string; avatar_url: string | null; last_seen_at: string };
type Room = { id: string; host_id: string; max_players: number; difficulty: string; rounds: number; status: string };

const gameDb = supabase as any;

function MultiplayerPage() {
  const { roomId: initialRoomId } = Route.useSearch();
  const [myId, setMyId] = useState<string | null>(null);
  const [roomId, setRoomId] = useState(initialRoomId ?? null);
  const [room, setRoom] = useState<Room | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendSearch, setFriendSearch] = useState("");
  const [maxPlayers, setMaxPlayers] = useState(2);
  const [rounds, setRounds] = useState(10);
  const [difficulty, setDifficulty] = useState("medio");
  const [created, setCreated] = useState(Boolean(initialRoomId));
  const [loading, setLoading] = useState(Boolean(initialRoomId));
  const [busy, setBusy] = useState(false);

  const loadFriends = async (userId: string) => {
    const { data: friendshipRows } = await gameDb.from("friendships").select("friend_id").eq("user_id", userId);
    const ids = (friendshipRows ?? []).map((row: { friend_id: string }) => row.friend_id);
    if (!ids.length) return setFriends([]);
    const { data } = await gameDb.from("profiles").select("id,display_name,avatar_url").in("id", ids).order("display_name");
    setFriends((data ?? []) as Friend[]);
  };

  const loadRoom = async (nextRoomId: string, userId: string) => {
    const [{ data: nextRoom, error: roomError }, { data: roomPlayers }] = await Promise.all([
      gameDb.from("character_game_rooms").select("id,host_id,max_players,difficulty,rounds,status").eq("id", nextRoomId).maybeSingle(),
      gameDb.from("character_game_room_players").select("user_id,role,state,last_seen_at").eq("room_id", nextRoomId),
    ]);
    if (roomError || !nextRoom) {
      toast.error("Essa sala não está mais disponível.");
      return;
    }
    const playerIds = (roomPlayers ?? []).map((player: { user_id: string }) => player.user_id);
    const { data: profiles } = playerIds.length ? await gameDb.from("profiles").select("id,display_name,avatar_url").in("id", playerIds) : { data: [] };
    const profileMap = new Map((profiles ?? []).map((profile: Friend) => [profile.id, profile]));
    setRoom(nextRoom as Room);
    setRoomId(nextRoomId);
    setMaxPlayers(nextRoom.max_players);
    setRounds(nextRoom.rounds);
    setDifficulty(nextRoom.difficulty);
    setPlayers((roomPlayers ?? []).map((player: { user_id: string; role: "host" | "player"; state: string; last_seen_at: string }) => ({
      ...player,
      display_name: profileMap.get(player.user_id)?.display_name ?? (player.user_id === userId ? "Você" : "Jogador"),
      avatar_url: profileMap.get(player.user_id)?.avatar_url ?? null,
    })));
    setCreated(true);
    setLoading(false);
  };

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let cancelled = false;
    const targetRoomId = roomId ?? initialRoomId;
    const boot = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user || cancelled) return;
      setMyId(data.user.id);
      await loadFriends(data.user.id);
      if (targetRoomId) {
        await loadRoom(targetRoomId, data.user.id);
        channel = supabase.channel(`game-room-${targetRoomId}`).on("postgres_changes", { event: "*", schema: "public", table: "character_game_room_players", filter: `room_id=eq.${targetRoomId}` }, () => void loadRoom(targetRoomId, data.user.id)).on("postgres_changes", { event: "UPDATE", schema: "public", table: "character_game_rooms", filter: `id=eq.${targetRoomId}` }, () => void loadRoom(targetRoomId, data.user.id)).subscribe();
      }
    };
    void boot();
    return () => { cancelled = true; if (channel) void supabase.removeChannel(channel); };
  }, [initialRoomId, roomId]);

  const filteredFriends = useMemo(() => friends.filter((friend) => friend.display_name.toLowerCase().includes(friendSearch.toLowerCase())), [friends, friendSearch]);
  const activePlayers = players.filter((player) => !["declined", "left"].includes(player.state));
  const isHost = room?.host_id === myId;
  const me = players.find((player) => player.user_id === myId);
  const canStart = isHost && activePlayers.length >= 2 && activePlayers.every((player) => ["ready", "connected"].includes(player.state));

  const createRoom = async () => {
    if (!myId || busy) return;
    setBusy(true);
    try {
      const { data: newRoom, error } = await gameDb.from("character_game_rooms").insert({ host_id: myId, max_players: maxPlayers, difficulty, rounds }).select("id").single();
      if (error || !newRoom) throw error ?? new Error("room_creation_failed");
      const { error: playerError } = await gameDb.from("character_game_room_players").insert({ room_id: newRoom.id, user_id: myId, role: "host", state: "connected" });
      if (playerError) throw playerError;
      await loadRoom(newRoom.id, myId);
      window.history.replaceState({}, "", `/jogos/multiplayer?roomId=${newRoom.id}`);
      toast.success("Sala criada. Convide seus amigos!");
    } catch {
      toast.error("Não foi possível criar a sala.");
    } finally {
      setBusy(false);
    }
  };

  const inviteFriend = async (friend: Friend) => {
    if (!roomId || busy) return;
    setBusy(true);
    try {
      const { error } = await gameDb.rpc("invite_character_game_player", { _room_id: roomId, _user_id: friend.id });
      if (error) throw error;
      toast.success(`${friend.display_name} recebeu seu convite.`);
      if (myId) await loadRoom(roomId, myId);
    } catch (error) {
      const message = String((error as { message?: string })?.message ?? "");
      toast.error(message.includes("room_full") ? "A sala já está cheia." : "Não foi possível enviar o convite.");
    } finally {
      setBusy(false);
    }
  };

  const toggleReady = async () => {
    if (!roomId || !myId || !me || busy) return;
    setBusy(true);
    try {
      const nextState = me.state === "ready" ? "connected" : "ready";
      const { error } = await gameDb.from("character_game_room_players").update({ state: nextState, last_seen_at: new Date().toISOString() }).eq("room_id", roomId).eq("user_id", myId);
      if (error) throw error;
      await loadRoom(roomId, myId);
    } catch {
      toast.error("Não foi possível atualizar seu status.");
    } finally {
      setBusy(false);
    }
  };

  const startGame = async () => {
    if (!roomId || !canStart || busy) return;
    setBusy(true);
    try {
      const { error } = await gameDb.from("character_game_rooms").update({ status: "playing", started_at: new Date().toISOString() }).eq("id", roomId).eq("host_id", myId);
      if (error) throw error;
      toast.success("Partida iniciada!");
    } catch {
      toast.error("A partida precisa de dois jogadores prontos.");
    } finally {
      setBusy(false);
    }
  };

  const copyInvite = async () => {
    if (!roomId) return;
    await navigator.clipboard?.writeText(`${window.location.origin}/jogos/multiplayer?roomId=${roomId}`);
    toast.success("Convite copiado!");
  };

  if (loading) return <main className="flex min-h-screen items-center justify-center bg-background"><Loader2 className="h-8 w-8 animate-spin text-primary" /></main>;
  return <main className="min-h-screen bg-background"><div className="mx-auto max-w-lg px-4 pb-28 pt-5"><Link to="/jogos" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground"><ArrowLeft className="h-4 w-4" /> Jogos</Link><header className="mt-7"><p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-ancient">Multiplayer</p><h1 className="mt-1 text-3xl font-extrabold">Sala de desafio</h1><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Convide amigos, acompanhe quem está conectado e comece quando todos estiverem prontos.</p></header>
    {!created ? <section className="mt-7 space-y-6 rounded-[1.75rem] border border-border bg-surface p-5"><div><p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Limite da sala</p><div className="mt-3 grid grid-cols-3 gap-2">{[2, 3, 4].map((value) => <button type="button" key={value} onClick={() => setMaxPlayers(value)} className={`rounded-2xl border py-3 text-sm font-extrabold ${maxPlayers === value ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}>{value} jogadores</button>)}</div></div><div className="grid grid-cols-2 gap-3"><label className="text-xs font-bold text-muted-foreground">Dificuldade<select value={difficulty} onChange={(event) => setDifficulty(event.target.value)} className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-3 text-sm font-bold text-foreground"><option value="facil">Fácil</option><option value="medio">Médio</option><option value="dificil">Difícil</option><option value="bereano">Bereano Supremo</option></select></label><label className="text-xs font-bold text-muted-foreground">Rodadas<select value={rounds} onChange={(event) => setRounds(Number(event.target.value))} className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-3 text-sm font-bold text-foreground"><option value="5">5</option><option value="10">10</option><option value="20">20</option><option value="30">30</option></select></label></div><button type="button" onClick={() => void createRoom()} disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-4 text-sm font-extrabold text-primary-foreground shadow-lg shadow-primary/20 disabled:opacity-50"><Plus className="h-4 w-4" /> Criar sala</button></section> : <><section className="mt-7 rounded-[1.75rem] border border-primary/25 bg-surface p-5 shadow-lg shadow-primary/5"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-extrabold uppercase tracking-wider text-primary">Lobby sincronizado</p><h2 className="mt-1 text-xl font-extrabold">Jogadores: {activePlayers.length} de {room?.max_players}</h2></div><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-success/10 text-success"><Wifi className="h-5 w-5" /></span></div><button type="button" onClick={() => void copyInvite()} className="mt-5 flex w-full items-center justify-between rounded-2xl border border-border bg-background px-4 py-3 text-left"><span><span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Compartilhar convite</span><span className="mt-1 block font-mono text-sm font-extrabold tracking-wider">{roomId?.slice(0, 8).toUpperCase()}</span></span><Copy className="h-4 w-4 text-primary" /></button><div className="mt-5 space-y-2">{players.map((player) => <div key={player.user_id} className="flex items-center gap-3 rounded-2xl border border-border bg-background/60 p-3"><span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-primary/10 text-primary">{player.avatar_url ? <img src={player.avatar_url} alt="" className="h-full w-full object-cover" /> : player.role === "host" ? <Crown className="h-5 w-5" /> : <Users className="h-5 w-5" />}</span><span className="min-w-0 flex-1"><span className="block text-sm font-extrabold">{player.display_name}</span><span className={`text-xs ${player.state === "ready" ? "text-success" : player.state === "invited" ? "text-ancient" : player.state === "declined" ? "text-red-300" : "text-muted-foreground"}`}>{player.state === "ready" ? "Pronto" : player.state === "invited" ? "Convite pendente" : player.state === "declined" ? "Recusou" : player.role === "host" ? "Host · conectado" : "Conectado"}</span></span>{player.state === "ready" ? <Check className="h-4 w-4 text-success" /> : player.state === "invited" ? <Sparkles className="h-4 w-4 text-ancient" /> : null}</div>)}</div></section><section className="mt-4 rounded-3xl border border-border bg-surface/70 p-4"><div className="flex items-center justify-between"><p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Convidar amigos</p><span className="text-[11px] font-bold text-primary">{Math.max(0, (room?.max_players ?? 0) - activePlayers.length)} vagas</span></div><div className="mt-3 flex items-center gap-2 rounded-2xl border border-border bg-background px-3"><Search className="h-4 w-4 text-muted-foreground" /><input value={friendSearch} onChange={(event) => setFriendSearch(event.target.value)} placeholder="Buscar amigo" className="min-w-0 flex-1 bg-transparent px-1 py-3 text-sm outline-none" /></div><div className="mt-3 space-y-2">{filteredFriends.map((friend) => { const already = players.some((player) => player.user_id === friend.id && !["declined", "left"].includes(player.state)); return <div key={friend.id} className="flex items-center gap-3 rounded-2xl border border-border bg-background/50 p-3"><span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-primary/10 text-primary">{friend.avatar_url ? <img src={friend.avatar_url} alt="" className="h-full w-full object-cover" /> : <Users className="h-4 w-4" />}</span><span className="min-w-0 flex-1 truncate text-sm font-bold">{friend.display_name}</span><button type="button" onClick={() => void inviteFriend(friend)} disabled={already || activePlayers.length >= (room?.max_players ?? 0) || busy} className="flex h-9 items-center gap-1 rounded-xl bg-primary/10 px-3 text-xs font-extrabold text-primary disabled:opacity-35"><UserPlus className="h-3.5 w-3.5" /> {already ? "Enviado" : "Convidar"}</button></div>; })}{!filteredFriends.length && <p className="py-3 text-center text-xs text-muted-foreground">Nenhum amigo encontrado.</p>}</div></section><section className="mt-4 rounded-3xl border border-border bg-surface/70 p-4"><p className="text-xs leading-relaxed text-muted-foreground">Todos os jogadores presentes precisam confirmar que estão prontos. O host pode iniciar com no mínimo dois jogadores.</p><div className="mt-4 flex gap-2"><button type="button" onClick={() => void toggleReady()} disabled={busy || !me} className={`flex flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-extrabold ${me?.state === "ready" ? "bg-success text-success-foreground" : "border border-border"}`}><Check className="h-4 w-4" /> {me?.state === "ready" ? "Você está pronto" : "Confirmar pronto"}</button>{isHost && <button type="button" onClick={() => void startGame()} disabled={!canStart || busy} className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-ancient px-4 py-3 text-sm font-extrabold text-ancient-foreground disabled:opacity-40">Iniciar partida</button>}<button type="button" onClick={() => void copyInvite()} className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border" aria-label="Compartilhar convite"><Share2 className="h-4 w-4" /></button></div></section></>}
  </div></main>;
}
