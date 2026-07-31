import { useEffect, useRef, useState } from "react";
import { Smile } from "lucide-react";

type Category = { label: string; emojis: string[] };

const CATEGORIES: Category[] = [
  {
    label: "Sorrisos",
    emojis: [
      "😀",
      "😄",
      "😁",
      "😊",
      "🙂",
      "😉",
      "😍",
      "🥰",
      "😇",
      "🤗",
      "😅",
      "😂",
      "🥲",
      "😌",
      "🙃",
      "😎",
    ],
  },
  {
    label: "Fé e ânimo",
    emojis: [
      "🙏",
      "🕊️",
      "✝️",
      "📖",
      "🔥",
      "✨",
      "🌟",
      "💪",
      "🤝",
      "👏",
      "🎉",
      "🙌",
      "❤️‍🔥",
      "🛡️",
      "⛪",
      "🌅",
    ],
  },
  {
    label: "Coração",
    emojis: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🤍", "💕", "💖", "💗", "💞", "💘"],
  },
  {
    label: "Reações",
    emojis: ["👍", "🙏", "😢", "😭", "🥺", "😮", "😳", "🤔", "😴", "🙄", "😔", "💯"],
  },
];

/**
 * Botão de emoji que abre um painel de categorias com emojis prontos para
 * inserir na mensagem. Mesmo padrão visual/comportamental do GifPicker.
 */
export function EmojiPicker({
  onSelect,
  className,
}: {
  onSelect: (emoji: string) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  return (
    <div ref={containerRef} className={`relative ${className ?? ""}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Adicionar emoji"
        title="Adicionar emoji"
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors ${
          open
            ? "border-primary bg-primary/15 text-primary"
            : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-primary"
        }`}
      >
        <Smile className="h-5 w-5" />
      </button>

      {open && (
        <div className="absolute bottom-12 left-0 z-20 w-72 overflow-hidden rounded-2xl border border-border bg-popover shadow-xl animate-slide-up">
          <div className="flex border-b border-border">
            {CATEGORIES.map((c, i) => (
              <button
                key={c.label}
                type="button"
                onClick={() => setTab(i)}
                className={`flex-1 py-2 text-[11px] font-medium transition-colors ${
                  tab === i
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="grid max-h-48 grid-cols-6 gap-1 overflow-y-auto p-2.5">
            {CATEGORIES[tab].emojis.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => {
                  onSelect(e);
                  setOpen(false);
                }}
                className="flex aspect-square items-center justify-center rounded-lg text-xl transition-transform hover:scale-125 hover:bg-surface-2"
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
