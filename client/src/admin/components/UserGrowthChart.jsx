import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const UserGrowthChart = ({ userData = [] }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  if (!userData) {
    return null; // Or a loading/empty state
  }

  const handleMouseOver = (data, index) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  // Calculate total users and growth percentage
  const totalUsers = userData.reduce((sum, item) => sum + item.users, 0);
  const latestMonthUsers = userData.length > 0 ? userData[userData.length - 1].users : 0;
  const previousMonthUsers = userData.length > 1 ? userData[userData.length - 2].users : 0;
  const growthPercentage = previousMonthUsers > 0 
    ? ((latestMonthUsers - previousMonthUsers) / previousMonthUsers * 100).toFixed(1)
    : 0;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">User Growth</h3>
        <div className="text-sm text-gray-500">
          <span className="font-medium text-gray-700">{totalUsers}</span> total users
          {growthPercentage > 0 && (
            <span className="ml-2 text-green-600">
              +{growthPercentage}%
            </span>
          )}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={userData} onMouseLeave={handleMouseLeave}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tickLine={false}
            tick={{ fill: '#6b7280' }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false}
            tick={{ fill: '#6b7280' }}
          />
          <Tooltip 
            cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
            contentStyle={{ backgroundColor: '#f9fafb', borderRadius: '0.375rem', border: 'none', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}
          />
          <Bar 
            dataKey="users" 
            radius={[4, 4, 0, 0]}
            onMouseOver={handleMouseOver}
          >
            {userData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={activeIndex === index ? '#2563eb' : '#3b82f6'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserGrowthChart;
