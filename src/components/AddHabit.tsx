import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/supabaseClient";
import { useAuth } from "./AuthProvider";
import { useState } from "react";

const AddHabit = ({ onHabitAdded }: { onHabitAdded: () => void }) => {
  const { session } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [level1Label, setLevel1Label] = useState("");
  const [level2Label, setLevel2Label] = useState("");
  const [level3Label, setLevel3Label] = useState("");
  const [level4Label, setLevel4Label] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleAddHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !name) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from("habits")
        .insert([{
            name,
            description,
            user_id: session.user.id,
            level_1_label: level1Label,
            level_2_label: level2Label,
            level_3_label: level3Label,
            level_4_label: level4Label,
        }]);

      if (error) {
        throw error;
      }

      onHabitAdded(); // Callback to refresh the habits list
      setName("");
      setDescription("");
      setLevel1Label("");
      setLevel2Label("");
      setLevel3Label("");
      setLevel4Label("");
      setOpen(false); // Close the dialog
    } catch (error: any) {
      console.error("Error adding habit:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add New Habit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add a New Habit</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleAddHabit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="level1" className="text-right">
                Level 1 Label
              </Label>
              <Input
                id="level1"
                value={level1Label}
                onChange={(e) => setLevel1Label(e.target.value)}
                className="col-span-3"
                placeholder="e.g., 5-min stretch"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="level2" className="text-right">
                Level 2 Label
              </Label>
              <Input
                id="level2"
                value={level2Label}
                onChange={(e) => setLevel2Label(e.target.value)}
                className="col-span-3"
                placeholder="e.g., 15-min walk"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="level3" className="text-right">
                Level 3 Label
              </Label>
              <Input
                id="level3"
                value={level3Label}
                onChange={(e) => setLevel3Label(e.target.value)}
                className="col-span-3"
                placeholder="e.g., 30-min workout"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="level4" className="text-right">
                Level 4 Label
              </Label>
              <Input
                id="level4"
                value={level4Label}
                onChange={(e) => setLevel4Label(e.target.value)}
                className="col-span-3"
                placeholder="e.g., 60-min gym session"
              />
            </div>
          </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">
                        Close
                    </Button>
                </DialogClose>
                <Button type="submit" disabled={loading}>
                  {loading ? "Adding..." : "Add Habit"}
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddHabit;
