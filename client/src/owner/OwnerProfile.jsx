import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaTachometerAlt, FaHotel, FaBook, FaUser, FaCog, FaSignOutAlt, FaEdit,
    FaEnvelope, FaPhone, FaMapMarkerAlt // Added icons for profile fields
} from 'react-icons/fa';

const OwnerProfile = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    // Placeholder state for profile data (you would load this from an API)
    const [profile, setProfile] = React.useState({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@resorthub.com",
        phoneNumber: "+1 (555) 123-4567",
        address: "123 Resort Avenue, California, USA",
        businessName: "ResortHub Properties",
        taxId: "123-45-6789",
        businessType: "Corporation",
        yearsInBusiness: 4,
        memberSince: "Dec 2020"
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prevProfile => ({
            ...prevProfile,
            [name]: value
        }));
    };

    const handleSaveChanges = () => {
        // Implement logic to save changes to your backend
        console.log("Saving changes:", profile);
        alert("Profile changes saved!");
    };

    // Function to generate initials for avatar
    const getInitials = (firstName, lastName) => {
        return `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-lg p-6 flex flex-col justify-between">
                <div>
                    <div className="flex items-center mb-10">
                        <img src="https://via.placeholder.com/40" alt="ResortHub Logo" className="w-10 h-10 mr-3 rounded-full" /> {/* Replace with your actual logo */}
                        <div className="text-xl font-semibold text-gray-800">ResortHub</div>
                    </div>
                    <nav>
                        <ul>
                            <li className="mb-4">
                                <button
                                    onClick={() => navigate("/owner/dashboard")}
                                    className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                                >
                                    <FaTachometerAlt className="mr-3 text-lg" />
                                    Dashboard
                                </button>
                            </li>
                            <li className="mb-4">
                                <button
                                    onClick={() => navigate("/owner/my-resort")}
                                    className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                                >
                                    <FaHotel className="mr-3 text-lg" />
                                    My Resort
                                </button>
                            </li>
                            <li className="mb-4">
                                <button
                                    onClick={() => navigate("/owner/bookings")}
                                    className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                                >
                                    <FaBook className="mr-3 text-lg" />
                                    Bookings
                                </button>
                            </li>
                            <li className="mb-4">
                                <button
                                    onClick={() => navigate("/owner/profile")}
                                    className="flex items-center w-full px-4 py-2 text-blue-700 bg-blue-100 rounded-lg" // Active state for Profile
                                >
                                    <FaUser className="mr-3 text-lg" />
                                    Profile
                                </button>
                            </li>
                            <li className="mb-4">
                                <button
                                    onClick={() => navigate("/owner/settings")}
                                    className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                                >
                                    <FaCog className="mr-3 text-lg" />
                                    Settings
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                        <FaSignOutAlt className="mr-3 text-lg" />
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
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
                            <p className="text-gray-500 text-sm">Member since {profile.memberSince}</p>
                            <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition flex items-center">
                                <FaEdit className="mr-2" /> Edit Photo
                            </button>
                        </div>
                    </div>
                </div>

                {/* Personal Information */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={profile.firstName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={profile.lastName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaEnvelope className="text-gray-400" />
                                </span>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={profile.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaPhone className="text-gray-400" />
                                </span>
                                <input
                                    type="text"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={profile.phoneNumber}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-start pt-3 pointer-events-none">
                                    <FaMapMarkerAlt className="text-gray-400" />
                                </span>
                                <textarea
                                    id="address"
                                    name="address"
                                    value={profile.address}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-y"
                                ></textarea>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 text-right">
                        <button
                            onClick={handleSaveChanges}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>

                {/* Business Information */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Business Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                            <input
                                type="text"
                                id="businessName"
                                name="businessName"
                                value={profile.businessName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="taxId" className="block text-sm font-medium text-gray-700 mb-1">Tax ID</label>
                            <input
                                type="text"
                                id="taxId"
                                name="taxId"
                                value={profile.taxId}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
                            <select
                                id="businessType"
                                name="businessType"
                                value={profile.businessType}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option>Corporation</option>
                                <option>LLC</option>
                                <option>Sole Proprietorship</option>
                                <option>Partnership</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="yearsInBusiness" className="block text-sm font-medium text-gray-700 mb-1">Years in Business</label>
                            <input
                                type="number"
                                id="yearsInBusiness"
                                name="yearsInBusiness"
                                value={profile.yearsInBusiness}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OwnerProfile;