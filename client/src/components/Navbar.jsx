import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userData = localStorage.getItem('user');
    if (loggedIn && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hideNavbarRoutes = [
    '/admin/dashboard',
    '/owner/dashboard',
    '/admin/resorts',
    '/admin/users',
    '/admin/analytics',
  ];

  const shouldShowNav = !hideNavbarRoutes.some((path) =>
    location.pathname.startsWith(path)
  );

  if (!shouldShowNav) return null;

  return (
    <nav className="w-full bg-white px-6 py-4 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center relative">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-black">
          <span className="text-xl">⚡</span>
          ResortFinder
        </Link>

        {/* Nav Links with Dropdown */}
        <div
          className="flex items-center border border-gray-400 rounded-full px-5 py-3 space-x-8 text-base font-medium relative bg-white"
          ref={dropdownRef}
        >
          {/* Dropdown button */}
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1 hover:text-black focus:outline-none"
          >
            Getting started
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${
                dropdownOpen ? 'rotate-180' : ''
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {/* Dropdown content */}
          {dropdownOpen && (
            <div className="absolute top-14 left-0 w-56 z-50 rounded-xl bg-white/10 backdrop-blur-md shadow-lg p-4">
              <Link to="/getting-started/overview" className="block px-3 py-2 text-base text-black font-medium hover:bg-white/20 rounded-md transition">
                Overview
              </Link>
              <Link to="/getting-started/tutorial" className="block px-3 py-2 text-base text-black font-medium hover:bg-white/20 rounded-md transition">
                Tutorial
              </Link>
              <Link to="/getting-started/pricing" className="block px-3 py-2 text-base text-black font-medium hover:bg-white/20 rounded-md transition">
                Pricing
              </Link>
            </div>
          )}

          <Link to="/components" className="hover:text-black">
            Components
          </Link>
          <Link to="/docs" className="hover:text-black">
            Documentation
          </Link>
        </div>

        {/* Right Side (User or Sign In + Get Started) */}
        <div className="flex items-center gap-4">
          {isLoggedIn && user ? (
            <>
              <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 12c2.28 0 4-1.72 4-4s-1.72-4-4-4-4 1.72-4 4 1.72 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                  />
                </svg>
              </div>
              <Link
                to="/dashboard"
                className="text-white font-semibold px-6 py-2 rounded-2xl text-sm shadow-md bg-gradient-to-b from-[#1a1a1a] to-[#2d2d2d] transition-all"
              >
                Get started
              </Link>
            </>
          ) : (
            <>
              <Link to="/auth" className="text-black text-base font-medium">
                Sign in
              </Link>
              <Link
                to="/auth?role=owner"
                className="text-white font-semibold px-6 py-2 rounded-2xl text-sm shadow-md bg-gradient-to-b from-[#1a1a1a] to-[#2d2d2d] hover:from-[#111] hover:to-[#222] transition-all"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
