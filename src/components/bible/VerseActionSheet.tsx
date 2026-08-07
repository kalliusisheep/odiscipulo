import { Link } from "@tanstack/react-router";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { HIGHLIGHT_COLORS, normalizeHighlightColor, type HighlightColor } from "@/lib/bible-user-data";
import { bookNameById } from "@/data/bible-books";
import { BookOpen, Copy, GitCompareArrows, Highlighter, Library, PenLine, Star } from "lucide-react";
import { ShareLessonButton } from "@/components/ShareLessonButton";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  book: number;
  chapter: number;
  verse: number;
  text: string;
  translationLabel: string;
  isFavorite: boolean;
  currentColor?: string;
  onHighlight: (color: HighlightColor) => void;
  onFavorite: () => void;
  onNote: () => void;
  onCopy: () => void;
  onCompare: () => void;
};

export function VerseActionSheet(props: Props) {
  const { book, chapter, verse } = props;
  const ref = `${bookNameById(book)} ${chapter}:${verse}`;

  const actions = [
    {
      icon: Library,
      label: "Referências cruzadas",
      to: "/biblia/estudo/$book/$chapter/$verse" as const,
      search: { aba: "referencias" as const },
    },
  ];

  return (
    <Sheet open={props.open} onOpenChange={props.onOpenChange}>
      <SheetContent
        side="bottom"
        className="bible-verse-actions-sheet rounded-t-[2rem] border-primary/15 bg-background p-0 pb-[env(safe-area-inset-bottom)]"
      >
        <div className="mx-auto mt-3 h-1.5 w-10 rounded-full bg-muted-foreground/30" />
        <div className="bible-sheet-header px-5 pt-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">Ações do versículo</p>
            <span className="rounded-full bg-surface-2 px-2.5 py-1 text-[10px] font-bold text-muted-foreground">Toque para agir</span>
          </div>
          <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
            {ref} · {props.translationLabel}
          </p>
          <p className="mt-2 line-clamp-3 scripture text-sm leading-relaxed text-foreground/90">
            {props.text}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-1.5 px-5">
          {HIGHLIGHT_COLORS.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-label={`Destacar em ${c.label}`}
              onClick={() => props.onHighlight(c.id)}
              className={`h-8 w-8 shrink-0 rounded-full border-2 transition-transform active:scale-90 ${c.className} ${
                normalizeHighlightColor(props.currentColor) === c.id ? "border-primary" : "border-transparent"
              }`}
            />
          ))}
          <span className="ml-1 flex items-center gap-1 text-[11px] text-muted-foreground">
            <Highlighter className="h-3.5 w-3.5" /> Destacar
          </span>
        </div>

        <div className="bible-action-grid mt-4 grid grid-cols-2 gap-2 px-5 pb-6">
          <div className="col-span-2 grid grid-cols-2 gap-2">
            <Link
              to="/biblia/estudo/$book/$chapter/$verse"
              params={{ book: String(book), chapter: String(chapter), verse: String(verse) }}
              onClick={() => props.onOpenChange(false)}
              className="flex min-h-12 items-center justify-center gap-2 rounded-2xl text-center bg-primary px-3 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-transform active:scale-[0.98]"
            >
              <BookOpen className="h-4 w-4 shrink-0" />
              <span className="leading-tight">Estudar versículo</span>
            </Link>
            <button
              type="button"
              onClick={() => {
                props.onOpenChange(false);
                props.onCompare();
              }}
              className="flex min-h-12 items-center justify-center gap-2 rounded-2xl text-center border border-primary/25 bg-primary/10 px-3 py-3 text-sm font-semibold text-primary transition-all hover:bg-primary/15 active:scale-[0.98]"
            >
              <GitCompareArrows className="h-4 w-4 shrink-0" />
              <span className="leading-tight">Comparar versões</span>
            </button>
          </div>
          {actions.map((a) => (
            <Link
              key={a.label}
              to={a.to}
              params={{ book: String(book), chapter: String(chapter), verse: String(verse) }}
              search={a.search}
              onClick={() => props.onOpenChange(false)}
              className="col-span-2 flex items-center justify-center gap-3 rounded-2xl border border-border text-center bg-surface px-4 py-3 text-sm font-medium transition-colors hover:border-primary/40"
            >
              <a.icon className="h-4.5 w-4.5 text-primary" /> {a.label}
            </Link>
          ))}

          <div className="col-span-2">
            <SheetAction icon={PenLine} label="Adicionar anotação" onClick={props.onNote} />
          </div>
          <div className="col-span-2 grid grid-cols-2 gap-2">
            <SheetAction icon={Copy} label="Copiar" onClick={props.onCopy} />
            <SheetAction
              icon={Star}
              label={props.isFavorite ? "Remover favorito" : "Favoritar"}
              onClick={props.onFavorite}
              active={props.isFavorite}
            />
          </div>
          <div className="col-span-2">
            <ShareLessonButton
              lessonId={`bible:${book}:${chapter}:${verse}`}
              title={ref}
              shareContext={`${props.text}\n\nReferência bíblica: ${ref} · ${props.translationLabel}`}
              referenceText={`${ref} · ${props.translationLabel}`}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-primary/30 bg-primary/10 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/15"
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function SheetAction({
  icon: Icon,
  label,
  onClick,
  active,
}: {
  icon: typeof Copy;
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`bible-sheet-action flex w-full items-center justify-center gap-2.5 rounded-2xl border px-3.5 py-3 text-center text-sm font-medium transition-all active:scale-[0.97] ${
        active
          ? "border-primary/50 bg-primary/10 text-primary"
          : "border-border bg-surface hover:border-primary/40"
      }`}
    >
      <Icon className="h-4.5 w-4.5 shrink-0 text-primary" />
      <span className="min-w-0 truncate">{label}</span>
    </button>
  );
}
