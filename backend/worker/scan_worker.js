// backend/worker/scan_worker.js
// Worker esqueleto para processar uploads / documentos e executar OCR por página.
// Implementação MVP: expõe processScan(filePath) que enfileira a tarefa e
// processa de forma síncrona usando tesseract.js (ou outro backend configurado).

const path = require('path');
// tesseract pode ser pesado; mantemos aqui apenas um stub para facilitar testes
// e para documentar o ponto de integração.

async function processScan(filePath) {
  // Ex.: converter PDF para imagens página a página, rodar OCR em cada imagem
  // e armazenar resultados em tabela note_ai_actions/scan_results.
  // Este arquivo é um ponto de partida; troque a implementação por uma fila
  // real (Bull / Bee-Queue / tabela + runner) para produção.
  console.log('[scan_worker] processScan start', filePath);
  // TODO: pdf -> imagens (sharp / pdf-lib / pdf-poppler)
  // TODO: tesseract.js.recognize on each image
  await new Promise((r) => setTimeout(r, 200)); // simula trabalho
  console.log('[scan_worker] processScan done', filePath);
  return { ok: true, pages: 0 };
}

module.exports = { processScan };
