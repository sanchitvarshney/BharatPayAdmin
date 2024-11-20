import useAuth from "@/hooks/useAuth";
import React, { useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
interface ProtectedProps {
  children: ReactNode;
  authentication?: boolean;
  unsderConstruction?: boolean;
}
const ProtectedRoute: React.FC<ProtectedProps> = ({ children, authentication = true }) => {
  const authStatus: boolean = useAuth(); // This should ideally come from your auth logic/state
  const navigate = useNavigate();

  useEffect(() => {
    if (authentication && authStatus !== authentication) {
      navigate("/login");
    } else if (!authentication && authStatus !== authentication) {
      navigate("/");
    }
  }, [authStatus, authentication]);
  return <>{children}</>;
};

export default ProtectedRoute;
