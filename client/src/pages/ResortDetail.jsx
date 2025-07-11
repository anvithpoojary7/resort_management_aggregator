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
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Resort Info and Room Types */}
        <div className="col-span-2">
          {/* Main Resort Image */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <img
              src={`/api/resorts/image/${resort.image}`}
              alt="Main"
              className="rounded-lg h-72 object-cover w-full col-span-2"
            />
          </div>

          <h1 className="text-3xl font-bold mb-2">{resort.name}</h1>
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
                <div key={i} className="bg-white rounded-md px-4 py-2 border border-gray-200 text-sm">
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
                    <div>
                      <h4 className="text-lg font-semibold">{room.roomName}</h4>
                      <p className="text-gray-600 text-sm">{room.roomDescription}</p>
                      <div className="text-green-600 mt-2 font-medium">
                        ₹{room.roomPrice} per night
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Booking Sidebar */}
        <div className="col-span-1 mt-6 lg:mt-0">
          <div className="sticky top-6 bg-white border p-4 rounded-lg shadow">
            <div className="text-2xl font-semibold mb-2">₹{resort.price} <span className="text-sm text-gray-600">per night</span></div>
            <div className="text-sm text-yellow-500 mb-4">⭐ Excellent location</div>
            <div className="flex flex-col gap-3">
              <input type="date" className="border rounded px-3 py-2" />
              <input type="date" className="border rounded px-3 py-2" />
              <select className="border rounded px-3 py-2">
                <option>1 Guest</option>
                <option>2 Guests</option>
              </select>
              <button
                onClick={() => navigate(`/resorts/${id}/reserve`, {
                  state: { resort, rooms }
                })}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
              >
                Reserve Now
              </button>
              <p className="text-xs text-gray-500 mt-1">
                You won't be charged yet. Free cancellation until 24 hours before check-in.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResortDetail;
