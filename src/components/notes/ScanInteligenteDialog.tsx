// Modal do botão "Scan Inteligente" (Bloco 4) — dentro do editor de uma
// anotação em "Minhas Notas". Oferece 4 formas de entrada de conteúdo:
// PDF, Word (.docx), tirar foto (câmera) e escolher da galeria. O texto
// reconhecido é devolvido pro componente pai via onExtracted, que decide
// como inserir na nota.

import { useRef, useState, type ChangeEvent } from "react";
import { Camera, FileText, Image as ImageIcon, Loader2, ScanLine } from "lucide-react";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { scanFile, type ScanKind } from "@/lib/scan";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExtracted: (text: string, kind: ScanKind) => void;
};

const OPTIONS: {
  kind: ScanKind;
  label: string;
  icon: typeof FileText;
  accept: string;
  capture?: "environment";
}[] = [
  { kind: "pdf", label: "Enviar PDF", icon: FileText, accept: "application/pdf" },
  {
    kind: "word",
    label: "Enviar Word",
    icon: FileText,
    accept: ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  },
  { kind: "foto", label: "Tirar foto", icon: Camera, accept: "image/*", capture: "environment" },
  { kind: "galeria", label: "Da galeria", icon: ImageIcon, accept: "image/*" },
];

export function ScanInteligenteDialog({ open, onOpenChange, onExtracted }: Props) {
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState("");
  const inputRefs = useRef<Partial<Record<ScanKind, HTMLInputElement | null>>>({});

  async function handleFile(file: File | null | undefined, kind: ScanKind) {
    if (!file || processing) return;
    setProcessing(true);
    setStatus("Preparando…");
    try {
      const text = await scanFile(file, kind, setStatus);
      onExtracted(text, kind);
      onOpenChange(false);
      toast.success("Texto reconhecido com sucesso.");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Não foi possível processar o arquivo.");
    } finally {
      setProcessing(false);
      setStatus("");
    }
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>, kind: ScanKind) {
    const file = e.target.files?.[0];
    void handleFile(file, kind);
    // permite selecionar o mesmo arquivo de novo em seguida
    e.target.value = "";
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !processing && onOpenChange(next)}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ScanLine className="h-5 w-5 text-primary" /> Scan Inteligente
          </DialogTitle>
          <DialogDescription>
            Envie um documento ou tire uma foto — o texto é reconhecido automaticamente e entra na sua anotação.
          </DialogDescription>
        </DialogHeader>

        {processing ? (
          <div className="flex flex-col items-center gap-3 py-10">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-center text-sm text-muted-foreground">{status || "Processando…"}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 py-2">
            {OPTIONS.map(({ kind, label, icon: Icon, accept, capture }) => (
              <button
                key={kind}
                type="button"
                onClick={() => inputRefs.current[kind]?.click()}
                className="card-elevated flex flex-col items-center gap-2 rounded-2xl border border-border p-4 text-center transition-colors hover:border-primary/40"
              >
                <Icon className="h-6 w-6 text-primary" />
                <span className="text-xs font-medium text-foreground">{label}</span>
                <input
                  ref={(el) => {
                    inputRefs.current[kind] = el;
                  }}
                  type="file"
                  accept={accept}
                  capture={capture}
                  className="hidden"
                  onChange={(e) => handleChange(e, kind)}
                />
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
