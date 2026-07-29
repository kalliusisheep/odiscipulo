import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Swords, Check, X, Clock } from "lucide-react";
import {
  listMyChallenges,
  getChallengeProgressPct,
  respondChallenge,
  cancelAcceptedChallenge,
  type Challenge,
} from "@/lib/challenges";

// Som simples via WebAudio — respeita o volume do dispositivo e falha em silêncio.
function playVictoryTrumpet() {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === "suspended") void ctx.resume();
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = f;
      const start = now + i * 0.12;
      const end = start + 0.4;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.2, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, end);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(end + 0.02);
    });
    setTimeout(() => void ctx.close(), notes.length * 120 + 600);
  } catch {
    /* silencioso — áudio é opcional */
  }
}

/** Avatar redondo simples usado nos cartões de desafio. */
function Avatar({
  url,
  name,
  size = "h-10 w-10",
  ring = "ring-border",
}: {
  url: string | null | undefined;
  name: string | null | undefined;
  size?: string;
  ring?: string;
}) {
  const initial = (name?.trim()?.[0] ?? "?").toUpperCase();
  return (
    <div className={`relative shrink-0 overflow-hidden rounded-full bg-surface-2 ring-2 ${ring} ${size}`}>
      {url ? (
        <img src={url} alt={name ?? ""} className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center font-bold text-muted-foreground">
          {initial}
        </span>
      )}
    </div>
  );
}

