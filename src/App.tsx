
import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import Profile from "./pages/Profile";
import Analytics from "./pages/Analytics";
import Calendar from "./pages/Calendar";
import Achievements from "./pages/Achievements";
import Journal from "./pages/Journal";
import Community from "./pages/Community";
import Reminders from "./pages/Reminders";
import EarnCoins from "./pages/EarnCoins";
import Rewards from "./pages/Rewards";
import AIAssistant from "./pages/AIAssistant";
import Ebooks from "./pages/Ebooks";
import About from "./pages/About";
import ProtectedApp from "./components/ProtectedApp";
import { AuthProvider } from "./components/AuthProvider";
import LandingPage from "./pages/Landing";
import HabitDetail from "./pages/HabitDetail";

import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "sonner";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/auth" element={<Auth />} />
            <Route element={<ProtectedApp />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/community" element={<Community />} />
              <Route path="/reminders" element={<Reminders />} />
              <Route path="/earn-coins" element={<EarnCoins />} />
              <Route path="/rewards" element={<Rewards />} />
              <Route path="/ai-assistant" element={<AIAssistant />} />
              <Route path="/ebooks" element={<Ebooks />} />
              <Route path="/about" element={<About />} />
              <Route path="/habit/:id" element={<HabitDetail />} />
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
