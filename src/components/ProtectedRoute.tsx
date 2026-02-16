// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading, user } = useAuth();

  if (loading) return null;

  const hasToken = !!localStorage.getItem("gls_token");

  // must have token + user + active
  if (!hasToken || !user || user.status !== "active") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
