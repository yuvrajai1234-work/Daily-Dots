import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/AuthProvider";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import Personality from "@/components/Personality";
import HabitStats from "@/components/HabitStats";
import LifeBalanceSpiderWeb from "@/components/LifeBalanceSpiderWeb";

const allHabits = [
  "Openness", "Conscientiousness", "Extraversion", "Agreeableness", "Neuroticism",
  "Empathy", "Resilience", "Confidence", "Kindness", "Leadership",
  "Reliability", "Optimism", "Creativity", "Honesty", "Gratitude",
  "Humility", "Adaptability", "Punctuality", "Generosity", "Self-discipline",
  "Resourcefulness", "Fair-mindedness", "Enthusiasm", "Forgiveness", "Integrity",
  "Patience", "Courage", "Loyalty", "Curiosity", "Perseverance"
];

const ProfilePage = () => {
  const { session, setSession } = useAuth();
  const user = session?.user;
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [isPersonalityEditing, setIsPersonalityEditing] = useState(false);

  const [originalProfile, setOriginalProfile] = useState(user?.user_metadata);
  const [originalPersonality, setOriginalPersonality] = useState(user?.user_metadata);

  const [name, setName] = useState(user?.user_metadata?.full_name || null);
  const [designation, setDesignation] = useState(
    user?.user_metadata?.designation || null
  );
  const [bio, setBio] = useState(user?.user_metadata?.bio || null);
  const [age, setAge] = useState(user?.user_metadata?.age || null);
  const [status, setStatus] = useState(user?.user_metadata?.status || null);
  const [location, setLocation] = useState(
    user?.user_metadata?.location || null
  );
  const [archetype, setArchetype] = useState(
    user?.user_metadata?.archetype || null
  );
  const [habits, setHabits] = useState(user?.user_metadata?.habits || []);
  const [introvertExtrovert, setIntrovertExtrovert] = useState(
    user?.user_metadata?.introvertExtrovert || 50
  );
  const [analyticalCreative, setAnalyticalCreative] = useState(
    user?.user_metadata?.analyticalCreative || 50
  );
  const [loyalFickle, setLoyalFickle] = useState(
    user?.user_metadata?.loyalFickle || 50
  );
  const [passiveActive, setPassiveActive] = useState(
    user?.user_metadata?.passiveActive || 50
  );

  useEffect(() => {
    if (user) {
      const metadata = user.user_metadata;
      setName(metadata.full_name || null);
      setDesignation(metadata.designation || null);
      setBio(metadata.bio || null);
      setAge(metadata.age || null);
      setStatus(metadata.status || null);
      setLocation(metadata.location || null);
      setArchetype(metadata.archetype || null);
      setHabits(metadata.habits || []);
      setIntrovertExtrovert(metadata.introvertExtrovert || 50);
      setAnalyticalCreative(metadata.analyticalCreative || 50);
      setLoyalFickle(metadata.loyalFickle || 50);
      setPassiveActive(metadata.passiveActive || 50);
      setOriginalProfile(metadata);
      setOriginalPersonality(metadata);
    }
  }, [session, user]);

  const userInitials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
    : "";

  const handleProfileSave = async () => {
    if (user) {
      const userUpdates = {
        full_name: name,
        designation,
        bio,
        age,
        status,
        location,
        archetype,
        habits,
      };

      const { data: updatedUserData, error } = await supabase.auth.updateUser({
        data: userUpdates,
      });

      if (error) {
        console.error("Error updating user:", error);
      } else {
        setIsProfileEditing(false);
        if (session && updatedUserData.user) {
          const newSession = {
            ...session,
            user: {
              ...session.user,
              user_metadata: {
                ...session.user.user_metadata,
                ...userUpdates,
              },
            },
          };
          setSession(newSession);
        }
      }
    }
  };

  const handleProfileCancel = () => {
    if (originalProfile) {
      setName(originalProfile.full_name || null);
      setDesignation(originalProfile.designation || null);
      setBio(originalProfile.bio || null);
      setAge(originalProfile.age || null);
      setStatus(originalProfile.status || null);
      setLocation(originalProfile.location || null);
      setArchetype(originalProfile.archetype || null);
      setHabits(originalProfile.habits || []);
    }
    setIsProfileEditing(false);
  };

  const handleProfileEdit = () => {
    setOriginalProfile(user.user_metadata);
    setIsProfileEditing(true);
  };

  const handleToggleHabit = (habit: string) => {
    setHabits((prevHabits) =>
      prevHabits.includes(habit)
        ? prevHabits.filter((h) => h !== habit)
        : [...prevHabits, habit]
    );
  };
  
  const handlePersonalitySave = async () => {
    if (user) {
      const userUpdates = {
        introvertExtrovert,
        analyticalCreative,
        loyalFickle,
        passiveActive,
      };

      const { data: updatedUserData, error } = await supabase.auth.updateUser({
        data: userUpdates,
      });

      if (error) {
        console.error("Error updating user:", error);
      } else {
        setIsPersonalityEditing(false);
        if (session && updatedUserData.user) {
          const newSession = {
            ...session,
            user: {
              ...session.user,
              user_metadata: {
                ...session.user.user_metadata,
                ...userUpdates,
              },
            },
          };
          setSession(newSession);
        }
      }
    }
  };

  const handlePersonalityCancel = () => {
    if (originalPersonality) {
      setIntrovertExtrovert(originalPersonality.introvertExtrovert || 50);
      setAnalyticalCreative(originalPersonality.analyticalCreative || 50);
      setLoyalFickle(originalPersonality.loyalFickle || 50);
      setPassiveActive(originalPersonality.passiveActive || 50);
    }
    setIsPersonalityEditing(false);
  };

  const handlePersonalityEdit = () => {
    setOriginalPersonality(user.user_metadata);
    setIsPersonalityEditing(true);
  };

  const archetypes = [
    "Sage",
    "Explorer",
    "Outlaw",
    "Magician",
    "Hero",
    "Lover",
    "Jester",
    "Everyman",
    "Caregiver",
    "Ruler",
    "Creator",
    "Innocent",
  ];

  return (
    <div className="p-8 bg-black min-h-screen font-sans text-white">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="md:col-span-1 space-y-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Profile</CardTitle>
              {isProfileEditing ? (
                <div className="flex gap-2">
                  <Button onClick={handleProfileSave}>Save</Button>
                  <Button variant="outline" onClick={handleProfileCancel}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button onClick={handleProfileEdit}>Edit</Button>
              )}
            </CardHeader>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Avatar className="w-32 h-32 mb-4 border-4 border-gray-700 shadow-lg">
                <AvatarImage src={user?.user_metadata?.avatar_url} alt={name} />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
              {isProfileEditing ? (
                <Input
                  className="text-2xl font-bold text-white bg-gray-700 border-gray-600 mb-2"
                  value={name || ''}
                  onChange={(e) => setName(e.target.value || null)}
                  placeholder="Your Name"
                />
              ) : (
                <h1 className="text-2xl font-bold text-white">
                  {name || "Anonymous"}
                </h1>
              )}
              {isProfileEditing ? (
                <Input
                  className="text-red-500 bg-gray-700 border-gray-600 mb-2"
                  value={designation || ''}
                  onChange={(e) => setDesignation(e.target.value || null)}
                  placeholder="Your Designation"
                />
              ) : (
                <p className="text-red-500">{designation}</p>
              )}
              {isProfileEditing ? (
                <Textarea
                  className="text-gray-400 bg-gray-700 border-gray-600 mt-4"
                  value={bio || ''}
                  onChange={(e) => setBio(e.target.value || null)}
                  placeholder="Your Bio"
                />
              ) : (
                <p className="mt-4 text-gray-400 italic">"{bio}"</p>
              )}
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="space-y-4 text-white">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Age:</span>
                  {isProfileEditing ? (
                    <Input
                      className="bg-gray-700 border-gray-600 w-2/3"
                      value={age || ''}
                      onChange={(e) => setAge(e.target.value || null)}
                      placeholder="Your Age"
                    />
                  ) : (
                    <span>{age}</span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Status:</span>
                  {isProfileEditing ? (
                    <select
                      className="bg-gray-700 border-gray-600 w-2/3 p-2 rounded-md"
                      value={status || ''}
                      onChange={(e) => setStatus(e.target.value || null)}
                    >
                      <option value="">Select Status</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                    </select>
                  ) : (
                    <span>{status}</span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Location:</span>
                  {isProfileEditing ? (
                    <Input
                      className="bg-gray-700 border-gray-600 w-2/3"
                      value={location || ''}
                      onChange={(e) => setLocation(e.target.value || null)}
                      placeholder="Your Location"
                    />
                  ) : (
                    <span>{location}</span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Archetype:</span>
                  {isProfileEditing ? (
                    <select
                      className="bg-gray-700 border-gray-600 w-2/3 p-2 rounded-md"
                      value={archetype || ''}
                      onChange={(e) => setArchetype(e.target.value || null)}
                    >
                      <option value="">Select Archetype</option>
                      {archetypes.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span>{archetype}</span>
                  )}
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {isProfileEditing ? (
                  allHabits.map((habit) => (
                    <Badge
                      key={habit}
                      variant={habits.includes(habit) ? "destructive" : "secondary"}
                      onClick={() => handleToggleHabit(habit)}
                      className="cursor-pointer"
                    >
                      {habit}
                    </Badge>
                  ))
                ) : (
                  habits.map((habit) => (
                    <Badge key={habit} variant="destructive">
                      {habit}
                    </Badge>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
          <LifeBalanceSpiderWeb />
        </div>

        {/* Right Column */}
        <div className="md:col-span-2 space-y-8">
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Personality</CardTitle>
              {isPersonalityEditing ? (
                <div className="flex gap-2">
                  <Button onClick={handlePersonalitySave}>Save</Button>
                  <Button variant="outline" onClick={handlePersonalityCancel}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button onClick={handlePersonalityEdit}>Edit</Button>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              <Personality
                isEditing={isPersonalityEditing}
                introvertExtrovert={introvertExtrovert}
                setIntrovertExtrovert={setIntrovertExtrovert}
                analyticalCreative={analyticalCreative}
                setAnalyticalCreative={setAnalyticalCreative}
                loyalFickle={loyalFickle}
                setLoyalFickle={setLoyalFickle}
                passiveActive={passiveActive}
                setPassiveActive={setPassiveActive}
              />
            </CardContent>
          </Card>
          <HabitStats />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
