// client/src/context/NotificationContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  // Fetch notifications for logged-in user
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    axios
      .get("/api/notifications", { withCredentials: true })
      .then((res) => setNotifications(res.data))
      .catch((err) => console.error("Error fetching notifications", err));
  }, [user]);

  // Mark all as read
const markAllAsRead = () => {
  // Update UI immediately
  setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

  // Try backend, but don't block UI
  axios
    .patch("/api/notifications/mark-all-read", {}, { withCredentials: true })
    .catch((err) => console.error("Error marking as read", err));
};

// Clear all notifications
const clearAllNotifications = () => {
  // Update UI immediately
  setNotifications([]);

  // Try backend, but don't block UI
  axios
    .delete("/api/notifications/clear-all", { withCredentials: true })
    .catch((err) => console.error("Error clearing notifications", err));
};

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        markAllAsRead,
        clearAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
