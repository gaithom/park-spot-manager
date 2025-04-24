
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useParking } from "@/context/parking";

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const { user } = useParking();

  if (!user.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // If adminOnly is true and user is not an admin, redirect to dashboard
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
