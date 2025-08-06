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
    extraBed: 0,
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
    if (!resort) navigate('/');
  }, [resort, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleExtraBedChange = (delta) => {
    setFormData((prev) => ({
      ...prev,
      extraBed: Math.max(0, prev.extraBed + delta),
    }));
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
      alert("Please fill in all fields.");
      return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      alert("Check-out date must be after check-in.");
      return;
    }

    const nights = calculateNights();
    const selectedRoomDetails = rooms.find(room => room.roomName === roomType);
    const pricePerNight = selectedRoomDetails?.roomPrice || 0;
    const extraBedCost = formData.extraBed * 500;
    const totalAmount = (nights * pricePerNight) + extraBedCost;

    navigate("/confirm-and-pay", {
      state: {
        resortName: resort.name,
        resortImage: resort.images?.[0],
        resortId: resort._id,
        roomName: selectedRoomDetails.roomName,
        roomImage: selectedRoomDetails.roomImages?.[0],
        roomId: selectedRoomDetails._id,
        price: pricePerNight,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        guestsAdult: formData.guestsAdult,
        guestsChild: formData.guestsChild,
        extraBed: formData.extraBed,
        extraBedCost,
        nights,
        totalAmount,
      },
    });
  };

  if (!resort || !rooms.length) return null;

  return (
    <div className="w-full bg-white text-gray-800">

      {resort.images?.[0] && (
        <div className="relative w-full h-[50vh]">
          <img
            src={`${API_URL}/api/resorts/image/${resort.images[0]}`}
            alt="Main Resort"
            className="absolute w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <h1 className="text-white text-4xl font-bold">{resort.name}</h1>
          </div>
        </div>
      )}

      <div className="px-6 py-8 max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 🛏 Room Preview */}
          <div className="md:col-span-2 space-y-6">
            {rooms.map((room, idx) => (
              <div key={idx} className="border rounded-xl p-4 shadow-md bg-white">
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {room.roomImages?.[0] && (
                    <img
                      src={`${API_URL}/api/resorts/image/${room.roomImages[0]}`}
                      alt={`${room.roomName} 1`}
                      className="col-span-2 w-full h-64 object-cover rounded-md"
                    />
                  )}
                  <div className="flex flex-col gap-2">
                    {room.roomImages?.slice(1, 3).map((img, i) => (
                      <img
                        key={i}
                        src={`${API_URL}/api/resorts/image/${img}`}
                        alt={`${room.roomName} ${i + 2}`}
                        className="w-full h-32 object-cover rounded-md"
                      />
                    ))}
                  </div>
                </div>
                <h2 className="text-xl font-semibold mb-1">{room.roomName}</h2>
                <p className="text-sm text-gray-600">{room.roomDescription}</p>
                <div className="text-green-600 font-bold mt-2">
                  ₹{room.roomPrice} / night
                </div>
                {room.amenities?.length > 0 && (
                  <div className="mt-3">
                    <h4 className="text-sm font-semibold mb-1">Amenities:</h4>
                    <div className="flex flex-wrap gap-2">
                      {room.amenities.map((amenity, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 text-xs bg-gray-100 rounded border"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 📋 Reservation Form */}
          <form
            onSubmit={handleSubmit}
            className="border p-5 rounded-lg shadow-md bg-gray-50 space-y-4"
          >
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
              <label className="block text-sm font-medium">Adults</label>
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
              <label className="block text-sm font-medium">Extra Beds</label>
              <div className="flex items-center gap-4 mt-1">
                <button
                  type="button"
                  onClick={() => handleExtraBedChange(-1)}
                  className="w-10 h-10 bg-gray-300 text-xl font-semibold rounded-full hover:bg-gray-400"
                >
                  −
                </button>
                <span className="text-lg font-medium">{formData.extraBed}</span>
                <button
                  type="button"
                  onClick={() => handleExtraBedChange(1)}
                  className="w-10 h-10 bg-gray-300 text-xl font-semibold rounded-full hover:bg-gray-400"
                >
                  +
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                ₹{formData.extraBed * 500} (₹500 per bed/night)
              </p>
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
              Review & Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReservationForm;
