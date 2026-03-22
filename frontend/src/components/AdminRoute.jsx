import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // ❌ If no token OR no user OR not admin → redirect
  if (!token || !user || user.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  // ✅ If admin → allow access
  return children;
}

export default AdminRoute;