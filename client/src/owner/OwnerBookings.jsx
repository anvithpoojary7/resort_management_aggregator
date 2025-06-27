import React from 'react';
import { useNavigate } from 'react-router-dom';
// Corrected import: Added FaSignOutAlt to the list
import { FaTachometerAlt, FaHotel, FaBook, FaUser, FaCog, FaDownload, FaCalendarAlt, FaDollarSign, FaCircle, FaEye, FaEnvelope, FaTrash, FaSignOutAlt } from 'react-icons/fa';
import { IoMdInformationCircleOutline } from "react-icons/io";
import { MdOutlineDateRange } from "react-icons/md";

const OwnerBookings = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    // Sample data for bookings (you would fetch this from an API in a real application)
    const bookings = [
        {
            id: 1,
            guestName: "Sarah Johnson",
            guestEmail: "sarah.johnson@email.com",
            resort: "Ocean View Resort",
            dates: "15/12/2024 - 18/12/2024",
            duration: "3 nights",
            amount: "$1,200",
            status: "Confirmed",
            payment: "Paid"
        },
        {
            id: 2,
            guestName: "Mike Chen",
            guestEmail: "mike.chen@email.com",
            resort: "Mountain Lodge",
            dates: "18/12/2024 - 21/12/2024",
            duration: "3 nights",
            amount: "$890",
            status: "Pending",
            payment: "Pending"
        },
        {
            id: 3,
            guestName: "Emma Davis",
            guestEmail: "emma.davis@email.com",
            resort: "Sunset Beach Villa",
            dates: "20/12/2024 - 23/12/2024",
            duration: "3 nights",
            amount: "$1,450",
            status: "Confirmed",
            payment: "Paid"
        },
        {
            id: 4,
            guestName: "John Smith",
            guestEmail: "john.smith@email.com",
            resort: "Forest Retreat",
            dates: "22/12/2024 - 25/12/2024",
            duration: "3 nights",
            amount: "$750",
            status: "Confirmed",
            payment: "Paid"
        },
        // Add more booking data as needed
    ];

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
                                    className="flex items-center w-full px-4 py-2 text-blue-700 bg-blue-100 rounded-lg" // Active state
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
                        <FaSignOutAlt className="mr-3 text-lg" /> {/* This is where the FaSignOutAlt was used */}
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-semibold text-gray-800">Bookings Management</h1>
                        <p className="text-gray-600">Track and manage all resort bookings</p>
                    </div>
                    <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition">
                        <FaDownload className="mr-2" /> Export Data
                    </button>
                </header>

                {/* Booking Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-medium text-gray-600">Total Bookings</h3>
                            <div className="text-3xl font-bold text-gray-900">5</div>
                        </div>
                        <FaCalendarAlt className="text-blue-500 text-3xl" />
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-medium text-gray-600">Confirmed</h3>
                            <div className="text-3xl font-bold text-gray-900">3</div>
                        </div>
                        <FaCalendarAlt className="text-green-500 text-3xl" />
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-medium text-gray-600">Pending</h3>
                            <div className="text-3xl font-bold text-gray-900">2</div>
                        </div>
                        <FaCalendarAlt className="text-yellow-500 text-3xl" />
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-medium text-gray-600">Total Revenue</h3>
                            <div className="text-3xl font-bold text-gray-900">$5,390</div>
                        </div>
                        <FaDollarSign className="text-blue-500 text-3xl" />
                    </div>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                        <select className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option>All Status</option>
                            <option>Confirmed</option>
                            <option>Pending</option>
                            <option>Cancelled</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
                    <div className="relative">
                        <select className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option>All Dates</option>
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                            <option>This Month</option>
                            <option>Custom Range</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
                </div>

                {/* Bookings Table */}
                <div className="bg-white rounded-xl shadow-md p-6 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resort</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {bookings.map((booking) => (
                                <tr key={booking.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{booking.guestName}</div>
                                        <div className="text-sm text-gray-500">{booking.guestEmail}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.resort}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.dates}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.duration}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.amount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                                            booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            booking.payment === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {booking.payment}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button className="text-blue-600 hover:text-blue-900" title="View Details">
                                                <FaEye />
                                            </button>
                                            <button className="text-gray-600 hover:text-gray-900" title="Send Email">
                                                <FaEnvelope />
                                            </button>
                                            <button className="text-red-600 hover:text-red-900" title="Delete Booking">
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OwnerBookings;