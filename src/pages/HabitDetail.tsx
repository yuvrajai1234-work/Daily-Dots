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

const HabitDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [habit, setHabit] = useState<Habit | null>(null);
  const [loading, setLoading] = useState(true);
  const [monthlyScore, setMonthlyScore] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>{habit.name}</CardTitle>
        <CardDescription>
          Created on: {new Date(habit.created_at).toLocaleDateString('en-GB')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Monthly Score</h3>
          <p className="text-2xl font-bold">{monthlyScore} / {maxScore}</p>
          <Progress value={percentage} className="mt-2" />
          <p className="text-sm text-muted-foreground mt-2">You are at {percentage}% of your monthly goal!</p>
        </div>
        <div>
            <h3 className="text-lg font-medium">Monthly Progress</h3>
            <div className="h-64 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis domain={[0, 4]} />
                    <Tooltip />
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
