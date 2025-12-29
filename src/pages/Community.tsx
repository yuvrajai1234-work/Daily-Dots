
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';

// --- Mock Data ---

const mockCommunities = [
  { id: '1', name: '5 AM Club', tagline: 'Rise and shine!', members: 125, habit: 'Productivity', coverImageUrl: '/placeholder.svg' },
  { id: '2', name: '100 Days of Code', tagline: 'Code every single day.', members: 842, habit: 'Coding', coverImageUrl: '/placeholder.svg' },
  { id: '3', name: 'No Sugar January', tagline: 'Commit to a healthier you.', members: 341, habit: 'Health', coverImageUrl: '/placeholder.svg' },
  { id: '4', name: 'Daily Meditation', tagline: 'Find your inner peace.', members: 520, habit: 'Mindfulness', coverImageUrl: '/placeholder.svg' },
];

const mockMembers = [
  { id: 'u1', name: 'Alice', avatar: '/placeholder.svg', rank: 1, points: 1520, streak: 45 },
  { id: 'u2', name: 'Bob', avatar: '/placeholder.svg', rank: 2, points: 1480, streak: 42 },
  { id: 'u3', name: 'Charlie', avatar: '/placeholder.svg', rank: 3, points: 1300, streak: 30 },
  { id: 'u4', name: 'David', avatar: '/placeholder.svg', rank: 4, points: 1150, streak: 25 },
];

const mockMessages = [
    { id: 'm1', userId: 'u1', name: 'Alice', avatar: '/placeholder.svg', content: 'Just finished my coding session for the day! #Day23', timestamp: '10:30 AM' },
    { id: 'm2', userId: 'u3', name: 'Charlie', avatar: '/placeholder.svg', content: "Nice one, Alice! I'm struggling a bit with React hooks.", timestamp: '10:32 AM' },
    { id: 'm3', userId: 'u1', name: 'Alice', avatar: '/placeholder.svg', content: 'Happy to help if you have questions!', timestamp: '10:35 AM' },
];

const mockChallenges = [
    { id: 'c1', name: 'Log 20 Times This Month', description: 'Commit to coding for 20 days in June.', progress: 15, goal: 20 },
    { id: 'c2', name: 'Deploy a Project', description: 'Ship a small project by the end of the week.', completed: false },
]


// --- Sub-components ---

const CommunityCard = ({ community, onJoin }) => (
  <Card className="overflow-hidden">
    <img src={community.coverImageUrl} alt={community.name} className="h-32 w-full object-cover"/>
    <CardHeader>
      <CardTitle>{community.name}</CardTitle>
      <p className="text-sm text-muted-foreground">{community.tagline}</p>
    </CardHeader>
    <CardContent>
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{community.members} members</span>
        <span className="font-bold">{community.habit}</span>
      </div>
    </CardContent>
    <CardFooter>
      <Button className="w-full" onClick={() => onJoin(community)}>Join</Button>
    </CardFooter>
  </Card>
);

const CommunityExplore = ({ onJoinCommunity }) => (
  <div className="p-4 space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Explore Communities</CardTitle>
        <p className="text-muted-foreground">Find your tribe and build habits together.</p>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search communities..." className="pl-8" />
          </div>
          <Button variant="outline">Filters</Button>
        </div>
      </CardContent>
    </Card>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {mockCommunities.map(community => (
        <CommunityCard key={community.id} community={community} onJoin={onJoinCommunity} />
      ))}
    </div>
  </div>
);


