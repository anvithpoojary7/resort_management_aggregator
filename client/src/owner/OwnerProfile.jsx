import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt, FaHotel, FaBook, FaUser, FaCog, FaSignOutAlt, FaEdit,
  FaEnvelope, FaPhone, FaMapMarkerAlt
} from 'react-icons/fa';

const OwnerProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const API_BASE_URL = 'http://localhost:8080';

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.accessToken) {
        alert("Please log in.");
        return navigate("/login");
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/owner/profile`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.accessToken}`
          }
        });

        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error(err);
        alert("Error fetching profile");
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = async () => {
    // You can implement update route if needed
    alert("Save functionality not implemented yet.");
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  if (!profile) {
    return <div className="p-8 text-gray-700">Loading profile...</div>;
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
                  <FaTachometerAlt className="mr-3 text-lg" />
                  Dashboard
                </button>
              </li>
              <li className="mb-4">
                <button onClick={() => navigate("/owner/my-resort")} className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  <FaHotel className="mr-3 text-lg" />
                  My Resort
                </button>
              </li>
              <li className="mb-4">
                <button onClick={() => navigate("/owner/bookings")} className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  <FaBook className="mr-3 text-lg" />
                  Bookings
                </button>
              </li>
              <li className="mb-4">
                <button onClick={() => navigate("/owner/profile")} className="flex items-center w-full px-4 py-2 text-blue-700 bg-blue-100 rounded-lg">
                  <FaUser className="mr-3 text-lg" />
                  Profile
                </button>
              </li>
              <li className="mb-4">
                <button onClick={() => navigate("/owner/settings")} className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  <FaCog className="mr-3 text-lg" />
                  Settings
                </button>
              </li>
            </ul>
          </nav>
        </div>
        <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">
          <FaSignOutAlt className="mr-3 text-lg" />
          Logout
        </button>
      </div>

      {/* Profile Content */}
      <div className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">Profile Settings</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </header>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6">
            <div className="w-24 h-24 rounded-full bg-blue-500 text-white flex items-center justify-center text-4xl font-bold mr-6 mb-4 sm:mb-0">
              {getInitials(profile.firstName, profile.lastName)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{profile.firstName} {profile.lastName}</h2>
              <p className="text-gray-600">Resort Owner</p>
              <p className="text-gray-500 text-sm">Member since {new Date(profile.createdAt).toLocaleDateString()}</p>
              <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition flex items-center">
                <FaEdit className="mr-2" /> Edit Photo
              </button>
            </div>
          </div>
        </div>

        {/* Personal Info Form */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <inputField label="First Name" name="firstName" value={profile.firstName} onChange={handleChange} />
            <inputField label="Last Name" name="lastName" value={profile.lastName} onChange={handleChange} />
            <inputField label="Email Address" name="email" value={profile.email} onChange={handleChange} icon={<FaEnvelope />} full />
            <inputField label="Phone Number" name="phoneNumber" value={profile.phoneNumber} onChange={handleChange} icon={<FaPhone />} full />
            <textareaField label="Address" name="address" value={profile.address} onChange={handleChange} icon={<FaMapMarkerAlt />} full />
          </div>
          <div className="mt-8 text-right">
            <button onClick={handleSaveChanges} className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const inputField = ({ label, name, value, onChange, icon, full }) => (
  <div className={full ? "md:col-span-2" : ""}>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="relative">
      {icon && <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</span>}
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500`}
      />
    </div>
  </div>
);

const textareaField = ({ label, name, value, onChange, icon, full }) => (
  <div className={full ? "md:col-span-2" : ""}>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="relative">
      {icon && <span className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">{icon}</span>}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        rows="3"
        className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-y`}
      ></textarea>
    </div>
  </div>
);

export default OwnerProfile;
