import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export const Route = createFileRoute("/_authenticated/mensagens/$username")({
  component: MessagesPage,
});

type Msg = { id: string; sender_id: string; recipient_id: string; body: string; created_at: string };
type Peer = { id: string; display_name: string; username: string; avatar_url: string | null };

function MessagesPage() {
  const { username } = useParams({ from: "/_authenticated/mensagens/$username" });
  const [myId, setMyId] = useState<string | null>(null);
  const [peer, setPeer] = useState<Peer | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;
    void (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      setMyId(u.user.id);
      const { data: p } = await supabase
        .from("profiles")
        .select("id, display_name, username, avatar_url")
        .ilike("username", username)
        .maybeSingle();
      if (!p) return;
      setPeer(p as Peer);
      const { data: msgs } = await supabase
        .from("messages")
        .select("*")
        .or(`and(sender_id.eq.${u.user.id},recipient_id.eq.${p.id}),and(sender_id.eq.${p.id},recipient_id.eq.${u.user.id})`)
        .order("created_at", { ascending: true });
      setMessages((msgs ?? []) as Msg[]);

      channel = supabase
        .channel(`msg-${u.user.id}-${p.id}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "messages" },
          (payload) => {
            const m = payload.new as Msg;
            const involves =
              (m.sender_id === u.user!.id && m.recipient_id === p.id) ||
              (m.sender_id === p.id && m.recipient_id === u.user!.id);
            if (involves) setMessages((prev) => (prev.some((x) => x.id === m.id) ? prev : [...prev, m]));
          },
        )
        .subscribe();
    })();
    return () => {
      if (channel) void supabase.removeChannel(channel);
    };
  }, [username]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    if (myId && peer && typeof window !== "undefined") {
      window.localStorage.setItem(`disciple.lastRead.${myId}.${peer.id}`, new Date().toISOString());
    }
  }, [messages, myId, peer]);

  const send = async () => {
    const body = text.trim();
    if (!body || !peer || !myId || sending) return;
    setSending(true);
    const { data, error } = await supabase
      .from("messages")
      .insert({ sender_id: myId, recipient_id: peer.id, body })
      .select()
      .single();
    setSending(false);
    if (error) return;
    setText("");
    if (data) setMessages((prev) => (prev.some((x) => x.id === data.id) ? prev : [...prev, data as Msg]));
  };

  return (
    <div className="mx-auto flex h-[100dvh] max-w-lg flex-col">
      <header className="flex items-center gap-3 border-b border-border bg-background px-4 py-3">
        <Link to="/perfil/$username" params={{ username }} className="text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        {peer && (
          <>
            <div className="h-9 w-9 overflow-hidden rounded-full bg-surface-2">
              {peer.avatar_url && <img src={peer.avatar_url} alt="" className="h-full w-full object-cover" />}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{peer.display_name}</p>
              <p className="truncate text-[11px] text-muted-foreground">@{peer.username}</p>
            </div>
          </>
        )}
      </header>

      <div className="flex-1 space-y-2 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <p className="mt-8 text-center text-xs text-muted-foreground">
            Nenhuma mensagem ainda. Envie a primeira palavra de encorajamento!
          </p>
        )}
        {messages.map((m) => {
          const mine = m.sender_id === myId;
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                  mine ? "bg-primary text-primary-foreground" : "bg-surface-2 text-foreground"
                }`}
              >
                <p className="leading-relaxed">{m.body}</p>
                <p className={`mt-1 text-[10px] ${mine ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  {formatDistanceToNow(new Date(m.created_at), { locale: ptBR, addSuffix: true })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void send();
        }}
        className="flex items-center gap-2 border-t border-border bg-background px-3 py-3"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escreva uma mensagem…"
          className="flex-1 rounded-full border border-border bg-input px-4 py-2 text-sm outline-none focus:border-primary"
        />
        <button
          type="submit"
          disabled={!text.trim() || sending}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50"
          aria-label="Enviar"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
