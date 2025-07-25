// pages/ResortDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TopLoader } from '../pages/TopLoader';
import { useAuth } from '../context/AuthContext';

const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://resort-finder-2aqp.onrender.com'
  : 'http://localhost:8080';

const ResortDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();

  const [resort, setResort] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false); // New state to handle not found/inactive

  useEffect(() => {
    const fetchResort = async () => {
      try {
        setIsLoading(true);
        setNotFound(false); // Reset notFound state
        // This endpoint will now return 404 if resort is not found OR not visible
        const res = await axios.get(`${API_URL}/api/resorts/${id}/details`);
        setResort(res.data.resort);
        setRooms(res.data.rooms);
      } catch (err) {
        console.error("Failed to fetch resort details", err);
        if (err.response && err.response.status === 404) {
          setNotFound(true); // Set notFound if the server explicitly returns 404
        }
        setResort(null); // Clear resort data on error
        setRooms([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResort();
  }, [id]);

  const handleBookNow = () => {
    if (!isLoggedIn || !user) {
      // Not logged in → go to login
      return navigate('/auth', { state: { from: `/resorts/${id}/reserve` } });
    }

    if (user.role !== 'user') {
      // Logged in but not a regular user
      alert('Only users can book a resort. Please login with a user account.');
      return;
    }

    // Valid user → go to reservation
    navigate(`/resorts/${id}/reserve`, {
      state: { resort, rooms },
    });
  };

  return (
    <div className="bg-gray-50 py-8 px-4 min-h-screen relative">
      <TopLoader isLoading={isLoading} />

      {isLoading && !resort ? (
        <div className="text-center mt-10 text-lg font-semibold text-gray-700">Loading resort details...</div>
      ) : notFound ? ( // Display if resort not found or inactive
        <div className="text-center mt-10 text-xl font-semibold text-red-600">
          Resort not found or is currently unavailable.
        </div>
      ) : resort ? (
        <div className="max-w-6xl mx-auto">
          {/* Main Resort Image */}
          <div className="mb-4">
            <img
              src={`${API_URL}/api/resorts/image/${resort.image}`}
              alt={resort.name} // Added alt text
              className="rounded-lg h-96 object-cover w-full"
            />
          </div>

          {/* Resort Info */}
          <h1 className="text-3xl font-bold mb-1">{resort.name}</h1>
          <p className="text-gray-600 mb-1">📍 {resort.location}</p>
          <p className="text-yellow-500 mb-4">⭐ 4.9</p> {/* Consider making rating dynamic */}
          <p className="text-gray-700 mb-4">{resort.description}</p>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Resort Type</h2>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {resort.type}
            </span>
          </div>

          {/* Amenities */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {resort.amenities.map((amenity, i) => (
                <div
                  key={i}
                  className="bg-white rounded-md px-4 py-2 border border-gray-200 text-sm"
                >
                  {amenity}
                </div>
              ))}
            </div>
          </div>

          {/* Room Types */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Room Types</h2>
            <div className="grid gap-4">
              {rooms.length > 0 ? (
                rooms.map((room, i) => (
                  <div key={i} className="bg-white rounded-lg shadow p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <img
                        src={`${API_URL}/api/resorts/image/${room.roomImages[0]}`}
                        className="w-full sm:w-64 h-40 object-cover rounded"
                        alt={`Room ${room.roomName}`} // Better alt text
                      />
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold">{room.roomName}</h4>
                        <p className="text-gray-600 text-sm">{room.roomDescription}</p>
                        <div className="text-green-600 mt-2 font-medium">
                          ₹{room.roomPrice} per night
                        </div>
                        <button
                          onClick={handleBookNow}
                          className="mt-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No room types available for this resort.</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        // Fallback for generic errors, though 'notFound' covers 404
        <div className="text-center mt-10 text-xl font-semibold text-gray-600">
          An error occurred. Please try again later.
        </div>
      )}
    </div>
  );
};

export default ResortDetail;