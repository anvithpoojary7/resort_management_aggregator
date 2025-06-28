import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaStar, FaRegStar, FaSearch, FaFilter } from 'react-icons/fa';

const resorts = [
  {
    id: 1,
    name: 'Serenity Bay Resort',
    place: 'Goa',
    price: 7500,
    amenities: ['WiFi', 'Pool', 'Spa'],
    rating: 4,
    image: '/c4.jpg',
  },
  {
    id: 2,
    name: 'Mountain View Inn',
    place: 'Manali',
    price: 5200,
    amenities: ['WiFi', 'Breakfast'],
    rating: 3,
    image: '/c1.jpg',
  },
  {
    id: 3,
    name: 'Lakeside Paradise',
    place: 'Udaipur',
    price: 8100,
    amenities: ['WiFi', 'Boat Ride', 'Gym'],
    rating: 5,
    image: '/c2.jpg',
  },
  {
    id: 4,
    name: 'Royal Garden Stay',
    place: 'Ooty',
    price: 6800,
    amenities: ['WiFi', 'Garden'],
    rating: 4,
    image: '/c3.jpg',
  },
];

const ResortList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    maxPrice: '',
    amenity: '',
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredResorts = resorts.filter((resort) => {
    const matchesSearch =
      resort.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resort.place.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLocation =
      filters.location === '' ||
      resort.place.toLowerCase().includes(filters.location.toLowerCase());

    const matchesPrice =
      filters.maxPrice === '' || resort.price <= parseInt(filters.maxPrice);

    const matchesAmenity =
      filters.amenity === '' ||
      resort.amenities.some((a) =>
        a.toLowerCase().includes(filters.amenity.toLowerCase())
      );

    return matchesSearch && matchesLocation && matchesPrice && matchesAmenity;
  });

  return (
    <section className="bg-gray-50 py-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-semibold mb-6">All Resorts</h1>

        {/* Search and Filter Bar */}
        <div className="flex items-center gap-4 mb-6 w-full">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search by resort name or place..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute top-2.5 left-3 text-gray-400" />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"
            title="Filter"
          >
            <FaFilter />
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              name="location"
              placeholder="Filter by location"
              value={filters.location}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
            <input
              type="number"
              name="maxPrice"
              placeholder="Max price (₹)"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
            <input
              type="text"
              name="amenity"
              placeholder="Amenity (e.g., WiFi, Spa)"
              value={filters.amenity}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        )}

        {/* Resorts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResorts.length > 0 ? (
            filteredResorts.map((resort) => (
              <div
                key={resort.id}
                onClick={() => navigate(`/resorts/${resort.id}`)}
                className="cursor-pointer bg-white rounded-xl shadow hover:shadow-lg overflow-hidden transition"
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
            ))
          ) : (
            <p className="text-gray-600 col-span-full">No resorts match your filters.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ResortList;
