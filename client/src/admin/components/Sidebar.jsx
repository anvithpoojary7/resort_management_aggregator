import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHotel, FaUsers, FaChartBar, FaSignOutAlt, FaHome } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className="w-64 min-h-screen bg-white shadow-lg p-4">
      <h2 className="text-xl font-bold mb-6">ResortAdmin</h2>
      <nav className="space-y-4">
        <NavLink to="/admin/dashboard" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
          <FaHome /> Dashboard
        </NavLink>
        <NavLink to="/admin/resorts" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
          <FaHotel /> Resorts
        </NavLink>
        <NavLink to="/admin/users" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
          <FaUsers /> Users
        </NavLink>
        <NavLink to="/admin/analytics" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
          <FaChartBar /> Analytics
        </NavLink>
        <NavLink to="/login" onClick={() => localStorage.removeItem("user")} className="flex items-center gap-2 text-gray-700 hover:text-red-600">
          <FaSignOutAlt /> Logout
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
