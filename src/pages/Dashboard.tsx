import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Habits from "@/components/Habits";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const { session } = useAuth();
  const { toast } = useToast();
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

  const handleSaveReflection = async () => {
    if (!session) return;

    const { error } = await supabase.from("daily_reflections").upsert(
      {
        user_id: session.user.id,
        reflection_date: today,
        reflection_text: reflection,
      },
      { onConflict: "user_id, reflection_date" }
    );

    if (error) {
      toast({ title: "Error saving reflection", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Reflection saved!", description: "Your thoughts for the day are safe." });
    }
  };

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
        </Card>
      </div>
      
      <div>
        <Habits />
      </div>
    </div>
  );
};

export default Dashboard;
