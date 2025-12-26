
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MiniSidebar from "@/components/MiniSidebar";

const Inbox = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [selectedView, setSelectedView] = useState<"quests" | "streak">("quests");

  // Quest states
  const [loginRewardClaimed, setLoginRewardClaimed] = useState(false);
  const [isClaimingLogin, setIsClaimingLogin] = useState(false);
  const [habitCheckinRewardClaimed, setHabitCheckinRewardClaimed] = useState(false);
  const [isClaimingHabitCheckin, setIsClaimingHabitCheckin] = useState(false);
  const [isHabitCompletedToday, setIsHabitCompletedToday] = useState(false);

  // This should be updated from your backend or state management
  const [currentStreak, setCurrentStreak] = useState(2);

  // Streak states
  const [streak3DayRewardClaimed, setStreak3DayRewardClaimed] = useState(false);
  const [isClaiming3DayStreak, setIsClaiming3DayStreak] = useState(false);
  const [has3DayStreak, setHas3DayStreak] = useState(false);

  const [streak7DayRewardClaimed, setStreak7DayRewardClaimed] = useState(false);
  const [isClaiming7DayStreak, setIsClaiming7DayStreak] = useState(false);
  const [has7DayStreak, setHas7DayStreak] = useState(false);

  const [streak15DayRewardClaimed, setStreak15DayRewardClaimed] = useState(false);
  const [isClaiming15DayStreak, setIsClaiming15DayStreak] = useState(false);
  const [has15DayStreak, setHas15DayStreak] = useState(false);

  const [streak30DayRewardClaimed, setStreak30DayRewardClaimed] = useState(false);
  const [isClaiming30DayStreak, setIsClaiming30DayStreak] = useState(false);
  const [has30DayStreak, setHas30DayStreak] = useState(false);

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
  }

  useEffect(() => {
    if (session?.user) {
      setLoginRewardClaimed(!canClaimDailyReward("last_login_reward_claim"));
      setHabitCheckinRewardClaimed(!canClaimDailyReward("last_habit_checkin_reward_claim"));
      
      setStreak3DayRewardClaimed(!canClaimOnetimeReward("last_3_day_streak_claim"));
      setStreak7DayRewardClaimed(!canClaimOnetimeReward("last_7_day_streak_claim"));
      setStreak15DayRewardClaimed(!canClaimOnetimeReward("last_15_day_streak_claim"));
      setStreak30DayRewardClaimed(!canClaimOnetimeReward("last_30_day_streak_claim"));

      // Simulate that the user has completed habits for demonstration
      setIsHabitCompletedToday(true);

      // Set streak completion status based on current streak
      setHas3DayStreak(currentStreak >= 3);
      setHas7DayStreak(currentStreak >= 7);
      setHas15DayStreak(currentStreak >= 15);
      setHas30DayStreak(currentStreak >= 30);
    }
  }, [session, currentStreak]);

  const handleClaimReward = async (
    setIsClaiming: (isClaiming: boolean) => void,
    rewardAmount: number,
    coinType: "b_coins" | "a_coins",
    claimField: string,
    setRewardClaimed: (claimed: boolean) => void
  ) => {
    if (!session) return;
    setIsClaiming(true);

    const user = session.user;
    const currentMetadata = user.user_metadata || {};
    const currentCoins = currentMetadata.coins || {};
    
    const newCoins = {
      ...currentCoins,
      [coinType]: (currentCoins[coinType] || 0) + rewardAmount,
    };

    const newMetadata = {
      ...currentMetadata,
      coins: newCoins,
      [claimField]: new Date().toISOString(),
    };

    const { error } = await supabase.auth.updateUser({ data: newMetadata });

    setIsClaiming(false);
    if (error) {
      console.error(`Error updating user metadata for ${claimField}:`, error);
    } else {
      setRewardClaimed(true);
    }
  };

  const renderQuestsContent = () => (
    <>
      <div className="bg-gray-900 p-4 rounded-md mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Login</h2>
          <div className="flex items-center mt-2">
            <img src="/B coins.png" alt="Build Coin" className="w-8 h-8 mr-2" />
            <div>
              <p className="text-sm">Build Coin</p>
              <p className="text-xs">x5</p>
            </div>
          </div>
        </div>
        <Button
          className="bg-blue-500 hover:bg-blue-600"
          onClick={() => handleClaimReward(setIsClaimingLogin, 5, "b_coins", "last_login_reward_claim", setLoginRewardClaimed)}
          disabled={loginRewardClaimed || isClaimingLogin}
        >
          {isClaimingLogin ? "Claiming..." : loginRewardClaimed ? "Claimed" : "Claim"}
        </Button>
      </div>
      <div className="bg-gray-900 p-4 rounded-md mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">AI Companion</h2>
          <p className="text-sm text-gray-400">Chat with the AI Assistant for a daily tip.</p>
          <div className="flex items-center mt-2">
            <img src="/B coins.png" alt="Build Coin" className="w-8 h-8 mr-2" />
            <div>
              <p className="text-sm">Build Coin</p>
              <p className="text-xs">x2</p>
            </div>
          </div>
        </div>
        <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => navigate("/ai-assistant")}>GO</Button>
      </div>
      <div className="bg-gray-900 p-4 rounded-md mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Community Post</h2>
          <p className="text-sm text-gray-400">Share a reflection with the community.</p>
          <div className="flex items-center mt-2">
            <img src="/B coins.png" alt="Build Coin" className="w-8 h-8 mr-2" />
            <div>
              <p className="text-sm">Build Coin</p>
              <p className="text-xs">x3</p>
            </div>
          </div>
        </div>
        <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => navigate("/community")}>GO</Button>
      </div>
      <div className="bg-gray-900 p-4 rounded-md mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Habit Check-in</h2>
          <p className="text-sm text-gray-400">Complete a daily habit.</p>
          <div className="flex items-center mt-2">
            <img src="/B coins.png" alt="Build Coin" className="w-8 h-8 mr-2" />
            <div>
              <p className="text-sm">Build Coin</p>
              <p className="text-xs">x10</p>
            </div>
          </div>
        </div>
        <Button
          className="bg-blue-500 hover:bg-blue-600"
          onClick={() => handleClaimReward(setIsClaimingHabitCheckin, 10, "b_coins", "last_habit_checkin_reward_claim", setHabitCheckinRewardClaimed)}
          disabled={!isHabitCompletedToday || habitCheckinRewardClaimed || isClaimingHabitCheckin}
        >
          {isClaimingHabitCheckin ? "Claiming..." : habitCheckinRewardClaimed ? "Claimed" : "Claim"}
        </Button>
      </div>
    </>
  );

  const renderStreakContent = () => (
    <>
      <div className="bg-gray-900 p-4 rounded-md mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">3-Day Streak Bonus</h2>
          <p className="text-sm text-gray-400">Maintain a 3-day habit streak.</p>
          <div className="flex items-center mt-2">
            <img src="/A coins.png" alt="Achievement Coin" className="w-8 h-8 mr-2" />
            <div>
              <p className="text-sm">Achievement Coin</p>
              <p className="text-xs">x5</p>
            </div>
          </div>
        </div>
        {!has3DayStreak ? (
          <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => navigate("/dashboard")}>GO</Button>
        ) : (
          <Button
            className="bg-blue-500 hover:bg-blue-600"
            onClick={() => handleClaimReward(setIsClaiming3DayStreak, 5, "a_coins", "last_3_day_streak_claim", setStreak3DayRewardClaimed)}
            disabled={streak3DayRewardClaimed || isClaiming3DayStreak}
          >
            {isClaiming3DayStreak ? "Claiming..." : streak3DayRewardClaimed ? "Claimed" : "Claim"}
          </Button>
        )}
      </div>
      <div className="bg-gray-900 p-4 rounded-md mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">7-Day Streak Bonus</h2>
          <p className="text-sm text-gray-400">Maintain a 7-day habit streak.</p>
          <div className="flex items-center mt-2">
            <img src="/A coins.png" alt="Achievement Coin" className="w-8 h-8 mr-2" />
            <div>
              <p className="text-sm">Achievement Coin</p>
              <p className="text-xs">x10</p>
            </div>
          </div>
        </div>
        {!has7DayStreak ? (
          <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => navigate("/dashboard")}>GO</Button>
        ) : (
          <Button
            className="bg-blue-500 hover:bg-blue-600"
            onClick={() => handleClaimReward(setIsClaiming7DayStreak, 10, "a_coins", "last_7_day_streak_claim", setStreak7DayRewardClaimed)}
            disabled={streak7DayRewardClaimed || isClaiming7DayStreak}
          >
            {isClaiming7DayStreak ? "Claiming..." : streak7DayRewardClaimed ? "Claimed" : "Claim"}
          </Button>
        )}
      </div>
      <div className="bg-gray-900 p-4 rounded-md mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">15-Day Streak Bonus</h2>
          <p className="text-sm text-gray-400">Maintain a 15-day habit streak.</p>
          <div className="flex items-center mt-2">
            <img src="/A coins.png" alt="Achievement Coin" className="w-8 h-8 mr-2" />
            <div>
              <p className="text-sm">Achievement Coin</p>
              <p className="text-xs">x25</p>
            </div>
          </div>
        </div>
        {!has15DayStreak ? (
          <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => navigate("/dashboard")}>GO</Button>
        ) : (
          <Button
            className="bg-blue-500 hover:bg-blue-600"
            onClick={() => handleClaimReward(setIsClaiming15DayStreak, 25, "a_coins", "last_15_day_streak_claim", setStreak15DayRewardClaimed)}
            disabled={streak15DayRewardClaimed || isClaiming15DayStreak}
          >
            {isClaiming15DayStreak ? "Claiming..." : streak15DayRewardClaimed ? "Claimed" : "Claim"}
          </Button>
        )}
      </div>
      <div className="bg-gray-900 p-4 rounded-md flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">30-Day Streak Bonus</h2>
          <p className="text-sm text-gray-400">Maintain a 30-day habit streak.</p>
          <div className="flex items-center mt-2">
            <img src="/A coins.png" alt="Achievement Coin" className="w-8 h-8 mr-2" />
            <div>
              <p className="text-sm">Achievement Coin</p>
              <p className="text-xs">x50</p>
            </div>
          </div>
        </div>
        {!has30DayStreak ? (
          <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => navigate("/dashboard")}>GO</Button>
        ) : (
          <Button
            className="bg-blue-500 hover:bg-blue-600"
            onClick={() => handleClaimReward(setIsClaiming30DayStreak, 50, "a_coins", "last_30_day_streak_claim", setStreak30DayRewardClaimed)}
            disabled={streak30DayRewardClaimed || isClaiming30DayStreak}
          >
            {isClaiming30DayStreak ? "Claiming..." : streak30DayRewardClaimed ? "Claimed" : "Claim"}
          </Button>
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
            <div className="flex items-center justify-between">
              <span className="text-sm">PROGRESS</span>
              <span className="text-sm">0/8</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5 my-1">
              <div className="bg-green-500 h-2.5 rounded-full w-0"></div>
            </div>
            <div className="flex items-center text-xs text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l3 3a1 1 0 001.414-1.414L11 9.586V6z" clipRule="evenodd" />
              </svg>
              Expires in: 14 Days
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <MiniSidebar selectedView={selectedView} setSelectedView={setSelectedView} />
          <div className="flex-1">
            {selectedView === "quests" ? renderQuestsContent() : renderStreakContent()}
          </div>
          <div className="bg-gray-900 p-4 rounded-md w-96">
            <h2 className="text-xl font-bold mb-4">REWARDS</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <img src="https://i.imgur.com/eZcRNL0.png" alt="Captain Power" className="w-12 h-12" />
                <div className="ml-4">
                  <p>CAPTAIN POWER</p>
                </div>
              </div>
              <div className="flex items-center">
                <img src="https://i.imgur.com/pRiVEeA.png" alt="Captains Pass Point" className="w-12 h-12" />
                <div className="ml-4">
                  <p>Captains Pass Point</p>
                  <p className="text-xs">x1,000</p>
                </div>
              </div>
              <div className="flex items-center">
                <img src="https://i.imgur.com/sC9aG1s.png" alt="Captains Point" className="w-12 h-12" />
                <div className="ml-4">
                  <p>Captains Point</p>
                  <p className="text-xs">x50</p>
                </div>
              </div>
            </div>
            <Button className="w-full mt-6 bg-gray-700 hover:bg-gray-600" disabled>CLAIM</Button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Inbox;
