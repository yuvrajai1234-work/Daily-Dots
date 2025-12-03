-- Rename existing content column
ALTER TABLE public.journal_entries
RENAME COLUMN content TO daily_reflection;

-- Add new columns for detailed daily entries
ALTER TABLE public.journal_entries
ADD COLUMN mistakes_reflection TEXT,
ADD COLUMN success_steps TEXT,
ADD COLUMN todos JSONB;
