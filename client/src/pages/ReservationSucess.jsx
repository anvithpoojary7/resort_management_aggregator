
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
    <div className="min-h-screen bg-white text-gray-800 py-8 px-3 md:px-4">
      <h1 className="text-2xl font-bold text-center text-green-600 mb-4">Reservation Confirmed!</h1>

      <div className="max-w-xl mx-auto bg-gray-50 rounded-lg shadow p-4 space-y-6 text-sm">

        {/* Resort Info */}
        <div>
          <h2 className="text-lg font-semibold mb-1">Resort: {reservation.resortName}</h2>
          {reservation.resortImage && (
            <img
              src={`${API_URL}/api/resorts/image/${reservation.resortImage}`}
              alt="Resort"
              className="w-full h-48 object-cover rounded"
            />
          )}
        </div>

        {/* Room Info */}
        <div>
          <h3 className="text-base font-semibold mb-1">Room: {reservation.roomName}</h3>
          {reservation.roomImage && (
            <img
              src={`${API_URL}/api/resorts/image/${reservation.roomImage}`}
              alt="Room"
              className="w-full h-32 object-cover rounded"
            />
          )}
          
        </div>

        {/* Guest and Date Info */}
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

        
        <div>
          <p><strong>Extra Beds:</strong> {reservation.extraBeds || 0}</p>
        </div>

        
        <div className="text-lg font-bold  text-blue-700">
          Total Price: ₹{reservation.price}
        </div>
        
        <div className="flex justify-center pt-2">
          <button
            onClick={() => navigate('/')}
            className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationSuccess;
