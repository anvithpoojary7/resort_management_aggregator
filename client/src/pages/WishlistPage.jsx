// client/src/pages/WishlistPage.jsx
import React, { useEffect, useState } from 'react';

const WishlistPage = () => {
  const [wishlistResorts, setWishlistResorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await fetch('/api/wishlist', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch wishlist');
        }

        const data = await response.json();
        setWishlistResorts(data);
      } catch (err) {
        console.error('Error fetching wishlist:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  if (loading) {
    return <div className="text-center p-8">Loading wishlist...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">My Wishlist</h1>
      {wishlistResorts.length === 0 ? (
        <p className="text-center text-gray-600">Your wishlist is empty. Start adding some resorts!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistResorts.map((resort) => (
            <div key={resort._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={`/api/resorts/image/${resort.image}`}
                alt={resort.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{resort.name}</h2>
                <p className="text-gray-600 mb-1">{resort.location}</p>
                <p className="text-lg font-bold text-blue-600">${resort.price}/night</p>
                {/* Add more resort details if needed */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;