// AmenityResortsList.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaStar, FaRegStar } from 'react-icons/fa';

// Dummy resort data — replace with dynamic fetch later
const resorts = [
  {
    id: 1,
    name: 'Serenity Bay Resort',
    place: 'Goa',
    amenities: ['WiFi', 'Pool', 'Spa', 'Infinity Pool'],
    price: 7500,
    rating: 4,
    image: '/c4.jpg',
  },
  {
    id: 2,
    name: 'Mountain View Inn',
    place: 'Manali',
    amenities: ['WiFi', 'Breakfast', 'Luxury Spa'],
    price: 5200,
    rating: 3,
    image: '/c1.jpg',
  },
  {
    id: 3,
    name: 'Ocean Breeze Retreat',
    place: 'Kovalam',
    amenities: ['Ocean View Suites', 'Pet Friendly', 'WiFi'],
    price: 6800,
    rating: 5,
    image: '/c2.jpg',
  },
];

const AmenityResortsList = () => {
  const { amenityName } = useParams();
  const navigate = useNavigate();
  const decodedAmenity = decodeURIComponent(amenityName).toLowerCase();

  const filtered = resorts.filter((resort) =>
    resort.amenities.some((a) => a.toLowerCase() === decodedAmenity)
  );

  return (
    <section className="min-h-screen bg-white py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Resorts with: {decodedAmenity.charAt(0).toUpperCase() + decodedAmenity.slice(1)}
        </h1>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((resort) => (
              <div
                key={resort.id}
                onClick={() => navigate(`/resorts/${resort.id}`)}
                className="cursor-pointer bg-gray-50 rounded-xl shadow hover:shadow-lg overflow-hidden transition"
              >
                <img
                  src={resort.image}
                  alt={resort.name}
                  className="h-56 w-full object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-bold">{resort.name}</h2>
                  <div className="flex items-center text-sm text-gray-500 mt-1 mb-2">
                    <FaMapMarkerAlt className="mr-1 text-red-400" />
                    <span>{resort.place}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">₹{resort.price}/night</p>
                  <p className="text-xs text-gray-400 mb-2">
                    {resort.amenities.join(', ')}
                  </p>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) =>
                      i < resort.rating ? (
                        <FaStar key={i} className="text-yellow-400 mr-1" />
                      ) : (
                        <FaRegStar key={i} className="text-gray-300 mr-1" />
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No resorts found with this amenity.</p>
        )}
      </div>
    </section>
  );
};

export default AmenityResortsList;
