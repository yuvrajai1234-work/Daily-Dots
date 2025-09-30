import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar, 
  Flame, 
  Trophy, 
  TrendingUp, 
  LogOut,
  Sparkles,
  Plus
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface HabitCompletion {
  id: string;
  habit_id: string;
  effort_level: number;
  completion_date: string;
}

interface DailyReflection {
  id: string;
  reflection_text: string;
  reflection_date: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [reflectionText, setReflectionText] = useState("");
  const [todayReflection, setTodayReflection] = useState<DailyReflection | null>(null);
  const [stats, setStats] = useState({
    todayScore: 0,
    dailyStreak: 7,
    cycleScore: 0,
    improvement: 0
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        loadDashboardData(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadDashboardData = async (userId: string) => {
    // Load habits
    const { data: habitsData } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", userId);
    
    if (habitsData) setHabits(habitsData);

    // Load today's completions
    const today = new Date().toISOString().split('T')[0];
    const { data: completionsData } = await supabase
      .from("habit_completions")
      .select("*")
      .eq("user_id", userId)
      .eq("completion_date", today);
    
    if (completionsData) {
      setCompletions(completionsData);
      const todayScore = completionsData.reduce((sum, c) => sum + c.effort_level, 0);
      setStats(prev => ({ ...prev, todayScore }));
    }

    // Load today's reflection
    const { data: reflectionData } = await supabase
      .from("daily_reflections")
      .select("*")
      .eq("user_id", userId)
      .eq("reflection_date", today)
      .maybeSingle();
    
    if (reflectionData) {
      setTodayReflection(reflectionData);
      setReflectionText(reflectionData.reflection_text);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleEffortSelect = async (habitId: string, effortLevel: number) => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    const existing = completions.find(c => c.habit_id === habitId);

    if (existing) {
      const { error } = await supabase
        .from("habit_completions")
        .update({ effort_level: effortLevel })
        .eq("id", existing.id);

      if (error) {
        toast({ title: "Error updating completion", variant: "destructive" });
        return;
      }
    } else {
      const { error } = await supabase
        .from("habit_completions")
        .insert({
          habit_id: habitId,
          user_id: user.id,
          completion_date: today,
          effort_level: effortLevel
        });

      if (error) {
        toast({ title: "Error logging