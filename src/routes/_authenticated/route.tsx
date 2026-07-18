import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { AppProvider } from "@/lib/app-context";
import { BottomNav } from "@/components/BottomNav";
import { MentorFAB, MentorChat } from "@/components/Mentor";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: AuthedLayout,
});

function AuthedLayout() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-background pb-24">
        <Outlet />
        <MentorFAB />
        <MentorChat />
        <BottomNav />
      </div>
    </AppProvider>
  );
}
