import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Download, Loader2, Minus, Plus as PlusIcon, RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getLevel } from "@/data/levels";
import { jsPDF } from "jspdf";

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
const NODE_R = 42;
const NODE_CARD_W = 176;
const NODE_CARD_H = 84;
const NODE_RADIUS = 18;
const COL_W = 216;
const ROW_H = 156;
const PAD = 112;
const HEADER_H = 104; // espaço reservado só no PDF pra faixa de título + legenda
const FOOTER_H = 70; // espaço reservado só no PDF pra separador, copyright pequeno e mascote pequena no canto
const MIN_CANVAS_W = 480; // largura mínima da página exportada, pra cabeçalho/rodapé nunca ficarem espremidos em árvores pequenas
const NAME_MAX_CHARS = 12;
const NAME_FONT_SIZE = 9.5;

type Positions = Map<string, { x: number; y: number }>;

// Paleta "gamificada" — copiada 1:1 das variáveis de cor do app (tema escuro),
// pra o canvas do PDF (que não enxerga CSS var) bater exatamente com a tela.
const C = {
  bg: "#0c0f16",
  bg2: "#121827",
  surface: "#171d2b",
  border: "#2b3548",
  primary: "#9a7bff",
  primaryGlow: "#b39aff",
  ancient: "#d6b574",
  ancientFg: "#2d2411",
  success: "#4dc8a6",
  text: "#f7f8fc",
  mutedText: "#9ba7bb",
  shadow: "#060810",
  gold: "#e6c36d",
};

function ringColorFor(direction: TreeNode["direction"]) {
  return direction === "self" ? C.primary : direction === "up" ? C.ancient : C.success;
}

function connectorPath(parent: { x: number; y: number }, child: { x: number; y: number }) {
  const startY = parent.y + NODE_CARD_H / 2;
  const endY = child.y - NODE_CARD_H / 2;
  const middleY = startY + (endY - startY) / 2;
  return `M ${parent.x} ${startY} V ${middleY} H ${child.x} V ${endY}`;
}
// No máximo 4 discípulos por linha; a partir do 5º, eles descem para uma nova
// linha abaixo dos 4 primeiros, evitando que a árvore cresça infinitamente
// para os lados.
const MAX_CHILDREN_PER_ROW = 4;

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

  const gridPos = new Map<string, { gx: number; gy: number }>();

  function place(node: TreeNode, gxStart: number, gyStart: number): { width: number; height: number } {
    const kids = (childrenOf.get(node.id) ?? []).sort((a, b) => a.display_name.localeCompare(b.display_name));
    if (kids.length === 0) {
      gridPos.set(node.id, { gx: gxStart, gy: gyStart });
      return { width: 1, height: 1 };
    }

    let maxWidth = 0;
    let cursorY = gyStart + 1;
    for (let i = 0; i < kids.length; i += MAX_CHILDREN_PER_ROW) {
      const row = kids.slice(i, i + MAX_CHILDREN_PER_ROW);
      let cursorX = gxStart;
      let rowHeight = 1;
      for (const kid of row) {
        const res = place(kid, cursorX, cursorY);
        cursorX += res.width;
        rowHeight = Math.max(rowHeight, res.height);
      }
      maxWidth = Math.max(maxWidth, cursorX - gxStart);
      cursorY += rowHeight;
    }

    gridPos.set(node.id, { gx: gxStart + (maxWidth - 1) / 2, gy: gyStart });
    return { width: maxWidth, height: cursorY - gyStart };
  }
  place(root, 0, 0);

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


function computePortraitLayout(nodes: TreeNode[]): { positions: Positions; width: number; height: number; root: TreeNode | null } {
  const root = nodes.find((node) => node.direction === "self") ?? null;
  const positions: Positions = new Map();
  if (!root) return { positions, width: 0, height: 0, root };

  const columnGap = 32;
  const rowGap = 42;
  const width = Math.max(MIN_CANVAS_W, NODE_CARD_W * 2 + columnGap + PAD * 2);
  const centerX = width / 2;
  const rowStep = NODE_CARD_H + rowGap;
  const ancestors = nodes
    .filter((node) => node.direction === "up")
    .sort((a, b) => a.depth - b.depth);
  const rootY = PAD + ancestors.length * rowStep;

  ancestors.forEach((node, index) => {
    positions.set(node.id, { x: centerX, y: PAD + index * rowStep });
  });
  positions.set(root.id, { x: centerX, y: rootY });

  const descendants = nodes
    .filter((node) => node.direction === "down" && node.id !== root.id)
    .sort((a, b) => a.depth - b.depth || a.display_name.localeCompare(b.display_name));

  const firstChildY = rootY + NODE_CARD_H + rowGap + NODE_CARD_H / 2;
  descendants.forEach((node, index) => {
    const column = index % 2;
    const row = Math.floor(index / 2);
    const x = PAD + NODE_CARD_W / 2 + column * (NODE_CARD_W + columnGap);
    positions.set(node.id, { x, y: firstChildY + row * rowStep });
  });

  const maxY = Math.max(
    rootY + NODE_CARD_H / 2,
    ...[...positions.values()].map((position) => position.y + NODE_CARD_H / 2),
  );

  return {
    positions,
    width,
    height: maxY + PAD,
    root,
  };
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

// jsPDF é importado pelo bundle da rota e funciona mesmo sem conexão externa.
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
const MIN_SCALE = 0.25;
const MAX_SCALE = 3;
const clampScale = (s: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s));

