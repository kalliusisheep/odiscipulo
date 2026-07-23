import { Minus, Plus } from "lucide-react";
import { FONT_SCALES } from "@/hooks/use-reading-font-scale";

type Props = {
  scaleIndex: number;
  onIncrease: () => void;
  onDecrease: () => void;
};

export function FontSizeControls({ scaleIndex, onIncrease, onDecrease }: Props) {
  return (
    <div className="flex shrink-0 items-center gap-1 rounded-full border border-border bg-surface p-1">
      <button
        type="button"
        onClick={onDecrease}
        disabled={scaleIndex === 0}
        aria-label="Diminuir fonte"
        className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-background disabled:opacity-30"
      >
        <Minus className="h-3 w-3" />
      </button>
      <span className="px-0.5 text-[11px] font-bold text-muted-foreground">A</span>
      <button
        type="button"
        onClick={onIncrease}
        disabled={scaleIndex === FONT_SCALES.length - 1}
        aria-label="Aumentar fonte"
        className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-background disabled:opacity-30"
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>
  );
}
