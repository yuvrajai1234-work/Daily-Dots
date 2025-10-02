import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Landing = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-[1fr_550px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter text-white sm:text-5xl xl:text-6xl/none">
                    Daily Dots
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Daily Dots isn’t just another habit tracker—it’s the spark that unlocks your potential with every small, consistent action. Through engaging progress tracking, AI-generated insights tailored just for you, and a vibrant community cheering each achievement, this app helps transform routines into lasting, life-changing habits.
                  </p>
                  <h3 className="text-xl font-bold">The Power of Daily Dots
                  </h3>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  With every check-in, you’re building momentum—even on days when it feels tough. Over time, these small victories accumulate, creating real, visible results in focus, discipline, and achievement. Daily Dots is here as your accountability partner, making it easier to stick with good habits and let go of unhelpful ones, all while celebrating your journey.
                  Start today, and see how consistent action supported by technology and community can remake not just your routines, but your entire life.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    to="/sign-up"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  >
                    Start Your Journey
                  </Link>
                  <Link
                    to="#"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-transparent px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  >
                    Watch Demo
                  </Link>
                </div>
              </div>
              <img
                src="/lpdiscipline.png"
                width="550"
                height="550"
                alt="Hero"
                className="mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Everything You Need to Succeed
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our app is packed with features to help you build habits,
                  track your progress, and stay motivated.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="grid gap-1">
                <h3 className="text-xl font-bold">Habit Tracking</h3>
                <p className="text-muted-foreground">
                  Easily track your habits and see your progress over time with
                  our simple and intuitive interface.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-xl font-bold">AI-Powered Insights</h3>
                <p className="text-muted-foreground">
                  Get personalized insights and recommendations from our AI to
                  help you optimize your routines.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-xl font-bold">Community Support</h3>
                <p className="text-muted-foreground">
                  Connect with a community of like-minded individuals to share
                  your journey and get support.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section
          className="w-full py-12 md:py-24 lg:py-32 bg-cover bg-center relative"
          style={{
            backgroundImage: "url(/everest4-resize-final.jpg)",
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6 relative">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-white">
                Start Your Journey Today
              </h2>
              <p className="mx-auto max-w-[600px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join us and start building better habits.
              </p>
            </div>
            <div className="flex justify-center flex-col sm:flex-row gap-4">
              <Link
                to="/sign-up"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Get Started
              </Link>
              <Link
                to="#"
                className="inline-flex h-10 items-center justify-center rounded-md border  border-input bg-background hover:bg-accent hover:text-accent-foreground px-8 text-sm font-medium shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Learn more
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          &copy; 2025 DailyDots MetaMorphosis. All rights reserved.
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

export default Landing;
