
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy, Star, Users, Globe, Shield, Award } from "lucide-react";
import { toast } from "sonner";

const AchievementsPage = () => {
  const { session } = useAuth();
  const user = session?.user;
  const [loading, setLoading] = useState(true);
  const [aCoins, setACoins] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [rewards, setRewards] = useState([]);

  useEffect(() => {
    if (!user) {
        setLoading(false);
        return;
    }

    const fetchData = async () => {
        setLoading(true);

        // Fetch profile data for a_coins
        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('a_coins')
            .eq('id', user.id)
            .single();
        if (profileData) setACoins(profileData.a_coins);

        // Fetch achievements
        const { data: achievementsData, error: achievementsError } = await supabase
            .from('user_achievements')
            .select(`
                progress,
                unlocked_at,
                achievements (*)
            `)
            .eq('user_id', user.id);
        if (achievementsData) setAchievements(achievementsData);

        // Fetch leaderboard data
        const { data: leaderboardData, error: leaderboardError } = await supabase
            .from('profiles')
            .select('username, a_coins')
            .order('a_coins', { ascending: false })
            .limit(10);
        if (leaderboardData) setLeaderboard(leaderboardData);

        // Fetch rewards
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

  const inProgressAchievements = achievements.filter(a => !a.unlocked_at);
  const completedAchievements = achievements.filter(a => a.unlocked_at);

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center"><Trophy className="mr-2"/> Achievements & Leaderboard</h1>
      <Tabs defaultValue="achievements">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="achievements">My Achievements</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="rewards">Rewards Store</TabsTrigger>
        </TabsList>

        <TabsContent value="achievements">
            <Card className="my-4">
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        <span>My A-Coins</span>
                        <span className="flex items-center font-bold text-yellow-500"><Award className="mr-2" /> {aCoins}</span>
                    </CardTitle>
                </CardHeader>
            </Card>
          <Card>
            <CardHeader>
              <CardTitle>Achievements in Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {inProgressAchievements.length > 0 ? (
                inProgressAchievements.map((ach) => (
                  <div key={ach.achievements.id}>
                    <p className="font-semibold">{ach.achievements.name} <span className="text-sm text-muted-foreground">({ach.achievements.description})</span></p>
                    <Progress value={(ach.progress / ach.achievements.milestone) * 100} className="w-full" />
                    <p className="text-sm text-right">{ach.progress}/{ach.achievements.milestone}</p>
                  </div>
                )))
               : <p>No achievements in progress. Go start a new habit!</p>}
            </CardContent>
          </Card>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Completed Achievements</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedAchievements.length > 0 ? (
                completedAchievements.map((ach) => (
                    <Card key={ach.achievements.id} className="p-4 flex items-center space-x-4 bg-green-100 dark:bg-green-900">
                        <Star className="h-8 w-8 text-yellow-500"/>
                        <div>
                            <p className="font-semibold">{ach.achievements.name}</p>
                            <p className="text-sm text-muted-foreground">Unlocked on {new Date(ach.unlocked_at).toLocaleDateString()}</p>
                        </div>
                    </Card>
                )))
                : <p>No completed achievements yet. Keep going!</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard">
            <Tabs defaultValue="global" className="mt-4">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="global"><Globe className="mr-2 h-4 w-4"/>Global</TabsTrigger>
                    <TabsTrigger value="regional" disabled><Shield className="mr-2 h-4 w-4"/>Regional</TabsTrigger>
                    <TabsTrigger value="community" disabled><Users className="mr-2 h-4 w-4"/>Community</TabsTrigger>
                    <TabsTrigger value="friends" disabled><Users className="mr-2 h-4 w-4"/>Friends</TabsTrigger>
                </TabsList>
                <TabsContent value="global">
                    <Card>
                        <CardHeader>
                        <CardTitle>Global Leaderboard</CardTitle>
                        <CardDescription>Top 10 players by A-Coins</CardDescription>
                        </CardHeader>
                        <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">Rank</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead className="text-right">A-Coins</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                            {leaderboard.map((player, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-bold">{index + 1}</TableCell>
                                    <TableCell>{player.username}</TableCell>
                                    <TableCell className="text-right font-bold text-yellow-500">{player.a_coins}</TableCell>
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
          <Card>
            <CardHeader>
                <CardTitle>Rewards Store</CardTitle>
                <CardDescription>Use your A-Coins to redeem exclusive rewards!</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rewards.map(reward => (
                    <Card key={reward.id}>
                        <CardHeader>
                            <CardTitle>{reward.name}</CardTitle>
                            <CardDescription>{reward.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-between items-center">
                            <span className="font-bold text-lg text-yellow-500">{reward.cost} A-Coins</span>
                            <Button onClick={() => handleRedeem(reward)} disabled={aCoins < reward.cost}>
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
