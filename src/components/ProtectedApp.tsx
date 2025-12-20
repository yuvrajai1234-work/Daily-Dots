
import { useAuth } from "./AuthProvider";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedApp = () => {
  const { session } = useAuth();

  if (!session) return <Navigate to="/sign-in" />;

  return <Outlet />;
};

export default ProtectedApp;
