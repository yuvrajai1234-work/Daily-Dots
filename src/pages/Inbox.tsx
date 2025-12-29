
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MiniSidebar from "@/components/MiniSidebar";
import { useNotification } from "@/contexts/NotificationContext";

const Inbox = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { setNotificationCount } = useNotification();
  const [selectedView, setSelectedView] = useState<"quests" | "streak">("quests");
  const [loading, setLoading] = useState(true);

  // Quest states
  const [loginRewardClaimed, setLoginRewardClaimed] = useState(false);
  const [isClaimingLogin, setIsClaimingLogin] = useState(false);
  const [habitCheckinRewardClaimed, setHabitCheckinRewardClaimed] = useState(false);
  const [isClaimingHabitCheckin, setIsClaimingHabitCheckin] = useState(false);
  const [isHabitCompletedToday, setIsHabitCompletedToday] = useState(false);
  const [aiCompanionRewardClaimed, setAiCompanionRewardClaimed] = useState(false);
  const [isClaimingAiCompanion, setIsClaimingAiCompanion] = useState(false);
  const [communityPostRewardClaimed, setCommunityPostRewardClaimed] = useState(false);
  const [isClaimingCommunityPost, setIsClaimingCommunityPost] = useState(false);

  const [currentStreak, setCurrentStreak] = useState(0);

  // Streak states
  const [streak3DayRewardClaimed, setStreak3DayRewardClaimed] = useState(false);
  const [isClaiming3DayStreak, setIsClaiming3DayStreak] = useState(false);

  const [streak7DayRewardClaimed, setStreak7DayRewardClaimed] = useState(false);
  const [isClaiming7DayStreak, setIsClaiming7DayStreak] = useState(false);

  const [streak15DayRewardClaimed, setStreak15DayRewardClaimed] = useState(false);
  const [isClaiming15DayStreak, setIsClaiming15DayStreak] = useState(false);

  const [streak30DayRewardClaimed, setStreak30DayRewardClaimed] = useState(false);
  const [isClaiming30DayStreak, setIsClaiming30DayStreak] = useState(false);

  // Progress and Expiration states
  const [progress, setProgress] = useState({ claimed: 0, total: 0 });
  const [expirationText, setExpirationText] = useState("");

  const hasCompletedQuestToday = (questField: string) => {
    if (!session?.user) return false;
    const completedDate = session.user.user_metadata?.[questField];
    if (!completedDate) return false;
    const today = new Date().toISOString().slice(0, 10);
    return completedDate === today;
  };

  const canClaimDailyReward = (claimField: string) => {
    if (!session?.user) return false;
    const lastClaim = session.user.user_metadata?.[claimField];
    if (!lastClaim) {
      return true; // Never claimed before
    }
    const lastClaimDate = new Date(lastClaim);
    const today = new Date();
    return (
      lastClaimDate.getFullYear() !== today.getFullYear() ||
      lastClaimDate.getMonth() !== today.getMonth() ||
      lastClaimDate.getDate() !== today.getDate()
    );
  };

  const canClaimOnetimeReward = (claimField: string) => {
    if (!session?.user) return false;
    return !session.user.user_metadata?.[claimField];
  };

  useEffect(() => {
    const checkHabitCompletion = async () => {
      if (session?.user) {
        const today = new Date().toISOString().slice(0, 10);
        const { data, error } = await supabase
          .from('habit_entries')
          .select('id')
          .eq('user_id', session.user.id)
          .eq('entry_date', today)
          .limit(1);

        if (error) {
          console.error('Error checking habit completion:', error);
          return;
        }

        setIsHabitCompletedToday(data && data.length > 0);
      }
    };

    if (session?.user) {
      const userMetadata = session.user.user_metadata;
      const userStreak = userMetadata?.streak || 0;
      setCurrentStreak(userStreak);

      setLoginRewardClaimed(!canClaimDailyReward("last_login_reward_claim"));
      setHabitCheckinRewardClaimed(!canClaimDailyReward("last_habit_checkin_reward_claim"));
      setAiCompanionRewardClaimed(!canClaimDailyReward("last_ai_companion_reward_claim"));
      setCommunityPostRewardClaimed(!canClaimDailyReward("last_community_post_reward_claim"));

      setStreak3DayRewardClaimed(!canClaimOnetimeReward("last_3_day_streak_claim"));
      setStreak7DayRewardClaimed(!canClaimOnetimeReward("last_7_day_streak_claim"));
      setStreak15DayRewardClaimed(!canClaimOnetimeReward("last_15_day_streak_claim"));
      setStreak30DayRewardClaimed(!canClaimOnetimeReward("last_30_day_streak_claim"));

      checkHabitCompletion();
      setLoading(false);
    } else if (session === null) {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    const checkHabitCompletionOnFocus = async () => {
      if (session?.user) {
        const today = new Date().toISOString().slice(0, 10);
        const { data, error } = await supabase
          .from('habit_entries')
          .select('id')
          .eq('user_id', session.user.id)
          .eq('entry_date', today)
          .limit(1);

        if (error) {
          console.error('Error checking habit completion on focus:', error);
          return;
        }

        setIsHabitCompletedToday(data && data.length > 0);
      }
    };

    window.addEventListener('focus', checkHabitCompletionOnFocus);

    return () => {
      window.removeEventListener('focus', checkHabitCompletionOnFocus);
    };
  }, [session]);

  useEffect(() => {
    let claimableQuests = 0;
    if (canClaimDailyReward("last_login_reward_claim")) claimableQuests++;
    if (canClaimDailyReward("last_habit_checkin_reward_claim") && isHabitCompletedToday) claimableQuests++;
    if (canClaimDailyReward("last_ai_companion_reward_claim") && hasCompletedQuestToday("ai_quest_completed_on")) claimableQuests++;
    if (canClaimDailyReward("last_community_post_reward_claim") && hasCompletedQuestToday("community_post_completed_on")) claimableQuests++;

    let claimableStreaks = 0;
    if (currentStreak >= 3 && canClaimOnetimeReward("last_3_day_streak_claim")) claimableStreaks++;
    if (currentStreak >= 7 && canClaimOnetimeReward("last_7_day_streak_claim")) claimableStreaks++;
    if (currentStreak >= 15 && canClaimOnetimeReward("last_15_day_streak_claim")) claimableStreaks++;
    if (currentStreak >= 30 && canClaimOnetimeReward("last_30_day_streak_claim")) claimableStreaks++;

    setNotificationCount(claimableQuests + claimableStreaks);
    if(isHabitCompletedToday){
      setHabitCheckinRewardClaimed(!canClaimDailyReward("last_habit_checkin_reward_claim"))
    }
  }, [session, isHabitCompletedToday, currentStreak]);

  useEffect(() => {
    let claimed = 0;
    if (loginRewardClaimed) claimed++;
    if (habitCheckinRewardClaimed) claimed++;
    if (aiCompanionRewardClaimed) claimed++;
    if (communityPostRewardClaimed) claimed++;

    let total = 4;
    if (selectedView === "streak") {
        claimed = 0;
        if (streak3DayRewardClaimed) claimed++;
        if (streak7DayRewardClaimed) claimed++;
        if (streak15DayRewardClaimed) claimed++;
        if (streak30DayRewardClaimed) claimed++;
    }

    setProgress({ claimed, total });
  }, [selectedView, loginRewardClaimed, habitCheckinRewardClaimed, aiCompanionRewardClaimed, communityPostRewardClaimed, streak3DayRewardClaimed, streak7DayRewardClaimed, streak15DayRewardClaimed, streak30DayRewardClaimed]);

  useEffect(() => {
    const calculateQuestExpiration = () => {
      const now = new Date();
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);
      const diff = endOfDay.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      return `Expires in: ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    };

    const calculateStreakExpiration = () => {
      const now = new Date();
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      const diffTime = endOfMonth.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `Expires in: ${diffDays} Days`;
    };

    let intervalId: number;

    const updateTimer = () => {
      if (selectedView === "quests") {
        setExpirationText(calculateQuestExpiration());
      } else {
        setExpirationText(calculateStreakExpiration());
      }
    };

    updateTimer();
    intervalId = setInterval(updateTimer, 1000);

    return () => clearInterval(intervalId);
  }, [selectedView]);

  const handleClaimReward = async (setIsClaiming: (isClaiming: boolean) => void, rewardAmount: number, coinType: "b_coins" | "a_coins", claimField: string, setRewardClaimed: (claimed: boolean) => void) => {
    if (!session) return;
    setIsClaiming(true);

    const user = session.user;
    const currentMetadata = user.user_metadata || {};
    const currentCoins = currentMetadata.coins || {};

    const newCoins = { ...currentCoins, [coinType]: (currentCoins[coinType] || 0) + rewardAmount };
    const newMetadata = { ...currentMetadata, coins: newCoins, [claimField]: new Date().toISOString() };

    const { error } = await supabase.auth.updateUser({ data: newMetadata });

    setIsClaiming(false);
    if (error) {
      console.error(`Error updating user metadata for ${claimField}:`, error);
    } else {
      setRewardClaimed(true);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-800 text-white"><div>Loading...</div></div>;
  }

  const renderQuestsContent = () => (
    <>
      <div className="bg-gray-900 p-4 rounded-md mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Login</h2>
          <div className="flex items-center mt-2"><img src="/B coins.png" alt="Build Coin" className="w-8 h-8 mr-2" /><div><p className="text-sm">Build Coin</p><p className="text-xs">x5</p></div></div>
        </div>
        <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => handleClaimReward(setIsClaimingLogin, 5, "b_coins", "last_login_reward_claim", setLoginRewardClaimed)} disabled={loginRewardClaimed || isClaimingLogin}>{isClaimingLogin ? "Claiming..." : loginRewardClaimed ? "Claimed" : "Claim"}</Button>
      </div>
      <div className="bg-gray-900 p-4 rounded-md mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">AI Companion</h2>
          <p className="text-sm text-gray-400">Chat with the AI Assistant for a daily tip.</p>
          <div className="flex items-center mt-2"><img src="/B coins.png" alt="Build Coin" className="w-8 h-8 mr-2" /><div><p className="text-sm">Build Coin</p><p className="text-xs">x2</p></div></div>
        </div>
        {hasCompletedQuestToday("ai_quest_completed_on") ? (
          <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => handleClaimReward(setIsClaimingAiCompanion, 2, "b_coins", "last_ai_companion_reward_claim", setAiCompanionRewardClaimed)} disabled={aiCompanionRewardClaimed || isClaimingAiCompanion}>{isClaimingAiCompanion ? "Claiming..." : aiCompanionRewardClaimed ? "Claimed" : "Claim"}</Button>
        ) : (
          <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => navigate("/ai-assistant")}>GO</Button>
        )}
      </div>
      <div className="bg-gray-900 p-4 rounded-md mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Community Post</h2>
          <p className="text-sm text-gray-400">Share a reflection with the community.</p>
          <div className="flex items-center mt-2"><img src="/B coins.png" alt="Build Coin" className="w-8 h-8 mr-2" /><div><p className="text-sm">Build Coin</p><p className="text-xs">x3</p></div></div>
        </div>
        {hasCompletedQuestToday("community_post_completed_on") ? (
          <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => handleClaimReward(setIsClaimingCommunityPost, 3, "b_coins", "last_community_post_reward_claim", setCommunityPostRewardClaimed)} disabled={communityPostRewardClaimed || isClaimingCommunityPost}>{isClaimingCommunityPost ? "Claiming..." : communityPostRewardClaimed ? "Claimed" : "Claim"}</Button>
        ) : (
          <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => navigate("/community")}>GO</Button>
        )}
      </div>
      <div className="bg-gray-900 p-4 rounded-md mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Habit Check-in</h2>
          <p className="text-sm text-gray-400">Complete a daily habit.</p>
          <div className="flex items-center mt-2"><img src="/B coins.png" alt="Build Coin" className="w-8 h-8 mr-2" /><div><p className="text-sm">Build Coin</p><p className="text-xs">x10</p></div></div>
        </div>
        {isHabitCompletedToday ? (
          <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => handleClaimReward(setIsClaimingHabitCheckin, 10, "b_coins", "last_habit_checkin_reward_claim", setHabitCheckinRewardClaimed)} disabled={habitCheckinRewardClaimed || isClaimingHabitCheckin}>{isClaimingHabitCheckin ? "Claiming..." : habitCheckinRewardClaimed ? "Claimed" : "Claim"}</Button>
        ) : (
          <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => navigate('/dashboard')}>GO</Button>
        )}
      </div>
    </>
  );

  const renderStreakContent = () => (
    <>
      <div className="bg-gray-900 p-4 rounded-md mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">3-Day Streak Bonus</h2>
          <p className="text-sm text-gray-400">Maintain a 3-day habit streak.</p>
          <div className="flex items-center mt-2"><img src="/A coins.png" alt="Achievement Coin" className="w-8 h-8 mr-2" /><div><p className="text-sm">Achievement Coin</p><p className="text-xs">x5</p></div></div>
        </div>
        {currentStreak < 3 ? (
          <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => navigate("/dashboard")}>GO</Button>
        ) : (
          <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => handleClaimReward(setIsClaiming3DayStreak, 5, "a_coins", "last_3_day_streak_claim", setStreak3DayRewardClaimed)} disabled={streak3DayRewardClaimed || isClaiming3DayStreak}>{isClaiming3DayStreak ? "Claiming..." : streak3DayRewardClaimed ? "Claimed" : "Claim"}</Button>
        )}
      </div>
      <div className="bg-gray-900 p-4 rounded-md mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">7-Day Streak Bonus</h2>
          <p className="text-sm text-gray-400">Maintain a 7-day habit streak.</p>
          <div className="flex items-center mt-2"><img src="/A coins.png" alt="Achievement Coin" className="w-8 h-8 mr-2" /><div><p className="text-sm">Achievement Coin</p><p className="text-xs">x10</p></div></div>
        </div>
        {currentStreak < 7 ? (
          <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => navigate("/dashboard")}>GO</Button>
        ) : (
          <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => handleClaimReward(setIsClaiming7DayStreak, 10, "a_coins", "last_7_day_streak_claim", setStreak7DayRewardClaimed)} disabled={streak7DayRewardClaimed || isClaiming7DayStreak}>{isClaiming7DayStreak ? "Claiming..." : streak7DayRewardClaimed ? "Claimed" : "Claim"}</Button>
        )}
      </div>
      <div className="bg-gray-900 p-4 rounded-md mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">15-Day Streak Bonus</h2>
          <p className="text-sm text-gray-400">Maintain a 15-day habit streak.</p>
          <div className="flex items-center mt-2"><img src="/A coins.png" alt="Achievement Coin" className="w-8 h-8 mr-2" /><div><p className="text-sm">Achievement Coin</p><p className="text-xs">x25</p></div></div>
        </div>
        {currentStreak < 15 ? (
          <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => navigate("/dashboard")}>GO</Button>
        ) : (
          <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => handleClaimReward(setIsClaiming15DayStreak, 25, "a_coins", "last_15_day_streak_claim", setStreak15DayRewardClaimed)} disabled={streak15DayRewardClaimed || isClaiming15DayStreak}>{isClaiming15DayStreak ? "Claiming..." : streak15DayRewardClaimed ? "Claimed" : "Claim"}</Button>
        )}
      </div>
      <div className="bg-gray-900 p-4 rounded-md flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">30-Day Streak Bonus</h2>
          <p className="text-sm text-gray-400">Maintain a 30-day habit streak.</p>
          <div className="flex items-center mt-2"><img src="/A coins.png" alt="Achievement Coin" className="w-8 h-8 mr-2" /><div><p className="text-sm">Achievement Coin</p><p className="text-xs">x50</p></div></div>
        </div>
        {currentStreak < 30 ? (
          <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => navigate("/dashboard")}>GO</Button>
        ) : (
          <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => handleClaimReward(setIsClaiming30DayStreak, 50, "a_coins", "last_30_day_streak_claim", setStreak30DayRewardClaimed)} disabled={streak30DayRewardClaimed || isClaiming30DayStreak}>{isClaiming30DayStreak ? "Claiming..." : streak30DayRewardClaimed ? "Claimed" : "Claim"}</Button>
        )}
      </div>
    </>
  );

  return (
    <div className="bg-gray-800 text-white min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold">Inbox</h1>
          <div className="bg-gray-900 p-2 rounded-md">
            <div className="flex items-center justify-between"><span className="text-sm">PROGRESS</span><span className="text-sm">{progress.claimed}/{progress.total}</span></div>
            <div className="w-full bg-gray-700 rounded-full h-2.5 my-1"><div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${progress.total > 0 ? (progress.claimed / progress.total) * 100 : 0}%` }}></div></div>
            <div className="flex items-center text-xs text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l3 3a1 1 0 001.414-1.414L11 9.586V6z" clipRule="evenodd" /></svg>{expirationText}</div>
          </div>
        </div>
        <div className="flex gap-4">
          <MiniSidebar selectedView={selectedView} setSelectedView={setSelectedView} />
          <div className="flex-1">{selectedView === "quests" ? renderQuestsContent() : renderStreakContent()}</div>
          {selectedView === 'quests' ? (
          <div className="bg-gray-900 p-4 rounded-md w-96">
            <h2 className="text-xl font-bold mb-4">REWARDS</h2>
            <div className="space-y-4">
              <div className="flex items-center"><img src="/B coins.png" alt="Build Coins" className="w-12 h-12" /><div className="ml-4"><p>Build Coins</p><p className="text-xs">x10</p></div></div>
              <div className="flex items-center"><img src="/A coins.png" alt="Achievement Coins" className="w-12 h-12" /><div className="ml-4"><p>Achievement Coins</p><p className="text-xs">x5</p></div></div>
            </div>
            <Button className="w-full mt-6 bg-gray-700 hover:bg-gray-600" disabled>CLAIM</Button>
          </div>
          ) : (
          <div className="bg-gray-900 p-4 rounded-md w-96">
            <h2 className="text-xl font-bold mb-4">REWARDS</h2>
            <div className="space-y-4">
              <div className="flex items-center"><img src="/B coins.png" alt="Build Coins" className="w-12 h-12" /><div className="ml-4"><p>Build Coins</p><p className="text-xs">x50</p></div></div>
              <div className="flex items-center"><img src="/A coins.png" alt="Achievement Coins" className="w-12 h-12" /><div className="ml-4"><p>Achievement Coins</p><p className="text-xs">x20</p></div></div>
            </div>
            <Button className="w-full mt-6 bg-gray-700 hover:bg-gray-600" disabled>CLAIM</Button>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inbox;
