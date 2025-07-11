// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Tailwind styles
import { AuthProvider } from './context/AuthContext';

// Create the root
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app wrapped with AuthProvider
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
