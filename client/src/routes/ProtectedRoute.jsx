import { Navigate, useLocation } from "react-router";

import routePaths from "./routePaths.js";
import useAuthStore from "../stores/authStore.js";

function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();

  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);

  if (!accessToken || !user) {
    return (
      <Navigate to={routePaths.login} replace state={{ from: location }} />
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={routePaths.home} replace />;
  }

  return children;
}

export default ProtectedRoute;
