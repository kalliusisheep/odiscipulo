import { Link, useRouterState } from "@tanstack/react-router";
import { Home, BookOpen, GraduationCap, MessageSquareHeart, User } from "lucide-react";
import { useApp } from "@/lib/app-context";

const tabs = [
  { to: "/home", labelKey: "nav.home", icon: Home },
  { to: "/estudos", labelKey: "nav.studies", icon: GraduationCap },
  { to: "/biblia", labelKey: "nav.bible", icon: BookOpen },
  { to: "/mural", labelKey: "nav.feed", icon: MessageSquareHeart },
  { to: "/perfil", labelKey: "nav.profile", icon: User },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { t } = useApp();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/40 bg-background/92 pb-[env(safe-area-inset-bottom)] shadow-[0_-12px_28px_-20px_rgba(0,0,0,0.85)] backdrop-blur-xl">
      <ul className="mx-auto flex max-w-lg items-stretch justify-around">
        {tabs.map(({ to, labelKey, icon: Icon }) => {
          const active = pathname === to || pathname.startsWith(to + "/");
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                aria-current={active ? "page" : undefined}
                className={`relative flex min-h-16 flex-col items-center justify-center gap-1 rounded-2xl py-2.5 text-xs transition-all ${
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {active && (
                  <span className="absolute top-0 h-0.5 w-8 rounded-b-full bg-primary shadow-[0_0_12px_var(--primary)]" />
                )}
                <Icon className={`h-5 w-5 transition-transform ${active ? "scale-110" : ""}`} />
                <span className="font-medium">{t(labelKey)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
