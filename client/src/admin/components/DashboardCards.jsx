import React from 'react';

const cards = [
  { label: 'Pending Approvals', value: 3, info: '+2 today', color: 'bg-orange-100', text: 'text-orange-700' },
  { label: 'Total Users', value: 5, info: '+12 this week', color: 'bg-blue-100', text: 'text-blue-700' },
  { label: 'Active Resorts', value: 4, info: '+5 this month', color: 'bg-green-100', text: 'text-green-700' },
  { label: 'Monthly Revenue', value: '$42,500', info: '+18% from last month', color: 'bg-purple-100', text: 'text-purple-700' }
];

const DashboardCards = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    {cards.map((card, index) => (
      <div key={index} className={`p-4 rounded-lg shadow ${card.color}`}>
        <h4 className={`text-sm font-medium ${card.text}`}>{card.label}</h4>
        <p className="text-2xl font-bold mt-2">{card.value}</p>
        <span className="text-sm text-gray-500">{card.info}</span>
      </div>
    ))}
  </div>
);

export default DashboardCards;