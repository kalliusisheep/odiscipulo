// backend/api/highlights.js
const express = require('express');
const router = express.Router();
const db = require('../db');

function requireAuth(req, res, next) {
  if (!req.user || !req.user.id) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

router.use(requireAuth);

// GET /api/highlights?content_id=&content_type=
router.get('/', async (req, res) => {
  const userId = req.user.id;
  const { content_id, content_type } = req.query;
  if (!content_id || !content_type) return res.status(400).json({ error: 'Missing content_id or content_type' });
  try {
    const q = await db.query('SELECT * FROM highlights WHERE user_id = $1 AND content_id = $2 AND content_type = $3 ORDER BY created_at ASC', [userId, content_id, content_type]);
    res.json({ highlights: q.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

// POST /api/highlights
router.post('/', async (req, res) => {
  const userId = req.user.id;
  const { content_id, content_type, start_offset, end_offset, highlighted_text, color } = req.body;
  if (!content_id || !content_type || typeof start_offset !== 'number' || typeof end_offset !== 'number' || !highlighted_text) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  try {
    const q = await db.query(
      `INSERT INTO highlights (user_id, content_id, content_type, start_offset, end_offset, highlighted_text, color)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [userId, content_id, content_type, start_offset, end_offset, highlighted_text, color || 'yellow']
    );
    res.status(201).json(q.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

// DELETE /api/highlights/:id
router.delete('/:id', async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  try {
    const q = await db.query('DELETE FROM highlights WHERE id = $1 AND user_id = $2 RETURNING *', [id, userId]);
    if (q.rowCount === 0) return res.status(404).json({ error: 'Not found or forbidden' });
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

module.exports = router;
