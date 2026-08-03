# RFC: Minhas Notas (Feature)

Resumo
------
Implementação do sistema "Minhas Notas", com seleção de texto nos conteúdos, marcações permanentes (highlights), criação de imagens a partir de trechos selecionados, e um gerenciador de notas com editor rich-text e integração com IA para geração de títulos, reescrita e estruturação. Também inclui um fluxo de "Scan Inteligente" (PDF/DOCX/Imagens → OCR → IA).

Branch: feature/minhas-notas

Prioridade de implementação (sprint backlog sugerido)
----------------------------------------------------
1. Página Minhas Notas (CRUD básico, sem IA) + link no Perfil
2. Marcação de texto persistente (highlights) dentro dos conteúdos
3. Integração da seleção de texto com salvar nota / criar imagem
4. IA dentro da nota (título automático, reescrever, organizar)
5. Scan Inteligente (OCR, parsing PDF/DOCX, câmera/galeria)

Modelos de dados (Postgres / Supabase)
-------------------------------------
Veja o arquivo de migration: migrations/20260803_create_notes_highlights_note_ai_actions.sql

API (exemplos)
---------------
- GET /api/notes
  - Query params: ?q=&page=&page_size=
  - Retorna lista paginada das notas do usuário.

- GET /api/notes/:id
  - Retorna a nota com conteúdo (JSON do editor) e metadados.

- POST /api/notes
  - Payload: { title, content (json), source_type, source_content_id, source_content_title }
  - Cria nota para o usuário autenticado.

- PUT /api/notes/:id
  - Atualiza título e conteúdo.

- DELETE /api/notes/:id
  - Remove nota (soft-delete se desejado).

- POST /api/notes/:id/ai-action
  - Payload: { action_type: 'reescrever'|'estruturar'|'titulo', options }
  - Dispara a IA, salva history em note_ai_actions e retorna sugestão.

- GET /api/highlights?content_id=&content_type=
  - Retorna as marcações do usuário para esse conteúdo.

- POST /api/highlights
  - Payload: { content_id, content_type, start_offset, end_offset, highlighted_text, color }

- DELETE /api/highlights/:id
  - Remove highlight.

Frontend: componentes e fluxo
-----------------------------
- Seleção de texto (em componentes de conteúdo: trilha/estudo/plano)
  - Hook: useSelectionFloatingMenu
  - Detectar window.getSelection() e calcular posição do rect
  - Exibir menu flutuante com ações: Salvar em Minhas Notas, Criar Imagem, Marcar
  - Fechar ao clicar fora, rolar, ou completar ação

- Marcação (highlights)
  - Ao marcar, chamar POST /api/highlights e aplicar destaque via spans com data-attributes
  - Ao carregar o conteúdo, buscar highlights e aplicar com reconciliação de offsets
  - Salvar também trecho original (highlighted_text) para realinhamento quando o conteúdo muda

- Minhas Notas (lista)
  - Página: /minhas-notas
  - Componente: NotesList, NoteItem
  - Editor de nota: NotesEditor (Tiptap recomendado)
  - Armazenar content em JSON (Tiptap) no campo notes.content

- Scan Inteligente
  - Componente: SmartScanModal
  - Backend: endpoints para receber upload, processar com OCR (tesseract/serviço de visão)
  - Oferecer opções transcrever / reescrever / estruturar via IA

Integrações e bibliotecas sugeridas
-----------------------------------
- Rich text editor: Tiptap (React) — salva em JSONB facilmente
- OCR: Tesseract (self-host) ou API de visão (ex: AWS Textract, Google Vision, or OpenAI Vision if available)
- .docx parsing: mammoth.js (frontend) ou python-docx / docx2txt (backend)
- Image generation: reaproveitar código existente do "compartilhar" para gerar imagens
- UUID: gen_random_uuid() (Postgres extension pgcrypto) ou uuid-ossp

Considerações de UX
-------------------
- Menu de seleção flutuante deve comportar-se bem em touch — usar timers e toques longos quando necessário
- Ao salvar nota via seleção, sugerir título gerado pela IA e permitir edição inline
- Ao marcar, animação sutil e opção de mudar cor ao aplicar

Backlog de testes
------------------
- Testes unitários para endpoints notes/highlights
- Tests E2E para fluxo: selecionar texto → marcar → recarregar conteúdo → verificar highlight persistente

Checklist antes do PR
---------------------
- [ ] Migrations adicionadas e testadas no ambiente de dev
- [ ] Endpoints básicos implementados com autenticação
- [ ] Componentes de UI com testes visuais/manual QA
- [ ] PR aberto para revisão

