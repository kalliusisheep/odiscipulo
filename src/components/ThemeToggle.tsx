import { useApp } from "@/lib/app-context";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme, t } = useApp();
  const isDark = theme === "black" || theme === "pink";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? t("theme.activateLight") : t("theme.activateDark")}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-border/40 bg-surface/85 text-muted-foreground shadow-sm transition-all hover:border-primary/40 hover:bg-surface-2 hover:text-primary active:scale-95 ${className}`}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
