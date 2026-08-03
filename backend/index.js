// backend/index.js
// Simple Express app to mount the API routers created under backend/api
// For local development, supports a dev header 'x-dev-user-id' to simulate auth.

const express = require('express');
const bodyParser = require('body-parser');
const notes = require('./api/notes');
const highlights = require('./api/highlights');
const noteAi = require('./api/note_ai_actions');
const scan = require('./api/scan');

const app = express();
app.use(bodyParser.json({ limit: '5mb' }));

// Dev auth middleware: if X-DEV-USER-ID header present, set req.user
app.use((req, res, next) => {
  const devUser = req.get('x-dev-user-id') || process.env.DEV_TEST_USER_ID;
  if (devUser) {
    req.user = { id: devUser };
    return next();
  }
  // TODO: integrate with real auth (passport / supabase / next-auth)
  // If your app uses cookies/sessions, adapt this middleware to set req.user accordingly.
  next();
});

app.use('/api/notes', notes);
app.use('/api/highlights', highlights);
app.use('/api/notes', noteAi); // note_ai_actions mounted under /api/notes/:id/ai-action
app.use('/api/scan', scan);

// Health
app.get('/health', (req, res) => res.json({ ok: true }));

const port = process.env.PORT || 4000;
if (require.main === module) {
  app.listen(port, () => console.log(`API server listening on port ${port}`));
}

module.exports = app;