type ViewState = {
  scale: number;
  tx: number;
  ty: number;
};

const DEFAULT_VIEW: ViewState = {
  scale: 1,
  tx: PAD,
  ty: PAD,
};

function ArvorePage() {
  const [nodes, setNodes] = useState<TreeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [view, setView] = useState<ViewState>(DEFAULT_VIEW);

  const containerRef = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const dragRef = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);
  const pinchRef = useRef<{ dist: number; scale: number } | null>(null);
  const currentView = view ?? DEFAULT_VIEW;

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const [{ data: authData }, { data, error }] = await Promise.all([
        supabase.auth.getUser(),
        supabase.rpc("get_my_discipleship_tree"),
      ]);

      if (cancelled) return;

      const user = authData.user;
      const rawNodes = Array.isArray(data) ? (data as Partial<TreeNode>[]) : [];
      let nextNodes: TreeNode[] = rawNodes
        .filter((node): node is Partial<TreeNode> & { id: string } => Boolean(node && typeof node.id === "string"))
        .map((node) => ({
          id: node.id,
          display_name: typeof node.display_name === "string" && node.display_name.trim() ? node.display_name : "Sem nome",
          username: typeof node.username === "string" ? node.username : null,
          avatar_url: typeof node.avatar_url === "string" ? node.avatar_url : null,
          xp: typeof node.xp === "number" ? node.xp : Number(node.xp ?? 0),
          parent_id: typeof node.parent_id === "string" ? node.parent_id : null,
          direction:
            node.id === user?.id || node.direction === "self"
              ? "self"
              : node.direction === "up"
                ? "up"
                : "down",
          depth: Number.isFinite(Number(node.depth)) ? Number(node.depth) : 0,
        }));

      if (user && !nextNodes.some((node) => node.direction === "self")) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id, display_name, username, avatar_url, xp")
          .eq("id", user.id)
          .maybeSingle();

        const metadata = user.user_metadata ?? {};
        const fallbackName =
          profile?.display_name ||
          (typeof metadata.display_name === "string" && metadata.display_name) ||
          (typeof metadata.full_name === "string" && metadata.full_name) ||
          (typeof metadata.name === "string" && metadata.name) ||
          (typeof metadata.username === "string" && metadata.username) ||
          user.email?.split("@")[0] ||
          "Você";

        nextNodes = [
          {
            id: user.id,
            display_name: fallbackName,
            username: profile?.username ?? (typeof metadata.username === "string" ? metadata.username : null),
            avatar_url: profile?.avatar_url ?? (typeof metadata.avatar_url === "string" ? metadata.avatar_url : null),
            xp: profile?.xp ?? 0,
            parent_id: null,
            direction: "self",
            depth: 0,
          },
          ...nextNodes,
        ];
      }

      if (error && !user) {
        toast.error("Não foi possível carregar sua árvore de discipulado.");
      } else if (error) {
        console.warn("Árvore de discipulado carregada com fallback:", error);
      }

      setNodes(nextNodes);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const layout = useMemo(() => computeLayout(nodes), [nodes]);

  // Centraliza a árvore (foco no card "Você") assim que ela é carregada e
  // sempre que o usuário toca em "centralizar".
  function computeCenteredView(scale = 1): ViewState {
    const rect = containerRef.current?.getBoundingClientRect();
    const rootPos = layout.root ? layout.positions.get(layout.root.id) : null;
    if (!rect || !rootPos) return { scale, tx: 24, ty: 24 };
    const tx = rect.width / 2 - rootPos.x * scale;
    const contentH = layout.height * scale;
    const ty =
      contentH <= rect.height
        ? (rect.height - contentH) / 2
        : Math.min(24, rect.height * 0.32 - rootPos.y * scale);
    return { scale, tx, ty };
  }

  useEffect(() => {
    if (!layout.width || !layout.height) return;
    const id = requestAnimationFrame(() => setView(computeCenteredView(1)));
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout.width, layout.height, layout.root?.id]);


  function zoomAt(cx: number, cy: number, newScaleRaw: number) {
    setView((v) => {
      const current = v ?? DEFAULT_VIEW;
      const newScale = clampScale(newScaleRaw);
      const k = newScale / current.scale;
      return { scale: newScale, tx: cx - k * (cx - current.tx), ty: cy - k * (cy - current.ty) };
    });
  }

  function onWheel(e: React.WheelEvent) {
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    zoomAt(e.clientX - rect.left, e.clientY - rect.top, currentView.scale * (1 - e.deltaY * 0.0015));
  }

  function onPointerDown(e: React.PointerEvent) {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) {
      dragRef.current = { x: e.clientX, y: e.clientY, tx: currentView.tx, ty: currentView.ty };
      pinchRef.current = null;
    } else if (pointers.current.size === 2) {
      const pts = [...pointers.current.values()];
      pinchRef.current = { dist: Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y), scale: currentView.scale };
      dragRef.current = null;
    }
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2 && pinchRef.current) {
      const pinch = pinchRef.current;
      const pts = [...pointers.current.values()];
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      if (!pinch.dist) return;
      setView((v) => ({ ...(v ?? DEFAULT_VIEW), scale: clampScale(pinch.scale * (dist / pinch.dist)) }));
    } else if (pointers.current.size === 1 && dragRef.current) {
      const drag = dragRef.current;
      const dx = e.clientX - drag.x;
      const dy = e.clientY - drag.y;
      setView((v) => ({ ...(v ?? DEFAULT_VIEW), tx: drag.tx + dx, ty: drag.ty + dy }));
    }
  }

  function onPointerUp(e: React.PointerEvent) {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size === 1) {
      const [[, p]] = [...pointers.current.entries()];
      dragRef.current = { x: p.x, y: p.y, tx: currentView.tx, ty: currentView.ty };
    } else {
      dragRef.current = null;
      pinchRef.current = null;
    }
  }

  function zoomButton(factor: number) {
    const rect = containerRef.current?.getBoundingClientRect();
    const cx = rect ? rect.width / 2 : 0;
    const cy = rect ? rect.height / 2 : 0;
    zoomAt(cx, cy, currentView.scale * factor);
  }

  function resetView() {
    setView(computeCenteredView(1));
  }


  async function exportPdf() {
    const layout = computePortraitLayout(nodes);
    if (!layout.root) return;
    setExporting(true);
    try {
      const scaleFactor = 2;
      const canvasW = Math.max(layout.width, MIN_CANVAS_W);
      const treeOffsetX = (canvasW - layout.width) / 2;
      const totalHeight = HEADER_H + layout.height + FOOTER_H;
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, canvasW * scaleFactor);
      canvas.height = Math.max(1, totalHeight * scaleFactor);
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("sem canvas 2d");
      ctx.scale(scaleFactor, scaleFactor);

      // fundo "pixelado" (xadrez sutil) cobrindo a página inteira
      const background = ctx.createLinearGradient(0, 0, canvasW, totalHeight);
      background.addColorStop(0, C.bg);
      background.addColorStop(1, C.bg2);
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, canvasW, totalHeight);

      // ---------- CABEÇALHO (3 linhas centralizadas — nunca colidem, a
      // largura de cada elemento é medida antes de posicionar) ----------
      ctx.fillStyle = C.surface;
      ctx.fillRect(0, 0, canvasW, HEADER_H);

      const headerMascot = await loadImage("/sheep-mascot.png");
      const hmSize = 22;
      ctx.font = "800 12px ui-monospace, Menlo, monospace";
      const wBrand = ctx.measureText("iSheep").width;
      ctx.font = "600 9.5px system-ui, sans-serif";
      const wSub = ctx.measureText(" · Painel do Líder").width;
      const rowAWidth = hmSize + 6 + wBrand + wSub;
      const rowAStart = canvasW / 2 - rowAWidth / 2;
      if (headerMascot) ctx.drawImage(headerMascot, rowAStart, 12, hmSize, hmSize);
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = C.primaryGlow;
      ctx.font = "800 12px ui-monospace, Menlo, monospace";
      ctx.fillText("iSheep", rowAStart + hmSize + 6, 27);
      ctx.fillStyle = C.mutedText;
      ctx.font = "600 9.5px system-ui, sans-serif";
      ctx.fillText(" · Painel do Líder", rowAStart + hmSize + 6 + wBrand, 27);

      ctx.textAlign = "center";
      ctx.fillStyle = C.text;
      ctx.font = "800 17px ui-monospace, Menlo, monospace";
      const titleY = 54;
      ctx.fillText("Árvore de Discipulado", canvasW / 2, titleY);
      const titleWidth = ctx.measureText("Árvore de Discipulado").width;
      ctx.fillStyle = C.primary;
      ctx.fillRect(canvasW / 2 - titleWidth / 2, titleY + 8, titleWidth, 3);

      // legenda: linha centralizada, cada item medido antes de posicionar
      const legendItems: [string, string][] = [
        [C.primary, "Você"],
        [C.ancient, "Liderança acima"],
        [C.success, "Discípulos"],
      ];
      ctx.font = "700 9px ui-monospace, Menlo, monospace";
      const legendGap = 16;
      const chipWidths = legendItems.map(([, label]) => 9 + 5 + ctx.measureText(label).width);
      const legendTotalWidth = chipWidths.reduce((a, b) => a + b, 0) + legendGap * (legendItems.length - 1);
      let legendX = canvasW / 2 - legendTotalWidth / 2;
      const legendY = 82;
      ctx.textAlign = "left";
      legendItems.forEach(([color, label], i) => {
        ctx.fillStyle = color;
        pixelRoundRect(ctx, legendX, legendY - 8, 9, 9, 2);
        ctx.fill();
        ctx.fillStyle = C.mutedText;
        ctx.fillText(label, legendX + 14, legendY);
        legendX += chipWidths[i] + legendGap;
      });

      ctx.strokeStyle = C.border;
      ctx.setLineDash([6, 4]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, HEADER_H);
      ctx.lineTo(canvasW, HEADER_H);
      ctx.stroke();
      ctx.setLineDash([]);

      // cantos estilo "HUD" de jogo (frame decorativo)

      // ---------- ÁRVORE (centralizada horizontalmente na página) ----------
      ctx.save();
      ctx.translate(treeOffsetX, HEADER_H);

      // conexões em estilo "árvore de habilidades" (linha em ângulo reto, tracejada)
      ctx.strokeStyle = C.border;
      ctx.lineWidth = 3;
      ctx.setLineDash([]);
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
        ctx.setLineDash([]);
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
        const cardX = pos.x - NODE_CARD_W / 2;
        const cardY = pos.y - NODE_CARD_H / 2;
        const avatarX = cardX + 28;
        const handle = node.username
          ? "@" + truncate(node.username, 17)
          : node.direction === "self"
            ? "Seu perfil"
            : node.direction === "up"
              ? "Liderança"
              : "Discípulo";

        ctx.save();
        ctx.shadowColor = C.shadow;
        ctx.shadowBlur = 18;
        ctx.shadowOffsetY = 8;
        ctx.fillStyle = C.surface;
        pixelRoundRect(ctx, cardX, cardY, NODE_CARD_W, NODE_CARD_H, NODE_RADIUS);
        ctx.fill();
        ctx.restore();

        ctx.strokeStyle = ring;
        ctx.lineWidth = node.direction === "self" ? 2.5 : 1.5;
        pixelRoundRect(ctx, cardX, cardY, NODE_CARD_W, NODE_CARD_H, NODE_RADIUS);
        ctx.stroke();

        ctx.save();
        ctx.beginPath();
        ctx.arc(avatarX, pos.y, 21, 0, Math.PI * 2);
        ctx.clip();
        if (img) {
          ctx.drawImage(img, avatarX - 21, pos.y - 21, 42, 42);
        } else {
          ctx.fillStyle = ring;
          ctx.globalAlpha = 0.22;
          ctx.fillRect(avatarX - 21, pos.y - 21, 42, 42);
          ctx.globalAlpha = 1;
          ctx.fillStyle = C.text;
          ctx.font = "700 17px system-ui, sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(initials(node.display_name), avatarX, pos.y);
        }
        ctx.restore();

        ctx.strokeStyle = ring;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(avatarX, pos.y, 21, 0, Math.PI * 2);
        ctx.stroke();

        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = C.text;
        ctx.font = "700 11px system-ui, sans-serif";
        ctx.fillText(truncate(node.display_name, 17), cardX + 58, pos.y - 8);
        ctx.fillStyle = C.mutedText;
        ctx.font = "500 8.5px system-ui, sans-serif";
        ctx.fillText(handle, cardX + 58, pos.y + 8);

        ctx.fillStyle = ring;
        ctx.globalAlpha = 0.16;
        pixelRoundRect(ctx, cardX + 58, pos.y + 17, 44, 16, 8);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.fillStyle = ring === C.ancient ? C.ancient : C.primaryGlow;
        ctx.font = "700 8px ui-monospace, Menlo, monospace";
        ctx.fillText("NÍVEL " + level, cardX + 66, pos.y + 28);

        if (node.direction === "self") {
          ctx.fillStyle = C.primary;
          ctx.globalAlpha = 0.14;
          pixelRoundRect(ctx, cardX + NODE_CARD_W - 48, cardY + 10, 36, 16, 8);
          ctx.fill();
          ctx.globalAlpha = 1;
          ctx.fillStyle = C.primaryGlow;
          ctx.font = "700 8px ui-monospace, Menlo, monospace";
          ctx.textAlign = "center";
          ctx.fillText("VOCÊ", cardX + NODE_CARD_W - 30, cardY + 21);
        }
      }
      ctx.restore();

      // ---------- RODAPÉ (faixa baixa: texto pequeno à esquerda, mascote pequena no canto inferior direito) ----------
      const footerTop = HEADER_H + layout.height;
      ctx.strokeStyle = C.border;
      ctx.setLineDash([6, 4]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(PAD / 2, footerTop + 14);
      ctx.lineTo(canvasW - PAD / 2, footerTop + 14);
      ctx.stroke();
      ctx.setLineDash([]);

      const mascot = await loadImage("/sheep-mascot.png");
      const mascotSize = 36;
      const mascotX = canvasW - PAD / 2 - mascotSize;
      const mascotY = footerTop + FOOTER_H - mascotSize - 14;
      if (mascot) {
        ctx.drawImage(mascot, mascotX, mascotY, mascotSize, mascotSize);
      }

      ctx.fillStyle = C.mutedText;
      ctx.font = "600 12px system-ui, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("© 2026 iSheep. All Rights Reserved.", PAD / 2, footerTop + FOOTER_H - 14 - mascotSize / 2 + 4);

      // ---------- monta o PDF final em página A4 padrão, encaixando (nunca
      // ampliando) a arte pra caber com margem — assim o arquivo sempre
      // imprime certo, do jeito que a árvore tiver: pequena ou grande. ----------
      const dataUrl = canvas.toDataURL("image/png");
      const orientation = "p";
      const pdf = new jsPDF({ orientation, unit: "pt", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = 24;
      const scale = Math.min(1, (pageW - margin * 2) / canvasW, (pageH - margin * 2) / totalHeight);
      const drawW = canvasW * scale;
      const drawH = totalHeight * scale;
      const offsetX = (pageW - drawW) / 2;
      const offsetY = (pageH - drawH) / 2;
      pdf.setFillColor(28, 26, 38);
      pdf.rect(0, 0, pageW, pageH, "F");
      pdf.addImage(dataUrl, "PNG", offsetX, offsetY, drawW, drawH);
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
    <div className="mx-auto max-w-xl space-y-5 px-4 pb-24 pt-6">
      <header className="rounded-2xl border border-border/70 bg-card/45 px-4 py-4 shadow-[0_16px_48px_rgba(0,0,0,.14)]">
        <div className="flex items-center gap-2">
          <Link to="/lider" className="rounded-full p-2 hover:bg-surface">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <p className="text-xs text-muted-foreground">Painel do Líder</p>
            <h1 className="text-xl font-semibold">Árvore de Discipulado</h1>
          </div>
        </div>
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
            className="relative h-[62vh] w-full touch-none overflow-hidden rounded-[28px] border border-border/80 bg-background shadow-[0_24px_70px_rgba(0,0,0,.24)]"
            style={{ backgroundColor: C.bg }}
            onWheel={onWheel}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <div
              style={{
                transform: `translate(${currentView.tx}px, ${currentView.ty}px) scale(${currentView.scale})`,
                transformOrigin: "0 0",
                width: layout.width,
                height: layout.height,
              }}
            >
              <svg width={layout.width} height={layout.height} viewBox={`0 0 ${layout.width} ${layout.height}`}>
                <rect x={0} y={0} width={layout.width} height={layout.height} fill={C.bg} />

                {nodes.map((node) => {
                  if (!node.parent_id) return null;
                  const parent = layout.positions.get(node.parent_id);
                  const child = layout.positions.get(node.id);
                  if (!parent || !child) return null;
                  return (
                    <path
                      key={`edge-${node.id}`}
                      d={connectorPath(parent, child)}
                      fill="none"
                      stroke={node.direction === "up" ? C.ancient : C.success}
                      strokeOpacity={0.78}
                      strokeWidth={3}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  );
                })}

                {nodes.map((node) => {
                  const pos = layout.positions.get(node.id);
                  if (!pos) return null;
                  const clipId = "clip-" + node.id;
                  const ring = ringColorFor(node.direction);
                  const isSelf = node.direction === "self";
                  const isUp = node.direction === "up";
                  const level = getLevel(node.xp ?? 0).level;
                  const cardX = pos.x - NODE_CARD_W / 2;
                  const cardY = pos.y - NODE_CARD_H / 2;
                  const avatarX = cardX + 28;
                  const handle = node.username
                    ? "@" + truncate(node.username, 17)
                    : node.direction === "self"
                      ? "Seu perfil"
                      : node.direction === "up"
                        ? "Liderança"
                        : "Discípulo";
                  return (
                    <g key={node.id}>
                      <rect
                        x={cardX + 4}
                        y={cardY + 7}
                        width={NODE_CARD_W}
                        height={NODE_CARD_H}
                        rx={NODE_RADIUS}
                        fill={C.shadow}
                        opacity={0.7}
                      />
                      <rect
                        x={cardX}
                        y={cardY}
                        width={NODE_CARD_W}
                        height={NODE_CARD_H}
                        rx={NODE_RADIUS}
                        fill={C.surface}
                        stroke={ring}
                        strokeWidth={isSelf ? 2.5 : 1.5}
                      />
                      <circle cx={avatarX} cy={pos.y} r={21} fill={ring} opacity={0.2} />
                      <text
                        x={avatarX}
                        y={pos.y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill={C.text}
                        fontWeight={700}
                        fontSize={16}
                      >
                        {initials(node.display_name)}
                      </text>
                      {node.avatar_url && (
                        <>
                          <clipPath id={clipId}>
                            <circle cx={avatarX} cy={pos.y} r={21} />
                          </clipPath>
                          <image
                            href={node.avatar_url}
                            x={avatarX - 21}
                            y={pos.y - 21}
                            width={42}
                            height={42}
                            clipPath={"url(#" + clipId + ")"}
                            preserveAspectRatio="xMidYMid slice"
                          />
                        </>
                      )}
                      <circle cx={avatarX} cy={pos.y} r={21} fill="none" stroke={ring} strokeWidth={2} />
                      <text x={cardX + 58} y={pos.y - 8} fontSize={11} fontWeight={700} fill={C.text}>
                        {truncate(node.display_name, 17)}
                      </text>
                      <text x={cardX + 58} y={pos.y + 8} fontSize={8.5} fontWeight={500} fill={C.mutedText}>
                        {handle}
                      </text>
                      <rect x={cardX + 58} y={pos.y + 17} width={44} height={16} rx={8} fill={ring} opacity={0.16} />
                      <text x={cardX + 66} y={pos.y + 28} fontSize={8} fontWeight={700} fontFamily="ui-monospace, monospace" fill={isUp ? C.ancient : C.primaryGlow}>
                        {"NÍVEL " + level}
                      </text>
                      {isSelf && (
                        <>
                          <rect x={cardX + NODE_CARD_W - 48} y={cardY + 10} width={36} height={16} rx={8} fill={C.primary} opacity={0.14} />
                          <text x={cardX + NODE_CARD_W - 30} y={cardY + 21} textAnchor="middle" fontSize={8} fontWeight={700} fontFamily="ui-monospace, monospace" fill={C.primaryGlow}>
                            VOCÊ
                          </text>
                        </>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="absolute bottom-3 right-3 flex flex-col gap-1.5">
              <button onClick={() => zoomButton(1.25)} className="h-10 w-10 rounded-2xl border border-border/80 bg-card/90 p-2.5 shadow-lg backdrop-blur-sm transition hover:border-primary/60 hover:bg-card" aria-label="Aumentar zoom">
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
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_12px_28px_rgba(154,123,255,.22)] transition hover:brightness-105 disabled:opacity-60"
          >
            {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            {exporting ? "Gerando PDF…" : "Exportar como PDF"}
          </button>
        </>
      )}
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}
