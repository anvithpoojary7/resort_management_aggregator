import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://resort-finder-2aqp.onrender.com'
  : 'http://localhost:8080';

const TripsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/api/bookings/my`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setBookings(response.data.bookings);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to load your bookings. Please try again later.');
        setLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchBookings();
    }
  }, [isLoggedIn]);

  // Separate bookings into upcoming and past
  const currentDate = new Date();
  const upcomingBookings = bookings.filter(
    (booking) => new Date(booking.checkIn) >= currentDate
  );
  const pastBookings = bookings.filter(
    (booking) => new Date(booking.checkIn) < currentDate && booking.paymentStatus === 'paid'
  );

  // Sort bookings by check-in date (upcoming: soonest first, past: most recent first)
  upcomingBookings.sort((a, b) => new Date(a.checkIn) - new Date(b.checkIn));
  pastBookings.sort((a, b) => new Date(b.checkIn) - new Date(a.checkIn));

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">Your Trips</h1>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <p className="text-lg">Please log in to view your trips.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Your Trips</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {bookings.length === 0 && !loading && !error && (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-lg mb-4">You don't have any trips yet.</p>
            <a
              href="/resorts"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Explore Resorts
            </a>
          </div>
        )}

        {/* Upcoming Trips */}
        {upcomingBookings.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Upcoming Trips</h2>
            <div className="space-y-4">
              {upcomingBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <div className="md:flex">
                    <div className="md:w-2/5 relative">
                      {booking.resort?.image ? (
                        <img
                          src={`${API_URL}/api/resorts/image/${encodeURIComponent(booking.resort.image)}`}
                          alt={booking.resort?.name}
                          className="w-full h-64 object-cover filter grayscale-[30%] transition-all duration-500 hover:grayscale-0"
                        />
                      ) : (
                        <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400">No image available</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6 md:w-3/5">
                      <h3 className="text-2xl font-bold mb-3 text-indigo-800">{booking.resort?.name}</h3>
                      <div className="space-y-2">
                        <p className="text-gray-700">
                          <span className="font-semibold">Room:</span> {booking.room?.roomName}
                        </p>
                        <div className="flex flex-wrap gap-x-6">
                          <p className="text-gray-700">
                            <span className="font-semibold">Check-in:</span> {formatDate(booking.checkIn)}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-semibold">Check-out:</span> {formatDate(booking.checkOut)}
                          </p>
                        </div>
                        <p className="text-gray-700 text-lg mt-2">
                          <span className="font-semibold">Total:</span> ₹{booking.totalAmount}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Past Trips */}
        {pastBookings.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Past Trips</h2>
            <div className="space-y-4">
              {pastBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden opacity-80 hover:opacity-95 hover:shadow-lg transition-all duration-300"
                >
                  <div className="md:flex">
                    <div className="md:w-2/5 relative">
                      {booking.resort?.image ? (
                        <img
                          src={`${API_URL}/api/resorts/image/${encodeURIComponent(booking.resort.image)}`}
                          alt={booking.resort?.name}
                          className="w-full h-64 object-cover filter grayscale-[30%] transition-all duration-500 hover:grayscale-0"
                        />
                      ) : (
                        <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400">No image available</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6 md:w-3/5">
                      <h3 className="text-2xl font-bold mb-3 text-gray-700">{booking.resort?.name}</h3>
                      <div className="space-y-2">
                        <p className="text-gray-600">
                          <span className="font-semibold">Room:</span> {booking.room?.roomName}
                        </p>
                        <div className="flex flex-wrap gap-x-6">
                          <p className="text-gray-600">
                            <span className="font-semibold">Check-in:</span> {formatDate(booking.checkIn)}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-semibold">Check-out:</span> {formatDate(booking.checkOut)}
                          </p>
                        </div>
                        <p className="text-gray-600 text-lg mt-2">
                          <span className="font-semibold">Total:</span> ₹{booking.totalAmount}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripsPage;