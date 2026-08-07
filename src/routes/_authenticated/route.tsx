import { createFileRoute, Outlet, redirect, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AppProvider, useApp } from "@/lib/app-context";
import { CelebrationProvider } from "@/lib/celebration";
import { MascotProvider } from "@/lib/mascot";
import { BottomNav } from "@/components/BottomNav";
import { MentorFAB, MentorChat } from "@/components/Mentor";
import { touchLastSeen } from "@/lib/presence";
import { GameInviteOverlay } from "@/components/GameInviteOverlay";
import { PushNotifications } from "@/components/PushNotifications";

function AuthCheckPending() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
    </div>
  );
}

function MentorLayer({ hidden }: { hidden: boolean }) {
  const { setMentorOpen } = useApp();

  useEffect(() => {
    if (hidden) setMentorOpen(false);
  }, [hidden, setMentorOpen]);

  if (hidden) return null;

  return (
    <>
      <MentorFAB />
      <MentorChat />
    </>
  );
}


export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  pendingComponent: AuthCheckPending,
  pendingMs: 0,
  component: AuthedLayout,
});

function AuthedLayout() {
  useEffect(() => {
    const touch = () => void touchLastSeen();
    touch();
    const timer = window.setInterval(touch, 60_000);
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") touch();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  // Na conversa privada o compositor fica colado no rodapé (tela de altura
  // cheia). A barra de navegação e o balão do Mentor são "fixed" por cima
  // dela, então cobriam justamente os botões de emoji/microfone/enviar —
  // era por isso que o envio de áudio parecia não funcionar. Nessa tela
  // eles ficam ocultos.
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isPrivateChat = /^\/mensagens\/[^/]+$/.test(pathname);
  const isBibleReader =
    /^\\/biblia\\/\\d+\\/\\d+$/.test(pathname) ||
    pathname.startsWith("/biblia/estudo/");
  const isBibleOrGames =
    pathname === "/biblia" ||
    pathname.startsWith("/biblia/") ||
    pathname === "/jogos" ||
    pathname.startsWith("/jogos/");

  return (
    <AppProvider>
      <MascotProvider>
        <CelebrationProvider>
          <div className={`min-h-screen bg-background ${isPrivateChat || isBibleReader ? "" : "pb-24"}`}>
            <Outlet />
            <GameInviteOverlay />
            {!isBibleOrGames && <PushNotifications />}
            {!isPrivateChat && (
              <>
                <MentorLayer hidden={isBibleOrGames} />
                <BottomNav />
              </>
            )}
          </div>
        </CelebrationProvider>
      </MascotProvider>
    </AppProvider>
  );
}