/** Popup exibido quando os dois participantes concluem o desafio. */
function ChallengeCompletedModal({
  meAvatarUrl,
  peerAvatarUrl,
  peerName,
  onClose,
}: {
  meAvatarUrl: string | null | undefined;
  peerAvatarUrl: string | null | undefined;
  peerName: string | null | undefined;
  onClose: () => void;
}) {
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    playVictoryTrumpet();
    const t = setTimeout(() => setCanClose(true), 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => canClose && onClose()}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-ancient/40 bg-gradient-to-b from-slate-900 via-slate-950 to-black p-6 text-center text-white shadow-2xl animate-scale-in"
      >
        {canClose && (
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="absolute right-3 top-3 z-20 rounded-full p-1.5 text-white/60 hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        <img
          src="/desafio-concluido.jpeg"
          alt="Ovelhas comemorando o desafio concluído"
          className="mx-auto h-36 w-full rounded-2xl object-cover"
        />

        <h2 className="mt-3 text-xl font-black">Desafio concluído!</h2>

        <div className="mt-4 flex items-center justify-center gap-4">
          <Avatar url={meAvatarUrl} name="Você" size="h-14 w-14" ring="ring-orange-400" />
          <Swords className="h-5 w-5 shrink-0 text-white/50" />
          <Avatar url={peerAvatarUrl} name={peerName} size="h-14 w-14" ring="ring-indigo-400" />
        </div>
      </div>
    </div>
  );
}

type PeerProfile = {
  id: string;
  display_name: string;
  username: string | null;
  avatar_url: string | null;
};

type ScopeInfo = { title: string };

type EnrichedChallenge = {
  challenge: Challenge;
  peer: PeerProfile;
  scope: ScopeInfo;
  myPct: number;
  peerPct: number;
  isInvite: boolean; // recebido, ainda pendente, aguardando minha resposta
  isWaiting: boolean; // enviado por mim, ainda pendente
};

/** Painel de desafios ativos exibido na home. */
export function ChallengePanel({ myId }: { myId: string }) {
  const [items, setItems] = useState<EnrichedChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [completedModal, setCompletedModal] = useState<{
    meAvatarUrl: string | null;
    peerAvatarUrl: string | null;
    peerName: string | null;
  } | null>(null);
  const [meAvatarUrl, setMeAvatarUrl] = useState<string | null>(null);

  const load = async () => {
    const all = await listMyChallenges(myId);
    const relevant = all.filter((c) => c.status === "pending" || c.status === "accepted");

    if (relevant.length === 0) {
      setItems([]);
      setLoading(false);
      return;
    }

    const peerIds = Array.from(
      new Set(relevant.map((c) => (c.challenger_id === myId ? c.challenged_id : c.challenger_id))),
    );

    const [{ data: me }, { data: peers }, { data: modules }, { data: trails }] = await Promise.all([
      supabase.from("profiles").select("avatar_url").eq("id", myId).maybeSingle(),
      supabase.from("profiles").select("id, display_name, username, avatar_url").in("id", peerIds),
      supabase.from("disciple_modules").select("id, title"),
      supabase.from("disciple_trails").select("id, title"),
    ]);

    setMeAvatarUrl(me?.avatar_url ?? null);

    const peerById = new Map((peers ?? []).map((p) => [p.id, p as PeerProfile]));
    const moduleTitleById = new Map((modules ?? []).map((m) => [m.id, m.title as string]));
    const trailTitleById = new Map((trails ?? []).map((t) => [t.id, t.title as string]));

    const enriched = await Promise.all(
      relevant.map(async (c) => {
        const peerId = c.challenger_id === myId ? c.challenged_id : c.challenger_id;
        const peer = peerById.get(peerId) ?? {
          id: peerId,
          display_name: "Irmão(ã)",
          username: null,
          avatar_url: null,
        };
        const scopeTitle =
          c.scope_type === "module"
            ? (moduleTitleById.get(c.scope_id) ?? "Módulo")
            : (trailTitleById.get(c.scope_id) ?? "Trilha");

        const isAccepted = c.status === "accepted";
        const [myPct, peerPct] = isAccepted
          ? await Promise.all([getChallengeProgressPct(c.id, myId), getChallengeProgressPct(c.id, peerId)])
          : [0, 0];

        return {
          challenge: c,
          peer,
          scope: { title: scopeTitle },
          myPct,
          peerPct,
          isInvite: c.status === "pending" && c.challenged_id === myId,
          isWaiting: c.status === "pending" && c.challenger_id === myId,
        } as EnrichedChallenge;
      }),
    );

    enriched.sort((a, b) => {
      const rank = (e: EnrichedChallenge) => (e.isInvite ? 0 : e.isWaiting ? 2 : 1);
      return rank(a) - rank(b);
    });

    setItems(enriched);
    setLoading(false);
  };

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;
    void load();
    channel = supabase
      .channel(`challenge-panel-${myId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "challenges" }, () => void load())
      .on("postgres_changes", { event: "*", schema: "public", table: "lesson_progress" }, () => void load())
      .subscribe();
    return () => {
      if (channel) void supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myId]);

  const accept = async (item: EnrichedChallenge) => {
    setBusyId(item.challenge.id);
    try {
      await respondChallenge(item.challenge.id, true);
      toast.success(`Desafio com ${item.peer.display_name} aceito!`);
      await load();
    } catch {
      toast.error("Não foi possível aceitar o desafio. Tente novamente.");
    } finally {
      setBusyId(null);
    }
  };

  const reject = async (item: EnrichedChallenge) => {
    setBusyId(item.challenge.id);
    try {
      await respondChallenge(item.challenge.id, false);
      toast.success("Desafio recusado.");
      await load();
    } catch {
      toast.error("Não foi possível recusar o desafio. Tente novamente.");
    } finally {
      setBusyId(null);
    }
  };

  const cancelActive = async (item: EnrichedChallenge) => {
    setBusyId(item.challenge.id);
    try {
      await cancelAcceptedChallenge(item.challenge.id);
      toast.success("Desafio cancelado.");
      await load();
    } catch {
      toast.error("Não foi possível cancelar o desafio. Tente novamente.");
    } finally {
      setBusyId(null);
    }
  };

  useEffect(() => {
    const alreadyCompleted = items.find((i) => i.challenge.status === "accepted" && i.myPct >= 100 && i.peerPct >= 100);
    if (alreadyCompleted) {
      setCompletedModal({
        meAvatarUrl,
        peerAvatarUrl: alreadyCompleted.peer.avatar_url,
        peerName: alreadyCompleted.peer.display_name,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  // Some da lista assim que ambos batem 100%, mesmo que o status no banco
  // ainda não tenha virado "completed" (ex.: a chamada de finish_challenge_step
  // do segundo participante falhou ou não disparou).
  const visibleItems = items.filter((i) => !(i.myPct >= 100 && i.peerPct >= 100));

  if (loading || visibleItems.length === 0) return null;

  return (
    <section className="space-y-3">
      <h2 className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
        <Swords className="h-4 w-4" /> Desafios
      </h2>

      <div className="space-y-2">
        {visibleItems.map((item) => {
          const isBusy = busyId === item.challenge.id;
          return (
            <div
              key={item.challenge.id}
              className="card-elevated flex flex-col gap-3 rounded-2xl border border-border p-4"
            >
              <div className="flex items-center gap-3">
                <Avatar url={item.peer.avatar_url} name={item.peer.display_name} />
                <div className="min-w-0 flex-1">
                  {item.peer.username ? (
                    <Link
                      to="/perfil/$username"
                      params={{ username: item.peer.username }}
                      className="truncate text-sm font-semibold hover:underline"
                    >
                      {item.peer.display_name}
                    </Link>
                  ) : (
                    <p className="truncate text-sm font-semibold">{item.peer.display_name}</p>
                  )}
                  <p className="truncate text-xs text-muted-foreground">{item.scope.title}</p>
                </div>
                {item.isWaiting && (
                  <span className="flex shrink-0 items-center gap-1 rounded-full bg-amber-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-300">
                    <Clock className="h-3 w-3" /> Aguardando
                  </span>
                )}
              </div>

              {item.isInvite && (
                <div className="flex gap-2">
                  <button
                    onClick={() => void accept(item)}
                    disabled={isBusy}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground disabled:opacity-60"
                  >
                    <Check className="h-3.5 w-3.5" /> Aceitar
                  </button>
                  <button
                    onClick={() => void reject(item)}
                    disabled={isBusy}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border bg-surface-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground disabled:opacity-60"
                  >
                    <X className="h-3.5 w-3.5" /> Recusar
                  </button>
                </div>
              )}

              {item.challenge.status === "accepted" && (
                <>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground">
                      <span>Você</span>
                      <span>{Math.round(item.myPct)}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-surface-2">
                      <div
                        className="challenge-flame-bar h-full rounded-full"
                        style={{ width: `${Math.max(3, Math.min(100, item.myPct))}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground">
                      <span>{item.peer.display_name}</span>
                      <span>{Math.round(item.peerPct)}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-surface-2">
                      <div
                        className="h-full rounded-full bg-indigo-400/70 transition-all"
                        style={{ width: `${Math.max(3, Math.min(100, item.peerPct))}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => void cancelActive(item)}
                    disabled={isBusy}
                    className="self-end text-[10px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-destructive disabled:opacity-60"
                  >
                    Cancelar desafio
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>

      {completedModal && (
        <ChallengeCompletedModal
          meAvatarUrl={completedModal.meAvatarUrl}
          peerAvatarUrl={completedModal.peerAvatarUrl}
          peerName={completedModal.peerName}
          onClose={() => setCompletedModal(null)}
        />
      )}
    </section>
  );
}
