import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-4xl font-bold mb-4">Welcome to HabitFlow</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Your personal habit tracking companion.
      </p>
      <div className="flex gap-4">
        <Button asChild>
          <Link to="/sign-in">Sign In</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/sign-up">Sign Up</Link>
        </Button>
      </div>
    </div>
  );
};

export default Index;
