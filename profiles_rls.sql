-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop old policies if they exist
DROP POLICY IF EXISTS "Enable read access for users based on user_id" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for users to create their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users to update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.profiles;
DROP POLICY IF EXISTS "Enable delete for users to delete their own profile" ON public.profiles;


-- Policy: Enable read access for all authenticated users for leaderboard
CREATE POLICY "Enable read access for all authenticated users"
ON public.profiles
FOR SELECT
USING (auth.role() = 'authenticated');

-- Policy: Enable insert for users to create their own profile
CREATE POLICY "Enable insert for users to create their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Policy: Enable update for users to update their own profile
CREATE POLICY "Enable update for users to update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Policy: Enable delete for users to delete their own profile
CREATE POLICY "Enable delete for users to delete their own profile"
ON public.profiles
FOR DELETE
USING (auth.uid() = id);
