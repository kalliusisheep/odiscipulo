// Ícones, gradientes e cores por ordem de módulo — usados na Home e na tela de módulo.
import {
  BookOpen,
  Church,
  Compass,
  Crown,
  Flame,
  Globe,
  HandHeart,
  Home as HomeIcon,
  Megaphone,
  ScrollText,
  Sprout,
} from "lucide-react";

export const MODULE_ORDER_TO_ICON: Record<number, React.ComponentType<{ className?: string }>> = {
  1: Sprout,
  2: BookOpen,
  3: ScrollText,
  4: HandHeart,
  5: Flame,
  6: Megaphone,
  7: Church,
  8: Compass,
  9: HomeIcon,
  10: Crown,
  11: Globe,
};

export const MODULE_ORDER_TO_GRADIENT: Record<number, string> = {
  1: "from-emerald-950 via-teal-900 to-emerald-950",
  2: "from-slate-900 via-indigo-950 to-slate-900",
  3: "from-stone-950 via-amber-950 to-stone-900",
  4: "from-slate-900 via-blue-950 to-slate-900",
  5: "from-red-950 via-rose-950 to-slate-900",
  6: "from-emerald-950 via-green-950 to-slate-900",
  7: "from-slate-900 via-purple-950 to-slate-900",
  8: "from-cyan-950 via-slate-900 to-slate-900",
  9: "from-rose-950 via-pink-950 to-slate-900",
  10: "from-amber-950 via-orange-950 to-slate-900",
  11: "from-violet-950 via-indigo-950 to-slate-900",
};

export const MODULE_ORDER_TO_RGB: Record<number, string> = {
  1: "16 185 129",
  2: "99 102 241",
  3: "245 158 11",
  4: "59 130 246",
  5: "244 63 94",
  6: "34 197 94",
  7: "168 85 247",
  8: "6 182 212",
  9: "236 72 153",
  10: "249 115 22",
  11: "139 92 246",
};

export const DEFAULT_MODULE_GRADIENT = "from-slate-900 via-slate-800 to-slate-900";
export const DEFAULT_MODULE_RGB = "99 102 241";
