import React, { useState } from 'react';
import Header from './Header';
import SidePanel from './SidePanel';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const user = isLoggedIn ? JSON.parse(localStorage.getItem('user')) : null;

  const userRole = user?.role;
  const shouldShowNav = userRole !== 'owner' && userRole !== 'admin';

  return (
    <nav className="sticky top-0 w-full bg-white shadow p-4 z-50">
      {/* Show Header and SidePanel only if user is NOT owner or admin */}
      {shouldShowNav && (
        <>
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
        </>
      )}
    </nav>
  );
};

export default Navbar;
