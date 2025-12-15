import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { subDays, format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Edit, Trash2, Archive, MoreHorizontal, ArchiveRestore } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const predefinedHabits = [
  "Drink Sufficient Water",
  "Stretching or Mobility Routine",
  "Read for 15 Minutes",
  "Go for a Walk",
  "Practice Mindfulness or Meditation",
  "No Sugar",
  "Eat a Healthy Meal",
  "Review Daily Goals",
];

const AnalyticsPage = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [habits, setHabits] = useState([]);
  const [archivedHabits, setArchivedHabits] = useState([]);
  const [totalHabits, setTotalHabits] = useState(0);
  const [totalHabitPoints, setTotalHabitPoints] = useState(0);
  const [habitPointsBreakdown, setHabitPointsBreakdown] = useState([]);
  const [refreshCount, setRefreshCount] = useState(0);
  const [isAddHabitDialogOpen, setIsAddHabitDialogOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState("");
  const [customHabit, setCustomHabit] = useState("");
  const [habitIcon, setHabitIcon] = useState("");
  const [habitGoal, setHabitGoal] = useState([50]);

  useEffect(() => {
    const fetchData = async () => {
      if (!session) return;
      setLoading(true);

      const { data: habitsData, error: habitsError } = await supabase
        .from('habits')
        .select('id, name')
        .eq('user_id', session.user.id)
        .eq('is_archived', false);

      const { data: completionsData, error: completionsError } = await supabase
        .from('habit_completions')
        .select('habit_id, effort_level')
        .eq('user_id', session.user.id);

      if (habitsData && habitsData.length > 0) {
        setHabits(habitsData);
        setTotalHabits(habitsData.length);

        if (completionsData) {
          const pointsBreakdown = habitsData.map(habit => ({
            ...habit,
            points: completionsData
              .filter(c => c.habit_id === habit.id)
              .reduce((sum, c) => sum + c.effort_level, 0)
          }));
          setHabitPointsBreakdown(pointsBreakdown);

          const totalPoints = pointsBreakdown.reduce((sum, habit) => sum + habit.points, 0);
          setTotalHabitPoints(totalPoints);
        }
      } else {
        const mockHabits = [
          { id: 'mock1', name: 'Stretching or Mobility Routine', points: 22 },
          { id: 'mock2', name: 'Drink Sufficient Water', points: 16 },
        ];
        setHabits(mockHabits);
        setTotalHabits(2);
        setTotalHabitPoints(38);
        setHabitPointsBreakdown(mockHabits);
      }

      const chartApiData = [];
      for (let i = 6; i >= 0; i--) {
        const date = subDays(new Date(), i);
        const dateString = format(date, 'MMM dd');
        let score = 0;

        if (completionsData && completionsData.length > 0) {
            const dailyCompletions = completionsData.filter(c => format(new Date(c.completion_date), 'MMM dd') === dateString);
            score = dailyCompletions.reduce((acc, curr) => acc + curr.effort_level, 0);
        } else if ((habitsData && habitsData.length === 0) || !habitsData) {
            if(i === 6) score = 5;
            if(i === 5) score = 8;
            if(i === 4) score = 3;
            if(i === 3) score = 7;
            if(i === 2) score = 6;
            if(i === 1) score = 9;
            if(i === 0) score = 4;
        }
        chartApiData.push({ date: dateString, score });
      }
      setChartData(chartApiData);

      const { data: archivedData, error: archivedError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('is_archived', true);
      if(archivedData) setArchivedHabits(archivedData);

      setLoading(false);
    };

    fetchData();
  }, [session, refreshCount]);

  const handleAddHabit = () => {
    setSelectedHabit("");
    setCustomHabit("");
    setHabitIcon("");
    setHabitGoal([50]);
    setIsAddHabitDialogOpen(true);
  };
  
  const handleSaveHabit = async () => {
    const habitName = customHabit.trim() || selectedHabit;
    if (!habitName) {
        alert("Please select or type a habit.");
        return;
    }

    const { error } = await supabase.from('habits').insert([
        { name: habitName, user_id: session.user.id, description: habitIcon, goal: habitGoal[0] }
    ]);

    if (error) {
        alert(`Error adding habit: ${error.message}`);
    } else {
        setIsAddHabitDialogOpen(false);
        setRefreshCount(c => c + 1);
    }
  };

  const handleEditHabit = (id) => {
    if (String(id).startsWith('mock')) return alert("This is a sample habit and cannot be edited.");
    navigate(`/edit-habit/${id}`);
  }

  const handleDeleteHabit = async (id) => {
    if (String(id).startsWith('mock')) return alert("This is a sample habit and cannot be deleted.");
    if (window.confirm("Are you sure you want to delete this habit? This will also delete all its completion records.")) {
      const { error: completionsError } = await supabase.from('habit_completions').delete().eq('habit_id', id);
      if (completionsError) return alert(`Error deleting habit history: ${completionsError.message}`);

      const { error: habitError } = await supabase.from('habits').delete().eq('id', id);
      if (habitError) alert(`Error deleting habit: ${habitError.message}`);
      else setRefreshCount(c => c + 1);
    }
  };

  const handleArchiveHabit = async (id) => {
    if (String(id).startsWith('mock')) return alert("This is a sample habit and cannot be archived.");
    if (window.confirm("Are you sure you want to archive this habit?")) {
      const { error } = await supabase.from('habits').update({ is_archived: true }).eq('id', id);
      if (error) alert(`Error archiving habit: ${error.message}`);
      else setRefreshCount(c => c + 1);
    }
  };
  
  const handleUnarchiveHabit = async (id) => {
    if (window.confirm("Are you sure you want to restore this habit?")) {
        const { error } = await supabase.from('habits').update({ is_archived: false }).eq('id', id);
        if (error) {
            alert(`Error restoring habit: ${error.message}`);
        } else {
            setRefreshCount(c => c + 1);
        }
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
       <Card className="bg-gray-800 text-white">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Total Habits</CardTitle>
            <span className="text-2xl font-bold">{totalHabits}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <CardTitle className="text-lg">Total Habit Points</CardTitle>
            <span className="text-2xl font-bold">{totalHabitPoints}</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {habitPointsBreakdown.map((habit, index) => (
              <div key={habit.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-12 h-8 rounded-md flex items-center justify-center mr-4 ${index % 2 === 0 ? 'bg-yellow-500' : 'bg-blue-500'} text-white font-bold`}>
                    {habit.points}
                  </div>
                  <span className="text-gray-300">{habit.name}</span>
                </div>
                <span className="font-semibold text-white">{habit.points}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daily Habit Score</CardTitle>
          <CardDescription>Your combined effort score over the last 7 days.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading chart data...</p>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                <Area type="monotone" dataKey="score" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Manage Habits</CardTitle>
            <CardDescription>Add, edit, or remove your current habits.</CardDescription>
          </div>
          <Button onClick={handleAddHabit}><PlusCircle className="mr-2 h-4 w-4" /> Add New Habit</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {habits.map(habit => (
              <div key={habit.id} className="flex items-center justify-between p-2 rounded-lg border border-gray-700 hover:bg-gray-700">
                <span className="text-white">{habit.name}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onSelect={() => handleEditHabit(habit.id)}>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleDeleteHabit(habit.id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleArchiveHabit(habit.id)}>
                      <Archive className="mr-2 h-4 w-4" />
                      <span>Archive</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isAddHabitDialogOpen} onOpenChange={setIsAddHabitDialogOpen}>
        <DialogContent className="bg-gray-800 text-white border-gray-700">
            <DialogHeader>
                <DialogTitle>Add a New Habit</DialogTitle>
                <DialogDescription>What habit would you like to track?</DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
                <Select onValueChange={(value) => { setSelectedHabit(value); setCustomHabit(''); }}>
                    <SelectTrigger className="w-full bg-gray-700 border-purple-500">
                        <SelectValue placeholder="Select a habit" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 text-white">
                        {predefinedHabits.map(habit => (
                            <SelectItem key={habit} value={habit}>{habit}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <div className="text-center text-gray-400">Or type a custom habit</div>

                <Input 
                    placeholder="Or type a custom habit"
                    value={customHabit}
                    onChange={(e) => { setCustomHabit(e.target.value); setSelectedHabit(''); }}
                    className="bg-gray-700"
                />
                <Input 
                    placeholder="Icon (e.g., 💪)"
                    value={habitIcon}
                    onChange={(e) => setHabitIcon(e.target.value)}
                    className="bg-gray-700"
                />
                <Slider
                    defaultValue={[50]}
                    max={100}
                    step={1}
                    onValueChange={setHabitGoal}
                    className="[&>span:first-child]:h-full [&>span:first-child]:bg-purple-500"
                />
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleSaveHabit} className="bg-purple-600 hover:bg-purple-700">Add Habit</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
            <CardTitle>Archived & Past Habits</CardTitle>
            <CardDescription>Review your ditched or completed habits from the last 4-week cycle.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Habit</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {archivedHabits.map(habit => (
                        <TableRow key={habit.id}>
                            <TableCell>{habit.name}</TableCell>
                            <TableCell>{habit.is_completed ? "Completed" : "Ditched"}</TableCell>
                            <TableCell className="text-right space-x-2">
                                <Button variant="outline" size="icon" onClick={() => handleUnarchiveHabit(habit.id)}><ArchiveRestore className="h-4 w-4"/></Button>
                                <Button variant="outline" size="icon" onClick={() => handleDeleteHabit(habit.id)}><Trash2 className="h-4 w-4"/></Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
