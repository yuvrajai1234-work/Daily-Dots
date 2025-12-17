
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/AuthProvider";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format, subDays } from "date-fns";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
  const today = new Date();
  const T = 7;
  const M_per_habit = 4 * T;

  const calculateOverallCompletionRate = (completions: HabitCompletion[]) => {
    const totalS = completions.reduce((sum, c) => sum + c.effort_level, 0);
    const totalM = M_per_habit * habits.length;
    return totalM > 0 ? (totalS / totalM) * 100 : 0;
  };

  const currentWeekStartDate = subDays(today, T - 1);
  const currentWeekEndDate = today;
  const prevWeekStartDate = subDays(today, 2 * T - 1);
  const prevWeekEndDate = subDays(today, T);

  const currentWeekCompletions = allHabitCompletions.filter(c => {
      const completionDate = new Date(c.completion_date);
      return completionDate >= currentWeekStartDate && completionDate <= currentWeekEndDate;
  });

  const prevWeekCompletions = allHabitCompletions.filter(c => {
      const completionDate = new Date(c.completion_date);
      return completionDate >= prevWeekStartDate && completionDate <= prevWeekEndDate;
  });
  
  const overallCompletionRate = calculateOverallCompletionRate(currentWeekCompletions);
  const overallCompletionRate_prev_week = calculateOverallCompletionRate(prevWeekCompletions);
  
  const improvement = overallCompletionRate - overallCompletionRate_prev_week;
  const improvementValue = isNaN(improvement) ? 0 : improvement;

  const dailyImprovementData = Array.from({ length: 30 }).map((_, i) => {
    const date = subDays(today, i);
    const dataPoint: { [key: string]: any } = {
      name: format(date, 'MMM d'),
    };

    habits.forEach(habit => {
      const calculateHabitCompletionRate = (completions: HabitCompletion[]) => {
        const habitCompletions = completions.filter(c => c.habit_id === habit.id);
        const totalS = habitCompletions.reduce((sum, c) => sum + c.effort_level, 0);
        const totalM = 4 * T;
        return totalM > 0 ? (totalS / totalM) * 100 : 0;
      };

      const currentWeekStartDate = subDays(date, T - 1);
      const currentWeekEndDate = date;
      const prevWeekStartDate = subDays(date, 2 * T - 1);
      const prevWeekEndDate = subDays(date, T);

      const currentWeekCompletions = allHabitCompletions.filter(c => {
        const completionDate = new Date(c.completion_date);
        return completionDate >= currentWeekStartDate && completionDate <= currentWeekEndDate;
      });

      const prevWeekCompletions = allHabitCompletions.filter(c => {
        const completionDate = new Date(c.completion_date);
        return completionDate >= prevWeekStartDate && completionDate <= prevWeekEndDate;
      });

      const currentRate = calculateHabitCompletionRate(currentWeekCompletions);
      const prevRate = calculateHabitCompletionRate(prevWeekCompletions);
      const improvement = currentRate - prevRate;

      dataPoint[habit.name] = improvement;
    });

    return dataPoint;
  }).reverse();

  const weeklyStatsByHabit = habits.map(habit => {
    const currentWeekStartDateStr = format(subDays(today, T - 1), 'yyyy-MM-dd');
    const currentWeekEndDateStr = format(today, 'yyyy-MM-dd');
    const currentWeekCompletions = allHabitCompletions.filter(c => 
        c.completion_date >= currentWeekStartDateStr && c.completion_date <= currentWeekEndDateStr && c.habit_id === habit.id
    );
    
    const S = currentWeekCompletions.reduce((sum, c) => sum + c.effort_level, 0);
    const habitPercentage = M_per_habit > 0 ? (S / M_per_habit) * 100 : 0;
    const avgLevel = T > 0 ? S / T : 0;
    
    return {
      ...habit,
      S,
      habitPercentage,
      avgLevel
    };
  });

  const chartData = dailyImprovementData;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-zinc-950 text-white rounded-md border border-zinc-800">
          <p className="label font-semibold">{label}</p>
          {payload.map((pld: any) => (
            <div key={pld.dataKey} style={{ color: pld.fill }}>
              {`${pld.dataKey}: ${pld.value.toFixed(1)}%`}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground bg-black">Loading...</div>;
  }

  return (
    <div className="p-4 md:p-8 space-y-8 bg-black text-white">
        <h1 className="text-3xl font-bold tracking-tight text-white">Improvement</h1>
        <Card className="bg-zinc-900 border-zinc-800 text-white">
            <CardContent className="flex items-center justify-center p-6">
                <div className="text-center">
                    <div className="text-5xl font-bold flex items-center text-white">
                        {improvementValue.toFixed(0)}%
                        {improvementValue > 0 && <TrendingUp className="ml-2 h-8 w-8 text-green-500" />}
                        {improvementValue < 0 && <TrendingDown className="ml-2 h-8 w-8 text-red-500" />}
                    </div>
                    <p className="text-lg text-zinc-400">Improvement (Last 7 days)</p>
                </div>
            </CardContent>
        </Card>

        {habits.length > 0 ? (
            <Card className="bg-zinc-900 border-zinc-800 text-white">
                <CardHeader>
                    <CardTitle className="text-white">Monthly Improvement</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#3a3a3a"/>
                            <XAxis dataKey="name" tick={{ fill: '#a0a0a0' }} stroke="#a0a0a0" />
                            <YAxis tick={{ fill: '#a0a0a0' }} stroke="#a0a0a0" />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(136, 132, 216, 0.2)' }}/>
                            <Legend wrapperStyle={{ color: '#a0a0a0' }}/>
                            {habits.map(habit => (
                                <Bar key={habit.id} dataKey={habit.name} fill={habit.color || '#8884d8'} />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        ) : null}

        {habits.length > 0 ? (
            <Card className="bg-zinc-900 border-zinc-800 text-white">
                <CardHeader>
                    <div className="flex flex-row items-center justify-between">
                        <CardTitle className="text-white">Habit Weekly Stats</CardTitle>
                        <div className="text-right">
                            <span className="text-2xl font-bold">{totalHabits}</span>
                            <p className="text-sm text-zinc-400">Total Habits</p>
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
                                    <span className="font-semibold text-white">{habit.name}</span>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-white">{habit.habitPercentage.toFixed(0)}% this week</div>
                                    <div className="text-sm text-zinc-400">Avg level: {habit.avgLevel.toFixed(1)} / 4</div>
                                </div>
                            </div>
                            <Progress value={habit.habitPercentage} className="w-full" />
                        </div>
                    ))}
                    </div>
                </CardContent>
            </Card>
        ) : (
            <Card className="bg-zinc-900 border-zinc-800 text-white">
                <CardHeader>
                    <CardTitle className="text-white">No Habits Found</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-zinc-400">You haven't added any habits yet. Go to the dashboard to add your first habit.</p>
                </CardContent>
            </Card>
        )}
    </div>
  );
};

export default ImprovementPage;
