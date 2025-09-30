import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { Habit } from "./Habits";

interface EditHabitProps {
  habit: Habit | null;
  isOpen: boolean;
  onClose: () => void;
  onHabitUpdated: () => void;
}

const EditHabit: React.FC<EditHabitProps> = ({ habit, isOpen, onClose, onHabitUpdated }) => {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [color, setColor] = useState("");

  useEffect(() => {
    if (habit) {
      setName(habit.name);
      setIcon(habit.icon || "");
      setColor(habit.color || "");
    }
  }, [habit]);

  const handleUpdateHabit = async () => {
    if (!habit) return;

    try {
      const { error } = await supabase
        .from("habits")
        .update({ name, icon, color })
        .eq("id", habit.id);

      if (error) {
        throw error;
      }

      onHabitUpdated();
      onClose();
    } catch (error: any) {
      console.error("Error updating habit:", error.message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Habit</DialogTitle>
          <DialogDescription>
            Update the details of your habit.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Habit name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Icon (e.g., 
💪)"
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
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleUpdateHabit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditHabit;