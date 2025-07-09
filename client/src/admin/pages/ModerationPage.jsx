import React, { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaUser, FaCalendarAlt, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; // ✅ Correct path

const ModerationPage = () => {
  const [resorts, setResorts] = useState([]);
  const navigate = useNavigate();
  const API_BASE_URL = 'http://localhost:8080';

  useEffect(() => {
    const fetchPendingResorts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/adminapproval?status=pending`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!res.ok) {
          const errorText = await res.text();
          try {
            const errorData = JSON.parse(errorText);
            if (res.status === 401 || res.status === 403) {
              alert(errorData.message || 'You are not authorized to view this page. Please log in as an admin.');
              navigate('/login');
            } else {
              throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
            }
          } catch (e) {
            throw new Error(`HTTP error! status: ${res.status}, response: ${errorText.substring(0, 100)}...`);
          }
        }

        const data = await res.json();
        setResorts(data);
      } catch (err) {
        console.error('Error fetching pending resorts:', err);
        alert(`Failed to fetch pending resorts: ${err.message}`);
      }
    };

    fetchPendingResorts();
  }, [navigate]);

  const handleModerationAction = async (resortId, action) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/adminapproval/${resortId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: action }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        try {
          const errorData = JSON.parse(errorText);
          if (res.status === 401 || res.status === 403) {
            alert(errorData.message || 'You are not authorized to perform this action. Please ensure you are logged in as an admin.');
            navigate('/login');
          } else {
            throw new Error(errorData.message || `Failed to ${action} resort`);
          }
        } catch (e) {
          throw new Error(`Server returned non-JSON response. Status: ${res.status}. Response: ${errorText.substring(0, 100)}...`);
        }
      }

      setResorts((prevResorts) =>
        prevResorts.filter((resort) => resort._id !== resortId)
      );
      alert(`Resort ${action} successfully!`);
    } catch (error) {
      console.error(`Error ${action} resort ${resortId}:`, error);
      alert(`Failed to ${action} resort: ${error.message}`);
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Resort Moderation</h1>
        <p className="text-gray-600 mb-4">Review and approve pending resort listings</p>

        <div className="flex justify-between items-center mb-6">
          <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
            {resorts.length} Pending
          </div>
        </div>

        <div className="flex gap-3 mb-8">
          <input
            type="text"
            placeholder="Search resorts, owners, or locations..."
            className="flex-1 p-3 rounded-lg shadow-sm border border-gray-200 focus:ring focus:ring-blue-200"
          />
          <button className="bg-white border border-gray-300 rounded-lg px-4 py-2 font-medium shadow-sm">
            Filters
          </button>
        </div>

        <div className="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {resorts.length === 0 ? (
            <p className="text-gray-600 text-center col-span-full">No pending resorts to moderate.</p>
          ) : (
            resorts.map((resort) => (
              <div
                key={resort._id}
                className="bg-white rounded-xl shadow hover:shadow-md transition duration-200 overflow-hidden relative"
              >
                <img
                  src={`${API_BASE_URL}/api/image/${encodeURIComponent(resort.image)}`}
                  alt={resort.name}
                  className="h-48 w-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                  }}
                />
                <div className="absolute top-2 right-2 bg-orange-100 text-orange-700 text-sm px-3 py-1 rounded-full font-medium">
                  Pending
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">{resort.name}</h2>
                    <p className="text-md font-bold text-gray-900">${resort.price}</p>
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
                    Submitted {new Date(resort.createdAt).toLocaleDateString()}
                  </div>
                  <p className="text-sm text-gray-700 mt-3 line-clamp-3">{resort.description}</p>

                  <div className="flex justify-between items-center mt-4">
                    <button className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline">
                      <FaEye />
                      View Details
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleModerationAction(resort._id, 'rejected')}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
                        title="Reject"
                      >
                        ❌
                      </button>
                      <button
                        onClick={() => handleModerationAction(resort._id, 'approved')}
                        className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full"
                        title="Approve"
                      >
                        ✔
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ModerationPage;
