import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AppProvider } from "@/lib/app-context";
import { CelebrationProvider } from "@/lib/celebration";
import { MascotProvider } from "@/lib/mascot";
import { BottomNav } from "@/components/BottomNav";
import { MentorFAB, MentorChat } from "@/components/Mentor";

function AuthCheckPending() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
    </div>
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
  return (
    <AppProvider>
      <CelebrationProvider>
        <MascotProvider>
          <div className="min-h-screen bg-background pb-24">
            <Outlet />
            <MentorFAB />
            <MentorChat />
            <BottomNav />
          </div>
        </MascotProvider>
      </CelebrationProvider>
    </AppProvider>
  );
}
