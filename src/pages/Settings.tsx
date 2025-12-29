
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";

const SettingsPage = () => {
  const { session } = useAuth();
  const { theme, setTheme } = useTheme();
  const [username, setUsername] = useState("");
  const [reminderTime, setReminderTime] = useState("10:00");
  const [enableReminders, setEnableReminders] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session) return;
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
      } else if (data) {
        setUsername(data.username);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [session]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!session) return;
    const { error } = await supabase
      .from("profiles")
      .update({ username })
      .eq("id", session.user.id);

    if (error) {
      alert("Error updating profile: " + error.message);
    } else {
      alert("Profile updated successfully!");
    }
  };

  const handleExportData = async () => {
    if (!session) return;
    const { data, error } = await supabase
      .from("habit_completions")
      .select("completion_date, effort_level, habit_id")
      .eq("user_id", session.user.id);

    if (error) {
      console.error("Error fetching habit data:", error);
      alert("Error exporting data.");
      return;
    }

    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Date", "Effort Level", "Habit ID"].join(",") + "\n"
      + data.map(e => [e.completion_date, e.effort_level, e.habit_id].join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "habit_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteAccount = async () => {
    if (!session) return;
    if (confirm("Are you sure you want to delete your account? This action is irreversible.")) {
      const { error } = await supabase.rpc('delete_user_account', { user_id_input: session.user.id });
      if (error) {
        alert("Error deleting account: " + error.message);
      } else {
        alert("Account deleted successfully.");
        supabase.auth.signOut();
      }
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Manage your account and preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <Button type="submit">Update Profile</Button>
          </form>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Theme</h3>
            <div className="flex items-center space-x-2">
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <Switch
                id="dark-mode"
                checked={theme === "dark"}
                onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Notifications</h3>
            <div className="flex items-center space-x-2">
              <Label htmlFor="enable-reminders">Enable Reminders</Label>
              <Switch
                id="enable-reminders"
                checked={enableReminders}
                onCheckedChange={setEnableReminders}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reminder-time">Reminder Time</Label>
              <Input
                id="reminder-time"
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                disabled={!enableReminders}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Data Management</h3>
            <div className="flex flex-col md:flex-row gap-4">
              <Button onClick={handleExportData} variant="outline">Export Habit Data</Button>
              <Button onClick={handleDeleteAccount} variant="destructive">Delete Account</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
