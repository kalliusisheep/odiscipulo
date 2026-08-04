// Scan Inteligente (Bloco 4) — extração de texto a partir de PDF, Word
// (.docx), foto (câmera) ou imagem da galeria, para inserir direto numa
// anotação em "Minhas Notas".
//
// Dependências novas necessárias (o Lovable instala automaticamente ao
// fazer o build a partir do package.json — nenhum comando manual é preciso):
//   mammoth      → extrai texto de arquivos .docx direto no navegador
//   pdfjs-dist   → lê a camada de texto de PDFs direto no navegador
//
// Importante: PDF e Word são resolvidos 100% no navegador (nenhuma chamada
// de rede). Foto e imagem da galeria — e PDFs que são só imagem escaneada,
// sem camada de texto — usam OCR via IA, reaproveitando a Edge Function
// "mentor-chat" que já está publicada e ativa (mesmo gateway Gemini usado
// no Mentor Espiritual e nas ações de IA das notas). Não é preciso publicar
// nenhuma função nova nem mexer no Supabase para isso funcionar.

import { supabase } from "@/integrations/supabase/client";

export type ScanKind = "pdf" | "word" | "foto" | "galeria";

export type ScanProgress = (message: string) => void;

const MAX_PDF_TEXT_PAGES = 60; // páginas lidas ao extrair a camada de texto
const MAX_PDF_OCR_PAGES = 8; // páginas lidas via OCR (fallback, mais custoso)
const MIN_TEXT_LAYER_CHARS = 40; // abaixo disso, tratamos o PDF como "sem texto"
const IMAGE_MAX_DIMENSION = 1800; // redimensiona fotos grandes antes de mandar pra IA

/** Ponto de entrada único — decide a estratégia certa pra cada tipo de arquivo. */
export async function scanFile(
  file: File,
  kind: ScanKind,
  onProgress?: ScanProgress,
): Promise<string> {
  if (kind === "word") {
    onProgress?.("Lendo o documento Word…");
    const text = await extractTextFromDocx(file);
    if (!text.trim()) {
      throw new Error("Não encontramos texto neste arquivo Word.");
    }
    return text;
  }

  if (kind === "pdf") {
    onProgress?.("Lendo o PDF…");
    const pdfjsLib = await loadPdfjs();
    const buf = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buf }).promise;

    const textLayer = await extractPdfTextLayer(pdf);
    if (textLayer.length >= MIN_TEXT_LAYER_CHARS) {
      return textLayer;
    }

    // PDF sem camada de texto (documento escaneado) — cai pra OCR via IA.
    onProgress?.("Este PDF parece ser digitalizado — lendo como imagem…");
    return await ocrPdfPages(pdf, onProgress);
  }

  // "foto" ou "galeria" — mesma estratégia, só muda como o input do arquivo
  // é aberto no navegador (câmera vs. seletor de arquivos/galeria).
  onProgress?.("Lendo a imagem…");
  const dataUrl = await resizeImageToDataUrl(file, IMAGE_MAX_DIMENSION);
  const text = await ocrImageDataUrl(dataUrl);
  return text;
}

// ───────────────────────── Word (.docx) ─────────────────────────

async function extractTextFromDocx(file: File): Promise<string> {
  const mammoth = await import("mammoth");
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return (result.value ?? "").trim();
}

// ───────────────────────── PDF ─────────────────────────

type PdfjsModule = typeof import("pdfjs-dist");
type PdfDocumentProxy =
  Awaited<ReturnType<PdfjsModule["getDocument"]>>["promise"] extends Promise<infer T> ? T : never;

let pdfjsPromise: Promise<PdfjsModule> | null = null;

/** Carrega pdfjs-dist e configura o worker uma única vez (lazy, só no cliente). */
function loadPdfjs(): Promise<PdfjsModule> {
  if (!pdfjsPromise) {
    pdfjsPromise = (async () => {
      const pdfjsLib = await import("pdfjs-dist");
      const workerUrl = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
      pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
      return pdfjsLib;
    })();
  }
  return pdfjsPromise;
}

async function extractPdfTextLayer(pdf: PdfDocumentProxy): Promise<string> {
  const maxPages = Math.min(pdf.numPages, MAX_PDF_TEXT_PAGES);
  const pages: string[] = [];
  for (let i = 1; i <= maxPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ("str" in item ? (item as { str: string }).str : ""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    if (pageText) pages.push(pageText);
  }
  return pages.join("\n\n").trim();
}

/** Fallback pra PDFs sem camada de texto: renderiza cada página como imagem e faz OCR via IA. */
async function ocrPdfPages(pdf: PdfDocumentProxy, onProgress?: ScanProgress): Promise<string> {
  const maxPages = Math.min(pdf.numPages, MAX_PDF_OCR_PAGES);
  const parts: string[] = [];

  for (let i = 1; i <= maxPages; i++) {
    onProgress?.(`Lendo página ${i} de ${maxPages}…`);
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) continue;

    await page.render({ canvas, canvasContext: ctx, viewport }).promise;
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);

    try {
      const pageText = await ocrImageDataUrl(dataUrl);
      if (pageText.trim()) parts.push(pageText.trim());
    } catch (err) {
      console.error(`ocrPdfPages: falha na página ${i}`, err);
      // segue pras próximas páginas mesmo se uma falhar
    }
  }

  if (!parts.length) {
    throw new Error("Não conseguimos reconhecer texto neste PDF.");
  }
  return parts.join("\n\n");
}

// ───────────────────────── Imagem (foto/galeria) ─────────────────────────

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error ?? new Error("Falha ao ler o arquivo."));
    reader.readAsDataURL(file);
  });
}

function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Falha ao carregar a imagem."));
    img.src = src;
  });
}

/** Redimensiona a imagem (evita mandar fotos de câmera gigantes pra IA) e devolve um data URL JPEG. */
async function resizeImageToDataUrl(file: File, maxDimension: number): Promise<string> {
  const original = await fileToDataUrl(file);
  try {
    const img = await loadImageElement(original);
    const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
    if (scale >= 1) return original; // já é pequena o bastante

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return original;

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.85);
  } catch (err) {
    console.error("resizeImageToDataUrl: usando imagem original —", err);
    return original;
  }
}

const OCR_INSTRUCTION =
  "Transcreva literalmente todo o texto legível desta imagem, preservando parágrafos e quebras de linha. " +
  "Responda APENAS com o texto transcrito, em português quando aplicável, sem introdução, sem comentários, " +
  "sem markdown e sem aspas.";

/** Chama a Edge Function "mentor-chat" (já publicada) com uma imagem, pra transcrever o texto via Gemini Vision. */
async function ocrImageDataUrl(dataUrl: string): Promise<string> {
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
        {
          role: "user",
          content: [
            { type: "text", text: OCR_INSTRUCTION },
            { type: "image_url", image_url: { url: dataUrl } },
          ],
        },
      ],
    }),
  });

  if (!res.ok || !res.body) {
    throw new Error("Não foi possível chamar a IA para reconhecer o texto.");
  }

  // mentor-chat sempre responde em streaming (SSE, chunks estilo
  // chat.completions) — mesmo parsing já usado em Mentor.tsx e no editor de notas.
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

  if (!acc.trim()) {
    throw new Error("Nenhum texto foi reconhecido nesta imagem.");
  }
  return acc.trim();
}
