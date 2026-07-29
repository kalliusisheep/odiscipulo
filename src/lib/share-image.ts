// Gera a imagem de compartilhamento (formato retrato, 1080x1920 — compatível
// com Status do WhatsApp, Stories do Instagram e compartilhamento comum de
// imagem) combinando: imagem de fundo já existente no app + título da trilha
// + texto evangelístico gerado por IA, com o corpo do texto justificado.

const CANVAS_W = 1080;
const CANVAS_H = 1920;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Não foi possível carregar a imagem: ${src}`));
    img.src = src;
  });
}

function drawCoverImage(ctx: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number) {
  const imgRatio = img.width / img.height;
  const targetRatio = w / h;
  let sx = 0;
  let sy = 0;
  let sw = img.width;
  let sh = img.height;
  if (imgRatio > targetRatio) {
    sw = img.height * targetRatio;
    sx = (img.width - sw) / 2;
  } else {
    sh = img.width / targetRatio;
    sy = (img.height - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
}

function wrapWords(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(" ").filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function drawParagraphLine(
  ctx: CanvasRenderingContext2D,
  line: string,
  x: number,
  y: number,
  maxWidth: number,
  justify: boolean,
) {
  const words = line.split(" ").filter(Boolean);
  if (!justify || words.length < 2) {
    ctx.textAlign = "left";
    ctx.fillText(line, x, y);
    return;
  }
  const wordsWidth = words.reduce((sum, w) => sum + ctx.measureText(w).width, 0);
  const gap = (maxWidth - wordsWidth) / (words.length - 1);
  let cursor = x;
  ctx.textAlign = "left";
  for (const word of words) {
    ctx.fillText(word, cursor, y);
    cursor += ctx.measureText(word).width + gap;
  }
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

async function ensureFontsReady() {
  const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
  if (!fonts) return;
  try {
    await Promise.all([fonts.load('800 62px "Inter"'), fonts.load('400 42px "Inter"'), fonts.load('600 30px "Inter"')]);
    await fonts.ready;
  } catch {
    // Se a fonte não carregar a tempo, o canvas usa a fonte padrão do sistema —
    // a imagem ainda fica legível, só não com o Inter exato.
  }
}

export async function generateShareImage({
  title,
  bodyText,
  backgroundSrc,
}: {
  title: string;
  bodyText: string;
  backgroundSrc: string;
}): Promise<Blob> {
  await ensureFontsReady();

  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_W;
  canvas.height = CANVAS_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D não suportado neste navegador.");

  const img = await loadImage(backgroundSrc);
  drawCoverImage(ctx, img, CANVAS_W, CANVAS_H);

  // Overlay escuro em degradê para garantir legibilidade do texto sobre a imagem.
  const overlay = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
  overlay.addColorStop(0, "rgba(10,8,20,0.65)");
  overlay.addColorStop(0.32, "rgba(10,8,20,0.12)");
  overlay.addColorStop(0.6, "rgba(10,8,20,0.3)");
  overlay.addColorStop(1, "rgba(6,5,14,0.88)");
  ctx.fillStyle = overlay;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  const marginX = 90;
  const contentWidth = CANVAS_W - marginX * 2;

  // Título no topo da imagem.
  ctx.font = '800 62px "Inter", sans-serif';
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "rgba(0,0,0,0.45)";
  ctx.shadowBlur = 18;
  const titleLines = wrapWords(ctx, title.toUpperCase(), contentWidth).slice(0, 3);
  const titleLineHeight = 74;
  let titleY = 150;
  for (const line of titleLines) {
    ctx.textAlign = "center";
    ctx.fillText(line, CANVAS_W / 2, titleY);
    titleY += titleLineHeight;
  }
  ctx.shadowBlur = 0;

  // Corpo do texto (justificado) dentro de um painel translúcido.
  ctx.font = '400 42px "Inter", sans-serif';
  const bodyLineHeight = 60;
  const bodyMaxWidth = contentWidth - 80;

  const bodyLines: { text: string; isParagraphEnd: boolean }[] = [];
  bodyText
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .forEach((paragraph) => {
      const wrapped = wrapWords(ctx, paragraph, bodyMaxWidth);
      wrapped.forEach((line, i) => bodyLines.push({ text: line, isParagraphEnd: i === wrapped.length - 1 }));
    });

  const panelPaddingY = 70;
  const panelPaddingX = 70;
  const brandSpace = 90;
  const panelHeight = bodyLines.length * bodyLineHeight + panelPaddingY * 2 + brandSpace;
  const panelY = Math.max(CANVAS_H - panelHeight - 140, titleY + 40);

  ctx.fillStyle = "rgba(12,10,24,0.58)";
  roundRect(ctx, marginX - 20, panelY, contentWidth + 40, panelHeight, 36);
  ctx.fill();

  ctx.fillStyle = "#f5f3ff";
  let bodyY = panelY + panelPaddingY + 34;
  const textX = marginX + panelPaddingX - 20;
  bodyLines.forEach((line) => {
    drawParagraphLine(ctx, line.text, textX, bodyY, bodyMaxWidth, !line.isParagraphEnd);
    bodyY += bodyLineHeight;
  });

  ctx.font = '600 30px "Inter", sans-serif';
  ctx.fillStyle = "rgba(245,243,255,0.65)";
  ctx.textAlign = "center";
  ctx.fillText("THE DISCIPLE", CANVAS_W / 2, panelY + panelHeight - panelPaddingY / 2 + 10);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Falha ao gerar a imagem para compartilhar."))),
      "image/jpeg",
      0.92,
    );
  });
}
