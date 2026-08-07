import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, BookOpen, ChevronDown, ChevronRight, Sparkles } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/_authenticated/biblia/teologia")({
  head: () => ({
    meta: [
      { title: "Teologia Sistemática — Disciple" },
      {
        name: "description",
        content: "Explore os principais temas da teologia cristã de forma organizada e progressiva.",
      },
    ],
  }),
  component: TeologiaSistematicaPage,
});

type TheologyTopic = {
  id: string;
  title: string;
  subtitle: string;
  subtopics: string[];
};

const theologyTopics: TheologyTopic[] = [
  {
    id: "prolegomenos",
    title: "Prolegômenos",
    subtitle: "A introdução ao estudo da teologia",
    subtopics: ["O que é teologia", "Fontes do conhecimento teológico", "Método e limites da teologia"],
  },
  {
    id: "bibliologia",
    title: "Bibliologia",
    subtitle: "A doutrina das Sagradas Escrituras",
    subtopics: ["Revelação", "Inspiração", "Cânon, autoridade e suficiência", "Preservação das Escrituras"],
  },
  {
    id: "teontologia",
    title: "Teontologia",
    subtitle: "O ser, os atributos e as obras de Deus",
    subtopics: ["A existência de Deus", "Os atributos de Deus", "A Trindade", "A criação e a providência"],
  },
  {
    id: "angelologia",
    title: "Angelologia",
    subtitle: "Os anjos e os seres espirituais",
    subtopics: ["A natureza dos anjos", "O ministério dos anjos", "Anjos na história da redenção"],
  },
  {
    id: "demonologia",
    title: "Demonologia",
    subtitle: "O mal espiritual e sua oposição a Deus",
    subtopics: ["A realidade do mal", "Satanás e seus anjos", "Conflito espiritual e vitória de Cristo"],
  },
  {
    id: "antropologia",
    title: "Antropologia",
    subtitle: "A criação e a natureza do ser humano",
    subtopics: ["Criação do ser humano", "A imagem de Deus", "Constituição e propósito humano", "Destino do ser humano"],
  },
  {
    id: "hamartiologia",
    title: "Hamartiologia",
    subtitle: "A origem, a natureza e os efeitos do pecado",
    subtopics: ["A origem do pecado", "A natureza do pecado", "As consequências do pecado", "Pecado e redenção"],
  },
  {
    id: "cristologia",
    title: "Cristologia",
    subtitle: "A pessoa e a obra de Jesus Cristo",
    subtopics: ["A pessoa de Cristo", "A encarnação", "A obra de Cristo", "A ressurreição e a exaltação"],
  },
  {
    id: "pneumatologia",
    title: "Pneumatologia",
    subtitle: "A pessoa e a obra do Espírito Santo",
    subtopics: ["A pessoa do Espírito Santo", "A obra na criação", "Regeneração e santificação", "Dons e fruto do Espírito"],
  },
  {
    id: "soteriologia",
    title: "Soteriologia",
    subtitle: "A salvação realizada por Deus",
    subtopics: ["Graça e eleição", "Chamado e conversão", "Justificação", "Santificação e perseverança"],
  },
  {
    id: "eclesiologia",
    title: "Eclesiologia",
    subtitle: "A natureza e a missão da Igreja",
    subtopics: ["A natureza da Igreja", "As marcas da Igreja", "Dons e ministérios", "As ordenanças"],
  },
  {
    id: "escatologia",
    title: "Escatologia",
    subtitle: "A consumação do plano de Deus",
    subtopics: ["O retorno de Cristo", "A ressurreição e o juízo", "O reino de Deus", "A nova criação"],
  },
];

function TeologiaSistematicaPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="bible-index-shell min-h-screen pb-28">
      <header className="bible-index-header sticky top-0 z-30 border-b border-border/20 bg-background/85 backdrop-blur-2xl">
        <div className="bible-index-header-inner mx-auto max-w-lg px-5 pb-4 pt-4">
          <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
            <Link
              to="/biblia/"
              aria-label="Voltar para a Bíblia"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/40 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary active:scale-95"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>

            <div className="min-w-0 text-center">
              <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-muted-foreground/70">
                Bíblia de Estudos
              </p>
              <h1 className="mt-1 truncate text-[1.2rem] font-semibold leading-none tracking-[-0.02em]">
                Teologia Sistemática
              </h1>
            </div>

            <ThemeToggle className="h-9 w-9 rounded-full border-border/40 bg-transparent" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-5 pb-8 pt-6">
        <section className="bible-theology-intro">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="h-4 w-4" />
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em]">
              Aprofundando na Palavra
            </p>
          </div>
          <h2 className="mt-3 text-2xl font-black tracking-tight">
            Fundamentos da fé cristã
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Organize sua jornada de estudo por temas e avance com clareza pelas principais
            doutrinas da fé cristã.
          </p>
        </section>

        <section className="mt-6 space-y-3" aria-label="Temas de teologia sistemática">
          {theologyTopics.map((topic, index) => {
            const isOpen = expandedId === topic.id;
            const panelId = `theology-topic-${topic.id}`;

            return (
              <div key={topic.id} className={`bible-testament-group ${isOpen ? "is-open" : ""}`}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setExpandedId((current) => (current === topic.id ? null : topic.id))}
                  className="bible-testament-toggle group flex w-full items-center gap-3 text-left"
                >
                  <span
                    className={`bible-testament-badge flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[9px] font-semibold tracking-[0.08em] transition-colors ${
                      isOpen
                        ? "border-primary/40 text-primary"
                        : "border-border/50 text-muted-foreground"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className={`block text-sm font-medium tracking-[-0.01em] ${
                      isOpen ? "text-primary" : "text-foreground"
                    }`}>
                      {topic.title}
                    </span>
                    <span className="mt-0.5 block text-[10px] font-medium text-muted-foreground">
                      {topic.subtitle}
                    </span>
                  </span>

                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </button>

                <div id={panelId} hidden={!isOpen} className="bible-testament-books">
                  <div className="bible-book-list">
                    {topic.subtopics.map((subtopic, subtopicIndex) => (
                      <div
                        key={subtopic}
                        className="bible-book-row flex items-center gap-3"
                      >
                        <span className="bible-book-abbr flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/40 text-[10px] font-bold text-muted-foreground">
                          {String(subtopicIndex + 1).padStart(2, "0")}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold text-foreground">
                            {subtopic}
                          </span>
                          <span className="mt-0.5 block text-[10px] text-muted-foreground">
                            Tema para aprofundamento
                          </span>
                        </span>
                        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/55" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        <div className="mt-6 flex items-center justify-center gap-2 text-center text-[10px] font-medium text-muted-foreground">
          <BookOpen className="h-3.5 w-3.5 text-primary" />
          Explore um tema por vez e construa uma visão completa da fé.
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
