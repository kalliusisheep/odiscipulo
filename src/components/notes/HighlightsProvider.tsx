// Sistema de seleção de texto + marca-texto permanente para conteúdos
// (trilhas/estudos/planos de leitura) — Bloco 1 do spec de Minhas Notas.
//
// Uso: envolva a área de conteúdo com <HighlightsProvider contentId=...
// contentType="trilha" contentTitle={lesson.title}>, e troque cada bloco de
// texto narrável por <HighlightedText fieldKey="intro-0" text={p} as="p"
// className="..." /> no lugar do <p data-narrate>{p}</p> original (mantém
// o data-narrate). O menu flutuante de seleção aparece sozinho.

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type ElementType,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { createPortal } from "react-dom";
import { Highlighter, ImageIcon, NotebookPen, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import {
  createHighlight,
  deleteHighlight,
  listHighlights,
  HIGHLIGHT_COLOR_CLASS,
  type Highlight,
  type HighlightColor,
  type HighlightContentType,
} from "@/lib/highlights";
import { createNoteFromSelection } from "@/lib/notes";
import { generateShareImage } from "@/lib/share-image";
import { supabase } from "@/integrations/supabase/client";

const COLORS: HighlightColor[] = ["amarelo", "verde", "azul", "rosa", "laranja", "branco"];
const COLOR_DOT: Record<HighlightColor, string> = {
  amarelo: "bg-yellow-400",
  verde: "bg-green-400",
  azul: "bg-blue-400",
  rosa: "bg-pink-400",
  laranja: "bg-orange-400",
  // Mesma inversão da marcação em si: no modo claro o botão da cor branca
  // apareceria invisível sobre o popover claro, então mostra preto; no
  // modo escuro mostra branco de verdade.
  branco: "bg-black dark:bg-white",
};

type PendingSelection = {
  fieldKey: string;
  start: number;
  end: number;
  text: string;
  rect: DOMRect;
};
type PendingHighlight = { highlight: Highlight; rect: DOMRect };

type Ctx = {
  contentId: string;
  contentType: HighlightContentType;
  contentTitle: string;
  highlightsByField: Map<string, Highlight[]>;
  refresh: () => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  openHighlightMenu: (h: Highlight, rect: DOMRect) => void;
};

const HighlightsCtx = createContext<Ctx | null>(null);

export function HighlightsProvider({
  contentId,
  contentType,
  contentTitle,
  children,
}: {
  contentId: string;
  contentType: HighlightContentType;
  contentTitle: string;
  children: ReactNode;
}) {
  const [all, setAll] = useState<Highlight[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pendingSelection, setPendingSelection] = useState<PendingSelection | null>(null);
  const [pendingHighlight, setPendingHighlight] = useState<PendingHighlight | null>(null);
  const [colorPickerFor, setColorPickerFor] = useState<PendingSelection | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = () => {
    void listHighlights(contentId, contentType)
      .then(setAll)
      .catch((err) => console.error("highlights: falha ao carregar", err));
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentId, contentType]);

  const highlightsByField = new Map<string, Highlight[]>();
  for (const h of all) {
    const list = highlightsByField.get(h.field_key) ?? [];
    list.push(h);
    highlightsByField.set(h.field_key, list);
  }

  useEffect(() => {
    function onSelectionChange() {
      const sel = window.getSelection();
      const container = containerRef.current;
      if (!sel || sel.isCollapsed || sel.rangeCount === 0 || !container) {
        setPendingSelection(null);
        return;
      }
      const range = sel.getRangeAt(0);
      if (!container.contains(range.commonAncestorContainer)) {
        setPendingSelection(null);
        return;
      }
      const fieldEl = closestFieldEl(range.commonAncestorContainer, container);
      if (!fieldEl) {
        setPendingSelection(null);
        return;
      }
      const text = sel.toString().trim();
      if (!text) {
        setPendingSelection(null);
        return;
      }
      const start = offsetWithin(fieldEl, range.startContainer, range.startOffset);
      const end = offsetWithin(fieldEl, range.endContainer, range.endOffset);
      const rect = range.getBoundingClientRect();
      setPendingHighlight(null);
      setPendingSelection({
        fieldKey: fieldEl.dataset.fieldKey ?? "",
        start: Math.min(start, end),
        end: Math.max(start, end),
        text,
        rect,
      });
    }
    document.addEventListener("selectionchange", onSelectionChange);
    return () => document.removeEventListener("selectionchange", onSelectionChange);
  }, []);

  const closeAll = () => {
    setPendingSelection(null);
    setPendingHighlight(null);
    setColorPickerFor(null);
    window.getSelection()?.removeAllRanges();
  };

  const handleMark = async (color: HighlightColor) => {
    const sel = colorPickerFor ?? pendingSelection;
    if (!sel || busy) return;
    setBusy(true);
    try {
      await createHighlight({
        contentId,
        contentType,
        fieldKey: sel.fieldKey,
        startOffset: sel.start,
        endOffset: sel.end,
        highlightedText: sel.text,
        color,
      });
      refresh();
      toast.success("Trecho marcado.");
    } catch (err) {
      console.error(err);
      toast.error("Não foi possível marcar este trecho.");
    } finally {
      setBusy(false);
      closeAll();
    }
  };

  const handleRemoveHighlight = async () => {
    if (!pendingHighlight || busy) return;
    setBusy(true);
    try {
      await deleteHighlight(pendingHighlight.highlight.id);
      refresh();
    } catch (err) {
      console.error(err);
      toast.error("Não foi possível remover a marcação.");
    } finally {
      setBusy(false);
      closeAll();
    }
  };

  const handleSaveNote = async () => {
    if (!pendingSelection || busy) return;
    setBusy(true);
    try {
      const { data } = await supabase.functions.invoke<{ text?: string }>("note-ai", {
        body: { action: "titulo", text: pendingSelection.text },
      });
      const title = data?.text?.trim() || pendingSelection.text.slice(0, 40);
      await createNoteFromSelection({
        text: pendingSelection.text,
        title,
        sourceContentId: contentId,
        sourceContentType: contentType,
        sourceContentTitle: contentTitle,
      });
      toast.success("Nota salva em Minhas Notas.");
    } catch (err) {
      console.error(err);
      toast.error("Não foi possível salvar a nota agora.");
    } finally {
      setBusy(false);
      closeAll();
    }
  };

  const handleCreateImage = async () => {
    if (!pendingSelection || busy) return;
    setBusy(true);
    try {
      const blob = await generateShareImage({
        title: contentTitle,
        bodyText: pendingSelection.text,
        backgroundSrc: "/share-bg-cross.jpg",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "citacao.png";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
      if (
        navigator.share &&
        navigator.canShare?.({ files: [new File([blob], "citacao.png", { type: "image/png" })] })
      ) {
        await navigator
          .share({ files: [new File([blob], "citacao.png", { type: "image/png" })] })
          .catch(() => {});
      }
    } catch (err) {
      console.error(err);
      toast.error("Não foi possível gerar a imagem agora.");
    } finally {
      setBusy(false);
      closeAll();
    }
  };

  return (
    <HighlightsCtx.Provider
      value={{
        contentId,
        contentType,
        contentTitle,
        highlightsByField,
        refresh,
        containerRef,
        openHighlightMenu: (h, rect) => {
          setPendingSelection(null);
          setPendingHighlight({ highlight: h, rect });
        },
      }}
    >
      <div ref={containerRef}>{children}</div>

      {pendingSelection &&
        createPortal(
          <FloatingMenu onClose={closeAll}>
            {colorPickerFor ? (
              <div className="flex items-center gap-1.5 px-1">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    disabled={busy}
                    onClick={() => void handleMark(c)}
                    className={`h-6 w-6 rounded-full ${COLOR_DOT[c]} ring-2 ring-white/40 transition-transform active:scale-90`}
                    aria-label={`Marcar em ${c}`}
                  />
                ))}
              </div>
            ) : (
              <>
                <MenuButton
                  icon={NotebookPen}
                  label="Salvar em Minhas Notas"
                  onClick={() => void handleSaveNote()}
                  disabled={busy}
                />
                <MenuButton
                  icon={ImageIcon}
                  label="Criar imagem"
                  onClick={() => void handleCreateImage()}
                  disabled={busy}
                />
                <MenuButton
                  icon={Highlighter}
                  label="Marcar"
                  onClick={() => setColorPickerFor(pendingSelection)}
                  disabled={busy}
                />
              </>
            )}
          </FloatingMenu>,
          document.body,
        )}

      {pendingHighlight &&
        createPortal(
          <FloatingMenu onClose={closeAll}>
            <MenuButton
              icon={Trash2}
              label="Remover marcação"
              onClick={() => void handleRemoveHighlight()}
              disabled={busy}
            />
          </FloatingMenu>,
          document.body,
        )}
    </HighlightsCtx.Provider>
  );
}

