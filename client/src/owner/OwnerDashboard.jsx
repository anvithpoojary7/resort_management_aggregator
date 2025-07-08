import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaTachometerAlt, FaHotel, FaBook, FaUser, FaCog,
  FaSignOutAlt, FaEdit, FaCalendarAlt, FaDollarSign,
  FaChartLine, FaStar
} from "react-icons/fa";
import { IoMdInformationCircleOutline } from "react-icons/io";

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [resort, setResort] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = "http://localhost:8080";
  const currentOwnerId = JSON.parse(localStorage.getItem("user"))?.id;

  useEffect(() => {
    if (!currentOwnerId) {
      setError("Owner not logged in.");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/resorts/owner/${currentOwnerId}`);
        const data = await res.json();
        if (data?._id) {
          setResort(data);
          setStatus(data.status);
        }
      } catch (err) {
        console.error("Error fetching resort:", err);
        setError("Failed to fetch resort. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, [currentOwnerId]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600 text-lg">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  // Conditional views based on resort status
  if (!resort) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">You haven’t added a resort yet.</h2>
          <Link to="/owner/addresort" className="text-blue-600 underline mt-2 block">
            Click here to add your resort
          </Link>
        </div>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h2 className="text-xl font-bold text-yellow-600">
          Your resort is under review by the admin.
        </h2>
      </div>
    );
  }

  if (status === "rejected") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h2 className="text-xl font-bold text-red-600">
          Unfortunately your resort was rejected. Please edit and resubmit.
        </h2>
      </div>
    );
  }

  // Approved Resort Dashboard UI
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
                <button onClick={() => navigate("/owner/dashboard")} className="flex items-center w-full px-4 py-2 text-blue-700 bg-blue-100 rounded-lg">
                  <FaTachometerAlt className="mr-3" /> Dashboard
                </button>
              </li>
              <li className="mb-4">
                <button onClick={() => navigate("/owner/my-resort")} className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  <FaHotel className="mr-3" /> My Resort
                </button>
              </li>
              <li className="mb-4">
                <button onClick={() => navigate("/owner/bookings")} className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  <FaBook className="mr-3" /> Bookings
                </button>
              </li>
              <li className="mb-4">
                <button onClick={() => navigate("/owner/profile")} className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  <FaUser className="mr-3" /> Profile
                </button>
              </li>
              <li className="mb-4">
                <button onClick={() => navigate("/owner/settings")} className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  <FaCog className="mr-3" /> Settings
                </button>
              </li>
            </ul>
          </nav>
        </div>
        <div>
          <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">
            <FaSignOutAlt className="mr-3" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Dashboard Overview</h1>

        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Your Resort</h2>
            <button onClick={() => navigate(`/owner/my-resort/${resort._id}/edit`)} className="flex items-center text-blue-600 hover:text-blue-700 font-medium">
              <FaEdit className="mr-2" /> Edit
            </button>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center">
            {resort.image && (
              <img
                src={`${API_BASE_URL}/api/image/${encodeURIComponent(resort.image)}`}
                alt={resort.name}
                className="w-full md:w-48 h-auto md:h-32 object-cover rounded-lg mr-6 mb-4 md:mb-0"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/200x128?text=Image+Missing';
                }}
              />
            )}
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{resort.name}</h3>
              <p className="text-gray-600">{resort.location}</p>
              <div className="flex items-center mt-2">
                <FaStar className="text-yellow-500 mr-1" />
                <span className="font-semibold text-gray-800">4.8</span>
                <span className="text-gray-500 ml-1">(156 reviews)</span>
                <span className="ml-4 text-xl font-bold text-gray-900">₹{resort.price}</span>
                <span className="text-gray-500 ml-1">/ night</span>
              </div>
              <p className="text-gray-700 text-sm mt-2">{resort.description}</p>
            </div>
          </div>
        </div>

        {/* Performance Cards (Dummy Data) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <PerformanceCard title="Total Bookings" value="48" icon={<FaCalendarAlt />} color="blue" />
          <PerformanceCard title="Revenue" value="₹24,500" icon={<FaDollarSign />} color="green" />
          <PerformanceCard title="Occupancy" value="78%" icon={<IoMdInformationCircleOutline />} color="gray" />
          <PerformanceCard title="Rating" value="4.8" icon={<FaStar />} color="yellow" />
        </div>
      </div>
    </div>
  );
};

const PerformanceCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-md">
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-lg font-medium text-gray-600">{title}</h3>
      <div className={`text-${color}-500 text-xl`}>{icon}</div>
    </div>
    <div className="text-3xl font-bold text-gray-900">{value}</div>
    <p className={`text-${color}-600 text-sm mt-1 flex items-center`}>
      <FaChartLine className="mr-1" /> +5% this month
    </p>
  </div>
);

export default OwnerDashboard;
