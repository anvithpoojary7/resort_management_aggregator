import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

import { FaMapMarkerAlt } from 'react-icons/fa';
import MagicLoader from '../pages/MagicLoader';
import ResortCard from '../components/ResortCard';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://resort-finder-2aqp.onrender.com'
  : 'http://localhost:8080';

const AMENITIES = ["WiFi", "Pool", "Spa", "Gym", "Bar & Restaurant", "Beach Access","Pet friendly"];

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

  const [wishlistIds, setWishlistIds] = useState([]);
  const [loadingWishlistToggle, setLoadingWishlistToggle] = useState(false);
  const { isLoggedIn } = useAuth();

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

  useEffect(() => {
    const fetchAllLocations = async () => {
      try {
        // CORRECTED: Added backticks for the template literal string
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

  const fetchResorts = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const qs = location.search.slice(1);
      // CORRECTED: Added backticks for the template literal strings
      const url = qs
        ? `${API_BASE_URL}/api/filteresort/search?${qs}`
        : `${API_BASE_URL}/api/resorts/allresorts`;

      const res = await fetch(url);
      // CORRECTED: Added backticks for the template literal string in the error message
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

  const fetchWishlistStatus = useCallback(async () => {
    if (!isLoggedIn) {
      setWishlistIds([]);
      return;
    }
    try {
      // CORRECTED: Added backticks for the template literal string
      const res = await axios.get(`${API_BASE_URL}/api/wishlist/status`, {
        withCredentials: true,
      });
      setWishlistIds(res.data.map(id => id.toString()));
    } catch (err) {
      console.error('Error fetching wishlist status:', err.response?.data?.message || err.message);
      setWishlistIds([]);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    fetchWishlistStatus();
  }, [fetchWishlistStatus]);

  const handleToggleWishlist = async (resortId) => {
    if (!isLoggedIn) {
      alert('Please log in to add resorts to your wishlist!');
      navigate('/login');
      return;
    }

    setLoadingWishlistToggle(true);
    const isCurrentlyWishlisted = wishlistIds.includes(resortId);

    try {
       const token = localStorage.getItem("token");
      if (isCurrentlyWishlisted) {
        // CORRECTED: Added backticks for the template literal string
        await axios.delete(`${API_BASE_URL}/api/wishlist/${resortId}`, { withCredentials: true,
           headers: {
      Authorization: `Bearer ${token}`,
    },
         });
        setWishlistIds((prev) => prev.filter((id) => id !== resortId));
      } else {
        // CORRECTED: Added backticks for the template literal string
        await axios.post(`${API_BASE_URL}/api/wishlist/${resortId}`, {}, { withCredentials: true ,
          headers: {
      Authorization: `Bearer ${token}`,
    },
             
        },



        );
        setWishlistIds((prev) => [...prev, resortId]);
      }
    } catch (err) {
      console.error('Error toggling wishlist:', err.response?.data?.message || err.message);
      alert('Failed to update wishlist. Please try again.');
    } finally {
      setLoadingWishlistToggle(false);
    }
  };

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

    // CORRECTED: Wrapped path in backticks to make it a valid string
    navigate(`/resorts?${p.toString()}`);
  };

  const handleLocationChange = (e) => {
    const inputVal = e.target.value;
    setLocFilter(inputVal);

    if (inputVal.length > 0) {
      const filteredSuggestions = allLocations.filter(loc =>
        loc.toLowerCase().includes(inputVal.toLowerCase())
      );
      setSuggestions(filteredSuggestions.length > 0 ? filteredSuggestions : ['_NO_MATCH_']);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (selectedLocation) => {
    if (selectedLocation === '_NO_MATCH_') return;
    setLocFilter(selectedLocation);
    setSuggestions([]);
    updateUrlAndSearch({ location: selectedLocation });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUrlAndSearch();
    setSuggestions([]);
  };

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
          {/* Form content remains the same... */}
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
                  sugg_location === '_NO_MATCH_' ? (
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {resorts.length ? (
            resorts.map((r) => (
              <ResortCard
                key={r._id}
                resort={r}
                isWishlisted={wishlistIds.includes(r._id.toString())}
                onToggleWishlist={handleToggleWishlist}
                isLoadingToggle={loadingWishlistToggle}
              />
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