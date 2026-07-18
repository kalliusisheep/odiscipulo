import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, ArrowRight, Flame, BookOpen, Users, Sparkle } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Disciple — Discipulado cristão gamificado" },
      { name: "description", content: "Trilhas de estudo, quizzes e um Mentor IA para crescer na fé um dia por vez. Feito para igrejas, discipuladores e novos convertidos." },
      { property: "og:title", content: "Disciple" },
      { property: "og:description", content: "Discipulado cristão gamificado — um passo por dia." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <main className="min-h-screen bg-background">
      <section className="relative overflow-hidden px-6 pb-16 pt-20">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative mx-auto max-w-xl text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-primary-glow shadow-2xl shadow-primary/40">
            <Sparkles className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Discipulado que <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">forma hábito</span>
          </h1>
          <p className="mt-4 text-base text-muted-foreground">
            Trilhas curtas, quizzes, diário pessoal e um Mentor IA — para você crescer na fé um dia por vez, sustentado pela sua igreja e liderança local.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:scale-105"
            >
              Começar agora <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="text-xs text-muted-foreground">Gratuito. Sem cartão.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-24">
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { icon: BookOpen, title: "Trilhas com profundidade", body: "Do Novo Convertido à Liderança, com grego, hebraico e citações de teólogos." },
            { icon: Flame, title: "Ofensiva diária", body: "Streak, XP e níveis que reforçam consistência — nunca comparação hostil." },
            { icon: Sparkle, title: "Mentor Espiritual IA", body: "Companheiro de estudo, teologicamente neutro, que sempre te devolve à Palavra e à sua igreja." },
            { icon: Users, title: "Célula & Discipulador", body: "Ranking dentro do seu grupo. Modo Líder para acompanhar seus discípulos." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="card-elevated p-5">
              <Icon className="mb-3 h-6 w-6 text-primary" />
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
