import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRole?: "VENDOR" | "SUPPLIER";
}

const ProtectedRoute = ({ children, allowedRole }: ProtectedRouteProps) => {
  const storedUser = localStorage.getItem("user");
  const storedToken = localStorage.getItem("token");

  if (!storedUser || !storedToken) {
    return <Navigate to="/login" replace />;
  }

  let user: { role?: string } | null = null;
  try {
    user = JSON.parse(storedUser);
  } catch {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  if (!user || !user.role) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole) {
    // Normalize both sides to uppercase for a case-insensitive comparison
    const storedRole = (user.role ?? "").replace(/^ROLE_/i, "").toUpperCase();
    if (storedRole !== allowedRole) {
      // User is authenticated but not authorized for this role — send to their own dashboard
      if (storedRole === "VENDOR") return <Navigate to="/vendor/dashboard" replace />;
      if (storedRole === "SUPPLIER") return <Navigate to="/supplier/dashboard" replace />;
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;