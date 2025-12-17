import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "./AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const habits = [
  "Daily Exercise",
  "Drink Sufficient Water",
  "Consistent Sleep Schedule",
  "Healthy Eating Habits",
  "Stretching or Mobility Routine",
  "Meditation or Mindfulness Practice",
  "Journaling or Gratitude Logging",
  "Screen-Free Wind Down Before Bed",
  "Daily Mood Check-In / Reflection",
  "Deep Breathing or Relaxation Exercises",
  "Reading or Learning",
  "Study or Skill Practice",
  "Planning the Day or Setting Priorities",
  "Decluttering / Organizing a Space",
  "Budgeting or Expense Tracking",
  "Connect With a Friend or Loved One",
  "Acts of Kindness or Volunteering",
  "Express Gratitude to Someone",
  "Check In/Encourage an Accountability Buddy",
  "Outdoor Time (Fresh Air, Sunlight, Gentle Walk)",
  "Porn Addiction",
  "Betting",
  "Workout",
  "Doom Scrolling",
];

const AddHabit = ({ onHabitAdded }: { onHabitAdded: () => void }) => {
  const { session } = useAuth();
  const [habitName, setHabitName] = useState("");
  const [icon, setIcon] = useState("");
  const [color, setColor] = useState("#e5e7eb");
  const [isOpen, setIsOpen] = useState(false);

  const handleAddHabit = async () => {
    if (!session || !habitName) return;

    const {
      error,
    } = await supabase
      .from("habits")
      .insert([{ name: habitName, icon, color, user_id: session.user.id }]);

    if (error) {
      console.error("Error adding habit:", error.message);
      alert(`Error adding habit: ${error.message}`);
    } else {
      onHabitAdded();
      setIsOpen(false);
      setHabitName("");
      setIcon("");
      setColor("#e5e7eb");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add New Habit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a New Habit</DialogTitle>
          <DialogDescription>
            What habit would you like to track?
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Select onValueChange={setHabitName} value={habitName}>
            <SelectTrigger>
              <SelectValue placeholder="Select a habit" />
            </SelectTrigger>
            <SelectContent>
              {habits.map((habit) => (
                <SelectItem key={habit} value={habit}>
                  {habit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Or type a custom habit"
            value={habitName}
            onChange={(e) => setHabitName(e.target.value)}
          />
          <Input
            placeholder="Icon (e.g., 💪)"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
          />
          <Input
            type="color"
            placeholder="Color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleAddHabit}>Add Habit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddHabit;
