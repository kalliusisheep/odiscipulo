import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Download, Loader2, Minus, Plus as PlusIcon, RotateCcw } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/lider/arvore")({
  component: ArvorePage,
});

type TreeNode = {
  id: string;
  display_name: string;
  username: string | null;
  avatar_url: string | null;
  parent_id: string | null;
  direction: "up" | "self" | "down";
  depth: number;
};

// --- Layout (posiciona cada pessoa num "slot" de grade; depois convertemos
// para pixels). Mesma lógica é usada tanto pro desenho na tela (SVG) quanto
// pro desenho no canvas usado na exportação em PDF — uma única fonte de verdade. ---
const NODE_R = 34;
const COL_W = 104;
const ROW_H = 132;
const PAD = 76;

type Positions = Map<string, { x: number; y: number }>;

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
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
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
      const { data, error } = await supabase.rpc("get_my_discipleship_tree" as never);
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
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, layout.width * scaleFactor);
      canvas.height = Math.max(1, layout.height * scaleFactor);
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("sem canvas 2d");
      ctx.scale(scaleFactor, scaleFactor);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, layout.width, layout.height);

      ctx.strokeStyle = "#d8d0c2";
      ctx.lineWidth = 2;
      for (const node of nodes) {
        if (!node.parent_id) continue;
        const p1 = layout.positions.get(node.id);
        const p2 = layout.positions.get(node.parent_id);
        if (!p1 || !p2) continue;
        ctx.beginPath();
        ctx.moveTo(p2.x, p2.y + NODE_R);
        ctx.lineTo(p1.x, p1.y - NODE_R);
        ctx.stroke();
      }

      let anyImageFailed = false;
      for (const node of nodes) {
        const pos = layout.positions.get(node.id);
        if (!pos) continue;
        const img = node.avatar_url ? await loadImage(node.avatar_url) : null;
        if (node.avatar_url && !img) anyImageFailed = true;

        ctx.save();
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, NODE_R, 0, Math.PI * 2);
        ctx.closePath();
        if (img) {
          ctx.clip();
          ctx.drawImage(img, pos.x - NODE_R, pos.y - NODE_R, NODE_R * 2, NODE_R * 2);
        } else {
          ctx.fillStyle = node.direction === "self" ? "#8a6f45" : "#c2b393";
          ctx.fill();
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 22px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(initials(node.display_name), pos.x, pos.y);
        }
        ctx.restore();

        if (node.direction === "self") {
          ctx.lineWidth = 3;
          ctx.strokeStyle = "#8a6f45";
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, NODE_R + 3, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.fillStyle = "#2b2620";
        ctx.font = "600 13px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";
        ctx.fillText(truncate(node.display_name, 18), pos.x, pos.y + NODE_R + 18);
        if (node.username) {
          ctx.fillStyle = "#8a8272";
          ctx.font = "11px sans-serif";
          ctx.fillText(`@${node.username}`, pos.x, pos.y + NODE_R + 32);
        }
      }

      const dataUrl = canvas.toDataURL("image/png");
      const jspdfNs = await loadJsPdf();
      const JsPdfCtor = jspdfNs.jsPDF;
      const orientation = layout.width >= layout.height ? "l" : "p";
      const pdf = new JsPdfCtor({ orientation, unit: "pt", format: [layout.width, layout.height] });
      pdf.addImage(dataUrl, "PNG", 0, 0, layout.width, layout.height);
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

          <div
            ref={containerRef}
            className="relative h-[62vh] w-full touch-none overflow-hidden rounded-2xl border border-border bg-surface"
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
                {nodes.map((node) => {
                  if (!node.parent_id) return null;
                  const p1 = layout.positions.get(node.id);
                  const p2 = layout.positions.get(node.parent_id);
                  if (!p1 || !p2) return null;
                  return (
                    <line
                      key={`edge-${node.id}`}
                      x1={p2.x}
                      y1={p2.y + NODE_R}
                      x2={p1.x}
                      y2={p1.y - NODE_R}
                      stroke="hsl(var(--border))"
                      strokeWidth={2}
                    />
                  );
                })}

                {nodes.map((node) => {
                  const pos = layout.positions.get(node.id);
                  if (!pos) return null;
                  const clipId = `clip-${node.id}`;
                  return (
                    <g key={node.id}>
                      {node.direction === "self" && (
                        <circle cx={pos.x} cy={pos.y} r={NODE_R + 4} fill="none" stroke="hsl(var(--primary))" strokeWidth={3} />
                      )}
                      {node.avatar_url ? (
                        <>
                          <clipPath id={clipId}>
                            <circle cx={pos.x} cy={pos.y} r={NODE_R} />
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
                          <circle cx={pos.x} cy={pos.y} r={NODE_R} fill={node.direction === "self" ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.4)"} />
                          <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="central" fill="#fff" fontWeight="700" fontSize={22}>
                            {initials(node.display_name)}
                          </text>
                        </>
                      )}
                      <text x={pos.x} y={pos.y + NODE_R + 18} textAnchor="middle" fontSize={13} fontWeight={600} fill="currentColor">
                        {truncate(node.display_name, 18)}
                      </text>
                      {node.username && (
                        <text x={pos.x} y={pos.y + NODE_R + 32} textAnchor="middle" fontSize={11} fill="currentColor" opacity={0.6}>
                          @{node.username}
                        </text>
                      )}
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
