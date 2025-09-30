import { Button } from "@/components/ui/button";
import { ArrowRight, Target, TrendingUp, Users, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-purple-900/40 to-black/80" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-16 h-16 glass rounded-full animate-pulse" />
        <div className="absolute top-40 right-32 w-12 h-12 glass rounded-full animate-pulse delay-1000" />
        <div className="absolute bottom-32 left-16 w-20 h-20 glass rounded-full animate-pulse delay-500" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <div className="glass rounded-3xl p-12 shadow-card">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 gradient-hero bg-clip-text text-transparent">
            DailyDots
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Transform your daily routines into powerful habits with AI-powered insights, 
            community support, and gamified progress tracking
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button variant="hero" size="lg" className="text-lg px-8 py-4" onClick={() => navigate("/auth")}>
              Start Your Journey <ArrowRight className="ml-2" />
            </Button>
            <Button variant="glass" size="lg" className="text-lg px-8 py-4" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
              Watch Demo
            </Button>
          </div>

          {/* Feature Pills */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="glass rounded-full px-6 py-3 flex items-center justify-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">4-Level Tracking</span>
            </div>
            <div className="glass rounded-full px-6 py-3 flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5 text-success" />
              <span className="text-sm font-medium">Progress Analytics</span>
            </div>
            <div className="glass rounded-full px-6 py-3 flex items-center justify-center gap-2">
              <Zap className="w-5 h-5 text-warning" />
              <span className="text-sm font-medium">AI Insights</span>
            </div>
            <div className="glass rounded-full px-6 py-3 flex items-center justify-center gap-2">
              <Users className="w-5 h-5 text-primary-glow" />
              <span className="text-sm font-medium">Community</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};