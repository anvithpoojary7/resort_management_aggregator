import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResortDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [resort, setResort] = useState(null);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchResort = async () => {
      try {
        const res = await axios.get(`/api/resorts/${id}/details`);
        setResort(res.data.resort);
        setRooms(res.data.rooms);
      } catch (err) {
        console.error("Failed to fetch resort details", err);
      }
    };

    fetchResort();
  }, [id]);

  if (!resort) return <div className="text-center mt-10">Loading resort details...</div>;

  return (
    <div className="bg-gray-50 py-8 px-4 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Main Resort Image */}
        <div className="mb-4">
          <img
            src={`/api/resorts/image/${resort.image}`}
            alt="Main"
            className="rounded-lg h-96 object-cover w-full"
          />
        </div>

        {/* Resort Info */}
        <h1 className="text-3xl font-bold mb-1">{resort.name}</h1>
        <p className="text-gray-600 mb-1">📍 {resort.location}</p>
        <p className="text-yellow-500 mb-4">⭐ 4.9</p>
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
            {rooms.map((room, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <img
                    src={`/api/resorts/image/${room.roomImages[0]}`}
                    className="w-full sm:w-64 h-40 object-cover rounded"
                    alt={`Room ${i + 1}`}
                  />
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold">{room.roomName}</h4>
                    <p className="text-gray-600 text-sm">{room.roomDescription}</p>
                    <div className="text-green-600 mt-2 font-medium">
                      ₹{room.roomPrice} per night
                    </div>

                    {/* ✅ Book Now button */}
                    <button
                      onClick={() =>
                        navigate(`/resorts/${id}/reserve`, {
                          state: { resort, rooms: [room] }, // only selected room
                        })
                      }
                      className="mt-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResortDetail;
