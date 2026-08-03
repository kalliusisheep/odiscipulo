// tests/backend/highlights.integration.test.js
const http = require('http');
const app = require('../../backend/index');

// Mock the DB module used by the backend
jest.mock('../../backend/db', () => {
  return {
    query: jest.fn()
  };
});
const db = require('../../backend/db');

function createServer() {
  return http.createServer(app);
}

describe('POST /api/highlights realignment integration', () => {
  beforeEach(() => {
    db.query.mockReset();
  });

  it('realigns offsets when original text differs and content_text is loaded from DB', async () => {
    const contentId = 'lesson-123';
    const origText = 'Este é um parágrafo de exemplo que contém um trecho importante para testar realinhamento.';
    const highlighted = 'um trecho importante';

    db.query.mockImplementation((sql) => {
      if (sql && sql.toString().includes('SELECT text FROM contents')) {
        return Promise.resolve({ rows: [{ text: origText }] });
      }
      if (sql && sql.toString().includes('INSERT INTO highlights')) {
        return Promise.resolve({ rows: [{ id: 'h1', realigned: true }] });
      }
      return Promise.resolve({ rows: [] });
    });

    const server = createServer();
    const response = await new Promise((resolve, reject) => {
      server.once('error', reject);
      server.listen(0, () => {
        const { port } = server.address();
        const req = http.request({
          hostname: '127.0.0.1',
          port,
          path: '/api/highlights',
          method: 'POST',
          headers: {
            'x-dev-user-id': 'test-user',
            'content-type': 'application/json',
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
        req.write(JSON.stringify({ content_id: contentId, content_type: 'lesson', start_offset: 0, end_offset: 5, highlighted_text: highlighted }));
        req.end();
      });
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('realigned');
    expect(response.body.realigned).toBe(true);
  });
});
