
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  FaHeart,
  FaSuitcase,
  FaBell,
  FaTimes,
} from 'react-icons/fa';
import { BellIcon } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

const SidePanel = ({ isOpen, setIsOpen, buttonRef }) => {
  const { notifications } = useNotifications();
  const unreadCount = Array.isArray(notifications) ? notifications.filter(n => !n.read).length : 0;
  const panelRef = useRef();

  /* ─── close when clicking outside ─── */
  useEffect(() => {
    const handleOutside = (e) => {
      if (
        isOpen &&
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        !(buttonRef?.current && buttonRef.current.contains(e.target))
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [isOpen, setIsOpen, buttonRef]);

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      className="absolute z-50 right-4 top-16 w-72
                 bg-black bg-opacity-70 text-white
                 backdrop-blur-md rounded-lg shadow-xl
                 p-4 max-h-96 overflow-y-auto animate-fadeIn"
    >
      {/* Close button */}
      <button
        onClick={() => setIsOpen(false)}
        className="absolute top-2 right-2 text-white/80 hover:text-red-400 text-sm"
        aria-label="Close"
      >
        <FaTimes />
      </button>

      <ul className="space-y-4 pt-4">
        {/* Wishlists */}
        <li>
          <Link
            to="/wishlists"
            onClick={() => setIsOpen(false)}
            className="flex items-center hover:bg-white/10 p-2 rounded"
          >
            <FaHeart className="mr-3 text-white" />
            Wishlists
          </Link>
        </li>

        {/* Trips */}
        <li>
          <Link
            to="/resorts"
            onClick={() => setIsOpen(false)}
            className="flex items-center hover:bg-white/10 p-2 rounded"
          >
            <FaSuitcase className="mr-3 text-white" />
            Trips
          </Link>
        </li>

        {/* Notifications */}
        <li className="border-t border-white/20 pt-4 mt-4">
          <Link
            to="/notifications"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-between hover:bg-white/10 p-2 rounded relative"
          >
            <span className="flex items-center relative">
              <FaBell className="mr-3 text-white" />
              Notifications

              {unreadCount > 0 && (
                <span className="ml-2 bg-red-600 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SidePanel;
