import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client"; // Corrected Supabase client
import { useAuth } from "./AuthProvider";
import { useEffect, useState, useCallback } from "react";
import AddHabit from "./AddHabit";
import EditHabit from "./EditHabit";
import { MoreHorizontal } from "lucide-react";

// Updated Habit type to match new schema
export type Habit = {
  id: number;
  name: string;
  icon: string | null;
  color: string | null;
  created_at: string;
  user_id: string;
};

// New HabitCompletion type
export type HabitCompletion = {
  id: number;
  habit_id: number;
  completion_date: string;
  effort_level: number;
};

const Habits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitCompletions, setHabitCompletions] = useState<HabitCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const { session } = useAuth();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

  const fetchHabits = useCallback(async () => {
    if (!session) return;

    try {
      setLoading(true);
      // Fetched corrected columns
      const { data, error } = await supabase
        .from("habits")
        .select("id, name, icon, color, created_at, user_id")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setHabits(data || []);
    } catch (error: any) {
      console.error("Error fetching habits:", error.message);
    } finally {
      setLoading(false);
    }
  }, [session]);

  const fetchHabitCompletions = useCallback(async () => {
    if (!session) return;
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    try {
      // Fetched from habit_completions table
      const { data, error } = await supabase
        .from("habit_completions")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("completion_date", today);

      if (error) throw error;
      setHabitCompletions(data || []);
    } catch (error: any) {
      console.error("Error fetching habit completions:", error.message);
    }
  }, [session]);

  useEffect(() => {
    fetchHabits();
    fetchHabitCompletions();
  }, [fetchHabits, fetchHabitCompletions]);

  const handleEditClick = (habit: Habit) => {
    setSelectedHabit(habit);
    setIsEditDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedHabit(null);
    setIsEditDialogOpen(false);
  };

  const handleDelete = async (habitId: number) => {
    if (!window.confirm("Are you sure you want to delete this habit?")) return;

    try {
      const { error } = await supabase.from("habits").delete().eq("id", habitId);
      if (error) throw error;
      fetchHabits(); // Refresh the list
    } catch (error: any) {
      console.error("Error deleting habit:", error.message);
    }
  };

  // Renamed and updated to handle effort_level
  const handleEffortChange = async (habitId: number, effortLevel: string) => {
    if (!session) return;
    const today = new Date().toISOString().slice(0, 10);
    const effortNum = parseInt(effortLevel);

    try {
      const { error } = await supabase
        .from("habit_completions")
        .upsert(
          {
            habit_id: habitId,
            user_id: session.user.id,
            completion_date: today,
            effort_level: effortNum,
          },
          { onConflict: 'habit_id, completion_date' }
        );

      if (error) throw error;
      fetchHabitCompletions();
    } catch (error: any) {
      console.error("Error logging habit effort:", error.message);
    }
  };

  const getHabitEffortLevel = (habitId: number) => {
    const completion = habitCompletions.find(
      (comp) => comp.habit_id === habitId
    );
    return completion ? completion.effort_level.toString() : undefined;
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>My Habits</CardTitle>
            <CardDescription>Log your daily effort for each habit.</CardDescription>
          </div>
          <AddHabit onHabitAdded={fetchHabits} />
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading habits...</p>
          ) : habits.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-lg">You haven't added any habits yet.</p>
              <p className="text-sm text-muted-foreground">Click "Add New Habit" to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Habit</TableHead>
                  <TableHead>Today's Effort</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {habits.map((habit) => (
                  <TableRow key={habit.id}>
                    <TableCell className="font-medium">
                      <span className="flex items-center">
                        {habit.icon && <span className="mr-2">{habit.icon}</span>}
                        {habit.name}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Select
                        onValueChange={(value) => handleEffortChange(habit.id, value)}
                        value={getHabitEffortLevel(habit.id)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Log your effort" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Low</SelectItem>
                          <SelectItem value="2">Medium</SelectItem>
                          <SelectItem value="3">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditClick(habit)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(habit.id)}>
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <EditHabit
        habit={selectedHabit}
        isOpen={isEditDialogOpen}
        onClose={handleCloseDialog}
        onHabitUpdated={fetchHabits}
      />
    </>
  );
};

export default Habits;