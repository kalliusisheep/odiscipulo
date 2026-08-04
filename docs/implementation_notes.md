# Notas de implementação — refinamentos aplicados

Adicionei os seguintes artefatos na branch feature/minhas-notas:

- backend/lib/highlight_realign.js
  - Serviço utilitário para tentar realinhar um trecho destacado (highlighted_text)
    ao texto atual do campo. Estratégia: busca exata, tentativa por fragmentos de
    palavras e fallback simples por primeira/última palavra.

- backend/worker/scan_worker.js
  - Worker esqueleto que representa o processamento do Scan Inteligente.
    Pontos de integração: PDF->imagens, OCR por página (tesseract.js), armazenamento
    dos resultados. Atualmente é um stub que simula trabalho; pronto para trocar
    por uma implementação com fila e bibliotecas reais (sharp, pdf-lib, tesseract.js).

- tests/backend/highlight_realign.test.js
  - Testes unitários básicos para o algoritmo de realinhamento.

Próximos passos recomendados
- Integrar highlight_realign no endpoint de highlights: ao salvar um highlight,
  se os offsets fornecidos não encontrarem o trecho, rodar realignOffsets com o
  texto do campo atual e persistir os offsets encontrados.
- Substituir scan_worker stub por uma pipeline real que:
  1) converte PDF para imagens (one-per-page)
  2) executa OCR por página (tesseract.js ou serviço gerenciado)
  3) salva resultados e marca o job como concluído
  4) processa em background (fila / tabela + runner)
- Expandir testes de integração (supertest) para endpoints de highlights e scan.

Se quiser que eu continue agora eu integro o realign no endpoint backend/api/highlights.js
(empurro o commit) e também transformo o scan_worker em uma implementação funcional
usando tesseract.js e pdf-lib/sharp (posso fazer em etapas para evitar mudanças muito grandes
num único commit).
