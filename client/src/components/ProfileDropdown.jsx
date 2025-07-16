import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaUserCog,
  FaLifeRing,
  FaSignOutAlt,
  FaRegUserCircle,
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext'; // import your context

const ProfileDropdown = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const { isLoggedIn, user, logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  if (!isLoggedIn) {
    return (
      <Link
        to="/auth"
        className="flex items-center gap-2 px-4 py-2 rounded-full border border-black bg-white shadow-sm hover:bg-gray-50 transition-all"
      >
        <FaRegUserCircle className="text-black text-xl" />
        <span className="text-sm font-medium text-black">Sign in</span>
      </Link>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown((prev) => !prev)}
        className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-black bg-white shadow-md hover:bg-gray-100 transition-all"
      >
        <FaRegUserCircle className="text-black text-2xl" />
        <span className="text-sm font-medium text-black">My Profile</span>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-3 w-72 bg-black/80 backdrop-blur-md text-white rounded-xl shadow-2xl py-3 z-50">
          <div className="px-5 py-3 text-sm text-gray-300 border-b border-gray-600">
            <div className="font-semibold text-base mb-1">
              {user?.name || 'Welcome!'}
            </div>
            <div className="text-xs opacity-80">{user?.email || 'user@example.com'}</div>
          </div>

          <Link
            to="/profile"
            onClick={() => setShowDropdown(false)}
            className="flex items-center gap-3 px-5 py-3 text-sm hover:bg-white/10 transition-all"
          >
            <FaUserCog className="text-lg" />
            <span>Settings</span>
          </Link>

          <Link
            to="/help"
            onClick={() => setShowDropdown(false)}
            className="flex items-center gap-3 px-5 py-3 text-sm hover:bg-white/10 transition-all"
          >
            <FaLifeRing className="text-lg" />
            <span>Help Center</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full text-left flex items-center gap-3 px-5 py-3 text-sm hover:bg-white/10 transition-all text-red-300 hover:text-red-400"
          >
            <FaSignOutAlt className="text-lg" />
            <span>Log out</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
