import React from 'react';
import { FaUser, FaHotel, FaCalendarCheck } from 'react-icons/fa';

const RecentActivity = ({ activities = [] }) => {
  if (!activities) {
    return null; // Or a loading/empty state
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'user':
        return <FaUser className="text-blue-500" />;
      case 'resort':
        return <FaHotel className="text-green-500" />;
      case 'booking':
        return <FaCalendarCheck className="text-purple-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
      {activities.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No recent activity</p>
      ) : (
        <ul>
          {activities.map((item, index) => (
            <li key={index} className="mb-4 flex">
              <div className="mr-3 mt-1">
                {getActivityIcon(item.type)}
              </div>
              <div>
                <p className="text-gray-800">{item.desc}</p>
                <p className="text-sm text-gray-500">{item.timeFormatted}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentActivity;
