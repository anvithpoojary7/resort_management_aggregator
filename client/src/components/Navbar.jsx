import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaHeart, FaBars, FaTimes, FaGlobe, FaQuestionCircle } from 'react-icons/fa'; // Import FaQuestionCircle

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

      {/* Right-hand side elements: Become a host, Language, Hamburger */}
      <div className="flex items-center gap-4">
        {/* Become a Host (Always visible, but action might change based on login) */}
        <Link
          to="/become-a-host"
          className="text-black font-medium hover:bg-gray-100 py-2 px-3 rounded-full transition-colors duration-200"
        >
          Become a host
        </Link>

        {/* Language Icon */}
        <button
          className="text-gray-700 hover:bg-gray-100 p-3 rounded-full transition-colors duration-200"
          title="Change language"
        >
          <FaGlobe className="text-xl" />
        </button>

        {/* Combined User/Menu button (replaces separate Login/Register and Hamburger) */}
        <button
          onClick={() => setMenuOpen(true)}
          className="flex items-center gap-2 border rounded-full py-2 px-3 shadow-md hover:shadow-lg transition-shadow duration-200"
        >
          <FaBars className="text-lg text-gray-700" />
          <FaUser className="text-xl text-gray-700" />
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
        {!isLoggedIn ? (
          // Content when NOT logged in (as per image_1512f6.png)
          <div className="mt-12 space-y-4 text-gray-800">
            <h3 className="font-bold text-lg mb-4">Welcome to ResortFinder</h3>
            <div className="border-b pb-4 mb-4">
              <Link to="/help" className="flex items-center hover:bg-gray-100 p-2 rounded" onClick={() => setMenuOpen(false)}>
                <FaQuestionCircle className="mr-2 text-xl" /> Help Centre {/* Changed icon here */}
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
              {/* Replace with your actual house icon image path */}
              <img src="/images/house-icon.png" alt="House icon" className="w-12 h-12 ml-4" /> 
            </Link>
         <Link to="/about" className="block mt-4 hover:bg-gray-100 p-2 rounded" onClick={() => setMenuOpen(false)}>
    About ResortFinder
</Link>
          
            <div className="border-t pt-4 mt-4">
              <Link to="/auth" className="block hover:bg-gray-100 p-2 rounded font-semibold" onClick={() => setMenuOpen(false)}>
                Log in or sign up
              </Link>
            </div>
          </div>
        ) : (
          // Existing navigation links when logged in
          <ul className="mt-12 space-y-4 text-gray-800">
            <li><Link to="/" onClick={() => setMenuOpen(false)} className="hover:bg-gray-100 p-2 rounded block">🏠 Home</Link></li>
            <li><Link to="/resorts" onClick={() => setMenuOpen(false)} className="hover:bg-gray-100 p-2 rounded block">🌴 Browse Resorts</Link></li>
            <li><Link to="/bookings" onClick={() => setMenuOpen(false)} className="hover:bg-gray-100 p-2 rounded block">🧳 My Bookings</Link></li>
            <li><Link to="/my-resorts" onClick={() => setMenuOpen(false)} className="hover:bg-gray-100 p-2 rounded block">🏨 My Resorts</Link></li>
            <li><Link to="/profile" onClick={() => setMenuOpen(false)} className="hover:bg-gray-100 p-2 rounded block">👤 Profile</Link></li>
            <li><Link to="/settings" onClick={() => setMenuOpen(false)} className="hover:bg-gray-100 p-2 rounded block">⚙ Settings</Link></li>
            <li><Link to="/contact" onClick={() => setMenuOpen(false)} className="hover:bg-gray-100 p-2 rounded block">📞 Contact Us</Link></li>
            <li><Link to="/help" onClick={() => setMenuOpen(false)} className="hover:bg-gray-100 p-2 rounded block">❓ Help & Support</Link></li>
            <li>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:underline hover:bg-gray-100 p-2 rounded w-full text-left"
              >
                🚪 Logout
              </button>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;