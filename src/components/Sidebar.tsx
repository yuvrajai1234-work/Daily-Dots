
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "./AuthProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import {
  ChevronsLeft,
  User,
  Calendar,
  Trophy,
  LineChart,
  Book,
  Users,
  Bell,
  CircleDollarSign,
  Gift,
  Bot,
  BookOpen,
  Info,
  LogOut,
  ChevronsRight,
  LayoutDashboard,
  Settings
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const navLinks = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/profile", label: "Profile", icon: User },
    { to: "/calendar", label: "Calendar", icon: Calendar },
    { to: "/achievements", label: "Achievements", icon: Trophy },
    { to: "/analytics", label: "Analytics", icon: LineChart },
    { to: "/journal", label: "Journal", icon: Book },
    { to: "/community", label: "Community", icon: Users },
    { to: "/reminders", label: "Reminders", icon: Bell },
    { to: "/earn-coins", label: "Earn Coins", icon: CircleDollarSign },
    { to: "/rewards", label: "Rewards", icon: Gift },
    { to: "/ai-assistant", label: "AI Assistant", icon: Bot },
    { to: "/ebooks", label: "E-books", icon: BookOpen },
    { to: "/settings", label: "Settings", icon: Settings },
    { to: "/about", label: "About Us", icon: Info },
];

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const user = session?.user;
  const userName = user?.user_metadata?.full_name || user?.email;
  const avatarUrl = user?.user_metadata?.avatar_url;

  const handleLogout = async () => {
      await supabase.auth.signOut();
      navigate('/sign-in');
  };

  return (
    <TooltipProvider>
        <div className={`hidden md:flex flex-col bg-background border-r transition-all duration-300 fixed h-full ${isCollapsed ? 'w-20' : 'w-64'}`}>
            <div className="flex items-center h-16 border-b px-4 shrink-0">
                <div className={`flex-1 ${isCollapsed ? 'hidden' : 'block'}`}>
                    <h1 className="text-2xl font-bold gradient-text">DailyDots</h1>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(prev => !prev)}>
                    {isCollapsed ? <ChevronsRight /> : <ChevronsLeft />}
                </Button>
            </div>
            <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
                {navLinks.map(({ to, label, icon: Icon }) => (
                <Tooltip key={to} delayDuration={0} disableHoverableContent={!isCollapsed}>
                    <TooltipTrigger asChild>
                        <NavLink
                            to={to}
                            className={({ isActive }) =>
                            `flex items-center p-2 text-sm font-medium rounded-md ${isActive ? "bg-muted" : "hover:bg-muted/50"} ${isCollapsed ? 'justify-center h-10 w-10' : 'h-10'}`
                            }
                        >
                            <Icon className="h-5 w-5" />
                            <span className={`ml-3 ${isCollapsed ? 'hidden' : 'block'}`}>{label}</span>
                        </NavLink>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                        {label}
                    </TooltipContent>
                </Tooltip>
                ))}
            </nav>
            <div className="p-4 border-t mt-auto">
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={avatarUrl} alt={userName || ''} />
                        <AvatarFallback>{userName?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className={`ml-3 ${isCollapsed ? 'hidden' : ''}`}>
                        <p className="text-sm font-medium truncate">{userName}</p>
                    </div>
                </div>
                <Tooltip delayDuration={0} disableHoverableContent={!isCollapsed}>
                    <TooltipTrigger asChild>
                        <Button variant="outline" className={`w-full mt-4 ${isCollapsed ? 'h-10 w-10 p-0' : ''}`} onClick={handleLogout}>
                            <LogOut className="h-5 w-5" />
                            <span className={isCollapsed ? 'hidden' : 'ml-3'}>Logout</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                        Logout
                    </TooltipContent>
                </Tooltip>
            </div>
        </div>
    </TooltipProvider>
  );
};

export default Sidebar;
