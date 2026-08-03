// tests/backend/highlights.integration.test.js
const request = require('supertest');
const app = require('../../backend/index');

// Mock the DB module used by the backend
jest.mock('../../backend/db', () => {
  return {
    query: jest.fn()
  };
});
const db = require('../../backend/db');

describe('POST /api/highlights realignment integration', () => {
  beforeEach(() => {
    db.query.mockReset();
  });

  it('realigns offsets when original text differs and content_text is loaded from DB', async () => {
    const contentId = 'lesson-123';
    const origText = 'Este é um parágrafo de exemplo que contém um trecho importante para testar realinhamento.';
    const highlighted = 'um trecho importante';

    // When backend tries to load content text
    db.query.mockImplementation((sql, params) => {
      if (sql && sql.toString().includes('SELECT text FROM contents')) {
        return Promise.resolve({ rows: [{ text: origText }] });
      }
      // Insert highlights
      if (sql && sql.toString().includes('INSERT INTO highlights')) {
        return Promise.resolve({ rows: [{ id: 'h1', user_id: params[0], content_id: params[1], start_offset: params[3], end_offset: params[4], highlighted_text: params[5], realigned: params[7] }] });
      }
      return Promise.resolve({ rows: [] });
    });

    const res = await request(app)
      .post('/api/highlights')
      .set('x-dev-user-id', 'test-user')
      .send({ content_id: contentId, content_type: 'lesson', start_offset: 0, end_offset: 5, highlighted_text: highlighted });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('realigned');
    expect(res.body.realigned).toBe(true);
    expect(res.body._note).toMatch(/realign/);
  });
});
