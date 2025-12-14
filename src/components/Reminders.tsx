
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, startOfDay, endOfDay, isBefore, startOfToday } from "date-fns";
import { TimePicker } from "@/components/ui/time-picker";
import { Trash2 } from "lucide-react";

const Reminders = ({ selectedDate, onSpecialEventAdded }) => {
  const { session } = useAuth();
  const [reminders, setReminders] = useState([]);
  const [newReminderMessage, setNewReminderMessage] = useState("");
  const [newReminderTime, setNewReminderTime] = useState("12:00");
  const [isSpecialEvent, setIsSpecialEvent] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isPastDate = isBefore(selectedDate, startOfToday());

  useEffect(() => {
    const fetchReminders = async () => {
      if (!session) return;

      const from = startOfDay(selectedDate).toISOString();
      const to = endOfDay(selectedDate).toISOString();

      const { data, error } = await supabase
        .from("reminders")
        .select("id, reminder_message, reminder_time, is_special_event")
        .eq("user_id", session.user.id)
        .gte("reminder_time", from)
        .lte("reminder_time", to)
        .order("reminder_time");

      if (error) {
        console.error("Error fetching reminders:", error);
      } else if (data) {
        setReminders(data);
      }
    };

    fetchReminders();
  }, [session, selectedDate]);

  const handleAddReminder = async () => {
    if (!session || !newReminderMessage.trim()) return;

    const [hours, minutes] = newReminderTime.split(":");
    const reminderDateTime = new Date(selectedDate);
    reminderDateTime.setHours(parseInt(hours, 10));
    reminderDateTime.setMinutes(parseInt(minutes, 10));
    reminderDateTime.setSeconds(0);
    reminderDateTime.setMilliseconds(0);

    const { data, error } = await supabase
      .from("reminders")
      .insert([
        {
          user_id: session.user.id,
          reminder_message: newReminderMessage,
          reminder_time: reminderDateTime.toISOString(),
          is_special_event: isSpecialEvent,
        },
      ])
      .select();

    if (error) {
      console.error("Error adding reminder:", error);
    } else if (data) {
      setReminders([...reminders, data[0]]);
      if (isSpecialEvent) {
        onSpecialEventAdded();
      }
      setNewReminderMessage("");
      setNewReminderTime("12:00");
      setIsSpecialEvent(false);
      setIsDialogOpen(false);
    }
  };

  const handleDeleteReminder = async (reminderId: string) => {
    if (!session) return;
    const { error } = await supabase.from("reminders").delete().eq("id", reminderId);

    if (error) {
      console.error("Error deleting reminder:", error);
    } else {
      setReminders(reminders.filter((r) => r.id !== reminderId));
      onSpecialEventAdded();
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Reminders for {format(selectedDate, "MMMM dd, yyyy")}</CardTitle>
          <CardDescription>Manage your reminders for the selected date.</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={isPastDate}>Add Reminder</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a new reminder</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input
                value={newReminderMessage}
                onChange={(e) => setNewReminderMessage(e.target.value)}
                placeholder="What do you want to be reminded of?"
              />
              <TimePicker value={newReminderTime} onChange={setNewReminderTime} />
              <div className="flex items-center space-x-2">
                <Checkbox id="special-event" checked={isSpecialEvent} onCheckedChange={setIsSpecialEvent} />
                <Label htmlFor="special-event">Mark as special event</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddReminder}>Save Reminder</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reminder</TableHead>
              <TableHead>Time</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reminders.length > 0 ? (
              reminders.map((reminder) => (
                <TableRow key={reminder.id}>
                  <TableCell>{reminder.reminder_message}</TableCell>
                  <TableCell>{format(new Date(reminder.reminder_time), "p")}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteReminder(reminder.id)}
                      disabled={isPastDate}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">No reminders for this day.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Reminders;
