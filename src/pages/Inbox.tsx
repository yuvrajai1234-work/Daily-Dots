
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MiniSidebar from "@/components/MiniSidebar";

const Inbox = () => {
  const { session } = useAuth();
  const [loginRewardClaimed, setLoginRewardClaimed] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const navigate = useNavigate();
  const [selectedView, setSelectedView] = useState<"quests" | "streak">("quests");

  const canClaimReward = () => {
    const lastClaim = session?.user?.user_metadata?.last_login_reward_claim;
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

  useEffect(() => {
    if (session?.user) {
      setLoginRewardClaimed(!canClaimReward());
    }
  }, [session]);

  const handleClaimLoginReward = async () => {
    if (!session || !canClaimReward() || isClaiming) return;

    setIsClaiming(true);
    const user = session.user;

    const currentMetadata = user.user_metadata || {};
    const currentCoins = currentMetadata.coins || {};
    const rewardAmount = 5;

    const newCoins = {
      ...currentCoins,
      b_coins: (currentCoins.b_coins || 0) + rewardAmount,
    };

    const newMetadata = {
      ...currentMetadata,
      coins: newCoins,
      last_login_reward_claim: new Date().toISOString(),
    };

    const { error } = await supabase.auth.updateUser({ data: newMetadata });

    setIsClaiming(false);

    if (error) {
      console.error("Error updating user metadata:", error);
    } else {
      setLoginRewardClaimed(true);
    }
  };

  const renderQuestsContent = () => (
    <>
      <div className="bg-gray-900 p-4 rounded-md mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Login</h2>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center">
                <img src="/B coins.png" alt="Coin" className="w-8 h-8" />
                <div>
                  <p className="text-sm">Build Coin</p>
                  <p className="text-xs">x5</p>
                </div>
              </div>
            </div>
          </div>
          <Button className="bg-blue-500 hover:bg-blue-600" onClick={handleClaimLoginReward} disabled={loginRewardClaimed || isClaiming}>
            {isClaiming ? "Claiming..." : loginRewardClaimed ? "Claimed" : "Claim"}
          </Button>
        </div>
      </div>
      <div className="bg-gray-900 p-4 rounded-md mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">AI Companion</h2>
            <p className="text-sm text-gray-400">Chat with the AI Assistant for a daily tip.</p>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center">
                <img src="/B coins.png" alt="Coin" className="w-8 h-8" />
                <div>
                  <p className="text-sm">Build Coin</p>
                  <p className="text-xs">x2</p>
                </div>
              </div>
            </div>
          </div>
          <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => navigate("/ai-assistant")}>GO</Button>
        </div>
      </div>
      <div className="bg-gray-900 p-4 rounded-md mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Community Post</h2>
            <p className="text-sm text-gray-400">Share a reflection with the community.</p>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center">
                <img src="/B coins.png" alt="Coin" className="w-8 h-8" />
                <div>
                  <p className="text-sm">Build Coin</p>
                  <p className="text-xs">x3</p>
                </div>
              </div>
            </div>
          </div>
          <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => navigate("/community")}>GO</Button>
        </div>
      </div>
      <div className="bg-gray-900 p-4 rounded-md mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Habit Check-in</h2>
            <p className="text-sm text-gray-400">Complete a daily habit.</p>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center">
                <img src="/B coins.png" alt="Coin" className="w-8 h-8" />
                <div>
                  <p className="text-sm">Build Coin</p>
                  <p className="text-xs">x10</p>
                </div>
              </div>
            </div>
          </div>
          <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => navigate("/dashboard")}>GO</Button>
        </div>
      </div>
    </>
  );

  const renderStreakContent = () => (
    <>
      <div className="bg-gray-900 p-4 rounded-md mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">3-Day Streak Bonus</h2>
            <p className="text-sm text-gray-400">Maintain a 3-day habit streak.</p>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center">
                <img src="/B coins.png" alt="Coin" className="w-8 h-8" />
                <div>
                  <p className="text-sm">Build Coin</p>
                  <p className="text-xs">x5</p>
                </div>
              </div>
            </div>
          </div>
          <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => navigate("/dashboard")}>GO</Button>
        </div>
      </div>
      <div className="bg-gray-900 p-4 rounded-md mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">7-Day Streak Bonus</h2>
            <p className="text-sm text-gray-400">Maintain a 7-day habit streak.</p>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center">
                <img src="/B coins.png" alt="Coin" className="w-8 h-8" />
                <div>
                  <p className="text-sm">Build Coin</p>
                  <p className="text-xs">x10</p>
                </div>
              </div>
            </div>
          </div>
          <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => navigate("/dashboard")}>GO</Button>
        </div>
      </div>
      <div className="bg-gray-900 p-4 rounded-md mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">15-Day Streak Bonus</h2>
            <p className="text-sm text-gray-400">Maintain a 15-day habit streak.</p>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center">
                <img src="/B coins.png" alt="Coin" className="w-8 h-8" />
                <div>
                  <p className="text-sm">Build Coin</p>
                  <p className="text-xs">x25</p>
                </div>
              </div>
            </div>
          </div>
          <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => navigate("/dashboard")}>GO</Button>
        </div>
      </div>
      <div className="bg-gray-900 p-4 rounded-md">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">30-Day Streak Bonus</h2>
            <p className="text-sm text-gray-400">Maintain a 30-day habit streak.</p>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center">
                <img src="/B coins.png" alt="Coin" className="w-8 h-8" />
                <div>
                  <p className="text-sm">Build Coin</p>
                  <p className="text-xs">x50</p>
                </div>
              </div>
            </div>
          </div>
          <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => navigate("/dashboard")}>GO</Button>
        </div>
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
