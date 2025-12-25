
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useAuth } from "./AuthProvider";
import { useSidebar } from "@/contexts/SidebarContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function TopBar() {
  const { session } = useAuth();
  const { isSidebarCollapsed } = useSidebar();
  const user = session?.user;

  const displayName =
    user?.user_metadata?.name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "User";
  const displayInitial = displayName?.charAt(0).toUpperCase() || "U";
  const avatarUrl = user?.user_metadata?.avatar_url;

  const a_coins = user?.user_metadata?.a_coins ?? 0;
  const b_coins = user?.user_metadata?.b_coins ?? 0;
  const p_coins = user?.user_metadata?.p_coins ?? 0;

  return (
    <div className="bg-gray-900 text-white border-b">
      <TooltipProvider>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            {isSidebarCollapsed && (
              <>
                <Avatar>
                  <AvatarImage src={avatarUrl} alt={displayName} />
                  <AvatarFallback>{displayInitial}</AvatarFallback>
                </Avatar>
                <div className="ml-4">
                  <p className="text-lg font-bold">{displayName}</p>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center">
                  <img src="/A coins.png" alt="Coins" className="w-6 h-6" />
                  <span className="ml-2">{a_coins}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>A coins</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center">
                  <img src="/B coins.png" alt="Gems" className="w-6 h-6" />
                  <span className="ml-2">{b_coins}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>B coins</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center">
                  <img src="/P coin.png" alt="Shield" className="w-6 h-6" />
                  <span className="ml-2">{p_coins}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>P coins</p>
              </TooltipContent>
            </Tooltip>
            <Link to="/earn-coins">
              <Button variant="ghost" size="icon">
                <span role="img" aria-label="Cart">
                  🛒
                </span>
              </Button>
            </Link>
            <Link to="/">
              <Button variant="ghost" size="icon">
                <span role="img" aria-label="Home">
                  🏠
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
}
