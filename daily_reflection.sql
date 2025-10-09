CREATE TABLE daily_reflections (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  reflection_date DATE NOT NULL,
  reflection_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  with check (auth.uid() = user_id)
);