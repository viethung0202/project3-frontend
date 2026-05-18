import { Navigate, useLocation } from "react-router-dom";
import useAuthUser from "@/hooks/authHook/useAuthUser";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { authUser, isLoading } = useAuthUser();
  const location = useLocation();

  // Đang check auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Chưa login
  if (!authUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role
  if (allowedRoles && !allowedRoles.includes(authUser.role)) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
}
