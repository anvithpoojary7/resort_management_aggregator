// ModerationPage.jsx
import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaUser, FaCalendarAlt, FaEye } from 'react-icons/fa';

const ModerationPage = () => {
  const [resorts, setResorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPendingResorts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/resorts?status=pending');
      if (!response.ok) {
        throw new Error(`Failed to fetch resorts: ${response.statusText}`);
      }
      const data = await response.json();
      setResorts(data);
    } catch (err) {
      console.error("Error fetching pending resorts:", err);
      setError("Failed to load pending resorts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingResorts();
  }, []);

  const handleStatusChange = async (resortId, newStatus) => {
    if (!window.confirm(`Are you sure you want to ${newStatus} this resort?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/resorts/${resortId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to update status: ${response.statusText}`);
      }

      // If successful, remove the resort from the pending list
      setResorts(prevResorts => prevResorts.filter(resort => resort._id !== resortId));
      alert(`Resort successfully ${newStatus}!`);
    } catch (err) {
      console.error('Error updating resort status:', err);
      alert(`Error ${newStatus} resort: ${err.message}`);
    }
  };

  const filteredResorts = resorts.filter(resort =>
    resort.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resort.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (resort.description && resort.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <div className="p-6 text-center text-lg text-gray-700">Loading pending resorts...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600 font-semibold">{error}</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Resort Moderation Dashboard</h1>
          <p className="text-gray-600">Review and approve new resort listings submitted by owners.</p>
        </div>
        <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
          {filteredResorts.length} Pending Resorts
        </div>
      </div>

      <div className="mb-8">
        <input
          type="text"
          placeholder="Search by resort name, location, or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 rounded-lg shadow-sm border border-gray-200 focus:ring-blue-200 focus:border-blue-500"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResorts.length > 0 ? (
          filteredResorts.map((resort) => (
            <div
              key={resort._id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition duration-200 overflow-hidden relative border border-gray-100"
            >
              {/* Display image from GridFS using the /api/image/:filename route */}
              <img
                src={`/api/image/${resort.image}`}
                alt={resort.name}
                className="h-48 w-full object-cover"
                // Fallback for broken image links
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x250?text=Image+Not+Found'; }}
              />
              <div className="absolute top-2 right-2 bg-orange-100 text-orange-700 text-sm px-3 py-1 rounded-full font-medium">
                Pending
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-lg font-semibold text-gray-800">{resort.name}</h2>
                  <p className="text-xl font-bold text-gray-900">₹{resort.price}</p>
                </div>
                <div className="text-gray-600 text-sm flex items-center gap-2 mt-1">
                  <FaMapMarkerAlt className="text-gray-500" />
                  {resort.location}
                </div>
                <div className="text-gray-600 text-sm flex items-center gap-2 mt-1">
                  <FaUser className="text-gray-500" />
                  Owner ID: {resort.ownerId}
                </div>
                <div className="text-gray-600 text-sm flex items-center gap-2 mt-1">
                  <FaCalendarAlt className="text-gray-500" />
                  Submitted: {new Date(resort.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric', month: 'short', day: 'numeric'
                  })}
                </div>
                <p className="text-sm text-gray-700 mt-3 line-clamp-3">{resort.description}</p>
                <p className="text-sm text-gray-700 mt-1 font-medium">
                  Type: <span className="font-normal">{resort.type}</span>
                </p>
                {resort.amenities && resort.amenities.length > 0 && (
                  <p className="text-sm text-gray-700 mt-1 font-medium">
                    Amenities: <span className="font-normal">{resort.amenities.join(', ')}</span>
                  </p>
                )}

                <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                  <button className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition duration-200">
                    <FaEye />
                    View All Details
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusChange(resort._id, 'rejected')}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md transition duration-200"
                      title="Reject Resort"
                    >
                      ❌
                    </button>
                    <button
                      onClick={() => handleStatusChange(resort._id, 'approved')}
                      className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow-md transition duration-200"
                      title="Approve Resort"
                    >
                      ✔️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-600 text-lg py-10">
            No new resorts currently pending for moderation.
          </p>
        )}
      </div>
    </div>
  );
};

export default ModerationPage;