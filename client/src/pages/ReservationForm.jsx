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
  const { resort, selectedRoom } = location.state || {};
  const rooms = selectedRoom ? [selectedRoom] : (resort?.rooms || []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    guestsAdult: 1,
    guestsChild: 0,
    checkIn: '',
    checkOut: '',
    roomType: selectedRoom?.roomName || '',
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
    if (!resort) {
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

  const handleSubmit = async (e) => {
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

  const nights = calculateNights();
  const selectedRoomDetails = rooms.find(room => room.roomName === roomType);
  const pricePerNight = selectedRoomDetails?.roomPrice || 0;
  const totalAmount = nights * pricePerNight;

  try {
    const userRes = await axios.get(`${API_URL}/api/auth/me`, { withCredentials: true });
    const user = userRes.data.user;

  const response = await axios.post(`${API_URL}/api/bookings`, {
  user: user._id,
  resort: resort._id,
  room: selectedRoomDetails._id,
  checkIn: formData.checkIn,
  checkOut: formData.checkOut,
  totalAmount,
  paymentStatus: "paid",
  paymentId: "mock_" + Date.now(),
  guestsAdult: formData.guestsAdult,
  guestsChild: formData.guestsChild,
});


    if (response.data.success) {
      navigate("/reservation-success", {
        state: {
          resortName: resort.name,
          resortImage: resort.images?.[0],
          roomName: selectedRoomDetails.roomName,
          roomImage: selectedRoomDetails.roomImages?.[0],
          price: pricePerNight,
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          guestsAdult: formData.guestsAdult,
          guestsChild: formData.guestsChild,
        }
      });
    } else {
      alert("Booking failed");
    }
  } catch (err) {
    console.error("Booking error:", err);
    alert("Something went wrong");
  }
};


  if (!resort || !rooms) return null;

  return (
    <div className="bg-white text-gray-800 py-10 px-6 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">{resort.name}</h1>

      {/* Featured Resort Image */}
      {resort.images?.length > 0 && (
        <div className="mb-10">
          <img
            src={`${API_URL}/api/resorts/image/${resort.images[0]}`}
            alt="Resort Main"
            className="w-full h-[400px] object-cover rounded-xl shadow-lg"
          />
        </div>
      )}

      {/* Interior Gallery */}
      {resort.images?.length > 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {resort.images.slice(1, 4).map((img, idx) => (
            <img
              key={idx}
              src={`${API_URL}/api/resorts/image/${img}`}
              alt={`Interior ${idx + 1}`}
              className="w-full h-60 object-cover rounded-lg shadow-md"
            />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Room List */}
        <div className="md:col-span-2 space-y-6">
          {rooms.map((room, idx) => (
            <div
              key={idx}
              className={`border rounded-xl p-4 shadow-md bg-white ${formData.roomType === room.roomName ? 'border-blue-600' : 'border-gray-200'}`}
            >
              <div className="flex flex-col md:flex-row gap-4">
                <img
                  src={`${API_URL}/api/resorts/image/${room.roomImages[0]}`}
                  alt={room.roomName}
                  className="w-full md:w-56 h-40 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-1">{room.roomName}</h2>
                  <p className="text-sm text-gray-600">{room.roomDescription}</p>
                  <div className="text-green-600 font-bold mt-2">₹{room.roomPrice} / night</div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, roomType: room.roomName })}
                    className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                  >
                    Select Room
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reservation Form */}
        <form onSubmit={handleSubmit} className="border p-5 rounded-lg shadow-md bg-gray-50 space-y-4">
          <h3 className="text-lg font-semibold">Your Reservation</h3>

          <div>
            <label className="block text-sm font-medium">Check-In</label>
            <input
              type="date"
              name="checkIn"
              value={formData.checkIn}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Check-Out</label>
            <input
              type="date"
              name="checkOut"
              value={formData.checkOut}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Guests</label>
            <input
              type="number"
              name="guestsAdult"
              min="1"
              value={formData.guestsAdult}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Children</label>
            <input
              type="number"
              name="guestsChild"
              min="0"
              value={formData.guestsChild}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Selected Room</label>
            <div className="border px-3 py-2 rounded bg-white">
              {formData.roomType || 'None selected'}
            </div>
          </div>

          {formData.checkIn && formData.checkOut && (
            <p className="text-sm text-gray-600">
              Nights: <strong>{calculateNights()}</strong>
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Confirm Reservation
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReservationForm;
