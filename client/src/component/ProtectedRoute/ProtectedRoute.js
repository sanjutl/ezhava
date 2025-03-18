import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ allowedRoles }) => {
  const { token, role, id: userId } = useSelector((state) => state.user);

  console.log("🔹 Token:", token);
  console.log("🔹 Role (Before Parsing):", role, "| Type:", typeof role);
  console.log("🔹 Allowed Roles:", allowedRoles, "| Allowed Types:", allowedRoles.map(r => typeof r));

  const parsedRole = parseInt(role);
  console.log("🔹 Parsed Role:", parsedRole, "| Type:", typeof parsedRole);

  if (!token) {
    console.warn("🔴 No token found, redirecting to /login");
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(parsedRole)) {
    console.warn(`🔴 Access denied for role ${parsedRole}. Redirecting to login.`);
    return <Navigate to="/" replace />;
  }

  console.log("✅ Access granted to protected route.");
  return <Outlet />;
};

export default ProtectedRoute;
