
import { Switch } from "@/components/ui/switch";

const Settings = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Settings</h1>

      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Notifications</h3>
            <p className="text-sm text-muted-foreground">Enable or disable all notifications.</p>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Dark Mode</h3>
            <p className="text-sm text-muted-foreground">Toggle between light and dark themes.</p>
          </div>
          <Switch />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">AI Motivation</h3>
            <p className="text-sm text-muted-foreground">Get AI-powered motivational messages.</p>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Habit Reminders</h3>
            <p className="text-sm text-muted-foreground">Receive reminders for your habits.</p>
          </div>
          <Switch defaultChecked />
        </div>
      </div>
    </div>
  );
};

export default Settings;
