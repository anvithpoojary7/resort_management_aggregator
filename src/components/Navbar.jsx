import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaHeart, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const panelRef = useRef();
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

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
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center relative z-50">
      {/* Logo */}
      <Link to="/" className="text-xl font-bold text-blue-600">
        ResortFinder
      </Link>

      {/* Icons */}
      <div className="flex items-center gap-4">
        {/* Favorites */}
        <Link to="/favorites" className="text-black hover:text-red-600 transition" title="Favorites">
          <FaHeart className="text-xl" />
        </Link>

        {/* Login/Register */}
        {!isLoggedIn && (
          <Link to="/auth" className="flex items-center text-blue-600 font-medium hover:underline">
            <FaUser className="mr-1" />
            Login / Register
          </Link>
        )}

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(true)}
          className="text-2xl text-gray-700 focus:outline-none ml-2"
        >
          <FaBars />
        </button>
      </div>

      {/* Sliding Menu */}
      <div
        ref={panelRef}
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg p-6 z-50 transform transition-transform duration-300 ease-in-out ${
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

        {/* Navigation links */}
        <ul className="mt-12 space-y-4 text-gray-800">
          <li><Link to="/" onClick={() => setMenuOpen(false)}>🏠 Home</Link></li>
          <li><Link to="/resorts" onClick={() => setMenuOpen(false)}>🌴 Browse Resorts</Link></li>
          <li><Link to="/bookings" onClick={() => setMenuOpen(false)}>🧳 My Bookings</Link></li>
          <li><Link to="/my-resorts" onClick={() => setMenuOpen(false)}>🏨 My Resorts</Link></li>
          <li><Link to="/profile" onClick={() => setMenuOpen(false)}>👤 Profile</Link></li>
          <li><Link to="/settings" onClick={() => setMenuOpen(false)}>⚙️ Settings</Link></li>
          <li><Link to="/contact" onClick={() => setMenuOpen(false)}>📞 Contact Us</Link></li>
          <li><Link to="/help" onClick={() => setMenuOpen(false)}>❓ Help & Support</Link></li>

          {/* Auth Action */}
          {isLoggedIn ? (
            <li>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:underline"
              >
                🚪 Logout
              </button>
            </li>
          ) : (
            <li>
              <Link to="/auth" onClick={() => setMenuOpen(false)}>🔐 Login / Register</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;


