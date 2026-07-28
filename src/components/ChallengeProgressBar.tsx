import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  listMyChallenges,
  getChallengeProgressPct,
  respondChallenge,
  type Challenge,
} from "@/lib/challenges";
import { Flame, Swords, Check, X, Trophy } from "lucide-react";
import { toast } from "sonner";

type PeerMap = Record<string, { display_name: string; username: string | null }>;
type ScopeMap = { modules: Record<string, string>; trails: Record<string, string> };

export function ChallengePanel({ myId }: { myId: string }) {
  const [items, setItems] = useState<Challenge[]>([]);
  const [peers, setPeers] = useState<PeerMap>({});
  const [scopes, setScopes] = useState<ScopeMap>({ modules: {}, trails: {} });
  const [progress, setProgress] = useState<Record<string, { mine: number; peer: number }>>({});

  const load = async () => {
    const list = await listMyChallenges(myId);
    setItems(list);
    if (list.length === 0) return;
    const peerIds = Array.from(
      new Set(list.map((c) => (c.challenger_id === myId ? c.challenged_id : c.challenger_id))),
    );
    const modIds = Array.from(new Set(list.filter((c) => c.scope_type === "module").map((c) => c.scope_id)));
    const trailIds = Array.from(new Set(list.filter((c) => c.scope_type === "trail").map((c) => c.scope_id)));
    const [{ data: ps }, { data: mods }, { data: trs }] = await Promise.all([
      supabase.from("profiles").select("id, display_name, username").in("id", peerIds),
      modIds.length ? supabase.from("disciple_modules").select("id, title").in("id", modIds) : Promise.resolve({ data: [] as { id: string; title: string }[] }),
      trailIds.length ? supabase.from("disciple_trails").select("id, title").in("id", trailIds) : Promise.resolve({ data: [] as { id: string; title: string }[] }),
    ]);
    const pmap: PeerMap = {};
    for (const p of ps ?? []) pmap[p.id] = { display_name: p.display_name, username: p.username };
    setPeers(pmap);
    const smap: ScopeMap = { modules: {}, trails: {} };
    for (const m of mods ?? []) smap.modules[m.id] = m.title;
    for (const t of trs ?? []) smap.trails[t.id] = t.title;
    setScopes(smap);

    // fetch progress for accepted
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

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myId]);

  const respond = async (id: string, accept: boolean) => {
    try {
      await respondChallenge(id, accept);
      toast.success(accept ? "Desafio aceito!" : "Desafio recusado.");
      await load();
    } catch {
      toast.error("Não foi possível responder.");
    }
  };

  if (items.length === 0) return null;

  const pendingIncoming = items.filter((c) => c.status === "pending" && c.challenged_id === myId);
  const pendingSent = items.filter((c) => c.status === "pending" && c.challenger_id === myId);
  const active = items.filter((c) => c.status === "accepted");

  return (
    <section className="space-y-3">
      {pendingIncoming.map((c) => {
        const peer = peers[c.challenger_id];
        const title =
          c.scope_type === "module" ? scopes.modules[c.scope_id] : scopes.trails[c.scope_id];
        return (
          <div
            key={c.id}
            className="card-elevated overflow-hidden border-2 border-red-500/40"
          >
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
        const title =
          c.scope_type === "module" ? scopes.modules[c.scope_id] : scopes.trails[c.scope_id];
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
        const title =
          c.scope_type === "module" ? scopes.modules[c.scope_id] : scopes.trails[c.scope_id];
        const p = progress[c.id] ?? { mine: 0, peer: 0 };
        const iWon = c.first_finisher_id === myId;
        const theyWon = c.first_finisher_id && c.first_finisher_id !== myId;
        return (
          <div key={c.id} className="card-elevated overflow-hidden">
            <div className="bg-gradient-to-br from-orange-500/15 via-red-500/10 to-transparent p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-red-500 dark:text-red-400">
                  <Swords className="h-3.5 w-3.5" /> Desafio em andamento
                </p>
                {c.first_finisher_id && (
                  <span className="flex items-center gap-1 rounded-full bg-ancient/20 px-2 py-0.5 text-[10px] font-bold text-ancient">
                    <Trophy className="h-3 w-3" /> {iWon ? "Você venceu!" : `${peer?.display_name ?? "Rival"} venceu`}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm font-semibold">
                {c.scope_type === "module" ? "Módulo" : "Trilha"}: {title ?? c.scope_id}
              </p>
              <p className="text-[11px] text-muted-foreground">vs {peer?.display_name ?? "…"}</p>

              <FlameBar label="Você" pct={p.mine} highlight={iWon} />
              <FlameBar label={peer?.display_name ?? "Rival"} pct={p.peer} highlight={!!theyWon} muted />
            </div>
          </div>
        );
      })}
    </section>
  );
}

function FlameBar({
  label,
  pct,
  highlight,
  muted,
}: {
  label: string;
  pct: number;
  highlight?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="mt-3">
      <div className="mb-1 flex items-center justify-between text-[11px]">
        <span className={`font-semibold ${muted ? "text-muted-foreground" : ""}`}>
          <Flame className="mr-1 inline h-3 w-3 text-orange-500" />
          {label}
          {highlight && " 🏆"}
        </span>
        <span className="font-bold">{Math.round(pct)}%</span>
      </div>
      <div className="relative h-3 overflow-hidden rounded-full bg-surface-2">
        <div
          className="challenge-flame-bar h-full rounded-full"
          style={{ width: `${Math.min(100, Math.max(2, pct))}%` }}
        />
      </div>
    </div>
  );
}
