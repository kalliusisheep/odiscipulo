// backend/lib/highlight_realign.js
// Serviço simples para tentar realinhar um trecho destacado (highlighted_text)
// ao texto atual do campo (originalText). Estratégia:
// 1) Busca exata (indexOf).
// 2) Se falhar, remove quebras e espaços extras e busca por substring de
//    tamanho decrescente (fallback). Retorna null se não encontrar.

function normalize(s) {
  return s
    .replace(/\s+/g, " ")
    .replace(/[\u200B-\u200D\uFEFF]/g, "") // zero-width
    .trim();
}

function realignOffsets(originalText, highlightedText) {
  if (!originalText || !highlightedText) return null;
  const orig = normalize(originalText);
  const hi = normalize(highlightedText);

  // 1) busca exata
  let idx = orig.indexOf(hi);
  if (idx !== -1) {
    return { start: idx, end: idx + hi.length };
  }

  // 2) fallback: procurar por partes do highlightedText (palavras consecutivas)
  const words = hi.split(" ").filter(Boolean);
  // Tentar janelas longas primeiro (n palavras), decrescendo
  for (let window = Math.min(words.length, 8); window >= 2; window--) {
    for (let i = 0; i + window <= words.length; i++) {
      const fragment = words.slice(i, i + window).join(" ");
      idx = orig.indexOf(fragment);
      if (idx !== -1) {
        // expand to try capturar o contexto completo: buscar palavras antes/depois
        let start = idx;
        let end = idx + fragment.length;
        // tentar expandir para incluir palavras restantes aproximadas (simples)
        // buscamos até 30 chars antes e depois para pegar pontuação/acentos diferentes
        start = Math.max(0, start - 10);
        end = Math.min(orig.length, end + 10);
        return { start, end };
      }
    }
  }

  // 3) última tentativa: busca por primeira e última palavra
  const first = words[0];
  const last = words[words.length - 1];
  const firstIdx = orig.indexOf(first);
  const lastIdx = orig.indexOf(last);
  if (firstIdx !== -1 && lastIdx !== -1 && firstIdx <= lastIdx) {
    return { start: firstIdx, end: lastIdx + last.length };
  }

  return null; // não foi possível realinhar
}

module.exports = { realignOffsets };
