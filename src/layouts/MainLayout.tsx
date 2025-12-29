
import { Outlet } from "react-router-dom";
import { TopBar } from "../components/TopBar";
import { useSidebar } from "../contexts/SidebarContext";
import Sidebar from "../components/Sidebar";

const MainLayout = () => {
  const { isSidebarCollapsed, setIsSidebarCollapsed } = useSidebar();

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
