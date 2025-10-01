
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-primary/10 to-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none gradient-text">
                    DailyDots
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Transform your daily routines into powerful habits with
                    AI-powered insights, community support, and gamified
                    progress-tracking.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link to="/auth">
                    <Button size="lg" className="w-full min-[400px]:w-auto">
                      Start Your Journey
                    </Button>
                  </Link>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full min-[400px]:w-auto"
                  >
                    Watch Demo
                  </Button>
                </div>
              </div>
              <img
                src="/placeholder.svg"
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Powerful Features
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Everything you need to build lasting habits and achieve your
                  goals.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="grid gap-4">
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold">4-Level Habit Tracking</h3>
                  <p className="text-muted-foreground">
                    Go beyond a simple streak and track your habit strength
                    with our innovative 4-level system.
                  </p>
                </div>
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold">28-Day Cycles</h3>
                  <p className="text-muted-foreground">
                    Each cycle is a fresh start to build new habits, with clear
                    start and end dates.
                  </p>
                </div>
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold">Visual Calendar</h3>
                  <p className="text-muted-foreground">
                    Visually track your progress and stay motivated. Add notes
                    to each day.
                  </p>
                </div>
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold">AI Reflection</h3>
                  <p className="text-muted-foreground">
                    Get personalized, AI-powered feedback and motivation
                    messages based on your long-term entries.
                  </p>
                </div>
              </div>
              <div className="grid gap-4">
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold">Community Spaces</h3>
                  <p className="text-muted-foreground">
                    Join or create communities to share your progress and get
                    accountability.
                  </p>
                </div>
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold">Smart Reminders</h3>
                  <p className="text-muted-foreground">
                    Set smart reminders that help you stay on track with your
                    habits.
                  </p>
                </div>
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold">Instant Logging</h3>
                  <p className="text-muted-foreground">
                    Log habits in just a few seconds from the main dashboard,
                    keeping the process quick and seamless.
                  </p>
                </div>
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold">Gamified Experience</h3>
                  <p className="text-muted-foreground">
                    Earn XP, unlock achievements, and climb the ranks with fun
                    and engaging weekly challenges.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid items-center gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                    Track Your Daily Progress
                  </h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Log your habits with our intuitive level system, earn XP,
                    unlock amazing new emojis, and view your progress toward
                    your goals.
                  </p>
                </div>
                <ul className="grid gap-2 py-4">
                  <li>- Level 1: Easiest (10 XP)</li>
                  <li>- Level 2: Moderate (25 XP)</li>
                  <li>- Level 3: Challenging (50 XP)</li>
                  <li>- Level 4: Mastered (100 XP)</li>
                </ul>
                <Link to="/auth">
                  <Button>Try It Now</Button>
                </Link>
              </div>
              <img
                src="/placeholder.svg"
                alt="Progress Tracking"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Ready to Transform Your Habits?
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of users who are building better habits with
                DailyDots. Start your journey today with our free trial and
                unlock your potential.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <div className="flex justify-center gap-4">
                <div>
                  <div className="text-4xl font-bold">10K+</div>
                  <div className="text-sm text-muted-foreground">
                    Active Users
                  </div>
                </div>
                <div>
                  <div className="text-4xl font-bold">85%</div>
                  <div className="text-sm text-muted-foreground">
                    Completion Rate
                  </div>
                </div>
                <div>
                  <div className="text-4xl font-bold">2M+</div>
                  <div className="text-sm text-muted-foreground">
                    Habits Tracked
                  </div>
                </div>
              </div>
              <div className="flex gap-2 justify-center">
                <Link to="/auth">
                  <Button>Start Free Trial</Button>
                </Link>
                <Button variant="secondary">Join Community</Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          © 2024 DailyDots. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link to="#" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link to="#" className="text-xs hover:underline underline-offset-4">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
};

export default LandingPage;
