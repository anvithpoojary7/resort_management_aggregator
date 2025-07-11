// components/SidePanel.jsx
import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaHeart, FaSuitcase, FaComment, FaUser, FaBell,
  FaCog, FaQuestionCircle, FaSignOutAlt,
} from 'react-icons/fa';

const SidePanel = ({ isOpen, setIsOpen, isLoggedIn, user }) => {
  const panelRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleLogout = () => {
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('user');
    setIsOpen(false);
    navigate('/');
  };

  return (
    <div
      ref={panelRef}
      className={`fixed top-0 right-0 h-full w-72 bg-white shadow-lg p-6 z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <button
        onClick={() => setIsOpen(false)}
        className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-xl"
      >
        &times;
      </button>

      {isLoggedIn ? (
        <ul className="mt-12 space-y-4 text-gray-800">
          <li><Link to="/wishlists" onClick={() => setIsOpen(false)} className="flex items-center hover:bg-gray-100 p-2 rounded"><FaHeart className="mr-3" />Wishlists</Link></li>
          <li><Link to="/resorts" onClick={() => setIsOpen(false)} className="flex items-center hover:bg-gray-100 p-2 rounded"><FaSuitcase className="mr-3" />Trips</Link></li>
          <li><Link to="/contact" onClick={() => setIsOpen(false)} className="flex items-center hover:bg-gray-100 p-2 rounded"><FaComment className="mr-3" />Messages</Link></li>
          <li><Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center hover:bg-gray-100 p-2 rounded"><FaUser className="mr-3" />Profile</Link></li>
          <li className="border-t pt-4 mt-4"><Link to="/notifications" onClick={() => setIsOpen(false)} className="flex items-center justify-between hover:bg-gray-100 p-2 rounded"><span className="flex items-center"><FaBell className="mr-3" />Notifications</span><span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">1</span></Link></li>
          <li><Link to="/settings" onClick={() => setIsOpen(false)} className="flex items-center hover:bg-gray-100 p-2 rounded"><FaCog className="mr-3" />Account settings</Link></li>
          <li><Link to="/help" onClick={() => setIsOpen(false)} className="flex items-center hover:bg-gray-100 p-2 rounded"><FaQuestionCircle className="mr-3" />Help Centre</Link></li>
          <li className="border-t pt-4 mt-4"><button onClick={handleLogout} className="flex items-center text-red-600 hover:underline hover:bg-gray-100 p-2 rounded w-full text-left"><FaSignOutAlt className="mr-3" />Logout</button></li>
          <li className="border-t pt-4 mt-4"><Link to="/become-a-host" onClick={() => setIsOpen(false)} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"><div><div className="font-semibold">Become a host</div><div className="text-sm text-gray-600">It's easy to start hosting and earn extra income.</div></div><img src="/images/house-icon.png" alt="House" className="w-12 h-12 ml-4" /></Link></li>
        </ul>
      ) : (
        <div className="mt-12 space-y-4 text-gray-800">
          <h3 className="font-bold text-lg mb-4">Welcome to ResortFinder</h3>
          <div className="border-b pb-4 mb-4">
            <Link to="/help" onClick={() => setIsOpen(false)} className="flex items-center hover:bg-gray-100 p-2 rounded"><FaQuestionCircle className="mr-2" />Help Centre</Link>
          </div>
          <Link to="/auth?role=owner" onClick={() => setIsOpen(false)} className="flex items-center justify-between border rounded-lg p-3 hover:bg-gray-50"><div><div className="font-semibold">Become a host</div><div className="text-sm text-gray-600">It's easy to start hosting and earn extra income.</div></div><img src="/images/house-icon.png" alt="House" className="w-12 h-12 ml-4" /></Link>
          <Link to="/refer-a-host" className="block mt-4 hover:bg-gray-100 p-2 rounded" onClick={() => setIsOpen(false)}>Refer a host</Link>
          <Link to="/find-a-co-host" className="block hover:bg-gray-100 p-2 rounded" onClick={() => setIsOpen(false)}>Find a co-host</Link>
          <Link to="/aboutus" className="block mt-4 hover:bg-gray-100 p-2 rounded" onClick={() => setIsOpen(false)}>About ResortFinder</Link>
          <div className="border-t pt-4 mt-4">
            <Link to="/auth" className="block hover:bg-gray-100 p-2 rounded font-semibold" onClick={() => setIsOpen(false)}>Log in or sign up</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default SidePanel;

