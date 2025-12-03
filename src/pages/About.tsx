
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const About = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">About DailyDots</h1>

      <section className="text-center mb-12">
        <p className="text-lg text-muted-foreground">
          DailyDots was created to empower individuals on their journey of self-improvement by making daily discipline, habit-building, and personal reflection both engaging and rewarding. At its core, DailyDots combines advanced analytics, habit tracking, motivational tools, and a vibrant community space, transforming the challenges of productivity and growth into interactive experiences that anyone can enjoy.
        </p>
        <p className="text-lg text-muted-foreground mt-4">
          Many people struggle to maintain good habits and stay motivated in today’s fast-paced world. DailyDots addresses this by offering an integrated platform that goes beyond typical to-do apps, using achievement systems, rewards, AI guidance, and community interaction to help users stay on track even when motivation fades. Our unique features like AI-powered encouragement, habit scoring, friend leaderboards, and educational content make progress visible and fun, turning small daily actions into lasting success.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">How We Help</h2>
        <ul className="list-disc list-inside text-lg text-muted-foreground space-y-4">
          <li>Track habits with progress bars, analytics, and detailed habit cycles to see your growth in real time.</li>
          <li>Earn coins and redeem rewards as you achieve goals, making habit-building a gamified experience.</li>
          <li>Join a supportive community where you can chat, share reflections, watch educational content together, and motivate each other to do better every day.</li>
          <li>Personalize your journey using AI motivation, instant reminders, and achievement-based incentives.</li>
          <li>Access and publish e-books, and join as a creator to inspire others, making DailyDots not just an app, but a movement for personal success.</li>
        </ul>
      </section>
      
      <section className="text-center mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">Our Mission</h2>
        <p className="text-lg text-muted-foreground">
          At DailyDots, our mission is simple: help users take consistent steps toward their best selves, leveraging technology, community, and motivation to create meaningful change in their lives.
        </p>
      </section>

      <h2 className="text-3xl font-bold text-center mb-8">Meet the Team</h2>
      <section className="flex flex-wrap justify-center gap-8 mb-12">
        <Card className="w-full md:w-1/3">
          <CardHeader className="text-center">
            <Avatar className="mx-auto h-24 w-24 mb-4">
              <AvatarImage src="https://github.com/shadcn.png" alt="Yash" />
              <AvatarFallback>Y</AvatarFallback>
            </Avatar>
            <CardTitle>Yuvraj Singh Thakur</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              Co-founder & CEO
            </p>
          </CardContent>
        </Card>
        <Card className="w-full md:w-1/3">
          <CardHeader className="text-center">
            <Avatar className="mx-auto h-24 w-24 mb-4">
              <AvatarImage src="https://github.com/shadcn.png" alt="Divyajeet" />
              <AvatarFallback>D</AvatarFallback>
            </Avatar>
            <CardTitle>Akshat Singh</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              Co-founder & CTO
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default About;
