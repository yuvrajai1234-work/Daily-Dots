
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/components/AuthProvider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Key, UserCheck, UserPlus, FileText, Star, Users } from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const CharacterStatsChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
      <PolarGrid />
      <PolarAngleAxis dataKey="stat" />
      <PolarRadiusAxis angle={30} domain={[0, 100]} />
      <Radar name="Mike" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
    </RadarChart>
  </ResponsiveContainer>
);

const Profile = () => {
  const { session } = useAuth();
  const user = session?.user;
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [habitsEnrolled, setHabitsEnrolled] = useState(0);
  const [habitsCompletedToday, setHabitsCompletedToday] = useState(0);
  const [habitsCompletedOverall, setHabitsCompletedOverall] = useState(0);
  const [friendsCount, setFriendsCount] = useState(0);
  const [characterStats, setCharacterStats] = useState([]);

  useEffect(() => {
    if (!user) {
        setLoading(false);
        return;
    }

    let ignore = false;
    setLoading(true);

    async function fetchData() {
        // Fetch initial data
        const [profileData, habitsData, completionsTodayData, completionsOverallData, friendsData] = await Promise.all([
            supabase.from('profiles').select('username, strength, agility, intellect, stamina, wisdom, charisma').eq('id', user.id).single(),
            supabase.from('habits').select('id', { count: 'exact' }).eq('user_id', user.id),
            supabase.from('habit_completions').select('id', { count: 'exact' }).eq('user_id', user.id).gte('completed_at', new Date().toISOString().slice(0, 10)),
            supabase.from('habit_completions').select('id', { count: 'exact' }).eq('user_id', user.id),
            supabase.from('friends').select('id', { count: 'exact' }).or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
        ]);

        if (!ignore) {
            if (profileData.data) {
                const { username, ...stats } = profileData.data;
                setUsername(username || '');
                const statsArray = Object.keys(stats).map(key => ({ stat: key.charAt(0).toUpperCase() + key.slice(1), value: stats[key] }));
                setCharacterStats(statsArray);
            }
            setHabitsEnrolled(habitsData.count || 0);
            setHabitsCompletedToday(completionsTodayData.count || 0);
            setHabitsCompletedOverall(completionsOverallData.count || 0);
            setFriendsCount(friendsData.count || 0);
        }
    }

    fetchData();
    setLoading(false);

    // Setup subscriptions
    const profileChannel = supabase.channel('profile-updates').on('postgres_changes', { event: '*', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` }, () => fetchData()).subscribe();
    const habitsChannel = supabase.channel('habits-updates').on('postgres_changes', { event: '*', schema: 'public', table: 'habits', filter: `user_id=eq.${user.id}` }, () => fetchData()).subscribe();
    const completionsChannel = supabase.channel('completions-updates').on('postgres_changes', { event: '*', schema: 'public', table: 'habit_completions', filter: `user_id=eq.${user.id}` }, () => fetchData()).subscribe();
    const friendsChannel = supabase.channel('friends-updates').on('postgres_changes', { event: '*', schema: 'public', table: 'friends', filter: `or(user_id.eq.${user.id},friend_id.eq.${user.id})` }, () => fetchData()).subscribe();

    return () => {
      ignore = true;
      supabase.removeChannel(profileChannel);
      supabase.removeChannel(habitsChannel);
      supabase.removeChannel(completionsChannel);
      supabase.removeChannel(friendsChannel);
    };
  }, [user]);

  async function updateProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (user) {
        setLoading(true);
        const updates = {
            id: user.id,
            username,
            updated_at: new Date(),
        };

        const { error } = await supabase.from('profiles').upsert(updates);

        if (error) {
            toast.error(error.message);
        } else {
            toast.success('Profile updated successfully!');
        }
        setLoading(false);
    }
  }

  return (
    <div className="space-y-6 p-4 md:p-8">
      <Card>
        <CardHeader>
        <CardTitle>Welcome, {username || 'User'}!</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-4">
            <Card>
              <CardHeader>
              <CardTitle className="flex items-center"><User className="mr-2" />{username || 'User Information'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={updateProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={user?.email || ''} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input 
                        id="username" 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        disabled={loading}
                    />
                  </div>
                  <p className="flex items-center text-sm text-muted-foreground"><Star className="mr-2 h-4 w-4" /><strong>Character Rank:</strong> Rookie</p>
                  <div className="flex space-x-2">
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button variant="outline" className="w-full" disabled><Key className="mr-2 h-4 w-4" />Change Password</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><Users className="mr-2" />Friends</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{friendsCount}</p>
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><FileText className="mr-2" />Habit Stats</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <UserPlus className="mr-2" />
                  <div>
                    <p className="font-semibold">Enrolled</p>
                    <p>{habitsEnrolled}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <UserCheck className="mr-2" />
                  <div>
                    <p className="font-semibold">Completed (Today)</p>
                    <p>{habitsCompletedToday}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <UserCheck className="mr-2" />
                  <div>
                    <p className="font-semibold">Completed (All Time)</p>
                    <p>{habitsCompletedOverall}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Overall Report (Stats)</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? <p>Loading stats...</p> : <CharacterStatsChart data={characterStats} />}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={75} />
          <p className="text-sm text-muted-foreground mt-2">You are 75% of the way to your next goal!</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
