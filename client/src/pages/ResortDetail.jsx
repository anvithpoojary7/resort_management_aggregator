import React from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // ✅ Added useNavigate

const ResortDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // ✅ Hook for navigation

  // Static data (you can later fetch this by ID from an API)
  const resort = {
    name: 'Azure Paradise Resort',
    location: 'Maldives',
    rating: 4.9,
    price: 850,
    features: ['Overwater Villas', 'Private Beach', 'Spa & Wellness', 'Fine Dining'],
    amenities: [
      'High-Speed WiFi', 'Swimming Pool', 'Fitness Center', 'Spa Services',
      'Restaurant', 'Room Service', 'Concierge', 'Airport Shuttle'
    ],
    rooms: [
      {
        name: 'Overwater Villa',
        description: 'Luxurious villa built over crystal-clear waters...',
        price: 850,
        features: ['King Bed', 'Private deck', 'Glass floor panels', 'Direct water access', 'Butler service'],
        image: '/img1.jpg',
      },
      {
        name: 'Beach Villa',
        description: 'Spacious beachfront villa with private beach access...',
        price: 650,
        features: ['King Bed', 'Private beach access', 'Outdoor shower', 'Minibar'],
        image: '/img2.jpg',
      },
      {
        name: 'Garden Suite',
        description: 'Elegant suite surrounded by tropical gardens...',
        price: 450,
        features: ['Queen Bed', 'Garden view', 'Jacuzzi', 'Private balcony'],
        image: '/main.jpg',
      },
    ]
  };

  return (
    <div className="bg-gray-50 py-8 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2/3 Content */}
        <div className="col-span-2">
          <div className="grid grid-cols-2 gap-2 mb-4">
            <img src="/main.jpg" alt="Main" className="rounded-lg h-72 object-cover w-full col-span-2" />
            <img src="/img1.jpg" alt="Secondary 1" className="rounded-lg h-32 w-full object-cover" />
            <img src="/img2.jpg" alt="Secondary 2" className="rounded-lg h-32 w-full object-cover" />
          </div>

          <h1 className="text-3xl font-bold mb-2">{resort.name}</h1>
          <p className="text-gray-600 mb-1">📍 {resort.location}</p>
          <p className="text-yellow-500 mb-4">⭐ {resort.rating}</p>

          <p className="text-gray-700 mb-4">
            A luxurious overwater resort offering pristine beaches, crystal-clear waters, and world-class amenities.
          </p>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Resort Features</h2>
            <div className="flex flex-wrap gap-2">
              {resort.features.map((feature, i) => (
                <span key={i} className="px-3 py-1 bg-gray-200 rounded-full text-sm">{feature}</span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {resort.amenities.map((amenity, i) => (
                <div key={i} className="bg-white rounded-md px-4 py-2 border border-gray-200 text-sm">
                  {amenity}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Room Types</h2>
            <div className="grid gap-4">
              {resort.rooms.map((room, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <img src={room.image} className="w-full sm:w-64 h-40 object-cover rounded" alt="" />
                    <div>
                      <h4 className="text-lg font-semibold">{room.name}</h4>
                      <p className="text-gray-600 text-sm">{room.description}</p>
                      <div className="flex flex-wrap gap-2 text-xs mt-2">
                        {room.features.map((f, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 rounded-full">{f}</span>
                        ))}
                      </div>
                      <div className="text-green-600 mt-2 font-medium">${room.price} per night</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Booking Sidebar */}
        <div className="col-span-1 mt-6 lg:mt-0">
          <div className="sticky top-6 bg-white border p-4 rounded-lg shadow">
            <div className="text-2xl font-semibold mb-2">${resort.price} <span className="text-sm text-gray-600">per night</span></div>
            <div className="text-sm text-yellow-500 mb-4">⭐ Excellent location</div>
            <div className="flex flex-col gap-3">
              <input type="date" className="border rounded px-3 py-2" />
              <input type="date" className="border rounded px-3 py-2" />
              <select className="border rounded px-3 py-2">
                <option>1 Guest</option>
                <option>2 Guests</option>
                <option>3 Guests</option>
              </select>
              <button
                onClick={() => navigate(`/resorts/${id}/reserve`)} // ✅ Navigate to reservation page
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
              >
                Reserve Now
              </button>
              <p className="text-xs text-gray-500 mt-1">
                You won't be charged yet. Free cancellation until 24 hours before check-in.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResortDetail;