function MenuButton({
  icon: Icon,
  label,
  onClick,
  disabled,
}: {
  icon: typeof NotebookPen;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-2 whitespace-nowrap px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-surface-2 disabled:opacity-50"
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

/**
 * Barra FIXA no rodapé da tela — não "segue" a seleção (sem cálculo de
 * getBoundingClientRect/posição), só aparece enquanto existe uma seleção
 * pendente e some quando ela é limpa. Mesmo conceito usado na barra de
 * formatação de "Minhas Notas" (NoteFormattingToolbar): posição sempre
 * igual, "congelada" no rodapé, e não fecha mais ao rolar a página — o
 * scroll simplesmente acontece por baixo dela normalmente.
 */
function FloatingMenu({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-popover/95 shadow-xl backdrop-blur animate-slide-up"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      onMouseDown={(e) => {
        // Crítico: sem preventDefault() o navegador desfaz a seleção de
        // texto ao clicar num botão do menu (o clique "cai fora" do texto
        // selecionado), o que limpa pendingSelection antes do onClick do
        // botão disparar — e a marcação nunca é criada.
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div className="mx-auto flex max-w-lg items-center justify-between gap-1 overflow-x-auto px-3 py-2">
        <div className="flex items-center gap-1">{children}</div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
          aria-label="Fechar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function closestFieldEl(node: Node, boundary: HTMLElement): HTMLElement | null {
  let el: Node | null = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
  while (el && el !== boundary) {
    if (el instanceof HTMLElement && el.dataset.fieldKey) return el;
    el = el.parentElement;
  }
  return null;
}

function offsetWithin(root: HTMLElement, node: Node, nodeOffset: number): number {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let offset = 0;
  let current = walker.nextNode();
  while (current) {
    if (current === node) return offset + nodeOffset;
    offset += current.textContent?.length ?? 0;
    current = walker.nextNode();
  }
  return offset;
}

/** Renderiza um bloco de texto aplicando as marcações salvas para ele (se houver). */
export function HighlightedText({
  fieldKey,
  text,
  as = "p",
  className,
  narrate,
}: {
  fieldKey: string;
  text: string;
  as?: ElementType;
  className?: string;
  narrate?: boolean;
}) {
  const ctx = useContext(HighlightsCtx);
  const Tag = as;
  const highlights = (ctx?.highlightsByField.get(fieldKey) ?? [])
    .slice()
    .sort((a, b) => a.start_offset - b.start_offset);

  if (!ctx || highlights.length === 0) {
    return (
      <Tag
        className={className}
        data-field-key={fieldKey}
        data-narrate={narrate ? true : undefined}
      >
        {text}
      </Tag>
    );
  }

  const segments: { text: string; highlight?: Highlight }[] = [];
  let cursor = 0;
  for (const h of highlights) {
    const start = Math.max(cursor, Math.min(h.start_offset, text.length));
    const end = Math.max(start, Math.min(h.end_offset, text.length));
    if (start > cursor) segments.push({ text: text.slice(cursor, start) });
    if (end > start) segments.push({ text: text.slice(start, end), highlight: h });
    cursor = Math.max(cursor, end);
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor) });

  return (
    <Tag className={className} data-field-key={fieldKey} data-narrate={narrate ? true : undefined}>
      {segments.map((seg, i) =>
        seg.highlight ? (
          <mark
            key={i}
            className={`${HIGHLIGHT_COLOR_CLASS[seg.highlight.color]} cursor-pointer rounded-sm`}
            onClick={(e: ReactMouseEvent) => {
              e.stopPropagation();
              ctx.openHighlightMenu(
                seg.highlight!,
                (e.target as HTMLElement).getBoundingClientRect(),
              );
            }}
          >
            {seg.text}
          </mark>
        ) : (
          <span key={i}>{seg.text}</span>
        ),
      )}
    </Tag>
  );
}
