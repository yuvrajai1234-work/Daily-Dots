
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useAuth } from "./AuthProvider";
import { useSidebar } from "@/contexts/SidebarContext";
import { useUserProfile } from "@/hooks/useUserProfile"; // Import the new hook

export function TopBar() {
  const { session } = useAuth();
  const { isSidebarCollapsed } = useSidebar();
  const { userProfile } = useUserProfile(); // Use the new hook
  const user = session?.user;

  const displayName =
    user?.user_metadata?.name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "User";
  const displayInitial = displayName?.charAt(0).toUpperCase() || "U";
  const avatarUrl = user?.user_metadata?.avatar_url;

  // Get the coins value from the user profile, or default to 0
  const coins = userProfile?.coins ?? 0;

  return (
    <div className="bg-gray-900 text-white border-b">
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
          <div className="flex items-center">
            <span role="img" aria-label="Energy">
              ⚡️
            </span>
            <span className="ml-2">1/100</span>
          </div>
          <div className="flex items-center">
            <span role="img" aria-label="Coins">
              💰
            </span>
            <span className="ml-2">{coins}</span>
          </div>
          <div className="flex items-center">
            <span role="img" aria-label="Gems">
              💎
            </span>
            <span className="ml-2">900</span>
          </div>
          <div className="flex items-center">
            <span role="img" aria-label="Shield">
              🛡️
            </span>
            <span className="ml-2">999,999,999</span>
          </div>
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
    </div>
  );
}
