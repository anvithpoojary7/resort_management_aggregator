import React from 'react';

const UserTable = ({ users }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm font-medium uppercase text-left">
            <th className="py-3 px-4">User Details</th>
            <th className="py-3 px-4">Contact</th>
            <th className="py-3 px-4">Join Date</th>
            <th className="py-3 px-4">Activity</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
              <td className="py-3 px-4">
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold mr-3 ${
                      user.role === 'Guest' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                    }`}
                  >
                    {user.name ? user.name[0].toUpperCase() : '?'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{user.name || 'Unnamed'}</p>
                    <p className="text-sm text-gray-500">{user.role || 'User'}</p>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4 text-gray-700">
                <p className="text-sm">{user.email || 'N/A'}</p>
                <p className="text-xs text-gray-500">{user.phone || 'No phone'}</p>
              </td>
              <td className="py-3 px-4 text-gray-700 text-sm">
                {new Date(user.createdAt || Date.now()).toLocaleDateString()}
              </td>
              <td className="py-3 px-4 text-gray-700 text-sm">
                <p>{user.activityBookings || 0} bookings</p>
                <p className="text-xs text-gray-500">{user.activitySpent || '₹0'}</p>
              </td>
              <td className="py-3 px-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    user.status === 'Active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {user.status || 'Inactive'}
                </span>
              </td>
              <td className="py-3 px-4 flex items-center justify-center space-x-2">
                {user.status === 'Blocked' ? (
                  <button className="text-green-500 hover:text-green-700 p-2 rounded-full hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                ) : (
                  <button className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  </button>
                )}
                <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 0 00-1-1h-4a1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
