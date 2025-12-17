
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, Flame, Trophy, TrendingUp, MoreHorizontal, Archive } from 'lucide-react';
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/AuthProvider";
import AddHabit from "@/components/AddHabit";
import EditHabit from "@/components/EditHabit";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const HabitCard = ({ habit, onDelete, onEdit, onLogEffort, onArchive }) => (
  <Card style={{ backgroundColor: habit.color }} className="flex flex-col justify-between text-white">
    <CardHeader>
      <div className="flex items-center justify-between">
        <Link to={`/habit/${habit.id}`} className="flex items-center gap-2">
          <span className="text-2xl">{habit.icon}</span>
          <CardTitle className="text-lg">{habit.name}</CardTitle>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 text-white">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(habit)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(habit.id)}>
              Delete
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onArchive(habit.id)}>
              <Archive className="mr-2 h-4 w-4" />
              Archive
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </CardHeader>
    <CardContent>
      <div className="h-24 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={habit.history}>
            <XAxis dataKey="day" stroke="#fff" fontSize={12} tickLine={false} axisLine={false} interval={0} />
            <Tooltip
              contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', color: '#fff' }}
              labelStyle={{ color: '#888' }}
            />
            <Line type="monotone" dataKey="score" stroke="#fff" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm text-zinc-200">Log your effort:</p>
        <div className="text-sm font-bold flex items-center">
            <TrendingUp className="w-4 h-4 mr-1" />
            {habit.improvement > 0 ? '+' : ''}{habit.improvement}%
        </div>
      </div>
      <div className="flex justify-around">
        {[1, 2, 3, 4].map(level => (
          <Button key={level} variant="outline" size="sm" className={`w-10 h-10 rounded-full bg-transparent border-white hover:bg-white/10 text-white ${habit.effortLevel === level ? 'bg-black/30' : ''}`} onClick={() => onLogEffort(habit, level)}>
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
  const [greeting, setGreeting] = useState('');
  const [stats, setStats] = useState({
    todayScore: 0,
    currentStreak: 0,
    cycleScore: 0,
    improvement: 0,
  });
  const [editingHabit, setEditingHabit] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [reflection, setReflection] = useState("");
  const [chartData, setChartData] = useState([]);
  const [selectedColor, setSelectedColor] = useState('#8884d8');

  const processData = useCallback((completions, habits) => {
    const today = new Date().toISOString().slice(0, 10);
    const todayCompletions = completions.filter(c => c.completion_date === today);
    const todayScore = todayCompletions.reduce((acc, curr) => acc + curr.effort_level, 0);

    const completionDates = new Set(completions.map(c => c.completion_date));
    let currentStreak = 0;
    let checkDate = new Date();
    
    if (!completionDates.has(checkDate.toISOString().slice(0, 10))) {
        checkDate.setDate(checkDate.getDate() - 1);
    }

    while (completionDates.has(checkDate.toISOString().slice(0, 10))) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
    }

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
    const totalM_current_week = M_per_habit * habits.length;
    const totalM_prev_week = M_per_habit * habits.length;

    const overallCompletionRate = totalM_current_week > 0 ? (cycleScore / totalM_current_week) * 100 : 0;
    const overallCompletionRate_prev_week = totalM_prev_week > 0 ? (lastWeekScore / totalM_prev_week) * 100 : 0;

    const improvement = overallCompletionRate - overallCompletionRate_prev_week;

    setStats({
      todayScore: todayScore,
      currentStreak: currentStreak,
      cycleScore: cycleScore,
      improvement: Math.round(improvement),
    });

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const newChartData = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        const dayStr = date.toISOString().slice(0, 10);
        const dayName = days[date.getDay()];
        const score = completions.filter(c => c.completion_date === dayStr).reduce((acc, curr) => acc + curr.effort_level, 0);
        return { day: dayName, score };
    });

    setChartData(newChartData);
  }, []);

  useEffect(() => {
    const updateGreeting = () => {
      const user = session?.user;
      const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0];

      if (displayName) {
        const hour = new Date().getHours();
        if (hour >= 4 && hour < 12) {
          setGreeting(`Good Morning, ${displayName}!`);
        } else if (hour >= 12 && hour < 18) {
          setGreeting(`Good Afternoon, ${displayName}!`);
        } else {
          setGreeting(`Good Evening, ${displayName}!`);
        }
      } else {
        setGreeting('Welcome to your Dashboard!');
      }
    };

    if (session) {
      updateGreeting();
    }
    const intervalId = setInterval(updateGreeting, 60000);

    return () => clearInterval(intervalId);
  }, [session]);

  const fetchData = useCallback(async () => {
    if (!session) return;

    const { data: completions, error } = await supabase
      .from('habit_completions')
      .select('completion_date, effort_level, habit_id')
      .eq('user_id', session.user.id);

    if (error) {
      console.error('Error fetching habit completions:', error);
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const { data: habits, error: habitsError } = await supabase
      .from('habits')
      .select('id, name, icon, color, created_at, user_id, is_archived, habit_completions (id, completion_date, effort_level)')
      .eq('user_id', session.user.id)
      .eq('habit_completions.completion_date', today)
      .eq('is_archived', false);

    if (habitsError) {
      console.error('Error fetching habits:', habitsError);
    } else {
        const habitsWithCompletionStatus = habits.map(habit => {
        const habitCompletions = completions.filter(c => c.habit_id === habit.id);

        // Improvement calculation
        const todayDate = new Date();
        const dayOfWeek = todayDate.getDay();
        const startOfWeek = new Date(todayDate);
        startOfWeek.setDate(todayDate.getDate() - dayOfWeek);

        const datesOfWeek = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            return date.toISOString().slice(0, 10);
        });
        const currentWeekCompletions = habitCompletions.filter(c => datesOfWeek.includes(c.completion_date));
        const cycleScore = currentWeekCompletions.reduce((acc, curr) => acc + curr.effort_level, 0);

        const startOfLastWeek = new Date(startOfWeek);
        startOfLastWeek.setDate(startOfWeek.getDate() - 7);
        const datesOfLastWeek = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(startOfLastWeek);
            date.setDate(startOfLastWeek.getDate() + i);
            return date.toISOString().slice(0, 10);
        });
        const lastWeekCompletions = habitCompletions.filter(c => datesOfLastWeek.includes(c.completion_date));
        const lastWeekScore = lastWeekCompletions.reduce((acc, curr) => acc + curr.effort_level, 0);

        const T = 7;
        const M_per_habit = 4 * T;

        const overallCompletionRate = M_per_habit > 0 ? (cycleScore / M_per_habit) * 100 : 0;
        const overallCompletionRate_prev_week = M_per_habit > 0 ? (lastWeekScore / M_per_habit) * 100 : 0;

        const improvement = Math.round(overallCompletionRate - overallCompletionRate_prev_week);

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const history = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            const dayStr = date.toISOString().slice(0, 10);
            const dayName = days[date.getDay()];
            const completion = habitCompletions.find(c => c.completion_date === dayStr);
            return { day: dayName, score: completion ? completion.effort_level : 0 };
        });

        return {
            ...habit,
            completed: habit.habit_completions.length > 0,
            effortLevel: habit.habit_completions.length > 0 ? habit.habit_completions[0].effort_level : 0,
            history,
            improvement, // new prop
        };
        });
      setHabits(habitsWithCompletionStatus);
      processData(completions, habitsWithCompletionStatus);
    }
  }, [session, processData]);

  useEffect(() => {
    if (session) {
      fetchData();
    }

    const habitSubscription = supabase
      .channel('public:habits')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'habits' }, () => {
        fetchData();
      })
      .subscribe();

    const completionSubscription = supabase
      .channel('public:habit_completions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'habit_completions' }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(habitSubscription);
      supabase.removeChannel(completionSubscription);
    };
  }, [session, fetchData]);

  const handleDelete = async (habitId) => {
    if (!window.confirm("Are you sure you want to delete this habit?")) return;
    try {
      const { error } = await supabase.from("habits").delete().eq("id", habitId);
      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error("Error deleting habit:", error.message);
    }
  };

  const handleArchive = async (habitId) => {
    if (!window.confirm("Are you sure you want to archive this habit?")) return;
    try {
      const { error } = await supabase.from("habits").update({ is_archived: true }).eq("id", habitId);
      if (error) throw error;
    } catch (error) {
      console.error("Error archiving habit:", error.message);
    }
  };

  const handleEdit = (habit) => {
    setEditingHabit(habit);
    setIsEditModalOpen(true);
  };

  const handleLogEffort = async (habit, effortLevel) => {
    setSelectedColor(habit.color);
    if (!session) return;
    const todayISO = new Date().toISOString().slice(0, 10);
    try {
      const { error } = await supabase
        .from("habit_completions")
        .upsert(
          {
            habit_id: habit.id,
            user_id: session.user.id,
            completion_date: todayISO,
            effort_level: effortLevel,
          },
          { onConflict: 'habit_id, completion_date' }
        );
      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error("Error logging habit effort:", error.message);
    }
  };

  const handleSaveReflection = async () => {
    if (!session || !reflection.trim()) return;

    try {
      const { error } = await supabase.from("journal_entries").insert([
        {
          user_id: session.user.id,
          content: reflection,
        },
      ]);

      if (error) throw error;
      setReflection(""); // Clear the textarea after saving
    } catch (error) {
      console.error("Error saving reflection:", error.message);
    }
  };

  const quickStats = [
    { title: "Today's Score", value: stats.todayScore, icon: Calendar, color: "text-blue-500" },
    { title: "Current Streak", value: `${stats.currentStreak} Days`, icon: Flame, color: "text-orange-500" },
    { title: "Cycle Score", value: stats.cycleScore, icon: Trophy, color: "text-yellow-500" },
    { title: "Improvement", value: `${stats.improvement > 0 ? '+' : ''}${stats.improvement}%`, icon: TrendingUp, color: "text-green-500", link: "/improvement" },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">{greeting}</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickStats.map(stat => {
          const card = (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );

          if (stat.link) {
            return (
              <Link to={stat.link} key={stat.title}>
                {card}
              </Link>
            );
          }

          return <div key={stat.title}>{card}</div>;
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Today's Habits</h2>
            <AddHabit onHabitAdded={fetchData} />
          </div>
          {habits.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {habits.map(habit => (
                <HabitCard key={habit.id} habit={habit} onDelete={handleDelete} onEdit={handleEdit} onLogEffort={handleLogEffort} onArchive={handleArchive} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">You haven't added any habits yet.</p>
              <p className="text-muted-foreground">Click the "Add New Habit" button to get started.</p>
            </div>
          )}
        </div>

        <Card className="bg-gradient-to-br from-purple-50 to-indigo-100 text-zinc-800 dark:from-purple-900/20 dark:to-indigo-900/20 dark:text-zinc-50">
          <CardHeader>
            <CardTitle>AI Daily Reflection</CardTitle>
            <CardDescription className="text-zinc-600 dark:text-zinc-400">Your AI companion's thoughts on your progress.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm italic text-zinc-500 dark:text-zinc-400">
              "Great job on staying consistent with your morning routine! Remember, every small step builds significant momentum. What was one thing that went well today?"
            </p>
            <Textarea
              placeholder="Write your thoughts and insights here..."
              className="bg-black/5 dark:bg-black/20"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
            />
            <Button className="w-full" onClick={handleSaveReflection}>Save Reflection</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>7-Day Progress</CardTitle>
          <CardDescription>Your habit score trend over the last week.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorScoreDashboard" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={selectedColor} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={selectedColor} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                <Area type="monotone" dataKey="score" stroke={selectedColor} strokeWidth={2} fillOpacity={1} fill="url(#colorScoreDashboard)" activeDot={{ r: 8 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      {editingHabit && (
        <EditHabit
          habit={editingHabit}
          onHabitUpdated={fetchData}
          isOpen={isEditModalOpen}
          setIsOpen={setIsEditModalOpen}
        />
      )}
    </div>
  );
};

export default Dashboard;
