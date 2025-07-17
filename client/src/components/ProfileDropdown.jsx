// src/components/ProfileDropdown.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaUserCog,
  FaLifeRing,
  FaSignOutAlt,
  FaRegUserCircle,
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import ProfileSettings from './ProfileSettings'; // adjust the path if needed

const ProfileDropdown = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const { isLoggedIn, user, logout } = useAuth();

  /* --- close the dropdown when clicking outside it --- */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* --- sign‑out handler --- */
  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  /* ----------- RENDER ----------- */

  /* not logged in → simple “Sign in” link */
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

  /* logged in → avatar button + dropdown + settings modal */
  return (
    <>
      {/* avatar / profile button */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown((prev) => !prev)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-black bg-white shadow-md hover:bg-gray-100 transition-all"
        >
          <FaRegUserCircle className="text-black text-2xl" />
          <span className="text-sm font-medium text-black">My Profile</span>
        </button>

        {/* dropdown menu */}
        {showDropdown && (
          <div className="absolute right-0 mt-3 w-72 bg-black/80 backdrop-blur-md text-white rounded-xl shadow-2xl py-3 z-50">
            {/* user header */}
            <div className="px-5 py-3 text-sm text-gray-300 border-b border-gray-600">
              <div className="font-semibold text-base mb-1">
                {user?.name || 'Welcome!'}
              </div>
              <div className="text-xs opacity-80">
                {user?.email || 'user@example.com'}
              </div>
            </div>

            {/* Settings → open modal, no route change */}
            <button
              onClick={() => {
                setShowProfileSettings(true);
                setShowDropdown(false);
              }}
              className="w-full text-left flex items-center gap-3 px-5 py-3 text-sm hover:bg-white/10 transition-all"
            >
              <FaUserCog className="text-lg" />
              <span>Settings</span>
            </button>

            {/* Help Center → still a link */}
            <Link
              to="/help"
              onClick={() => setShowDropdown(false)}
              className="flex items-center gap-3 px-5 py-3 text-sm hover:bg-white/10 transition-all"
            >
              <FaLifeRing className="text-lg" />
              <span>Help Center</span>
            </Link>

            {/* Log out */}
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

      {/* profile settings modal */}
      {showProfileSettings && (
        <ProfileSettings onClose={() => setShowProfileSettings(false)} />
      )}
    </>
  );
};

export default ProfileDropdown;
