// pages/ConfirmAndPayPage.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://resort-finder-2aqp.onrender.com'
  : 'http://localhost:8080';

const ReservationSuccess = () => {
  const { state: reservation } = useLocation();
  const navigate = useNavigate();

  if (!reservation) {
    navigate('/');
    return null;
  }

  const {
    resortName,
    resortImage,
    roomName,
    roomImage,
    price,
    checkIn,
    checkOut,
    guestsAdult,
    guestsChild,
    extraBed,
  } = reservation;

  const nights = (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);
  const roomTotal = nights * price;
  const extraBedCost = extraBed * nights * 500;
  const taxes = Math.round((roomTotal + extraBedCost) * 0.1);
  const total = roomTotal + extraBedCost + taxes;

  const handlePayment = () => {
    // Here you could later integrate Razorpay or redirect to UPI gateway
    navigate("/reservation-success", { state: reservation });
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 py-12 px-6">
      <h1 className="text-3xl font-bold text-center mb-6">Confirm and Pay</h1>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left side */}
        <div className="md:col-span-2 space-y-6">
          <div className="border p-4 rounded-lg bg-pink-50 flex justify-between items-center">
            <div>
              <p className="font-semibold">This is a rare find.</p>
              <p className="text-sm text-gray-600">{resortName} is usually booked.</p>
            </div>
            <span className="text-pink-600 text-2xl">💎</span>
          </div>

          <div className="border p-4 rounded-lg space-y-4 shadow">
            <h2 className="text-xl font-semibold">Your Trip</h2>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Dates</p>
                <p className="text-gray-600">{checkIn} to {checkOut}</p>
              </div>
              <button className="text-blue-600 hover:underline">Edit</button>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Guests</p>
                <p className="text-gray-600">
                  {guestsAdult} Adult{guestsAdult > 1 ? 's' : ''}{guestsChild > 0 ? `, ${guestsChild} Child` : ''}
                </p>
              </div>
              <button className="text-blue-600 hover:underline">Edit</button>
            </div>
          </div>

          <div className="border p-4 rounded-lg shadow space-y-3">
            <h2 className="text-xl font-semibold">Pay With</h2>
            <select className="w-full p-2 border rounded bg-white">
              <option>UPI</option>
              <option>Credit/Debit Card</option>
              <option>Net Banking</option>
            </select>

            <div className="mt-2">
              <label className="flex items-center gap-2 mb-2">
                <input type="radio" name="upi" defaultChecked />
                Pay using UPI QR Code
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="upi" />
                Enter UPI ID
              </label>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="border p-4 rounded-lg shadow space-y-4">
          <div className="flex gap-4">
            <img
              src={`${API_URL}/api/resorts/image/${roomImage}`}
              alt="Room"
              className="w-24 h-24 object-cover rounded"
            />
            <div>
              <h3 className="font-semibold">{roomName}</h3>
              <p className="text-sm text-gray-600">Entire apartment</p>
              <p className="text-sm text-gray-600">★ 4.99 • Superhost</p>
            </div>
          </div>

          <hr />

          <h3 className="text-lg font-semibold">Your total</h3>
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span>{nights} nights × ₹{price}</span>
              <span>₹{roomTotal.toLocaleString()}</span>
            </div>
            {extraBed > 0 && (
              <div className="flex justify-between">
                <span>Extra bed: ₹500 × {extraBed} × {nights} nights</span>
                <span>₹{extraBedCost.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Taxes</span>
              <span>₹{taxes.toLocaleString()}</span>
            </div>
          </div>

          <hr />

          <div className="flex justify-between text-lg font-bold">
            <span>Total (INR)</span>
            <span>₹{total.toLocaleString()}</span>
          </div>

          <button
            onClick={handlePayment}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Proceed to Pay
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationSuccess;
