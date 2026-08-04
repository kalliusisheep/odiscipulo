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
    const noteQ = await db.query('SELECT id FROM notes WHERE id = $1 AND user_id = $2', [noteId, userId]);
    if (noteQ.rowCount === 0) return res.status(404).json({ error: 'Note not found' });

    const q = await db.query(
      'INSERT INTO note_ai_actions (note_id, action_type, payload) VALUES ($1,$2,$3) RETURNING *',
      [noteId, action_type, payload || null]
    );

    const action = q.rows[0] || {};
    res.status(201).json({
      id: action.id,
      note_id: action.note_id || noteId,
      action_type: action.action_type || action_type,
      payload: action.payload ?? payload ?? null,
      created_at: action.created_at || null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

module.exports = router;
