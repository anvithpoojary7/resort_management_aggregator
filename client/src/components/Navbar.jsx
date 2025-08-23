// src/components/Navbar.jsx
import React, { useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import SidePanel from './SidePanel';
import ProfileDropdown from './ProfileDropdown';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const menuButtonRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const { isLoggedIn } = useAuth();

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
    <nav className="w-full bg-white px-2 sm:px-6 py-1 sm:py-2 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center gap-1 sm:gap-2">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1 font-bold text-xs sm:text-lg text-black shrink-0">
          <span className="text-base sm:text-2xl">⚡</span> 
          <span className="text-xs sm:text-xl">ResortFinder</span>
        </Link>

        {/* Center nav links (shiny oval) */}
        <div className="relative flex items-center rounded-full px-3 sm:px-6 py-1.5 sm:py-2 
          space-x-3 sm:space-x-6 bg-gradient-to-r from-[#fdfbfb] to-[#ebedee] shadow-md 
          border border-gray-200 overflow-hidden text-[11px] sm:text-sm font-medium shrink-0">

          {/* Shine sweep overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/5 to-transparent 
            animate-[shine_3s_linear_infinite] pointer-events-none" />

          <Link to="/about" className="relative z-10 hover:text-black transition-colors duration-300">About</Link>
          <Link to="/help" className="relative z-10 hover:text-black transition-colors duration-300">Help</Link>
          <Link to="/contact" className="relative z-10 hover:text-black transition-colors duration-300">Contact</Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1 sm:gap-3 shrink-0">
          {/* ProfileDropdown */}
          <div className="scale-75 sm:scale-100">
            <ProfileDropdown />
          </div>

          {/* Menu button */}
          <button
            ref={menuButtonRef}
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="flex items-center justify-center px-2 sm:px-3 py-1 sm:py-2 rounded-full 
            bg-gradient-to-b from-[#1a1a1a] to-[#2d2d2d] shadow-md hover:from-[#111] hover:to-[#222] 
            transition-all scale-75 sm:scale-100"
          >
            <FaBars className="text-white text-sm sm:text-lg" />
          </button>
        </div>
      </div>

      {/* Side Panel */}
      <SidePanel isOpen={menuOpen} setIsOpen={setMenuOpen} buttonRef={menuButtonRef} />
    </nav>
  );
};

export default Navbar;
