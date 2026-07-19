import { createFileRoute, Link } from "@tanstack/react-router";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowLeft, TrendingUp, AlertTriangle, Users, Plus, Send, Calendar, Building2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/lider")({
  component: LiderPage,
});

// Mock de discípulos vinculados (versão simples)
const discipulos = [
  { name: "Lucas F.", level: 3, streak: 9, alert: null as string | null, progress: 40 },
  { name: "Rebeca S.", level: 5, streak: 0, alert: "Streak quebrado há 3 dias", progress: 62 },
  { name: "Ana C.", level: 4, streak: 21, alert: null, progress: 88 },
  { name: "Tiago N.", level: 2, streak: 4, alert: "Baixo desempenho em quiz", progress: 15 },
];

function LiderPage() {
  return (
    <div className="mx-auto max-w-lg space-y-5 px-4 pt-6">
      <header className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Link to="/home" className="rounded-full p-2 hover:bg-surface">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <p className="text-xs text-muted-foreground">Painel</p>
            <h1 className="text-xl font-semibold">Modo Líder</h1>
          </div>
        </div>
        <ThemeToggle />
      </header>

      {/* Painel Igreja resumido */}
      <section className="card-elevated overflow-hidden">
        <div className="flex items-center gap-2 border-b border-border px-5 py-3">
          <Building2 className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">Painel da Igreja</h2>
        </div>
        <div className="grid grid-cols-3 divide-x divide-border">
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">124</p>
            <p className="text-[10px] uppercase text-muted-foreground">Ativos</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-success">18</p>
            <p className="text-[10px] uppercase text-muted-foreground">Novos convertidos</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-ancient">67%</p>
            <p className="text-[10px] uppercase text-muted-foreground">Engajamento</p>
          </div>
        </div>
        <p className="border-t border-border px-5 py-3 text-xs text-muted-foreground">
          Trilha mais realizada: <span className="font-semibold text-foreground">Novo Convertido</span>
        </p>
      </section>

      {/* Ações rápidas */}
      <div className="grid grid-cols-2 gap-2">
        <ActionBtn icon={Plus} label="Novo grupo" />
        <ActionBtn icon={Send} label="Mensagem" />
        <ActionBtn icon={Calendar} label="Encontro" />
        <ActionBtn icon={Users} label="Aprovar etapa" />
      </div>

      {/* Discípulos */}
      <section className="space-y-2">
        <h2 className="px-1 text-sm font-semibold text-muted-foreground">Seus discípulos</h2>
        {discipulos.map((d) => (
          <div key={d.name} className="card-elevated p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary">
                {d.name[0]}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{d.name}</p>
                <p className="text-[11px] text-muted-foreground">Nv {d.level} · {d.streak}d de ofensiva</p>
              </div>
              <TrendingUp className="h-4 w-4 text-success" />
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-2">
              <div className="h-full bg-primary" style={{ width: `${d.progress}%` }} />
            </div>
            {d.alert && (
              <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-streak/10 px-2 py-1 text-[11px] text-streak">
                <AlertTriangle className="h-3 w-3" /> {d.alert}
              </div>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}

function ActionBtn({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <button className="card-elevated flex items-center gap-2 p-3 text-sm font-medium transition-all hover:border-primary/50">
      <Icon className="h-4 w-4 text-primary" /> {label}
    </button>
  );
}
