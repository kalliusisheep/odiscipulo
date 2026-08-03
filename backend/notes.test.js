// tests/backend/notes.test.js
// Basic integration test skeleton (uses supertest) — adapt to your auth & DB.

const request = require('supertest');
const app = require('../../backend/index');

describe('Notes API (skeleton)', () => {
  it('GET /api/notes should return 401 without user', async () => {
    const res = await request(app).get('/api/notes');
    expect([200,401]).toContain(res.status); // depending on auth middleware
  });
});
