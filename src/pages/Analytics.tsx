
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { subDays, format } from 'date-fns';

const AnalyticsPage = () => {
  const { session } = useAuth();
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!session) return;
      setLoading(true);

      const data = [];
      for (let i = 6; i >= 0; i--) {
        const date = subDays(new Date(), i);
        const dateString = format(date, 'yyyy-MM-dd');
        
        const { data: completions, error } = await supabase
          .from('habit_completions')
          .select('effort_level')
          .eq('user_id', session.user.id)
          .eq('completion_date', dateString);

        if (error) {
          console.error(`Error fetching data for ${dateString}:`, error);
          continue;
        }

        const totalScore = completions.reduce((acc, curr) => acc + curr.effort_level, 0);
        data.push({ date: format(date, 'MMM dd'), score: totalScore });
      }

      setChartData(data);
      setLoading(false);
    };

    fetchData();
  }, [session]);

  return (
    <div className="p-4 md:p-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Habit Progress Analytics</CardTitle>
          <CardDescription>Visualize your habit scores over the last 7 days.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading chart data...</p>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                <Area type="monotone" dataKey="score" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
