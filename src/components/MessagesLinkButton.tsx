import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function MessagesLinkButton() {
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let compute: () => Promise<void> = async () => {};
    void (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const myId = u.user.id;
      compute = async () => {
        const { count } = await supabase
          .from("messages")
          .select("id", { count: "exact", head: true })
          .eq("recipient_id", myId)
          .is("read_at", null);
        setUnread(count ?? 0);
      };
      await compute();
      channel = supabase
        .channel(`msg-badge-${myId}-${Math.random().toString(36).slice(2)}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "messages", filter: `recipient_id=eq.${myId}` },
          () => void compute(),
        )
        .subscribe();
      window.addEventListener("disciple:messages-read", compute);
    })();
    return () => {
      if (channel) void supabase.removeChannel(channel);
      window.removeEventListener("disciple:messages-read", compute);
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
