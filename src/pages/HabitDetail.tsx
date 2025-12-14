import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Habit } from "@/components/Habits";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Progress } from "@/components/ui/progress";
import { TrendingUp, ChevronsUpDown } from "lucide-react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@/components/ui/collapsible";

const HabitDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [habit, setHabit] = useState<Habit | null>(null);
  const [loading, setLoading] = useState(true);
  const [monthlyScore, setMonthlyScore] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);
  const [improvement, setImprovement] = useState(0);
  const [weeklyPercentage, setWeeklyPercentage] = useState(0);
  const [avgWeeklyLevel, setAvgWeeklyLevel] = useState(0);

  useEffect(() => {
    const fetchHabitData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const { data: habitData, error: habitError } = await supabase
          .from("habits")
          .select("*")
          .eq("id", id)
          .single();

        if (habitError) throw habitError;
        setHabit(habitData);

        const { data: completions, error: completionsError } = await supabase
          .from('habit_completions')
          .select('completion_date, effort_level')
          .eq('habit_id', id);

        if (completionsError) throw completionsError;

        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        const monthlyCompletions = completions.filter(c => {
            const completionDate = new Date(c.completion_date);
            return completionDate.getMonth() === currentMonth && completionDate.getFullYear() === currentYear;
        });

        const score = monthlyCompletions.reduce((acc, curr) => acc + curr.effort_level, 0);
        setMonthlyScore(score);

        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const newChartData = Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const completion = monthlyCompletions.find(c => c.completion_date === dateStr);
            return { day: day, score: completion ? completion.effort_level : 0 };
        });

        setChartData(newChartData);

        // Improvement and weekly stats calculation
        const todayDate = new Date();
        const dayOfWeek = todayDate.getDay();
        const startOfWeek = new Date(todayDate);
        startOfWeek.setDate(todayDate.getDate() - dayOfWeek);

        const datesOfWeek = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            return date.toISOString().slice(0, 10);
        });
        const currentWeekCompletions = completions.filter(c => datesOfWeek.includes(c.completion_date));
        const cycleScore = currentWeekCompletions.reduce((acc, curr) => acc + curr.effort_level, 0);

        const startOfLastWeek = new Date(startOfWeek);
        startOfLastWeek.setDate(startOfWeek.getDate() - 7);
        const datesOfLastWeek = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(startOfLastWeek);
            date.setDate(startOfLastWeek.getDate() + i);
            return date.toISOString().slice(0, 10);
        });
        const lastWeekCompletions = completions.filter(c => datesOfLastWeek.includes(c.completion_date));
        const lastWeekScore = lastWeekCompletions.reduce((acc, curr) => acc + curr.effort_level, 0);

        const T = 7;
        const M_per_habit = 4 * T;

        const overallCompletionRate = M_per_habit > 0 ? (cycleScore / M_per_habit) * 100 : 0;
        const overallCompletionRate_prev_week = M_per_habit > 0 ? (lastWeekScore / M_per_habit) * 100 : 0;

        const improvementValue = Math.round(overallCompletionRate - overallCompletionRate_prev_week);
        setImprovement(improvementValue);

        const weeklyAvg = cycleScore / 7;
        const weeklyPerc = (cycleScore / (4 * 7)) * 100;
        setAvgWeeklyLevel(weeklyAvg);
        setWeeklyPercentage(weeklyPerc);

      } catch (error: any) {
        console.error("Error fetching habit details:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHabitData();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;

    try {
      const { error } = await supabase.from("habits").delete().eq("id", id);
      if (error) throw error;
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error deleting habit:", error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!habit) {
    return <div>Habit not found.</div>;
  }
  
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const maxScore = daysInMonth * 4;
  const percentage = maxScore > 0 ? Math.round((monthlyScore / maxScore) * 100) : 0;

  const formatTooltipLabel = (label: number) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    
    if (label === today.getDate()) {
      return 'Today';
    }
    if (label === yesterday.getDate()) {
      return 'Yesterday';
    }

    return `Day ${label}`;
  };

  return (
    <Card>
        <CardHeader>
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle>{habit.name}</CardTitle>
                    <CardDescription>
                    Created on: {new Date(habit.created_at).toLocaleDateString('en-GB')}
                    </CardDescription>
                </div>
            </div>
        </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Monthly Score</h3>
          <p className="text-2xl font-bold">{monthlyScore} / {maxScore}</p>
          <Progress value={percentage} className="mt-2" />
          <p className="text-sm text-muted-foreground mt-2">You are at {percentage}% of your monthly goal!</p>
        </div>

        <Collapsible>
            <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between cursor-pointer py-2 border-y">
                    <h3 className="text-lg font-medium">Habit Weekly Stats</h3>
                    <div className="flex items-center">
                        <div className={`text-sm font-bold flex items-center mr-2 ${improvement > 0 ? 'text-green-500' : 'text-red-500'}`}>
                            <TrendingUp className="w-4 h-4 mr-1" />
                            {improvement > 0 ? '+' : ''}{improvement}%
                        </div>
                        <ChevronsUpDown className="h-4 w-4" />
                    </div>
                </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <span style={{ color: habit.color, fontSize: '1rem' }} className="mr-2">●</span>
                        <span className="font-medium">{habit.name}</span>
                    </div>
                    <div className="text-right">
                        <div className="font-bold">{weeklyPercentage.toFixed(0)}% this week</div>
                        <div className="text-sm text-muted-foreground">Avg level: {avgWeeklyLevel.toFixed(1)} / 4</div>
                    </div>
                </div>
                <Progress value={weeklyPercentage} className="w-full mt-2" />
            </CollapsibleContent>
        </Collapsible>

        <div>
            <h3 className="text-lg font-medium">Monthly Progress</h3>
            <div className="h-64 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis domain={[0, 4]} />
                    <Tooltip labelFormatter={formatTooltipLabel} />
                    <Line type="monotone" dataKey="score" stroke={habit.color || '#8884d8'} strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
      </CardContent>
      <CardFooter>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete Habit</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                habit and all of its data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default HabitDetail;
