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
import { supabase } from "@/supabaseClient";
import { useAuth } from "./AuthProvider";
import { useEffect, useState, useCallback } from "react";
import AddHabit from "./AddHabit";
import EditHabit from "./EditHabit";
import { MoreHorizontal } from "lucide-react";

export type Habit = {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  user_id: string;
  level_1_label: string | null;
  level_2_label: string | null;
  level_3_label: string | null;
  level_4_label: string | null;
};

export type HabitLog = {
    id: number;
    habit_id: number;
    date: string;
    level: number;
}

const Habits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { session } = useAuth();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

  const fetchHabits = useCallback(async () => {
    if (!session) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("habits")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setHabits(data || []);
    } catch (error: any) {
      console.error("Error fetching habits:", error.message);
    } finally {
      setLoading(false);
    }
  }, [session]);

  const fetchHabitLogs = useCallback(async () => {
    if (!session) return;
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    try {
        const { data, error } = await supabase
            .from("habit_logs")
            .select("*")
            .eq("user_id", session.user.id)
            .eq("date", today);

        if (error) {
            throw error;
        }

        setHabitLogs(data || []);
    } catch (error: any) {
        console.error("Error fetching habit logs:", error.message);
    }
}, [session]);

  useEffect(() => {
    fetchHabits();
    fetchHabitLogs();
  }, [fetchHabits, fetchHabitLogs]);

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

      if (error) {
        throw error;
      }

      fetchHabits(); // Refresh the list
    } catch (error: any) {
      console.error("Error deleting habit:", error.message);
    }
  };

  const handleLogChange = async (habitId: number, level: string) => {
    if (!session) return;
    const today = new Date().toISOString().slice(0, 10);
    const levelNum = parseInt(level);

    try {
        const { error } = await supabase
            .from("habit_logs")
            .upsert({ habit_id: habitId, user_id: session.user.id, date: today, level: levelNum }, { onConflict: 'habit_id, date' })

        if (error) {
            throw error;
        }

        fetchHabitLogs();
    } catch (error: any) {
        console.error("Error logging habit:", error.message);
    }
  };

  const getHabitLogLevel = (habitId: number) => {
    const log = habitLogs.find(log => log.habit_id === habitId);
    return log ? log.level.toString() : undefined;
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>My Habits</CardTitle>
            <CardDescription>
              Log your daily progress for each habit.
            </CardDescription>
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
                  <TableHead>Today's Progress</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {habits.map((habit) => (
                  <TableRow key={habit.id}>
                    <TableCell className="font-medium">{habit.name}</TableCell>
                    <TableCell>
                        <Select onValueChange={(value) => handleLogChange(habit.id, value)} value={getHabitLogLevel(habit.id)}>
                            <SelectTrigger className="w-[220px]">
                                <SelectValue placeholder="Log your effort" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">{habit.level_1_label || 'Level 1'}</SelectItem>
                                <SelectItem value="2">{habit.level_2_label || 'Level 2'}</SelectItem>
                                <SelectItem value="3">{habit.level_3_label || 'Level 3'}</SelectItem>
                                <SelectItem value="4">{habit.level_4_label || 'Level 4'}</SelectItem>
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
