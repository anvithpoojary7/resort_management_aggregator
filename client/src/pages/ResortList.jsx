import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';

import { FaMapMarkerAlt, FaStar, FaRegStar } from 'react-icons/fa';
import MagicLoader from './MagicLoader';

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://resort-finder-2aqp.onrender.com'
  : 'http://localhost:8080';

const AMENITIES = ['Pool', 'Wi-Fi', 'AC', 'Games', 'Spa', 'Yoga'];

const ResortList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const wrapperRef = useRef(null);

  const [locFilter, setLocFilter] = useState(params.get('location') || '');
  const [maxPrice, setMaxPrice] = useState(params.get('maxPrice') || '');
  const [sort, setSort] = useState(params.get('sort') || '');
  const [checkInDate, setCheckInDate] = useState(params.get('checkIn') ? new Date(params.get('checkIn')) : null);
  const [checkOutDate, setCheckOutDate] = useState(params.get('checkOut') ? new Date(params.get('checkOut')) : null);
  const [adults, setAdults] = useState(Number(params.get('adults')) || 0);
  const [children, setChildren] = useState(Number(params.get('children')) || 0);
  const [resorts, setResorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [amenities, setAmenities] = useState(params.getAll('amenities'));
  const [allLocations, setAllLocations] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  // Close suggestions & filter box on outside click
  useEffect(() => {
    const close = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowFilters(false);
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  // Fetch all locations for autocomplete suggestions
  useEffect(() => {
    const fetchAllLocations = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/resorts/allresorts`);
        if (!res.ok) throw new Error('Could not fetch locations');
        const allResortsData = await res.json();
        const uniqueLocations = [...new Set(allResortsData.map(r => r.location))];
        setAllLocations(uniqueLocations);
      } catch (error) {
        console.error("Failed to load locations for suggestions:", error);
      }
    };
    fetchAllLocations();
  }, []);

  // Fetch resorts based on query params
  const fetchResorts = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const qs = location.search.slice(1);
      const url = qs
        ? `${API_BASE_URL}/api/filteresort/search?${qs}`
        : `${API_BASE_URL}/api/resorts/allresorts`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP Error ${res.status} on URL: ${url}`);
      setResorts(await res.json());
    } catch (e) {
      console.error(e);
      setErr('Could not load resorts. Try again later.');
    } finally {
      setLoading(false);
    }
  }, [location.search]);

  useEffect(() => {
    fetchResorts();
  }, [fetchResorts]);

  // Update the URL and trigger search
  const updateUrlAndSearch = (overrides = {}) => {
    const p = new URLSearchParams();

    const locationToSearch = overrides.location !== undefined ? overrides.location : locFilter;
    const amenitiesToSearch = overrides.amenities !== undefined ? overrides.amenities : amenities;

    if (locationToSearch) p.set('location', locationToSearch);
    if (maxPrice) p.set('maxPrice', maxPrice);
    if (adults > 0) p.set('adults', adults);
    if (children > 0) p.set('children', children);
    if (checkInDate) p.set('checkIn', checkInDate.toISOString());
    if (checkOutDate) p.set('checkOut', checkOutDate.toISOString());
    if (sort) p.set('sort', sort);
    amenitiesToSearch.forEach((a) => p.append('amenities', a));

    navigate(`/resorts?${p.toString()}`);
  };

  // Handle location input change
  const handleLocationChange = (e) => {
    const inputVal = e.target.value;
    setLocFilter(inputVal);

    if (inputVal.length > 0) {
      const filteredSuggestions = allLocations.filter(loc =>
        loc.toLowerCase().includes(inputVal.toLowerCase())
      );
      // Show "No locations found" if no matches
      setSuggestions(filteredSuggestions.length > 0 ? filteredSuggestions : ['__NO_MATCH__']);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (selectedLocation) => {
    if (selectedLocation === '__NO_MATCH__') return; // Ignore click on "No locations found"
    setLocFilter(selectedLocation);
    setSuggestions([]);
    updateUrlAndSearch({ location: selectedLocation });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUrlAndSearch();
    setSuggestions([]);
  };

  // Toggle amenities
  const toggleAmenity = (toggledAmenity) => {
    const lower = toggledAmenity.toLowerCase();
    const updatedAmenities = amenities.includes(lower)
      ? amenities.filter(a => a !== lower)
      : [...amenities, lower];

    setAmenities(updatedAmenities);
    updateUrlAndSearch({ amenities: updatedAmenities });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <MagicLoader size={250} particleCount={2} speed={1.2} />
      </div>
    );
  }

  if (err) {
    return <p className="text-center text-red-500 mt-10 text-lg font-semibold">{err}</p>;
  }

  return (
    <section className="bg-gray-50 py-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <form
          onSubmit={handleSubmit}
          className="mb-12 bg-white shadow-xl rounded-full px-6 py-5 flex items-center justify-between gap-4 border border-gray-200 relative"
          ref={wrapperRef}
        >
          {/* Location input with suggestions */}
          <div className="relative flex items-center flex-grow bg-white border border-gray-300 rounded-full shadow-sm px-6 py-4">
            <FaMapMarkerAlt className="text-gray-500 text-xl mr-4" />
            <input
              type="text"
              value={locFilter}
              onChange={handleLocationChange}
              placeholder="Search location..."
              className="flex-grow bg-transparent focus:outline-none text-blue-800 font-semibold text-lg"
              autoComplete="off"
            />
            {suggestions.length > 0 && (
              <ul className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                {suggestions.map((sugg_location, index) => (
                  sugg_location === '__NO_MATCH__' ? (
                    <li
                      key={index}
                      className="px-6 py-3 text-gray-400 cursor-default"
                    >
                      No locations found
                    </li>
                  ) : (
                    <li
                      key={index}
                      onClick={() => handleSuggestionClick(sugg_location)}
                      className="px-6 py-3 cursor-pointer hover:bg-gray-100 text-gray-800"
                    >
                      {sugg_location}
                    </li>
                  )
                ))}
              </ul>
            )}

            {/* Filter button */}
            <div
              className="ml-4 relative cursor-pointer hover:text-blue-600"
              onClick={() => setShowFilters(!showFilters)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M3 4h18M3 10h18M3 16h18" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
              </svg>
              {showFilters && (
                <div className="absolute right-0 mt-4 w-72 bg-black border border-gray-800 rounded-xl shadow-xl p-4 z-50 space-y-5 text-white">
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-white">Max Price (₹)</label>
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      placeholder="e.g. 4000"
                      className="w-full px-3 py-2 border border-gray-600 rounded-md bg-zinc-900 text-white placeholder-gray-400"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Amenities</label>
                    <div className="flex flex-wrap gap-2">
                      {AMENITIES.map((amenity) => {
                        const lower = amenity.toLowerCase();
                        const isSelected = amenities.includes(lower);
                        return (
                          <button
                            key={amenity}
                            type="button"
                            onClick={() => toggleAmenity(amenity)}
                            className={`px-4 py-1 border rounded-full text-sm font-medium ${
                              isSelected
                                ? 'bg-black text-white border-white'
                                : 'border-gray-400 text-white hover:border-white hover:text-gray-200'
                            }`}
                          >
                            {amenity}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <button
            type="submit"
            className={`px-8 py-3 rounded-full font-bold transition-all duration-300 shadow-lg ${
              locFilter || maxPrice || sort || adults > 0 || children > 0 || checkInDate || checkOutDate || amenities.length > 0
                ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:from-blue-700 hover:to-blue-900'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
          >
            Search Resorts
          </button>
        </form>

        {/* Resorts List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {resorts.length ? (
            resorts.map((r) => (
              <div
                key={r._id}
                onClick={() => navigate(`/resorts/${r._id}`)}
                className="cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
              >
                <img
                  src={`${API_BASE_URL}/api/resorts/image/${encodeURIComponent(r.image)}`}
                  alt={r.name}
                  className="h-60 w-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="p-5">
                  <h2 className="text-xl font-extrabold text-gray-800 mb-2">{r.name}</h2>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <FaMapMarkerAlt className="mr-2 text-red-500" />
                    <span>{r.location}</span>
                  </div>
                  <p className="text-lg font-bold text-green-700 mb-1">
                    ₹{r.price}
                    <span className="text-sm text-gray-500 font-normal">/night</span>
                  </p>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{(r.amenities || []).join(' • ')}</p>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) =>
                      i < (r.rating || 4) ? (
                        <FaStar key={i} className="text-yellow-500 mr-1 text-md" />
                      ) : (
                        <FaRegStar key={i} className="text-gray-300 mr-1 text-md" />
                      )
                    )}
                    <span className="ml-2 text-sm text-gray-600">({r.rating || 4}.0)</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-700 col-span-full text-center text-xl py-10">
              🔍 No resorts found with your current filters.<br />
              Try changing the max price or selecting different amenities to explore more options!
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ResortList;
