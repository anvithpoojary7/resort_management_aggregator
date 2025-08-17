import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRoutes from './routes/AppRoutes';
import { useAuth } from './context/AuthContext';

function App() {
  const { user } = useAuth();

  // ✅ prevent crash during first render (user = null right after login)
  if (!user) {
    return null;  // or <div>Loading...</div>
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow">
          <AppRoutes />
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
