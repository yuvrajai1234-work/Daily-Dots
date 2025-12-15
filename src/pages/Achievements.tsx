
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy, Users, Globe, Shield, Award, CheckCircle, Lock } from "lucide-react";
import { toast } from "sonner";

// Define achievement branches
const achievementBranches = [
  {
    name: "Habit Master",
    description: "Complete tasks related to forming and maintaining habits.",
    achievements: [
      { id: 1, name: "First Step", description: "Complete a habit for the first time.", milestone: 1, reward: "50 A-Coins" },
      { id: 2, name: "Habit Streak", description: "Maintain a habit for 7 days in a row.", milestone: 7, reward: "100 A-Coins" },
      { id: 3, name: "30-Day Challenge", description: "Complete a habit for 30 days.", milestone: 30, reward: "250 A-Coins" },
    ],
    finalReward: { name: "Habit Master Trophy", icon: <Trophy className="h-8 w-8 text-yellow-500" /> }
  },
  {
    name: "Community Leader",
    description: "Engage with the community and help others.",
    achievements: [
      { id: 4, name: "First Post", description: "Make your first post in the community forum.", milestone: 1, reward: "25 A-Coins" },
      { id: 5, name: "Helping Hand", description: "Receive 10 upvotes on your posts.", milestone: 10, reward: "75 A-Coins" },
      { id: 6, name: "Community Pillar", description: "Become a moderator in the community.", milestone: 1, reward: "500 A-Coins" },
    ],
    finalReward: { name: "Community Leader Badge", icon: <Shield className="h-8 w-8 text-blue-500" /> }
  },
];

