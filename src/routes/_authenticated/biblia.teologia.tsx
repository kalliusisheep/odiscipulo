import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, BookOpen, ChevronDown, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { theologyModules, type TheologyChapter, type TheologyModule } from "@/data/teologia";

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

function TeologiaSistematicaPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedStudy, setSelectedStudy] = useState<{ moduleId: string; chapterId: string } | null>(
    null,
  );
  const selectedModule = selectedStudy
    ? theologyModules.find((item) => item.id === selectedStudy.moduleId)
    : undefined;
  const selectedChapter = selectedModule?.chapters.find(
    (item) => item.id === selectedStudy?.chapterId,
  );

  if (selectedModule && selectedChapter) {
    return (
      <TheologyStudyView
        module={selectedModule}
        chapter={selectedChapter}
        onBack={() => setSelectedStudy(null)}
        onSelectStudy={(moduleId, chapterId) => setSelectedStudy({ moduleId, chapterId })}
      />
    );
  }

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
          {theologyModules.map((topic, index) => {
            const isOpen = expandedId === topic.id;
            const panelId = `theology-topic-${topic.id}`;

            return (
              <div key={topic.id} className={`bible-testament-group ${isOpen ? "is-open" : ""}`}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => {
                    setExpandedId((current) => (current === topic.id ? null : topic.id));
                  }}
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
                    <span
                      className={`block text-sm font-medium tracking-[-0.01em] ${
                        isOpen ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {topic.title}
                    </span>
                    <span className="mt-0.5 block text-[10px] font-medium text-muted-foreground">
                      {topic.subtitle}
                    </span>
                  </span>

                  <span className="shrink-0 text-[10px] font-semibold tabular-nums text-muted-foreground/70">
                    {topic.chapters.length} temas
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </button>

                <div id={panelId} hidden={!isOpen} className="bible-testament-books">
                  {topic.introduction && (
                    <p className="mx-3 mb-3 whitespace-pre-line rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3 text-xs leading-6 text-muted-foreground">
                      {topic.introduction}
                    </p>
                  )}
                  <div className="bible-book-list">
                    {topic.chapters.map((chapter, chapterIndex) => (
                      <button
                        key={chapter.id}
                        type="button"
                        onClick={() => setSelectedStudy({ moduleId: topic.id, chapterId: chapter.id })}
                        aria-label={`Abrir estudo: ${chapter.title}`}
                        className="bible-book-row flex w-full cursor-pointer items-center gap-3 text-left transition-colors hover:bg-primary/5 active:scale-[0.99]"
                      >
                        <span className="bible-book-abbr flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/40 text-[10px] font-bold text-muted-foreground">
                          {String(chapterIndex + 1).padStart(2, "0")}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold text-foreground">
                            {chapter.title}
                          </span>
                          <span className="mt-0.5 block text-[10px] text-muted-foreground">
                            Abrir estudo completo e referências
                          </span>
                        </span>
                        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/55" />
                      </button>
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
    </div>
  );
}


function TheologyStudyView({
  module,
  chapter,
  onBack,
  onSelectStudy,
}: {
  module: TheologyModule;
  chapter: TheologyChapter;
  onBack: () => void;
  onSelectStudy: (moduleId: string, chapterId: string) => void;
}) {
  const chapterIndex = module.chapters.findIndex((item) => item.id === chapter.id);
  const previousChapter = chapterIndex > 0 ? module.chapters[chapterIndex - 1] : null;
  const nextChapter =
    chapterIndex < module.chapters.length - 1 ? module.chapters[chapterIndex + 1] : null;

  return (
    <div className="bible-index-shell min-h-screen pb-28">
      <header className="bible-index-header sticky top-0 z-30 border-b border-border/20 bg-background/85 backdrop-blur-2xl">
        <div className="mx-auto max-w-lg px-5 pb-4 pt-4">
          <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              aria-label="Voltar para Teologia Sistemática"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/40 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary active:scale-95"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            <div className="min-w-0 text-center">
              <p className="truncate text-[9px] font-semibold uppercase tracking-[0.2em] text-primary">
                {module.title}
              </p>
              <h1 className="mt-1 truncate text-[1.05rem] font-bold leading-tight">
                Estudo teológico
              </h1>
            </div>

            <ThemeToggle className="h-9 w-9 rounded-full border-border/40 bg-transparent" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-5 pb-8 pt-6">
        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          <span>{module.title}</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-primary">
            {chapterIndex + 1} de {module.chapters.length}
          </span>
        </div>

        <section className="mt-4 rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background/70 to-background p-5 shadow-[0_18px_48px_-34px_hsl(var(--primary))]">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="h-4 w-4" />
            <span className="text-[10px] font-extrabold uppercase tracking-[0.2em]">
              Aprofundando na Palavra
            </span>
          </div>
          <h2 className="mt-4 text-2xl font-black leading-tight tracking-[-0.03em]">
            {chapter.title}
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {module.subtitle}
          </p>
        </section>

        <article className="mt-4 rounded-3xl border border-border/25 bg-background/45 p-5">
          <p className="whitespace-pre-line text-[0.98rem] leading-8 text-foreground/90">
            {chapter.content}
          </p>

          <div className="mt-6 border-t border-border/20 pt-4">
            <div className="flex items-center gap-2 text-primary">
              <BookOpen className="h-4 w-4" />
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em]">
                Referências bíblicas
              </p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {chapter.references.map((reference) => (
                <span
                  key={reference}
                  className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-[11px] font-semibold text-primary"
                >
                  {reference}
                </span>
              ))}
            </div>
          </div>
        </article>

        <nav className="mt-5 grid grid-cols-2 gap-3" aria-label="Navegação entre estudos">
          {previousChapter ? (
            <button
              type="button"
              onClick={() => onSelectStudy(module.id, previousChapter.id)}
              className="flex min-h-16 items-center gap-2 rounded-2xl border border-border/25 bg-background/35 px-3 py-3 text-left transition-colors hover:border-primary/30 active:scale-[0.98]"
            >
              <ChevronLeft className="h-4 w-4 shrink-0 text-primary" />
              <span className="min-w-0">
                <span className="block text-[9px] font-extrabold uppercase tracking-[0.12em] text-muted-foreground">
                  Anterior
                </span>
                <span className="mt-1 block truncate text-xs font-semibold">
                  {previousChapter.title}
                </span>
              </span>
            </button>
          ) : (
            <span />
          )}

          {nextChapter ? (
            <button
              type="button"
              onClick={() => onSelectStudy(module.id, nextChapter.id)}
              className="flex min-h-16 items-center justify-end gap-2 rounded-2xl border border-primary/25 bg-primary/5 px-3 py-3 text-right transition-colors hover:border-primary/45 active:scale-[0.98]"
            >
              <span className="min-w-0">
                <span className="block text-[9px] font-extrabold uppercase tracking-[0.12em] text-primary">
                  Próximo
                </span>
                <span className="mt-1 block truncate text-xs font-semibold">
                  {nextChapter.title}
                </span>
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-primary" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onBack}
              className="flex min-h-16 items-center justify-end gap-2 rounded-2xl border border-primary/25 bg-primary/5 px-3 py-3 text-right transition-colors hover:border-primary/45 active:scale-[0.98]"
            >
              <span>
                <span className="block text-[9px] font-extrabold uppercase tracking-[0.12em] text-primary">
                  Concluído
                </span>
                <span className="mt-1 block text-xs font-semibold">Voltar aos módulos</span>
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-primary" />
            </button>
          )}
        </nav>
      </main>
    </div>
  );
}
