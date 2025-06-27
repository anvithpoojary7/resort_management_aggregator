import React from 'react';

const activity = [
  { desc: 'New resort "Ocean Breeze Villa" submitted for approval', time: '2 hours ago' },
  { desc: 'New user registration: Sarah Johnson', time: '4 hours ago' },
  { desc: 'Resort "Sunset Bay Villa" received new booking', time: '6 hours ago' },
  { desc: 'Resort "Mountain View Lodge" approved', time: '1 day ago' }
];

const RecentActivity = () => (
  <div className="bg-white p-4 rounded-lg shadow">
    <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
    <ul>
      {activity.map((item, index) => (
        <li key={index} className="mb-3">
          <p className="text-gray-800">{item.desc}</p>
          <p className="text-sm text-gray-500">{item.time}</p>
        </li>
      ))}
    </ul>
  </div>
);

export default RecentActivity;
