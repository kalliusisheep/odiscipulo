import { Link, useRouterState } from "@tanstack/react-router";
import { Home, BookOpen, MessageSquareHeart, Trophy, User } from "lucide-react";

const tabs = [
  { to: "/home", label: "Inicial", icon: Home },
  { to: "/estudos", label: "Estudos", icon: BookOpen },
  { to: "/mural", label: "Feed", icon: MessageSquareHeart },
  { to: "/ranking", label: "Ranking", icon: Trophy },
  { to: "/perfil", label: "Perfil", icon: User },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-surface/95 backdrop-blur-lg">
      <ul className="mx-auto flex max-w-lg items-stretch justify-around">
        {tabs.map(({ to, label, icon: Icon }) => {
          const active = pathname === to || pathname.startsWith(to + "/");
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                className={`flex flex-col items-center justify-center gap-1 py-3 text-xs transition-all ${
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
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
