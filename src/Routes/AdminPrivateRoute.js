import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AdminPrivateRoute = () => {
  const user = useSelector((state) => state.auth.user);
  const userRole = user?.role;

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  if (userRole !== "admin") {
    alert("only admin user can access this...");
    return <Navigate to="/"/>
  }

  return <Outlet />;
};

export default AdminPrivateRoute;
