import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar'; // Assuming this path
import Header from '../components/Header';   // Assuming this path
import UserTable from '../components/UserTable'; // Reusing from previous response
import ResortTable from '../components/ResortTable'; // New component we'll create

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'resorts'

  const [users, setUsers] = useState([]);
  const [resorts, setResorts] = useState([]);

  const [loadingUsers, setLoadingUsers] = useState(true);
  const [errorUsers, setErrorUsers] = useState(null);

  const [loadingResorts, setLoadingResorts] = useState(true);
  const [errorResorts, setErrorResorts] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');

  // --- Data Fetching for Users ---
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        setErrorUsers(null);
        // Simulate API call for users
        const response = await new Promise(resolve => setTimeout(() => {
          resolve({
            data: [
              {
                id: 1, avatar: 'E', name: 'Emily Johnson', role: 'Guest', email: 'emily.johnson@email.com', phone: '+1 (555) 123-4567', joinDate: 'Jan 15, 2024', activityBookings: 5, activitySpent: '$2,400', status: 'Active',
              },
              {
                id: 2, avatar: 'M', name: 'Michael Chen', role: 'Resort Owner', email: 'michael.chen@email.com', phone: '+1 (555) 234-5678', joinDate: 'Jan 20, 2024', activityBookings: 0, activitySpent: '$0', status: 'Active',
              },
              {
                id: 3, avatar: 'S', name: 'Sarah Davis', role: 'Guest', email: 'sarah.davis@email.com', phone: '+1 (555) 345-6789', joinDate: 'Feb 1, 2024', activityBookings: 2, activitySpent: '$800', status: 'Blocked',
              },
              {
                id: 4, avatar: 'D', name: 'David Park', role: 'Guest', email: 'david.park@email.com', phone: '+1 (555) 456-7890', joinDate: 'Feb 5, 2024', activityBookings: 3, activitySpent: '$1,200', status: 'Active',
              },
              {
                id: 5, avatar: 'L', name: 'Lisa Rodriquez', role: 'Resort Owner', email: 'lisa.rodriquez@email.com', phone: '+1 (555) 567-8901', joinDate: 'Dec 10, 2023', activityBookings: 0, activitySpent: '$0', status: 'Active',
              },
            ]
          });
        }, 800)); // Simulate API call delay

        setUsers(response.data);
      } catch (err) {
        setErrorUsers('Failed to fetch users.');
        console.error('Error fetching users:', err);
      } finally {
        setLoadingUsers(false);
      }
    };

    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]); // Re-fetch users when activeTab changes to 'users'

  // --- Data Fetching for Resorts ---
  useEffect(() => {
    const fetchResorts = async () => {
      try {
        setLoadingResorts(true);
        setErrorResorts(null);
        // Simulate API call for resorts
        const response = await new Promise(resolve => setTimeout(() => {
          resolve({
            data: [
              {
                id: 101, icon: '🏡', name: 'Sunset Bay Villa', location: 'Monterey Bay, California', owner: 'Sarah Mitchell', bookings: 45, revenue: '$67,500', status: 'Active',
              },
              {
                id: 102, icon: '🏡', name: 'Alpine Retreat', location: 'Lake Tahoe, Nevada', owner: 'John Anderson', bookings: 32, revenue: '$48,000', status: 'Active',
              },
              {
                id: 103, icon: '🏡', name: 'Coastal Paradise', location: 'Big Sur, California', owner: 'Maria Garcia', bookings: 28, revenue: '$42,000', status: 'Blocked',
              },
              {
                id: 104, icon: '🏡', name: 'Forest Haven', location: 'Olympic Peninsula, Washington', owner: 'Robert Kim', bookings: 38, revenue: '$57,000', status: 'Active',
              },
            ]
          });
        }, 800)); // Simulate API call delay

        setResorts(response.data);
      } catch (err) {
        setErrorResorts('Failed to fetch resorts.');
        console.error('Error fetching resorts:', err);
      } finally {
        setLoadingResorts(false);
      }
    };

    if (activeTab === 'resorts') {
      fetchResorts();
    }
  }, [activeTab]); // Re-fetch resorts when activeTab changes to 'resorts'


  const filteredUsers = users.filter(user => {
    const matchesSearchTerm = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || user.status === statusFilter;
    return matchesSearchTerm && matchesStatus;
  });

  const filteredResorts = resorts.filter(resort => {
    const matchesSearchTerm = resort.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              resort.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              resort.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || resort.status === statusFilter;
    return matchesSearchTerm && matchesStatus;
  });


  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header /> {/* Reusing the Header component */}
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6">Admin Dashboard</h1>

          <section className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-medium text-gray-700 mb-4">User & Resort Management</h2>
            <p className="text-gray-500 mb-6">Manage users and resort owners on your platform</p>

            <div className="flex space-x-4 mb-6">
              <button
                className={`flex items-center justify-center px-6 py-3 rounded-lg shadow-md transition duration-200 ${
                  activeTab === 'users' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
                onClick={() => { setActiveTab('users'); setSearchTerm(''); setStatusFilter('All Status'); }}
              >
                <span className="mr-2">👤</span> Users ({users.length})
              </button>
              <button
                className={`flex items-center justify-center px-6 py-3 rounded-lg shadow-md transition duration-200 ${
                  activeTab === 'resorts' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
                onClick={() => { setActiveTab('resorts'); setSearchTerm(''); setStatusFilter('All Status'); }}
              >
                Resorts ({resorts.length})
              </button>
            </div>

            {/* Search and Filter */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder={`Search ${activeTab === 'users' ? 'users' : 'resorts'}...`}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
              </div>
              <div className="relative">
                <select
                  className="appearance-none pr-8 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Blocked</option>
                  {/* Add other status options if needed for resorts */}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
            </div>

            {activeTab === 'users' ? (
              <>
                {loadingUsers && <p className="text-center text-blue-500">Loading users...</p>}
                {errorUsers && <p className="text-center text-red-500">{errorUsers}</p>}
                {!loadingUsers && !errorUsers && (
                  <UserTable users={filteredUsers} />
                )}
              </>
            ) : (
              <>
                {loadingResorts && <p className="text-center text-blue-500">Loading resorts...</p>}
                {errorResorts && <p className="text-center text-red-500">{errorResorts}</p>}
                {!loadingResorts && !errorResorts && (
                  <ResortTable resorts={filteredResorts} />
                )}
              </>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;