import { Card } from "@/components/ui/card";
import { 
  Calendar, 
  Target, 
  TrendingUp, 
  Brain, 
  Users, 
  Bell,
  Zap,
  Award,
  BarChart3
} from "lucide-react";

const features = [
  {
    icon: Target,
    title: "4-Level Habit Tracking",
    description: "Log your efforts with customizable 1-4 point levels. Perfect for gradual progress and avoiding burnout.",
    color: "text-primary",
    gradient: "gradient-primary"
  },
  {
    icon: BarChart3,
    title: "28-Day Cycles",
    description: "Track progress in 4-week cycles with detailed analytics, improvement percentages, and visual charts.",
    color: "text-success", 
    gradient: "gradient-success"
  },
  {
    icon: Calendar,
    title: "Visual Calendar",
    description: "Monthly view with habit icons and progress dots. Add reflections and notes for each day.",
    color: "text-warning",
    gradient: "from-warning to-warning/80"
  },
  {
    icon: Brain,
    title: "AI Reflection",
    description: "Get personalized, empathetic feedback and motivational messages based on your progress patterns.",
    color: "text-primary-glow",
    gradient: "gradient-hero"
  },
  {
    icon: Users,
    title: "Community Spaces",
    description: "Join private groups, compete on leaderboards, and send encouragements to friends.",
    color: "text-level-3",
    gradient: "from-level-3 to-level-4"
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description: "Gentle notifications and automatic celebration of milestones, streaks, and achievements.",
    color: "text-level-2",
    gradient: "from-level-2 to-warning"
  },
  {
    icon: Zap,
    title: "Instant Logging",
    description: "Log habits in just two taps with minimal friction. Quick audio logging and voice commands.",
    color: "text-primary",
    gradient: "gradient-primary"
  },
  {
    icon: Award,
    title: "Gamified Experience",
    description: "Earn A-coins, unlock achievements, climb rankings, and participate in weekly challenges.",
    color: "text-success",
    gradient: "gradient-success"
  }
];

export const Features = () => {
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 gradient-hero bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to build lasting habits and achieve your goals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="glass p-6 shadow-card hover:shadow-glow transition-smooth hover:scale-105 group cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-bounce`}>
                <feature.icon className={`w-6 h-6 text-white`} />
              </div>
              
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                {feature.title}
              </h3>
              
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};