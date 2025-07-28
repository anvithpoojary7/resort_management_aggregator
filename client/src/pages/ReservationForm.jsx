import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// Dynamically set API base URL
const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://resort-finder-2aqp.onrender.com'
  : 'http://localhost:8080';

const ReservationForm = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { resort, rooms } = location.state || {};

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    guestsAdult: 1,
    guestsChild: 0,
    checkIn: '',
    checkOut: '',
    roomType: '',
  });

  const [showSummary, setShowSummary] = useState(false);
  const [showRoomPopup, setShowRoomPopup] = useState(null);

  // ✅ Fetch user data on mount using correct API path
  useEffect(() => {
    axios
      .get(`${API_URL}/api/auth/me`, {
        withCredentials: true, // Important for sending token via cookies
      })
      .then((res) => {
        const { name, email } = res.data.user || {};
        setFormData((prev) => ({
          ...prev,
          name: name || '',
          email: email || '',
        }));
      })
      .catch((err) => {
        console.error('Failed to auto-fill user details:', err);
      });
  }, []);

  // Redirect if state missing
  useEffect(() => {
    if (!resort || !rooms) {
      navigate('/');
    }
  }, [resort, rooms, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateNights = () => {
    const { checkIn, checkOut } = formData;
    if (!checkIn || !checkOut) return 0;
    const nights = (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);
    return Math.max(nights, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, email, checkIn, checkOut, roomType, guestsAdult } = formData;

    if (!name.trim() || !email.trim() || !checkIn || !checkOut || !roomType || guestsAdult < 1) {
      alert('Please fill all required fields correctly.');
      return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      alert("Check-out must be after check-in.");
      return;
    }

    setShowSummary(true);
    setTimeout(() => {
      document.getElementById('summaryModal')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handlePayment = () => {
    alert('Redirecting to Razorpay...');
    // Future: Send payment request to backend here
  };

  if (!resort || !rooms) return null;

  return (
    <div className="bg-white text-gray-800 py-8 px-4 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-2">{resort.name}</h1>
      <p className="text-center text-gray-500 mb-6">Book your stay at our beautiful resort</p>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
        <div>
          <label className="block font-medium mb-1">Full Name</label>
          <input name="name" value={formData.name} onChange={handleChange} type="text" className="w-full px-4 py-2 border rounded" />
        </div>
        <div>
          <label className="block font-medium mb-1">Email Address</label>
          <input name="email" value={formData.email} onChange={handleChange} type="email" className="w-full px-4 py-2 border rounded" />
        </div>

        <div className="flex gap-4">
          <div className="w-full">
            <label className="block font-medium mb-1">Adults</label>
            <input name="guestsAdult" value={formData.guestsAdult} onChange={handleChange} type="number" min="1" className="w-full px-4 py-2 border rounded" />
          </div>
          <div className="w-full">
            <label className="block font-medium mb-1">Children</label>
            <input name="guestsChild" value={formData.guestsChild} onChange={handleChange} type="number" min="0" className="w-full px-4 py-2 border rounded" />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-full">
            <label className="block font-medium mb-1">Check-In</label>
            <input name="checkIn" value={formData.checkIn} onChange={handleChange} type="date" className="w-full px-4 py-2 border rounded" />
          </div>
          <div className="w-full">
            <label className="block font-medium mb-1">Check-Out</label>
            <input name="checkOut" value={formData.checkOut} onChange={handleChange} type="date" className="w-full px-4 py-2 border rounded" />
          </div>
        </div>

        <div className="space-y-4">
          {rooms.map((room, idx) => (
            <div key={idx} className={`border rounded-lg p-4 shadow ${formData.roomType === room.roomName ? 'border-green-500' : ''}`}>
              <div className="flex flex-col md:flex-row gap-4">
                <img src={`${API_URL}/api/resorts/image/${room.roomImages[0]}`} className="w-full md:w-60 h-40 object-cover rounded-lg" alt={room.roomName} />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold">{room.roomName}</h3>
                    <button type="button" onClick={() => setShowRoomPopup(room)} className="text-sm text-blue-600 hover:underline">View</button>
                  </div>
                  <p className="text-sm text-gray-600">{room.roomDescription}</p>
                  <div className="mt-2 font-semibold text-green-600">₹{room.roomPrice} / night</div>
                  <button type="button" onClick={() => setFormData({ ...formData, roomType: room.roomName })} className="mt-2 bg-green-600 text-white px-4 py-2 rounded">Select Room</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded transition">Confirm Reservation</button>
      </form>

      {/* Room popup and summary modal (unchanged) */}
      {/* ... same as your existing code ... */}
    </div>
  );
};

export default ReservationForm;
