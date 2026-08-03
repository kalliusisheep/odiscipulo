// Extração de texto para o Scan Inteligente (Bloco 4 do spec de Minhas
// Notas): PDF (texto nativo, com fallback pra OCR se a página for
// escaneada/imagem), Word (.docx) e foto/imagem (OCR via Gemini).

import { supabase } from "@/integrations/supabase/client";

async function fileToBase64(file: Blob): Promise<string> {
  const buf = await file.arrayBuffer();
  let binary = "";
  const bytes = new Uint8Array(buf);
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

/** Transcreve o texto visível numa imagem (foto tirada, galeria, ou canvas de página de PDF). */
export async function ocrImage(imageBlob: Blob, mimeType = "image/jpeg"): Promise<string> {
  const imageBase64 = await fileToBase64(imageBlob);
  const { data, error } = await supabase.functions.invoke<{ text?: string; error?: string }>(
    "scan-ocr",
    {
      body: { imageBase64, mimeType },
    },
  );
  if (error) throw new Error("Não foi possível processar a imagem.");
  if (data?.error && !data.text) throw new Error(data.error);
  return data?.text ?? "";
}

/** Extrai o texto de um arquivo .docx (Word). */
export async function extractTextFromDocx(file: File): Promise<string> {
  const mammoth = await import("mammoth");
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value.trim();
}

/** Extrai o texto de um PDF. Páginas com texto nativo são lidas direto; páginas
 * sem texto extraível (escaneadas) são renderizadas em imagem e passam por OCR. */
export async function extractTextFromPdf(
  file: File,
  onProgress?: (page: number, total: number) => void,
): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist");
  const workerUrl = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
  pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const pageTexts: string[] = [];
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    onProgress?.(pageNum, pdf.numPages);
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const nativeText = textContent.items
      .map((it) => ("str" in it ? it.str : ""))
      .join(" ")
      .trim();

    if (nativeText.length > 20) {
      pageTexts.push(nativeText);
      continue;
    }

    // Página sem texto extraível o suficiente — provavelmente escaneada. Renderiza
    // em canvas e manda pro OCR.
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) continue;
    await page.render({ canvasContext: ctx, viewport, canvas }).promise;
    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.9),
    );
    if (!blob) continue;
    try {
      const ocrText = await ocrImage(blob, "image/jpeg");
      if (ocrText) pageTexts.push(ocrText);
    } catch {
      // Página ilegível — segue pras próximas em vez de travar tudo.
    }
  }

  return pageTexts.join("\n\n").trim();
}
