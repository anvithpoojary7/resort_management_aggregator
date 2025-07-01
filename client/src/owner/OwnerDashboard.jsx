import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaHotel, FaBook, FaUser, FaCog, FaSignOutAlt, FaEdit, FaCalendarAlt, FaDollarSign, FaChartLine, FaStar } from 'react-icons/fa';
import { IoMdInformationCircleOutline } from "react-icons/io";

const OwnerDashboard = () => {
    const navigate = useNavigate();
    const [ownerResorts, setOwnerResorts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Placeholder for actual owner ID (replace with real auth logic)
    // In a real app, you'd get this from user context/localStorage after login
    // For testing, you might hardcode a valid owner ID that exists in your DB,
    // or ensure your auth system correctly sets this.
    const currentOwnerId = "685a7411f2b0e96272ec987c"; // Replace with actual ID, e.g., "65241e330a5146c8b9d554a9"

    // Define your API base URL
    const API_BASE_URL = "http://localhost:8080"; // Crucial fix: specify full backend URL

    const handleLogout = () => {
        localStorage.removeItem("user"); // Clear user session
        navigate("/login");
    };

    useEffect(() => {
        const checkAndFetchResorts = async () => {
            if (!currentOwnerId || currentOwnerId === "some_owner_id_from_logged_in_user") {
                // Improved check for placeholder ID
                setError("Owner ID not found or is a placeholder. Please log in or set a valid ID.");
                setLoading(false);
                // Optionally navigate to login only if it's truly missing after a real auth attempt
                // navigate("/login");
                return;
            }

            try {
                // First, check if the owner has any resorts
                // Corrected fetch URL
                const hasResortResponse = await fetch(`${API_BASE_URL}/api/resorts/owner/${currentOwnerId}/has-resort`);
                if (!hasResortResponse.ok) {
                    // Check if it's a 404 or other non-OK status. If 404, it might mean no resort, not an error.
                    // This logic might need refinement based on your backend's exact response for 'no resort'.
                    // For now, assuming any non-OK status is an error unless specifically handled.
                    throw new Error(`Failed to check owner resorts: ${hasResortResponse.status} ${hasResortResponse.statusText}`);
                }
                const { hasResort } = await hasResortResponse.json();

                if (!hasResort) {
                    // If no resort, redirect to the Add Resort page
                    navigate("/owner/add-resort");
                    return; // Stop further execution
                }

                // If has a resort, fetch their actual resort data
                // Corrected fetch URL
                const resortsResponse = await fetch(`${API_BASE_URL}/api/resorts/owner/${currentOwnerId}`);
                if (!resortsResponse.ok) {
                    throw new Error(`Failed to fetch owner's resorts: ${resortsResponse.status} ${resortsResponse.statusText}`);
                }
                const data = await resortsResponse.json();
                setOwnerResorts(data);
            } catch (err) {
                console.error("Error in owner dashboard:", err);
                // More user-friendly error message
                setError(`Failed to load dashboard data: ${err.message}. Please ensure your backend is running.`);
            } finally {
                setLoading(false);
            }
        };

        checkAndFetchResorts();
    }, [currentOwnerId, navigate, API_BASE_URL]); // Add API_BASE_URL to dependency array as it's used inside useEffect

    if (loading) {
        return (
            <div className="flex min-h-screen bg-gray-100 items-center justify-center">
                <p className="text-lg text-gray-700">Loading dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen bg-gray-100 items-center justify-center">
                <p className="text-lg text-red-600">{error}</p>
            </div>
        );
    }

    // Assuming an owner typically manages one main resort, we'll display the first one.
    // You might need a more sophisticated UI if an owner can manage multiple distinct resorts.
    const primaryResort = ownerResorts[0];

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-lg p-6 flex flex-col justify-between">
                <div>
                    <div className="flex items-center mb-10">
                        <img src="https://via.placeholder.com/40" alt="ResortHub Logo" className="w-10 h-10 mr-3 rounded-full" />
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
                    <div className="text-sm text-gray-500">Last updated {new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })} - {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
                </header>

                <p className="text-gray-600 mb-8">Welcome back! Here's how your resort is performing.</p>

                {/* Your Resort Section */}
                {primaryResort ? (
                    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">Your Resort</h2>
                            <button
                                onClick={() => navigate(`/owner/my-resort/${primaryResort._id}/edit`)} // Assuming an edit page route
                                className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                            >
                                <FaEdit className="mr-2" /> Edit Details
                            </button>
                        </div>
                        <div className="flex flex-col md:flex-row items-start md:items-center">
                            {primaryResort.image && (
                                <img
                                    // Removed the comment from inside the JSX interpolation
                                    src={`${API_BASE_URL}/api/image/${primaryResort.image}`}
                                    alt={primaryResort.name}
                                    className="w-full md:w-48 h-auto md:h-32 object-cover rounded-lg mr-6 mb-4 md:mb-0"
                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/200x128?text=Image+Missing'; }}
                                />
                            )}
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">{primaryResort.name}</h3>
                                <p className="text-gray-600 mb-2">{primaryResort.location}</p>
                                <div className="flex items-center mb-2">
                                    <FaStar className="text-yellow-500 mr-1" />
                                    <span className="font-semibold text-gray-800">4.8</span> {/* Placeholder for rating */}
                                    <span className="text-gray-500 ml-1">(156 reviews)</span> {/* Placeholder for reviews */}
                                    <span className="ml-4 text-xl font-bold text-gray-900">₹{primaryResort.price}</span>
                                    <span className="text-gray-500 ml-1">/ night</span>
                                </div>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    {primaryResort.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-md p-6 mb-8 text-center">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">No Resort Listed Yet!</h2>
                        <p className="text-gray-600 mb-4">It looks like you haven't added your resort details. Please add your resort to start managing bookings.</p>
                        <button
                            onClick={() => navigate("/owner/add-resort")}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
                        >
                            Add My Resort
                        </button>
                    </div>
                )}


                {/* Performance Metrics - These will still be dummy for now, as they require more backend logic */}
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
                                <IoMdInformationCircleOutline className="text-gray-500 text-xl" />
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

                {/* Recent Bookings and Monthly Performance (Still dummy data, needs backend) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Bookings */}
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Bookings</h2>
                        <div className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 text-blue-600 font-semibold">S</div>
                                <div>
                                    <p className="font-medium text-gray-900">Sarah Johnson</p>
                                    <p className="text-sm text-gray-500">Dec 10 - Dec 15</p>
                                </div>
                            </div>
                            <div className="font-semibold text-gray-900">$1,200</div>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3 text-green-600 font-semibold">M</div>
                                <div>
                                    <p className="font-medium text-gray-900">Michael Lee</p>
                                    <p className="text-sm text-gray-500">Dec 12 - Dec 18</p>
                                </div>
                            </div>
                            <div className="font-semibold text-gray-900">$1,800</div>
                        </div>
                    </div>

                    {/* Monthly Performance */}
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Monthly Performance</h2>
                        <div className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0">
                            <span className="text-gray-700 font-medium">December 2024</span>
                            <span className="font-semibold text-blue-600">$24,500</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0">
                            <span className="text-gray-700 font-medium">November 2024</span>
                            <span className="font-semibold text-gray-900">$22,700</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OwnerDashboard;