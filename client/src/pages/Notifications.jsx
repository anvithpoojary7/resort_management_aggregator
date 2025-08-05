import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { Link } from 'react-router-dom';

const Notifications = () => {
  const { user, authLoading } = useAuth();
  const { notifications, markAllAsRead, clearAllNotifications } = useNotifications(); // Assuming clearAll is available

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gradient-to-br from-[#fff3e9] to-[#fffdfb] px-6 py-12">
        <div className="mb-10 md:mb-0 md:mr-12">
          <img
            src="/finder.png"
            alt="Please login illustration"
            className="w-72 md:w-[380px] drop-shadow-xl rounded-lg"
          />
        </div>

        <div className="text-center md:text-left max-w-md">
          <h2 className="text-4xl font-extrabold text-[#2c2c2c] mb-4">
            Oops! You're not logged in
          </h2>
          <p className="text-gray-600 text-lg mb-6 leading-relaxed">
            Please log in to view your latest resort notifications and exclusive offers.
          </p>
          <Link
            to="/auth"
            className="inline-block px-6 py-2 bg-[#C97B63] text-white font-semibold rounded-lg shadow hover:bg-[#b76c56] transition duration-300"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-[#fffdf9] px-4 py-10 relative">
    {/* 🔹 Background Image with Blur */}
    <div className="absolute inset-0 z-0">
      <img
        src="/notification.jpg"
        alt="background"
        className="w-full h-full object-cover blur-sm opacity-40"
      />
    </div>

    {/* Foreground content should be on top */}
    <div className="relative z-10 max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-[#2c2c2c]">Notifications</h1>
            {notifications.length > 0 && (
            <div className="flex gap-3">
                <button
                onClick={markAllAsRead}
                className="px-4 py-1.5 text-sm bg-[#c97b63] hover:bg-[#b86f59] text-white rounded-md shadow-md transition"
                >
                Mark all as read
                </button>
                <button
                onClick={clearAllNotifications}
                className="px-4 py-1.5 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md shadow-md transition"
                >
                Clear all
                </button>
            </div>
            )}
        </div>


        {notifications.length === 0 ? (
          <div className="text-center mt-20">
            <p className="text-gray-500 text-lg">No notifications yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
  {notifications.map((notification) => (
    <div
      key={notification.id}
      className={`p-4 rounded-xl shadow-md border transition ${
        notification.isRead
          ? 'bg-gray-200 text-gray-700 border-gray-300'
          : 'bg-[#fbe8df] border-l-4 border-[#C97B63] text-gray-900'
      }`}
    >
      <p className="font-semibold">{notification.message}</p>
      <p className="text-sm text-gray-600 mt-1">{notification.timestamp}</p>
    </div>
  ))}
</div>

        )}
      </div>
    </div>
  );
};

export default Notifications;
