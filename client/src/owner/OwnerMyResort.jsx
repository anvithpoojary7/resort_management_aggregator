import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt, FaHotel, FaBook, FaUser, FaCog, FaEdit, FaSignOutAlt
} from 'react-icons/fa';

const API_BASE_URL = 'http://localhost:8080';

const OwnerMyResort = () => {
  const navigate = useNavigate();
  const [resort, setResort] = useState(null);
  const [roomImages, setRoomImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentOwnerId = JSON.parse(localStorage.getItem('user'))?.id;

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  useEffect(() => {
    if (!currentOwnerId) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/resorts/owner/${currentOwnerId}`);
        const data = await res.json();
        setResort(data);

        if (data?._id) {
          const roomsRes = await fetch(`${API_BASE_URL}/api/resorts/rooms/byresort/${data._id}`);
          const rooms = await roomsRes.json();

          const images = rooms.flatMap(room => room.roomImages.slice(0, 1));
          setRoomImages(images.slice(0, 2));
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [currentOwnerId]);

  if (loading) return <div className="p-8 text-center text-gray-600 text-lg">Loading resort details...</div>;

  if (!resort) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-800">No Resort Found</h2>
        <p className="text-gray-600 mt-2">You haven’t added a resort yet.</p>
        <button
          onClick={() => navigate('/owner/add-resort')}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Resort
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center mb-10">
            <img src="https://via.placeholder.com/40" alt="Logo" className="w-10 h-10 mr-3 rounded-full" />
            <div className="text-xl font-semibold text-gray-800">ResortHub</div>
          </div>
          <nav>
            <ul>
              <li className="mb-4">
                <button onClick={() => navigate("/owner/dashboard")} className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  <FaTachometerAlt className="mr-3 text-lg" /> Dashboard
                </button>
              </li>
              <li className="mb-4">
                <button onClick={() => navigate("/owner/my-resort")} className="flex items-center w-full px-4 py-2 text-blue-700 bg-blue-100 rounded-lg">
                  <FaHotel className="mr-3 text-lg" /> My Resort
                </button>
              </li>
              <li className="mb-4">
                <button onClick={() => navigate("/owner/bookings")} className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  <FaBook className="mr-3 text-lg" /> Bookings
                </button>
              </li>
              <li className="mb-4">
                <button onClick={() => navigate("/owner/profile")} className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  <FaUser className="mr-3 text-lg" /> Profile
                </button>
              </li>
              <li className="mb-4">
                <button onClick={() => navigate("/owner/settings")} className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  <FaCog className="mr-3 text-lg" /> Settings
                </button>
              </li>
            </ul>
          </nav>
        </div>
        <div>
          <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">
            <FaSignOutAlt className="mr-3 text-lg" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">My Resort</h1>
            <p className="text-gray-600">Manage your resort details and settings</p>
          </div>
          <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition">
            <FaEdit className="mr-2" /> Edit Resort
          </button>
        </header>

        {/* Resort Main Image */}
        <div className="bg-white rounded-xl shadow-md mb-4 overflow-hidden">
          <img
            src={`${API_BASE_URL}/api/resorts/image/${encodeURIComponent(resort.image)}`}
            alt="Main Resort"
            className="w-full h-[300px] object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/800x300?text=Image+Unavailable';
            }}
          />
        </div>

        {/* Room Image Gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {roomImages.map((filename, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow p-4">
              <img
                src={`${API_BASE_URL}/api/resorts/image/${filename}`}
                alt={`Room ${idx + 1}`}
                className="w-full h-[200px] object-cover rounded"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/400x300?text=Room+Image';
                }}
              />
            </div>
          ))}
        </div>

        {/* Resort Details */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Resort Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="text-lg font-medium text-gray-800">{resort.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="text-lg font-medium text-gray-800">{resort.location}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Price Per Night</p>
              <p className="text-lg font-medium text-gray-800">₹{resort.price}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Description</p>
              <p className="text-gray-800 leading-relaxed">{resort.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerMyResort;
