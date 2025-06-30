import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const ReservationForm = () => {
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    guestsAdult: 1,
    guestsChild: 0,
    checkIn: '',
    checkOut: '',
    roomType: '',
  });

  const [selectedRoomDetails, setSelectedRoomDetails] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Reservation submitted!");
    console.log(formData);
  };

  const rooms = [
    {
      name: 'Overwater Villa',
      price: 850,
      image: '/img1.jpg',
      description: 'A luxurious villa built over the lagoon, offering ultimate privacy and stunning ocean views.',
      features: ['King Bed', 'Private Deck', 'Glass Floor Panels', 'Butler Service', 'Direct Water Access'],
      moreImages: ['/img1.jpg', '/img1-alt.jpg'],
    },
    {
      name: 'Beach Villa',
      price: 650,
      image: '/img2.jpg',
      description: 'Spacious beachfront villa just steps away from the white sand beach.',
      features: ['King Bed', 'Private Beach Access', 'Outdoor Shower', 'Minibar'],
      moreImages: ['/img2.jpg', '/img2-alt.jpg'],
    },
    {
      name: 'Garden Suite',
      price: 450,
      image: '/main.jpg',
      description: 'Surrounded by lush tropical gardens, this suite is peaceful and elegant.',
      features: ['Queen Bed', 'Garden View', 'Jacuzzi', 'Private Balcony'],
      moreImages: ['/main.jpg', '/main-alt.jpg'],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start p-6 relative">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl space-y-6"
      >
        <h2 className="text-2xl font-bold">Complete Your Reservation</h2>

        {/* Guest Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="border w-full px-4 py-2 rounded"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="border w-full px-4 py-2 rounded"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="date"
            name="checkIn"
            className="border w-full px-4 py-2 rounded"
            value={formData.checkIn}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="checkOut"
            className="border w-full px-4 py-2 rounded"
            value={formData.checkOut}
            onChange={handleChange}
            required
          />
        </div>

        {/* Guest Counts with Labels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adults (18+)</label>
            <input
              type="number"
              name="guestsAdult"
              min="1"
              value={formData.guestsAdult}
              onChange={handleChange}
              className="border w-full px-4 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Children (Under 18)</label>
            <input
              type="number"
              name="guestsChild"
              min="0"
              value={formData.guestsChild}
              onChange={handleChange}
              className="border w-full px-4 py-2 rounded"
            />
          </div>
        </div>

        {/* Room Options */}
        <h3 className="text-xl font-semibold mt-6">Choose a Room Type</h3>
        <div className="space-y-6">
          {rooms.map((room, i) => (
            <div key={i} className="border rounded-lg shadow p-4 bg-gray-100">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-40 object-cover rounded"
                />
                <div className="col-span-2">
                  <h4 className="text-lg font-bold">{room.name}</h4>
                  <ul className="list-disc pl-5 text-sm text-gray-600 mt-1">
                    {room.features.map((f, idx) => (
                      <li key={idx}>{f}</li>
                    ))}
                  </ul>
                  <div className="flex justify-between items-center mt-3">
                    <div className="text-green-600 font-medium">${room.price} per night</div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedRoomDetails(room)}
                        className="text-blue-600 text-sm hover:underline"
                      >
                        View Details
                      </button>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="roomType"
                          value={room.name}
                          checked={formData.roomType === room.name}
                          onChange={handleChange}
                          className="mr-2"
                          required
                        />
                        Select
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded mt-4"
        >
          Confirm Reservation
        </button>
      </form>

      {/* Modal for Room Details */}
      {selectedRoomDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl relative">
            <button
              onClick={() => setSelectedRoomDetails(null)}
              className="absolute top-2 right-4 text-gray-500 text-xl hover:text-red-500"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-2">{selectedRoomDetails.name}</h3>
            <p className="text-sm text-gray-700 mb-4">{selectedRoomDetails.description}</p>
            <div className="grid grid-cols-2 gap-3">
              {selectedRoomDetails.moreImages.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`More of ${selectedRoomDetails.name}`}
                  className="h-32 w-full object-cover rounded"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationForm;
