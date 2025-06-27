import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', icon: '📊', path: '/admin/dashboard' },
    { name: 'Resort Moderation', icon: '🏢', path: '/admin/resorts', notification: 3 }, // Updated notification count
    { name: 'User Management', icon: '👥', path: '/admin/users', active: true },
    { name: 'Revenue Analytics', icon: '📈', path: '/admin/revenue' },
  ];

  return (
    <aside className="w-64 bg-white shadow-lg p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center mb-10">
          <div className="bg-purple-600 p-2 rounded-lg mr-3">
            <span className="text-white text-xl font-bold">R</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">ResortAdmin</h2>
            <p className="text-sm text-gray-500">Management Portal</p>
          </div>
        </div>

        <nav>
          <ul>
            {navItems.map((item) => (
              <li key={item.name} className="mb-4">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-lg transition-colors duration-200 ${
                      isActive || (item.name === 'User Management' && window.location.pathname === '/admin/users') // Explicitly check for User Management as it's the default view for this page
                        ? 'bg-purple-100 text-purple-700 font-semibold'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`
                  }
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                  {item.notification && (
                    <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {item.notification}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
            <li className="mb-4">
                <button className="flex items-center p-3 w-full text-left rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-200">
                    <span className="mr-3">➕</span> Add Resort
                </button>
            </li>
          </ul>
        </nav>
      </div>

      <div>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center p-3 rounded-lg transition-colors duration-200 ${
              isActive
                ? 'bg-purple-100 text-purple-700 font-semibold'
                : 'text-gray-600 hover:bg-gray-100'
            }`
          }
        >
          <span className="mr-3">⚙️</span> Settings
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;