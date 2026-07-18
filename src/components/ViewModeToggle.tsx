import { useApp } from "@/lib/app-context";
import { GraduationCap, ShieldCheck } from "lucide-react";

export function ViewModeToggle() {
  const { viewMode, setViewMode } = useApp();
  return (
    <div className="inline-flex rounded-full border border-border bg-surface p-1 text-xs">
      <button
        onClick={() => setViewMode("aluno")}
        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium transition-all ${
          viewMode === "aluno" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground"
        }`}
      >
        <GraduationCap className="h-3.5 w-3.5" /> Aluno
      </button>
      <button
        onClick={() => setViewMode("lider")}
        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium transition-all ${
          viewMode === "lider" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground"
        }`}
      >
        <ShieldCheck className="h-3.5 w-3.5" /> Líder
      </button>
    </div>
  );
}
