import React from 'react';

const ResortTable = ({ resorts }) => {
  if (!Array.isArray(resorts)) {
    return (
      <div className="text-center text-red-500 py-4">
        Invalid resort data.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm font-medium uppercase text-left">
            <th className="py-3 px-4">Resort Details</th>
            <th className="py-3 px-4">Owner</th>
            <th className="py-3 px-4">Performance</th>
            <th className="py-3 px-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {resorts.map((resort) => (
            <tr
              key={resort._id}
              className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
            >
              <td className="py-3 px-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold mr-3 bg-blue-100 text-blue-700">
                    🏖️
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{resort.name}</p>
                    <p className="text-sm text-gray-500">{resort.location}</p>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4 text-gray-700 text-sm">
                {resort.ownerId?.name || 'Unknown'}
              </td>
              <td className="py-3 px-4 text-gray-700 text-sm">
                <p>{resort.bookings || 0} bookings</p>
                <p className="text-xs text-gray-500">
                  ₹{resort.revenue || 0} revenue
                </p>
              </td>
              <td className="py-3 px-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    resort.status === 'approved'
                      ? 'bg-green-100 text-green-700'
                      : resort.status === 'rejected'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {resort.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResortTable;
