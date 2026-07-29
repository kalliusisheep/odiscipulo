import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  listMyChallenges,
  getChallengeProgressPct,
  respondChallenge,
  type Challenge,
} from "@/lib/challenges";
import { Swords, Check, X, Trophy, Flame } from "lucide-react";
import { toast } from "sonner";

type PeerMap = Record<string, { display_name: string; username: string | null; avatar_url: string | null }>;
type ScopeMap = { modules: Record<string, string>; trails: Record<string, string> };

// Toca um efeito sonoro de espadas se chocando (WebAudio)
function playSwordClash() {
  try {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const now = ctx.currentTime;

    // Ruído metálico
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.35, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      const t = i / data.length;
      data[i] = (Math.random() * 2 - 1) * (1 - t) * 0.7;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 2500;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.6, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    noise.connect(hp).connect(noiseGain).connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.35);

    // "Cling" agudo (dois tons)
    [3200, 2400].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, now + i * 0.03);
      g.gain.exponentialRampToValueAtTime(0.35, now + i * 0.03 + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.03 + 0.5);
      osc.connect(g).connect(ctx.destination);
      osc.start(now + i * 0.03);
      osc.stop(now + i * 0.03 + 0.5);
    });

    setTimeout(() => void ctx.close(), 900);
  } catch {
    /* silencia — dispositivos em mudo simplesmente não emitem som */
  }
}

function SwordsClashOverlay({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    playSwordClash();
    const t = setTimeout(onDone, 1500);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative h-64 w-64">
        {/* faíscas */}
        <div className="sword-sparks absolute inset-0" />
        {/* espada esquerda */}
        <Swords
          className="sword-left absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 text-orange-300 drop-shadow-[0_0_20px_rgba(249,115,22,0.9)]"
          strokeWidth={1.5}
        />
        {/* espada direita (espelhada) */}
        <Swords
          className="sword-right absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 -scale-x-100 text-amber-200 drop-shadow-[0_0_20px_rgba(239,68,68,0.9)]"
          strokeWidth={1.5}
        />
        <div className="clash-flash absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-300/70 blur-2xl" />
      </div>
    </div>
  );
}

