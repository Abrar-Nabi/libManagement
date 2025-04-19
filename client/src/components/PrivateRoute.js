import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userData = JSON.parse(localStorage.getItem("user"));

  if (!token) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(userData?.role)) return <Navigate to="/user-dashboard" />;

  return children;
};

export default PrivateRoute;
