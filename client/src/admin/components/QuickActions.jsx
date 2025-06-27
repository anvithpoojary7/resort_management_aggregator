import React from 'react';

const QuickActions = () => (
  <div className="bg-white p-4 rounded-lg shadow">
    <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
    <div className="space-y-4">
      <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded">Review Pending Resorts</button>
      <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">Manage Users</button>
      <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded">View Analytics</button>
    </div>
  </div>
);

export default QuickActions;
