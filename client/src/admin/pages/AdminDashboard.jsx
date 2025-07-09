import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Sidebar from '../components/Sidebar';
import DashboardCards from '../components/DashboardCards';
import RevenueChart from '../components/RevenueChart';
import UserGrowthChart from '../components/UserGrowthChart';
import RecentActivity from '../components/RecentActivity';
import QuickActions from '../components/QuickActions';

const AdminDashboard = () => {
  const navigate = useNavigate();

  // 🔐 Route Guard for admin
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const user = JSON.parse(localStorage.getItem('user'));

    if (!isLoggedIn || !user || user.role !== 'admin') {
      navigate('/admin/login', { replace: true });
    }
  }, [navigate]);

  // ⛔ Prevent back navigation
  useEffect(() => {
    // Push the same route multiple times to the history stack
    for (let i = 0; i < 10; i++) {
      window.history.pushState(null, '', '/admin/dashboard');
    }

    const blockBack = () => {
      window.history.pushState(null, '', '/admin/dashboard');
    };

    window.addEventListener('popstate', blockBack);

    return () => {
      window.removeEventListener('popstate', blockBack);
    };
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
      </div>
    </div>
  );
};

export default AdminDashboard;
