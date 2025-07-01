// Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaUser,
  FaHeart,      // Wishlists
  FaBars,
  FaTimes,
  FaGlobe,      // Languages & currency
  FaQuestionCircle, // Help Centre
  FaSuitcase,   // Trips
  FaComment,    // Messages
  FaBell,       // Notifications
  FaCog,        // Account settings
  FaSignOutAlt, // Logout (alternative to just text)
} from 'react-icons/fa';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const panelRef = useRef();
  const navigate = useNavigate();

  // Read login status and user data directly from localStorage
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  // Parse user data if logged in, otherwise null
  const user = isLoggedIn ? JSON.parse(localStorage.getItem('user')) : null;

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const handleLogout = () => {
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('user'); // Clear user data on logout
    setMenuOpen(false);
    navigate('/');
  };

  // Function to get the first initial of the user's name
  const getFirstInitial = (name) => {
    if (name) {
      return name.charAt(0).toUpperCase();
    }
    return ''; // Return empty string if no name
  };

  return (
    // Changed "fixed" to "sticky". Removed "relative" as "sticky" handles positioning.
    <nav className="sticky top-0 w-full bg-white shadow p-4 flex justify-between items-center z-50">
      {/* Logo */}
      <Link to="/" className="text-xl font-bold text-blue-600">
        ResortFinder
      </Link>

      {/* Right-hand side elements: Become a host, Language, User/Hamburger */}
      <div className="flex items-center gap-4">
        {/* Become a Host (Always visible in header) */}
        <Link
          to="/become-a-host"
          className="text-black font-medium hover:bg-gray-100 py-2 px-3 rounded-full transition-colors duration-200"
        >
          Become a host
        </Link>

        {/* Language Icon (Globe) */}
        <button
          className="text-gray-700 hover:bg-gray-100 p-3 rounded-full transition-colors duration-200"
          title="Change language"
        >
          <FaGlobe className="text-xl" />
        </button>

        {/* Combined User/Menu button */}
        <button
          onClick={() => setMenuOpen(true)}
          className="flex items-center gap-2 border rounded-full py-2 px-3 shadow-md hover:shadow-lg transition-shadow duration-200"
        >
          <FaBars className="text-lg text-gray-700" />
          {isLoggedIn && user ? (
            // If logged in: display user image or initial
            user.profileImage ? (
              <img src={user.profileImage} alt="User" className="w-6 h-6 rounded-full object-cover" />
            ) : (
              <div className="w-6 h-6 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center text-sm font-semibold uppercase">
                {getFirstInitial(user.name)}
              </div>
            )
          ) : (
            // If not logged in: display generic user icon
            <FaUser className="text-xl text-gray-700" />
          )}
        </button>
      </div>

      {/* Sliding Menu (Panel) */}
      <div
        ref={panelRef}
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-lg p-6 z-50 transform transition-transform duration-300 ease-in-out ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Close button */}
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-xl"
        >
          <FaTimes />
        </button>

        {/* Conditional content based on login status */}
        {isLoggedIn ? (
          // Content when LOGGED IN (as per Screenshot 2025-06-28 214356.png)
          <ul className="mt-12 space-y-4 text-gray-800">
            <li>
              <Link to="/wishlists" onClick={() => setMenuOpen(false)} className="flex items-center hover:bg-gray-100 p-2 rounded">
                <FaHeart className="mr-3 text-lg" /> Wishlists
              </Link>
            </li>
            <li>
              <Link to="/resorts" onClick={() => setMenuOpen(false)} className="flex items-center hover:bg-gray-100 p-2 rounded">
                <FaSuitcase className="mr-3 text-lg" /> Trips
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={() => setMenuOpen(false)} className="flex items-center hover:bg-gray-100 p-2 rounded">
                <FaComment className="mr-3 text-lg" /> Messages
              </Link>
            </li>
            <li>
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center hover:bg-gray-100 p-2 rounded">
                <FaUser className="mr-3 text-lg" /> Profile
              </Link>
            </li>

            <li className="border-t pt-4 mt-4">
              <Link to="/notifications" onClick={() => setMenuOpen(false)} className="flex items-center justify-between hover:bg-gray-100 p-2 rounded">
                <span className="flex items-center">
                  <FaBell className="mr-3 text-lg" /> Notifications
                </span>
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">1</span> {/* Notification badge */}
              </Link>
            </li>
           
               <li>
              <Link to="/settings" onClick={() => setMenuOpen(false)} className="flex items-center hover:bg-gray-100 p-2 rounded">
                <FaCog className="mr-3 text-lg" /> Account settings
              </Link>
            </li>
      
            <li>
              <Link to="/help" onClick={() => setMenuOpen(false)} className="flex items-center hover:bg-gray-100 p-2 rounded">
                <FaQuestionCircle className="mr-3 text-lg" /> Help Centre
              </Link>
            </li>
             <li className="border-t pt-4 mt-4">
              <button
                onClick={handleLogout}
                className="flex items-center text-red-600 hover:underline hover:bg-gray-100 p-2 rounded w-full text-left"
              >
                <FaSignOutAlt className="mr-3 text-lg" /> Logout {/* Using an icon for logout */}
              </button>
            </li>

            {/* "Become a host" section - always present in logged-in menu too */}
            <li className="border-t pt-4 mt-4">
              <Link
                to="/become-a-host"
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                <div>
                  <div className="font-semibold">Become a host</div>
                  <div className="text-sm text-gray-600">
                    It's easy to start hosting and earn extra income.
                  </div>
                </div>
                {/* Replace with your actual house icon image path */}
                <img src="/images/house-icon.png" alt="House icon" className="w-12 h-12 ml-4" />
              </Link>
            </li>
            <li>
              <Link to="/refer-a-host" onClick={() => setMenuOpen(false)} className="block hover:bg-gray-100 p-2 rounded">
                Refer a host
              </Link>
            </li>
            <li>
              <Link to="/find-a-co-host" onClick={() => setMenuOpen(false)} className="block hover:bg-gray-100 p-2 rounded">
                Find a co-host
              </Link>
            </li>

           
          </ul>
        ) : (
          // Content when NOT LOGGED IN (as per image_1512f6.png - modified with "About" link)
          <div className="mt-12 space-y-4 text-gray-800">
            <h3 className="font-bold text-lg mb-4">Welcome to ResortFinder</h3>
            <div className="border-b pb-4 mb-4">
              <Link to="/help" className="flex items-center hover:bg-gray-100 p-2 rounded" onClick={() => setMenuOpen(false)}>
                <FaQuestionCircle className="mr-2 text-xl" /> Help Centre
              </Link>
            </div>
            <Link
              to="/become-a-host"
              className="flex items-center justify-between border rounded-lg p-3 hover:bg-gray-50 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              <div>
                <div className="font-semibold">Become a host</div>
                <div className="text-sm text-gray-600">
                  It's easy to start hosting and earn extra income.
                </div>
              </div>
              <img src="/images/house-icon.png" alt="House icon" className="w-12 h-12 ml-4" />
            </Link>
            <Link to="/refer-a-host" className="block mt-4 hover:bg-gray-100 p-2 rounded" onClick={() => setMenuOpen(false)}>
              Refer a host
            </Link>
            <Link to="/find-a-co-host" className="block hover:bg-gray-100 p-2 rounded" onClick={() => setMenuOpen(false)}>
              Find a co-host
            </Link>
            <Link to="/aboutus" className="block mt-4 hover:bg-gray-100 p-2 rounded" onClick={() => setMenuOpen(false)}>
              About ResortFinder
            </Link>

            <div className="border-t pt-4 mt-4">
              <Link to="/auth" className="block hover:bg-gray-100 p-2 rounded font-semibold" onClick={() => setMenuOpen(false)}>
                Log in or sign up
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