const ChatTab = () => (
    <div className="h-[60vh] flex flex-col">
        <div className="flex-grow space-y-4 p-4 overflow-y-auto">
            {mockMessages.map(msg => (
                <div key={msg.id} className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={msg.avatar} />
                        <AvatarFallback>{msg.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="flex items-baseline gap-2">
                             <p className="font-semibold">{msg.name}</p>
                             <p className="text-xs text-muted-foreground">{msg.timestamp}</p>
                        </div>
                        <p className="text-sm">{msg.content}</p>
                    </div>
                </div>
            ))}
        </div>
        <div className="p-4 bg-background border-t">
             <div className="relative">
                <Input placeholder="Type a message..." className="pr-16" />
                <Button className="absolute right-1 top-1 h-8 px-3">Send</Button>
            </div>
        </div>
    </div>
);

const LeaderboardTab = () => (
    <div className="p-4 space-y-2">
         <div className="flex justify-end gap-2 mb-4">
            <Button variant="secondary">Weekly</Button>
            <Button variant="ghost">All-Time</Button>
        </div>
        {mockMembers.map(member => (
            <Card key={member.id} className="p-3">
                <div className="flex items-center gap-4">
                    <span className="text-lg font-bold w-6">{member.rank}</span>
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <p className="font-semibold flex-grow">{member.name}</p>
                    <div className="text-right">
                        <p className="font-bold">{member.points} pts</p>
                        <p className="text-sm text-muted-foreground">{member.streak}-day streak</p>
                    </div>
                </div>
            </Card>
        ))}
    </div>
);

const MembersTab = () => (
    <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {mockMembers.map(member => (
            <Card key={member.id} className="p-3 flex flex-col items-center gap-2">
                 <Avatar>
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>{member.name?.[0]}</AvatarFallback>
                </Avatar>
                <p className="font-semibold text-sm text-center">{member.name}</p>
            </Card>
        ))}
    </div>
);

const ChallengesTab = () => (
    <div className="p-4 space-y-4">
        {mockChallenges.map(challenge => (
            <Card key={challenge.id}>
                <CardHeader>
                    <CardTitle>{challenge.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{challenge.description}</p>
                </CardHeader>
                <CardContent>
                    {challenge.goal ? (
                         <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Progress</span>
                                <span>{challenge.progress} / {challenge.goal}</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2.5">
                                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${(challenge.progress / challenge.goal) * 100}%` }}></div>
                            </div>
                        </div>
                    ) : (
                        <p className={challenge.completed ? "text-green-500 font-bold" : "text-amber-500 font-bold"}>
                            {challenge.completed ? 'Completed!' : 'In Progress'}
                        </p>
                    )}
                </CardContent>
                <CardFooter>
                    <Button variant="outline" disabled={challenge.completed}>Join Challenge</Button>
                </CardFooter>
            </Card>
        ))}
    </div>
);


const CommunityHome = ({ community, onLeave }) => (
  <div className="p-4">
    <Card className="overflow-hidden mb-6">
      <div className="relative h-40 bg-muted">
          <img src={community.coverImageUrl} alt={community.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <h1 className="text-3xl font-bold">{community.name}</h1>
            <p>{community.members} members</p>
          </div>
      </div>
       <CardFooter className="flex justify-between p-2">
            <Button variant="outline" onClick={onLeave}>Leave Community</Button>
            <Button>Invite</Button>
       </CardFooter>
    </Card>

    <Tabs defaultValue="chat">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="chat">Chat</TabsTrigger>
        <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        <TabsTrigger value="members">Members</TabsTrigger>
        <TabsTrigger value="challenges">Challenges</TabsTrigger>
      </TabsList>
      <TabsContent value="chat"><Card><ChatTab /></Card></TabsContent>
      <TabsContent value="leaderboard"><LeaderboardTab /></TabsContent>
      <TabsContent value="members"><MembersTab /></TabsContent>
      <TabsContent value="challenges"><ChallengesTab /></TabsContent>
    </Tabs>
  </div>
);


// --- Main Page Component ---

const CommunityPage = () => {
  const [selectedCommunity, setSelectedCommunity] = useState(null);

  const handleJoinCommunity = (community) => {
    console.log("Joining community:", community.name);
    setSelectedCommunity(community);
  };

  const handleLeaveCommunity = () => {
    console.log("Leaving community");
    setSelectedCommunity(null);
  };

  return (
    <div>
      {selectedCommunity ? (
        <CommunityHome community={selectedCommunity} onLeave={handleLeaveCommunity} />
      ) : (
        <CommunityExplore onJoinCommunity={handleJoinCommunity} />
      )}
    </div>
  );
};

export default CommunityPage;
