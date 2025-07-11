import React, { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { FiEdit, FiX } from 'react-icons/fi';

const ProfilePage = () => {
  const [editing, setEditing] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [userRole, setUserRole] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    country: '',
    language: '',
    timeZone: '',
    email: ''
  });

  // Load user info from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser) {
      let firstName = '';
      let lastName = '';

      if (storedUser.name) {
        const parts = storedUser.name.trim().split(' ');
        firstName = parts[0];
        lastName = parts.slice(1).join(' ');
      }

      setFormData((prev) => ({
        ...prev,
        firstName,
        lastName,
        email: storedUser.email || '',
      }));

      if (storedUser.profileImage) {
        setImageUrl(storedUser.profileImage);
      }

      if (storedUser.role) {
        setUserRole(storedUser.role);
      }
    }
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
        setModalOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeletePhoto = () => {
    setImageUrl('');
    setModalOpen(false);
  };

  const handleUpdatePassword = () => {
    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
    } else {
      alert("Password updated successfully (dummy logic)");
      setPassword('');
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure? This cannot be undone.")) {
      localStorage.removeItem("user");
      alert("Account deleted (dummy logic)");
      window.location.href = "/auth";
    }
  };

  const handleToggleEdit = () => {
    if (editing) {
      // Save changes back to localStorage
      const updatedUser = {
        ...JSON.parse(localStorage.getItem('user')),
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        profileImage: imageUrl,
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    setEditing(!editing);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 text-gray-800">
      {/* Sidebar */}
      <div className="w-16 bg-white shadow-lg flex flex-col items-center py-6 space-y-6 rounded-r-3xl">
        <div className="w-6 h-6 bg-gray-300 rounded-md"></div>
        <div className="w-6 h-6 bg-gray-300 rounded-md"></div>
        <div className="w-6 h-6 bg-gray-300 rounded-md"></div>
        <div className="w-6 h-6 bg-gray-300 rounded-md"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-10 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-xl font-semibold">Welcome, {formData.firstName || 'Guest'}</h1>
            <p className="text-sm text-gray-500 capitalize">Role: {userRole || 'N/A'}</p>
          </div>
          <FaUserCircle className="text-3xl text-gray-500" />
        </div>

        {/* Profile Card */}
        <div className="bg-white shadow-xl rounded-3xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              {/* Profile Image */}
              <div className="relative">
                <img
                  src={imageUrl || "/default-avatar.jpg"}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover cursor-pointer hover:opacity-80"
                  onClick={() => setModalOpen(true)}
                />
              </div>

              {/* Name and Email */}
              <div>
                <h2 className="text-xl font-bold">{formData.firstName} {formData.lastName}</h2>
                <p className="text-gray-500">{formData.email}</p>
              </div>
            </div>

            {/* Edit Button */}
            <button
              onClick={handleToggleEdit}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition"
            >
              <FiEdit />
              <span>{editing ? "Save" : "Edit"}</span>
            </button>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-gray-600">First Name</label>
              <input
                name="firstName"
                disabled={!editing}
                value={formData.firstName}
                onChange={handleChange}
                className="w-full mt-1 p-3 border rounded-xl bg-gray-50"
              />
            </div>
            <div>
              <label className="text-gray-600">Last Name</label>
              <input
                name="lastName"
                disabled={!editing}
                value={formData.lastName}
                onChange={handleChange}
                className="w-full mt-1 p-3 border rounded-xl bg-gray-50"
              />
            </div>
            <div>
              <label className="text-gray-600">Gender</label>
              <select
                name="gender"
                disabled={!editing}
                value={formData.gender}
                onChange={handleChange}
                className="w-full mt-1 p-3 border rounded-xl bg-gray-50"
              >
                <option value="">Select</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-gray-600">Country</label>
              <input
                name="country"
                disabled={!editing}
                value={formData.country}
                onChange={handleChange}
                className="w-full mt-1 p-3 border rounded-xl bg-gray-50"
              />
            </div>
            <div>
              <label className="text-gray-600">Language</label>
              <select
                name="language"
                disabled={!editing}
                value={formData.language}
                onChange={handleChange}
                className="w-full mt-1 p-3 border rounded-xl bg-gray-50"
              >
                <option value="">Select</option>
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
                <option value="kannada">Kannada</option>
              </select>
            </div>
            <div>
              <label className="text-gray-600">Time Zone</label>
              <input
                name="timeZone"
                disabled={!editing}
                value={formData.timeZone}
                onChange={handleChange}
                className="w-full mt-1 p-3 border rounded-xl bg-gray-50"
              />
            </div>
          </div>

          {/* Email Info */}
          <div className="mt-8">
            <label className="text-gray-600 block mb-1">My email address</label>
            <div className="flex items-center space-x-3 text-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span>{formData.email}</span>
              </div>
              <span className="text-sm text-gray-500">1 month ago</span>
            </div>
            <button className="mt-3 text-blue-600 hover:underline text-sm">+ Add Email Address</button>
          </div>

          {/* Password and Account */}
          <div className="mt-10 border-t pt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Settings</h3>

            {/* Update Password */}
            <div className="mb-6">
              <label className="block text-gray-600 mb-2">New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded-xl bg-gray-50 mb-3 focus:outline-none"
              />
              <button
                onClick={handleUpdatePassword}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl"
              >
                Update Password
              </button>
            </div>

            {/* Delete Account */}
            <div className="mt-8">
              <h4 className="text-md font-semibold text-red-600 mb-2">Danger Zone</h4>
              <p className="text-gray-500 mb-3">Deleting your account is permanent and cannot be undone.</p>
              <button
                onClick={handleDeleteAccount}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              <FiX size={20} />
            </button>
            <img
              src={imageUrl || "/default-avatar.jpg"}
              alt="Profile Large"
              className="w-full h-64 object-cover rounded-xl mb-4"
            />
            <div className="flex justify-between">
              <label className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
                Change Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              <button
                onClick={handleDeletePhoto}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;







