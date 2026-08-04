// backend/worker/scan_worker.js
// Scan worker MVP: supports simple processing of text files and image files.
// For PDFs, this worker currently returns a helpful error unless a
// pdftoppm/poppler-based conversion is provided by the environment.

const fs = require('fs').promises;
const path = require('path');

async function ocrImage(imagePath) {
  try {
    // Lazy require to avoid hard dependency during tests
    const { createWorker } = require('tesseract.js');
    const worker = createWorker();
    await worker.load();
    await worker.loadLanguage('eng+por');
    await worker.initialize('eng+por');
    const { data } = await worker.recognize(imagePath);
    await worker.terminate();
    return data?.text || '';
  } catch (err) {
    console.warn('[scan_worker] tesseract failed or not available:', err.message);
    throw err;
  }
}

async function processScan(filePath) {
  console.log('[scan_worker] processScan start', filePath);
  const ext = path.extname(filePath).toLowerCase();

  try {
    const content = await fs.readFile(filePath, 'utf8');
    if (ext === '.txt' || (!ext && content.includes('\n') || content.includes(' '))) {
      return { ok: true, pages: 1, results: [{ page: 1, text: content }] };
    }
  } catch (err) {
    // ignore and continue to other handlers
  }

  if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.tiff') {
    // run OCR on single image
    try {
      const text = await ocrImage(filePath);
      return { ok: true, pages: 1, results: [{ page: 1, text }] };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }

  if (ext === '.pdf') {
    // Best-effort: try to use poppler's pdftoppm if available in PATH.
    // This is optional — if the environment doesn't provide it, return
    // a helpful message so callers can fall back to other strategies.
    const { exec } = require('child_process');
    const tmp = require('os').tmpdir();
    const base = path.join(tmp, `scan_${Date.now()}`);
    const cmd = `pdftoppm -png ${filePath} ${base}`; // produces base-1.png, base-2.png ...
    try {
      await new Promise((resolve, reject) => {
        exec(cmd, (err, stdout, stderr) => {
          if (err) return reject(new Error('pdftoppm failed or not installed'));
          resolve();
        });
      });
      // find generated images
      const dir = path.dirname(base);
      const files = await fs.readdir(dir);
      const imgs = files.filter(f => f.startsWith(path.basename(base))).map(f => path.join(dir, f));
      const results = [];
      for (let i = 0; i < imgs.length; i++) {
        try {
          const text = await ocrImage(imgs[i]);
          results.push({ page: i + 1, text });
        } catch (err) {
          results.push({ page: i + 1, error: err.message });
        }
      }
      return { ok: true, pages: results.length, results };
    } catch (err) {
      return { ok: false, error: 'PDF processing requires pdftoppm/poppler to be installed on the host' };
    }
  }

  return { ok: false, error: 'Unsupported file type' };
}

module.exports = { processScan };
