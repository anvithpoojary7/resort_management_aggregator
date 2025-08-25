import React, { useState, useEffect } from 'react';
import ResortTable from '../components/ResortTable';
import Sidebar from '../components/Sidebar';
// ✅ 1. ADD THE IMPORT FOR THE MODAL
import EditResortModal from '../components/EditResortModal';

const AdminResortTablePage = () => {
  const [resorts, setResorts] = useState([]);
  const [loading, setLoading] = useState(false);
  // ✅ 2. ADD THE STATE TO MANAGE WHICH RESORT IS SELECTED
  const [selectedResort, setSelectedResort] = useState(null);

  useEffect(() => {
    fetchResorts();
  }, []);

  const fetchResorts = async () => {
    setLoading(true);
    try {
      // Note: Make sure this URL is correct for fetching ALL resorts for the admin
      const res = await fetch('http://localhost:8080/api/admin/resorts');
      const data = await res.json();
      // Assuming the data is an array of resorts and doesn't need filtering here
      setResorts(data);
    } catch (err)  {    console.error('Failed to fetch resorts:', err);
     
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
              // ✅ 3. PASS THE REQUIRED PROPS TO THE TABLE
              <ResortTable
                resorts={resorts}
                fetchResorts={fetchResorts}
                onEdit={setSelectedResort}
              />
            )}
          </div>
        </div>
      </main>

      {/* ✅ 4. ADD THE MODAL AT THE END. IT WILL APPEAR WHEN A RESORT IS SELECTED. */}
      {selectedResort && (
        <EditResortModal
          resort={selectedResort}
          onClose={() => setSelectedResort(null)}
          fetchResorts={fetchResorts}
        />
      )}
    </div>
  );
};

export default AdminResortTablePage;