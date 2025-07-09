import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WishlistPage from './pages/WishlistPage';
import AppRoutes from './routes/AppRoutes'; // Make sure path is correct

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />

        <div className="flex-grow">
          <AppRoutes /> {/* 👈 Using central routing here */}
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;




