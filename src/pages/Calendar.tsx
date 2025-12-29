
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Calendar as UICalendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, startOfDay } from "date-fns";
import Reminders from "@/components/Reminders";

const CalendarPage = () => {
  const { session } = useAuth();
  const [completions, setCompletions] = useState([]);
  const [habits, setHabits] = useState({});
  const [specialEvents, setSpecialEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  const effortLevelColors = {
    1: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    2: 'bg-green-300 text-green-800 dark:bg-green-700 dark:text-green-200',
    3: 'bg-green-500 text-white dark:bg-green-500 dark:text-white',
    4: 'bg-green-700 text-white dark:bg-green-300 dark:text-black',
  };

  const fetchSpecialEvents = async () => {
    if (!session) return;
    const today = new Date().toISOString();
    const { data: remindersData, error: remindersError } = await supabase
      .from("reminders")
      .select("id, reminder_time, reminder_message, is_special_event")
      .eq("user_id", session.user.id)
      .eq("is_special_event", true)
      .gte("reminder_time", today)
      .order("reminder_time");

    if (remindersError) {
      console.error("Error fetching special event reminders:", remindersError);
    } else {
      setSpecialEvents(remindersData);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!session) return;
      setLoading(true);

      const { data: habitsData, error: habitsError } = await supabase
        .from("habits")
        .select("id, name");

      if (habitsError) {
        console.error("Error fetching habits:", habitsError);
      } else {
        const habitsMap = habitsData.reduce((acc, habit) => {
          acc[habit.id] = habit.name;
          return acc;
        }, {});
        setHabits(habitsMap);
      }

      const { data: completionsData, error: completionsError } = await supabase
        .from("habit_completions")
        .select("completion_date, effort_level, habit_id")
        .eq("user_id", session.user.id);
      
      if (completionsError) {
        console.error("Error fetching completions:", completionsError);
      } else {
        setCompletions(completionsData);
      }

      await fetchSpecialEvents();

      setLoading(false);
    };

    fetchData();
  }, [session]);

  const getDayStyle = (date) => {
    const isSpecialDay = specialEvents.some(r => format(startOfDay(new Date(r.reminder_time)), 'yyyy-MM-dd') === format(startOfDay(date), 'yyyy-MM-dd'));
    if (isSpecialDay) {
      return { className: 'bg-red-500 text-white rounded-md' };
    }

    const dayCompletions = completions.filter(
      (c) => {
        const [year, month, day] = c.completion_date.split('-').map(Number);
        const completionDate = new Date(year, month - 1, day);
        return format(startOfDay(completionDate), 'yyyy-MM-dd') === format(startOfDay(date), 'yyyy-MM-dd');
      }
    );

    if (dayCompletions.length === 0) return {};

    const maxEffort = Math.max(...dayCompletions.map(c => c.effort_level));
    
    const colors = {
      1: 'bg-green-100 dark:bg-green-900',
      2: 'bg-green-300 dark:bg-green-700',
      3: 'bg-green-500 dark:bg-green-500',
      4: 'bg-green-700 dark:bg-green-300',
    };

    return {
      className: `${colors[maxEffort] || ''} rounded-md`,
    };
  };

  const dayCompletions = completions.filter(
    (c) => {
      const [year, month, day] = c.completion_date.split('-').map(Number);
      const completionDate = new Date(year, month - 1, day);
      return format(startOfDay(completionDate), 'yyyy-MM-dd') === format(startOfDay(selectedDate), 'yyyy-MM-dd');
    }
  );

  return (
    <div className="p-4 md:p-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Habit Calendar</CardTitle>
          <CardDescription>
            This calendar shows your daily habit progress. Days are colored based on the highest effort level you achieved.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex justify-center">
            <UICalendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              modifiers={{ style: getDayStyle }}
              modifiersClassNames={{
                style: 'day-with-style',
              }}
            />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">
              Completions for {format(selectedDate, "MMMM dd, yyyy")}
            </h3>
            {dayCompletions.length > 0 ? (
              <ul className="space-y-2">
                {dayCompletions.map((log, index) => (
                  <li key={index} className="flex justify-between items-center p-3 rounded-md border bg-card">
                    <span className="font-medium">{habits[log.habit_id] || 'Habit name missing'}</span>
                    <Badge className={effortLevelColors[log.effort_level]}>Level {log.effort_level}</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground mt-4 text-center">No habits logged for this day.</p>
            )}
            <div className="mt-6 space-y-4">
              <div>
                <p className="font-semibold mb-2">Legend:</p>
                <div className="flex flex-wrap gap-2 items-center">
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-green-100 dark:bg-green-900 border"></div><span>Level 1</span></div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-green-300 dark:bg-green-700 border"></div><span>Level 2</span></div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-green-500 dark:bg-green-500 border"></div><span>Level 3</span></div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-green-700 dark:bg-green-300 border"></div><span>Level 4</span></div>
                </div>
              </div>
              <div>
                <div className="flex flex-wrap gap-2 items-center mb-2">
                    <div className="flex items-center gap-2"><div> <span className="w-4 h-4 inline-block text-red-500">🚨</span> </div><span>Special Events</span></div>
                </div>
                {specialEvents.length > 0 ? (
                  <ul className="space-y-1 list-disc pl-5">
                    {specialEvents.map((event) => (
                      <li key={event.id} className="text-sm text-muted-foreground">
                        <span className="font-semibold text-primary">{format(new Date(event.reminder_time), "MMM dd")}:</span> {event.reminder_message}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No special events marked.</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Reminders selectedDate={selectedDate} onSpecialEventAdded={fetchSpecialEvents} />
    </div>
  );
};

export default CalendarPage;
