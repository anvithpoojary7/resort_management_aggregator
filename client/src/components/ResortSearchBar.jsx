import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaSearch, FaCalendarAlt, FaUserFriends, FaMapMarkerAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const staticDestinations = ['Mangalore', 'Udupi', 'Karkala', 'Tirupati', 'Udhagamandalam'];

const ResortSearchBar = () => {
  const [showDestinations, setShowDestinations] = useState(false);
  const [query, setQuery] = useState('');
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showCheckOut, setShowCheckOut] = useState(false);
  const [guestsOpen, setGuestsOpen] = useState(false);
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(0);
  const [petFriendly, setPetFriendly] = useState(false);
  const [sortOrder, setSortOrder] = useState('');
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  /* close popovers when clicking away */
  useEffect(() => {
    const close = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDestinations(false);
        setShowCheckIn(false);
        setShowCheckOut(false);
        setGuestsOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  /* build query + navigate */
  const handleSearch = () => {
    const params = new URLSearchParams();
    const trimmed = query.trim();

    if (trimmed) params.set('location', trimmed);
    if (checkIn) params.set('checkIn', checkIn.toISOString());
    if (checkOut) params.set('checkOut', checkOut.toISOString());
    if (sortOrder) params.set('sort', sortOrder);
    if (petFriendly) params.set('petFriendly', '1');

    if (adults > 0) params.set('adults', adults);
    if (children > 0) params.set('children', children);
    if (rooms > 0) params.set('rooms', rooms);

    navigate(`/resorts?${params.toString()}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col items-center mt-6 z-50 relative" ref={wrapperRef}>
      <div
        className="flex flex-col md:flex-row flex-wrap items-stretch bg-white shadow-2xl rounded-2xl
                   border-[2px] border-gray-400 hover:border-blue-500 transition duration-300
                   px-4 py-3 gap-4 w-full max-w-5xl"
      >
        {/* Destination picker */}
        <div
          className="relative w-full md:flex-1 flex items-center gap-2 cursor-pointer"
          onClick={() => {
            setShowDestinations(!showDestinations);
            setShowCheckIn(false);
            setShowCheckOut(false);
            setGuestsOpen(false);
          }}
        >
          <FaMapMarkerAlt className="text-gray-500" />
          <div className="flex flex-col w-full">
            <p className="text-xs text-gray-500">Hotel</p>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Where to?"
              className="font-semibold focus:outline-none bg-transparent w-full cursor-pointer"
            />
          </div>

          {showDestinations && (
            <div
              className="absolute bg-white border mt-2 rounded-lg shadow-lg w-full z-50
                         max-h-60 overflow-y-auto left-0 top-12"
            >
              <p className="p-2 text-sm font-semibold text-gray-500">Popular destinations</p>
              {staticDestinations.map((dest) => (
                <div
                  key={dest}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setQuery(dest);
                    setShowDestinations(false);
                  }}
                >
                  {dest}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Check-in */}
        <div
          className="relative w-full md:flex-1 flex items-center gap-2 cursor-pointer"
          onClick={() => {
            setShowCheckIn(!showCheckIn);
            setShowCheckOut(false);
            setGuestsOpen(false);
          }}
        >
          <FaCalendarAlt className="text-gray-500" />
          <div>
            <p className="text-xs text-gray-500">Check in</p>
            <p className="font-semibold">{checkIn ? checkIn.toLocaleDateString() : '-- / -- / ----'}</p>
          </div>
          {showCheckIn && (
            <div className="absolute top-16 z-50">
              <DatePicker
                selected={checkIn}
                onChange={(d) => {
                  setCheckIn(d);
                  setShowCheckIn(false);
                }}
                inline
              />
            </div>
          )}
        </div>

        {/* Check-out */}
        <div
          className="relative w-full md:flex-1 flex items-center gap-2 cursor-pointer"
          onClick={() => {
            setShowCheckOut(!showCheckOut);
            setShowCheckIn(false);
            setGuestsOpen(false);
          }}
        >
          <FaCalendarAlt className="text-gray-500" />
          <div>
            <p className="text-xs text-gray-500">Check out</p>
            <p className="font-semibold">{checkOut ? checkOut.toLocaleDateString() : '-- / -- / ----'}</p>
          </div>
          {showCheckOut && (
            <div className="absolute top-16 z-50">
              <DatePicker
                selected={checkOut}
                onChange={(d) => {
                  setCheckOut(d);
                  setShowCheckOut(false);
                }}
                inline
              />
            </div>
          )}
        </div>

        {/* Guests selector */}
        <div
          className="relative w-full md:flex-1 flex items-center gap-2 cursor-pointer"
          onClick={() => {
            setGuestsOpen(!guestsOpen);
            setShowCheckIn(false);
            setShowCheckOut(false);
          }}
        >
          <FaUserFriends className="text-gray-500" />
          <div>
            <p className="text-xs text-gray-500">Guests and rooms</p>
            <p className="font-semibold">
              {adults + children} Guests, {rooms} Room{rooms !== 1 ? 's' : ''}
            </p>
          </div>
          {guestsOpen && (
            <div
              className="absolute bg-white shadow-lg rounded-lg p-4 mt-2 w-64 z-50 top-16"
              onClick={(e) => e.stopPropagation()}
            >
              {[['Adults', adults, setAdults], ['Children', children, setChildren], ['Rooms', rooms, setRooms]].map(
                ([label, count, set]) => (
                  <div key={label} className="flex justify-between items-center mb-2">
                    <span>{label}</span>
                    <div className="flex gap-2 items-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          set(Math.max(0, count - 1));
                        }}
                        className="px-2 py-1 border rounded"
                        type="button"
                      >
                        -
                      </button>
                      <span>{count}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          set(count + 1);
                        }}
                        className="px-2 py-1 border rounded"
                        type="button"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )
              )}
              <div className="mt-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={petFriendly}
                    onChange={() => setPetFriendly(!petFriendly)}
                  />
                  Pet-friendly Only
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Sort */}
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="w-full md:w-auto text-sm border border-gray-300 rounded-full px-4 py-2 bg-white
                     shadow-sm hover:border-gray-500 focus:outline-none"
        >
          <option value="">Sort by Price</option>
          <option value="low-to-high">Low to High</option>
          <option value="high-to-low">High to Low</option>
        </select>

        {/* Search button */}
        <button
          onClick={handleSearch}
          type="button"
          className="w-full md:w-auto bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 flex justify-center"
        >
          <FaSearch />
        </button>
      </div>
    </div>
  );
};

export default ResortSearchBar;
