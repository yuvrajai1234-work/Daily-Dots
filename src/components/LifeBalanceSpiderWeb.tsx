import React, { useState, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

const categories = [
  { name: 'Career', color: '#8b5cf6' },
  { name: 'Strength', color: '#3b82f6' },
  { name: 'Relationships', color: '#ef4444' },
  { name: 'Spirituality', color: '#10b981' },
  { name: 'Learning', color: '#f97316' },
  { name: 'Nutrition', color: '#22c55e' },
];

const LifeBalanceSpiderWeb = () => {
  const { session, setSession } = useAuth();
  const user = session?.user;

  const [scores, setScores] = useState({
    Career: 50,
    Strength: 50,
    Relationships: 50,
    Spirituality: 50,
    Learning: 50,
    Nutrition: 50,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user?.user_metadata?.lifeBalanceScores) {
      setScores(user.user_metadata.lifeBalanceScores);
    }
  }, [user]);

  const data = categories.map(category => ({
    subject: category.name,
    score: scores[category.name as keyof typeof scores],
    fullMark: 100,
  }));

  const handleSliderChange = (categoryName: string) => (value: number[]) => {
    setScores(prevScores => ({
      ...prevScores,
      [categoryName]: value[0],
    }));
  };

  const handleSave = async () => {
    if (user) {
      setIsSaving(true);
      const { data: updatedUserData, error } = await supabase.auth.updateUser({
        data: { lifeBalanceScores: scores }
      });

      if (error) {
        console.error("Error updating scores:", error.message);
      } else {
         if (session && updatedUserData.user) {
          const newSession = {
            ...session,
            user: {
              ...session.user,
              user_metadata: {
                ...session.user.user_metadata,
                lifeBalanceScores: scores,
              },
            },
          };
          setSession(newSession);
        }
      }
      setIsSaving(false);
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700 text-white">
      <CardHeader>
        <CardTitle>Your Life Balance Spider Web</CardTitle>
        <CardDescription>A visual representation of your life balance.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-8">
        <div>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'white', fontSize: 14 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'white' }} />
              <Radar name="Life Balance" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-4">Adjust Your Scores</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Use the sliders below to adjust your scores in each area.
          </p>
          {categories.map(category => (
            <div key={category.name} className="mb-4">
              <div className="flex justify-between mb-1">
                <label style={{ color: category.color, fontWeight: 'bold' }}>{category.name}</label>
                <span>{scores[category.name as keyof typeof scores]}</span>
              </div>
              <Slider
                value={[scores[category.name as keyof typeof scores]]}
                max={100}
                step={1}
                onValueChange={handleSliderChange(category.name)}
                className="[&>span:first-child]:h-1 [&>span:first-child>span]:bg-white [&>span:first-child]:bg-gray-600"
              />
            </div>
          ))}
          <Button onClick={handleSave} disabled={isSaving} className="mt-4 w-full">
            {isSaving ? 'Saving...' : 'Save Scores'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LifeBalanceSpiderWeb;