export function ChallengePanel({ myId }: { myId: string }) {
  const [items, setItems] = useState<Challenge[]>([]);
  const [peers, setPeers] = useState<PeerMap>({});
  const [scopes, setScopes] = useState<ScopeMap>({ modules: {}, trails: {} });
  const [progress, setProgress] = useState<Record<string, { mine: number; peer: number }>>({});
  const [clash, setClash] = useState(false);
  const loadRef = useRef<() => Promise<void>>(async () => {});

  const load = async () => {
    const list = await listMyChallenges(myId);
    setItems(list);
    if (list.length === 0) {
      setProgress({});
      return;
    }
    const peerIds = Array.from(
      new Set(list.map((c) => (c.challenger_id === myId ? c.challenged_id : c.challenger_id))),
    );
    const modIds = Array.from(new Set(list.filter((c) => c.scope_type === "module").map((c) => c.scope_id)));
    const trailIds = Array.from(new Set(list.filter((c) => c.scope_type === "trail").map((c) => c.scope_id)));
    const [{ data: ps }, { data: mods }, { data: trs }] = await Promise.all([
      supabase.from("profiles").select("id, display_name, username, avatar_url").in("id", peerIds),
      modIds.length ? supabase.from("disciple_modules").select("id, title").in("id", modIds) : Promise.resolve({ data: [] as { id: string; title: string }[] }),
      trailIds.length ? supabase.from("disciple_trails").select("id, title").in("id", trailIds) : Promise.resolve({ data: [] as { id: string; title: string }[] }),
    ]);
    const pmap: PeerMap = {};
    for (const p of ps ?? []) pmap[p.id] = { display_name: p.display_name, username: p.username, avatar_url: (p as any).avatar_url ?? null };
    setPeers(pmap);
    const smap: ScopeMap = { modules: {}, trails: {} };
    for (const m of mods ?? []) smap.modules[m.id] = m.title;
    for (const t of trs ?? []) smap.trails[t.id] = t.title;
    setScopes(smap);

    const prog: Record<string, { mine: number; peer: number }> = {};
    await Promise.all(
      list
        .filter((c) => c.status === "accepted")
        .map(async (c) => {
          const peerId = c.challenger_id === myId ? c.challenged_id : c.challenger_id;
          const [mine, peer] = await Promise.all([
            getChallengeProgressPct(c.id, myId),
            getChallengeProgressPct(c.id, peerId),
          ]);
          prog[c.id] = { mine, peer };
        }),
    );
    setProgress(prog);
  };
  loadRef.current = load;

  useEffect(() => {
    void load();
    // Realtime: refresh quando qualquer lição/desafio mudar
    const ch = supabase
      .channel(`challenge-panel-${myId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "challenges" }, () => void loadRef.current())
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "lesson_progress" }, () => void loadRef.current())
      .subscribe();
    // Poll leve a cada 15s para garantir sincronização
    const iv = window.setInterval(() => void loadRef.current(), 15000);
    return () => {
      void supabase.removeChannel(ch);
      window.clearInterval(iv);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myId]);

  const respond = async (id: string, accept: boolean) => {
    try {
      await respondChallenge(id, accept);
      if (accept) {
        setClash(true);
        toast.success("Desafio aceito! Que a jornada comece.");
      } else {
        toast.success("Desafio recusado.");
      }
      await load();
    } catch {
      toast.error("Não foi possível responder.");
    }
  };

  const pendingIncoming = items.filter((c) => c.status === "pending" && c.challenged_id === myId);
  const pendingSent = items.filter((c) => c.status === "pending" && c.challenger_id === myId);
  const active = items.filter((c) => c.status === "accepted");

  if (items.length === 0) return clash ? <SwordsClashOverlay onDone={() => setClash(false)} /> : null;

  return (
    <>
      {clash && <SwordsClashOverlay onDone={() => setClash(false)} />}
      <section className="space-y-3">
        {pendingIncoming.map((c) => {
          const peer = peers[c.challenger_id];
          const title = c.scope_type === "module" ? scopes.modules[c.scope_id] : scopes.trails[c.scope_id];
          return (
            <div key={c.id} className="card-elevated overflow-hidden border-2 border-red-500/40">
              <div className="bg-gradient-to-r from-orange-500/20 via-red-500/15 to-rose-500/10 p-4">
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-red-500 dark:text-red-400">
                  <Swords className="h-3.5 w-3.5" /> Novo desafio
                </p>
                <p className="mt-1 text-sm">
                  <span className="font-bold">{peer?.display_name ?? "Um irmão"}</span> te desafiou:{" "}
                  <span className="font-semibold">
                    {c.scope_type === "module" ? "Módulo" : "Trilha"} · {title ?? c.scope_id}
                  </span>
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => void respond(c.id, true)}
                    className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-3 py-2 text-xs font-bold uppercase text-white"
                  >
                    <Check className="h-3.5 w-3.5" /> Aceitar
                  </button>
                  <button
                    onClick={() => void respond(c.id, false)}
                    className="flex items-center justify-center gap-1 rounded-xl border border-border bg-surface-2 px-3 py-2 text-xs font-semibold"
                  >
                    <X className="h-3.5 w-3.5" /> Recusar
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {pendingSent.map((c) => {
          const peer = peers[c.challenged_id];
          const title = c.scope_type === "module" ? scopes.modules[c.scope_id] : scopes.trails[c.scope_id];
          return (
            <div key={c.id} className="rounded-2xl border border-dashed border-amber-500/50 bg-amber-500/5 p-3 text-xs text-muted-foreground">
              Aguardando <span className="font-semibold text-foreground">{peer?.display_name ?? "irmão"}</span>{" "}
              aceitar seu desafio ({title ?? c.scope_id}).
            </div>
          );
        })}

        {active.map((c) => {
          const peerId = c.challenger_id === myId ? c.challenged_id : c.challenger_id;
          const peer = peers[peerId];
          const title = c.scope_type === "module" ? scopes.modules[c.scope_id] : scopes.trails[c.scope_id];
          const p = progress[c.id] ?? { mine: 0, peer: 0 };
          const iWon = c.first_finisher_id === myId;
          const finished = Boolean(c.first_finisher_id);
          const leading: "left" | "right" | null =
            p.mine === p.peer ? null : p.mine > p.peer ? "left" : "right";
          return (
            <div key={c.id} className="card-elevated relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-orange-500/25 via-red-500/10 to-transparent" />
              <div className="relative p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-red-500 dark:text-red-400">
                    <Swords className="h-3.5 w-3.5" /> Desafio em andamento
                  </p>
                  {finished && (
                    <span className="flex items-center gap-1 rounded-full bg-ancient/20 px-2 py-0.5 text-[10px] font-bold text-ancient">
                      <Trophy className="h-3 w-3" /> {iWon ? "Você venceu!" : `${peer?.display_name?.split(" ")[0] ?? "Rival"} venceu`}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm font-semibold">
                  {c.scope_type === "module" ? "Módulo" : "Trilha"}: {title ?? c.scope_id}
                </p>
                <p className="text-[11px] text-muted-foreground">vs {peer?.display_name ?? "…"}</p>

                {/* Duelo visual — cada barra reflete o percentual real, lado a lado */}
                <div className="mt-4">
                  <DuelBars
                    myAvatar={null}
                    myPct={p.mine}
                    myLeading={leading === "left"}
                    peerLabel={peer?.display_name?.split(" ")[0] ?? "Rival"}
                    peerAvatar={peer?.avatar_url ?? null}
                    peerPct={p.peer}
                    peerLeading={leading === "right"}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </>
  );
}

function DuelRow({
  label,
  avatar,
  pct,
  leading,
  align,
}: {
  label: string;
  avatar: string | null;
  pct: number;
  leading: boolean;
  align: "mine" | "peer";
}) {
  const clamp = (n: number) => Math.max(0, Math.min(100, n));
  const isMine = align === "mine";
  return (
    <div>
      <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold">
        {avatar ? (
          <img
            src={avatar}
            alt=""
            className={`h-4 w-4 rounded-full object-cover ring-1 ${isMine ? "ring-orange-400" : "ring-indigo-400"}`}
          />
        ) : (
          <div
            className={`h-4 w-4 rounded-full ring-1 ${
              isMine ? "bg-orange-500/25 ring-orange-400/60" : "bg-indigo-500/25 ring-indigo-400/60"
            }`}
          />
        )}
        <span className={leading ? "text-orange-500" : "text-foreground"}>{label}</span>
        {leading && <Flame className="h-3 w-3 text-orange-500" />}
        <span className="ml-auto text-[11px] font-bold tabular-nums text-foreground">{Math.round(clamp(pct))}%</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-2">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isMine
              ? "challenge-flame-bar"
              : "bg-gradient-to-r from-indigo-400 via-blue-500 to-indigo-600 shadow-[0_0_8px_rgba(99,102,241,0.55)]"
          }`}
          style={{ width: `${clamp(pct)}%` }}
        />
      </div>
    </div>
  );
}

/**
 * Duas barras empilhadas, cada uma numa escala 0–100% completa e independente —
 * o preenchimento sempre corresponde exatamente ao percentual mostrado ao lado
 * (antes, cada lado ficava confinado a metade da largura, então mesmo 100% de
 * progresso preenchia só a metade da barra).
 */
function DuelBars({
  myAvatar,
  myPct,
  myLeading,
  peerLabel,
  peerAvatar,
  peerPct,
  peerLeading,
}: {
  myAvatar: string | null;
  myPct: number;
  myLeading: boolean;
  peerLabel: string;
  peerAvatar: string | null;
  peerPct: number;
  peerLeading: boolean;
}) {
  return (
    <div className="space-y-3">
      <DuelRow label="Você" avatar={myAvatar} pct={myPct} leading={myLeading} align="mine" />
      <DuelRow label={peerLabel} avatar={peerAvatar} pct={peerPct} leading={peerLeading} align="peer" />
    </div>
  );
}
