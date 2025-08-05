import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FaHotel,
  FaUsers,
  FaChartBar,
  FaSignOutAlt,
  FaHome
} from 'react-icons/fa';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token');

    navigate(`/${process.env.REACT_APP_ADMIN_URL_PATH || 'admin-portal-secret/login'}`);
  };

  const navLinkClass = 'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors';

  const activeClass = ({ isActive }) =>
    isActive
      ? `bg-blue-100 text-blue-600 font-semibold ${navLinkClass}`
      : `text-gray-700 hover:bg-gray-100 hover:text-blue-600 ${navLinkClass}`;

  return (
    <aside className="w-64 h-screen bg-white shadow-md flex flex-col justify-between sticky top-0">
      <div>
        {/* Logo/Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-blue-700">ResortAdmin</h1>
        </div>

        {/* Nav Links */}
        <nav className="p-4 flex flex-col gap-2">
          <NavLink to="/admin/dashboard" className={activeClass}>
            <FaHome className="text-lg" /> <span>Dashboard</span>
          </NavLink>
          <NavLink to="/admin/resorts" className={activeClass}>
            <FaHotel className="text-lg" /> <span>Add Resorts</span>
          </NavLink>
          <NavLink to="/admin/users" className={activeClass}>
            <FaUsers className="text-lg" /> <span>Manage Resorts</span>
          </NavLink>
          {/* <NavLink to="/admin/analytics" className={activeClass}>
            <FaChartBar className="text-lg" /> <span>Analytics</span>
          </NavLink> */}
        </nav>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors"
        >
          <FaSignOutAlt className="text-lg" /> <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
