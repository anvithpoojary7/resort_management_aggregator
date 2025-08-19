// src/components/Navbar.jsx
import React, { useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import SidePanel from './SidePanel';
import ProfileDropdown from './ProfileDropdown';
import { useAuth } from '../context/AuthContext'; // ✅ using global auth state

const Navbar = () => {
  const location = useLocation();
  const menuButtonRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const { isLoggedIn } = useAuth(); // ✅ global login status

  // Hide navbar on admin/owner pages
  const hideNavbarRoutes = [
    '/admin/dashboard',
    '/owner/dashboard',
    '/admin/resorts',
    '/admin/users',
    '/admin/analytics',
  ];
  if (hideNavbarRoutes.some((p) => location.pathname.startsWith(p))) return null;

  return (
    <nav className="w-full bg-white px-6 py-4 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-black">
          <span className="text-xl">⚡</span> ResortFinder
        </Link>

        {/* Center nav links */}
        <div className="hidden md:flex items-center border border-gray-400 rounded-full px-6 py-2 space-x-8 bg-white shadow-sm text-base font-medium">
          <Link to="/about" className="hover:text-black">About ResortFinder</Link>
          <Link to="/help" className="hover:text-black">Help Center</Link>
          <Link to="/contact" className="hover:text-black">Contact Us</Link>
        </div>

        {/* Right side buttons */}
        <div className="flex items-center gap-4">
          <ProfileDropdown className="mr-4" /> {/* ✅ handles sign-in & profile dropdown */}

          <button
            ref={menuButtonRef}
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-b from-[#1a1a1a] to-[#2d2d2d] shadow-md hover:from-[#111] hover:to-[#222] transition-all"
          >
            <FaBars className="text-white text-lg" />
            <span className="text-sm font-medium text-white">Menu</span>
          </button>
        </div>
      </div>

      {/* Right dropdown panel */}
      <SidePanel isOpen={menuOpen} setIsOpen={setMenuOpen} buttonRef={menuButtonRef} />
    </nav>
  );
};

export default Navbar;