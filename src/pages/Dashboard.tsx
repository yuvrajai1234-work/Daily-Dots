
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, Flame, Trophy, TrendingUp, Zap, Brain, Leaf, Dumbbell } from 'lucide-react';

const quickStats = [
  { title: "Today's Score", value: "12", icon: Calendar, color: "text-blue-500" },
  { title: "Current Streak", value: "7 Days", icon: Flame, color: "text-orange-500" },
  { title: "Cycle Score", value: "480", icon: Trophy, color: "text-yellow-500" },
  { title: "Improvement", value: "+15%", icon: TrendingUp, color: "text-green-500" },
];

const habits = [
  { name: "Mindful Morning", icon: Brain, color: "bg-blue-100", completed: true },
  { name: "Workout", icon: Dumbbell, color: "bg-orange-100", completed: false },
  { name: "Eat Healthy", icon: Leaf, color: "bg-green-100", completed: true },
  { name: "Code for 1hr", icon: Zap, color: "bg-yellow-100", completed: false },
];

const chartData = [
  { day: 'Mon', score: 10 },
  { day: 'Tue', score: 15 },
  { day: 'Wed', score: 12 },
  { day: 'Thu', score: 20 },
  { day: 'Fri', score: 18 },
  { day: 'Sat', score: 25 },
  { day: 'Sun', score: 22 },
];

const HabitCard = ({ habit }) => (
  <Card className={`${habit.color} flex flex-col justify-between`}>
    <CardHeader>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <habit.icon className="w-6 h-6" />
          <CardTitle className="text-lg">{habit.name}</CardTitle>
        </div>
        <div className={`w-4 h-4 rounded-full ${habit.completed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground mb-2">Log your effort:</p>
      <div className="flex justify-around">
        {[1, 2, 3, 4].map(level => (
          <Button key={level} variant="outline" size="sm" className="w-10 h-10 rounded-full">
            {level}
          </Button>
        ))}
      </div>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const completedHabits = habits.filter(h => h.completed).length;

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickStats.map(stat => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's Habits */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Today's Habits</h2>
            <p className="text-muted-foreground">{completedHabits} of {habits.length} completed</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {habits.map(habit => (
              <HabitCard key={habit.name} habit={habit} />
            ))}
          </div>
        </div>

        {/* AI Daily Reflection */}
        <Card className="bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20">
          <CardHeader>
            <CardTitle>AI Daily Reflection</CardTitle>
            <CardDescription>Your AI companion's thoughts on your progress.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm italic text-muted-foreground">
              "Great job on staying consistent with your morning routine! Remember, every small step builds significant momentum. What was one thing that went well today?"
            </p>
            <Textarea placeholder="Write your thoughts and insights here..." />
            <Button className="w-full">Save Reflection</Button>
          </CardContent>
        </Card>
      </div>

      {/* 7-Day Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle>7-Day Progress</CardTitle>
          <CardDescription>Your habit score trend over the last week.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
