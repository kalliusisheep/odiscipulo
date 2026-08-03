import { useNavigate, createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Camera, FileText, Image as ImageIcon, Loader2, ScanLine } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { extractTextFromDocx, extractTextFromPdf, ocrImage } from "@/lib/scan";
import { createNoteFromScan, type NoteSourceType } from "@/lib/notes";

export const Route = createFileRoute("/_authenticated/notas/scan")({
  component: ScanPage,
});

type Step = "escolher" | "extraindo" | "processar" | "salvando";

const SOURCE_LABEL: Record<
  Extract<NoteSourceType, "scan_pdf" | "scan_word" | "scan_foto">,
  string
> = {
  scan_pdf: "PDF",
  scan_word: "Word",
  scan_foto: "Foto",
};

function ScanPage() {
  const nav = useNavigate();
  const [step, setStep] = useState<Step>("escolher");
  const [progressLabel, setProgressLabel] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [sourceType, setSourceType] =
    useState<Extract<NoteSourceType, "scan_pdf" | "scan_word" | "scan_foto">>("scan_pdf");
  const [error, setError] = useState<string | null>(null);

  const pdfInputRef = useRef<HTMLInputElement>(null);
  const docxInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const runExtraction = async (
    kind: Extract<NoteSourceType, "scan_pdf" | "scan_word" | "scan_foto">,
    file: File,
  ) => {
    setSourceType(kind);
    setError(null);
    setStep("extraindo");
    setProgressLabel("Lendo arquivo…");
    try {
      let text = "";
      if (kind === "scan_pdf") {
        text = await extractTextFromPdf(file, (page, total) =>
          setProgressLabel(`Lendo página ${page} de ${total}…`),
        );
      } else if (kind === "scan_word") {
        text = await extractTextFromDocx(file);
      } else {
        setProgressLabel("Lendo o texto da imagem…");
        text = await ocrImage(file, file.type || "image/jpeg");
      }
      if (!text.trim()) {
        setError("Não consegui extrair nenhum texto legível desse arquivo.");
        setStep("escolher");
        return;
      }
      setExtractedText(text);
      setStep("processar");
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Não foi possível processar o arquivo.");
      setStep("escolher");
    }
  };

  const finish = async (
    action: "scan_transcricao" | "scan_reescrita" | "scan_estrutura" | null,
  ) => {
    setStep("salvando");
    try {
      let finalText = extractedText;
      if (action) {
        const { data, error: aiError } = await supabase.functions.invoke<{ text?: string }>(
          "note-ai",
          {
            body: { action, text: extractedText },
          },
        );
        if (aiError || !data?.text) throw new Error("A IA não conseguiu processar o texto agora.");
        finalText = data.text;
      }

      const { data: titleData } = await supabase.functions.invoke<{ text?: string }>("note-ai", {
        body: { action: "titulo", text: finalText },
      });
      const title = titleData?.text?.trim() || `Digitalização (${SOURCE_LABEL[sourceType]})`;

      const note = await createNoteFromScan({ text: finalText, title, sourceType });
      await nav({ to: "/notas/$id", params: { id: note.id } });
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Não foi possível salvar a anotação.");
      setStep("processar");
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-5 px-4 pb-24 pt-6">
      <button
        type="button"
        onClick={() => void nav({ to: "/notas" })}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Minhas Notas
      </button>

      <div className="flex items-center gap-2">
        <ScanLine className="h-5 w-5 text-primary" />
        <h1 className="text-xl font-semibold text-foreground">Scan Inteligente</h1>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {step === "escolher" && (
        <div className="space-y-2.5">
          <p className="text-sm text-muted-foreground">
            Escolha de onde vem o texto que você quer transformar em anotação.
          </p>

          <ScanOption
            icon={FileText}
            label="Upload de PDF"
            onClick={() => pdfInputRef.current?.click()}
          />
          <input
            ref={pdfInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void runExtraction("scan_pdf", file);
              e.target.value = "";
            }}
          />

          <ScanOption
            icon={FileText}
            label="Upload de Word (.docx)"
            onClick={() => docxInputRef.current?.click()}
          />
          <input
            ref={docxInputRef}
            type="file"
            accept=".docx"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void runExtraction("scan_word", file);
              e.target.value = "";
            }}
          />

          <ScanOption
            icon={Camera}
            label="Tirar foto"
            onClick={() => cameraInputRef.current?.click()}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void runExtraction("scan_foto", file);
              e.target.value = "";
            }}
          />

          <ScanOption
            icon={ImageIcon}
            label="Escolher da galeria"
            onClick={() => galleryInputRef.current?.click()}
          />
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void runExtraction("scan_foto", file);
              e.target.value = "";
            }}
          />
        </div>
      )}

      {step === "extraindo" && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">{progressLabel}</p>
        </div>
      )}

      {step === "processar" && (
        <div className="space-y-4">
          <div className="card-elevated max-h-56 overflow-y-auto p-4">
            <p className="whitespace-pre-wrap text-sm text-foreground/90">{extractedText}</p>
          </div>
          <p className="text-sm font-medium text-foreground">
            O que você quer fazer com esse texto?
          </p>
          <div className="space-y-2">
            <ScanOption
              label="Apenas transcrever"
              description="Salva o texto extraído como está"
              onClick={() => void finish(null)}
            />
            <ScanOption
              label="Reescrever"
              description="A IA reformula o texto extraído"
              onClick={() => void finish("scan_reescrita")}
            />
            <ScanOption
              label="Criar estrutura de lição/estudo"
              description="A IA organiza em introdução, pontos, aplicação e conclusão"
              onClick={() => void finish("scan_estrutura")}
            />
          </div>
        </div>
      )}

      {step === "salvando" && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Salvando sua anotação…</p>
        </div>
      )}
    </div>
  );
}

function ScanOption({
  icon: Icon,
  label,
  description,
  onClick,
}: {
  icon?: typeof FileText;
  label: string;
  description?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="card-elevated flex w-full items-center gap-3 p-4 text-left transition-colors hover:border-primary/40"
    >
      {Icon && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Icon className="h-4.5 w-4.5" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
    </button>
  );
}
