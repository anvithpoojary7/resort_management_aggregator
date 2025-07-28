// client/src/pages/WishlistPage.jsx
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ResortCard from '../components/ResortCard';
import MagicLoader from '../pages/MagicLoader';

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://resort-finder-2aqp.onrender.com'
  : 'http://localhost:8080';

const WishlistPage = () => {
  const [wishlistResorts, setWishlistResorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingWishlistToggle, setLoadingWishlistToggle] = useState(false);

  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const fetchWishlist = useCallback(async () => {
    if (!isLoggedIn) {
      setWishlistResorts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // CORRECTED: Added backticks for the template literal string
      const response = await axios.get(`${API_BASE_URL}/api/wishlist`, {
        withCredentials: true,
      });

      setWishlistResorts(response.data);
    } catch (err) {
      console.error('Error fetching wishlist:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Failed to fetch wishlist.');
      setWishlistResorts([]);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleToggleWishlist = async (resortId) => {
    if (!isLoggedIn) {
      alert('Please log in to manage your wishlist!');
      navigate('/login');
      return;
    }

    setLoadingWishlistToggle(true);

    try {
      // CORRECTED: Added backticks for the template literal string
      await axios.delete(`${API_BASE_URL}/api/wishlist/${resortId}`, { withCredentials: true });
      setWishlistResorts((prev) => prev.filter((resort) => resort._id !== resortId));
    } catch (err) {
      console.error('Error removing resort from wishlist:', err.response?.data?.message || err.message);
      alert('Failed to remove from wishlist. Please try again.');
    } finally {
      setLoadingWishlistToggle(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <MagicLoader size={250} particleCount={2} speed={1.2} />
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-8 text-red-600">Error: {error}</div>;
  }

  if (!isLoggedIn) {
    return (
      <div className="text-center p-8 min-h-screen flex flex-col justify-center items-center">
        <p className="text-xl font-semibold text-gray-700 mb-4">Please log in to view your wishlist.</p>
        <button
          onClick={() => navigate('/login')}
          className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700 transition"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 py-10 min-h-screen">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800">My Wishlist</h1>
      {wishlistResorts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600 mb-4">Your wishlist is empty.</p>
          <p className="text-lg text-gray-500">Start adding some amazing resorts you'd love to visit!</p>
          <button
            onClick={() => navigate('/resorts')}
            className="mt-6 bg-yellow-600 text-white px-6 py-3 rounded-full font-bold hover:bg-yellow-700 transition"
          >
            Explore Resorts
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistResorts.map((resort) => (
            <ResortCard
              key={resort._id}
              resort={resort}
              isWishlisted={true}
              onToggleWishlist={handleToggleWishlist}
              isLoadingToggle={loadingWishlistToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;