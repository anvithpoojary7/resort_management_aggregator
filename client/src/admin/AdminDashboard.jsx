import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaHotel, FaBook, FaSignOutAlt } from 'react-icons/fa';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <div
          className="bg-white p-6 rounded-xl shadow-md cursor-pointer hover:shadow-lg"
          onClick={() => navigate("/admin/resorts")}
        >
          <FaHotel className="text-3xl mb-2 text-blue-600" />
          <h2 className="text-xl font-semibold">Manage Resorts</h2>
        </div>

        <div
          className="bg-white p-6 rounded-xl shadow-md cursor-pointer hover:shadow-lg"
          onClick={() => navigate("/admin/users")}
        >
          <FaUsers className="text-3xl mb-2 text-green-600" />
          <h2 className="text-xl font-semibold">View Users</h2>
        </div>

        <div
          className="bg-white p-6 rounded-xl shadow-md cursor-pointer hover:shadow-lg"
          onClick={() => navigate("/admin/bookings")}
        >
          <FaBook className="text-3xl mb-2 text-yellow-600" />
          <h2 className="text-xl font-semibold">All Bookings</h2>
        </div>

        <div
          className="bg-white p-6 rounded-xl shadow-md cursor-pointer hover:shadow-lg"
          onClick={handleLogout}
        >
          <FaSignOutAlt className="text-3xl mb-2 text-red-600" />
          <h2 className="text-xl font-semibold">Logout</h2>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;