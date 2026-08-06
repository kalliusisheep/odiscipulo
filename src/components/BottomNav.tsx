import { Link, useRouterState } from "@tanstack/react-router";
import { Home, BookOpen, MessageSquareHeart, Trophy, User } from "lucide-react";

const tabs = [
  { to: "/home", label: "Inicial", icon: Home },
  { to: "/estudos", label: "Estudos", icon: BookOpen },
  { to: "/mural", label: "Mural", icon: MessageSquareHeart },
  { to: "/ranking", label: "Ranking", icon: Trophy },
  { to: "/perfil", label: "Perfil", icon: User },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 shadow-[0_-8px_24px_-18px_rgba(0,0,0,0.7)] backdrop-blur-lg">
      <ul className="mx-auto flex max-w-lg items-stretch justify-around">
        {tabs.map(({ to, label, icon: Icon }) => {
          const active = pathname === to || pathname.startsWith(to + "/");
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                aria-current={active ? "page" : undefined}
                className={`relative flex flex-col items-center justify-center gap-1 py-2.5 text-xs transition-all ${
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {active && <span className="absolute top-0 h-0.5 w-8 rounded-b-full bg-primary shadow-[0_0_12px_var(--primary)]" />}
                <Icon className={`h-5 w-5 transition-transform ${active ? "scale-110" : ""}`} />
                <span className="font-medium">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
