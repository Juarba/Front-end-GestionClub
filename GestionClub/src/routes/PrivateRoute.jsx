import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";

const PrivateRoute = ({ children, allowedRoles }) => {
  const { isLoggedIn, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p>Cargando...</p>;

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const userRole =
          decoded[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ];

        if (!allowedRoles.includes(userRole)) {
          return <Navigate to="/no-access" replace />;
        }
      } catch (error) {
        console.error("Error al decodificar token:", error);
        return <Navigate to="/login" replace />;
      }
    }
  }

  return children;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.array, 
};
export default PrivateRoute;
