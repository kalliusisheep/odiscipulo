import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Download, Loader2, Minus, Plus as PlusIcon, RotateCcw } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { supabase } from "@/integrations/supabase/client";
import { getLevel } from "@/data/levels";

export const Route = createFileRoute("/_authenticated/lider_/arvore")({
  component: ArvorePage,
});

type TreeNode = {
  id: string;
  display_name: string;
  username: string | null;
  avatar_url: string | null;
  xp: number | null;
  parent_id: string | null;
  direction: "up" | "self" | "down";
  depth: number;
};

// --- Layout (posiciona cada pessoa num "slot" de grade; depois convertemos
// para pixels). Mesma lógica é usada tanto pro desenho na tela (SVG) quanto
// pro desenho no canvas usado na exportação em PDF — uma única fonte de verdade.
// COL_W dá bastante "respiro" horizontal e o nome é sempre truncado a um
// tamanho pequeno o suficiente pra nunca encostar no vizinho, mesmo em nomes
// grandes lado a lado. ---
const NODE_R = 30;
const COL_W = 176;
const ROW_H = 160;
const PAD = 84;
const HEADER_H = 136; // espaço reservado só no PDF pra faixa de título + legenda
const FOOTER_H = 200; // espaço reservado só no PDF pra separador + logo + copyright
const NAME_MAX_CHARS = 12;
const NAME_FONT_SIZE = 9.5;

type Positions = Map<string, { x: number; y: number }>;

// Paleta "gamificada" — copiada 1:1 das variáveis de cor do app (tema escuro),
// pra o canvas do PDF (que não enxerga CSS var) bater exatamente com a tela.
const C = {
  bg: "oklch(0.17 0.03 265)",
  bg2: "oklch(0.205 0.032 267)",
  surface: "oklch(0.22 0.03 265)",
  border: "oklch(0.34 0.045 270)",
  primary: "oklch(0.62 0.22 292)",
  primaryGlow: "oklch(0.72 0.20 285)",
  ancient: "oklch(0.82 0.13 85)",
  ancientFg: "oklch(0.22 0.05 85)",
  success: "oklch(0.68 0.18 155)",
  text: "oklch(0.97 0.01 265)",
  mutedText: "oklch(0.74 0.03 265)",
  shadow: "oklch(0.10 0.02 265)",
  gold: "oklch(0.80 0.16 80)",
};

function ringColorFor(direction: TreeNode["direction"]) {
  return direction === "self" ? C.primary : direction === "up" ? C.ancient : C.success;
}
function chipTextColorFor(direction: TreeNode["direction"]) {
  return direction === "up" ? C.ancientFg : "#0e0d16";
}

function computeLayout(nodes: TreeNode[]): { positions: Positions; width: number; height: number; root: TreeNode | null } {
  const root = nodes.find((n) => n.direction === "self") ?? null;
  const positions: Positions = new Map();
  if (!root) return { positions, width: 0, height: 0, root };

  const childrenOf = new Map<string, TreeNode[]>();
  nodes
    .filter((n) => n.direction === "down")
    .forEach((n) => {
      if (!n.parent_id) return;
      const list = childrenOf.get(n.parent_id) ?? [];
      list.push(n);
      childrenOf.set(n.parent_id, list);
    });

  let nextSlot = 0;
  const gridPos = new Map<string, { gx: number; gy: number }>();

  function place(node: TreeNode, depth: number): number {
    const kids = (childrenOf.get(node.id) ?? []).sort((a, b) => a.display_name.localeCompare(b.display_name));
    if (kids.length === 0) {
      const gx = nextSlot++;
      gridPos.set(node.id, { gx, gy: depth });
      return gx;
    }
    const childXs = kids.map((k) => place(k, depth + 1));
    const gx = (childXs[0] + childXs[childXs.length - 1]) / 2;
    gridPos.set(node.id, { gx, gy: depth });
    return gx;
  }
  place(root, 0);

  const ancestors = nodes.filter((n) => n.direction === "up").sort((a, b) => a.depth - b.depth);
  const rootGx = gridPos.get(root.id)!.gx;
  ancestors.forEach((a) => gridPos.set(a.id, { gx: rootGx, gy: a.depth }));

  const minGy = Math.min(0, ...ancestors.map((a) => a.depth));
  gridPos.forEach((pos, id) => {
    positions.set(id, { x: pos.gx * COL_W + PAD, y: (pos.gy - minGy) * ROW_H + PAD });
  });

  const maxGx = Math.max(0, ...[...gridPos.values()].map((p) => p.gx));
  const maxGy = Math.max(0, ...[...gridPos.values()].map((p) => p.gy - minGy));

  return { positions, width: maxGx * COL_W + PAD * 2, height: maxGy * ROW_H + PAD * 2, root };
}

