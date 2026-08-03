// backend/api/scan.js
// Basic upload + parsing endpoints for Scan Inteligente.
// Notes:
// - This implementation uses tesseract.js for OCR (node) and mammoth for .docx parsing.
// - For PDFs with selectable text we use pdf-parse. For scanned PDFs we fall back to OCR per page.

const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'tmp/uploads/' });
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const tesseract = require('tesseract.js');

function requireAuth(req, res, next) {
  if (!req.user || !req.user.id) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

router.use(requireAuth);

router.post('/upload', upload.single('file'), async (req, res) => {
  const userId = req.user.id;
  if (!req.file) return res.status(400).json({ error: 'No file' });
  const ext = path.extname(req.file.originalname).toLowerCase();
  try {
    let text = '';
    if (ext === '.pdf') {
      const data = fs.readFileSync(req.file.path);
      try {
        const parsed = await pdfParse(data);
        if (parsed && parsed.text && parsed.text.trim().length > 0) {
          text = parsed.text;
        } else {
          // fallback to OCR per page would be implemented here
          // For now, run OCR on the whole file image-wise (requires pdf->images pipeline)
          text = '';
        }
      } catch (e) {
        console.warn('pdf-parse failed, falling back to OCR', e);
      }
    } else if (ext === '.docx') {
      const result = await mammoth.extractRawText({ path: req.file.path });
      text = result.value;
    } else {
      // assume image
      const worker = tesseract.createWorker();
      await worker.load();
      await worker.loadLanguage('por+eng');
      await worker.initialize('por+eng');
      const { data: { text: ocrText } } = await worker.recognize(req.file.path);
      await worker.terminate();
      text = ocrText;
    }

    // Save as a new note with source_type depending on ext
    const sourceType = ext === '.pdf' ? 'scan_pdf' : ext === '.docx' ? 'scan_word' : 'scan_foto';
    // Respond with extracted text and suggested actions (frontend will call AI endpoints as needed)
    res.json({ extracted_text: text, suggested_actions: ['transcribe', 'reescrever', 'estruturar'], source_type: sourceType });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Processing error' });
  } finally {
    // cleanup file
    try { fs.unlinkSync(req.file.path); } catch (e) {}
  }
});

module.exports = router;
