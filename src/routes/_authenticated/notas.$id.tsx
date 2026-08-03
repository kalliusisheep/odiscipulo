// Página de edição de uma anotação — usada tanto para o fluxo "Criar
// Anotação" (Bloco 3.1, nota criada em branco e o usuário já cai aqui)
// quanto para reabrir qualquer nota já existente a partir da listagem
// "Minhas Notas" (Bloco 3). Rota: /_authenticated/notas/$id
//
// Dependências novas necessárias (rodar antes de usar esta página):
//   npm install @tiptap/react @tiptap/pm @tiptap/starter-kit \
//     @tiptap/extension-underline @tiptap/extension-text-style \
//     @tiptap/extension-highlight @tiptap/extension-placeholder \
//     jspdf html2canvas

import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import { toast } from "sonner";
import {
  ArrowLeft,
  Check,
  Loader2,
  ScanLine,
  Sparkles,
  Trash2,
  FileDown,
} from "lucide-react";

import { FontSize } from "@/lib/tiptap-font-size";
import { NoteFormattingToolbar } from "@/components/notes/NoteFormattingToolbar";
import { exportNoteToPdf } from "@/lib/notes-pdf";
import { deleteNote, getNote, logNoteAiAction, markNoteExported, plainTextFromDoc, updateNote } from "@/lib/notes";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/notas/$id")({
  component: NotaEditorPage,
});

type SaveState = "salvo" | "salvando" | "erro";
type AiAction = "reescrever" | "estruturar";

async function callNoteAi(action: AiAction | "titulo", text: string): Promise<string> {
  const { data, error } = await supabase.functions.invoke<{ text?: string; error?: string }>("note-ai", {
    body: { action, text },
  });
  if (error || !data?.text) throw new Error(data?.error ?? error?.message ?? "Falha ao chamar a IA.");
  return data.text;
}

