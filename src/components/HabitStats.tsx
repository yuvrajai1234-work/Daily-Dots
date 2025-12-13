import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/AuthProvider";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

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

const HabitStats = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitCompletions, setHabitCompletions] = useState<HabitCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { session } = useAuth();

  const fetchHabitData = useCallback(async () => {
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
        setHabitCompletions([]);
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
      setHabitCompletions(completionsData || []);
    }

    setLoading(false);
  }, [session]);

  useEffect(() => {
    fetchHabitData();
  }, [fetchHabitData]);

  const totalHabitPoints = habitCompletions.reduce((sum, completion) => sum + completion.effort_level, 0);
  const totalHabits = habits.length;

  const pointsByHabit = habits.map(habit => {
    const completions = habitCompletions.filter(c => c.habit_id === habit.id);
    const points = completions.reduce((sum, c) => sum + c.effort_level, 0);
    return {
      ...habit,
      points: points,
    };
  });
  
  const dailyPointsByHabit = habits.map(habit => {
    const dayStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
    const completionsOnDate = habitCompletions.filter(c => c.habit_id === habit.id && c.completion_date === dayStr);
    const points = completionsOnDate.reduce((sum, c) => sum + c.effort_level, 0);
    return {
      ...habit,
      points,
    };
  });

  const totalDailyPoints = dailyPointsByHabit.reduce((sum, habit) => sum + habit.points, 0);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
        <Card className="bg-gray-800 border-gray-700 text-white">
        <CardHeader>
            <div className="flex flex-row items-center justify-between">
                <CardTitle>Total Habits</CardTitle>
                <span className="text-2xl font-bold">{totalHabits}</span>
            </div>
            <div className="flex flex-row items-center justify-between">
                <CardTitle>Total Habit Points</CardTitle>
                <span className="text-2xl font-bold">{totalHabitPoints}</span>
            </div>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
            {pointsByHabit.map(habit => (
                <div key={habit.id} className="space-y-2">
                    <div style={{ backgroundColor: habit.color || '#fbbf24' }} className="p-2 px-4 rounded-lg inline-block">
                        <span className="text-black font-bold text-xl">{habit.points}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div style={{ backgroundColor: habit.color || '#fbbf24' }} className="w-3 h-3 rounded-full mr-2"></div>
                            <span>{habit.name}</span>
                        </div>
                        <span>{habit.points}</span>
                    </div>
                </div>
            ))}
            </div>
        </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
                <CardTitle>Daily Habit Points</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
                <div className="flex justify-center">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="rounded-md border"
                    />
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4">
                        Points for {selectedDate ? format(selectedDate, "MMMM dd, yyyy") : 'No date selected'}
                    </h3>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between font-bold text-lg mb-4">
                            <span>Total Points:</span>
                            <span>{totalDailyPoints}</span>
                        </div>
                        {dailyPointsByHabit.map(habit => (
                            <div key={habit.id} className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div style={{ backgroundColor: habit.color || '#fbbf24' }} className="w-3 h-3 rounded-full mr-2"></div>
                                    <span>{habit.name}</span>
                                </div>
                                <span>{habit.points}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
  );
};

export default HabitStats;
