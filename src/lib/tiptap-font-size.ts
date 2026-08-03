// O Tiptap não tem uma extensão oficial de "tamanho de fonte" — é um mark
// simples de estender a partir do TextStyle. Necessário porque o Bloco 3
// da spec pede tamanho de fonte por trecho selecionado (pequeno/normal/
// grande/extra grande), independente do negrito/itálico/sublinhado.

import { Extension } from "@tiptap/core";
import "@tiptap/extension-text-style";

export type FontSizeToken = "sm" | "normal" | "lg" | "xl";

export const FONT_SIZE_PX: Record<FontSizeToken, string> = {
  sm: "14px",
  normal: "16px",
  lg: "20px",
  xl: "26px",
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (size: FontSizeToken) => ReturnType;
      unsetFontSize: () => ReturnType;
    };
  }
}

export const FontSize = Extension.create({
  name: "fontSize",

  addOptions() {
    return { types: ["textStyle"] };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize || null,
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}` };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize:
        (size: FontSizeToken) =>
        ({ chain }) =>
          chain().setMark("textStyle", { fontSize: FONT_SIZE_PX[size] }).run(),
      unsetFontSize:
        () =>
        ({ chain }) =>
          chain().setMark("textStyle", { fontSize: null }).removeEmptyTextStyle().run(),
    };
  },
});
