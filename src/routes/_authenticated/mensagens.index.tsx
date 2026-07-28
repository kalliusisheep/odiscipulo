import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, MessageCircle, Plus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getMyChallengePartnerIds } from "@/lib/challenges";

export const Route = createFileRoute("/_authenticated/mensagens/")({
  component: MensagensListPage,
});

type Conversation = {
  peer: { id: string; display_name: string; username: string; avatar_url: string | null };
  lastBody: string;
  lastAt: string;
  lastFromMe: boolean;
  unread: boolean;
};

function MensagensListPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [flames, setFlames] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;
    void (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const myId = u.user.id;
      setFlames(await getMyChallengePartnerIds(myId));
      const load = async () => {
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
              body: m.body,
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
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "messages" },
          (payload) => {
            const m = payload.new as { sender_id: string; recipient_id: string };
            if (m.sender_id === myId || m.recipient_id === myId) void load();
          },
        )
        .subscribe();
    })();
    return () => {
      if (channel) void supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="mx-auto max-w-lg space-y-4 px-4 pt-6 pb-24">
      <header className="flex items-center gap-3">
        <Link to="/home" className="text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">Suas conversas</p>
          <h1 className="text-xl font-semibold">Mensagens</h1>
        </div>
        <Link
          to="/mensagens/novo"
          aria-label="Nova mensagem"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform hover:scale-105"
        >
          <Plus className="h-5 w-5" />
        </Link>
      </header>

      {loading && <p className="text-sm text-muted-foreground">Carregando…</p>}

      {!loading && conversations.length === 0 && (
        <div className="card-elevated flex flex-col items-center gap-3 p-8 text-center">
          <MessageCircle className="h-10 w-10 text-primary" />
          <p className="text-sm font-semibold">Nenhuma conversa ainda</p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Toque no botão{" "}
            <span className="mx-0.5 inline-flex h-5 w-5 translate-y-1 items-center justify-center rounded-full bg-primary align-middle text-primary-foreground">
              <Plus className="h-3 w-3" />
            </span>{" "}
            para adicionar um irmão(ã) pelo ID e começar a trocar mensagens.
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
        {conversations.map((c) => (
          <li key={c.peer.id}>
            <Link
              to="/mensagens/$username"
              params={{ username: c.peer.username }}
              className="flex items-center gap-3 rounded-2xl border border-border bg-surface-2 p-3 transition-colors hover:border-primary/40"
            >
              <div className={`h-11 w-11 shrink-0 overflow-hidden rounded-full bg-surface ${flames.has(c.peer.id) ? "avatar-ring-flame" : ""}`}>
                {c.peer.avatar_url && (
                  <img src={c.peer.avatar_url} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-semibold">{c.peer.display_name}</p>
                  <span className="shrink-0 text-[10px] text-muted-foreground">
                    {formatDistanceToNow(new Date(c.lastAt), { locale: ptBR, addSuffix: true })}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className={`truncate text-xs ${c.unread ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                    {c.lastFromMe ? "Você: " : ""}
                    {c.lastBody}
                  </p>
                  {c.unread && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
