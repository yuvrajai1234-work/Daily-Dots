
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, Flame, Trophy, TrendingUp } from 'lucide-react';
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/AuthProvider";
import AddHabit from "@/components/AddHabit";
import { supabase } from "@/integrations/supabase/client";

const quickStats = [
  { title: "Today's Score", value: "0", icon: Calendar, color: "text-blue-500" },
  { title: "Current Streak", value: "0 Days", icon: Flame, color: "text-orange-500" },
  { title: "Cycle Score", value: "0", icon: Trophy, color: "text-yellow-500" },
  { title: "Improvement", value: "+0%", icon: TrendingUp, color: "text-green-500" },
];

const chartData = [
  { day: 'Mon', score: 0 },
  { day: 'Tue', score: 0 },
  { day: 'Wed', score: 0 },
  { day: 'Thu', score: 0 },
  { day: 'Fri', score: 0 },
  { day: 'Sat', score: 0 },
  { day: 'Sun', score: 0 },
];

const HabitCard = ({ habit }) => (
    <Card style={{ backgroundColor: habit.color }} className="flex flex-col justify-between text-white">
    <CardHeader>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{habit.icon}</span>
          <CardTitle className="text-lg">{habit.name}</CardTitle>
        </div>
        <div className={`w-4 h-4 rounded-full ${habit.completed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-zinc-200 mb-2">Log your effort:</p>
      <div className="flex justify-around">
        {[1, 2, 3, 4].map(level => (
          <Button key={level} variant="outline" size="sm" className="w-10 h-10 rounded-full bg-transparent border-white hover:bg-white/10 text-white">
            {level}
          </Button>
        ))}
      </div>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { session } = useAuth();
  const [habits, setHabits] = useState([]);

  const fetchHabits = useCallback(async () => {
    if (!session) return;

    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('habits')
      .select(`
        *,
        habit_completions (
          id,
          completion_date
        )
      `)
      .eq('user_id', session.user.id)
      .eq('habit_completions.completion_date', today);

    if (error) {
      console.error('Error fetching habits:', error);
    } else {
      const habitsWithCompletionStatus = data.map(habit => ({
        ...habit,
        completed: habit.habit_completions.length > 0,
      }));
      setHabits(habitsWithCompletionStatus);
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      fetchHabits();
    }
  }, [session, fetchHabits]);

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickStats.map(stat => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's Habits */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Today's Habits</h2>
            <AddHabit onHabitAdded={fetchHabits} />
          </div>
          {habits.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {habits.map(habit => (
                <HabitCard key={habit.id} habit={habit} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">You haven't added any habits yet.</p>
              <p className="text-muted-foreground">Click the "Add New Habit" button to get started.</p>
            </div>
          )}
        </div>

        {/* AI Daily Reflection */}
        <Card className="bg-gradient-to-br from-purple-50 to-indigo-100 text-zinc-800 dark:from-purple-900/20 dark:to-indigo-900/20 dark:text-zinc-50">
          <CardHeader>
            <CardTitle>AI Daily Reflection</CardTitle>
            <CardDescription className="text-zinc-600 dark:text-zinc-400">Your AI companion's thoughts on your progress.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm italic text-zinc-500 dark:text-zinc-400">
              "Great job on staying consistent with your morning routine! Remember, every small step builds significant momentum. What was one thing that went well today?"
            </p>
            <Textarea placeholder="Write your thoughts and insights here..." className="bg-black/5 dark:bg-black/20" />
            <Button className="w-full">Save Reflection</Button>
          </CardContent>
        </Card>
      </div>

      {/* 7-Day Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle>7-Day Progress</CardTitle>
          <CardDescription>Your habit score trend over the last week.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
