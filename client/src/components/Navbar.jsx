import React, { useState } from 'react';
import Header from './Header';
import SidePanel from './SidePanel';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const user = isLoggedIn ? JSON.parse(localStorage.getItem('user')) : null;

  const isOwner = user?.role === 'owner';

  return (
    <nav className="sticky top-0 w-full bg-white shadow p-4 z-50">
      {/* Show Header only if not owner */}
      {!isOwner && (
        <Header
          onMenuClick={() => setMenuOpen(true)}
          isLoggedIn={isLoggedIn}
          user={user}
        />
      )}

      {/* Show SidePanel only if not owner */}
      {!isOwner && (
        <SidePanel
          isOpen={menuOpen}
          setIsOpen={setMenuOpen}
          isLoggedIn={isLoggedIn}
          user={user}
        />
      )}
    </nav>
  );
};

export default Navbar;

