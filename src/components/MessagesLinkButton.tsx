import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function MessagesLinkButton() {
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;
    void (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const myId = u.user.id;
      const compute = async () => {
        const { data: msgs } = await supabase
          .from("messages")
          .select("sender_id, recipient_id, created_at")
          .eq("recipient_id", myId)
          .order("created_at", { ascending: false });
        if (typeof window === "undefined") return;
        const latest = new Map<string, string>();
        for (const m of msgs ?? []) {
          if (!latest.has(m.sender_id)) latest.set(m.sender_id, m.created_at);
        }
        let count = 0;
        latest.forEach((at, peerId) => {
          const lr = window.localStorage.getItem(`disciple.lastRead.${myId}.${peerId}`);
          if (!lr || new Date(at) > new Date(lr)) count += 1;
        });
        setUnread(count);
      };
      await compute();
      channel = supabase
        .channel(`msg-badge-${myId}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "messages", filter: `recipient_id=eq.${myId}` },
          () => void compute(),
        )
        .subscribe();
    })();
    return () => {
      if (channel) void supabase.removeChannel(channel);
    };
  }, []);

  return (
    <Link
      to="/mensagens"
      aria-label="Mensagens"
      className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface-2 text-foreground hover:border-primary/40 hover:text-primary"
    >
      <MessageCircle className="h-5 w-5" />
      {unread > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full border-2 border-background bg-primary px-1 text-[10px] font-bold text-primary-foreground">
          {unread > 9 ? "9+" : unread}
        </span>
      )}
    </Link>
  );
}
