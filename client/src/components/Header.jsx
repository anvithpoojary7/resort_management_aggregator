import React from 'react';

const Header = () => {
  return (
    <header className="bg-white shadow p-4 flex items-center justify-between">
      <div className="flex-1">
        {/* Placeholder for potential breadcrumbs or page title */}
      </div>
      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-gray-600 hover:text-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            2
          </span>
        </button>
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center text-purple-800 font-bold">
            A
          </div>
          <div>
            <p className="text-gray-800 font-medium">Admin User</p>
            <p className="text-gray-500 text-sm">Super Admin</p>
          </div>
          <button className="p-1 text-gray-600 hover:text-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;