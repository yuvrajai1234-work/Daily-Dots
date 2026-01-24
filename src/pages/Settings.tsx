
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const SettingsPage = () => {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Page Header */}
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your application preferences and account settings.</p>
      </header>
      <Separator />

      {/* QUICK TOGGLES */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Toggles</CardTitle>
          <CardDescription>Quickly enable or disable key features.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor="notifications" className="font-medium">Notifications</label>
            <Switch id="notifications" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor="daily-reminders" className="font-medium">Daily Reminders</label>
            <div className="flex items-center gap-2">
                <Input type="time" defaultValue="09:00" className="w-[120px]" />
                <Switch id="daily-reminders" defaultChecked />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor="dark-mode" className="font-medium">Dark Mode</label>
            <Switch id="dark-mode" defaultChecked/>
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor="offline-mode" className="font-medium">Offline Mode</label>
            <Switch id="offline-mode" />
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor="haptic-feedback" className="font-medium">Haptic Feedback</label>
            <Switch id="haptic-feedback" />
          </div>
        </CardContent>
      </Card>

      {/* HABIT PREFERENCES */}
      <Card>
        <CardHeader>
          <CardTitle>Habit Preferences</CardTitle>
          <CardDescription>Customize how you track and manage your habits.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="font-medium">Default Cycle Length</label>
            <Select defaultValue="4-weeks">
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select length" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="4-weeks">4 weeks</SelectItem>
                    <SelectItem value="6-weeks">6 weeks</SelectItem>
                    <SelectItem value="8-weeks">8 weeks</SelectItem>
                </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <label className="font-medium">Effort Level Labels</label>
            <Button variant="outline">Customize</Button>
          </div>
          <div className="flex items-center justify-between">
            <label className="font-medium">Reminder Tone</label>
            <Select defaultValue="default-tone">
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select sound" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="default-tone">Default</SelectItem>
                    <SelectItem value="calm-tone">Calm</SelectItem>
                    <SelectItem value="energetic-tone">Energetic</SelectItem>
                </SelectContent>
            </Select>
          </div>
           <div className="flex items-center justify-between">
            <label className="font-medium">Habit Templates</label>
            <Button variant="outline">Manage Presets</Button>
          </div>
        </CardContent>
      </Card>
      
      {/* COMMUNITY & PRIVACY */}
      <Card>
        <CardHeader>
            <CardTitle>Community & Privacy</CardTitle>
            <CardDescription>Control your visibility and data sharing preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
             <div className="flex items-center justify-between">
                <label className="font-medium">Profile Visibility</label>
                <Select defaultValue="public">
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="group">Group Members Only</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex items-center justify-between">
                <label className="font-medium">Shared Stats</label>
                <Button variant="outline">Select Which to Share</Button>
            </div>
            <div className="flex items-center justify-between">
                <label htmlFor="group-discovery" className="font-medium">Group Discovery</label>
                <Switch id="group-discovery" defaultChecked />
            </div>
             <div className="flex items-center justify-between">
                <label className="font-medium">Data Export</label>
                 <Select defaultValue="one-time">
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select export type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="one-time">One-time</SelectItem>
                        <SelectItem value="recurring">Recurring</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </CardContent>
      </Card>
      
        {/* AI & PERSONALIZATION */}
        <Card>
            <CardHeader>
                <CardTitle>AI & Personalization</CardTitle>
                <CardDescription>Tailor the AI-powered features to your liking.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <label className="font-medium">Reflection Prompts</label>
                    <Select defaultValue="deep">
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select prompt type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="basic">Basic</SelectItem>
                            <SelectItem value="deep">Deep</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center justify-between">
                    <label className="font-medium">AI Coach Tone</label>
                    <Select defaultValue="encouraging">
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select tone" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="encouraging">Encouraging</SelectItem>
                            <SelectItem value="motivating">Motivating</SelectItem>
                            <SelectItem value="direct">Direct</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center justify-between">
                    <label htmlFor="personalized-suggestions" className="font-medium">Personalized Suggestions</label>
                    <Switch id="personalized-suggestions" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                    <label className="font-medium">Reflection History</label>
                     <Select defaultValue="90-days">
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="30-days">Keep for 30 days</SelectItem>
                            <SelectItem value="90-days">Keep for 90 days</SelectItem>
                            <SelectItem value="forever">Keep Forever</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
        
        {/* PROGRESS & DISPLAY */}
        <Card>
            <CardHeader>
                <CardTitle>Progress & Display</CardTitle>
                <CardDescription>Adjust how your progress and data are displayed.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="flex items-center justify-between">
                    <label className="font-medium">Analytics Detail Level</label>
                    <Select defaultValue="advanced">
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="simple">Simple</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="flex items-center justify-between">
                    <label className="font-medium">Chart Type</label>
                    <Select defaultValue="line">
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select chart type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="line">Line</SelectItem>
                            <SelectItem value="bar">Bar</SelectItem>
                            <SelectItem value="heatmap">Heatmap</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center justify-between">
                    <label className="font-medium">Progress Notifications</label>
                    <Select defaultValue="milestones">
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select notification type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="milestones">Milestones</SelectItem>
                            <SelectItem value="all">All</SelectItem>
                             <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="flex items-center justify-between">
                    <label htmlFor="data-backup" className="font-medium">Data Backup</label>
                    <Switch id="data-backup" defaultChecked />
                </div>
            </CardContent>
        </Card>

      {/* ACCOUNT & SUPPORT */}
      <Card>
        <CardHeader>
          <CardTitle>Account & Support</CardTitle>
          <CardDescription>Manage your account, get help, and view app information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="font-medium">Change Password</label>
            <Button variant="outline">Change</Button>
          </div>
          <div className="flex items-center justify-between">
            <label className="font-medium text-destructive">Delete Account</label>
            <Button variant="destructive">Delete</Button>
          </div>
          <div className="flex items-center justify-between">
            <label className="font-medium">Contact Support</label>
            <Button variant="outline">Contact</Button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">App Version</span>
            <span className="text-sm font-mono">1.0.2</span>
          </div>
        </CardContent>
      </Card>
      
      {/* Log out */}
      <div className="text-center">
        <Button variant="outline" size="lg">Log Out</Button>
      </div>
    </div>
  );
};

export default SettingsPage;
