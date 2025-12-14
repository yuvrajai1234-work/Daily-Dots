-- Enable Row Level Security
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

-- Policy: Enable read access for users based on user_id
CREATE POLICY "Enable read access for users based on user_id"
ON public.reminders
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Enable insert for authenticated users
CREATE POLICY "Enable insert for authenticated users"
ON public.reminders
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Enable update for users based on user_id
CREATE POLICY "Enable update for users based on user_id"
ON public.reminders
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Enable delete for users based on user_id
CREATE POLICY "Enable delete for users based on user_id"
ON public.reminders
FOR DELETE
USING (auth.uid() = user_id);
