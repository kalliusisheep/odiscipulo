# PR description: feature/minhas-notas -> main

This PR implements the foundation for the "Minhas Notas" feature.

What I added on branch feature/minhas-notas:
- migrations/20260803_create_notes_highlights_note_ai_actions.sql (adds notes, highlights, note_ai_actions tables)
- backend/api/* routers: notes.js, highlights.js, note_ai_actions.js, scan.js
- backend/db helper (pg pool)
- frontend/hooks + components: selection hook, floating menu, SelectionIntegrator, NotesEditor skeleton
- docs: RFC, issues, implementation notes, PR description

Notes before merging / running:
- Run migrations in your dev DB. The migration enables pgcrypto (gen_random_uuid).
- Install backend deps (from backend/package.json) if you use the backend folder structure.
- Install frontend deps: @tiptap/react @tiptap/starter-kit @tiptap/extension-highlight
- The scan endpoint uses tesseract (tesseract.js) and mammoth; ensure environment and binaries if needed.

Checklist
- [ ] Run DB migrations in dev
- [ ] Wire auth middleware so req.user.id is available to backend routes
- [ ] Install dependencies and run server locally
- [ ] QA mobile selection behavior and image generator UI
