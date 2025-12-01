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

const HabitDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [habit, setHabit] = useState<Habit | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHabit = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("habits")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setHabit(data);
      } catch (error: any) {
        console.error("Error fetching habit details:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHabit();
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>{habit.name}</CardTitle>
        <CardDescription>
          Created on: {new Date(habit.created_at).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Details about the habit will go here.</p>
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
