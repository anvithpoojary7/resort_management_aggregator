import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import DashboardCards from "../components/DashboardCards";
import RevenueChart from "../components/RevenueChart";
import UserGrowthChart from "../components/UserGrowthChart";
import RecentActivity from "../components/RecentActivity";
import QuickActions from "../components/QuickActions";
import ResortTable from "../components/ResortTable";
import EditResortModal from "../components/EditResortModal";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [resorts, setResorts] = useState([]);
  const [selectedResort, setSelectedResort] = useState(null);

  // 🔐 Route Guard
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const user = JSON.parse(localStorage.getItem("user"));

    if (!isLoggedIn || !user || user.role !== "admin") {
      navigate("/admin/login", { replace: true });
    }
  }, [navigate]);

  // ⛔ Prevent back navigation
  useEffect(() => {
    for (let i = 0; i < 10; i++) {
      window.history.pushState(null, "", "/admin/dashboard");
    }
    const blockBack = () => {
      window.history.pushState(null, "", "/admin/dashboard");
    };
    window.addEventListener("popstate", blockBack);
    return () => window.removeEventListener("popstate", blockBack);
  }, []);

  // 📡 Fetch resorts
  const fetchResorts = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8080/api/admin/resorts"
      );
      setResorts(data);
    } catch (error) {
      console.error("Error fetching resorts:", error);
    }
  };

  useEffect(() => {
    fetchResorts();
  }, []);

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {/* Overview Cards */}
        <DashboardCards />

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <RevenueChart />
          <UserGrowthChart />
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <RecentActivity />
          <QuickActions />
        </div>

        {/* Resorts Table */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Resorts</h2>
          <ResortTable
            resorts={resorts}
            fetchResorts={fetchResorts}
            onEdit={setSelectedResort} // This is the confirmed correct line
          />
        </div>
      </div>

      {/* Edit Resort Modal */}
      {selectedResort && (
        <EditResortModal
          resort={selectedResort}
          onClose={() => setSelectedResort(null)}
          fetchResorts={fetchResorts}
        />
      )}
    </div>
  );
};

export default AdminDashboard;