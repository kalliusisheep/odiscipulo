import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, MessageCircle, Plus, Search, Flame } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { listMyChallenges, getChallengeProgressPct, checkFinishChallenges } from "@/lib/challenges";

export const Route = createFileRoute("/_authenticated/mensagens/")({
  component: MensagensListPage,
});

type Conversation = {
  peer: { id: string; display_name: string; username: string; avatar_url: string | null };
  lastBody: string;
  lastAt: string;
  lastFromMe: boolean;
  unread: boolean;
  challengePct: number | null;
};

function MensagensListPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;
    void (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const myId = u.user.id;
      const load = async () => {
        // Sincroniza com o servidor: se algum desafio já bateu 100% dos dois lados
        // desde a última checagem, marca como concluído (idempotente).
        try {
          await checkFinishChallenges(myId);
        } catch {
          /* melhor esforço — não deve travar a lista de conversas */
        }

        // Desafios ativos por parceiro → % de progresso do peer
        const myChallenges = (await listMyChallenges(myId)).filter((c) => c.status === "accepted");
        const partnerToChallenge = new Map<string, string>();
        for (const c of myChallenges) {
          const peerId = c.challenger_id === myId ? c.challenged_id : c.challenger_id;
          partnerToChallenge.set(peerId, c.id);
        }
        const peerPct = new Map<string, number>();
        await Promise.all(
          Array.from(partnerToChallenge.entries()).map(async ([peerId, chId]) => {
            const [pPct, myPct] = await Promise.all([
              getChallengeProgressPct(chId, peerId),
              getChallengeProgressPct(chId, myId),
            ]);
            // Concluído de fato (ambos em 100%): não mostra mais a barra,
            // mesmo que o status no banco ainda não tenha sido atualizado.
            if (pPct >= 100 && myPct >= 100) return;
            peerPct.set(peerId, pPct);
          }),
        );

        const { data: msgs } = await supabase
          .from("messages")
          .select("id, sender_id, recipient_id, body, created_at, read_at")
          .or(`sender_id.eq.${myId},recipient_id.eq.${myId}`)
          .order("created_at", { ascending: false });
        const byPeer = new Map<string, { body: string; at: string; fromMe: boolean; unread: boolean }>();
        for (const m of msgs ?? []) {
          const peerId = m.sender_id === myId ? m.recipient_id : m.sender_id;
          if (!byPeer.has(peerId)) {
            byPeer.set(peerId, {
              body: m.body ?? "🎤 Mensagem de voz",
              at: m.created_at,
              fromMe: m.sender_id === myId,
              unread: m.recipient_id === myId && !m.read_at,
            });
          }
        }
        if (byPeer.size === 0) {
          setConversations([]);
          setLoading(false);
          return;
        }
        const { data: peers } = await supabase
          .from("profiles")
          .select("id, display_name, username, avatar_url")
          .in("id", Array.from(byPeer.keys()));
        const list: Conversation[] = (peers ?? [])
          .map((p) => {
            const last = byPeer.get(p.id)!;
            return {
              peer: { id: p.id, display_name: p.display_name, username: p.username ?? "", avatar_url: p.avatar_url },
              lastBody: last.body,
              lastAt: last.at,
              lastFromMe: last.fromMe,
              unread: last.unread,
              challengePct: peerPct.has(p.id) ? peerPct.get(p.id)! : null,
            };
          })
          .filter((c) => c.peer.username)
          .sort((a, b) => new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime());
        setConversations(list);
        setLoading(false);
      };
      await load();
      channel = supabase
        .channel(`msg-list-${myId}`)
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
          const m = payload.new as { sender_id: string; recipient_id: string };
          if (m.sender_id === myId || m.recipient_id === myId) void load();
        })
        .on("postgres_changes", { event: "*", schema: "public", table: "challenges" }, () => void load())
        .subscribe();
    })();
    return () => {
      if (channel) void supabase.removeChannel(channel);
    };
  }, []);

  const filtered = conversations.filter(
    (c) => !q || c.peer.display_name.toLowerCase().includes(q.toLowerCase()) || c.peer.username.toLowerCase().includes(q.toLowerCase()),
  );
  const totalUnread = conversations.filter((c) => c.unread).length;

  return (
    <div className="mx-auto min-h-[100dvh] max-w-lg pb-24">
      {/* Header em gradiente */}
      <div className="relative overflow-hidden rounded-b-[2rem] bg-gradient-to-br from-primary via-primary/85 to-indigo-600 px-5 pb-8 pt-6 text-primary-foreground shadow-lg">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex items-center gap-3">
          <Link to="/home" aria-label="Voltar" className="rounded-full bg-white/15 p-2 backdrop-blur transition hover:bg-white/25">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1">
            <p className="text-[11px] uppercase tracking-widest text-white/80">Comunhão</p>
            <h1 className="text-2xl font-bold">Mensagens</h1>
            <p className="mt-0.5 text-xs text-white/85">
              {totalUnread > 0 ? `${totalUnread} nova${totalUnread > 1 ? "s" : ""} · ` : ""}
              {conversations.length} conversa{conversations.length === 1 ? "" : "s"}
            </p>
          </div>
          <Link
            to="/mensagens/novo"
            aria-label="Nova mensagem"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-primary shadow-md transition-transform hover:scale-105 active:scale-95"
          >
            <Plus className="h-5 w-5" />
          </Link>
        </div>

        {/* Busca */}
        <div className="relative mt-5">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar irmão(ã)…"
            className="w-full rounded-full border border-white/20 bg-white/15 py-2.5 pl-9 pr-4 text-sm text-white placeholder:text-white/70 outline-none backdrop-blur focus:border-white/40"
          />
        </div>
      </div>

      <div className="px-4 pt-5">
        {loading && <p className="text-sm text-muted-foreground">Carregando…</p>}

        {!loading && conversations.length === 0 && (
          <div className="card-elevated flex flex-col items-center gap-3 p-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <MessageCircle className="h-7 w-7 text-primary" />
            </div>
            <p className="text-sm font-semibold">Nenhuma conversa ainda</p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Adicione um irmão(ã) pelo ID e comece a trocar palavras de fé, oração e desafio.
            </p>
            <Link
              to="/mensagens/novo"
              className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
            >
              <Plus className="h-3.5 w-3.5" /> Adicionar irmão(ã)
            </Link>
          </div>
        )}

        <ul className="space-y-2">
          {filtered.map((c) => {
            const inChallenge = c.challengePct !== null;
            return (
              <li key={c.peer.id}>
                <div
                  className={`group relative flex items-center gap-3 overflow-hidden rounded-2xl border p-3 transition-all ${
                    c.unread
                      ? "border-primary/40 bg-primary/5 shadow-[0_2px_10px_-4px_hsl(var(--primary)/0.35)]"
                      : "border-border bg-surface-2 hover:border-primary/30 hover:bg-surface"
                  }`}
                >
                  {/* Avatar: leva ao perfil */}
                  <Link
                    to="/perfil/$username"
                    params={{ username: c.peer.username }}
                    aria-label={`Ver perfil de ${c.peer.display_name}`}
                    className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-surface transition-transform hover:scale-105 ${
                      inChallenge ? "avatar-ring-flame" : "ring-2 ring-border"
                    }`}
                  >
                    {c.peer.avatar_url ? (
                      <img src={c.peer.avatar_url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm font-bold text-muted-foreground">
                        {c.peer.display_name[0]?.toUpperCase() ?? "?"}
                      </div>
                    )}
                  </Link>

                  {/* Área clicável leva ao chat */}
                  <Link
                    to="/mensagens/$username"
                    params={{ username: c.peer.username }}
                    className="min-w-0 flex-1"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold">{c.peer.display_name}</p>
                      <span className={`shrink-0 text-[10px] ${c.unread ? "font-bold text-primary" : "text-muted-foreground"}`}>
                        {formatDistanceToNow(new Date(c.lastAt), { locale: ptBR, addSuffix: true })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p className={`truncate text-xs ${c.unread ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                        {c.lastFromMe ? "Você: " : ""}
                        {c.lastBody}
                      </p>
                      {c.unread && <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />}
                    </div>

                    {/* Progresso do desafio do peer */}
                    {inChallenge && (
                      <div className="mt-2 flex items-center gap-2">
                        <Flame className="h-3 w-3 shrink-0 text-orange-500" />
                        <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-surface">
                          <div
                            className="challenge-flame-bar h-full rounded-full"
                            style={{ width: `${Math.max(3, Math.min(100, c.challengePct ?? 0))}%` }}
                          />
                        </div>
                        <span className="shrink-0 text-[10px] font-bold text-orange-500">
                          {Math.round(c.challengePct ?? 0)}%
                        </span>
                      </div>
                    )}
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
