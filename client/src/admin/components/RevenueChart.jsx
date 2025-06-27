import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { date: 'Feb 2', revenue: 2400 },
  { date: 'Feb 3', revenue: 3200 },
  { date: 'Feb 4', revenue: 2800 },
  { date: 'Feb 5', revenue: 2000 },
  { date: 'Feb 6', revenue: 3700 },
  { date: 'Feb 7', revenue: 2900 },
  { date: 'Feb 8', revenue: 4100 }
];

const RevenueChart = () => (
  <div className="bg-white p-4 rounded-lg shadow">
    <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default RevenueChart;