// backend/api/note_ai_actions.js
const express = require('express');
const router = express.Router();
const db = require('../db');

function requireAuth(req, res, next) {
  if (!req.user || !req.user.id) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

router.use(requireAuth);

// POST /api/notes/:id/ai-action
router.post('/:id/ai-action', async (req, res) => {
  const userId = req.user.id;
  const noteId = req.params.id;
  const { action_type, payload } = req.body;
  if (!action_type) return res.status(400).json({ error: 'Missing action_type' });
  try {
    // Verify ownership
    const noteQ = await db.query('SELECT id FROM notes WHERE id = $1 AND user_id = $2', [noteId, userId]);
    if (noteQ.rowCount === 0) return res.status(404).json({ error: 'Note not found' });
    const q = await db.query('INSERT INTO note_ai_actions (note_id, action_type, payload) VALUES ($1,$2,$3) RETURNING *', [noteId, action_type, payload || null]);
    res.status(201).json(q.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

module.exports = router;
