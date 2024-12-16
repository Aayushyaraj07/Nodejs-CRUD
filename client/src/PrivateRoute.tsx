import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute: React.FC = () => {
  // Check if token exists in sessionStorage
  const token = sessionStorage.getItem("token");

  if (!token) {
    // Redirect to login page if there's no token
    return <Navigate to="/" />;
  }

  // If token exists, render the protected route
  return <Outlet />;
};

export default PrivateRoute;
