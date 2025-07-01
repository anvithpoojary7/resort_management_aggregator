import React from 'react';
import DashboardCards from '../components/DashboardCards';
import RevenueChart from '../components/RevenueChart';
import RevenueByResortType from '../components/RevenueByResortType'; // New component
import DetailedAnalyticsTable from '../components/DetailedAnalyticsTable'; // New component
import Sidebar from '../components/Sidebar'; // ✅ Add sidebar

const RevenueAnalytics = () => {
  // Placeholder data - in a real application, you'd fetch this from an API
  const revenueData = [
    { name: 'Feb 2', value: 2500 },
    { name: 'Feb 3', value: 1800 },
    { name: 'Feb 4', value: 3200 },
    { name: 'Feb 5', value: 2400 },
    { name: 'Feb 6', value: 3800 },
    { name: 'Feb 7', value: 2900 },
    { name: 'Feb 8', value: 4200 },
    { name: 'Feb 9', value: 3000 },
    { name: 'Feb 10', value: 4500 },
    { name: 'Feb 11', value: 2700 },
    { name: 'Feb 12', value: 4000 },
    { name: 'Feb 13', value: 2800 },
    { name: 'Feb 14', value: 4800 },
  ];

  const resortTypeData = [
    { name: 'City Escapes', value: 400 },
    { name: 'Beachfront Resorts', value: 300 },
    { name: 'Mountain Retreats', value: 300 },
    { name: 'Forest Retreat', value: 200 },
  ];

  const detailedAnalytics = [
    { period: 'Oct', revenue: '$38,000', bookings: 45, avgValue: '$844', growth: '+12%' },
    { period: 'Nov', revenue: '$42,000', bookings: 52, avgValue: '$808', growth: '+15%' },
    { period: 'Dec', revenue: '$45,000', bookings: 58, avgValue: '$776', growth: '+18%' },
    { period: 'Jan', revenue: '$48,000', bookings: 62, avgValue: '$774', growth: '+22%' },
    { period: 'Feb', revenue: '$42,500', bookings: 55, avgValue: '$773', growth: '+8%' },
  ];

return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* ✅ Sidebar */}
      <Sidebar />

      {/* ✅ Main Content */}
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Admin User</span>
              <span className="font-semibold text-gray-800">Super Admin</span>
              <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-bold">A</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Revenue Analytics</h2>
            <div className="flex items-center gap-3">
              <select className="border border-gray-300 rounded-md p-2">
                <option>Last 30 days</option>
                <option>Last 7 days</option>
                <option>Last 90 days</option>
              </select>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                Export
              </button>
            </div>
          </div>
          <p className="text-gray-600 mb-6">Track your platform's financial performance</p>

          <DashboardCards />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <RevenueChart data={revenueData} />
            <RevenueByResortType data={resortTypeData} />
          </div>

          <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Detailed Analytics</h3>
              <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01.293.707L16.586 19H7.414L3.707 6.293A1 1 0 013 5.586V4z" />
                </svg>
                Filter
              </button>
            </div>
            <DetailedAnalyticsTable data={detailedAnalytics} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueAnalytics;
