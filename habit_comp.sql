CREATE TABLE habit_completions (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  habit_id BIGINT REFERENCES habits(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  completion_date DATE NOT NULL,
  effort_level INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  with check (auth.uid() = user_id)
);