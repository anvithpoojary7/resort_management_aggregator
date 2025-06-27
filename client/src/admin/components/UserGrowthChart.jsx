import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Oct', users: 110 },
  { month: 'Nov', users: 140 },
  { month: 'Dec', users: 165 },
  { month: 'Jan', users: 190 },
  { month: 'Feb', users: 220 }
];

const UserGrowthChart = () => (
  <div className="bg-white p-4 rounded-lg shadow">
    <h3 className="text-lg font-semibold mb-4">User Growth</h3>
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="users" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default UserGrowthChart;