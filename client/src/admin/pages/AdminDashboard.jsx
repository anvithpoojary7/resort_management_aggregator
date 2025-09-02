import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";

import Sidebar from "../components/Sidebar";
import DashboardCards from "../components/DashboardCards";
import RevenueChart from "../components/RevenueChart";
import UserGrowthChart from "../components/UserGrowthChart";
import RecentActivity from "../components/RecentActivity";
import QuickActions from "../components/QuickActions";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔐 Route Guard for admin
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const user = JSON.parse(localStorage.getItem("user"));

    if (!isLoggedIn || !user || user.role !== "admin") {
      navigate("/admin/login", { replace: true });
    }
  }, [navigate]);

  // ⛔ Prevent back navigation
  // This is an aggressive way to prevent back navigation and can lead to poor UX.
  // Consider a more user-friendly approach if this is a strict requirement.
  useEffect(() => {
    // Push the same route multiple times to the history stack
    for (let i = 0; i < 10; i++) {
      window.history.pushState(null, "", "/admin/dashboard");
    }
    const blockBack = () => {
      window.history.pushState(null, "", "/admin/dashboard");
    };
    window.addEventListener("popstate", blockBack);
    return () => {
      window.removeEventListener("popstate", blockBack);
    };
  }, []);

  // 📡 Fetch all dashboard data
  useEffect(() => {
    const fetchAllDashboardData = async () => {
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const results = await Promise.allSettled([
          axios.get(
            "http://localhost:8080/api/admin/analytics/dashboard",
            config
          ),
          axios.get(
            "http://localhost:8080/api/admin/analytics/recent-activity",
            config
          ),
          axios.get(
            "http://localhost:8080/api/admin/analytics/revenue-chart",
            config
          ),
          axios.get(
            "http://localhost:8080/api/admin/analytics/user-growth",
            config
          ),
        ]);

        const [
          dashboardResult,
          activityResult,
          revenueResult,
          userGrowthResult,
        ] = results;

        const isFulfilled = (result) => result.status === "fulfilled";

        // If all requests fail, show the main error message.
        if (results.every((result) => result.status === "rejected")) {
          // Log the first reason for failure for debugging
          const firstError = results.find((r) => r.status === "rejected");
          throw firstError.reason;
        }

        // Log errors for any individual failed requests for debugging
        if (!isFulfilled(dashboardResult)) console.error("Failed to fetch dashboard cards data:", dashboardResult.reason);
        if (!isFulfilled(activityResult)) console.error("Failed to fetch recent activity:", activityResult.reason);
        if (!isFulfilled(revenueResult)) console.error("Failed to fetch revenue data:", revenueResult.reason);
        if (!isFulfilled(userGrowthResult)) console.error("Failed to fetch user growth data:", userGrowthResult.reason);

        setDashboardData({
          dashboard: isFulfilled(dashboardResult)
            ? dashboardResult.value.data
            : { data: null, pendingResortsCount: 0 },
          activity: isFulfilled(activityResult)
            ? activityResult.value.data.data
            : [],
          revenue: isFulfilled(revenueResult)
            ? revenueResult.value.data.data
            : [],
          userGrowth: isFulfilled(userGrowthResult)
            ? userGrowthResult.value.data.data
            : [],
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllDashboardData();
    // Refresh data every 2 minutes
    const intervalId = setInterval(fetchAllDashboardData, 120000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <FaSpinner className="animate-spin text-blue-500 text-4xl" />
          </div>
        ) : error ? (
          <div className="text-center p-4 bg-red-100 text-red-700 rounded-lg">
            <p className="font-semibold">An Error Occurred</p>
            <p>{error}</p>
          </div>
        ) : (
          dashboardData && (
            <>
              <DashboardCards analyticsData={dashboardData.dashboard.data} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <RevenueChart chartData={dashboardData.revenue} />
                <UserGrowthChart userData={dashboardData.userGrowth} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <RecentActivity activities={dashboardData.activity} />
                <QuickActions
                  pendingResortsCount={dashboardData.dashboard.pendingResortsCount}
                />
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
