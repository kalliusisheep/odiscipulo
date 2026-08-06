import { Link } from "@tanstack/react-router";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { HIGHLIGHT_COLORS, type HighlightColor } from "@/lib/bible-user-data";
import { bookNameById } from "@/data/bible-books";
import { BookOpen, Copy, Highlighter, Library, PenLine, Star } from "lucide-react";
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
        className="rounded-t-3xl border-border bg-background p-0 pb-[env(safe-area-inset-bottom)]"
      >
        <div className="mx-auto mt-3 h-1.5 w-10 rounded-full bg-muted-foreground/30" />
        <div className="px-5 pt-4">
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

        <div className="mt-4 flex items-center gap-2 px-5">
          {HIGHLIGHT_COLORS.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-label={`Destacar em ${c.label}`}
              onClick={() => props.onHighlight(c.id)}
              className={`h-9 w-9 rounded-full border-2 transition-transform active:scale-90 ${c.className} ${
                props.currentColor === c.id ? "border-primary" : "border-transparent"
              }`}
            />
          ))}
          <span className="ml-1 flex items-center gap-1 text-[11px] text-muted-foreground">
            <Highlighter className="h-3.5 w-3.5" /> Destacar
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 px-5 pb-6">
          <Link
            to="/biblia/estudo/$book/$chapter/$verse"
            params={{ book: String(book), chapter: String(chapter), verse: String(verse) }}
            onClick={() => props.onOpenChange(false)}
            className="col-span-2 flex items-center gap-3 rounded-2xl bg-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-transform active:scale-[0.98]"
          >
            <BookOpen className="h-4.5 w-4.5" /> Estudar versículo
          </Link>

          {actions.map((a) => (
            <Link
              key={a.label}
              to={a.to}
              params={{ book: String(book), chapter: String(chapter), verse: String(verse) }}
              search={a.search}
              onClick={() => props.onOpenChange(false)}
              className="col-span-2 flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 text-sm font-medium transition-colors hover:border-primary/40"
            >
              <a.icon className="h-4.5 w-4.5 text-primary" /> {a.label}
            </Link>
          ))}

          <SheetAction icon={PenLine} label="Adicionar anotação" onClick={props.onNote} />
          <SheetAction
            icon={Star}
            label={props.isFavorite ? "Remover favorito" : "Favoritar"}
            onClick={props.onFavorite}
            active={props.isFavorite}
          />
          <SheetAction icon={Copy} label="Copiar" onClick={props.onCopy} />
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
      className={`flex items-center gap-2.5 rounded-2xl border px-3.5 py-3 text-left text-sm font-medium transition-all active:scale-[0.97] ${
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
