import React, { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ReservationForm = () => {
  const { id } = useParams();
  const location = useLocation();
  const { resort, rooms } = location.state || {};

  const resortName = resort?.name || 'Unknown Resort';
  const resortImage = resort?.image
    ? `/api/resorts/image/${resort.image}`
    : '/default.jpg';

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Validate required fields
    const { name, email, checkIn, checkOut, roomType, guestsAdult } = formData;
  
    if (!name.trim()) {
      alert("Please enter your full name.");
      return;
    }
    if (!email.trim()) {
      alert("Please enter your email address.");
      return;
    }
    if (!checkIn) {
      alert("Please select a check-in date.");
      return;
    }
    if (!checkOut) {
      alert("Please select a check-out date.");
      return;
    }
    if (new Date(checkOut) <= new Date(checkIn)) {
      alert("Check-out date must be after check-in date.");
      return;
    }
    if (!roomType) {
      alert("Please select a room.");
      return;
    }
    if (guestsAdult < 1) {
      alert("At least one adult is required for a reservation.");
      return;
    }
  
    // All validations passed
    setShowSummary(true);
    setTimeout(() => {
      document.getElementById('summaryModal')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  

  const handlePayment = () => {
    alert("Redirecting to Razorpay...");
  };

  const calculateNights = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);
    const diffTime = checkOutDate - checkInDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <div className="bg-white text-gray-800 py-8 px-4 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-2">{resortName}</h1>
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
            <label className="block font-medium mb-1">Adults (18+)</label>
            <input name="guestsAdult" value={formData.guestsAdult} onChange={handleChange} type="number" min="1" className="w-full px-4 py-2 border rounded" />
          </div>
          <div className="w-full">
            <label className="block font-medium mb-1">Children (Under 18)</label>
            <input name="guestsChild" value={formData.guestsChild} onChange={handleChange} type="number" min="0" className="w-full px-4 py-2 border rounded" />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-full">
            <label className="block font-medium mb-1">Check-In Date</label>
            <input name="checkIn" value={formData.checkIn} onChange={handleChange} type="date" className="w-full px-4 py-2 border rounded" />
          </div>
          <div className="w-full">
            <label className="block font-medium mb-1">Check-Out Date</label>
            <input name="checkOut" value={formData.checkOut} onChange={handleChange} type="date" className="w-full px-4 py-2 border rounded" />
          </div>
        </div>

        {/* Room Cards - without "Choose a Room" heading */}
        <div className="space-y-4">
          {rooms?.map((room, idx) => (
            <div key={idx} className={`border rounded-lg p-4 shadow ${formData.roomType === room.roomName ? 'border-green-500' : 'border-gray-300'}`}>
              <div className="flex flex-col md:flex-row gap-4">
                <img src={`/api/resorts/image/${room.roomImages[0]}`} alt={room.roomName} className="w-full md:w-60 h-40 object-cover rounded-lg" />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold">{room.roomName}</h3>
                    <button type="button" onClick={() => setShowRoomPopup(room)} className="text-sm text-blue-600 hover:underline">View Details</button>
                  </div>
                  <p className="text-gray-700 text-sm my-1">{room.roomDescription}</p>
                  <div className="mt-2 font-semibold text-green-600">₹{room.roomPrice} per night</div>
                  <button type="button" onClick={() => setFormData({ ...formData, roomType: room.roomName })} className="mt-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md">
                    Select Room
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded transition">Confirm Reservation</button>
      </form>

      {/* Room Detail Popup */}
      <AnimatePresence>
        {showRoomPopup && (
          <motion.div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl relative" initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}>
              <button onClick={() => setShowRoomPopup(null)} className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-xl">&times;</button>
              <h2 className="text-2xl font-bold mb-2">{showRoomPopup.roomName}</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {showRoomPopup.roomImages.map((img, i) => (
                  <img key={i} src={`/api/resorts/image/${img}`} className="w-full h-40 object-cover rounded" alt="Room Detail" />
                ))}
              </div>
              <p className="text-gray-700 mb-2">{showRoomPopup.roomDescription}</p>
              <div className="text-green-600 font-bold">Price: ₹{showRoomPopup.roomPrice}</div>
            </motion.div>
          </motion.div>
        )}

        {/* Summary Modal */}
        {showSummary && (
          <motion.div id="summaryModal" className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ duration: 0.3 }} className="bg-white text-black rounded-2xl shadow-2xl p-6 w-full max-w-lg relative">
              <button onClick={() => setShowSummary(false)} className="absolute top-3 right-4 text-gray-400 text-2xl hover:text-red-500">&times;</button>
              <h2 className="text-2xl font-bold text-center mb-4">{resortName}</h2>
              <div className="flex items-center gap-4 mb-4">
                <img src={resortImage} alt="Selected Resort" className="w-20 h-20 rounded-lg object-cover" />
                <div>
                  <h3 className="text-xl font-bold">{formData.roomType}</h3>
                  <p className="text-sm text-gray-600">Free cancellation available</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <p><strong>Date:</strong> {formData.checkIn} to {formData.checkOut}</p>
                <p><strong>Guests:</strong> {formData.guestsAdult} adults, {formData.guestsChild} children</p>
                <p><strong>Name:</strong> {formData.name}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Price per night:</strong> ₹{rooms.find(r => r.roomName === formData.roomType)?.roomPrice ?? '--'}</p>
                <p><strong>Nights:</strong> {calculateNights()}</p>
              </div>
              <div className="mt-4">
                <input type="text" placeholder="Enter a coupon" className="w-full px-4 py-2 border rounded mb-2" />
                <p className="font-semibold">
                  Total: ₹
                  {(() => {
                    const nights = calculateNights();
                    const pricePerNight = rooms.find(r => r.roomName === formData.roomType)?.roomPrice ?? 0;
                    return nights > 0 ? nights * pricePerNight : '--';
                  })()}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-between mt-6">
                <button onClick={() => setShowSummary(false)} className="w-full sm:w-1/2 px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition">Edit Details</button>
                <button onClick={handlePayment} className="w-full sm:w-1/2 px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition">Pay Now</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReservationForm;
