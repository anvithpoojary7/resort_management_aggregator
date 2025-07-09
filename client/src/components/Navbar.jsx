import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import SidePanel from './SidePanel';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

 
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userData = localStorage.getItem('user');

    if (loggedIn && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const userRole = user?.role;

  
  const hideNavbarRoutes = [
    '/admin/dashboard',
    '/owner/dashboard',
    '/admin/resorts',
    '/admin/users',
    '/admin/analytics',
  ];

  const shouldShowNav =
    !hideNavbarRoutes.some((path) => location.pathname.startsWith(path));

  return (
    shouldShowNav && (
      <nav className="sticky top-0 w-full bg-white shadow p-4 z-50">
        <Header
          onMenuClick={() => setMenuOpen(true)}
          isLoggedIn={isLoggedIn}
          user={user}
        />
        <SidePanel
          isOpen={menuOpen}
          setIsOpen={setMenuOpen}
          isLoggedIn={isLoggedIn}
          user={user}
        />
      </nav>
    )
  );
};

export default Navbar;
