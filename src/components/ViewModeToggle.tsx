import { useNavigate } from "@tanstack/react-router";
import { useApp } from "@/lib/app-context";
import { GraduationCap, ShieldCheck } from "lucide-react";

export function ViewModeToggle() {
  const { viewMode, setViewMode } = useApp();
  const navigate = useNavigate();

  const activateLeaderMode = () => {
    setViewMode("lider");
    void navigate({ to: "/home" });
  };

  return (
    <div className="inline-flex rounded-full border border-border bg-surface p-1 text-xs">
      <button
        type="button"
        onClick={() => setViewMode("aluno")}
        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium transition-all ${
          viewMode === "aluno" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground"
        }`}
      >
        <GraduationCap className="h-3.5 w-3.5" /> Aluno
      </button>
      <button
        type="button"
        onClick={activateLeaderMode}
        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium transition-all ${
          viewMode === "lider" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground"
        }`}
      >
        <ShieldCheck className="h-3.5 w-3.5" /> Líder
      </button>
    </div>
  );
}
