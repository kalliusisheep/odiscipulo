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
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${
        active ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-surface-2"
      }`}
    >
      {children}
    </button>
  );
}

/**
 * Barra de formatação FIXA no TOPO da tela (viewport), centralizada, em
 * formato de "pill" flutuante — não presa à posição da seleção. A barra só
 * aparece/desaparece conforme existe ou não uma seleção de texto; a posição
 * em si nunca muda, fica fixa no topo e não se move com o scroll da página
 * (position: fixed já garante isso).
 */
export function NoteFormattingToolbar({
  editor,
  onActiveChange,
}: {
  editor: Editor;
  onActiveChange?: (active: boolean) => void;
}) {
  const [hasSelection, setHasSelection] = useState(false);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [sizePickerOpen, setSizePickerOpen] = useState(false);

  useEffect(() => {
    const updateSelection = () => {
      const { from, to } = editor.state.selection;
      const active = from !== to;
      setHasSelection(active);
      if (!active) {
        setColorPickerOpen(false);
        setSizePickerOpen(false);
      }
    };

    const handleBlur = () => {
      // pequeno atraso pra permitir clique nos próprios botões da toolbar
      setTimeout(() => {
        setHasSelection(false);
        setColorPickerOpen(false);
        setSizePickerOpen(false);
      }, 150);
    };

    editor.on("selectionUpdate", updateSelection);
    editor.on("blur", handleBlur);
    return () => {
      editor.off("selectionUpdate", updateSelection);
      editor.off("blur", handleBlur);
    };
  }, [editor]);

  useEffect(() => {
    onActiveChange?.(hasSelection);
  }, [hasSelection, onActiveChange]);

  if (!hasSelection) return null;

  return (
    <div
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 animate-in fade-in slide-in-from-top-2 duration-150"
      style={{ paddingTop: "calc(env(safe-area-inset-top) + 0.75rem)" }}
    >
      <div className="flex max-w-[calc(100vw-1.5rem)] items-center gap-0.5 overflow-x-auto rounded-full border border-border bg-popover/95 px-2 py-1.5 shadow-2xl shadow-black/20 backdrop-blur-md">
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

        <div className="mx-1 h-5 w-px shrink-0 bg-border" />

        <div className="relative shrink-0">
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
            <div className="absolute left-1/2 top-12 flex -translate-x-1/2 flex-col gap-0.5 rounded-xl border border-border bg-popover p-1 shadow-xl">
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

        <div className="relative shrink-0">
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
            <div className="absolute left-1/2 top-12 flex -translate-x-1/2 items-center gap-1.5 rounded-xl border border-border bg-popover p-2 shadow-xl">
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
    </div>
  );
}
