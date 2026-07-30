// Gera a imagem de compartilhamento (formato retrato, 1080x1920 — compatível
// com Status do WhatsApp, Stories do Instagram e compartilhamento comum de
// imagem) combinando: imagem de fundo já existente no app + título da trilha
// + texto evangelístico gerado por IA (justificado), posicionado logo abaixo
// do título.

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

function wrapParagraphs(
  ctx: CanvasRenderingContext2D,
  bodyText: string,
  maxWidth: number,
): { text: string; isParagraphEnd: boolean }[] {
  const lines: { text: string; isParagraphEnd: boolean }[] = [];
  // Um ou mais "\n" seguidos de espaço opcional e outro "\n" (ou seja, uma
  // linha em branco real no texto de origem) separam parágrafos e devem
  // virar um espaço visível na imagem — não apenas uma quebra de linha, como
  // uma quebra de linha simples dentro do mesmo parágrafo faria.
  const paragraphs = bodyText
    .split(/\n\s*\n+/)
    .map((p) => p.replace(/\n+/g, " ").trim())
    .filter(Boolean);
  paragraphs.forEach((paragraph, pIndex) => {
    const wrapped = wrapWords(ctx, paragraph, maxWidth);
    wrapped.forEach((line, i) => lines.push({ text: line, isParagraphEnd: i === wrapped.length - 1 }));
    // Linha vazia = espaço visível entre este parágrafo e o próximo
    // (tipicamente entre o corpo do texto e a pergunta final).
    if (pIndex < paragraphs.length - 1) {
      lines.push({ text: "", isParagraphEnd: true });
    }
  });
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
    await Promise.all([
      fonts.load('800 58px "Inter"'),
      fonts.load('400 40px "Inter"'),
      fonts.load('400 34px "Inter"'),
      fonts.load('400 30px "Inter"'),
    ]);
    await fonts.ready;
  } catch {
    // Se a fonte não carregar a tempo, o canvas usa a fonte padrão do sistema —
    // a imagem ainda fica legível, só não com o Inter exato.
  }
}

// Tamanhos de fonte candidatos para o corpo do texto, do maior para o menor.
// Como o texto pode ter até ~700 caracteres, reduzimos o tamanho até o painel
// caber na área disponível abaixo do título.
const BODY_FONT_SIZES = [40, 36, 32, 28] as const;

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

  // Overlay escuro em degradê, mais forte no topo (onde ficam título + texto)
  // para garantir legibilidade, esmaecendo em direção à base da imagem.
  const overlay = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
  overlay.addColorStop(0, "rgba(8,6,18,0.82)");
  overlay.addColorStop(0.55, "rgba(8,6,18,0.55)");
  overlay.addColorStop(0.78, "rgba(8,6,18,0.22)");
  overlay.addColorStop(1, "rgba(8,6,18,0.08)");
  ctx.fillStyle = overlay;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  const marginX = 90;
  const contentWidth = CANVAS_W - marginX * 2;
  const topOffset = 120;
  // Deixamos uma margem inferior generosa para a imagem continuar visível
  // e o painel nunca encostar no rodapé.
  const maxBottomY = CANVAS_H - 160;

  // Título no topo da imagem.
  ctx.font = '800 58px "Inter", sans-serif';
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "rgba(0,0,0,0.45)";
  ctx.shadowBlur = 18;
  const titleLines = wrapWords(ctx, title.toUpperCase(), contentWidth).slice(0, 3);
  const titleLineHeight = 70;
  let titleY = topOffset;
  for (const line of titleLines) {
    ctx.textAlign = "center";
    ctx.fillText(line, CANVAS_W / 2, titleY);
    titleY += titleLineHeight;
  }
  ctx.shadowBlur = 0;

  // Corpo do texto (justificado), logo abaixo do título, dentro de um painel
  // translúcido. Escolhe o maior tamanho de fonte que ainda cabe no espaço
  // disponível entre o título e o rodapé — o texto pode ter até 700 caracteres.
  // Painel: posição/largura definidas uma única vez e usadas tanto para o
  // desenho do fundo quanto para o cálculo do texto, garantindo que a
  // distância do texto até a borda do painel seja igual dos dois lados.
  const panelX = marginX - 20;
  const panelWidth = contentWidth + 40;
  const panelPaddingY = 56;
  const panelPaddingX = 40; // distância (igual nos 2 lados) entre o texto e a borda do painel
  const panelTop = titleY + 16; // texto mais próximo do título
  const availableHeight = maxBottomY - panelTop;

  let chosenFontSize = BODY_FONT_SIZES[BODY_FONT_SIZES.length - 1];
  let chosenLines: { text: string; isParagraphEnd: boolean }[] = [];
  let chosenLineHeight = 0;
  let chosenPanelHeight = 0;
  const bodyMaxWidth = panelWidth - panelPaddingX * 2;

  for (const fontSize of BODY_FONT_SIZES) {
    ctx.font = `400 ${fontSize}px "Inter", sans-serif`;
    const lines = wrapParagraphs(ctx, bodyText, bodyMaxWidth);
    const lineHeight = Math.round(fontSize * 1.42);
    const panelHeight = lines.length * lineHeight + panelPaddingY * 2;
    if (panelHeight <= availableHeight || fontSize === BODY_FONT_SIZES[BODY_FONT_SIZES.length - 1]) {
      chosenFontSize = fontSize;
      chosenLines = lines;
      chosenLineHeight = lineHeight;
      chosenPanelHeight = panelHeight;
      break;
    }
  }

  // Se mesmo no menor tamanho o texto não coube, corta o excesso de linhas
  // (proteção extra — na prática o limite de 700 caracteres já evita isso).
  const maxLinesThatFit = Math.max(1, Math.floor((availableHeight - panelPaddingY * 2) / chosenLineHeight));
  if (chosenLines.length > maxLinesThatFit) {
    chosenLines = chosenLines.slice(0, maxLinesThatFit);
    chosenPanelHeight = chosenLines.length * chosenLineHeight + panelPaddingY * 2;
  }

  ctx.fillStyle = "rgba(12,10,24,0.60)";
  roundRect(ctx, panelX, panelTop, panelWidth, chosenPanelHeight, 32);
  ctx.fill();

  ctx.font = `400 ${chosenFontSize}px "Inter", sans-serif`;
  ctx.fillStyle = "#f5f3ff";
  let bodyY = panelTop + panelPaddingY + chosenFontSize * 0.78;
  const textX = panelX + panelPaddingX;
  chosenLines.forEach((line) => {
    drawParagraphLine(ctx, line.text, textX, bodyY, bodyMaxWidth, !line.isParagraphEnd);
    bodyY += chosenLineHeight;
  });

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Falha ao gerar a imagem para compartilhar."))),
      "image/jpeg",
      0.92,
    );
  });
}