function NotaEditorPage() {
  const { id } = Route.useParams();
  const nav = useNavigate();

  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState<SaveState>("salvo");
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [aiLoading, setAiLoading] = useState<AiAction | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<{ action: AiAction; text: string } | null>(null);
  const [titleGenerating, setTitleGenerating] = useState(false);
  const [sourceTitle, setSourceTitle] = useState<string | null>(null);

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      FontSize,
      Highlight.configure({ multicolor: true }),
      Placeholder.configure({ placeholder: "Comece a escrever sua reflexão…" }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none focus:outline-none min-h-[60vh] text-[15px] leading-relaxed text-foreground " +
          "[&_mark]:rounded [&_mark]:px-0.5 [&_h1]:text-foreground [&_h2]:text-foreground [&_strong]:text-foreground",
      },
    },
    onUpdate: () => scheduleSave(),
  });

  // Carrega a nota (título + conteúdo) uma única vez.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const note = await getNote(id);
        if (!note || cancelled) return;
        setTitle(note.title);
        setSourceTitle(note.source_content_title);
        editor?.commands.setContent(note.content as never, false);
        setSavedAt(new Date(note.updated_at));
      } catch (err) {
        console.error(err);
        toast.error("Não foi possível carregar essa anotação.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, editor]);

  function scheduleSave() {
    setSaveState("salvando");
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => void persist(), 700);
  }

  async function persist(patch?: { title?: string }) {
    if (!editor) return;
    try {
      await updateNote(id, {
        title: patch?.title ?? title,
        content: editor.getJSON() as Record<string, unknown>,
      });
      setSaveState("salvo");
      setSavedAt(new Date());
    } catch (err) {
      console.error(err);
      setSaveState("erro");
    }
  }

  function handleTitleChange(next: string) {
    setTitle(next);
    setSaveState("salvando");
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => void persist({ title: next }), 700);
  }

  async function handleGenerateTitle() {
    if (!editor) return;
    const text = plainTextFromDoc(editor.getJSON() as Record<string, unknown>);
    if (!text.trim()) {
      toast.error("Escreva algo primeiro para a IA sugerir um título.");
      return;
    }
    setTitleGenerating(true);
    try {
      const generated = await callNoteAi("titulo", text);
      setTitle(generated);
      await persist({ title: generated });
      await logNoteAiAction(id, "titulo");
    } catch (err) {
      console.error(err);
      toast.error("Não foi possível gerar um título agora.");
    } finally {
      setTitleGenerating(false);
    }
  }

  async function handleAiAction(action: AiAction) {
    if (!editor) return;
    const text = plainTextFromDoc(editor.getJSON() as Record<string, unknown>);
    if (!text.trim()) {
      toast.error("Escreva algo primeiro.");
      return;
    }
    setAiLoading(action);
    try {
      const result = await callNoteAi(action, text);
      setAiSuggestion({ action, text: result });
    } catch (err) {
      console.error(err);
      toast.error("Não foi possível concluir essa ação de IA agora.");
    } finally {
      setAiLoading(null);
    }
  }

  function acceptAiSuggestion() {
    if (!aiSuggestion || !editor) return;
    // A resposta da IA vem em markdown simples (títulos ## e parágrafos);
    // convertida para parágrafos/headings do editor para manter a
    // formatação posterior possível (negrito, marca-texto, etc.).
    const doc = markdownToTiptapDoc(aiSuggestion.text);
    editor.commands.setContent(doc, true);
    void logNoteAiAction(id, aiSuggestion.action);
    setAiSuggestion(null);
    scheduleSave();
    toast.success("Sugestão aplicada.");
  }

  async function handleDelete() {
    try {
      await deleteNote(id);
      toast.success("Anotação excluída.");
      await nav({ to: "/notas" });
    } catch (err) {
      console.error(err);
      toast.error("Não foi possível excluir a anotação.");
    }
  }

  async function handleExportPdf() {
    if (!editor) return;
    setExporting(true);
    try {
      const blob = await exportNoteToPdf({ title: title || "Anotação", contentHtml: editor.getHTML() });
      const filename = `${slugify(title || "anotacao")}.pdf`;
      const file = new File([blob], filename, { type: "application/pdf" });

      // No celular, prioriza a folha nativa de compartilhamento (WhatsApp,
      // Drive, e-mail, AirDrop etc.) em vez de só baixar o arquivo — é o
      // que o usuário espera ao tocar em "Exportar PDF" dentro do app.
      // Em navegadores sem suporte a compartilhar arquivos (a maioria dos
      // desktops), cai no download tradicional.
      const canShareFile =
        typeof navigator.share === "function" &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [file] });

      if (canShareFile) {
        try {
          await navigator.share({ files: [file], title: title || "Anotação" });
          await markNoteExported(id);
          toast.success("PDF pronto para compartilhar.");
        } catch (shareErr) {
          // Usuário cancelou a folha de compartilhamento — não é um erro.
          if ((shareErr as DOMException)?.name !== "AbortError") {
            console.error(shareErr);
            toast.error("Não foi possível compartilhar o PDF agora.");
          }
        }
      } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 10_000);
        await markNoteExported(id);
        toast.success("PDF exportado.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Não foi possível gerar o PDF agora.");
    } finally {
      setExporting(false);
    }
  }

  const saveLabel = useMemo(() => {
    if (saveState === "erro") return "Erro ao salvar";
    if (savedAt) return `Salvo às ${savedAt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
    return "";
  }, [saveState, savedAt]);

  if (loading || !editor) {
    return (
      <div className="mx-auto flex max-w-lg items-center justify-center px-4 pt-24">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col px-4 pb-10">
      {/* ── Header fixo ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 -mx-4 flex items-center gap-2 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
        <button
          type="button"
          onClick={() => void persist().then(() => nav({ to: "/notas" }))}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
          aria-label="Voltar"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
          {saveState === "salvando" ? (
            <span className="inline-flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" /> Salvando…
            </span>
          ) : (
            saveLabel
          )}
        </span>

        <button
          type="button"
          onClick={() => void handleExportPdf()}
          disabled={exporting}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground disabled:opacity-50"
          aria-label="Exportar em PDF"
          title="Exportar em PDF"
        >
          {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
        </button>

        <button
          type="button"
          onClick={() => toast.info("Scan Inteligente chega no Bloco 4 — em breve por aqui.")}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
          aria-label="Scan Inteligente"
          title="Scan Inteligente"
        >
          <ScanLine className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => setDeleteOpen(true)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          aria-label="Excluir anotação"
          title="Excluir anotação"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </header>

      {/* ── Origem (se a nota veio de um conteúdo) ──────────────── */}
      {sourceTitle && (
        <span className="mt-4 inline-flex w-fit items-center gap-1 rounded-full bg-accent px-3 py-1 text-[11px] font-medium text-accent-foreground">
          De: {sourceTitle}
        </span>
      )}

      {/* ── Título ───────────────────────────────────────────────── */}
      <div className="mt-4 flex items-start gap-2">
        <input
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Título da anotação…"
          className="w-full flex-1 border-none bg-transparent text-2xl font-bold text-foreground outline-none placeholder:text-muted-foreground/50"
        />
        <button
          type="button"
          onClick={() => void handleGenerateTitle()}
          disabled={titleGenerating}
          title="Sugerir título com IA"
          className="mt-1.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-primary transition-colors hover:bg-primary/10 disabled:opacity-50"
        >
          {titleGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        </button>
      </div>

      {/* ── Corpo do editor ──────────────────────────────────────── */}
      <div className="mt-4 flex-1">
        <EditorContent editor={editor} />
      </div>
      <NoteFormattingToolbar editor={editor} />

      {/* ── Ações de IA (fixas na base) ──────────────────────────── */}
      <div className="sticky bottom-4 mt-6 flex justify-center gap-2">
        <div className="flex items-center gap-1 rounded-full border border-border bg-popover p-1 shadow-lg">
          <button
            type="button"
            onClick={() => void handleAiAction("reescrever")}
            disabled={aiLoading !== null}
            className="flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-surface-2 disabled:opacity-50"
          >
            {aiLoading === "reescrever" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5 text-primary" />}
            Reescrever
          </button>
          <div className="h-4 w-px bg-border" />
          <button
            type="button"
            onClick={() => void handleAiAction("estruturar")}
            disabled={aiLoading !== null}
            className="flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-surface-2 disabled:opacity-50"
          >
            {aiLoading === "estruturar" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5 text-primary" />}
            Organizar como estrutura
          </button>
        </div>
      </div>

      {/* ── Preview da sugestão de IA ────────────────────────────── */}
      <Dialog open={!!aiSuggestion} onOpenChange={(open) => !open && setAiSuggestion(null)}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{aiSuggestion?.action === "estruturar" ? "Estrutura sugerida" : "Texto reescrito"}</DialogTitle>
            <DialogDescription>Você pode aceitar e substituir o conteúdo da nota, ou descartar.</DialogDescription>
          </DialogHeader>
          <div className="whitespace-pre-wrap rounded-2xl border border-border bg-surface p-4 text-sm text-foreground">
            {aiSuggestion?.text}
          </div>
          <DialogFooter className="gap-2">
            <button
              type="button"
              onClick={() => setAiSuggestion(null)}
              className="rounded-2xl border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-surface-2"
            >
              Descartar
            </button>
            <button
              type="button"
              onClick={acceptAiSuggestion}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-glow"
            >
              <Check className="h-4 w-4" /> Aceitar
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Confirmação de exclusão ──────────────────────────────── */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir esta anotação?</AlertDialogTitle>
            <AlertDialogDescription>Essa ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => void handleDelete()} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function slugify(text: string): string {
  return (
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 60) || "anotacao"
  );
}

/** Conversor simples de markdown (## títulos + parágrafos) para o formato JSON do Tiptap. */
function markdownToTiptapDoc(markdown: string) {
  const blocks = markdown.split(/\n{2,}/).filter(Boolean);
  const content = blocks.map((block) => {
    const headingMatch = block.match(/^(#{1,3})\s+(.*)/);
    if (headingMatch) {
      return {
        type: "heading",
        attrs: { level: headingMatch[1].length },
        content: [{ type: "text", text: headingMatch[2].trim() }],
      };
    }
    return { type: "paragraph", content: [{ type: "text", text: block.replace(/\n/g, " ").trim() }] };
  });
  return { type: "doc", content: content.length ? content : [{ type: "paragraph" }] };
}
