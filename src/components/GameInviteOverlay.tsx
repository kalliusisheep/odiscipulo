import { useEffect, useState } from "react";
import { Check, Gamepad2, Sparkles, Users, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type GameInvite = {
  roomId: string;
  inviterName: string;
  gameType: "personagem" | "versiculo" | "cruzadas" | "milhao";
  difficulty: "facil" | "medio" | "dificil" | "bereano";
  rounds: number;
  seed: number;
};

const gameDb = supabase as any;

function notificationToInvite(value: unknown): GameInvite | null {
  const notification = value as { kind?: string; data?: Record<string, unknown> };
  const data = notification.data;
  const gameType = data?.game_invite;
  if (
    notification.kind !== "challenge" ||
    !["personagem", "versiculo", "cruzadas", "milhao"].includes(String(gameType)) ||
    typeof data.room_id !== "string"
  ) return null;
  return {
    roomId: data.room_id,
    inviterName: typeof data.inviter_name === "string" ? data.inviter_name : "Um amigo",
    gameType: gameType as GameInvite["gameType"],
    difficulty: ["facil", "medio", "dificil", "bereano"].includes(String(data.difficulty))
      ? (data.difficulty as GameInvite["difficulty"])
      : "medio",
    rounds: Number.isFinite(Number(data.rounds)) ? Number(data.rounds) : 10,
    seed: Number.isFinite(Number(data.seed)) ? Number(data.seed) : 0,
  };
}

async function resolveInvite(roomId: string, fallbackName = "Um amigo"): Promise<GameInvite | null> {
  const { data: room } = await gameDb
    .from("character_game_rooms")
    .select("id,host_id,game_type,difficulty,rounds,round_seed")
    .eq("id", roomId)
    .maybeSingle();
  if (!room) return null;
  const { data: profile } = await gameDb.from("profiles").select("display_name").eq("id", room.host_id).maybeSingle();
  const gameType = ["personagem", "versiculo", "cruzadas", "milhao"].includes(room.game_type) ? room.game_type : "personagem";
  return {
    roomId,
    inviterName: profile?.display_name || fallbackName,
    gameType,
    difficulty: ["facil", "medio", "dificil", "bereano"].includes(room.difficulty) ? room.difficulty : "medio",
    rounds: Number.isFinite(Number(room.rounds)) ? Number(room.rounds) : 10,
    seed: Number.isFinite(Number(room.round_seed)) ? Number(room.round_seed) : 0,
  };
}

export function GameInviteOverlay() {
  const [pendingInvites, setPendingInvites] = useState<GameInvite[]>([]);
  const [responding, setResponding] = useState(false);
  const invite = pendingInvites[0] ?? null;

  const enqueueInvite = (nextInvite: GameInvite | null) => {
    if (!nextInvite) return;
    setPendingInvites((current) =>
      current.some((item) => item.roomId === nextInvite.roomId)
        ? current
        : [...current, nextInvite],
    );
  };

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let cancelled = false;

    const load = async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;

      const pending = await gameDb
        .from("character_game_room_players")
        .select("room_id")
        .eq("user_id", auth.user.id)
        .eq("state", "invited")
        .limit(10);

      const pendingInvites = await Promise.all(
        (pending.data ?? []).map((row: { room_id?: string }) =>
          typeof row.room_id === "string" ? resolveInvite(row.room_id) : Promise.resolve(null),
        ),
      );
      if (!cancelled) {
        pendingInvites.forEach(enqueueInvite);
      }

      channel = supabase
        .channel(`game-invites-${auth.user.id}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "app_notifications", filter: `user_id=eq.${auth.user.id}` },
          async (payload) => {
            const nextInvite = notificationToInvite(payload.new);
            if (nextInvite) {
              const resolvedInvite = await resolveInvite(nextInvite.roomId, nextInvite.inviterName);
              if (!cancelled) enqueueInvite(resolvedInvite ?? nextInvite);
            }
          },
        )
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "character_game_room_players", filter: `user_id=eq.${auth.user.id}` },
          async (payload) => {
            const row = payload.new as { state?: string; room_id?: string };
            if (row.state !== "invited" || typeof row.room_id !== "string") return;
            const resolvedInvite = await resolveInvite(row.room_id);
            if (!cancelled) enqueueInvite(resolvedInvite);
          },
        )
        .subscribe();
    };

    void load();
    return () => {
      cancelled = true;
      if (channel) void supabase.removeChannel(channel);
    };
  }, []);

  const respond = async (accept: boolean) => {
    if (!invite || responding) return;
    setResponding(true);
    try {
      const { error } = await gameDb.rpc("respond_character_game_invite", {
        _room_id: invite.roomId,
        _accept: accept,
      });
      if (error) throw error;
      const roomId = invite.roomId;
      setPendingInvites((current) => current.slice(1));
      if (accept) {
        window.location.href = `/jogos/${invite.gameType}?mode=multi&roomId=${roomId}&seed=${invite.seed}&difficulty=${invite.difficulty}&rounds=${invite.rounds}`;
      } else {
        toast.success("Convite recusado");
      }
    } catch {
      toast.error("Não foi possível responder ao convite.");
    } finally {
      setResponding(false);
    }
  };

  if (!invite) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-sm overflow-hidden rounded-[2rem] border border-primary/35 bg-surface shadow-2xl shadow-primary/25 motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95">
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-br from-primary/35 via-primary/10 to-transparent" />
        <div className="relative p-6">
          <div className="flex items-start justify-between">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary shadow-lg shadow-primary/20 motion-safe:animate-bounce"><Gamepad2 className="h-7 w-7" /></span>
            <span className="flex items-center gap-1 rounded-full bg-ancient/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-ancient"><Sparkles className="h-3 w-3" /> Convite</span>
          </div>
          <p className="mt-6 text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">Uma partida está começando</p>
          <h2 className="mt-2 text-2xl font-extrabold leading-tight">{invite.inviterName} chamou você!</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Entre na sala, confirme que está pronto e dispute um desafio bíblico em tempo real.</p>
          <div className="mt-5 flex items-center gap-2 rounded-2xl border border-border bg-background/60 p-3 text-xs text-muted-foreground"><Users className="h-4 w-4 text-primary" /> Sala com até quatro jogadores</div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button type="button" onClick={() => void respond(false)} disabled={responding} className="flex items-center justify-center gap-2 rounded-2xl border border-border px-4 py-3 text-sm font-extrabold text-muted-foreground transition hover:border-red-400/50 hover:text-red-300 disabled:opacity-50"><X className="h-4 w-4" /> Recusar</button>
            <button type="button" onClick={() => void respond(true)} disabled={responding} className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-extrabold text-primary-foreground shadow-lg shadow-primary/25 transition hover:brightness-110 disabled:opacity-50"><Check className="h-4 w-4" /> Aceitar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
