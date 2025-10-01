
import { useAuth } from "./AuthProvider";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useState } from "react";

const ProtectedApp = () => {
  const { session } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  if (!session) return <Navigate to="/sign-in" />;

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
      <main className={`flex-1 overflow-y-auto p-4 lg:p-6 transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default ProtectedApp;
