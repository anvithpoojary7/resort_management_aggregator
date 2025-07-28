// src/context/NotificationContext.jsx
import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

const sampleNotifications = [
  {
    id: 1,
    message: 'Your resort booking has been confirmed!',
    timestamp: '2 hours ago',
    read: false,
  },
  {
    id: 2,
    message: 'New resort added near your location.',
    timestamp: '1 day ago',
    read: false,
  },
  {
    id: 3,
    message: 'You have a 10% discount coupon waiting!',
    timestamp: '3 days ago',
    read: true,
  },
];

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(sampleNotifications);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        markAllAsRead,
        clearAllNotifications, // ✅ added here
        unreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
