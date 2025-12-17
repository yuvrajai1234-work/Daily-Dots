
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Input } from "./ui/input";

const EditHabit = ({ habit, onHabitUpdated, isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("");
  const [color, setColor] = useState("");

  useEffect(() => {
    if (habit) {
      setName(habit.name || "");
      setEmoji(habit.icon || "");
      setColor(habit.color || "#ffffff");
    }
  }, [habit]);

  const handleUpdate = async () => {
    if (!habit) return;

    try {
      const { error } = await supabase
        .from("habits")
        .update({ name, icon: emoji, color })
        .eq("id", habit.id);

      if (error) throw error;
      onHabitUpdated();
      onClose();
    } catch (error) {
      console.error("Error updating habit:", error.message);
    }
  };

  if (!habit) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Habit</DialogTitle>
          <DialogDescription>
            Update the details of your habit.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="name">Habit Name</label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Drink Water"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="emoji">Emoji Icon</label>
            <Input
              id="emoji"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              placeholder="e.g., 💧"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="color">Color</label>
            <Input
              id="color"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleUpdate}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditHabit;
