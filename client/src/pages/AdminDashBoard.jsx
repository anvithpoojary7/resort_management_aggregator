import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [resorts, setResorts] = useState([]);

  useEffect(() => {
    fetchResorts();
  }, []);

  const fetchResorts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/resorts/pending');
      setResorts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApproval = async (resortId, status) => {
    try {
      await axios.put(`http://localhost:5000/api/resorts/${resortId}/status`, { status });
      fetchResorts(); // refresh the list
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      {resorts.length === 0 ? (
        <p>No resorts pending approval.</p>
      ) : (
        resorts.map(resort => (
          <div key={resort._id} className="border p-4 mb-4 rounded shadow">
            <h2 className="text-xl font-semibold">{resort.name}</h2>
            <p>{resort.description}</p>
            <div className="mt-2 space-x-2">
              <button
                onClick={() => handleApproval(resort._id, 'approved')}
                className="bg-green-500 text-white px-4 py-1 rounded"
              >
                Approve
              </button>
              <button
                onClick={() => handleApproval(resort._id, 'rejected')}
                className="bg-red-500 text-white px-4 py-1 rounded"
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminDashboard;
