// pages/ReservationSuccess.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://resort-finder-2aqp.onrender.com'
  : 'http://localhost:8080';

const ReservationSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const reservation = location.state;

  if (!reservation) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 py-12 px-6">
      <h1 className="text-3xl font-bold text-center text-green-600 mb-6">Reservation Confirmed!</h1>

      <div className="max-w-3xl mx-auto bg-gray-50 rounded-lg shadow-md p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Resort: {reservation.resortName}</h2>
          {reservation.resortImage && (
            <img
              src={`${API_URL}/api/resorts/image/${reservation.resortImage}`}
              alt="Resort"
              className="w-full h-64 object-cover rounded"
            />
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Room: {reservation.roomName}</h3>
          {reservation.roomImage && (
            <img
              src={`${API_URL}/api/resorts/image/${reservation.roomImage}`}
              alt="Room"
              className="w-full h-48 object-cover rounded"
            />
          )}
          <p className="text-green-600 font-bold mt-2">₹{reservation.price} / night</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p><strong>Check-In:</strong> {reservation.checkIn}</p>
            <p><strong>Check-Out:</strong> {reservation.checkOut}</p>
          </div>
          <div>
            <p><strong>Adults:</strong> {reservation.guestsAdult}</p>
            <p><strong>Children:</strong> {reservation.guestsChild}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationSuccess;
