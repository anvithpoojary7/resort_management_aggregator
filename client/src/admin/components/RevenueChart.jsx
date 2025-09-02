import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const RevenueChart = ({ chartData = [] }) => {
  const [chartType, setChartType] = useState('line');

  if (!chartData) {
    return null; // Or a loading/empty state
  }

  const formatYAxisTick = (value) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}k`;
    }
    return `$${value}`;
  };

  const formatTooltipValue = (value) => {
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Revenue Trend</h3>
        <div className="flex gap-2 text-sm">
          <button 
            className={`${chartType === 'line' ? 'text-blue-600 font-semibold border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
            onClick={() => setChartType('line')}
          >
            Line
          </button>
          <button 
            className={`${chartType === 'area' ? 'text-blue-600 font-semibold border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
            onClick={() => setChartType('area')}
          >
            Area
          </button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        {chartType === 'line' ? (
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tickFormatter={formatYAxisTick}
            />
            <Tooltip 
              formatter={formatTooltipValue}
              labelStyle={{ color: '#374151' }}
              contentStyle={{ backgroundColor: '#f9fafb', borderRadius: '0.375rem', border: 'none', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#3b82f6" 
              strokeWidth={2} 
              dot={{ stroke: '#3b82f6', strokeWidth: 2, r: 4, fill: '#fff' }} 
              activeDot={{ stroke: '#3b82f6', strokeWidth: 2, r: 6, fill: '#fff' }}
            />
          </LineChart>
        ) : (
          <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tickFormatter={formatYAxisTick}
            />
            <Tooltip 
              formatter={formatTooltipValue}
              labelStyle={{ color: '#374151' }}
              contentStyle={{ backgroundColor: '#f9fafb', borderRadius: '0.375rem', border: 'none', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#3b82f6" 
              fill="#dbeafe" 
              strokeWidth={2}
              dot={{ stroke: '#3b82f6', strokeWidth: 2, r: 4, fill: '#fff' }}
              activeDot={{ stroke: '#3b82f6', strokeWidth: 2, r: 6, fill: '#fff' }}
            />
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
