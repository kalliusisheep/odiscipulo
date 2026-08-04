// backend/api/highlights.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const { realignOffsets } = require('../lib/highlight_realign');

function requireAuth(req, res, next) {
  if (!req.user || !req.user.id) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

router.use(requireAuth);

function normalizeForCompare(s) {
  if (!s) return '';
  return s.replace(/\s+/g, ' ').replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
}

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
// Optional: client may pass `content_text` (the current full text of the field)
// to help server realign offsets. If not provided, server will attempt to
// fetch content text from a `contents` table (best-effort) before giving up.
router.post('/', async (req, res) => {
  const userId = req.user.id;
  const { content_id, content_type, start_offset, end_offset, highlighted_text, color, content_text } = req.body;
  if (!content_id || !content_type || typeof start_offset !== 'number' || typeof end_offset !== 'number' || !highlighted_text) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    let origText = content_text;

    // If client didn't provide content_text, try best-effort to load from DB
    if (!origText) {
      try {
        const q = await db.query('SELECT text FROM contents WHERE id = $1 LIMIT 1', [content_id]);
        if (q && q.rows && q.rows[0] && typeof q.rows[0].text === 'string') {
          origText = q.rows[0].text;
        }
      } catch (err) {
        // table may not exist or query may fail — that's okay, continue without original text
        // console.debug('contents table lookup failed', err.message);
      }
    }

    let finalStart = start_offset;
    let finalEnd = end_offset;
    let realigned = false;

    if (origText) {
      const sliced = origText.slice(start_offset, end_offset);
      if (normalizeForCompare(sliced) !== normalizeForCompare(highlighted_text)) {
        // attempt to realign
        const r = realignOffsets(origText, highlighted_text);
        if (r) {
          finalStart = r.start;
          finalEnd = r.end;
          realigned = true;
        }
      }
    } else {
      // no original text available; we still proceed with provided offsets
    }

    const q = await db.query(
      `INSERT INTO highlights (user_id, content_id, content_type, start_offset, end_offset, highlighted_text, color, realigned)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [userId, content_id, content_type, finalStart, finalEnd, highlighted_text, color || 'yellow', realigned]
    );

    const inserted = q.rows[0];
    // attach a note to response if realigned
    if (realigned) inserted._note = 'offsets realigned on server';

    res.status(201).json(inserted);
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
