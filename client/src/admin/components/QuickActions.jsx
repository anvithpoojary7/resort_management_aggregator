import React from 'react';
import { FaHotel, FaUsers } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const QuickActions = ({ pendingResortsCount = 0 }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
      
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center">
          <FaHotel className="text-blue-500 mr-3 text-xl" />
          <div>
            <h4 className="font-medium">Pending Resort Approvals</h4>
            <p className="text-sm text-gray-600 mt-1">
              {pendingResortsCount} {pendingResortsCount === 1 ? 'resort' : 'resorts'} waiting for review
            </p>
          </div>
        </div>
        
        {pendingResortsCount > 0 && (
          <Link 
            to="/admin/resorts/pending" 
            className="mt-3 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
          >
            Review Pending Resorts
          </Link>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <Link 
          to="/admin/resorts" 
          className="p-3 bg-green-50 rounded-lg flex flex-col items-center justify-center hover:bg-green-100 transition-colors"
        >
          <FaHotel className="text-green-500 text-xl mb-2" />
          <span className="text-sm font-medium">Manage Resorts</span>
        </Link>
        
        <Link 
          to="/admin/users" 
          className="p-3 bg-purple-50 rounded-lg flex flex-col items-center justify-center hover:bg-purple-100 transition-colors"
        >
          <FaUsers className="text-purple-500 text-xl mb-2" />
          <span className="text-sm font-medium">Manage Users</span>
        </Link>
      </div>
    </div>
  );
};

export default QuickActions;