function initials(name: string) {
  return (name || "?").trim().charAt(0).toUpperCase();
}

function truncate(text: string, max: number) {
  const clean = (text || "?").trim();
  return clean.length > max ? `${clean.slice(0, max - 1)}…` : clean;
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

// jsPDF carregado sob demanda via CDN, só quando a pessoa clica em exportar —
// não pesa no bundle do app pro dia a dia.
async function loadJsPdf(): Promise<any> {
  const w = window as any;
  if (w.jspdf) return w.jspdf;
  await new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Falha ao carregar jsPDF"));
    document.head.appendChild(script);
  });
  return w.jspdf;
}

// Tile pequeno com um xadrez sutil pra criar o fundo "pixelado" repetindo em
// pattern, em vez de desenhar centenas de retângulos na mão.
function makeCheckerPattern(ctx: CanvasRenderingContext2D): CanvasPattern | null {
  const tile = document.createElement("canvas");
  tile.width = 16;
  tile.height = 16;
  const tctx = tile.getContext("2d");
  if (!tctx) return null;
  tctx.fillStyle = C.bg;
  tctx.fillRect(0, 0, 16, 16);
  tctx.fillStyle = C.bg2;
  tctx.fillRect(0, 0, 8, 8);
  tctx.fillRect(8, 8, 8, 8);
  return ctx.createPattern(tile, "repeat");
}

function pixelRoundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

// Formato "faixa/banner" de jogo pro selo de nível — hexágono com pontas,
// bem mais "game HUD" do que um retângulo comum.
function ribbonPoints(cx: number, cy: number, w: number, h: number, tail: number) {
  const hw = w / 2;
  const hh = h / 2;
  return [
    [cx - hw, cy - hh],
    [cx + hw, cy - hh],
    [cx + hw + tail, cy],
    [cx + hw, cy + hh],
    [cx - hw, cy + hh],
    [cx - hw - tail, cy],
  ];
}

function ribbonPath(ctx: CanvasRenderingContext2D, cx: number, cy: number, w: number, h: number, tail: number) {
  const pts = ribbonPoints(cx, cy, w, h, tail);
  ctx.beginPath();
  pts.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
  ctx.closePath();
}

// Coroinha pixelada (3 blocos + base) só pro nó "você" — toque de jogo sem
// depender de nenhum ícone externo, tudo em retângulos "duros".
function crownPointsCanvas(ctx: CanvasRenderingContext2D, cx: number, topY: number, color: string) {
  const s = 5; // tamanho de cada "pixel"
  ctx.fillStyle = color;
  ctx.fillRect(cx - s * 3, topY + s, s * 6, s);
  ctx.fillRect(cx - s * 3, topY, s, s * 2);
  ctx.fillRect(cx - s, topY, s, s * 2);
  ctx.fillRect(cx + s * 2, topY, s, s * 2);
}

const MIN_SCALE = 0.25;
const MAX_SCALE = 3;
const clampScale = (s: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s));

