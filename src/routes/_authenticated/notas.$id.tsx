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
  Download,
  Loader2,
  ScanLine,
  Share2,
  Sparkles,
  Trash2,
  FileDown,
} from "lucide-react";

import { FontSize } from "@/lib/tiptap-font-size";
import { NoteFormattingToolbar } from "@/components/notes/NoteFormattingToolbar";
import { ScanInteligenteDialog } from "@/components/notes/ScanInteligenteDialog";
import { exportNoteToPdf } from "@/lib/notes-pdf";
import { deleteNote, getNote, logNoteAiAction, markNoteExported, plainTextFromDoc, updateNote } from "@/lib/notes";
import type { ScanKind } from "@/lib/scan";
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

// Instruções por ação — mesmo conteúdo que existia na edge function "note-ai",
// que ficou apenas commitada no código e nunca foi publicada no Lovable Cloud.
const NOTE_AI_PROMPTS: Record<AiAction | "titulo", string> = {
  titulo:
    "Você gera títulos curtos e diretos para anotações pessoais de estudo bíblico. " +
    "Responda APENAS com o título, sem aspas, sem pontuação final, no máximo 6 palavras.",
  reescrever:
    "Você reformula textos de anotações pessoais de estudo bíblico, mantendo o sentido original, " +
    "a pessoa do discurso e o tom espiritual/devocional. Responda APENAS com o texto reescrito, " +
    "em português brasileiro, sem comentários adicionais.",
  estruturar:
    "Você organiza um texto em uma estrutura de lição/estudo bíblico com estas seções, cada uma com um " +
    "título em ## markdown: Introdução, Pontos principais (em tópicos), Versículos relacionados (se " +
    "aplicável), Aplicação prática, Conclusão. Responda apenas com o markdown estruturado, em português.",
};

