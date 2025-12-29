
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";

const Index = () => {
  return (
    <main>
      <Hero />
      <Features />
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p>&copy; 2024 DailyDots. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
};

export default Index;
