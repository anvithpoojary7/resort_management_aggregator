import React from 'react';
import axios from 'axios';

const ResortTable = ({ resorts, fetchResorts }) => {
  const handleVisibilityToggle = async (id, visible) => {
    try {
      // **CHANGE THIS LINE**
      await axios.patch(
        `http://localhost:8080/api/admin/resorts/visibility/${id}`, // <-- Changed to 'resorts'
        { isVisible: visible }
      );

      alert(`Resort marked as ${visible ? 'Active' : 'Inactive'}`);
      fetchResorts(); // ✅ reload data
    } catch (error) {
      console.error('Error updating visibility:', error);
    }
  };
  

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm font-medium uppercase text-left">
            <th className="py-3 px-4">Resort Details</th>
            <th className="py-3 px-4">Owner</th>
            <th className="py-3 px-4">Performance</th>
            <th className="py-3 px-4">Visibility</th>
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
              <td className="py-3 px-4 space-x-2">
                <span
                  className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                    resort.visible
                      ? 'bg-green-100 text-green-700 border border-green-400'
                      : 'bg-red-100 text-red-700 border border-red-400'
                  }`}
                >
                  {resort.visible ? 'Active' : 'Inactive'}
                </span>
                <button
                  className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 border border-green-400"
                  onClick={() => handleVisibilityToggle(resort._id, true)}
                >
                  Active
                </button>
                <button
                  className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700 border border-red-400"
                  onClick={() => handleVisibilityToggle(resort._id, false)}
                >
                  Inactive
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResortTable;
