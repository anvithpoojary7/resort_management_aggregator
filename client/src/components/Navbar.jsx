import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaHeart, FaBars } from 'react-icons/fa';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef();
  
  // Simulated auth check (replace with real auth check logic)
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'; // or from context/store

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center relative z-50">
      {/* Logo */}
      <Link to="/" className="text-xl font-bold text-blue-600">ResortFinder</Link>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Conditionally Render Favorites */}
        <Link
          to="/favorites"
          className="text-black hover:text-red-600 transition"
          title="Favorites"
        >
          <FaHeart className="text-xl" />
        </Link>


        {/* Login/Register */}
        <Link
          to="/auth"
          className="flex items-center text-blue-600 font-medium hover:underline"
        >
          <FaUser className="mr-1" />
          Login / Register
        </Link>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-2xl text-gray-700 focus:outline-none ml-2"
        >
          <FaBars />
        </button>
      </div>

      {/* Animated Dropdown */}
      <div
        ref={dropdownRef}
        className={`absolute right-4 top-16 bg-white shadow-md rounded-lg p-4 w-48 z-50 transform transition-all duration-300 origin-top ${
          menuOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
        }`}
      >
        <ul className="space-y-2 text-gray-700">
          <li><Link to="/" onClick={() => setMenuOpen(false)}>🏠 Home</Link></li>
          <li><Link to="/resorts" onClick={() => setMenuOpen(false)}>🌴 Browse Resorts</Link></li>
          <li><Link to="/contact" onClick={() => setMenuOpen(false)}>📞 Contact Us</Link></li>
          <li><Link to="/help" onClick={() => setMenuOpen(false)}>❓ Help & Support</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;


