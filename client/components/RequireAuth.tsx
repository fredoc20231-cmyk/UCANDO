import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface RequireAuthProps {
  children: JSX.Element;
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Authentication required to access protected clinical & audit data", {
        id: "auth-required-toast",
      });
    }
  }, [isAuthenticated, location]);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};
