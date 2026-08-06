import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { readingPlans, bibleStudies, aiMeditations } from "@/data/estudos";
import { planStorageKey } from "./estudos.plano.$id";

import { ThemeToggle } from "@/components/ThemeToggle";
import { Clock, CalendarDays, BookOpen, Sparkles, ArrowRight, ChevronRight, Compass } from "lucide-react";

export const Route = createFileRoute("/_authenticated/estudos/")({
  component: EstudosPage,
});

type Tab = "planos" | "biblicos" | "meditacao";

const tabs: { id: Tab; label: string; icon: typeof BookOpen }[] = [
  { id: "planos", label: "Planos", icon: CalendarDays },
  { id: "biblicos", label: "Bíblicos", icon: BookOpen },
  { id: "meditacao", label: "Meditação IA", icon: Sparkles },
];

function EstudosPage() {
  const [tab, setTab] = useState<Tab>("planos");
  const [planProgress, setPlanProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    const next: Record<string, number> = {};
    for (const p of readingPlans) {
      const raw = window.localStorage.getItem(planStorageKey(p.id));
      if (raw) {
        try { next[p.id] = (JSON.parse(raw) as number[]).length; } catch { /* ignore */ }
      }
    }
    setPlanProgress(next);
  }, []);


  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-lg px-4 pb-28 pt-5">
        <header className="flex items-center justify-between">
          <div><p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">Biblioteca</p><h1 className="mt-1 text-2xl font-extrabold tracking-tight">Estudos</h1></div>
          <ThemeToggle />
        </header>
        <section className="relative mt-5 overflow-hidden rounded-[1.75rem] border border-primary/15 shadow-xl shadow-black/20">
          <img src="/sheep-scholar.jpeg" alt="" className="h-52 w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/10 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur"><Compass className="h-3 w-3 text-primary-glow" /> Cresça na Palavra</span>
            <p className="mt-2 max-w-[17rem] text-sm font-semibold leading-snug text-white">Um momento de aprendizado para cada dia.</p>
          </div>
        </section>
        <p className="mt-4 px-1 text-xs leading-relaxed text-muted-foreground">Planos de leitura, estudos temáticos e meditações guiadas para aprofundar sua caminhada.</p>
        <div className="mt-5 rounded-2xl border border-border bg-surface/80 p-1.5 shadow-sm">
          <div className="grid grid-cols-3 gap-1">
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button key={t.id} onClick={() => setTab(t.id)} className={`flex min-w-0 flex-col items-center justify-center gap-2 rounded-xl px-1 py-3.5 text-sm font-extrabold leading-tight transition-all ${active ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"}`}>
                  <Icon className="h-4 w-4" /><span className="truncate">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>
        {tab === "planos" && (
          <section className="mt-6 space-y-3">
            <div className="flex items-end justify-between px-1"><div><p className="text-sm font-bold">Planos de leitura</p><p className="mt-0.5 text-[10px] text-muted-foreground">Uma rotina simples, um passo de cada vez.</p></div><CalendarDays className="h-4 w-4 text-muted-foreground/60" /></div>
            {readingPlans.map((p) => {
              const current = planProgress[p.id] ?? 0;
              const pct = Math.round((current / p.totalDays) * 100);
              return (
                <Link key={p.id} to="/estudos/plano/$id" params={{ id: p.id }} className="group block rounded-3xl border border-border bg-surface/75 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/35 hover:bg-surface">
                  <div className="flex items-center justify-between gap-2"><span className="rounded-full bg-success/15 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider text-success">Plano de leitura</span><ChevronRight className="h-4 w-4 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" /></div>
                  <h3 className="mt-3 text-base font-extrabold">{p.title}</h3><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{p.description}</p>
                  <div className="mt-4 flex items-center gap-3 text-[10px] text-muted-foreground"><span className="inline-flex items-center gap-1"><CalendarDays className="h-3 w-3" /> {p.totalDays} dias</span><span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {p.minutesPerDay} min/dia</span></div>
                  {current > 0 ? <div className="mt-4"><div className="flex items-center justify-between text-[10px]"><span className="font-bold text-success">Dia {current} de {p.totalDays}</span><span className="font-semibold text-muted-foreground">{pct}%</span></div><div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-2"><div className="h-full rounded-full bg-gradient-to-r from-success to-primary transition-all" style={{ width: pct + "%" }} /></div></div> : <div className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-primary">Começar plano <ArrowRight className="h-3 w-3" /></div>}
                </Link>
              );
            })}
          </section>
        )}
        {tab === "biblicos" && (
          <section className="mt-6 space-y-3"><div className="px-1"><p className="text-sm font-bold">Estudos bíblicos</p><p className="mt-0.5 text-[10px] text-muted-foreground">Explore temas centrais da fé cristã.</p></div>
            {bibleStudies.map((item) => <Link key={item.id} to="/estudos/biblico/$id" params={{ id: item.id }} className="group block rounded-3xl border border-border bg-surface/75 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/35"><div className="flex items-center justify-between gap-2"><span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider text-primary"><BookOpen className="h-3 w-3" /> Estudo bíblico</span><ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary" /></div><h3 className="mt-3 text-base font-extrabold">{item.title}</h3><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.description}</p><div className="mt-3 flex items-center justify-between gap-2"><p className="font-serif text-xs italic text-ancient">{item.passage}</p><span className="inline-flex shrink-0 items-center gap-1 text-[10px] text-muted-foreground"><Clock className="h-3 w-3" /> {item.minutes} min</span></div></Link>)}
          </section>
        )}
        {tab === "meditacao" && (
          <section className="mt-6 space-y-3"><div className="px-1"><p className="text-sm font-bold">Meditação guiada</p><p className="mt-0.5 text-[10px] text-muted-foreground">Pausas intencionais para ouvir e refletir.</p></div>
            {aiMeditations.map((item) => <Link key={item.id} to="/estudos/meditacao/$id" params={{ id: item.id }} className="group block rounded-3xl border border-border bg-surface/75 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-ancient/40"><div className="flex items-center justify-between gap-2"><span className="inline-flex items-center gap-1.5 rounded-full bg-ancient/15 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider text-ancient"><Sparkles className="h-3 w-3" /> Meditação IA</span><ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-ancient" /></div><h3 className="mt-3 text-base font-extrabold">{item.title}</h3><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.description}</p><div className="mt-3 flex items-center justify-between gap-2"><p className="font-serif text-xs italic text-ancient">{item.passage}</p><span className="inline-flex shrink-0 items-center gap-1 text-[10px] text-muted-foreground"><Clock className="h-3 w-3" /> {item.minutes} min</span></div></Link>)}
          </section>
        )}
      </div>
    </div>
  );
}
