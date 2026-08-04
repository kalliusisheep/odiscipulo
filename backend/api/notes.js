// backend/api/notes.js
// Express router implementing Notes CRUD using the migrations' table schema.

const express = require('express');
const router = express.Router();
const db = require('../db');

// Middleware: expect req.user.id to be present (adapt to your auth)
function requireAuth(req, res, next) {
  if (!req.user || !req.user.id) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

router.use(requireAuth);

// GET /api/notes
router.get('/', async (req, res) => {
  const userId = req.user.id;
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const pageSize = Math.min(100, parseInt(req.query.page_size) || 20);
  const offset = (page - 1) * pageSize;
  try {
    const q = await db.query('SELECT * FROM notes WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3', [userId, pageSize, offset]);
    res.json({ notes: q.rows, page, page_size: pageSize });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

// GET /api/notes/:id
router.get('/:id', async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  try {
    const q = await db.query('SELECT * FROM notes WHERE id = $1 AND user_id = $2', [id, userId]);
    if (q.rowCount === 0) return res.status(404).json({ error: 'Not found' });
    res.json(q.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

// POST /api/notes
router.post('/', async (req, res) => {
  const userId = req.user.id;
  const { title, content, source_type, source_content_id, source_content_title } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'Missing title or content' });
  try {
    const q = await db.query(
      `INSERT INTO notes (user_id, title, content, source_type, source_content_id, source_content_title)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [userId, title, content, source_type || 'manual', source_content_id || null, source_content_title || null]
    );
    res.status(201).json(q.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

// PUT /api/notes/:id
router.put('/:id', async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { title, content } = req.body;
  try {
    const q = await db.query('UPDATE notes SET title = COALESCE($1, title), content = COALESCE($2, content) WHERE id = $3 AND user_id = $4 RETURNING *', [title, content, id, userId]);
    if (q.rowCount === 0) return res.status(404).json({ error: 'Not found or forbidden' });
    res.json(q.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

// DELETE /api/notes/:id
router.delete('/:id', async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  try {
    const q = await db.query('DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING *', [id, userId]);
    if (q.rowCount === 0) return res.status(404).json({ error: 'Not found or forbidden' });
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

module.exports = router;
