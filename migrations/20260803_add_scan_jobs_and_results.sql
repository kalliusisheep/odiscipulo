-- migrations/20260803_add_scan_jobs_and_results.sql

-- Add pgcrypto if not present
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Jobs table for background scan processing
CREATE TABLE IF NOT EXISTS scan_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text,
  file_path text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  error text,
  pages int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Results per page
CREATE TABLE IF NOT EXISTS scan_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES scan_jobs(id) ON DELETE CASCADE,
  page_number int NOT NULL,
  text text,
  created_at timestamptz DEFAULT now()
);
