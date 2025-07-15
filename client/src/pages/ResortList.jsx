import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaTag, FaSort, FaStar, FaRegStar } from 'react-icons/fa'; // Import FaStar and FaRegStar
import { MdOutlinePriceChange } from "react-icons/md"; // For max price input
import { IoIosCloseCircle } from "react-icons/io"; // For clearing inputs

const API_BASE_URL = 'https://resort-finder-2aqp.onrender.com';


const ResortList = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const wrapperRef = useRef(null); // Ref for closing date pickers and guest dropdown on outside click

    /* ───────────────────────────────
     * Filter UI state (URL-synced)
     * ─────────────────────────── */
    const [locFilter, setLocFilter] = useState(params.get('location') || '');
    const [maxPrice, setMaxPrice] = useState(params.get('maxPrice') || '');
    const [sort, setSort] = useState(params.get('sort') || '');
    const [petFriendly, setPetFriendly] = useState(params.has('petFriendly'));

    const [checkInDate, setCheckInDate] = useState(
        params.get('checkIn') ? new Date(params.get('checkIn')) : null
    );
    const [checkOutDate, setCheckOutDate] = useState(
        params.get('checkOut') ? new Date(params.get('checkOut')) : null
    );

    const [type, setType] = useState(params.get('type') || '');
    const [adults, setAdults] = useState(Number(params.get('adults')) || 0); // Initialize as number
    const [children, setChildren] = useState(Number(params.get('children')) || 0); // Initialize as number

    // State for showing/hiding date pickers and guest dropdown
    const [showCheckIn, setShowCheckIn] = useState(false);
    const [showCheckOut, setShowCheckOut] = useState(false);
    const [showGuestsDropdown, setShowGuestsDropdown] = useState(false);

    /* ───────────────────────────────
     * Data state
     * ─────────────────────────── */
    const [resorts, setResorts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);

    /* ───────────────────────────────
     * Close date pickers and guest dropdown on outside click
     * ─────────────────────────── */
    useEffect(() => {
        const close = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setShowCheckIn(false);
                setShowCheckOut(false);
                setShowGuestsDropdown(false);
            }
        };
        document.addEventListener('mousedown', close);
        return () => document.removeEventListener('mousedown', close);
    }, []);

    /* ───────────────────────────────
     * Fetch whenever URL query changes
     * ─────────────────────────── */
    const fetchResorts = useCallback(async () => {
        setLoading(true);
        setErr(null);
        try {
            const qs = location.search.slice(1);
            const url = qs
                ? `${API_BASE_URL}/api/fiteresort/search?${qs}`
                : `${API_BASE_URL}/api/resorts/allresorts`;

            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
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

    /* ───────────────────────────────
     * Submit filters → update URL
     * ─────────────────────────── */
    const handleSubmit = (e) => {
        e.preventDefault();
        const p = new URLSearchParams();

        if (locFilter) p.set('location', locFilter);
        if (maxPrice) p.set('maxPrice', maxPrice);
        if (type) p.set('type', type);
        if (adults > 0) p.set('adults', adults); // Only add if greater than 0
        if (children > 0) p.set('children', children); // Only add if greater than 0
        if (checkInDate) p.set('checkIn', checkInDate.toISOString());
        if (checkOutDate) p.set('checkOut', checkOutDate.toISOString());
        if (petFriendly) p.set('petFriendly', '1');
        if (sort) p.set('sort', sort);

        navigate(`/resorts?${p.toString()}`);
    };

    const handleClearLocation = () => {
        setLocFilter('');
    };

    const handleClearMaxPrice = () => {
        setMaxPrice('');
    };

    const handleClearCheckIn = () => {
        setCheckInDate(null);
        if (checkOutDate && checkOutDate < new Date()) { // If checkout is in past after clearing check-in
            setCheckOutDate(null);
        }
    };

    const handleClearCheckOut = () => {
        setCheckOutDate(null);
    };

    const handleAdultsChange = (e) => {
        const value = Number(e.target.value);
        setAdults(Math.max(0, value)); // Ensure it's not negative
    };

    const handleChildrenChange = (e) => {
        const value = Number(e.target.value);
        setChildren(Math.max(0, value)); // Ensure it's not negative
    };

    const totalGuests = adults + children;

    /* ───────────────────────────────
     * Early returns
     * ─────────────────────────── */
    if (loading) return <p className="text-center mt-10 text-lg text-blue-600">Loading resorts...</p>;
    if (err) return <p className="text-center text-red-500 mt-10 text-lg font-semibold">{err}</p>;

    /* ───────────────────────────────
     * Render
     * ─────────────────────────── */
    return (
        <section className="bg-gray-50 py-10 min-h-screen">
            <div className="max-w-7xl mx-auto px-4">
               

                <form
                    onSubmit={handleSubmit}
                    className="mb-12 bg-white shadow-xl rounded-full px-8 py-5 flex flex-wrap items-center justify-between gap-4 border border-gray-200"
                    ref={wrapperRef}
                >
                    {/* Location */}
                    <div className="relative flex-grow min-w-[200px]">
                        <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                        <input
                            value={locFilter}
                            onChange={(e) => setLocFilter(e.target.value)}
                            placeholder="Where are you going?"
                            className="pl-12 pr-10 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none w-full text-gray-700 placeholder-gray-400 font-medium"
                        />
                        {locFilter && (
                            <IoIosCloseCircle
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600 text-xl"
                                onClick={handleClearLocation}
                            />
                        )}
                    </div>

                    {/* Check-in Date Picker */}
                    <div
                        className="relative flex items-center gap-3 cursor-pointer p-3 rounded-full border border-gray-300 hover:border-blue-500 transition-colors bg-white min-w-[150px]"
                        onClick={() => { setShowCheckIn(!showCheckIn); setShowCheckOut(false); setShowGuestsDropdown(false); }}
                    >
                        <FaCalendarAlt className="text-blue-500 text-xl" />
                        <div className="flex-grow">
                            <p className="text-xs text-gray-500 font-semibold">Check-in</p>
                            <p className="font-bold text-gray-800 text-sm">
                                {checkInDate ? checkInDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Select Date'}
                            </p>
                        </div>
                        {checkInDate && (
                            <IoIosCloseCircle
                                className="text-gray-400 cursor-pointer hover:text-gray-600 text-lg"
                                onClick={(e) => { e.stopPropagation(); handleClearCheckIn(); }}
                            />
                        )}
                        {showCheckIn && (
                            <div className="absolute top-full mt-2 left-0 z-50 shadow-lg rounded-xl bg-white p-4 border border-gray-200">
                                <DatePicker
                                    selected={checkInDate}
                                    onChange={(date) => {
                                        setCheckInDate(date);
                                        setShowCheckIn(false);
                                        if (checkOutDate && date && date > checkOutDate) {
                                            setCheckOutDate(null);
                                        }
                                    }}
                                    minDate={new Date()}
                                    inline
                                    className="react-datepicker-custom" // Custom class for styling
                                />
                            </div>
                        )}
                    </div>

                    {/* Check-out Date Picker */}
                    <div
                        className="relative flex items-center gap-3 cursor-pointer p-3 rounded-full border border-gray-300 hover:border-blue-500 transition-colors bg-white min-w-[150px]"
                        onClick={() => { setShowCheckOut(!showCheckOut); setShowCheckIn(false); setShowGuestsDropdown(false); }}
                    >
                        <FaCalendarAlt className="text-blue-500 text-xl" />
                        <div className="flex-grow">
                            <p className="text-xs text-gray-500 font-semibold">Check-out</p>
                            <p className="font-bold text-gray-800 text-sm">
                                {checkOutDate ? checkOutDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Select Date'}
                            </p>
                        </div>
                        {checkOutDate && (
                            <IoIosCloseCircle
                                className="text-gray-400 cursor-pointer hover:text-gray-600 text-lg"
                                onClick={(e) => { e.stopPropagation(); handleClearCheckOut(); }}
                            />
                        )}
                        {showCheckOut && (
                            <div className="absolute top-full mt-2 left-0 z-50 shadow-lg rounded-xl bg-white p-4 border border-gray-200">
                                <DatePicker
                                    selected={checkOutDate}
                                    onChange={(date) => {
                                        setCheckOutDate(date);
                                        setShowCheckOut(false);
                                    }}
                                    minDate={checkInDate || new Date()}
                                    inline
                                    className="react-datepicker-custom" // Custom class for styling
                                />
                            </div>
                        )}
                    </div>

                    {/* Guests Dropdown */}
                    <div className="relative flex-grow min-w-[150px]">
                        <div
                            className="flex items-center gap-3 cursor-pointer p-3 rounded-full border border-gray-300 hover:border-blue-500 transition-colors bg-white"
                            onClick={() => { setShowGuestsDropdown(!showGuestsDropdown); setShowCheckIn(false); setShowCheckOut(false); }}
                        >
                            <FaUsers className="text-blue-500 text-xl" />
                            <div className="flex-grow">
                                <p className="text-xs text-gray-500 font-semibold">Guests</p>
                                <p className="font-bold text-gray-800 text-sm">
                                    {totalGuests > 0 ? `${totalGuests} Guest${totalGuests > 1 ? 's' : ''}` : 'Add Guests'}
                                </p>
                            </div>
                        </div>
                        {showGuestsDropdown && (
                            <div className="absolute top-full mt-2 left-0 right-0 z-50 shadow-lg rounded-xl bg-white p-4 border border-gray-200">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="font-semibold text-gray-700">Adults</span>
                                    <input
                                        type="number"
                                        min={0}
                                        value={adults}
                                        onChange={handleAdultsChange}
                                        className="w-20 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 text-center"
                                        onFocus={(e) => e.target.select()} // Select all on focus
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold text-gray-700">Children</span>
                                    <input
                                        type="number"
                                        min={0}
                                        value={children}
                                        onChange={handleChildrenChange}
                                        className="w-20 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 text-center"
                                        onFocus={(e) => e.target.select()} // Select all on focus
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Secondary Filters & Search Button */}
                    <div className="w-full flex flex-wrap gap-4 items-center justify-end md:justify-start pt-4 border-t border-gray-100 mt-4 md:mt-0 md:border-t-0 md:pt-0">
                        {/* Max Price */}
                        <div className="relative">
                            <MdOutlinePriceChange className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                            <input
                                type="number"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                placeholder="Max Price"
                                className="pl-12 pr-10 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none w-40 text-gray-700 placeholder-gray-400 font-medium"
                            />
                             {maxPrice && (
                                <IoIosCloseCircle
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600 text-xl"
                                    onClick={handleClearMaxPrice}
                                />
                            )}
                        </div>

                        {/* Type */}
                        <div className="relative">
                            <FaTag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="pl-12 pr-4 py-3 rounded-full border border-gray-300 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none w-40 cursor-pointer font-medium"
                            >
                                <option value="">Resort Type</option>
                                <option value="Beach">Beach</option>
                                <option value="Adventure">Adventure</option>
                                <option value="Luxury">Luxury</option>
                                <option value="Budget">Budget</option>
                            </select>
                            {/* Custom arrow for select */}
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                        </div>


                        {/* Pet-friendly */}
                        <label className="flex items-center gap-2 text-md font-medium text-gray-700 cursor-pointer pl-2">
                            <input
                                type="checkbox"
                                checked={petFriendly}
                                onChange={() => setPetFriendly(!petFriendly)}
                                className="accent-blue-600 w-5 h-5"
                            />
                            Pet-friendly
                        </label>

                        {/* Sort */}
                        <div className="relative">
                            <FaSort className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                className="pl-12 pr-4 py-3 rounded-full border border-gray-300 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none w-40 cursor-pointer font-medium"
                            >
                                <option value="">Sort By</option>
                                <option value="low-to-high">Price: Low to High</option>
                                <option value="high-to-low">Price: High to Low</option>
                            </select>
                            {/* Custom arrow for select */}
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                        </div>

                        {/* Search button */}
                        <button
                            type="submit"
                            disabled={
                                !locFilter &&
                                !maxPrice &&
                                !petFriendly &&
                                !sort &&
                                !type &&
                                adults === 0 && // Check for 0 adults
                                children === 0 && // Check for 0 children
                                !checkInDate &&
                                !checkOutDate
                            }
                            className={`px-8 py-3 rounded-full font-bold transition-all duration-300 shadow-lg
                                ${locFilter || maxPrice || petFriendly || sort || type || adults > 0 || children > 0 || checkInDate || checkOutDate
                                    ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:from-blue-700 hover:to-blue-900'
                                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                }`}
                        >
                            Search Resorts
                        </button>
                    </div>
                </form>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {resorts.length ? (
                        resorts.map((r) => (
                            <div
                                key={r._id}
                                onClick={() => navigate(`/resorts/${r._id}`)}
                                className="cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
                            >
                                <img
                                    src={`${API_BASE_URL}/api/resorts/image/${encodeURIComponent(
                                        r.image
                                    )}`}
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
                                        ₹{r.price}<span className="text-sm text-gray-500 font-normal">/night</span>
                                    </p>
                                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                                        {(r.amenities || []).join(' • ')}
                                    </p>
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
                            😔 No resorts match your filters. Try adjusting your search!
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ResortList;