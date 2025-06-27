import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaTachometerAlt, FaHotel, FaBook, FaUser, FaCog, FaEdit, FaWifi, FaCar, FaCoffee, FaSwimmer, FaDumbbell, FaSpa, FaSignOutAlt
} from 'react-icons/fa'; // Added more amenity icons

// Import your resort images


const OwnerMyResort = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    // Placeholder data for resort details (you'd fetch this from an API)
    const resortDetails = {
        name: "Ocean View Resort",
        location: "Malibu, California",
        pricePerNight: 350,
        maximumGuests: 4,
        description: "Luxury beachfront resort with stunning ocean views, premium amenities, and world-class service. Perfect for romantic getaways and family vacations. Direct beach access and exceptional dining experiences.",
        propertyDetails: {
            bedrooms: 2,
            bathrooms: 2,
            checkInTime: "15:00",
            checkOutTime: "11:00" // Added from a typical resort listing
        },
        amenities: [
            { icon: FaWifi, name: "Free WiFi" },
            { icon: FaCar, name: "Free Parking" },
            { icon: FaCoffee, name: "Breakfast Included" },
            { icon: FaSwimmer, name: "Beach Access" },
            { icon: FaDumbbell, name: "Fitness Center" },
            { icon: FaSpa, name: "Spa Services" },
        ],
        policies: {
            cancellation: "Free cancellation up to 24 hours before check-in",
            houseRules: [
                "No smoking inside the property",
                "No pets allowed",
                "Quiet hours: 10 PM - 8 AM",
                "Maximum 4 guests"
            ]
        },
        photos: [
           
        ]
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
                                    className="flex items-center w-full px-4 py-2 text-blue-700 bg-blue-100 rounded-lg" // Active state
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
                    <div>
                        <h1 className="text-3xl font-semibold text-gray-800">My Resort</h1>
                        <p className="text-gray-600">Manage your resort details and settings</p>
                    </div>
                    <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition">
                        <FaEdit className="mr-2" /> Edit Resort
                    </button>
                </header>

                {/* Resort Photos Section */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Resort Photos</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        
                    </div>
                </div>

                {/* Basic Information Section */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                        <div>
                            <p className="text-gray-500 text-sm">Resort Name</p>
                            <p className="text-gray-900 font-medium text-lg">{resortDetails.name}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Location</p>
                            <p className="text-gray-900 font-medium text-lg">{resortDetails.location}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Price Per Night</p>
                            <p className="text-gray-900 font-medium text-lg">${resortDetails.pricePerNight}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Maximum Guests</p>
                            <p className="text-gray-900 font-medium text-lg">{resortDetails.maximumGuests} guests</p>
                        </div>
                        <div className="md:col-span-2">
                            <p className="text-gray-500 text-sm">Description</p>
                            <p className="text-gray-900 leading-relaxed">{resortDetails.description}</p>
                        </div>
                    </div>
                </div>

                {/* Property Details Section */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Property Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-4">
                        <div>
                            <p className="text-gray-500 text-sm">Bedrooms</p>
                            <p className="text-gray-900 font-medium text-lg">{resortDetails.propertyDetails.bedrooms}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Bathrooms</p>
                            <p className="text-gray-900 font-medium text-lg">{resortDetails.propertyDetails.bathrooms}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Check-in Time</p>
                            <p className="text-gray-900 font-medium text-lg">{resortDetails.propertyDetails.checkInTime}</p>
                        </div>
                        {/* You might also want Check-out Time here */}
                        {/* <div>
                            <p className="text-gray-500 text-sm">Check-out Time</p>
                            <p className="text-gray-900 font-medium text-lg">{resortDetails.propertyDetails.checkOutTime}</p>
                        </div> */}
                    </div>
                </div>

                {/* Amenities Section */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Amenities</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
                        {resortDetails.amenities.map((amenity, index) => (
                            <div key={index} className="flex flex-col items-center p-3 border border-gray-200 rounded-lg">
                                <amenity.icon className="text-blue-600 text-3xl mb-2" />
                                <p className="text-sm font-medium text-gray-700">{amenity.name}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Policies & Rules Section */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Policies & Rules</h2>
                    <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-800 mb-2">Cancellation Policy</h3>
                        <p className="text-gray-700">{resortDetails.policies.cancellation}</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-gray-800 mb-2">House Rules</h3>
                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                            {resortDetails.policies.houseRules.map((rule, index) => (
                                <li key={index}>{rule}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OwnerMyResort;