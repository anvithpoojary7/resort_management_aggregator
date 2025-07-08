import React, { useState, useEffect } from 'react';
import ResortTable from '../components/ResortTable';
import UserTable from '../components/UserTable';
import Sidebar from '../components/Sidebar';

const UserAndResortTables = ({ initialTab = 'users' }) => {
  const [tab, setTab] = useState(initialTab);
  const [users, setUsers] = useState([]);
  const [resorts, setResorts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [tab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (tab === 'users') {
        const res = await fetch('http://localhost:8080/api/admin/users');
        const data = await res.json();
        setUsers(data);
      } else if (tab === 'resorts') {
        const res = await fetch('http://localhost:8080/api/resorts/admin/resorts');
        const data = await res.json();
        setResorts(data.filter((r) => r.status === 'approved'));
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-6">
        <div className="bg-white rounded-lg shadow-md">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setTab('users')}
              className={`px-6 py-3 text-sm font-medium ${
                tab === 'users' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setTab('resorts')}
              className={`px-6 py-3 text-sm font-medium ${
                tab === 'resorts' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'
              }`}
            >
              Resorts
            </button>
          </div>

          <div className="p-4">
            {loading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : tab === 'users' ? (
              <UserTable users={users} />
            ) : (
              <ResortTable resorts={resorts} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserAndResortTables;
