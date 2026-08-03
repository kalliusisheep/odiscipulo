// backend/api/notes.js
// Simple Express-style route handlers (stubs) for Notes CRUD.
// TODO: Adapt to your backend (Next.js API routes / Fastify / NestJS) and wire auth middleware.

const express = require('express');
const router = express.Router();

// GET /api/notes
router.get('/', async (req, res) => {
  const userId = req.user && req.user.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  // TODO: fetch paginated notes from DB
  res.json({ notes: [], page: 1, page_size: 20 });
});

// GET /api/notes/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  // TODO: fetch note by id and verify ownership
  res.json({ id, title: 'Example', content: { type: 'doc', content: [] } });
});

// POST /api/notes
router.post('/', async (req, res) => {
  const userId = req.user && req.user.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const { title, content, source_type, source_content_id, source_content_title } = req.body;
  // TODO: insert into DB and return created note
  res.status(201).json({ id: 'uuid', title, content });
});

// PUT /api/notes/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  // TODO: update note, check ownership
  res.json({ id, updated: true });
});

// DELETE /api/notes/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  // TODO: delete note or soft-delete
  res.status(204).end();
});

module.exports = router;
