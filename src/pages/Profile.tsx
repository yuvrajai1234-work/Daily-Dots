
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/components/AuthProvider";
import { Shield, User, Hash, Key, Coins } from "lucide-react";

const StatHexagon = ({ icon: Icon, label, value }) => (
  <div className="relative w-24 h-28 flex items-center justify-center">
    <svg viewBox="0 0 100 114" className="absolute w-full h-full">
      <polygon points="50,0 100,28.5 100,85.5 50,114 0,85.5 0,28.5" fill="hsl(var(--muted))" />
    </svg>
    <div className="relative text-center">
      <Icon className="h-6 w-6 mx-auto" />
      <p className="text-sm font-semibold mt-1">{label}</p>
      <p className="text-xs">{value}</p>
    </div>
  </div>
);

const Profile = () => {
  const { user } = useAuth();

  const stats = [
    { icon: Shield, label: "Strength", value: "85" },
    { icon: Shield, label: "Agility", value: "92" },
    { icon: Shield, label: "Intellect", value: "78" },
    { icon: Shield, label: "Stamina", value: "88" },
    { icon: Shield, label: "Wisdom", value: "82" },
    { icon: Shield, label: "Charisma", value: "95" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><User className="mr-2" /> User Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="flex items-center"><User className="mr-2" /><strong>Username:</strong> {user?.user_metadata?.full_name || user?.email}</p>
                  <p className="flex items-center"><Hash className="mr-2" /><strong>ID:</strong> {user?.id}</p>
                  <Button className="w-full mt-2"><Key className="mr-2" />Change Password</Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><Coins className="mr-2" />Coins</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">1,250 Coins</p>
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Hexagonal Stats</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <div className="grid grid-cols-3 gap-4">
                  {stats.slice(0, 3).map((stat, index) => (
                    <StatHexagon key={index} {...stat} />
                  ))}
                </div>
              </CardContent>
              <CardContent className="flex items-center justify-center">
                <div className="grid grid-cols-3 gap-4">
                    {stats.slice(3).map((stat, index) => (
                        <StatHexagon key={index} {...stat} />
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={75} />
          <p className="text-sm text-muted-foreground mt-2">You are 75% of the way to your next goal!</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
