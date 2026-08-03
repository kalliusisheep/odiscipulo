// Exporta uma nota como PDF estruturado e organizado. Estratégia: monta um
// layout de impressão limpo (fundo branco, tipografia de leitura, cores de
// marca-texto preservadas) fora da tela, tira um "retrato" dele com
// html2canvas e distribui esse retrato em páginas A4 no jsPDF — assim a
// formatação rica do editor (negrito, itálico, marca-texto colorido) sai
// exatamente como o usuário viu, sem reescrever um parser de HTML→PDF.
//
// Requer: `npm install jspdf html2canvas-pro` (html2canvas-pro, e não o
// html2canvas original, porque o app usa Tailwind v4 — cores em oklch() —
// e o html2canvas "puro" não sabe interpretar esse formato de cor e trava
// com "Attempting to parse an unsupported color function 'oklch'").

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas-pro";

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const PAGE_MARGIN_MM = 16;

function formatDate(date: Date): string {
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

/**
 * Calcula os pontos de corte de página em pixels do canvas, tentando sempre
 * cair no TOPO de um bloco de texto (parágrafo, título, item de lista) em
 * vez de cortar no meio de uma linha — que era a causa do PDF "cortar texto
 * no final de uma página e no início da outra".
 *
 * Estratégia gulosa: para cada página, usamos o corte "ingênuo" (altura fixa
 * da página) como teto, mas recuamos até o início do bloco mais próximo que
 * ainda cabe. Só caímos de volta no corte ingênuo se um único bloco for mais
 * alto que uma página inteira (caso raro, ex.: um parágrafo gigantesco).
 */
function computePageBreaksPx(blockTopsPx: number[], canvasHeightPx: number, pageHeightPx: number): number[] {
  const sortedTops = [...blockTopsPx].sort((a, b) => a - b);
  const breaks: number[] = [0];
  let currentStart = 0;

  while (currentStart < canvasHeightPx) {
    const naiveEnd = currentStart + pageHeightPx;
    if (naiveEnd >= canvasHeightPx) break; // resto do conteúdo cabe na última página

    // Maior início de bloco que ainda cabe dentro do limite da página atual.
    let candidate: number | null = null;
    for (const top of sortedTops) {
      if (top > currentStart && top <= naiveEnd) candidate = top;
      if (top > naiveEnd) break;
    }

    const nextStart = candidate ?? naiveEnd;
    breaks.push(nextStart);
    currentStart = nextStart;
  }

  return breaks;
}

export async function exportNoteToPdf({
  title,
  contentHtml,
  appName = "O Discípulo",
}: {
  title: string;
  contentHtml: string;
  appName?: string;
}): Promise<Blob> {
  // Layout renderizado fora da viewport visível, largura fixa equivalente
  // à área útil de uma página A4 a 96dpi, pra manter a proporção do canvas
  // consistente com o PDF final.
  const PRINT_WIDTH_PX = 794; // ~210mm a 96dpi

  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "0";
  container.style.left = "-9999px";
  container.style.width = `${PRINT_WIDTH_PX}px`;
  container.style.background = "#ffffff";
  container.style.color = "#1a1625";
  container.style.padding = "56px 64px";
  container.style.fontFamily = '"Inter", ui-sans-serif, system-ui, sans-serif';
  container.style.boxSizing = "border-box";

  container.innerHTML = `
    <div id="note-pdf-header" style="border-bottom:2px solid #ede9fe;padding-bottom:20px;margin-bottom:28px;">
      <h1 style="margin:0;font-size:28px;font-weight:800;line-height:1.25;color:#1a1625;">${escapeHtml(title)}</h1>
      <p style="margin:8px 0 0;font-size:12px;color:#7c7691;">Exportado de ${escapeHtml(appName)} em ${formatDate(new Date())}</p>
    </div>
    <div id="note-pdf-body" style="font-size:15px;line-height:1.75;color:#1a1625;">${contentHtml}</div>
  `;

  // Normaliza a tipografia do corpo (headings, parágrafos, marca-texto)
  // para um documento de leitura confortável, sem depender do tema dark
  // do app (que não faz sentido impresso).
  const style = document.createElement("style");
  style.textContent = `
    #note-pdf-body p { margin: 0 0 12px; }
    #note-pdf-body h1, #note-pdf-body h2, #note-pdf-body h3 { margin: 20px 0 10px; font-weight: 700; }
    #note-pdf-body ul, #note-pdf-body ol { margin: 0 0 12px; padding-left: 22px; }
    #note-pdf-body mark { padding: 1px 2px; border-radius: 3px; }
    #note-pdf-body strong { font-weight: 700; }
  `;
  container.appendChild(style);
  document.body.appendChild(container);

  try {
    // Coleta, ANTES de rasterizar, o topo de cada bloco "seguro para cortar"
    // (cabeçalho, cada filho direto do corpo, e cada item de lista) — ainda
    // em pixels de CSS, relativos ao próprio container.
    const containerTopPx = container.getBoundingClientRect().top;
    const blockEls = Array.from(
      container.querySelectorAll<HTMLElement>("#note-pdf-header, #note-pdf-body > *, #note-pdf-body li")
    );
    const blockTopsCssPx = blockEls.map((el) => el.getBoundingClientRect().top - containerTopPx);

    const canvas = await html2canvas(container, { scale: 2, backgroundColor: "#ffffff", useCORS: true });

    // Fator real entre o canvas rasterizado e o CSS px do container (evita
    // depender de o `scale: 2` bater exatamente, já que devicePixelRatio
    // pode interferir).
    const scaleFactor = canvas.width / container.getBoundingClientRect().width;
    const blockTopsPx = blockTopsCssPx.map((top) => Math.max(0, Math.round(top * scaleFactor)));

    const pdf = new jsPDF({ unit: "mm", format: "a4" });
    const usableWidthMm = A4_WIDTH_MM - PAGE_MARGIN_MM * 2;
    const usableHeightMm = A4_HEIGHT_MM - PAGE_MARGIN_MM * 2;

    const pxToMm = usableWidthMm / canvas.width;
    const pageHeightPx = usableHeightMm / pxToMm;

    const pageBreaks = computePageBreaksPx(blockTopsPx, canvas.height, pageHeightPx);

    for (let pageIndex = 0; pageIndex < pageBreaks.length; pageIndex++) {
      const startPx = pageBreaks[pageIndex];
      const endPx = pageIndex + 1 < pageBreaks.length ? pageBreaks[pageIndex + 1] : canvas.height;
      // Nunca deixamos uma "fatia" ultrapassar a altura útil de uma página —
      // se um único bloco for mais alto que isso (caso raro), caímos de
      // volta no corte por altura fixa só para esse trecho.
      const sliceHeightPx = Math.min(endPx - startPx, pageHeightPx, canvas.height - startPx);
      if (sliceHeightPx <= 0) continue;

      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = canvas.width;
      pageCanvas.height = sliceHeightPx;
      const ctx = pageCanvas.getContext("2d");
      if (!ctx) throw new Error("Canvas 2D não suportado neste navegador.");
      ctx.drawImage(canvas, 0, startPx, canvas.width, sliceHeightPx, 0, 0, canvas.width, sliceHeightPx);

      const imgData = pageCanvas.toDataURL("image/jpeg", 0.95);
      if (pageIndex > 0) pdf.addPage();
      pdf.addImage(imgData, "JPEG", PAGE_MARGIN_MM, PAGE_MARGIN_MM, usableWidthMm, sliceHeightPx * pxToMm);
    }

    // Rodapé discreto em todas as páginas.
    const pageCount = pdf.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(150, 145, 170);
      pdf.text(`${appName} · página ${i} de ${pageCount}`, A4_WIDTH_MM / 2, A4_HEIGHT_MM - 8, { align: "center" });
    }

    return pdf.output("blob");
  } finally {
    document.body.removeChild(container);
  }
}

function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
