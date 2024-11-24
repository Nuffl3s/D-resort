import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const accessToken = localStorage.getItem("access"); // JWT Access Token
  const userRole = localStorage.getItem("user_role"); // Role stored during Login

  // Check if the user is authenticated
  if (!accessToken) {
    return <Navigate to="/" replace />;
  }

  // Allow Admin to access Employee routes
  if (userRole === "Admin" && allowedRoles.includes("Employee")) {
    return children;
  }

  // Check if user's role is in the allowed roles
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
