import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaHotel, FaBook, FaUser, FaCog, FaSignOutAlt, FaEdit, FaCalendarAlt, FaDollarSign, FaChartLine, FaStar } from 'react-icons/fa'; // Added more icons
import { IoMdInformationCircleOutline } from "react-icons/io"; // Assuming this is for the info icon


const OwnerDashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
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
                                    className="flex items-center w-full px-4 py-2 text-blue-700 bg-blue-100 rounded-lg"
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
                                    className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
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
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-semibold text-gray-800">Dashboard Overview</h1>
                    <div className="text-sm text-gray-500">Last updated Dec 14, 2024 - 2:30 PM</div>
                </header>

                <p className="text-gray-600 mb-8">Welcome back! Here's how your resort is performing.</p>

                {/* Your Resort Section */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">Your Resort</h2>
                        <button className="flex items-center text-blue-600 hover:text-blue-700 font-medium">
                            <FaEdit className="mr-2" /> Edit Details
                        </button>
                    </div>
                    <div className="flex flex-col md:flex-row items-start md:items-center">
                      
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">Ocean View Resort</h3>
                            <p className="text-gray-600 mb-2">Malibu, California</p>
                            <div className="flex items-center mb-2">
                                <FaStar className="text-yellow-500 mr-1" />
                                <span className="font-semibold text-gray-800">4.8</span>
                                <span className="text-gray-500 ml-1">(156 reviews)</span>
                                <span className="ml-4 text-xl font-bold text-gray-900">$350</span>
                                <span className="text-gray-500 ml-1">/ night</span>
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed">
                                Luxury beachfront resort with stunning ocean views, premium amenities, and world-class service. Perfect for romantic getaways and family vacations.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-md flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-lg font-medium text-gray-600">Total Bookings</h3>
                                <FaCalendarAlt className="text-blue-500 text-xl" />
                            </div>
                            <div className="text-3xl font-bold text-gray-900">48</div>
                            <p className="text-green-600 text-sm flex items-center mt-1">
                                <FaChartLine className="mr-1" /> +12% from last month
                            </p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-lg font-medium text-gray-600">Monthly Revenue</h3>
                                <FaDollarSign className="text-green-500 text-xl" />
                            </div>
                            <div className="text-3xl font-bold text-gray-900">$24,500</div>
                            <p className="text-green-600 text-sm flex items-center mt-1">
                                <FaChartLine className="mr-1" /> +8% from last month
                            </p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-lg font-medium text-gray-600">Occupancy Rate</h3>
                                <IoMdInformationCircleOutline className="text-gray-500 text-xl" /> {/* Adjusted icon */}
                            </div>
                            <div className="text-3xl font-bold text-gray-900">78%</div>
                            <p className="text-green-600 text-sm flex items-center mt-1">
                                <FaChartLine className="mr-1" /> +5% from last month
                            </p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-lg font-medium text-gray-600">Guest Rating</h3>
                                <FaStar className="text-yellow-500 text-xl" />
                            </div>
                            <div className="text-3xl font-bold text-gray-900">4.8</div>
                            <p className="text-green-600 text-sm flex items-center mt-1">
                                <FaChartLine className="mr-1" /> +0.2 from last month
                            </p>
                        </div>
                    </div>
                </div>

                {/* Recent Bookings and Monthly Performance */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Bookings */}
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Bookings</h2>
                        {/* Example Booking Item - You'll likely map over an array of bookings here */}
                        <div className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 text-blue-600 font-semibold">S</div> {/* Placeholder for user initial/avatar */}
                                <div>
                                    <p className="font-medium text-gray-900">Sarah Johnson</p>
                                    <p className="text-sm text-gray-500">Dec 10 - Dec 15</p>
                                </div>
                            </div>
                            <div className="font-semibold text-gray-900">$1,200</div>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3 text-green-600 font-semibold">M</div> {/* Placeholder for user initial/avatar */}
                                <div>
                                    <p className="font-medium text-gray-900">Michael Lee</p>
                                    <p className="text-sm text-gray-500">Dec 12 - Dec 18</p>
                                </div>
                            </div>
                            <div className="font-semibold text-gray-900">$1,800</div>
                        </div>
                        {/* Add more booking items as needed */}
                    </div>

                    {/* Monthly Performance */}
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Monthly Performance</h2>
                        {/* Example Performance Item */}
                        <div className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0">
                            <span className="text-gray-700 font-medium">December 2024</span>
                            <span className="font-semibold text-blue-600">$24,500</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0">
                            <span className="text-gray-700 font-medium">November 2024</span>
                            <span className="font-semibold text-gray-900">$22,700</span>
                        </div>
                        {/* Add more monthly performance items as needed */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OwnerDashboard;