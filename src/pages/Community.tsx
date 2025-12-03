
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Users, ArrowRight, ArrowLeft, MessageSquare, ThumbsUp, Zap } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const CommunityPage = () => {
  const [selectedGroup, setSelectedGroup] = useState(null);

  // Mock data
  const userGroups = [
    { id: 1, name: "Study Group", membersCount: 12 },
    { id: 2, name: "Accountability Squad", membersCount: 5 },
    { id: 3, name: "Morning Risers", membersCount: 23 },
  ];

  const groupMembers = [
    { id: 1, name: "Alice", score: 1250, streak: 15, mostImproved: true, avatar: "/avatars/01.png" },
    { id: 2, name: "Bob", score: 1100, streak: 12, mostImproved: false, avatar: "/avatars/02.png" },
    { id: 3, name: "You", score: 1050, streak: 10, mostImproved: false, avatar: "/avatars/03.png" },
    { id: 4, name: "Charlie", score: 900, streak: 8, mostImproved: false, avatar: "/avatars/04.png" },
  ];

  if (selectedGroup) {
    return (
      <div className="p-4 md:p-8 space-y-6">
        <Button variant="outline" onClick={() => setSelectedGroup(null)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to all groups
        </Button>
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold tracking-tight">{selectedGroup.name}</CardTitle>
            <CardDescription>This is your group's space. See how everyone is doing and send some encouragement!</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Rank</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead className="text-right">Streak</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groupMembers.map((member, index) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium text-center">{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{member.name}</span>
                        {member.mostImproved && <Badge variant="outline" className="border-yellow-500 text-yellow-500">Most Improved</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{member.score}</TableCell>
                    <TableCell className="text-right">{member.streak} days</TableCell>
                    <TableCell className="text-center">
                        <div className="flex justify-center gap-1">
                            <Button variant="ghost" size="icon"><MessageSquare className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon"><ThumbsUp className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon"><Zap className="h-4 w-4" /></Button>
                        </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Community Spaces</CardTitle>
          <CardDescription>Create or join groups to share your progress and stay motivated with others.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4">
          <Button className="w-full md:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Create a new group
          </Button>
          <Button variant="outline" className="w-full md:w-auto">
            Join a group
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Groups</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {userGroups.map((group) => (
            <div key={group.id} className="flex items-center justify-between p-4 rounded-md border hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setSelectedGroup(group)}>
              <div>
                <p className="font-semibold">{group.name}</p>
                <p className="text-sm text-muted-foreground flex items-center">
                  <Users className="mr-2 h-4 w-4" /> {group.membersCount} members
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Your Shareable Stats</CardTitle>
            <CardDescription>Control what statistics you share with your groups from your profile settings.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">You can configure your privacy settings on your profile page. More stats coming soon!</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityPage;
