const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');
const app = require('../../backend/index');

function createMultipartRequest(filePath, originalName) {
  const boundary = `----scan-boundary-${Date.now()}`;
  const fileBuffer = fs.readFileSync(filePath);
  const payload = [
    `--${boundary}`,
    `Content-Disposition: form-data; name="file"; filename="${originalName}"`,
    'Content-Type: text/plain',
    '',
    fileBuffer.toString('utf8'),
    `--${boundary}--`,
    '',
  ].join('\r\n');

  return { boundary, payload };
}

describe('POST /api/scan/upload', () => {
  it('extracts text from a plain text upload using the scan worker', async () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'scan-upload-'));
    const filePath = path.join(tempDir, 'sample.txt');
    fs.writeFileSync(filePath, 'Texto de exemplo para o scan.', 'utf8');

    const server = http.createServer(app);
    const response = await new Promise((resolve, reject) => {
      server.once('error', reject);
      server.listen(0, () => {
        const { port } = server.address();
        const { boundary, payload } = createMultipartRequest(filePath, 'sample.txt');
        const req = http.request({
          hostname: '127.0.0.1',
          port,
          path: '/api/scan/upload',
          method: 'POST',
          headers: {
            'x-dev-user-id': 'test-user',
            'content-type': `multipart/form-data; boundary=${boundary}`,
          },
        }, (res) => {
          let body = '';
          res.on('data', (chunk) => {
            body += chunk;
          });
          res.on('end', () => {
            server.close(() => resolve({ statusCode: res.statusCode, body: JSON.parse(body) }));
          });
        });
        req.on('error', reject);
        req.write(payload);
        req.end();
      });
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.extracted_text).toContain('Texto de exemplo');
  });
});
