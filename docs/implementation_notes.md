PR: Feature/minhas-notas

This branch adds migrations, RFC, task list and initial skeleton for backend and frontend components to implement the "Minhas Notas" feature.

Suggested next steps before opening a PR:
- Adjust backend files to match your framework (Next.js API routes or Express app).
- Wire auth middleware to user extraction (req.user).
- Run the migration SQL in your dev Supabase/Postgres and enable pgcrypto extension if using gen_random_uuid().
- Install frontend deps: @tiptap/react @tiptap/starter-kit @tiptap/extension-highlight

