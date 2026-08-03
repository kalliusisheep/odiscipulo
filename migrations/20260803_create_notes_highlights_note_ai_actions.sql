-- Migration: create notes, highlights and note_ai_actions tables
-- Filename: migrations/20260803_create_notes_highlights_note_ai_actions.sql

-- Notes table
CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  content jsonb NOT NULL,
  source_type text NOT NULL,
  source_content_id uuid,
  source_content_title text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_source_content_id ON notes(source_content_id);

-- Highlights table
CREATE TABLE IF NOT EXISTS highlights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  content_id uuid NOT NULL,
  content_type text NOT NULL,
  start_offset integer NOT NULL,
  end_offset integer NOT NULL,
  highlighted_text text NOT NULL,
  color text NOT NULL DEFAULT 'yellow',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_highlights_user_content ON highlights(user_id, content_id, content_type);

-- Note AI Actions table (history)
CREATE TABLE IF NOT EXISTS note_ai_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id uuid NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  action_type text NOT NULL,
  payload jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_note_ai_actions_note_id ON note_ai_actions(note_id);

-- Trigger to update updated_at on notes
CREATE FUNCTION trigger_set_timestamp() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_timestamp ON notes;
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON notes
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();
