
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
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthProvider";
import { useEffect, useState, useCallback } from "react";
import AddHabit from "./AddHabit";
import EditHabit from "./EditHabit";
import { MoreHorizontal, Archive, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import ArchivedHabitsTable from './ArchivedHabitsTable';

// Updated Habit type to match new schema
export type Habit = {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  created_at: string;
  user_id: string;
  is_archived: boolean;
};

// New HabitCompletion type
export type HabitCompletion = {
  id: string;
  habit_id: string;
  completion_date: string;
  effort_level: number;
};

const Habits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [archivedHabits, setArchivedHabits] = useState<Habit[]>([]);
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
        .select("id, name, icon, color, created_at, user_id, is_archived")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      const activeHabits = data.filter(habit => !habit.is_archived);
      const archived = data.filter(habit => habit.is_archived);
      setHabits(activeHabits || []);
      setArchivedHabits(archived || []);
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

  const handleDelete = async (habitId: string) => {
    if (!window.confirm("Are you sure you want to delete this habit?")) return;

    try {
      const { error } = await supabase.from("habits").delete().eq("id", habitId);
      if (error) throw error;
      fetchHabits(); // Refresh the list
    } catch (error: any) {
      console.error("Error deleting habit:", error.message);
    }
  };

  const handleArchive = async (habitId: string) => {
    if (!window.confirm("Are you sure you want to archive this habit?")) return;

    try {
      const { error } = await supabase
        .from("habits")
        .update({ is_archived: true })
        .eq("id", habitId);

      if (error) throw error;
      fetchHabits(); // Refresh the list
    } catch (error: any) {
      console.error("Error archiving habit:", error.message);
    }
  };

  const handleUnarchive = async (habitId: string) => {
    try {
      const { error } = await supabase
        .from('habits')
        .update({ is_archived: false })
        .eq('id', habitId);
      if (error) throw error;
      fetchHabits();
    } catch (error: any) {
      console.error('Error unarchiving habit:', error.message);
    }
  };

  const handleEffortChange = async (habitId: string, effortLevel: string) => {
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
          { onConflict: "habit_id, completion_date" }
        );

      if (error) throw error;
      fetchHabitCompletions();
    } catch (error: any) {
      console.error("Error logging habit effort:", error.message);
    }
  };

  const getHabitEffortLevel = (habitId: string) => {
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
                    <Link to={`/habit/${habit.id}`} className="flex items-center">
                      {habit.icon && <span className="mr-2">{habit.icon}</span>}
                      {habit.name}
                    </Link>
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
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleArchive(habit.id)}>
                            <Archive className="mr-2 h-4 w-4" />
                            Archive
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(habit.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
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
       {archivedHabits.length > 0 && (
        <div className="mt-8">
          <ArchivedHabitsTable archivedHabits={archivedHabits} onUnarchive={handleUnarchive} />
        </div>
      )}
      {selectedHabit && (
        <EditHabit
          habit={selectedHabit}
          isOpen={isEditDialogOpen}
          onClose={handleCloseDialog}
          onHabitUpdated={fetchHabits}
        />
      )}
    </>
  );
};

export default Habits;
