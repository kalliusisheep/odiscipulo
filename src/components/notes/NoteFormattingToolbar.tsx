import { useEffect, useState } from "react";
import type { Editor } from "@tiptap/react";
import { Bold, Italic, Underline as UnderlineIcon, Type, Highlighter } from "lucide-react";
import type { FontSizeToken } from "@/lib/tiptap-font-size";

// As mesmas 5 cores devem bater com o que o backend/editor aceitam — mantidas
// aqui centralizadas para reaproveitar tanto na nota quanto, futuramente, nas
// marcações de conteúdo do Bloco 1 (ainda que sejam camadas diferentes).
export const HIGHLIGHT_COLORS: { token: string; hex: string; label: string }[] = [
  { token: "amarelo", hex: "#fde047", label: "Amarelo" },
  { token: "verde", hex: "#86efac", label: "Verde" },
  { token: "azul", hex: "#93c5fd", label: "Azul" },
  { token: "rosa", hex: "#f9a8d4", label: "Rosa" },
  { token: "laranja", hex: "#fdba74", label: "Laranja" },
];

const FONT_SIZE_OPTIONS: { token: FontSizeToken; label: string }[] = [
  { token: "sm", label: "Pequeno" },
  { token: "normal", label: "Normal" },
  { token: "lg", label: "Grande" },
  { token: "xl", label: "Extra grande" },
];

function ToolbarButton({
  active,
  onClick,
  children,
  label,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onMouseDown={(e) => e.preventDefault()} // não perde a seleção de texto ao clicar
      onClick={onClick}
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
        active ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-surface-2"
      }`}
    >
      {children}
    </button>
  );
}

/**
 * Toolbar flutuante posicionada acima da seleção atual, dentro do editor.
 * Usa getBoundingClientRect() do range selecionado — mesma técnica usada,
 * em espírito, pelo menu de seleção do Bloco 1 sobre o conteúdo estático.
 */
export function NoteFormattingToolbar({ editor }: { editor: Editor }) {
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [sizePickerOpen, setSizePickerOpen] = useState(false);

  useEffect(() => {
    const updatePosition = () => {
      const { from, to } = editor.state.selection;
      if (from === to) {
        setPosition(null);
        setColorPickerOpen(false);
        setSizePickerOpen(false);
        return;
      }
      const domSelection = window.getSelection();
      if (!domSelection || domSelection.rangeCount === 0) return;
      const rect = domSelection.getRangeAt(0).getBoundingClientRect();
      if (!rect || (rect.width === 0 && rect.height === 0)) return;
      setPosition({ top: rect.top + window.scrollY - 52, left: rect.left + window.scrollX + rect.width / 2 });
    };

    editor.on("selectionUpdate", updatePosition);
    editor.on("blur", () => {
      // pequeno atraso pra permitir clique nos próprios botões da toolbar
      setTimeout(() => setPosition(null), 150);
    });
    return () => {
      editor.off("selectionUpdate", updatePosition);
    };
  }, [editor]);

  if (!position) return null;

  return (
    <div
      className="fixed z-50 flex -translate-x-1/2 items-center gap-0.5 rounded-2xl border border-border bg-popover p-1 shadow-xl"
      style={{ top: position.top, left: position.left }}
    >
      <ToolbarButton label="Negrito" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton label="Itálico" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Sublinhado"
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon className="h-4 w-4" />
      </ToolbarButton>

      <div className="mx-0.5 h-5 w-px bg-border" />

      <div className="relative">
        <ToolbarButton
          label="Tamanho da fonte"
          active={sizePickerOpen}
          onClick={() => {
            setSizePickerOpen((v) => !v);
            setColorPickerOpen(false);
          }}
        >
          <Type className="h-4 w-4" />
        </ToolbarButton>
        {sizePickerOpen && (
          <div className="absolute left-1/2 top-10 flex -translate-x-1/2 flex-col gap-0.5 rounded-xl border border-border bg-popover p-1 shadow-xl">
            {FONT_SIZE_OPTIONS.map((opt) => (
              <button
                key={opt.token}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  editor.chain().focus().setFontSize(opt.token).run();
                  setSizePickerOpen(false);
                }}
                className="whitespace-nowrap rounded-lg px-3 py-1.5 text-left text-xs font-medium text-foreground hover:bg-surface-2"
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="relative">
        <ToolbarButton
          label="Marca-texto"
          active={editor.isActive("highlight") || colorPickerOpen}
          onClick={() => {
            setColorPickerOpen((v) => !v);
            setSizePickerOpen(false);
          }}
        >
          <Highlighter className="h-4 w-4" />
        </ToolbarButton>
        {colorPickerOpen && (
          <div className="absolute left-1/2 top-10 flex -translate-x-1/2 items-center gap-1.5 rounded-xl border border-border bg-popover p-2 shadow-xl">
            {HIGHLIGHT_COLORS.map((c) => (
              <button
                key={c.token}
                type="button"
                aria-label={c.label}
                title={c.label}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  editor.chain().focus().toggleHighlight({ color: c.hex }).run();
                  setColorPickerOpen(false);
                }}
                className="h-6 w-6 shrink-0 rounded-full ring-1 ring-border transition-transform hover:scale-110"
                style={{ backgroundColor: c.hex }}
              />
            ))}
            {editor.isActive("highlight") && (
              <button
                type="button"
                title="Remover marca-texto"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  editor.chain().focus().unsetHighlight().run();
                  setColorPickerOpen(false);
                }}
                className="ml-1 h-6 w-6 shrink-0 rounded-full border border-dashed border-muted-foreground/50 text-[10px] text-muted-foreground"
              >
                ×
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
