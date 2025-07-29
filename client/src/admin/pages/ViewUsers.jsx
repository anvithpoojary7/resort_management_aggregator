import React, { useState, useEffect } from 'react';
import ResortTable from '../components/ResortTable';
import Sidebar from '../components/Sidebar';

const AdminResortTablePage = () => {
  const [resorts, setResorts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchResorts();
  }, []);

  const fetchResorts = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/resorts/admin/resorts');
      const data = await res.json();
      setResorts(data.filter((r) => r.status === 'approved'));
    } catch (err) {
      console.error('Failed to fetch resorts:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-6">
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">Approved Resorts</h2>
          </div>

          <div className="p-4">
            {loading ? (
              <p className="text-center text-gray-500">Loading resorts...</p>
            ) : (
              <ResortTable resorts={resorts} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminResortTablePage;