function ArvorePage() {
  const [nodes, setNodes] = useState<TreeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [view, setView] = useState({ scale: 1, tx: PAD, ty: PAD });

  const containerRef = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const dragRef = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);
  const pinchRef = useRef<{ dist: number; scale: number } | null>(null);

  useEffect(() => {
    void (async () => {
      const { data, error } = await supabase.rpc("get_my_discipleship_tree");
      if (error) {
        toast.error("Não foi possível carregar sua árvore de discipulado.");
      } else {
        setNodes((data ?? []) as TreeNode[]);
      }
      setLoading(false);
    })();
  }, []);

  const layout = useMemo(() => computeLayout(nodes), [nodes]);

  useEffect(() => {
    if (layout.width && layout.height) {
      setView((v) => ({ ...v, tx: 24, ty: 24 }));
    }
  }, [layout.width, layout.height]);

  function zoomAt(cx: number, cy: number, newScaleRaw: number) {
    setView((v) => {
      const newScale = clampScale(newScaleRaw);
      const k = newScale / v.scale;
      return { scale: newScale, tx: cx - k * (cx - v.tx), ty: cy - k * (cy - v.ty) };
    });
  }

  function onWheel(e: React.WheelEvent) {
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    zoomAt(e.clientX - rect.left, e.clientY - rect.top, view.scale * (1 - e.deltaY * 0.0015));
  }

  function onPointerDown(e: React.PointerEvent) {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) {
      dragRef.current = { x: e.clientX, y: e.clientY, tx: view.tx, ty: view.ty };
      pinchRef.current = null;
    } else if (pointers.current.size === 2) {
      const pts = [...pointers.current.values()];
      pinchRef.current = { dist: Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y), scale: view.scale };
      dragRef.current = null;
    }
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2 && pinchRef.current) {
      const pts = [...pointers.current.values()];
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      setView((v) => ({ ...v, scale: clampScale(pinchRef.current!.scale * (dist / pinchRef.current!.dist)) }));
    } else if (pointers.current.size === 1 && dragRef.current) {
      const dx = e.clientX - dragRef.current.x;
      const dy = e.clientY - dragRef.current.y;
      setView((v) => ({ ...v, tx: dragRef.current!.tx + dx, ty: dragRef.current!.ty + dy }));
    }
  }

  function onPointerUp(e: React.PointerEvent) {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size === 1) {
      const [[, p]] = [...pointers.current.entries()];
      dragRef.current = { x: p.x, y: p.y, tx: view.tx, ty: view.ty };
    } else {
      dragRef.current = null;
      pinchRef.current = null;
    }
  }

  function zoomButton(factor: number) {
    const rect = containerRef.current?.getBoundingClientRect();
    const cx = rect ? rect.width / 2 : 0;
    const cy = rect ? rect.height / 2 : 0;
    zoomAt(cx, cy, view.scale * factor);
  }

  function resetView() {
    setView({ scale: 1, tx: 24, ty: 24 });
  }

  async function exportPdf() {
    if (!layout.root) return;
    setExporting(true);
    try {
      const scaleFactor = 2;
      const totalHeight = HEADER_H + layout.height + FOOTER_H;
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, layout.width * scaleFactor);
      canvas.height = Math.max(1, totalHeight * scaleFactor);
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("sem canvas 2d");
      ctx.scale(scaleFactor, scaleFactor);

      // fundo "pixelado" (xadrez sutil) cobrindo a página inteira
      const pattern = makeCheckerPattern(ctx);
      ctx.fillStyle = pattern ?? C.bg;
      ctx.fillRect(0, 0, layout.width, totalHeight);

      // ---------- CABEÇALHO (faixa de título + legenda, só no PDF) ----------
      ctx.fillStyle = C.surface;
      ctx.fillRect(0, 0, layout.width, HEADER_H);
      ctx.strokeStyle = C.border;
      ctx.setLineDash([6, 4]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, HEADER_H);
      ctx.lineTo(layout.width, HEADER_H);
      ctx.stroke();
      ctx.setLineDash([]);

      const headerMascot = await loadImage("/sheep-mascot.png");
      const hmSize = 46;
      if (headerMascot) ctx.drawImage(headerMascot, PAD / 2, 24, hmSize, hmSize);
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = C.primaryGlow;
      ctx.font = "800 15px ui-monospace, Menlo, monospace";
      ctx.fillText("iSheep", PAD / 2 + hmSize + 12, 44);
      ctx.fillStyle = C.mutedText;
      ctx.font = "600 10.5px system-ui, sans-serif";
      ctx.fillText("Painel do Líder", PAD / 2 + hmSize + 12, 60);

      ctx.textAlign = "center";
      ctx.fillStyle = C.text;
      ctx.font = "800 21px ui-monospace, Menlo, monospace";
      ctx.fillText("Árvore de Discipulado", layout.width / 2, 52);
      ctx.fillStyle = C.primary;
      ctx.fillRect(layout.width / 2 - 46, 62, 92, 3);

      // legenda no canto direito do cabeçalho
      const legendItems: [string, string][] = [
        [C.primary, "Você"],
        [C.ancient, "Liderança acima"],
        [C.success, "Discípulos"],
      ];
      ctx.textAlign = "left";
      ctx.font = "700 9.5px ui-monospace, Menlo, monospace";
      let legendY = 26;
      const legendX = layout.width - PAD / 2 - 132;
      legendItems.forEach(([color, label]) => {
        ctx.fillStyle = color;
        pixelRoundRect(ctx, legendX, legendY, 9, 9, 2);
        ctx.fill();
        ctx.fillStyle = C.mutedText;
        ctx.fillText(label, legendX + 15, legendY + 8.5);
        legendY += 16;
      });

      // cantos estilo "HUD" de jogo (frame decorativo)
      drawCornerBrackets(ctx, layout.width, totalHeight);

      // ---------- ÁRVORE ----------
      ctx.save();
      ctx.translate(0, HEADER_H);

      // conexões em estilo "árvore de habilidades" (linha em ângulo reto, tracejada)
      ctx.strokeStyle = C.border;
      ctx.lineWidth = 3;
      ctx.setLineDash([7, 5]);
      ctx.lineCap = "square";
      for (const node of nodes) {
        if (!node.parent_id) continue;
        const p1 = layout.positions.get(node.id);
        const p2 = layout.positions.get(node.parent_id);
        if (!p1 || !p2) continue;
        const midY = (p2.y + NODE_R + (p1.y - NODE_R)) / 2;
        ctx.beginPath();
        ctx.moveTo(p2.x, p2.y + NODE_R);
        ctx.lineTo(p2.x, midY);
        ctx.lineTo(p1.x, midY);
        ctx.lineTo(p1.x, p1.y - NODE_R);
        ctx.stroke();

        // "nó de circuito" no cotovelo da conexão, toque de tabuleiro de jogo
        ctx.setLineDash([]);
        ctx.fillStyle = C.border;
        ctx.fillRect(p1.x - 2.5, midY - 2.5, 5, 5);
        ctx.setLineDash([7, 5]);
      }
      ctx.setLineDash([]);

      let anyImageFailed = false;
      for (const node of nodes) {
        const pos = layout.positions.get(node.id);
        if (!pos) continue;
        const img = node.avatar_url ? await loadImage(node.avatar_url) : null;
        if (node.avatar_url && !img) anyImageFailed = true;
        const ring = ringColorFor(node.direction);
        const level = getLevel(node.xp ?? 0).level;

        // sombra "dura" (sem blur) pra dar volume de jogo/pixel-art
        ctx.fillStyle = C.shadow;
        ctx.globalAlpha = 0.45;
        pixelRoundRect(ctx, pos.x - NODE_R + 4, pos.y - NODE_R + 4, NODE_R * 2, NODE_R * 2, 8);
        ctx.fill();
        ctx.globalAlpha = 1;

        // brilho externo + coroa pixelada só pro nó "você"
        if (node.direction === "self") {
          ctx.strokeStyle = C.primaryGlow;
          ctx.lineWidth = 2;
          pixelRoundRect(ctx, pos.x - NODE_R - 6, pos.y - NODE_R - 6, NODE_R * 2 + 12, NODE_R * 2 + 12, 10);
          ctx.stroke();
          crownPointsCanvas(ctx, pos.x, pos.y - NODE_R - 22, C.gold);
        }

        ctx.save();
        pixelRoundRect(ctx, pos.x - NODE_R, pos.y - NODE_R, NODE_R * 2, NODE_R * 2, 8);
        if (img) {
          ctx.clip();
          ctx.drawImage(img, pos.x - NODE_R, pos.y - NODE_R, NODE_R * 2, NODE_R * 2);
        } else {
          ctx.fillStyle = ring;
          ctx.globalAlpha = 0.28;
          ctx.fill();
          ctx.globalAlpha = 1;
          ctx.fillStyle = C.text;
          ctx.font = "bold 18px ui-monospace, Menlo, monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(initials(node.display_name), pos.x, pos.y);
        }
        ctx.restore();

        // moldura "chunky": borda grossa + friso interno claro (efeito bisel de UI de jogo)
        ctx.strokeStyle = ring;
        ctx.lineWidth = 3;
        pixelRoundRect(ctx, pos.x - NODE_R, pos.y - NODE_R, NODE_R * 2, NODE_R * 2, 8);
        ctx.stroke();
        ctx.strokeStyle = C.text;
        ctx.globalAlpha = 0.18;
        ctx.lineWidth = 1;
        pixelRoundRect(ctx, pos.x - NODE_R + 4, pos.y - NODE_R + 4, NODE_R * 2 - 8, NODE_R * 2 - 8, 5);
        ctx.stroke();
        ctx.globalAlpha = 1;

        // nome — pequeno e sempre truncado, então nunca encosta no vizinho
        ctx.fillStyle = C.text;
        ctx.font = `700 ${NAME_FONT_SIZE}px system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";
        ctx.fillText(truncate(node.display_name, NAME_MAX_CHARS), pos.x, pos.y + NODE_R + 16);

        // selo de nível em formato "faixa de jogo"
        const badgeY = pos.y + NODE_R + 33;
        ctx.fillStyle = ring;
        ribbonPath(ctx, pos.x, badgeY, 44, 17, 6);
        ctx.fill();
        ctx.strokeStyle = C.shadow;
        ctx.globalAlpha = 0.5;
        ctx.lineWidth = 1.5;
        ribbonPath(ctx, pos.x, badgeY, 44, 17, 6);
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.fillStyle = chipTextColorFor(node.direction);
        ctx.font = "bold 9.5px ui-monospace, Menlo, monospace";
        ctx.fillText(`Nv ${level}`, pos.x, badgeY + 3.5);
      }
      ctx.restore();

      // ---------- RODAPÉ (separador, mascote e copyright, centralizados) ----------
      const footerTop = HEADER_H + layout.height;
      ctx.strokeStyle = C.border;
      ctx.setLineDash([6, 4]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(PAD / 2, footerTop + 18);
      ctx.lineTo(layout.width - PAD / 2, footerTop + 18);
      ctx.stroke();
      ctx.setLineDash([]);

      const mascot = await loadImage("/sheep-mascot.png");
      const mascotSize = 84;
      const mascotX = layout.width / 2 - mascotSize / 2;
      const mascotY = footerTop + 34;
      if (mascot) {
        ctx.drawImage(mascot, mascotX, mascotY, mascotSize, mascotSize);
      }

      ctx.fillStyle = C.mutedText;
      ctx.font = "600 11px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("© 2026 iSheep. All Rights Reserved.", layout.width / 2, mascotY + mascotSize + 26);

      const dataUrl = canvas.toDataURL("image/png");
      const jspdfNs = await loadJsPdf();
      const JsPdfCtor = jspdfNs.jsPDF;
      const orientation = layout.width >= totalHeight ? "l" : "p";
      const pdf = new JsPdfCtor({ orientation, unit: "pt", format: [layout.width, totalHeight] });
      pdf.addImage(dataUrl, "PNG", 0, 0, layout.width, totalHeight);
      pdf.save("arvore-de-discipulado.pdf");

      if (anyImageFailed) {
        toast.message("Algumas fotos não puderam ser incluídas no PDF, mas o restante foi exportado.");
      }
    } catch (e) {
      console.error("Exportar árvore em PDF:", e);
      toast.error("Não foi possível gerar o PDF agora.");
    } finally {
      setExporting(false);
    }
  }

  const totalAbaixo = nodes.filter((n) => n.direction === "down").length;
  const temLiderAcima = nodes.some((n) => n.direction === "up");

  return (
    <div className="mx-auto max-w-lg space-y-5 px-4 pb-24 pt-6">
      <header className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Link to="/lider" className="rounded-full p-2 hover:bg-surface">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <p className="text-xs text-muted-foreground">Painel do Líder</p>
            <h1 className="text-xl font-semibold">Árvore de Discipulado</h1>
          </div>
        </div>
        <ThemeToggle />
      </header>

      {loading ? (
        <div className="card-elevated flex items-center justify-center gap-2 p-10 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Carregando sua árvore…
        </div>
      ) : !layout.root ? (
        <div className="card-elevated p-6 text-center text-sm text-muted-foreground">
          Não foi possível encontrar seu perfil na árvore de discipulado.
        </div>
      ) : (
        <>
          <p className="px-1 text-xs text-muted-foreground">
            {temLiderAcima ? "Você tem um líder acima na cadeia. " : "Você está no topo da sua cadeia de discipulado. "}
            {totalAbaixo > 0 ? `${totalAbaixo} pessoa${totalAbaixo === 1 ? "" : "s"} abaixo de você.` : "Você ainda não tem discípulos."}
          </p>

          <div className="flex items-center justify-center gap-4 rounded-xl border border-border bg-surface px-3 py-2 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
            <Legend color={C.primary} label="Você" />
            <Legend color={C.ancient} label="Liderança acima" />
            <Legend color={C.success} label="Discípulos" />
          </div>

          <div
            ref={containerRef}
            className="relative h-[62vh] w-full touch-none overflow-hidden rounded-2xl border-2"
            style={{ borderColor: C.border, backgroundColor: C.bg, boxShadow: `4px 4px 0 ${C.shadow}` }}
            onWheel={onWheel}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <div
              style={{
                transform: `translate(${view.tx}px, ${view.ty}px) scale(${view.scale})`,
                transformOrigin: "0 0",
                width: layout.width,
                height: layout.height,
              }}
            >
              <svg width={layout.width} height={layout.height} viewBox={`0 0 ${layout.width} ${layout.height}`}>
                <defs>
                  <pattern id="pixelGrid" width="16" height="16" patternUnits="userSpaceOnUse">
                    <rect width="16" height="16" fill={C.bg} />
                    <rect width="8" height="8" fill={C.bg2} />
                    <rect x="8" y="8" width="8" height="8" fill={C.bg2} />
                  </pattern>
                </defs>
                <rect x={0} y={0} width={layout.width} height={layout.height} fill="url(#pixelGrid)" />

                {nodes.map((node) => {
                  if (!node.parent_id) return null;
                  const p1 = layout.positions.get(node.id);
                  const p2 = layout.positions.get(node.parent_id);
                  if (!p1 || !p2) return null;
                  const midY = (p2.y + NODE_R + (p1.y - NODE_R)) / 2;
                  return (
                    <g key={`edge-${node.id}`}>
                      <path
                        d={`M ${p2.x} ${p2.y + NODE_R} L ${p2.x} ${midY} L ${p1.x} ${midY} L ${p1.x} ${p1.y - NODE_R}`}
                        stroke={C.border}
                        strokeWidth={3}
                        strokeDasharray="7 5"
                        strokeLinecap="square"
                        fill="none"
                      />
                      <rect x={p1.x - 2.5} y={midY - 2.5} width={5} height={5} fill={C.border} />
                    </g>
                  );
                })}

                {nodes.map((node) => {
                  const pos = layout.positions.get(node.id);
                  if (!pos) return null;
                  const clipId = `clip-${node.id}`;
                  const ring = ringColorFor(node.direction);
                  const isSelf = node.direction === "self";
                  const isUp = node.direction === "up";
                  const level = getLevel(node.xp ?? 0).level;
                  const badgeY = pos.y + NODE_R + 33;
                  return (
                    <g key={node.id}>
                      <rect
                        x={pos.x - NODE_R + 4}
                        y={pos.y - NODE_R + 4}
                        width={NODE_R * 2}
                        height={NODE_R * 2}
                        rx={8}
                        fill={C.shadow}
                        opacity={0.45}
                      />
                      {isSelf && (
                        <>
                          <rect
                            x={pos.x - NODE_R - 6}
                            y={pos.y - NODE_R - 6}
                            width={NODE_R * 2 + 12}
                            height={NODE_R * 2 + 12}
                            rx={10}
                            fill="none"
                            stroke={C.primaryGlow}
                            strokeWidth={2}
                            opacity={0.55}
                          />
                          <g fill={C.gold}>
                            <rect x={pos.x - 15} y={pos.y - NODE_R - 27} width={30} height={5} />
                            <rect x={pos.x - 15} y={pos.y - NODE_R - 32} width={5} height={10} />
                            <rect x={pos.x - 2.5} y={pos.y - NODE_R - 32} width={5} height={10} />
                            <rect x={pos.x + 10} y={pos.y - NODE_R - 32} width={5} height={10} />
                          </g>
                        </>
                      )}
                      {node.avatar_url ? (
                        <>
                          <clipPath id={clipId}>
                            <rect x={pos.x - NODE_R} y={pos.y - NODE_R} width={NODE_R * 2} height={NODE_R * 2} rx={8} />
                          </clipPath>
                          <image
                            href={node.avatar_url}
                            x={pos.x - NODE_R}
                            y={pos.y - NODE_R}
                            width={NODE_R * 2}
                            height={NODE_R * 2}
                            clipPath={`url(#${clipId})`}
                            preserveAspectRatio="xMidYMid slice"
                          />
                        </>
                      ) : (
                        <>
                          <rect x={pos.x - NODE_R} y={pos.y - NODE_R} width={NODE_R * 2} height={NODE_R * 2} rx={8} fill={ring} opacity={0.28} />
                          <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="central" fill={C.text} fontWeight={700} fontSize={18} fontFamily="ui-monospace, monospace">
                            {initials(node.display_name)}
                          </text>
                        </>
                      )}
                      <rect x={pos.x - NODE_R} y={pos.y - NODE_R} width={NODE_R * 2} height={NODE_R * 2} rx={8} fill="none" stroke={ring} strokeWidth={3} />
                      <rect
                        x={pos.x - NODE_R + 4}
                        y={pos.y - NODE_R + 4}
                        width={NODE_R * 2 - 8}
                        height={NODE_R * 2 - 8}
                        rx={5}
                        fill="none"
                        stroke={C.text}
                        strokeWidth={1}
                        opacity={0.18}
                      />

                      <text x={pos.x} y={pos.y + NODE_R + 16} textAnchor="middle" fontSize={NAME_FONT_SIZE} fontWeight={700} fill={C.text}>
                        {truncate(node.display_name, NAME_MAX_CHARS)}
                      </text>

                      <polygon points={ribbonPoints(pos.x, badgeY, 44, 17, 6).map((p) => p.join(",")).join(" ")} fill={ring} stroke={C.shadow} strokeOpacity={0.5} strokeWidth={1.5} />
                      <text
                        x={pos.x}
                        y={badgeY + 3.5}
                        textAnchor="middle"
                        fontSize={9.5}
                        fontWeight={700}
                        fontFamily="ui-monospace, monospace"
                        fill={isUp ? C.ancientFg : "#0e0d16"}
                      >
                        {`Nv ${level}`}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="absolute bottom-3 right-3 flex flex-col gap-1.5">
              <button onClick={() => zoomButton(1.25)} className="rounded-full bg-background/90 p-2 shadow-md border border-border" aria-label="Aumentar zoom">
                <PlusIcon className="h-4 w-4" />
              </button>
              <button onClick={() => zoomButton(0.8)} className="rounded-full bg-background/90 p-2 shadow-md border border-border" aria-label="Diminuir zoom">
                <Minus className="h-4 w-4" />
              </button>
              <button onClick={resetView} className="rounded-full bg-background/90 p-2 shadow-md border border-border" aria-label="Centralizar">
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>

          <p className="px-1 text-center text-[11px] text-muted-foreground">Arraste para mover · belisque ou use a roda do mouse para dar zoom</p>

          <button
            onClick={() => void exportPdf()}
            disabled={exporting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            {exporting ? "Gerando PDF…" : "Exportar como PDF"}
          </button>
        </>
      )}
    </div>
  );
}

// Cantos estilo "HUD" de jogo — pequenos brackets decorativos nos 4 cantos
// da página exportada, puramente estético.
function drawCornerBrackets(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const len = 22;
  const inset = 10;
  ctx.strokeStyle = C.primary;
  ctx.globalAlpha = 0.55;
  ctx.lineWidth = 3;
  ctx.lineCap = "square";
  const corners: [number, number, number, number][] = [
    [inset, inset, 1, 1],
    [w - inset, inset, -1, 1],
    [inset, h - inset, 1, -1],
    [w - inset, h - inset, -1, -1],
  ];
  corners.forEach(([x, y, dx, dy]) => {
    ctx.beginPath();
    ctx.moveTo(x, y + len * dy);
    ctx.lineTo(x, y);
    ctx.lineTo(x + len * dx, y);
    ctx.stroke();
  });
  ctx.globalAlpha = 1;
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}
