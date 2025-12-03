
-- Function to generate a random, readable 6-character invite code
CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT[] := ARRAY['A','B','C','D','E','F','G','H','J','K','L','M','N','P','Q','R','S','T','U','V','W','X','Y','Z','2','3','4','5','6','7','8','9'];
  result TEXT := '';
  i INTEGER := 0;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || chars[1+floor(random()*(array_length(chars, 1)-1))];
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create a table for groups
CREATE TABLE groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES auth.users(id),
  invite_code TEXT NOT NULL UNIQUE DEFAULT generate_invite_code()
);

-- Create a table for group members
CREATE TABLE group_members (
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  role TEXT DEFAULT 'member', -- e.g., 'admin', 'member'
  PRIMARY KEY (group_id, user_id)
);

-- RLS Policies for groups
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see groups they are a member of." ON groups
  FOR SELECT USING (id IN (SELECT group_id FROM group_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can create groups." ON groups
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Group admins can update their group." ON groups
  FOR UPDATE USING (
    (SELECT role FROM group_members WHERE group_id = id AND user_id = auth.uid()) = 'admin'
  );

-- RLS Policies for group_members
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see members of groups they belong to." ON group_members
  FOR SELECT USING (group_id IN (SELECT group_id FROM group_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can join groups or be added by an admin." ON group_members
  FOR INSERT WITH CHECK (
    -- Public inserts will be handled by a function, this allows admins to add
    (SELECT role FROM group_members WHERE group_id = group_members.group_id AND user_id = auth.uid()) = 'admin'
  );

CREATE POLICY "Members can leave a group." ON group_members
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can remove other members." ON group_members
  FOR DELETE USING (
    (SELECT role FROM group_members WHERE group_id = group_members.group_id AND user_id = auth.uid()) = 'admin' AND user_id != auth.uid()
  );

-- Automatically make the group creator an admin
CREATE OR REPLACE FUNCTION make_creator_admin()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO group_members (group_id, user_id, role)
  VALUES (NEW.id, NEW.created_by, 'admin');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_group_created
  AFTER INSERT ON groups
  FOR EACH ROW EXECUTE PROCEDURE make_creator_admin();
