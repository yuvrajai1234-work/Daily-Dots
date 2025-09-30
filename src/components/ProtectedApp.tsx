import { useAuth } from "./AuthProvider";
import { SharedLayout } from "./SharedLayout";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedApp = () => {
  const { session } = useAuth();

  if (!session) return <Navigate to="/sign-in" />;

  return (
    <SharedLayout>
      <Outlet />
    </SharedLayout>
  );
};

export default ProtectedApp;
