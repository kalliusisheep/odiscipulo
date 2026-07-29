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
        <div className="flex items-center gap-2 px-0.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]">
            <Swords className="h-3.5 w-3.5 text-white" />
          </div>
          <h2 className="text-sm font-semibold text-muted-foreground">Duelos de Discipulado</h2>
        </div>

        {pendingIncoming.map((c) => {
          const peer = peers[c.challenger_id];
          const title = c.scope_type === "module" ? scopes.modules[c.scope_id] : scopes.trails[c.scope_id];
          return (
            <div
              key={c.id}
              className="card-elevated relative overflow-hidden rounded-3xl border border-red-500/30 shadow-[0_0_0_1px_rgba(239,68,68,0.08)]"
            >
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-red-500/20 blur-3xl" />
              <div className="relative bg-gradient-to-br from-orange-500/15 via-red-500/10 to-transparent p-4">
                <div className="flex items-center gap-3">
                  <Avatar url={peer?.avatar_url ?? null} name={peer?.display_name} ring="ring-red-400/60" />
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-red-500 dark:text-red-400">
                      <Swords className="h-3 w-3" /> Novo desafio
                    </p>
                    <p className="mt-0.5 truncate text-sm">
                      <span className="font-bold text-foreground">{peer?.display_name ?? "Um irmão"}</span>{" "}
                      <span className="text-muted-foreground">te desafiou</span>
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 rounded-xl border border-border/60 bg-surface-2/60 px-3 py-2">
                  <ScopeIcon type={c.scope_type} className="h-3.5 w-3.5 shrink-0 text-primary" />
                  <p className="min-w-0 truncate text-xs font-semibold text-foreground">
                    {c.scope_type === "module" ? "Módulo" : "Trilha"} · {title ?? c.scope_id}
                  </p>
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => void respond(c.id, true)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-3 py-2.5 text-xs font-bold uppercase tracking-wide text-white shadow-[0_4px_14px_rgba(239,68,68,0.35)] transition-transform active:scale-95"
                  >
                    <Check className="h-3.5 w-3.5" /> Aceitar
                  </button>
                  <button
                    onClick={() => void respond(c.id, false)}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-surface-2 px-3.5 py-2.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-surface active:scale-95"
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
            <div
              key={c.id}
              className="flex items-center gap-3 rounded-2xl border border-dashed border-amber-500/40 bg-amber-500/[0.06] px-3.5 py-3"
            >
              <Avatar url={peer?.avatar_url ?? null} name={peer?.display_name} size="h-8 w-8" ring="ring-amber-400/50" />
              <div className="min-w-0 flex-1 text-xs">
                <p className="truncate text-muted-foreground">
                  Aguardando <span className="font-semibold text-foreground">{peer?.display_name ?? "irmão"}</span>{" "}
                  aceitar
                </p>
                <p className="truncate text-[11px] font-medium text-amber-600 dark:text-amber-400">
                  {c.scope_type === "module" ? "Módulo" : "Trilha"} · {title ?? c.scope_id}
                </p>
              </div>
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
              </span>
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
            <div key={c.id} className="card-elevated relative overflow-hidden rounded-3xl">
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-orange-500/20 via-red-500/[0.06] to-transparent" />
              <div className="relative p-4">
                {finished ? (
                  <div className="mb-3 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-ancient/25 via-ancient/15 to-ancient/25 py-1.5 text-[11px] font-bold uppercase tracking-wider text-ancient">
                    <Trophy className="h-3.5 w-3.5" />
                    {iWon ? "Você venceu!" : `${peer?.display_name?.split(" ")[0] ?? "Rival"} venceu`}
                  </div>
                ) : (
                  <p className="mb-3 flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-red-500 dark:text-red-400">
                    <Swords className="h-3.5 w-3.5" /> Desafio em andamento
                  </p>
                )}

                {/* Confronto: avatares nas pontas, VS no centro */}
                <div className="flex items-center justify-center gap-3">
                  <div className="flex flex-col items-center gap-1">
                    <Avatar
                      url={null}
                      name="Você"
                      size="h-11 w-11"
                      ring={leading === "left" ? "ring-orange-400" : "ring-border"}
                      glow={leading === "left"}
                    />
                    <span className="text-[10px] font-bold text-foreground">Você</span>
                  </div>

                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-surface-2 text-[9px] font-black text-muted-foreground">
                    VS
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <Avatar
                      url={peer?.avatar_url ?? null}
                      name={peer?.display_name}
                      size="h-11 w-11"
                      ring={leading === "right" ? "ring-indigo-400" : "ring-border"}
                      glow={leading === "right"}
                    />
                    <span className="max-w-[72px] truncate text-[10px] font-bold text-foreground">
                      {peer?.display_name?.split(" ")[0] ?? "Rival"}
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-center gap-1.5 rounded-xl border border-border/60 bg-surface-2/60 px-3 py-1.5">
                  <ScopeIcon type={c.scope_type} className="h-3.5 w-3.5 shrink-0 text-primary" />
                  <p className="min-w-0 truncate text-xs font-semibold text-foreground">
                    {c.scope_type === "module" ? "Módulo" : "Trilha"} · {title ?? c.scope_id}
                  </p>
                </div>

                {/* Duelo visual — cada barra reflete o percentual real, lado a lado */}
                <div className="mt-4">
                  <DuelBars
                    myPct={p.mine}
                    myLeading={leading === "left"}
                    peerLabel={peer?.display_name?.split(" ")[0] ?? "Rival"}
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

function Avatar({
  url,
  name,
  size = "h-9 w-9",
  ring = "ring-border",
  glow = false,
}: {
  url: string | null | undefined;
  name: string | null | undefined;
  size?: string;
  ring?: string;
  glow?: boolean;
}) {
  const initial = name?.trim()?.[0]?.toUpperCase() ?? "?";
  return (
    <div
      className={`${size} shrink-0 overflow-hidden rounded-full bg-surface-2 ring-2 ${ring} transition-shadow ${
        glow ? "shadow-[0_0_14px_rgba(249,115,22,0.5)]" : ""
      }`}
    >
      {url ? (
        <img src={url} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-xs font-bold text-muted-foreground">
          {initial}
        </div>
      )}
    </div>
  );
}

function ScopeIcon({ type, className }: { type: "module" | "trail"; className?: string }) {
  return type === "module" ? (
    <Trophy className={className} />
  ) : (
    <Flame className={className} />
  );
}

function DuelRow({
  label,
  pct,
  leading,
  align,
}: {
  label: string;
  pct: number;
  leading: boolean;
  align: "mine" | "peer";
}) {
  const clamp = (n: number) => Math.max(0, Math.min(100, n));
  const isMine = align === "mine";
  return (
    <div>
      <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold">
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
  myPct,
  myLeading,
  peerLabel,
  peerPct,
  peerLeading,
}: {
  myPct: number;
  myLeading: boolean;
  peerLabel: string;
  peerPct: number;
  peerLeading: boolean;
}) {
  return (
    <div className="space-y-3">
      <DuelRow label="Você" pct={myPct} leading={myLeading} align="mine" />
      <DuelRow label={peerLabel} pct={peerPct} leading={peerLeading} align="peer" />
    </div>
  );
}
