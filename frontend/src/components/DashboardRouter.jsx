// frontend/src/components/DashboardRouter.js
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import AdminDashboard from "./dashboards/AdminDashboard";
import DepartmentDashboard from "./dashboards/DepartmentDashboard";
import PublicDashboard from "./dashboards/PublicDashboard";

const DashboardRouter = () => {
  const { user } = useAuth();

  const renderDashboard = () => {
    if (user.role === "admin") {
      return <AdminDashboard />;
    } else if (
      ["electrical", "pwd", "municipal", "water", "sanitation"].includes(
        user.role
      )
    ) {
      return <DepartmentDashboard />;
    } else {
      return <PublicDashboard />;
    }
  };

  return <div className="min-h-screen bg-gray-50">{renderDashboard()}</div>;
};

export default DashboardRouter;
