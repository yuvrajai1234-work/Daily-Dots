
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/AuthProvider";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format, subDays } from "date-fns";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown } from "lucide-react";

export type Habit = {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  created_at: string;
  user_id: string;
};

export type HabitCompletion = {
  id: string;
  habit_id: string;
  completion_date: string;
  effort_level: number;
};

const ImprovementPage = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [allHabitCompletions, setAllHabitCompletions] = useState<HabitCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const { session } = useAuth();

  const fetchAllHabitData = useCallback(async () => {
    if (!session) return;

    setLoading(true);
    const { data: habitsData, error: habitsError } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', session.user.id);

    if (habitsError || !habitsData) {
      console.error("Error fetching habits:", habitsError);
      setLoading(false);
      return;
    }
    
    setHabits(habitsData);

    if (habitsData.length === 0) {
        setAllHabitCompletions([]);
        setLoading(false);
        return;
    }

    const habitIds = habitsData.map(h => h.id);
    const { data: completionsData, error: completionsError } = await supabase
      .from('habit_completions')
      .select('*')
      .in('habit_id', habitIds);

    if (completionsError) {
      console.error("Error fetching habit completions:", completionsError);
    } else {
      setAllHabitCompletions(completionsData || []);
    }

    setLoading(false);
  }, [session]);

  useEffect(() => {
    fetchAllHabitData();
  }, [fetchAllHabitData]);

  const totalHabits = habits.length;

  // Weekly stats
  const T = 7;
  const M_per_habit = 4 * T;
  const today = new Date();
  
  // Current week (last 7 days)
  const currentWeekStartDateStr = format(subDays(today, T - 1), 'yyyy-MM-dd');
  const currentWeekEndDateStr = format(today, 'yyyy-MM-dd');
  const currentWeekCompletions = allHabitCompletions.filter(c => 
      c.completion_date >= currentWeekStartDateStr && c.completion_date <= currentWeekEndDateStr
  );
  
  // Previous week (previous 7 days)
  const prevWeekStartDateStr = format(subDays(today, 2 * T - 1), 'yyyy-MM-dd');
  const prevWeekEndDateStr = format(subDays(today, T), 'yyyy-MM-dd');
  const prevWeekCompletions = allHabitCompletions.filter(c => 
      c.completion_date >= prevWeekStartDateStr && c.completion_date <= prevWeekEndDateStr
  );

  const weeklyStatsByHabit = habits.map(habit => {
    const completions = currentWeekCompletions.filter(c => c.habit_id === habit.id);
    const S = completions.reduce((sum, c) => sum + c.effort_level, 0);
    const habitPercentage = M_per_habit > 0 ? (S / M_per_habit) * 100 : 0;
    const avgLevel = T > 0 ? S / T : 0;
    
    return {
      ...habit,
      S,
      habitPercentage,
      avgLevel
    };
  });
  
  const totalS_current_week = currentWeekCompletions.reduce((sum, c) => sum + c.effort_level, 0);
  const totalM_current_week = M_per_habit * habits.length;
  const overallCompletionRate = totalM_current_week > 0 ? (totalS_current_week / totalM_current_week) * 100 : 0;

  const totalS_prev_week = prevWeekCompletions.reduce((sum, c) => sum + c.effort_level, 0);
  const totalM_prev_week = M_per_habit * habits.length; // Assuming same number of habits
  const overallCompletionRate_prev_week = totalM_prev_week > 0 ? (totalS_prev_week / totalM_prev_week) * 100 : 0;

  const improvement = overallCompletionRate - overallCompletionRate_prev_week;
  const improvementValue = isNaN(improvement) ? 0 : improvement;

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
        <h1 className="text-3xl font-bold tracking-tight">Improvement</h1>
        <Card>
            <CardContent className="flex items-center justify-center p-6">
                <div className="text-center">
                    <div className="text-5xl font-bold flex items-center">
                        {improvementValue.toFixed(0)}%
                        {improvementValue > 0 && <TrendingUp className="ml-2 h-8 w-8 text-green-500" />}
                        {improvementValue < 0 && <TrendingDown className="ml-2 h-8 w-8 text-red-500" />}
                    </div>
                    <p className="text-lg text-muted-foreground">Improvement (Last 7 days)</p>
                </div>
            </CardContent>
        </Card>

        {habits.length > 0 ? (
            <Card>
                <CardHeader>
                    <div className="flex flex-row items-center justify-between">
                        <CardTitle>Habit Weekly Stats</CardTitle>
                        <div className="text-right">
                            <span className="text-2xl font-bold">{totalHabits}</span>
                            <p className="text-sm text-muted-foreground">Total Habits</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                    {weeklyStatsByHabit.map(habit => (
                        <div key={habit.id} className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div style={{ backgroundColor: habit.color || '#fbbf24' }} className="w-4 h-4 rounded-full mr-3"></div>
                                    <span className="font-semibold">{habit.name}</span>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold">{habit.habitPercentage.toFixed(0)}% this week</div>
                                    <div className="text-sm text-muted-foreground">Avg level: {habit.avgLevel.toFixed(1)} / 4</div>
                                </div>
                            </div>
                            <Progress value={habit.habitPercentage} className="w-full" />
                        </div>
                    ))}
                    </div>
                </CardContent>
            </Card>
        ) : (
            <Card>
                <CardHeader>
                    <CardTitle>No Habits Found</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">You haven't added any habits yet. Go to the dashboard to add your first habit.</p>
                </CardContent>
            </Card>
        )}
    </div>
  );
};

export default ImprovementPage;
