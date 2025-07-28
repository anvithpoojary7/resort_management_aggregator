import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

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

  useEffect(() => {
    axios.get(`${API_URL}/api/auth/me`, { withCredentials: true })
      .then((res) => {
        const { name, email } = res.data.user || {};
        setFormData((prev) => ({
          ...prev,
          name: name || '',
          email: email || '',
        }));
      }).catch(err => {
        console.error("Autofill failed:", err);
      });
  }, []);

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
    const { checkIn, checkOut, guestsAdult, roomType } = formData;
    if (!checkIn || !checkOut || guestsAdult < 1 || !roomType) {
      alert("Fill all fields");
      return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      alert("Check-out must be after check-in");
      return;
    }

    alert("Reservation confirmed!");
    // Submit logic goes here
  };

  if (!resort || !rooms) return null;

  return (
    <div className="bg-white text-gray-800 py-10 px-6 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">{resort.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Room List */}
        <div className="md:col-span-2 space-y-6">
          {rooms.map((room, idx) => (
            <div key={idx} className={`border rounded-lg p-4 shadow ${formData.roomType === room.roomName ? 'border-green-600' : ''}`}>
              <div className="flex flex-col md:flex-row gap-4">
                <img src={`${API_URL}/api/resorts/image/${room.roomImages[0]}`} className="w-full md:w-56 h-36 object-cover rounded-lg" />
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">{room.roomName}</h2>
                  <p className="text-sm text-gray-600">{room.roomDescription}</p>
                  <div className="text-green-600 font-bold mt-2">₹{room.roomPrice} / night</div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, roomType: room.roomName })}
                    className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Select Room
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Side Reservation Box */}
        <form onSubmit={handleSubmit} className="md:sticky md:top-20 border p-5 shadow-lg rounded-lg h-fit space-y-4 bg-gray-50">
          <h3 className="text-xl font-semibold mb-2">Your Reservation</h3>
          <div>
            <label className="block text-sm font-medium">Check-In</label>
            <input type="date" name="checkIn" value={formData.checkIn} onChange={handleChange}
              className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium">Check-Out</label>
            <input type="date" name="checkOut" value={formData.checkOut} onChange={handleChange}
              className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium">Guests</label>
            <input type="number" name="guestsAdult" min="1" value={formData.guestsAdult} onChange={handleChange}
              className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium">Children</label>
            <input type="number" name="guestsChild" min="0" value={formData.guestsChild} onChange={handleChange}
              className="w-full px-3 py-2 border rounded" />
          </div>

          <div>
            <label className="block text-sm font-medium">Selected Room</label>
            <div className="border px-3 py-2 rounded bg-white">{formData.roomType || 'None selected'}</div>
          </div>

          {formData.checkIn && formData.checkOut && (
            <p className="text-sm text-gray-600">Nights: <strong>{calculateNights()}</strong></p>
          )}

          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
            Confirm Reservation
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReservationForm;
