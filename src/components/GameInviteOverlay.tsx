import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Check, Gamepad2, Sparkles, Users, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type GameInvite = {
  roomId: string;
  inviterName: string;
};

const gameDb = supabase as any;

function notificationToInvite(value: unknown): GameInvite | null {
  const notification = value as { kind?: string; data?: Record<string, unknown> };
  const data = notification.data;
  if (notification.kind !== "challenge" || data?.game_invite !== "character") return null;
  if (typeof data.room_id !== "string") return null;
  return {
    roomId: data.room_id,
    inviterName: typeof data.inviter_name === "string" ? data.inviter_name : "Um amigo",
  };
}

export function GameInviteOverlay() {
  const navigate = useNavigate();
  const [invite, setInvite] = useState<GameInvite | null>(null);
  const [responding, setResponding] = useState(false);

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
        .limit(1)
        .maybeSingle();

      if (pending.data?.room_id) {
        const room = await gameDb
          .from("character_game_rooms")
          .select("host_id")
          .eq("id", pending.data.room_id)
          .maybeSingle();
        const profile = room.data?.host_id
          ? await gameDb.from("profiles").select("display_name").eq("id", room.data.host_id).maybeSingle()
          : { data: null };
        if (!cancelled) {
          setInvite({ roomId: pending.data.room_id, inviterName: profile.data?.display_name || "Um amigo" });
        }
      }

      channel = supabase
        .channel(`game-invites-${auth.user.id}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "app_notifications", filter: `user_id=eq.${auth.user.id}` },
          (payload) => {
            const nextInvite = notificationToInvite(payload.new);
            if (nextInvite) setInvite(nextInvite);
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
      setInvite(null);
      if (accept) {
        await navigate({ to: "/jogos/multiplayer", search: { roomId } });
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
