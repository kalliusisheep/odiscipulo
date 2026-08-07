import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Send } from "lucide-react";
import { format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { EmojiPicker } from "@/components/EmojiPicker";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { VoiceNotePlayer } from "@/components/VoiceNotePlayer";
import { uploadChatVoiceMessage } from "@/lib/voice-upload";
import { formatPresence, isPresenceOnline } from "@/lib/presence";

export const Route = createFileRoute("/_authenticated/mensagens/$username")({
  component: MessagesPage,
});

type Msg = {
  id: string;
  sender_id: string;
  recipient_id: string;
  body: string | null;
  audio_url: string | null;
  audio_duration_seconds: number | null;
  created_at: string;
  read_at: string | null;
};
type Peer = { id: string; display_name: string; username: string; avatar_url: string | null; last_seen_at: string | null };

function dayLabel(date: Date) {
  const label = format(date, "d 'de' MMMM", { locale: ptBR });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function MessagesPage() {
  const { username } = useParams({ from: "/_authenticated/mensagens/$username" });
  const [myId, setMyId] = useState<string | null>(null);
  const [peer, setPeer] = useState<Peer | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;
    void (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      setMyId(u.user.id);
      const withPresence = await supabase
        .from("profiles")
        .select("id, display_name, username, avatar_url, last_seen_at, updated_at")
        .ilike("username", username)
        .maybeSingle();
      const p = withPresence.error
        ? (await supabase
            .from("profiles")
            .select("id, display_name, username, avatar_url, updated_at")
            .ilike("username", username)
            .maybeSingle()).data
        : withPresence.data;
      if (!p) return;
      const row = p as { id: string; last_seen_at?: string | null; updated_at?: string | null };
      setPeer({ ...p, last_seen_at: row.last_seen_at ?? row.updated_at ?? null } as Peer);
      const { data: msgs } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${u.user.id},recipient_id.eq.${p.id}),and(sender_id.eq.${p.id},recipient_id.eq.${u.user.id})`,
        )
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
            if (involves)
              setMessages((prev) => (prev.some((x) => x.id === m.id) ? prev : [...prev, m]));
          },
        )
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "profiles", filter: `id=eq.${p.id}` },
          (payload) => {
            const profile = payload.new as { last_seen_at?: string | null; updated_at?: string | null };
            setPeer((current) => current ? {
              ...current,
              last_seen_at: profile.last_seen_at ?? profile.updated_at ?? current.last_seen_at,
            } : current);
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
    if (!myId || !peer) return;
    void (async () => {
      const { error } = await supabase
        .from("messages")
        .update({ read_at: new Date().toISOString() })
        .eq("recipient_id", myId)
        .eq("sender_id", peer.id)
        .is("read_at", null);
      if (!error && typeof window !== "undefined") {
        window.dispatchEvent(new Event("disciple:messages-read"));
      }
    })();
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
    if (data)
      setMessages((prev) => (prev.some((x) => x.id === data.id) ? prev : [...prev, data as Msg]));
  };

  const sendAudio = async (blob: Blob, seconds: number, mimeType: string) => {
    if (!peer || !myId) return;
    try {
      const url = await uploadChatVoiceMessage(myId, blob, mimeType);
      const { data, error } = await supabase
        .from("messages")
        .insert({
          sender_id: myId,
          recipient_id: peer.id,
          body: null,
          audio_url: url,
          audio_duration_seconds: seconds,
        })
        .select()
        .single();
      if (error) throw error;
      if (data)
        setMessages((prev) => (prev.some((x) => x.id === data.id) ? prev : [...prev, data as Msg]));
    } catch {
      window.dispatchEvent(new CustomEvent("disciple:toast", {
        detail: { type: "error", message: "Não foi possível enviar o áudio. Tente novamente." },
      }));
    }
  };

  const [voiceExpanded, setVoiceExpanded] = useState(false);

  const insertEmoji = (emoji: string) => {
    setText((t) => t + emoji);
    inputRef.current?.focus();
  };

  const peerPresence = peer ? formatPresence(peer.last_seen_at) : "Carregando presença";
  const peerOnline = isPresenceOnline(peer?.last_seen_at);

  return (
    <div className="mx-auto flex h-[100dvh] max-w-lg flex-col bg-gradient-to-b from-surface/60 via-background to-background">
      <header className="flex items-center gap-3 border-b border-border bg-background/90 px-4 py-3 shadow-sm backdrop-blur-xl">
        <Link
          to="/mensagens"
          className="text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        {peer && (
          <Link
            to="/perfil/$username"
            params={{ username: peer.username }}
            className="flex min-w-0 flex-1 items-center gap-3 rounded-xl px-1 py-1 transition-colors hover:bg-surface-2"
            aria-label={`Ver perfil de ${peer.display_name}`}
          >
            <div className={`relative h-11 w-11 shrink-0 overflow-visible rounded-full bg-surface-2 ring-2 ${peerOnline ? "ring-emerald-400/70" : "ring-border"}`}>
              <div className="absolute inset-0 overflow-hidden rounded-full">
                {peer.avatar_url ? (
                  <img src={peer.avatar_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs font-bold text-muted-foreground">
                    {peer.display_name[0]?.toUpperCase() ?? "?"}
                  </div>
                )}
              </div>
              <span
                className={`absolute -bottom-1 -right-1 z-10 h-4 w-4 rounded-full border-2 border-background ${peerOnline ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.85)]" : "bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.7)]"}`}
                aria-label={peerOnline ? "Online" : "Offline"}
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold">{peer.display_name}</p>
              <div className="mt-0.5 flex items-center gap-1.5">
                <span className={`h-2 w-2 shrink-0 rounded-full ${peerOnline ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.75)]" : "bg-rose-400 shadow-[0_0_7px_rgba(251,113,133,0.45)]"}`} />
                <p className={`truncate text-[11px] ${peerOnline ? "font-semibold text-emerald-400" : "text-muted-foreground"}`}>
                  {peerOnline ? "Online agora" : `Offline · ${peerPresence.replace("Visto ", "")}`}
                </p>
              </div>
            </div>
          </Link>
        )}
      </header>

      <div className="flex-1 space-y-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div className="mt-12 flex flex-col items-center gap-2 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl">
              🕊️
            </div>
            <p className="text-sm text-muted-foreground">
              Nenhuma mensagem ainda.
              <br />
              Envie a primeira palavra de encorajamento!
            </p>
          </div>
        )}
        {messages.map((m, i) => {
          const mine = m.sender_id === myId;
          const prev = messages[i - 1];
          const showDaySeparator =
            !prev || !isSameDay(new Date(prev.created_at), new Date(m.created_at));
          const grouped = prev && prev.sender_id === m.sender_id && !showDaySeparator;

          return (
            <div key={m.id}>
              {showDaySeparator && (
                <div className="my-4 flex items-center justify-center">
                  <span className="rounded-full bg-surface-2 px-3 py-1 text-[11px] font-medium text-muted-foreground shadow-sm">
                    {dayLabel(new Date(m.created_at))}
                  </span>
                </div>
              )}
              <div
                className={`flex items-end gap-2 ${mine ? "justify-end" : "justify-start"} ${grouped ? "mt-0.5" : "mt-3"}`}
              >
                {!mine && (
                  <div
                    className={`h-6 w-6 shrink-0 overflow-hidden rounded-full bg-surface-2 ${grouped ? "opacity-0" : ""}`}
                  >
                    {peer?.avatar_url ? (
                      <img src={peer.avatar_url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-muted-foreground">
                        {peer?.display_name[0]?.toUpperCase() ?? "?"}
                      </div>
                    )}
                  </div>
                )}
                <div
                  className={`group max-w-[78%] px-4 py-2.5 shadow-sm transition-transform ${
                    mine
                      ? "rounded-2xl rounded-br-md bg-gradient-to-br from-primary to-primary-glow text-primary-foreground"
                      : "rounded-2xl rounded-bl-md bg-surface-2 text-foreground"
                  }`}
                >
                  {m.audio_url ? (
                    <VoiceNotePlayer src={m.audio_url} className="h-9 w-56 max-w-full" />
                  ) : (
                    <p className="whitespace-pre-wrap break-words leading-relaxed">{m.body}</p>
                  )}
                  <p
                    className={`mt-1 text-right text-[10px] ${
                      mine ? "text-primary-foreground/70" : "text-muted-foreground"
                    }`}
                  >
                    {format(new Date(m.created_at), "HH:mm")}
                  </p>
                </div>
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
        className="flex items-center gap-2 rounded-t-3xl border-t border-border bg-background/95 px-3 py-3.5 shadow-[0_-8px_24px_-20px_hsl(var(--primary)/0.6)] backdrop-blur-xl"
      >
        <EmojiPicker onSelect={insertEmoji} className={voiceExpanded ? "hidden" : undefined} />
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escreva uma mensagem…"
          className={`min-w-0 flex-1 rounded-2xl border border-border bg-input px-4 py-3 text-base outline-none transition-colors focus:border-primary ${voiceExpanded ? "hidden" : ""}`}
        />
        {text.trim() && !voiceExpanded ? (
          <button
            type="submit"
            disabled={sending}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform active:scale-95 disabled:opacity-50"
            aria-label="Enviar"
          >
            <Send className="h-4 w-4" />
          </button>
        ) : (
          <VoiceRecorder onSend={sendAudio} maxSeconds={60} onExpandedChange={setVoiceExpanded} />
        )}
      </form>
    </div>
  );
}
