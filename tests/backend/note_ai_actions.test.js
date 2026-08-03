const http = require('http');
const app = require('../../backend/index');

jest.mock('../../backend/db', () => ({
  query: jest.fn(),
}));

const db = require('../../backend/db');

describe('POST /api/notes/:id/ai-action', () => {
  beforeEach(() => {
    db.query.mockReset();
  });

  it('creates an AI action record for a valid note', async () => {
    db.query.mockImplementation((sql) => {
      if (sql && sql.toString().includes('SELECT id FROM notes')) {
        return Promise.resolve({ rowCount: 1, rows: [{ id: 'note-1' }] });
      }
      if (sql && sql.toString().includes('INSERT INTO note_ai_actions')) {
        return Promise.resolve({ rows: [{ id: 'action-1', note_id: 'note-1', action_type: 'summarize', payload: { foo: 'bar' } }] });
      }
      return Promise.resolve({ rows: [] });
    });

    const server = http.createServer(app);
    const response = await new Promise((resolve, reject) => {
      server.once('error', reject);
      server.listen(0, () => {
        const { port } = server.address();
        const req = http.request({
          hostname: '127.0.0.1',
          port,
          path: '/api/notes/note-1/ai-action',
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
        req.write(JSON.stringify({ action_type: 'summarize', payload: { foo: 'bar' } }));
        req.end();
      });
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.action_type).toBe('summarize');
    expect(response.body.payload).toEqual({ foo: 'bar' });
  });
});
