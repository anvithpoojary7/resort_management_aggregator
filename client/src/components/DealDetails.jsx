import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const deals = [
  {
    id: 'goa-beach-retreat',
    title: 'Goa Beach Retreat',
    subtitle: 'Save 20% on luxury stays',
    description:
      'Relax at this beachside retreat in North Goa. Includes private villas, beach access, rooftop pool, complimentary breakfast, and airport pickup. Perfect for couples or families looking to escape the city.',
    image: '/td1.webp',
    images: ['/td1.webp', '/td1a.jpg', '/td1b.jpg'],
    amenities: ['Beach Access', 'Pool', 'Breakfast Included', 'Wi-Fi', 'Airport Pickup'],
    resortId: 'resort123', // Use this to link to the reservation form
  },
  {
    id: 'hills-of-munnar',
    title: 'Hills of Munnar',
    subtitle: 'Cool weather + hot deals',
    description:
      'Experience the beauty of the Western Ghats with scenic views, tea plantations, and cozy cottages. Enjoy bonfires, guided walks, and traditional Kerala meals.',
    image: '/td2.jpg',
    images: ['/td2.jpg', '/td2a.jpg', '/td2b.jpg'],
    amenities: ['Tea Garden Views', 'Guided Walks', 'Traditional Meals', 'Wi-Fi'],
    resortId: 'resort456',
  },
  // Add the rest of the deals in similar format...
];

const DealDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const deal = deals.find((d) => d.id === id);

  if (!deal) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-semibold text-red-500 mb-4">Oops! Deal not found</h2>
        <Link to="/" className="text-blue-600 underline">
          Go back to deals
        </Link>
      </div>
    );
  }

  const handleBooking = () => {
    navigate(`/resorts/${deal.resortId}/reserve`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Title */}
      <h1 className="text-4xl font-bold mb-2">{deal.title}</h1>
      <p className="text-xl text-gray-600 mb-6">{deal.subtitle}</p>

      {/* Main Image */}
      <img
        src={deal.image}
        alt={deal.title}
        className="w-full h-80 object-cover rounded-xl shadow-lg mb-6"
      />

      {/* Additional Images */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {deal.images.slice(1).map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Gallery ${index}`}
            className="w-full h-48 object-cover rounded-lg shadow"
          />
        ))}
      </div>

      {/* Description */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">About This Resort</h2>
        <p className="text-gray-700 leading-relaxed">{deal.description}</p>
      </div>

      {/* Amenities */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Amenities</h2>
        <ul className="list-disc list-inside text-gray-600">
          {deal.amenities.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-4 mt-8">
        <button
          onClick={handleBooking}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
        >
          Book Now
        </button>
        <Link
          to="/"
          className="bg-gray-100 text-gray-700 px-6 py-2 rounded hover:bg-gray-200 transition"
        >
          ← Back to Deals
        </Link>
      </div>
    </div>
  );
};

export default DealDetails;