// Reaproveita a edge function "mentor-chat" (já publicada e ativa) em vez de
// "note-ai" (existe no código, mas nunca foi deployada no Lovable Cloud —
// deploy de Edge Function só acontece via o agente de IA do Lovable, e não
// via git push nem via o botão "Publish"). mentor-chat é um proxy genérico
// para o Gemini: aceita qualquer array de "messages", então passamos nossa
// própria instrução de sistema antes do texto do usuário. Único efeito
// colateral: mentor-chat sempre injeta o system prompt do "Mentor Espiritual"
// antes do nosso — na prática isso não muda o resultado de forma perceptível,
// já que o tom pedido (devocional/bíblico) já é o mesmo.
async function callNoteAi(action: AiAction | "titulo", text: string): Promise<string> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
  const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
  const { data: sessionData } = await supabase.auth.getSession();

  const res = await fetch(`${supabaseUrl}/functions/v1/mentor-chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: anonKey,
      Authorization: `Bearer ${sessionData.session?.access_token ?? anonKey}`,
    },
    body: JSON.stringify({
      messages: [
        { role: "system", content: NOTE_AI_PROMPTS[action] },
        { role: "user", content: text },
      ],
    }),
  });

  if (!res.ok || !res.body) throw new Error("Falha ao chamar a IA.");

  // mentor-chat responde em streaming (SSE, chunks estilo chat.completions) —
  // mesmo parsing já usado em src/components/Mentor.tsx, só que aqui
  // acumulamos tudo antes de devolver, porque a UI de sugestão precisa do
  // texto completo antes de oferecer "aceitar"/"descartar".
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let acc = "";
  let buf = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const lines = buf.split("\n");
    buf = lines.pop() ?? "";
    for (const line of lines) {
      const l = line.trim();
      if (!l.startsWith("data:")) continue;
      const data = l.slice(5).trim();
      if (data === "[DONE]") continue;
      try {
        const j = JSON.parse(data);
        const delta = j.choices?.[0]?.delta?.content ?? "";
        if (delta) acc += delta;
      } catch {
        // chunk parcial de um evento SSE — ignora e espera o resto chegar.
      }
    }
  }

  if (!acc.trim()) throw new Error("Resposta vazia da IA.");
  return acc.trim();
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
  const [shareFallback, setShareFallback] = useState<{ file: File; url: string; filename: string } | null>(null);
  const [aiLoading, setAiLoading] = useState<AiAction | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<{ action: AiAction; text: string } | null>(null);
  const [titleGenerating, setTitleGenerating] = useState(false);
  const [sourceTitle, setSourceTitle] = useState<string | null>(null);
  const [scanOpen, setScanOpen] = useState(false);
  const [formattingActive, setFormattingActive] = useState(false);

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

  // Recebe o texto já reconhecido (PDF/Word/foto/galeria) e insere na nota:
  // substitui o conteúdo se a nota estiver vazia, ou acrescenta ao final.
  function handleScanExtracted(text: string, kind: ScanKind) {
    if (!editor) return;

    const paragraphs = text
      .split(/\n{2,}/)
      .map((block) => block.replace(/\n/g, " ").trim())
      .filter(Boolean)
      .map((block) => ({ type: "paragraph", content: [{ type: "text", text: block }] }));

    if (!paragraphs.length) {
      toast.error("Nenhum texto reconhecido para inserir.");
      return;
    }

    const currentIsEmpty = !plainTextFromDoc(editor.getJSON() as Record<string, unknown>).trim();
    if (currentIsEmpty) {
      editor.commands.setContent({ type: "doc", content: paragraphs }, true);
    } else {
      editor.commands.focus("end");
      editor.commands.insertContent(paragraphs);
    }

    scheduleSave();
    void logNoteAiAction(id, "scan_transcricao");

    const sourceTypeByKind: Record<ScanKind, "scan_pdf" | "scan_word" | "scan_foto"> = {
      pdf: "scan_pdf",
      word: "scan_word",
      foto: "scan_foto",
      galeria: "scan_foto",
    };
    void updateNote(id, { source_type: sourceTypeByKind[kind] }).catch((err) => console.error(err));
  }

  function closeShareFallback() {
    if (shareFallback) URL.revokeObjectURL(shareFallback.url);
    setShareFallback(null);
  }

  async function handleExportPdf() {
    if (!editor) return;
    setExporting(true);
    try {
      const blob = await exportNoteToPdf({ title: title || "Anotação", contentHtml: editor.getHTML() });
      const filename = `${slugify(title || "anotacao")}.pdf`;
      const file = new File([blob], filename, { type: "application/pdf" });

      const canShareFile =
        typeof navigator.share === "function" &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [file] });

      if (canShareFile) {
        try {
          await navigator.share({ files: [file], title: title || "Anotação" });
          await markNoteExported(id);
          toast.success("PDF compartilhado.");
          return;
        } catch (shareErr) {
          // Não tratamos "AbortError" como cancelamento definitivo: vários
          // navegadores (principalmente Android/Chrome) usam esse mesmo nome
          // de erro tanto para "usuário cancelou a folha" quanto para "o
          // toque original expirou" (a causa real mais comum, já que a
          // geração do PDF com html2canvas leva um tempo perceptível antes
          // de chamar o navigator.share). Como não dá pra distinguir os dois
          // casos com segurança, sempre caímos no modal de fallback abaixo —
          // pior caso, o usuário fecha o modal; melhor caso, ele recupera um
          // PDF que teria sumido em silêncio.
          console.error(shareErr);
        }
      }

      const url = URL.createObjectURL(blob);
      setShareFallback({ file, url, filename });
    } catch (err) {
      console.error(err);
      toast.error("Não foi possível gerar o PDF agora.");
    } finally {
      setExporting(false);
    }
  }

  async function handleManualShare() {
    if (!shareFallback) return;
    try {
      await navigator.share({ files: [shareFallback.file], title: title || "Anotação" });
      await markNoteExported(id);
      toast.success("PDF compartilhado.");
      closeShareFallback();
    } catch (err) {
      if ((err as DOMException)?.name !== "AbortError") {
        console.error(err);
        toast.error("Não foi possível compartilhar. Tente baixar o PDF.");
      }
    }
  }

  function handleManualDownload() {
    if (!shareFallback) return;
    const link = document.createElement("a");
    link.href = shareFallback.url;
    link.download = shareFallback.filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    void markNoteExported(id);
    toast.success("PDF baixado.");
    closeShareFallback();
  }

  const saveLabel = useMemo(() => {
    if (saveState === "salvando") return "Salvando…";
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
          onClick={() => setScanOpen(true)}
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
      <NoteFormattingToolbar editor={editor} onActiveChange={setFormattingActive} />

      {/* ── Ações de IA (fixas na base) ─────────────────────────────
           Escondidas enquanto a barra de formatação estiver visível
           (há um texto selecionado), pra não sobrepor no rodapé. ── */}
      {!formattingActive && (
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
              Estruturar como lição
            </button>
          </div>
        </div>
      )}

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

      {/* ── Fallback de compartilhamento (quando a folha nativa falha ao
           abrir logo após a geração do PDF — normalmente por o toque
           original ter "expirado" durante o processamento) ──────────── */}
      <Dialog open={!!shareFallback} onOpenChange={(open) => !open && closeShareFallback()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>PDF pronto</DialogTitle>
            <DialogDescription>
              {typeof navigator !== "undefined" && typeof navigator.share === "function"
                ? "Toque em \"Compartilhar\" para escolher um app no seu celular, ou baixe o arquivo."
                : "Seu navegador não suporta compartilhamento direto de arquivos — baixe o PDF abaixo."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <button
              type="button"
              onClick={handleManualDownload}
              className="inline-flex items-center gap-1.5 rounded-2xl border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-2"
            >
              <Download className="h-4 w-4" /> Baixar PDF
            </button>
            {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
              <button
                type="button"
                onClick={() => void handleManualShare()}
                className="inline-flex items-center gap-1.5 rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-glow"
              >
                <Share2 className="h-4 w-4" /> Compartilhar
              </button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Scan Inteligente (PDF / Word / foto / galeria) ───────── */}
      <ScanInteligenteDialog open={scanOpen} onOpenChange={setScanOpen} onExtracted={handleScanExtracted} />

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
