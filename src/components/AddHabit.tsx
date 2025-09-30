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

const AddHabit = ({ onHabitAdded }: { onHabitAdded: () => void }) => {
  const { session } = useAuth();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [color, setColor] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleAddHabit = async () => {
    if (!session || !name) return;

    try {
      const { error } = await supabase
        .from("habits")
        .insert([{ name, icon, color, user_id: session.user.id }]);

      if (error) {
        throw error;
      }

      onHabitAdded();
      setIsOpen(false);
      setName("");
      setIcon("");
      setColor("");
    } catch (error: any) {
      console.error("Error adding habit:", error.message);
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
          <Input
            placeholder="Habit name (e.g., Exercise)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Icon (e.g., 
💪)" // Default to empty string
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