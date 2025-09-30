import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
<<<<<<< HEAD
import { useToast } from "@/hooks/use-toast";
import {
  Calendar,
  Flame,
  Trophy,
  TrendingUp,
  LogOut,
  Sparkles,
  Plus,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
=======
import Habits from "@/components/Habits";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
>>>>>>> d5e8d35d1d458736e2aa95503f44a1f32cb924bf

const Dashboard = () => {
  const { session } = useAuth();
  const { toast } = useToast();
<<<<<<< HEAD
  const [user, setUser] = useState<any>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [reflectionText, setReflectionText] = useState("");
  const [todayReflection, setTodayReflection] = useState<DailyReflection | null>(null);
  const [stats, setStats] = useState({
    todayScore: 0,
    dailyStreak: 7,
    cycleScore: 0,
    improvement: 0,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        loadDashboardData(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadDashboardData = async (userId: string) => {
    // Load habits
    const { data: habitsData } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", userId);

    if (habitsData) setHabits(habitsData);

    // Load today's completions
    const today = new Date().toISOString().split("T")[0];
    const { data: completionsData } = await supabase
      .from("habit_completions")
      .select("*")
      .eq("user_id", userId)
      .eq("completion_date", today);

    if (completionsData) {
      setCompletions(completionsData);
      const todayScore = completionsData.reduce((sum, c) => sum + c.effort_level, 0);
      setStats((prev) => ({ ...prev, todayScore }));
    }

    // Load today's reflection
    const { data: reflectionData } = await supabase
      .from("daily_reflections")
      .select("*")
      .eq("user_id", userId)
      .eq("reflection_date", today)
      .maybeSingle();

    if (reflectionData) {
      setTodayReflection(reflectionData);
      setReflectionText(reflectionData.reflection_text);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleEffortSelect = async (habitId: string, effortLevel: number) => {
    if (!user) return;

    const today = new Date().toISOString().split("T")[0];
    const existing = completions.find((c) => c.habit_id === habitId);

    if (existing) {
      const { error } = await supabase
        .from("habit_completions")
        .update({ effort_level: effortLevel })
        .eq("id", existing.id);

      if (error) {
        toast({ title: "Error updating completion", variant: "destructive" });
        return;
      }
    } else {
      const { error } = await supabase.from("habit_completions").insert({
        habit_id: habitId,
        user_id: user.id,
        completion_date: today,
        effort_level: effortLevel,
      });

      if (error) {
        toast({ title: "Error logging habit", variant: "destructive" });
        return;
      }
    }

    loadDashboardData(user.id);
    toast({ title: "Habit logged successfully!" });
  };
=======
  const [reflection, setReflection] = useState("");
  const [dailyProgress, setDailyProgress] = useState(0);
  const [weeklyCompletions, setWeeklyCompletions] = useState(0);

  const today = new Date().toISOString().slice(0, 10);

  const fetchDashboardData = useCallback(async () => {
    if (!session) return;

    // Fetch daily reflection
    const { data: reflectionData, error: reflectionError } = await supabase
      .from("daily_reflections")
      .select("reflection_text")
      .eq("user_id", session.user.id)
      .eq("reflection_date", today)
      .single();

    if (reflectionData) {
      setReflection(reflectionData.reflection_text);
    }

    // Fetch habit completions for progress
    const { data: habits, error: habitsError } = await supabase
      .from("habits")
      .select("id")
      .eq("user_id", session.user.id);

    if (habitsError) {
      console.error("Error fetching habits:", habitsError);
      return;
    }

    const { data: completions, error: completionsError } = await supabase
      .from("habit_completions")
      .select("id")
      .eq("user_id", session.user.id)
      .eq("completion_date", today);

    if (completionsError) {
      console.error("Error fetching completions:", completionsError);
      return;
    }

    if (habits.length > 0) {
      setDailyProgress((completions.length / habits.length) * 100);
    }

    // Fetch weekly completions
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const { count: weeklyCount, error: weeklyError } = await supabase
        .from("habit_completions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", session.user.id)
        .gte("completion_date", oneWeekAgo.toISOString().slice(0, 10));

    if (weeklyCount) {
        setWeeklyCompletions(weeklyCount);
    }

  }, [session, today]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);
>>>>>>> d5e8d35d1d458736e2aa95503f44a1f32cb924bf

  const handleSaveReflection = async () => {
    if (!session) return;

<<<<<<< HEAD
    const today = new Date().toISOString().split("T")[0];
=======
    const { error } = await supabase.from("daily_reflections").upsert(
      {
        user_id: session.user.id,
        reflection_date: today,
        reflection_text: reflection,
      },
      { onConflict: "user_id, reflection_date" }
    );
>>>>>>> d5e8d35d1d458736e2aa95503f44a1f32cb924bf

    if (error) {
      toast({ title: "Error saving reflection", description: error.message, variant: "destructive" });
    } else {
<<<<<<< HEAD
      const { error } = await supabase.from("daily_reflections").insert({
        user_id: user.id,
        reflection_date: today,
        reflection_text: reflectionText,
      });

      if (error) {
        toast({ title: "Error saving reflection", variant: "destructive" });
        return;
      }
=======
      toast({ title: "Reflection saved!", description: "Your thoughts for the day are safe." });
>>>>>>> d5e8d35d1d458736e2aa95503f44a1f32cb924bf
    }
  };

<<<<<<< HEAD
  const getCompletionForHabit = (habitId: string) => {
    return completions.find((c) => c.habit_id === habitId);
  };

  const completedCount = completions.length;
  const totalHabits = habits.length;
  const progressPercentage = totalHabits > 0 ? (completedCount / totalHabits) * 100 : 0;

  // Mock data for 7-day chart
  const chartData = [
    { day: "Mon", score: 8 },
    { day: "Tue", score: 12 },
    { day: "Wed", score: 10 },
    { day: "Thu", score: 14 },
    { day: "Fri", score: 11 },
    { day: "Sat", score: 13 },
    { day: "Sun", score: stats.todayScore },
  ];

=======
>>>>>>> d5e8d35d1d458736e2aa95503f44a1f32cb924bf
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Daily Progress</CardTitle>
            <CardDescription>Your habit completion for today.</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={dailyProgress} className="w-full" />
            <p className="text-sm text-muted-foreground mt-2">{Math.round(dailyProgress)}% complete</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Completions</CardTitle>
            <CardDescription>Total habits completed this week.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="text-3xl font-bold">{weeklyCompletions}</div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
            <CardHeader>
                <CardTitle>Daily Reflection</CardTitle>
                <CardDescription>Write down your thoughts for the day.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Textarea
                placeholder="How was your day? What did you learn?"
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                />
                <Button onClick={handleSaveReflection}>Save Reflection</Button>
            </CardContent>
<<<<<<< HEAD
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Daily Streak</CardTitle>
              <Flame className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.dailyStreak}</div>
              <p className="text-xs text-muted-foreground">Days of consecutive tracking</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Cycle Score</CardTitle>
              <Trophy className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.cycleScore}</div>
              <p className="text-xs text-muted-foreground">Points in current 28-day cycle</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Improvement</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.improvement}%</div>
              <p className="text-xs text-muted-foreground">Change from previous cycle</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Habits Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Today's Habits</h2>
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Habit
              </Button>
            </div>

            {/* Completion Counter */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    {completedCount} of {totalHabits} completed
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </CardContent>
            </Card>

            {/* Habit Cards */}
            {habits.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  <p>No habits yet. Click "Add Habit" to get started!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {habits.map((habit) => {
                  const completion = getCompletionForHabit(habit.id);
                  return (
                    <Card key={habit.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                              style={{ backgroundColor: `${habit.color}20` }}
                            >
                              {habit.icon}
                            </div>
                            <div>
                              <h3 className="font-semibold">{habit.name}</h3>
                              {completion && (
                                <Badge variant="secondary" className="mt-1">
                                  Completed - {completion.effort_level} pts
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {[1, 2, 3, 4].map((level) => (
                            <Button
                              key={level}
                              variant={
                                completion?.effort_level === level
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              className="flex-1"
                              onClick={() => handleEffortSelect(habit.id, level)}
                            >
                              {level} pt{level > 1 ? "s" : ""}
                            </Button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* AI Reflection Section */}
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Daily Reflection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-background/50 rounded-lg p-4">
                  <p className="text-sm italic">
                    "Great progress today! You're building consistency. Keep up the momentum!"
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    AI-generated encouragement
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Your thoughts and insights
                  </label>
                  <Textarea
                    placeholder="Write your daily reflection here..."
                    value={reflectionText}
                    onChange={(e) => setReflectionText(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                <Button onClick={handleSaveReflection} className="w-full">
                  Save Reflection
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 7-Day Progress Chart */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">7-Day Progress</h2>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Visual Progress Graph</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <XAxis
                      dataKey="day"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "6px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <p className="text-xs text-muted-foreground text-center mt-4">
                  Line chart showing recent habit performance
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Trend Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Consistency</span>
                    <Badge variant="secondary">Strong</Badge>
                  </div>
                  <Progress value={85} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Visual representation of consistency patterns
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
=======
        </Card>
      </div>
      
      <div>
        <Habits />
      </div>
>>>>>>> d5e8d35d1d458736e2aa95503f44a1f32cb924bf
    </div>
  );
};

export default Dashboard;
