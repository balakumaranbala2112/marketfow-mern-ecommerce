import { Navigate, useLocation } from "react-router";

import routePaths from "./routePaths.js";
import useAuthStore from "../stores/authStore.js";

function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();

  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);

  const isAuthenticated = Boolean(accessToken && user);

  if (!isAuthenticated) {
    return (
      <Navigate
        to={routePaths.login}
        replace
        state={{ from: location }}
      />
    );
  }

  const isRoleRestricted =
    Array.isArray(allowedRoles) && allowedRoles.length > 0;

  const isAuthorized =
    !isRoleRestricted || allowedRoles.includes(user.role);

  if (!isAuthorized) {
    return (
      <Navigate
        to={routePaths.unauthorized}
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;