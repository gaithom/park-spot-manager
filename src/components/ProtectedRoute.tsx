
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useParking } from "@/context/parking";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useParking();

  if (!user.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
