import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHotel, FaUsers, FaChartBar, FaSignOutAlt, FaHome } from 'react-icons/fa';

const Sidebar = () => {
  const navLinkClass =
    'flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition';

  const activeClass = ({ isActive }) =>
    isActive ? 'bg-blue-100 text-blue-700 font-semibold ' + navLinkClass : navLinkClass;

  return (
    <div className="w-64 min-h-screen bg-white shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">ResortAdmin</h2>

      <nav className="flex flex-col gap-4">
        <NavLink to="/admin/dashboard" className={activeClass}>
          <FaHome /> Dashboard
        </NavLink>
        <NavLink to="/admin/resorts" className={activeClass}>
          <FaHotel /> Resorts
        </NavLink>
        <NavLink to="/admin/users" className={activeClass}>
          <FaUsers /> Users
        </NavLink>
        <NavLink to="/admin/analytics" className={activeClass}>
          <FaChartBar /> Analytics
        </NavLink>
        <NavLink
          to="/login"
          onClick={() => localStorage.removeItem('user')}
          className="flex items-center gap-2 px-3 py-2 mt-6 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition"
        >
          <FaSignOutAlt /> Logout
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;


