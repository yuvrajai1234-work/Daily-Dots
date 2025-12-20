
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/components/AuthProvider";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import Habits from "@/components/Habits";
import CalendarPage from "@/pages/Calendar";
import AnalyticsPage from "@/pages/Analytics";
import Index from "@/pages/Index";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import ProtectedApp from "@/components/ProtectedApp";
import Profile from "@/pages/Profile";
import Achievements from "@/pages/Achievements";
import JournalPage from "@/pages/JournalPage";
import Community from "@/pages/Community";
import Reminders from "@/pages/Reminders";
import EarnCoins from "@/pages/EarnCoins";
import Rewards from "@/pages/Rewards";
import AIAssistant from "@/pages/AIAssistant";
import Ebooks from "@/pages/Ebooks";
import Settings from "@/pages/Settings";
import About from "@/pages/About";
import HabitDetail from "@/pages/HabitDetail";
import { TopBar } from "./components/TopBar";
import { useSidebar } from "./contexts/SidebarContext";
import Sidebar from "./components/Sidebar";
import ImprovementPage from "@/pages/Improvement";

function App() {
  const { isSidebarCollapsed, setIsSidebarCollapsed } = useSidebar();

  return (
    <Router>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <div className="flex h-screen bg-background">
            <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
            <div className="flex-1 flex flex-col overflow-hidden">
              <TopBar />
              <main className="flex-1 overflow-y-auto p-4 lg:p-6">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/sign-in" element={<SignIn />} />
                  <Route path="/sign-up" element={<SignUp />} />
                  <Route element={<ProtectedApp />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/habits" element={<Habits />} />
                    <Route path="/calendar" element={<CalendarPage />} />
                    <Route path="/analytics" element={<AnalyticsPage />} />
                    <Route path="/improvement" element={<ImprovementPage />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/achievements" element={<Achievements />} />
                    <Route path="/journal" element={<JournalPage />} />
                    <Route path="/community" element={<Community />} />
                    <Route path="/reminders" element={<Reminders />} />
                    <Route path="/earn-coins" element={<EarnCoins />} />
                    <Route path="/rewards" element={<Rewards />} />
                    <Route path="/ai-assistant" element={<AIAssistant />} />
                    <Route path="/ebooks" element={<Ebooks />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/habit/:id" element={<HabitDetail />} />
                  </Route>
                </Routes>
              </main>
            </div>
          </div>
        </TooltipProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
