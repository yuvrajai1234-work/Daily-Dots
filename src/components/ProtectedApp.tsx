import { Outlet } from "react-router-dom";
import { SharedLayout } from "@/components/SharedLayout";

const ProtectedApp = () => {
  return (
    <SharedLayout>
      <Outlet />
    </SharedLayout>
  );
};

export default ProtectedApp;
