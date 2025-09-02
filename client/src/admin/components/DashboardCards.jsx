import React from 'react';
import { FaUsers, FaHotel, FaMoneyBillWave } from 'react-icons/fa';

const DashboardCards = ({ analyticsData }) => {

  const revenueChange = analyticsData?.revenueChangePercentage;
  const revenueChangeInfo = revenueChange
    ? `${revenueChange > 0 ? '+' : ''}${revenueChange.toFixed(1)}% from last month`
    : '0.0% from last month';

  const cards = [
    { 
      label: 'Total Users', 
      value: analyticsData?.totalUsers || 0, 
      info: `+${analyticsData?.newUsersThisWeek || 0} this week`, 
      color: 'bg-blue-100', 
      text: 'text-blue-700',
      icon: <FaUsers className="text-blue-700 text-xl" />
    },
    { 
      label: 'Active Resorts', 
      value: analyticsData?.activeResorts || 0, 
      info: `+${analyticsData?.newResortsThisMonth || 0} this month`, 
      color: 'bg-green-100', 
      text: 'text-green-700',
      icon: <FaHotel className="text-green-700 text-xl" />
    },
    { 
      label: 'Monthly Revenue', 
      value: `$${(analyticsData?.currentMonthRevenue || 0).toLocaleString()}`, 
      info: revenueChangeInfo,
      color: 'bg-purple-100', 
      text: 'text-purple-700',
      icon: <FaMoneyBillWave className="text-purple-700 text-xl" />
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div key={index} className={`p-4 rounded-lg shadow ${card.color}`}>
          <div className="flex justify-between items-center mb-2">
            <h4 className={`text-sm font-medium ${card.text}`}>{card.label}</h4>
            {card.icon}
          </div>
          <p className="text-2xl font-bold mt-2">{card.value}</p>
          <span className="text-sm text-gray-500">{card.info}</span>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