const AchievementsPage = () => {
  const { session } = useAuth();
  const user = session?.user;
  const [loading, setLoading] = useState(true);
  const [aCoins, setACoins] = useState(0);
  const [userAchievements, setUserAchievements] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [rewards, setRewards] = useState([]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('a_coins')
        .eq('id', user.id)
        .single();
      if (profileData) setACoins(profileData.a_coins);

      const { data: achievementsData, error: achievementsError } = await supabase
        .from('user_achievements')
        .select(`
          progress,
          unlocked_at,
          claimed_at,
          achievements (*)
        `)
        .eq('user_id', user.id);
      if (achievementsData) setUserAchievements(achievementsData);

      const { data: leaderboardData, error: leaderboardError } = await supabase
        .from('profiles')
        .select('username, a_coins')
        .order('a_coins', { ascending: false })
        .limit(10);
      if (leaderboardData) setLeaderboard(leaderboardData);

      const { data: rewardsData, error: rewardsError } = await supabase
        .from('rewards')
        .select('*');
      if (rewardsData) setRewards(rewardsData);

      setLoading(false);
    };

    fetchData();

    const profileChannel = supabase.channel('achievements-page-updates').on('postgres_changes', { event: '*', schema: 'public' }, () => fetchData()).subscribe();

    return () => {
      supabase.removeChannel(profileChannel);
    };
  }, [user]);

  const handleRedeem = async (reward) => {
    if (aCoins < reward.cost) {
      toast.error("Not enough A-Coins to redeem this reward.");
      return;
    }
    const { error } = await supabase.rpc('redeem_reward', { user_id: user.id, reward_id: reward.id, cost: reward.cost });
    if (error) {
      toast.error(`Failed to redeem reward: ${error.message}`);
    } else {
      toast.success(`Successfully redeemed ${reward.name}!`);
    }
  };

 const handleClaimAchievement = async (achievementId) => {
    if (!user) {
      toast.error("You must be logged in to claim achievements.");
      return;
    }
    try {
      const { data, error } = await supabase.rpc('claim_achievement', {
        achievement_id_in: achievementId,
        user_id_in: user.id
      });

      if (error) {
        throw error;
      }

      if (data) {
        toast.success(`Reward Claimed: ${data}`);
      }
    } catch (error) {
      toast.error(`Error claiming achievement: ${error.message}`);
      console.error("Error claiming achievement:", error);
    }
  };

  const getAchievementStatus = (achievementId) => {
    const achievement = userAchievements.find(a => a.achievements.id === achievementId);
    if (!achievement) return { progress: 0, isUnlocked: false, isClaimed: false };
    return {
        progress: achievement.progress || 0,
        isUnlocked: !!achievement.unlocked_at,
        isClaimed: !!achievement.claimed_at,
    };
  };

  return (
    <div className="p-4 md:p-8 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 flex items-center text-yellow-400"><Trophy className="mr-2" /> Achievements & Leaderboard</h1>
      <Tabs defaultValue="achievements">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800">
          <TabsTrigger value="achievements">My Achievements</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="rewards">Rewards Store</TabsTrigger>
        </TabsList>

        <TabsContent value="achievements">
          <Card className="my-4 bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex justify-between items-center text-white">
                <span>My A-Coins</span>
                <span className="flex items-center font-bold text-yellow-400"><Award className="mr-2" /> {aCoins}</span>
              </CardTitle>
            </CardHeader>
          </Card>
          <div className="space-y-8">
            {achievementBranches.map(branch => {
              const completedAchievementsInBranch = branch.achievements.every(ach => getAchievementStatus(ach.id).isClaimed);
              return (
                <Card key={branch.name} className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-yellow-400">{branch.name}</CardTitle>
                    <CardDescription className="text-gray-400">{branch.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative overflow-x-auto pb-4">
                        <div className="flex items-center space-x-8">
                        {branch.achievements.map((ach, index) => {
                          const { progress, isUnlocked, isClaimed } = getAchievementStatus(ach.id);
                          const canClaim = isUnlocked && !isClaimed;
                          const prevAchieved = index === 0 || getAchievementStatus(branch.achievements[index-1].id).isClaimed;
                          
                          return (
                            <div key={ach.id} className="flex items-center z-10">
                              <div className="flex flex-col items-center">
                                <div className={`w-20 h-20 rounded-full flex items-center justify-center border-4 ${isClaimed ? 'bg-green-500 border-green-300' : canClaim && prevAchieved ? 'bg-yellow-400 animate-pulse border-yellow-200' : 'bg-gray-600 border-gray-500'}`}>
                                  {isClaimed ? <CheckCircle className="h-10 w-10 text-white"/> : 
                                   (canClaim && prevAchieved ? <Trophy className="h-10 w-10 text-white"/> : <Lock className="h-10 w-10 text-gray-400"/>)}
                                </div>
                                <p className="font-bold text-sm mt-2 text-center">{ach.name}</p>
                                <p className="text-xs text-gray-400 text-center">{ach.reward}</p>
                                {canClaim && prevAchieved && (
                                  <Button size="sm" className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-black" onClick={() => handleClaimAchievement(ach.id)}>
                                    Claim
                                  </Button>
                                )}
                              </div>
                              {index < branch.achievements.length - 1 && (
                                <div className={`h-1 flex-1 ${getAchievementStatus(branch.achievements[index].id).isClaimed ? 'bg-green-400' : 'bg-gray-600'}`} style={{minWidth: '50px'}}/>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    {completedAchievementsInBranch && (
                      <div className="flex items-center space-x-4 p-4 mt-4 bg-green-800 rounded-lg border border-green-600">
                        <div className="flex-shrink-0 text-yellow-400">
                          {branch.finalReward.icon}
                        </div>
                        <div className="flex-grow">
                          <p className="font-semibold text-white">Branch Complete!</p>
                          <p className="text-sm text-gray-300">You've earned the {branch.finalReward.name}.</p>
                        </div>
                        <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">Claim Final Reward</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard">
          <Tabs defaultValue="global" className="mt-4">
            <TabsList className="grid w-full grid-cols-4 bg-gray-800">
              <TabsTrigger value="global"><Globe className="mr-2 h-4 w-4" />Global</TabsTrigger>
              <TabsTrigger value="regional" disabled><Shield className="mr-2 h-4 w-4" />Regional</TabsTrigger>
              <TabsTrigger value="community" disabled><Users className="mr-2 h-4 w-4" />Community</TabsTrigger>
              <TabsTrigger value="friends" disabled><Users className="mr-2 h-4 w-4" />Friends</TabsTrigger>
            </TabsList>
            <TabsContent value="global">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-yellow-400">Global Leaderboard</CardTitle>
                  <CardDescription className="text-gray-400">Top 10 players by A-Coins</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700">
                        <TableHead className="w-[50px] text-white">Rank</TableHead>
                        <TableHead className="text-white">User</TableHead>
                        <TableHead className="text-right text-white">A-Coins</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leaderboard.map((player, index) => (
                        <TableRow key={index} className="border-gray-700">
                          <TableCell className="font-bold text-white">{index + 1}</TableCell>
                          <TableCell className="text-gray-300">{player.username}</TableCell>
                          <TableCell className="text-right font-bold text-yellow-400">{player.a_coins}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="rewards">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-yellow-400">Rewards Store</CardTitle>
              <CardDescription className="text-gray-400">Use your A-Coins to redeem exclusive rewards!</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rewards.map(reward => (
                <Card key={reward.id} className="bg-gray-700 border-gray-600">
                  <CardHeader>
                    <CardTitle className="text-white">{reward.name}</CardTitle>
                    <CardDescription className="text-gray-400">{reward.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-between items-center">
                    <span className="font-bold text-lg text-yellow-400">{reward.cost} A-Coins</span>
                    <Button onClick={() => handleRedeem(reward)} disabled={aCoins < reward.cost} className="bg-yellow-500 hover:bg-yellow-600 text-black">
                      Redeem
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AchievementsPage;
