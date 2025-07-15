// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaUser } from 'react-icons/fa';
import SidePanel from './SidePanel';   // ← adjust path if needed

const Navbar = () => {
  /* ───────────────────── state & auth check ───────────────────── */
  const [menuOpen,   setMenuOpen] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [user,       setUser]     = useState(null);
  const location = useLocation();

  useEffect(() => {
  const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userData = localStorage.getItem('user');

  if (loggedIn && userData) {
    setLoggedIn(true);
    setUser(JSON.parse(userData));
  } else {
    setLoggedIn(false);
    setUser(null);
  }
}, [location.pathname]); // 👈 important: re-run on route change


  /* ─────────── hide navbar on admin / owner screens ─────────── */
  const hideNavbarRoutes = [
    '/admin/dashboard',
    '/owner/dashboard',
    '/admin/resorts',
    '/admin/users',
    '/admin/analytics',
  ];
  if (hideNavbarRoutes.some((p) => location.pathname.startsWith(p))) return null;

  /* ─────────────────────────── render ────────────────────────── */
  return (
    <nav className="w-full bg-white px-6 py-4 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* ── logo ─────────────────────────────────────────────── */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-black">
          <span className="text-xl">⚡</span> ResortFinder
        </Link>

        {/* ── middle pill ─────────────────────────────────────── */}
        <div className="flex items-center border border-gray-400 rounded-full px-6 py-2 space-x-8 bg-white shadow-sm text-base font-medium">
          <Link to="/about"        className="hover:text-black">About ResortFinder</Link>
          <Link to="/help"  className="hover:text-black">Help Center</Link>
          <Link to="/contact"   className="hover:text-black">Contact Us</Link>
        </div>

        {/* ── right‑hand buttons ──────────────────────────────── */}
        <div className="flex items-center gap-4">
          {/* ① person pill (Sign in / My profile) */}
          <Link
            to={isLoggedIn ? '/profile' : '/auth'}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-black bg-white shadow-sm hover:bg-gray-50 transition-all"
          >
            <FaUser className="text-black text-lg" />
            <span className="text-sm font-medium text-black">
              {isLoggedIn ? 'My profile' : 'Sign in'}
            </span>
          </Link>

          {/* ② menu pill (icon + text) */}
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-b from-[#1a1a1a] to-[#2d2d2d] shadow-md hover:from-[#111] hover:to-[#222] transition-all"
          >
            <FaBars className="text-white text-lg" />
            <span className="text-sm font-medium text-white">Menu</span>
          </button>
        </div>
      </div>

      {/* ── slide‑out panel ──────────────────────────────────── */}
      <SidePanel
        isOpen={menuOpen}
        setIsOpen={setMenuOpen}
        isLoggedIn={isLoggedIn}
        user={user}
      />
    </nav>
  );
};

export default Navbar;
