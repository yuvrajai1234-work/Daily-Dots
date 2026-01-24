-- Add new achievements for Habit Master branch
ALTER TABLE achievements ADD COLUMN task TEXT;

INSERT INTO achievements (id, name, description, branch, milestone, reward, task) VALUES
(1, 'Novice', 'Reach 100 habit points.', 'Habit Master', 100, '10 A-Coins', 'Complete tasks related to forming and maintaining habits.'),
(2, 'Apprentice', 'Reach 500 habit points.', 'Habit Master', 500, '50 A-Coins', 'Complete tasks related to forming and maintaining habits.'),
(3, 'Adept', 'Reach 1000 habit points.', 'Habit Master', 1000, '100 A-Coins', 'Complete tasks related to forming and maintaining habits.'),
(4, 'Expert', 'Reach 2000 habit points.', 'Habit Master', 2000, '200 A-Coins', 'Complete tasks related to forming and maintaining habits.'),
(5, 'Master', 'Reach 5000 habit points.', 'Habit Master', 5000, '500 A-Coins', 'Complete tasks related to forming and maintaining habits.'),
(6, 'Grandmaster', 'Reach 10000 habit points.', 'Habit Master', 10000, '1000 A-Coins', 'Complete tasks related to forming and maintaining habits.'),
(7, 'Legend', 'Reach 20000 habit points.', 'Habit Master', 20000, '2000 A-Coins', 'Complete tasks related to forming and maintaining habits.'),
(8, 'Demi-God', 'Reach 50000 habit points.', 'Habit Master', 50000, '5000 A-Coins', 'Complete tasks related to forming and maintaining habits.'),
(9, 'God', 'Reach 100000 habit points.', 'Habit Master', 100000, '10000 A-Coins', 'Complete tasks related to forming and maintaining habits.'),
(10, 'First Post', 'Make your first post in the community forum.', 'Community Leader', 1, '25 A-Coins', 'Complete tasks related to forming and maintaining habits.'),
(11, 'Helping Hand', 'Receive 10 upvotes on your posts.', 'Community Leader', 10, '75 A-Coins', 'Complete tasks related to forming and maintaining habits.'),
(12, 'Community Pillar', 'Become a moderator in the community.', 'Community Leader', 1, '500 A-Coins', 'Complete tasks related to forming and maintaining habits.');

CREATE OR REPLACE FUNCTION claim_achievement(
    achievement_id_in BIGINT, 
    user_id_in UUID
) 
RETURNS TEXT AS $$
DECLARE
    user_achievement_rec RECORD;
    achievement_rec RECORD;
    reward_amount INT;
    reward_unit TEXT;
    total_habit_points INT;
BEGIN
    -- Get achievement details
    SELECT * INTO achievement_rec
    FROM achievements
    WHERE id = achievement_id_in;

    -- Check if the user is eligible to claim the achievement
    IF achievement_rec.branch = 'Habit Master' THEN
        SELECT COALESCE(SUM(effort_level), 0) INTO total_habit_points
        FROM habit_completions
        WHERE user_id = user_id_in;

        IF total_habit_points < achievement_rec.milestone THEN
            RETURN 'Achievement not yet unlocked.';
        END IF;
    ELSE
        -- For other branches, check if a user_achievement record exists and is unlocked
        SELECT * INTO user_achievement_rec
        FROM user_achievements 
        WHERE user_id = user_id_in AND achievement_id = achievement_id_in;

        IF user_achievement_rec.unlocked_at IS NULL THEN
            RETURN 'Achievement not yet unlocked.';
        END IF;
    END IF;

    -- Check if the user has already claimed this achievement
    SELECT * INTO user_achievement_rec
    FROM user_achievements 
    WHERE user_id = user_id_in AND achievement_id = achievement_id_in;

    IF user_achievement_rec.id IS NULL THEN
        INSERT INTO user_achievements(user_id, achievement_id, unlocked_at, claimed_at) 
        VALUES(user_id_in, achievement_id_in, NOW(), NOW());
    ELSIF user_achievement_rec.claimed_at IS NOT NULL THEN
        RETURN 'Achievement already claimed.';
    ELSE
        -- Update the user_achievements table
        UPDATE user_achievements
        SET claimed_at = NOW()
        WHERE user_id = user_id_in AND achievement_id = achievement_id_in;
    END IF;

    -- Update user's a_coins in the profiles table
    reward_amount := CAST(SPLIT_PART(achievement_rec.reward, ' ', 1) AS INT);
    UPDATE profiles
    SET a_coins = a_coins + reward_amount
    WHERE id = user_id_in;

    RETURN 'Reward Claimed: ' || achievement_rec.reward;
END;
$$ LANGUAGE plpgsql;