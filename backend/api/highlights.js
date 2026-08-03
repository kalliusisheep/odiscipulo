// backend/api/highlights.js
// Endpoints for highlights (marks) persistence. Adapt to your backend stack.

const express = require('express');
const router = express.Router();

// GET /api/highlights?content_id=&content_type=
router.get('/', async (req, res) => {
  const userId = req.user && req.user.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const { content_id, content_type } = req.query;
  // TODO: fetch highlights for user and content
  res.json({ highlights: [] });
});

// POST /api/highlights
router.post('/', async (req, res) => {
  const userId = req.user && req.user.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const { content_id, content_type, start_offset, end_offset, highlighted_text, color } = req.body;
  // TODO: insert highlight
  res.status(201).json({ id: 'uuid', content_id, start_offset, end_offset, color });
});

// DELETE /api/highlights/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  // TODO: remove highlight
  res.status(204).end();
});

module.exports = router;
