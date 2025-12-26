
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
import { useNotification } from "@/contexts/NotificationContext";

export function TopBar() {
  const { session } = useAuth();
  const { isSidebarCollapsed } = useSidebar();
  const { notificationCount } = useNotification();
  const user = session?.user;

  const displayName =
    user?.user_metadata?.name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "User";
  const displayInitial = displayName?.charAt(0).toUpperCase() || "U";
  const avatarUrl = user?.user_metadata?.avatar_url;

  const a_coins = user?.user_metadata?.coins?.a_coins ?? 0;
  const b_coins = user?.user_metadata?.coins?.b_coins ?? 0;
  const p_coins = user?.user_metadata?.coins?.p_coins ?? 0;

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
                <Link to="/earn-coins" className="relative">
                  <div className="flex items-center">
                    <img src="/A coins.png" alt="Coins" className="w-6 h-6" />
                    <span className="ml-2">{a_coins}</span>
                    <div className="absolute -bottom-1 -left-1 bg-gray-800 rounded-full">
                      <svg
                        className="w-4 h-4 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>A coins</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/earn-coins" className="relative">
                  <div className="flex items-center">
                    <img src="/B coins.png" alt="Gems" className="w-6 h-6" />
                    <span className="ml-2">{b_coins}</span>
                    <div className="absolute -bottom-1 -left-1 bg-gray-800 rounded-full">
                      <svg
                        className="w-4 h-4 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>B coins</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/earn-coins" className="relative">
                  <div className="flex items-center">
                    <img src="/P coins.png" alt="Shield" className="w-6 h-6" />
                    <span className="ml-2">{p_coins}</span>
                    <div className="absolute -bottom-1 -left-1 bg-gray-800 rounded-full">
                      <svg
                        className="w-4 h-4 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </Link>
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
            <Link to="/inbox" className="relative">
              <Button variant="ghost" size="icon">
                <span role="img" aria-label="Inbox">
                  🔔
                </span>
                {notificationCount > 0 && (
                  <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full">
                    {notificationCount}
                  </span>
                )}
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
