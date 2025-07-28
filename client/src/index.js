import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext'; // ⬅️ Add this line

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <NotificationProvider> {/* ⬅️ Wrap App with it */}
        <App />
      </NotificationProvider>
    </AuthProvider>
  </React.StrictMode>
);
