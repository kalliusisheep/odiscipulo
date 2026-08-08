import { createFileRoute, Link } from "@tanstack/react-router";
import { useLayoutEffect } from "react";
import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { theologyModules, type TheologyChapter, type TheologyContentBlock } from "@/data/teologia";

export const Route = createFileRoute("/_authenticated/biblia/teologia/$module/$chapter")({
  head: () => ({
    meta: [
      { title: "Estudo teológico — Disciple" },
      {
        name: "description",
        content: "Aprofunde um tema da teologia sistemática com conteúdo organizado e referências bíblicas.",
      },
    ],
  }),
  component: TeologiaCapituloPage,
});

function TeologiaCapituloPage() {
  const { module: moduleId, chapter: chapterId } = Route.useParams();
  const moduleIndex = theologyModules.findIndex((item) => item.id === moduleId);
  const module = theologyModules[moduleIndex];
  const chapterIndex = module?.chapters.findIndex((item) => item.id === chapterId) ?? -1;
  const chapter = module?.chapters[chapterIndex];

  useLayoutEffect(() => {
    let disposed = false;

    const resetScroll = () => {
      if (disposed) return;
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      document.scrollingElement?.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };

    resetScroll();
    const frame = window.requestAnimationFrame(() => {
      resetScroll();
      window.requestAnimationFrame(resetScroll);
    });
    const delayedReset = window.setTimeout(resetScroll, 180);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      window.clearTimeout(delayedReset);
    };
  }, [moduleId, chapterId]);

  if (!module || !chapter) {
    return (
      <div className="bible-index-shell min-h-screen pb-28">
        <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-5 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary">
            <BookOpen className="h-6 w-6" />
          </div>
          <h1 className="mt-5 text-xl font-bold">Tema não encontrado</h1>
          <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
            Esse conteúdo não está disponível ou o endereço foi alterado.
          </p>
          <Link
            to="/biblia/teologia"
            className="mt-6 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-transform active:scale-95"
          >
            Voltar para Teologia Sistemática
          </Link>
        </main>
      </div>
    );
  }

  const previousChapter = chapterIndex > 0 ? module.chapters[chapterIndex - 1] : null;
  const nextChapter =
    chapterIndex < module.chapters.length - 1 ? module.chapters[chapterIndex + 1] : null;

  return (
    <div className="bible-index-shell min-h-screen pb-28">
      <header className="bible-index-header sticky top-0 z-30 border-b border-border/20 bg-background/85 backdrop-blur-2xl">
        <div className="mx-auto max-w-lg px-5 pb-4 pt-4">
          <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
            <Link
              to="/biblia/teologia"
              aria-label="Voltar para Teologia Sistemática"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/40 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary active:scale-95"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>

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
          <TheologyContent chapter={chapter} />

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

        <nav className="mt-5 grid grid-cols-2 gap-3" aria-label="Navegação entre temas">
          {previousChapter ? (
            <Link
              to="/biblia/teologia/$module/$chapter"
              params={{ module: module.id, chapter: previousChapter.id }}
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
            </Link>
          ) : (
            <span />
          )}

          {nextChapter ? (
            <Link
              to="/biblia/teologia/$module/$chapter"
              params={{ module: module.id, chapter: nextChapter.id }}
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
            </Link>
          ) : (
            <Link
              to="/biblia/teologia"
              className="flex min-h-16 items-center justify-end gap-2 rounded-2xl border border-primary/25 bg-primary/5 px-3 py-3 text-right transition-colors hover:border-primary/45 active:scale-[0.98]"
            >
              <span>
                <span className="block text-[9px] font-extrabold uppercase tracking-[0.12em] text-primary">
                  Concluído
                </span>
                <span className="mt-1 block text-xs font-semibold">Voltar aos módulos</span>
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-primary" />
            </Link>
          )}
        </nav>
      </main>
    </div>
  );
}


function TheologyContent({ chapter }: { chapter: TheologyChapter }) {
  const sourceBlocks = chapter.blocks ?? [{ type: "paragraph" as const, text: chapter.content }];

  const blocks = sourceBlocks.filter((block) => {
    if (block.type !== "verse") return true;

    const reference = block.reference?.trim() ?? "";
    const hasBibleReference = /^(?:[1-3]\\s*)?[A-Za-zÀ-ÿ]+(?:\\s+[A-Za-zÀ-ÿ]+)*\\s+\\d+(?::\\d+(?:[-–]\\d+)?)?(?:,\\s*\\d+)?$/u.test(
      reference,
    );
    const hasLegacyExplanatoryText =
      /vara de medir|regra de medir|conjunto fechado de 66 livros|39 livros do Antigo Testamento|criou[”"']? o cânon|reconheceu a autoridade/i.test(
        block.text,
      );

    return hasBibleReference && !hasLegacyExplanatoryText;
  }).reduce<
    TheologyContentBlock[]
  >((normalized, block) => {
    const text = block.text.replace(/\s+/g, " ").trim();
    if (!text) return normalized;

    const previous = normalized.at(-1);
    if (block.type === "paragraph" && previous?.type === "paragraph") {
      previous.text = `${previous.text} ${text}`;
      return normalized;
    }

    normalized.push({ ...block, text });
    return normalized;
  }, []);

  return (
    <div className="space-y-5">
      {blocks.map((block, index) =>
        block.type === "verse" ? (
          <blockquote
            key={"verse-" + index}
            className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.08] via-card to-background px-5 py-5 shadow-[0_12px_30px_-22px_hsl(var(--primary)/0.8)] before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-primary/55 before:content-['']"
          >
            {block.reference && (
              <cite className="mb-3 block text-[0.68rem] font-bold uppercase tracking-[0.16em] text-primary not-italic">
                {block.reference} · NVI
              </cite>
            )}
            <p className="text-[0.98rem] font-medium italic leading-7 text-foreground">
              {block.text}
            </p>
          </blockquote>
        ) : (
          <p key={"paragraph-" + index} className="text-[0.98rem] leading-7 text-foreground/90">
            {block.text}
          </p>
        ),
      )}
    </div>
  );
}

